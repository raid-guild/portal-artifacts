import assert from 'node:assert/strict';
import {MazeTopology,recipe,roomCells,floorHeight,crawlProfile,branchX} from '../dist/maze-core.js';
// Flood-fill all generated archetypes: holes and furniture may interrupt the center,
// but a route around them must always connect the two segment seams.
function reachable(m,index){const c=m.chunks.get(index),z0=m.worldZ(index);c.doorOpen=true;const start=[0,5],goal='0,-58',seen=new Set(),queue=[start];while(queue.length){const[x,z]=queue.shift(),k=`${x},${z}`;if(seen.has(k)||!c.cells.has(k)||!m.canWalk(x+.5,z+.5+z0,true))continue;seen.add(k);if(k===goal)return true;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);}return false;}
// Crawl passages are sub-cell width; their continuous centerline is checked separately.
for(let seed=0;seed<20;seed++)for(let index=0;index<24;index++){const m=new MazeTopology(seed);m.ensure(index);const c=m.chunks.get(index);if(c.room.deadEnd){c.room.deadEnd=false;c.cells=roomCells(c.room);}if(c.room.kind!=='crawl')assert.ok(reachable(m,index),`No path ${seed}/${index}/${c.room.kind}`);else{c.doorOpen=true;for(let z=5;z>-6;z-=.1)assert.ok(m.canWalk(0,z+m.worldZ(index),true),`Crawl blocked ${z}`);assert.equal(m.canWalk(0,-5+m.worldZ(index),false),false);}}
const m=new MazeTopology(23);let p={x:0,z:5};const token=m.chunks.get(0).token;for(let i=0;i<20;i++)m.update(p);assert.equal(m.chunks.get(0).token,token,'Observed room changed');const turn=m.chunks.get(0).room.turn;p={x:turn+1,z:-18};m.update(p);assert.notEqual(m.chunks.get(0).token,token);assert.equal(m.chunks.get(0).room.turn,turn,'Safe connector moved');assert.equal(m.mutations,1);m.update(p);assert.equal(m.mutations,1,'Mutation repeated in same passage');
// Door clearance and shaft collision.
const d=new MazeTopology(9),room=d.chunks.get(0).room;assert.equal(d.canWalk(0,-room.d/2),false);assert.equal(d.openDoor(0,-room.d/2+1),true);assert.equal(d.canWalk(0,-room.d/2),true);assert.equal(d.openDoor(5,5),false);
d.ensure(7);assert.equal(d.canWalk(0,d.worldZ(7)),false);assert.ok(d.canWalk(4,d.worldZ(7)));
// Infinite traversal retains only three chunks and regularly recenters world coordinates.
const long=new MazeTopology(8);for(let i=1;i<1500;i++){const player={x:0,z:long.worldZ(i)+5};long.update(player);assert.equal(long.chunks.size,3);assert.ok(Math.abs(player.z)<8300);assert.equal(long.indexAt(player.z),i);}for(let i=1499;i>1400;i--){const player={x:0,z:long.worldZ(i)+5};long.update(player);assert.equal(long.chunks.size,3);assert.equal(long.indexAt(player.z),i);}
for(let i=0;i<100;i++){const a=recipe(i,83),b=recipe(i,83,1);if(['stairs','crawl','pit'].includes(a.kind))assert.equal(a.kind,b.kind);assert.ok(roomCells(a).size<700);assert.equal(floorHeight(a,6),0);assert.equal(floorHeight(a,-34),0);}
assert.equal(crawlProfile(recipe(3,8),-5).height<1.85,true);
console.log('PASS: 480 seeded layouts, reachable exits, crawl clearance, usable doors, pit collision, hidden mutations, stable special-room profiles, 1,500 rooms forward and back, bounded memory and origin rebasing.');

