import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { getDemo } from './demos.js';
import { createEncounterState, stepEncounter } from './encounter.js';
import { createEncounterVitality, stepEncounterVitality } from './encounter-vitality.js';
import { BLOB_RADIUS, mazeAcceleration, capVelocity, SPEED_CAP, canPlaceWell } from './level.js';
import { STEP } from './physics.js';

// The same Cannon sphere, perimeter bodies, gravity, cap, and 120 Hz step as
// gameplay. Inputs are legal wells at one-second intervals, not scripted hero
// positions; this proves all three separate catches are physically reachable.
function flyEncounter(policy, duration = 150, behavior = 'adaptive', mineEvery = 360) {
  const level = getDemo('encounter').level;
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
  const blobMaterial = new CANNON.Material('blob'), wallMaterial = new CANNON.Material('wall');
  world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: .1 }));
  const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial,
    linearDamping: 0, angularDamping: 0, fixedRotation: true });
  body.position.set(level.spawn.x, level.spawn.y, 0);
  body.velocity.set(level.spawn.vx, level.spawn.vy, 0); world.addBody(body);
  for (const rect of level.walls) {
    const wall = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, .7)), material: wallMaterial });
    wall.position.set(rect.x, rect.y, 0); world.addBody(wall);
  }
  let encounter = createEncounterState(), vitality = createEncounterVitality(), wells = [], placements = 0, hitTimes = [], drops = 0, heroDrops = 0, bossDrops = 0, bursts = 0, collected = 0, exposure = 0, resultType = null;
  for (let tick = 0; tick < duration / STEP; tick++) {
    const time = tick * STEP;
    if (tick % 120 === 0) {
      const point = policy(encounter, body.position, time);
      if (point && canPlaceWell(point, level)) {
        wells = [...wells, { ...point, strength: 70, lifetime: 16, createdAt: time }].slice(-1);
        placements++;
      }
    }
    const before = { x: body.position.x, y: body.position.y };
    const pull = mazeAcceleration(body.position, wells, time, 'fade', level);
    body.applyForce(new CANNON.Vec3(pull.x, pull.y, 0)); world.step(STEP);
    capVelocity(body.velocity, SPEED_CAP);
    const bossBefore = { x: encounter.boss.x, y: encounter.boss.y };
    const result = stepEncounter(encounter, { before, hero: body.position, heroVelocity: body.velocity,
      dt: STEP, time, bounds: level.bounds, walls: level.walls,
      heroEnergy: vitality.hero.energy, bossEnergy: vitality.boss.energy,
      pickups: vitality.pickups, dropMine: tick % mineEvery === 60, behavior });
    encounter = result.state;
    if (encounter.phase !== 'resolved') {
      const light = stepEncounterVitality(vitality, { heroBefore: before, hero: body.position, bossBefore,
        boss: encounter.boss, dt: STEP, time, level, hazards: encounter.hazards,
        heroExposureSeconds: result.heroExposureSeconds, bossExposureSeconds: result.bossExposureSeconds,
        costs: result.costs });
      vitality = light.state; collected += light.collected.hero + light.collected.boss; exposure += result.heroExposureSeconds + result.bossExposureSeconds;
      if (light.result) { resultType = light.result; if (light.result === 'boss') encounter = { ...encounter, phase: 'resolved', phaseTime: 0 }; else break; }
    }
    if (result.events.includes('hit')) hitTimes.push(time);
    if (result.events.includes('heroDrop')) { drops++; heroDrops++; }
    if (result.events.includes('bossDrop')) { drops++; bossDrops++; }
    if (result.events.includes('burst')) bursts++;
    if (result.knockback) {
      body.velocity.x += result.knockback.x; body.velocity.y += result.knockback.y;
      capVelocity(body.velocity, SPEED_CAP);
    }
    if (encounter.phase === 'resolved') body.velocity.set(0, 0, 0);
    if (encounter.complete) break;
  }
  return { encounter, vitality, placements, hitTimes, drops, heroDrops, bossDrops, bursts, collected, exposure, resultType };
}

test('legal timed wells and queued mines exercise the full duel in Cannon', () => {
  const level = getDemo('encounter').level;
  assert.deepEqual(level.bounds, { minX: -16, maxX: 16, minY: -9, maxY: 9 });
  const chase = flyEncounter((state, hero) => {
    const boss = state.boss;
    const d = Math.hypot(boss.x - hero.x, boss.y - hero.y) || 1;
    const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
    return { x: clamp(hero.x + (boss.x - hero.x) / d * 2, -15, 15),
      y: clamp(hero.y + (boss.y - hero.y) / d * 2, -8, 8) };
  });
  assert.ok(chase.placements > 0);
  assert.ok(chase.hitTimes.length >= 1, `real route should reach the moving ember: ${JSON.stringify(chase)}`);
  assert.ok(chase.heroDrops >= 1 && chase.bossDrops >= 1 && chase.bursts >= 1, `both sides place mines and bursts occur: ${JSON.stringify({hero:chase.heroDrops,boss:chase.bossDrops,bursts:chase.bursts})}`);
  assert.ok(chase.collected >= 1, 'the flight collects a shared recharge ember');
  assert.ok(chase.exposure > 0, 'a mine causes actual light damage');
  assert.equal(chase.resultType, 'hero', 'this particular well route eventually loses its light');
  assert.ok(chase.hitTimes.length >= 3, 'legal flight lands repeated rams');
  assert.ok(chase.vitality.boss.energy < 1, 'boss spends and loses light under the same rules');
});
