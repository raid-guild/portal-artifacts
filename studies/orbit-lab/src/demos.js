import { singleRuleStudies } from './studies.js';
import { LEVEL } from './level.js';
import { SOFTENING } from './physics.js';

export const DEFAULT_WELL_STRENGTH = 70;
const room = LEVEL.walls.slice(0, 4);
const perimeter = (bounds) => {
  const width = bounds.maxX - bounds.minX, height = bounds.maxY - bounds.minY;
  const cx = (bounds.minX + bounds.maxX) / 2, cy = (bounds.minY + bounds.maxY) / 2;
  return [
    { x: bounds.minX - .25, y: cy, w: .5, h: height + .5 },
    { x: bounds.maxX + .25, y: cy, w: .5, h: height + .5 },
    { x: cx, y: bounds.maxY + .25, w: width + .5, h: .5 },
    { x: cx, y: bounds.minY - .25, w: width + .5, h: .5 },
  ];
};
const makeLevel = (spawn, goal, walls = [], spikes = [], bounds = LEVEL.bounds) => ({ bounds: { ...bounds }, spawn, goal: { radius: 1, ...goal }, walls: [...(bounds === LEVEL.bounds ? room : perimeter(bounds)).map(w => ({ ...w })), ...walls], spikes });
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

DEMOS.push(...singleRuleStudies(makeLevel));
DEMOS.push(
  { id: 'burnout', title: `${String(DEMOS.length + 1).padStart(2, '0')} / The burning light`, rule: 'Light as fuel', color: '#ffd98b',
    description: 'Your glow slowly burns away. Gather wandering embers to refill it and keep the gate open.',
    question: 'Can light become a resource you route around?', objective: 'Gather pale embers to keep the gate open, then reach the portal.',
    mechanic: 'burnout', heroGravity: 0, moons: [],
    level: makeLevel({ x: -11, y: -3, vx: .9, vy: .2 }, { x: 11, y: 3 }, [{ x: 5, y: 0, w: .55, h: 18, gate: true }]) },
  { id: 'wideworld', title: `${String(DEMOS.length + 2).padStart(2, '0')} / A wider world`, rule: 'Scale and space', color: '#a8c9ff',
    description: 'A broad chamber with long open stretches and a larger portal. The same gravity rules feel different across distance.',
    question: 'How does room to roam change your aim?', objective: 'Cross the great chamber and enter the far portal.',
    heroGravity: 0, moons: [],
    level: makeLevel({ x: -42, y: -18, vx: 2.5, vy: .8 }, { x: 42, y: 18, radius: 2 }, [
      { x: -23, y: -12, w: .8, h: 16 }, { x: -2, y: 13, w: .8, h: 18 },
      { x: 20, y: -11, w: .8, h: 19 },
    ], [], { minX: -48, maxX: 48, minY: -27, maxY: 27 }) },
);

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
