import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from 'typescript';

const source=fs.readFileSync(new URL('../public/music-test.html',import.meta.url),'utf8');
const approvedHash='f58d6f891f35219c93534e814570fd1fb4843c25e232d43402fb8c87e444d287';
const events=new EventTarget();
const page=new EventTarget();
page.hidden=false;
globalThis.document=page;
globalThis.window=events;
const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,String(value))};
const compiled=ts.transpileModule(fs.readFileSync(new URL('../src/music.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {makeVaultRunnerEngine,VaultRunnerMusic,vaultRunnerMusic}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
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
