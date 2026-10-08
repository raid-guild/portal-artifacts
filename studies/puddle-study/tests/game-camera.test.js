import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {GARDEN,WEIGHT_GARDEN,PASSAGE_GARDEN} from '../src/garden-level.js';
import {movementAxes} from '../src/movement.js';
import {FollowGardenCamera,cameraPointVisible,cameraShortcutAction,followFitDistance,gardenMovementBasis,
  sampleGardenCameraFrame} from '../src/game-camera.js';

function fixture({level=GARDEN,phase='playing'}={}){
  const brain={x:0,y:.3,z:0,vx:0,vy:0,vz:0,component:0};
  const connected={x:.8,y:.22,z:.3,vx:0,vy:0,vz:0,component:0};
  const other={x:-.7,y:.23,z:-.1,vx:0,vy:0,vz:0,component:0};
  const remote={x:40,y:.2,z:30,component:1};
  const supply={x:-50,y:.2,z:45,component:2,feedstock:true};
  const particles=[brain,connected,other,remote,supply];
  const fluid={particles,brain,brainIndex:0,coatIndices:[],size:1};
  return {fluid,tendril:{strands:[]},gardenLevel:level,gardenLevelId:level.id,
    garden:{phase,arrivalTime:0,drainTime:0},descending:false};
}

test('garden input has a fixed orthonormal basis under either camera choice',()=>{
  const {right,forward}=gardenMovementBasis();
  assert.ok(Math.abs(Math.hypot(right.x,right.z)-1)<1e-12);
  assert.ok(Math.abs(Math.hypot(forward.x,forward.z)-1)<1e-12);
  assert.ok(Math.abs(right.x*forward.x+right.z*forward.z)<1e-12);
  assert.deepEqual(movementAxes('garden',1,0,right,forward),right);
  assert.deepEqual(movementAxes('garden',0,1,right,forward),forward);
  assert.equal(cameraShortcutAction({code:'KeyC',repeat:false},'garden'),'toggle');
  assert.equal(cameraShortcutAction({code:'KeyC',repeat:true},'garden'),'ignore');
  assert.equal(cameraShortcutAction({code:'KeyC',target:{closest:()=>({})}},'garden'),null);
  assert.equal(cameraShortcutAction({code:'KeyC'},'pressure'),null);
  assert.equal(cameraPointVisible({x:0,y:0,z:.5}),true);
  assert.equal(cameraPointVisible({x:1.2,y:0,z:.5}),false);
  assert.equal(cameraPointVisible({x:0,y:0,z:1.2}),false);
});

test('framing follows connected owned flesh and includes strand cargo without green supply or remote fragments',()=>{
  const sim=fixture(),plain=sampleGardenCameraFrame(sim);
  assert.equal(plain.connectedCount,3);
  assert.ok(Math.abs(plain.target.x)<1&&Math.abs(plain.target.z)<1);
  assert.ok(plain.extent.horizontal<2,'remote fragments and green pools do not widen the camera');
  const cargo=sim.fluid.particles[4];cargo.x=5;cargo.z=0;
  sim.tendril.strands=[{active:true,members:new Set(),cargo:new Set([cargo])}];
  const stretched=sampleGardenCameraFrame(sim);
  assert.equal(stretched.connectedCount,3,'cargo does not bias the living centroid');
  assert.ok(stretched.extent.horizontal>5);
  assert.ok(followFitDistance(stretched.extent,1.6)>followFitDistance(plain.extent,1.6)+3);
});

test('portrait fit retains far-side cargo when connected mass and accepted velocity pull aim the other way',()=>{
  const sim=fixture(),{right}=gardenMovementBasis(),brain=sim.fluid.brain;
  brain.vx=right.x*4.8;brain.vz=right.z*4.8;
  const body=Array.from({length:100},()=>({x:right.x*4.8,y:.3,z:right.z*4.8,component:0}));
  const cargo={x:-right.x*4.8,y:.3,z:-right.z*4.8,component:2,feedstock:true};
  sim.fluid.particles=[brain,...body,cargo];
  sim.tendril.strands=[{active:true,members:new Set(),cargo:new Set([cargo])}];
  const sample=sampleGardenCameraFrame(sim),follow=new FollowGardenCamera();
  follow.reset(sim,390/844);
  assert.ok(sample.target.x*right.x+sample.target.z*right.z>2,'centroid and accepted velocity lead the aim');
  for(const p of [brain,body[0],cargo]){
    const projected=new THREE.Vector3(p.x,p.y,p.z).project(follow.camera);
    assert.ok(Math.abs(projected.x)<.85&&Math.abs(projected.y)<.85,
      `real body/cargo remains inside portrait frame: ${projected.x}, ${projected.y}`);
  }
});

