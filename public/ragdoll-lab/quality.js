export const QUALITY_STORAGE_KEY = 'ragdoll-lab:graphics-quality';

export function readQuality(storage) {
  try { return storage?.getItem(QUALITY_STORAGE_KEY) === 'low' ? 'low' : 'standard'; }
  catch { return 'standard'; }
}

export function saveQuality(storage, quality) {
  if (quality !== 'standard' && quality !== 'low') throw new RangeError('Unknown graphics quality');
  try { storage?.setItem(QUALITY_STORAGE_KEY, quality); return true; }
  catch { return false; }
}

export function createRenderGate(initialQuality = 'standard') {
  if (!['standard', 'low'].includes(initialQuality)) throw new RangeError('Unknown graphics quality');
  const interval = 1000 / 30;
  let quality = initialQuality;
  let lastNow = null;
  let credit = 0;
  let immediate = true;
  return {
    get quality() { return quality; },
    setQuality(value) {
      if (!['standard', 'low'].includes(value)) throw new RangeError('Unknown graphics quality');
      quality = value;
      lastNow = null;
      credit = 0;
      immediate = true;
    },
    reset() { lastNow = null; credit = 0; immediate = true; },
    shouldRender(now) {
      if (!Number.isFinite(now)) return false;
      if (quality === 'standard') { lastNow = now; return true; }
      if (immediate) { immediate = false; lastNow = now; return true; }
      const elapsed = Math.max(0, now - lastNow);
      lastNow = now;
      credit += Math.min(elapsed, interval);
      if (credit + 1e-6 < interval) return false;
      credit = Math.max(0, credit - interval);
      return true;
    }
  };
}

export function driveRenderFrame(gate, now, step, update, render) {
  step();
  update();
  if (!gate.shouldRender(now)) return false;
  render();
  return true;
}
