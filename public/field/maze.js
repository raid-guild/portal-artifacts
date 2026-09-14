import * as THREE from 'three';
import {cameraPositions,trackAngle,cameraBlink} from './surveillance.js';
import {SecondLook,secondLookEligible} from './second-look.js';
import {MazeTopology,cellKey,floorHeight,crawlProfile,flickerLevel,branchX,isDoorOpen,supportsWall,ceilingHeight,ghostRoom,enteredGhostRoom} from './maze-core.js';
const unitBox=new THREE.BoxGeometry(1,1,1),dark=new THREE.MeshStandardMaterial({color:0x252923,roughness:.9}),shaft=new THREE.MeshBasicMaterial({color:0x050605}),rail=new THREE.MeshStandardMaterial({color:0x696752,roughness:.65,metalness:.5});
export class EndlessMaze{
 constructor(scene,kit,props,seed,offset={x:0,z:0}){this.secondLook=new SecondLook();this.entranceAttached=!!(offset.x||offset.z);this.scene=scene;this.kit=kit;this.props=props;this.model=new MazeTopology(seed,offset);this.groups=new Map();this.root=new THREE.Group();scene.add(this.root);this.lamps=[];for(let i=0;i<4;i++){const l=new THREE.PointLight(0xe6e2b6,6,11,1.6);scene.add(l);if(i===0){l.castShadow=true;l.shadow.mapSize.set(512,512);l.shadow.bias=-.003;l.shadow.camera.near=.15;l.shadow.camera.far=15;}this.lamps.push(l);}this.sync();this.watcher=this.props.getObjectByName('Goatman')?.clone();if(this.watcher){this.watcherMaterials=[];const materials=new Map();this.watcher.traverse(o=>{if(o.isMesh){const clone=source=>{if(!materials.has(source)){const m=source.clone();m.transparent=true;m.opacity=0;m.depthWrite=false;m.fog=false;if(m.emissiveIntensity>0)m.emissiveIntensity=Math.min(m.emissiveIntensity,.45);else{m.color.lerp(new THREE.Color(0x686c57),.55);m.emissive.set(0x272b20);m.emissiveIntensity=.2;}materials.set(source,m);this.watcherMaterials.push(m);}return materials.get(source);};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);o.castShadow=false;}});this.watcher.visible=false;this.watcher.rotation.y=Math.PI;this.root.add(this.watcher);}}
 addAsset(group,name,x,z,y=0,rot=0,scale=[1,1,1]){const source=this.kit.getObjectByName(name)||this.props.getObjectByName(name);if(!source)throw Error('Missing asset '+name);const o=source.clone();o.position.set(x,y,z);o.rotation.y=rot;o.scale.set(...scale);group.add(o);return o;}
 box(group,x,y,z,w,h,d,mat=dark){const o=new THREE.Mesh(unitBox,mat);o.position.set(x,y,z);o.scale.set(w,h,d);group.add(o);return o;}
 batch(group){group.updateMatrixWorld(true);const batches=new Map();group.traverse(o=>{if(!o.isMesh||o.userData.dynamic)return;const id=o.geometry.uuid+o.material.uuid;let b=batches.get(id);if(!b){b={geometry:o.geometry,material:o.material,matrices:[]};batches.set(id,b);}b.matrices.push(o.matrixWorld.clone());});const out=new THREE.Group();const glows=[];for(const b of batches.values()){const mesh=new THREE.InstancedMesh(b.geometry,b.material.emissiveIntensity>0?b.material.clone():b.material,b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));if(mesh.material!==b.material){mesh.material.userData.mazeOwned=true;glows.push({material:mesh.material,base:mesh.material.emissiveIntensity});}mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();out.add(mesh);}out.userData.glows=glows;return out;}
 build(chunk){const r=chunk.room,raw=new THREE.Group(),doorGroup=new THREE.Group(),fixtures=[],doors=[],cameras=[];let ghost=null;
 const add=(name,x,z,y=0,rot=0,scale)=>{
 if(name==='Portrait'||name.endsWith('Poster')){const source=this.props.getObjectByName(name),size=new THREE.Box3().setFromObject(source).getSize(new THREE.Vector3());if(!supportsWall(chunk.cells,x,z,rot,size.x*(scale?.[0]||1)/2+.04))return null;}
 return this.addAsset(raw,name,x,z,y,rot,scale);
 };
 const has=(x,z)=>chunk.cells.has(cellKey(x,z))||(z===6&&x>=-1&&x<1)||(z===-59&&x>=-1&&x<1);
 for(const cell of chunk.cells){const[x,z]=cell.split(',').map(Number),f=floorHeight(r,z+.5),height=ceilingHeight(r,x+.5,z+.5),crawl=r.kind==='crawl'&&z>=-6&&z<6;
 if(!crawl){if(!(r.kind==='stairs'&&(z>=-6||z< -10&&z>=-22)))add('Floor',x+.5,z+.5,f);add('Ceiling',x+.5,z+.5,f+height-3);}
 if(((x%3===1&&z%3===1&&z>=-6)||(x===r.turn&&z%7===0)||(x===0&&z===-31)||(r.branch&&x===branchX(r)&&z%7===0)||(r.branch&&z===-39&&x%7===0))&&! (secondLookEligible({...r,deadEnd:false},this.model.seed)&&x===r.turn&&z> -23&&z< -8)){const suspended=r.hanging&&height>3,drop=suspended?height-3.5:0;
 add('Fixture',x+.5,z+.5,f+height-3-drop);
 if(suspended)for(const dz of[-.32,.32])this.box(raw,x+.5,f+height-drop/2,z+.5+dz,.022,drop,.022,rail);
 fixtures.push(new THREE.Vector3(x+.5,f+height-drop-.35,z+.5));}
 for(const[dx,dz,rot]of[[0,-1,0],[1,0,-Math.PI/2],[0,1,Math.PI],[-1,0,Math.PI/2]]){if(has(x+dx,z+dz)){const neighbor=ceilingHeight(r,x+dx+.5,z+dz+.5);if(height>neighbor)this.box(raw,x+.5+dx*.5,f+(height+neighbor)/2,z+.5+dz*.5,dx?.12:1,height-neighbor,dz?.12:1,dark);continue;}if(crawl)continue;
 const pit=(r.kind==='pit'&&Math.abs(x+dx+.5)<2&&Math.abs(z+dz+.5)<2)||(r.deadEnd&&r.pitEnd&&z===-31&&dz===-1);
 if(pit){this.box(raw,x+.5+dx*.5,-10,z+.5+dz*.5,dx?.1:1,20,dz?.1:1,shaft);this.box(raw,x+.5+dx*.5,1,z+.5+dz*.5,dx?.035:1,.035,dz?.035:1,rail);if((x+z)%2===0)this.box(raw,x+.5+dx*.5,.5,z+.5+dz*.5,.03,1,.03,rail);}
 else add('Wall',x+.5+dx*.5,z+.5+dz*.5,f,rot,[1,height/3,1]);
 }
 }
 if(r.kind==='crawl'){for(let z=-6;z<6;z++){const p=crawlProfile(r,z+.5);for(const sign of[-1,1]){add('Floor',sign*p.width/4,z+.5,0,0,[p.width/2,1,1]);add('Ceiling',sign*p.width/4,z+.5,0,0,[p.width/2,p.height/3,1]);add('Wall',sign*(p.width/2+.05),z+.5,0,sign<0?Math.PI/2:-Math.PI/2,[1,p.height/3,1]);}if(z%4===0)add('Fixture',0,z+.5,p.height-3,0,[.7,1,.7]);}}
 if(r.kind==='stairs'){// Four risers per meter: actual treads, with a matching continuous eye-height profile.
 for(let z=6;z> -22;z-=.25){const x=z>=-10?0:r.turn+1;const y=floorHeight(r,z-.125);if(y<=0)continue;this.box(raw,x,y-.06,z-.125,z>=-6?r.w:1.98,.12,.25,rail);}}
 if(r.kind==='pit')this.box(raw,0,-24,0,4,.1,4,shaft);
 if(r.kind==='desk'){add('Desk',0,0);add('Chair',0,1.05,0,Math.PI);}
 if(r.kind==='chairs'){for(let i=0;i<8;i++){const o=add('Chair',r.w/2-1.7+(i%2)*.22,-.5+Math.floor(i/4)*.55,(i%4)*.31,(i%2?-.16:.12));if(i===7)o.rotation.z=.3;}}
 if(r.kind==='archive')for(let i=0;i<5;i++)add('Cabinet',-r.w/2+.85,-1.6+i*.8,0,Math.PI/2);
 if(r.kind==='gallery'){for(let i=0;i<3;i++)add('Portrait',-r.w/2+.085,-2+i*2,1,Math.PI/2);}
 if(r.kind!=='crawl'){add(r.poster,r.w/2-.09,-1,1, -Math.PI/2);add('Portrait',-r.w/4,-r.d/2+.08,.9);}
 add('DirectionPoster',r.turn+(r.turn>0?1.92:.08),-18,1,r.turn>0?-Math.PI/2:Math.PI/2);
 if(r.branch){const b=branchX(r);for(let i=0;i<3;i++)add('Cabinet',b+2.8,-23+i*.85,0,-Math.PI/2);add('WellnessPoster',b-1.92,-22,1,Math.PI/2);add('Portrait',b-1,-25.92,.9);const seat=ghostRoom(r);add('Chair',seat.x,seat.z,0,seat.rotation);
 if(r.ghost&&!chunk.ghostGone&&this.props.getObjectByName('SeatedShadow')){ghost=this.props.getObjectByName('SeatedShadow').clone();ghost.position.set(seat.x,0,seat.z);ghost.rotation.y=seat.rotation;
 const material=new THREE.MeshStandardMaterial({color:0x0c1013,roughness:1,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide});material.userData.mazeOwned=true;
 ghost.traverse(o=>{if(o.isMesh){o.material=material;o.castShadow=false;}});ghost.userData.material=material;ghost.userData.baseX=seat.x;}
 }
 for(const p of cameraPositions(r)){
 const metal=new THREE.MeshStandardMaterial({color:0x555648,roughness:.9});metal.userData.mazeOwned=true;
 this.box(raw,p.x,.045,p.z,.62,.09,.62,metal);this.box(raw,p.x,p.height/2-.07,p.z,.07,p.height-.14,.07,metal);this.box(raw,p.x,p.height-.18,p.z,.18,.12,.18,metal);
 const yawPivot=new THREE.Group();yawPivot.position.set(p.x,p.height,p.z);yawPivot.rotation.y=Math.atan2(-p.x,r.d/2-p.z);
 const pitchPivot=new THREE.Group();yawPivot.add(pitchPivot);const head=this.props.getObjectByName('CameraHead').clone();pitchPivot.add(head);
 const ledMaterial=new THREE.MeshBasicMaterial({color:0x321008,toneMapped:false});head.traverse(o=>{if(o.isMesh){o.castShadow=true;if(o.name==='CameraIndicator')o.material=ledMaterial;}});
 cameras.push({yawPivot,pitchPivot,ledMaterial,x:p.x,z:p.z,height:p.height});
 }
 // Frames, leaves, interaction and collision all use the same door descriptors.
 for(const d of chunk.doors){const y=floorHeight(r,d.z),anchor=new THREE.Group();anchor.position.set(d.x,y,d.z);anchor.rotation.y=d.axis==='x'?(d.x<0?Math.PI/2:-Math.PI/2):0;this.addAsset(anchor,'DoorFrame',0,0,0,0,[1.83,1,1]);const pivot=new THREE.Group();pivot.position.x=-.96;this.addAsset(pivot,'Door',.96,0,0,0,[2,1,1]);anchor.add(pivot);doorGroup.add(anchor);doors.push({id:d.id,pivot});if(isDoorOpen(chunk,d))pivot.rotation.y=-Math.PI*.53;}
 const batch=this.batch(raw);batch.add(doorGroup);if(ghost)batch.add(ghost);for(const c of cameras)batch.add(c.yawPivot);batch.userData={ghost,cameras,glows:batch.userData.glows,token:chunk.token,doors,fixtures};return batch;}
 sync(){for(const[i,g]of this.groups)if((this.entranceAttached&&i<0)||!this.model.chunks.has(i)||this.model.chunks.get(i).token!==g.userData.token){this.root.remove(g);g.userData.ghost?.userData.material.dispose();for(const c of g.userData.cameras||[])c.ledMaterial.dispose();g.traverse(o=>{if(o.isInstancedMesh){o.dispose();if(o.material.userData.mazeOwned)o.material.dispose();}});this.groups.delete(i);}for(const[i,c]of this.model.chunks){if(this.entranceAttached&&i<0)continue;if(!this.groups.has(i)){const g=this.build(c);this.groups.set(i,g);this.root.add(g);}this.groups.get(i).position.set(this.model.offset.x,0,this.model.worldZ(i));}}
 update(player,dt,time,yaw=0,active=true,eyeHeight=1.65){const changed=this.model.update(player);if(changed.added.length||changed.removed.length||changed.mutated!==null||changed.rebased||changed.expired!==null)this.sync();const sample=this.model.sample(player.x,player.z);const sight=sample.chunk?this.secondLook.update({room:sample.chunk.room,seed:this.model.seed,x:sample.x,z:sample.z,yaw,active,dt}):null;if(this.watcher){this.watcher.visible=!!sight&&sight.opacity>0;if(sight){this.watcher.position.set(this.model.offset.x+sight.x,0,this.model.worldZ(sight.index)+sight.z);for(const material of this.watcherMaterials)material.opacity=sight.opacity;}}const near=[];for(const[i,g]of this.groups){const c=this.model.chunks.get(i);if(g.userData.ghost){const ghost=g.userData.ghost,p=this.model.sample(player.x,player.z);if(p.index===i&&enteredGhostRoom(c.room,p.x,p.z))c.ghostGone=true;ghost.visible=!c.ghostGone;
 ghost.userData.material.opacity=Math.sin(time*19+i*7)>.86?.025:.14+Math.sin(time*6.1)*.035;ghost.position.x=ghost.userData.baseX+(Math.sin(time*23+i)>.94?.035:0);}
 for(const [n,camera] of (g.userData.cameras||[]).entries()){
 if(active&&sample.index===i&&Math.abs(sample.x)<c.room.w/2+1&&Math.abs(sample.z)<c.room.d/2+1){
 const dx=player.x-g.position.x-camera.x,dz=player.z-g.position.z-camera.z;
 camera.yawPivot.rotation.y=trackAngle(camera.yawPivot.rotation.y,Math.atan2(dx,dz),dt);
 camera.pitchPivot.rotation.x=trackAngle(camera.pitchPivot.rotation.x,Math.max(-.45,Math.min(.55,Math.atan2(camera.height-eyeHeight,Math.hypot(dx,dz)))),dt,.6);
 }
 camera.ledMaterial.color.setHex(cameraBlink(time,Math.abs(i)*3+n)?0xd95435:0x281009);
 }
 for(const glow of g.userData.glows||[])glow.material.emissiveIntensity=glow.base*flickerLevel(time,i,this.model.discovered);for(const rendered of g.userData.doors){const descriptor=c.doors.find(d=>d.id===rendered.id);const target=isDoorOpen(c,descriptor)?-Math.PI*.53:0;rendered.pivot.rotation.y+=(target-rendered.pivot.rotation.y)*Math.min(1,dt*6);}for(const p of g.userData.fixtures){const v=p.clone();v.x+=g.position.x;v.z+=g.position.z;near.push({v,index:i,d:(v.x-player.x)**2+(v.z-player.z)**2});}}near.sort((a,b)=>a.d-b.d);for(let i=0;i<this.lamps.length;i++){const l=this.lamps[i];if(near[i]){l.position.copy(near[i].v);l.intensity=5.5*flickerLevel(time,near[i].index,this.model.discovered);}else l.intensity=0;}return changed;}
 dispose(){for(const material of this.watcherMaterials||[])material.dispose();this.scene.remove(this.root);for(const g of this.groups.values()){g.userData.ghost?.userData.material.dispose();for(const c of g.userData.cameras||[])c.ledMaterial.dispose();g.traverse(o=>{if(o.isInstancedMesh){o.dispose();if(o.material.userData.mazeOwned)o.material.dispose();}});}for(const l of this.lamps){this.scene.remove(l);l.dispose();}this.groups.clear();}
}
