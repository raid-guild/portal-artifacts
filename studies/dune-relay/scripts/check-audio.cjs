const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);

const { EMPTY_SAVE } = require('../src/game/save.ts');
const { getUnlockedSoundtracks, normalizeAudioPreferences, SOUNDTRACKS } = require('../src/game/soundtracks.ts');
const { arrangements, MUSIC_STEPS_PER_CYCLE, notesForMusicStep } = require('../src/game/music.ts');
assert.equal(MUSIC_STEPS_PER_CYCLE, 128, 'sixteen eight-step bars form one score cycle');
const expected = {
  oasis: { bpm: 83, first: [60, 67, 72, 36, 72] },
  caravan: { bpm: 97, first: [55, 62, 65, 31] },
  gatehouse: { bpm: 87, first: [62, 69, 74, 38, 74] },
  farmland: { bpm: 92, first: [60, 67, 72, 36, 72] },
  town: { bpm: 90, first: [62, 69, 74, 38, 74] },
  castle: { bpm: 85, first: [60, 67, 72, 36, 72] },
};
for (const [id, { bpm, first }] of Object.entries(expected)) {
  assert.equal(arrangements[id].bpm, bpm, `${id} tempo`);
  assert.equal(SOUNDTRACKS.find(track => track.id === id).bpm, bpm, `${id} displayed tempo`);
  assert.deepEqual(notesForMusicStep(id, 0).map(note => note.midi), first, `${id} opening score pitches unchanged`);
  const eighth = 30 / bpm;
  const voiceEnds = [];
  let maxVoices = 0;
  for (let step = 0; step < MUSIC_STEPS_PER_CYCLE; step++) {
    const notes = notesForMusicStep(id, step);
    assert.deepEqual(notes, notesForMusicStep(id, step + MUSIC_STEPS_PER_CYCLE), `${id} repeats exactly after a cycle`);
    const at = step * eighth;
    for (let i = voiceEnds.length - 1; i >= 0; i--) if (voiceEnds[i] <= at) voiceEnds.splice(i, 1);
    for (const note of notes) {
      assert.ok(Number.isInteger(note.midi) && note.midi >= 0 && note.midi <= 127);
      assert.ok(note.duration > 0 && Number.isFinite(note.duration));
      assert.ok(note.gain > 0 && note.gain < 1);
      voiceEnds.push(at + note.duration + 0.02);
    }
    maxVoices = Math.max(maxVoices, voiceEnds.length);
  }
  assert.ok(maxVoices < 32, `${id} score stays under the live voice cap at normal timing`);
}
assert.deepEqual(getUnlockedSoundtracks(EMPTY_SAVE), ['oasis']);
assert.deepEqual(getUnlockedSoundtracks({ ...EMPTY_SAVE, completed: ['openWaterway'], oasisTransition: 'film' }), ['oasis'], 'completion before arrival does not unlock the next chapter');
assert.deepEqual(getUnlockedSoundtracks({ ...EMPTY_SAVE, oasisTransition: 'arrival' }), ['oasis', 'caravan']);
assert.deepEqual(getUnlockedSoundtracks({ ...EMPTY_SAVE, oasisTransition: 'ready', transition: { from: 'caravan', to: 'gatehouse', stage: 'film' } }), ['oasis', 'caravan'], 'Gatehouse waits for its arrival');
assert.deepEqual(getUnlockedSoundtracks({ ...EMPTY_SAVE, oasisTransition: 'ready', transition: { from: 'caravan', to: 'gatehouse', stage: 'arrival' } }), ['oasis', 'caravan', 'gatehouse']);
assert.deepEqual(getUnlockedSoundtracks({ ...EMPTY_SAVE, completed: ['openTheCrossing'] }), ['oasis', 'caravan', 'gatehouse']);
assert.deepEqual(normalizeAudioPreferences({ muted: true, sfx: 0.5, ambience: 0.3 }), { muted: true, sfx: 0.5, ambience: 0.3, music: 0.25, track: 'auto' });
assert.deepEqual(normalizeAudioPreferences({ muted: 'yes', sfx: Infinity, ambience: -2, music: 4, track: 'unknown' }), { muted: false, sfx: 0.7, ambience: 0, music: 1, track: 'auto' });

