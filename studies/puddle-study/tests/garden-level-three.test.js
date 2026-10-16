import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation} from '../src/simulation.js';
import {GARDEN_LEVELS,PASSAGE_GARDEN,arrivalPosition,gardenColliders,gardenWorldOffset,gardenFixtureHeight,gardenHint} from '../src/garden-level.js';
import {groundAt,resolveParticle,segmentBlockedBySolid,pointInsideSolid} from '../src/colliders.js';
import {createEditorStageView} from '../src/editor-stage-view.js';
import {closeTablet} from '../src/memory-tablets.js';
import {ParticleFluid} from '../src/particle-fluid.js';

const tick=(s,input={})=>{s.step(input);if(s.garden?.phase==='reading'){closeTablet(s);s.step({});}};
const run=(s,n,input={})=>{for(let i=0;i<n;i++)tick(s,input);};
const third=()=>{const s=new PuddleSimulation();s.startGarden(3);run(s,100);return s;};
function go(s,x,z){for(let i=0;i<1100;i++){
  if(s.garden.phase!=='playing')return;
  const dx=x-s.brain.x,dz=z-s.brain.z,d=Math.hypot(dx,dz);
  if(d<.11){run(s,30);return;}
  tick(s,{x:dx/d,z:dz/d});
}assert.fail(`Could not reach ${x},${z}; brain at ${s.brain.x},${s.brain.z}`);}
function gem(s){run(s,220,{contract:true});run(s,60);}

test('three authored levels validate IDs and preserve independent results through both descents',()=>{
  const s=new PuddleSimulation();assert.equal(GARDEN_LEVELS.length,7);
  assert.equal(s.startGarden(0),false);assert.equal(s.startGarden(GARDEN_LEVELS.length+1),false);assert.equal(s.startGarden(1.5),false);
  s.startGarden(1);s.garden.phase='complete';s.garden.goldCount=11;s.garden.gemCount=2;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,2);assert.equal(s.descending,true);
  s.garden.phase='complete';s.garden.goldCount=13;s.garden.gemCount=1;
  assert.equal(s.continueGarden(),true);assert.equal(s.gardenLevelId,3);assert.equal(s.descending,true);
  assert.deepEqual(s.completedLevels[1],{gems:2,gold:11,totalGold:17,totalGems:3});
  assert.deepEqual(s.completedLevels[2],{gems:1,gold:13,totalGold:17,totalGems:3});
  assert.equal(s.fluid.particles.length,297);assert.equal(s.fluid.particles.filter(p=>!p.feedstock).length,65);
  const shown=arrivalPosition(s.brain,s.fluid.brainIndex,0,PASSAGE_GARDEN,s.fluid.coatIndices);
  assert.ok(shown.y>s.brain.y+2);assert.ok(Math.abs(shown.z-PASSAGE_GARDEN.start.z)<.1);
  const before={x:s.brain.x,y:s.brain.y,z:s.brain.z};run(s,20,{x:-1,z:1,shed:true,contract:true});
  assert.deepEqual({x:s.brain.x,y:s.brain.y,z:s.brain.z},before);assert.equal(s.pressure.shed,0);
  run(s,80,{x:-1,z:1,shed:true,contract:true});assert.equal(s.pressure.shed,0);
  s.restartGarden();assert.equal(s.gardenLevelId,3);assert.deepEqual(Object.keys(s.completedLevels),['1','2']);
  s.startGarden(1,{newGame:true});assert.deepEqual(s.completedLevels,{});
});

