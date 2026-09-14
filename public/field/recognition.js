import * as THREE from 'three';
export class Recognition{
 constructor(props){this.root=new THREE.Group();this.owned=[];this.forms=[];
 const material=(color,metalness=0)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness:.65});this.owned.push(m);return m;};
 const wall=material(0x9b967c),floor=material(0x45483a),brass=material(0xb49b55,.7),dark=material(0x242c25,.3);
 const mesh=(geometry,mat,x,y,z)=>{this.owned.push(geometry);const o=new THREE.Mesh(geometry,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;this.root.add(o);return o;};
 const box=(x,y,z,w,h,d,m)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z);
 box(0,-.1,0,12,.2,12,floor);box(0,3.45,0,12,.1,12,wall);
 for(const x of [-6,6])box(x,1.7,0,.15,3.4,12,wall);
 for(const z of [-6,6]){for(const x of[-3.5,3.5])box(x,1.7,z,5,3.4,.15,wall);box(0,2.9,z,2,1,.15,wall);}
 box(0,-.1,-9,10,.2,6,dark);
 for(const z of[-12])for(const y of[.55,1.15])box(0,y,z,10,.035,.035,brass);
 for(const x of[-5,5])for(const y of[.55,1.15])box(x,y,-9,.035,.035,6,brass);
 for(let x=-5;x<=5;x++)box(x,.57,-12,.04,1.15,.04,dark);
 for(const x of[-5,5])for(let z=-11;z<=-6;z++)box(x,.57,z,.04,1.15,.04,dark);
 box(-2.6,.55,-1,1.1,1.1,1.1,dark);box(-2.6,1.14,-1,1.25,.08,1.25,brass);
 mesh(new THREE.CylinderGeometry(.30,.40,.12,24),brass,-2.6,1.24,-1);mesh(new THREE.CylinderGeometry(.07,.11,.42,16),brass,-2.6,1.5,-1);
 mesh(new THREE.LatheGeometry([new THREE.Vector2(.08,0),new THREE.Vector2(.15,.08),new THREE.Vector2(.31,.27),new THREE.Vector2(.39,.53),new THREE.Vector2(.36,.54),new THREE.Vector2(.28,.28),new THREE.Vector2(.10,.07)],24),brass,-2.6,1.68,-1);
 for(const side of[-1,1]){const h=mesh(new THREE.TorusGeometry(.23,.035,8,24),brass,-2.6+side*.36,2,-1);h.scale.x=.7;}
 const chair=props.getObjectByName('Chair')?.clone();if(chair){chair.position.set(2.4,0,-1.5);chair.rotation.y=Math.PI;this.root.add(chair);}
 const label=(lines,x,y,z,w,h)=>{const c=document.createElement('canvas');c.width=1536;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#171e18';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#c6b580';ctx.textAlign='center';ctx.font='70px monospace';lines.forEach((t,i)=>ctx.fillText(t,768,180+i*95));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:t});this.owned.push(t,m);return mesh(new THREE.PlaneGeometry(w,h),m,x,y,z);};
 label(['YOUR CONTRIBUTION','HAS BEEN RECOGNIZED'], -3.4,2.55,-5.90,4.4,1.2);
 label(['WE THANK YOU','FOR YOUR SACRIFICE'],3.4,2.5,-5.90,4.3,1.3);
 label(['OBSERVATION'],0,2.8,-5.90,1.85,.44);label(['CONTINUITY','EXEMPLARY SERVICE'],-2.6,.68,-.44,.95,.4);
 const doorMat=material(0x58614c,.3);this.pivot=new THREE.Group();this.pivot.position.set(-1,0,-6);this.root.add(this.pivot);const door=box(0,1.2,0,2,2.4,.11,doorMat);this.root.remove(door);door.position.set(1,1.2,0);this.pivot.add(door);const handle=box(0,0,0,.06,.25,.06,brass);this.root.remove(handle);handle.position.set(1.8,1.1,.1);this.pivot.add(handle);
 this.light=new THREE.PointLight(0xe3d6a3,16,15,1.6);this.light.position.set(0,3,0);this.root.add(this.light);
 this.voidRoot=new THREE.Group();this.voidRoot.name='ObservationVoid';this.voidRoot.visible=false;this.root.add(this.voidRoot);
 const black=new THREE.MeshBasicMaterial({color:0x02030a,side:THREE.BackSide,fog:false});this.owned.push(black);const sky=mesh(new THREE.SphereGeometry(95,24,16),black,0,0,-40);sky.castShadow=false;sky.receiveShadow=false;this.voidRoot.add(sky);
 for(let i=0;i<18;i++){
  const g=new THREE.Group();g.position.set(Math.sin(i*2.4)*(10+i*.65),Math.cos(i*1.7)*9-2,-26-i*2.6);this.voidRoot.add(g);
  const m=new THREE.LineBasicMaterial({color:new THREE.Color().setHSL(.47+i*.019,.45,.38),transparent:true,opacity:.45,fog:false});this.owned.push(m);
  for(let j=0;j<3;j++){const base=new THREE.BoxGeometry(4+j*3,3+j*2,5+j*3),geometry=new THREE.EdgesGeometry(base);base.dispose();this.owned.push(geometry);const frame=new THREE.LineSegments(geometry,m);frame.rotation.z=j*.14;g.add(frame);}
  this.forms.push({g,m,i});
 }
 const treadGeometry=new THREE.BoxGeometry(2.4,.08,.65),treadMaterial=new THREE.MeshBasicMaterial({color:0x647689,fog:false,transparent:true,opacity:.40});this.owned.push(treadGeometry,treadMaterial);const stairs=new THREE.InstancedMesh(treadGeometry,treadMaterial,160),dummy=new THREE.Object3D();for(let i=0;i<160;i++){const a=i*.13;dummy.position.set(Math.cos(a)*8,-16+i*.18,-42+Math.sin(a)*8);dummy.rotation.y=-a;dummy.updateMatrix();stairs.setMatrixAt(i,dummy.matrix);}this.voidRoot.add(stairs);this.stairs=stairs;
 }
 update(time,occupied=false,doorOpen=false){this.voidRoot.visible=occupied&&doorOpen;if(!this.voidRoot.visible)return;for(const {g,m,i} of this.forms){g.rotation.x=Math.sin(time*.035+i)*.35;g.rotation.y=time*.018*(i%2?1:-1)+i;g.scale.y=1+Math.sin(time*.045+i)*.3;m.color.setHSL(.59+Math.sin(time*.025+i*.3)*.20,.48,.38);m.opacity=.3+.12*Math.sin(time*.08+i);}this.stairs.rotation.y=Math.sin(time*.022)*.15;}
 dispose(){this.stairs.dispose();for(const o of this.owned)o.dispose();this.root.removeFromParent();}
}
