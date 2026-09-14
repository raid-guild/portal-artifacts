import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as THREE from '../dist/vendor/three.module.js';
const elements=new Map();const noop=()=>{};const context2d=new Proxy({},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{hidden:false,style:{},classList:{toggle:noop,add:noop},setAttribute:noop,addEventListener:noop,getBoundingClientRect:()=>({width:1280,height:800,left:0,top:0}),getContext:()=>context2d,appendChild:noop});return elements.get(id)}
const box={readCheckpoint:()=>null,writeCheckpoint:()=>false,THREE,console,assert,document:{getElementById:element,querySelectorAll:()=>[],addEventListener:noop,exitPointerLock:noop,hidden:false},window:{addEventListener:noop},matchMedia:()=>({matches:false}),devicePixelRatio:1,performance:{now:()=>100},ResizeObserver:class{observe(){}},requestAnimationFrame:noop,location:{reload:noop},AbortController};vm.createContext(box);
let code=fs.readFileSync('dist/app.js','utf8').replace(/^import .*;$/mg,'').replace('resize();setup3D();','resize();');
code+=`
ready=true;scene=new THREE.Scene();kit=new THREE.Group();for(const name of ['Wall','Floor','Ceiling','Fixture','DoorFrame','Outlet']){const o=new THREE.Group();o.name=name;kit.add(o);}renderer={domElement:{}};
$('primary').onclick();assert.equal(state.stage,1);
$('primary').onclick();assert.equal(state.view,'preview');
setView('plan');assert.match($('primary').innerHTML,/Preview/);
$('primary').onclick();$('primary').onclick();assert.equal(state.stage,2);
setView('plan');assert.match($('primary').innerHTML,/Return/);$('primary').onclick();assert.equal(state.view,'walk');
$('primary').onclick();assert.equal(state.stage,3);assert.equal(state.view,'plan');
$('primary').onclick();assert.equal(state.stage,4);assert.equal(state.view,'walk');assert.equal($('primary').hidden,true);
setView('plan');assert.match($('primary').innerHTML,/Return/);$('primary').onclick();assert.equal(state.view,'walk');
surveyStart();$('primary').onclick();assert.equal(state.view,'plan');assert.equal($('primary').hidden,true);
setView('walk');assert.match($('primary').innerHTML,/Review drawing/);$('primary').onclick();assert.equal(state.view,'plan');
state.stage=1;ready=false;tutorial();assert.equal($('primary').disabled,true);ready=true;tutorial();assert.equal($('primary').disabled,false);
console.log('PASS: tutorial buttons follow current view, guide the complete sequence, avoid repeated same-view actions, and reflect loading.');`;
vm.runInContext(code,box);
vm.runInContext(`keys.clear();running=false;crouched=false;assert.equal(movementSpeed(),2.5);keys.add('shift');assert.equal(movementSpeed(),4.5);keys.clear();$('run').onclick();assert.equal(movementSpeed(),4.5);crouched=true;assert.equal(movementSpeed(),1.25);crouched=false;setView('plan');assert.equal($('run').hidden,true);`,box);
console.log('PASS: Shift and run toggle accelerate movement, crouching wins, and the control hides on the map.');
