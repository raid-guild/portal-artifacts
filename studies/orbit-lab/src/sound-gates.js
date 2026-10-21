import { BLOB_RADIUS } from './level.js';
import { segmentDistance } from './studies.js';

export const SOUND_GATE_COLORS = ['#76e9e3', '#bfa5ff', '#ffd98b'];
export const SOUND_GATE_NAMES = ['bass', 'offbeat', 'chime'];
export const SOUND_GATE_COUNT = 3;
export const BEST_GATES_KEY = 'orbit-lab-campaign-finished-gates-v2';

export function createSoundGates() { return { mask: 0, beat: -1 }; }
export function gateCount(mask) { return [0, 1, 2].reduce((count, id) => count + ((mask >> id) & 1), 0); }
export function gatePattern(mask) {
  return SOUND_GATE_NAMES.filter((_, id) => mask & (1 << id)).join(' + ') || 'none';
}

// One fixed-step update: swept pickup once, then a shared quarter-second clock.
export function stepSoundGates(state, gates, before, hero, time) {
  let mask = state.mask;
  const acquired = [];
  for (const gate of gates) {
    if (mask & (1 << gate.id)) continue;
    if (segmentDistance(before, hero, gate) <= gate.radius + BLOB_RADIUS) {
      mask |= 1 << gate.id;
      acquired.push(gate.id);
    }
  }
  const beat = Math.floor(time * 4);
  const beats = beat === state.beat ? [] : SOUND_GATE_NAMES.map((_, id) => id).filter(id => mask & (1 << id)).map(id => ({ id, beat }));
  return { state: { mask, beat }, acquired, beats };
}

export function validateBestGates(value, knownLevels = [1, 2, 3]) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const id of knownLevels) if (Number.isInteger(value[id]) && value[id] >= 0 && value[id] <= 7) result[id] = value[id];
  return result;
}
export function betterGateMask(best, candidate) {
  return best === undefined || gateCount(candidate) > gateCount(best) ? candidate : best;
}
