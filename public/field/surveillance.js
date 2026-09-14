// Shared positions keep the physical stands and collision in agreement.
export function cameraPositions(room){
 if(room.kind!=='camera')return[];
 const x=room.w/2-.85,z=room.d/2-.85;
 return room.scatter<.45?[{x:0,z:0,height:1.8}]:[{x:-x,z:-z,height:2.15},{x,z:-z,height:2.15},{x:-x,z,height:2.15}];
}
export function trackAngle(current,target,dt,speed=1.05){
 const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));
 return current+Math.sign(delta)*Math.min(Math.abs(delta),Math.max(0,dt)*speed);
}
export function cameraBlink(time,index){const period=1.8+(index%3)*.23;return ((time+index*.61)%period+period)%period<.14;}
