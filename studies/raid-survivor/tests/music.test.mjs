import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {build} from 'esbuild';

const source=fs.readFileSync(new URL('../public/music-test.html',import.meta.url),'utf8');
const approvedHash='f58d6f891f35219c93534e814570fd1fb4843c25e232d43402fb8c87e444d287';
const events=new EventTarget();
const page=new EventTarget();
page.hidden=false;
globalThis.document=page;
globalThis.window=events;
const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,String(value))};
const compiled=await build({entryPoints:['src/music.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {makeVaultRunnerEngine,VaultRunnerMusic,vaultRunnerMusic}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
const realmBundle=await build({entryPoints:['src/newrealm-music.ts'],bundle:true,platform:'node',format:'esm',write:false,absWorkingDir:process.cwd()});
const {makeRealmMusicEngine,realmPattern,REALM_TRACKS,LOOP_STEPS}=await import('data:text/javascript;base64,'+Buffer.from(realmBundle.outputFiles[0].text).toString('base64'));
vaultRunnerMusic.dispose();

function fakeContext(){
 const log=[];
 let id=0;
 const param=(owner,name)=>({
  set value(v){log.push(`${owner}.${name}=${v}`);},
  setValueAtTime(v,t){log.push(`${owner}.${name}.set:${v}:${t}`);},
  exponentialRampToValueAtTime(v,t){log.push(`${owner}.${name}.exp:${v}:${t}`);},
  setTargetAtTime(v,t,c){log.push(`${owner}.${name}.target:${v}:${t}:${c}`);},
  cancelScheduledValues(t){log.push(`${owner}.${name}.cancel:${t}`);}
 });
 const node=(kind)=>{
  const name=`${++id}:${kind}`;log.push(`create:${name}`);
  const data={connect(other){log.push(`${name}->${other.name}`);return other;},disconnect(){log.push(`${name}.disconnect`);},start(t){log.push(`${name}.start:${t}`);},stop(t){log.push(`${name}.stop:${t}`);},name};
  for(const field of ['gain','threshold','knee','ratio','attack','release','delayTime','frequency','Q','pan'])data[field]=param(name,field);
  return new Proxy(data,{set(target,key,value){if(!['onended','buffer'].includes(key))log.push(`${name}.${String(key)}=${value}`);target[key]=value;return true;}});
 };
 const context={sampleRate:64,currentTime:0,destination:node('destination'),createBuffer(channels,length){const arrays=Array.from({length:channels},()=>new Float32Array(length));return{getChannelData:i=>arrays[i]};}};
 for(const type of ['Gain','DynamicsCompressor','Delay','BiquadFilter','Convolver','Oscillator','StereoPanner','BufferSource'])context[`create${type}`]=()=>node(type);
 return {context,log};
}
function approvedEngine(context){
 const body=source.slice(source.indexOf('const $='),source.indexOf('function scheduler()'));
 const doc={getElementById:()=>({value:'38'}),createElement:()=>({className:''}),querySelector:()=>({append(){}})};
 return new Function('document','context',`${body}\nreturn makeEngine(context);`)(doc,context);
}
function digest(log){return crypto.createHash('sha256').update(log.join('\n')).digest('hex');}

test('approved standalone source stays byte identical',()=>{
 assert.equal(crypto.createHash('sha256').update(source).digest('hex'),approvedHash);
});
test('all 1024 steps produce the exact approved Web Audio event trace',()=>{
 const old=fakeContext(),current=fakeContext();
 const a=approvedEngine(old.context),b=makeVaultRunnerEngine(current.context,38);
 for(let n=0;n<1024;n++){
  const time=.1+n*60/130/4;
  a.schedule(n,time);b.schedule(n,time);
 }
 assert.equal(digest(current.log),digest(old.log));
 assert.equal(current.log.length,old.log.length);
});

test('three authored 64-bar patterns are deterministic, finite, five-stem, and rhythmically distinct',()=>{
 const signatures=new Set(),rhythms=new Set();
 for(const level of ['forest','desert','ice']){
  const all=Array.from({length:LOOP_STEPS},(_,n)=>realmPattern(level,n));
  assert.deepEqual(all,Array.from({length:LOOP_STEPS},(_,n)=>realmPattern(level,n)));
  const stems=new Set(all.flat().map(event=>event.stem));assert.deepEqual([...stems].sort(),['air','arp','bass','drums','lead']);
  for(const event of all.flat())for(const value of [event.pitch,event.duration,event.volume,event.cutoff,event.pan,event.send])if(value!==undefined)assert.ok(Number.isFinite(value));
  assert.ok(all.filter(events=>events.some(event=>event.stem==='lead')).length<LOOP_STEPS/2,'lead has intentional rests');
  assert.ok(all.slice(16*16,32*16).flat().length!==all.slice(32*16,48*16).flat().length,'acts change texture');
  signatures.add(digest([JSON.stringify(all)]));
  rhythms.add(digest(all.map((events,n)=>`${n}:${events.map(event=>`${event.stem}/${event.kind}`).join(',')}`)));
  assert.equal(REALM_TRACKS[level].acts.length,4);
 }
 assert.equal(signatures.size,3);assert.equal(rhythms.size,3,'different rhythms, not transpositions');
});

test('new engines schedule all bars, release voice chains and buses, and reject use after stop',async()=>{
 const signatures=new Set();
 for(const level of ['forest','desert','ice']){
  const {context,log}=fakeContext(),engine=makeRealmMusicEngine(context,level,38),step=60/REALM_TRACKS[level].bpm/4;
  for(let n=0;n<LOOP_STEPS;n++)engine.schedule(n,.1+n*step);
  assert.ok(engine.voiceCount()>0);
  signatures.add(digest(log));
  await engine.stop();assert.equal(engine.voiceCount(),0);
  assert.ok(log.some(event=>event.endsWith('.disconnect')));
  assert.throws(()=>engine.schedule(0,200),/stopped/);
 }
 assert.equal(signatures.size,3);
 const legacy=makeVaultRunnerEngine(fakeContext().context);legacy.schedule(0,.1);await legacy.stop();assert.equal(legacy.voiceCount(),0);assert.throws(()=>legacy.schedule(1,.2),/stopped/);
});

test('music transport has one context and interval across starts, mute, hide and restore',async()=>{
 let created=0;
 globalThis.AudioContext=class{
  constructor(){created++;this.state='suspended';this.currentTime=0;this.sampleRate=64;Object.assign(this,fakeContext().context);this.state='suspended';}
  async resume(){this.state='running';}
  async suspend(){this.state='suspended';}
  async close(){this.state='closed';}
 };
 const music=new VaultRunnerMusic();
 await Promise.all([music.start(),music.start(),music.start()]);
 assert.equal(created,1);
 assert.equal(music.snapshot().timerCount,1);
 music.setVolume(70);music.setMuted(true);
 assert.equal(music.snapshot().volume,70);
 assert.equal(music.snapshot().muted,true);
 await music.start();
 assert.equal(created,1);
 page.hidden=true;page.dispatchEvent(new Event('visibilitychange'));
 assert.equal(music.snapshot().timerCount,0);
 page.hidden=false;page.dispatchEvent(new Event('visibilitychange'));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(music.snapshot().timerCount,1);
 assert.equal(created,1);
 events.dispatchEvent(new Event('pagehide'));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(music.snapshot().timerCount,0);
 events.dispatchEvent(new Event('pageshow'));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(music.snapshot().timerCount,1);
 assert.equal(created,2);
 music.dispose();
 assert.equal(music.snapshot().timerCount,0);
});

test('realm selection stays silent until activation, rapid switches choose latest, and stop is reusable',async()=>{
 let created=0;globalThis.AudioContext=class{
  constructor(){created++;Object.assign(this,fakeContext().context);this.state='suspended';}
  async resume(){this.state='running';}
  async suspend(){this.state='suspended';}
  async close(){this.state='closed';}
 };
 const music=new VaultRunnerMusic();await music.selectLevel('forest');assert.equal(created,0);assert.equal(music.snapshot().track,'Thornlight Pursuit');
 music.setMuted(true);await music.start();assert.equal(created,1);assert.equal(music.snapshot().engineCount,1);assert.equal(music.snapshot().timerCount,1);
 const prior=music.snapshot().step;await music.selectLevel('forest');await music.start();assert.equal(music.snapshot().step,prior);assert.equal(music.snapshot().engineCount,1);
 const desert=music.selectLevel('desert'),ice=music.selectLevel('ice');await Promise.all([desert,ice]);assert.equal(music.snapshot().level,'ice');assert.equal(music.snapshot().track,'Shards of Dawn');assert.equal(music.snapshot().engineCount,2);assert.equal(music.snapshot().timerCount,1);assert.equal(created,1);assert.equal(music.snapshot().muted,true);
 await music.stop();assert.equal(music.snapshot().timerCount,0);assert.equal(music.snapshot().voiceCount,0);await music.start();assert.equal(music.snapshot().level,'ice');assert.equal(music.snapshot().timerCount,1);assert.equal(created,2);
 music.dispose();
});

test('pending audio resume cannot start a stale realm after rapid selection',async()=>{
 let context,created=0;globalThis.AudioContext=class{
  constructor(){created++;Object.assign(this,fakeContext().context);this.state='suspended';this.resumes=[];context=this;}
  resume(){return new Promise(resolve=>this.resumes.push(()=>{this.state='running';resolve();}));}
  async suspend(){this.state='suspended';}
  async close(){this.state='closed';}
 };
 const music=new VaultRunnerMusic();await music.selectLevel('forest');const first=music.start(),second=music.selectLevel('desert'),third=music.selectLevel('ice');
 assert.equal(context.resumes.length,3);for(const resolve of context.resumes.reverse())resolve();await Promise.all([first,second,third]);
 assert.equal(created,1);assert.equal(music.snapshot().level,'ice');assert.equal(music.snapshot().engineCount,1);assert.equal(music.snapshot().timerCount,1);music.dispose();
});

test('a resume finishing in a hidden tab is suspended, then restored on visibility',async()=>{
 let context;
 globalThis.AudioContext=class{
  constructor(){Object.assign(this,fakeContext().context);this.state='suspended';this.resumes=[];context=this;}
  resume(){return new Promise(resolve=>this.resumes.push(()=>{this.state='running';resolve();}));}
  async suspend(){this.state='suspended';}
  async close(){this.state='closed';}
 };
 const music=new VaultRunnerMusic();
 const starting=music.start();
 page.hidden=true;page.dispatchEvent(new Event('visibilitychange'));
 context.resumes.shift()();
 await starting;
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(context.state,'suspended');
 assert.equal(music.snapshot().timerCount,0);
 page.hidden=false;page.dispatchEvent(new Event('visibilitychange'));
 context.resumes.shift()();
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(music.snapshot().timerCount,1);
 music.dispose();
});

test('a delayed hide suspend cannot strand the transport after visibility returns',async()=>{
 let context;
 globalThis.AudioContext=class{
  constructor(){Object.assign(this,fakeContext().context);this.state='suspended';this.suspends=[];context=this;}
  async resume(){this.state='running';}
  suspend(){return new Promise(resolve=>this.suspends.push(()=>{this.state='suspended';resolve();}));}
  async close(){this.state='closed';}
 };
 const music=new VaultRunnerMusic();
 await music.start();
 page.hidden=true;page.dispatchEvent(new Event('visibilitychange'));
 page.hidden=false;page.dispatchEvent(new Event('visibilitychange'));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(music.snapshot().timerCount,1);
 context.suspends.shift()();
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(context.state,'running');
 assert.equal(music.snapshot().timerCount,1);
 music.dispose();
});
