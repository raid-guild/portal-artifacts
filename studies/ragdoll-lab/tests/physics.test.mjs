import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSimulation as createRawSimulation, validateProfile, TimeStepFrictionSolver } from '../dist/physics.js';
import * as CANNON from '../dist/vendor/cannon-es.js';
import * as THREE from '../dist/vendor/three.module.js';
import { interpolateBodyQuaternion } from '../dist/renderMath.js';
import { createSkinnedRagdoll } from '../dist/skinnedRagdoll.js';
import { clone as cloneSkeleton } from '../dist/vendor/SkeletonUtils.js';

function createSimulation(profile = null) { const simulation = createRawSimulation(profile); simulation.configure({ autoGetUp: false }); return simulation; }

const goatProfile = JSON.parse(readFileSync(new URL('../dist/assets/goatman-ragdoll.json', import.meta.url), 'utf8'));

function runSeconds(simulation, seconds) {
  simulation.setPaused(false);
  for (let i = 0; i < seconds * 120; i++) simulation.step(1 / 120);
}

function runUntilSleep(simulation, maxSeconds = 45) {
  simulation.setPaused(false);
  for (let i = 0; i < maxSeconds * 120; i++) {
    simulation.step(1 / 120);
    if (simulation.bodies.every(body => body.sleepState === CANNON.Body.SLEEPING)) return (i + 1) / 120;
  }
  return null;
}

for (const scene of ['drop', 'stairs']) {
  test(`${scene} remains connected and finite through a 20-second fall`, () => {
    const simulation = createSimulation();
    simulation.reset(scene);
    assert.equal(simulation.bodies.length, 13);
    assert.equal(simulation.joints.length, 12);
    runSeconds(simulation, 20);
    assert.ok(Math.abs(simulation.snapshot().time - 20) < .01);
    for (const body of simulation.bodies) {
      for (const coordinate of [body.position.x, body.position.y, body.position.z, body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w]) {
        assert.ok(Number.isFinite(coordinate), `${body.idTag} has non-finite state`);
      }
      assert.ok(body.position.y > -.35 && body.position.y < 5, `${body.idTag} escaped the environment`);
    }
    for (const joint of simulation.joints) {
      const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
      const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
      assert.ok(a.distanceTo(b) < .2, `joint ${joint.bodyA.idTag} to ${joint.bodyB.idTag} separated`);
    }
    if (scene === 'stairs') {
      assert.ok(simulation.bodies.find(body => body.idTag === 'pelvis').position.x > -.7, 'stairs prompt forward motion');
    }
  });
}

test('repeated resets leave a clean world with no accumulated constraints', () => {
  const simulation = createSimulation();
  for (let i = 0; i < 10; i++) {
    simulation.reset(i % 2 ? 'drop' : 'stairs');
    assert.equal(simulation.world.constraints.length, 12);
    assert.equal(simulation.world.bodies.length, i % 2 ? 14 : 19);
    assert.equal(simulation.snapshot().time, 0);
    assert.equal(simulation.snapshot().paused, true);
    runSeconds(simulation, .25);
  }
});

test('pause, speed and material controls affect the engine state', () => {
  const simulation = createSimulation();
  simulation.configure({ damping: .35, friction: .9, jointRange: 50, speed: .25 });
  assert.equal(simulation.bodies[0].linearDamping, .35);
  assert.equal(simulation.joints[0].angle, simulation.joints[0].baseAngle * .5);
  assert.equal(simulation.snapshot().settings.friction, .9);
  assert.equal(simulation.step(1), 0, 'paused simulation does not advance');
  simulation.setPaused(false);
  for (let i = 0; i < 120; i++) simulation.step(1 / 120);
  assert.ok(Math.abs(simulation.snapshot().time - .25) < .01);
  simulation.setPaused(true);
  const pausedAt = simulation.snapshot().time;
  simulation.step(1);
  assert.equal(simulation.snapshot().time, pausedAt);
  assert.throws(() => simulation.configure({ jointRange: 200 }), RangeError);
  assert.throws(() => simulation.configure({ speed: 2 }), RangeError);
});

