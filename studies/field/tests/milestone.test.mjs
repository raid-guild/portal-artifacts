import assert from 'node:assert/strict';
import {MazeTopology} from '../dist/maze-core.js';
import {ElevatorState,facesLiftDoors} from '../dist/elevator-state.js';
import {validCheckpoint} from '../dist/survey-save.js';
for(const floor of [1,-1])for(let seed=0;seed<50;seed++)for(const current of [-11,5,17]){
 const m=new MazeTopology(seed,{x:4,z:-42},floor);m.ensure(current);
 // Mixed-direction exploration and old saves beyond facility 13.
 m.minVisited=Math.min(-6,current);m.maxVisited=Math.max(11,current);m.facilities=m.maxVisited-m.minVisited+1;
 let c=m.chunks.get(current);c.room.deadEnd=false;m.refresh(c);
 const player={x:4+c.room.turn+1,z:m.worldZ(current)-20};
 const before={...player};const delta=m.update(player,0);
 assert.deepEqual(player,before,'No camera/player teleport at milestone staging');
 assert.equal(m.milestones.size,2);assert.ok(delta.added.includes(current-1)&&delta.added.includes(current+1));
 for(const direction of [-1,1]){
  const index=current+direction,chunk=m.chunks.get(index),reverse=direction<0;
  assert.equal(chunk.room.kind,floor===1?'elevator':'recognition');assert.equal(chunk.room.reverse,reverse);
  const world=(x,z)=>({x:4+(reverse?-x:x),z:m.worldZ(index)+(reverse?-52-z:z)});
  const entry=world(0,5.2);assert.ok(m.canWalk(entry.x,entry.z),'Reachable doorway from either direction');
  for(const [x,z] of [[0,4],[3,3],[-3,3],[3,-3],[-3,-3]]){const p=world(x,z);assert.ok(m.canWalk(p.x,p.z),'Room circuit matches rotated rendering');const sample=m.sample(p.x,p.z);assert.ok(Math.abs(sample.x-x)<1e-8);assert.ok(Math.abs(sample.z-z)<1e-8);}
  if(floor===1){const lift=new ElevatorState();const p=world(0,2.6),s=m.sample(p.x,p.z);assert.ok(lift.interact(s.x,s.z));assert.ok(facesLiftDoors((reverse?0:Math.PI)-(s.reverse?Math.PI:0),0,0,0),'Outward button facing rotates with cabin');}
  const checkpoint=validCheckpoint({version:1,seed,floor,index,minVisited:Math.min(m.minVisited,index),maxVisited:Math.max(m.maxVisited,index),milestones:[...m.milestones]});
  assert.ok(checkpoint);const restored=new MazeTopology(seed,{x:0,z:0},floor);restored.milestones=new Map(checkpoint.milestones);restored.chunks.clear();restored.ensure(index);assert.equal(restored.chunks.get(index).room.reverse,reverse);assert.equal(restored.chunks.get(index).room.kind,chunk.room.kind);
 }
}
// Early surveys keep normal neighbors; visible entry rooms are never swapped.
const m=new MazeTopology(12,{x:0,z:0},1);m.ensure(5);m.minVisited=-7;m.maxVisited=5;m.update({x:0,z:m.worldZ(5)+3});assert.equal(m.milestones.size,0);
console.log('PASS: 300 mixed-direction/overdue surveys, both milestone approaches, rotated collision/button facing, checkpoint restoration, no visible or occupied-room swap.');
const looping=new MazeTopology(333,{x:0,z:0},1);
for(let visit=1;visit<=12;visit++){
 const index=visit%2,entry={x:0,z:looping.worldZ(index)+(index?5:-55)};
 looping.update(entry);const room=looping.chunks.get(index).room;
 // Cross the appropriate concealed bend to retire the section just departed.
 looping.update({x:room.turn+.5,z:looping.worldZ(index)+(index?-20:-40)},Math.PI);
 assert.equal(looping.summary().facilities,visit+1,'New replacements advance progress even within the same two spatial slots');
}
const room=looping.chunks.get(looping.current).room;
looping.update({x:room.turn+1,z:looping.worldZ(looping.current)-20});
assert.equal(looping.milestones.size,2,'Repeatedly reversing still reaches the floor milestone');
assert.equal(looping.maxVisited-looping.minVisited+1,2,'Progress is independent of coordinate range');
console.log('PASS: continual reversals advance through 13 generated facilities inside two coordinate slots and offer the elevator.');
