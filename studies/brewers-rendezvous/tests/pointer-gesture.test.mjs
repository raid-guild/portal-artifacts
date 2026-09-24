import test from 'node:test';
import assert from 'node:assert/strict';
import { createPointerGesture } from '../dist/js/pointer-gesture.js';

function harness() {
  let time=0, nextTimer=1;
  const timers=new Map(), events=[];
  const gesture=createPointerGesture({
    now:()=>time,
    schedule:(callback,delay)=>{const id=nextTimer++;timers.set(id,{at:time+delay,callback});return id;},
    unschedule:(id)=>timers.delete(id),
    onTap:e=>events.push(['tap',e.pointerId]),
    onOrbit:(dx,dy)=>events.push(['orbit',dx,dy]),
    onDragStart:()=>events.push(['start']),
    onDragEnd:()=>events.push(['end'])
  });
  const pointer=(x,y,id=1,type='mouse',extras={})=>({pointerId:id,pointerType:type,isPrimary:true,button:0,clientX:x,clientY:y,...extras});
  const advance=(ms)=>{
    time+=ms;
    for(const [id,timer] of [...timers])if(timer.at<=time){timers.delete(id);timer.callback();}
  };
  return {gesture,events,pointer,advance};
}

test('quick tap fires one canvas selection and no orbit',()=>{
  const h=harness();h.gesture.down(h.pointer(20,20));h.advance(90);h.gesture.up(h.pointer(22,22));
  assert.deepEqual(h.events,[['tap',1]]);
});
test('mouse drag starts at 8 px and touch waits for 12 px',()=>{
  const mouse=harness();mouse.gesture.down(mouse.pointer(0,0));mouse.gesture.move(mouse.pointer(7,0));
  assert.equal(mouse.gesture.dragging,false);mouse.gesture.move(mouse.pointer(8,0));mouse.gesture.up(mouse.pointer(10,0));
  assert.deepEqual(mouse.events,[['start'],['orbit',1,0],['orbit',2,0],['end']]);
  const touch=harness();touch.gesture.down(touch.pointer(0,0,1,'touch'));touch.gesture.move(touch.pointer(11,0,1,'touch'));
  assert.equal(touch.gesture.dragging,false);touch.gesture.move(touch.pointer(12,0,1,'touch'));touch.gesture.up(touch.pointer(12,0,1,'touch'));
  assert.deepEqual(touch.events,[['start'],['orbit',1,0],['end']]);
});
test('stationary hold is not a tap; hold followed by small move orbits',()=>{
  const still=harness();still.gesture.down(still.pointer(0,0));still.advance(300);still.gesture.up(still.pointer(0,0));
  assert.deepEqual(still.events,[['start'],['end']]);
  const moved=harness();moved.gesture.down(moved.pointer(0,0));moved.advance(300);moved.gesture.move(moved.pointer(3,2));moved.gesture.up(moved.pointer(3,2));
  assert.deepEqual(moved.events,[['start'],['orbit',3,2],['end']]);
});
test('cancel, lost capture, and second pointer never select a stop',()=>{
  const h=harness();h.gesture.down(h.pointer(0,0));
  assert.equal(h.gesture.down(h.pointer(30,30,2,'touch',{isPrimary:false})),false);
  assert.equal(h.gesture.move(h.pointer(50,50,2,'touch')),false);
  h.gesture.move(h.pointer(9,0));
  assert.equal(h.gesture.cancel(2),false);
  assert.equal(h.gesture.cancel(1),true);
  assert.equal(h.gesture.up(h.pointer(9,0)),false);
  assert.deepEqual(h.events,[['start'],['orbit',9,0],['end']]);
});
