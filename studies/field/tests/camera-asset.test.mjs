import fs from 'node:fs';
import assert from 'node:assert/strict';
import {register} from 'node:module';
import * as THREE from '../dist/vendor/three.module.js';
// Resolve the same vendored Three.js used by the browser import map.
const threeURL=new URL('../dist/vendor/three.module.js',import.meta.url).href;
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(threeURL)},shortCircuit:true}:n(s,c)}`),import.meta.url);
const {GLTFLoader}=await import('../dist/vendor/addons/loaders/GLTFLoader.js');
const {EndlessMaze}=await import('../dist/maze.js');
const {findFacility}=await import('../dist/maze-core.js');
const bytes=fs.readFileSync(new URL('../dist/assets/surveillance-camera.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const head=gltf.scene.getObjectByName('CameraHead');assert.ok(head);assert.ok(head.getObjectByName('CameraIndicator'));
gltf.scene.updateMatrixWorld(true);assert.ok(head.getObjectByName('Lens_glass').getWorldPosition(new THREE.Vector3()).z>.4,'Lens faces exported +Z');
const kit=new THREE.Group(),props=new THREE.Group();props.add(gltf.scene);
for(const name of ['NurseryGround','NurseryCrib','NurseryRecliner','NurseryBlocks','NurseryPictureBlocks','NurseryPictureReading','NurseryPictureLab','MeetingTable','ExcellencePoster','ObservationPoster','AttendancePoster','LegacyPoster','NeverLookBackPoster','BoardroomPoster','Wall','Floor','Ceiling','Fixture','DoorFrame','Outlet','Desk','Chair','Cabinet','IncidentPoster','WellnessPoster','DirectionPoster','Portrait','Door']){const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial());mesh.name=name;kit.add(mesh);props.add(mesh.clone());}
const scene=new THREE.Scene(),maze=new EndlessMaze(scene,kit,props,42,{x:11,z:27});const index=findFacility(42,7,'camera');maze.model.ensure(index);maze.sync();
const g=maze.groups.get(index),c=g.userData.cameras[0];assert.ok(c);assert.ok(c.yawPivot.parent===g,'Dynamic head stays outside instance batching');
const player={x:11,z:maze.model.worldZ(index)+2};
for(let i=0;i<150;i++)maze.update(player,.05,i*.05,0,true,1.15);
scene.updateMatrixWorld(true);const front=new THREE.Vector3(0,0,1).transformDirection(c.pitchPivot.matrixWorld);const target=new THREE.Vector3(player.x,1.15,player.z).sub(c.pitchPivot.getWorldPosition(new THREE.Vector3())).normalize();
assert.ok(front.dot(target)>.99,'Lens tracks player in translated room, including crouched eye height');
assert.equal(c.yawPivot.children[0].children[0].getObjectByName('CameraIndicator').material,c.ledMaterial);
const paused=c.yawPivot.rotation.y;maze.update({x:player.x-.5,z:player.z},.1,8,0,false);assert.equal(c.yawPivot.rotation.y,paused,'Map pauses tracking');
let disposed=0;c.ledMaterial.addEventListener('dispose',()=>disposed++);maze.model.ensure(index+5);maze.sync();assert.equal(disposed,1,'Expired room releases indicator material');maze.dispose();
console.log('PASS: GLB lens axis, indicator mesh, dynamic camera tracking, world offsets, crouching, pause and disposal.');
