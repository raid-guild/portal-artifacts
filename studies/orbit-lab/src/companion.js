import { remaining } from './physics.js';

export const COMPANION_ORBIT_RADIUS = 2.15;
export const COMPANION_OWNED_COUNT = 1;
const limit = (x, y, maximum) => {
  const length = Math.hypot(x, y);
  const factor = length > maximum ? maximum / length : 1;
  return { x: x * factor, y: y * factor };
};

export function createCompanionState() {
  return { owned: true, phase: 'following', borrowHold: 0, returnToneAt: 0 };
}

// This moon owns its relationship to the hero. Its force inherits the hero's
// actual acceleration, then blends toward the well pull at the moon position.
// The radial/orbital correction is bounded and never teleports the moon.
export function stepCompanion(state, { hero, moon, heroAcceleration, heroWellAcceleration, moonWellAcceleration, wells = [], time = 0, dt }) {
  const dx = moon.x - hero.x, dy = moon.y - hero.y;
  const distance = Math.max(.001, Math.hypot(dx, dy)), nx = dx / distance, ny = dy / distance;
  const tangent = { x: -ny, y: nx };
  const relative = { x: moon.vx - hero.vx, y: moon.vy - hero.vy };
  const radialSpeed = relative.x * nx + relative.y * ny;
  const tangentialSpeed = relative.x * tangent.x + relative.y * tangent.y;
  const differential = { x: moonWellAcceleration.x - heroWellAcceleration.x, y: moonWellAcceleration.y - heroWellAcceleration.y };
  const nearbyWell = wells.some(well => remaining(well, time) > 0 && Math.hypot(moon.x - well.x, moon.y - well.y) < 3.2);
  const dominated = nearbyWell && Math.hypot(differential.x, differential.y) > 1.2;
  const borrowHold = dominated ? .55 : Math.max(0, state.borrowHold - dt);
  const borrowed = borrowHold > 0;
  const returning = !borrowed && (state.phase === 'returning' ? distance > 2.6 : distance > 3.0 || state.phase === 'borrowed');
  const phase = borrowed ? 'borrowed' : returning ? 'returning' : 'following';
  const targetRadius = borrowed ? 3.1 : COMPANION_ORBIT_RADIUS;
  const spring = borrowed ? 1.1 : returning ? 3.4 : 2.2;
  const damping = borrowed ? .8 : returning ? 2.3 : 1.5;
  const tangentialGain = borrowed ? .18 : returning ? .55 : 1.15;
  const desiredTangential = borrowed ? .7 : 1.35;
  const radial = -spring * (distance - targetRadius) - damping * radialSpeed;
  const tangential = (desiredTangential - tangentialSpeed) * tangentialGain;
  const correction = limit(nx * radial + tangent.x * tangential, ny * radial + tangent.y * tangential, returning ? 9 : borrowed ? 3.5 : 5.5);
  // The moon still feels its own nearby well. When borrowed, reduce only the
  // social correction; never weaken the actual gravity or teleport on release.
  const differentialBlend = borrowed ? 1 : returning ? .2 : .35;
  const raw = { x: heroAcceleration.x + differential.x * differentialBlend + correction.x,
    y: heroAcceleration.y + differential.y * differentialBlend + correction.y };
  const acceleration = limit(raw.x, raw.y, 24);
  const returned = state.phase === 'returning' && phase === 'following';
  return { state: { ...state, owned: true, phase, borrowHold }, acceleration, returned, distance,
    speedCap: Math.max(18, Math.hypot(hero.vx, hero.vy) + 8) };
}
