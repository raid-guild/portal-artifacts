import test from 'node:test';
import assert from 'node:assert/strict';
import { stepEclipseExposure } from './eclipse.js';

test('eclipse reaches full dark, pauses with simulation, and recovers over one second', () => {
  let exposure = stepEclipseExposure(1, true, .5, 2);
  assert.equal(exposure, .75);
  assert.equal(stepEclipseExposure(exposure, true, 0, 2), exposure);
  exposure = stepEclipseExposure(exposure, true, 2, 2);
  assert.equal(exposure, 0);
  assert.equal(stepEclipseExposure(exposure, false, .25), .25);
  assert.equal(stepEclipseExposure(exposure, false, 1), 1);
});

test('a second eclipse darkens from current recovery without a visible jump', () => {
  const recovering = stepEclipseExposure(0, false, .4);
  assert.equal(recovering, .4);
  assert.ok(Math.abs(stepEclipseExposure(recovering, true, .2, 2) - .3) < 1e-12);
});
