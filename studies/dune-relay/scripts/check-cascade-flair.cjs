const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { CascadeFlair, cascadeFlairTier, cascadeVisualStrength, showCascadeWord } = require('../src/game/cascadeFlair.ts');
assert.deepEqual([0,1,2,3,4,5,6,8].map(cascadeFlairTier), [0,0,1,1,2,2,3,3]);
assert.deepEqual([0,1,2,3,4,6].map(showCascadeWord), [false,false,false,true,false,false]);
assert.deepEqual([1,2,3,4,5,6,9].map(w => cascadeVisualStrength(w)), [0,1,2,3,4,5,5]);
assert.equal(cascadeVisualStrength(1,true),1);
function harness(reducedMotion=false) {
  const sprites=[], tweens=[], shakes=[];
  function display(type,x=0,y=0) {
    const item={ type,x,y,list:[],destroyed:false,
      add(child){this.list.push(child);return this;},bringToTop(child){this.list=this.list.filter(it=>it!==child);this.list.push(child);return this;},
      setDepth(){return this;},setPosition(x,y){this.x=x;this.y=y;return this;},
      lineStyle(){return this;},lineBetween(){return this;},fillStyle(){return this;},fillCircle(){return this;},strokeCircle(){return this;},setRotation(){return this;},
      destroy(){this.destroyed=true;for(const child of this.list)child.destroy();} };
    sprites.push(item);return item;
  }
  const root=display('root');
  const tween=config=>{const value={config,removed:false,paused:false,remove(){this.removed=true;},pause(){this.paused=true;},resume(){this.paused=false;}};tweens.push(value);return value;};
  const scene={events:{once(){},off(){}},add:{graphics:({x=0,y=0}={})=>display('graphics',x,y),container:(x,y)=>display('container',x,y)},
    tweens:{add:tween,addCounter(config){const value=tween(config);value.getValue=()=>.5;shakes.push(value);return value;}}};
  return {flair:new CascadeFlair(scene,root,reducedMotion),root,sprites,tweens,shakes};
}
const cells=Array.from({length:12},(_,i)=>({x:345+(i%4)*50,y:70+Math.floor(i/4)*50}));
const impact=harness();
assert.equal(impact.flair.play(1,cells),0);
assert.equal(impact.flair.play(1,cells,true),1);
assert.equal(impact.flair.liveCount,20);
assert.equal(impact.flair.glowCount,1);
for(const [wave,count] of [[2,20],[3,28],[4,36],[5,42],[6,48]]) {
  const solo=harness();solo.flair.play(wave,cells);assert.equal(solo.flair.liveCount,count);solo.flair.dispose();
  impact.flair.play(wave,cells);assert(impact.flair.liveCount<=48);
}
assert.equal(impact.flair.glowCount,2);
assert(impact.sprites.some(it=>it.type==='graphics'&&it.destroyed),'old sparks retired for a new wave');
assert.equal(impact.shakes.length,6);
impact.shakes.at(-1).config.onUpdate(impact.shakes.at(-1));
assert.notDeepEqual([impact.root.x,impact.root.y],[0,0]);
assert(impact.tweens.some(it=>Array.isArray(it.config.targets)&&it.config.scale===1.35),'cell halos expand');
impact.flair.setPaused(true);assert(impact.tweens.filter(it=>!it.removed).every(it=>it.paused));
impact.flair.setPaused(false);assert(impact.tweens.filter(it=>!it.removed).every(it=>!it.paused));
const active=impact.tweens.find(it=>!it.removed&&it.config.targets?.type==='graphics');
active.config.onComplete();assert.equal(impact.flair.liveCount,47);
impact.flair.dispose();assert.equal(impact.flair.liveCount,0);assert.equal(impact.flair.glowCount,0);
assert.deepEqual([impact.root.x,impact.root.y],[0,0]);
impact.flair.play(8,cells);assert.equal(impact.flair.liveCount,0);
const reduced=harness(true);reduced.flair.play(8,cells);assert.equal(reduced.shakes.length,0);assert.equal(reduced.flair.liveCount,4);assert.equal(reduced.flair.glowCount,0);
assert(reduced.tweens.every(it=>it.config.x===it.config.targets.x&&it.config.y===it.config.targets.y));reduced.flair.dispose();
const previousDocument=global.document,listeners=new Map();
global.document={hidden:false,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
const visibility=harness();visibility.flair.play(2,cells);visibility.flair.setPaused(true);
global.document.hidden=true;listeners.get('visibilitychange')();global.document.hidden=false;listeners.get('visibilitychange')();
assert(visibility.tweens.filter(it=>!it.removed).every(it=>it.paused),'overlay remains paused after tab returns');
visibility.flair.setPaused(false);assert(visibility.tweens.filter(it=>!it.removed).every(it=>!it.paused));
visibility.flair.dispose();assert.equal(listeners.size,0);global.document=previousDocument;
console.log('Cascade strength, caps, glow, reduced motion, pause, visibility, and teardown passed.');
