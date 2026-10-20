import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Experiment } from './experiment.js';
import { getDemo, DEMOS } from './demos.js';
const create=id=>{const e=new Experiment(new THREE.Scene(),{tone(){}});e.reset(getDemo(id));return e;};
const body=(x,y,vx=2,vy=0)=>{const b=new CANNON.Body({mass:1});b.position.set(x,y,0);b.velocity.set(vx,vy,0);return b;};
test('all new studies isolate one mechanic and reset runtime state',()=>{for(const d of DEMOS.filter(d=>d.mechanic)){const e=create(d.id);e.layers.add(1);e.brightness=.1;e.reset(d);assert.equal(e.layers.size,0);assert.equal(e.held,null);assert.equal(e.brightness,d.id==='power'?.24:1);}});
test('portal rotates speed and cooldown prevents immediate reentry',()=>{const e=create('portals'),b=body(-3,0,3,4);assert.equal(e.step(b,{x:-4,y:0},1,[],'fade',()=>{}),'teleport');assert.ok(Math.abs(Math.hypot(b.velocity.x,b.velocity.y)-5)<1e-8);assert.ok(Math.abs(b.velocity.y-3)<1e-8);const p=b.position.clone();e.step(b,p,1.01,[],'fade',()=>{});assert.deepEqual(b.position,p);});
test('capture stops motion and release restores incoming momentum',()=>{const e=create('sticky'),b=body(-3,0,3,1);e.step(b,{x:-4,y:0},1,[],'fade',()=>{});assert.equal(b.velocity.length(),0);e.release(b);assert.equal(b.velocity.x,3);assert.equal(b.velocity.y,1);assert.equal(e.held,null);});
test('eclipse fades but preserves a little light',()=>{const e=create('eclipse'),b=body(-3,0);e.step(b,b.position.clone(),1,[],'fade',()=>{});e.step(b,b.position.clone(),5,[],'fade',()=>{});assert.equal(e.brightness,.025);e.release(b);assert.equal(e.brightness,1);});
test('fast swept pass hits hazard surface',()=>{const e=create('giant'),b=body(4,0);let death=false;e.step(b,{x:-4,y:0},1,[],'fade',()=>{death=true;});assert.ok(death);});
test('pickups trigger once and musical voices stay bounded',()=>{for(const id of ['power','dimmer','sound']){const e=create(id),b=body(-5,0);e.step(b,b.position,1,[],'fade',()=>{});const brightness=e.brightness;e.step(b,b.position,2,[],'fade',()=>{});assert.equal(e.brightness,brightness);assert.equal(e.layers.size,id==='sound'?1:0);}});
test('hidden body is fully absent until illuminated with clear sight',()=>{const e=create('hidden'),b=body(-3.5,-2);assert.equal(e.items[0].mesh.visible,false);e.updateVisuals(b.position,0,1);assert.equal(e.items[0].mesh.visible,false);b.position.set(2,-2,0);e.updateVisuals(b.position,0,1);assert.equal(e.items[0].mesh.visible,true);e.updateVisuals(b.position,0,.001);assert.equal(e.items[0].mesh.visible,false);b.position.set(40,0,0);e.updateVisuals(b.position,0,1);assert.equal(e.items[0].mesh.visible,false);});
test('fixed danger orbit ignores placed gravity',()=>{const a=create('clock'),b=create('clock'),hero=body(-11,0),well={x:1,y:1,strength:180,createdAt:0,lifetime:8};a.step(hero,hero.position,2,[],'fade',()=>{});b.step(hero,hero.position,2,[well],'fade',()=>{});assert.equal(a.items[0].x,b.items[0].x);assert.equal(a.items[0].y,b.items[0].y);});

test('pickup cores are ember-sized while their collection radius stays unchanged',()=>{for(const id of ['power','dimmer']){const e=create(id);assert.equal(e.items[0].r,.65);assert.equal(e.items[0].mesh.userData.coreRadius,.22);}});
test('hidden danger reveals beyond the old four-unit cutoff when directly lit',()=>{const e=create('hidden');e.updateVisuals({x:3,y:5},0,1);assert.equal(e.items[0].mesh.visible,true);});
