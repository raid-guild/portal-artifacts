import assert from 'node:assert/strict';
import {createHarvestState} from '../src/harvest-state.js';
const s=createHarvestState();assert.equal(s.release(),false);
s.toggle();s.tick(9);assert.equal(s.fill,.5);s.toggle();s.tick(9);assert.equal(s.fill,.5);
s.rate=2;s.toggle();s.tick(4.5);assert.equal(s.fill,1);assert.equal(s.pumping,false);
assert.equal(s.release(),true);assert.equal(s.fill,0);assert.equal(s.flights.length,3);assert.equal(s.release(),false);
s.tick(26);assert.equal(s.delivered,1);assert.equal(s.flights.length,2);s.tick(5);assert.equal(s.delivered,3);assert.equal(s.flights.length,0);s.tick(30);assert.equal(s.delivered,3);
const cap=createHarvestState();for(let i=0;i<3;i++){cap.fill=1;assert.equal(cap.release(),true);}cap.fill=1;assert.equal(cap.release(),false);assert.equal(cap.fill,1);assert.equal(cap.flights.length,9);cap.tick(40);assert.equal(cap.delivered,9);assert.equal(cap.release(),true);
console.log('PASS: partial fill, pause/resume, rate, full stop, launch gate, staggered delivery, no duplicate delivery, bounded flight pool and refill.');
