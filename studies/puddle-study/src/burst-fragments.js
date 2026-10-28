import * as THREE from 'three';

export const isBurstFragment=p=>!!p.feedstock&&p.burstGroup!==undefined;

// A single pooled draw keeps scattered flesh visible regardless of the size
// of the marching-cubes domain. Neighboring instances overlap into soft chunks.
export function createBurstFragments(scene,sourceMaterial){
  const geometry=new THREE.SphereGeometry(1,8,6),material=sourceMaterial.clone();
  material.transparent=false;material.opacity=1;material.depthWrite=true;
  const marker=new THREE.Object3D();let mesh,capacity=0;
  function resize(count){
    if(count<=capacity)return;
    capacity=Math.max(128,2**Math.ceil(Math.log2(count)));
    if(mesh){scene.remove(mesh);mesh.dispose();}
    mesh=new THREE.InstancedMesh(geometry,material,capacity);
    mesh.frustumCulled=false;mesh.count=0;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(mesh);
  }
  resize(128);
  function update(particles,radius,{offsetY=0,active=true}={}){
    let count=0;if(active)for(const p of particles)if(isBurstFragment(p))count++;
    resize(count);mesh.count=count;mesh.position.y=offsetY;
    if(!count)return;
    let index=0;
    for(const p of particles){if(!isBurstFragment(p))continue;
      const r=radius*(1.4+(index%5)*.025);
      marker.position.set(p.x,p.y,p.z);marker.scale.set(r,r*.88,r);
      marker.updateMatrix();mesh.setMatrixAt(index++,marker.matrix);
    }
    mesh.instanceMatrix.needsUpdate=true;
  }
  return {get mesh(){return mesh;},update,dispose(){scene.remove(mesh);mesh.dispose();geometry.dispose();material.dispose();}};
}
