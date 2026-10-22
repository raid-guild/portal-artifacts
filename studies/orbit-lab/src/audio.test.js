import test from 'node:test';import assert from 'node:assert/strict';import {OrbitAudio} from './audio.js';
test('orb hum responds to brightness without changing pulse timing',()=>{const a=new OrbitAudio(),gains=[],pitches=[];a.context={currentTime:0};a.humGain={gain:{setTargetAtTime:v=>gains.push(v)}};a.hum={frequency:{setTargetAtTime:v=>pitches.push(v)}};a.humOvertone={frequency:{setTargetAtTime(){}}};const pulse=a.orb(true,1,1);assert.equal(a.orb(true,1,.24),pulse);assert.ok(gains[1]<gains[0]);assert.ok(pitches[1]<pitches[0]);});
test('gate parts use separate registers and rhythmic slots with an audible bass layer',()=>{const a=new OrbitAudio(),notes=[];a.tone=(...args)=>notes.push(args);a.gateAcquire(0);assert.ok(notes.some(n=>n[0]===261.63&&n[3]>=.15));notes.length=0;for(let beat=0;beat<4;beat++)for(let layer=0;layer<3;layer++)a.gateBeat(layer,beat);assert.deepEqual(notes.map(n=>n[0]),[130.81,261.63,392,783.99,392,587.33]);assert.ok(notes[1][3]<notes[0][3]);});
test('heartbeat makes immediate distinct low thumps and can be silenced',()=>{
 const a=new OrbitAudio(),starts=[],frequencies=[],volumes=[];
 const param=(sink)=>({value:0,setValueAtTime(value){sink.push(value)},linearRampToValueAtTime(value){sink.push(value)},exponentialRampToValueAtTime(value){sink.push(value)},setTargetAtTime(value){sink.push(value)}});
 a.context={currentTime:3,createGain(){return {gain:param(volumes),connect(){},disconnect(){}}},createOscillator(){return {frequency:param(frequencies),connect(){},disconnect(){},start(time){starts.push(time)},stop(){}}}};
 a.heartbeatBus={gain:param(volumes)};
 a.heartbeat('lub',0);a.heartbeat('dub',1);a.stopHeartbeat();
 assert.ok(starts.every(time=>time===3));
 assert.ok(frequencies.includes(90)&&frequencies.includes(55)&&frequencies.includes(115)&&frequencies.includes(70));
 assert.equal(volumes.at(-1),0);
});
test('chapter gate profile changes only campaign rhythm, and scene stop cancels voices', () => {
 const audio = new OrbitAudio(), notes = [];
 audio.tone = (...args) => notes.push(args);
 audio.setProfile('chapter'); audio.gateBeat(0, 0); audio.gateBeat(1, 2); audio.gateBeat(2, 1);
 assert.deepEqual(notes.map(note => note[0]), [130.81, 329.628, 783.99]);
 notes.length = 0; audio.sceneCall(0);
 assert.equal(notes[0][5], true);
 let stopped = 0;
 audio.sceneVoices.add({ stop() { stopped++; } });
 audio.stopScene(); audio.stopScene();
 assert.equal(stopped, 1);
 audio.setProfile('default'); notes.length = 0; audio.gateBeat(0, 0);
 assert.ok(notes.some(note => note[0] === 261.63));
});

test('second transmission has a related call and cancellable answer and reply voices', () => {
 const audio = new OrbitAudio(), notes = [];
 audio.tone = (...args) => notes.push(args);
 audio.sceneCall(0); audio.sceneCall(4);
 assert.deepEqual(notes.map(note => note[0]), [293.665, 391.995]);
 notes.length = 0;
 for (let i = 0; i < 5; i++) audio.sceneCall(i, 2);
 assert.deepEqual(notes.map(note => note[0]), [293.665, 329.628, 391.995, 440, 587.33]);
 audio.sceneNote(440, true); audio.sceneNote(293.665);
 assert.ok(notes.every(note => note[5] === true));
 assert.ok(notes.at(-2)[2] > notes.at(-1)[2]);
});

test('third transmission has a distinct five-note call and keeps scene voices cancellable', () => {
 const audio = new OrbitAudio(), notes = [];
 audio.tone = (...args) => notes.push(args);
 for (let i = 0; i < 5; i++) audio.sceneCall(i, 3);
 assert.deepEqual(notes.map(note => note[0]), [261.626, 349.228, 391.995, 440, 523.251]);
 assert.ok(notes.every(note => note[5] === true));
 audio.sceneNote(349.228, true); audio.sceneNote(523.251);
 assert.ok(notes.at(-2)[2] > notes.at(-1)[2]);
});

test('effects, music, and master mute use independent gains', async () => {
 const audio = new OrbitAudio(), effects = [], music = [], master = [];
 const gain = sink => ({ setTargetAtTime(value) { sink.push(value); } });
 audio.context = { currentTime: 0 };
 audio.effectsBus = { gain: gain(effects) };
 audio.musicBus = { gain: gain(music) };
 audio.master = { gain: gain(master) };
 audio.music = { paused: false, pause() { this.paused = true; } };
 audio.setEffects(false, .7);
 assert.equal(effects.at(-1), 0);
 audio.syncMusic(false);
 await new Promise(resolve => setTimeout(resolve, 470));
 assert.equal(audio.music.paused, true);
 assert.equal(music.at(-1), 0);
 audio.setEnabled(false);
 assert.equal(master.at(-1), 0);
 assert.equal(audio.effectsVolume, .7);
 audio.setMusic(false, .2);
 assert.equal(audio.musicVolume, .2);
});
