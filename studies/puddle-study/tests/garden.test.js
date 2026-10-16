import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN,gemCoverage,gemSamples,updateGarden} from '../src/garden-level.js';
import {groundAt,supportedGroundAt,resolveParticle} from '../src/colliders.js';
import {drainPosition} from '../src/garden-level.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {createEditorStageView} from '../src/editor-stage-view.js';
import {closeTablet} from '../src/memory-tablets.js';
import * as THREE from 'three';
const tick=(s,input={})=>{s.step(input);if(s.garden?.phase==='reading'){closeTablet(s);s.step({});}};
const run=(s,n,input={})=>{for(let i=0;i<n;i++)tick(s,input);};
const fresh=()=>{const s=new PuddleSimulation();s.selectTest('garden');s.garden.phase='playing';run(s,30);return s;};
function go(s,x,z){
  for(let i=0;i<1000;i++){
    if(s.garden.phase==='draining'||s.garden.phase==='complete')return;
    const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
    if(d<.18){run(s,15);return;}
    tick(s,{x:dx/d,z:dz/d});
  }
  assert.fail(`Could not reach ${x},${z}: brain at ${s.brain.x},${s.brain.z}`);
}

test('title and pause freeze physics, restart restores all finite collectibles and supply',()=>{
  const s=new PuddleSimulation();s.selectTest('garden');
  const start={...s.brain};run(s,20,{x:1,contract:true});assert.deepEqual(s.brain,start);
  assert.equal(s.fluid.particles.length,297);assert.equal(s.fluid.particles.filter(p=>!p.feedstock).length,65);
  s.garden.phase='playing';run(s,30,{x:1});assert.ok(s.brain.x>start.x);
  s.garden.phase='paused';const paused={...s.brain};run(s,20,{x:1});assert.deepEqual(s.brain,paused);
  s.garden.gems[0].collected=true;s.garden.gold[0].collected=true;s.reset();
  assert.equal(s.garden.phase,'title');assert.equal(s.garden.gemCount,0);assert.equal(s.garden.goldCount,0);
  assert.ok(s.garden.gold.every(g=>!g.collected));assert.ok(s.garden.gems.every(g=>!g.collected));
});

test('gem coverage requires sides, cap, and a substantial volume rather than a nearby brain',()=>{
  const g={x:0,y:.34,z:0};const shell=gemSamples(g).flatMap(p=>[p,{...p,x:p.x+.01},{...p,z:p.z+.01}]);
  assert.equal(gemCoverage(g,[],[],.067),0);
  assert.equal(gemCoverage(g,shell,[],.067),1);
  assert.ok(gemCoverage(g,shell.filter(p=>p.y<.4),[],.067)<12/13);
  const wall=[{type:'box',minX:-.8,maxX:.8,minY:.4,maxY:.45,minZ:-.8,maxZ:.8}];
  assert.ok(gemCoverage(g,shell.map(p=>({...p,y:.3})),wall,.067)<12/13);
});

test('loose or disconnected flesh cannot collect gold or gems for the brain',()=>{
  const s=fresh(),gold=s.garden.gold[0],g=s.garden.gems[0];
  const loose=s.fluid.particles.find(p=>p.feedstock);Object.assign(loose,{x:gold.x,y:gold.y,z:gold.z});
  updateGarden(s,1);assert.equal(gold.collected,false);
  loose.feedstock=false;loose.component=999;updateGarden(s,1);assert.equal(gold.collected,false);
  const p=s.fluid.particles[s.fluid.coatIndices[0]];Object.assign(p,{x:gold.x,y:gold.y,z:gold.z,component:s.brain.component});
  updateGarden(s,1);assert.equal(gold.collected,true);updateGarden(s,1);assert.equal(s.garden.goldCount,1);
  assert.equal(g.collected,false);
});

