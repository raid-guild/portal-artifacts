import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as THREE from '../dist/vendor/three.module.js';
import {MazeTopology} from '../dist/maze-core.js';
const checkpoint={version:1,seed:777,floor:-1,index:9,minVisited:0,maxVisited:11,flashlight:false,complete:false};let stored=null;
class FakeMaze{constructor(scene,kit,props,seed,offset,floor=1){this.floor=floor;this.model=new MazeTopology(seed,offset,floor);this.groups=new Map();}sync(){}dispose(){}elevator(){return null;}update(player){return this.model.update(player);}}
const elements=new Map();const noop=()=>{};const context2d=new Proxy({},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{hidden:false,style:{},classList:{toggle:noop,add:noop},setAttribute:noop,addEventListener:noop,getBoundingClientRect:()=>({width:1280,height:800,left:0,top:0}),getContext:()=>context2d,appendChild:noop});return elements.get(id)}
const box={readCheckpoint:()=>checkpoint,writeCheckpoint:value=>(stored=value,true),EndlessMaze:FakeMaze,THREE,console,assert,document:{getElementById:element,querySelectorAll:()=>[],addEventListener:noop,exitPointerLock:noop,hidden:false},window:{addEventListener:noop},matchMedia:()=>({matches:false}),devicePixelRatio:1,performance:{now:()=>100},ResizeObserver:class{observe(){}},requestAnimationFrame:noop,location:{reload:noop},AbortController};vm.createContext(box);
let code=fs.readFileSync('dist/app.js','utf8').replace(/^import .*;$/mg,'').replace('resize();setup3D();','resize();');
code+=`
assert.equal(state.stage,0);assert.equal(maze,null);assert.equal($('continueSurvey').hidden,false);assert.equal($('continueSurvey').disabled,true);
ready=true;scene=new THREE.Scene();props=new THREE.Group();kit=new THREE.Group();state.room={w:6,d:6};resumeUI();assert.equal($('continueSurvey').disabled,false);$('continueSurvey').onclick();
assert.equal(maze.floor,-1);assert.equal(maze.model.seed,777);assert.equal(maze.model.current,9);assert.equal(maze.model.maxVisited,11);assert.equal(flashlightOn,false);assert.equal(state.view,'walk');assert.ok(maze.model.canWalk(state.player.x,state.player.z));assert.equal($('lesson').hidden,true);assert.equal($('continueSurvey').hidden,true);
savedSurvey=null;state.stage=0;resumeUI();assert.equal($('continueSurvey').hidden,true);`;
vm.runInContext(code,box);assert.equal(stored.floor,-1);assert.equal(stored.seed,777);assert.equal(stored.index,9);
console.log('PASS: saved survey preserves CAD start, waits for assets, resumes correct seeded floor/checkpoint/progress and hides continuation for new players.');
