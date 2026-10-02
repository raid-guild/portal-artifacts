import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSimulation } from '../dist/physics.js';
import * as CANNON from '../dist/vendor/cannon-es.js';

const profiles = [null, 'goatman', 'vitalik'].map(name => name ?
  JSON.parse(readFileSync(new URL(`../dist/assets/${name}-ragdoll.json`, import.meta.url), 'utf8')) : null);
const advance = (sim, seconds) => { for (let tick = 0; tick < seconds * 120; tick++) sim.step(1 / 120); };
const maxJointGap = instance => Math.max(...instance.joints.map(joint =>
  joint.bodyA.pointToWorldFrame(joint.pivotA).distanceTo(joint.bodyB.pointToWorldFrame(joint.pivotB))));
const lie = new CANNON.Quaternion();
lie.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
function placeLying(instance, pelvisAt) {
  const center = instance.bodyById.get('pelvis').position.clone();
  for (const body of instance.bodies) {
    body.position.copy(pelvisAt.vadd(lie.vmult(body.position.vsub(center))));
    body.quaternion.copy(lie.mult(body.quaternion));
    body.previousPosition.copy(body.position); body.previousQuaternion.copy(body.quaternion);
    body.aabbNeedsUpdate = true;
  }
}
function releaseByDrag(sim, instance) {
  const p = instance.bodyById.get('pelvis').position;
  assert.equal(sim.beginDrag(instance.bodyById.get('pelvis'), [p.x, p.y, p.z]), true);
  sim.endDrag();
}
function isolatedBowlingPair(profile) {
  const sim = createSimulation(profile); sim.reset('bowling');
  const [launcher, a, b, ...rack] = sim.instances;
  for (const instance of [launcher, ...rack]) for (const body of instance.bodies) {
    body.position.x += 20; body.previousPosition.copy(body.position); body.aabbNeedsUpdate = true;
  }
  return { sim, a, b };
}
function initiallyTouchingPair(profile = null) {
  const pair = isolatedBowlingPair(profile);
  placeLying(pair.a, new CANNON.Vec3(0, .27, 14));
  placeLying(pair.b, new CANNON.Vec3(.55, .27, 14));
  releaseByDrag(pair.sim, pair.a); releaseByDrag(pair.sim, pair.b);
  pair.sim.setPaused(false);
  return pair;
}

test('each character rises from a real Drop landing, stays connected, and stands stably', () => {
  for (const profile of profiles) {
    const sim = createSimulation(profile);
    const instance = sim.instances[0];
    sim.setPaused(false);
    let fell = false, recovered = false, moved = false;
    let entryY = 0, firstRecover = null;
    for (let tick = 0; tick < 45 * 120 && instance.state !== 'standing'; tick++) {
      sim.step(1 / 120);
      const pelvisY = instance.bodyById.get('pelvis').position.y;
      if (pelvisY < .8) fell = true;
      if (instance.state === 'recovering') {
        if (!firstRecover) { firstRecover = tick; entryY = pelvisY; }
        if (Math.abs(pelvisY - entryY) > .25) moved = true;
        if (tick % 24 === 0) {
          assert.ok(maxJointGap(instance) < .025, `${profile?.id ?? 'mannequin'} recovery separates a joint`);
          for (const body of instance.bodies) {
            body.updateAABB();
            assert.ok(body.aabb.lowerBound.y >= -.025, 'recovery clips through floor');
          }
        }
        recovered = true;
      }
    }
    assert.ok(fell && recovered && moved, `${profile?.id ?? 'mannequin'} never completed a grounded rising motion`);
    assert.equal(instance.state, 'standing');
    assert.equal(sim.snapshot().standingCount, 1);
    assert.equal(instance.held, false);
    const pose = instance.bodies.map(body => [body.position.clone(), body.quaternion.clone()]);
    advance(sim, 10);
    assert.equal(instance.state, 'standing');
    instance.bodies.forEach((body, index) => {
      assert.equal(body.type, CANNON.Body.KINEMATIC);
      assert.ok(body.position.distanceTo(pose[index][0]) < 1e-5);
    });
    assert.ok(maxJointGap(instance) < .025);
  }
});

