import test from 'node:test';
import assert from 'node:assert/strict';
import { createMineGesture, MINE_HOLD_MS } from './mine-gesture.js';

test('quick release places a well; a completed hold drops one mine and consumes release', () => {
  const tap = createMineGesture();
  tap.begin(1, 10, 10, 0, true);
  assert.equal(tap.end(1, 11, 11, 100), 'tap');
  const hold = createMineGesture();
  hold.begin(2, 10, 10, 0, true);
  assert.equal(hold.hold(2, MINE_HOLD_MS - 1), false);
  assert.equal(hold.hold(2, MINE_HOLD_MS), true);
  assert.equal(hold.hold(2, MINE_HOLD_MS + 1), false);
  assert.equal(hold.end(2, 10, 10, MINE_HOLD_MS + 1), 'hold');
});

test('movement, cancellation, second pointer, and ineligible hold cannot create a mine', () => {
  const gesture = createMineGesture();
  gesture.begin(1, 10, 10, 0, true);
  assert.equal(gesture.begin(2, 10, 10, 0, true), false);
  gesture.move(1, 28, 10);
  assert.equal(gesture.hold(1, MINE_HOLD_MS), false);
  assert.equal(gesture.end(1, 28, 10, MINE_HOLD_MS), 'none');
  gesture.begin(3, 10, 10, 0, false);
  assert.equal(gesture.hold(3, MINE_HOLD_MS), false);
  assert.equal(gesture.end(3, 10, 10, MINE_HOLD_MS + 1), 'tap');
  gesture.begin(4, 10, 10, 0, true);
  gesture.cancel();
  assert.equal(gesture.end(4, 10, 10, 100), 'none');
});
