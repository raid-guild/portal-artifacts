import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PuddleSimulation,GROWTH,PUDDLE_FIELD} from '../src/simulation.js';
import {ParticleFluid} from '../src/particle-fluid.js';
import {GAP,TERRACE_BOUNDARY,segmentBlockedBySolid,pointInsideSolid} from '../src/colliders.js';
import {createParticleSurface} from '../src/particle-surface.js';
import {movementAxes} from '../src/movement.js';
const run=(sim,frames,input={})=>{for(let i=0;i<frames;i++)sim.step(input);};
const finite=sim=>{
  assert.equal(sim.fluid.particles.length,sim.fluid.initialCount);
  assert.ok(sim.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  assert.ok(sim.fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,sim.activeColliders(),.003)));
};

const shape=sim=>{
  const p=sim.fluid.particles,b=sim.brain;
  const y=p.map(q=>q.y).sort((a,b)=>a-b);
  const radius=p.map(q=>Math.hypot(q.x-b.x,q.z-b.z)).sort((a,b)=>a-b);
  return {height:y[Math.floor(.9*p.length)],spread:radius[Math.floor(.9*p.length)]};
};

test('screen up and down agree for keyboard and touch in the low gap view',()=>{
  // Both input methods contribute to the same vertical axis in main.js.
  const right={x:1,z:0},forward={x:0,z:-1};
  assert.deepEqual(movementAxes('gap',0,1,right,forward),{x:0,z:-1});
  assert.deepEqual(movementAxes('gap',0,-1,right,forward),{x:0,z:1});
  assert.deepEqual(movementAxes('gap',1,0,right,forward),{x:1,z:-0});
  assert.deepEqual(movementAxes('field',0,1,right,forward),{x:0,z:-1});
});

test('grown flesh joins the contract mound, remains grounded, and relaxes',()=>{
  for(const [mode,travel] of [['field',520],['field',960],['growth',840]]){
    const sim=new PuddleSimulation();sim.selectTest(mode);
    run(sim,travel,{x:1});
    const fluid=sim.fluid,coat=new Set(fluid.coatIndices),colliders=sim.activeColliders();
    const body=()=>fluid.particles.filter((p,i)=>i!==fluid.brainIndex&&!coat.has(i)&&
      !p.feedstock&&p.component===sim.brain.component);
    const dimensions=()=>{
      const owned=body(),ys=owned.map(p=>p.y).sort((a,b)=>a-b);
      const radii=owned.map(p=>Math.hypot(p.x-sim.brain.x,p.z-sim.brain.z)).sort((a,b)=>a-b);
      return {count:owned.length,height:ys[Math.floor(ys.length*.5)],
        footprint:radii[Math.floor(radii.length*.9)]};
    };
    const flat=dimensions(),startAttached=fluid.attachedCount;
    assert.ok(flat.count>=35,`${mode}/${travel}: has acquired flesh beyond the coat`);
    let minAttached=startAttached,minGround=Infinity,minCoat=Infinity,anchor;
    for(let frame=0;frame<300;frame++){
      sim.step({contract:true});
      anchor??={...fluid.contractAnchor};
      minAttached=Math.min(minAttached,fluid.attachedCount);
      minGround=Math.min(minGround,body().filter(p=>p.y<=fluid.radius+.045).length);
      minCoat=Math.min(minCoat,fluid.coatContacts(colliders).length);
    }
    const mound=dimensions();
    assert.ok(minAttached>=startAttached-2,`${mode}/${travel}: grown body stays brain-connected`);
    assert.ok(mound.height>flat.height+.15,`${mode}/${travel}: acquired flesh rises into mound`);
    assert.ok(mound.footprint<flat.footprint*.65,`${mode}/${travel}: acquired flesh gathers`);
    assert.ok(minGround>=8,`${mode}/${travel}: real flesh supports mound on floor`);
    assert.ok(minCoat>=8,`${mode}/${travel}: core retains its real coating`);
    assert.deepEqual(fluid.contractAnchor,anchor,`${mode}/${travel}: unsteered hold stays put`);
    run(sim,180);
    assert.ok(dimensions().height<mound.height-.15,`${mode}/${travel}: body falls flat on release`);
    assert.ok(fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
    assert.ok(fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,colliders,.003)));
  }
});

