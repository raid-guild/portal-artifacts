import { validateLevelDocument, compileLevelDocument } from './level-document.js';
import { orbitSpeed } from './orbit.js';

export const INFINITE_VERSION = 2;
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
export const infiniteHazardRadius = entity => entity.radius + (entity.motion === 'orbit' ? entity.orbitRadius : 0);
const reservedRadius = entity => entity.type === 'companion' ? entity.captureRadius : entity.radius ?? .31;
const routeSamples = (amplitude, phase, slope) => Array.from({ length: 169 }, (_, i) => routePoint(i / 2 - 42, amplitude, phase, slope));

function clearHazardGroup(group, document, route) {
  const b = document.bounds;
  const reserved = [document.start, document.exit, ...document.entities.filter(e => e.type !== 'ember')];
  for (const ember of group) {
    const radius = infiniteHazardRadius(ember);
    if (ember.x - radius < b.minX + 1 || ember.x + radius > b.maxX - 1 || ember.y - radius < b.minY + 1 || ember.y + radius > b.maxY - 1) return false;
    // Half a sample of extra margin keeps the continuous curved route clear too.
    if (route.some(p => gap(p, ember) < radius + 3.5)) return false;
    if (reserved.some(p => gap(p, ember) < radius + reservedRadius(p) + .8)) return false;
    if (document.walls.some(w => rectDistance(ember, w) < radius + 1.2)) return false;
    if (document.entities.some(e => e.type === 'ember' && gap(e, ember) < radius + infiniteHazardRadius(e) + 1.5)) return false;
  }
  for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) {
    const a = group[i], b = group[j];
    if (gap(a, b) < .001) {
      if (a.motion === 'orbit' && b.motion === 'orbit') {
        if (a.orbitRadius !== b.orbitRadius || a.speed !== b.speed || a.orbitDirection !== b.orbitDirection || Math.abs(a.phase - b.phase) !== 180 || 2 * a.orbitRadius < a.radius + b.radius + .8) return false;
      } else {
        const orbit = a.motion === 'orbit' ? a : b, core = orbit === a ? b : a;
        if (orbit.motion !== 'orbit' || orbit.orbitRadius < core.radius + orbit.radius + .8) return false;
      }
    } else if (gap(a, b) < infiniteHazardRadius(a) + infiniteHazardRadius(b) + 1.5) return false;
  }
  return true;
}

