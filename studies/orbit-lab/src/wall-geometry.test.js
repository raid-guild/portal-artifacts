import test from 'node:test';
import assert from 'node:assert/strict';
import { compiledWallGeometry, pathWallSegments, unionAxisWalls, wallCorners } from './wall-geometry.js';
import { circleHitsRect, sweptCircleRect } from './level.js';

const rect=(id,x,y,width=1,height=1)=>({id,x,y,width,height});
const covers=(walls,x,y)=>walls.some(w=>Math.abs(x-w.x)<w.width/2-1e-6&&Math.abs(y-w.y)<w.height/2-1e-6);
test('exact painted union preserves an L shape and a hollow center',()=>{
  const l=unionAxisWalls([rect('a',0,0,3,1),rect('b',-1,1,1,3)]);
  assert.equal(covers(l,1,1),false);
  assert.equal(covers(l,-1,1),true);
  const frame=unionAxisWalls([rect('top',0,2,5,1),rect('bottom',0,-2,5,1),rect('left',-2,0,1,3),rect('right',2,0,1,3)]);
  assert.equal(covers(frame,0,0),false);
  assert.equal(covers(frame,0,2),true);
});
test('erase subtracts from merged paint without deleting neighboring segments',()=>{
  const line=unionAxisWalls([rect('a',0,0,5,1)]);
  const cut=unionAxisWalls(line,[rect('cut',0,0,1,1)]);
  assert.equal(covers(cut,0,0),false);
  assert.equal(covers(cut,-2,0),true);
  assert.equal(covers(cut,2,0),true);
});
test('path segments overlap at joints, rotate consistently, and collide',()=>{
  const segments=pathWallSegments({id:'p',thickness:.5,points:[{x:0,y:0},{x:2,y:2},{x:4,y:2}]});
  assert.equal(segments.length,2);
  assert.equal(circleHitsRect({x:1,y:1},.1,segments[0]),true);
  assert.equal(circleHitsRect({x:1,y:-1},.1,segments[0]),false);
  assert.notEqual(sweptCircleRect({x:1,y:-2},{x:1,y:2},.2,segments[0]),null);
  assert.ok(wallCorners(segments[0]).every(c=>Number.isFinite(c.x)&&Number.isFinite(c.y)));
  assert.equal(compiledWallGeometry([], [{id:'p',thickness:.5,points:[{x:0,y:0},{x:2,y:2}]}]).length,1);
});