test('zero gravity, air and a held target cannot start recovery', () => {
  const zero = createSimulation();
  zero.configure({ gravity: 0 }); zero.setPaused(false); advance(zero, 12);
  assert.equal(zero.instances[0].state, 'ragdoll');
  const board = createSimulation();
  board.reset('plinko');
  const held = board.instances.find(instance => instance.held);
  board.setPaused(false); advance(board, .2);
  assert.equal(held.held, true);
  assert.equal(held.state, 'ragdoll');
  assert.equal(board.instances[0].state, 'ragdoll');
});

test('Plinko starts with passive piles and remembers its own auto get-up choice', () => {
  const sim = createSimulation();
  assert.equal(sim.snapshot().settings.autoGetUp, true);
  sim.reset('plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  sim.reset('bowling');
  assert.equal(sim.snapshot().settings.autoGetUp, true);
  sim.configure({ autoGetUp: true }, 'plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, true, 'destination override does not change the current scene');
  sim.reset('plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, true);
  sim.configure({ autoGetUp: false });
  sim.reset('drop');
  assert.equal(sim.snapshot().settings.autoGetUp, true);
  sim.reset('plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  assert.throws(() => sim.configure({ autoGetUp: true, gravity: -1 }, 'plinko'), RangeError);
  assert.equal(sim.snapshot().settings.autoGetUp, false, 'invalid WebMCP values cannot change the saved choice');
});

test('drag, toggle and gravity interruption restore dynamics and constraints; reset clears recovery', () => {
  const sim = createSimulation(); sim.setPaused(false);
  for (let tick = 0; tick < 30 * 120 && sim.instances[0].state !== 'standing'; tick++) sim.step(1 / 120);
  const instance = sim.instances[0];
  assert.equal(instance.state, 'standing');
  const head = instance.bodyById.get('head');
  assert.equal(sim.beginDrag(head, [head.position.x, head.position.y, head.position.z]), true);
  assert.equal(instance.state, 'ragdoll');
  assert.ok(instance.bodies.every(body => body.type === CANNON.Body.DYNAMIC));
  assert.ok(instance.joints.every(joint => joint.equations.every(equation => equation.enabled)));
  sim.endDrag();
  assert.equal(sim.snapshot().dragging, false);
  sim.reset();
  assert.equal(sim.snapshot().standingCount, 0);
  sim.setPaused(false);
  for (let tick = 0; tick < 30 * 120 && sim.instances[0].state !== 'recovering'; tick++) sim.step(1 / 120);
  assert.equal(sim.instances[0].state, 'recovering');
  sim.setPaused(true);
  const pausedTime = sim.snapshot().time;
  const pausedPose = sim.instances[0].bodyById.get('pelvis').position.clone();
  advance(sim, 1);
  assert.equal(sim.snapshot().time, pausedTime);
  assert.ok(sim.instances[0].bodyById.get('pelvis').position.distanceTo(pausedPose) < 1e-8);
  sim.setPaused(false);
  sim.configure({ autoGetUp: false });
  assert.equal(sim.instances[0].state, 'ragdoll');
  assert.ok(sim.instances[0].bodies.every(body => body.type === CANNON.Body.DYNAMIC));
  sim.configure({ autoGetUp: true });
  sim.reset(); sim.setPaused(false);
  for (let tick = 0; tick < 30 * 120 && sim.instances[0].state !== 'recovering'; tick++) sim.step(1 / 120);
  assert.equal(sim.instances[0].state, 'recovering');
  sim.configure({ gravity: 0 });
  assert.equal(sim.instances[0].state, 'ragdoll');
  assert.throws(() => sim.configure({ autoGetUp: 'yes' }), /Invalid autoGetUp/);
});

test('a real incoming dynamic impact interrupts standing, including at the narrow joint range', () => {
  const sim = createSimulation();
  sim.configure({ jointRange: 25 }); sim.setPaused(false);
  let checkedTurn = false;
  for (let tick = 0; tick < 45 * 120 && sim.instances[0].state !== 'standing'; tick++) {
    sim.step(1 / 120);
    const recovery = sim.instances[0].recovery;
    if (recovery && !checkedTurn) {
      const pelvis = recovery.keys[1].quats.get('pelvis');
      const chest = recovery.keys[1].quats.get('chest');
      const dot = Math.abs(pelvis.x * chest.x + pelvis.y * chest.y + pelvis.z * chest.z + pelvis.w * chest.w);
      assert.ok(2 * Math.acos(Math.min(1, dot)) < .18, 'narrow-range chest follows the root turn');
      checkedTurn = true;
    }
  }
  assert.equal(checkedTurn, true);
  assert.equal(sim.instances[0].state, 'standing');
  const chest = sim.instances[0].bodyById.get('chest');
  const incoming = new CANNON.Body({ mass: 5, shape: new CANNON.Sphere(.18) });
  incoming.position.set(chest.position.x + 1, chest.position.y, chest.position.z);
  incoming.velocity.set(-4, 0, 0);
  incoming.ragdollInstance = { held: false };
  sim.world.addBody(incoming);
  for (let tick = 0; tick < 120 && sim.instances[0].state === 'standing'; tick++) sim.step(1 / 120);
  assert.equal(sim.instances[0].state, 'ragdoll');
  assert.ok(sim.instances[0].bodies.every(body => body.type === CANNON.Body.DYNAMIC));
  assert.ok(sim.instances[0].joints.every(joint => joint.equations.every(equation => equation.enabled)));
  advance(sim, 2);
  assert.ok(sim.instances[0].bodies.every(body => Number.isFinite(body.position.y) && body.velocity.length() < 20));
  sim.world.removeBody(incoming);
});

test('a raised-arm obstruction defers recovery until its sweep is clear', () => {
  const sim = createSimulation(); sim.setPaused(false);
  const instance = sim.instances[0];
  for (let tick = 0; tick < 20 * 120 && instance.quietSeconds < .7; tick++) sim.step(1 / 120);
  assert.ok(instance.quietSeconds >= .7);
  const pelvis = instance.bodyById.get('pelvis').position;
  const obstacle = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(.12, .12, .12)) });
  obstacle.position.set(pelvis.x + .82, 1.45, pelvis.z);
  obstacle.idTag = 'test-obstruction';
  sim.world.addBody(obstacle); sim.staticBodies.push(obstacle);
  advance(sim, 5);
  assert.equal(instance.state, 'ragdoll');
  sim.world.removeBody(obstacle);
  sim.staticBodies.splice(sim.staticBodies.indexOf(obstacle), 1);
  for (let tick = 0; tick < 5 * 120 && instance.state !== 'recovering'; tick++) sim.step(1 / 120);
  assert.equal(instance.state, 'recovering');
});

test('scene recovery preferences survive character resets without changing target counts', () => {
  const sim = createSimulation();
  sim.configure({ autoGetUp: false });
  sim.reset('bowling');
  assert.equal(sim.snapshot().settings.autoGetUp, true, 'Bowling keeps its separate default');
  sim.configure({ autoGetUp: false });
  sim.setProfile(profiles[2]);
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  assert.equal(sim.snapshot().releasedTargets, 0);
  assert.equal(sim.snapshot().totalTargets, 10);
  sim.reset('plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  assert.equal(sim.snapshot().releasedTargets, 0);
  assert.equal(sim.snapshot().totalTargets, 15);
  assert.equal(sim.snapshot().standingCount, 0);
  assert.ok(sim.instances.filter(instance => instance.held).every(instance => instance.state === 'ragdoll'));
});

test('nearby released ragdolls have real rising contacts and displace instead of blocking recovery', () => {
  const spacing = [.8, .65, .55];
  for (let index = 0; index < profiles.length; index++) {
    const { sim, a, b } = isolatedBowlingPair(profiles[index]);
    placeLying(a, new CANNON.Vec3(0, .27, 14)); releaseByDrag(sim, a);
    sim.setPaused(false);
    let introduced = false, contacts = 0, displaced = 0, start = null;
    let stoodA = false, stoodB = false, deepest = 0, maxLinear = 0, maxAngular = 0, maxGap = 0;
    for (const body of a.bodies) body.addEventListener('collide', event => { if (event.body?.ragdollInstance === b) contacts++; });
    sim.world.addEventListener('preStep', () => {
      for (const instance of [a, b]) if (instance.state === 'recovering') for (const body of instance.bodies) {
        maxLinear = Math.max(maxLinear, body.velocity.length());
        maxAngular = Math.max(maxAngular, body.angularVelocity.length());
      }
    });
    for (let tick = 0; tick < 40 * 120; tick++) {
      sim.step(1 / 120);
      if (a.state === 'recovering' && !introduced) {
        const pelvis = a.bodyById.get('pelvis').position;
        placeLying(b, new CANNON.Vec3(pelvis.x + spacing[index], .27, pelvis.z));
        releaseByDrag(sim, b);
        start = b.bodyById.get('pelvis').position.clone(); introduced = true;
      }
      if (!introduced) continue;
      const bPelvis = b.bodyById.get('pelvis').position;
      if (a.state === 'recovering') displaced = Math.max(displaced, bPelvis.distanceTo(start));
      if (a.state === 'standing') stoodA = true;
      if (b.state === 'standing') stoodB = true;
      if (a.state === 'recovering') maxGap = Math.max(maxGap, maxJointGap(a));
      if (b.state === 'recovering') maxGap = Math.max(maxGap, maxJointGap(b));
      for (const contact of sim.world.contacts) {
        if (!((contact.bi.ragdollInstance === a && contact.bj.ragdollInstance === b) ||
              (contact.bi.ragdollInstance === b && contact.bj.ragdollInstance === a))) continue;
        const first = contact.bi.position.vadd(contact.ri);
        const second = contact.bj.position.vadd(contact.rj);
        deepest = Math.min(deepest, contact.ni.dot(second.vsub(first)));
      }
    }
    assert.equal(introduced, true);
    assert.ok(contacts > 0, `${profiles[index]?.id ?? 'mannequin'} had no real inter-ragdoll contact`);
    assert.ok(displaced > .02, 'the rising rig did not move its neighbor');
    assert.equal(stoodA, true, 'own pushing interrupted recovery');
    if (index !== 1) assert.equal(stoodB, true, 'the displaced neighbor never recovered');
    assert.ok(deepest > -.13, `sustained deep penetration: ${deepest}`);
    assert.ok(maxLinear <= 12.01 && maxAngular <= 10.01 && maxGap < .03);
    for (const instance of [a, b]) for (const body of instance.bodies) assert.ok(Number.isFinite(body.position.y));
  }
});

test('distant fallen ragdolls recover at the same time for every character', () => {
  for (const profile of profiles) {
    const { sim, a, b } = isolatedBowlingPair(profile);
    placeLying(a, new CANNON.Vec3(-1.45, .27, 14));
    placeLying(b, new CANNON.Vec3(1.45, .27, 14));
    releaseByDrag(sim, a); releaseByDrag(sim, b);
    sim.setPaused(false);
    let concurrent = false;
    for (let tick = 0; tick < 20 * 120; tick++) {
      sim.step(1 / 120);
      if (a.state === 'recovering' && b.state === 'recovering') concurrent = true;
    }
    assert.equal(concurrent, true);
    assert.equal(a.state, 'standing'); assert.equal(b.state, 'standing');
  }
});

test('two initially touching fallen rigs scoot continuously and both stand without crossing obstacles', () => {
  for (const profile of profiles) {
    const { sim, a, b } = initiallyTouchingPair(profile);
    let scooted = false, maxStep = 0, maxGap = 0, lowest = Infinity, maxLinear = 0, maxAngular = 0;
    let lastPelvis = null, lastScoot = false;
    sim.world.addEventListener('preStep', () => {
      for (const instance of [a, b]) if (instance.state === 'recovering') for (const body of instance.bodies) {
        maxLinear = Math.max(maxLinear, body.velocity.length());
        maxAngular = Math.max(maxAngular, body.angularVelocity.length());
      }
    });
    for (let tick = 0; tick < 40 * 120; tick++) {
      sim.step(1 / 120);
      for (const instance of [a, b]) if (instance.state === 'recovering') {
        maxGap = Math.max(maxGap, maxJointGap(instance));
        for (const body of instance.bodies) { body.updateAABB(); lowest = Math.min(lowest, body.aabb.lowerBound.y); }
      }
      const scooting = a.state === 'recovering' && a.recovery?.scootDuration > 0 && a.recovery.elapsed < a.recovery.scootDuration;
      if (scooting) {
        scooted = true;
        const position = a.bodyById.get('pelvis').position.clone();
        if (lastScoot) maxStep = Math.max(maxStep, position.distanceTo(lastPelvis));
        lastPelvis = position;
      }
      lastScoot = scooting;
    }
    assert.equal(a.state, 'standing', `${profile?.id ?? 'mannequin'} first rig remains down`);
    assert.equal(b.state, 'standing', `${profile?.id ?? 'mannequin'} second rig remains down`);
    assert.equal(scooted, true);
    assert.ok(maxStep < .12, `scoot jumped ${maxStep} m in one step`);
    assert.ok(maxGap < .03 && lowest > -.035);
    assert.ok(maxLinear <= 12.01 && maxAngular <= 10.01);
    assert.equal(sim.snapshot().releasedTargets, 2);
  }
});

test('a thin physical wall across the escape path makes recovery wait, then retry', () => {
  const { sim, a, b } = initiallyTouchingPair();
  for (let tick = 0; tick < 20 * 120 && b.state !== 'standing'; tick++) sim.step(1 / 120);
  assert.equal(b.state, 'standing');
  let left = Infinity;
  for (const body of a.bodies) { body.updateAABB(); left = Math.min(left, body.aabb.lowerBound.x); }
  const wall = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(.015, .6, 2)) });
  wall.position.set(left - .16, .6, 14);
  wall.idTag = 'test-escape-wall';
  sim.world.addBody(wall); sim.staticBodies.push(wall);
  advance(sim, 10);
  assert.notEqual(a.state, 'recovering');
  assert.notEqual(a.state, 'standing');
  sim.world.removeBody(wall); sim.staticBodies.splice(sim.staticBodies.indexOf(wall), 1);
  for (let tick = 0; tick < 20 * 120 && a.state !== 'standing'; tick++) sim.step(1 / 120);
  assert.equal(a.state, 'standing');
});