test('a grown mound follows accepted steering and stops when steering stops',()=>{
  const sim=new PuddleSimulation();sim.selectTest('field');run(sim,520,{x:1});
  sim.step({contract:true});
  const start={...sim.fluid.contractAnchor},attached=sim.fluid.attachedCount;
  run(sim,90,{contract:true,x:1});
  const moved={...sim.fluid.contractAnchor};
  assert.ok(moved.x>start.x+.2,'player steering translates the contracted center');
  assert.ok(sim.fluid.attachedCount>=attached-2,'gathered material follows the brain');
  run(sim,120,{contract:true});
  assert.deepEqual(sim.fluid.contractAnchor,moved,'no steering produces no horizontal drift');
  assert.ok(sim.fluid.coatContacts(sim.activeColliders()).length>=8);
});

test('puddle field starts with twelve separate small pools and no idle absorption',()=>{
  const sim=new PuddleSimulation();sim.selectTest('field');
  assert.equal(sim.fluid.initialCount,PUDDLE_FIELD.seedCount);
  assert.equal(sim.fluid.particles.length,PUDDLE_FIELD.capacity);
  assert.equal(sim.field.loose,280);
  assert.equal(new Set(sim.fluid.particles.filter(p=>p.feedstock).map(p=>p.patchId)).size,12);
  const power=sim.fluid.brainPower;
  run(sim,180,{contract:true});
  assert.equal(sim.field.loose,280);
  assert.equal(sim.fluid.attachedCount,16);
  assert.equal(sim.fluid.brainPower,power);
  assert.ok(sim.fluid.coatContacts(sim.activeColliders()).length>=8);
  assert.ok(sim.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  assert.ok(sim.fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,sim.activeColliders(),.003)));
});

test('visiting separate field pools transfers flesh by contact and reset restores them',()=>{
  const sim=new PuddleSimulation();sim.selectTest('field');
  const initialPower=sim.fluid.brainPower;
  run(sim,520,{x:1});
  const first=sim.fluid.attachedCount;
  assert.ok(first>35&&first<110,`first pool contributes some flesh: ${first}`);
  assert.ok(sim.brain.x>-3&&sim.brain.x<0,'the player has physically crossed the first pool');
  run(sim,440,{x:1});
  assert.ok(sim.fluid.attachedCount>first+18,'subsequent pools also contribute');
  assert.ok(sim.brain.x>4,'the brain travels through the center lane');
  assert.ok(sim.field.loose>100,'unvisited rows remain loose');
  const centerLane=sim.fluid.attachedCount;
  run(sim,300,{z:-1});
  assert.ok(sim.fluid.attachedCount>centerLane+18,'turning into an outer row collects more pools');
  assert.ok(sim.fluid.brainPower>initialPower);
  assert.equal(sim.fluid.particles.length,PUDDLE_FIELD.capacity);
  assert.ok(sim.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  assert.ok(sim.fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,sim.activeColliders(),.003)));
  sim.reset();
  assert.equal(sim.field.loose,280);
  assert.equal(sim.fluid.attachedCount,16);
  assert.equal(sim.fluid.particles.filter(p=>p.feedstock).length,280);
  sim.selectTest('growth');
  assert.equal(sim.fluid.particles.length,GROWTH.seedCount,'drip stays a distinct mode');
});