test('Hanging Nursery completes through the arcade, stairs, optional bridge, and drain',()=>{
  const s=fresh();
  for(const [x,z] of [[4.8,-2.6],[2.5,-3.2],[.6,-2.7],[-2,-2.7]])go(s,x,z);
  assert.ok(s.fluid.attachedCount>=175);
  assert.equal(s.garden.under,true,'westward arcade is recognized from the far side');
  assert.equal(s.garden.gemCount,0,'passing the cup does not automatically enclose its gem');
  run(s,220,{contract:true});assert.equal(s.garden.gemCount,1);
  run(s,90);
  for(const [x,z] of [[-5,-2.7],[-7.5,-2.6],[-7.5,.3],[-7.5,1.4],[-7.5,2.2],[-5.8,2.5],
    [-6.2,1.3],[-4.5,1.3],[-2.4,1.3],[1.55,1.3]])go(s,x,z);
  assert.ok(s.brain.y>.65,'the raised gem landing is supported');
  run(s,220,{contract:true});assert.equal(s.garden.gemCount,2);
  run(s,80);
  for(const [x,z] of [[2.6,1.3],[4.6,1.3],[4.8,3.5],[5.6,2.6]])go(s,x,z);
  run(s,220,{contract:true});assert.equal(s.garden.gemCount,3);
  run(s,80);go(s,6.8,3.2);go(s,7.6,2.8);run(s,220);
  assert.equal(s.garden.phase,'complete');
  assert.equal(s.garden.goldCount,17);
  assert.ok(s.garden.tablets.every(t=>t.read),'all five route instructions are reachable');
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
});

test('nursery geometry leaves a westward arcade and a broad lower recovery route',()=>{
  const s=fresh(),c=s.activeColliders();
  assert.equal(GARDEN.posts,undefined,'the old uniform pillar barrier is gone');
  assert.ok(Math.abs(GARDEN.roof.bottom-GARDEN.terrain.upperHeight-.32)<1e-8);
  assert.ok(GARDEN.editorFixtures.some(f=>f.sourceId==='nursery-skywalk'));
  assert.ok(GARDEN.editorFixtures.some(f=>f.sourceId==='nursery-gem-landing'&&f.maxX-f.minX>=3));
  assert.equal(groundAt(-2,3.5,c).height,0,'falls from the bridge land in the lower garden');
  assert.equal(supportedGroundAt({x:.8,y:.9,z:1.25},.067,c),.7,'the crossing gem has a real landing');
  assert.equal(groundAt(-5.8,2.5,c).height,0,'the lower flesh pool is physically reachable');
});

test('an early wall drop reaches the lower court without the optional rewards',()=>{
  const s=fresh();go(s,2.2,-.2);
  for(let i=0;i<180&&s.brain.y>=.5;i++)tick(s);
  assert.ok(s.brain.y<.5,'fall reaches the lower garden');
  go(s,4.8,3.5);go(s,7.6,2.8);run(s,220);
  assert.equal(s.garden.phase,'complete');
  assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});

test('the arcade lesson only completes on the opposite-side exit',()=>{
  const s=fresh(),roof=GARDEN.roof;s.tabletAutoRead=false;
  const visit=x=>{Object.assign(s.brain,{x,z:-2.7,y:1.75});updateGarden(s,1/60);};
  visit(roof.maxX+.4);visit((roof.minX+roof.maxX)/2);visit(roof.maxX+.4);
  assert.equal(s.garden.enteredGap,false);assert.equal(s.garden.under,false,'backing out does not complete the lesson');
  visit((roof.minX+roof.maxX)/2);visit(roof.minX-.4);
  assert.equal(s.garden.under,true,'a later complete westward crossing does');
});

test('terrace heights and funnel floor match the playable descent',()=>{
  const s=fresh(),c=s.activeColliders();
  assert.ok(groundAt(7,-2.6,c).height<=2.16&&groundAt(7,-2.6,c).height>=2.06,'arrival bowl is shallow');
  assert.equal(groundAt(4.8,-2.6,c).height,1.62);
  assert.ok(Math.abs(groundAt(-7.5,.75,c).height-.81)<1e-9);
  assert.ok(Math.abs(groundAt(-7.5,2.2,c).height)<1e-9);
  assert.ok(Math.abs(groundAt(5,0,c).height)<1e-9);
  assert.ok(Math.abs(groundAt(GARDEN.exit.x,GARDEN.exit.z,c).height+.9)<1e-9);
});

test('upper ledge blocks entry from below but permits a drop from above',()=>{
  const c=[GARDEN.terrain],r=.067;
  const below={x:0,z:-.68,y:.08,px:0,pz:-.48,py:.08,vx:0,vy:0,vz:0};
  resolveParticle(below,r,c);
  assert.ok(below.z>=GARDEN.terrain.frontZ+r-.001);
  assert.ok(below.y<.3,'lower material is not lifted onto the upper floor');
  for(const x of [GARDEN.terrain.stairs.minX-.05,GARDEN.terrain.stairs.maxX+.05]){
    const corner={x,z:-.68,y:.08,px:x,pz:-.48,py:.08,vx:0,vy:0,vz:0};
    resolveParticle(corner,r,c);
    assert.ok(corner.z>=GARDEN.terrain.frontZ+r-.001,`front corner at x=${x} blocks entry`);
    assert.ok(corner.y<.3,`front corner at x=${x} does not lift lower material`);
  }
  const above={x:0,z:-.45,y:1.8,px:0,pz:-.7,py:1.8,vx:0,vy:0,vz:0};
  resolveParticle(above,r,c);
  assert.ok(above.z>GARDEN.terrain.frontZ,'fall from above can cross the ledge');
  const side={x:-6.25,z:.4,y:.08,px:-6.05,pz:.4,py:.08,vx:0,vy:0,vz:0};
  resolveParticle(side,r,c);
  assert.ok(side.x>=GARDEN.terrain.stairs.maxX+r-.001);
  assert.ok(side.y<.3);
});

