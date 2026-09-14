// Facility 10 is the first full, non-dead-end corridor after facility 7.
// Later safe corridors remain seeded; unsuitable rooms cannot consume a band.
export function secondLookEligible(room,seed){
 const depth=Math.abs(room.index);
 let n=(seed^Math.imul(depth+1,2246822519))>>>0;n=Math.imul(n^(n>>>16),3266489917)>>>0;
 return (room.floor===-1||depth>=7)&&!room.deadEnd&&!room.narrow&&!['stairs','elevator','recognition'].includes(room.kind)&&(room.floor===-1||depth===9||n%3!==0);
}
// Corporate advice also appears in ordinary corridors; it is not a sighting marker.
export function lookBackPoster(room,seed){
 const n=(Math.imul(seed^Math.abs(room.index),1597334677)>>>0);
 return (room.floor===-1||Math.abs(room.index)>=4)&&!room.narrow&&!room.deadEnd&&room.kind!=='stairs'&&(secondLookEligible(room,seed)||n%4===0);
}
export class SecondLook{
 constructor(){this.encounter=null;this.offeredThrough=-1;this.lastDepth=-Infinity;}
 prime(room,progress=Math.abs(room.index)){this.encounter={index:room.index,progress,phase:'armed',opacity:0};this.offeredThrough=Math.max(this.offeredThrough,progress);}
 update({room,seed,x,z,yaw,active=true,progress=Math.abs(room.index)}){
  if(!active)return null;
  const depth=progress,onHall=Math.abs(x-(room.turn+1))<=.83;
  let e=this.encounter;
  if(e&&(e.index!==room.index||e.progress!==depth)){this.encounter=null;e=null;}
  if(!e&&depth>this.offeredThrough&&depth-this.lastDepth>=(room.floor===-1?2:5)&&secondLookEligible(room,seed)&&onHall&&z< -23&&z>= -48){this.prime(room,depth);e=this.encounter;}
  if(!e)return null;
  let cue=false;
  const distance=Math.hypot(x-room.turn-1,z+12),facing=(-Math.sin(yaw)*(room.turn+1-x)-Math.cos(yaw)*(-12-z))/Math.max(distance,.001);
  if(e.phase==='armed'&&onHall&&z<=-32&&z>=-48&&facing<-.5){e.phase='waiting';e.opacity=.12;cue=this.lastDepth===-Infinity||((Math.imul(seed^depth,1103515245)>>>0)%3)!==0;}
  // It appears behind the camera, then becomes a sighting as the player turns back.
  if(e.phase==='waiting'&&onHall&&facing>.65){e.phase='seen';e.opacity=.12;this.lastDepth=depth;}
  if(e.phase==='seen'||e.phase==='waiting'){
   if(!onHall||z> -23||z< -49||(e.phase==='seen'&&facing<.25)||distance<=11){e.phase='gone';e.opacity=0;}
   else{const target=.12*Math.min(1,Math.max(0,(distance-11)/8));e.opacity=Math.min(e.opacity,target);}
  }
  return{cue,index:e.index,x:room.turn+1,z:-12,opacity:['waiting','seen'].includes(e.phase)?e.opacity:0,phase:e.phase};
 }
}
