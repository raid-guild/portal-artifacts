import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSimulation as createRawSimulation, validateProfile, BODY_IDS } from '../dist/physics.js';
import { createCharacterSelection } from '../dist/characterSelection.js';
import * as THREE from '../dist/vendor/three.module.js';
import { GLTFLoader } from '../dist/vendor/GLTFLoader.js';
import { createSkinnedRagdoll } from '../dist/skinnedRagdoll.js';

function createSimulation(profile = null) { const simulation = createRawSimulation(profile); simulation.configure({ autoGetUp: false }); return simulation; }

const profile = JSON.parse(readFileSync(new URL('../dist/assets/vitalik-ragdoll.json', import.meta.url), 'utf8'));
const glb = readFileSync(new URL('../dist/assets/vitalik-rigged.glb', import.meta.url));

function run(simulation, seconds) {
  simulation.setPaused(false);
  for (let i = 0; i < seconds * 120; i++) simulation.step(1 / 120);
}

function maxGap(simulation) {
  return Math.max(...simulation.joints.map(joint =>
    joint.bodyA.pointToWorldFrame(joint.pivotA).distanceTo(joint.bodyB.pointToWorldFrame(joint.pivotB))));
}

async function loadGeometryOnly() {
  // Parse the real exported geometry/skeleton in Node without a DOM image API.
  const jsonLength = glb.readUInt32LE(12);
  const document = JSON.parse(glb.toString('utf8', 20, 20 + jsonLength));
  for (const material of document.materials) delete material.pbrMetallicRoughness.baseColorTexture;
  delete document.textures; delete document.images; delete document.samplers;
  const serialized = JSON.stringify(document);
  const json = Buffer.from(serialized + ' '.repeat((4 - serialized.length % 4) % 4));
  const binary = glb.subarray(20 + jsonLength);
  const stripped = Buffer.alloc(20 + json.length + binary.length);
  glb.copy(stripped, 0, 0, 12);
  stripped.writeUInt32LE(stripped.length, 8);
  stripped.writeUInt32LE(json.length, 12);
  stripped.writeUInt32LE(0x4e4f534a, 16);
  json.copy(stripped, 20);
  binary.copy(stripped, 20 + json.length);
  return new GLTFLoader().parseAsync(stripped.buffer.slice(stripped.byteOffset, stripped.byteOffset + stripped.byteLength), '');
}

test('Vitalik profile preserves the canonical 13-body contract and asset identity', () => {
  assert.equal(validateProfile(profile).id, 'vitalik');
  assert.deepEqual(new Set(profile.bodies.map(body => body.id)), new Set(BODY_IDS));
  assert.equal(profile.joints.length, 12);
  assert.ok(profile.bounds.max[1] > 1.85 && profile.bounds.max[1] < 1.95);
  const unsafe = structuredClone(profile);
  unsafe.asset = './assets/goatman-rigged.glb';
  assert.throws(() => validateProfile(unsafe), RangeError);
});