test('stair launch has bounded rotation and happens only once before the first tick', () => {
  const simulation = createSimulation();
  simulation.reset('stairs');
  const chest = simulation.bodies.find(body => body.idTag === 'chest');
  simulation.setPaused(false);
  const firstVelocity = chest.velocity.x;
  const firstRotation = chest.angularVelocity.length();
  assert.ok(firstVelocity > 0 && firstVelocity < 2);
  assert.ok(firstRotation > 0 && firstRotation < 5);
  simulation.setPaused(true);
  simulation.setPaused(false);
  assert.equal(chest.velocity.x, firstVelocity);
  assert.equal(chest.angularVelocity.length(), firstRotation);
  simulation.reset('stairs');
  const newChest = simulation.bodies.find(body => body.idTag === 'chest');
  simulation.setPaused(false);
  assert.equal(newChest.velocity.x, firstVelocity, 'reset restores one launch');
});

test('ending or resetting a drag removes its transient body and constraint', () => {
  const simulation = createSimulation();
  const count = simulation.world.bodies.length;
  const body = simulation.bodies[0];
  assert.equal(simulation.beginDrag(body, body.position.toArray()), true);
  assert.equal(simulation.world.bodies.length, count + 1);
  assert.equal(simulation.world.constraints.length, 13);
  simulation.moveDrag([1, 2, 3]);
  simulation.endDrag();
  assert.equal(simulation.world.bodies.length, count);
  assert.equal(simulation.world.constraints.length, 12);
  simulation.beginDrag(body, body.position.toArray());
  simulation.reset();
  assert.equal(simulation.world.bodies.length, count);
  assert.equal(simulation.world.constraints.length, 12);
  assert.equal(simulation.snapshot().dragging, false);
});

test('Cannon poses interpolate into finite Three.js rotations at 0, half and 1', () => {
  const previous = { x: 0, y: 0, z: 0, w: 1 };
  const current = { x: 0, y: 0, z: Math.SQRT1_2, w: Math.SQRT1_2 };
  const output = new THREE.Quaternion();
  const scratchA = new THREE.Quaternion();
  const scratchB = new THREE.Quaternion();
  for (const [alpha, expectedX, expectedY] of [[0, 1, 0], [.5, Math.SQRT1_2, Math.SQRT1_2], [1, 0, 1]]) {
    interpolateBodyQuaternion(previous, current, alpha, output, scratchA, scratchB);
    for (const value of [output.x, output.y, output.z, output.w]) assert.ok(Number.isFinite(value));
    const rotated = new THREE.Vector3(1, 0, 0).applyQuaternion(output);
    assert.ok(Math.abs(rotated.x - expectedX) < 1e-6);
    assert.ok(Math.abs(rotated.y - expectedY) < 1e-6);
  }
  const simulation = createSimulation();
  simulation.reset('stairs');
  for (const body of simulation.bodies) {
    assert.deepEqual(
      [body.previousQuaternion.x, body.previousQuaternion.y, body.previousQuaternion.z, body.previousQuaternion.w],
      [body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w],
      `${body.idTag} reset pose must not interpolate from before tilt`
    );
  }
});

test('all initial cone and twist frames align in both scenes', () => {
  for (const scene of ['drop', 'stairs']) {
    const simulation = createSimulation();
    simulation.reset(scene);
    for (const joint of simulation.joints) {
      joint.update();
      assert.ok(joint.coneEquation.axisA.dot(joint.coneEquation.axisB) > .999999, `${scene}: cone axis ${joint.bodyA.idTag}–${joint.bodyB.idTag}`);
      assert.ok(joint.twistEquation.axisA.dot(joint.twistEquation.axisB) > .999999, `${scene}: twist axis ${joint.bodyA.idTag}–${joint.bodyB.idTag}`);
    }
  }
});

test('an untouched pose remains motionless without gravity', () => {
  const simulation = createSimulation();
  simulation.world.gravity.set(0, 0, 0);
  runSeconds(simulation, 3);
  for (const body of simulation.bodies) {
    assert.ok(body.velocity.length() < .001, `${body.idTag} gained linear velocity`);
    assert.ok(body.angularVelocity.length() < .001, `${body.idTag} gained angular velocity`);
  }
});

for (const scene of ['drop', 'stairs']) {
  test(`${scene} naturally sleeps and remains still`, () => {
    const simulation = createSimulation();
    simulation.reset(scene);
    const sleptAt = runUntilSleep(simulation);
    assert.ok(sleptAt !== null, `${scene} did not fully sleep within 45 seconds`);
    const pose = simulation.bodies.map(body => [body.position.clone(), body.quaternion.clone()]);
    runSeconds(simulation, 3);
    assert.ok(simulation.bodies.every(body => body.sleepState === CANNON.Body.SLEEPING));
    simulation.bodies.forEach((body, index) => {
      assert.equal(body.position.distanceTo(pose[index][0]), 0, `${body.idTag} drifted after sleep`);
      assert.equal(body.quaternion.x, pose[index][1].x);
      assert.equal(body.quaternion.y, pose[index][1].y);
      assert.equal(body.quaternion.z, pose[index][1].z);
      assert.equal(body.quaternion.w, pose[index][1].w);
    });
  });
}

