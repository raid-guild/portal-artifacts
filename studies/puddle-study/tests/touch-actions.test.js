import test from 'node:test';
import assert from 'node:assert/strict';
import {bindHoldButton,bindPullButton} from '../src/touch-actions.js';
import {PullGesture} from '../src/pull-gesture.js';

class Button {
  listeners=new Map();captured=[];
  addEventListener(type,fn){this.listeners.set(type,[...(this.listeners.get(type)||[]),fn]);}
  setPointerCapture(id){this.captured.push(id);}
  fire(type,id){const event={pointerId:id,preventDefault(){this.prevented=true;}};
    for(const fn of this.listeners.get(type)||[])fn(event);return event;}
}

test('Run and Shed holds keep each owner until its own release or capture loss',()=>{
  for(const name of ['run','shed']){
    const button=new Button(),hold=bindHoldButton(button,()=>true);
    button.fire('pointerdown',1);button.fire('pointerdown',2);assert.equal(hold.active,true,name);
    button.fire('pointerup',2);button.fire('lostpointercapture',2);
    assert.equal(hold.active,true,`${name} remains held by pointer 1`);
    button.fire('pointercancel',1);assert.equal(hold.active,false,name);
    button.fire('pointerdown',3);hold.clear();assert.equal(hold.active,false,name);
  }
});

test('Contract cancellation is local, and implicit capture loss after up does not tap twice',()=>{
  const button=new Button();let time=0,taps=0,allowed=true;
  const pull=new PullGesture(()=>taps++),hold=bindPullButton(button,pull,()=>allowed,()=>time);
  pull.down('keyboard',time);
  button.fire('pointerdown',1);button.fire('pointerdown',2);
  button.fire('pointercancel',1);assert.equal(pull.sources.has('keyboard'),true);
  button.fire('lostpointercapture',2);assert.equal(pull.sources.has('keyboard'),true);
  assert.equal(taps,0);
  time=240;assert.equal(pull.update(time),true);pull.up('keyboard',time);assert.equal(taps,0);
  time=300;button.fire('pointerdown',3);time=350;button.fire('pointerup',3);
  button.fire('lostpointercapture',3);assert.equal(taps,1);
  time=400;button.fire('pointerdown',4);hold.clear();button.fire('pointerup',4);assert.equal(taps,1);
  allowed=false;button.fire('pointerdown',5);assert.equal(button.captured.includes(5),false);
});
