import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhraseState, stepPhrase, phraseRewardAt, phrasePulsePoint, phraseAcquireEnvelope, readDiscoveredPhrases, saveDiscoveredPhrase, PHRASE_GATES, PHRASES, phraseForLevel, publicPhraseAchievements, phraseAchievementById } from './phrase.js';
import { getCampaignLevel } from './campaign.js';

test('phrase is ordered, swept, and does not bridge a teleport chord', () => {
  let state = createPhraseState();
  assert.deepEqual(stepPhrase(state, { x: 50, y: 22 }, { x: 60, y: 22 }).acquired, []);
  assert.deepEqual(stepPhrase(state, { x: 62, y: 22 }, { x: -12, y: 22 }).acquired, [0], 'reverse sweep cannot fake an ordered melody');
  let result = stepPhrase(state, { x: -12, y: 22 }, { x: 15, y: 22 });
  assert.deepEqual(result.acquired, [0, 1, 2]);
  state = result.state;
  result = stepPhrase(state, { x: 15, y: 22 }, { x: 17, y: 22 }, { x: 60, y: 22 });
  assert.deepEqual(result.acquired, []);
  for (let i = 3; i < PHRASE_GATES.length; i++) {
    result = stepPhrase(state, { x: PHRASE_GATES[i].x - 2, y: 22 }, { x: PHRASE_GATES[i].x + 2, y: 22 });
    state = result.state;
  }
  assert.equal(state.complete, true);
  assert.deepEqual(stepPhrase(state, { x: -11, y: 22 }, { x: 65, y: 22 }).acquired, []);
});

test('reward has silent return and one forward replay', () => {
  assert.equal(phraseRewardAt(.8).replayIndex, -1);
  assert.equal(phraseRewardAt(1.1).replayIndex, 0);
  assert.equal(phraseRewardAt(3.8).replayIndex, 7);
  assert.equal(phraseRewardAt(4.5).finished, true);
  const state = { path: [{ x: -10, y: 22 }, { x: 0, y: 22 }, { x: 10, y: 22 }], gatePathIndices: [0, 1, 2] };
  assert.ok(phrasePulsePoint(state, .45).x > -10 && phrasePulsePoint(state, .45).x < 10);
  assert.equal(phrasePulsePoint(state, 1.05).x, -10);
  assert.ok(phrasePulsePoint(state, 1.2).x > -10 && phrasePulsePoint(state, 1.2).x < 0);
  assert.ok(Math.abs(phrasePulsePoint(state, 1.42).x) < 1e-9);
});

test('discovery persists safely even when storage is unavailable', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  assert.deepEqual(readDiscoveredPhrases(storage), {});
  saveDiscoveredPhrase(storage, 1);
  assert.deepEqual(readDiscoveredPhrases(storage), { 1: true });
  assert.equal(saveDiscoveredPhrase(storage, 2), false);
  assert.doesNotThrow(() => saveDiscoveredPhrase({ getItem() { throw Error(); }, setItem() { throw Error(); } }, 1));
});

test('one curated eight-note phrase per chapter fits legal open space with independent melodies', () => {
  assert.deepEqual(PHRASES.map(phrase => phrase.levelId), [1, 4, 7, 11, 14]);
  assert.equal(new Set(PHRASES.map(phrase => phrase.notes.join(','))).size, PHRASES.length);
  for (const phrase of PHRASES) {
    const level = getCampaignLevel(phrase.levelId).level;
    assert.equal(phrase.notes.length, 8);
    assert.equal(phrase.gates.length, 8);
    for (const gate of phrase.gates) {
      assert.ok(Number.isFinite(gate.x) && Number.isFinite(gate.y) && Number.isFinite(gate.frequency));
      assert.ok(gate.x > level.bounds.minX && gate.x < level.bounds.maxX && gate.y > level.bounds.minY && gate.y < level.bounds.maxY);
      for (const wall of level.walls) {
        const dx = Math.max(0, Math.abs(gate.x - wall.x) - wall.w / 2);
        const dy = Math.max(0, Math.abs(gate.y - wall.y) - wall.h / 2);
        assert.ok(Math.hypot(dx, dy) > gate.radius, `${phrase.levelId} gate ${gate.index} overlaps wall`);
      }
    }
  }
  assert.equal(phraseForLevel(5), null);
});

test('discovery preserves legacy Level 1 and saves later levels independently', () => {
  const data = new Map([['orbit-lab-discovered-phrases-v1', '{"1":true,"4":false,"999":true}']]);
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  assert.deepEqual(readDiscoveredPhrases(storage), { 1: true });
  assert.equal(saveDiscoveredPhrase(storage, 11), true);
  assert.equal(saveDiscoveredPhrase(storage, 14), true);
  assert.deepEqual(readDiscoveredPhrases(storage), { 1: true, 11: true, 14: true });
  assert.equal(saveDiscoveredPhrase(storage, 12), false);
});

test('public melody collection conceals undiscovered source levels and migrates prior discoveries', () => {
  const fresh = publicPhraseAchievements();
  assert.equal(fresh.length, 5);
  assert.ok(fresh.every(entry => entry.title === 'Undiscovered melody' && entry.discovered === false));
  assert.ok(fresh.every(entry => !('levelId' in entry) && !('chapter' in entry)));
  assert.notDeepEqual(fresh.map(entry => phraseAchievementById(entry.id).levelId), PHRASES.map(phrase => phrase.levelId));
  const oldStorage = { getItem: () => '{"1":true,"11":true}' };
  const migrated = publicPhraseAchievements(readDiscoveredPhrases(oldStorage));
  assert.deepEqual(migrated.filter(entry => entry.discovered).map(entry => entry.title).sort(), ['Faraway', 'First glimmer']);
  assert.ok(migrated.filter(entry => !entry.discovered).every(entry => !('levelId' in entry)));
});

test('each note pulse decays locally and reduced motion avoids a large expansion', () => {
  const start = phraseAcquireEnvelope(0);
  assert.ok(start.glow > 5 && start.light <= 18);
  assert.ok(phraseAcquireEnvelope(.3).light < start.light);
  assert.equal(phraseAcquireEnvelope(.75).light, 0);
  assert.equal(phraseAcquireEnvelope(Infinity).glow, 0);
  assert.equal(phraseAcquireEnvelope(0, true).scale, 1);
});

test('portal arrival can play its first note while the captured route never bridges the teleport chord', () => {
  const phrase = phraseForLevel(11);
  let state = createPhraseState();
  let result = stepPhrase(state, { x: 45, y: -6 }, { x: 48, y: -6 }, { x: 53.5, y: -36 }, phrase);
  assert.deepEqual(result.acquired, [0]);
  state = result.state;
  assert.equal(state.breakIndices.length, 1);
  assert.deepEqual(state.path[state.breakIndices[0]], { x: 53.5, y: -36 });
  // The pulse can jump endpoints, but must never interpolate through the sealed wall or open void.
  for (let time = 0; time <= 1.05; time += .01) {
    const point = phrasePulsePoint(state, time);
    assert.ok(point.y === -6 || point.y === -36, JSON.stringify({ time, point }));
  }
});