for (const scene of ['drop', 'stairs']) {
  for (const range of [25, 125]) {
    test(`${scene} with ${range}% joint range settles`, () => {
      const simulation = createSimulation();
      simulation.reset(scene);
      simulation.configure({ jointRange: range });
      assert.ok(runUntilSleep(simulation) !== null, `${scene} at ${range}% did not sleep within 45 seconds`);
    });
  }
}

test('dragging a sleeping forearm wakes the ragdoll and it re-settles', () => {
  const simulation = createSimulation();
  assert.ok(runUntilSleep(simulation) !== null);
  const forearm = simulation.bodies.find(body => body.idTag === 'left-forearm');
  const start = forearm.position.clone();
  assert.equal(simulation.beginDrag(forearm, start.toArray()), true);
  assert.ok(simulation.bodies.every(body => body.sleepState === CANNON.Body.AWAKE));
  simulation.moveDrag([start.x + .7, start.y + .7, start.z]);
  runSeconds(simulation, 1);
  assert.ok(forearm.position.distanceTo(start) > .2, 'drag should move the selected limb');
  simulation.endDrag();
  assert.ok(runUntilSleep(simulation) !== null, 'ragdoll should settle after release');
});

test('changing physical settings wakes the whole sleeping ragdoll', () => {
  const simulation = createSimulation();
  assert.ok(runUntilSleep(simulation) !== null);
  simulation.configure({ friction: .8 });
  assert.ok(simulation.bodies.every(body => body.sleepState === CANNON.Body.AWAKE));
  assert.ok(runUntilSleep(simulation) !== null);
  simulation.configure({ damping: .2, jointRange: 75 });
  assert.ok(simulation.bodies.every(body => body.sleepState === CANNON.Body.AWAKE));
});

test('Goatman profile validates canonical bodies, joint tree and rig coordinates', () => {
  assert.equal(validateProfile(goatProfile).id, 'goatman');
  const invalid = structuredClone(goatProfile);
  invalid.bodies[0].bone = 'wrong-bone';
  assert.throws(() => validateProfile(invalid), RangeError);
  invalid.bodies[0].bone = 'pelvis';
  invalid.joints[0].tangent = [0, 1, 0];
  assert.throws(() => validateProfile(invalid), RangeError);
  invalid.joints[0].tangent = [0, 0, -1];
  invalid.bodies.pop();
  assert.throws(() => validateProfile(invalid), RangeError);
});

test('nonconnected Goatman colliders produce real contact equations', () => {
  const simulation = createSimulation(goatProfile);
  simulation.world.gravity.set(0, 0, 0);
  const head = simulation.bodies.find(body => body.idTag === 'head');
  const foot = simulation.bodies.find(body => body.idTag === 'left-foot');
  foot.position.copy(head.position);
  foot.quaternion.copy(head.quaternion);
  simulation.setPaused(false);
  simulation.step(1 / 120);
  assert.ok(simulation.world.contacts.some(contact =>
    (contact.bi === head && contact.bj === foot) || (contact.bi === foot && contact.bj === head)
  ));
});

