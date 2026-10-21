import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateInfiniteLevel, hasInfiniteRoute, infiniteHazardRadius, infiniteRunSeed, normalizeInfiniteSeed, normalizeInfiniteStage, MAX_STAGE, INFINITE_VERSION } from './infinite.js';
import { validateLevelDocument, parseLevelDocument, compileLevelDocument } from './level-document.js';
import { orbitPosition, orbitPeriod } from './orbit.js';

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const wallDistance = (p, w) => Math.hypot(Math.max(0, Math.abs(p.x - w.x) - w.width / 2), Math.max(0, Math.abs(p.y - w.y) - w.height / 2));

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
        const companions = doc.entities.filter(e => e.type === 'companion');
        assert.equal(companions.length, 2);
        assert.ok(companions[0].x < -25 && companions[1].x < 10);
        const embers = doc.entities.filter(e => e.type === 'ember');
        const orbitals = embers.filter(e => e.motion === 'orbit');
        assert.equal(orbitals.length, 2);
        assert.ok(embers.some(e => e.radius >= 3 && e.gravity >= 40 && e.burnsCompanions));
        const reserved = [doc.start, doc.exit, ...doc.entities.filter(e => e.type !== 'ember')];
        for (const ember of embers) {
          const radius = infiniteHazardRadius(ember), bounds = doc.bounds;
          assert.ok(ember.x - radius >= bounds.minX + 1 - 1e-8 && ember.x + radius <= bounds.maxX - 1 + 1e-8);
          assert.ok(ember.y - radius >= bounds.minY + 1 - 1e-8 && ember.y + radius <= bounds.maxY - 1 + 1e-8);
          for (const p of reserved) assert.ok(distance(ember, p) >= radius + (p.type === 'companion' ? p.captureRadius : p.radius ?? .31) + .8 - 1e-8, `${seed}/${stage}: ${ember.id} crowds ${p.id}`);
          for (const wall of doc.walls) assert.ok(wallDistance(ember, wall) >= radius + 1.2 - 1e-8);
          if (ember.motion === 'orbit') {
            assert.equal(ember.burnsCompanions, false);
            assert.equal(ember.gravity, 0);
            for (let tick = 0; tick < 16; tick++) {
              const point = orbitPosition(ember, orbitPeriod(ember) * tick / 16);
              for (const p of reserved) assert.ok(distance(point, p) > ember.radius + (p.type === 'companion' ? p.captureRadius : p.radius ?? .31));
            }
          }
        }
        for (let i = 0; i < embers.length; i++) for (const other of embers.slice(i + 1)) {
          const ember = embers[i];
          if (distance(ember, other) < .001) {
            if (ember.motion === 'orbit' && other.motion === 'orbit') {
              assert.equal(Math.abs(ember.phase - other.phase), 180);
              assert.equal(ember.speed, other.speed);
              assert.equal(ember.orbitDirection, other.orbitDirection);
            } else {
              const orbit = ember.motion === 'orbit' ? ember : other, core = orbit === ember ? other : ember;
              assert.ok(orbit.orbitRadius >= core.radius + orbit.radius + .8);
            }
          } else assert.ok(distance(ember, other) >= infiniteHazardRadius(ember) + infiniteHazardRadius(other) + 1.5 - 1e-8);
        }
        for (const entity of doc.entities.filter(e => ['soundGate', 'lightPickup', 'companion'].includes(e.type))) {
          assert.ok(entity.x > doc.start.x && entity.x < doc.exit.x, `stage ${stage}: ${entity.id} must lie within crossing`);
        }
        assert.equal(doc.settings.randomRecharge, false);
      }
    }
  });
  it('varies intentional encounter arrangements and retains them through level export', () => {
    assert.equal(INFINITE_VERSION, 2);
    const arrangements = new Set();
    for (let i = 0; i < 24; i++) {
      const doc = generateInfiniteLevel(`encounter-${i}`, 5);
      const heavy = doc.entities.filter(e => e.id.startsWith('heavy-'));
      const orbit = doc.entities.find(e => e.motion === 'orbit');
      arrangements.add(`${heavy.length}/${heavy.some(e => distance(e, orbit) < .001)}`);
      const parsed = parseLevelDocument(JSON.stringify(doc));
      assert.equal(parsed.ok, true);
      assert.deepEqual(compileLevelDocument(parsed.document).entities, compileLevelDocument(doc).entities);
    }
    assert.equal(arrangements.size, 3);
  });
  it('reserves a whole orbital sweep and rejects blocked starting cells', () => {
    const doc = { bounds: { minX: -10, maxX: 10, minY: -8, maxY: 8 }, start: { x: -8, y: 0 }, exit: { x: 8, y: 0 },
      walls: [-1, 1].map(sign => ({ x: 0, y: sign * 4.75, width: 20, height: 6.5 })),
      entities: [{ type: 'ember', x: 0, y: 5, radius: .3, lethal: true, motion: 'fixed' }] };
    assert.equal(hasInfiniteRoute(doc), true);
    doc.entities[0].motion = 'orbit'; doc.entities[0].orbitRadius = 4.5;
    assert.equal(hasInfiniteRoute(doc), false);
    doc.entities = [{ type: 'ember', x: -8, y: 0, radius: .5, lethal: true, motion: 'fixed' }];
    assert.equal(hasInfiniteRoute(doc), false);
  });
});
