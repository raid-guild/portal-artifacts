import assert from 'node:assert/strict';
import {bindTouchControls} from '../dist/touch-controls.js';
function surface(){const events={};return {style:{},addEventListener(n,f){(events[n]??=[]).push(f)},setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0,width:132,height:132}),send(n,id,x,y){for(const f of events[n]||[])f({pointerId:id,clientX:x,clientY:y,preventDefault(){}})}};}
const pad=surface(),world=surface(),stick=surface();let input,looks=[],enabled=true;
const controller=bindTouchControls({pad,stick,world,onMove:(x,y)=>input={x,y},onLook:(x,y)=>looks.push([x,y]),canLook:()=>enabled});
pad.send('pointerdown',1,66,24);assert.ok(input.y>.9);world.send('pointerdown',2,200,100);world.send('pointermove',2,220,110);assert.deepEqual(looks,[[20,10]]);assert.ok(input.y>.9,'Looking must not cancel movement');
world.send('pointermove',3,1000,1000);assert.equal(looks.length,1,'Ignore unrelated pointers');pad.send('pointerup',3,0,0);assert.ok(input.y>.9);pad.send('lostpointercapture',1,0,0);assert.deepEqual(input,{x:0,y:0});
pad.send('pointerdown',4,90,42);assert.ok(Math.hypot(input.x,input.y)<1,'Partial joystick travel stays analog');controller.reset();assert.deepEqual(input,{x:0,y:0});world.send('pointermove',2,300,300);assert.equal(looks.length,1,'Reset ends look too');enabled=false;pad.send('pointerdown',5,66,0);assert.deepEqual(input,{x:0,y:0});
console.log('PASS: independent thumb gestures, analog motion, pointer ownership, cancellation and pause reset.');
