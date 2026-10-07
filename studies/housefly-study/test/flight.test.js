import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, FlightSimulation, depthRange, spotWorld } from '../src/flight.js';

const bounds = { halfWidth: 70 };

function run(sim, config, spots = [], pointer = null, seconds = 8) {
  for (let i = 0; i < seconds * 120; i++) sim.step(1 / 120, config, bounds, spots, pointer);
  return sim;
}

test('same seed and inputs produce the same flight at different render groupings', () => {
  const config = { ...DEFAULTS };
  const a = new FlightSimulation(42);
  const b = new FlightSimulation(42);
  const spots = [{ id: 1, x: 0.6, y: 0.4, depth: 45, strength: 100 }];
  run(a, config, spots);
  for (let frame = 0; frame < 8 * 30; frame++) {
    for (let step = 0; step < 4; step++) b.step(1 / 120, config, bounds, spots, null);
  }
  assert.deepEqual(a.position, b.position);
  assert.equal(a.state, b.state);
  a.reset();
  run(a, config, spots);
  assert.deepEqual(a.position, b.position);
});

test('zero depth travel locks the fly to a single plane and stays within bounds', () => {
  const config = { ...DEFAULTS, depthTravel: 0, speed: 80, turnFrequency: 3 };
  const sim = new FlightSimulation();
  for (let i = 0; i < 120 * 25; i++) {
    sim.step(1 / 120, config, bounds);
    const scale = (160 - sim.position.z) / 160;
    assert.equal(sim.position.z, 35);
    assert.ok(Math.abs(sim.position.x) <= bounds.halfWidth * scale - 5.5 + 0.001);
    assert.ok(Math.abs(sim.position.y) <= 50 * scale - 5.5 + 0.001);
    assert.ok(Number.isFinite(sim.heading.x));
  }
});

test('removing an active attraction spot releases its target', () => {
  const config = { ...DEFAULTS, randomTurns: false, attractionStrength: 100, attractionRadius: 60 };
  const sim = new FlightSimulation();
  const spots = [{ id: 7, x: 0.45, y: 0.45, depth: 45, strength: 100 }];
  for (let i = 0; i < 120 * 10 && sim.state !== 'investigate'; i++) {
    sim.step(1 / 120, config, bounds, spots);
  }
  assert.equal(sim.state, 'investigate');
  assert.equal(sim.targetId, 7);
  sim.step(1 / 120, config, bounds, []);
  assert.equal(sim.state, 'cruise');
  assert.equal(sim.targetId, null);
});

test('cursor escape takes priority and ignore mode suppresses it', () => {
  const sim = new FlightSimulation();
  const pointer = { x: 0.35, y: 0.4, active: true };
  sim.step(1 / 120, { ...DEFAULTS, cursorResponse: 'flee' }, bounds, [], pointer);
  assert.equal(sim.state, 'escape');
  sim.reset();
  sim.step(1 / 120, { ...DEFAULTS, cursorResponse: 'ignore' }, bounds, [], pointer);
  assert.notEqual(sim.state, 'escape');
});

test('spot projection remains at its screen position across depth', () => {
  const spot = { x: 0.7, y: 0.3, depth: 60 };
  const world = spotWorld(spot, bounds);
  const scale = 160 / (160 - world.z);
  assert.ok(Math.abs(world.x * scale - (spot.x - 0.5) * bounds.halfWidth * 2) < 0.0001);
  assert.ok(Math.abs(world.y * scale - (0.5 - spot.y) * 100) < 0.0001);
});

test('default flight makes a visible approach and retreat', () => {
  const sim = new FlightSimulation();
  const config = { ...DEFAULTS, randomTurns: false, attractionStrength: 0 };
  const z = [];
  const directions = new Set();
  for (let i = 0; i < 120 * 24; i++) {
    sim.step(1 / 120, config, bounds);
    z.push(sim.position.z);
    directions.add(sim.depthDirection);
  }
  const closest = Math.max(...z);
  const farthest = Math.min(...z);
  assert.ok(closest > 85, `closest depth was ${closest}`);
  assert.ok(farthest < 25, `farthest depth was ${farthest}`);
  assert.ok((160 - farthest) / (160 - closest) > 2);
  assert.ok(directions.has('approaching') && directions.has('receding'));
  assert.deepEqual(depthRange(0), { min: 35, max: 35 });
});
