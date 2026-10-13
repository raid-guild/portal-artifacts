import test from 'node:test';
import assert from 'node:assert/strict';
import {clearPointerPulse, clearPointerResponse, pointerResponse, updatePointerPulse} from './pointer.mjs';

const freshBird = () => ({time: 0, ready: true, x: 0, y: 0});

test('arrival creates one local pulse and distinct, finite escape paths', () => {
  const pointer = {x: 0, y: 0, active: true};
  const pulseState = {cooldown: 0};
  const pulse = updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, 1 / 60);
  assert.deepEqual(pulse, {x: 0, y: 0});
  assert.equal(updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, 1 / 60), null);

  const centerA = freshBird(), centerB = freshBird(), nearby = freshBird(), far = freshBird();
  const a = pointerResponse(0, 0, pointer, 0, centerA, 1 / 60, pulse);
  const b = pointerResponse(0, 0, pointer, 1, centerB, 1 / 60, pulse);
  const c = pointerResponse(200, 0, pointer, 2, nearby, 1 / 60, pulse);
  pointerResponse(300, 0, pointer, 3, far, 1 / 60, pulse);
  assert.ok(a.every(Number.isFinite) && b.every(Number.isFinite) && c.every(Number.isFinite));
  assert.ok(Math.hypot(a[0], a[1]) <= 520.001);
  assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) > 100);
  assert.ok(c[0] > 0 && nearby.time > 0, 'nearby birds scatter outward');
  assert.equal(far.time, 0, 'distant birds stay outside the pulse');
});

test('disruption expires and a new arrival can trigger after cooldown', () => {
  const pointer = {x: 0, y: 0, active: true};
  const pulseState = {cooldown: 0};
  const state = freshBird();
  updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, .01);
  pointerResponse(0, 0, pointer, 0, state, .01);
  pointer.active = false;
  for (let step = 0; step < 150; step++) {
    updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, .02);
    pointerResponse(0, 0, pointer, 0, state, .02);
  }
  assert.equal(state.time, 0);
  assert.deepEqual(pointerResponse(0, 0, pointer, 0, state, .02), [0, 0, 0]);
  pointer.active = true;
  assert.deepEqual(updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, .01), {x: 0, y: 0});
});

test('mouse off clears an active pulse and each bird’s scattering memory', () => {
  const pointer = {x: 0, y: 0, active: true};
  const pulseState = {cooldown: 0};
  const state = freshBird();
  const pulse = updatePointerPulse(pointer, [{x: 0, y: 0}], pulseState, .01);
  pointerResponse(0, 0, pointer, 0, state, .01, pulse);
  pointer.active = false;
  clearPointerPulse(pulseState);
  clearPointerResponse(state);
  assert.equal(pulseState.cooldown, 0);
  assert.deepEqual(pointerResponse(0, 0, pointer, 0, state, .01), [0, 0, 0]);
});
