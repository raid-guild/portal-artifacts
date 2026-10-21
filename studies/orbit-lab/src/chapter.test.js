import test from 'node:test';
import assert from 'node:assert/strict';
import { chapterUnlocked, crossedEvents, earnedNotes, transmissionEvents, TRANSMISSION_DURATION } from './chapter.js';

test('finishing level three unlocks the scene; only single-run perfect masks earn notes', () => {
  assert.equal(chapterUnlocked(new Set([1, 2])), false);
  assert.equal(chapterUnlocked(new Set([3])), true);
  assert.deepEqual(earnedNotes({ 1: 7, 2: 6, 3: 7 }), [true, false, true]);
});

test('transmission always calls and answers, with rests for missing earned notes', () => {
  assert.deepEqual(transmissionEvents([]).filter(event => event.type === 'call').map(event => event.note), [0, 4]);
  assert.deepEqual(transmissionEvents([true, false, true]).filter(event => event.type === 'call').map(event => event.note), [0, 1, 3, 4]);
  const events = transmissionEvents([]);
  assert.ok(events.find(event => event.type === 'answerSound').at < events.find(event => event.type === 'answerPulse').at);
  assert.equal(events.at(-1).at, TRANSMISSION_DURATION);
});

test('timeline crossing fires once even across a delayed frame or repeated timestamp', () => {
  const events = transmissionEvents([true, true, true]);
  assert.equal(crossedEvents(events, 0, 7).filter(event => event.type === 'call').length, 5);
  assert.deepEqual(crossedEvents(events, 7, 7), []);
  assert.deepEqual(crossedEvents(events, 7, 9), []);
  assert.deepEqual(crossedEvents(events, 9, 11).map(event => event.type), ['answerSound', 'answerPulse']);
});
