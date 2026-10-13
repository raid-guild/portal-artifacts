// Birds that reach the pointer scatter independently, then rejoin the flock.
const INNER = 100;
const RESET = 145;
const DURATION = 1.35;
const PULSE_RADIUS = 260;
const PULSE_COOLDOWN = 2.2;

export function clearPointerPulse(state) {
  state.cooldown = 0;
}

export function updatePointerPulse(pointer, birds, state, dt) {
  state.cooldown = Math.max(0, state.cooldown - dt);
  if (!pointer.active || state.cooldown > 0) return null;
  if (!birds.some(bird => Math.hypot(bird.x - pointer.x, bird.y - pointer.y) < INNER)) return null;
  state.cooldown = PULSE_COOLDOWN;
  return {x: pointer.x, y: pointer.y};
}

export function clearPointerResponse(state) {
  state.time = 0;
  state.ready = true;
}

export function pointerResponse(x, y, pointer, id, state, dt, pulse = null) {
  state.time = Math.max(0, state.time - dt);
  const dx = x - pointer.x, dy = y - pointer.y;
  const distance = Math.hypot(dx, dy);
  if (pointer.active && distance > RESET) state.ready = true;
  if (pulse) {
    const pulseDistance = Math.hypot(x - pulse.x, y - pulse.y);
    if (pulseDistance < PULSE_RADIUS) {
      state.time = Math.max(state.time, DURATION * (.7 + .3 * (1 - pulseDistance / PULSE_RADIUS)));
      state.strength = .65 + .35 * (1 - pulseDistance / PULSE_RADIUS);
      state.ready = false;
      state.x = pulse.x;
      state.y = pulse.y;
    }
  }
  if (pointer.active && distance < INNER && state.ready) {
    state.time = DURATION;
    state.strength = 1;
    state.ready = false;
    state.x = pointer.x;
    state.y = pointer.y;
  }
  if (state.time > 0) {
    const ox = x - state.x, oy = y - state.y;
    const radius = Math.hypot(ox, oy);
    // Golden-angle fallback gives coincident birds distinct escape paths.
    const angle = radius > 1e-4 ? Math.atan2(oy, ox) : id * 2.39996323;
    const spread = Math.sin(id * 9.73) * .32;
    const strength = (.3 + .7 * state.time / DURATION) * (state.strength ?? 1);
    return [Math.cos(angle + spread) * 520 * strength,
            Math.sin(angle + spread) * 520 * strength, strength];
  }
  if (!pointer.active || distance <= INNER || distance >= 320) return [0, 0, 0];
  const attraction = 42 * Math.sin(Math.PI * (distance - INNER) / 220);
  return [-dx / distance * attraction, -dy / distance * attraction, 0];
}
