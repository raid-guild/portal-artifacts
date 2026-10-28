import {burstFlashColor} from '../src/burst-charge.js';
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

test('quick release flicks once; a slow drag and double tap keep their own actions',()=>{
  const flicks=[],casts=[],stick=new TouchJoystick({onFlick:f=>flicks.push(f),onDoubleTap:()=>casts.push(true)});
  stick.down(1,100,100,0);stick.move(1,145,105);
  assert.equal(stick.up(1,165,108,145),'flick');
  assert.equal(flicks.length,1);assert.equal(casts.length,0);
  assert.deepEqual(stick.vector,{x:0,y:0});
  stick.down(2,100,100,400);stick.move(2,170,100);
  assert.equal(stick.up(2,180,100,800),'drag');assert.equal(flicks.length,1);
  stick.down(3,100,100,1000);assert.equal(stick.up(3,100,100,1040),'tap');
  stick.down(4,106,100,1100);assert.equal(stick.up(4,106,100,1140),'double-tap');
  assert.equal(casts.length,1);assert.equal(flicks.length,1);
  stick.down(5,0,0,1300);stick.move(5,80,0);stick.cancel(5);
  assert.equal(flicks.length,1,'canceling never throws the body');
});

test('a fast move followed by a hold is a drag; release motion with no move event still flicks',()=>{
  const flicks=[],stick=new TouchJoystick({onFlick:f=>flicks.push(f)});
  stick.down(1,20,20,0);stick.move(1,85,20,18);
  assert.equal(stick.up(1,85,20,220),'drag');
  assert.equal(flicks.length,0,'the final idle time disqualifies a stale swipe');
  stick.down(3,20,20,230);stick.move(3,85,20,248);
  assert.equal(stick.up(3,90,20,450),'drag','small release jitter cannot revive a stale swipe');
  stick.down(2,20,20,500);
  assert.equal(stick.up(2,85,20,625),'flick', 'a browser can deliver the whole swipe at release');
  assert.equal(flicks.length,1);
});

test('stationary owner hold begins once, recalls, and cannot turn into steering, flick or cast',()=>{
  const events=[],stick=new TouchJoystick({onHoldStart:()=>events.push('recall'),onFlick:()=>events.push('flick'),onDoubleTap:()=>events.push('cast')});
  stick.down(1,100,100,0);
  assert.equal(stick.update(299),false);
  stick.move(1,106,100,290);
  assert.equal(stick.update(300),true);
  assert.deepEqual(events,['recall']);
  stick.update(500);assert.deepEqual(events,['recall'],'the hold starts once');
  stick.move(1,180,100,510);assert.deepEqual(stick.vector,{x:0,y:0},'holding latches movement');
  assert.equal(stick.up(1,190,100,520),'hold');
  assert.equal(stick.holding,false);
  assert.deepEqual(events,['recall'],'release cannot flick or cast');
  stick.down(2,100,100,550);assert.equal(stick.up(2,100,100,580),'tap');
  assert.deepEqual(events,['recall'],'the hold cannot count as the first tap of a double tap');
});

test('a drag disqualifies hold even after returning, and a secondary finger cannot own it',()=>{
  let holds=0;const stick=new TouchJoystick({onHoldStart:()=>holds++});
  stick.down(1,0,0,0);stick.down(2,20,0,10);
  stick.move(2,20,0,310);stick.move(1,30,0,100);stick.move(1,0,0,120);
  assert.equal(stick.update(400),false);
  assert.equal(stick.up(1,0,0,420),'drag');
  assert.equal(stick.update(450),false,'secondary finger does not inherit ownership');
  assert.equal(holds,0);
  stick.cancel(2);
  stick.down(3,0,0,500);stick.update(800);assert.equal(holds,1);
  stick.cancel(3);assert.equal(stick.holding,false);
  assert.equal(stick.up(3,0,0,900),null,'cancellation cannot complete a hold');
});

test('last moment movement without a frame rejects a stale hold',()=>{
  const events=[],stick=new TouchJoystick({onHoldStart:()=>events.push('hold'),onFlick:()=>events.push('flick')});
  stick.down(1,0,0,0);
  assert.equal(stick.up(1,70,0,390),'drag');
  assert.deepEqual(events,[]);
  stick.down(2,0,0,500);
  assert.equal(stick.up(2,2,1,850),'hold','stationary press is still recognized without an intermediate frame');
  assert.deepEqual(events,['hold']);
});

test('hold flashes after three seconds and bursts once after three more',()=>{
  const events=[],stick=new TouchJoystick({onHoldStart:()=>events.push('hold'),onBurst:()=>events.push('burst'),onFlick:()=>events.push('flick'),onDoubleTap:()=>events.push('cast')});
  stick.down(1,20,20,0);assert.equal(stick.update(300),true);
  stick.update(2999);assert.equal(stick.charging,false);assert.deepEqual(events,['hold']);
  stick.update(3000);assert.equal(stick.charging,true);assert.equal(stick.chargeProgress,0);
  stick.update(4500);assert.equal(stick.chargeProgress,.5);
  stick.update(5999);assert.equal(stick.holding,true);assert.deepEqual(events,['hold']);
  assert.equal(stick.update(6000),false);assert.equal(stick.charging,false);assert.deepEqual(events,['hold','burst']);
  stick.update(8000);stick.move(1,150,20,8010);stick.update(8100);
  assert.deepEqual(stick.vector,{x:0,y:0});assert.equal(stick.up(1,200,20,8110),'burst');assert.deepEqual(events,['hold','burst']);
  stick.down(2,20,20,9000);stick.update(15000);assert.deepEqual(events,['hold','burst','hold','burst']);
  stick.cancel();assert.equal(stick.burstConsumed,false);assert.equal(stick.charging,false);
});

test('releasing or canceling during warning aborts the charge',()=>{
  let bursts=0;const stick=new TouchJoystick({onBurst:()=>bursts++});
  stick.down(1,0,0,0);stick.update(4500);assert.equal(stick.charging,true);
  assert.equal(stick.up(1,0,0,5000),'hold');assert.equal(stick.charging,false);stick.update(7000);assert.equal(bursts,0);
  stick.down(2,0,0,8000);stick.update(12000);stick.cancel();stick.update(16000);
  assert.equal(stick.charging,false);assert.equal(bursts,0);
});

test('drag, cancellation and secondary fingers cannot burst',()=>{
  let bursts=0;const stick=new TouchJoystick({onBurst:()=>bursts++});
  stick.down(1,0,0,0);stick.move(1,40,0,100);stick.move(1,0,0,200);stick.update(1500);
  stick.cancel();stick.down(2,0,0,2000);stick.down(3,0,0,2010);stick.update(2300);stick.cancel(2);stick.update(4000);
  assert.equal(bursts,0);stick.cancel();stick.down(4,0,0,5000);stick.update(5300);stick.cancel(4);stick.update(7000);assert.equal(bursts,0);
});


test('warning flashes only during charge and restores the body on release',()=>{
  const stick=new TouchJoystick(),base=0xdb8e83;stick.down(1,0,0,0);stick.update(2999);
  assert.equal(burstFlashColor(stick,base),base);
  const colors=new Set();for(let t=3000;t<6000;t+=50){stick.update(t);colors.add(burstFlashColor(stick,base));}
  assert.equal(colors.size,2);assert.ok(!colors.has(base));
  stick.cancel();assert.equal(burstFlashColor(stick,base),base);
});