test('each field pool produces its own finite Marching Cubes surface',()=>{
  const sim=new PuddleSimulation();sim.selectTest('field');
  for(let patchId=0;patchId<PUDDLE_FIELD.patches.length;patchId++){
    const surface=createParticleSurface(new THREE.MeshBasicMaterial(),28);
    surface.update(sim.fluid.particles.filter(p=>p.feedstock&&p.patchId===patchId),sim.activeColliders(),sim.fluid.radius);
    assert.ok(surface.mesh.geometry.drawRange.count>0,`pool ${patchId} renders`);
    assert.ok(Number.isFinite(surface.mesh.position.x+surface.mesh.position.y+surface.mesh.position.z));
    surface.mesh.geometry.dispose();surface.mesh.material.dispose();
  }
});

test('growth starts with real minimum flesh and the distant drip cannot power the brain',()=>{
  const sim=new PuddleSimulation();
  assert.equal(sim.selectedTest,'puddle','existing simulation callers keep their default');
  sim.selectTest('growth');
  assert.equal(sim.fluid.particles.length,GROWTH.seedCount);
  sim.emitGrowth(0);
  assert.equal(sim.growth.emitted,0);
  assert.equal(sim.fluid.coatContacts(sim.activeColliders()).length,16);
  assert.equal(sim.fluid.massReferenceCount,GROWTH.capacity);
  const initialPower=sim.fluid.brainPower;
  run(sim,240,{contract:true});
  assert.ok(sim.growth.emitted>20);
  assert.equal(sim.fluid.attachedCount,GROWTH.seedCount-1);
  assert.equal(sim.fluid.brainPower,initialPower);
  assert.ok(sim.fluid.particles.filter(p=>p.feedstock).every(p=>p.x>1.5));
  assert.ok(Math.abs(sim.brain.x-GROWTH.startX)<.15);
  assert.ok(sim.fluid.coatContacts(sim.activeColliders()).length>=8);
  const stray=sim.fluid.particles.find(p=>p!==sim.brain);
  stray.x=1.9;stray.px=stray.x;stray.z=0;stray.pz=0;
  const drop=sim.fluid.addParticle({x:2.05,y:stray.y,z:0},{feedstock:true});
  sim.fluid.step(1/60,{puddle:true,growth:true},sim.activeColliders());
  assert.equal(drop.feedstock,true,'a newly detached piece cannot collect supply for the brain');
});

test('the moving seed absorbs nearby real drops, grows stronger, and respects capacity/reset',()=>{
  const sim=new PuddleSimulation();sim.selectTest('growth');
  const weak=sim.fluid.brainPower;
  run(sim,840,{x:1});
  assert.ok(sim.growth.complete,'walking toward the drip without Shift reaches the growth goal');
  assert.ok(sim.fluid.attachedCount>=GROWTH.goal);
  assert.ok(sim.fluid.brainPower>weak*3);
  assert.ok(sim.fluid.particles.some(p=>p.feedstock));
  assert.ok(sim.fluid.particles.every(p=>Number.isFinite(p.x+p.y+p.z+p.vx+p.vy+p.vz)));
  assert.ok(sim.fluid.coatContacts(sim.activeColliders()).length>=8);
  sim.emitGrowth(40);
  sim.emitGrowth(40);
  assert.equal(sim.growth.emitted,GROWTH.capacity-GROWTH.seedCount);
  assert.equal(sim.fluid.particles.length,GROWTH.capacity);
  sim.reset();
  assert.equal(sim.fluid.particles.length,GROWTH.seedCount);
  assert.equal(sim.growth.emitted,0);
  assert.equal(sim.growth.complete,false);
});

test('default puddle has a stable physical brain, moves, reverses, and rests at each size',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});
    assert.equal(sim.selectedTest,'puddle');
    const brain=sim.brain,index=sim.fluid.brainIndex;
    assert.equal(brain,sim.fluid.particles[index]);
    run(sim,60,{x:1});const east=brain.x;
    run(sim,90,{x:-1});assert.ok(brain.x<east-.1*size);
    run(sim,90);assert.equal(sim.brain,brain);finite(sim);
  }
});

