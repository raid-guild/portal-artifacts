import test from 'node:test';
import assert from 'node:assert/strict';
import { orbitPosition, orbitPeriod, orbitSpeed, orbitRadiusKeepingPeriod, startOrbitMotion, orbitRingPreset, validateOrbitPresetPlacement, pickOrbitEntity } from './orbit.js';

test('orbit speed is linear and direction reverses the same period',()=>{
  const entity={x:0,y:0,phase:0,orbitRadius:3.5,speed:orbitSpeed(3.5,9.6)};
  assert.ok(Math.abs(orbitPeriod(entity)-9.6)<1e-10);
  assert.ok(orbitPosition(entity,9.6/4).y>3.4);
  assert.ok(orbitPosition({...entity,orbitDirection:'clockwise'},9.6/4).y< -3.4);
  assert.ok(Math.abs(orbitPeriod(orbitRadiusKeepingPeriod(entity,5))-9.6)<1e-10);
  const zero=orbitRadiusKeepingPeriod(entity,0);
  assert.equal(zero.speed,0);
  assert.equal(orbitRadiusKeepingPeriod(zero,4).speed,0);
  const invalid=orbitRadiusKeepingPeriod(entity,NaN);
  assert.ok(Number.isNaN(invalid.speed));
  assert.equal(orbitRadiusKeepingPeriod(invalid,4).speed,0);
  assert.equal(orbitPeriod({...entity,speed:0}),Infinity);
  assert.equal(orbitPosition({...entity,speed:0},100).x,3.5);
});
test('orbit mode defaults and three-body preset are deterministic and safely bounded',()=>{
  const switched=startOrbitMotion({motion:'fixed',orbitRadius:0,speed:0});
  assert.equal(switched.orbitRadius,3.5);
  assert.ok(Math.abs(orbitPeriod(switched)-9.6)<1e-10);
  const configured=startOrbitMotion({motion:'fixed',orbitRadius:5,speed:0});
  assert.equal(configured.orbitRadius,5);
  assert.ok(Math.abs(orbitPeriod(configured)-9.6)<1e-10);
  const ring=orbitRingPreset({x:0,y:8},['a','b','c']);
  assert.deepEqual(ring.map(e=>e.phase),[0,120,240]);
  assert.deepEqual(ring.map(e=>e.id),['a','b','c']);
  const bounds={minX:-20,maxX:76,minY:-27,maxY:27},start={x:0,y:0},exit={x:50,y:0,radius:1.5};
  assert.equal(validateOrbitPresetPlacement(ring,bounds,start,exit),null);
  assert.match(validateOrbitPresetPlacement(orbitRingPreset({x:75,y:8},['a','b','c']),bounds,start,exit),/bounds/);
});
test('body selection beats shared center and center cycles through clustered bodies',()=>{
  const ring=orbitRingPreset({x:0,y:0},['a','b','c']);
  assert.deepEqual(pickOrbitEntity(ring,orbitPosition(ring[1])),{id:'b',part:'body'});
  assert.deepEqual(pickOrbitEntity(ring,{x:0,y:0},'a'),{id:'b',part:'center'});
  assert.deepEqual(pickOrbitEntity(ring,{x:0,y:0},'c'),{id:'a',part:'center'});
});