for (const scene of ['drop', 'stairs']) {
  test(`Goatman ${scene} fall and subsequent limb drag settle with self-collision`, () => {
    const simulation = createSimulation(goatProfile);
    simulation.reset(scene);
    const connected = new Set(simulation.joints.map(joint => [joint.bodyA.idTag, joint.bodyB.idTag].sort().join('|')));
    const unrelatedA = simulation.bodies.find(body => body.idTag === 'head');
    const unrelatedB = simulation.bodies.find(body => body.idTag === 'left-foot');
    assert.equal(connected.has([unrelatedA.idTag, unrelatedB.idTag].sort().join('|')), false);
    assert.ok((unrelatedA.collisionFilterGroup & unrelatedB.collisionFilterMask) !== 0);
    assert.ok((unrelatedB.collisionFilterGroup & unrelatedA.collisionFilterMask) !== 0);
    assert.ok(simulation.joints.every(joint => joint.collideConnected === false));
    const sleptAt = runUntilSleep(simulation);
    assert.ok(sleptAt !== null, `Goatman ${scene} did not sleep within 45 seconds`);
    assert.deepEqual(simulation.snapshot().movingBodies, []);
    for (const body of simulation.bodies) {
      assert.ok(Number.isFinite(body.position.x) && Number.isFinite(body.position.y) && Number.isFinite(body.position.z));
      assert.ok(body.position.y > -.35 && body.position.y < 6, `${body.idTag} left the environment`);
    }
    for (const joint of simulation.joints) {
      const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
      const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
      assert.ok(a.distanceTo(b) < .2, `${joint.bodyA.idTag} to ${joint.bodyB.idTag} separated`);
    }
    const forearm = simulation.bodies.find(body => body.idTag === 'left-forearm');
    const start = forearm.position.clone();
    simulation.beginDrag(forearm, start.toArray());
    simulation.moveDrag([start.x + .7, start.y + .7, start.z]);
    runSeconds(simulation, 1);
    assert.ok(forearm.position.distanceTo(start) > .2);
    simulation.endDrag();
    assert.ok(runUntilSleep(simulation) !== null, `Goatman ${scene} did not re-settle after drag`);
    assert.deepEqual(simulation.snapshot().movingBodies, []);
  });
}

for (const id of ['head', 'left-forearm']) {
  test(`Goatman stairs re-settles after a vertical ${id} pull`, () => {
    const simulation = createSimulation(goatProfile);
    simulation.reset('stairs');
    assert.ok(runUntilSleep(simulation) !== null);
    const body = simulation.bodies.find(part => part.idTag === id);
    const start = body.position.clone();
    simulation.beginDrag(body, start.toArray());
    simulation.moveDrag([start.x, start.y + .7, start.z]);
    runSeconds(simulation, 1);
    simulation.endDrag();
    assert.ok(runUntilSleep(simulation, 60) !== null, `${id} pull left ${JSON.stringify(simulation.snapshot().movingBodies)} moving`);
  });
}

test('Goatman drag, reset and profile switches leave a clean paused world', () => {
  const simulation = createSimulation();
  simulation.setProfile(goatProfile);
  assert.equal(simulation.snapshot().profileId, 'goatman');
  const arm = simulation.bodies.find(body => body.idTag === 'left-forearm');
  simulation.beginDrag(arm, arm.position.toArray());
  assert.equal(simulation.snapshot().dragging, true);
  simulation.reset('stairs');
  assert.equal(simulation.snapshot().dragging, false);
  assert.equal(simulation.snapshot().paused, true);
  assert.equal(simulation.world.constraints.length, 12);
  simulation.setProfile(null);
  assert.equal(simulation.snapshot().profileId, 'mannequin');
  assert.equal(simulation.world.constraints.length, 12);
  simulation.setProfile(goatProfile);
  assert.equal(simulation.snapshot().profileId, 'goatman');
  assert.equal(simulation.world.bodies.length, 19);
});