test('holding contracts real particles into a mound and release flattens it',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});run(sim,90);
    const rest=shape(sim);run(sim,240,{contract:true});const held=shape(sim);
    assert.ok(held.height>rest.height+.15*size,`size ${size}: mound rises`);
    assert.ok(held.spread<rest.spread*.75,`size ${size}: footprint shrinks`);
    run(sim,180);const released=shape(sim);
    assert.ok(released.height<held.height-.15*size,`size ${size}: mound falls`);
    assert.equal(sim.fluid.particles.length,sim.fluid.initialCount);finite(sim);
  }
});

test('hold recovers an isolated particle beyond edge reunion range',()=>{
  const make=()=>{const sim=new PuddleSimulation();const p=sim.fluid.particles[0];p.x+=3;p.px=p.x;sim.fluid.samplePairs();sim.fluid.updateComponents();return sim;};
  const held=make(),distance=sim=>Math.hypot(sim.fluid.particles[0].x-sim.brain.x,sim.fluid.particles[0].z-sim.brain.z);
  run(held,180,{contract:true});
  assert.ok(distance(held)<.7);
  finite(held);
});

test('held pull cannot drag a particle through a thin wall',()=>{
  const fluid=new ParticleFluid({x:-1,z:0}),p=fluid.particles[0];
  Object.assign(p,{x:1,px:1,y:fluid.radius+.008,py:fluid.radius+.008,vx:0,vy:0,vz:0});
  fluid.samplePairs();fluid.updateComponents();
  const wall={type:'box',minX:0,maxX:.025,minY:0,maxY:1.3,minZ:-2,maxZ:2};
  for(let i=0;i<240;i++)fluid.step(1/60,{contract:true},[wall]);
  assert.ok(p.x>wall.maxX+fluid.radius-.005);
});

test('controlled brain cannot step through a thin wall or post',()=>{
  for(const obstacle of [
    {type:'box',minX:0,maxX:.025,minY:0,maxY:1.3,minZ:-2,maxZ:2},
    {type:'cylinder',x:0,z:0,radius:.4,height:1.1}]){
    const fluid=new ParticleFluid({x:-1,z:0}),brain=fluid.brain;
    for(let i=0;i<180;i++){
      fluid.step(1/60,{puddle:true,x:1,z:0},[obstacle]);
      assert.ok(!pointInsideSolid(brain.x,brain.y,brain.z,[obstacle],.001));
      assert.ok(brain.x<0,'controlled brain remains on entry side');
    }
  }
});

test('real coating stays in contact through movement, turns, hold, and release',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size}),brain=sim.brain;
    for(const [frames,input] of [[55,{x:1}],[55,{x:1,push:true}],[40,{x:1,z:1}],
      [40,{x:-1,z:-1}],[120,{contract:true}],[90,{}]]){
      for(let frame=0;frame<frames;frame++){
        sim.step(input);
        const contacts=sim.fluid.coatContacts(sim.activeColliders());
        assert.ok(contacts.length>=8,`size ${size}, frame ${frame}: ${contacts.length} coat contacts`);
        assert.ok(contacts.every(i=>sim.fluid.particles[i]!==brain));
        assert.ok(sim.fluid.attachedCount>=8);
      }
    }
    finite(sim);
  }
});

