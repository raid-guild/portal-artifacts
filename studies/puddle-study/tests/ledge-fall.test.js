import test from 'node:test';
import assert from 'node:assert/strict';
import {ParticleFluid} from '../src/particle-fluid.js';
import {GARDEN,GRIP_GARDEN,gardenColliders} from '../src/garden-level.js';

const DT=1/60;
const input=(extra={})=>({x:0,z:0,puddle:true,growth:true,...extra});
const run=(fluid,frames,controls,colliders=[])=>{
  for(let i=0;i<frames;i++)fluid.step(DT,typeof controls==='function'?controls(i):controls,colliders);
};
const raised=(count,size,height,x=0,z=0)=>{
  const fluid=new ParticleFluid({x,z,size,seedCount:count,massReferenceCount:297});
  for(const p of fluid.particles){p.y+=height;p.py=p.y;}
  return fluid;
};
const p90=fluid=>{
  const heights=fluid.particles.map(p=>p.y).sort((a,b)=>a-b);
  return heights[Math.floor(heights.length*.9)];
};
const bodyHeights=fluid=>{
  const heights=fluid.particles.filter((p,i)=>!p.feedstock&&i!==fluid.brainIndex&&
    !fluid.coatIndices.includes(i)).map(p=>p.y).sort((a,b)=>a-b);
  return {median:heights[Math.floor(heights.length*.5)],upper:heights[Math.floor(heights.length*.75)]};
};
const intact=(fluid,count,colliders=[])=>{
  assert.equal(fluid.particles.length,count);
  assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  assert.ok(fluid.attachedCount>=count-10,`connected ${fluid.attachedCount}/${count-1}`);
  assert.ok(fluid.coatContacts(colliders).length>=8);
};

test('unsupported seed and full bodies fall from both terrace heights at both sizes',()=>{
  for(const size of [1,1.4])for(const count of [65,297])for(const height of [1.08,2.16]){
    const fluid=raised(count,size,height),start=fluid.brain.y,bodyStart=bodyHeights(fluid);
    run(fluid,12,input());
    const body=bodyHeights(fluid);
    assert.equal(fluid.brainAirborne,true);
    assert.ok(fluid.brain.vy<-.5,`${size}/${count}/${height}: accepted downward velocity`);
    assert.ok(fluid.brain.y<start-.04,`${size}/${count}/${height}: real descent`);
    assert.ok(body.median<bodyStart.median-.12&&body.upper<bodyStart.upper-.1,
      `${size}/${count}/${height}: non-coat body descended ${JSON.stringify({bodyStart,body})}`);
    assert.ok(Math.abs(fluid.brain.y-body.median)<.12*size,
      `${size}/${count}/${height}: brain stayed with body ${fluid.brain.y}/${body.median}`);
    run(fluid,108,input());
    assert.ok(fluid.brain.y<.5*size,`${size}/${count}/${height}: landed brain ${fluid.brain.y}`);
    intact(fluid,count);
  }
});

test('normal and Run movement can carry real flesh across an exposed ledge, then release to fall',()=>{
  const colliders=gardenColliders(GARDEN);
  for(const push of [false,true])for(const count of [65,297]){
    // Use an exposed stretch of this ledge. Level 1's two pillar rows now
    // occupy x=3 and x=4.035, where a falling body can land on a post top.
    const fluid=raised(count,1,1.62,1.7,-2.1);
    let airborne=false,downward=false;
    run(fluid,220,i=>{
      if(fluid.brainAirborne)airborne=true;
      if(fluid.brain.vy<-.8)downward=true;
      return input({z:i<85?1:0,push});
    },colliders);
    assert.ok(fluid.brain.z>GARDEN.terrain.frontZ,`crossed edge: ${fluid.brain.z}`);
    assert.ok(airborne&&downward,'controller accepted a gravity-driven fall');
    assert.ok(fluid.brain.y<.5,`landed after movement release: ${fluid.brain.y}`);
    intact(fluid,count,colliders);
  }
});

test('holding contract in air does not lift a floating mound; landing restores mound and release flattens it',()=>{
  const fluid=raised(297,1,2.16),start=fluid.brain.y;
  run(fluid,30,input({contract:true}));
  assert.equal(fluid.brainAirborne,true);
  assert.ok(fluid.brain.y<start-.25);
  assert.ok(fluid.brain.vy<-.5);
  run(fluid,150,input({contract:true}));
  const mound=p90(fluid);
  assert.ok(fluid.brain.y<1.1&&mound>.7,`grounded mound ${fluid.brain.y}/${mound}`);
  intact(fluid,297);
  run(fluid,150,input());
  assert.ok(p90(fluid)<mound-.2,'released mound spreads under gravity');
  intact(fluid,297);
});

test('Grip Garden slippery terrace still sends the body over its 1.08-unit edge',()=>{
  const colliders=gardenColliders(GRIP_GARDEN),fluid=raised(65,1,1.08,4.2,1.1);
  let onSlip=false,airborne=false;
  run(fluid,210,i=>{
    if(fluid.brainSlipping)onSlip=true;
    if(fluid.brainAirborne)airborne=true;
    return input({z:i<75?1:0});
  },colliders);
  assert.ok(onSlip&&airborne);
  assert.ok(fluid.brain.z>GRIP_GARDEN.terrain.rearZ);
  assert.ok(fluid.brain.y<.5);
  intact(fluid,65,colliders);
});

test('Grip Garden platform top hands support to the lower terrace after its actual edge',()=>{
  const colliders=gardenColliders(GRIP_GARDEN);
  const platform=GRIP_GARDEN.grip.platform;
  const fluid=raised(65,1,platform.maxY,.55,-.05);
  run(fluid,30,input(),colliders);
  assert.equal(fluid.brainAirborne,false,'the real platform top supports the resting brain');
  assert.ok(fluid.brain.y>platform.maxY+.15);
  let airborne=false,falling=false;
  run(fluid,190,i=>{
    if(fluid.brainAirborne)airborne=true;
    if(fluid.brain.vy<-1)falling=true;
    return input({x:i<85?1:0});
  },colliders);
  assert.ok(fluid.brain.x>platform.maxX+.2,'crossed the platform edge');
  assert.ok(airborne&&falling,'support handed off to a gravity-driven fall');
  assert.ok(fluid.brain.y<platform.maxY-.5,`landed on the lower terrace: ${fluid.brain.y}`);
  intact(fluid,65,colliders);
});
