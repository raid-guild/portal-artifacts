import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation,PRESSURE} from '../src/simulation.js';
import {FUNNEL,groundAt,resolveParticle,segmentBlockedBySolid} from '../src/colliders.js';
import {createParticleSurface} from '../src/particle-surface.js';
const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const fresh=()=>{const s=new PuddleSimulation();s.selectTest('pressure');return s;};

test('shed releases existing flesh in place and stops on release, preserving the coat',()=>{
  const s=fresh(),original=s.fluid.particles.map(p=>[p.x,p.y,p.z]);
  s.shed(1/42);
  assert.equal(s.pressure.shed,1);
  assert.deepEqual(s.fluid.particles.map(p=>[p.x,p.y,p.z]),original);
  s.fluid.claimFeedstock(s.activeColliders());
  assert.equal(s.fluid.particles.filter(p=>p.feedstock).length,1,'freshly released flesh must not immediately absorb');
  run(s,90,{shed:true});const count=s.pressure.shed;
  run(s,30);assert.equal(s.pressure.shed,count);
  run(s,480,{shed:true});
  assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.filter(p=>!p.feedstock).length>=17);
  assert.ok(s.fluid.coatIndices.every(i=>!s.fluid.particles[i].feedstock));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
  assert.ok(s.fluid.brainPower<.5,'shedding must reduce power');
  assert.equal(s.fluid.particles.filter(p=>!p.feedstock).length,17,'holding shed reaches the protected minimum');
});

test('shed flesh becomes absorbable again after physical separation',()=>{
  const s=fresh();s.shed(1/42);
  const p=s.fluid.particles.find(p=>p.feedstock);
  s.fluid.claimFeedstock(s.activeColliders());assert.equal(p.feedstock,true);assert.equal(p.shedLocked,true);
  p.x=-6;p.z=3;s.fluid.claimFeedstock(s.activeColliders());assert.equal(p.shedLocked,false);
  const b=s.brain;p.x=b.x+.1;p.y=b.y;p.z=b.z;
  s.fluid.claimFeedstock(s.activeColliders());assert.equal(p.feedstock,false);
});

test('gravity projects loose flesh downhill and the rendered surface exists below the terrace',()=>{
  const r=.067,p={x:FUNNEL.x+1.3,z:0,y:.3,vx:0,vy:0,vz:0};
  for(let i=0;i<180;i++){
    p.px=p.x;p.py=p.y;p.pz=p.z;p.vy-=7.2/60;
    p.x+=p.vx/60;p.y+=p.vy/60;p.z+=p.vz/60;
    resolveParticle(p,r,[FUNNEL]);
    p.vx=(p.x-p.px)*60*.96;p.vy=(p.y-p.py)*60*.99;p.vz=(p.z-p.pz)*60*.96;
  }
  assert.ok(Math.hypot(p.x-FUNNEL.x,p.z)<FUNNEL.bottomRadius);
  assert.ok(p.y<-.7);assert.ok(p.y>=groundAt(p.x,p.z,[FUNNEL]).height+r);
  assert.equal(segmentBlockedBySolid({x:FUNNEL.x,y:-.7,z:0},{x:FUNNEL.x+2,y:.1,z:0},[FUNNEL]),true);
  const surface=createParticleSurface(new THREE.MeshBasicMaterial(),28);
  surface.update([p,{...p,x:p.x+.09},{...p,z:.09}],[FUNNEL],r);
  assert.ok(surface.mesh.geometry.drawRange.count>0);
  assert.ok(surface.mesh.position.y<0);
});

test('a real deposit holds the gate after the reduced body leaves and crosses',()=>{
  const s=fresh();run(s,120);assert.equal(s.pressure.weight,0);assert.equal(s.pressure.opening,0);
  run(s,24,{x:1});run(s,180,{shed:true});
  const loose=s.fluid.particles.filter(p=>p.feedstock&&p.y<-.5).length;
  assert.ok(loose>=PRESSURE.threshold,'enough actual shed flesh must reach the basin');
  run(s,130,{z:1});run(s,230,{x:1});run(s,90,{z:-1});run(s,400,{x:1});
  assert.equal(s.pressure.complete,true);
  assert.equal(s.pressure.active,true);assert.equal(s.pressure.opening,PRESSURE.opening);
  assert.ok(s.fluid.attachedCount<297-PRESSURE.threshold,'the basin keeps enough real flesh to hold its plate');
  assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
  s.reset();assert.equal(s.pressure.weight,0);assert.equal(s.pressure.opening,0);
  assert.equal(s.fluid.particles.filter(p=>p.feedstock).length,0);
});

test('plate release closes the gate, but never onto an occupied passage',()=>{
  const s=fresh();s.pressure.active=true;s.pressure.opening=PRESSURE.opening;
  s.updatePressure(1/60);assert.equal(s.pressure.active,false);assert.ok(s.pressure.opening<PRESSURE.opening);
  s.pressure.opening=PRESSURE.opening;s.brain.x=PRESSURE.gateX;s.brain.z=0;s.brain.y=.1;
  s.updatePressure(1/60);assert.equal(s.pressure.opening,PRESSURE.opening);
  s.brain.x=3;for(let i=0;i<90;i++)s.updatePressure(1/60);assert.equal(s.pressure.opening,0);
});


test('flesh on the rim or elsewhere cannot count as plate weight',()=>{
  const s=fresh();
  for(const p of s.fluid.particles){p.x=FUNNEL.x;p.z=0;p.y=.1;}
  s.updatePressure(1/60);assert.equal(s.pressure.weight,0);assert.equal(s.pressure.active,false);
  for(const p of s.fluid.particles){p.x=FUNNEL.x+1.2;p.y=-.1;}
  s.updatePressure(1/60);assert.equal(s.pressure.weight,0);assert.equal(s.pressure.active,false);
});


test('a failed shed touching the brain rejoins after a grace period',()=>{
  const s=fresh();s.shed(1/42);
  const p=s.fluid.particles.find(p=>p.feedstock),b=s.brain;
  p.x=b.x+.1;p.y=b.y;p.z=b.z;
  s.fluid.time=.8;s.fluid.claimFeedstock(s.activeColliders());assert.equal(p.feedstock,true);
  s.fluid.time=1.3;s.fluid.claimFeedstock(s.activeColliders());assert.equal(p.feedstock,false);
});

test('disconnected living flesh expires, while a timely reunion stays alive',()=>{
  const s=fresh(),f=s.fluid;
  const candidates=f.particles.filter((p,i)=>i!==f.brainIndex&&!f.coatIndices.includes(i));
  const abandoned=candidates[0],rescued=candidates[1];
  abandoned.x=6;abandoned.z=3;rescued.x=6;rescued.z=-3;
  run(s,60);assert.equal(!!abandoned.feedstock,false);assert.equal(!!rescued.feedstock,false);
  rescued.x=f.brain.x+.1;rescued.y=f.brain.y;rescued.z=f.brain.z;
  run(s,120);
  assert.equal(abandoned.feedstock,true);assert.equal(!!rescued.feedstock,false);
  assert.equal(f.particles.length,297);
  assert.ok(f.coatIndices.every(i=>!f.particles[i].feedstock));
});
