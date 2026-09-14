import {meetingFurniture} from './meeting.js';
import {nurseryFurniture} from './nursery.js';
import {cameraPositions} from './surveillance.js';
import {secondLookEligible} from './second-look.js';
// Bounded room topology. Render positions are local; identities survive rebasing.
export const SPAN=64;
export const cellKey=(x,z)=>`${x},${z}`;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function rng(seed){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function recipe(index,seed,revision=0){
 const r=rng((seed^Math.imul(index+101,2654435761)^Math.imul(revision+1,1597334677))>>>0),depth=Math.abs(index);
 const first=['desk','chairs','gallery','crawl','empty','stairs','archive','pit'];
 let kind=depth<8?first[depth]:depth%4===3?['crawl','stairs','pit'][Math.floor(r()*3)]:['desk','empty','chairs','archive','gallery','empty'][Math.floor(r()*6)];
 if(depth>=7&&!['crawl','stairs','pit'].includes(kind)&&rng(seed^Math.imul(index+39,1597334677))()<.24)kind='camera';
 if(depth>=4&&!['crawl','stairs','pit','camera'].includes(kind)&&(depth===4||rng(seed^Math.imul(index+71,2246822519))()<.22))kind='meeting';
 // Mutations retain special-room profiles, keeping floor levels and clearance stable.
 if(revision){const base=recipe(index,seed,0).kind;kind=['crawl','stairs','pit','camera','meeting'].includes(base)?base:['empty','desk','chairs','archive','gallery'][Math.floor(r()*5)];}
 if(depth===8)kind='nursery';
 const w=['nursery','meeting'].includes(kind)?10:kind==='crawl'?4:kind==='pit'?12:8+Math.floor(r()*3)*2,d=['nursery','meeting'].includes(kind)?10:kind==='crawl'||kind==='stairs'?12:8+Math.floor(r()*3)*2;
 const turn=r()>.5?8:-10,poster=['IncidentPoster','WellnessPoster','DirectionPoster'][Math.floor(r()*3)];
 return{index,revision,kind,w,d,turn,narrow:depth>=2&&depth%3===2,ceiling:!['crawl','stairs'].includes(kind)&&depth>=2&&depth%4===2?7+(depth%3):3,hanging:depth>=6&&depth%3===0,branch:!['crawl','stairs','nursery'].includes(kind)&&depth%4!==2,deadEnd:depth>0&&depth%3===1&&revision===0,pitEnd:depth%2===1,poster,ghost:depth>=7&&r()<.42,scatter:r(),light:.7+r()*.3};
}
export function floorHeight(room,z){if(room.kind!=='stairs')return 0;if(z>=6)return 0;if(z>=-6)return Math.floor((6-z)*4)*.045;if(z>=-10)return 2.16;return Math.max(0,2.16-Math.floor((-10-z)*4)*.045);}
export function crawlProfile(room,z){if(room.kind!=='crawl'||z>6||z< -6)return{width:Infinity,height:3};const t=clamp((6-z)/12,0,1);return{width:2.8-1.8*t,height:2.9-1.95*t};}
export function branchX(room){return room.turn>0?-14:12;}
export function roomDoors(room){if(room.kind==='recognition')return[{id:'observation',x:0,z:-6,axis:'z',open:false}];if(room.kind==='elevator')return[];const doors=room.kind==='crawl'?[]:[{id:'exit',x:0,z:-room.d/2,axis:'z',open:false}];if(room.branch){doors.push({id:'side',x:Math.sign(branchX(room))*room.w/2,z:1,axis:'x',open:false},{id:'annex',x:branchX(room)+1,z:-26,axis:'z',open:false});}return doors;}
export function isDoorOpen(chunk,door){return door.id==='exit'?chunk.doorOpen:door.open;}
export function roomCells(room){const cells=new Set();const rect=(x0,z0,x1,z1)=>{for(let x=x0;x<x1;x++)for(let z=z0;z<z1;z++)cells.add(cellKey(x,z));};rect(-room.w/2,-room.d/2,room.w/2,room.d/2);rect(-1,-10,1,6);rect(Math.min(-1,room.turn),-10,Math.max(1,room.turn+2),-8);rect(room.turn,-52,room.turn+2,-8);rect(Math.min(-1,room.turn),-52,Math.max(1,room.turn+2),-50);rect(-1,-58,1,-50);
 if(room.branch){const b=branchX(room);rect(Math.min(b,0),0,Math.max(b+2,0),2);rect(b,-40,b+2,2);rect(b-2,-26,b+4,-18);rect(Math.min(b,room.turn),-40,Math.max(b+2,room.turn+2),-38);const spur=b<0?b-8:b+8;rect(Math.min(b,spur),-16,Math.max(b+2,spur+2),-14);rect(spur-1,-18,spur+3,-12);}
 if(room.kind==='elevator'&&!room.arrival){cells.clear();rect(-6,-6,6,6);return cells;}
 if(room.kind==='recognition'){cells.clear();rect(-6,-6,6,6);rect(-5,-12,5,-6);return cells;}
 if(room.narrow)for(let z=-48;z< -27;z++){if(z>=-40&&z< -38)continue;cells.delete(cellKey(room.turn+1,z));}
 if(room.deadEnd)for(const k of [...cells]){const [x,z]=k.split(',').map(Number);if(z< (room.pitEnd?-31:-33)&&(!room.branch||(x>=room.turn&&x<room.turn+2&&z>=-38)))cells.delete(k);}
 if(room.kind==='pit')for(let x=-2;x<2;x++)for(let z=-2;z<2;z++)cells.delete(cellKey(x,z));return cells;}
function obstacles(room){if(room.kind==='recognition')return[{x:-2.6,z:-1,w:1.25,d:1.25},{x:2.4,z:-1.5,w:.7,d:.7},{x:-3.5,z:-6,w:5,d:.2},{x:3.5,z:-6,w:5,d:.2}];if(room.kind==='meeting')return meetingFurniture(room).map(({x,z,w,d})=>({x,z,w,d}));if(room.kind==='nursery')return nurseryFurniture(room).map(({x,z,w,d})=>({x,z,w,d}));if(room.kind==='camera')return cameraPositions(room).map(p=>({x:p.x,z:p.z,w:.65,d:.65}));if(room.kind==='desk')return[{x:0,z:0,w:1.8,d:1}];if(room.kind==='chairs')return[{x:room.w/2-1.7,z:0,w:1.5,d:2.2}];if(room.kind==='archive')return[{x:-room.w/2+1,z:0,w:1.4,d:4}];return[];}
export class MazeTopology{
 constructor(seed=Date.now(),offset={x:0,z:0},floor=null){this.floor=floor;this.offset=offset;this.seed=seed>>>0;this.origin=0;this.current=0;this.chunks=new Map();this.history=new Map();this.serial=0;this.discovered=0;this.mutations=0;this.maxDepth=0;this.minVisited=0;this.maxVisited=0;this.minMade=Infinity;this.maxMade=-Infinity;this.ensure(0);}
 worldZ(index){return this.offset.z+(this.origin-index)*SPAN;}
 indexAt(z){return this.origin+Math.floor((6-(z-this.offset.z))/SPAN);}
 make(index,revision=0){const room=recipe(index,this.seed,revision);if((this.floor===1&&index===13)||(this.floor===-1&&index===0))Object.assign(room,{kind:"elevator",arrival:this.floor===-1,w:12,d:12,branch:false,narrow:false,deadEnd:false,ceiling:3});if(this.floor===-1&&index===13)Object.assign(room,{kind:"recognition",w:12,d:12,branch:false,narrow:false,deadEnd:false,ceiling:3.4});return{room,cells:roomCells(room),obstacles:[...obstacles(room),...(room.branch?[{x:branchX(room)+2.8,z:-22,w:.8,d:2.8}]:[])],doors:roomDoors(room),doorOpen:room.kind==='crawl',changed:false,token:++this.serial};}
 ensure(index){const added=[],removed=[];for(let i=index-1;i<=index+1;i++){if(!this.chunks.has(i)){const recycled=i>=this.minMade&&i<=this.maxMade;const previous=this.history.get(i),c=this.make(i,previous?previous.revision+1:recycled?1+Math.floor(this.serial/6):0);if(previous){c.room.turn=previous.turn>0?-10:8;this.refresh(c);}this.minMade=Math.min(this.minMade,i);this.maxMade=Math.max(this.maxMade,i);this.chunks.set(i,c);added.push(i);}}
 for(const i of this.chunks.keys())if(Math.abs(i-index)>1){const old=this.chunks.get(i).room;this.history.delete(i);this.history.set(i,{revision:old.revision,turn:old.turn});while(this.history.size>64)this.history.delete(this.history.keys().next().value);this.chunks.delete(i);removed.push(i);}if(index!==this.current){this.discovered++;this.maxDepth=Math.max(this.maxDepth,Math.abs(index));}this.minVisited=Math.min(this.minVisited,index);this.maxVisited=Math.max(this.maxVisited,index);this.current=index;return{added,removed};}
 sample(x,z){const index=this.indexAt(z),chunk=this.chunks.get(index);return{chunk,index,x:x-this.offset.x,z:z-this.worldZ(index)};}
 canStand(x,z,crouched=false){const s=this.sample(x,z);if(!s.chunk)return false;const p=crawlProfile(s.chunk.room,s.z);return p.height>=(crouched?.85:1.85)&&Math.abs(s.x)<p.width/2-.18;}
 canWalk(x,z,crouched=false){const s=this.sample(x,z);if(!s.chunk||!this.canStand(x,z,crouched))return false;const r=.18;for(const[dx,dz]of[[-r,-r],[r,-r],[-r,r],[r,r]]){const p=this.sample(x+dx,z+dz);if(!p.chunk||!this.canStand(x+dx,z+dz,crouched)||!p.chunk.cells.has(cellKey(Math.floor(p.x),Math.floor(p.z))))return false;}
 for(const o of s.chunk.obstacles)if(Math.abs(s.x-o.x)<o.w/2+r&&Math.abs(s.z-o.z)<o.d/2+r)return false;
 for(const door of s.chunk.doors){if(isDoorOpen(s.chunk,door))continue;const across=door.axis==='x'?s.x-door.x:s.z-door.z,along=door.axis==='x'?s.z-door.z:s.x-door.x;if(Math.abs(across)<.24&&Math.abs(along)<1.2)return false;}return true;}
 height(x,z){const s=this.sample(x,z);return s.chunk?floorHeight(s.chunk.room,s.z):0;}
 nearbyDoor(x,z){const s=this.sample(x,z);if(!s.chunk)return null;const door=s.chunk.doors.filter(d=>!isDoorOpen(s.chunk,d)).map(d=>({d,dist:Math.hypot(s.x-d.x,s.z-d.z)})).filter(p=>p.dist<2.1).sort((a,b)=>a.dist-b.dist)[0]?.d;return door?{...s,door}:null;}
 openDoor(x,z){const d=this.nearbyDoor(x,z);if(!d)return false;if(d.door.id==='exit')d.chunk.doorOpen=true;d.door.open=true;return true;}
 refresh(chunk){const old=chunk.doors;chunk.cells=roomCells(chunk.room);chunk.doors=roomDoors(chunk.room);for(const d of chunk.doors)d.open=old?.find(o=>o.id===d.id)?.open||false;chunk.obstacles=[...obstacles(chunk.room),...(chunk.room.branch?[{x:branchX(chunk.room)+2.8,z:-22,w:.8,d:2.8}]:[])];}

 update(player,yaw=null){const index=this.indexAt(player.z);if(index!==this.current)this.pendingExpiry={index:this.current,direction:Math.sign(index-this.current)};const delta=this.ensure(index);let rebased=0;if(Math.abs(index-this.origin)>128){rebased=(index-this.origin)*SPAN;this.origin=index;player.z+=rebased;}
 const s=this.sample(player.x,player.z);let mutated=null;if(s.chunk?.room.deadEnd&&s.z< -30&&!s.chunk.reachedEnd){const old=s.chunk;const next=this.make(index,old.room.revision+1);next.room.turn=old.room.turn;next.room.deadEnd=true;next.room.pitEnd=old.room.pitEnd;next.ghostGone=old.ghostGone;this.refresh(next);next.reachedEnd=true;next.changed=true;next.doorOpen=true;this.chunks.set(index,next);this.mutations++;mutated=index;}
 const retreatHidden=s.z> -28&&s.z< -18&&Math.abs(s.x-(s.chunk?.room.turn+1))<.85&&yaw!==null&&Math.cos(yaw)<-.75;
 if(s.chunk?.reachedEnd&&((s.z> -9&&Math.abs(s.x)<2)||retreatHidden)){const old=s.chunk;const next={...old,room:{...old.room,deadEnd:false},token:++this.serial};this.refresh(next);next.reachedEnd=false;this.chunks.set(index,next);this.mutations++;mutated=index;}

 // At this point the room is behind TWO solid corridor walls, independent of camera angle.
 if(s.chunk&&!s.chunk.changed&&!['elevator','recognition'].includes(s.chunk.room.kind)&&!s.chunk.room.deadEnd&&s.z< -15&&s.z> -24&&Math.abs(s.x-(s.chunk.room.turn+1))<.85){const old=s.chunk;const next=this.make(index,old.room.revision+1);next.room.turn=old.room.turn;next.ghostGone=old.ghostGone;this.refresh(next);next.changed=true;next.doorOpen=old.doorOpen;this.chunks.set(index,next);this.mutations++;mutated=index;}
 let expired=null;const pending=this.pendingExpiry;
 if(pending&&s.chunk){const onMain=Math.abs(s.x-(s.chunk.room.turn+.5))<1.2,onBranch=s.chunk.room.branch&&Math.abs(s.x-(branchX(s.chunk.room)+1))<.85;
 const hidden=(onMain||onBranch)&&(pending.direction>0?s.z< -16&&s.z> -25:s.z> -45&&s.z< -35);
 if(hidden){const old=this.chunks.get(pending.index);if(old){const next=this.make(pending.index,old.room.revision+1);next.room.turn=old.room.turn>0?-10:8;this.refresh(next);this.chunks.set(pending.index,next);expired=pending.index;this.mutations++;}this.pendingExpiry=null;}
 }
 return{...delta,mutated,rebased,expired};}
 summary(){return{facilities:this.maxVisited-this.minVisited+1,roomsExplored:this.discovered+1,depth:this.maxDepth,activeRooms:this.chunks.size,mutations:this.mutations,current:this.current,kind:this.chunks.get(this.current)?.room.kind};}
}

export function flickerLevel(time,index,depth){if(depth<2)return 1;return Math.sin(time*.65+index*1.7)>.87?(Math.sin(time*8.3+index)> .2?.18:.75):1;}

// Wall decor requires a solid backing across its entire width, never an opening.
export function supportsWall(cells,x,z,rotation,halfWidth){
 const nx=Math.sin(rotation),nz=Math.cos(rotation),tx=Math.cos(rotation),tz=-Math.sin(rotation);
 for(let a=-halfWidth;a<=halfWidth+.001;a+=.1){const px=x+tx*a,pz=z+tz*a;
 if(!cells.has(cellKey(Math.floor(px+nx*.25),Math.floor(pz+nz*.25)))||cells.has(cellKey(Math.floor(px-nx*.25),Math.floor(pz-nz*.25))))return false;
 }return true;
}

export function ceilingHeight(room,x,z){return Math.abs(x)<room.w/2&&z>=-room.d/2&&z<room.d/2?(room.ceiling||3):3;}

export function ghostRoom(room){const b=branchX(room);return{x:(b<0?b-8:b+8)+1,z:-15,rotation:b<0?0:Math.PI};}
export function enteredGhostRoom(room,x,z){const p=ghostRoom(room),b=branchX(room),toward=(x-(b+1))*(b<0?-1:1);return toward>1.15&&toward<10&&Math.abs(z-p.z)<3;}
export function isMusicRoom(index,room){return Math.abs(index)%4===1&&!['crawl','stairs','pit','recognition'].includes(room.kind);}
export function findFacility(seed,start,type){
 if(type==='nursery')return 8;
 for(let i=start;i<start+256;i++){const r=recipe(i,seed);if(type==='secondLook'&&secondLookEligible(r,seed)||type==='any'||type===r.kind||type==='music'&&isMusicRoom(i,r)||type==='ghost'&&r.branch&&r.ghost||type==='narrow'&&r.narrow||type==='tall'&&r.ceiling>3||type==='hanging'&&r.ceiling>3&&r.hanging)return i;}
 return null;
}
