import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { CAMPAIGN_LEVELS, campaignPointAllowed, createCampaign, getCampaignLevel, stepCampaign } from './campaign.js';
import { createEntityRuntime, entityAcceleration, holdsCampaignLight, releaseEntityHold, stepEntityRuntime } from './entity-runtime.js';
import { BLOB_RADIUS, SPEED_CAP, capVelocity, mazeAcceleration, sweptGoal } from './level.js';
import { orbitPeriod, orbitPosition } from './orbit.js';
import { remaining, STEP } from './physics.js';
import { createSoundGates, stepSoundGates } from './sound-gates.js';

// The introductory seventh level remains a simple study. Its reference
// path does not contact a wall, so a free-body replay checks its timing window.
function flySeven(releaseWait) {
  const demo = getCampaignLevel(7), runtime = createEntityRuntime(demo.entities);
  const body = { position: { x: demo.level.spawn.x, y: demo.level.spawn.y }, velocity: { x: demo.level.spawn.vx, y: demo.level.spawn.vy } };
  const captures = [], released = new Set();
  let light = createCampaign(428, demo.settings), sound = createSoundGates();
  for (let tick = 0; tick < 7200; tick++) {
    const time = tick * STEP, before = { ...body.position };
    const base = mazeAcceleration(before, [], time, 'fade', demo.level), extra = entityAcceleration(before, demo.entities, runtime);
    body.velocity.x += (base.x + extra.x) * STEP;
    body.velocity.y += (base.y + extra.y) * STEP;
    capVelocity(body.velocity, SPEED_CAP);
    body.position.x += body.velocity.x * STEP;
    body.position.y += body.velocity.y * STEP;
    const result = stepEntityRuntime(runtime, demo.entities, before, body, time, STEP, demo.level.bounds);
    if (result.died) return { outcome: 'ember', captures, gates: sound.mask };
    if (runtime.held && !released.has(runtime.held.id)) {
      const id = runtime.held.id;
      if (!captures.length) captures.push({ id, at: time });
      if (time - captures[0].at >= releaseWait) { releaseEntityHold(runtime, body, time); released.add(id); }
    }
    sound = stepSoundGates(sound, demo.soundGates, before, body.position, time).state;
    light = stepCampaign(light, { before, hero: body.position, dt: STEP, time, level: demo.level, config: demo.settings, extraEnergy: result.energyDelta, lightPaused: holdsCampaignLight(runtime) }).state;
    if (light.failed) return { outcome: 'darkness', captures, gates: sound.mask };
    if (sweptGoal(before, body.position, demo.level.goal) !== null) return { outcome: 'goal', captures, gates: sound.mask };
  }
  return { outcome: 'timeout', captures, gates: sound.mask };
}

// A fixed input tape uses exactly the same Cannon body, contact material,
// force application, velocity cap, entity order and resource step as main.js.
// Walls bounce and slide; touching one does not end a run. All placed wells
// satisfy the game's placement rule and expire or are removed normally.
const ROUTES = {
  8: {
    doors: [[22, -14], [66, 14], [104, -12]],
    actions: [
      [9.9, 'place', 43, -5], [10.81, 'clear'],
      [15.2, 'place', 84, 7], [16.5, 'clear'],
      [23.5, 'place', 91, -4], [26, 'clear'],
      [29, 'place', 99, -12], [30.5, 'clear'],
    ],
    captures: ['approach-hold', 'first-catch', 'middle-eclipse', 'second-catch'],
  },
  9: {
    doors: [[20, -20], [60, 8], [100, -16], [136, 8]],
    actions: [
      [9.3, 'place', 39, -10], [10.2, 'clear'],
      [15.2, 'place', 81, -4], [16.2, 'clear'],
      [21, 'place', 121, -5], [22, 'clear'],
    ],
    captures: ['first-eclipse', 'first-catch', 'second-catch', 'final-hold'],
  },
};

