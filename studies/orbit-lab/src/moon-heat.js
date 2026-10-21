export const MOON_BURN_SECONDS = 1;
export const MOON_COOL_SECONDS = 2;

export function createMoonHeat() { return { heat: 0, smoldering: false, burned: false }; }

// Fraction of a fixed step spent inside a circle, including a fast pass that
// enters and exits between its endpoints.
export function sweptCircleFraction(from, to, center, radius) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const ox = from.x - center.x, oy = from.y - center.y;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return ox * ox + oy * oy <= radius * radius ? 1 : 0;
  const b = 2 * (ox * dx + oy * dy);
  const c = ox * ox + oy * oy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant <= 0) return c < 0 ? 1 : 0;
  const root = Math.sqrt(discriminant);
  return Math.max(0, Math.min(1, (-b + root) / (2 * a)) - Math.max(0, (-b - root) / (2 * a)));
}

function sweptCircleInterval(from, to, center, radius) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const ox = from.x - center.x, oy = from.y - center.y;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return ox * ox + oy * oy <= radius * radius ? [0, 1] : null;
  const b = 2 * (ox * dx + oy * dy);
  const c = ox * ox + oy * oy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant <= 0) return c < 0 ? [0, 1] : null;
  const root = Math.sqrt(discriminant);
  const start = Math.max(0, (-b - root) / (2 * a));
  const end = Math.min(1, (-b + root) / (2 * a));
  return end > start ? [start, end] : null;
}

export function moonEmberContact(from, to, radius, entities, runtime) {
  const intervals = [];
  for (const entity of entities || []) {
    if (entity.type !== 'ember' || entity.motion !== 'fixed' || !entity.lethal || !entity.burnsCompanions) continue;
    const center = runtime?.items?.[entity.id] || entity;
    const interval = sweptCircleInterval(from, to, center, radius + entity.radius);
    if (interval) intervals.push(interval);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let fraction = 0, end = 0;
  for (const [start, stop] of intervals) {
    fraction += Math.max(0, stop - Math.max(start, end));
    end = Math.max(end, stop);
  }
  return Math.min(1, fraction);
}

export function stepMoonHeat(state, contactFraction, dt) {
  if (state.burned) return { state, ignited: false, burned: false };
  const contact = Math.max(0, Math.min(1, contactFraction));
  const heat = Math.max(0, Math.min(MOON_BURN_SECONDS,
    state.heat + contact * dt - (1 - contact) * dt * MOON_BURN_SECONDS / MOON_COOL_SECONDS));
  const burned = heat >= MOON_BURN_SECONDS;
  const smoldering = heat > 0 && !burned;
  return { state: { heat, smoldering, burned: state.burned || burned },
    ignited: !state.smoldering && contact > 0 && !burned, burned };
}
