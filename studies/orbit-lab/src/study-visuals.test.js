import test from 'node:test';
import assert from 'node:assert/strict';
import { createDimmerVisual, createEclipseVisual, createStudyVisual } from './study-visuals.js';

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

test('ember core, aura, sparks and light fade to zero and restore without compounding pulse opacity', () => {
  const visual = createStudyVisual(.35, 0xff8a32);
  visual.userData.animate(2);
  visual.userData.setFade(.5);
  const half = visual.children[1].material.opacity;
  visual.userData.setFade(.5);
  assert.equal(visual.children[1].material.opacity, half);
  visual.userData.animate(2);
  assert.equal(visual.children[1].material.opacity, half);
  visual.userData.setFade(0);
  assert.equal(visual.visible, false);
  assert.equal(visual.children[0].material.opacity, 0);
  assert.equal(visual.children[2].intensity, 0);
  assert.equal(visual.children[3].material.uniforms.fade.value, 0);
  visual.userData.animate(3);
  visual.userData.setFade(1);
  assert.equal(visual.visible, true);
  assert.equal(visual.children[0].material.opacity, 1);
  assert.equal(visual.children[2].intensity, 2);
});
