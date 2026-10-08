import test from 'node:test';
import assert from 'node:assert/strict';
import {setupMusic} from '../src/music.js';
import {setupPickupAudio} from '../src/pickup-audio.js';
class Element extends EventTarget{
  constructor(){super();this.value='25';this.paused=true;this.currentTime=12;this.children=[];this.playCalls=0;}
  setAttribute(name,value){this[name]=value;}
  append(child){this.children.push(child);}
  remove(){}
  click(){this.dispatchEvent(new Event('click'));}
  async play(){this.playCalls++;this.paused=false;}
  pause(){this.paused=true;}
}
function fixture(t){
  const oldDocument=globalThis.document,oldWindow=globalThis.window;
  const nodes=new Map(['#soundtrack','#music-toggle','#music-volume','#music-status','.music-controls'].map(key=>[key,new Element()]));
  const document=new EventTarget();document.hidden=false;document.querySelector=id=>nodes.get(id);document.createElement=()=>new Element();globalThis.document=document;
  t.after(()=>{globalThis.document=oldDocument;globalThis.window=oldWindow;});return nodes;
}

test('Begin starts music, while explicit mute persists through later Begin actions',async t=>{
  const nodes=fixture(t),dispose=setupMusic(),audio=nodes.get('#soundtrack'),button=nodes.get('#music-toggle');
  assert.equal(audio.playCalls,0);dispose.begin();await Promise.resolve();assert.equal(audio.paused,false);
  assert.equal(button.textContent,'MUSIC ON');assert.equal(audio.currentTime,12);
  dispose.begin();assert.equal(audio.playCalls,1,'restarting a level does not restart an already-playing track');
  button.click();assert.equal(audio.paused,true);dispose.begin();assert.equal(audio.paused,true);
  button.click();await Promise.resolve();assert.equal(audio.paused,false);dispose();assert.equal(audio.paused,true);
});

test('pickup audio requires a gesture, emits once, and respects independent mute',t=>{
  const nodes=fixture(t);let contexts=0,tones=0;
  const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
  class Audio{
    constructor(){contexts++;this.state='running';this.currentTime=0;this.destination={};}
    createGain(){return{gain:param(),connect(){},disconnect(){}};}
    createOscillator(){return{frequency:param(),connect(){},disconnect(){},start(){tones++;},stop(){}};}
    async resume(){this.state='running';}async close(){this.state='closed';}
  }
  globalThis.window={AudioContext:Audio};const fx=setupPickupAudio();assert.equal(contexts,0);
  const garden={elapsed:1,gold:[{id:0,collected:true,collectedAt:1}],gems:[]};fx.update(garden);assert.equal(tones,0);
  fx.unlock();assert.equal(contexts,1);fx.update(garden);assert.equal(tones,0,'old pickup must not replay on unlock');
  garden.gold.push({id:1,collected:true,collectedAt:1});fx.update(garden);assert.equal(tones,2);fx.update(garden);assert.equal(tones,2);
  const button=nodes.get('.music-controls').children[0];button.click();garden.gems.push({id:0,collected:true,collectedAt:1});fx.update(garden);assert.equal(tones,2);
  button.click();fx.update(garden);assert.equal(tones,2,'muted pickups must not replay');
  garden.gems.push({id:1,collected:true,collectedAt:1});fx.update(garden);assert.equal(tones,8,'gem plays a fuller motif than gold');fx.dispose();
});
