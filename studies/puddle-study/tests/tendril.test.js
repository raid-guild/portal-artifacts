import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {pointInsideSolid,FUNNEL,groundAt} from '../src/colliders.js';
const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const fresh=()=>{const s=new PuddleSimulation();s.setupRetrieval();run(s,100);return s;};

test('casting uses existing flesh, leaves the brain coated, and retrieves a real basin deposit',()=>{
  const s=fresh(),f=s.fluid,start={x:s.brain.x,z:s.brain.z},particles=[...f.particles];
  assert.equal(s.castTendril({x:FUNNEL.x,z:0}),true);
  assert.ok(s.tendril.indices.every(i=>i!==f.brainIndex&&!f.coatIndices.includes(i)));
  run(s,480);
  assert.equal(s.tendril.active,true);assert.ok(s.tendril.recovered>=100);
  assert.ok(Math.hypot(s.brain.x-start.x,s.brain.z-start.z)<.45,'cast must not launch the brain');
  assert.ok(f.coatContacts(s.activeColliders()).length>=8);
  assert.ok(Math.max(...s.tendril.indices.map(i=>Math.hypot(f.particles[i].x-s.brain.x,f.particles[i].z-s.brain.z)))>3.7);
  s.step({recallToggle:true});run(s,430);
  assert.equal(s.tendril.state,'ready');assert.equal(s.pressure.weight,0);
  assert.ok(f.attachedCount>=270,'collected mass must return to the main body');
  assert.ok(f.particles.filter(p=>p.x>1.8).length>=270,'flesh must actually move through the passage');
  assert.equal(f.particles.length,297);assert.ok(particles.every((p,i)=>f.particles[i]===p));
  assert.ok(f.particles.every(p=>Number.isFinite(p.x+p.y+p.z)&&!pointInsideSolid(p.x,p.y,p.z,s.activeColliders(),.01)));
  assert.ok(f.particles.every(p=>p.y>=groundAt(p.x,p.z,s.activeColliders()).height+f.radius-.015));
});

test('too little flesh refuses a cast and reset clears the entire strand',()=>{
  const s=new PuddleSimulation();s.selectTest('pressure');
  const f=s.fluid;
  f.particles.forEach((p,i)=>{if(i!==f.brainIndex&&!f.coatIndices.includes(i))p.feedstock=true;});
  assert.equal(s.castTendril({x:0,z:0}),false);assert.equal(s.tendril.state,'need flesh');
  assert.ok(f.coatIndices.every(i=>!f.particles[i].feedstock));
  s.setupRetrieval();assert.equal(s.castTendril({x:-2.5,z:0}),true);
  s.reset();assert.equal(s.tendril.active,false);assert.equal(s.tendril.state,'ready');
});

test('a closed gate blocks and breaks a cast instead of transporting flesh through it',()=>{
  const s=new PuddleSimulation();s.selectTest('pressure');
  // Full body on the right, with an empty basin and closed gate.
  for(const p of s.fluid.particles){p.x+=7.4;p.px=p.x;}
  run(s,80);s.castTendril({x:-2.5,z:0});run(s,220);
  assert.equal(s.tendril.state,'broken');
  assert.ok(s.fluid.particles.every(p=>p.x>1.65));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('walking beyond the strand budget breaks it and detached flesh can expire',()=>{
  const s=fresh();s.castTendril({x:-2.5,z:0});run(s,140);
  const reserved=s.tendril.indices.map(i=>s.fluid.particles[i]);
  run(s,260,{x:1,push:true});
  assert.equal(s.tendril.state,'broken');
  run(s,180);
  assert.ok(reserved.some(p=>p.feedstock),'abandoned material must become inert');
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('shedding cancels a strand cleanly and the original setup remains available',()=>{
  const s=fresh();s.castTendril({x:-2.5,z:0});run(s,80);s.step({shed:true});
  assert.equal(s.tendril.active,false);assert.equal(s.tendril.state,'released');
  s.selectTest('pressure');assert.equal(s.retrievalSetup,false);assert.equal(s.pressure.weight,0);
  assert.equal(s.fluid.particles.filter(p=>p.feedstock).length,0);
});


test('tap recall persists without holding and a second tap pauses without relaunching',()=>{
  const s=fresh();s.castTendril({x:-2.5,z:0});run(s,150);
  s.step({recallToggle:true});const before=s.tendril.length;run(s,60);
  assert.ok(s.tendril.length<before-.5);assert.equal(s.tendril.recalling,true);
  s.step({recallToggle:true});const paused=s.tendril.length;run(s,60);
  assert.equal(s.tendril.recalling,false);assert.ok(Math.abs(s.tendril.length-paused)<.05);
});

test('three strands share finite flesh, uniquely own cargo, and recall together',()=>{
  const s=fresh(),f=s.fluid;
  for(const aim of [{x:-2.5,z:0},{x:5,z:2},{x:5,z:-2}])assert.equal(s.castTendril(aim),true);
  assert.equal(s.tendril.count,3);assert.equal(s.castTendril({x:6,z:0}),false);
  assert.match(s.tendril.feedback,/Three tendrils/);
  assert.equal(new Set(s.tendril.indices).size,s.tendril.indices.length);
  assert.ok(s.tendril.indices.every(i=>i!==f.brainIndex&&!f.coatIndices.includes(i)));
  run(s,180);assert.equal(s.tendril.count,3);
  const cargo=s.tendril.strands.flatMap(t=>[...t.cargo]);
  assert.ok(cargo.length>100);assert.equal(new Set(cargo).size,cargo.length);
  s.step({recallToggle:true});run(s,650);
  assert.equal(s.tendril.count,0);assert.equal(s.tendril.recalling,false);
  assert.equal(s.pressure.weight,0);assert.ok(f.attachedCount>=270);
  assert.equal(f.particles.length,297);
});

test('holding gathers the body while recall continues after release',()=>{
  const s=fresh(),f=s.fluid;s.castTendril({x:-2.5,z:0});run(s,150);
  const start={...s.brain};run(s,60,{contract:true});
  assert.equal(s.tendril.recalling,true);assert.equal(s.tendril.active,true);
  assert.ok(Math.hypot(s.brain.x-start.x,s.brain.z-start.z)<.65);
  assert.ok(s.brain.y>start.y+.1);assert.ok(f.coatContacts(s.activeColliders()).length>=8);
  const length=s.tendril.length;run(s,60);
  assert.equal(s.tendril.recalling,true);assert.ok(s.tendril.length<length-.5);
  assert.ok(s.brain.y<start.y+.15);
});

test('a new cast pauses recall and a single broken strand leaves the others usable',()=>{
  const s=fresh();s.castTendril({x:5,z:2});run(s,80);s.step({recallToggle:true});
  assert.equal(s.tendril.recalling,true);assert.equal(s.castTendril({x:5,z:-2}),true);
  assert.equal(s.tendril.recalling,false);
  s.tendril.strands[0].target.x=100;s.step();
  assert.equal(s.tendril.count,1);assert.equal(s.tendril.active,true);
  s.step({recallToggle:true});assert.equal(s.tendril.recalling,true);
  s.reset();assert.equal(s.tendril.count,0);assert.equal(s.tendril.recalling,false);
});
