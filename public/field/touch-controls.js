// Each gesture owns one pointer, so two thumbs can move and look independently.
export function bindTouchControls({pad,stick,world,onMove,onLook,canLook,onGesture=()=>{}}){
 let moveId=null,lookId=null,last=null;
 const move=e=>{const b=pad.getBoundingClientRect(),radius=b.width*.32,dx=e.clientX-b.left-b.width/2,dy=e.clientY-b.top-b.height/2,length=Math.hypot(dx,dy),scale=Math.max(radius,length);const x=dx/scale,y=dy/scale;
 stick.style.transform=`translate(${x*radius}px,${y*radius}px)`;onMove(length<radius*.12?0:x,length<radius*.12?0:-y);};
 pad.addEventListener('pointerdown',e=>{if(moveId!==null||!canLook())return;e.preventDefault();moveId=e.pointerId;pad.setPointerCapture(moveId);onGesture();move(e);});
 pad.addEventListener('pointermove',e=>{if(e.pointerId===moveId){e.preventDefault();move(e);}});
 const stopMove=e=>{if(e.pointerId!==moveId)return;moveId=null;stick.style.transform='translate(0px,0px)';onMove(0,0);};
 for(const name of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(name,stopMove);
 world.addEventListener('pointerdown',e=>{if(!canLook()||lookId!==null)return;e.preventDefault();lookId=e.pointerId;last={x:e.clientX,y:e.clientY};world.setPointerCapture(lookId);onGesture();});
 world.addEventListener('pointermove',e=>{if(e.pointerId!==lookId||!last)return;e.preventDefault();onLook(e.clientX-last.x,e.clientY-last.y);last={x:e.clientX,y:e.clientY};});
 const stopLook=e=>{if(e.pointerId===lookId){lookId=null;last=null;}};
 for(const name of ['pointerup','pointercancel','lostpointercapture'])world.addEventListener(name,stopLook);
 return{reset(){moveId=null;lookId=null;last=null;stick.style.transform='translate(0px,0px)';onMove(0,0);}};
}
