import test from 'node:test';
import assert from 'node:assert/strict';
import {ParticleFluid} from '../src/particle-fluid.js';
import {PuddleSimulation,DT} from '../src/simulation.js';
import {TouchJoystick} from '../src/touch-joystick.js';
const rng=(seed=19)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const input={puddle:true,growth:true,x:0,z:0};

test('burst preserves the core and particle identities, scatters flesh, and allows recovery',()=>{
  const f=new ParticleFluid({seedCount:297,massReferenceCount:297}),originals=[...f.particles];
  const b={...f.brain},coat=f.coatIndices.map(i=>({...f.particles[i]}));
  const supply=f.addParticle({x:f.brain.x+.8,y:.1,z:.2},{feedstock:true});
  const remote=f.addParticle({x:9,y:.1,z:9});
  const before=originals.reduce((sum,p)=>sum+Math.hypot(p.x-b.x,p.z-b.z),0)/originals.length;
  f.startContract();const count=f.burstFlesh([],rng());
  assert.equal(count,originals.length-17);
  for(const k of ['x','y','z','vx','vy','vz']){
    assert.equal(f.brain[k],b[k]);f.coatIndices.forEach((i,j)=>assert.equal(f.particles[i][k],coat[j][k]));
  }
  assert.equal(supply.shedAt,undefined);assert.equal(remote.shedAt,undefined);
  const emitted=originals.filter(p=>p.shedAt!==undefined);
  for(const p of emitted){assert.ok(p.feedstock&&p.shedLocked);assert.ok(p.vy>0);}
  const chunks=new Map();for(const p of emitted){if(!chunks.has(p.burstGroup))chunks.set(p.burstGroup,[]);chunks.get(p.burstGroup).push(p);}
  assert.ok(chunks.size>=3&&chunks.size<=14);
  for(const chunk of chunks.values()){
    const outward=chunk.reduce((v,p)=>v+p.vx*(p.x-b.x)+p.vz*(p.z-b.z),0);
    assert.ok(outward>0,'each piece travels away from the core as a whole');
  }
  assert.equal(f.contractAnchor,null);assert.ok(f.brainPower>0);
  for(let i=0;i<30;i++)f.step(DT,input,[]);
  assert.equal(f.particles.length,originals.length+2);originals.forEach((p,i)=>assert.equal(f.particles[i],p));
  assert.ok(f.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  const spread=emitted.reduce((sum,p)=>sum+Math.hypot(p.x-b.x,p.z-b.z),0)/emitted.length;
  assert.ok(spread>before+1.5,`spread ${before} -> ${spread}`);
  const p=emitted[0];Object.assign(p,{x:f.brain.x+.12,y:f.brain.y,z:f.brain.z});f.time+=2;f.claimFeedstock([]);assert.equal(p.feedstock,true,'blast fragments cannot be reclaimed during the separation period');f.time+=5;
  f.claimFeedstock([]);assert.equal(p.feedstock,false);
});

test('minimum coating is safe; scattered flesh respects a thin wall and low roof',()=>{
  const tiny=new ParticleFluid({seedCount:17});assert.equal(tiny.burstFlesh(),0);assert.ok(tiny.brainPower>0);
  const wall={type:'box',minX:-.98,maxX:-.95,minY:0,maxY:30,minZ:-50,maxZ:50};
  const roof={type:'roof',minX:-50,maxX:50,minZ:-50,maxZ:50,bottom:.8,top:1};
  const f=new ParticleFluid({seedCount:297}),colliders=[wall,roof];f.burstFlesh(colliders,rng());
  const emitted=f.particles.filter(p=>p.shedAt!==undefined);assert.ok(emitted.length>0);
  for(let i=0;i<50;i++){f.step(DT,input,colliders);for(const p of emitted){
    assert.ok(p.x<=wall.minX-f.radius+.01,`wall ${p.x}`);assert.ok(p.y<=roof.bottom-f.radius+.01,`roof ${p.y}`);
  }}
});

test('queued burst fires once, ends recall and contraction, and clears on restart or arrival',()=>{
  const sim=new PuddleSimulation();sim.fluid.startContract();sim.tendril.recalling=true;
  assert.equal(sim.queueBurst(),true);assert.equal(sim.queueFlick({x:1,z:0},1),false);
  sim.step({contract:true},DT);
  assert.equal(sim.pendingBurst,false);assert.equal(sim.fluid.contractAnchor,null);assert.equal(sim.tendril.recalling,false);
  assert.ok(sim.pressure.shed>0);const count=sim.pressure.shed;sim.step({},DT);assert.equal(sim.pressure.shed,count);
  sim.queueBurst();sim.reset();assert.equal(sim.pendingBurst,false);
  sim.startGarden(1);assert.equal(sim.queueBurst(),false);sim.pendingBurst=true;sim.step({},DT);assert.equal(sim.pendingBurst,false);
});


test('holding through both thresholds contracts, bursts, and leaves a movable core until release',()=>{
  for(const count of [65,297]){
    const sim=new PuddleSimulation();sim.fluid=new ParticleFluid({seedCount:count,massReferenceCount:297});
    const stick=new TouchJoystick({onBurst:()=>sim.queueBurst()});stick.down(1,0,0,0);
    let contracted=false;
    for(let frame=1;frame<=380;frame++){
      stick.update(frame*1000/60);sim.step({contract:stick.holding},DT);
      if(frame===40)contracted=!!sim.fluid.contractAnchor;
    }
    assert.ok(contracted);assert.equal(sim.pressure.shed,count-17);
    assert.equal(sim.fluid.contractAnchor,null);assert.ok(sim.fluid.brainPower>0);
    assert.equal(sim.fluid.particles.length,count);
    assert.equal(stick.up(1,100,0,6400),'burst');
    const x=sim.brain.x;for(let i=0;i<60;i++)sim.step({x:1,z:0},DT);
    assert.ok(sim.brain.x>x+.1,'core still moves and can recover its scattered flesh');
  }
});


test('blast velocities span varied distances and elevations and differ between bursts',()=>{
  const a=new ParticleFluid({seedCount:297}),b=new ParticleFluid({seedCount:297});
  a.burstFlesh([],rng(1));b.burstFlesh([],rng(98));
  const pieces=a.particles.filter(p=>p.burstUntil>0),speeds=pieces.map(p=>Math.hypot(p.vx,p.vz));
  assert.ok(Math.max(...speeds)>10);assert.ok(Math.max(...speeds)-Math.min(...speeds)>6,'not an equal-speed ring');
  assert.ok(Math.max(...pieces.map(p=>p.vy))-Math.min(...pieces.map(p=>p.vy))>3);
  assert.ok(pieces.some(p=>Math.abs(p.vx)>5),'blast exceeds ordinary movement cap');
  assert.notDeepEqual(a.particles.map(p=>p.vx),b.particles.map(p=>p.vx));
});


test('neighboring flesh stays in substantial pieces while the chunks spread apart',()=>{
  const f=new ParticleFluid({seedCount:297});f.burstFlesh([],rng(14));
  const chunks=new Map();for(const p of f.particles){if(p.burstGroup===undefined)continue;
    if(!chunks.has(p.burstGroup))chunks.set(p.burstGroup,[]);chunks.get(p.burstGroup).push(p);}
  for(let frame=0;frame<60;frame++)f.step(DT,input,[]);
  let compact=0;const centers=[];
  for(const chunk of chunks.values()){
    const center=chunk.reduce((c,p)=>({x:c.x+p.x/chunk.length,y:c.y+p.y/chunk.length,z:c.z+p.z/chunk.length}),{x:0,y:0,z:0});
    centers.push(center);
    if(chunk.length>=6&&Math.max(...chunk.map(p=>Math.hypot(p.x-center.x,p.y-center.y,p.z-center.z)))<.9)compact+=chunk.length;
  }
  assert.ok(compact>220,`most flesh remains in visible chunks: ${compact}`);
  assert.ok(Math.max(...centers.map(c=>Math.hypot(c.x-f.brain.x,c.z-f.brain.z)))>4,'pieces still have a large blast radius');
});
