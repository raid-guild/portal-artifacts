import { LEVEL } from './level.js';
import { SOFTENING } from './physics.js';

export const DEFAULT_WELL_STRENGTH = 70;
const room = LEVEL.walls.slice(0, 4);
const makeLevel = (spawn, goal, walls = [], spikes = []) => ({ bounds: { ...LEVEL.bounds }, spawn, goal: { ...goal, radius: 1 }, walls: [...room.map(w => ({ ...w })), ...walls], spikes });
export const DEMOS = [
  { id: 'drift', title: '01 / A gentle curve', rule: 'Temporary gravity', color: '#76e9e3',
    description: 'An open room. Place a well beside your path, then let its pull fade.',
    question: 'How little force is enough to steer?', objective: 'Bend your flight toward the portal.',
    level: makeLevel({ x: -11, y: -3, vx: 2.5, vy: 0 }, { x: 11, y: 3 }), heroGravity: 0, moons: [] },
  { id: 'satellites', title: '02 / A little gravity', rule: 'The dot attracts matter', color: '#bfa5ff',
    description: 'Three loose moons respond to the dot and your wells. Attraction pulls both ways.',
    question: 'Does carrying a little world change the flight?', objective: 'Gather or scatter the pale moons. The portal is optional.',
    level: makeLevel({ x: -5, y: 0, vx: 1.3, vy: 0 }, { x: 12, y: 0 }), heroGravity: 12,
    moons: [{ x: -3.2, y: 0, vx: 1.3, vy: 2 }, { x: -5, y: 2.5, vx: -.7, vy: 0 }, { x: -7.8, y: 0, vx: 1.3, vy: -1.7 }] },
  { id: 'slingshot', title: '03 / Close to the flame', rule: 'Risk and redirection', color: '#ffae69',
    description: 'A stronger ember bends nearby trajectories. Its bright center is still fatal.',
    question: 'Can a hazard also become a useful tool?', objective: 'Arc around the ember and over the black barrier.',
    level: makeLevel({ x: -11, y: -3, vx: 2.6, vy: 1.2 }, { x: 11, y: 3 }, [{ x: 4, y: -4.2, w: .55, h: 9.6 }], [{ x: -1, y: 0, w: .55, h: .8, strength: 18 }]), heroGravity: 0, moons: [] },
  { id: 'gate', title: '04 / Bring a moon', rule: 'Matter opens a passage', color: '#ffd98b',
    description: 'Draw the gold moon into the gold ring. The gate latches open when the moon arrives.',
    question: 'Could gravity replace a key or a button?', objective: 'Bring the moon to the gold ring, then reach the portal.',
    level: makeLevel({ x: -11, y: -3, vx: 1, vy: .8 }, { x: 11, y: 0 }, [{ x: 0, y: 0, w: .55, h: 18, gate: true }]),
    heroGravity: 12, moons: [{ x: -7, y: 1.5, vx: 0, vy: 0 }], plate: { x: -5, y: 3, radius: 1.2 } },
  { id: 'maze', title: '05 / The winding room', rule: 'Level-design reference', color: '#89bfd4',
    description: 'The original winding maze, with soft wells, orange hazards, and a purple exit.',
    question: 'Which turns feel expressive, and which feel fiddly?', objective: 'Find your way around the two barriers.',
    level: LEVEL, heroGravity: 0, moons: [] },
  { id: 'orbit', title: '06 / An orbital sketch', rule: 'Catch, orbit, release', color: '#92c9ff',
    description: 'Begin in a circular orbit. Add another well or let the first one dissolve.',
    question: 'Where does an orbit become a drawing?', objective: 'Let the wells leave a pattern.',
    sandbox: true, level: LEVEL, heroGravity: 0, moons: [] },
];

export function getDemo(id) { return DEMOS.find(demo => demo.id === id) || DEMOS[0]; }

// The hero has unit mass. Small moon masses keep reaction forces gentle.
export function gravityExchange(hero, moons, strength) {
  const heroAcceleration = { x: 0, y: 0 };
  const moonAccelerations = moons.map(moon => {
    const dx = hero.x - moon.x, dy = hero.y - moon.y;
    const squared = dx * dx + dy * dy + SOFTENING * SOFTENING;
    const scale = strength / (squared * Math.sqrt(squared));
    const a = { x: dx * scale, y: dy * scale };
    heroAcceleration.x -= a.x * moon.mass;
    heroAcceleration.y -= a.y * moon.mass;
    return a;
  });
  return { hero: heroAcceleration, moons: moonAccelerations };
}

export function plateActivated(plate, moons) {
  return !!plate && moons.some(moon => Math.hypot(moon.x - plate.x, moon.y - plate.y) <= plate.radius - .16);
}
