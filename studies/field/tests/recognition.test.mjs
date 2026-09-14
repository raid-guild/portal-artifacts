import assert from 'node:assert/strict';
import {MazeTopology} from '../dist/maze-core.js';
for(let seed=0;seed<50;seed++){
 const m=new MazeTopology(seed,{x:9,z:-42},-1);m.ensure(13);const r=m.chunks.get(13),z=m.worldZ(13);assert.equal(r.room.kind,'recognition');assert.equal(m.canWalk(9,z-6),false);assert.ok(m.openDoor(9,z-4.5));
 for(let p=5;p> -11.6;p-=.1)assert.ok(m.canWalk(9,z+p),'Entry through observation door to railing is passable');
 for(const [x,d]of[[5.01,-9],[-5.01,-9],[0,-12.01],[3,-6],[-3,-6],[-2.6,-1]])assert.equal(m.canWalk(9+x,z+d),false,'Rail boundary, walls and pedestal block movement');
 for(let p=-11.5;p<5;p+=.2)assert.ok(m.canWalk(9,z+p),'Can return to recognition room');
 const upper=new MazeTopology(seed,{x:0,z:0},1);assert.equal(upper.make(13).room.kind,'elevator');assert.equal(m.make(13,4).room.kind,'recognition');
}
console.log('PASS: 50 seeds, lower-floor ending, observation door, balcony boundary, pedestal collision and return path.');
const {register}=await import('node:module'),THREE=await import('../dist/vendor/three.module.js');const url=new URL('../dist/vendor/three.module.js',import.meta.url).href;
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(url)},shortCircuit:true}:n(s,c)}`),import.meta.url);
const words=[];globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(t){words.push(t)}})})};
const {Recognition}=await import('../dist/recognition.js');const room=new Recognition(new THREE.Group()),count=room.root.children.length;
assert.ok(words.join(' ').includes('WE THANK YOU FOR YOUR SACRIFICE'));
for(let t=0;t<1000;t++)room.update(t/60);assert.equal(room.root.children.length,count,'Animation has bounded geometry');assert.equal(room.stairs.count,160);
room.root.updateMatrixWorld(true);const ray=new THREE.Raycaster(new THREE.Vector3(0,1.65,0),new THREE.Vector3(0,0,-1));const closed=ray.intersectObjects(room.pivot.children,true);assert.ok(closed.length>0,'Closed door conceals void at eye level');room.pivot.rotation.y=-Math.PI*.53;room.root.updateMatrixWorld(true);assert.equal(ray.intersectObjects(room.pivot.children,true).length,0,'Open doorway reveals the view');room.dispose();
console.log('PASS: requested inscription, bounded animated geometry, door occlusion and open sightline.');
