import assert from 'node:assert/strict';
import {ElevatorState} from '../dist/elevator-state.js';
import {MazeTopology} from '../dist/maze-core.js';
for(let seed=0;seed<40;seed++){
 const m=new MazeTopology(seed,{x:20,z:-42},1);m.ensure(13);const c=m.chunks.get(13);assert.equal(c.room.kind,'elevator');assert.equal(m.canWalk(20,m.worldZ(13)-7),false,'Departure room has no bypass exit');
 const e=new ElevatorState();const walk=(x,z)=>m.canWalk(20+x,m.worldZ(13)+z)&&e.canWalk(x,z);
 for(let t=-3;t<=3;t+=.1)for(const [x,z] of [[t,3],[t,-3],[3,t],[-3,t]])assert.ok(walk(x,z),'All four sides of shaft accessible');
 assert.equal(walk(0,1.7),false);assert.equal(walk(1.6,0),false);assert.equal(walk(0,-1.6),false);
 assert.equal(e.interact(4,4),false);assert.ok(e.interact(0,2.6));for(let i=0;i<120;i++)e.update(1/60);assert.equal(e.phase,'open');assert.ok(walk(0,1.7));
 assert.equal(e.interact(0,1.3),false,'Cannot close on doorway');assert.ok(e.interact(0,0));assert.ok(e.locked);
 let reveals=0,descents=0;for(let i=0;i<500;i++){if(e.reveal)reveals++;if(e.update(1/60))descents++;}
 assert.ok(reveals>0);assert.equal(descents,1);assert.equal(e.open,0,'Floor replaced only behind closed doors');
 const lower=new MazeTopology(seed,{x:0,z:0},-1),arrival=new ElevatorState(true);assert.equal(lower.chunks.get(0).room.kind,'elevator');assert.ok(arrival.locked);
 for(let i=0;i<240;i++)arrival.update(1/60);assert.equal(arrival.phase,'open');assert.equal(arrival.interact(0,0),false,'Arrival cannot ascend');assert.ok(arrival.canWalk(0,1.7));assert.equal(arrival.reveal,false);
 assert.ok(lower.canWalk(0,-6.5),'Lower lobby connects to continuing maze');
}
console.log('PASS: 40 seeds, shaft circuit, door collision, threshold safety, close/reveal/travel sequence, one descent, arrival exit and no ascent.');
const {register}=await import('node:module');
const THREE=await import('../dist/vendor/three.module.js');const url=new URL('../dist/vendor/three.module.js',import.meta.url).href;
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(url)},shortCircuit:true}:n(s,c)}`),import.meta.url);
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
const {Elevator}=await import('../dist/elevator.js');
const props=new THREE.Group(),goat=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());goat.name='Goatman';props.add(goat);
const lift=new Elevator(props);assert.equal(lift.goat.visible,false);
lift.state.interact(0,3);for(let i=0;i<120;i++)lift.update(1/60);assert.ok(lift.left.position.x< -1.3&&lift.right.position.x>1.3,'Door meshes retract');
lift.state.interact(0,0);while(lift.state.open>.35)lift.update(1/60);assert.ok(lift.goat.visible);while(lift.state.phase==='closing')lift.update(1/60);assert.equal(lift.goat.visible,false);assert.equal(lift.left.position.x,-.46);lift.dispose();assert.equal(goat.material.opacity,1,'Reveal does not modify shared creature material');
console.log('PASS: actual elevator meshes retract, reveal timing matches panels, shared assets remain unchanged.');
const {facesLiftDoors}=await import('../dist/elevator-state.js');
const facing=new ElevatorState();facing.phase='open';facing.open=1;
for(const yaw of [0,Math.PI/2,-Math.PI/2]){assert.equal(facing.prompt(0,0,facesLiftDoors(yaw)),null);assert.equal(facing.interact(0,0,facesLiftDoors(yaw)),false);}
assert.equal(facing.interact(0,0,facesLiftDoors(Math.PI,1)),false,'Cannot descend looking at ceiling');
assert.ok(facing.interact(0,0,facesLiftDoors(Math.PI,0)));assert.equal(facing.phase,'ready');
console.log('PASS: descent requires facing the doors, with no camera rotation.');
const {createFlashlight}=await import('../dist/flashlight.js');
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(),torch=createFlashlight(scene);camera.position.set(5,1.6,7);camera.rotation.set(.25,1.2,0,'YXZ');camera.updateMatrixWorld();torch.update(camera,true);assert.ok(torch.light.visible&&torch.light.castShadow);const expected=camera.getWorldDirection(new THREE.Vector3()),actual=torch.light.target.position.clone().sub(camera.position).normalize();assert.ok(expected.dot(actual)>.9999);torch.update(camera,false);assert.equal(torch.light.visible,false);
console.log('PASS: flashlight follows yaw/pitch, casts shadows and toggles off.');
const {elevatorReveal,ELEVATOR_REVEAL_Z}=await import('../dist/elevator-state.js');
assert.equal(elevatorReveal('open',1,0).opacity,0);assert.equal(elevatorReveal('closing',.9,0).opacity,0);assert.equal(elevatorReveal('travel',0,0).opacity,0);
assert.ok(elevatorReveal('closing',.85,.4).opacity>0);assert.ok(elevatorReveal('closing',.85,.4).opacity<elevatorReveal('closing',.75,.4).opacity);
for(const x of[-1,0,1])for(const z of[-1,.6]){const yaw=Math.atan2(x,-(ELEVATOR_REVEAL_Z-z));assert.ok(facesLiftDoors(yaw,0,x,z));const fraction=(1.62-z)/(ELEVATOR_REVEAL_Z-z),atDoor=x*(1-fraction);assert.ok(Math.abs(atDoor)<.8*.92,'View to figure clears the wider opening, even beside panel');}
const intensities=Array.from({length:30},(_,i)=>elevatorReveal('closing',.6,i*.02).opacity);assert.ok(Math.max(...intensities)-Math.min(...intensities)>.3,'Uneven flicker');
console.log('PASS: earlier fade, proximity-aware framing and uneven glitch opacity.');
for(const x of [-1.2,0,1.2])for(const z of [-1.2,0,1.18])for(const eye of [.67,1.65]){
 const dx=1.23-x,dz=1.37-z,dy=1.2-eye;
 const yaw=Math.atan2(-dx,-dz),pitch=Math.atan2(-dy,Math.hypot(dx,dz));
 const e=new ElevatorState();e.phase='open';e.open=1;
 assert.ok(e.canWalk(x,z));assert.ok(e.interact(x,z,facesLiftDoors(yaw,pitch,x,z,eye)),'Panel aim works across the safe cabin, standing or crouched');
}
for(const [x,z] of [[0,1.3],[0,1.7],[1.3,0],[0,-1.3]]){const e=new ElevatorState();e.phase='open';e.open=1;assert.equal(e.interact(x,z,true),false,'Cannot close from threshold/outside');}
console.log('PASS: actual panel aim from cabin edges and front, crouching, and doorway safety.');
for(const reverse of [false,true]){
 const e=new Elevator(props);e.root.rotation.y=reverse?Math.PI:0;e.root.position.set(4,0,reverse?-52:0);e.root.updateWorldMatrix(true,true);
 const origin=e.root.localToWorld(new THREE.Vector3(1.15,1.65,1.1)),target=e.control.getWorldPosition(new THREE.Vector3());
 const ray=new THREE.Raycaster(origin,target.clone().sub(origin).normalize());assert.ok(ray.intersectObject(e.control).length,'Physical panel hit target works near the button in either orientation');e.dispose();
}
