import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPAIGN, CAMPAIGN_DEMO, CAMPAIGN_LEVELS, campaignPointAllowed, canPlaceCampaignWell, createCampaign, getCampaignLevel, nextCampaignLevel, spawnCampaignPickup, stepCampaign } from './campaign.js';
import { canPlaceWell } from './level.js';

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

test('two levels share the chamber, and progression stops after the giant', () => {
  assert.deepEqual(CAMPAIGN_LEVELS.map(level => level.id), [1, 2]);
  assert.equal(getCampaignLevel(2).level.goal.x, 50);
  assert.equal(getCampaignLevel(2).level.bounds.maxX - getCampaignLevel(2).level.bounds.minX, 96);
  assert.equal(getCampaignLevel(2).giant.radius, 4);
  assert.equal(getCampaignLevel(2).giant.strength, 70);
  assert.equal(nextCampaignLevel(1).id, 2);
  assert.equal(nextCampaignLevel(2), null);
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
