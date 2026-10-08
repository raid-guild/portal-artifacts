import * as THREE from 'three';
import {MeshBVH} from 'three-mesh-bvh';

const runtimes=new Map();
// Physics queries are synchronous and extremely frequent (one per particle,
// neighbor and surface point). Reuse the query objects rather than allocating
// vectors and rays for every contact.
const queryPoint=new THREE.Vector3(),queryDirection=new THREE.Vector3(),queryRay=new THREE.Ray(),
  closestTarget={point:new THREE.Vector3()};
const insideDirection=new THREE.Vector3(.992,.121,.032).normalize();
export function runtimeSolid(c){
  if(!c||c.type!=='editor-solid-mesh')return null;
  const cached=runtimes.get(c.revision);if(cached)return cached;
  if(!c.vertices||!c.indices||!c.indices.length)return null;
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(c.vertices,3));
  geometry.setIndex(new THREE.BufferAttribute(c.indices,1));geometry.computeBoundingBox();
  const runtime={geometry,bvh:new MeshBVH(geometry),bounds:geometry.boundingBox};
  runtimes.set(c.revision,runtime);return runtime;
}
export function disposeEditorSolid(revisionId){
  const runtime=runtimes.get(revisionId);if(runtime){runtime.geometry.dispose();runtimes.delete(revisionId);}
}
export function solidInside(c,x,y,z){
  const rt=runtimeSolid(c);if(!rt)return false;
  queryPoint.set(x,y,z);if(!rt.bounds.containsPoint(queryPoint))return false;
  queryRay.origin.copy(queryPoint);queryRay.direction.copy(insideDirection);
  const first=rt.bvh.raycastFirst(queryRay,THREE.DoubleSide);
  if(!first)return false;
  const orientation=first.face.normal.dot(insideDirection);
  // For a closed, consistently wound Manifold, the first crossing exits the
  // solid when the point starts inside. At a grazing face or exact boundary,
  // retain the original parity test to avoid unstable orientation decisions.
  if(Math.abs(orientation)>1e-6&&first.distance>1e-5)return orientation>0;
  const hits=rt.bvh.raycast(queryRay,THREE.DoubleSide).sort((a,b)=>a.distance-b.distance);
  let count=0,last=-Infinity;
  for(const hit of hits){if(hit.distance-last>1e-5){count++;last=hit.distance;}}
  return count%2===1;
}
export function solidClosest(c,x,y,z,maxDistance=Infinity){
  const rt=runtimeSolid(c);if(!rt)return null;
  const b=rt.bounds;
  if(x<b.min.x-maxDistance||x>b.max.x+maxDistance||
    y<b.min.y-maxDistance||y>b.max.y+maxDistance||z<b.min.z-maxDistance||z>b.max.z+maxDistance)return null;
  queryPoint.set(x,y,z);
  const hit=rt.bvh.closestPointToPoint(queryPoint,closestTarget,0,maxDistance);
  return hit?{x:hit.point.x,y:hit.point.y,z:hit.point.z,distance:hit.distance}:null;
}
export function solidRay(c,origin,direction,maxDistance=Infinity){
  const rt=runtimeSolid(c);if(!rt)return null;
  queryRay.origin.set(origin.x,origin.y,origin.z);
  queryRay.direction.copy(queryDirection.set(direction.x,direction.y,direction.z).normalize());
  const hit=rt.bvh.raycastFirst(queryRay,THREE.DoubleSide,0,maxDistance);
  return hit?{distance:hit.distance,x:hit.point.x,y:hit.point.y,z:hit.point.z,
    normal:hit.face?.normal?.clone()}:null;
}
