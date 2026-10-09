import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createBurnFeedback} from '../src/burn-feedback.js';

const fixture=()=>({selectedTest:'garden',size:1,fluid:{time:0},brain:{x:0,y:.15,z:0},
  garden:{phase:'playing',burnSites:[],coreBurn:0}});

test('burn feedback uses confirmed burn sites, caps instances, and fades smoke after escape',()=>{
  const scene=new THREE.Scene(),effect=createBurnFeedback(scene),sim=fixture();
  effect.update(sim);assert.equal(effect.flashes.count,0);assert.equal(effect.smoke.count,0);
  sim.garden.burnSites=Array.from({length:60},(_,i)=>({x:i*.01,y:.1,z:0}));
  for(let i=0;i<45;i++){sim.fluid.time+=1/60;effect.update(sim);}
  assert.equal(effect.flashes.count,12);assert.ok(effect.smoke.count>0);
  assert.ok(effect.smoke.count<=24);
  sim.garden.burnSites=[];sim.fluid.time+=1/60;effect.update(sim);
  assert.equal(effect.flashes.count,0,'heat flash ends with contact');
  for(let i=0;i<50;i++){sim.fluid.time+=1/60;effect.update(sim);}
  assert.equal(effect.smoke.count,0,'old smoke expires');
  effect.dispose();assert.equal(scene.children.length,0);
});

test('exposed core is visible, while pause and respawn clear old effects',()=>{
  const effect=createBurnFeedback(new THREE.Scene()),sim=fixture();
  effect.update(sim);sim.garden.coreBurn=.15;sim.fluid.time=.15;effect.update(sim);
  assert.equal(effect.flashes.count,1);assert.ok(effect.smoke.count>0);
  sim.garden.phase='paused';effect.update(sim);
  assert.equal(effect.flashes.count,0);assert.equal(effect.smoke.count,0);
  sim.garden.phase='playing';sim.fluid={time:0};sim.garden.coreBurn=0;effect.update(sim);
  assert.equal(effect.flashes.count,0);assert.equal(effect.smoke.count,0);
  effect.dispose();
});


test('smoke tapers to almost zero before removal instead of popping',()=>{
  const effect=createBurnFeedback(new THREE.Scene()),sim=fixture();
  effect.update(sim);sim.garden.burnSites=[{x:0,y:.1,z:0}];
  sim.fluid.time=.06;effect.update(sim);
  const matrix=new THREE.Matrix4(),scale=new THREE.Vector3();
  effect.smoke.getMatrixAt(0,matrix);scale.setFromMatrixScale(matrix);
  const initial=scale.x;
  sim.garden.burnSites=[];
  for(let i=0;i<6;i++){sim.fluid.time+=.1;effect.update(sim);}
  assert.equal(effect.smoke.count,1);
  effect.smoke.getMatrixAt(0,matrix);scale.setFromMatrixScale(matrix);
  assert.ok(scale.x<initial*.1,'puff shrinks smoothly before its lifetime ends');
  sim.fluid.time+=.1;effect.update(sim);assert.equal(effect.smoke.count,0);
  effect.dispose();
});
