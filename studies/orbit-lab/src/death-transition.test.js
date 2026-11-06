import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeathTransition, stepDeathTransition } from './death-transition.js';

test('death transition fades the light and emits exactly one completion', () => {
  let state = createDeathTransition();
  let tick = stepDeathTransition(state, 0.15);
  state = tick.transition;
  assert.ok(tick.fade < 1 && tick.fade > 0);
  assert.ok(tick.ring > 0);
  assert.ok(tick.radius > 0.3 && tick.radius < 4);
  assert.equal(tick.finished, false);
  tick = stepDeathTransition(state, 1);
  assert.equal(tick.finished, true);
  assert.equal(tick.fade, 0);
  assert.equal(tick.ring, 0);
  assert.equal(stepDeathTransition(tick.transition, 1).finished, false);
});

test('reduced motion uses a short fade without a ripple', () => {
  const state = createDeathTransition(true);
  const tick = stepDeathTransition(state, 0.2);
  assert.equal(tick.finished, true);
  assert.equal(tick.ring, 0);
  assert.equal(tick.radius, 0);
});

test('cancellation drops transition state before a later run', () => {
  let state = stepDeathTransition(createDeathTransition(), 0.3).transition;
  state = null;
  assert.equal(stepDeathTransition(state, 1).finished, false);
  assert.equal(createDeathTransition().elapsed, 0);
});
