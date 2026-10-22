import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPAIGN, CAMPAIGN_DEMO, CAMPAIGN_LEVELS, campaignPointAllowed, canPlaceCampaignWell, createCampaign, getCampaignLevel, nextCampaignLevel, spawnCampaignPickup, stepCampaign } from './campaign.js';
import { BLOB_RADIUS, canPlaceWell, firstImpact, mazeAcceleration } from './level.js';
import levelThree from './levels/campaign-3.json' with { type: 'json' };
import levelFour from './levels/campaign-4.json' with { type: 'json' };
import { compileLevelDocument } from './level-document.js';
import { orbitPeriod, orbitPosition } from './orbit.js';
import { STEP } from './physics.js';
import { segmentDistance } from './studies.js';

test('campaign placement budget supports unlimited total replacements and a finite later rule', () => {
  assert.equal(CAMPAIGN.maxActiveWells, 2);
  assert.equal(canPlaceCampaignWell(100), true);
  assert.equal(canPlaceCampaignWell(2, 2), false);
});

test('light drains in simulation steps, heartbeat accelerates, then fails after grace', () => {
  let state = { ...createCampaign(), energy: .001, pickups: [], nextSpawnAt: 100 };
  const lubTimes = [], dubTimes = [];
  for (let i = 0; i < (CAMPAIGN.graceSeconds + 1) * 60; i++) {
    const result = stepCampaign(state, { before: { x: 0, y: 0 }, hero: { x: 0, y: 0 }, dt: 1 / 60, time: i / 60 });
    for (const beat of result.heartbeat) (beat.part === 'lub' ? lubTimes : dubTimes).push(i / 60);
    state = result.state;
    if (result.failed) { assert.equal(result.heartbeat.length, 0); break; }
  }
  assert.equal(state.failed, true);
  assert.ok(lubTimes.length >= 7 && dubTimes.length >= 7);
  assert.ok(lubTimes[1] - lubTimes[0] > lubTimes.at(-1) - lubTimes.at(-2));
  assert.ok(dubTimes[0] > lubTimes[0] && dubTimes[0] < lubTimes[1]);
  const after = stepCampaign(state, { before: { x: 0, y: 0 }, hero: { x: 0, y: 0 }, dt: 1 / 60, time: CAMPAIGN.graceSeconds + 2 });
  assert.equal(after.failed, false);
  assert.deepEqual(after.heartbeat, []);
});

test('a swept pickup rescues light on the last grace tick', () => {
  const state = { ...createCampaign(), energy: 0, graceLeft: 1 / 120, pickups: [{ id: 9, x: 1, y: 0, createdAt: 0 }], nextSpawnAt: 100 };
  const result = stepCampaign(state, { before: { x: 0, y: 0 }, hero: { x: 2, y: 0 }, dt: 1 / 120, time: 1 });
  assert.equal(result.collected, 1);
  assert.equal(result.failed, false);
  assert.equal(result.state.graceLeft, CAMPAIGN.graceSeconds);
  assert.ok(result.state.energy > 0);
  assert.deepEqual(result.heartbeat, []);
});

test('owned moons each buy four seconds at darkness expiry, after pickup collection', () => {
  const input = { before: { x: 0, y: 0 }, hero: { x: 0, y: 0 }, dt: 1 / 120, time: 1, availableCompanions: 2 };
  let state = { ...createCampaign(), energy: 0, graceLeft: 1 / 120, pickups: [], nextSpawnAt: 100 };
  let result = stepCampaign(state, input);
  assert.equal(result.consumedCompanion, true);
  assert.equal(result.failed, false);
  assert.equal(result.state.energy, 0);
  assert.equal(result.state.graceLeft, 4);
  assert.equal(result.state.graceDuration, 4);
  result = stepCampaign({ ...result.state, graceLeft: 1 / 120 }, { ...input, availableCompanions: 1, time: 5 });
  assert.equal(result.consumedCompanion, true);
  assert.equal(result.state.graceLeft, 4);
  result = stepCampaign({ ...result.state, graceLeft: 1 / 120 }, { ...input, availableCompanions: 0, time: 9 });
  assert.equal(result.consumedCompanion, false);
  assert.equal(result.failed, true);
  const pickup = { id: 10, x: 1, y: 0, createdAt: 0 };
  state = { ...createCampaign(), energy: 0, graceLeft: 1 / 120, pickups: [pickup], nextSpawnAt: 100 };
  result = stepCampaign(state, { ...input, hero: { x: 2, y: 0 } });
  assert.equal(result.consumedCompanion, false);
  assert.equal(result.state.graceDuration, CAMPAIGN.graceSeconds);
  assert.ok(result.state.energy > 0);
});

