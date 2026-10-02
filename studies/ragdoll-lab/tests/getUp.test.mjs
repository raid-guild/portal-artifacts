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

test('recovery preference survives scene and character resets without changing target counts', () => {
  const sim = createSimulation();
  sim.configure({ autoGetUp: false });
  sim.reset('bowling');
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  assert.equal(sim.snapshot().releasedTargets, 0);
  assert.equal(sim.snapshot().totalTargets, 10);
  sim.setProfile(profiles[2]);
  sim.reset('plinko');
  assert.equal(sim.snapshot().settings.autoGetUp, false);
  assert.equal(sim.snapshot().releasedTargets, 0);
  assert.equal(sim.snapshot().totalTargets, 15);
  assert.equal(sim.snapshot().standingCount, 0);
  assert.ok(sim.instances.filter(instance => instance.held).every(instance => instance.state === 'ragdoll'));
});
