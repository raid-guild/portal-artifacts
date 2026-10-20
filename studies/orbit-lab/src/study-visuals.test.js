import test from 'node:test';
import assert from 'node:assert/strict';
import { createDimmerVisual, createEclipseVisual } from './study-visuals.js';

test('eclipse keeps an opaque black center inside the full capture ring', () => {
  const visual = createEclipseVisual(.9);
  assert.equal(visual.userData.coreRadius, .9 * .72);
  assert.equal(visual.children[1].material.color.getHex(), 0x000000);
  assert.equal(visual.children[1].material.opacity, 1);
  assert.equal(visual.children[1].material.transparent, true);
  assert.equal(visual.children[1].material.depthTest, false);
  assert.equal(visual.children[1].renderOrder, 1000);
  visual.userData.animate(1);
});

test('dimmer has a smaller core than its unchanged collection radius', () => {
  const visual = createDimmerVisual(.22);
  assert.equal(visual.userData.coreRadius, .22);
  assert.ok(visual.children.length >= 4);
  visual.userData.animate(1);
  visual.userData.setFade(.5);
  assert.equal(visual.children[1].material.opacity, .5);
});
