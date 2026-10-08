import * as THREE from 'three';
import {gardenColliders,gardenFixtureHeight} from './garden-level.js';
import {groundAt} from './colliders.js';
import {flutedPost} from './garden-ornaments.js';
import {runtimeSolid,disposeEditorSolid,solidInside} from './editor-solid-physics.js';
import {createPrintedMaterialLibrary} from './printed-material.js';
import {paintSurfaceHeight} from './surface-paint.js';

export function resolveEditorSolidSource(sources,point){
  const epsilon=.035,candidates=[];
  for(const c of sources||[]){
    let inside=false,volume=Infinity,base=c.minY??c.base??c.bottom??c.minHeight??c.northHeight??0;
    if(c.type==='cylinder'){
      inside=Math.hypot(point.x-c.x,point.z-c.z)<=c.radius+epsilon&&
        point.y>=base-epsilon&&point.y<=c.height+epsilon;
      volume=Math.PI*c.radius*c.radius*(c.height-base);
    }else if(Number.isFinite(c.minX)&&Number.isFinite(c.maxX)&&
      Number.isFinite(c.minZ)&&Number.isFinite(c.maxZ)){
      const top=c.maxY??c.top??c.maxHeight??c.southHeight??(c.base??0)+(c.rise??0);
      inside=point.x>=c.minX-epsilon&&point.x<=c.maxX+epsilon&&
        point.z>=c.minZ-epsilon&&point.z<=c.maxZ+epsilon&&
        point.y>=base-epsilon&&point.y<=top+epsilon;
      volume=(c.maxX-c.minX)*(c.maxZ-c.minZ)*(top-base);
    }
    if(inside)candidates.push({sourceId:c.sourceId,base,volume});
  }
  candidates.sort((a,b)=>a.volume-b.volume);
  return candidates[0]||null;
}
export function editorStageHitInfo(hit){
  const source=hit.object.userData.editorSourceAt?.(hit.point)||null;
  return {targetId:source?.sourceId||hit.object.userData.editorId||null,
    supportBase:source?.base??hit.object.userData.supportBase??0};
}

