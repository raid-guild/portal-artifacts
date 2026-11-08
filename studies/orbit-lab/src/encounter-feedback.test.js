import test from 'node:test';
import assert from 'node:assert/strict';
import { createEncounterFeedback, recordEncounterFeedback, stepEncounterFeedback } from './encounter-feedback.js';

test('only ram or measured exposure produces feedback, with independent mine cue throttles', () => {
  let state = createEncounterFeedback();
  let result = recordEncounterFeedback(state, { time: 1 });
  assert.deepEqual(result.cues, []);
  state = result.state;
  result = recordEncounterFeedback(state, { ram: true, heroExposureSeconds: .016, bossExposureSeconds: .016, time: 2 });
  assert.deepEqual(result.cues, ['ram', 'heroSizzle', 'bossSizzle']);
  state = result.state;
  result = recordEncounterFeedback(state, { heroExposureSeconds: .016, bossExposureSeconds: .016, time: 2.1 });
  assert.deepEqual(result.cues, []);
  state = result.state;
  result = recordEncounterFeedback(state, { heroExposureSeconds: .016, time: 2.21 });
  assert.deepEqual(result.cues, ['heroSizzle']);
  result = recordEncounterFeedback(result.state, { bossExposureSeconds: .016, time: 2.22 });
  assert.deepEqual(result.cues, ['bossSizzle']);
});

test('capped finite envelopes decay, reduced motion keeps tint without shake or particles', () => {
  const hit = recordEncounterFeedback(createEncounterFeedback(), { ram: true, bossDefeated: true, time: 1 }).state;
  const early = stepEncounterFeedback(hit, .1);
  assert.ok(early.visual.heroEdge > 0 && early.visual.heroEdge <= .16);
  assert.ok(early.visual.shakePx > 0 && early.visual.shakePx <= 4);
  assert.ok(early.visual.bossScale < 1);
  const flare = stepEncounterFeedback(early.state, .4);
  assert.ok(flare.visual.ringOpacity > 0 && flare.visual.bossScale > 1);
  assert.deepEqual(recordEncounterFeedback(flare.state, { bossDefeated: true }).cues, []);
  const reduced = stepEncounterFeedback(hit, .1, true).visual;
  assert.equal(reduced.shakePx, 0); assert.equal(reduced.spark, 0); assert.equal(reduced.ringOpacity, 0);
  assert.ok(reduced.heroEdge > 0);
  const finished = stepEncounterFeedback(flare.state, 100).visual;
  assert.equal(finished.ringOpacity, 0);
  assert.equal(finished.bossOpacity, 0);
  assert.ok(Object.values(finished).every(value => value === null || Number.isFinite(value)));
});
