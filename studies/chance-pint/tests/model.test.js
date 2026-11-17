import test from 'node:test';
import assert from 'node:assert/strict';
import { BRAND_FACE_INDEX, NUMBERED_TRACK_INDICES, bandEdges, innerVolume, makeLayout, normalizeTrackIndex, originalLayout, readTrack, trackName } from '../src/model.js';

test('original layout has two complete permutations of each die', () => {
  assert.deepEqual(makeLayout(7319), originalLayout);
  for (const track of originalLayout.tracks) {
    assert.deepEqual([...track.bottom_to_top].sort((a, b) => a - b),
      Array.from({ length: track.die }, (_, i) => i + 1));
  }
});

test('equal-volume bands and reads line up across all dice', () => {
  for (const track of originalLayout.tracks) {
    const edges = bandEdges(track.die);
    const firstVolume = innerVolume(edges[1]) - innerVolume(edges[0]);
    for (let i = 0; i < track.die; i += 1) {
      assert.ok(Math.abs(innerVolume(edges[i + 1]) - innerVolume(edges[i]) - firstVolume) < 1e-5);
      assert.equal(readTrack(track, (edges[i] + edges[i + 1]) / 2), track.bottom_to_top[i]);
    }
  }
});

test('endpoints, exact band boundaries, and invalid levels', () => {
  for (const track of originalLayout.tracks) {
    const edges = bandEdges(track.die);
    assert.equal(edges[0], 15);
    assert.equal(edges.at(-1), 128);
    assert.equal(readTrack(track, 15), track.bottom_to_top[0]);
    assert.equal(readTrack(track, 128), track.bottom_to_top.at(-1));
    for (let i = 1; i < track.die; i += 1) {
      assert.equal(readTrack(track, edges[i]), track.bottom_to_top[i]);
    }
    for (const level of [NaN, Infinity, -Infinity, 14.999, 128.001]) {
      assert.equal(readTrack(track, level), null);
    }
  }
});

test('new seeds are deterministic and remain valid permutations', () => {
  assert.deepEqual(makeLayout(42), makeLayout(42));
  assert.notDeepEqual(makeLayout(42), makeLayout(43));
  for (const track of makeLayout(42).tracks) {
    assert.equal(new Set(track.bottom_to_top).size, track.die);
  }
  assert.throws(() => makeLayout(-1));
});

test('RaidGuild brand face reserves B/d4 and d4 selection resolves to A', () => {
  assert.equal(BRAND_FACE_INDEX, 6);
  assert.equal(NUMBERED_TRACK_INDICES.length, 11);
  assert.ok(!NUMBERED_TRACK_INDICES.includes(BRAND_FACE_INDEX));
  assert.equal(normalizeTrackIndex(6), 0);
  assert.equal(normalizeTrackIndex(0), 0);
  for (const index of NUMBERED_TRACK_INDICES) assert.equal(normalizeTrackIndex(index), index);
  assert.equal(trackName(6), 'RaidGuild brand face');
  assert.deepEqual(new Set(NUMBERED_TRACK_INDICES.map(i => originalLayout.tracks[i].die)), new Set([4,6,8,10,12,20]));
});
