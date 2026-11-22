const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');

Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);

const { CascadeFlair, cascadeFlairTier, showCascadeWord } = require('../src/game/cascadeFlair.ts');
assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 8].map(cascadeFlairTier), [0, 0, 1, 1, 2, 2, 3, 3]);
assert.deepEqual([0, 1, 2, 3, 4, 6].map(showCascadeWord), [false, false, false, true, false, false], 'the word begins on wave three only');

function harness(reducedMotion = false) {
  const sprites = [], tweens = [], shakes = [];
  const root = { x: 0, y: 0, children: [], add(item) { this.children.push(item); }, setPosition(x, y) { this.x = x; this.y = y; return this; } };
  const scene = {
    events: { once() {}, off() {} },
    add: { circle(x, y) { const sprite = { x, y, destroyed: false, destroy() { this.destroyed = true; } }; sprites.push(sprite); return sprite; } },
    tweens: {
      add(config) { const tween = { config, removed: false, paused: false, remove() { this.removed = true; }, pause() { this.paused = true; }, resume() { this.paused = false; } }; tweens.push(tween); return tween; },
      addCounter(config) { const tween = { config, removed: false, paused: false, getValue() { return .5; }, remove() { this.removed = true; }, pause() { this.paused = true; }, resume() { this.paused = false; } }; shakes.push(tween); return tween; },
    },
  };
  return { flair: new CascadeFlair(scene, root, reducedMotion), root, sprites, tweens, shakes };
}

const impact = harness();
assert.equal(impact.flair.play(1, [{ x: 430, y: 220 }]), 0);
assert.equal(impact.flair.liveCount, 0, 'ordinary clears have no flair');
assert.equal(impact.flair.play(1, [{ x: 430, y: 220 }], true), 1, 'a real one-wave power combo gets its own impact');
assert.equal(impact.flair.liveCount, 12);
impact.flair.play(2, [{ x: 430, y: 220 }, { x: 480, y: 220 }]);
assert.equal(impact.flair.liveCount, 24);
assert.equal(impact.shakes.length, 2);
impact.shakes[1].config.onUpdate(impact.shakes[1]);
assert.notDeepEqual([impact.root.x, impact.root.y], [0, 0], 'the board container receives the impact');
impact.flair.play(3, [{ x: 430, y: 220 }]);
assert.equal(impact.shakes[1].removed, true, 'a later wave replaces the previous shake');
impact.flair.play(4, [{ x: 430, y: 220 }]);
impact.flair.play(5, [{ x: 430, y: 220 }]);
impact.flair.play(6, [{ x: 430, y: 220 }]);
assert.equal(impact.flair.liveCount, 48, 'overlapping wave bursts never exceed the live cap');
assert.equal(impact.sprites.length, 48);
impact.flair.setPaused(true);
assert(impact.tweens.every(tween => tween.paused));
assert.equal(impact.shakes.at(-1).paused, true);
impact.flair.setPaused(false);
assert(impact.tweens.every(tween => !tween.paused));
impact.tweens[0].removed = true; // Phaser automatically removes a completed tween.
impact.tweens[0].config.onComplete();
assert.equal(impact.flair.liveCount, 47, 'completed motes release capacity');
impact.flair.play(9, [{ x: 430, y: 220 }]);
assert.equal(impact.flair.liveCount, 48);
impact.flair.dispose();
assert.equal(impact.flair.liveCount, 0);
assert(impact.sprites.every(sprite => sprite.destroyed), 'leaving the scene destroys every mote');
assert(impact.tweens.every(tween => tween.removed), 'leaving the scene removes every active tween');
assert.deepEqual([impact.root.x, impact.root.y], [0, 0], 'leaving the scene restores board placement');
impact.flair.dispose();
assert.equal(impact.flair.play(8, [{ x: 430, y: 220 }]), 3);
assert.equal(impact.flair.liveCount, 0, 'disposed effects cannot add sprites');

const reduced = harness(true);
reduced.flair.play(8, [{ x: 440, y: 225 }]);
assert.equal(reduced.shakes.length, 0, 'reduced motion has no board shake');
assert.equal(reduced.flair.liveCount, 4, 'reduced motion uses only a few fading glints');
assert(reduced.tweens.every(tween => tween.config.x === tween.config.targets.x && tween.config.y === tween.config.targets.y), 'reduced motion glints stay in place');
reduced.flair.dispose();

console.log('Cascade tiers, bounded board effects, reduced motion, pause, and teardown passed.');