test('brain power follows connected flesh mass and detached fragments return with weak field pull',()=>{
  const small=new ParticleFluid({x:0,size:.75}),medium=new ParticleFluid({x:0,size:1}),large=new ParticleFluid({x:0,size:1.3});
  assert.ok(small.attachedMass<medium.attachedMass&&medium.attachedMass<large.attachedMass);
  assert.ok(small.brainPower*small.field(1)<medium.brainPower*medium.field(1));
  assert.ok(medium.brainPower*medium.field(1)<large.brainPower*large.field(1));
  assert.ok(Number.isFinite(medium.field(0))&&medium.field(100)<medium.field(1));
  const detached=medium.particles.find((_,i)=>i!==medium.brainIndex&&!medium.coatIndices.includes(i));
  const original={x:detached.x,y:detached.y,z:detached.z};
  detached.x+=8;detached.px=detached.x;
  medium.samplePairs();medium.updateComponents();
  assert.equal(medium.attachedCount,medium.initialCount-2);
  assert.ok(medium.attachedMass<1&&medium.attachedMass>0);
  const disconnectedPower=medium.brainPower;
  const before=detached.x;
  for(let frame=0;frame<30;frame++)medium.step(1/60,{puddle:true},[]);
  assert.ok(detached.x<before);
  assert.ok(Number.isFinite(medium.brainPower));
  Object.assign(detached,{...original,px:original.x,py:original.y,pz:original.z,vx:0,vy:0,vz:0});
  medium.samplePairs();medium.updateComponents();
  assert.equal(medium.attachedCount,medium.initialCount-1);
  assert.ok(medium.brainPower>disconnectedPower,'reunion restores motor and attraction power');
  const coated=new ParticleFluid({x:0,size:1}),coat=new Set(coated.coatIndices);
  for(let i=0;i<coated.particles.length;i++)if(i!==coated.brainIndex&&!coat.has(i)){
    const p=coated.particles[i];p.x+=8;p.px=p.x;
  }
  coated.samplePairs();coated.updateComponents();
  assert.ok(coated.attachedCount>=8&&coated.attachedCount<40);
  assert.ok(coated.attachedMass<medium.attachedMass*.15);
  assert.ok(coated.brainPower<medium.brainPower*.4);
  const x=coated.brain.x;
  for(let frame=0;frame<15;frame++)coated.step(1/60,{puddle:true,x:1},[]);
  assert.ok(coated.brain.x-x<.2,'a coated brain with detached bulk moves weakly');
  const bare=new ParticleFluid({x:0});bare.brain.x+=10;bare.brain.px=bare.brain.x;
  bare.samplePairs();bare.updateComponents();
  assert.equal(bare.attachedMass,0);assert.equal(bare.brainPower,0);
  const bareX=bare.brain.x;bare.step(1/60,{puddle:true,x:1},[]);
  assert.equal(bare.brain.x,bareX,'a bare core has no artificial motor power');
});

test('controlled brain leads flesh in straight and diagonal motion, then turns before it',()=>{
  for(const size of [.75,1,1.3]){
    for(const direction of [{x:1,z:0},{x:0,z:-1},{x:1,z:1}]){
      const sim=new PuddleSimulation({size}),brain=sim.brain;
      const norm=Math.hypot(direction.x,direction.z),ux=direction.x/norm,uz=direction.z/norm;
      const flesh=()=>{const list=sim.fluid.particles.filter(p=>p!==brain);
        return list.reduce((n,p)=>n+p.x*ux+p.z*uz,0)/list.length;};
      run(sim,24,direction);
      assert.ok(brain.x*ux+brain.z*uz-flesh()>.15*size,`size ${size}: early lead`);
      run(sim,21,direction);
      const forward=sim.fluid.particles.filter(p=>p!==brain).map(p=>p.x*ux+p.z*uz).sort((a,b)=>a-b);
      assert.ok(brain.x*ux+brain.z*uz>forward[Math.floor(forward.length*.9)]-.22*size,
        `size ${size}: coated brain stays near the moving front`);
      run(sim,27,direction);
      assert.ok(brain.x*ux+brain.z*uz-flesh()>.18*size,`size ${size}: sustained lead`);
      const late=sim.fluid.particles.filter(p=>p!==brain).map(p=>p.x*ux+p.z*uz).sort((a,b)=>a-b);
      assert.ok(brain.x*ux+brain.z*uz>late[Math.floor(late.length*.9)]-.22*size,
        `size ${size}: sustained coated front`);
      const oldBrain=brain.x*ux+brain.z*uz,oldFlesh=flesh();
      run(sim,18,{x:-direction.x,z:-direction.z});
      assert.ok(brain.x*ux+brain.z*uz<oldBrain,`size ${size}: core turns first`);
      assert.ok(flesh()>oldFlesh-.08*size,`size ${size}: followers lag reversal`);
      finite(sim);
    }
  }
});