// A coarse collision-margin flood fill rejects arrangements with a blocked crossing.
export function hasInfiniteRoute(document) {
  const { bounds: b, start, exit: goal, walls, entities } = document;
  const step = 1.5, cols = Math.floor((b.maxX - b.minX) / step) + 1, rows = Math.floor((b.maxY - b.minY) / step) + 1;
  const index = (x, y) => y * cols + x;
  const xy = point => ({ x: clamp(Math.round((point.x - b.minX) / step), 0, cols - 1), y: clamp(Math.round((point.y - b.minY) / step), 0, rows - 1) });
  const blocked = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const p = { x: b.minX + x * step, y: b.minY + y * step };
    if (walls.some(wall => rectDistance(p, wall) < .8) || entities.some(entity => entity.type === 'ember' && entity.lethal && gap(p, entity) < infiniteHazardRadius(entity) + 1)) blocked[index(x, y)] = 1;
  }
  const from = xy(start), to = xy(goal), queue = [from], seen = new Uint8Array(cols * rows);
  if (blocked[index(from.x, from.y)] || blocked[index(to.x, to.y)]) return false;
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
  for (const [i, x] of [-31, 7].entries()) {
    const p = routePoint(x, amplitude, phase, slope);
    put({ id: `companion-${i}`, type: 'companion', x, y: p.y + (i ? -1.4 : 1.4), radius: .16, captureRadius: 2.8 });
  }
  const route = routeSamples(amplitude, phase, slope);
  const pattern = fallback ? 1 : Math.floor(random() * 3);
  const side = random() < .5 ? -1 : 1;
  const largeRadius = 3 + random() * .4 + difficulty * 1.1;
  const largeGravity = 42 + random() * 13 + difficulty * 15;
  const orbitBody = .32 + random() * .08 + difficulty * .05;
  const orbitPeriod = 12 + random() * 2 - difficulty * 4;
  const orbitDirection = random() < .5 ? 'clockwise' : 'counterclockwise';
  const phaseOffset = Math.floor(random() * 180);
  const heavy = (id, x, y) => ({ id, type: 'ember', x, y, radius: largeRadius, gravity: largeGravity, lethal: true, burnsCompanions: true, motion: 'fixed', speed: 0, orbitRadius: 0, phase: 0 });
  const pair = (x, y, radius) => [0, 1].map(i => ({ id: `orbital-${i}`, type: 'ember', x, y, radius: orbitBody, gravity: 0, lethal: true, burnsCompanions: false,
    motion: 'orbit', orbitRadius: radius, speed: orbitSpeed(radius, orbitPeriod), orbitDirection, phase: phaseOffset + i * 180 }));
  let placed = false;
  for (let attempt = 0; attempt < 12 && !placed; attempt++) {
    const sign = attempt % 2 ? -side : side;
    const offset = 9 + Math.floor(attempt / 2) * .65;
    const y = (x, direction, envelope) => pathY(x, amplitude, phase, slope) + direction * Math.max(offset, envelope + 5);
    let group;
    if (pattern === 0) {
      const orbitRadius = 3 + difficulty * .5;
      group = [heavy('heavy-0', -12, y(-12, sign, largeRadius)), ...pair(18, y(18, -sign, orbitRadius + orbitBody), orbitRadius)];
    } else {
      const radius = largeRadius + orbitBody + .9;
      const x = pattern === 1 ? 12 : 18, centerY = y(x, pattern === 1 ? sign : -sign, radius + orbitBody);
      group = [heavy('heavy-0', x, centerY), ...pair(x, centerY, radius)];
      if (pattern === 2) group.unshift(heavy('heavy-1', -14, y(-14, sign, largeRadius)));
    }
    if (clearHazardGroup(group, document, route)) { group.forEach(put); placed = true; }
  }
  if (!placed) return null;
  if (!fallback) {
    const obstacleCount = (pattern === 2 ? 2 : 3) + Math.floor(difficulty * 3), emberCount = 1 + Math.floor(difficulty * 3);
    const reserved = [start, exit, ...document.entities.filter(e => e.type !== 'ember')];
    for (let i = 0, tries = 0; i < obstacleCount && tries < 100; tries++) {
      const wall = { id: `wall-${i}`, x: -33 + random() * 67, y: -20 + random() * 40, width: 1.3 + random() * 2.7, height: 1 + random() * 2.4 };
      if (nearRoute(wall, amplitude, phase, slope, 6 + wall.height / 2) || reserved.some(p => rectDistance(p, wall) < reservedRadius(p) + 1.2) || document.entities.some(e => e.type === 'ember' && rectDistance(e, wall) < infiniteHazardRadius(e) + 1.2) || document.walls.some(p => Math.hypot(p.x-wall.x,p.y-wall.y)<4)) continue;
      document.walls.push(wall); i++;
    }
    for (let i = 0, tries = 0; i < emberCount && tries < 100; tries++) {
      const ember = { id: `ember-${i}`, type: 'ember', x: -31 + random() * 66, y: -20 + random() * 40,
        radius: .7 + random() * (.8 + difficulty * .5), gravity: 8 + random() * 7, lethal: true, motion: 'fixed', speed: 0, orbitRadius: 0, phase: 0 };
      if (!clearHazardGroup([ember], document, route)) continue;
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
    if (!document) continue;
    const validation = validateLevelDocument(document);
    if (validation.ok && hasInfiniteRoute(validation.document)) return validation.document;
  }
  const fallback = makeDocument(seed, stage, 0, true);
  return compileLevelDocument(fallback).document;
}
