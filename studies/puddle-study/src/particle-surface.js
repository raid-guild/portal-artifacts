import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import {pointInsideSolid,groundAt} from './colliders.js';

// A scalar field built from local, finite-radius kernels. The field has no
// topology of its own, so separated particle groups produce separate lobes.
export function createParticleSurface(material,resolution=48){
  const mesh=new MarchingCubes(resolution,material,false,false,22000);
  mesh.isolation=.72;
  mesh.frustumCulled=false;
  const n=resolution,field=mesh.field;
  function update(particles,colliders,radius=.067){
    if(!particles.length){mesh.reset();mesh.update();return;}
    const support=Math.max(.21,radius*3.4);
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
    for(const p of particles){
      minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);
      minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
      minZ=Math.min(minZ,p.z);maxZ=Math.max(maxZ,p.z);
    }
    const margin=support+.1;
    const sx=Math.max(.55,(maxX-minX)/2+margin),sy=Math.max(.42,(maxY-minY)/2+margin),sz=Math.max(.55,(maxZ-minZ)/2+margin);
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2,cz=(minZ+maxZ)/2;
    mesh.position.set(cx,cy,cz);mesh.scale.set(sx,sy,sz);
    mesh.reset();
    const toI=(v,c,s)=>Math.floor(((v-c)/s+1)*n/2);
    const invX=2*sx/n,invY=2*sy/n,invZ=2*sz/n;
    const support2=support*support;
    for(const p of particles){
      const ix0=Math.max(1,toI(p.x-support,cx,sx)),ix1=Math.min(n-2,toI(p.x+support,cx,sx)+1);
      const iy0=Math.max(1,toI(p.y-support,cy,sy)),iy1=Math.min(n-2,toI(p.y+support,cy,sy)+1);
      const iz0=Math.max(1,toI(p.z-support,cz,sz)),iz1=Math.min(n-2,toI(p.z+support,cz,sz)+1);
      for(let iz=iz0;iz<=iz1;iz++){
        const dz=(cz-sz+iz*invZ-p.z),dz2=dz*dz;if(dz2>=support2)continue;
        for(let iy=iy0;iy<=iy1;iy++){
          const dy=cy-sy+iy*invY-p.y,d2=dz2+dy*dy;if(d2>=support2)continue;
          const row=iz*n*n+iy*n;
          for(let ix=ix0;ix<=ix1;ix++){
            const dx=cx-sx+ix*invX-p.x,q=1-(d2+dx*dx)/support2;
            if(q>0)field[row+ix]+=q*q;
          }
        }
      }
    }
    // Mask the interior of fixtures; a lobe may slide along their faces.
    for(let iz=1;iz<n-1;iz++)for(let iy=1;iy<n-1;iy++)for(let ix=1;ix<n-1;ix++){
      const i=iz*n*n+iy*n+ix;
      if(field[i]<mesh.isolation*.2)continue;
      const x=cx-sx+ix*invX,y=cy-sy+iy*invY,z=cz-sz+iz*invZ;
      if(y<groundAt(x,z,colliders).height+.01||pointInsideSolid(x,y,z,colliders,.012))field[i]=0;
    }
    mesh.update();
  }
  return {mesh,update};
}
