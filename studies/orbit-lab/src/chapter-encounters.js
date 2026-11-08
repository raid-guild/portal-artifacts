import { chapterUnlocked } from './chapter.js';

export const ENCOUNTER_WINS_KEY = 'orbit-lab-encounter-wins-v1';
const wall = (id, x, y, width, height) => ({ id, x, y, width, height });
const entity = (id, type, x, y, extras = {}) => ({ id, type, x, y, ...extras });

const specs = [
  { name: 'The first answer', description: 'Catch a shy ember in open space.', bounds: [-16, 16, -9, 9],
    spawn: [-9, 0, 2.8], boss: [5, 0], walls: [], entities: [], pickups: [[-5, 0], [0, 0]],
    bossSpeed: 1.5, bossMines: false, bossSeeksLight: false,
    heroLight: .85, bossLight: .45, burnRate: .007 },
  { name: 'An opening in the echo', description: 'Wait for the orbiting embers, then intercept.', bounds: [-29, 29, -17, 17],
    spawn: [-19, 0, 3], boss: [17, 0],
    walls: [wall('island-west', -7, 0, 2, 12), wall('island-east', 8, 0, 2, 12)],
    entities: [entity('waiting-place', 'stillness', -15, -8, { radius: 1, captureTime: 1, manualRelease: true }),
      entity('orbit-a', 'ember', 0, 0, { radius: .5, gravity: 0, lethal: false, motion: 'orbit', speed: 1.35, orbitRadius: 4.4, phase: 0, orbitDirection: 'counterclockwise' }),
      entity('orbit-b', 'ember', 0, 0, { radius: .5, gravity: 0, lethal: false, motion: 'orbit', speed: 1.35, orbitRadius: 4.4, phase: 180, orbitDirection: 'counterclockwise' })],
    pickups: [[-20, 8], [20, -8]], bossSpeed: 1.8, bossMines: false, heroLight: .75, bossLight: .55, burnRate: .008 },
  { name: 'The dark between notes', description: 'Use the eclipse to break the pursuit.', bounds: [-36, 36, -20, 20],
    spawn: [-26, 0, 3], boss: [23, 2],
    walls: [wall('dark-west', -12, -5, 2, 17), wall('dark-east', 12, 5, 2, 17), wall('dark-center', 0, 0, 2, 10)],
    entities: [entity('dark-eclipse', 'eclipse', 0, -12, { radius: 1.2, captureTime: 1, manualRelease: true, fadeTime: 2.5 })],
    pickups: [[-24, 12], [25, -11]], bossSpeed: 2, bossMines: true, heroLight: .72, bossLight: .6, burnRate: .009 },
  { name: 'Across the divide', description: 'Cross the room through portals and return to the light.', bounds: [-43, 43, -22, 22],
    spawn: [-31, 0, 3.2], boss: [29, 0],
    walls: [wall('divide-top', 0, 15, 2, 14), wall('divide-bottom', 0, -15, 2, 14),
      wall('west-shoulder', -20, 0, 2, 12), wall('east-shoulder', 20, 0, 2, 12)],
    entities: [entity('bridge-west', 'portal', -29, -14, { radius: 1.25, pairId: 'bridge', exitDirection: 0 }),
      entity('bridge-east', 'portal', 29, 14, { radius: 1.25, pairId: 'bridge', exitDirection: 180 }),
      entity('return-west', 'portal', -29, 14, { radius: 1.25, pairId: 'return', exitDirection: 0 }),
      entity('return-east', 'portal', 29, -14, { radius: 1.25, pairId: 'return', exitDirection: 180 })],
    pickups: [[-17, 15], [17, -15]], bossSpeed: 2.15, bossMines: true, heroLight: .7, bossLight: .63, burnRate: .01 },
  { name: 'Something heard us', description: 'Circle the island as the ember and its echoes give chase.', bounds: [-51, 51, -27, 27],
    spawn: [-39, 0, 3.4], boss: [35, 1],
    walls: [wall('signal-island', 0, 0, 13, 12), wall('upper-arm', -23, 14, 2, 11), wall('lower-arm', 24, -14, 2, 11)],
    entities: [entity('west-launch', 'impulse', -30, -16, { radius: 1.2, direction: 0, speed: 7 }),
      entity('east-launch', 'impulse', 30, 16, { radius: 1.2, direction: 180, speed: 7 }),
      entity('waiting-pocket', 'stillness', 0, -19, { radius: 1, captureTime: 1, manualRelease: true })],
    pickups: [[-40, 19], [40, -18]], bossSpeed: 2.35, bossMines: true, heroLight: .68, bossLight: .7, burnRate: .01 },
];

