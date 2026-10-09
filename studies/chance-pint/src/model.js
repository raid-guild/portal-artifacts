import original from '../model-source/original-layout.json' with { type: 'json' };

export const DICE = [4, 6, 8, 10, 12, 20];
export const READ_BOTTOM = 15;
export const READ_TOP = 128;
export const originalLayout = original;

export function innerVolume(z) {
  const t = Math.max(0, z - 6);
  const r = 24 + (16 * t) / 144;
  return Math.PI * t * (24 ** 2 + 24 * r + r ** 2) / 3;
}

export function heightAtVolume(volume) {
  let lo = 6;
  let hi = 150;
  for (let i = 0; i < 48; i += 1) {
    const mid = (lo + hi) / 2;
    if (innerVolume(mid) < volume) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function bandEdges(sides) {
  const start = innerVolume(READ_BOTTOM);
  const amount = innerVolume(READ_TOP) - start;
  return Array.from({ length: sides + 1 }, (_, i) => {
    if (i === 0) return READ_BOTTOM;
    if (i === sides) return READ_TOP;
    return heightAtVolume(start + (amount * i) / sides);
  });
}

export function readTrack(track, height) {
  if (!Number.isFinite(height) || height < READ_BOTTOM || height > READ_TOP) return null;
  const edges = bandEdges(track.die);
  const index = height === READ_TOP ? track.die - 1 :
    edges.findIndex((edge, i) => i < track.die && height >= edge && height < edges[i + 1]);
  return track.bottom_to_top[index];
}

export function makeLayout(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 4294967295) {
    throw new RangeError('Seed must be an unsigned 32-bit integer.');
  }
  if (seed === 7319) return structuredClone(originalLayout);
  let state = seed >>> 0;
  function random() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  const tracks = [];
  for (let repeat = 0; repeat < 2; repeat += 1) {
    for (const die of DICE) {
      const bottom_to_top = Array.from({ length: die }, (_, i) => i + 1);
      for (let i = die - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [bottom_to_top[i], bottom_to_top[j]] = [bottom_to_top[j], bottom_to_top[i]];
      }
      tracks.push({ die, bottom_to_top });
    }
  }
  return { seed, tracks };
}

export function trackName(index) {
  return `d${DICE[index % DICE.length]} · ${index < DICE.length ? 'A' : 'B'}`;
}
