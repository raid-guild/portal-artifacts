import { validateLevelDocument, compileLevelDocument } from './level-document.js';

export const INFINITE_VERSION = 1;
export const MAX_STAGE = 1_000_000;
export const INFINITE_BOUNDS = Object.freeze({ minX: -48, maxX: 48, minY: -27, maxY: 27 });
const MAX_SEED_LENGTH = 64;

export function normalizeInfiniteSeed(value) {
  return Array.from(String(value ?? '').normalize('NFC').trim().replace(/[\x00-\x1f\x7f]/g, '')).slice(0, MAX_SEED_LENGTH).join('');
}
export function normalizeInfiniteStage(value) {
  const stage = Number(value);
  return Number.isSafeInteger(stage) && stage >= 1 && stage <= MAX_STAGE ? stage : 1;
}
export function randomInfiniteSeed() {
  const bytes = new Uint32Array(2);
  globalThis.crypto?.getRandomValues?.(bytes);
  return `${bytes[0].toString(36)}-${bytes[1].toString(36)}`;
}
export function infiniteHash(value) {
  let hash = 2166136261;
  for (const codepoint of String(value)) {
    const code = codepoint.codePointAt(0);
    hash = Math.imul(hash ^ code, 16777619) >>> 0;
  }
  return hash >>> 0;
}
export function infiniteRunSeed(seed, stage) {
  return infiniteHash(`orbit-lab/infinite/${INFINITE_VERSION}/${normalizeInfiniteSeed(seed)}/${normalizeInfiniteStage(stage)}/recharge`);
}
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let n = Math.imul(state ^ state >>> 15, 1 | state);
    n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const pathY = (x, amplitude, phase, slope) => amplitude * Math.sin((x + 40) / 78 * Math.PI * 1.55 + phase) - amplitude * Math.sin(phase) + slope * (x + 38) / 76;
const routePoint = (x, amplitude, phase, slope) => ({ x, y: pathY(x, amplitude, phase, slope) });
const nearRoute = (point, amplitude, phase, slope, clearance) => Math.abs(point.y - pathY(clamp(point.x, -42, 42), amplitude, phase, slope)) < clearance;
const rectDistance = (point, wall) => Math.hypot(Math.max(0, Math.abs(point.x - wall.x) - wall.width / 2), Math.max(0, Math.abs(point.y - wall.y) - wall.height / 2));

// A coarse collision-margin flood fill rejects arrangements with a blocked crossing.
export function hasInfiniteRoute(document) {
  const { bounds: b, start, exit: goal, walls, entities } = document;
  const step = 1.5, cols = Math.floor((b.maxX - b.minX) / step) + 1, rows = Math.floor((b.maxY - b.minY) / step) + 1;
  const index = (x, y) => y * cols + x;
  const xy = point => ({ x: clamp(Math.round((point.x - b.minX) / step), 0, cols - 1), y: clamp(Math.round((point.y - b.minY) / step), 0, rows - 1) });
  const blocked = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const p = { x: b.minX + x * step, y: b.minY + y * step };
    if (walls.some(wall => rectDistance(p, wall) < .8) || entities.some(entity => entity.type === 'ember' && entity.lethal && gap(p, entity) < entity.radius + 1)) blocked[index(x, y)] = 1;
  }
  const from = xy(start), to = xy(goal), queue = [from], seen = new Uint8Array(cols * rows);
  seen[index(from.x, from.y)] = 1;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i]; if (Math.abs(p.x - to.x) <= 1 && Math.abs(p.y - to.y) <= 1) return true;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const x = p.x + dx, y = p.y + dy;
      if (x < 0 || y < 0 || x >= cols || y >= rows || seen[index(x,y)] || blocked[index(x,y)]) continue;
      seen[index(x,y)] = 1; queue.push({ x, y });
    }
  }
  return false;
}

