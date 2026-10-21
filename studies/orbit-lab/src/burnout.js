import { BLOB_RADIUS, canPlaceWell, circleHitsRect } from './level.js';
import { segmentDistance } from './studies.js';

export const BURN_RATE = 0.018;
export const PICKUP_GAIN = 0.3;
export const PICKUP_LIFE = 18;
export const MAX_PICKUPS = 4;
export const PICKUP_RADIUS = 0.65;

export function createBurnout(time = 0, rng = Math.random) {
  return { energy: 0.6, gateOpen: true, pickups: [], nextSpawnAt: time + 2.5 + rng() * 1.5, nextId: 1, pendingClose: false };
}

export function spawnPickup(hero, level, pickups, gateOpen, rng = Math.random) {
  for (let i = 0; i < 32; i++) {
    const angle = rng() * Math.PI * 2;
    const distance = 2 + rng() * 5;
    const point = { x: hero.x + Math.cos(angle) * distance, y: hero.y + Math.sin(angle) * distance };
    if (!canPlaceWell(point, level)) continue;
    if (!gateOpen && level.walls.some(wall => wall.gate && (hero.x - wall.x) * (point.x - wall.x) < 0)) continue;
    if (pickups.some(pickup => Math.hypot(point.x - pickup.x, point.y - pickup.y) < 1.2)) continue;
    return point;
  }
  return null;
}

export function stepBurnout(state, { before, hero, collectors = [], level, dt, time, rng = Math.random }) {
  const next = { ...state, pickups: state.pickups.filter(pickup => time - pickup.createdAt < PICKUP_LIFE) };
  next.energy = Math.max(0.06, Math.min(1, state.energy - BURN_RATE * dt));
  let collected = 0;
  next.pickups = next.pickups.filter(pickup => {
    if (segmentDistance(before, hero, pickup) <= PICKUP_RADIUS + BLOB_RADIUS ||
      collectors.some(({ from, to, radius = .16 }) => segmentDistance(from, to, pickup) <= PICKUP_RADIUS + radius)) { collected++; return false; }
    return true;
  });
  next.energy = Math.min(1, next.energy + collected * PICKUP_GAIN);
  if (time >= next.nextSpawnAt) {
    if (next.pickups.length < MAX_PICKUPS) {
      const point = spawnPickup(hero, level, next.pickups, next.gateOpen, rng);
      if (point) next.pickups.push({ ...point, id: next.nextId++, createdAt: time });
    }
    next.nextSpawnAt = time + 2.5 + rng() * 1.5;
  }
  const gate = level.walls.find(wall => wall.gate);
  const overlaps = !!gate && circleHitsRect(hero, BLOB_RADIUS, gate);
  next.pendingClose = false;
  if (next.gateOpen && next.energy < 0.35) {
    if (overlaps) next.pendingClose = true;
    else next.gateOpen = false;
  } else if (!next.gateOpen && next.energy > 0.5) next.gateOpen = true;
  return { state: next, collected, gateChanged: next.gateOpen !== state.gateOpen };
}

export function cameraFrame(bounds, aspect, margin = 1.5) {
  const width = bounds.maxX - bounds.minX + margin * 2;
  const height = bounds.maxY - bounds.minY + margin * 2;
  const visibleWidth = Math.max(width, height * aspect);
  return { width: visibleWidth, height: visibleWidth / aspect };
}
