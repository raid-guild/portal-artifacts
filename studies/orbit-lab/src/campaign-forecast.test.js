import test from 'node:test';
import assert from 'node:assert/strict';
import { predictCampaignPath } from './campaign-forecast.js';
import { createEntityRuntime } from './entity-runtime.js';

const level = { bounds: { minX: -12, maxX: 12, minY: -7, maxY: 7 }, spawn: { x: -9, y: 0 }, goal: { x: 10, y: 0, radius: 1 }, walls: [], spikes: [] };
const state = { x: -8, y: 0, vx: 4, vy: 0 };

test('campaign prediction stops at the next impulse without changing live runtime', () => {
  const entities = [{ id: 'push', type: 'impulse', x: -5, y: 0, radius: .5, direction: 90, speed: 8 }];
  const runtime = createEntityRuntime(entities);
  const snapshot = structuredClone(runtime);
  const result = predictCampaignPath(state, [], 0, level, entities, runtime);
  assert.equal(result.impact, 'interaction');
  assert.ok(result.points.at(-1).x < -4);
  assert.deepEqual(runtime, snapshot);
});

test('campaign prediction stops at moving lethal ember and at the exit', () => {
  const entities = [{ id: 'danger', type: 'ember', x: -5, y: 0, radius: .5, lethal: true, motion: 'fixed', gravity: 0 }];
  const danger = predictCampaignPath(state, [], 0, level, entities, createEntityRuntime(entities));
  assert.equal(danger.impact, 'ember');
  const exit = predictCampaignPath({ x: 4, y: 0, vx: 4, vy: 0 }, [], 0, level, [], createEntityRuntime([]));
  assert.equal(exit.impact, 'goal');
});

test('campaign prediction releases a held dot only in its clone', () => {
  const entities = [{ id: 'hold', type: 'stillness', x: -8, y: 0, radius: .5, captureTime: 10, releaseDirection: 90 }];
  const runtime = createEntityRuntime(entities);
  runtime.held = { id: 'hold', x: -8, y: 0, vx: 4, vy: 0, releaseDirection: 90 };
  const result = predictCampaignPath({ x: -8, y: 0, vx: 0, vy: 0 }, [], 0, level, entities, runtime, 1);
  assert.ok(result.points.at(-1).y > 0);
  assert.equal(runtime.held.id, 'hold');
});
