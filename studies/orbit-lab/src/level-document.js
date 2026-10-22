import { BLOB_RADIUS, circleHitsRect } from './level.js';
import { compiledWallGeometry, wallCorners } from './wall-geometry.js';
import { DEFAULT_ORBIT_DIRECTION, ORBIT_DIRECTIONS, orbitPosition } from './orbit.js';

export const LEVEL_DOCUMENT_VERSION = 1;
export const ENTITY_TYPES = ['ember', 'soundGate', 'impulse', 'stillness', 'eclipse', 'lightPickup', 'dimmer', 'portal', 'companion'];
const MAX_BYTES = 262144;
const clone = value => JSON.parse(JSON.stringify(value));
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
const number = (value, name, errors, min = -Infinity, max = Infinity) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) errors.push(`${name} must be a finite number from ${min} to ${max}`);
  return value;
};
const id = (value, name, errors) => {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,48}$/.test(value)) errors.push(`${name} must be a short unique ID`);
  return value;
};
const point = (value, name, errors) => {
  if (!plain(value)) { errors.push(`${name} is required`); return { x: NaN, y: NaN }; }
  return { x: number(value.x, `${name}.x`, errors, -1000, 1000), y: number(value.y, `${name}.y`, errors, -1000, 1000) };
};
const within = (p, bounds, radius = 0) => p.x - radius >= bounds.minX && p.x + radius <= bounds.maxX && p.y - radius >= bounds.minY && p.y + radius <= bounds.maxY;

