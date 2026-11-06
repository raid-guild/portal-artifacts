import test from 'node:test';
import assert from 'node:assert/strict';
import { getChapterEncounter, chapterEncounterAvailable, readEncounterWins, saveEncounterWin,
  publicEncounterAchievements, ENCOUNTER_WINS_KEY } from './chapter-encounters.js';
import { campaignPointAllowed } from './campaign.js';
import { createEntityRuntime, stepEntityRuntime } from './entity-runtime.js';

const gatePrefix = count => Object.fromEntries(Array.from({ length: count }, (_, index) => [index + 1, 1]));

test('optional encounter unlocks only after the third qualified chapter crossing', () => {
  for (let chapter = 1; chapter <= 5; chapter++) {
    assert.equal(chapterEncounterAvailable(chapter, gatePrefix(chapter * 3 - 1)), false);
    assert.equal(chapterEncounterAvailable(chapter, gatePrefix(chapter * 3)), true);
  }
  assert.equal(getChapterEncounter(0), null);
  assert.equal(getChapterEncounter(6), null);
  assert.equal(chapterEncounterAvailable(6, gatePrefix(15)), false);
});

test('five progressively larger arenas have legal actors, shared light, and clear looping room', () => {
  let priorWidth = 0;
  for (let chapter = 1; chapter <= 5; chapter++) {
    const demo = getChapterEncounter(chapter), level = demo.level;
    const width = level.bounds.maxX - level.bounds.minX;
    assert.ok(width > priorWidth); priorWidth = width;
    assert.equal(level.walls.filter(wall => wall.id.startsWith('perimeter-')).length, 4);
    assert.ok(campaignPointAllowed(level.spawn, level));
    assert.ok(campaignPointAllowed(demo.duel.boss, level));
    for (const pickup of demo.duel.pickups) assert.ok(campaignPointAllowed(pickup, level), `chapter ${chapter} light at ${pickup.x},${pickup.y}`);
    assert.equal(demo.soundGates.length, 0);
    assert.equal(demo.usesFollowCamera, true);
    assert.equal(demo.usesEntityRuntime, true);
    assert.equal(demo.duel.burnRate, demo.duel.bossBurnRate);
  }
  assert.equal(getChapterEncounter(1).duel.bossMines, false);
  assert.equal(getChapterEncounter(2).duel.bossMines, false);
  assert.equal(getChapterEncounter(5).duel.bossMines, true);
});

test('chapter-four paired portal teleports across its arena with a physical arrival', () => {
  const demo = getChapterEncounter(4), ports = demo.entities.filter(entity => entity.type === 'portal');
  assert.equal(ports.length, 4);
  assert.equal(ports[0].pairId, ports[1].pairId);
  assert.equal(ports[2].pairId, ports[3].pairId);
  const runtime = createEntityRuntime(demo.entities);
  const before = { x: ports[0].x - 2, y: ports[0].y };
  const body = { position: { x: ports[0].x, y: ports[0].y }, velocity: { x: 2, y: 0 } };
  const step = stepEntityRuntime(runtime, demo.entities, before, body, 1, 1 / 120, demo.level.bounds, { walls: demo.level.walls });
  assert.equal(step.teleported, true);
  assert.ok(Math.hypot(body.position.x - ports[1].x, body.position.y - ports[1].y) < 3);
});

test('chapter-two orbital ember is a visible light drain, not a lethal one-hit hazard', () => {
  const demo = getChapterEncounter(2), embers = demo.entities.filter(entity => entity.type === 'ember');
  const runtime = createEntityRuntime(embers);
  const body = { position: { x: 4.4, y: 0 }, velocity: { x: 0, y: 0 } };
  const step = stepEntityRuntime(runtime, embers, { x: 4.4, y: 0 }, body, 0, 1 / 120, demo.level.bounds, { duel: true, walls: demo.level.walls });
  assert.equal(step.died, false);
  assert.equal(step.emberExposureSeconds, 1 / 120);
});

test('wins persist separately and invalid or corrupt values do not leak into achievements', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  let wins = readEncounterWins(storage);
  assert.deepEqual([...wins], []);
  wins = saveEncounterWin(storage, wins, 2);
  assert.deepEqual([...wins], [2]);
  assert.deepEqual(JSON.parse(values.get(ENCOUNTER_WINS_KEY)), [2]);
  assert.equal(saveEncounterWin(storage, wins, 9), wins);
  assert.equal(publicEncounterAchievements(wins).filter(entry => entry.discovered).length, 1);
  values.set(ENCOUNTER_WINS_KEY, '[2,9,"3",null]');
  assert.deepEqual([...readEncounterWins(storage)], [2]);
  values.set(ENCOUNTER_WINS_KEY, 'broken');
  assert.deepEqual([...readEncounterWins(storage)], []);
});
