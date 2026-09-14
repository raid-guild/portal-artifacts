import assert from 'node:assert/strict';
import {SecondLook,secondLookEligible} from '../dist/second-look.js';
import {recipe,findFacility,MazeTopology} from '../dist/maze-core.js';
for(let seed=0;seed<60;seed++){
 const i=findFacility(seed,0,'secondLook');assert.ok(i>=7&&i<=9,'First offer no later than facility 10');const room=recipe(i,seed);assert.ok(secondLookEligible(room,seed));
 for(let j=0;j<7;j++)assert.equal(secondLookEligible(recipe(j,seed),seed),false);
 const m=new MazeTopology(seed);m.ensure(i);for(const z of [-24,-36,-12])assert.ok(m.canWalk(room.turn+1,m.worldZ(i)+z),'Full-height traversable hallway');
 const encounter=new SecondLook();const step=(z,yaw,active=true)=>encounter.update({room,seed,x:room.turn+1,z,yaw,active});
 assert.equal(step(-24,Math.PI).opacity,0);assert.equal(step(-36,Math.PI).opacity,0,'Never materialize in an already watched corridor');
 assert.equal(step(-36,0).phase,'waiting');assert.equal(step(-36,Math.PI,false),null,'Map view cannot trigger');
 const seen=step(-36,Math.PI);assert.equal(seen.phase,'seen');assert.ok(step(-26,Math.PI).opacity<seen.opacity);assert.equal(step(-22,Math.PI).opacity,0);assert.equal(step(-36,Math.PI).opacity,0,'No repeated sighting');
 const second=new SecondLook();second.prime(room);second.update({room,seed,x:room.turn+1,z:-36,yaw:0});assert.ok(second.update({room,seed,x:room.turn+1,z:-36,yaw:Math.PI}).opacity>0);assert.equal(second.update({room,seed,x:room.turn+1,z:-36,yaw:0}).opacity,0,'Looking away removes it');
 second.update({room:{...room,index:i+1},seed,x:0,z:0,yaw:0});assert.equal(second.update({room,seed,x:room.turn+1,z:-24,yaw:0}),null,'Revisit never rearms');
}
console.log('PASS: 60 seeds, post-facility-7 eligibility, safe floor, behind-view arming, approach fade, look-away removal, map pause and no repeat.');
const {lookBackPoster}=await import('../dist/second-look.js');
const {supportsWall}=await import('../dist/maze-core.js');
let silent=0,audible=0,ordinary=0;
for(let seed=0;seed<60;seed++){
 const i=findFacility(seed,0,'secondLook'),room=recipe(i,seed),e=new SecondLook();e.lastDepth=0;e.prime(room);
 const args={room,seed,x:room.turn+1,z:-36,yaw:0};
 assert.equal(e.update({...args,active:false}),null);
 const first=e.update(args);if(first.cue)audible++;else silent++;
 assert.equal(e.update(args).cue,false,'Cue only on transition, never every frame');
 assert.equal(e.update({...args,yaw:Math.PI}).cue,false,'Turning back does not replay cue');
 assert.ok(lookBackPoster(room,seed));
 const m=new MazeTopology(seed);
 for(let j=4;j<35;j++){m.ensure(j);const c=m.chunks.get(j);if(lookBackPoster(c.room,seed)){assert.ok(supportsWall(c.cells,c.room.turn+.08,-30,Math.PI/2,.59),'Poster backed by solid wall');if(!secondLookEligible(c.room,seed))ordinary++;}}
}
assert.ok(silent>0&&audible>0&&ordinary>0);
console.log('PASS: one-shot optional cue, map pause, ordinary hallway posters and supported placement.');

// Walk/run through real topology mutations, then turn back. Test side entry too.
for(let seed=0;seed<60;seed++)for(const start of [-10,-39]){
 const m=new MazeTopology(seed),i=9;m.ensure(i);const e=new SecondLook();let waiting=false;
 for(let z=start;z>=-43;z-=.35){
  const room=m.chunks.get(i).room,player={x:room.turn+1,z:m.worldZ(i)+z};m.update(player);
  const sample=m.sample(player.x,player.z),sight=e.update({room:sample.chunk.room,seed,x:sample.x,z:sample.z,yaw:0});
  if(sight?.phase==='waiting')waiting=true;
 }
 assert.ok(waiting,'Running and annex entry both arm after topology mutations');
 const room=m.chunks.get(i).room;
 assert.equal(e.lastDepth,-Infinity,'Unseen offer does not consume sighting cooldown');
 const sight=e.update({room,seed,x:room.turn+1,z:-43,yaw:Math.PI});assert.equal(sight.phase,'seen');assert.ok(sight.opacity>0);assert.equal(e.lastDepth,9);
}
console.log('PASS: first offer by facility 10, real mutation path, running, annex entry and cooldown only on actual sighting.');
let upstairs=0,downstairs=0;
for(let seed=0;seed<60;seed++){
 const upper=new MazeTopology(seed,{x:0,z:0},1),lower=new MazeTopology(seed,{x:0,z:0},-1);
 for(let index=1;index<13;index++){const a=upper.make(index).room,b=lower.make(index).room;if(a.branch&&a.ghost)upstairs++;if(b.branch&&b.ghost)downstairs++;}
 const room=lower.make(0,1).room;room.deadEnd=false;room.narrow=false;
 assert.ok(secondLookEligible(room,seed),'Lower floor sightings do not wait until facility 7');
 const encounter=new SecondLook(),args={room,seed,x:room.turn+1,z:-36};
 encounter.update({...args,yaw:0,progress:2});assert.equal(encounter.update({...args,yaw:Math.PI,progress:2}).phase,'seen');
 encounter.update({...args,yaw:0,progress:2});assert.equal(encounter.update({...args,yaw:0,progress:3}),null,'One-facility breathing room');
 assert.equal(encounter.update({...args,yaw:0,progress:4}).phase,'waiting','A new generation at the same index can offer another sighting');
 assert.equal(encounter.update({...args,yaw:Math.PI,progress:4}).phase,'seen');
 for(const kind of ['elevator','recognition','stairs'])assert.equal(secondLookEligible({...room,kind},seed),false);
}
assert.ok(downstairs>upstairs*2,`${downstairs} lower chair figures vs ${upstairs} upstairs`);
console.log(`PASS: ${downstairs} lower-floor chair offers vs ${upstairs} upstairs; early Goatman, two-facility cooldown, regenerated-room rearming, safe exclusions.`);
