import { profileContains, profileImpact } from './guide.js';
import { STEP, acceleration, SOFTENING } from './physics.js';

export const BLOB_RADIUS = 0.31;
export const SPEED_CAP = 10;
export const LEVEL = {
  bounds: { minX: -16, maxX: 16, minY: -9, maxY: 9 },
  spawn: { x: -10, y: -5, vx: 0, vy: 2.5 },
  goal: { x: 10, y: -5, radius: 1 },
  walls: [
    { x: -16.25, y: 0, w: 0.5, h: 18.5 },
    { x: 16.25, y: 0, w: 0.5, h: 18.5 },
    { x: 0, y: 9.25, w: 32.5, h: 0.5 },
    { x: 0, y: -9.25, w: 32.5, h: 0.5 },
    { x: -4, y: -3.5, w: 0.55, h: 11 },
    { x: 4, y: 3.5, w: 0.55, h: 11 },
  ],
  spikes: [
    { x: -4.8, y: -6.7, w: 0.55, h: 0.8 },
    { x: 3.2, y: 6.7, w: 0.55, h: 0.8 },
  ],
};

export function circleHitsRect(point, radius, rect) {
  const dx = Math.max(Math.abs(point.x - rect.x) - rect.w / 2, 0);
  const dy = Math.max(Math.abs(point.y - rect.y) - rect.h / 2, 0);
  return dx * dx + dy * dy <= radius * radius;
}

// Ray against expanded AABB catches a fast blob before it tunnels through a thin hazard.
export function sweptCircleRect(from, to, radius, rect) {
  const minX = rect.x - rect.w / 2 - radius;
  const maxX = rect.x + rect.w / 2 + radius;
  const minY = rect.y - rect.h / 2 - radius;
  const maxY = rect.y + rect.h / 2 + radius;
  let enter = 0;
  let exit = 1;
  for (const [start, delta, min, max] of [
    [from.x, to.x - from.x, minX, maxX],
    [from.y, to.y - from.y, minY, maxY],
  ]) {
    if (Math.abs(delta) < 1e-9) {
      if (start < min || start > max) return null;
    } else {
      const a = (min - start) / delta;
      const b = (max - start) / delta;
      enter = Math.max(enter, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
      if (enter > exit) return null;
    }
  }
  return enter;
}

export function sweptGoal(from, to, goal = LEVEL.goal) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const radius = goal.radius + BLOB_RADIUS;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return Math.hypot(from.x - goal.x, from.y - goal.y) <= radius ? 0 : null;
  const b = 2 * ((from.x - goal.x) * dx + (from.y - goal.y) * dy);
  const c = (from.x - goal.x) ** 2 + (from.y - goal.y) ** 2 - radius ** 2;
  if (c <= 0) return 0;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

export function firstImpact(from, to, level = LEVEL) {
  let first = null;
  for (const [type, rects] of [['spike', level.spikes], ['wall', level.walls]]) {
    for (const rect of rects) {
      const t = sweptCircleRect(from, to, BLOB_RADIUS, rect);
      if (t !== null && (!first || t < first.t)) first = { type, t, x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    }
  }
  for (const profile of level.guides || []) {
    const t = profileImpact(from, to, profile, BLOB_RADIUS);
    if (t !== null && (!first || t < first.t)) first = {type:'wall',t,x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t};
  }
  const t = sweptGoal(from, to, level.goal);
  if (t !== null && (!first || t < first.t)) first = { type: 'goal', t, x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  return first;
}

export function canPlaceWell(point, level = LEVEL) {
  if (point.x < level.bounds.minX + 0.75 || point.x > level.bounds.maxX - 0.75 ||
      point.y < level.bounds.minY + 0.75 || point.y > level.bounds.maxY - 0.75) return false;
  if ((level.guides || []).some(profile => profileContains(point, profile, .47))) return false;
  if (level.walls.some((wall) => circleHitsRect(point, 0.47, wall))) return false;
  if (level.spikes.some((spike) => circleHitsRect(point, 0.47, spike))) return false;
  return Math.hypot(point.x - level.goal.x, point.y - level.goal.y) > level.goal.radius + 0.35;
}

export function capVelocity(velocity, max = SPEED_CAP) {
  const speed = Math.hypot(velocity.x, velocity.y);
  if (speed > max) { velocity.x *= max / speed; velocity.y *= max / speed; }
  return velocity;
}

// Embers attract gently nearby, without using a player well slot or expiring.
export function emberAcceleration(position, level = LEVEL) {
  let x = 0, y = 0;
  const range = 4;
  for (const ember of level.spikes) {
    const dx = ember.x - position.x, dy = ember.y - position.y;
    const distance = Math.hypot(dx, dy);
    if (distance >= range) continue;
    const squared = distance * distance + SOFTENING * SOFTENING;
    const falloff = (1 - (distance / range) ** 2) ** 2;
    const scale = (ember.strength ?? 3) * falloff / (squared * Math.sqrt(squared));
    x += dx * scale; y += dy * scale;
  }
  return { x, y };
}

export function mazeAcceleration(position, wells, time, mode = 'fade', level = LEVEL) {
  const a = acceleration(position, wells, time, mode);
  const ember = emberAcceleration(position, level);
  const portal = portalAcceleration(position, level);
  return { x: a.x + ember.x + portal.x, y: a.y + ember.y + portal.y };
}

// Five percent of the default player well (100), always active at the exit.
export function portalAcceleration(position, level = LEVEL) {
  const dx = level.goal.x - position.x, dy = level.goal.y - position.y;
  const squared = dx * dx + dy * dy + SOFTENING * SOFTENING;
  const scale = 5 / (squared * Math.sqrt(squared));
  return { x: dx * scale, y: dy * scale };
}

export function predictToImpact(state, wells, time, seconds = 3, mode = 'fade', level = LEVEL) {
  const points = [{ x: state.x, y: state.y }];
  let current = { ...state };
  const steps = Math.ceil(seconds / STEP);
  for (let i = 0; i < steps; i++) {
    const a = mazeAcceleration(current, wells, time + i * STEP, mode, level);
    const vx = current.vx + a.x * STEP, vy = current.vy + a.y * STEP;
    const next = { x: current.x + vx * STEP, y: current.y + vy * STEP, vx, vy };
    const limited = capVelocity({ x: next.vx, y: next.vy });
    next.vx = limited.x;
    next.vy = limited.y;
    const impact = firstImpact(current, next, level);
    if (impact) {
      points.push({ x: impact.x, y: impact.y });
      return { points, impact: impact.type };
    }
    current = next;
    if ((i + 1) % 5 === 0) points.push({ x: current.x, y: current.y });
  }
  points.push({ x: current.x, y: current.y });
  return { points, impact: null };
}
