import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTouchPolicy, createFpsCounter, clearOrbitInertia } from '../dist/interaction.js';
import * as THREE from '../dist/vendor/three.module.js';
const orbitSource = readFileSync(new URL('../dist/vendor/OrbitControls.js', import.meta.url), 'utf8')
  .replace("from 'three'", `from '${new URL('../dist/vendor/three.module.js', import.meta.url).href}'`);
const { OrbitControls } = await import(`data:text/javascript;base64,${Buffer.from(orbitSource).toString('base64')}`);

test('one touch may grab; a second touch blocks until every finger lifts', () => {
  const touch = createTouchPolicy();
  assert.equal(touch.down(1), true);
  assert.equal(touch.canGrab(1), true);
  assert.equal(touch.down(2), false);
  assert.equal(touch.blocked, true);
  assert.equal(touch.canGrab(1), false);
  touch.up(1);
  assert.equal(touch.canGrab(2), false, 'remaining second finger cannot take ownership');
  touch.up(2);
  assert.equal(touch.blocked, false);
  assert.equal(touch.down(3), true);
  assert.equal(touch.canGrab(3), true);
  touch.reset();
  assert.equal(touch.canGrab(3), false);
});

test('FPS measures render frames over wall time and resets between samples', () => {
  for (const [period, expected] of [[1000 / 60, 60], [1000 / 30, 30]]) {
    const counter = createFpsCounter();
    counter.setEnabled(true, 0);
    let reading = null;
    for (let frame = 1; frame <= expected; frame++) reading = counter.frame(frame * period) ?? reading;
    assert.equal(reading, expected);
    counter.reset(1000);
    assert.equal(counter.frame(1016), null, 'visibility reset clears the earlier window');
    counter.setEnabled(false, 1016);
    assert.equal(counter.frame(5000), null, 'disabled counter does not report');
  }
});

test('OrbitControls cleanup removes damping momentum without moving the current view', () => {
  const camera = new THREE.PerspectiveCamera(42, 1, .05, 100);
  camera.position.set(5, 4, 8);
  const controls = new OrbitControls(camera, null);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;
  controls.update();
  controls.rotateLeft(.6);
  const position = camera.position.clone();
  const target = controls.target.clone();
  clearOrbitInertia(controls);
  assert.ok(camera.position.distanceTo(position) < 1e-10);
  assert.ok(controls.target.distanceTo(target) < 1e-10);
  assert.equal(controls.enableDamping, true);
  for (let frame = 0; frame < 20; frame++) controls.update();
  assert.ok(camera.position.distanceTo(position) < 1e-8, 'camera stays still after cleanup');
  assert.ok(controls.target.distanceTo(target) < 1e-8);
});