test('The Silt Loom has thirteen paired banks with tight staggered slots on three heights',()=>{
  const level=PASSAGE_GARDEN,c=gardenColliders(level),t=level.terrain;
  assert.equal(groundAt(level.start.x,level.start.z,c).height,2.16);
  assert.equal(groundAt(level.basin.x,level.basin.z,c).height,1.08-level.basin.depth);
  assert.equal(groundAt(level.exit.x,level.exit.z,c).height,-level.exit.depth);
  assert.equal(groundAt(-4,.45,c).height,1.08);assert.equal(groundAt(0,3.55,c).height,0);
  for(const [split,low] of [[t.frontZ,t.middleHeight],[t.rearZ,0]]){
    const p={x:0,z:split+.08,pz:split-.08,y:low+.08,px:0,py:low+.08,vx:0,vy:0,vz:0};
    resolveParticle(p,.067,[t]);assert.ok(p.z>=split+.066);assert.ok(p.y<low+.3);
  }
  const g=level.gate;
  assert.equal(segmentBlockedBySolid({x:g.x-.6,y:g.base+.2,z:.45},{x:g.x+.6,y:g.base+.2,z:.45},c),true);
  const r=level.passage;
  assert.equal(segmentBlockedBySolid({x:r.maxX+.5,y:.65,z:3.55},{x:r.minX-.5,y:.65,z:3.55},c),true);
  assert.equal(segmentBlockedBySolid({x:r.maxX+.5,y:.16,z:3.55},{x:r.minX-.5,y:.16,z:3.55},c),false);
  assert.equal(level.editorFixtures.length,26);
  for(const fixture of level.editorFixtures){assert.equal(fixture.type,'box');assert.equal(fixture.walkableTop,true);
    assert.ok(fixture.sourceId.startsWith('loom-'));}
  const banks=[
    [4.2,-2.6,-6,-1.3,2.16,3.2,1.1],[3,-3.1,-6,-1.3,2.16,3.2,1.1],[1.8,-2.6,-6,-1.3,2.16,3.2,1.1],
    [-4.3,-3.35,-6,-1.3,2.16,3.2,1],[-5.5,-2.85,-6,-1.3,2.16,3.2,1],
    [-5.5,.4,-1.3,2,1.08,2.2,1],[-4.3,.9,-1.3,2,1.08,2.2,1],[5.7,1.1,-1.3,2,1.08,2.2,1],
    [4.2,3.7,2,4.8,0,1.15,1],[3,3.2,2,4.8,0,1.15,1],[1.8,3.7,2,4.8,0,1.15,1],
    [-2.2,3.05,2,4.8,0,1.15,1],[-3.4,3.55,2,4.8,0,1.15,1],
  ];
  for(const [x,slot,minZ,maxZ,base,top,width] of banks){
    const pair=level.editorFixtures.filter(f=>f.minX===x-.18&&f.maxX===x+.18&&f.minY===base);
    assert.equal(pair.length,2,`paired ribs at ${x}, ${slot}`);
    assert.deepEqual(pair.map(f=>[f.minZ,f.maxZ]).sort((a,b)=>a[0]-b[0]),
      [[minZ,slot-width/2],[slot+width/2,maxZ]]);
    assert.ok(pair.every(f=>f.minY===base&&f.maxY===top));
    assert.equal(segmentBlockedBySolid({x:x-.5,y:base+.3,z:slot},{x:x+.5,y:base+.3,z:slot},c),false,
      `slot at ${x},${slot} remains physically clear`);
    assert.equal(segmentBlockedBySolid({x:x-.5,y:base+.3,z:(minZ+slot-width/2)/2},
      {x:x+.5,y:base+.3,z:(minZ+slot-width/2)/2},c),true,`rib at ${x},${slot} blocks the broad bypass`);
  }
  assert.equal(gardenFixtureHeight(level,4.2,-5),3.2);
  assert.equal(gardenFixtureHeight(level,4.2,-2.6),2.16);
  assert.equal(gardenFixtureHeight(level,-5.5,-1),2.2);
  assert.equal(gardenFixtureHeight(level,-5.5,.4),1.08);
  assert.equal(gardenFixtureHeight(level,4.2,2.3),1.15);
  assert.equal(gardenFixtureHeight(level,4.2,3.7),0);
});

test('The Silt Loom gives route-specific cues across its three terraces',()=>{
  const s=third();assert.equal(gardenHint(s)[0],'THE SILT LOOM');
  s.garden.moved=2;s.brain.x=2;s.brain.z=-2.35;
  assert.equal(gardenHint(s)[0],'WEAVE THROUGH THE RIBS');
  s.brain.x=-6.4;s.brain.z=.55;
  assert.equal(gardenHint(s)[0],'WEIGHT FOR THE SHUTTER');
  s.pressure.active=true;s.brain.x=5.5;s.brain.z=1.7;
  assert.equal(gardenHint(s)[0],'THE EASTERN TURN');
  s.brain.x=3;s.brain.z=3.4;
  assert.equal(gardenHint(s)[0],'THE LOWER FILTER');
});

test('ordinary green supply cannot substitute for a real shed deposit',()=>{
  const s=third(),basin=PASSAGE_GARDEN.basin;
  for(const p of s.fluid.particles.filter(p=>p.feedstock).slice(0,80)){
    p.x=basin.x;p.z=basin.z;p.y=groundAt(basin.x,basin.z,s.activeColliders()).height+s.fluid.radius+.01;
  }
  s.updatePressure(1/60);
  assert.equal(s.pressure.weight,0);assert.equal(s.pressure.opening,0);
});

