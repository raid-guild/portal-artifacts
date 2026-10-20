import test from 'node:test';
import assert from 'node:assert/strict';
import { createSoundGates, stepSoundGates, gateCount, gatePattern, validateBestGates, betterGateMask } from './sound-gates.js';
import { CAMPAIGN_LEVELS } from './campaign.js';

test('both levels offer three sound gates clear of the giant and portal', () => {
  for (const level of CAMPAIGN_LEVELS) {
    assert.deepEqual(level.soundGates.map(g => g.id), [0, 1, 2]);
    for (const gate of level.soundGates) {
      assert.equal(gate.radius, .9);
      assert.ok(Math.hypot(gate.x - level.level.goal.x, gate.y - level.level.goal.y) > gate.radius + level.level.goal.radius);
      if (level.giant) assert.ok(Math.hypot(gate.x - level.giant.x, gate.y - level.giant.y) > gate.radius + level.giant.radius);
    }
  }
});

test('swept gates acquire once and reset per attempt', () => {
  const gates = CAMPAIGN_LEVELS[0].soundGates;
  const first = stepSoundGates(createSoundGates(), gates, { x: 0, y: 0 }, { x: 20, y: 0 }, .1);
  assert.deepEqual(first.acquired, [0]);
  assert.equal(first.state.mask, 1);
  const repeat = stepSoundGates(first.state, gates, { x: 0, y: 0 }, { x: 20, y: 0 }, .11);
  assert.deepEqual(repeat.acquired, []);
  assert.equal(createSoundGates().mask, 0);
});

test('acquired layers play on one quarter-second clock only when time advances', () => {
  const gates = CAMPAIGN_LEVELS[0].soundGates;
  const first = stepSoundGates(createSoundGates(), gates, { x: 0, y: 0 }, { x: 20, y: 0 }, .1);
  assert.deepEqual(first.beats, [{ id: 0, beat: 0 }]);
  const same = stepSoundGates(first.state, gates, { x: 20, y: 0 }, { x: 20, y: 0 }, .1);
  assert.deepEqual(same.beats, []);
  const next = stepSoundGates(same.state, gates, { x: 20, y: 0 }, { x: 20, y: 0 }, .25);
  assert.deepEqual(next.beats, [{ id: 0, beat: 1 }]);
});

test('best pattern is a single-attempt mask, not a union, with stable ties', () => {
  assert.equal(gateCount(5), 2);
  assert.equal(gatePattern(5), 'bass + chime');
  assert.equal(betterGateMask(undefined, 1), 1);
  assert.equal(betterGateMask(1, 4), 1);
  assert.equal(betterGateMask(1, 6), 6);
  assert.deepEqual(validateBestGates({ 1: 5, 2: 9, 3: 7, fake: 2 }), { 1: 5 });
});
