import test from 'node:test';
import assert from 'node:assert/strict';
import { drawFinishArt } from './finish-art.js';

test('finish art places the independent faint moon archive beneath every hero pass', () => {
  const passes = [];
  const context = {
    globalAlpha: 1,
    fillRect() {}, save() {}, restore() {}, beginPath() {}, arc() {}, fill() {}, stroke() {},
    drawImage(source, ...coordinates) { passes.push({ source, coordinates, alpha: this.globalAlpha }); },
  };
  const canvas = { width: 1280, height: 720, getContext: () => context };
  const hero = { width: 1536, height: 1064, kind: 'hero' };
  const moons = { width: 1536, height: 1064, kind: 'moons' };
  const bounds = { minX: -20, maxX: 76, minY: -27, maxY: 27 };
  drawFinishArt(canvas, hero, 50, 30, bounds, { x: -10, y: 0 }, { x: 30, y: 0 }, moons);
  assert.equal(passes.length, 12);
  assert.equal(passes[0].source, moons);
  assert.ok(passes[0].alpha < 1);
  assert.deepEqual(passes[0].coordinates, passes[1].coordinates);
  assert.ok(passes.slice(1).every(pass => pass.source === hero && pass.alpha === 1));
});
