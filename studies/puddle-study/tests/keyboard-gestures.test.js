import test from 'node:test';
import assert from 'node:assert/strict';
import {KeyboardGestures} from '../src/keyboard-gestures.js';
import {burstFlashColor} from '../src/burst-charge.js';
import {PuddleSimulation,DT} from '../src/simulation.js';
import {movementAxes} from '../src/movement.js';

test('Space recalls on tap and shares the pointer hold, warning, and one-shot burst timings',()=>{
  const actions=[],k=new KeyboardGestures({onRecall:()=>actions.push('tap'),onHoldStart:()=>actions.push('hold'),onBurst:()=>actions.push('burst')});
  k.down('Space',0);k.up('Space',100);k.down('Space',180);k.up('Space',250);assert.deepEqual(actions,['tap','tap']);
  k.down('Space',1000);k.down('Space',1500,{repeat:true});assert.equal(k.update(1299),false);
  assert.equal(k.update(1300),true);assert.deepEqual(actions,['tap','tap','hold']);
  k.update(3999);assert.equal(k.charging,false);k.update(4000);assert.equal(k.charging,true);assert.equal(k.chargeProgress,0);
  k.update(5500);assert.equal(k.chargeProgress,.5);k.update(6999);assert.equal(k.holding,true);
  assert.equal(k.update(7000),false);assert.equal(k.charging,false);assert.deepEqual(actions,['tap','tap','hold','burst']);
  k.update(9000);assert.equal(k.up('Space',9010),'burst');assert.deepEqual(actions,['tap','tap','hold','burst']);
});

test('release during charge and global cancellation prevent delayed actions and restore flash',()=>{
  let bursts=0,taps=0;const k=new KeyboardGestures({onBurst:()=>bursts++,onRecall:()=>taps++});
  k.down('Space',0);k.update(4500);assert.notEqual(burstFlashColor(k,0),0);
  k.up('Space',5000);k.update(7000);assert.equal(k.charging,false);assert.equal(burstFlashColor(k,0),0);assert.equal(bursts,0);assert.equal(taps,0);
  k.down('Space',8000);k.update(12000);k.cancel();k.up('Space',15000);k.update(16000);assert.equal(bursts,0);assert.equal(taps,0);
});

test('each WASD or arrow direction double tap flings exactly once on the second press',()=>{
  const cases={KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0],KeyW:[0,1],ArrowUp:[0,1],KeyS:[0,-1],ArrowDown:[0,-1]};
  for(const [code,axes] of Object.entries(cases)){
    const flings=[],k=new KeyboardGestures({onFling:f=>flings.push(f)});
    k.down(code,0);k.up(code,90);assert.equal(flings.length,0);
    assert.equal(k.down(code,180),true);assert.deepEqual(flings,[{horizontal:axes[0],vertical:axes[1]}]);
    k.down(code,200,{repeat:true});k.up(code,230);assert.equal(flings.length,1);
    k.down(code,300);assert.equal(flings.length,1,'a triple tap cannot chain off a consumed pair');
  }
});

test('walking holds, repeats, overlapping directions, modifiers, and canceled taps never fling',()=>{
  const flings=[],k=new KeyboardGestures({onFling:f=>flings.push(f)});
  k.down('KeyD',0);k.down('KeyD',100,{repeat:true});k.up('KeyD',1000);k.down('KeyD',1100);k.up('KeyD',1200);
  k.cancel();k.down('KeyD',2000);k.up('KeyD',2050);k.down('KeyD',2400);k.up('KeyD',2450);
  k.cancel();k.down('KeyW',3000);k.down('KeyD',3010);k.up('KeyW',3050);k.up('KeyD',3060);k.down('KeyD',3100);k.up('KeyD',3150);
  k.cancel();k.down('KeyA',4000);k.up('KeyA',4050);k.down('KeyD',4100);k.up('KeyD',4150);
  k.cancel();k.down('KeyA',5000);k.up('KeyA',5050);k.down('KeyA',5100,{modified:true});k.up('KeyA',5150);
  k.cancel();k.down('KeyW',6000);k.up('KeyW',6050);k.cancel();k.down('KeyW',6100);k.up('KeyW',6150);
  assert.equal(flings.length,0);
});

test('keyboard flings use movement camera axes and Space reaches the real burst path',()=>{
  const sim=new PuddleSimulation(),right={x:0,z:1},forward={x:-1,z:0};
  const k=new KeyboardGestures({onBurst:()=>sim.queueBurst(),onFling:({horizontal,vertical})=>sim.queueFlick(movementAxes('garden',horizontal,vertical,right,forward),1)});
  k.down('KeyW',0);k.up('KeyW',50);k.down('KeyW',150);sim.step({},DT);
  assert.ok(sim.fluid.flickFlight);assert.ok(sim.fluid.flickFlight.vx<0);assert.ok(Math.abs(sim.fluid.flickFlight.vz)<.01);
  sim.reset();k.cancel();k.down('Space',1000);
  for(let i=1;i<=370;i++){k.update(1000+i*1000/60);sim.step({contract:k.holding},DT);}
  assert.equal(sim.pressure.shed,280);assert.equal(sim.fluid.contractAnchor,null);assert.equal(sim.fluid.particles.length,297);
});
