import assert from 'node:assert/strict';
import {recipe,findFacility,MazeTopology,supportsWall,isDoorOpen} from '../dist/maze-core.js';
import {meetingFurniture,galleryPosters} from '../dist/meeting.js';
for(let seed=0;seed<80;seed++){
 for(let i=0;i<4;i++)assert.notEqual(recipe(i,seed).kind,'meeting');
 assert.equal(recipe(4,seed).kind,'meeting');assert.equal(recipe(8,seed).kind,'nursery');
 const index=findFacility(seed,10,'meeting');assert.ok(index>=10&&index<266);
 for(const revision of [0,1,3]){
  const m=new MazeTopology(seed);m.ensure(index);m.chunks.set(index,m.make(index,revision));const c=m.chunks.get(index),room=c.room,z=m.worldZ(index);assert.equal(room.kind,'meeting');assert.equal(meetingFurniture(room).length,9);
  for(const p of meetingFurniture(room))assert.equal(m.canWalk(p.x,z+p.z),false,'Table and seats are solid');
  // Walk an aisle from entrance around the table to the exit, opening every door.
  for(const d of c.doors){d.open=true;if(d.id==='exit')c.doorOpen=true;}
  for(let zz=-4.3;zz<=4.3;zz+=.2)assert.ok(m.canWalk(2.4,z+zz),'Continuous side aisle');
  for(let x=0;x<=2.4;x+=.2)for(const zz of[-4.3,4.3])assert.ok(m.canWalk(x,z+zz),'Entry and exit turnarounds');
  assert.ok(m.canWalk(0,z-5));assert.ok(m.canWalk(0,z+5));
 }
 const galleryIndex=findFacility(seed,0,'gallery'),m=new MazeTopology(seed);m.ensure(galleryIndex);const c=m.chunks.get(galleryIndex),posters=galleryPosters(c.room);assert.equal(posters.length,5);
 for(const p of posters)assert.ok(supportsWall(c.cells,p.x,p.z,p.rotation,p.asset==='BoardroomPoster'?1.28:p.asset==='ExcellencePoster'?.74:.59),'New gallery art is backed by wall');
}
console.log('PASS: meeting rooms from facility 5, recurring later rooms, nursery preserved, 8 solid chairs, passable aisles, gallery posters clear of doors.');
