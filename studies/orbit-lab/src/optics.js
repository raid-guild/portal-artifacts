import * as THREE from 'three';
import { sweptCircleRect } from './level.js';
export const OPTICAL_STUDIES=new Set(['filters','lens','prism']);
export const SPECTRUM=[0xff3e36,0xff8c32,0xffdf54,0x68ee79,0x44cde5,0x657cff,0xc171ff];
export function transmittedDirection(source,device,turn=0){const a=Math.atan2(device.y-source.y,device.x-source.x)+turn;return {x:Math.cos(a),y:Math.sin(a)};}
export function beamWidth(distance,aperture=1.8,focus=5){return distance<focus?aperture*(1-distance/focus)+.1:.1+(distance-focus)*.3;}
export function lightBlocked(source,target,walls){return walls.some(w=>sweptCircleRect(source,target,0,w)!==null);}
const vertexShader='varying vec2 world; void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xy;gl_Position=projectionMatrix*viewMatrix*p;}';
const fragmentShader=`varying vec2 world; uniform vec2 origin; uniform vec2 direction; uniform vec3 tint; uniform float strength; uniform float aligned; uniform float aperture; uniform float focus; uniform float spread; uniform vec4 walls[32]; uniform int wallCount;
 void main(){vec2 delta=world-origin;
 float x=dot(delta,direction);float y=abs(dot(delta,vec2(-direction.y,direction.x)));
 if(aligned>.5){
  // Start on the fixed glass plane, not a plane rotating around its center.
  x=delta.x*sign(direction.x);
  y=abs(delta.y-x*direction.y/max(abs(direction.x),.08));
 }
 if(x<.015||x>19.)discard;
 float width=focus>0. ? (x<focus ? aperture*(1.-x/focus)+.10 : .10+(x-focus)*.30) : aperture+x*spread;
 float edge=1.-smoothstep(width*.4,width,y);if(edge<=0.)discard;
 for(int i=0;i<32;i++){if(i>=wallCount)break;vec4 w=walls[i];vec2 d=world-origin;d=vec2(abs(d.x)<.00001?.00001:d.x,abs(d.y)<.00001?.00001:d.y);vec2 a=(w.xy-w.zw*.5-origin)/d,b=(w.xy+w.zw*.5-origin)/d;vec2 lo=min(a,b),hi=max(a,b);float nearT=max(lo.x,lo.y),farT=min(hi.x,hi.y);if(farT>=max(nearT,.001)&&nearT<.999&&farT>0.)discard;}
 float fade=pow(1.-x/19.,1.2);float concentration=focus>0.?min(2.5,1.5/max(width,.4)):1.;gl_FragColor=vec4(tint,edge*fade*strength*concentration);}`;
export class OpticsStudy {
 constructor(scene){this.group=new THREE.Group();scene.add(this.group);this.beams=[];this.devices=[];}
 clear(){for(const object of [...this.group.children]){object.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.group.remove(object);}this.beams=[];this.devices=[];}
 beam(device,color,aperture,focus=0,spread=.12,turn=0){
  const walls=Array.from({length:32},(_,i)=>{const w=this.level.walls[i];return new THREE.Vector4(w?.x||0,w?.y||0,w?.w||0,w?.h||0);});
  const material=new THREE.ShaderMaterial({uniforms:{origin:{value:new THREE.Vector2(device.x,device.y)},direction:{value:new THREE.Vector2(1,0)},tint:{value:new THREE.Color(color)},strength:{value:0},aligned:{value:this.kind==='prism'?0:1},aperture:{value:aperture},focus:{value:focus},spread:{value:spread},walls:{value:walls},wallCount:{value:Math.min(32,this.level.walls.length)}},vertexShader,fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(32,18),material);mesh.position.z=-.84;this.group.add(mesh);this.beams.push({device,material,turn});
 }
 device(x,y,color,kind,height=4){
  const device={x,y,height};this.devices.push(device);
  // This invisible shadow caster removes the original unfiltered light behind the aperture.
  const proxy=new THREE.Mesh(new THREE.BoxGeometry(.08,height,4),new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}));proxy.position.set(x,y,1);proxy.castShadow=true;this.group.add(proxy);
  let geometry;
  if(kind==='prism'){const shape=new THREE.Shape();shape.moveTo(-.8,-1.6);shape.lineTo(.95,0);shape.lineTo(-.8,1.6);shape.closePath();geometry=new THREE.ShapeGeometry(shape);}
  else if(kind==='lens'){const shape=new THREE.Shape();shape.moveTo(0,-2);shape.quadraticCurveTo(1,0,0,2);shape.quadraticCurveTo(-1,0,0,-2);geometry=new THREE.ShapeGeometry(shape,32);}
  else geometry=new THREE.PlaneGeometry(.18,height);
  const glass=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide}));glass.position.set(x,y,1.6);this.group.add(glass);
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity:.85}));edges.position.copy(glass.position);this.group.add(edges);
  return device;
 }
 reset(demo){
  this.clear();this.kind=demo.mechanic;this.level=demo.level;
  if(this.kind==='filters')for(const [i,color] of [0xff5b86,0x72ffac,0x77a5ff].entries()){const device=this.device(0,(i-1)*4,color,'filter',2.6);this.beam(device,color,1.3,0,.16);}
  if(this.kind==='lens'){const device=this.device(0,0,0xb8edff,'lens');this.beam(device,0xe3f8ff,1.9,5);}
  if(this.kind==='prism'){const device=this.device(0,0,0xe8e8ff,'prism',3.2);SPECTRUM.forEach((color,i)=>this.beam(device,color,.12,0,.045,(i-3)*.085+.18));}

 }
 update(source,brightness=1){
  if(!OPTICAL_STUDIES.has(this.kind))return;
  for(const beam of this.beams){const d=Math.hypot(source.x-beam.device.x,source.y-beam.device.y),direction=transmittedDirection(source,beam.device,beam.turn);beam.material.uniforms.direction.value.set(direction.x,direction.y);const incidence=this.kind==='prism'?1:THREE.MathUtils.smoothstep(Math.abs(direction.x),.08,.35);beam.material.uniforms.strength.value=d<.8?0:Math.min(.85,5*brightness/(2+d))*incidence*(lightBlocked(source,beam.device,this.level.walls)?0:1);}

 }
}
