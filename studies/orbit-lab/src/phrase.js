import { BLOB_RADIUS } from './level.js';
import { segmentDistance } from './studies.js';

// Curated passages live beside campaign documents until melody authoring exists.
export const PHRASE_LEVEL = 1;
export const PHRASE_STORAGE_KEY = 'orbit-lab-discovered-phrases-v1';
export const PHRASE_NOTES = [293.665, 440, 329.628, 391.995, 440, 523.251, 493.883, 587.33];
export const PHRASE_GATES = PHRASE_NOTES.map((frequency, index) => ({
  index, x: -10 + index * 10, y: 22, radius: .9, frequency,
}));
const passage = (levelId, title, notes, points) => Object.freeze({ levelId, title,
  notes: Object.freeze(notes), gates: Object.freeze(points.map(([x, y], index) => Object.freeze({ index, x, y, radius: .9, frequency: notes[index] }))) });
export const PHRASES = Object.freeze([
  Object.freeze({ levelId: 1, title: 'The long crossing', notes: PHRASE_NOTES, gates: PHRASE_GATES }),
  passage(4, 'Watch the opening', [329.628, 391.995, 493.883, 440, 587.33, 523.251, 659.255, 587.33],
    [[33, 19], [37.7, 19], [42.4, 19], [47.1, 19], [48.4, 16], [48.4, 13], [48.4, 10], [48.4, 7]]),
  passage(7, 'A light remembered', [261.626, 329.628, 391.995, 349.228, 440, 391.995, 523.251, 493.883],
    [[33, -19], [37.7, -19], [42.4, -19], [47.1, -19], [48.4, -16], [48.4, -13], [48.4, -10], [48.4, -7]]),
  passage(11, 'The distant room', [220, 293.665, 329.628, 440, 391.995, 493.883, 440, 587.33], Array.from({ length: 8 }, (_, i) => [53 + 2.85 * i, -36])),
  passage(14, 'A borrowed opening', [349.228, 440, 523.251, 493.883, 587.33, 698.456, 659.255, 783.991],
    [[-8, 19], [-3, 19], [2, 19], [7, 19], [9.3, 16], [9.3, 12], [9.3, 8], [9.3, 4]]),
]);
export function phraseForLevel(levelId) { return PHRASES.find(phrase => phrase.levelId === Number(levelId)) || null; }
// The collection order deliberately differs from campaign order. Public entries
// contain no level coordinates or chapter metadata until a melody is discovered.
export const PHRASE_ACHIEVEMENTS = Object.freeze([
  Object.freeze({ id: 'afterimage', levelId: 7, title: 'Afterimage' }),
  Object.freeze({ id: 'first-glimmer', levelId: 1, title: 'First glimmer' }),
  Object.freeze({ id: 'resonance', levelId: 14, title: 'Resonance' }),
  Object.freeze({ id: 'undertone', levelId: 4, title: 'Undertone' }),
  Object.freeze({ id: 'faraway', levelId: 11, title: 'Faraway' }),
]);
export function phraseAchievementById(id) { return PHRASE_ACHIEVEMENTS.find(entry => entry.id === id) || null; }
export function publicPhraseAchievements(discoveries = {}) {
  return PHRASE_ACHIEVEMENTS.map(({ id, levelId, title }) => discoveries[levelId] === true
    ? { id, discovered: true, title }
    : { id, discovered: false, title: 'Undiscovered melody' });
}
export const PHRASE_REWARD_SECONDS = 4.5;
export function phraseAcquireEnvelope(age, reducedMotion = false) {
  const pulse = Math.max(0, 1 - Math.max(0, age) / .75);
  return { pulse, scale: 1 + pulse * (reducedMotion ? 0 : .38), glow: pulse * (reducedMotion ? 1.2 : 5.5), light: Math.min(18, 18 * pulse) };
}