export function createEditorStageView(scene,level,{printLibrary:sharedPrintLibrary,labelRoot}={}){
  const group=new THREE.Group();scene.add(group);
  const printLibrary=sharedPrintLibrary||createPrintedMaterialLibrary();
  const ink=new THREE.LineBasicMaterial({color:0x385354});
  const slipInk=new THREE.LineBasicMaterial({color:0x397f89,transparent:true,opacity:.82});
  const materials={floor:new THREE.MeshBasicMaterial({color:0xe4d3bd,side:THREE.DoubleSide}),
    block:new THREE.MeshBasicMaterial({color:0xd4c6ad}),roof:new THREE.MeshBasicMaterial({color:0xa9c1b7,transparent:true,opacity:.72}),
    pillar:new THREE.MeshBasicMaterial({color:0xe8dac3,vertexColors:true}),riser:new THREE.MeshBasicMaterial({color:0xb7a992,side:THREE.DoubleSide}),
    exit:new THREE.MeshBasicMaterial({color:0x314d4c,side:THREE.DoubleSide}),
    basin:new THREE.MeshBasicMaterial({color:0xb99b86,side:THREE.DoubleSide}),flesh:new THREE.MeshBasicMaterial({color:0x87a997}),
    gem:new THREE.MeshBasicMaterial({color:0x9f84b0}),gold:new THREE.MeshBasicMaterial({color:0xd4a84f}),
    start:new THREE.MeshBasicMaterial({color:0xb86d69}),slip:new THREE.MeshBasicMaterial({color:0x76c6cf,
      side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),
    grip:new THREE.MeshBasicMaterial({color:0x8cae96,side:THREE.DoubleSide}),
    cutter:new THREE.MeshBasicMaterial({color:0xb66a67,wireframe:true,transparent:true,opacity:.58,depthWrite:false})};
  for(const [name,role] of Object.entries({floor:'floor',block:'wall',roof:'lintel',pillar:'wall',
    riser:'wall',gem:'gem',gold:'gold'}))printLibrary.decorate(materials[name],role);
  const add=(geo,mat,x=0,y=0,z=0,pick=false)=>{const m=new THREE.Mesh(geo,materials[mat]);m.position.set(x,y,z);
    m.userData.pickableTerrain=pick;group.add(m);return m;};
  const box=(c,mat)=>{const minY=c.minY??0,maxY=c.maxY??c.top,minimum=c.type==='roof'?c.bottom:minY;
    const m=add(new THREE.BoxGeometry(c.maxX-c.minX,maxY-minimum,c.maxZ-c.minZ),mat,
      (c.minX+c.maxX)/2,(minimum+maxY)/2,(c.minZ+c.maxZ)/2,true);
    m.userData.editorId=c.sourceId||c.editorId||null;m.userData.supportBase=minimum;
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),ink));return m;};
  const paintTiles=(c,material,face='floor')=>{
    const tiles=[],solid=level.csgSolid;
    const u0=face==='floor'?c.minX:['west','east'].includes(face)?c.minZ:c.minX,
      u1=face==='floor'?c.maxX:['west','east'].includes(face)?c.maxZ:c.maxX,
      v0=face==='floor'?c.minZ:c.minY,v1=face==='floor'?c.maxZ:c.maxY,
      size=Math.max(.085,Math.sqrt((u1-u0)*(v1-v0)/10000));
    const point=(u,v,inside=false)=>{
      if(face==='floor'){
        const h=paintSurfaceHeight(c,u,v,colliders);
        return h===null||!c.targetId&&c.base!==undefined&&Math.abs(h-c.base)>.2?null:
          [u,h+(inside?-.025:.022),v];
      }
      if(face==='west'||face==='east')return [face==='west'?c.minX+(inside?.025:-.008):c.maxX+(inside?-.025:.008),v,u];
      return [u,v,face==='north'?c.minZ+(inside?.025:-.008):c.maxZ+(inside?-.025:.008)];
    };
    for(let u=u0;u<u1-.001;u+=size)for(let v=v0;v<v1-.001;v+=size){
      const U=Math.min(u1,u+size),V=Math.min(v1,v+size),sample=point((u+U)/2,(v+V)/2,true);
      if(face==='floor'&&!c.targetId&&colliders.some(item=>item.type==='funnel'&&!item.raised&&
        Math.hypot((u+U)/2-item.x,(v+V)/2-item.z)<item.radius+size*.75))continue;
      if(!sample||solid&&c.targetId&&!solidInside(solid,...sample))continue;
      const a=point(u,v),b=point(U,v),cc=point(u,V),d=point(U,V);
      if(!a||!b||!cc||!d)continue;
      if(face==='floor')tiles.push(...a,...cc,...b,...b,...cc,...d);
      else tiles.push(...a,...b,...cc,...b,...d,...cc);
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(tiles,3));
    geometry.computeVertexNormals();const mesh=add(geometry,material);
    mesh.userData.editorPaintId=c.sourceId||null;
    if(material==='slip'&&face==='floor'){
      const h=(x,z)=>(paintSurfaceHeight(c,x,z,colliders)??c.base??0)+.039,
        outline=new THREE.BufferGeometry();
      outline.setAttribute('position',new THREE.Float32BufferAttribute([
        c.minX,h(c.minX,c.minZ),c.minZ,c.maxX,h(c.maxX,c.minZ),c.minZ,
        c.maxX,h(c.maxX,c.minZ),c.minZ,c.maxX,h(c.maxX,c.maxZ),c.maxZ,
        c.maxX,h(c.maxX,c.maxZ),c.maxZ,c.minX,h(c.minX,c.maxZ),c.maxZ,
        c.minX,h(c.minX,c.maxZ),c.maxZ,c.minX,h(c.minX,c.minZ),c.minZ],3));
      group.add(new THREE.LineSegments(outline,slipInk));
    }
    return mesh;
  };
  const b=level.boundary,colliders=gardenColliders(level),t=level.terrain;
  if(t.type==='flat'){
    const shape=new THREE.Shape();shape.moveTo(b.minX,b.minZ);shape.lineTo(b.maxX,b.minZ);
    shape.lineTo(b.maxX,b.maxZ);shape.lineTo(b.minX,b.maxZ);shape.closePath();
    for(const c of colliders.filter(c=>c.type==='funnel'&&!c.raised)){
      const hole=new THREE.Path();hole.absarc(c.x,c.z,c.radius,0,Math.PI*2,true);shape.holes.push(hole);
    }
    const geo=new THREE.ShapeGeometry(shape,40),vertices=geo.attributes.position;
    for(let i=0;i<vertices.count;i++)vertices.setXYZ(i,vertices.getX(i),t.height??0,vertices.getY(i));
    geo.computeVertexNormals();add(geo,'floor',0,0,0,true);
  }
  else {
    // Rectangular cells keep authored terrace boundaries crisp. Their heights
    // use the same solver as particle contact; no independent level coordinates.
    const step=.24,vertices=[],risers=[],edges=[];
    // Reserve whole grid cells around every physical funnel, then replace
    // each reserved rectangle with one exact circular cutout. This keeps the
    // authoring floor pickable without capping the visible bowl.
    const patches=colliders.filter(c=>c.type==='funnel'&&!c.raised).map(c=>{
      const edge=(v,min,max,round)=>Math.max(min,Math.min(max,min+round((v-min)/step)*step));
      return {cut:c,minX:edge(c.x-c.radius,b.minX,b.maxX,Math.floor),maxX:edge(c.x+c.radius,b.minX,b.maxX,Math.ceil),
        minZ:edge(c.z-c.radius,b.minZ,b.maxZ,Math.floor),maxZ:edge(c.z+c.radius,b.minZ,b.maxZ,Math.ceil)};
    });
    const quad=(a,b,c,d)=>risers.push(...a,...b,...c,...b,...d,...c);
    const edge=(a,b)=>edges.push(...a,...b);
    for(let x=b.minX;x<b.maxX-.001;x+=step)for(let z=b.minZ;z<b.maxZ-.001;z+=step){
      const w=Math.min(step,b.maxX-x),d=Math.min(step,b.maxZ-z),cx=x+w/2,cz=z+d/2;
      if(patches.some(p=>cx>p.minX&&cx<p.maxX&&cz>p.minZ&&cz<p.maxZ))continue;
      const h=groundAt(cx,cz,[t]).height;
      vertices.push(x,h,z,x+w,h,z,x,h,z+d,x+w,h,z,x+w,h,z+d,x,h,z+d);
      if(x+w<b.maxX-.001){const next=groundAt(x+w+Math.min(step,b.maxX-x-w)/2,cz,[t]).height;
        if(Math.abs(h-next)>.045){const lo=Math.min(h,next),hi=Math.max(h,next),xx=x+w;
          quad([xx,lo,z],[xx,lo,z+d],[xx,hi,z],[xx,hi,z+d]);edge([xx,hi+.006,z],[xx,hi+.006,z+d]);}}
      if(z+d<b.maxZ-.001){const next=groundAt(cx,z+d+Math.min(step,b.maxZ-z-d)/2,[t]).height;
        if(Math.abs(h-next)>.045){const lo=Math.min(h,next),hi=Math.max(h,next),zz=z+d;
          quad([x,lo,zz],[x+w,lo,zz],[x,hi,zz],[x+w,hi,zz]);edge([x,hi+.006,zz],[x+w,hi+.006,zz]);}}
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.computeVertexNormals();add(geo,'floor',0,0,0,true);
    for(const p of patches){
      const shape=new THREE.Shape();shape.moveTo(p.minX,p.minZ);shape.lineTo(p.maxX,p.minZ);
      shape.lineTo(p.maxX,p.maxZ);shape.lineTo(p.minX,p.maxZ);shape.closePath();
      const hole=new THREE.Path();hole.absarc(p.cut.x,p.cut.z,p.cut.radius,0,Math.PI*2,true);shape.holes.push(hole);
      const patch=new THREE.ShapeGeometry(shape,48),points=patch.attributes.position,
        height=groundAt(p.cut.x,p.cut.z,[t]).height;
      for(let i=0;i<points.count;i++)points.setXYZ(i,points.getX(i),height,points.getY(i));
      patch.computeVertexNormals();add(patch,'floor',0,0,0,true);
    }
    const side=new THREE.BufferGeometry();side.setAttribute('position',new THREE.Float32BufferAttribute(risers,3));
    add(side,'riser');
    const contour=new THREE.BufferGeometry();contour.setAttribute('position',new THREE.Float32BufferAttribute(edges,3));
    group.add(new THREE.LineSegments(contour,ink));
  }
  let gatePanel=null,gateRestY=0;
  for(const c of colliders){
    if(c.type==='editor-solid-mesh'){
      const runtime=runtimeSolid(c);
      if(runtime){const renderGeometry=runtime.geometry.clone();renderGeometry.computeVertexNormals();
        const mesh=add(renderGeometry,'block',0,0,0,true);
        mesh.userData.editorSourceAt=point=>resolveEditorSolidSource(level.csgSources,point);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,28),ink));}
    }
    else if(c.type==='box'||c.type==='roof'){
      const mesh=box(c,c.type==='roof'?'roof':'block');
      const gate=level.gate,half=(gate?.width??0)/2;
      if(gate&&c.type==='roof'&&Math.abs(c.minX-(gate.x-half))<.001&&
        Math.abs(c.minZ-gate.minZ)<.001&&Math.abs(c.maxZ-gate.maxZ)<.001){gatePanel=mesh;gateRestY=mesh.position.y;}
    }
    else if(c.type==='cylinder'){
      const m=add(flutedPost(c.radius,c.height-(c.base??0)),'pillar',c.x,((c.base??0)+c.height)/2,c.z,true);
      m.userData.editorId=c.editorId||c.sourceId||null;m.userData.supportBase=c.base??0;
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry,25),ink));
    }
    else if(c.type==='grip-ramp'){
      const center=(c.axis==='x'?(c.minHeight+c.maxHeight):(c.northHeight+c.southHeight))/2;
      const m=add(new THREE.BoxGeometry(c.maxX-c.minX,.05,c.maxZ-c.minZ),'grip',(c.minX+c.maxX)/2,center,(c.minZ+c.maxZ)/2,true);
      m.userData.editorId=c.editorId||null;
      const slope=c.axis==='x'?(c.maxHeight-c.minHeight)/(c.maxX-c.minX):(c.southHeight-c.northHeight)/(c.maxZ-c.minZ);
      if(c.axis==='x')m.rotation.z=Math.atan(slope);else m.rotation.x=-Math.atan(slope);
    }else if(c.type==='sticky-wall')paintTiles(c,'grip',c.face);
    else if(c.type==='sticky-paint'&&c.face==='floor')paintTiles(c,'grip');
    else if(c.type==='slip')paintTiles({...c,base:c.base??groundAt((c.minX+c.maxX)/2,(c.minZ+c.maxZ)/2,colliders).height},'slip');
    else if(c.type==='editor-stairs'){
      const axis=c.axis,length=axis==='x'?c.maxX-c.minX:c.maxZ-c.minZ,
        cx=(c.minX+c.maxX)/2,cz=(c.minZ+c.maxZ)/2;
      const m=add(new THREE.BoxGeometry(c.maxX-c.minX,.06,c.maxZ-c.minZ),'block',cx,c.base+c.rise/2,cz,true);
      m.userData.editorId=c.sourceId||null;
      if(axis==='x')m.rotation.z=(c.reverse?-1:1)*Math.atan(c.rise/length);
      else m.rotation.x=(c.reverse?1:-1)*Math.atan(c.rise/length);
      for(let i=1;i<c.steps;i++){
        const fraction=i/c.steps,position=(axis==='x'?c.minX:c.minZ)+length*fraction;
        const geo=new THREE.BufferGeometry(),verts=axis==='x'?
          [position,c.base+c.rise*(c.reverse?1-fraction:fraction)+.045,c.minZ,position,c.base+c.rise*(c.reverse?1-fraction:fraction)+.045,c.maxZ]:
          [c.minX,c.base+c.rise*(c.reverse?1-fraction:fraction)+.045,position,c.maxX,c.base+c.rise*(c.reverse?1-fraction:fraction)+.045,position];
        geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));group.add(new THREE.LineSegments(geo,ink));
      }
    }
    else if(c.type==='funnel'){
      const h=c.raised?c.base:groundAt(c.x,c.z,[t]).height;
      add(new THREE.CylinderGeometry(c.radius,c.bottomRadius,c.depth,40,1,true),
        c===level.exit?'exit':'basin',c.x,h-c.depth/2,c.z,true);
      const m=add(new THREE.CircleGeometry(c.bottomRadius,32),c===level.exit?'exit':'basin',c.x,h-c.depth+.006,c.z,true);m.rotation.x=-Math.PI/2;
      const rim=add(new THREE.TorusGeometry(c.radius,.025,5,40),'block',c.x,h+.01,c.z);rim.rotation.x=Math.PI/2;
    }
  }
  const cutterGhosts=[];
  for(const cut of level.editorCutters||[]){
    const geometry=cut.shape==='cylinder'?new THREE.CylinderGeometry(cut.radius,cut.radius,cut.height,48):
      new THREE.BoxGeometry(cut.width,cut.height,cut.depth);
    const m=add(geometry,'cutter',cut.x,cut.y,cut.z);
    const r=cut.rotation||{};m.rotation.set(THREE.MathUtils.degToRad(r.x||0),THREE.MathUtils.degToRad(r.y||0),
      THREE.MathUtils.degToRad(r.z||0),'XYZ');
    m.visible=false;cutterGhosts.push(m);
  }
  const gems=(level.gems||[]).map(g=>add(new THREE.OctahedronGeometry(.33),'gem',g.x,gardenFixtureHeight(level,g.x,g.z)+.34,g.z));
  const gold=(level.gold||[]).map(([x,z])=>add(new THREE.OctahedronGeometry(.14),'gold',x,gardenFixtureHeight(level,x,z)+.14,z));
  const pools=(level.pools||[]).map(([x,z])=>add(new THREE.SphereGeometry(.4,14,8),'flesh',x,gardenFixtureHeight(level,x,z)+.18,z));
  const start=level.start?add(new THREE.ConeGeometry(.23,.5,8),'start',level.start.x,
    gardenFixtureHeight(level,level.start.x,level.start.z)+.3,level.start.z):null;
  const root=labelRoot||(typeof document!=='undefined'?document.querySelector('#app'):null);
  const labels=(level.labels||[]).map(label=>{
    if(!root)return null;
    const node=document.createElement('div');node.className='world-label editor-label';node.textContent=label.text;
    node.hidden=true;root.append(node);
    return {node,point:new THREE.Vector3(label.x,label.base+label.offset,label.z)};
  }).filter(Boolean);
  let gameplay=false,editing=false;
  const updateLabels=(sim,camera)=>{
    const active=editing||sim?.garden?.phase==='playing';
    const menu=typeof document!=='undefined'&&!!document.querySelector('.in-menu');
    const rect=root?.getBoundingClientRect?.();
    for(const {node,point} of labels){
      node.hidden=true;
      if(!active||menu||!camera||!rect?.width||!rect?.height)continue;
      const v=point.clone().project(camera);
      if(!Number.isFinite(v.x)||!Number.isFinite(v.y)||v.x<-1||v.x>1||v.y<-1||v.y>1||v.z<-1||v.z>1)continue;
      node.style.left=`${(v.x*.5+.5)*rect.width}px`;
      node.style.top=`${(-v.y*.5+.5)*rect.height}px`;
      node.hidden=false;
    }
  };
  return {group,setEditing(value){editing=!!value;for(const m of cutterGhosts)m.visible=editing;},
    setPlaying(value){gameplay=!!value;for(const m of pools)m.visible=!gameplay;if(start)start.visible=!gameplay;},
    update(sim,camera){updateLabels(sim,camera);if(gatePanel)gatePanel.position.y=gateRestY+(sim.pressure?.opening||0);
      gems.forEach((m,i)=>m.visible=!sim.garden.gems[i]?.collected);
    gold.forEach((m,i)=>m.visible=!sim.garden.gold[i]?.collected);
    pools.forEach((m,i)=>m.visible=!gameplay&&sim.fluid.particles.some(p=>p.feedstock&&p.patchId===i));
    if(start)start.visible=!gameplay&&sim.garden.phase==='title';},dispose(){scene.remove(group);group.traverse(o=>o.geometry?.dispose());
      for(const {node} of labels)node.remove();
      if(level.csgSolid)disposeEditorSolid(level.csgSolid.revision);
      ink.dispose();slipInk.dispose();Object.values(materials).forEach(m=>m.dispose());
      if(!sharedPrintLibrary)printLibrary.dispose();}};
}
