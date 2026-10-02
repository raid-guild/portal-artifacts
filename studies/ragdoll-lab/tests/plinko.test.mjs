import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSimulation as createRawSimulation } from '../dist/physics.js';
import * as CANNON from '../dist/vendor/cannon-es.js';

function createSimulation(profile = null) { const simulation = createRawSimulation(profile); simulation.configure({ autoGetUp: false }); return simulation; }

const goatProfile = JSON.parse(readFileSync(new URL('../dist/assets/goatman-ragdoll.json', import.meta.url), 'utf8'));
const advance = (simulation, seconds) => { simulation.setPaused(false); for (let tick = 0; tick < seconds * 120; tick++) simulation.step(1 / 120); };

test('Plinko builds a nonoverlapping five-row rack and resets without leaks', () => {
  const simulation = createSimulation();
  for (let repeat = 0; repeat < 3; repeat++) {
    simulation.reset('plinko');
    const snap = simulation.snapshot();
    assert.equal(snap.paused, true);
    assert.equal(snap.time, 0);
    assert.equal(snap.bodies, 208);
    assert.equal(snap.joints, 192);
    assert.equal(snap.totalTargets, 15);
    assert.equal(snap.releasedTargets, 0);
    assert.equal(simulation.instances.length, 16);
    assert.equal(simulation.staticBodies.length, 5);
    assert.equal(simulation.world.bodies.length, 213);
    assert.equal(simulation.world.constraints.length, 192);
    assert.equal(new Set(simulation.bodies.map(body => body.bodyKey)).size, 208);
    const targets = simulation.instances.filter(instance => instance.role === 'target');
    assert.ok(targets.every(instance => instance.held && instance.bodies.every(body => body.type === CANNON.Body.KINEMATIC)));
    const positions = targets.map(instance => instance.bodyById.get('pelvis').position);
    for (let a = 0; a < positions.length; a++) for (let b = a + 1; b < positions.length; b++) {
      assert.ok(positions[a].distanceTo(positions[b]) > 1.7, 'rack centers are separated');
    }
    assert.equal(simulation.world.broadphase.axisIndex, 1);
  }
});

test('Plinko starts with gravity alone, pauses without a shove, and gravity zero cannot release a target', () => {
  const simulation = createSimulation();
  simulation.reset('plinko');
  simulation.configure({ gravity: 0, impactBoost: 2 });
  const dropper = simulation.instances[0].bodyById.get('pelvis');
  assert.equal(dropper.velocity.length(), 0);
  assert.equal(simulation.step(1), 0);
  simulation.setPaused(false);
  assert.equal(dropper.velocity.length(), 0, 'starting adds no launch impulse');
  simulation.setPaused(true);
  simulation.setPaused(false);
  assert.equal(dropper.velocity.length(), 0, 'resuming adds no impulse');
  advance(simulation, 3);
  assert.equal(simulation.snapshot().releasedTargets, 0);
  simulation.reset('plinko');
  assert.equal(simulation.snapshot().settings.gravity, 0);
  assert.equal(simulation.snapshot().settings.impactBoost, 2);
});

for (const profile of [null, goatProfile]) {
  test(`${profile ? 'Goatman' : 'mannequin'} naturally cascades through at least three Plinko rows`, () => {
    const simulation = createSimulation(profile);
    simulation.reset('plinko');
    simulation.configure({ impactBoost: 0 });
    const releasedByTarget = new Set();
    for (const instance of simulation.instances.filter(item => item.role === 'target')) {
      for (const body of instance.bodies) body.addEventListener('collide', event => {
        if (!instance.held && event.body?.ragdollInstance?.role === 'target') releasedByTarget.add(instance.id);
      });
    }
    advance(simulation, 8);
    const released = simulation.instances.filter(instance => instance.role === 'target' && !instance.held);
    assert.ok(released.length >= 5, `${released.length} targets released`);
    assert.ok(new Set(released.map(instance => instance.row)).size >= 3, 'cascade reached multiple rows');
    assert.ok(releasedByTarget.size > 0, 'released target caused a secondary target contact');
  });
}

test('Plinko contact boost is one coherent downward and sideways change per target', () => {
  const natural = createSimulation();
  const boosted = createSimulation();
  for (const [simulation, impactBoost] of [[natural, 0], [boosted, 1]]) {
    simulation.reset('plinko');
    simulation.configure({ impactBoost });
    simulation.setPaused(false);
  }
  let target;
  for (let tick = 0; tick < 2 * 120; tick++) {
    natural.step(1 / 120);
    boosted.step(1 / 120);
    target = boosted.instances.find(instance => instance.role === 'target' && !instance.held);
    if (target) break;
  }
  assert.ok(target, 'a physical fall reached the first target');
  const counterpart = natural.instances.find(instance => instance.id === target.id);
  assert.equal(counterpart.held, false);
  const deltas = target.bodies.map((body, index) => body.velocity.vsub(counterpart.bodies[index].velocity));
  const first = deltas[0];
  assert.ok(first.y < -.5 && first.y >= -2.01, `downward kick ${first.y}`);
  assert.ok(Math.abs(first.x) > .1 && Math.abs(first.x) <= .81, `sideways kick ${first.x}`);
  assert.ok(Math.abs(first.z) < 1e-8);
  for (const delta of deltas) assert.ok(delta.distanceTo(first) < 1e-8, 'all parts receive equal velocity change');
  assert.equal(boosted.snapshot().releasedTargets, 1, 'first target counted once');
});

test('Goatman Plinko remains finite and connected through a 30-second cascade and profile switches cleanly', () => {
  const simulation = createSimulation(goatProfile);
  simulation.reset('plinko');
  simulation.setPaused(false);
  let peakJointGap = 0;
  for (let tick = 0; tick < 30 * 120; tick++) {
    simulation.step(1 / 120);
    if (tick % 12 === 0) for (const joint of simulation.joints) {
      const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
      const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
      peakJointGap = Math.max(peakJointGap, a.distanceTo(b));
    }
  }
  assert.ok(peakJointGap < .10, `transient collision stretch ${peakJointGap} m`);
  for (const body of simulation.bodies) {
    assert.ok([body.position.x, body.position.y, body.position.z, body.velocity.x, body.velocity.y, body.velocity.z].every(Number.isFinite), body.bodyKey);
    assert.ok(Math.abs(body.position.x) < 6 && body.position.y > -.5 && body.position.y < 22 && Math.abs(body.position.z) < 2, `${body.bodyKey} escaped board`);
  }
  for (const joint of simulation.joints) {
    const a = joint.bodyA.pointToWorldFrame(joint.pivotA);
    const b = joint.bodyB.pointToWorldFrame(joint.pivotB);
    assert.ok(a.distanceTo(b) < .03, `${joint.bodyA.bodyKey} to ${joint.bodyB.bodyKey} separated`);
  }
  const body = simulation.instances[0].bodyById.get('head');
  assert.equal(simulation.beginDrag(body, body.position.toArray()), true);
  simulation.reset('plinko');
  assert.equal(simulation.snapshot().dragging, false);
  assert.equal(simulation.world.bodies.length, 213);
  assert.equal(simulation.world.constraints.length, 192);
  simulation.setProfile(null);
  assert.equal(simulation.snapshot().profileId, 'mannequin');
  assert.equal(simulation.snapshot().paused, true);
  assert.equal(simulation.world.bodies.length, 213);
  simulation.reset('bowling');
  assert.equal(simulation.snapshot().totalTargets, 10);
  simulation.reset('plinko');
  assert.equal(simulation.snapshot().releasedTargets, 0);
});
