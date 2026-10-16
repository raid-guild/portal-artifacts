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
    tablet:new THREE.MeshBasicMaterial({color:0xd1b990}),tabletInk:new THREE.MeshBasicMaterial({color:0x485f5a}),
    start:new THREE.MeshBasicMaterial({color:0xb86d69}),slip:new THREE.MeshBasicMaterial({color:0x76c6cf,
      side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),
    lava:new THREE.MeshBasicMaterial({color:0xe3582c,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),
    lavaCrust:new THREE.MeshBasicMaterial({color:0x74241d,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),
    pit:new THREE.MeshBasicMaterial({color:0x172026,side:THREE.BackSide}),
    pitRim:new THREE.MeshBasicMaterial({color:0x544446,side:THREE.DoubleSide}),
    grip:new THREE.MeshBasicMaterial({color:0x8cae96,side:THREE.DoubleSide}),
    gripRib:new THREE.MeshBasicMaterial({color:0x4c786b,side:THREE.DoubleSide}),
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
      if(face==='floor'&&!c.targetId&&colliders.some(item=>['funnel','pit'].includes(item.type)&&!item.raised&&
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
    if(material==='lava'&&face==='floor'){
      const cracks=[],crust=[];
      for(let x=c.minX+.13;x<c.maxX-.12;x+=.35)for(let z=c.minZ+.13;z<c.maxZ-.12;z+=.35){
        const h=paintSurfaceHeight(c,x,z,colliders);
        if(h===null||!c.targetId&&Math.abs(h-(c.base??h))>.2||
          colliders.some(item=>['funnel','pit'].includes(item.type)&&Math.hypot(x-item.x,z-item.z)<item.radius+.12))continue;
        const length=Math.min(.18,c.maxX-x-.02),bend=(Math.sin(x*8+z*13)+1)*.04;
        cracks.push(x,h+.048,z,x+length*.55,h+.048,z+bend,
          x+length*.55,h+.048,z+bend,x+length,h+.048,z-bend*.4);
        const y=h+.054,wide=.045;
        crust.push(x,y,z-wide,x+length*.55,y,z+bend-wide,
          x,y,z+wide,x+length*.55,y,z+bend-wide,x+length*.55,y,z+bend+wide,x,y,z+wide,
          x+length*.55,y,z+bend-wide,x+length,y,z-bend*.4-wide*.5,
          x+length*.55,y,z+bend+wide,x+length,y,z-bend*.4-wide*.5,x+length,y,z-bend*.4+wide*.5);
      }
      if(cracks.length){const veins=new THREE.BufferGeometry();veins.setAttribute('position',new THREE.Float32BufferAttribute(cracks,3));
        group.add(new THREE.LineSegments(veins,new THREE.LineBasicMaterial({color:0x74241d,transparent:true,opacity:.8})));}
      if(crust.length){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(crust,3));
        add(geo,'lavaCrust').renderOrder=2;}
    }
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
    for(const c of colliders.filter(c=>['funnel','pit'].includes(c.type)&&!c.raised)){
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
    const patches=colliders.filter(c=>['funnel','pit'].includes(c.type)&&!c.raised).map(c=>{
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
  let gatePanel=null,gateRestY=0,pressureFloor=null;const exitParts=[];
  for(const c of colliders){
    if(c.type==='editor-solid-mesh'){
      const runtime=runtimeSolid(c);
      if(runtime){const renderGeometry=runtime.geometry.clone();renderGeometry.computeVertexNormals();
        const mesh=add(renderGeometry,'block',0,0,0,true);
        mesh.userData.editorSourceAt=point=>resolveEditorSolidSource(level.csgSources,point);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,28),ink));}
    }
    else if(c.type==='box'||c.type==='roof'){
      const mesh=box(c,c.type==='roof'&&level.id!==1?'roof':'block');
      if(c.gripPlatform){
        const axis=level.grip?.ramp?.axis==='x'?'x':'z';
        for(const [coordinate,normal] of axis==='x'?[[c.minX,-1],[c.maxX,1]]:[[c.minZ,-1],[c.maxZ,1]]){
          const face=add(new THREE.BoxGeometry(axis==='x'?.018:c.maxX-c.minX,c.maxY-c.minY,
            axis==='x'?c.maxZ-c.minZ:.018),'grip',axis==='x'?coordinate+normal*.012:(c.minX+c.maxX)/2,
            (c.minY+c.maxY)/2,axis==='x'?(c.minZ+c.maxZ)/2:coordinate+normal*.012);
          face.userData.editorId=c.sourceId||null;
          for(let i=0;i<11;i++){
            const y=c.minY+.065+(c.maxY-c.minY-.13)*i/10;
            add(new THREE.BoxGeometry(axis==='x'?.028:c.maxX-c.minX-.12,.012,
              axis==='x'?c.maxZ-c.minZ-.12:.028),'gripRib',
              axis==='x'?coordinate+normal*.031:(c.minX+c.maxX)/2,y,
              axis==='x'?(c.minZ+c.maxZ)/2:coordinate+normal*.031);
          }
        }
      }
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
      const axis=c.axis==='x'?'x':'z',run=axis==='x'?c.maxX-c.minX:c.maxZ-c.minZ,
        rise=axis==='x'?c.maxHeight-c.minHeight:c.southHeight-c.northHeight,
        slopeLength=Math.hypot(run,rise);
      const m=add(new THREE.BoxGeometry(axis==='x'?slopeLength:c.maxX-c.minX,.05,
        axis==='z'?slopeLength:c.maxZ-c.minZ),'grip',(c.minX+c.maxX)/2,center,(c.minZ+c.maxZ)/2,true);
      m.userData.editorId=c.editorId||null;
      const slope=rise/run;
      if(c.axis==='x')m.rotation.z=Math.atan(slope);else m.rotation.x=-Math.atan(slope);
    }else if(c.type==='sticky-wall')paintTiles(c,'grip',c.face);
    else if(c.type==='sticky-paint'&&c.face==='floor')paintTiles(c,'grip');
    else if(c.type==='slip')paintTiles({...c,base:c.base??groundAt((c.minX+c.maxX)/2,(c.minZ+c.maxZ)/2,colliders).height},'slip');
    else if(c.type==='lava')paintTiles(c,'lava');
    else if(c.type==='editor-stairs'){
      const axis=c.axis,length=axis==='x'?c.maxX-c.minX:c.maxZ-c.minZ,
        cx=(c.minX+c.maxX)/2,cz=(c.minZ+c.maxZ)/2,slopeLength=Math.hypot(length,c.rise);
      const m=add(new THREE.BoxGeometry(axis==='x'?slopeLength:c.maxX-c.minX,.06,
        axis==='z'?slopeLength:c.maxZ-c.minZ),'block',cx,c.base+c.rise/2,cz,true);
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
    else if(c.type==='pit'){
      const h=groundAt(c.x,c.z,[t]).height;
      const wall=add(new THREE.CylinderGeometry(c.radius,c.radius,.3,48,1,true),'pit',c.x,h-.15,c.z);
      wall.userData.editorId=c.sourceId||null;
      const rim=add(new THREE.TorusGeometry(c.radius,.035,5,48),'pitRim',c.x,h+.015,c.z);rim.rotation.x=Math.PI/2;
    }
    else if(c.type==='funnel'){
      const h=c.raised?c.base:groundAt(c.x,c.z,[t]).height;
      const wall=add(new THREE.CylinderGeometry(c.radius,c.bottomRadius,c.depth,40,1,true),
        c===level.exit?'exit':'basin',c.x,h-c.depth/2,c.z,true);
      const m=add(new THREE.CircleGeometry(c.bottomRadius,32),c===level.exit?'exit':'basin',c.x,h-c.depth+.006,c.z,true);m.rotation.x=-Math.PI/2;
      if(c===level.basin){m.material=materials.basin.clone();pressureFloor=m;}
      const rim=add(new THREE.TorusGeometry(c.radius,.025,5,40),'block',c.x,h+.01,c.z);rim.rotation.x=Math.PI/2;
      if(c===level.exit)exitParts.push(wall,rim);
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
  const gems=(level.gems||[]).map(g=>add(new THREE.OctahedronGeometry(.33),'gem',g.x,gardenFixtureHeight(level,g.x,g.z,g.base)+.34,g.z));
  const gold=(level.gold||[]).map(([x,z,base])=>add(new THREE.OctahedronGeometry(.14),'gold',x,gardenFixtureHeight(level,x,z,base)+.14,z));
  const tablets=(level.tablets||[]).map(t=>{
    const base=gardenFixtureHeight(level,t.x,t.z,t.base),stone=add(new THREE.BoxGeometry(.48,.13,.35),'tablet',t.x,base+.16,t.z);
    stone.material=materials.tablet.clone();
    stone.rotation.y=Math.PI/7;
    const glyph=new THREE.Group();stone.add(glyph);
    for(const [x,z,w,d] of [[0,0,.29,.025],[-.105,-.075,.022,.15],[.105,-.075,.022,.15]]){
      const mark=new THREE.Mesh(new THREE.BoxGeometry(w,.01,d),materials.tabletInk);
      mark.position.set(x,.071,z);glyph.add(mark);}
    const halo=new THREE.Mesh(new THREE.TorusGeometry(.28,.015,5,24),materials.tabletInk);
    halo.rotation.x=Math.PI/2;halo.position.y=.078;stone.add(halo);
    return {stone,halo};
  });
  const pools=(level.pools||[]).map(([x,z,base])=>add(new THREE.SphereGeometry(.4,14,8),'flesh',x,gardenFixtureHeight(level,x,z,base)+.18,z));
  const nurseryMaterials=[];
  if(level.id===2&&!level.editorCustom&&level.basin&&level.gate){
    // The cistern's stone lip and narrow channels point at the shutter. These
    // inlays add no collision and keep the moving gate's real opening legible.
    const basin=level.basin,h=level.terrain.middleHeight+.035;
    const rimMat=new THREE.MeshBasicMaterial({color:0x7da099});nurseryMaterials.push(rimMat);
    for(const radius of [basin.radius+.055,basin.radius+.27]){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,radius<1.3?.065:.018,5,56),rimMat);
      ring.rotation.x=Math.PI/2;ring.position.set(basin.x,h,basin.z);group.add(ring);}
    const lines=[];for(const z of [basin.z-.47,basin.z+.47]){
      lines.push(basin.x+basin.radius+.12,h,z,level.gate.x-.35,h,z);
      for(let x=basin.x+basin.radius+.35;x<level.gate.x-.45;x+=.42)
        lines.push(x,h,z-.07,x,h,z+.07);
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
    const line=new THREE.LineBasicMaterial({color:0x678a85,transparent:true,opacity:.7});
    nurseryMaterials.push(line);group.add(new THREE.LineSegments(geo,line));
    for(const [x,z] of [[5.3,-3.3],[2.6,-2.4]]){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.98,.02,5,40),rimMat);
      ring.rotation.x=Math.PI/2;ring.position.set(x,level.terrain.frontHeight+.025,z);group.add(ring);}
  }
  if(level.id===3&&!level.editorCustom&&level.basin){
    // Shallow filtration cuts trace the winding stone route. The grooves and
    // basin rings are ink only; all navigation uses the matching box solids.
    const strokes=[];
    const ring=(x,z,r,y)=>{for(let i=0;i<48;i++){
      if(i%12===0)continue;
      const a=i*Math.PI/24,b=(i+1)*Math.PI/24;
      strokes.push(x+Math.cos(a)*r,y,z+Math.sin(a)*r,
        x+Math.cos(b)*r,y,z+Math.sin(b)*r);}};
    ring(level.basin.x,level.basin.z,level.basin.radius+.08,level.terrain.middleHeight+.035);
    ring(level.basin.x,level.basin.z,level.basin.radius+.3,level.terrain.middleHeight+.035);
    for(const [x,z,base] of level.pools||[])
      ring(x,z,.68,gardenFixtureHeight(level,x,z,base)+.034);
    for(const c of level.editorFixtures||[]){if(c.type!=='box')continue;
      const top=c.maxY+.014,x0=c.minX+.055,x1=c.maxX-.055;
      for(let z=c.minZ+.18;z<c.maxZ-.12;z+=.39)
        strokes.push(x0,top,z,x1,top,z+.035);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(strokes,3));
    const ink=new THREE.LineBasicMaterial({color:0x7b8d83,transparent:true,opacity:.66});
    nurseryMaterials.push(ink);group.add(new THREE.LineSegments(geometry,ink));
  }
  if(level.id===4&&!level.editorCustom&&level.castingBank){
    // Fine drainage marks connect the open casting bank, shallow wells, and
    // exposed shuttle. They carry no collision or repeated draw calls.
    const strokes=[],high=level.terrain.frontHeight+.035;
    for(const channel of level.channels||[])for(let i=0;i<40;i++){
      if(i%10===0)continue;
      const a=i*Math.PI/20,b=(i+1)*Math.PI/20,r=channel.radius+.12;
      strokes.push(channel.x+Math.cos(a)*r,high,channel.z+Math.sin(a)*r,
        channel.x+Math.cos(b)*r,high,channel.z+Math.sin(b)*r);
    }
    for(let x=-3.8;x<2.45;x+=.56){
      strokes.push(x,1.777,-.39,x+.16,1.777,-.29,
        x,1.777,1.19,x+.16,1.777,1.09);
    }
    for(const z of [level.castingBank.z-.32,level.castingBank.z+.32])
      strokes.push(level.castingBank.x-.53,high,z,level.castingBank.x+.53,high,z);
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(strokes,3));
    const ink=new THREE.LineBasicMaterial({color:0x668e87,transparent:true,opacity:.74});
    nurseryMaterials.push(ink);group.add(new THREE.LineSegments(geometry,ink));
  }
  if(level.id===1&&!level.editorCustom){
    // Quiet floor inlays and rooted shoots frame the nursery route. They have
    // no collision and never change the apparent height of its low arcade.
    const seams=[];
    const ring=(x,z,r,y,segments=36)=>{for(let i=0;i<segments;i++){
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
      if(i%9===0)continue;
      seams.push(x+Math.cos(a)*r,y,z+Math.sin(a)*r,x+Math.cos(b)*r,y,z+Math.sin(b)*r);}};
    for(const [x,z,base] of level.pools||[])ring(x,z,.66,gardenFixtureHeight(level,x,z,base)+.028);
    for(const r of [1.19,1.48])ring(level.exit.x,level.exit.z,r,.033,48);
    const seamGeo=new THREE.BufferGeometry();seamGeo.setAttribute('position',new THREE.Float32BufferAttribute(seams,3));
    const seamMat=new THREE.LineBasicMaterial({color:0x7f8b7c,transparent:true,opacity:.62});nurseryMaterials.push(seamMat);
    group.add(new THREE.LineSegments(seamGeo,seamMat));
    const stemMat=new THREE.MeshBasicMaterial({color:0xb98276}),leafMat=new THREE.MeshBasicMaterial({color:0x83a49a});
    nurseryMaterials.push(stemMat,leafMat);
    for(const [x,z,y] of [[4.8,-4.15,1.62],[2.5,-4.15,1.62],[-5.8,4.38,0],[4.8,4.38,0]]){
      for(const dx of [-.16,0,.17]){
        const stem=new THREE.Mesh(new THREE.ConeGeometry(.055,.42+Math.abs(dx),5),stemMat);
        stem.position.set(x+dx,y+.22,z);group.add(stem);
        const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.11,0),leafMat);
        leaf.position.set(x+dx,y+.44+Math.abs(dx),z);group.add(leaf);}}
  }
  const start=level.start?add(new THREE.ConeGeometry(.23,.5,8),'start',level.start.x,
    gardenFixtureHeight(level,level.start.x,level.start.z)+.3,level.start.z):null;
  const root=labelRoot||(typeof document!=='undefined'?document.querySelector('#app'):null);
  const labels=(level.labels||[]).map(label=>{
    if(!root)return null;
    const node=document.createElement('div');node.className='world-label editor-label';node.textContent=label.text;
    node.hidden=true;root.append(node);
    return {node,point:new THREE.Vector3(label.x,label.base+label.offset,label.z)};
  }).filter(Boolean);
  const pressureLabel=level.gate&&level.basin&&root?document.createElement('div'):null;
  if(pressureLabel){pressureLabel.className='world-label garden-label';pressureLabel.hidden=true;root.append(pressureLabel);}
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
    if(pressureLabel){
      pressureLabel.hidden=true;
      if(gameplay&&sim?.garden?.phase==='playing'&&sim.gardenLevelId===level.id&&!menu&&camera&&rect?.width&&rect?.height){
        const point=new THREE.Vector3(level.basin.x,
          gardenFixtureHeight(level,level.basin.x,level.basin.z)+.35+group.position.y,
          level.basin.z+level.basin.radius+.2).project(camera);
        if(Number.isFinite(point.x)&&Number.isFinite(point.y)&&Math.abs(point.x)<=1&&Math.abs(point.y)<=1&&point.z>=-1&&point.z<=1){
          pressureLabel.textContent=`BASIN / ${sim.pressure?.weight??0} OF ${level.gate.threshold}`;
          pressureLabel.style.left=`${(point.x*.5+.5)*rect.width}px`;
          pressureLabel.style.top=`${(-point.y*.5+.5)*rect.height}px`;
          pressureLabel.hidden=false;
        }
      }
    }
  };
  const pickupPulses=(level.gems||[]).map(g=>({x:g.x,z:g.z,y:gardenFixtureHeight(level,g.x,g.z,g.base)+.38,
    color:0xf4d6ff,duration:.9,radius:.4})).concat((level.gold||[]).map(([x,z,base])=>({x,z,
    y:gardenFixtureHeight(level,x,z,base)+.17,color:0xffd27a,duration:.55,radius:.18})));
  const pulses=pickupPulses.map(p=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(p.radius,.018,5,32),
    new THREE.MeshBasicMaterial({color:p.color,transparent:true,opacity:0,depthWrite:false}));
    ring.rotation.x=Math.PI/2;ring.position.set(p.x,p.y,p.z);ring.visible=false;group.add(ring);return ring;});
  return {group,setCollarReady(ready){for(const m of exitParts)m.visible=!ready;},setEditing(value){editing=!!value;for(const m of cutterGhosts)m.visible=editing;},
    setPlaying(value){gameplay=!!value;for(const m of pools)m.visible=!gameplay;if(start)start.visible=!gameplay;},
    update(sim,camera){updateLabels(sim,camera);if(gatePanel)gatePanel.position.y=gateRestY+(sim.pressure?.opening||0);
      if(pressureFloor)pressureFloor.material.color.setHex(sim.pressure?.active?0x8da99f:0x887e72);
      gems.forEach((m,i)=>m.visible=!sim.garden.gems[i]?.collected);
    gold.forEach((m,i)=>m.visible=!sim.garden.gold[i]?.collected);
    tablets.forEach(({stone,halo},i)=>{const read=!!sim.garden.tablets[i]?.read;
      stone.material.color.setHex(read?0x9aaa91:0xd1b990);halo.visible=!read;});
    pulses.forEach((ring,i)=>{const pickup=i<gems.length?sim.garden.gems[i]:sim.garden.gold[i-gems.length],
      p=pickupPulses[i],age=sim.garden.elapsed-pickup?.collectedAt;
      ring.visible=gameplay&&pickup?.collected&&Number.isFinite(age)&&age>=0&&age<p.duration;
      if(ring.visible){ring.scale.setScalar(1+age*(i<gems.length?2.7:3.5));
        ring.material.opacity=(1-age/p.duration)*.9;}});
    pools.forEach((m,i)=>m.visible=!gameplay&&sim.fluid.particles.some(p=>p.feedstock&&p.patchId===i));
    if(start)start.visible=!gameplay&&sim.garden.phase==='title';},dispose(){scene.remove(group);group.traverse(o=>o.geometry?.dispose());
      for(const {node} of labels)node.remove();
      pressureLabel?.remove();
      if(level.csgSolid)disposeEditorSolid(level.csgSolid.revision);
      ink.dispose();slipInk.dispose();pressureFloor?.material.dispose();tablets.forEach(t=>t.stone.material.dispose());pulses.forEach(p=>p.material.dispose());
      nurseryMaterials.forEach(m=>m.dispose());Object.values(materials).forEach(m=>m.dispose());
      if(!sharedPrintLibrary)printLibrary.dispose();}};
}
