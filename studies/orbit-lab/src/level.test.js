import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { STEP } from './physics.js';
import { LEVEL, BLOB_RADIUS, canPlaceWell, circleHitsRect, sweptCircleRect, firstImpact, predictToImpact, capVelocity, emberAcceleration, mazeAcceleration } from './level.js';

test('well placement allows open corridors but rejects walls, spikes, exit, and arena exterior', () => {
  assert.equal(canPlaceWell({ x: -10, y: 0 }), true);
  assert.equal(canPlaceWell({ x: -4, y: -3 }), false);
  assert.equal(canPlaceWell({ x: 3.2, y: 6.7 }), false);
  assert.equal(canPlaceWell({ x: 10, y: -5 }), false);
  assert.equal(canPlaceWell({ x: 16, y: 0 }), false);
});

test('swept collision catches thin hazards and distinguishes wall, spike, and goal', () => {
  assert.equal(circleHitsRect({ x: 0, y: 0 }, BLOB_RADIUS, { x: 0, y: 0, w: 1, h: 1 }), true);
  assert.ok(sweptCircleRect({ x: -2, y: 0 }, { x: 2, y: 0 }, BLOB_RADIUS, { x: 0, y: 0, w: .1, h: 1 }) !== null);
  assert.equal(firstImpact({ x: -6, y: -3 }, { x: -2, y: -3 })?.type, 'wall');
  assert.equal(firstImpact({ x: -6, y: -6.7 }, { x: -3, y: -6.7 })?.type, 'spike');
  assert.equal(firstImpact({ x: 8, y: -5 }, { x: 11, y: -5 })?.type, 'goal');
});

test('forecast stops at first impact with finite points and respects the speed cap', () => {
  const result = predictToImpact({ x: -6, y: -3, vx: 80, vy: 0 }, [], 0, 2);
  assert.equal(result.impact, 'wall');
  assert.ok(result.points.length > 1);
  assert.ok(result.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  const velocity = capVelocity({ x: 40, y: 30 });
  assert.ok(Math.abs(Math.hypot(velocity.x, velocity.y) - 10) < 1e-8);
});

test('a scripted series of valid wells can reach the maze exit under live Cannon physics', () => {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
  const blobMaterial = new CANNON.Material('blob');
  const wallMaterial = new CANNON.Material('wall');
  world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: 0.1 }));
  const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial, fixedRotation: true, linearDamping: 0, angularDamping: 0 });
  body.position.set(LEVEL.spawn.x, LEVEL.spawn.y, 0);
  body.velocity.set(LEVEL.spawn.vx, LEVEL.spawn.vy, 0);
  world.addBody(body);
  for (const rect of LEVEL.walls) {
    const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, 0.7)) });
    wall.position.set(rect.x, rect.y, 0);
    world.addBody(wall);
  }
  const targets = [[-7.4, 5.1], [0, 5.1], [0, -5.1], [10, -5]];
  let target = 0;
  let well = null;
  let reached = false;
  const interval = Math.round(0.8 / STEP);
  for (let i = 0; i < 2400; i++) {
    const time = i * STEP;
    if (Math.hypot(body.position.x - targets[target][0], body.position.y - targets[target][1]) < 1.5 && target < 3) target++;
    if (i % interval === 0) {
      const [tx, ty] = targets[target];
      const distance = Math.hypot(tx - body.position.x, ty - body.position.y);
      const desired = { x: (tx - body.position.x) / distance * 4, y: (ty - body.position.y) / distance * 4 };
      const error = { x: desired.x - body.velocity.x, y: desired.y - body.velocity.y };
      const magnitude = Math.hypot(error.x, error.y);
      const point = { x: body.position.x + error.x / magnitude * 3 + body.velocity.x * 0.2, y: body.position.y + error.y / magnitude * 3 + body.velocity.y * 0.2 };
      well = canPlaceWell(point) ? { ...point, strength: 100, lifetime: 8, createdAt: time } : null;
    }
    const before = { x: body.position.x, y: body.position.y };
    const a = mazeAcceleration(body.position, well ? [well] : [], time, 'fade');
    body.applyForce(new CANNON.Vec3(a.x, a.y, 0));
    world.step(STEP);
    body.position.z = 0;
    body.velocity.z = 0;
    capVelocity(body.velocity);
    const impact = firstImpact(before, body.position);
    assert.notEqual(impact?.type, 'spike', 'script should avoid spikes');
    if (impact?.type === 'goal') { reached = true; break; }
  }
  assert.equal(reached, true, 'the exit should be reachable with placed wells');
});


test('embers attract gently within four units, with finite force at the center', () => {
  const level = { ...LEVEL, spikes: [{ x: 0, y: 0 }] };
  const near = emberAcceleration({ x: 1, y: 0 }, level);
  assert.ok(near.x < 0 && Math.abs(near.x) < 2);
  assert.equal(near.y, 0);
  assert.ok(Math.abs(emberAcceleration({ x: 3, y: 0 }, level).x) < Math.abs(near.x));
  assert.deepEqual(emberAcceleration({ x: 4, y: 0 }, level), { x: 0, y: 0 });
  assert.deepEqual(emberAcceleration({ x: 0, y: 0 }, level), { x: 0, y: 0 });
  const forecast = predictToImpact({ x: -6.5, y: -6.7, vx: 0, vy: 0 }, [], 0, .2);
  assert.ok(forecast.points.at(-1).x > -6.5, 'forecast includes the ember pull');
});
