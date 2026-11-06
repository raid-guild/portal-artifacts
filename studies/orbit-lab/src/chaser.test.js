import test from 'node:test';
import assert from 'node:assert/strict';
import { stepChaser } from './chaser.js';
import { circleHitsRect } from './level.js';
import { createEntityRuntime, stepEntityRuntime } from './entity-runtime.js';

const bounds = { minX: -10, maxX: 10, minY: -10, maxY: 10 };
const ember = { id: 'pursuer', type: 'ember', x: -4, y: 0, radius: .5, speed: 2.3, gravity: 0, lethal: true, motion: 'chaser' };

test('a chaser rounds a nearby wall end without crossing its solid body', () => {
  for (const wall of [{ id: 'vertical', x: 0, y: 0, w: 1, h: 8 }, { id: 'angled', x: 0, y: 0, w: 1, h: 8, angle: Math.PI / 4 }]) {
    const item = { x: -4, y: 0, vx: 0, vy: 0 };
    for (let tick = 0; tick < 18 * 120; tick++) {
      stepChaser(item, ember, { x: 4, y: 0 }, 1 / 120, bounds, [wall]);
      assert.equal(circleHitsRect(item, ember.radius, wall), false, `inside ${wall.id} on tick ${tick}`);
      assert.ok(Math.hypot(item.vx, item.vy) <= ember.speed + 1e-9);
    }
    assert.ok(item.x > 1, `${wall.id}: ${JSON.stringify(item)}`);
  }
});

test('a sealed divider can strand a chaser on the opposite side', () => {
  const wall = { id: 'sealed', x: 0, y: 0, w: 1, h: 20 };
  const item = { x: -4, y: 0, vx: 0, vy: 0 };
  for (let tick = 0; tick < 20 * 120; tick++) stepChaser(item, ember, { x: 4, y: 0 }, 1 / 120, bounds, [wall]);
  assert.ok(item.x < -.99, JSON.stringify(item));
  assert.equal(circleHitsRect(item, ember.radius, wall), false);
});

test('unlabelled study walls have stable, distinct pursuit identities', () => {
  const walls = [{ x: 0, y: 0, w: 1, h: 8 }, { x: 5, y: 0, w: 1, h: 8 }];
  const item = { x: -4, y: 0, vx: 0, vy: 0, rounding: null };
  stepChaser(item, ember, { x: 4, y: 0 }, 1 / 120, bounds, walls);
  const firstKey = item.rounding.id;
  assert.ok(firstKey);
  const restored = structuredClone(item);
  stepChaser(restored, ember, { x: 4, y: 0 }, 1 / 120, bounds, structuredClone(walls));
  assert.equal(restored.rounding.id, firstKey);
  item.x = 2; item.rounding = null;
  stepChaser(item, ember, { x: 8, y: 0 }, 1 / 120, bounds, walls);
  assert.notEqual(item.rounding.id, firstKey);
});

test('a player portal changes only the hero location; the chaser stays behind', () => {
  const entities = [ember,
    { id: 'near', type: 'portal', x: -2, y: 0, radius: 1, pairId: 'cross', exitDirection: 180 },
    { id: 'far', type: 'portal', x: 6, y: 0, radius: 1, pairId: 'cross', exitDirection: 0 }];
  const runtime = createEntityRuntime(entities), body = { position: { x: -2, y: 0 }, velocity: { x: 4, y: 0 } };
  const result = stepEntityRuntime(runtime, entities, { x: -3, y: 0 }, body, 1, 1 / 120, bounds, { walls: [{ id: 'sealed', x: 0, y: 0, w: 1, h: 20 }] });
  assert.equal(result.teleported, true);
  assert.ok(body.position.x > 6);
  assert.ok(runtime.items.pursuer.x < 0);
});
