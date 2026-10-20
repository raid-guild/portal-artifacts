import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMOS, getDemo, DEFAULT_WELL_STRENGTH, gravityExchange, plateActivated } from './demos.js';
import { canPlaceWell, mazeAcceleration } from './level.js';
import { STEP } from './physics.js';

test('gallery presets have valid spawns, exits, unique deep links and gentler wells', () => {
  assert.equal(new Set(DEMOS.map(demo => demo.id)).size, DEMOS.length);
  assert.ok(DEFAULT_WELL_STRENGTH < 85);
  for (const demo of DEMOS) {
    assert.equal(getDemo(demo.id), demo);
    assert.ok(canPlaceWell(demo.level.spawn, demo.level), demo.id + ' spawn should be in open space');
    assert.ok(demo.level.goal.x < demo.level.bounds.maxX);
    assert.ok(demo.level.goal.y < demo.level.bounds.maxY);
    assert.ok(demo.moons.every(moon => canPlaceWell(moon, demo.level)));
  }
  assert.equal(getDemo('unknown').id, 'drift');
});

test('dot gravity attracts moons with equal and opposite total force', () => {
  const hero = { x: 0, y: 0 }, moons = [{ x: 2, y: 1, mass: .08 }, { x: -1, y: -3, mass: .08 }];
  const result = gravityExchange(hero, moons, 12);
  assert.ok(result.moons[0].x < 0 && result.moons[0].y < 0);
  for (const axis of ['x', 'y']) {
    const total = result.hero[axis] + moons.reduce((sum, moon, i) => sum + result.moons[i][axis] * moon.mass, 0);
    assert.ok(Math.abs(total) < 1e-12);
  }
  const off = gravityExchange(hero, moons, 0);
  assert.equal(Math.hypot(off.hero.x, off.hero.y), 0);
  assert.ok(off.moons.every(force => Math.hypot(force.x, force.y) === 0));
  const overlap = gravityExchange(hero, [{ ...hero, mass: .08 }], 12);
  assert.ok(Number.isFinite(overlap.hero.x) && Number.isFinite(overlap.moons[0].y));
});

test('a valid player well can bring the moon to the gate switch', () => {
  const demo = getDemo('gate');
  const hero = { ...demo.level.spawn };
  const moon = { ...demo.moons[0], mass: .08 };
  const well = { x: -4.3, y: 3.7, strength: DEFAULT_WELL_STRENGTH, lifetime: 8, createdAt: 0 };
  assert.ok(canPlaceWell(well, demo.level));
  assert.equal(plateActivated(demo.plate, [hero]), false);
  let opened = false;
  for (let i = 0; i < 720; i++) {
    const forces = gravityExchange(hero, [moon], demo.heroGravity);
    for (const [body, reaction] of [[hero, forces.hero], [moon, forces.moons[0]]]) {
      const a = mazeAcceleration(body, [well], i * STEP, 'fade', demo.level);
      body.vx += (a.x + reaction.x) * STEP; body.vy += (a.y + reaction.y) * STEP;
      body.x += body.vx * STEP; body.y += body.vy * STEP;
    }
    if (plateActivated(demo.plate, [moon])) { opened = true; break; }
  }
  assert.equal(opened, true, 'moon must reach the plate under the shared forces');
  assert.equal(plateActivated(demo.plate, []), false);
});
