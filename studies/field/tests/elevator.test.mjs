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
