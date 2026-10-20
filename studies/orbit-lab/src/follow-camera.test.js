import test from 'node:test';
import assert from 'node:assert/strict';
import { followFrame, followPosition } from './follow-camera.js';

const bounds = { minX: -48, maxX: 48, minY: -27, maxY: 27 };

test('follow camera preserves a useful 35 by 21 frame at different aspect ratios', () => {
  assert.deepEqual(followFrame(35 / 21), { width: 35, height: 21 });
  assert.equal(followFrame(2).width, 42);
  assert.ok(followFrame(1.3).height > 21);
});

test('follow camera leads motion and keeps its view within the large room', () => {
  const frame = followFrame(35 / 21);
  const led = followPosition({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 0 }, bounds, frame, 0, true);
  assert.deepEqual(led, { x: 2, y: 0 });
  const edge = followPosition(led, { x: 47, y: 26 }, { x: 3, y: 4 }, bounds, frame, 0, true);
  assert.equal(edge.x, 48 - frame.width / 2 + .75);
  assert.equal(edge.y, 27 - frame.height / 2 + .75);
  const smooth = followPosition({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }, bounds, frame, .016);
  assert.ok(smooth.x > 0 && smooth.x < 10);
});

test('dot stays visible while skimming every edge and corner', () => {
  const frame = followFrame(35 / 21);
  const radius = .31;
  for (const xSign of [-1, 1]) for (const ySign of [-1, 1]) {
    const hero = { x: xSign * (48 - radius), y: ySign * (27 - radius) };
    const velocity = { x: xSign * 5, y: ySign * 5 };
    const center = followPosition({ x: 0, y: 0 }, hero, velocity, bounds, frame, 0, true);
    assert.ok(hero.x - radius >= center.x - frame.width / 2);
    assert.ok(hero.x + radius <= center.x + frame.width / 2);
    assert.ok(hero.y - radius >= center.y - frame.height / 2);
    assert.ok(hero.y + radius <= center.y + frame.height / 2);
  }
});