function makeDocument(seed, stage, attempt, fallback = false) {
  const random = rng(infiniteHash(`orbit-lab/infinite/${INFINITE_VERSION}/${seed}/${stage}/${attempt}`));
  const difficulty = Math.min(1, (stage - 1) / 9);
  const amplitude = fallback ? 0 : 1.2 + random() * (2 + 1.8 * difficulty);
  const phase = random() * 1.6 - .8;
  const slope = fallback ? 0 : (random() - .5) * 4;
  const start = routePoint(-38, amplitude, phase, slope), exit = routePoint(38, amplitude, phase, slope);
  const settings = { startLight: .65, burnRate: .016 + difficulty * .006, graceSeconds: 8, wellStrength: 66, wellLifetime: 8,
    maxActiveWells: 2, maxTotalWells: null, randomRecharge: false };
  const document = { version: 1, id: `infinite-${infiniteHash(seed).toString(36)}-${stage}`, title: `Infinite crossing ${stage}`, bounds: { ...INFINITE_BOUNDS },
    settings, start: { ...start, direction: 0, speed: 2.4 }, exit: { ...exit, radius: 1.4, gravity: 3 }, walls: [], entities: [] };
  const put = entity => document.entities.push(entity);
  for (const [slot, x] of [-22, 0, 22].map((x, slot) => [slot, x])) {
    const p = routePoint(x, amplitude, phase, slope);
    put({ id: `gate-${slot}`, type: 'soundGate', x: p.x, y: p.y + (slot === 1 ? 1.1 : -.8), radius: 1.2, slot });
  }
  for (const [i, x] of [-26, -2, 25].map((x, i) => [i, x])) {
    const p = routePoint(x, amplitude, phase, slope);
    put({ id: `recharge-${i}`, type: 'lightPickup', x: p.x, y: p.y + (i % 2 ? -2.2 : 2.2), radius: .7, amount: .32, reusable: false, cooldown: 0 });
  }
  if (!fallback) {
    const obstacleCount = 5 + Math.floor(difficulty * 5), emberCount = 3 + Math.floor(difficulty * 5);
    const reserved = [start, exit, ...document.entities];
    for (let i = 0, tries = 0; i < obstacleCount && tries < 100; tries++) {
      const wall = { id: `wall-${i}`, x: -33 + random() * 67, y: -20 + random() * 40, width: 1.3 + random() * 2.7, height: 1 + random() * 2.4 };
      if (nearRoute(wall, amplitude, phase, slope, 6 + wall.height / 2) || reserved.some(p => rectDistance(p, wall) < 4) || document.walls.some(p => Math.hypot(p.x-wall.x,p.y-wall.y)<4)) continue;
      document.walls.push(wall); i++;
    }
    for (let i = 0, tries = 0; i < emberCount && tries < 100; tries++) {
      const ember = { id: `ember-${i}`, type: 'ember', x: -31 + random() * 66, y: -20 + random() * 40,
        radius: .7 + random() * (.8 + difficulty * .5), gravity: 8 + random() * 7, lethal: true, motion: 'fixed', speed: 0, orbitRadius: 0, phase: 0 };
      if (nearRoute(ember, amplitude, phase, slope, 5 + ember.radius) || reserved.some(p => gap(p, ember)<5) || document.walls.some(w => rectDistance(ember,w)<ember.radius+2) || document.entities.some(e=>e.type==='ember'&&gap(e,ember)<4)) continue;
      put(ember); i++;
    }
  }
  return document;
}

export function generateInfiniteLevel(rawSeed, rawStage = 1) {
  const seed = normalizeInfiniteSeed(rawSeed), stage = normalizeInfiniteStage(rawStage);
  if (!seed) throw new Error('A seed is required');
  for (let attempt = 0; attempt < 8; attempt++) {
    const document = makeDocument(seed, stage, attempt);
    const validation = validateLevelDocument(document);
    if (validation.ok && hasInfiniteRoute(validation.document)) return validation.document;
  }
  const fallback = makeDocument(seed, stage, 0, true);
  return compileLevelDocument(fallback).document;
}
