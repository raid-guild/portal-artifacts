import test from 'node:test';
import assert from 'node:assert/strict';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN,gemCoverage,gemSamples,updateGarden} from '../src/garden-level.js';
import {groundAt,resolveParticle} from '../src/colliders.js';
import {drainPosition} from '../src/garden-level.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {createGardenView} from '../src/garden-view.js';
import * as THREE from 'three';
const run=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const fresh=()=>{const s=new PuddleSimulation();s.selectTest('garden');s.garden.phase='playing';run(s,30);return s;};
function go(s,x,z){
  for(let i=0;i<1000;i++){
    if(s.garden.phase==='draining'||s.garden.phase==='complete')return;
    const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
    if(d<.08){run(s,45);return;}
    s.step({x:dx/d,z:dz/d});
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

test('the switchback route collects all three gems and 17 gold before descending',()=>{
  const s=fresh();
  go(s,4.8,-2.6);go(s,2.5,-2.6);go(s,0,-2.6);
  assert.ok(s.fluid.attachedCount>=175);assert.equal(s.garden.gemCount,0,'walking flat must not collect the first gem');
  run(s,220,{contract:true});assert.equal(s.garden.gemCount,1);
  run(s,90);go(s,-6,-2.6);go(s,-7.5,-2.6);
  go(s,-7.5,.3);go(s,-7.5,1.4);go(s,-7.5,2.2);
  assert.ok(s.brain.y<.5,'the body descends the left stair corridor');
  go(s,-5.5,2.2);go(s,-3,2.2);run(s,220,{contract:true});
  assert.equal(s.garden.gemCount,2);run(s,80);
  go(s,-1.5,2.2);go(s,1.1,2.2);assert.equal(s.garden.under,true);
  go(s,2.2,2.6175);go(s,3.5,2.6175);go(s,4.5,2.6175);
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8,'living brain crosses both post columns');
  go(s,5.15,2.2);
  for(let attempt=0;attempt<3&&!s.garden.gems[2].collected;attempt++){
    go(s,6.35,2.2);run(s,160,{contract:true});run(s,30);
  }
  assert.equal(s.garden.gemCount,3,`third gem coverage ${s.garden.gems[2].coverage}; attached ${s.fluid.attachedCount}; brain ${s.brain.x},${s.brain.z}`);run(s,80);
  go(s,7.1,2.2);
  assert.equal(s.garden.goldCount,s.garden.gold.length);
  go(s,7.6,2.8);run(s,220);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
});

test('the exposed upper edge offers an early drop that skips optional collection',()=>{
  const s=fresh();go(s,2.2,-.2);
  for(let i=0;i<180&&s.brain.y>=.5;i++)s.step({});
  assert.ok(s.brain.y<.5);
  go(s,2.2,2.6175);go(s,4.5,2.6175);
  assert.ok(s.brain.x>4.4,'the physical brain crosses both post columns');
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8,'the brain keeps real flesh through the gaps');
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  go(s,7.6,2.8);run(s,220);
  assert.equal(s.garden.phase,'complete');
  assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});

test('two transverse post columns leave aligned gaps across the lower lane without blocking fixtures',()=>{
  const posts=GARDEN.posts,r=.42,b=GARDEN.boundary,roof=GARDEN.roof;
  assert.equal(posts.length,10);
  assert.deepEqual([...new Set(posts.map(p=>p.x))],[3,4.035]);
  const circleTouchesRect=(p,box)=>{
    const dx=Math.max(box.minX-p.x,0,p.x-box.maxX),dz=Math.max(box.minZ-p.z,0,p.z-box.maxZ);
    return dx*dx+dz*dz<p.radius*p.radius;
  };
  const supports=[roof.minZ-.14,roof.maxZ+.14].map(z=>({minX:0,maxX:.75,minZ:z-.14,maxZ:z+.14}));
  for(const colX of [3,4.035]){
    const col=posts.filter(p=>p.x===colX).sort((a,b)=>a.z-b.z);
    assert.equal(col.length,5);
    assert.ok(Math.abs(col[0].z-r-GARDEN.terrain.frontZ-.21)<1e-8);
    assert.ok(Math.abs(b.maxZ-(col.at(-1).z+r)-.21)<1e-8);
    for(let i=1;i<col.length;i++)assert.ok(Math.abs(col[i].z-col[i-1].z-2*r-.195)<1e-8);
  }
  assert.ok(Math.abs(4.035-3-2*r-.195)<1e-8);
  for(const p of posts){
    assert.ok(![roof,...supports].some(box=>circleTouchesRect(p,box)));
    assert.equal(p.height,.65);
    assert.equal(groundAt(p.x,p.z,[GARDEN.terrain]).height,0);
  }
  for(const [points,radius] of [[GARDEN.gold.map(([x,z])=>({x,z})),.13],[GARDEN.gems,.31],
    [GARDEN.pools.map(([x,z])=>({x,z})),.35]])for(const item of points)
    assert.ok(posts.every(p=>Math.hypot(item.x-p.x,item.z-p.z)>p.radius+radius),`fixture at ${item.x},${item.z} stays outside pillars`);
  assert.ok(posts.every(p=>p.x>roof.maxX),'both columns are beyond the low roof');
});

test('terrace heights and funnel floor match the playable descent',()=>{
  const s=fresh(),c=s.activeColliders();
  assert.equal(groundAt(7,-2.6,c).height,2.16);
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

test('rendered lower lane stays level beneath its pickups',()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:()=>({style:{}}),querySelector:()=>({append(){}})};
  try{
    const {group}=createGardenView(new THREE.Scene());
    const floor=group.children.filter(o=>o.userData.gardenFloor==='lower');
    const upper=group.children.filter(o=>o.userData.gardenFloor==='upper');
    const start=group.children.filter(o=>o.userData.gardenFloor==='start');
    assert.ok(floor.length>=3);assert.equal(upper.length,3);assert.ok(start.length>=4);
    assert.ok(floor.every(o=>{const p=o.geometry.attributes.position;return Array.from({length:p.count},(_,i)=>p.getY(i)).every(y=>Math.abs(y)<1e-8);}));
    assert.ok(upper.every(o=>Array.from({length:o.geometry.attributes.position.count},(_,i)=>o.geometry.attributes.position.getY(i)).every(y=>Math.abs(y-1.62)<1e-6)));
    assert.ok(start.every(o=>Array.from({length:o.geometry.attributes.position.count},(_,i)=>o.geometry.attributes.position.getY(i)).every(y=>y>=1.62-1e-6&&y<=2.16+1e-6)));
  }finally{globalThis.document=previous;}
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