test('companion sweeps collect one procedural recharge even when both moons and hero cross it', () => {
  const pickup = { id: 9, x: 1, y: 0, createdAt: 0 };
  const state = { ...createCampaign(), energy: 0, graceLeft: 1 / 120, pickups: [pickup], nextSpawnAt: 100 };
  const moon = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 }, radius: .16 };
  const result = stepCampaign(state, { before: { x: -4, y: 0 }, hero: { x: -3, y: 0 }, collectors: [moon, moon], dt: 1/120, time: 1 });
  assert.equal(result.collected, 1);
  assert.equal(result.failed, false);
  assert.equal(result.state.energy, CAMPAIGN.pickupGain);
  assert.equal(result.state.graceLeft, CAMPAIGN.graceSeconds);
  assert.equal(result.state.pickups.length, 0);
  const after = stepCampaign(result.state, { before: { x: 0, y: 0 }, hero: { x: 2, y: 0 }, collectors: [moon], dt: 1/120, time: 1 + 1/120 });
  assert.equal(after.collected, 0);
});

test('nearby recharge is reproducible from the run seed', () => {
  const input = { before: { x: 10, y: 0 }, hero: { x: 10, y: 0 }, dt: 1 / 120, time: 7 };
  assert.deepEqual(stepCampaign(createCampaign(12), input), stepCampaign(createCampaign(12), input));
});

test('bounded chamber has an empty interior and pickup retries stay inside at corners', () => {
  const level = CAMPAIGN_DEMO.level;
  assert.equal(level.bounds.maxX - level.bounds.minX, 96);
  assert.equal(level.bounds.maxY - level.bounds.minY, 54);
  assert.equal(level.walls.length, 4);
  for (const x of [-19, 75]) for (const y of [-26, 26]) {
    for (const seed of [1, 2, 3, 11, 428]) {
      const result = spawnCampaignPickup({ x, y }, { ...createCampaign(seed), pickups: [] }, level);
      assert.ok(result.point, `no legal pickup near ${x}, ${y}, seed ${seed}`);
      assert.equal(canPlaceWell(result.point, level), true);
    }
  }
});