export function validateLevelDocument(input) {
  const errors = [];
  if (!plain(input)) return { ok: false, errors: ['Level must be an object'], document: null };
  let size = Infinity;
  try { size = new TextEncoder().encode(JSON.stringify(input)).length; } catch {}
  if (size > MAX_BYTES) errors.push('Level document exceeds 256 KB');
  if (input.version !== LEVEL_DOCUMENT_VERSION) errors.push('Unsupported level version');
  const title = typeof input.title === 'string' ? input.title.trim().slice(0, 80) : '';
  if (!title) errors.push('title is required');
  const docId = id(input.id, 'id', errors);
  const b = input.bounds;
  if (!plain(b)) errors.push('bounds are required');
  const bounds = {
    minX: number(b?.minX, 'bounds.minX', errors, -500, 500),
    maxX: number(b?.maxX, 'bounds.maxX', errors, -500, 500),
    minY: number(b?.minY, 'bounds.minY', errors, -500, 500),
    maxY: number(b?.maxY, 'bounds.maxY', errors, -500, 500),
  };
  if (!(bounds.maxX - bounds.minX >= 8 && bounds.maxY - bounds.minY >= 8)) errors.push('bounds must span at least 8 units on each axis');
  const s = input.settings;
  if (!plain(s)) errors.push('settings are required');
  const settings = {
    startLight: number(s?.startLight, 'settings.startLight', errors, 0, 1),
    burnRate: number(s?.burnRate, 'settings.burnRate', errors, 0, 1),
    graceSeconds: number(s?.graceSeconds, 'settings.graceSeconds', errors, 0, 60),
    wellStrength: number(s?.wellStrength, 'settings.wellStrength', errors, 0, 500),
    wellLifetime: number(s?.wellLifetime, 'settings.wellLifetime', errors, .1, 60),
    maxActiveWells: number(s?.maxActiveWells, 'settings.maxActiveWells', errors, 1, 10),
    maxTotalWells: s?.maxTotalWells === null ? null : number(s?.maxTotalWells, 'settings.maxTotalWells', errors, 0, 1000),
    randomRecharge: s?.randomRecharge,
  };
  if (!Number.isInteger(settings.maxActiveWells)) errors.push('maxActiveWells must be an integer');
  if (settings.maxTotalWells !== null && !Number.isInteger(settings.maxTotalWells)) errors.push('maxTotalWells must be an integer or null');
  if (typeof settings.randomRecharge !== 'boolean') errors.push('randomRecharge must be true or false');
  const startPoint = point(input.start, 'start', errors);
  const start = { ...startPoint, direction: number(input.start?.direction, 'start.direction', errors, -360, 360), speed: number(input.start?.speed, 'start.speed', errors, 0, 30) };
  const exitPoint = point(input.exit, 'exit', errors);
  const exit = { ...exitPoint, radius: number(input.exit?.radius, 'exit.radius', errors, .3, 10), gravity: number(input.exit?.gravity, 'exit.gravity', errors, 0, 100) };
  if (!Array.isArray(input.walls) || input.walls.length > 3000) errors.push('walls must be an array of at most 3000');
  if (input.wallPaths !== undefined && (!Array.isArray(input.wallPaths) || input.wallPaths.length > 150)) errors.push('wallPaths must be an array of at most 150');
  if (!Array.isArray(input.entities) || input.entities.length > 200) errors.push('entities must be an array of at most 200');
  const used = new Set(['__west', '__east', '__north', '__south']);
  const unique = (itemId, name) => { id(itemId, name, errors); if (used.has(itemId)) errors.push(`Duplicate ID: ${itemId}`); used.add(itemId); };
  const walls = (Array.isArray(input.walls) ? input.walls.slice(0, 3000) : []).map((w, i) => {
    if (!plain(w)) { errors.push(`walls[${i}] is invalid`); return null; }
    unique(w.id, `walls[${i}].id`);
    return { id: w.id, ...point(w, `walls[${i}]`, errors), width: number(w.width, `walls[${i}].width`, errors, .1, 1000), height: number(w.height, `walls[${i}].height`, errors, .1, 1000) };
  }).filter(Boolean);
  let totalPathPoints = 0;
  const wallPaths = (Array.isArray(input.wallPaths) ? input.wallPaths.slice(0, 150) : []).map((path, i) => {
    if (!plain(path)) { errors.push(`wallPaths[${i}] is invalid`); return null; }
    unique(path.id, `wallPaths[${i}].id`);
    const thickness = number(path.thickness, `wallPaths[${i}].thickness`, errors, .1, 20);
    if (!Array.isArray(path.points) || path.points.length < 2 || path.points.length > 301) errors.push(`wallPaths[${i}].points needs 2 to 301 points`);
    const points = (Array.isArray(path.points) ? path.points.slice(0, 301) : []).map((p,j)=>point(p,`wallPaths[${i}].points[${j}]`,errors));
    totalPathPoints += points.length;
    for (let j = 1; j < points.length; j++) if (Math.hypot(points[j].x - points[j-1].x, points[j].y - points[j-1].y) < 1e-5) errors.push(`wallPaths[${i}] has duplicate consecutive points`);
    return { id:path.id, thickness, points };
  }).filter(Boolean);
  if (totalPathPoints > 450) errors.push('wallPaths exceed 450 total points');
  const slots = new Set(), pairs = new Map();
  const entities = (Array.isArray(input.entities) ? input.entities.slice(0, 200) : []).map((e, i) => {
    if (!plain(e)) { errors.push(`entities[${i}] is invalid`); return null; }
    unique(e.id, `entities[${i}].id`);
    const name = `entities[${i}]`;
    if (!ENTITY_TYPES.includes(e.type)) errors.push(`${name}.type is unsupported`);
    const base = { id: e.id, type: e.type, ...point(e, name, errors), radius: number(e.radius, `${name}.radius`, errors, .1, 20) };
    if (e.type === 'ember') {
      base.gravity = number(e.gravity, `${name}.gravity`, errors, 0, 500);
      base.lethal = e.lethal; if (typeof e.lethal !== 'boolean') errors.push(`${name}.lethal must be boolean`);
      if (e.burnsCompanions !== undefined && typeof e.burnsCompanions !== 'boolean') errors.push(`${name}.burnsCompanions must be boolean`);
      base.burnsCompanions = e.burnsCompanions ?? false;
      base.motion = e.motion; if (!['fixed', 'chaser', 'orbit'].includes(e.motion)) errors.push(`${name}.motion is invalid`);
      base.speed = number(e.speed, `${name}.speed`, errors, 0, 20);
      base.orbitRadius = number(e.orbitRadius, `${name}.orbitRadius`, errors, 0, 40);
      base.phase = number(e.phase, `${name}.phase`, errors, -360, 360);
      if (e.orbitDirection !== undefined && !ORBIT_DIRECTIONS.includes(e.orbitDirection)) errors.push(`${name}.orbitDirection must be clockwise or counterclockwise`);
      base.orbitDirection = e.orbitDirection ?? DEFAULT_ORBIT_DIRECTION;
      if (base.burnsCompanions && (!base.lethal || base.motion !== 'fixed')) errors.push(`${name}.burnsCompanions requires a fixed lethal ember`);
    } else if (e.type === 'soundGate') {
      base.slot = number(e.slot, `${name}.slot`, errors, 0, 2);
      if (!Number.isInteger(e.slot) || slots.has(e.slot)) errors.push(`${name}.slot must be unique (0, 1, or 2)`);
      slots.add(e.slot);
    } else if (e.type === 'impulse') {
      base.direction = number(e.direction, `${name}.direction`, errors, -360, 360);
      base.speed = number(e.speed, `${name}.speed`, errors, 0, 30);
    } else if (e.type === 'stillness' || e.type === 'eclipse') {
      base.captureTime = number(e.captureTime, `${name}.captureTime`, errors, .05, 30);
      if (e.manualRelease !== undefined && typeof e.manualRelease !== 'boolean') errors.push(`${name}.manualRelease must be boolean`);
      base.manualRelease = e.manualRelease ?? false;
      base.releaseDirection = e.releaseDirection == null ? null : number(e.releaseDirection, `${name}.releaseDirection`, errors, -360, 360);
      if (e.type === 'eclipse') base.fadeTime = number(e.fadeTime, `${name}.fadeTime`, errors, .05, 30);
    } else if (e.type === 'lightPickup' || e.type === 'dimmer') {
      base.amount = number(e.amount, `${name}.amount`, errors, 0, 1);
      base.reusable = e.reusable; if (typeof e.reusable !== 'boolean') errors.push(`${name}.reusable must be boolean`);
      base.cooldown = number(e.cooldown, `${name}.cooldown`, errors, 0, 60);
    } else if (e.type === 'portal') {
      base.pairId = id(e.pairId, `${name}.pairId`, errors);
      base.exitDirection = number(e.exitDirection, `${name}.exitDirection`, errors, -360, 360);
      pairs.set(e.pairId, (pairs.get(e.pairId) || 0) + 1);
    } else if (e.type === 'companion') {
      base.captureRadius = number(e.captureRadius, `${name}.captureRadius`, errors, .5, 10);
    }
    return base;
  }).filter(Boolean);
  for (const [pairId, count] of pairs) if (count !== 2) errors.push(`Portal pair ${pairId} needs exactly two endpoints`);
  for (const [pairId, count] of pairs) if (count === 2) {
    const [first, second] = entities.filter(e => e.type === 'portal' && e.pairId === pairId);
    if (Math.hypot(first.x - second.x, first.y - second.y) <= first.radius + second.radius + BLOB_RADIUS) errors.push(`Portal pair ${pairId} endpoints overlap`);
  }
  if (!within(start, bounds, BLOB_RADIUS)) errors.push('start must be inside bounds');
  if (!within(exit, bounds, exit.radius)) errors.push('exit must be inside bounds');
  const compiledWalls = errors.length ? [] : compiledWallGeometry(walls, wallPaths);
  if (compiledWalls.length > 300) errors.push(`Wall geometry has ${compiledWalls.length} pieces; maximum 300. Erase or simplify walls.`);
  for (const wall of compiledWalls) {
    if (wall.sourceId && wallCorners(wall).some(corner => !within(corner, bounds))) errors.push(`wall path ${wall.sourceId} must fit inside bounds`);
    if (wall.sourceId) {
      if (circleHitsRect(start, BLOB_RADIUS, wall)) errors.push(`start overlaps wall path ${wall.sourceId}`);
      if (circleHitsRect(exit, exit.radius + BLOB_RADIUS, wall)) errors.push(`exit overlaps wall path ${wall.sourceId}`);
      continue;
    }
    const original = { id:wall.id, x:wall.x, y:wall.y, width:wall.w, height:wall.h };
    if (original.x - original.width/2 < bounds.minX || original.x + original.width/2 > bounds.maxX || original.y - original.height/2 < bounds.minY || original.y + original.height/2 > bounds.maxY) errors.push(`wall ${wall.id} must fit inside bounds`);
    if (circleHitsRect(start, BLOB_RADIUS, wall)) errors.push(`start overlaps wall ${wall.id}`);
    if (circleHitsRect(exit, exit.radius + BLOB_RADIUS, wall)) errors.push(`exit overlaps wall ${wall.id}`);
  }
  for (const wall of walls) {
    if (!within(wall, bounds) || wall.x - wall.width / 2 < bounds.minX || wall.x + wall.width / 2 > bounds.maxX || wall.y - wall.height / 2 < bounds.minY || wall.y + wall.height / 2 > bounds.maxY) errors.push(`wall ${wall.id} must fit inside bounds`);
    const rect = { x: wall.x, y: wall.y, w: wall.width, h: wall.height };
    if (circleHitsRect(start, BLOB_RADIUS, rect)) errors.push(`start overlaps wall ${wall.id}`);
    if (circleHitsRect(exit, exit.radius + BLOB_RADIUS, rect)) errors.push(`exit overlaps wall ${wall.id}`);
  }
  for (const entity of entities) {
    const sweep = entity.type === 'ember' && entity.motion === 'orbit' ? entity.orbitRadius : 0;
    if (!within(entity, bounds, entity.type === 'companion' ? entity.captureRadius : entity.radius + sweep)) errors.push(`entity ${entity.id} must fit inside bounds`);
  }
  for (const ember of entities.filter(e => e.type === 'ember' && e.lethal)) {
    const initial = ember.motion === 'orbit' ? orbitPosition(ember, 0) : ember;
    if (Math.hypot(start.x - initial.x, start.y - initial.y) <= ember.radius + BLOB_RADIUS) errors.push(`start overlaps lethal ember ${ember.id}`);
    if (Math.hypot(exit.x - ember.x, exit.y - ember.y) <= ember.radius + exit.radius + (ember.motion === 'orbit' ? ember.orbitRadius : 0)) errors.push(`exit overlaps lethal ember ${ember.id}`);
  }
  for (const portal of entities.filter(e => e.type === 'portal')) {
    const angle = portal.exitDirection * Math.PI / 180;
    const destination = { x: portal.x + Math.cos(angle) * (portal.radius + BLOB_RADIUS + .2), y: portal.y + Math.sin(angle) * (portal.radius + BLOB_RADIUS + .2) };
    if (!within(destination, bounds, BLOB_RADIUS)) errors.push(`portal ${portal.id} exit faces outside bounds`);
    if (compiledWalls.some(w => circleHitsRect(destination, BLOB_RADIUS, w))) errors.push(`portal ${portal.id} exit faces a wall`);
    if (entities.some(e => e.type === 'ember' && e.lethal && Math.hypot(destination.x - e.x, destination.y - e.y) <= BLOB_RADIUS + e.radius + (e.motion === 'orbit' ? e.orbitRadius : 0))) errors.push(`portal ${portal.id} exit faces a lethal ember`);
  }
  return { ok: errors.length === 0, errors, document: errors.length ? null : { version: 1, id: docId, title, bounds, settings, start, exit, walls, wallPaths, entities } };
}

