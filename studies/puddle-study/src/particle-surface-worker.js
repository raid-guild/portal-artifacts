import * as THREE from 'three';
import {createParticleSurface} from './particle-surface.js';
import {disposeEditorSolid} from './editor-solid-physics.js';

const surfaces=new Map();
const registeredSolids=new Map();
export function buildSurfaceJob(job,cache=surfaces){
    const started=performance.now();
    let surface=cache.get(job.resolution);
    if(!surface){surface=createParticleSurface(new THREE.MeshBasicMaterial(),job.resolution);cache.set(job.resolution,surface);}
    const coords=new Float64Array(job.coords);
    const particles=Array.from({length:coords.length/3},(_,i)=>({x:coords[i*3],y:coords[i*3+1],z:coords[i*3+2]}));
    const colliders=job.colliders.map(c=>c.type==='editor-solid-mesh'&&!c.vertices?
      registeredSolids.get(c.revision)||(()=>{throw new Error(`Missing committed solid ${c.revision}.`);})():c);
    surface.update(particles,colliders,job.radius,{maskTerrain:job.maskTerrain});
    const mesh=surface.mesh,count=mesh.count,length=count*3;
    const positions=mesh.geometry.attributes.position.array.slice(0,length);
    const normals=mesh.geometry.attributes.normal.array.slice(0,length);
    return {id:job.id,generation:job.generation,surfaceId:job.surfaceId,count,
      position:mesh.position.toArray(),scale:mesh.scale.toArray(),positions,normals,
      buildMs:performance.now()-started};
}
if(typeof self!=='undefined')self.onmessage=({data:job})=>{
  if(job.type==='register-solid'){
    registeredSolids.set(job.revision,{type:'editor-solid-mesh',revision:job.revision,
      vertices:job.vertices,indices:job.indices});return;
  }
  if(job.type==='clear-solids'){
    for(const id of registeredSolids.keys())disposeEditorSolid(id);
    registeredSolids.clear();return;
  }
  if(job.type==='dispose'){surfaces.clear();close();return;}
  try{
    const result=buildSurfaceJob(job);
    self.postMessage(result,[result.positions.buffer,result.normals.buffer]);
  }catch(error){self.postMessage({id:job.id,generation:job.generation,surfaceId:job.surfaceId,error:String(error)});}
};
