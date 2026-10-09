import * as THREE from 'three';

const MAX_FLASHES=13,MAX_PUFFS=24,PUFF_LIFE=.68;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

// A fixed number of instances share two geometries. No geometry or material is
// created while the game runs, even when many particles touch lava at once.
export function createBurnFeedback(scene){
  const group=new THREE.Group();scene.add(group);
  const flashGeometry=new THREE.SphereGeometry(1,8,6);
  const puffGeometry=new THREE.SphereGeometry(1,7,5);
  const flashMaterial=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.82,depthWrite:false});
  const puffMaterial=new THREE.MeshBasicMaterial({color:0x71635e,transparent:true,opacity:.42,depthWrite:false});
  const flashes=new THREE.InstancedMesh(flashGeometry,flashMaterial,MAX_FLASHES);
  const smoke=new THREE.InstancedMesh(puffGeometry,puffMaterial,MAX_PUFFS);
  flashes.count=smoke.count=0;
  flashes.frustumCulled=smoke.frustumCulled=false;
  flashes.renderOrder=7;smoke.renderOrder=8;
  group.add(flashes,smoke);
  const marker=new THREE.Object3D(),hot=new THREE.Color(0xff6b27),coreColor=new THREE.Color(0xffdd76);
  const puffs=Array.from({length:MAX_PUFFS},()=>({age:PUFF_LIFE,x:0,y:0,z:0,drift:0}));
  let fluid=null,lastTime=0,spawnClock=0,nextPuff=0,sequence=0;
  const clear=()=>{for(const puff of puffs)puff.age=PUFF_LIFE;
    flashes.count=smoke.count=0;spawnClock=0;};
  function update(sim,{active=true,offsetY=0}={}){
    if(!active||!sim||sim.selectedTest!=='garden'||sim.garden?.phase!=='playing'){
      clear();fluid=sim?.fluid||null;lastTime=fluid?.time||0;return;
    }
    if(fluid!==sim.fluid){clear();fluid=sim.fluid;lastTime=fluid.time;}
    const dt=clamp(fluid.time-lastTime,0,.1);lastTime=fluid.time;
    const sites=sim.garden.burnSites||[],coreBurn=sim.garden.coreBurn||0;
    // Smoke can outlive contact briefly; elapsed simulation time controls its
    // age, so pausing never silently advances the effect.
    for(const puff of puffs)puff.age=Math.min(PUFF_LIFE,puff.age+dt);
    if(sites.length||coreBurn>0)spawnClock+=dt;
    else spawnClock=0;
    let spawned=0;
    while(spawnClock>=.055&&spawned<3&&(sites.length||coreBurn>0)){
      spawnClock-=.055;spawned++;
      const source=coreBurn>0&&sequence%3===0?sim.brain:sites[sequence%sites.length]||sim.brain;
      const puff=puffs[nextPuff];nextPuff=(nextPuff+1)%MAX_PUFFS;
      const angle=sequence++*2.39996;
      puff.age=0;puff.x=source.x+Math.cos(angle)*.07*sim.size;
      puff.y=source.y+.13*sim.size;puff.z=source.z+Math.sin(angle)*.07*sim.size;
      puff.drift=Math.sin(angle)*.14;
    }
    let count=0;
    for(let i=0;i<sites.length&&count<MAX_FLASHES-1;i++){
      const site=sites[i],pulse=.82+.18*Math.sin(fluid.time*33+i*1.7);
      marker.position.set(site.x,site.y+.075*sim.size,site.z);
      marker.scale.set(.19*sim.size*pulse,.10*sim.size*pulse,.19*sim.size*pulse);
      marker.updateMatrix();flashes.setMatrixAt(count,marker.matrix);flashes.setColorAt(count,hot);count++;
    }
    if(coreBurn>0){
      const pulse=.92+.16*Math.sin(fluid.time*41),size=sim.size*(.19+.11*clamp(coreBurn/.35,0,1));
      marker.position.set(sim.brain.x,sim.brain.y,sim.brain.z);
      marker.scale.setScalar(size*pulse);marker.updateMatrix();
      flashes.setMatrixAt(count,marker.matrix);flashes.setColorAt(count,coreColor);count++;
    }
    flashes.count=count;
    if(count){flashes.instanceMatrix.needsUpdate=true;flashes.instanceColor.needsUpdate=true;}
    count=0;
    for(const puff of puffs){if(puff.age>=PUFF_LIFE)continue;
      const progress=puff.age/PUFF_LIFE,radius=sim.size*(.065+.15*progress)*((1-progress)**2);
      marker.position.set(puff.x+puff.drift*progress,puff.y+.42*sim.size*progress,puff.z);
      marker.scale.setScalar(radius);marker.updateMatrix();smoke.setMatrixAt(count++,marker.matrix);
    }
    smoke.count=count;if(count)smoke.instanceMatrix.needsUpdate=true;
    // Flash instances stay in local level coordinates like the body group.
    group.position.y=offsetY;
  }
  function dispose(){scene.remove(group);flashGeometry.dispose();puffGeometry.dispose();flashMaterial.dispose();puffMaterial.dispose();}
  return {group,flashes,smoke,update,clear,dispose};
}
