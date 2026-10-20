import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateInfiniteLevel, hasInfiniteRoute, infiniteRunSeed, normalizeInfiniteSeed, normalizeInfiniteStage, MAX_STAGE } from './infinite.js';
import { validateLevelDocument } from './level-document.js';

describe('Infinite Play generation', () => {
  it('normalizes seed and bounds stage without changing case', () => {
    assert.equal(normalizeInfiniteSeed('  ABC  '), 'ABC');
    assert.equal(normalizeInfiniteSeed('a'.repeat(100)).length, 64);
    assert.equal(normalizeInfiniteStage(0), 1);
    assert.equal(normalizeInfiniteStage(MAX_STAGE + 1), 1);
  });
  it('repeats the same level and run recharges for a seed and stage', () => {
    const a = generateInfiniteLevel('Artemis', 7), b = generateInfiniteLevel('Artemis', 7);
    assert.deepEqual(a, b);
    assert.equal(infiniteRunSeed('Artemis', 7), infiniteRunSeed('Artemis', 7));
    assert.notDeepEqual(generateInfiniteLevel('artemis', 7), a);
    assert.notDeepEqual(generateInfiniteLevel('Artemis', 8), a);
  });
  it('keeps hundreds of crossings valid and connected', () => {
    for (let seed = 1; seed <= 120; seed++) {
      for (const stage of [1, 5, 10, 100]) {
        const doc = generateInfiniteLevel(`seed-${seed}`, stage);
        assert.equal(validateLevelDocument(doc).ok, true, `${seed}/${stage}`);
        assert.equal(hasInfiniteRoute(doc), true, `${seed}/${stage}`);
        assert.equal(doc.entities.filter(e => e.type === 'soundGate').length, 3);
        assert.equal(doc.entities.filter(e => e.type === 'lightPickup').length, 3);
        for (const entity of doc.entities.filter(e => ['soundGate', 'lightPickup'].includes(e.type))) {
          assert.ok(entity.x > doc.start.x && entity.x < doc.exit.x, `stage ${stage}: ${entity.id} must lie within crossing`);
        }
        assert.equal(doc.settings.randomRecharge, false);
      }
    }
  });
});
