export const DEATH_DURATION = 0.65;
export const REDUCED_DEATH_DURATION = 0.2;

// Visual time is separate from simulation time: physics stops at the exact fatal tick.
export function createDeathTransition(reducedMotion = false) {
  return { elapsed: 0, duration: reducedMotion ? REDUCED_DEATH_DURATION : DEATH_DURATION, reducedMotion, complete: false };
}

export function stepDeathTransition(transition, elapsed) {
  if (!transition || transition.complete) return { transition, finished: false, fade: 1, ring: 0, radius: 0 };
  const nextElapsed = Math.min(transition.duration, transition.elapsed + Math.max(0, elapsed));
  const progress = nextElapsed / transition.duration;
  const finished = nextElapsed >= transition.duration;
  const next = { ...transition, elapsed: nextElapsed, complete: finished };
  return {
    transition: next,
    finished,
    fade: (1 - progress) ** 2,
    ring: transition.reducedMotion ? 0 : (1 - progress) ** 2 * Math.min(1, progress * 8),
    radius: transition.reducedMotion ? 0 : 0.3 + progress * 3.7,
  };
}
