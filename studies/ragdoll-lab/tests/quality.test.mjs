import test from 'node:test';
import assert from 'node:assert/strict';
import { QUALITY_STORAGE_KEY, readQuality, saveQuality, createRenderGate, driveRenderFrame } from '../dist/quality.js';

test('quality preference persists and falls back safely when storage is invalid or unavailable', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  assert.equal(readQuality(storage), 'standard');
  assert.equal(saveQuality(storage, 'low'), true);
  assert.equal(values.get(QUALITY_STORAGE_KEY), 'low');
  assert.equal(readQuality(storage), 'low');
  values.set(QUALITY_STORAGE_KEY, 'nonsense');
  assert.equal(readQuality(storage), 'standard');
  assert.equal(saveQuality(storage, 'standard'), true);
  assert.equal(readQuality(storage), 'standard');
  assert.throws(() => saveQuality(storage, 'ultra'), RangeError);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(readQuality(blocked), 'standard');
  assert.equal(saveQuality(blocked, 'low'), false);
  assert.equal(readQuality(null), 'standard');
});

test('low quality schedules about thirty renders across common display refresh rates', () => {
  for (const [sourceHz, expected] of [[20, 20], [60, 30], [90, 30], [120, 30], [144, 30]]) {
    const gate = createRenderGate('low');
    let renders = 0;
    for (let frame = 0; frame < sourceHz; frame++) if (gate.shouldRender(frame * 1000 / sourceHz)) renders++;
    assert.ok(Math.abs(renders - expected) <= 1, `${sourceHz} Hz yielded ${renders} renders`);
  }
  const standard = createRenderGate();
  assert.equal(Array.from({ length: 120 }, (_, frame) => standard.shouldRender(frame * 1000 / 120)).filter(Boolean).length, 120);
});

test('render cap has no catch-up burst after gaps and switches immediately', () => {
  const gate = createRenderGate('low');
  assert.equal(gate.shouldRender(0), true);
  assert.equal(gate.shouldRender(1000), true);
  assert.equal(gate.shouldRender(1001), false);
  gate.reset();
  assert.equal(gate.shouldRender(1002), true, 'visibility reset renders the next frame');
  gate.setQuality('standard');
  assert.equal(gate.shouldRender(1003), true);
  assert.equal(gate.shouldRender(1004), true);
  gate.setQuality('low');
  assert.equal(gate.shouldRender(1005), true, 'live quality change renders immediately');
  assert.equal(gate.shouldRender(1006), false);
});

test('frame driver steps physics and camera every callback while draw work is gated', () => {
  const traces = [];
  for (const quality of ['standard', 'low']) {
    const gate = createRenderGate(quality);
    let steps = 0, updates = 0, renders = 0, visuals = 0, hud = 0, fpsSamples = 0, elapsed = 0, previous = 0;
    for (let frame = 0; frame < 120; frame++) {
      const now = frame * 1000 / 120;
      driveRenderFrame(gate, now,
        () => { steps++; elapsed += now - previous; previous = now; },
        () => { updates++; },
        () => { visuals++; hud++; renders++; fpsSamples++; });
    }
    traces.push({ steps, updates, renders, visuals, hud, fpsSamples, elapsed });
  }
  assert.equal(traces[0].steps, 120);
  assert.equal(traces[1].steps, 120);
  assert.equal(traces[0].updates, 120);
  assert.equal(traces[1].updates, 120);
  assert.equal(traces[0].elapsed, traces[1].elapsed);
  assert.equal(traces[0].renders, 120);
  assert.ok(Math.abs(traces[1].renders - 30) <= 1);
  for (const trace of traces) {
    assert.equal(trace.renders, trace.visuals);
    assert.equal(trace.renders, trace.hud);
    assert.equal(trace.renders, trace.fpsSamples);
  }
});
