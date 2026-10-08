import * as THREE from 'three';
import {WEIGHT_GARDEN,gardenColliders,gardenFixtureHeight} from './garden-level.js';
import {groundAt} from './colliders.js';
import {addStoneEdges,facetedOctahedron} from './garden-ornaments.js';
import {cameraPointVisible} from './game-camera.js';
import {gripAxis} from './grip-ramp.js';

// Gameplay objects for the lower storey; scenery remains a separate layer.
export function createWeightGardenView(scene,{printLibrary,level=WEIGHT_GARDEN,worldY=-(level.id-1)*7.2}={}){
  const group=new THREE.Group();group.position.y=worldY;scene.add(group);
  const colliders=gardenColliders(level),ink=0x31494a;
  const add=(geometry,color,role,extra={})=>{
    const material=new THREE.MeshBasicMaterial({color,...extra});
    if(role)printLibrary?.decorate(material,role);
    const mesh=new THREE.Mesh(geometry,material);group.add(mesh);return mesh;
  };
  const outline=mesh=>mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.6})));
  const b=level.boundary,t=level.terrain;
  const floor=(x0,x1,z0,z1,y,region,hole=null,heightAt=null)=>{
    const shape=new THREE.Shape();shape.moveTo(x0,z0);shape.lineTo(x1,z0);shape.lineTo(x1,z1);shape.lineTo(x0,z1);shape.closePath();
    for(const cut of (Array.isArray(hole)?hole:hole?[hole]:[])){
      const path=new THREE.Path();path.absarc(cut.x,cut.z,cut.radius,0,Math.PI*2,true);shape.holes.push(path);
    }
    const geo=new THREE.ShapeGeometry(shape,48),pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getY(i);pos.setXYZ(i,x,heightAt?heightAt(x,z):y,z);}
    geo.computeVertexNormals();const mesh=add(geo,region==='high'?0xe6d2b9:region==='middle'?0xddceb7:0xd2c3b2,'floor',{side:THREE.DoubleSide});
    mesh.userData.weightFloor=region;mesh.userData.pickableTerrain=true;return mesh;
  };
  floor(-9.4,9.4,b.minZ-.4,t.frontZ,t.frontHeight,'high',level.channels);
  floor(-9.4,9.4,t.frontZ,t.rearZ,t.middleHeight,'middle',level.basin);
  floor(-9.4,9.4,t.rearZ,b.maxZ+.4,0,'low',level.exit);
  for(const [stairs,region] of [[t.leftStairs,'left-stairs'],[t.rightStairs,'right-stairs']]){
    const cuts=[stairs.startZ,...stairs.steps.flatMap(step=>[step.z,step.z+step.width]),stairs.endZ]
      .filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
    for(let i=0;i<cuts.length-1;i++)floor(stairs.minX,stairs.maxX,cuts[i],cuts[i+1],0,region,null,
      (x,z)=>groundAt((stairs.minX+stairs.maxX)/2,z,[t]).height+.012);
  }
  const wall=(vertices,color=0xb6aa99)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.computeVertexNormals();return add(geo,color,'wall',{side:THREE.DoubleSide});};
  const wallZ=(x0,x1,z,low,high)=>wall([x0,high,z,x1,high,z,x0,low,z,x1,high,z,x1,low,z,x0,low,z]);
  const wallX=(x,z0,z1,low,h0,h1)=>wall([x,h0,z0,x,h1,z1,x,low,z0,x,h1,z1,x,low,z1,x,low,z0]);
  for(const [stairs,split,low,high] of [[t.leftStairs,t.frontZ,t.middleHeight,t.frontHeight],
    [t.rightStairs,t.rearZ,0,t.middleHeight]]){
    wallZ(-9.4,stairs.minX,split,low,high);wallZ(stairs.maxX,9.4,split,low,high);
    const cuts=[stairs.startZ,...stairs.steps.flatMap(step=>[step.z,step.z+step.width]),stairs.endZ]
      .filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
    for(let i=0;i<cuts.length-1;i++){
      const z0=cuts[i],z1=cuts[i+1],cx=(stairs.minX+stairs.maxX)/2;
      const h0=groundAt(cx,z0,[t]).height,h1=groundAt(cx,z1,[t]).height;
      wallX(stairs.minX,z0,z1,low,h0,h1);wallX(stairs.maxX,z0,z1,low,h0,h1);
    }
  }
  addStoneEdges(group,level,colliders);
  let exitRim=null,exitLining=null,basinBottom=null;
  for(const hole of [...(level.channels||[]),...(level.basin?[level.basin]:[]),level.exit]){
    const base=groundAt(hole.x,hole.z,[t]).height;
    const lining=add(new THREE.CylinderGeometry(hole.radius,hole.bottomRadius,hole.depth,48,1,true),0xb5aea0,'wall',{side:THREE.DoubleSide});
    if(hole===level.exit)exitLining=lining;
    if(level.channels?.includes(hole))lining.userData.pickableTerrain=true;
    lining.position.set(hole.x,base-hole.depth/2,hole.z);
    const bottom=add(new THREE.CircleGeometry(hole.bottomRadius,40),hole===level.exit?0x263b3c:0xb99b86,null,{side:THREE.DoubleSide});
    if(hole===level.basin)basinBottom=bottom;
    bottom.rotation.x=-Math.PI/2;bottom.position.set(hole.x,base-hole.depth+.012,hole.z);
    if(level.channels?.includes(hole))bottom.userData.pickableTerrain=true;
    const rim=add(new THREE.TorusGeometry(hole.radius,.025,5,48),ink);rim.rotation.x=Math.PI/2;rim.position.set(hole.x,base+.025,hole.z);
    if(hole===level.exit)exitRim=rim;
  }
  const g=level.gate;
  let gate=null;
  if(g){
    gate=add(new THREE.BoxGeometry(g.width,g.height,g.maxZ-g.minZ),0xa5bfba,'lintel',{transparent:true,opacity:.78});
    gate.position.set(g.x,g.base+g.height/2,(g.minZ+g.maxZ)/2);outline(gate);
    // The moving turquoise panel carries its own fine rim, so the decoration
    // rises with the real gate and leaves the exact physical opening intact.
    const panelLines=[],panelHalf=(g.maxZ-g.minZ)/2-.055,panelY=g.height/2-.08,faceX=g.width/2+.004;
    const panelMark=(a,b)=>panelLines.push(...a,...b);
    for(const z of [-panelHalf,panelHalf])panelMark([faceX,-panelY,z],[faceX,panelY,z]);
    for(const y of [-panelY,panelY])panelMark([faceX,y,-panelHalf],[faceX,y,panelHalf]);
    panelMark([faceX,0,-panelHalf*.43],[faceX,.13,0]);
    panelMark([faceX,.13,0],[faceX,0,panelHalf*.4]);
    const panelGeo=new THREE.BufferGeometry();panelGeo.setAttribute('position',new THREE.Float32BufferAttribute(panelLines,3));
    gate.add(new THREE.LineSegments(panelGeo,new THREE.LineBasicMaterial({color:0xe9dbc4,transparent:true,opacity:.7})));
    for(const [lo,hi] of [[t.frontZ,g.minZ],[g.maxZ,t.rearZ]]){
      const block=add(new THREE.BoxGeometry(g.width,g.height+g.opening,hi-lo),0xb6c4b6,'wall');
      block.position.set(g.x,g.base+(g.height+g.opening)/2,(lo+hi)/2);outline(block);
      // A pierced, waisted shoulder lies on the existing block face. It is
      // inset within the collider's width and segment ends; no new obstacle.
      const lower=g.base+.055,upper=g.base+g.height+g.opening-.045;
      const shoulder=new THREE.Shape();
      shoulder.moveTo(lo+.035,lower);shoulder.lineTo(hi-.035,lower);
      shoulder.lineTo(hi-.065,lower+.48);shoulder.lineTo(hi-.026,upper-.3);
      shoulder.lineTo(hi-.055,upper);shoulder.lineTo(lo+.055,upper);
      shoulder.lineTo(lo+.026,upper-.3);shoulder.lineTo(lo+.065,lower+.48);shoulder.closePath();
      const recess=new THREE.Path();recess.absellipse((lo+hi)/2,upper-.56,.07,.24,0,Math.PI*2,true);
      shoulder.holes.push(recess);
      const shoulderGeo=new THREE.ShapeGeometry(shoulder,16),pos=shoulderGeo.attributes.position;
      for(let i=0;i<pos.count;i++)pos.setXYZ(i,g.x+g.width/2+.004,pos.getY(i),pos.getX(i));
      shoulderGeo.computeVertexNormals();
      add(shoulderGeo,0xe3d1bb,'wall',{side:THREE.DoubleSide});
    }
  }
  if(level.passage){
    const r=level.passage;
    const lintel=add(new THREE.BoxGeometry(r.maxX-r.minX,r.top-r.bottom,r.maxZ-r.minZ),0xaec1b9,'lintel',{transparent:true,opacity:.82});
    lintel.position.set((r.minX+r.maxX)/2,(r.bottom+r.top)/2,(r.minZ+r.maxZ)/2);outline(lintel);
    for(const [lo,hi] of [[r.minZ,r.minZ+.16],[r.maxZ-.16,r.maxZ]]){
      const support=add(new THREE.BoxGeometry(r.maxX-r.minX,r.top,hi-lo),0xb6aa99,'wall',
        {transparent:true,opacity:lo>r.minZ+.2?.38:1,depthWrite:lo<=r.minZ+.2});
      support.position.set((r.minX+r.maxX)/2,r.top/2,(lo+hi)/2);outline(support);
    }
  }
  if(level.grip){
    const {ramp,platform}=level.grip;
    const axis=gripAxis(ramp),height=(x,z)=>axis==='x'?
      ramp.minHeight+(ramp.maxHeight-ramp.minHeight)*(x-ramp.minX)/(ramp.maxX-ramp.minX):
      ramp.northHeight+(ramp.southHeight-ramp.northHeight)*(z-ramp.minZ)/(ramp.maxZ-ramp.minZ);
    const rampMesh=add(new THREE.BufferGeometry(),0x91b8a4,'floor',{side:THREE.DoubleSide});
    rampMesh.geometry.setAttribute('position',new THREE.Float32BufferAttribute([
      ramp.minX,height(ramp.minX,ramp.minZ)+.014,ramp.minZ,ramp.maxX,height(ramp.maxX,ramp.minZ)+.014,ramp.minZ,ramp.minX,height(ramp.minX,ramp.maxZ)+.014,ramp.maxZ,
      ramp.maxX,height(ramp.maxX,ramp.minZ)+.014,ramp.minZ,ramp.maxX,height(ramp.maxX,ramp.maxZ)+.014,ramp.maxZ,ramp.minX,height(ramp.minX,ramp.maxZ)+.014,ramp.maxZ],3));
    rampMesh.geometry.computeVertexNormals();rampMesh.userData.pickableTerrain=true;
    for(let i=0;i<9;i++){
      const fraction=(i+.45)/9,x=ramp.minX+(ramp.maxX-ramp.minX)*fraction,z=ramp.minZ+(ramp.maxZ-ramp.minZ)*fraction;
      const y=axis==='x'?groundAt(x,(ramp.minZ+ramp.maxZ)/2,colliders).height+.026:
        groundAt((ramp.minX+ramp.maxX)/2,z,colliders).height+.026;
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        axis==='x'?new THREE.Vector3(x,y,ramp.minZ+.07):new THREE.Vector3(ramp.minX+.07,y,z),
        axis==='x'?new THREE.Vector3(x,y,ramp.maxZ-.07):new THREE.Vector3(ramp.maxX-.07,y,z)]),
      new THREE.LineBasicMaterial({color:i%3===0?0x3b6860:0x6a9984,transparent:true,opacity:.75}));group.add(line);
    }
    const block=add(new THREE.BoxGeometry(platform.maxX-platform.minX,platform.maxY-platform.minY,platform.maxZ-platform.minZ),
      0xc6bea9,'wall');block.position.set((platform.minX+platform.maxX)/2,(platform.minY+platform.maxY)/2,(platform.minZ+platform.maxZ)/2);outline(block);
    for(const [coordinate,normal] of axis==='x'?[[platform.minX,-1],[platform.maxX,1]]:[[platform.minZ,-1],[platform.maxZ,1]]){
      const face=add(new THREE.BoxGeometry(axis==='x'?.018:platform.maxX-platform.minX,platform.maxY-platform.minY,
        axis==='x'?platform.maxZ-platform.minZ:.018),0x84ad98,'wall');
      face.position.set(axis==='x'?coordinate+normal*.012:(platform.minX+platform.maxX)/2,
        (platform.minY+platform.maxY)/2,axis==='x'?(platform.minZ+platform.maxZ)/2:coordinate+normal*.012);
      const count=11;
      for(let i=0;i<count;i++){
        const y=platform.minY+.065+(platform.maxY-platform.minY-.13)*i/(count-1);
        const rib=add(new THREE.BoxGeometry(axis==='x'?.028:platform.maxX-platform.minX-.12,.012,
          axis==='x'?platform.maxZ-platform.minZ-.12:.028),i%2?0x4c786b:0x5c8978);
        rib.position.set(axis==='x'?coordinate+normal*.031:(platform.minX+platform.maxX)/2,y,
          axis==='x'?(platform.minZ+platform.maxZ)/2:coordinate+normal*.031);
      }
    }
    const slip=level.slip;
    const slick=add(new THREE.PlaneGeometry(slip.maxX-slip.minX,slip.maxZ-slip.minZ),0xa7d5d0,'floor',
      {side:THREE.DoubleSide,transparent:true,opacity:.82});
    slick.rotation.x=-Math.PI/2;slick.position.set((slip.minX+slip.maxX)/2,t.middleHeight+.019,(slip.minZ+slip.maxZ)/2);
    for(const x of [slip.minX+.42,slip.maxX-.42]){
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x,t.middleHeight+.032,slip.minZ+.14),new THREE.Vector3(x+.1,t.middleHeight+.032,slip.maxZ-.08)]),
      new THREE.LineBasicMaterial({color:0x609ca3,transparent:true,opacity:.4}));group.add(line);
    }
  }
  if(level.castingBank){
    const bank=level.castingBank,y=groundAt(bank.x,bank.z,colliders).height;
    const marker=add(new THREE.TorusGeometry(.27,.022,5,32),0x8e7172);
    marker.rotation.x=Math.PI/2;marker.position.set(bank.x,y+.035,bank.z);
  }
  const pulse=(x,y,z,r,color)=>{const ring=add(new THREE.TorusGeometry(r,.018,5,32),color,null,{transparent:true,opacity:0,depthWrite:false});
    ring.rotation.x=Math.PI/2;ring.position.set(x,y,z);ring.visible=false;return ring;};
  const gems=level.gems.map(g=>{const y=gardenFixtureHeight(level,g.x,g.z);
    const gem=add(facetedOctahedron(.34),0xb5a5c7,'gem',{vertexColors:true});gem.position.set(g.x,y+.34,g.z);outline(gem);
    const points=Array.from({length:65},(_,i)=>{const a=i/64*2*Math.PI;return new THREE.Vector3(g.x+Math.cos(a)*.47,y+.025,g.z+Math.sin(a)*.47);});
    const track=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x886f98}));group.add(track);
    return {gem,track,burst:pulse(g.x,y+.38,g.z,.4,0xf4d6ff)};
  });
  const gold=level.gold.map(([x,z])=>{const y=gardenFixtureHeight(level,x,z);
    const piece=add(facetedOctahedron(.13,'gold'),0xc89d46,'gold',{vertexColors:true});piece.position.set(x,y+.13,z);outline(piece);
    return {piece,burst:pulse(x,y+.17,z,.18,0xffd27a)};});
  const label=document.createElement('div');label.className='world-label garden-label';document.querySelector('#app').append(label);
  return {group,setCollarReady(ready){exitRim.visible=exitLining.visible=!ready;},update(sim,camera){
    const visible=sim.selectedTest==='garden'&&(sim.gardenLevelId===level.id||sim.descending&&sim.gardenLevelId===level.id+1&&sim.garden.phase==='arriving'&&sim.garden.arrivalTime<.5);group.visible=visible;
    label.hidden=!visible||sim.isLocalGarden||(!g&&!level.castingBank)||sim.garden.phase!=='playing';
    if(!visible||sim.isLocalGarden)return;
    if(g){
      const v=new THREE.Vector3(level.basin.x,t.middleHeight+.22+worldY,level.basin.z+1.35).project(camera);
      label.hidden=label.hidden||!cameraPointVisible(v);
      label.textContent=sim.gardenLevelId===level.id?`BASIN / ${sim.pressure.weight} OF ${g.threshold}`:'';
      if(!label.hidden){label.style.left=`${(v.x*.5+.5)*innerWidth}px`;label.style.top=`${(-v.y*.5+.5)*innerHeight}px`;}
      gate.position.y=g.base+g.height/2+sim.pressure.opening;
      if(basinBottom)basinBottom.material.color.setHex(sim.pressure.active?0xd1ab8e:0xb99b86);
    }else if(level.castingBank){
      const bank=level.castingBank;
      const v=new THREE.Vector3(bank.x,t.frontHeight+.22+worldY,bank.z+.5).project(camera);
      label.hidden=label.hidden||!cameraPointVisible(v);
      label.textContent='CASTING BANK / CLICK LOOSE FLESH';
      if(!label.hidden){label.style.left=`${(v.x*.5+.5)*innerWidth}px`;label.style.top=`${(-v.y*.5+.5)*innerHeight}px`;}
    }
    if(sim.gardenLevelId!==level.id)return;
    sim.garden.gems.forEach((state,i)=>{const item=gems[i];item.gem.visible=item.track.visible=!state.collected;
      item.gem.material.color.setHex(state.coverage>.8?0xe3c8af:0xb5a5c7);
      item.track.geometry.setDrawRange(0,Math.max(2,Math.ceil(state.progress*65)));
      const age=sim.garden.elapsed-state.collectedAt,active=state.collected&&age>=0&&age<.9;
      item.burst.visible=active;if(active){item.burst.scale.setScalar(1+age*2.7);item.burst.material.opacity=(1-age/.9)*.9;}
    });
    sim.garden.gold.forEach((state,i)=>{const item=gold[i];item.piece.visible=!state.collected;item.piece.rotation.y=sim.fluid.time*.6+i;
      const age=sim.garden.elapsed-state.collectedAt,active=state.collected&&age>=0&&age<.55;
      item.burst.visible=active;if(active){item.burst.scale.setScalar(1+age*3.5);item.burst.material.opacity=(1-age/.55)*.9;}
    });
  },dispose(){scene.remove(group);label.remove();group.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))m?.dispose();});}};
}