test('exported GLB contains one textured UV atlas, a 13-bone skin, and normalized weights', () => {
  assert.equal(glb.toString('ascii', 0, 4), 'glTF');
  const jsonLength = glb.readUInt32LE(12);
  const document = JSON.parse(glb.toString('utf8', 20, 20 + jsonLength));
  assert.equal(document.scenes.length, 1);
  assert.equal(document.skins.length, 1);
  assert.equal(document.skins[0].joints.length, 13);
  assert.equal(document.images.length, 1);
  assert.equal(document.materials.length, 1);
  const primitive = document.meshes[0].primitives[0];
  for (const attribute of ['POSITION', 'NORMAL', 'TEXCOORD_0', 'JOINTS_0', 'WEIGHTS_0']) {
    assert.ok(Number.isInteger(primitive.attributes[attribute]), attribute);
  }
  assert.deepEqual(new Set(document.skins[0].joints.map(index => document.nodes[index].name)), new Set(BODY_IDS));
  const atlas = document.images[0];
  assert.ok(Number.isInteger(atlas.bufferView), 'artwork is embedded in the GLB');
  const uv = document.accessors[primitive.attributes.TEXCOORD_0];
  const weights = document.accessors[primitive.attributes.WEIGHTS_0];
  const joints = document.accessors[primitive.attributes.JOINTS_0];
  const positions = document.accessors[primitive.attributes.POSITION];
  assert.equal(uv.count, weights.count);
  assert.ok(uv.count > 5000);
  assert.equal(weights.type, 'VEC4');
  const binStart = 20 + jsonLength + 8;
  function component(accessor, element, slot, arity = 4) {
    const view = document.bufferViews[accessor.bufferView];
    const bytes = accessor.componentType === 5126 ? 4 : accessor.componentType === 5123 ? 2 : 1;
    const stride = view.byteStride || bytes * arity;
    const at = binStart + view.byteOffset + (accessor.byteOffset || 0) + element * stride + slot * bytes;
    if (accessor.componentType === 5126) return glb.readFloatLE(at);
    if (accessor.componentType === 5123) return glb.readUInt16LE(at) / (accessor.normalized ? 65535 : 1);
    if (accessor.componentType === 5121) return glb.readUInt8(at) / (accessor.normalized ? 255 : 1);
    throw new Error(`Unsupported weight component ${accessor.componentType}`);
  }
  for (let i = 0; i < weights.count; i++) {
    let total = 0;
    for (let slot = 0; slot < 4; slot++) total += component(weights, i, slot);
    assert.ok(Math.abs(total - 1) < .002, `vertex ${i} weight sum ${total}`);
  }
  const ownership = { 'left-foot': 0, 'right-foot': 0, 'left-forearm': 0, 'right-forearm': 0 };
  for (let i = 0; i < positions.count; i++) {
    const x = component(positions, i, 0, 3), y = component(positions, i, 1, 3), z = component(positions, i, 2, 3);
    const side = x < 0 ? 'left' : 'right';
    let id = null;
    if (Math.abs(x) > .045 && y < .13 && z > .13) id = `${side}-foot`;
    else if (Math.abs(x) > .46 && y > .77 && y < .88 && z > -.04 && z < .07) id = `${side}-forearm`;
    if (!id) continue;
    const expected = document.skins[0].joints.findIndex(index => document.nodes[index].name === id);
    assert.equal(component(joints, i, 0), expected, `vertex ${i} ${id} assigned to wrong bone`);
    assert.ok(component(weights, i, 0) > .9, `vertex ${i} ${id} lost rigid attachment`);
    ownership[id]++;
  }
  for (const [id, count] of Object.entries(ownership)) assert.ok(count > 20, `sampled ${count} ${id} vertices`);
});

test('painted shoes and hands stay attached through a stair fall', async () => {
  const gltf = await loadGeometryOnly();
  const rig = createSkinnedRagdoll(gltf, profile);
  const simulation = createSimulation(profile);
  simulation.reset('stairs');
  run(simulation, 9);
  rig.pose(simulation.bodies, 1);
  rig.root.updateMatrixWorld(true);
  const mesh = rig.meshes[0];
  mesh.skeleton.update();
  const original = mesh.geometry.getAttribute('position');
  const position = new THREE.Vector3();
  const bodyPositions = new Map(simulation.bodies.map(body => [body.idTag, new THREE.Vector3(body.position.x, body.position.y, body.position.z)]));
  const counts = { 'left-foot': 0, 'right-foot': 0, 'left-forearm': 0, 'right-forearm': 0 };
  for (let i = 0; i < original.count; i++) {
    const x = original.getX(i), y = original.getY(i), z = original.getZ(i);
    const side = x < 0 ? 'left' : 'right';
    let id = null;
    if (Math.abs(x) > .045 && y < .13 && z > .13) id = `${side}-foot`;
    else if (Math.abs(x) > .46 && y > .77 && y < .88 && z > -.04 && z < .07) id = `${side}-forearm`;
    if (!id) continue;
    mesh.getVertexPosition(i, position).applyMatrix4(mesh.matrixWorld);
    const gap = position.distanceTo(bodyPositions.get(id));
    assert.ok(gap < .35, `${id} vertex ${i} stretched ${gap.toFixed(3)} m from its body`);
    counts[id]++;
  }
  for (const [id, count] of Object.entries(counts)) assert.ok(count > 20, `posed ${count} ${id} vertices`);
});

