import test from 'node:test';
import assert from 'node:assert/strict';
import {ParticleFluid} from '../src/particle-fluid.js';
import {PuddleSimulation,DT} from '../src/simulation.js';

const input={puddle:true,growth:true,x:0,z:0};

test('a grounded flick arcs the brain and carries most connected flesh, then lands',()=>{
  for(const count of [65,297]){
    const fluid=new ParticleFluid({seedCount:count,massReferenceCount:297});
    const startX=fluid.brain.x,startY=fluid.brain.y;
    assert.equal(fluid.launchFlick({x:1,z:0},1,[]),true);
    let peak=startY,airReject=false;
    for(let i=0;i<75;i++){
      fluid.step(DT,input,[]);peak=Math.max(peak,fluid.brain.y);
      if(i===6)airReject=!fluid.launchFlick({x:1,z:0},1,[]);
    }
    const carried=fluid.particles.filter(p=>!p.feedstock&&p.x>startX+1).length;
    assert.ok(airReject,'a second flick cannot jump in the air');
    assert.ok(peak>startY+.4,`upward arc ${peak-startY}`);
    assert.ok(fluid.brain.x>startX+2,`horizontal travel ${fluid.brain.x-startX}`);
    assert.ok(carried>count*.6,`carried ${carried}/${count}`);
    assert.ok(fluid.brain.y<.5,'the brain returned to the floor');
    assert.equal(fluid.flickFlight,null);
  }
});

test('a flick suspends a held contract anchor; wall-blocked and malformed launches do nothing',()=>{
  const fluid=new ParticleFluid();
  fluid.startContract();assert.ok(fluid.contractAnchor);
  assert.equal(fluid.launchFlick({x:1,z:0},1,[]),true);
  assert.equal(fluid.contractAnchor,null);
  fluid.step(DT,{...input,contract:false},[]);
  assert.equal(fluid.flickFlight!==null,true);
  assert.equal(fluid.launchFlick({x:Infinity,z:0},1,[]),false);
  const blocked=new ParticleFluid();
  const wall={type:'box',minX:-1.98,maxX:-1.7,minY:0,maxY:1,minZ:-.5,maxZ:.5};
  assert.equal(blocked.launchFlick({x:1,z:0},1,[wall]),false);
  assert.equal(blocked.flickFlight,null);
});

test('the simulation consumes only a valid fixed-step flick and clears it on restart',()=>{
  const sim=new PuddleSimulation();
  assert.equal(sim.queueFlick({x:1,z:0},1),true);
  assert.equal(sim.fluid.flickFlight,null);
  sim.step({},DT);
  assert.ok(sim.fluid.flickFlight);
  assert.equal(sim.pendingFlick,null);
  sim.queueFlick({x:1,z:0},1);sim.reset();
  assert.equal(sim.pendingFlick,null);assert.equal(sim.fluid.flickFlight,null);
  sim.startGarden(1);
  assert.equal(sim.queueFlick({x:1,z:0},1),false,'arrival cannot queue a hop');
});

test('holding Contract through a hop anchors again only after landing',()=>{
  const sim=new PuddleSimulation();
  sim.queueFlick({x:1,z:0},1);
  sim.step({contract:true},DT);
  assert.ok(sim.fluid.flickFlight);
  assert.equal(sim.fluid.contractAnchor,null,'flight cannot pull back to the old anchor');
  for(let i=0;i<85;i++)sim.step({contract:true},DT);
  assert.equal(sim.fluid.flickFlight,null);
  assert.ok(sim.fluid.contractAnchor,'a held Contract resumes once grounded');
});

test('a flight stops at a wall and under a low roof, and lands on a raised top',()=>{
  const wall={type:'box',minX:-1.62,maxX:-1.35,minY:0,maxY:1.8,minZ:-1,maxZ:1};
  const roof={type:'roof',minX:-1.8,maxX:.8,minZ:-1,maxZ:1,bottom:.55,top:.8};
  const platform={type:'box',walkableTop:true,minX:-.7,maxX:4,minY:0,maxY:.5,minZ:-1,maxZ:1};
  for(const [name,collider] of [['wall',wall],['roof',roof],['platform',platform]]){
    const fluid=new ParticleFluid();let peak=fluid.brain.y,maxX=fluid.brain.x;
    assert.equal(fluid.launchFlick({x:1,z:0},1,[collider]),true,name);
    for(let i=0;i<85;i++){
      fluid.step(DT,input,[collider]);peak=Math.max(peak,fluid.brain.y);maxX=Math.max(maxX,fluid.brain.x);
    }
    if(name==='wall')assert.ok(maxX<=wall.minX-fluid.radius+.03,`wall contact ${maxX}`);
    if(name==='roof')assert.ok(peak<=roof.bottom-fluid.radius+.03,`roof clearance ${peak}`);
    if(name==='platform'){
      assert.equal(fluid.flickFlight,null,'raised landing ends the launch');
      assert.ok(fluid.brain.x>platform.minX&&fluid.brain.x<platform.maxX);
      assert.ok(fluid.brain.y>=platform.maxY+fluid.radius-.03,`raised landing ${fluid.brain.y}`);
    }
  }
});