test('start patch blocks low side entry at both exposed edges and allows a drop',()=>{
  const c=[GARDEN.terrain],r=.067,tier=GARDEN.terrain.startTier;
  for(const [before,after,limit] of [[tier.maxZ+.1,tier.maxZ-.08,tier.maxZ+r],
    [tier.minZ-.1,tier.minZ+.08,tier.minZ-r]]){
    const low={x:7,z:after,y:1.7,px:7,pz:before,py:1.7,vx:0,vy:0,vz:0};
    resolveParticle(low,r,c);
    assert.ok(before>tier.maxZ?low.z>=limit-.001:low.z<=limit+.001);
    assert.ok(low.y<1.9,'upper-lane material is not lifted onto the start patch');
    const high={x:7,z:after,y:2.35,px:7,pz:before,py:2.35,vx:0,vy:0,vz:0};
    resolveParticle(high,r,c);
    assert.equal(high.z,after,'a particle above the tier may leave or enter across its edge');
  }
  const outside={x:tier.minX-.05,z:tier.maxZ-.08,y:1.7,
    px:tier.minX-.05,pz:tier.maxZ+.1,py:1.7,vx:0,vy:0,vz:0};
  resolveParticle(outside,r,c);
  assert.ok(outside.y<1.9,'the tier corner does not raise material outside its footprint');
});

test('the nursery renders its raised crossing, memory stones, and drain court',()=>{
  const scene=new THREE.Scene(),view=createEditorStageView(scene,GARDEN);
  const meshes=[];view.group.traverse(o=>{if(o.isMesh)meshes.push(o);});
  assert.ok(meshes.length>30);
  assert.ok(meshes.some(o=>o.userData.editorId==='nursery-gem-landing'));
  assert.ok(view.group.children.some(o=>o.isLineSegments),'planting pockets and drain court have visible inlays');
  assert.ok(meshes.some(o=>o.geometry.type==='ConeGeometry'&&o.position.z>4),'lower garden has planting');
  assert.ok(meshes.every(o=>Number.isFinite(o.position.x+o.position.y+o.position.z)));
  view.dispose();
});

test('drain gathers over the opening before dropping below the terrain mask',()=>{
  const p={x:6.8,y:.08,z:1.9},early=drainPosition(p,1.2),late=drainPosition(p,2.8);
  assert.equal(early.y,p.y);
  assert.ok(Math.hypot(early.x-GARDEN.exit.x,early.z-GARDEN.exit.z)<Math.hypot(p.x-GARDEN.exit.x,p.z-GARDEN.exit.z));
  assert.equal(late.x,GARDEN.exit.x);assert.equal(late.z,GARDEN.exit.z);
  assert.ok(late.y<-2);
  const sample=Array.from({length:65},(_,i)=>({x:(i%5)*.08,y:-.8+Math.floor(i/25)*.1,z:Math.floor(i/5)%5*.08}));
  const surface=createParticleSurface(new THREE.MeshBasicMaterial(),32);
  surface.update(sample,[],.067);assert.equal(surface.mesh.geometry.drawRange.count,0);
  surface.update(sample,[],.067,{maskTerrain:false});assert.ok(surface.mesh.geometry.drawRange.count>0);
});

test('the inner bowl commits a floating off-center brain and finishes without further steering',()=>{
  const s=fresh();
  // Reproduce the former failure: the coating holds the brain above the bowl,
  // inside its mouth but outside the old tiny center/negative-height trigger.
  Object.assign(s.brain,{x:GARDEN.exit.x+.58,z:GARDEN.exit.z,y:.25});
  updateGarden(s,1/60);assert.equal(s.garden.phase,'draining');
  const positions=s.fluid.particles.map(p=>[p.x,p.y,p.z]);
  run(s,180,{x:1,contract:true});assert.equal(s.garden.phase,'complete');
  assert.deepEqual(s.fluid.particles.map(p=>[p.x,p.y,p.z]),positions,'exit animation must not fight active physics');
});