const stop=new MazeTopology(22);stop.ensure(1);let c=stop.chunks.get(1);assert.ok(c.room.deadEnd);const original=c.token,world=stop.worldZ(1);const end={x:c.room.turn+1,z:world-30.7};assert.ok(stop.canWalk(end.x,end.z));assert.equal(stop.canWalk(end.x,world-33),false);stop.update(end);c=stop.chunks.get(1);assert.notEqual(c.token,original);assert.ok(c.room.deadEnd);stop.update({x:0,z:world-4});assert.equal(stop.chunks.get(1).room.deadEnd,false);assert.ok(reachable(stop,1));
const offset=new MazeTopology(33,{x:12,z:-42});assert.equal(offset.indexAt(-36.01),0);assert.ok(offset.canWalk(12,-36.2));assert.equal(offset.sample(12,-40).x,0);console.log('PASS: forced-return dead ends, hidden reopening, world-space entrance offsets.');

// A closed main exit must still allow the side office loop to reach the next seam.
for(let seed=0;seed<40;seed++){
 const maze=new MazeTopology(seed),c=maze.chunks.get(0);for(const door of c.doors)if(door.id!=='exit'){
 assert.equal(maze.canWalk(door.x,door.z),false);assert.ok(maze.openDoor(door.x,door.z));assert.ok(maze.canWalk(door.x,door.z));
 }
 const main=c.doors.find(d=>d.id==='exit');c.doors=c.doors.filter(d=>d!==main);c.obstacles.push({x:0,z:main.z,w:2,d:.5});assert.ok(reachable(maze,0),'Side branch must rejoin beyond blocked main exit');
 const token=c.token;maze.update({x:branchX(c.room)+1,z:-22});assert.equal(maze.chunks.get(0).token,token,'Occupied annex must not regenerate');
}
console.log('PASS: 40 side-office loops bypass a blocked main exit; side and annex doors open; occupied branches remain stable.');
const progress=new MazeTopology(4);for(const [index,count] of [[0,1],[1,2],[2,3],[1,3],[0,3],[-1,4],[0,4]]){progress.ensure(index);assert.equal(progress.summary().facilities,count);}
const {supportsWall}=await import('../dist/maze-core.js');
for(let seed=0;seed<20;seed++){const c=new MazeTopology(seed).chunks.get(0),b=branchX(c.room);assert.equal(supportsWall(c.cells,b+1,-25.92,0,.65),false,'Art cannot span annex doorway');assert.ok(supportsWall(c.cells,b-1,-25.92,0,.65),'Relocated art has solid wall');}
console.log('PASS: progress never decreases on revisits; annex artwork requires solid wall backing.');
const {ceilingHeight}=await import('../dist/maze-core.js');
const squeeze=new MazeTopology(41);squeeze.ensure(2);const sc=squeeze.chunks.get(2),sz=squeeze.worldZ(2);assert.ok(sc.room.narrow);assert.ok(squeeze.canWalk(sc.room.turn+.5,sz-35));assert.equal(squeeze.canWalk(sc.room.turn+1.5,sz-35),false);
for(let i=0;i<50;i++){const a=recipe(i,41),b=recipe(i,41,2);assert.equal(a.ceiling,b.ceiling);assert.equal(a.narrow,b.narrow);assert.equal(a.hanging,b.hanging);assert.equal(ceilingHeight(a,0,-50),3);}
const tall=recipe(6,41);assert.ok(tall.ceiling>=7&&tall.hanging);assert.equal(ceilingHeight(tall,0,0),tall.ceiling);
console.log('PASS: narrow corridors have matching collision, tall rooms retain low connectors, and spatial profiles survive regeneration.');
const expiry=new MazeTopology(7),beforeExpiry=expiry.chunks.get(0);expiry.update({x:0,z:-59});assert.equal(expiry.chunks.get(0).token,beforeExpiry.token,'Do not change visible entrance');let active=expiry.chunks.get(1);const swap=expiry.update({x:active.room.turn+.5,z:expiry.worldZ(1)-18});assert.equal(swap.expired,0);assert.notEqual(expiry.chunks.get(0).room.turn,beforeExpiry.room.turn);
const departed=expiry.chunks.get(1).token;expiry.update({x:0,z:-55});active=expiry.chunks.get(0);assert.equal(expiry.update({x:active.room.turn+.5,z:-42}).expired,1);assert.notEqual(expiry.chunks.get(1).token,departed);
console.log('PASS: departed sections expire after concealed bends in both directions, with changed return routes.');
const {findFacility,ghostRoom,enteredGhostRoom,isMusicRoom}=await import('../dist/maze-core.js');
for(let seed=0;seed<30;seed++){
 for(const type of ['music','ghost','narrow','tall','hanging','crawl','stairs','pit']){const i=findFacility(seed,0,type);assert.notEqual(i,null);const r=recipe(i,seed);if(type==='ghost'){assert.ok(i>=7&&r.branch&&r.ghost);const p=ghostRoom(r);assert.ok(enteredGhostRoom(r,p.x,p.z));assert.equal(enteredGhostRoom(r,branchX(r)+1,p.z),false);}if(type==='music')assert.ok(isMusicRoom(i,r));}
 const m=new MazeTopology(seed);m.ensure(10);let r=m.chunks.get(10).room;const z=m.worldZ(10);m.update({x:r.turn+.5,z:z-30.5});assert.ok(m.chunks.get(10).reachedEnd);m.update({x:0,z:z-8});assert.equal(m.chunks.get(10).room.deadEnd,false);assert.ok(reachable(m,10),'Facility 11 must open after returning around its bend');
 m.ensure(9);assert.ok(reachable(m,9),'Facility 10 has an onward route');
}
console.log('PASS: debug destinations exist across 30 seeds; ghosts start after facility 7; facility 10 and the following dead end allow onward progress.');
for(const turn of [8,-10]){const room={turn},b=branchX(room),side=b<0?-1:1;assert.equal(enteredGhostRoom(room,b+1,-15),false);assert.equal(enteredGhostRoom(room,b+1+side*1.3,-15),true);assert.equal(Math.cos(ghostRoom(room).rotation),b<0?1:-1);}
console.log('PASS: chairs face left relative to approach; figures disappear just past the hallway junction.');
// Facility 11: retreat a few meters and turn away, not all the way to the room.
for(let seed=0;seed<50;seed++){
 const m=new MazeTopology(seed);m.ensure(10);const r=m.chunks.get(10).room,z=m.worldZ(10),x=r.turn+1;
 m.update({x,z:z-30.5},0);assert.ok(m.chunks.get(10).reachedEnd);
 m.update({x,z:z-26},0);assert.equal(m.chunks.get(10).room.deadEnd,true,'Never erase a watched dead end');
 m.update({x,z:z-26},Math.PI);assert.equal(m.chunks.get(10).room.deadEnd,false);assert.ok(reachable(m,10));
 // Annex route must expire the previous section too.
 const n=new MazeTopology(seed);n.update({x:0,z:n.worldZ(1)+5});const c=n.chunks.get(1);assert.ok(c.room.branch);const prior=n.chunks.get(0).room.turn;
 assert.equal(n.update({x:branchX(c.room)+1,z:n.worldZ(1)-20},0).expired,0);assert.notEqual(n.chunks.get(0).room.turn,prior);
 const nextTurn=n.chunks.get(1).room.turn;n.update({x:0,z:n.worldZ(0)-55},Math.PI);const back=n.chunks.get(0).room;
 assert.equal(n.update({x:branchX(back)+1,z:n.worldZ(0)-39},Math.PI).expired,1);assert.notEqual(n.chunks.get(1).room.turn,nextTurn);
 // Crossing multiple sections without visiting an expiry zone still retires old layouts.
 const p=new MazeTopology(seed),old=p.chunks.get(0).room.turn;p.ensure(1);p.ensure(2);p.ensure(1);assert.notEqual(p.chunks.get(0).room.turn,old);
 const revised=p.chunks.get(0).room.turn;p.ensure(2);p.ensure(1);assert.notEqual(p.chunks.get(0).room.turn,revised);
 for(let i=3;i<100;i++)p.ensure(i);assert.ok(p.history.size<=64&&p.chunks.size<=3);
}
console.log('PASS: 50 seeds, early hidden facility-11 reopening, both annex expiry directions, guaranteed changed recycled layouts and bounded history.');
