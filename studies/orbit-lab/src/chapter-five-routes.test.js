import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { getCampaignLevel, createCampaign, stepCampaign, campaignPointAllowed } from './campaign.js';
import { createEntityRuntime, entityAcceleration, releaseEntityHold, stepEntityRuntime, holdsCampaignLight } from './entity-runtime.js';
import { BLOB_RADIUS, SPEED_CAP, mazeAcceleration, capVelocity, sweptGoal } from './level.js';
import { STEP } from './physics.js';
import { createSoundGates, stepSoundGates } from './sound-gates.js';

function fly(id, waitSeconds = 0, steering = null) {
  const demo = getCampaignLevel(id), runtime = createEntityRuntime(demo.entities);
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
  let campaign = createCampaign(428, demo.settings), sound = createSoundGates(), outcome = 'timeout', time = 0;
  const released = new Set(), capturedAt = {}, captures = [], teleports = [];
  let activeWell = null, placedAt = -1;
  for (let tick = 0; tick < 65 / STEP; tick++) {
    time = tick * STEP;
    if (runtime.held && !released.has(runtime.held.id) && time - (capturedAt[runtime.held.id] ?? time) >= waitSeconds) {
      released.add(runtime.held.id);
      releaseEntityHold(runtime, body, time);
    }
    if (steering && teleports.length && !activeWell && time - teleports[0].at >= steering.delay) {
      assert.ok(campaignPointAllowed(steering, demo.level));
      assert.ok(demo.settings.maxActiveWells >= 1 && steering.duration <= demo.settings.wellLifetime);
      activeWell = { id: 1, x: steering.x, y: steering.y, strength: demo.settings.wellStrength,
        lifetime: demo.settings.wellLifetime, createdAt: time };
      placedAt = time;
    }
    const before = { x: body.position.x, y: body.position.y };
    const wells = activeWell && time - placedAt < steering.duration ? [activeWell] : [];
    const acceleration = mazeAcceleration(body.position, wells, time, 'fade', demo.level);
    const pull = entityAcceleration(body.position, demo.entities, runtime);
    body.applyForce(new CANNON.Vec3(acceleration.x + pull.x, acceleration.y + pull.y, 0));
    world.step(STEP);
    body.position.z = 0; body.velocity.z = 0;
    capVelocity(body.velocity, Math.max(SPEED_CAP, ...demo.entities.filter(entity => entity.type === 'impulse').map(entity => entity.speed)));
    const physicalEnd = { x: body.position.x, y: body.position.y };
    const result = stepEntityRuntime(runtime, demo.entities, before, body, time, STEP, demo.level.bounds, { walls: demo.level.walls });
    if (result.died) { outcome = `ember:${result.fatalEmber.id}`; break; }
    if (runtime.held && !captures.includes(runtime.held.id)) {
      captures.push(runtime.held.id);
      capturedAt[runtime.held.id] = time;
    }
    if (result.teleported) teleports.push({ at: time, x: body.position.x, y: body.position.y });
    sound = stepSoundGates(sound, demo.soundGates, before, result.teleported ? physicalEnd : body.position,
      time, result.teleported ? body.position : null).state;
    const campaignBefore = result.teleported ? { x: body.position.x, y: body.position.y } : before;
    campaign = stepCampaign(campaign, { before: campaignBefore, hero: body.position, dt: STEP, time,
      level: demo.level, config: demo.settings, extraEnergy: result.energyDelta, lightPaused: holdsCampaignLight(runtime) }).state;
    if (campaign.failed) { outcome = 'darkness'; break; }
    if (sweptGoal(campaignBefore, body.position, demo.level.goal) !== null) { outcome = 'goal'; break; }
  }
  return { outcome, time, gates: sound.mask, energy: campaign.energy, captures, teleports, wellsUsed: activeWell ? 1 : 0 };
}

test('Chapter Five ships three-chamber pursuit progression with three gates each', () => {
  for (const id of [13, 14, 15]) {
    const demo = getCampaignLevel(id);
    assert.equal(demo.chapter, 5);
    assert.deepEqual(demo.soundGates.map(gate => gate.id), [0, 1, 2]);
    assert.equal(demo.settings.randomRecharge, true);
    assert.ok(demo.entities.some(entity => entity.type === 'ember' && entity.motion === 'chaser'));
    assert.ok(demo.entities.filter(entity => entity.type === 'lightPickup').length >= 3);
  }
  assert.equal(getCampaignLevel(13).entities.filter(entity => entity.motion === 'chaser').length, 1);
  assert.ok(getCampaignLevel(14).entities.some(entity => entity.type === 'portal'));
  assert.ok(getCampaignLevel(15).entities.filter(entity => entity.motion === 'orbit').length >= 2);
});

test('each authored route reaches the portal with a gate, physical walls, light, and live chasers', () => {
  for (const [id, wait, steering] of [
    [13, 0, null],
    [14, 0, { x: 90, y: -2, delay: 0, duration: 3 }],
    [15, 1.1, { x: 126, y: -8, delay: 1.2, duration: 2 }],
  ]) {
    const run = fly(id, wait, steering);
    assert.equal(run.outcome, 'goal', `level ${id}: ${JSON.stringify(run)}`);
    assert.ok(run.gates > 0, `level ${id} did not qualify for progression`);
    assert.ok(run.energy > 0);
    assert.equal(run.wellsUsed, id === 13 ? 0 : 1);
    if (id >= 14) { assert.equal(run.teleports.length, 1); assert.ok(run.captures.length >= 1); }
  }
});

test('final crossing asks for orbital timing before escaping pursuit', () => {
  assert.match(fly(15, 0).outcome, /^ember:orbital-/);
  assert.notEqual(fly(15, 1.1).outcome, 'goal', 'timing alone cannot make the final turn');
  assert.notEqual(fly(14, 0).outcome, 'goal', 'the borrowed opening still needs a steered final turn');
});
