import test from 'node:test';
import assert from 'node:assert/strict';
import { presentRunResult } from './run-result.js';

for (const [mode, outcome, action] of [
  ['campaign', 'complete', 'Continue'],
  ['campaign', 'lost', 'Retry'],
  ['infinite', 'lost', 'Retry'],
]) {
  test(`${mode} ${outcome} retains its result when trail rendering throws`, () => {
    const events = [], errors = [];
    const previousThumbnail = { image: 'previous flight' };
    let savedThumbnail = previousThumbnail;
    let persistenceCalls = 0;
    const draw = () => { throw new Error('canvas context lost'); };
    const persistThumbnail = () => { persistenceCalls++; savedThumbnail = { image: 'incomplete' }; };
    const scheduled = [];
    const view = { title: '', action: '', shown: false, canvas: true, warning: false };
    presentRunResult({
      mode, outcome,
      populateCore() { events.push('core'); view.title = outcome; view.action = action; },
      showResult() { events.push('show'); view.shown = true; },
      scheduleArtwork(callback) { scheduled.push(callback); },
      isCurrent() { return true; },
      renderArtwork() { events.push('draw'); draw(); persistThumbnail(); },
      artworkFailed() { events.push('fallback'); view.canvas = false; view.warning = true; },
      reportError(...args) { errors.push(args); },
    });
    assert.deepEqual(events, ['core', 'show']);
    assert.deepEqual(view, { title: outcome, action, shown: true, canvas: true, warning: false });
    scheduled[0]();
    assert.deepEqual(events, ['core', 'show', 'draw', 'fallback']);
    assert.deepEqual(view, { title: outcome, action, shown: true, canvas: false, warning: true });
    assert.strictEqual(savedThumbnail, previousThumbnail);
    assert.equal(persistenceCalls, 0);
    assert.match(errors[0][0], new RegExp(`${mode} ${outcome}`));
    assert.match(errors[0][1].message, /canvas context lost/);
  });
}

test('a normal result draws and persists its artwork after core controls are ready', () => {
  const events = [];
  let thumbnail = 'previous flight';
  const scheduled = [];
  presentRunResult({
    mode: 'campaign', outcome: 'complete',
    populateCore() { events.push('core'); },
    showResult() { events.push('show'); },
    scheduleArtwork(callback) { scheduled.push(callback); },
    isCurrent() { return true; },
    renderArtwork() { events.push('draw'); thumbnail = 'new flight'; },
    artworkFailed() { throw new Error('unexpected fallback'); },
  });
  assert.deepEqual(events, ['core', 'show']);
  scheduled[0]();
  assert.deepEqual(events, ['core', 'show', 'draw']);
  assert.equal(thumbnail, 'new flight');
});

test('a queued result render is discarded after retry or home', () => {
  let active = true, rendered = false;
  const scheduled = [];
  presentRunResult({
    mode: 'campaign', outcome: 'lost',
    populateCore() {}, showResult() {},
    scheduleArtwork(callback) { scheduled.push(callback); },
    isCurrent() { return active; },
    renderArtwork() { rendered = true; },
    artworkFailed() { throw new Error('unexpected fallback'); },
  });
  active = false;
  scheduled[0]();
  assert.equal(rendered, false);
});
