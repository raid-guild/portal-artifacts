import test from 'node:test';
import assert from 'node:assert/strict';
import * as RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { deckGeometry, ballColliderDesc, createTubeColliders, DECK_Y, DROP_Y } from '../src/game.js';

test('perforated deck collider preserves an open pocket', async () => {
  await RAPIER.init();
  const geometry = deckGeometry([{x:0,z:0,r:.38}]);
  const positions = geometry.getAttribute('position');
  const vertices = new Float32Array(positions.array);
  const indices = geometry.index ? new Uint32Array(geometry.index.array) : Uint32Array.from({length:positions.count},(_,i)=>i);
  const world = new RAPIER.World({x:0,y:-9.81,z:0});
  world.createCollider(RAPIER.ColliderDesc.trimesh(vertices,indices));
  world.step();
  const cast = x => world.castRay(new RAPIER.Ray({x,y:2,z:0},{x:0,y:-1,z:0}),10,true);
  assert.equal(cast(0),null,'the center of a pocket should pass through');
  assert.ok(cast(.7),'solid deck must stop a falling ball');
  world.free();geometry.dispose();
});

test('production Chrome collider rebounds above 70% release height repeatedly', async () => {
  await RAPIER.init();
  const world=new RAPIER.World({x:0,y:-10.5,z:0});world.timestep=1/120;
  world.createCollider(RAPIER.ColliderDesc.cuboid(5,.1,5).setTranslation(0,-.1,0).setRestitution(.55));
  const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,2.6,0).setCcdEnabled(true));
  world.createCollider(ballColliderDesc('chrome'),body);
  const peaks=[];let wasRising=false;
  for(let i=0;i<850;i++) {
    world.step();const vy=body.linvel().y;
    if(wasRising&&vy<=0)peaks.push(body.translation().y);
    wasRising=vy>0;
  }
  assert.ok(peaks.length>=2,`expected repeated rebounds, saw ${peaks.length}`);
  assert.ok(peaks[0]>.16+.7*(2.6-.16),`first apex ${peaks[0]} was too low`);
  assert.ok(peaks[1]>.9,`second rebound ${peaks[1]} should remain visible`);
  world.free();
});

test('the full-height tube contains fast rebounds, including wall seams', async () => {
  await RAPIER.init();
  const world=new RAPIER.World({x:0,y:0,z:0});world.timestep=1/120;
  createTubeColliders(world);
  const balls=[];
  for(const angle of [0,Math.PI/48,Math.PI/4,Math.PI/2,Math.PI]) {
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0,(DECK_Y+DROP_Y)/2,0)
      .setLinvel(Math.cos(angle)*12,0,Math.sin(angle)*12)
      .setCcdEnabled(true));
    world.createCollider(ballColliderDesc('chrome'),body);balls.push(body);
  }
  for(let i=0;i<350;i++) {
    world.step();
    for(const body of balls) {
      const p=body.translation();
      assert.ok(Math.hypot(p.x,p.z)<2.9,`ball escaped tube at step ${i}: ${JSON.stringify(p)}`);
    }
  }
  world.free();
});

test('a ball dropped through a lowered scoring pocket reaches its sensor', async () => {
  await RAPIER.init();
  const world=new RAPIER.World({x:0,y:-10.5,z:0});world.timestep=1/120;
  const geometry=deckGeometry([{x:0,z:0,r:.38}]);
  const positions=geometry.getAttribute('position');
  const vertices=new Float32Array(positions.array);
  const indices=geometry.index?new Uint32Array(geometry.index.array):Uint32Array.from({length:positions.count},(_,i)=>i);
  const deck=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,DECK_Y,0));
  world.createCollider(RAPIER.ColliderDesc.trimesh(vertices,indices),deck);
  const sensor=world.createCollider(RAPIER.ColliderDesc.ball(.38*.86).setTranslation(0,-.26,0).setSensor(true),deck);
  const ball=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,DROP_Y,0).setCcdEnabled(true));
  const collider=world.createCollider(ballColliderDesc('chrome'),ball);
  let scored=false;
  for(let i=0;i<220;i++) {world.step();if(world.intersectionPair(collider,sensor)){scored=true;break;}}
  assert.ok(scored,'lowering the deck must also lower the scoring sensor');
  world.free();geometry.dispose();
});
