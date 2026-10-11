import test from 'node:test';
import assert from 'node:assert/strict';
import {RADIO_STATIONS,eventsForStep} from '../src/radio-stations.js';
import {ArcadeRadio} from '../src/arcade-radio.js';

test('five distinct original station scores have exactly sixteen authored bars',()=>{
  assert.equal(RADIO_STATIONS.length,5);
  assert.deepEqual(RADIO_STATIONS.map(s=>s.cost),[0,45,120,260,500]);
  for(const station of RADIO_STATIONS){
    assert.equal(station.chords.length,16,station.name);
    for(const melody of station.melody)assert.equal(melody.length,16,station.name);
    for(const pattern of [station.bass,station.kick,station.snare,station.hat])assert.equal(pattern.length,16,station.name);
    assert.ok(eventsForStep(station.id,0).some(event=>event.kind==='chord'));
    assert.ok(eventsForStep(station.id,6,2).some(event=>event.kind==='accent'));
  }
  assert.equal(new Set(RADIO_STATIONS.map(s=>s.chords.join(','))).size,5);
  assert.equal(new Set(RADIO_STATIONS.map(s=>s.melody.map(m=>m.join(',')).join('|'))).size,5);
});

function fakeAudio(){
  const param=()=>({value:0,setValueAtTime(value){this.value=value;},linearRampToValueAtTime(value){this.value=value;},exponentialRampToValueAtTime(value){this.value=value;},cancelScheduledValues(){}});
  const node=()=>({gain:param(),frequency:param(),delayTime:param(),connect(){return this;},start(){},stop(){this.onended?.();}});
  return {state:'suspended',currentTime:0,sampleRate:48000,destination:node(),createGain:node,createDelay:node,createOscillator:node,createBufferSource:node,createBiquadFilter:node,createBuffer:(_,length)=>({getChannelData:()=>new Float32Array(length)}),async resume(){this.state='running';},async close(){this.state='closed';}};
}

test('audio remains lazy, schedules within bounds, pauses hidden, and rebases without catch-up',async()=>{
  let created=0,callback=null,cleared=0;
  const radio=new ArcadeRadio({contextFactory:()=>{created++;return fakeAudio();},setTimer:fn=>{callback=fn;return 1;},clearTimer:()=>{cleared++;callback=null;}});
  radio.configure({station:'circuit',volume:.45,playing:false});
  assert.equal(created,0);assert.equal(radio.playing,false);
  assert.equal(await radio.playFromGesture(),true);assert.equal(created,1);assert.equal(radio.playing,true);
  const first=radio.nextStep;assert.ok(first>0&&first<=4);
  radio.ctx.currentTime=80;callback();assert.ok(radio.nextStep-first<=4,'late tab must not schedule eighty seconds of notes');
  assert.ok(radio.voices.size<=64);
  radio.setHidden(true);assert.equal(radio.playing,false);assert.equal(callback,null);
  radio.ctx.currentTime=100;radio.setHidden(false);await Promise.resolve();
  assert.equal(radio.playing,true);assert.ok(radio.nextTime>=100);
  radio.pause();assert.equal(radio.playing,false);assert.ok(cleared>=2);
  await radio.dispose();
});

test('workshop audition restores selected station and prior paused state',async()=>{
  const radio=new ArcadeRadio({contextFactory:fakeAudio,setTimer:()=>1,clearTimer:()=>{}});
  radio.configure({station:'circuit',volume:.45,playing:false});
  await radio.audition('starlight');assert.equal(radio.playing,true);assert.equal(radio.station,'starlight');
  radio.endAudition();assert.equal(radio.station,'circuit');assert.equal(radio.playing,false);assert.equal(radio.wanted,false);
  radio.setMuted(true);radio.setMusicVolume(0);assert.equal(radio.master.gain.value,0);
  await radio.dispose();
});

test('default scheduler calls browser timers with their global receiver',async()=>{
  const start=globalThis.setInterval,stop=globalThis.clearInterval;
  globalThis.setInterval=function(callback,delay){assert.equal(this,globalThis);assert.equal(typeof callback,'function');assert.equal(delay,65);return 7;};
  globalThis.clearInterval=function(id){assert.equal(this,globalThis);assert.equal(id,7);};
  try{const radio=new ArcadeRadio({contextFactory:fakeAudio});assert.equal(await radio.playFromGesture(),true);radio.pause();await radio.dispose();}
  finally{globalThis.setInterval=start;globalThis.clearInterval=stop;}
});

test('failed preview unlock rolls back station and play preference',async()=>{
  const context=fakeAudio();context.resume=async()=>{throw new Error('audio denied');};
  const radio=new ArcadeRadio({contextFactory:()=>context,setTimer:()=>{throw new Error('must not schedule');}});
  radio.configure({station:'circuit',musicVolume:.4,effectsVolume:.8,playing:false});
  assert.equal(await radio.audition('glass'),false);
  assert.equal(radio.station,'circuit');assert.equal(radio.wanted,false);assert.equal(radio.auditionState,null);assert.equal(radio.playing,false);
  assert.equal(await radio.playFromGesture(),false);assert.equal(radio.wanted,false);
  await radio.dispose();
});

test('music and effects gains remain independent while master mute covers both',async()=>{
  const radio=new ArcadeRadio({contextFactory:fakeAudio,setTimer:()=>1,clearTimer:()=>{}});
  radio.configure({station:'circuit',musicVolume:.2,effectsVolume:.8,playing:false});
  await radio.unlockFromGesture();
  assert.equal(radio.master.gain.value,1);
  assert.equal(radio.music.gain.value,.34*.2);assert.equal(radio.effects.gain.value,.58*.8);
  radio.setMusicVolume(.6);assert.equal(radio.music.gain.value,.34*.6);assert.equal(radio.effects.gain.value,.58*.8);
  radio.setEffectsVolume(.1);assert.equal(radio.effects.gain.value,.58*.1);
  radio.setMuted(true);assert.equal(radio.master.gain.value,0);
  await radio.dispose();
});

test('workshop bed keeps only quiet chords while LISTEN restores full score',()=>{
  const radio=new ArcadeRadio({contextFactory:fakeAudio});const notes=[];
  radio.tone=(note,time,duration,options)=>notes.push(options.level);
  radio.setWorkshopMode(true);
  radio.scheduleEvent({kind:'kick'},0,RADIO_STATIONS[0]);
  assert.deepEqual(notes,[]);
  radio.scheduleEvent({kind:'chord',notes:[60,64],duration:1},0,RADIO_STATIONS[0]);
  assert.deepEqual(notes,[.007,.007]);
  radio.auditionState={station:'circuit',wanted:false};
  radio.scheduleEvent({kind:'kick'},0,RADIO_STATIONS[0]);
  assert.equal(notes.at(-1),.18);
});