test('contract holds the coherent flesh center steady and keeps brain at the mound apex',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});run(sim,42,{x:1,z:.3});
    const remote=sim.fluid.particles[0];remote.x+=3*size;remote.px=remote.x;
    sim.fluid.samplePairs();sim.fluid.updateComponents();
    const main=sim.fluid.components[0].filter(i=>i!==sim.fluid.brainIndex);
    const expected={x:main.reduce((v,i)=>v+sim.fluid.particles[i].x,0)/main.length,
      z:main.reduce((v,i)=>v+sim.fluid.particles[i].z,0)/main.length};
    let maxCoreStep=0,last={x:sim.brain.x,y:sim.brain.y,z:sim.brain.z};
    for(let frame=0;frame<300;frame++){
      sim.step({contract:true});
      maxCoreStep=Math.max(maxCoreStep,Math.hypot(sim.brain.x-last.x,sim.brain.y-last.y,sim.brain.z-last.z));
      last={x:sim.brain.x,y:sim.brain.y,z:sim.brain.z};
    }
    const anchor=sim.fluid.contractAnchor,brain=sim.brain;
    assert.ok(Math.hypot(anchor.x-expected.x,anchor.z-expected.z)<.01*size);
    assert.ok(Math.hypot(brain.x-anchor.x,brain.z-anchor.z)<.05*size);
    const flesh=sim.fluid.particles.filter(p=>p!==brain&&p!==remote);
    const center={x:flesh.reduce((n,p)=>n+p.x,0)/flesh.length,z:flesh.reduce((n,p)=>n+p.z,0)/flesh.length};
    assert.ok(Math.hypot(center.x-anchor.x,center.z-anchor.z)<.15*size);
    const ys=flesh.map(p=>p.y).sort((a,b)=>a-b),p90=ys[Math.floor(ys.length*.9)];
    assert.ok(brain.y>p90-.15*size,'brain stays near the mound top with its real coating');
    assert.ok(brain.y<ys.at(-1)+.3*size,'brain touches the mound top');
    assert.ok(maxCoreStep<.09*size,'brain motion is bounded each frame');
    finite(sim);
    run(sim,180);assert.equal(sim.fluid.contractAnchor,null);finite(sim);
  }
});

test('directional input carries a contracted center after brain gathers to it',()=>{
  const sim=new PuddleSimulation();run(sim,45,{x:1});
  sim.step({contract:true,x:1});
  const start={...sim.fluid.contractAnchor};
  run(sim,150,{contract:true,x:1});
  const anchor=sim.fluid.contractAnchor;
  assert.ok(anchor.x>start.x+.2);
  assert.ok(Math.hypot(sim.brain.x-anchor.x,sim.brain.z-anchor.z)<.08);
  finite(sim);
});

test('separated resting groups attract, meet, and conserve their center',()=>{
  const fluid=new ParticleFluid({x:0,z:0});
  for(const p of fluid.particles){const side=p.z>=0?1:-1;p.z+=side*.65;p.pz=p.z;p.vz=0;}
  fluid.samplePairs();fluid.updateComponents();
  assert.equal(fluid.components.length,2);
  const before=fluid.centroid();
  for(let i=0;i<120;i++)fluid.step(1/60,{},[]);
  assert.equal(fluid.components.length,1);
  assert.equal(fluid.mainComponent,fluid.initialCount);
  assert.ok(Math.hypot(fluid.centroid().x-before.x,fluid.centroid().z-before.z)<.03);
});