export function parseLevelDocument(text) {
  if (new TextEncoder().encode(text).length > MAX_BYTES) return { ok: false, errors: ['Level document exceeds 256 KB'], document: null };
  try { return validateLevelDocument(JSON.parse(text)); } catch { return { ok: false, errors: ['Invalid JSON'], document: null }; }
}
export function compileLevelDocument(input) {
  const checked = validateLevelDocument(input);
  if (!checked.ok) throw new Error(checked.errors.join('; '));
  const doc = checked.document;
  const direction = doc.start.direction * Math.PI / 180;
  const b = doc.bounds, cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2, width = b.maxX - b.minX, height = b.maxY - b.minY;
  const perimeter = [
    { id: '__west', x: b.minX - .25, y: cy, w: .5, h: height + .5 },
    { id: '__east', x: b.maxX + .25, y: cy, w: .5, h: height + .5 },
    { id: '__north', x: cx, y: b.maxY + .25, w: width + .5, h: .5 },
    { id: '__south', x: cx, y: b.minY - .25, w: width + .5, h: .5 },
  ];
  const level = {
    bounds: clone(doc.bounds), spawn: { x: doc.start.x, y: doc.start.y, vx: Math.cos(direction) * doc.start.speed, vy: Math.sin(direction) * doc.start.speed },
    goal: clone(doc.exit), walls: [...perimeter, ...compiledWallGeometry(doc.walls, doc.wallPaths)],
    spikes: [], dangers: doc.entities.filter(e => e.type === 'ember' && e.lethal).map(e => ({ x: e.x, y: e.y, radius: e.radius, strength: e.gravity })),
  };
  return { document: doc, level, entities: clone(doc.entities), settings: clone(doc.settings) };
}
