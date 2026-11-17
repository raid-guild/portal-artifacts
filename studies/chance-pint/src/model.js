import original from '../model-source/original-layout.json' with { type: 'json' };

export const DICE = [4, 6, 8, 10, 12, 20];
export const BRAND_FACE_INDEX = 6;
export const NUMBERED_TRACK_INDICES = Array.from({ length: 12 }, (_, i) => i).filter(i => i !== BRAND_FACE_INDEX);
export function normalizeTrackIndex(index) { return index === BRAND_FACE_INDEX ? 0 : index; }
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

export const SIGILS = ['✦', '◇', '☾', '△', '⊕', '✶', '⬡', '☀'];

export function laneLabel(die) {
  return die === 12 ? 'PARTY / COMPASS' : die === 8 ? 'SIGILS' : `D${die}`;
}

export function printTrack(track) {
  const faces = track.die === 12 ? track.bottom_to_top.filter(face => face <= 4) : track.bottom_to_top;
  const repeats = Math.round(20 / faces.length);
  return { ...track, bottom_to_top: Array.from({ length: repeats * faces.length }, (_, i) => faces[i % faces.length]) };
}

export function faceLabel(die, value) {
  if (die === 8 && value != null) return SIGILS[value - 1];
  return die === 10 && value === 10 ? 0 : value;
}

export function readTrack(track, height) {
  if (!Number.isFinite(height) || height < READ_BOTTOM || height > READ_TOP) return null;
  const count = track.bottom_to_top.length;
  const edges = bandEdges(count);
  const index = height === READ_TOP ? count - 1 :
    edges.findIndex((edge, i) => i < count && height >= edge && height < edges[i + 1]);
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
  if (index === POUR_METER_INDEX) return 'Pour meter';
  if (index === BRAND_FACE_INDEX) return 'RaidGuild brand face';
  return `${laneLabel(DICE[index % DICE.length])} · ${index < DICE.length ? 'A' : 'B'}`;
}

export const POUR_METER_INDEX = 8;

export function readPourMeter(height) {
  if (!Number.isFinite(height) || height < READ_BOTTOM || height > READ_TOP) return null;
  const start = innerVolume(READ_BOTTOM);
  return Math.round(100 * (innerVolume(height) - start) / (innerVolume(READ_TOP) - start));
}

export const PARTY_INDEX = 4;
export const COMPASS_INDEX = 10;
export const PARTY_MARKS = [
  { glyph: '▤', name: 'Stripes', color: '#ff82ab' },
  { glyph: '⠿', name: 'Dots', color: '#f8dc76' },
  { glyph: '▦', name: 'Checks', color: '#72e1d0' },
  { glyph: '≋', name: 'Waves', color: '#c9b7ff' },
];
export const COMPASS_MARKS = ['↑', '→', '↓', '←'];
