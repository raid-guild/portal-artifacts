export const BURN_ACCELERATION = 4;
export const BURN_LIGHT_RATE = .05;
export const BURN_SPEED_CAP = 10;

// Burn follows current motion; it cannot launch a resting light or add speed
// past the ordinary movement cap. Cost is proportional to acceleration used.
export function burnStep({ vx, vy, dt, availableEnergy = Infinity, acceleration = BURN_ACCELERATION,
  speedCap = BURN_SPEED_CAP, lightRate = BURN_LIGHT_RATE }) {
  const speed = Math.hypot(vx, vy);
  if (!Number.isFinite(speed) || speed < 1e-5 || speed >= speedCap || dt <= 0 || acceleration <= 0) {
    return { ax: 0, ay: 0, cost: 0, active: false };
  }
  const duration = Math.min(dt, (speedCap - speed) / acceleration,
    lightRate > 0 ? Math.max(0, availableEnergy) / lightRate : dt);
  if (duration <= 0) return { ax: 0, ay: 0, cost: 0, active: false };
  const applied = acceleration * duration / dt;
  return { ax: vx / speed * applied, ay: vy / speed * applied,
    cost: lightRate * duration, active: true };
}