class Param {
  value = 1;
  setTargetAtTime(value) { this.value = value; }
  setValueAtTime(value) { this.value = value; }
  linearRampToValueAtTime(value) { this.value = value; }
  exponentialRampToValueAtTime(value) { this.value = value; }
  cancelScheduledValues() {}
}
class Node {
  connect(other) { return other; }
  disconnect() {}
  start() {}
  stop() {}
}
let contexts = 0;
class AudioContextFake {
  constructor() { contexts++; this.currentTime = 0; this.sampleRate = 8000; this.state = 'suspended'; this.destination = new Node(); }
  createGain() { const node = new Node(); node.gain = new Param(); return node; }
  createOscillator() { const node = new Node(); node.frequency = new Param(); return node; }
  createBiquadFilter() { const node = new Node(); node.frequency = new Param(); node.Q = new Param(); return node; }
  createBufferSource() { return new Node(); }
  createBuffer(_channels, length) { return { getChannelData: () => new Float32Array(length) }; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  suspend() { this.state = 'suspended'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
}
const listeners = new Map();
global.window = {};
global.document = { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
global.AudioContext = AudioContextFake;
const { GameAudio } = require('../src/game/audio.ts');

(async () => {
  const audio = new GameAudio();
  audio.setScene('oasis', 'auto', false);
  audio.setLevels(false, 0.7, 0.22, 0.25);
  assert.equal(contexts, 0, 'no context or timer before user gesture');
  assert.equal(audio.scheduler, undefined);
  await audio.unlock();
  assert.equal(contexts, 1);
  assert.equal(audio.currentRun.id, 'oasis');
  assert.ok(audio.scheduler, 'music scheduler starts after gesture');
  const run = audio.currentRun;
  const nextAt = run.nextAt;
  await audio.unlock();
  assert.equal(run.nextAt, nextAt, 'repeat gesture unlock does not restart the song clock');
  audio.setScene('oasis', 'auto', false);
  assert.equal(audio.currentRun, run, 'map and board in same chapter retain music position');
  audio.setScene('gatehouse', 'oasis', false);
  assert.equal(audio.currentRun, run, 'manual old music survives region change');
  assert.ok(audio.machinery, 'Gatehouse ambience switches to river and machine');
  audio.setScene('gatehouse', 'auto', false);
  assert.equal(audio.currentRun.id, 'gatehouse');
  assert.notEqual(audio.currentRun, run, 'chapter change crossfades');
  assert.ok(audio.musicVoices.size <= 32, 'music polyphony bounded');
  audio.play('jet');
  assert.ok(audio.sfxVoices.size > 0);
  audio.stopTransientSounds();
  assert.equal(audio.sfxVoices.size, 0);
  assert.ok(audio.scheduler, 'stopping SFX does not stop the music');
  audio.setScene('gatehouse', 'auto', true);
  assert.equal(audio.scheduler, undefined, 'film stops music scheduling');
  assert.equal(audio.ambientSource, undefined, 'film stops ambience');
  audio.setScene('gatehouse', 'auto', false);
  assert.ok(audio.scheduler, 'music returns after film');
  assert.equal(audio.currentRun.gain.gain.value, 1, 'the current song is audible again after film');
  document.hidden = true; listeners.get('visibilitychange')();
  assert.equal(audio.scheduler, undefined, 'hidden tab stops scheduler');
  document.hidden = false; listeners.get('visibilitychange')();
  await Promise.resolve();
  assert.ok(audio.scheduler, 'visible tab resumes one scheduler');
  audio.setLevels(true, 0.7, 0.22, 0.25);
  assert.equal(audio.scheduler, undefined, 'mute stops scheduler');
  audio.setLevels(false, 0.7, 0.22, 0);
  assert.equal(audio.scheduler, undefined, 'zero music level stops scheduler');
  audio.dispose();
  assert.equal(audio.scheduler, undefined);
  assert.equal(listeners.size, 0);
  assert.equal(audio.musicVoices.size, 0);
  assert.equal(audio.sfxVoices.size, 0);
  console.log('Audio unlock, scene, lifecycle, and preference checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
