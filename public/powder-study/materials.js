export const EMPTY = 0;
export const SAND = 1;
export const WATER = 2;
export const STONE = 3;
export const WOOD = 4;
export const FIRE = 5;
export const PLANT = 6;
export const OIL = 7;
export const LAVA = 8;
export const STEAM = 9;
export const ASH = 10;
export const GLASS = 11;
export const SEED = 12;
export const ACID = 13;

export const MATERIALS = [
  { id: EMPTY, name: 'Eraser', symbol: '✕', color: '#111512', hint: 'Clear a space', group: 'tool' },
  { id: SAND, name: 'Sand', symbol: '◌', color: '#e7c875', hint: 'Falls and gathers', group: 'earth' },
  { id: WATER, name: 'Water', symbol: '≈', color: '#6faee9', hint: 'Flows and feeds', group: 'liquid' },
  { id: STONE, name: 'Stone', symbol: '▦', color: '#a7aba2', hint: 'Build a boundary', group: 'earth' },
  { id: WOOD, name: 'Wood', symbol: '▥', color: '#a77953', hint: 'Burns slowly', group: 'life' },
  { id: FIRE, name: 'Fire', symbol: '✳', color: '#ff7853', hint: 'Spreads and rises', group: 'energy' },
  { id: PLANT, name: 'Plant', symbol: '✻', color: '#9ad77b', hint: 'Water once; watch branches burst upward', group: 'life' },
  { id: OIL, name: 'Oil', symbol: '◒', color: '#c6a66a', hint: 'Floats and ignites', group: 'liquid' },
  { id: LAVA, name: 'Lava', symbol: '◆', color: '#ff9a56', hint: 'Melts the landscape', group: 'energy' },
  { id: STEAM, name: 'Steam', symbol: '﹏', color: '#c3d9d7', hint: 'Rises and cools', group: 'energy' },
  { id: ASH, name: 'Ash', symbol: '·', color: '#868c82', hint: 'Settles after fire', group: 'earth' },
  { id: GLASS, name: 'Glass', symbol: '◇', color: '#b4d9c4', hint: 'Sand transformed', group: 'earth' },
  { id: SEED, name: 'Seed', symbol: '•', color: '#dbca91', hint: 'Touch water on solid ground to sprout', group: 'life' },
  { id: ACID, name: 'Acid', symbol: '⌁', color: '#c6ed67', hint: 'Dissolves its path', group: 'liquid' },
];

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map(material => [material.id, material]));
