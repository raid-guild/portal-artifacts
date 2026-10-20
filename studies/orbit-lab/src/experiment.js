import { createDimmerVisual, createEclipseVisual, createStudyVisual } from './study-visuals.js';
import * as THREE from 'three';
import { BLOB_RADIUS, sweptCircleRect } from './level.js';
import { acceleration } from './physics.js';
import { rotateVelocity, segmentDistance } from './studies.js';

export class Experiment {
 constructor(scene,audio) {this.scene=scene;this.audio=audio;this.group=new THREE.Group();scene.add(this.group);this.items=[];}
 clear() { for(const item of [...this.group.children]) {this.group.remove(item);item.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});} this.items=[];this.held=null;this.cooldown=0;this.brightness=1;this.layers=new Set();this.beat=-1;this.time=0; }
 marker(x,y,r,color,solid=false) {
  const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:solid?1:.8});
  const mesh=new THREE.Mesh(solid?new THREE.CircleGeometry(r,48):new THREE.RingGeometry(r-.035,r+.035,64),material);mesh.position.set(x,y,1.4);this.group.add(mesh);
  return mesh;
 }
 reset(demo) {
  this.clear();this.kind=demo.mechanic;this.walls=demo.level.walls;
  const add=(x,y,r,color,solid=false)=>{
   const glowing=['power','dimmer','giant','chaser','clock','portals'].includes(this.kind);
   const mesh=this.kind==='dimmer'?createDimmerVisual(.22):this.kind==='eclipse'?createEclipseVisual(r):glowing?createStudyVisual(['power','dimmer'].includes(this.kind)?.22:r,color,this.kind==='portals'):this.marker(x,y,r,color,solid);
   if(glowing||this.kind==='eclipse'){mesh.position.set(x,y,1.4);this.group.add(mesh);}
   const item={x,y,r,mesh};this.items.push(item);return item;
  };
  if(['boost','sticky','eclipse'].includes(this.kind)) add(-3,0,this.kind==='eclipse'?.45:.85,this.kind==='eclipse'?0x131423:this.kind==='boost'?0x76e9e3:0xffd98b,this.kind==='eclipse');
  if(['power','dimmer','sound'].includes(this.kind)) for(let i=0;i<3;i++) add(-5+i*5,0,.65,this.kind==='power'?0xdffff9:this.kind==='dimmer'?0xbfa5ff:[0x76e9e3,0xbfa5ff,0xffd98b][i]);
  if(this.kind==='power') this.brightness=.24;
  if(this.kind==='giant') {const giant=demo.giant||{x:0,y:0,radius:1.6,strength:22};const item=add(giant.x,giant.y,giant.radius,0xff8a32,true);item.strength=giant.strength;}
  if(this.kind==='chaser') add(-6,-4,.3,0xff8a32,true);
  if(this.kind==='clock') for(let i=0;i<3;i++){const item=add(0,0,.35,0xff8a32,true);item.phase=i*Math.PI*2/3;} 
  if(this.kind==='clock') this.marker(0,0,3.5,0x614d3d);
  if(this.kind==='hidden') {const item=add(0,-2,1,0x976b64,true);item.mesh.visible=false;}
  if(this.kind==='portals'){add(-3,0,1,0x76e9e3);add(6,-3,1,0x76e9e3);this.marker(6,-1.6,.12,0x76e9e3,true);}
  if(this.kind==='boost') {this.marker(-2.8,0,.13,0x76e9e3,true);this.marker(-2.5,0,.09,0x76e9e3,true);}
 }
 updateVisuals(position,time,brightness=1,pixelRatio=1) {
  for(const item of this.items){
   item.mesh.userData.animate?.(time,pixelRatio);
   if(this.kind==='hidden'){
    const d=Math.hypot(position.x-item.x,position.y-item.y);
    const blocked=this.walls.some(w=>sweptCircleRect(position,item,0,w)!==null);
    // Match the actual orb light's 50-unit range and inverse-square falloff.
    const attenuation=Math.max(0,1-(d/50)**4)**2;
    const illumination=85*Math.max(0,brightness)*attenuation/(1+d*d);
    item.mesh.visible=illumination>.15&&!blocked;
    item.mesh.material.opacity=Math.min(1,Math.max(.35,illumination*.6));
   }
   if(this.kind==='sound'&&item.used)item.mesh.scale.setScalar(1+.12*Math.exp(-((time*4)%1)*4));
  }
 }
 release(body) {if(!this.held)return; const {vx,vy}=this.held;body.velocity.set(vx,vy,0);this.held=null;this.cooldown=this.time+.8;this.brightness=1;this.audio.tone(440,0,.4,.08);}
 step(body,before,time,wells,mode,die) {
  this.time=time;
  if(this.held) {body.position.set(this.held.x,this.held.y,0);body.velocity.setZero();body.force.setZero();if(this.kind==='eclipse')this.brightness=Math.max(.025,1-(time-this.held.at)/3);return;}
  const p=body.position;
  for(let i=0;i<this.items.length;i++) {
   const item=this.items[i];if(item.used)continue;
   if(this.kind==='clock'&&i<3) {item.x=Math.cos(time*.65+item.phase)*3.5;item.y=Math.sin(time*.65+item.phase)*3.5;}
   if(this.kind==='chaser') {const dx=p.x-item.x,dy=p.y-item.y,d=Math.hypot(dx,dy)||1;const a=acceleration(item,wells,time,mode);item.vx=(item.vx||0)+(dx/d*.55+a.x*.3)/120;item.vy=(item.vy||0)+(dy/d*.55+a.y*.3)/120;const speed=Math.hypot(item.vx,item.vy);if(speed>1.7){item.vx*=1.7/speed;item.vy*=1.7/speed;}item.x+=item.vx/120;item.y+=item.vy/120;item.x=Math.max(-14,Math.min(14,item.x));item.y=Math.max(-7,Math.min(7,item.y));}
   item.mesh.position.set(item.x,item.y,1.4);
   if(this.kind==='giant') {const dx=item.x-p.x,dy=item.y-p.y,q=dx*dx+dy*dy+2;body.velocity.x+=dx*item.strength/Math.pow(q,1.5)/120;body.velocity.y+=dy*item.strength/Math.pow(q,1.5)/120;}
   
   const hit=segmentDistance(before,p,item)<item.r+BLOB_RADIUS;
   if(['giant','chaser','hidden'].includes(this.kind)||(this.kind==='clock'&&i<3)){if(hit){die('hazard');return;}continue;}
   if(!hit||time<this.cooldown)continue;
   if(['sticky','eclipse'].includes(this.kind)) {this.held={x:item.x,y:item.y,vx:body.velocity.x,vy:body.velocity.y,at:time};body.position.set(item.x,item.y,0);body.velocity.setZero();this.audio.tone(196,0,.8,.08);return;}
   if(this.kind==='boost'){body.velocity.set(15,0,0);this.cooldown=time+1;this.audio.tone(660,0,.35,.08);}
   if(['power','dimmer'].includes(this.kind)) {item.used=true;item.mesh.visible=false;this.brightness=Math.max(.15,Math.min(1.5,this.brightness+(this.kind==='power'?.4:-.28)));this.audio.tone(this.kind==='power'?523:196,0,.5,.08);}
   if(this.kind==='sound'){item.used=true;item.mesh.material.color.setHex(0xffffff);this.layers.add(i);this.audio.gateAcquire?.(i);}
   if(this.kind==='portals') {const target=this.items[1-i],angle=i===0?Math.PI/2:-Math.PI/2,v=rotateVelocity({x:body.velocity.x,y:body.velocity.y},angle),speed=Math.hypot(v.x,v.y)||1;body.position.set(target.x+v.x/speed*1.4,target.y+v.y/speed*1.4,0);body.velocity.set(v.x,v.y,0);this.cooldown=time+.8;this.audio.tone(330,0,.6,.08);return 'teleport';}
  }
  const beat=Math.floor(time*4);if(beat!==this.beat){this.beat=beat;for(const layer of this.layers)this.audio.gateBeat?.(layer,beat);}
 }
}