test('40-degree perspective fits landscape and portrait bodies with portrait pullback',()=>{
  const extent={horizontal:3.2,vertical:.8};
  const wide=followFitDistance(extent,16/9),narrow=followFitDistance(extent,390/844);
  assert.ok(wide>=15&&narrow>wide);
  const sim=fixture(),follow=new FollowGardenCamera();
  follow.reset(sim,16/9);
  assert.equal(follow.camera.fov,40);
  assert.equal(follow.camera.near,.1);assert.equal(follow.camera.far,160);
  for(const aspect of [16/9,390/844]){
    follow.resize(aspect);follow.distance=followFitDistance(extent,aspect);follow.place();
    for(const x of [-extent.horizontal,extent.horizontal]){
      const projected=new THREE.Vector3(follow.target.x+x,follow.target.y,follow.target.z).project(follow.camera);
      assert.ok(Math.abs(projected.x)<.85,`horizontal body bound at aspect ${aspect}`);
    }
  }
});

test('camera damping is time-based; pause freezes state and reset clears history',()=>{
  const a=fixture(),b=fixture(),one=new FollowGardenCamera(),two=new FollowGardenCamera();
  one.reset(a,1.5);two.reset(b,1.5);
  for(const sim of [a,b])for(const p of sim.fluid.particles.slice(0,3))p.x+=5;
  one.update(a,1/30,1.5);two.update(b,1/60,1.5);two.update(b,1/60,1.5);
  assert.ok(Math.abs(one.target.x-two.target.x)<1e-10);
  assert.ok(Math.abs(one.distance-two.distance)<.1,'fit tracks target lag consistently across frame rates');
  a.garden.phase='paused';const frozen=one.target.clone(),distance=one.distance;
  a.fluid.brain.x+=10;one.update(a,1,1.5);
  assert.ok(one.target.distanceTo(frozen)<1e-12);assert.equal(one.distance,distance);
  a.garden.phase='playing';one.reset(a,1.5);
  assert.ok(one.target.x>frozen.x+4,'reset drops old follow history');
});

test('arrival and drain framing uses the rendered body plus storey offset and continues smoothly downward',()=>{
  const first=fixture(),follow=new FollowGardenCamera();follow.reset(first,1.5);
  const previous=follow.target.clone();
  const next=fixture({level:WEIGHT_GARDEN,phase:'arriving'});
  next.descending=true;
  for(const p of next.fluid.particles.slice(0,3)){p.x=WEIGHT_GARDEN.start.x;p.z=WEIGHT_GARDEN.start.z;p.y=2.4;}
  const incoming=sampleGardenCameraFrame(next);
  assert.ok(Math.abs(incoming.brain.y-(2.4+2.3-7.2))<1e-9);
  assert.equal(incoming.worldY,-7.2);
  follow.update(next,1/60,1.5);
  assert.ok(follow.target.distanceTo(previous)<2,'continue eases toward the next floor');
  next.garden.phase='draining';next.garden.drainTime=2.8;
  const exiting=sampleGardenCameraFrame(next);
  assert.ok(exiting.brain.y<2.4-7.2-2.7);
  assert.ok(followFitDistance(exiting.extent,1.5,'draining')>
    followFitDistance(exiting.extent,1.5,'playing'));
});

test('Level 2 drain prepares portrait framing for the opposite-side Level 3 arrival without snapping',()=>{
  const departing=fixture({level:WEIGHT_GARDEN,phase:'draining'}),follow=new FollowGardenCamera();
  departing.garden.drainTime=0;
  for(const p of departing.fluid.particles.slice(0,3)){
    p.x=WEIGHT_GARDEN.exit.x;p.z=WEIGHT_GARDEN.exit.z;p.y=.3;
  }
  follow.reset(departing,390/844);
  const initial=follow.target.clone();
  for(let frame=1;frame<=168;frame++){
    departing.garden.drainTime=frame/60;
    follow.update(departing,1/60,390/844);
  }
  assert.ok(follow.target.x>initial.x+5,'camera begins crossing during the real drain');
  const beforeContinue=follow.target.clone(),arriving=fixture({level:PASSAGE_GARDEN,phase:'arriving'});
  arriving.descending=true;
  for(const p of arriving.fluid.particles.slice(0,3)){
    p.x=PASSAGE_GARDEN.start.x;p.z=PASSAGE_GARDEN.start.z;p.y=2.4;
  }
  follow.update(arriving,1/60,390/844);
  assert.ok(follow.target.distanceTo(beforeContinue)<1,'camera position continues smoothly');
  for(let frame=0;frame<=30;frame++){
    arriving.garden.arrivalTime=frame/60;
    if(frame)follow.update(arriving,1/60,390/844);
    const shown=sampleGardenCameraFrame(arriving).brain;
    const projected=new THREE.Vector3(shown.x,shown.y,shown.z).project(follow.camera);
    assert.ok(Math.abs(projected.x)<.9&&Math.abs(projected.y)<.9,
      `pink stream stays inside portrait frame ${frame}: ${projected.x}, ${projected.y}`);
  }
});