test('skinned bone binding preserves rest pose and follows a rigid body transform', () => {
  const root = new THREE.Group();
  const parents = new Map(goatProfile.joints.map(joint => [joint.child, joint.parent]));
  const bones = new Map();
  const restPositions = new Map();
  for (const spec of goatProfile.bodies) {
    const bone = new THREE.Bone();
    bone.name = spec.bone;
    const parentName = parents.get(spec.id);
    const parent = parentName ? bones.get(parentName) : root;
    assert.ok(parent, `parent of ${spec.id} must precede child`);
    parent.add(bone);
    const rest = new THREE.Vector3(...spec.position).add(new THREE.Vector3(.025, .04, .03));
    bone.position.copy(rest);
    if (parentName) bone.position.sub(restPositions.get(parentName));
    restPositions.set(spec.id, rest);
    bones.set(spec.id, bone);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute([2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0], 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 4));
  const mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial());
  mesh.bind(new THREE.Skeleton([...bones.values()]));
  root.add(mesh);
  root.updateMatrixWorld(true);
  const restMatrices = new Map([...bones].map(([id, bone]) => [id, bone.matrixWorld.clone()]));
  const rig = createSkinnedRagdoll({ scene: root }, goatProfile);
  const cloneA = createSkinnedRagdoll({ scene: cloneSkeleton(root) }, goatProfile);
  const cloneB = createSkinnedRagdoll({ scene: cloneSkeleton(root) }, goatProfile);
  const bodies = goatProfile.bodies.map(spec => ({
    idTag: spec.id,
    position: new CANNON.Vec3(...spec.position),
    previousPosition: new CANNON.Vec3(...spec.position),
    quaternion: new CANNON.Quaternion(...spec.quaternion),
    previousQuaternion: new CANNON.Quaternion(...spec.quaternion)
  }));
  rig.pose(bodies, 1);
  cloneA.pose(bodies, 1);
  cloneB.pose(bodies, 1);
  const cloneBHeadRest = cloneB.entries.find(entry => entry.id === 'head').bone.matrixWorld.clone();
  for (const [id, bone] of bones) {
    for (let i = 0; i < 16; i++) assert.ok(Math.abs(bone.matrixWorld.elements[i] - restMatrices.get(id).elements[i]) < 1e-5, `${id} rest matrix ${i}`);
  }
  const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), .35);
  const translation = new THREE.Vector3(.5, .3, -.2);
  for (const body of bodies) {
    const nextPosition = new THREE.Vector3(body.position.x, body.position.y, body.position.z).applyQuaternion(turn).add(translation);
    const nextQuaternion = turn.clone().multiply(new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w));
    body.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
    body.quaternion.set(nextQuaternion.x, nextQuaternion.y, nextQuaternion.z, nextQuaternion.w);
  }
  rig.pose(bodies, 1);
  cloneA.pose(bodies, 1);
  const transform = new THREE.Matrix4().compose(translation, turn, new THREE.Vector3(1, 1, 1));
  for (const [id, bone] of bones) {
    const expected = transform.clone().multiply(restMatrices.get(id));
    for (let i = 0; i < 16; i++) assert.ok(Math.abs(bone.matrixWorld.elements[i] - expected.elements[i]) < 1e-5, `${id} moved matrix ${i}`);
  }
  const picked = rig.pickBody({ object: mesh, face: { a: 0, b: 1, c: 2 } }, new Map(bodies.map(body => [body.idTag, body])));
  assert.equal(picked.idTag, goatProfile.bodies[2].id);
  assert.notDeepEqual(cloneA.entries.find(entry => entry.id === 'head').bone.matrixWorld.elements, cloneBHeadRest.elements);
  assert.deepEqual(cloneB.entries.find(entry => entry.id === 'head').bone.matrixWorld.elements, cloneBHeadRest.elements);
});

test('bowling racks eleven independent ragdolls and holds ten pins until contact', () => {
  const simulation = createSimulation(goatProfile);
  simulation.reset('bowling');
  assert.equal(simulation.instances.length, 11);
  assert.equal(simulation.bodies.length, 143);
  assert.equal(simulation.joints.length, 132);
  assert.equal(new Set(simulation.bodies.map(body => body.bodyKey)).size, 143);
  assert.equal(simulation.snapshot().releasedPins, 0);
  const pins = simulation.instances.filter(instance => instance.role === 'pin');
  assert.equal(pins.length, 10);
  assert.ok(pins.every(instance => instance.held && instance.bodies.every(body => body.type === CANNON.Body.KINEMATIC)));
  assert.ok(pins.every(instance => instance.joints.every(joint => joint.equations.every(equation => !equation.enabled))));
  const rest = pins.map(instance => instance.bodyById.get('pelvis').position.clone());
  runSeconds(simulation, 2);
  pins.forEach((instance, i) => assert.equal(instance.bodyById.get('pelvis').position.distanceTo(rest[i]), 0));
});

for (const profile of [null, goatProfile]) {
  test(`${profile ? 'Goatman' : 'mannequin'} bowling launch contacts and releases real pins`, () => {
    const simulation = createSimulation(profile);
    simulation.reset('bowling');
    const pelvis = simulation.instances[0].bodyById.get('pelvis');
    simulation.setPaused(false);
    const launchSpeed = pelvis.velocity.z;
    assert.ok(launchSpeed > 2 && launchSpeed < 3);
    simulation.setPaused(true);
    simulation.setPaused(false);
    assert.equal(pelvis.velocity.z, launchSpeed, 'pause/resume must not relaunch');
    let hit = false;
    for (let i = 0; i < 12 * 120; i++) {
      simulation.step(1 / 120);
      if (simulation.world.contacts.some(contact => {
        const roles = [contact.bi.ragdollInstance?.role, contact.bj.ragdollInstance?.role];
        return roles.includes('projectile') && roles.includes('pin');
      })) hit = true;
    }
    assert.ok(pelvis.position.z > 10, 'launcher reached the target deck');
    assert.ok(hit, 'a physical projectile-pin contact occurred');
    assert.ok(simulation.snapshot().releasedPins > 0, 'contact released at least one target');
  });
}