test('The Silt Loom threads its ribs, deposits 64 particles, recovers flesh, and earns 100%',()=>{
  const s=third(),g=PASSAGE_GARDEN.gate;
  go(s,5.1,-3.2);go(s,5.1,-2.35);go(s,4.8,-2.6);go(s,3.6,-2.6);
  go(s,3.6,-3.1);go(s,2.4,-3.1);go(s,2.4,-2.6);go(s,1.2,-2.6);
  go(s,.7,-2.65);go(s,-1.6,-3.2);gem(s);
  go(s,-3.7,-3.35);go(s,-4.9,-3.35);go(s,-4.9,-2.85);go(s,-6.1,-2.85);
  go(s,-7.5,-2.35);go(s,-7.5,-.95);go(s,-7.5,-.25);go(s,-7.5,.45);
  assert.ok(s.brain.y<1.5&&s.brain.y>1,'the first stair turn reaches the basin tier');
  go(s,-6.4,.55);go(s,-6.1,.4);go(s,-5,.4);go(s,-5,.9);go(s,-3.7,.9);go(s,-3.2,.45);
  let shedSteps=0;while(s.pressure.weight<80&&shedSteps++<400)s.step({shed:true});
  run(s,60);
  assert.ok(s.pressure.weight>=g.threshold,`deposited ${s.pressure.weight} of ${g.threshold}`);
  assert.equal(s.pressure.opening,g.opening);
  go(s,-3.2,1.7);go(s,-1.1,1.7);go(s,.5,.45);go(s,2.5,.45);
  const attachedBeforeRecall=s.fluid.attachedCount,recoveredBefore=s.tendril.recovered;
  assert.equal(s.castTendril({x:-2.3,z:.45,y:1.2}),true,'cast back toward the actual deposited flesh');
  run(s,160);s.step({recallToggle:true});run(s,240);
  assert.ok(s.tendril.recovered>recoveredBefore,
    `cast recovered ${s.tendril.recovered-recoveredBefore} pieces from beyond the shutter`);
  assert.ok(s.fluid.attachedCount>attachedBeforeRecall,'some shed flesh rejoins the living body');
  assert.equal(s.fluid.particles.length,297,'recall neither creates nor destroys flesh');
  go(s,3.1,.45);go(s,4.3,.45);gem(s);go(s,5.1,1.1);go(s,6.5,1.1);go(s,7.5,1.2);
  go(s,7.5,2.7);go(s,7.5,3.85);
  go(s,5.2,3.85);assert.ok(s.fluid.attachedCount>100,'the body regathers after shedding');
  go(s,4.8,3.7);go(s,3.6,3.7);go(s,3.6,3.2);go(s,2.4,3.2);
  go(s,2.4,3.7);go(s,1.35,3.7);go(s,0,3.4);
  assert.ok(s.brain.y<PASSAGE_GARDEN.passage.bottom-.105,'the brain fits under the passage');
  go(s,-1.6,3.05);go(s,-2.8,3.05);go(s,-2.8,3.55);go(s,-4.3,3.55);gem(s);
  assert.equal(s.garden.gemCount,3);assert.equal(s.garden.goldCount,17);
  assert.ok(s.garden.tablets.every(t=>t.read),'all five memories lie on the intended path');
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.equal(s.fluid.particles.length,297);
  assert.ok(s.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
  assert.ok(s.fluid.coatContacts(s.activeColliders()).length>=8);
});

test('Level 3 view has all twenty-six solid ribs, gate, low filter, and five memory stones',()=>{
  const view=createEditorStageView(new THREE.Scene(),PASSAGE_GARDEN);
  try{
    view.group.position.y=gardenWorldOffset(3);
    assert.equal(view.group.position.y,-14.4);
    const meshes=[];view.group.traverse(o=>{if(o.isMesh)meshes.push(o);});
    for(const fixture of PASSAGE_GARDEN.editorFixtures)
      assert.ok(meshes.some(o=>o.userData.editorId===fixture.sourceId),fixture.sourceId);
    assert.ok(meshes.filter(o=>o.userData.editorId?.startsWith('loom-')).length>=26);
    assert.ok(meshes.every(o=>Number.isFinite(o.position.x+o.position.y+o.position.z)));
  }finally{view.dispose();}
});

test('small and full-size real particle bodies cross the long passage both ways with their brain coating',()=>{
  const colliders=gardenColliders(PASSAGE_GARDEN,PASSAGE_GARDEN.gate.opening);
  for(const size of [.8,1.4])for(const direction of [-1,1]){
    const fluid=new ParticleFluid({x:direction<0?3:-3,z:3.55,size});
    const count=fluid.particles.length;
    let crossed=false;
    for(let i=0;i<450;i++){
      fluid.step(1/60,{x:direction,z:0,puddle:true,growth:true},colliders);
      if(direction*fluid.brain.x>2){crossed=true;break;}
    }
    assert.ok(crossed,`size ${size}, direction ${direction}: brain at ${fluid.brain.x}`);
    assert.equal(fluid.particles.length,count);
    assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
    assert.ok(fluid.coatContacts(colliders).length>=8);
  }
});

test('staggered upper slots move the whole 297-particle body both ways, including a large body',()=>{
  const colliders=gardenColliders(PASSAGE_GARDEN,PASSAGE_GARDEN.gate.opening);
  const forward=[[5.8,-2.6],[4.8,-2.6],[3.6,-2.6],[3.6,-3.1],[2.4,-3.1],
    [2.4,-2.6],[1.2,-2.6],[-1.6,-3.2]];
  for(const [size,reverse] of [[1,false],[1,true],[1.4,false]]){
    const path=reverse?[...forward].reverse():forward,fluid=new ParticleFluid({x:path[0][0],z:path[0][1],size});
    for(const p of fluid.particles){p.y+=2.16;p.py=p.y;}
    let steps=0;
    for(const [x,z] of path.slice(1)){
      let reached=false;
      for(let i=0;i<450;i++){
        const dx=x-fluid.brain.x,dz=z-fluid.brain.z,d=Math.hypot(dx,dz);
        if(d<.12){reached=true;break;}
        fluid.step(1/60,{x:dx/d,z:dz/d,puddle:true,growth:true},colliders);steps++;
      }
      assert.ok(reached,`size ${size}, reverse ${reverse}: core stalled before ${x},${z}`);
    }
    let transferred=0;
    for(let i=0;i<1000;i++){
      fluid.step(1/60,{x:0,z:0,puddle:true,growth:true},colliders);steps++;
      transferred=fluid.particles.filter(p=>reverse?p.x>4.38:p.x<1.62).length;
      if(transferred>=Math.ceil(fluid.particles.length*.95))break;
    }
    assert.ok(transferred>=Math.ceil(fluid.particles.length*.95),
      `size ${size}, reverse ${reverse}: only ${transferred}/${fluid.particles.length} crossed in ${steps} ticks`);
    assert.equal(fluid.particles.length,297);
    assert.ok(fluid.coatContacts(colliders).length>=8);
    assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)));
    assert.ok(fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,colliders,.03)),
      'flesh stays outside the actual ribs');
  }
});

