import { localToWorld } from './layout.js';

export function servicePoint(stop) {
  if (stop?.type !== 'beer') return null;
  return localToWorld(stop, 0, 2.55);
}
export const pourDuration = 3.6;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function boothStatus(position, stop, approaching = false) {
  const point = servicePoint(stop);
  if (!point) return 'far';
  if (Math.hypot(position.x - point.x, position.z - point.z) < .85) return 'ready';
  return approaching ? 'approaching' : 'far';
}

export function samplePour(seconds) {
  const fill = clamp((seconds - .65) / 1.95);
  return {
    fill,
    stream: seconds >= .65 && seconds < 2.6,
    reach: smooth(seconds / .5) * (1 - smooth((seconds - 2.7) / .6)),
    done: seconds >= pourDuration
  };
}

// A single synchronous timeline: canceled runs can never complete later.
export function createPourSession() {
  let current = null;
  let serial = 0;
  function finish() {
    if (!current) return false;
    const completed = current;
    current = null;
    completed.onFrame?.(samplePour(pourDuration));
    completed.onComplete?.(completed.token);
    return true;
  }
  return {
    get active() { return current !== null; },
    start({ onFrame, onComplete, onCancel, reduced = false }) {
      if (current) return false;
      current = { token: ++serial, elapsed: 0, onFrame, onComplete, onCancel };
      onFrame?.(samplePour(0));
      if (reduced) finish();
      return true;
    },
    update(dt) {
      if (!current) return;
      current.elapsed += Math.max(0, dt);
      if (current.elapsed >= pourDuration) finish();
      else current.onFrame?.(samplePour(current.elapsed));
    },
    finish,
    cancel() {
      if (!current) return false;
      const canceled = current;
      current = null;
      canceled.onCancel?.(canceled.token);
      return true;
    }
  };
}
