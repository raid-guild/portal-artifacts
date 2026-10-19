export const STEP = 1 / 120;
export const SOFTENING = 0.75;
export const MAX_WELLS = 2;

export function remaining(well, time) {
  return Math.max(0, well.createdAt + well.lifetime - time);
}

export function wellPower(well, time, mode = 'fade') {
  const left = remaining(well, time);
  if (left <= 0) return 0;
  if (mode === 'snap') return 1;
  return Math.min(1, left / (well.lifetime * 0.2));
}

export function acceleration(position, wells, time, mode = 'fade') {
  let x = 0;
  let y = 0;
  for (const well of wells) {
    const power = wellPower(well, time, mode);
    if (power === 0) continue;
    const dx = well.x - position.x;
    const dy = well.y - position.y;
    const squared = dx * dx + dy * dy + SOFTENING * SOFTENING;
    const scale = well.strength * power / (squared * Math.sqrt(squared));
    x += dx * scale;
    y += dy * scale;
  }
  return { x, y };
}

// Matches cannon-es's semi-implicit Euler update for a free body with force applied.
export function advance(state, wells, time, dt = STEP, mode = 'fade') {
  const a = acceleration(state, wells, time, mode);
  const vx = state.vx + a.x * dt;
  const vy = state.vy + a.y * dt;
  return { x: state.x + vx * dt, y: state.y + vy * dt, vx, vy };
}

export function predict(state, wells, time, seconds = 5, mode = 'fade', sampleEvery = 8) {
  const points = [{ x: state.x, y: state.y }];
  let current = { ...state };
  const steps = Math.ceil(seconds / STEP);
  for (let i = 0; i < steps; i++) {
    current = advance(current, wells, time + i * STEP, STEP, mode);
    if ((i + 1) % sampleEvery === 0) points.push({ x: current.x, y: current.y });
  }
  return points;
}

export function addWell(wells, well) {
  return [...wells, well].slice(-MAX_WELLS);
}
