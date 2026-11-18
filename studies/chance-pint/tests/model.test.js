import test from 'node:test';
import assert from 'node:assert/strict';
import { BRAND_FACE_INDEX, COMPASS_MARKS, DICE, LANES, PARTY_MARKS, POUR_METER_INDEX, SIGILS, READ_BOTTOM, READ_TOP, bandEdges, coasterLookup, innerVolume, playedFace, readPourMeter, readTrack } from '../src/model.js';

test('six dice have one ordered printed lane each', () => {
  assert.equal(LANES.length, 11);
  assert.deepEqual(LANES.slice(0, 6).map(lane => lane.die), DICE);
  for (const lane of LANES.slice(0, 6)) {
    assert.deepEqual(lane.marks, Array.from({ length: lane.die }, (_, i) => lane.die === 10 ? i : i + 1));
  }
  assert.deepEqual(LANES[6].marks, SIGILS);
  assert.deepEqual(LANES[7].marks, PARTY_MARKS.map(mark => mark.glyph));
  assert.deepEqual(LANES[8].marks, COMPASS_MARKS);
  assert.equal(POUR_METER_INDEX, 9);
  assert.equal(BRAND_FACE_INDEX, 10);
});

test('bands are equal volume and exact boundaries read the upper band', () => {
  for (const lane of LANES.filter(lane => lane.marks.length)) {
    const edges = bandEdges(lane.marks.length);
    assert.equal(edges[0], READ_BOTTOM);
    assert.equal(edges.at(-1), READ_TOP);
    const firstVolume = innerVolume(edges[1]) - innerVolume(edges[0]);
    for (let i = 0; i < lane.marks.length; i += 1) {
      assert.ok(Math.abs(innerVolume(edges[i + 1]) - innerVolume(edges[i]) - firstVolume) < 1e-5);
      assert.equal(readTrack(lane.marks, (edges[i] + edges[i + 1]) / 2), lane.marks[i]);
      assert.equal(readTrack(lane.marks, edges[i]), lane.marks[i]);
    }
    assert.equal(readTrack(lane.marks, READ_TOP), lane.marks.at(-1));
    for (const height of [NaN, Infinity, -Infinity, 14.99, 128.01]) assert.equal(readTrack(lane.marks, height), null);
  }
  assert.equal(readTrack([], 75), null);
});

test('coaster offset maps printed to played without changing glass ink', () => {
  for (const die of DICE) {
    const printed = [...LANES.find(lane => lane.die === die).marks];
    for (let offset = 0; offset < die; offset += 1) {
      const lookup = coasterLookup(die, offset);
      assert.deepEqual(lookup.map(row => row.printed), printed);
      assert.equal(new Set(lookup.map(row => row.played)).size, die);
      for (const row of lookup) assert.equal(row.played, playedFace(die, row.printed, offset));
    }
    assert.deepEqual(LANES.find(lane => lane.die === die).marks, printed);
  }
  assert.deepEqual(coasterLookup(10, 3).slice(0, 2), [{ printed: 0, played: 3 }, { printed: 1, played: 4 }]);
  assert.equal(playedFace(6, 6, 1), 1);
  assert.throws(() => playedFace(6, 1, 6));
});

test('pour meter stays separate from coaster offset', () => {
  assert.equal(readPourMeter(READ_BOTTOM), 0);
  assert.equal(readPourMeter(READ_TOP), 100);
  assert.equal(readPourMeter(NaN), null);
  assert.equal(readPourMeter(0), null);
});