test('secondary pin contact releases a held ragdoll and wakeups stay local', () => {
  const simulation = createSimulation(goatProfile);
  simulation.reset('bowling');
  const projectile = simulation.instances[0];
  const released = simulation.instances[1];
  const held = simulation.instances[2];
  const a = released.bodyById.get('pelvis');
  const b = held.bodyById.get('pelvis');
  simulation.beginDrag(a, a.position.toArray());
  simulation.endDrag();
  assert.equal(released.held, false);
  const isolated = held.bodyById.get('head');
  isolated.sleep();
  const projectileHead = projectile.bodyById.get('head');
  projectileHead.sleep();
  projectileHead.wakeUp();
  assert.equal(isolated.sleepState, CANNON.Body.SLEEPING, 'projectile wake should not wake another instance');
  isolated.wakeUp();
  a.position.copy(b.position);
  a.velocity.z = 2;
  simulation.setPaused(false);
  simulation.step(1 / 120);
  assert.equal(held.held, false);
  assert.ok(held.bodies.every(body => body.type === CANNON.Body.DYNAMIC));
  assert.ok(held.joints.every(joint => joint.equations.every(equation => equation.enabled)));
});

test('Goatman bowling stays finite and connected through 30 seconds and reracks cleanly', () => {
  const simulation = createSimulation(goatProfile);
  simulation.reset('bowling');
  runSeconds(simulation, 30);
  for (const body of simulation.bodies) {
    assert.ok([body.position.x, body.position.y, body.position.z, body.quaternion.w].every(Number.isFinite), body.bodyKey);
    assert.ok(body.position.y > -2 && body.position.y < 20, `${body.bodyKey} left the course`);
  }
  for (const joint of simulation.joints) {
    const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
    const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
    assert.ok(a.distanceTo(b) < .25, `${joint.bodyA.bodyKey}–${joint.bodyB.bodyKey}`);
  }
  for (let i = 0; i < 3; i++) {
    simulation.reset('bowling');
    assert.equal(simulation.world.bodies.length, simulation.bodies.length + simulation.staticBodies.length);
    assert.equal(simulation.world.constraints.length, 132);
    assert.equal(simulation.snapshot().releasedPins, 0);
    assert.equal(simulation.snapshot().paused, true);
  }
});

function frictionProbe(mu, dt = 1 / 120, switchAfter = null) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0), solver: new TimeStepFrictionSolver() });
  world.defaultContactMaterial.friction = mu;
  const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(100, .1, 100)) });
  floor.position.y = -.1;
  world.addBody(floor);
  const box = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)), linearDamping: 0, angularDamping: 0 });
  box.position.y = .5;
  box.velocity.x = 5;
  world.addBody(box);
  let sawMultipleContacts = false;
  for (let i = 0; i < Math.round(3 / dt); i++) {
    if (switchAfter !== null && i === Math.round(switchAfter / dt)) world.defaultContactMaterial.friction = .6;
    world.step(dt);
    if (world.frictionEquations.length >= 4) sawMultipleContacts = true;
  }
  return { distance: box.position.x, speed: box.velocity.x, sawMultipleContacts };
}

test('friction has a monotonic, physically useful effect across multi-point contacts', () => {
  const distances = [0, .1, .3, .6, 1].map(mu => frictionProbe(mu));
  for (let i = 1; i < distances.length; i++) assert.ok(distances[i - 1].distance > distances[i].distance);
  assert.ok(distances.slice(1).every(result => result.sawMultipleContacts));
  assert.ok(Math.abs(distances[0].distance - 15) < .05);
  assert.ok(distances[1].distance > 9 && distances[1].distance < 12);
  assert.ok(distances[3].distance > 1.5 && distances[3].distance < 3);
});

test('friction remains similar at 60 and 120 Hz and responds to a live change', () => {
  const fine = frictionProbe(.3, 1 / 120);
  const coarse = frictionProbe(.3, 1 / 60);
  assert.ok(Math.abs(fine.distance - coarse.distance) < .3);
  const changed = frictionProbe(0, 1 / 120, 1);
  assert.ok(changed.distance < frictionProbe(0).distance - 1);
  assert.ok(changed.speed < 5);
});

