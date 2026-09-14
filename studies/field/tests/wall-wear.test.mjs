import assert from 'node:assert/strict';
import {register} from 'node:module';
const url=new URL('../dist/vendor/three.module.js',import.meta.url).href;
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){return s==='three'?{url:${JSON.stringify(url)},shortCircuit:true}:n(s,c)}`),import.meta.url);
const {wearPlacements}=await import('../dist/wall-wear.js');
const {MazeTopology,supportsWall}=await import('../dist/maze-core.js');
for(let seed=0;seed<80;seed++){
 const m=new MazeTopology(seed);let early=0,late=0;
 for(let i=0;i<14;i++){m.ensure(i);const c=m.chunks.get(i),p=wearPlacements(c,seed,-1);assert.deepEqual(wearPlacements(c,seed,1),[]);assert.deepEqual(p,wearPlacements(c,seed,-1));assert.ok(p.length<=13);
 for(const v of p){assert.ok(supportsWall(c.cells,v.x,v.z,v.rotation,.47));assert.ok(v.y>=1.5);assert.ok(v.kind>=0&&v.kind<=2);}
 if(i<3)early+=p.length;if(i>10)late+=p.length;
 }
 assert.ok(late>early,'Damage density grows deeper into the floor');
}
console.log('PASS: 80 seeds, solid wall backing, bounded counts, deterministic alphabet placement, deeper damage and clean floor 01.');
