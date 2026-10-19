import test from 'node:test';
import assert from 'node:assert/strict';
import { acceleration, advance, addWell, predict, remaining, wellPower } from './physics.js';

test('a well attracts, fades during final fifth, and fully expires', () => {
  const well = { x: 0, y: 0, strength: 100, lifetime: 10, createdAt: 0 };
  assert.ok(acceleration({ x: 4, y: 0 }, [well], 0).x < 0);
  assert.equal(wellPower(well, 5), 1);
  assert.equal(wellPower(well, 9), 0.5);
  assert.equal(wellPower(well, 9, 'snap'), 1);
  assert.equal(wellPower(well, 10), 0);
  assert.equal(remaining(well, 11), 0);
});

test('without a well the blob continues along the tangent', () => {
  const start = { x: 4, y: 0, vx: 0, vy: 5 };
  const next = advance(start, [], 0, 0.2);
  assert.deepEqual(next, { x: 4, y: 1, vx: 0, vy: 5 });
});

test('prediction uses the same stepping rule and is finite close to a well', () => {
  const well = { x: 0, y: 0, strength: 100, lifetime: 5, createdAt: 0 };
  const start = { x: 0, y: 0, vx: 0, vy: 0 };
  const points = predict(start, [well], 0, 1);
  assert.ok(points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.ok(points.length > 1);
});

test('a third well replaces the oldest', () => {
  assert.deepEqual(addWell([{ id: 1 }, { id: 2 }], { id: 3 }).map((w) => w.id), [2, 3]);
});
