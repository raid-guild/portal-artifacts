// Exposure is independent of remaining light. It changes only on simulation
// ticks, so pausing the game also pauses an eclipse in progress.
export function stepEclipseExposure(exposure, held, dt, fadeTime = 2, recoveryTime = 1) {
  const current = Math.max(0, Math.min(1, Number.isFinite(exposure) ? exposure : 1));
  const elapsed = Math.max(0, Number.isFinite(dt) ? dt : 0);
  return held
    ? Math.max(0, current - elapsed / Math.max(.05, fadeTime))
    : Math.min(1, current + elapsed / Math.max(.05, recoveryTime));
}