test('lower paired ribs and covered filter pass the whole physical body toward the drain',()=>{
  const colliders=gardenColliders(PASSAGE_GARDEN,PASSAGE_GARDEN.gate.opening);
  const path=[[5.8,3.7],[4.8,3.7],[3.6,3.7],[3.6,3.2],[2.4,3.2],[2.4,3.7],
    [1.2,3.7],[0,3.4],[-1.6,3.05],[-2.8,3.05],[-2.8,3.55],[-4.3,3.55]];
  const fluid=new ParticleFluid({x:path[0][0],z:path[0][1],size:1});let throughRoof=false;
  for(const [x,z] of path.slice(1)){
    let reached=false;
    for(let i=0;i<450;i++){
      const dx=x-fluid.brain.x,dz=z-fluid.brain.z,d=Math.hypot(dx,dz);
      if(d<.12){reached=true;break;}
      fluid.step(1/60,{x:dx/d,z:dz/d,puddle:true,growth:true},colliders);
    }
    assert.ok(reached,`lower core stalled before ${x},${z}`);
    if(x===0)throughRoof=fluid.brain.y<PASSAGE_GARDEN.passage.bottom-.08;
  }
  let transferred=0;
  for(let i=0;i<1000;i++){
    fluid.step(1/60,{x:0,z:0,puddle:true,growth:true},colliders);
    transferred=fluid.particles.filter(p=>p.x< -3.58).length;
    if(transferred>=Math.ceil(fluid.particles.length*.95))break;
  }
  assert.ok(transferred>=Math.ceil(fluid.particles.length*.95),`${transferred}/297 reached the western court`);
  assert.ok(throughRoof,'the coated brain passed beneath the filter roof');
  assert.ok(fluid.coatContacts(colliders).length>=8);
  assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z)&&
    !pointInsideSolid(p.x,p.y,p.z,colliders,.03)));
});

test('an exposed ledge shortcut can finish The Silt Loom while missing pickups',()=>{
  const s=third();go(s,7.6,-.5);go(s,7.5,2.7);go(s,7.5,3.55);
  go(s,5.2,3.85);go(s,4.8,3.7);go(s,3.6,3.7);go(s,3.6,3.2);go(s,2.4,3.2);
  go(s,2.4,3.7);go(s,1.35,3.7);go(s,0,3.4);
  go(s,-1.6,3.05);go(s,-2.8,3.05);go(s,-2.8,3.55);go(s,-4.3,3.55);
  go(s,-7.6,3.65);run(s,180);
  assert.equal(s.garden.phase,'complete');assert.ok(s.garden.goldCount<17);assert.ok(s.garden.gemCount<3);
});