test('drag, toggle and reset during the scoot release its reservation and dynamics', () => {
  for (const action of ['drag', 'toggle', 'reset']) {
    const { sim, a } = initiallyTouchingPair();
    for (let tick = 0; tick < 25 * 120; tick++) {
      sim.step(1 / 120);
      if (a.state === 'recovering' && a.recovery?.scootDuration && a.recovery.elapsed < a.recovery.scootDuration) break;
    }
    assert.equal(a.state, 'recovering');
    assert.ok(a.recovery.reservation);
    if (action === 'drag') {
      releaseByDrag(sim, a);
      assert.equal(a.state, 'ragdoll'); assert.equal(a.recovery, null);
      assert.equal(sim.snapshot().dragging, false);
    } else if (action === 'toggle') {
      sim.configure({ autoGetUp: false });
      assert.equal(a.state, 'ragdoll'); assert.equal(a.recovery, null);
    } else {
      sim.reset('bowling');
      assert.equal(sim.snapshot().recoveringCount, 0);
      assert.equal(sim.snapshot().releasedTargets, 0);
    }
    if (action !== 'reset') {
      assert.ok(a.bodies.every(body => body.type === CANNON.Body.DYNAMIC));
      assert.ok(a.joints.every(joint => joint.equations.every(equation => equation.enabled)));
    }
  }
});
