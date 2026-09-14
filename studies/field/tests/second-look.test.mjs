import assert from 'node:assert/strict';
import {SecondLook,secondLookEligible} from '../dist/second-look.js';
import {recipe,findFacility,MazeTopology} from '../dist/maze-core.js';
for(let seed=0;seed<60;seed++){
 const i=findFacility(seed,0,'secondLook');assert.ok(i>=7&&i<256);const room=recipe(i,seed);assert.ok(secondLookEligible(room,seed));
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
