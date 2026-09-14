import assert from 'node:assert/strict';
import {cameraPositions,trackAngle,cameraBlink} from '../dist/surveillance.js';
import {recipe,findFacility,MazeTopology} from '../dist/maze-core.js';
let layouts=new Set();
for(let seed=0;seed<100;seed++){
 for(let i=0;i<7;i++)assert.notEqual(recipe(i,seed).kind,'camera');
 const index=findFacility(seed,7,'camera');assert.ok(index>=7&&index<263);const room=recipe(index,seed),positions=cameraPositions(room);layouts.add(positions.length);
 const model=new MazeTopology(seed);model.ensure(index);const z=model.worldZ(index);
 for(const p of positions){assert.equal(model.canWalk(p.x,z+p.z),false,'Solid stand');assert.ok(Math.abs(p.x)<room.w/2&&Math.abs(p.z)<room.d/2);}
 assert.ok(model.canWalk(0,z+room.d/2-.5),'Entry clear');
 model.openDoor(0,z-room.d/2+.8);assert.ok(model.canWalk(0,z-room.d/2),'Exit clear');
 assert.equal(recipe(index,seed,1).kind,'camera','Room type survives hidden revision');
}
assert.deepEqual([...layouts].sort(),[1,3]);
const step=trackAngle(Math.PI-.01,-Math.PI+.1,.05);assert.ok(step>Math.PI-.01&&step<Math.PI+.1,'Shortest turn across wrap');
assert.equal(trackAngle(0,2,0),0);assert.ok(trackAngle(0,2,.1)<=.105001);assert.ok(Math.abs(trackAngle(0,.01,1)-.01)<1e-9);
assert.equal(cameraBlink(0,0),true);assert.equal(cameraBlink(.3,0),false);assert.notEqual(cameraBlink(0,0),cameraBlink(0,1));
console.log('PASS: 100 seeded camera rooms, post-7 gating, both layouts, solid stands, clear exits, bounded tracking and independent blink timing.');
