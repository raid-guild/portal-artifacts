import assert from 'node:assert/strict';
import {createHarvestState,STEPS,QUOTA} from '../src/harvest-state.js';
function run(s,i){assert.equal(s.step,i);assert.equal(s.toggle(),true);s.tick(STEPS[i].seconds/(i===2?s.rate:1));assert.equal(s.running,false);}
const s=createHarvestState();assert.equal(s.canRun,true);s.toggle();s.tick(4);s.toggle();s.tick(20);assert.equal(s.elapsed,4);assert.equal(s.step,0);s.toggle();s.tick(4);assert.equal(s.step,1);assert.equal(s.running,false);
run(s,1);assert.equal(s.step,2);s.setRate(1.5);s.toggle();s.tick(20);assert.equal(s.fill,.5);const restored=createHarvestState(JSON.parse(JSON.stringify(s.snapshot())));assert.equal(restored.running,true);restored.tick(20);assert.equal(restored.fill,1);assert.equal(restored.step,3);assert.equal(restored.flights.length,0);
run(restored,3);assert.equal(restored.flights.length,0);run(restored,4);assert.equal(restored.flights.length,3);assert.equal(restored.step,0);assert.equal(restored.fill,0);
restored.tick(26);assert.equal(restored.delivered,1);const flightRestore=createHarvestState(restored.snapshot());flightRestore.tick(5);assert.equal(flightRestore.delivered,3);flightRestore.tick(999);assert.equal(flightRestore.delivered,3);
const final=createHarvestState({delivered:999,step:4,fill:1});run(final,4);assert.equal(final.flights.length,1);assert.equal(final.canRun,false);final.tick(30);assert.equal(final.delivered,QUOTA);assert.equal(final.toggle(),false);
const boundary=createHarvestState({step:4,flights:Array.from({length:9},(_,i)=>({slot:i%3,age:0}))});assert.equal(boundary.toggle(),false);boundary.tick(32);assert.equal(boundary.toggle(),true);
const shift=createHarvestState();let elapsed=0;while(shift.delivered<QUOTA){for(let i=0;i<5;i++){run(shift,i);elapsed+=STEPS[i].seconds;}shift.tick(31);}assert.equal(shift.delivered,1000);assert.ok(elapsed>=8*3600);
console.log('PASS: five manual gates, pause/resume, rate, save/reload mid-fill and mid-flight, dispatch interlock, flight bound, exact 1000 quota and 9+ hour shift.');
