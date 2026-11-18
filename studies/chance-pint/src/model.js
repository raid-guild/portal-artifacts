export const DICE = [4, 6, 8, 10, 12, 20];
export const SIGILS = ['✦', '◇', '☾', '△', '⊕', '✶', '⬡', '☀'];
export const PARTY_MARKS = [
  { glyph: '▤', name: 'Stripes', color: '#ff82ab' },
  { glyph: '⠿', name: 'Dots', color: '#f8dc76' },
  { glyph: '▦', name: 'Checks', color: '#72e1d0' },
  { glyph: '≋', name: 'Waves', color: '#c9b7ff' },
];
export const COMPASS_MARKS = ['↑', '→', '↓', '←'];
export const LANES = [
  ...DICE.map(die => ({ id: `d${die}`, label: `D${die}`, kind: 'die', die,
    marks: Array.from({ length: die }, (_, i) => die === 10 ? i : i + 1) })),
  { id: 'sigils', label: 'SIGILS', kind: 'sigils', marks: SIGILS },
  { id: 'party', label: 'PARTY', kind: 'party', marks: PARTY_MARKS.map(mark => mark.glyph) },
  { id: 'compass', label: 'COMPASS', kind: 'compass', marks: COMPASS_MARKS },
  { id: 'pour-meter', label: 'METER', kind: 'meter', marks: [] },
  { id: 'brand', label: 'RAIDGUILD', kind: 'brand', marks: [] },
];
export const POUR_METER_INDEX = LANES.findIndex(lane => lane.kind === 'meter');
export const BRAND_FACE_INDEX = LANES.findIndex(lane => lane.kind === 'brand');
export const READ_BOTTOM = 15;
export const READ_TOP = 128;

export function innerVolume(z) {
  const t = Math.max(0, z - 6);
  const r = 24 + (16 * t) / 144;
  return Math.PI * t * (24 ** 2 + 24 * r + r ** 2) / 3;
}

export function heightAtVolume(volume) {
  let lo = 6, hi = 150;
  for (let i = 0; i < 48; i += 1) {
    const mid = (lo + hi) / 2;
    if (innerVolume(mid) < volume) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function bandEdges(count) {
  const start = innerVolume(READ_BOTTOM);
  const amount = innerVolume(READ_TOP) - start;
  return Array.from({ length: count + 1 }, (_, i) => {
    if (i === 0) return READ_BOTTOM;
    if (i === count) return READ_TOP;
    return heightAtVolume(start + amount * i / count);
  });
}

export function printedMarks(lane) {
  const { marks } = lane;
  if (!marks.length) return marks;
  const count = marks.length * Math.round(20 / marks.length);
  return Array.from({ length: count }, (_, i) => marks[i % marks.length]);
}

export function readTrack(marks, height) {
  if (!Number.isFinite(height) || height < READ_BOTTOM || height > READ_TOP || !marks.length) return null;
  const edges = bandEdges(marks.length);
  const index = height === READ_TOP ? marks.length - 1 :
    edges.findIndex((edge, i) => i < marks.length && height >= edge && height < edges[i + 1]);
  return marks[index];
}

export function readPourMeter(height) {
  if (!Number.isFinite(height) || height < READ_BOTTOM || height > READ_TOP) return null;
  const start = innerVolume(READ_BOTTOM);
  return Math.round(100 * (innerVolume(height) - start) / (innerVolume(READ_TOP) - start));
}

export function playedFace(die, printed, offset) {
  if (!DICE.includes(die) || !Number.isInteger(offset) || offset < 0 || offset >= die) throw new RangeError('Invalid die or coaster offset.');
  if (!Number.isInteger(printed) || printed < (die === 10 ? 0 : 1) || printed > (die === 10 ? 9 : die)) throw new RangeError('Invalid printed face.');
  return die === 10 ? (printed + offset) % 10 : ((printed - 1 + offset) % die) + 1;
}

export function coasterLookup(die, offset) {
  const lane = LANES.find(item => item.kind === 'die' && item.die === die);
  if (!lane) throw new RangeError('Invalid die.');
  return lane.marks.map(printed => ({ printed, played: playedFace(die, printed, offset) }));
}