test('real sleeve skin follows sideways and overhead arm poses without a cap discontinuity', async () => {
  const rig = createSkinnedRagdoll(await loadGeometryOnly(), profile);
  const mesh = rig.meshes[0];
  const positions = mesh.geometry.getAttribute('position');
  const jointIndices = mesh.geometry.getAttribute('skinIndex');
  const skinWeights = mesh.geometry.getAttribute('skinWeight');
  const upperIndex = mesh.skeleton.bones.findIndex(bone => bone.name === 'left-upper-arm');
  const upperWeight = index => {
    let total = 0;
    for (let slot = 0; slot < 4; slot++) if (jointIndices.getComponent(index, slot) === upperIndex) total += skinWeights.getComponent(index, slot);
    return total;
  };
  const innerSleeve = [];
  const cap = [];
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    if (x < -.225 && x > -.245 && y > 1.31 && y < 1.35 && Math.abs(z) < .09) innerSleeve.push(i);
    if (x < -.205 && x > -.275 && y > 1.56 && y < 1.61 && Math.abs(z) < .12) cap.push(i);
  }
  assert.ok(innerSleeve.length > 5 && cap.length > 5, 'sampled upper sleeve and cap');
  assert.ok(Math.min(...innerSleeve.map(upperWeight)) > .9, 'inner upper sleeve is carried by the arm');
  assert.ok(cap.reduce((sum, index) => sum + upperWeight(index), 0) / cap.length > .55, 'shoulder cap follows the arm');
  const triangles = mesh.geometry.getIndex();
  let crossingEdges = 0;
  let largestWeightJump = 0;
  for (let triangle = 0; triangle < triangles.count; triangle += 3) {
    const ids = [triangles.getX(triangle), triangles.getX(triangle + 1), triangles.getX(triangle + 2)];
    for (const [a, b] of [[ids[0], ids[1]], [ids[1], ids[2]], [ids[2], ids[0]]]) {
      const ax = positions.getX(a), bx = positions.getX(b), ay = positions.getY(a), by = positions.getY(b);
      if (ax > -.25 || bx > -.25 || ax < -.34 || bx < -.34 || Math.min(ay, by) >= 1.56 || Math.max(ay, by) <= 1.56) continue;
      crossingEdges++;
      largestWeightJump = Math.max(largestWeightJump, Math.abs(upperWeight(a) - upperWeight(b)));
    }
  }
  assert.ok(crossingEdges > 5, `sampled ${crossingEdges} edges across the former cap cutoff`);
  assert.ok(largestWeightJump < .35, `upper-arm weight jumped ${largestWeightJump.toFixed(3)} across the cap`);

  const pivot = new THREE.Vector3(...profile.joints.find(joint => joint.child === 'left-upper-arm').anchor);
  const bodies = profile.bodies.map(spec => {
    const position = new THREE.Vector3(...spec.position);
    const quaternion = new THREE.Quaternion(...spec.quaternion);
    return { idTag: spec.id, position, previousPosition: position.clone(), quaternion, previousQuaternion: quaternion.clone() };
  });
  const sample = new THREE.Vector3();
  const closest = new THREE.Vector3();
  const restElbow = new THREE.Vector3(...profile.joints.find(joint => joint.child === 'left-forearm').anchor);
  for (const angle of [90, 150]) {
    const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle * Math.PI / 180);
    for (const id of ['left-upper-arm', 'left-forearm']) {
      const body = bodies.find(item => item.idTag === id);
      const spec = profile.bodies.find(item => item.id === id);
      body.position.copy(new THREE.Vector3(...spec.position).sub(pivot).applyQuaternion(turn).add(pivot));
      body.quaternion.copy(turn).multiply(new THREE.Quaternion(...spec.quaternion));
    }
    const elbow = restElbow.clone().sub(pivot).applyQuaternion(turn).add(pivot);
    const axis = elbow.clone().sub(pivot);
    rig.pose(bodies, 1);
    rig.root.updateMatrixWorld(true);
    mesh.skeleton.update();
    let worst = 0;
    for (const index of innerSleeve) {
      mesh.getVertexPosition(index, sample).applyMatrix4(mesh.matrixWorld);
      const t = Math.max(0, Math.min(1, sample.clone().sub(pivot).dot(axis) / axis.lengthSq()));
      closest.copy(pivot).addScaledVector(axis, t);
      worst = Math.max(worst, sample.distanceTo(closest));
    }
    assert.ok(worst < .17, `${angle}° sleeve drifted ${worst.toFixed(3)} m from upper arm`);
  }
});