test('twelve levels span four chapters', () => {
  assert.deepEqual(CAMPAIGN_LEVELS.map(level => level.id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(getCampaignLevel(2).level.goal.x, 50);
  assert.equal(getCampaignLevel(2).level.bounds.maxX - getCampaignLevel(2).level.bounds.minX, 96);
  assert.equal(getCampaignLevel(2).giant.radius, 4);
  assert.equal(getCampaignLevel(2).giant.strength, 70);
  assert.equal(nextCampaignLevel(1).id, 2);
  assert.equal(nextCampaignLevel(2).id, 3);
  assert.equal(nextCampaignLevel(3).id, 4);
  assert.equal(nextCampaignLevel(4).id, 5);
  assert.equal(nextCampaignLevel(5).id, 6);
  assert.equal(nextCampaignLevel(6).id, 7);
  assert.equal(nextCampaignLevel(7).id, 8);
  assert.equal(nextCampaignLevel(8).id, 9);
  assert.equal(nextCampaignLevel(9).id, 10);
  assert.equal(nextCampaignLevel(10).id, 11);
  assert.equal(nextCampaignLevel(11).id, 12);
  assert.equal(nextCampaignLevel(12), null);
  const third = getCampaignLevel(3);
  assert.equal(third.title, 'An opening in the dark');
  assert.equal(third.level.bounds.maxX - third.level.bounds.minX, 96);
  assert.equal(third.level.walls.length, 6);
  assert.equal(third.giant, undefined);
  assert.equal(third.entities.filter(entity => entity.type === 'companion').length, 3);
  assert.equal(third.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit').length, 2);
});

test('manual stillness holds light and last-embers time while pickups remain collectible', () => {
  const input = { before: { x: 0, y: 0 }, hero: { x: 0, y: 0 }, dt: 1, time: 1, lightPaused: true, availableCompanions: 1 };
  const initial = { ...createCampaign(), energy: 0, graceLeft: .5, pickups: [], nextSpawnAt: 100 };
  const held = stepCampaign(initial, input);
  assert.equal(held.state.energy, 0);
  assert.equal(held.state.graceLeft, .5);
  assert.equal(held.consumedCompanion, false);
  assert.deepEqual(held.heartbeat, []);
  const resumed = stepCampaign(held.state, { ...input, lightPaused: false });
  assert.equal(resumed.consumedCompanion, true);
  assert.equal(resumed.state.graceLeft, 4);
  const pickup = { ...initial, energy: .5, pickups: [{ id: 1, x: 1, y: 0, createdAt: 0 }] };
  const collected = stepCampaign(pickup, { ...input, hero: { x: 2, y: 0 } });
  assert.equal(collected.collected, 1);
  assert.equal(collected.state.energy, .8);
});

test('fourth authored room compiles with a manual waiting place and opposite twelve-second orbits', () => {
  const { level, entities } = compileLevelDocument(levelFour);
  assert.equal(level.bounds.maxX - level.bounds.minX, 96);
  assert.equal(level.bounds.maxY - level.bounds.minY, 54);
  const wait = entities.find(entity => entity.type === 'stillness');
  assert.deepEqual([wait.x, wait.y, wait.manualRelease], [16, 0, true]);
  const orbits = entities.filter(entity => entity.type === 'ember');
  assert.equal(orbits.length, 2);
  for (const ember of orbits) {
    assert.equal(ember.gravity, 0);
    assert.ok(Math.abs(orbitPeriod(ember) - 12) < .001);
    assert.ok(Math.abs(ember.x - 24) < .01 && Math.abs(ember.y) < .01);
    assert.ok(ember.orbitRadius + ember.radius < 6);
  }
  const first = orbitPosition(orbits[0], 0), second = orbitPosition(orbits[1], 0);
  assert.ok(Math.abs((first.x + second.x) / 2 - 24) < .001);
  assert.ok(Math.abs(first.y + second.y) < .001);
  assert.deepEqual(entities.filter(entity => entity.type === 'soundGate').map(entity => entity.slot), [0, 1, 2]);
  assert.equal(entities.filter(entity => entity.type === 'companion').length, 2);
  assert.equal(entities.filter(entity => entity.type === 'lightPickup').length, 3);
  assert.equal(level.walls.length, 6);
});

test('straight releases from Level 4 waiting place have distinct safe and unsafe timing windows', () => {
  const demo = getCampaignLevel(4), orbits = demo.entities.filter(entity => entity.type === 'ember');
  // A free hero has zero linear damping in game. Vary speed around the authored
  // 3 u/s approach to cover small changes from the portal pull or player wells.
  function releaseAt(phase, speed) {
    const hero = { x: 16, y: 0, vx: speed, vy: 0 };
    for (let i = 0; i < 2400; i++) {
      const time = phase + i * STEP, before = { x: hero.x, y: hero.y };
      const a = mazeAcceleration(before, [], time, 'fade', demo.level);
      hero.vx += a.x * STEP; hero.vy += a.y * STEP;
      hero.x += hero.vx * STEP; hero.y += hero.vy * STEP;
      for (const ember of orbits) {
        const prior = orbitPosition(ember, time), next = orbitPosition(ember, time + STEP);
        const relativeBefore = { x: before.x - prior.x, y: before.y - prior.y };
        const relativeAfter = { x: hero.x - next.x, y: hero.y - next.y };
        if (segmentDistance(relativeBefore, relativeAfter, { x: 0, y: 0 }) <= ember.radius + BLOB_RADIUS) return 'ember';
      }
      const impact = firstImpact(before, hero, demo.level);
      if (impact) return impact.type;
    }
    return 'timeout';
  }
  for (const speed of [2.7, 3, 3.3]) {
    assert.equal(releaseAt(0, speed), 'goal', `safe opening at ${speed} u/s`);
    assert.equal(releaseAt(4.5, speed), 'ember', `unsafe opening at ${speed} u/s`);
  }
});

test('giant excludes wells and deterministic recharge embers from its lethal circle', () => {
  const level = getCampaignLevel(2).level;
  assert.equal(campaignPointAllowed({ x: 28, y: 0 }, level), false);
  assert.equal(campaignPointAllowed({ x: 34, y: 0 }, level), true);
  for (const seed of [1, 2, 3, 11, 428]) {
    const result = spawnCampaignPickup({ x: 25, y: 0 }, { ...createCampaign(seed), pickups: [] }, level);
    assert.ok(result.point);
    assert.ok(Math.hypot(result.point.x - 28, result.point.y) >= 4 + CAMPAIGN.pickupRadius + .31);
  }
});

test('third authored level compiles with a clear broad S and bounded orbit envelopes', () => {
  const { level, entities } = compileLevelDocument(levelThree);
  assert.equal(level.bounds.maxX - level.bounds.minX, 96);
  assert.equal(level.bounds.maxY - level.bounds.minY, 54);
  assert.deepEqual(entities.filter(entity => entity.type === 'soundGate').map(entity => entity.slot), [0, 1, 2]);
  const orbits = entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit');
  assert.equal(orbits.length, 2);
  for (const orbit of orbits) {
    assert.equal(orbit.gravity, 0);
    assert.equal(orbit.orbitRadius, 3.5);
    assert.ok(orbit.x - orbit.orbitRadius - orbit.radius > level.bounds.minX);
    assert.ok(orbit.x + orbit.orbitRadius + orbit.radius < level.bounds.maxX);
    assert.ok(orbit.y - orbit.orbitRadius - orbit.radius > level.bounds.minY);
    assert.ok(orbit.y + orbit.orbitRadius + orbit.radius < level.bounds.maxY);
    for (const gate of entities.filter(entity => entity.type === 'soundGate'))
      assert.ok(Math.hypot(orbit.x - gate.x, orbit.y - gate.y) > orbit.orbitRadius + orbit.radius + gate.radius);
  }
  assert.ok(level.walls.some(wall => wall.x < 20 && wall.y < 0));
  assert.ok(level.walls.some(wall => wall.x > 30 && wall.y > 0));
});


test('fifth authored level preserves its lanes, orbital groups, gates and directed rest', () => {
  const fifth = getCampaignLevel(5);
  assert.equal(fifth.chapter, 2);
  assert.equal(fifth.title, 'Following the echo');
  assert.equal(fifth.document.id, 'campaign-5');
  assert.equal(fifth.entities.length, 34);
  assert.equal(fifth.document.wallPaths.length, 4);
  assert.equal(fifth.level.walls.length, 20);
  assert.equal(fifth.level.spawn.x, -13);
  assert.equal(fifth.level.spawn.y, 21);
  assert.equal(fifth.level.goal.x, 63);
  assert.equal(fifth.level.goal.y, -18);
  assert.deepEqual(fifth.soundGates.map(gate => gate.id), [0, 1, 2]);
  assert.equal(fifth.entities.filter(entity => entity.type === 'companion').length, 3);
  assert.equal(fifth.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit').length, 15);
  const rest = fifth.entities.find(entity => entity.type === 'stillness');
  assert.equal(rest.captureTime, 3);
  assert.deepEqual([rest.x, rest.y, rest.manualRelease, rest.releaseDirection], [60, 20, true, 270]);
  assert.equal(fifth.entities.find(entity => entity.id === 'impulse-6').direction, 270);
});

test('sixth authored level preserves its walls, orbits, directed holds, and gates', () => {
  const sixth = getCampaignLevel(6);
  assert.equal(sixth.chapter, 2);
  assert.equal(sixth.title, 'The same rhythm');
  assert.equal(sixth.document.id, 'campaign-6');
  assert.equal(sixth.entities.length, 24);
  assert.equal(sixth.document.wallPaths.length, 2);
  assert.equal(sixth.level.walls.length, 14);
  assert.deepEqual(sixth.soundGates.map(gate => gate.id), [0, 1, 2]);
  assert.equal(sixth.entities.filter(entity => entity.type === 'companion').length, 3);
  assert.equal(sixth.entities.filter(entity => entity.type === 'ember' && entity.motion === 'orbit').length, 6);
  assert.equal(sixth.entities.filter(entity => entity.type === 'ember' && entity.motion === 'fixed').length, 2);
  assert.deepEqual(sixth.entities.filter(entity => entity.type === 'stillness').map(entity => [entity.manualRelease, entity.releaseDirection]), [[true, 0], [true, 0]]);
  assert.deepEqual(sixth.entities.filter(entity => entity.type === 'impulse' && entity.direction === 140).map(entity => entity.id), ['impulse-3', 'impulse-4']);
});