test('gravity validates, acts live, pauses cleanly, and persists across resets and profiles', () => {
  const simulation = createSimulation();
  assert.throws(() => simulation.configure({ gravity: -1 }), RangeError);
  assert.throws(() => simulation.configure({ gravity: 21 }), RangeError);
  assert.throws(() => simulation.configure({ gravity: NaN }), RangeError);
  assert.throws(() => simulation.configure({ impactBoost: -0.1 }), RangeError);
  assert.throws(() => simulation.configure({ impactBoost: 2.1 }), RangeError);
  simulation.configure({ gravity: 0, impactBoost: 1.4 });
  assert.ok(simulation.world.gravity.y === 0);
  const pelvis = simulation.instances[0].bodyById.get('pelvis');
  simulation.step(1);
  assert.equal(pelvis.velocity.y, 0, 'paused gravity does not advance bodies');
  simulation.setPaused(false);
  simulation.step(1 / 120);
  const before = pelvis.velocity.y;
  simulation.configure({ gravity: 10 });
  assert.equal(simulation.world.gravity.y, -10);
  simulation.step(1 / 120);
  assert.ok(pelvis.velocity.y < before - .06, 'live gravity accelerates the released body');
  simulation.reset('bowling');
  assert.equal(simulation.snapshot().settings.gravity, 10);
  assert.equal(simulation.snapshot().settings.impactBoost, 1.4);
  assert.ok(simulation.instances.slice(1).every(instance => instance.held && instance.bodies.every(body => body.type === CANNON.Body.KINEMATIC)));
  simulation.setProfile(goatProfile);
  assert.equal(simulation.snapshot().settings.gravity, 10);
  assert.equal(simulation.snapshot().settings.impactBoost, 1.4);
  simulation.reset('stairs');
  assert.equal(simulation.world.gravity.y, -10);
});

test('a first real hit adds one coherent, bounded COM velocity to its target', () => {
  const natural = createSimulation();
  const boosted = createSimulation();
  for (const simulation of [natural, boosted]) { simulation.reset('bowling'); simulation.setPaused(false); }
  natural.configure({ impactBoost: 0 });
  let pin;
  for (let tick = 0; tick < 8 * 120; tick++) {
    natural.step(1 / 120);
    boosted.step(1 / 120);
    pin = boosted.instances.find(instance => instance.role === 'pin' && !instance.held);
    if (pin) break;
  }
  assert.ok(pin, 'a real moving projectile contact released a pin');
  const counterpart = natural.instances.find(instance => instance.id === pin.id);
  assert.equal(counterpart.held, false);
  const deltas = pin.bodies.map((body, index) => body.velocity.vsub(counterpart.bodies[index].velocity));
  assert.ok(deltas[0].y > .5 && deltas[0].y <= 4.01, 'target got one bounded upward kick');
  assert.ok(Math.hypot(deltas[0].x, deltas[0].z) > .2 && Math.hypot(deltas[0].x, deltas[0].z) <= 2.51);
  for (const delta of deltas) assert.ok(delta.distanceTo(deltas[0]) < 1e-6, 'equal velocity change preserves the articulated pose');
  assert.equal(boosted.snapshot().releasedPins, 1, 'first impact is counted once');
  const dragged = createSimulation();
  dragged.reset('bowling');
  const target = dragged.instances[1];
  const pelvis = target.bodyById.get('pelvis');
  dragged.beginDrag(pelvis, pelvis.position.toArray());
  dragged.endDrag();
  assert.equal(dragged.snapshot().releasedPins, 1);
  assert.ok(target.bodies.every(body => body.velocity.length() < 1e-8), 'manual release adds no kick');
  dragged.reset('bowling');
  assert.equal(dragged.snapshot().releasedPins, 0);
  assert.ok(dragged.instances.slice(1).every(instance => instance.held), 'reset clears release and queued effects');
});

