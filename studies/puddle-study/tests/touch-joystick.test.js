import test from 'node:test';
import assert from 'node:assert/strict';
import {TouchJoystick} from '../src/touch-joystick.js';

test('one finger steers with deadzone and releases without a cast',()=>{
  const casts=[],stick=new TouchJoystick({onDoubleTap:(x,y)=>casts.push([x,y])});
  stick.down(1,100,100,0);stick.move(1,106,100);assert.deepEqual(stick.vector,{x:0,y:0});
  stick.move(1,130,100);assert.deepEqual(stick.vector,{x:1,y:0});
  stick.move(1,100,100);stick.up(1,100,100,100);
  stick.down(2,100,100,180);stick.up(2,100,100,200);
  assert.deepEqual(casts,[],'a drag remains disqualified after returning to its origin');
  assert.equal(stick.owner,null);
});

test('two stationary nearby taps cast once at the second release',()=>{
  const casts=[],stick=new TouchJoystick({onDoubleTap:(x,y)=>casts.push([x,y])});
  stick.down(1,100,100,0);stick.up(1,100,100,80);
  stick.cancel(1); // Browser releases capture after pointerup; this must not erase the tap.
  stick.down(2,112,104,200);stick.up(2,112,104,260);
  assert.deepEqual(casts,[[112,104]]);
  stick.down(3,112,104,310);stick.up(3,112,104,330);
  assert.equal(casts.length,1,'the completed pair does not cast again on a third tap');
});

test('distance, duration, delay and cancellation reject a cast',()=>{
  const casts=[],stick=new TouchJoystick({onDoubleTap:(x,y)=>casts.push([x,y])});
  stick.down(1,0,0,0);stick.up(1,0,0,80);
  stick.down(2,40,0,120);stick.up(2,40,0,170);
  stick.down(3,40,0,500);stick.up(3,40,0,540);
  stick.down(4,40,0,600);stick.up(4,40,0,830);
  stick.down(5,40,0,900);stick.cancel(5);
  stick.down(6,40,0,940);stick.up(6,40,0,980);
  assert.deepEqual(casts,[]);
});

test('secondary touch cannot steal steering and canceled ownership does not transfer',()=>{
  const stick=new TouchJoystick();
  stick.down(1,10,10,0);stick.down(2,50,50,10);
  stick.move(2,95,50);assert.deepEqual(stick.vector,{x:0,y:0});
  stick.move(1,10,45);assert.deepEqual(stick.vector,{x:0,y:1});
  stick.cancel(1);assert.equal(stick.owner,null);assert.deepEqual(stick.vector,{x:0,y:0});
  stick.move(2,120,50);assert.deepEqual(stick.vector,{x:0,y:0});
  stick.cancel();assert.equal(stick.touches.size,0);
});
