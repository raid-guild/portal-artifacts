import * as THREE from 'three';
import {ElevatorState,elevatorReveal,ELEVATOR_REVEAL_Z} from './elevator-state.js';
export class Elevator{
 constructor(props,arrival=false){
 this.state=new ElevatorState(arrival);this.root=new THREE.Group();this.owned=[];
 const mat=(color,metalness=0)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.75,metalness});this.owned.push(m);return m;};
 const steel=mat(0x62675e,.55),wall=mat(0x45483d),trim=mat(0x23291f),lamp=mat(0xb9b796);lamp.emissive.set(0xb9b796);lamp.emissiveIntensity=.5;
 const box=(x,y,z,w,h,d,m)=>{const g=new THREE.BoxGeometry(w,h,d);this.owned.push(g);const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;this.root.add(o);return o;};
 box(-1.6,1.5,0,.28,3,3.5,wall);box(1.6,1.5,0,.28,3,3.5,wall);box(0,1.5,-1.6,3.5,3,.28,wall);box(0,2.95,0,3.5,.1,3.5,wall);
 box(-1.25,1.5,1.6,.65,3,.28,steel);box(1.25,1.5,1.6,.65,3,.28,steel);box(0,2.65,1.6,2,.7,.28,steel);
 box(0,.015,0,2.95,.03,2.95,trim);box(0,2.85,0,1.2,.04,.6,lamp);
 this.left=box(-.46,1.15,1.62,.92,2.3,.08,steel);this.right=box(.46,1.15,1.62,.92,2.3,.08,steel);
 const label=(text,x,y,z,rotation=0,w=1.5,h=.34)=>{const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#171b16';ctx.fillRect(0,0,768,192);ctx.fillStyle='#c5c5a5';ctx.font='44px monospace';ctx.textAlign='center';ctx.fillText(text,384,114);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:t});const g=new THREE.PlaneGeometry(w,h);this.owned.push(t,m,g);const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.rotation.y=rotation;this.root.add(o);};
 label(arrival?'FLOOR -01':'FLOOR 01',0,2.53,1.76);label('DOWN ONLY',0,2.85,1.76,0,1.4,.22);
 box(1.23,1.25,1.79,.17,.28,.07,trim);box(1.23,1.28,1.84,.06,.06,.02,lamp);
 box(1.23,1.2,1.405,.22,.38,.045,trim);label('DESCEND',1.25,1.6,1.37,Math.PI,.46,.18);box(1.23,1.2,1.37,.07,.07,.025,lamp);
 this.light=new THREE.PointLight(0xd5d2aa,3,5,1.5);this.light.position.set(0,2.6,0);this.root.add(this.light);
 this.goatMaterials=[];this.goat=props.getObjectByName('Goatman')?.clone();if(this.goat&&!arrival){this.goat.scale.multiplyScalar(.88);this.goat.position.set(0,0,ELEVATOR_REVEAL_Z);this.goat.rotation.y=Math.PI;this.goat.traverse(o=>{if(o.isMesh){const make=m=>{const c=m.clone();c.transparent=true;c.opacity=0;c.depthWrite=false;this.goatMaterials.push(c);this.owned.push(c);return c;};o.material=Array.isArray(o.material)?o.material.map(make):make(o.material);}});this.root.add(this.goat);}else this.goat=null;
 if(this.goat)this.goat.visible=false;
 }
 update(dt){const descend=this.state.update(dt);this.left.position.x=-.46-this.state.open*.92;this.right.position.x=.46+this.state.open*.92;if(this.goat){const reveal=elevatorReveal(this.state.phase,this.state.open,this.state.time);this.goat.visible=reveal.opacity>0;this.goat.position.x=reveal.offset;for(const material of this.goatMaterials)material.opacity=reveal.opacity;}this.light.intensity=this.state.phase==='travel'?1.8:3;return descend;}
 dispose(){for(const o of this.owned)o.dispose();this.root.removeFromParent();}
}