test('dragging the launcher into a target releases it without adding impact boost', () => {
  const natural = createSimulation();
  const boosted = createSimulation();
  for (const [simulation, impactBoost] of [[natural, 0], [boosted, 1]]) {
    simulation.reset('bowling');
    simulation.configure({ gravity: 0, impactBoost });
    const launcher = simulation.instances[0].bodyById.get('pelvis');
    const target = simulation.instances[1].bodyById.get('pelvis');
    assert.equal(simulation.beginDrag(launcher, launcher.position.toArray()), true);
    simulation.moveDrag(target.position.toArray());
    simulation.setPaused(false);
  }
  let released;
  for (let tick = 0; tick < 120; tick++) {
    natural.step(1 / 120);
    boosted.step(1 / 120);
    released = boosted.instances.find(instance => instance.role === 'pin' && !instance.held);
    if (released) break;
  }
  assert.ok(released, 'manual contact still releases a target');
  const counterpart = natural.instances.find(instance => instance.id === released.id);
  assert.equal(counterpart.held, false);
  for (const [index, body] of released.bodies.entries()) {
    assert.ok(body.velocity.distanceTo(counterpart.bodies[index].velocity) < 1e-8, `${body.idTag} received no extra boost`);
  }
  natural.endDrag();
  boosted.endDrag();
  assert.equal(boosted.snapshot().dragging, false);
});

test('holding an unrelated pin does not suppress the launcher impact boost', () => {
  const natural = createSimulation();
  const boosted = createSimulation();
  for (const [simulation, impactBoost] of [[natural, 0], [boosted, 1]]) {
    simulation.reset('bowling');
    simulation.configure({ impactBoost });
    const unrelated = simulation.instances.at(-1).bodyById.get('pelvis');
    assert.equal(simulation.beginDrag(unrelated, unrelated.position.toArray()), true);
    simulation.setPaused(false);
  }
  let impacted;
  for (let tick = 0; tick < 8 * 120; tick++) {
    natural.step(1 / 120);
    boosted.step(1 / 120);
    impacted = boosted.instances.find(instance => instance.id === 'pin-01' && !instance.held);
    if (impacted) break;
  }
  assert.ok(impacted, 'launcher hit a held target while a different pin was dragged');
  const counterpart = natural.instances.find(instance => instance.id === impacted.id);
  assert.equal(counterpart.held, false);
  const delta = impacted.bodyById.get('pelvis').velocity.y - counterpart.bodyById.get('pelvis').velocity.y;
  assert.ok(delta > .5 && delta <= 4.01, `normal impact kept its boost (${delta} m/s)`);
  natural.endDrag();
  boosted.endDrag();
});

function centerHeight(instance) {
  const mass = instance.bodies.reduce((total, body) => total + body.mass, 0);
  return instance.bodies.reduce((total, body) => total + body.mass * body.position.y, 0) / mass;
}

for (const profile of [null, goatProfile]) {
  test(`${profile ? 'Goatman' : 'mannequin'} first bowling target becomes airborne with default boost`, () => {
    const peaks = [];
    for (const impactBoost of [0, 1]) {
      const simulation = createSimulation(profile);
      simulation.reset('bowling');
      simulation.configure({ impactBoost });
      const heights = new Map(simulation.instances.slice(1).map(instance => [instance.id, centerHeight(instance)]));
      simulation.setPaused(false);
      let first;
      let peak = -Infinity;
      for (let tick = 0; tick < 8 * 120; tick++) {
        simulation.step(1 / 120);
        first ??= simulation.instances.find(instance => instance.role === 'pin' && !instance.held);
        if (first) peak = Math.max(peak, centerHeight(first) - heights.get(first.id));
      }
      assert.ok(first, 'launcher reached a target');
      peaks.push(peak);
    }
    assert.ok(peaks[1] > .5, `default boost raised target COM ${peaks[1]} m`);
    assert.ok(peaks[1] > peaks[0] + .4, 'extra lift comes from boost rather than natural collision');
  });
}

test('gravity and boost extremes remain finite and constraints remain connected', () => {
  for (const [gravity, impactBoost] of [[0, 0], [20, 2]]) {
    const simulation = createSimulation(goatProfile);
    simulation.reset('bowling');
    simulation.configure({ gravity, impactBoost });
    runSeconds(simulation, 8);
    for (const body of simulation.bodies) assert.ok([body.position.x, body.position.y, body.position.z, body.velocity.x, body.velocity.y, body.velocity.z].every(Number.isFinite), body.bodyKey);
    for (const joint of simulation.joints) {
      const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
      const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
      assert.ok(a.distanceTo(b) < .35, `${joint.bodyA.bodyKey}–${joint.bodyB.bodyKey} separated at extreme settings`);
    }
  }
});
