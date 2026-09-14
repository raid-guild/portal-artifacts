import assert from 'node:assert/strict';
import {recipe,MazeTopology,findFacility,supportsWall} from '../dist/maze-core.js';
import {nurseryFurniture} from '../dist/nursery.js';
for(let seed=0;seed<100;seed++)for(const revision of [0,1,4]){
 const room=recipe(8,seed,revision);assert.equal(room.kind,'nursery');assert.equal(room.w,10);assert.equal(room.d,10);assert.equal(room.branch,false);
 const model=new MazeTopology(seed);model.ensure(8);model.chunks.set(8,model.make(8,revision));const z=model.worldZ(8);
 for(const p of nurseryFurniture(room))assert.equal(model.canWalk(p.x,z+p.z),false);
 for(let zz=-4;zz<=4;zz+=.25)assert.ok(model.canWalk(0,z+zz),'Open central route');
 model.openDoor(0,z-4.2);assert.ok(model.canWalk(0,z-5),'Exit opens');
 for(const [x,zz,rot,w]of [[4.91,1.3,-Math.PI/2,.89],[-2.6,-4.91,0,.51],[2.6,-4.91,0,.51]])assert.ok(supportsWall(model.chunks.get(8).cells,x,zz,rot,w),'Every photograph has a solid wall');
 assert.equal(findFacility(seed,90,'nursery'),8,'GOD always selects facility 009');
}
console.log('PASS: nursery fixed at facility 9 across seeds and revisions, solid furniture, reachable doors and backed pictures.');