test('edge attraction has finite reach and follows the cohesion control',()=>{
  const setup=()=>{
    const fluid=new ParticleFluid({x:0,z:0});
    for(const p of fluid.particles){const side=p.z>=0?1:-1;p.z+=side*.65;p.pz=p.z;p.vz=0;}
    fluid.samplePairs();fluid.updateComponents();return fluid;
  };
  const disabled=setup();disabled.cohesion=0;
  for(let i=0;i<120;i++)disabled.step(1/60,{},[]);
  assert.equal(disabled.components.length,2);
  const distant=setup();
  for(const p of distant.particles){p.z+=(p.z>=0?1:-1)*1.5;p.pz=p.z;}
  distant.samplePairs();distant.updateComponents();
  for(let i=0;i<120;i++)distant.step(1/60,{},[]);
  assert.equal(distant.components.length,2);
});

test('solid visibility blocks cylinder, thin box, and roof while allowing a path beneath',()=>{
  const a={x:-1,y:.13,z:0},b={x:1,y:.13,z:0};
  assert.equal(segmentBlockedBySolid(a,b,[{type:'cylinder',x:0,z:0,radius:.15,height:.5}],.02),true);
  assert.equal(segmentBlockedBySolid(a,b,[{type:'box',minX:-.01,maxX:.01,minY:0,maxY:.5,minZ:-1,maxZ:1}],.02),true);
  const roof={type:'roof',minX:-.2,maxX:.2,minZ:-1,maxZ:1,bottom:.235,top:.72};
  assert.equal(segmentBlockedBySolid(a,b,[roof],.02),false);
  assert.equal(segmentBlockedBySolid({...a,y:.4},{...b,y:.4},[roof],.02),true);
  assert.equal(segmentBlockedBySolid(a,b,[TERRACE_BOUNDARY],.02),false);
});

test('Marching Cubes creates a finite nonempty surface from actual particles',()=>{
  const sim=new PuddleSimulation();
  const surface=createParticleSurface(new THREE.MeshBasicMaterial(),40);
  surface.update(sim.fluid.particles,sim.activeColliders(),sim.fluid.radius);
  const count=surface.mesh.geometry.drawRange.count;
  assert.ok(count>1000&&count<surface.mesh.positionArray.length/3);
  assert.ok([...surface.mesh.positionArray.slice(0,count*3)].every(Number.isFinite));
});


test('only the three live demonstrations can be selected',()=>{
  const sim=new PuddleSimulation();
  for(const mode of ['field','growth','gap'])assert.equal(sim.selectTest(mode),true);
  for(const mode of ['bone','puddle-post','around','grippy','slippery','pressure']){
    assert.equal(sim.selectTest(mode),false);
    assert.equal(sim.selectedTest,'gap');
  }
});

test('brain and real flesh travel beneath the low roof at S, M, and L',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});sim.selectTest('gap');
    const colliders=sim.activeColliders(),startCount=sim.fluid.particles.length;
    run(sim,300);
    let crossedAt=-1,minCoat=99,maxCoreTop=0,above=0,around=0;
    for(let frame=0;frame<300;frame++){
      sim.step({x:1});
      minCoat=Math.min(minCoat,sim.fluid.coatContacts(colliders).length);
      if(sim.brain.x>GAP.roof.minX&&sim.brain.x<GAP.roof.maxX)
        maxCoreTop=Math.max(maxCoreTop,sim.brain.y+.105*size);
      for(const p of sim.fluid.particles){
        if(p.x>GAP.roof.minX&&p.x<GAP.roof.maxX){
          if(p.y>GAP.roof.top+sim.fluid.radius)above++;
          if(Math.abs(p.z)>GAP.roof.maxZ+sim.fluid.radius)around++;
        }
      }
      assert.ok(sim.fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,colliders,.001)));
      if(crossedAt<0&&sim.gapStage==='through')crossedAt=frame;
    }
    assert.ok(crossedAt>=0,`size ${size}: brain and 90% of flesh cross`);
    assert.ok(maxCoreTop<=GAP.roof.bottom+.005,`size ${size}: visible brain fits`);
    assert.equal(above,0);assert.equal(around,0);
    assert.ok(minCoat>=8);assert.equal(sim.fluid.particles.length,startCount);
    assert.ok(sim.brainThrough&&sim.fleshThrough>=.9);
  }
});

