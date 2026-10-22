import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_CAMPAIGN_IDS, CHAPTER_ONE_IDS, CHAPTER_TWO_IDS, CHAPTER_THREE_IDS, campaignContinuation, chapterUnlocked, crossedEvents, earnedNotes, getChapter, transmissionEvents, TRANSMISSION_DURATION } from './chapter.js';

test('finishing level three unlocks the scene; only single-run perfect masks earn notes', () => {
  assert.equal(chapterUnlocked(new Set([1, 2])), false);
  assert.equal(chapterUnlocked(new Set([3])), true);
  assert.equal(chapterUnlocked(new Set([4, 5, 6])), false);
  assert.equal(chapterUnlocked(new Set([4, 5]), 2), false);
  assert.equal(chapterUnlocked(new Set([6]), 2), true);
  assert.deepEqual(earnedNotes({ 1: 7, 2: 6, 3: 7, 4: 7, 5: 7, 6: 7 }), [true, false, true]);
  assert.deepEqual(earnedNotes({ 1: 7, 2: 7, 3: 7, 4: 7, 5: 6, 6: 7 }, 2), [true, false, true]);
  assert.deepEqual(CHAPTER_ONE_IDS, [1, 2, 3]);
  assert.deepEqual(CHAPTER_TWO_IDS, [4, 5, 6]);
  assert.deepEqual(CHAPTER_THREE_IDS, [7, 8, 9]);
  assert.deepEqual(ALL_CAMPAIGN_IDS, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9].map(campaignContinuation), [{ type: 'level', id: 2 }, { type: 'level', id: 3 }, { type: 'transmission', chapterId: 1 }, { type: 'level', id: 5 }, { type: 'level', id: 6 }, { type: 'transmission', chapterId: 2 }, { type: 'level', id: 8 }, { type: 'level', id: 9 }, { type: 'transmission', chapterId: 3 }]);
  assert.deepEqual(getChapter(2).levelIds, [4, 5, 6]);
  assert.equal(getChapter(2).duration, 22);
});

test('third transmission keeps three earned notes, a silent beat, an answering call, and overlap', () => {
  assert.equal(chapterUnlocked(new Set([8]), 3), false);
  assert.equal(chapterUnlocked(new Set([9]), 3), true);
  assert.deepEqual(earnedNotes({ 7: 7, 8: 6, 9: 7 }, 3), [true, false, true]);
  const sparse = transmissionEvents([], 3);
  const full = transmissionEvents([true, true, true], 3);
  assert.deepEqual(sparse.filter(event => event.type === 'call').map(event => event.note), [0, 4]);
  assert.deepEqual(full.filter(event => event.type === 'call').map(event => event.note), [0, 1, 2, 3, 4]);
  assert.ok(!full.some(event => event.at > 7.8 && event.at < 10.5));
  assert.deepEqual(full.filter(event => event.type === 'answerNote').map(event => event.at), [10.5, 11.35, 12.15, 21]);
  assert.ok(full.find(event => event.type === 'answerNote' && event.at === 21));
  assert.ok(full.find(event => event.type === 'replyNote' && event.at === 21.1));
  assert.equal(full.at(-1).at, getChapter(3).duration);
});

test('second transmission answers in three notes and receives a reply even with no perfect finishes', () => {
  const sparse = transmissionEvents([], 2);
  assert.deepEqual(sparse.filter(event => event.type === 'call').map(event => event.note), [0, 4]);
  assert.deepEqual(sparse.filter(event => event.type === 'answerNote').map(event => event.frequency), [440, 391.995, 329.628]);
  assert.deepEqual(sparse.filter(event => event.type === 'replyNote').map(event => event.frequency), [440, 391.995, 293.665]);
  assert.equal(sparse.at(-1).at, 22);
  for (const answer of sparse.filter(event => event.type === 'answerNote')) assert.ok(sparse.some(event => event.type === 'answerPulse' && Math.abs(event.at - answer.at - .45) < .001));
  const full = transmissionEvents([true, true, true], 2);
  assert.deepEqual(full.filter(event => event.type === 'call').map(event => event.note), [0, 1, 2, 3, 4]);
  assert.deepEqual(crossedEvents(full, 9, 12).map(event => event.type), ['answerNote', 'answerPulse', 'answerNote', 'answerPulse', 'answerNote', 'answerPulse']);
  assert.deepEqual(crossedEvents(full, 12, 12), []);
  assert.deepEqual(crossedEvents(full, 12, 22).map(event => event.type), ['replyNote', 'replyNote', 'replyNote', 'end']);
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