export function getChapterEncounter(id) {
  const index = Number(id) - 1;
  if (!Number.isInteger(index) || !specs[index]) return null;
  const spec = specs[index];
  const [minX, maxX, minY, maxY] = spec.bounds;
  const width = maxX - minX, height = maxY - minY;
  const perimeter = [
    { id: 'perimeter-left', x: minX - .25, y: (minY + maxY) / 2, w: .5, h: height + .5 },
    { id: 'perimeter-right', x: maxX + .25, y: (minY + maxY) / 2, w: .5, h: height + .5 },
    { id: 'perimeter-top', x: (minX + maxX) / 2, y: maxY + .25, w: width + .5, h: .5 },
    { id: 'perimeter-bottom', x: (minX + maxX) / 2, y: minY - .25, w: width + .5, h: .5 },
  ];
  return { id: `encounter-${index + 1}`, chapter: index + 1, title: spec.name, kicker: 'ENCOUNTER',
    summary: spec.description, objective: spec.description, color: '#ffa869', mechanic: 'encounter',
    usesFollowCamera: true, usesEntityRuntime: true,
    heroGravity: 0, moons: [], sandbox: false,
    level: { bounds: { minX, maxX, minY, maxY }, spawn: { x: spec.spawn[0], y: spec.spawn[1], vx: spec.spawn[2], vy: 0 },
      goal: { x: maxX + 20, y: 0, radius: 1, gravity: 0 },
      walls: [...perimeter, ...spec.walls.map(item => ({ x: item.x, y: item.y, w: item.width, h: item.height, id: item.id }))], spikes: [], dangers: [] },
    entities: structuredClone(spec.entities), soundGates: [],
    settings: { startLight: spec.heroLight, burnRate: spec.burnRate, graceSeconds: 8,
      wellStrength: 70, wellLifetime: 16, maxActiveWells: 1, maxTotalWells: null, randomRecharge: false },
    duel: { boss: { x: spec.boss[0], y: spec.boss[1] }, bossSpeed: spec.bossSpeed,
      bossMines: spec.bossMines, bossSeeksLight: spec.bossSeeksLight !== false,
      rechargeThreshold: spec.rechargeThreshold,
      heroLight: spec.heroLight, bossLight: spec.bossLight,
      burnRate: spec.burnRate, bossBurnRate: spec.bossBurnRate ?? spec.burnRate,
      pickups: spec.pickups.map(([x, y], pickupIndex) => ({ x, y, id: pickupIndex + 1, createdAt: 0 })) },
  };
}

export const chapterEncounterAvailable = (id, bestGates) => !!getChapterEncounter(id) && chapterUnlocked(bestGates, id);
export function readEncounterWins(storage) {
  try { return new Set(JSON.parse(storage?.getItem(ENCOUNTER_WINS_KEY) || '[]').filter(id => Number.isInteger(id) && id >= 1 && id <= 5)); }
  catch { return new Set(); }
}
export function saveEncounterWin(storage, wins, id) {
  if (!getChapterEncounter(id)) return wins;
  const next = new Set(wins); next.add(Number(id));
  try { storage?.setItem(ENCOUNTER_WINS_KEY, JSON.stringify([...next].sort((a, b) => a - b))); } catch {}
  return next;
}
export function publicEncounterAchievements(wins) {
  return specs.map((spec, index) => ({ id: index + 1, title: spec.name, discovered: wins.has(index + 1) }));
}