export function createPhraseState() { return { next: 0, path: [], gatePathIndices: [], breakIndices: [], complete: false }; }
export function stepPhrase(state, before, physicalEnd, arrival = null, phrase = PHRASES[0]) {
  if (state.complete) return { state, acquired: [] };
  const path = state.path.slice();
  const gatePathIndices = state.gatePathIndices.slice();
  const breakIndices = (state.breakIndices || []).slice();
  let next = state.next;
  const acquired = [];
  const end = physicalEnd || before;
  const dx = end.x - before.x, dy = end.y - before.y;
  const length2 = dx * dx + dy * dy;
  let previousCrossing = -1;
  let arrivalRecorded = false;
  // Traverse in spatial order so a fast impulse cannot skip a note between ticks.
  while (next < phrase.gates.length) {
    const gate = phrase.gates[next];
    const crossing = length2 > 0 ? Math.max(0, Math.min(1, ((gate.x - before.x) * dx + (gate.y - before.y) * dy) / length2)) : 0;
    const physicalCrossing = crossing > previousCrossing && segmentDistance(before, end, gate) <= gate.radius + BLOB_RADIUS;
    const arrivalCrossing = next === state.next && arrival && segmentDistance(arrival, arrival, gate) <= gate.radius + BLOB_RADIUS;
    const crosses = physicalCrossing || arrivalCrossing;
    if (!crosses) break;
    if (!path.length) path.push({ x: before.x, y: before.y });
    if (arrivalCrossing && !physicalCrossing) {
      path.push({ x: end.x, y: end.y });
      breakIndices.push(path.length);
      path.push({ x: arrival.x, y: arrival.y });
      arrivalRecorded = true;
    } else path.push({ x: gate.x, y: gate.y });
    gatePathIndices.push(path.length - 1);
    previousCrossing = physicalCrossing ? crossing : 1;
    acquired.push(next++);
    if (arrivalCrossing) break;
  }
  if (next > 0 && next < phrase.gates.length) {
    const last = path.at(-1);
    if (!arrivalRecorded) {
      if (!last || Math.hypot(end.x - last.x, end.y - last.y) >= .7) path.push({ x: end.x, y: end.y });
      if (arrival) { breakIndices.push(path.length); path.push({ x: arrival.x, y: arrival.y }); }
    }
    while (path.length > 512) {
      const removeAt = path.findIndex((_, index) => index > 0 && !gatePathIndices.includes(index) && !breakIndices.includes(index) && !breakIndices.includes(index + 1));
      if (removeAt < 0) break;
      path.splice(removeAt, 1);
      for (let i = 0; i < gatePathIndices.length; i++) if (gatePathIndices[i] > removeAt) gatePathIndices[i]--;
      for (let i = 0; i < breakIndices.length; i++) if (breakIndices[i] > removeAt) breakIndices[i]--;
    }
  }
  return { state: { next, path, gatePathIndices, breakIndices, complete: next === phrase.gates.length }, acquired };
}

export function phraseRewardAt(elapsed, count = PHRASE_GATES.length) {
  const t = Math.max(0, Math.min(PHRASE_REWARD_SECONDS, elapsed));
  const returnProgress = Math.min(1, t / .9);
  const replayIndex = t < 1.05 ? -1 : Math.min(count - 1, Math.floor((t - 1.05) / .37));
  return { returnProgress, replayIndex, finished: t >= PHRASE_REWARD_SECONDS };
}

export function phrasePulsePoint(state, elapsed) {
  const { path, gatePathIndices } = state;
  if (!path.length || !gatePathIndices.length) return null;
  const breaks = new Set(state.breakIndices || []);
  const distances = [0];
  for (let i = 1; i < path.length; i++) distances.push(distances[i - 1] + (breaks.has(i) ? 0 : Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y)));
  const gateDistances = gatePathIndices.map(index => distances[index]);
  const t = Math.max(0, elapsed);
  let distance;
  if (t < 1.05) distance = gateDistances.at(-1) + (gateDistances[0] - gateDistances.at(-1)) * Math.min(1, t / .9);
  else {
    const step = Math.min(gateDistances.length - 1, Math.floor((t - 1.05) / .37));
    const fraction = Math.min(1, ((t - 1.05) % .37) / .37);
    distance = step >= gateDistances.length - 1 ? gateDistances.at(-1) : gateDistances[step] + (gateDistances[step + 1] - gateDistances[step]) * fraction;
  }
  let index = distances.findIndex(value => value >= distance);
  if (index < 0) index = distances.length - 1;
  if (index === 0) return path[0];
  if (breaks.has(index)) return path[index];
  const span = distances[index] - distances[index - 1];
  const blend = span ? (distance - distances[index - 1]) / span : 1;
  return { x: path[index - 1].x + (path[index].x - path[index - 1].x) * blend,
    y: path[index - 1].y + (path[index].y - path[index - 1].y) * blend };
}

export function readDiscoveredPhrases(storage) {
  try {
    const data = JSON.parse(storage?.getItem(PHRASE_STORAGE_KEY) || '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? Object.fromEntries(PHRASES.filter(phrase => data[phrase.levelId] === true).map(phrase => [phrase.levelId, true])) : {};
  } catch { return {}; }
}

export function saveDiscoveredPhrase(storage, levelId) {
  if (!phraseForLevel(levelId)) return false;
  const data = { ...readDiscoveredPhrases(storage), [levelId]: true };
  try { storage?.setItem(PHRASE_STORAGE_KEY, JSON.stringify(data)); } catch { /* Private browsing can refuse writes. */ }
  return true;
}
