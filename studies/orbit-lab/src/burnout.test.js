import test from 'node:test';
import assert from 'node:assert/strict';
import { createBurnout, stepBurnout, spawnPickup, cameraFrame, MAX_PICKUPS } from './burnout.js';
import { getDemo } from './demos.js';

const demo = getDemo('burnout');
const constant = () => 0.5;

test('light drains in simulation time, clamps, and a swept pickup restores it once', () => {
  let state = createBurnout(0, constant);
  let result = stepBurnout(state, { before: { x: -10, y: 0 }, hero: { x: -10, y: 0 }, level: demo.level, dt: 10, time: 1, rng: constant });
  assert.ok(Math.abs(result.state.energy - 0.42) < 1e-8);
  state = { ...result.state, energy: 0.1, pickups: [{ id: 1, x: -8, y: 0, createdAt: 1 }], nextSpawnAt: 100 };
  result = stepBurnout(state, { before: { x: -10, y: 0 }, hero: { x: -6, y: 0 }, level: demo.level, dt: 1, time: 2, rng: constant });
  assert.equal(result.collected, 1);
  assert.ok(result.state.energy > 0.38 && result.state.energy < 0.39);
  assert.equal(result.state.pickups.length, 0);
  assert.equal(stepBurnout(result.state, { before: { x: -6, y: 0 }, hero: { x: -6, y: 0 }, level: demo.level, dt: 100, time: 102, rng: constant }).state.energy, 0.06);
});

test('gate uses hysteresis and waits until hero leaves its rectangle', () => {
  let state = { ...createBurnout(0, constant), energy: 0.34, nextSpawnAt: 100 };
  let result = stepBurnout(state, { before: { x: 5, y: 0 }, hero: { x: 5, y: 0 }, level: demo.level, dt: 0, time: 0, rng: constant });
  assert.equal(result.state.gateOpen, true);
  assert.equal(result.state.pendingClose, true);
  result = stepBurnout(result.state, { before: { x: 5, y: 0 }, hero: { x: 2, y: 0 }, level: demo.level, dt: 0, time: 0, rng: constant });
  assert.equal(result.state.gateOpen, false);
  result = stepBurnout({ ...result.state, energy: 0.5 }, { before: { x: 2, y: 0 }, hero: { x: 2, y: 0 }, level: demo.level, dt: 0, time: 0, rng: constant });
  assert.equal(result.state.gateOpen, false);
  result = stepBurnout({ ...result.state, energy: 0.51 }, { before: { x: 2, y: 0 }, hero: { x: 2, y: 0 }, level: demo.level, dt: 0, time: 0, rng: constant });
  assert.equal(result.state.gateOpen, true);
});

test('spawn is bounded, on the hero side of a closed gate, and respects cap and TTL', () => {
  const hero = { x: -8, y: 0 };
  const pickup = spawnPickup(hero, demo.level, [], false, constant);
  assert.ok(pickup && pickup.x < 5);
  assert.equal(spawnPickup({ x: 1000, y: 1000 }, demo.level, [], false, constant), null);
  const full = { ...createBurnout(0, constant), pickups: Array.from({ length: MAX_PICKUPS }, (_, i) => ({ id: i, x: -11 + i, y: 5, createdAt: 0 })), nextSpawnAt: 0 };
  const result = stepBurnout(full, { before: hero, hero, level: demo.level, dt: 0, time: 1, rng: constant });
  assert.equal(result.state.pickups.length, MAX_PICKUPS);
  const expired = stepBurnout({ ...full, nextSpawnAt: 100 }, { before: hero, hero, level: demo.level, dt: 0, time: 18, rng: constant });
  assert.equal(expired.state.pickups.length, 0);
});

test('wide camera fits the full bounds with margin in landscape and portrait', () => {
  const wide = getDemo('wideworld').level;
  assert.equal(wide.bounds.maxX - wide.bounds.minX, 96);
  assert.equal(wide.bounds.maxY - wide.bounds.minY, 54);
  assert.equal(wide.goal.radius, 2);
  for (const aspect of [16 / 9, 9 / 16]) {
    const frame = cameraFrame(wide.bounds, aspect);
    assert.ok(frame.width >= 99 && frame.height >= 57);
  }
});