function physicalFlight(id, { steer = true, firstWait = 0, maxSeconds = 70 } = {}) {
  const demo = getCampaignLevel(id), route = ROUTES[id], runtime = createEntityRuntime(demo.entities);
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
  const blobMaterial = new CANNON.Material('blob'), wallMaterial = new CANNON.Material('wall');
  world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: .1 }));
  const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
  body.position.set(demo.level.spawn.x, demo.level.spawn.y, 0);
  body.velocity.set(demo.level.spawn.vx, demo.level.spawn.vy, 0);
  world.addBody(body);
  for (const rect of demo.level.walls) {
    const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, .7)) });
    wall.position.set(rect.x, rect.y, 0);
    if (rect.angle) wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rect.angle);
    world.addBody(wall);
  }
  let wells = [], sound = createSoundGates(), light = createCampaign(428, demo.settings), nextAction = 0, nextWellId = 0, peakSpeed = 0;
  const captures = [], crossedDoors = [], released = new Set();
  const finish = (outcome, time, detail = null) => ({ outcome, time, detail, captures, crossedDoors, gates: sound.mask, energy: light.energy, peakSpeed, wellsUsed: nextWellId });
  for (let tick = 0; tick < maxSeconds / STEP; tick++) {
    const time = tick * STEP;
    wells = wells.filter(well => remaining(well, time) > 0);
    while (steer && nextAction < route.actions.length && time >= route.actions[nextAction][0] + firstWait) {
      const [, action, x, y] = route.actions[nextAction++];
      if (action === 'clear') wells = [];
      else {
        assert.ok(campaignPointAllowed({ x, y }, demo.level), `level ${id} has an illegal well at ${x},${y}`);
        wells = [...wells, { id: ++nextWellId, x, y, strength: demo.settings.wellStrength, lifetime: demo.settings.wellLifetime, createdAt: time }].slice(-demo.settings.maxActiveWells);
      }
    }
    if (runtime.held && !released.has(runtime.held.id)) {
      const id = runtime.held.id, at = captures.find(capture => capture.id === id)?.at ?? time;
      if (time - at >= (captures[0]?.id === id ? firstWait : 0)) { releaseEntityHold(runtime, body, time); released.add(id); }
    }
    const before = { x: body.position.x, y: body.position.y };
    const force = mazeAcceleration(body.position, wells, time, 'fade', demo.level), pull = entityAcceleration(body.position, demo.entities, runtime);
    body.applyForce(new CANNON.Vec3(force.x + pull.x, force.y + pull.y, 0));
    world.step(STEP);
    body.position.z = 0; body.velocity.z = 0;
    capVelocity(body.velocity, Math.max(SPEED_CAP, ...demo.entities.filter(entity => entity.type === 'impulse').map(entity => entity.speed)));
    peakSpeed = Math.max(peakSpeed, Math.hypot(body.velocity.x, body.velocity.y));
    const result = stepEntityRuntime(runtime, demo.entities, before, body, time, STEP, demo.level.bounds);
    if (result.died) return finish('ember', time, result.fatalEmber?.id);
    if (runtime.held && !captures.some(capture => capture.id === runtime.held.id)) captures.push({ id: runtime.held.id, at: time });
    sound = stepSoundGates(sound, demo.soundGates, before, body.position, time).state;
    light = stepCampaign(light, { before, hero: body.position, dt: STEP, time, level: demo.level, config: demo.settings, extraEnergy: result.energyDelta, lightPaused: holdsCampaignLight(runtime) }).state;
    if (light.failed) return finish('darkness', time);
    for (const [x, y] of route.doors) {
      if (before.x < x && body.position.x >= x && !crossedDoors.some(door => door.x === x)) crossedDoors.push({ x, y: body.position.y, intendedY: y });
    }
    if (sweptGoal(before, body.position, demo.level.goal) !== null) return finish('goal', time);
  }
  return finish('timeout', maxSeconds);
}

test('chapter three starts with a readable single-rule level', () => {
  assert.deepEqual(CAMPAIGN_LEVELS.slice(6).map(level => [level.id, level.chapter]), [[7, 3], [8, 3], [9, 3]]);
  assert.equal(flySeven(3.25).outcome, 'goal');
  assert.equal(flySeven(0).outcome, 'ember');
  for (const delta of [-.1, .1]) assert.equal(flySeven(3.25 + delta).outcome, 'goal');
});

