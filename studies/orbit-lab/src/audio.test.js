import test from 'node:test';import assert from 'node:assert/strict';import {OrbitAudio} from './audio.js';
test('orb hum responds to brightness without changing pulse timing',()=>{const a=new OrbitAudio(),gains=[],pitches=[];a.context={currentTime:0};a.humGain={gain:{setTargetAtTime:v=>gains.push(v)}};a.hum={frequency:{setTargetAtTime:v=>pitches.push(v)}};a.humOvertone={frequency:{setTargetAtTime(){}}};const pulse=a.orb(true,1,1);assert.equal(a.orb(true,1,.24),pulse);assert.ok(gains[1]<gains[0]);assert.ok(pitches[1]<pitches[0]);});
test('gate parts use separate registers and rhythmic slots',()=>{const a=new OrbitAudio(),notes=[];a.tone=(...args)=>notes.push(args);a.gateAcquire(2);assert.ok(notes.length>0);notes.length=0;for(let beat=0;beat<4;beat++)for(let layer=0;layer<3;layer++)a.gateBeat(layer,beat);assert.deepEqual(notes.map(n=>n[0]),[130.81,783.99,392,587.33]);});
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