test('load ordering honors a deliberate character selection and falls back if preferred fails', () => {
  const first = createCharacterSelection();
  assert.equal(first.loaded('goatman'), null);
  assert.equal(first.loaded('vitalik'), 'vitalik');
  assert.equal(first.chosen, 'vitalik');
  const second = createCharacterSelection();
  second.choose('goatman');
  assert.equal(second.loaded('vitalik'), null);
  assert.equal(second.chosen, 'goatman');
  const third = createCharacterSelection();
  assert.equal(third.loaded('goatman'), null);
  assert.equal(third.loadFailed('vitalik'), 'goatman');
  assert.equal(third.chosen, 'goatman');
});

for (const scene of ['drop', 'stairs']) test(`Vitalik ${scene} remains finite, connected, and resettable`, () => {
  const simulation = createSimulation(profile);
  simulation.reset(scene);
  assert.equal(simulation.bodies.length, 13);
  assert.equal(simulation.joints.length, 12);
  run(simulation, 10);
  for (const body of simulation.bodies) {
    for (const value of [body.position.x, body.position.y, body.position.z, body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w]) assert.ok(Number.isFinite(value));
  }
  assert.ok(maxGap(simulation) < .15);
  const forearm = simulation.bodies.find(body => body.idTag === 'left-forearm');
  assert.equal(simulation.beginDrag(forearm, forearm.position.toArray()), true);
  simulation.moveDrag([forearm.position.x + .5, forearm.position.y + .5, forearm.position.z]);
  run(simulation, .5);
  simulation.reset(scene);
  assert.equal(simulation.snapshot().time, 0);
  assert.equal(simulation.world.constraints.length, 12);
});

test('Vitalik bowling makes actual contact and releases a target', () => {
  const simulation = createSimulation(profile);
  simulation.reset('bowling');
  assert.equal(simulation.instances.length, 11);
  run(simulation, 16);
  assert.ok(simulation.snapshot().releasedTargets >= 1);
  assert.ok(maxGap(simulation) < .2);
});

test('Vitalik naturally cascades through multiple Plinko rows without an impact boost', () => {
  const simulation = createSimulation(profile);
  simulation.configure({ impactBoost: 0 });
  simulation.reset('plinko');
  assert.equal(simulation.instances.length, 16);
  run(simulation, 8);
  const released = simulation.instances.filter(instance => instance.role === 'target' && !instance.held);
  assert.ok(released.length >= 5, `released ${released.length}`);
  assert.ok(new Set(released.map(instance => instance.id.split('-')[1])).size >= 3, 'at least three rows release');
  assert.ok(maxGap(simulation) < .2);
  simulation.setProfile(null);
  assert.equal(simulation.snapshot().profileId, 'mannequin');
  assert.equal(simulation.world.constraints.length, 192);
  simulation.setProfile(profile);
  assert.equal(simulation.snapshot().profileId, 'vitalik');
  assert.equal(simulation.world.constraints.length, 192);
});