test('levels eight and nine are legal offset mazes with visible recharge and safe waiting places', () => {
  for (const id of [8, 9]) {
    const demo = getCampaignLevel(id), route = ROUTES[id];
    assert.deepEqual(demo.soundGates.map(gate => gate.id), [0, 1, 2]);
    assert.equal(demo.settings.randomRecharge, false);
    assert.ok(demo.level.bounds.maxX - demo.level.bounds.minX >= (id === 8 ? 140 : 170));
    assert.ok(demo.entities.filter(entity => entity.type === 'lightPickup').length >= (id === 8 ? 4 : 4));
    assert.ok(demo.entities.filter(entity => entity.type === 'ember' && entity.gravity > 0).length >= 3);
    assert.ok(demo.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit').length >= (id === 8 ? 4 : 8));
    for (const hold of demo.entities.filter(entity => ['eclipse', 'stillness'].includes(entity.type))) {
      assert.equal(hold.manualRelease, true);
      for (const ember of demo.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit')) {
        assert.ok(Math.hypot(hold.x - ember.x, hold.y - ember.y) > ember.radius + ember.orbitRadius + BLOB_RADIUS + .5, `${id} ${hold.id} is inside ${ember.id}'s danger envelope`);
      }
    }
    for (const ember of demo.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit')) {
      assert.equal(ember.gravity, 0);
      assert.ok(orbitPeriod(ember) > 4 && orbitPeriod(ember) < 8);
      assert.ok(Math.hypot(orbitPosition(ember, 0).x - demo.level.spawn.x, orbitPosition(ember, 0).y - demo.level.spawn.y) > ember.radius + BLOB_RADIUS);
    }
  }
});

test('realistic inputs steer through every door, collect the three gates, and finish with light', () => {
  for (const id of [8, 9]) {
    const route = ROUTES[id], result = physicalFlight(id);
    assert.equal(result.outcome, 'goal', `level ${id}: ${JSON.stringify(result)}`);
    assert.deepEqual(result.captures.map(capture => capture.id), route.captures);
    assert.deepEqual(result.crossedDoors.map(door => door.x), route.doors.map(door => door[0]));
    for (const door of result.crossedDoors) assert.ok(Math.abs(door.y - door.intendedY) < 5, `level ${id} crossed door ${door.x} too far from its opening`);
    assert.equal(result.gates, 7, `level ${id} missed a sound gate`);
    assert.ok(result.energy > .1);
    assert.ok(result.peakSpeed >= 12, `level ${id} did not use its fast lanes`);
    assert.equal(result.wellsUsed, id === 8 ? 4 : 3);
    assert.notEqual(physicalFlight(id, { steer: false }).outcome, 'goal', `level ${id} does not demand a diversion`);
  }
});

test('the first orbital crossing has a fair opening, a dangerous phase, and a repeatable eclipse cycle', () => {
  for (const id of [8, 9]) {
    for (const delay of [.1, .2]) {
      const near = physicalFlight(id, { firstWait: delay });
      assert.equal(near.outcome, 'goal', `level ${id} timing window is too narrow at ${delay}s: ${JSON.stringify(near)}`);
    }
    const result = physicalFlight(id, { steer: false, firstWait: 3, maxSeconds: 15 });
    assert.equal(result.outcome, 'ember', `level ${id} ignored timing: ${JSON.stringify(result)}`);
    assert.match(result.detail, /^first-moon-/);
    assert.ok(result.time < 12);
  }
  // One complete orbit later, the safe phase returns after Eclipse has gone
  // fully dark; the waiting place still releases with its stored momentum.
  const darkWait = physicalFlight(9, { steer: false, firstWait: 6.9, maxSeconds: 18 });
  assert.ok(darkWait.captures.some(capture => capture.id === 'first-catch'), JSON.stringify(darkWait));
});