test('contracting by the roof stays below it, and release continues through',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});sim.selectTest('gap');
    run(sim,75,{x:1});
    sim.step({contract:true});
    const anchor={...sim.fluid.contractAnchor};
    let minCoat=99,maxCoreTop=0;
    for(let i=0;i<90;i++){
      sim.step({contract:true});
      minCoat=Math.min(minCoat,sim.fluid.coatContacts(sim.activeColliders()).length);
      if(sim.brain.x>GAP.roof.minX&&sim.brain.x<GAP.roof.maxX)
        maxCoreTop=Math.max(maxCoreTop,sim.brain.y+.105*size);
      assert.ok(sim.fluid.particles.every(p=>!pointInsideSolid(p.x,p.y,p.z,sim.activeColliders(),.001)));
    }
    assert.deepEqual(sim.fluid.contractAnchor,anchor,'holding without input leaves the anchor fixed');
    assert.ok(maxCoreTop<=GAP.roof.bottom+.005);
    run(sim,70);
    assert.equal(sim.fluid.contractAnchor,null);
    for(let i=0;i<300&&sim.gapStage!=='through';i++)sim.step({x:1});
    assert.equal(sim.gapStage,'through','the flesh still crosses after release');
    assert.ok(minCoat>=8);finite(sim);
  }
});

test('reverse movement pulls the same flesh back beneath the roof',()=>{
  for(const size of [.75,1,1.3]){
    const sim=new PuddleSimulation({size});sim.selectTest('gap');
    run(sim,230,{x:1});
    let minCoat=99,above=0,around=0;
    for(let i=0;i<360;i++){
      sim.step({x:-1});
      minCoat=Math.min(minCoat,sim.fluid.coatContacts(sim.activeColliders()).length);
      for(const p of sim.fluid.particles)if(p.x>GAP.roof.minX&&p.x<GAP.roof.maxX){
        if(p.y>GAP.roof.top+sim.fluid.radius)above++;
        if(Math.abs(p.z)>GAP.roof.maxZ+sim.fluid.radius)around++;
      }
    }
    const back=sim.fluid.particles.filter(p=>p.x<GAP.roof.minX-sim.fluid.radius-.04).length/sim.fluid.particles.length;
    assert.ok(sim.brain.x<GAP.roof.minX);
    assert.ok(back>=.9,`size ${size}: almost all flesh returns under the roof`);
    assert.ok(minCoat>=8);assert.equal(above,0);assert.equal(around,0);finite(sim);
  }
});

test('Ooze Forward uses the same controlled movement and stops on success or reset',()=>{
  const sim=new PuddleSimulation();sim.selectTest('gap');
  sim.oozeForward=true;
  for(let i=0;i<300&&sim.oozeForward;i++)sim.step();
  assert.equal(sim.gapStage,'through');assert.equal(sim.oozeForward,false);
  sim.oozeForward=true;sim.reset();
  assert.equal(sim.oozeForward,false);assert.equal(sim.gapStage,'approach');
  const fresh=new PuddleSimulation();fresh.selectTest('gap');
  assert.deepEqual(sim.fluid.particles,fresh.fluid.particles);
});

test('zero or negative duration leaves the material unchanged',()=>{
  const sim=new PuddleSimulation();sim.selectTest('gap');
  const before=sim.fluid.particles.map(p=>[p.x,p.y,p.z]);
  sim.step({x:1},0);sim.step({x:1},-1);
  assert.deepEqual(sim.fluid.particles.map(p=>[p.x,p.y,p.z]),before);
  sim.fluid.step(0,{x:1},sim.activeColliders());finite(sim);
});
