import * as THREE from 'three';
import {GARDEN,gardenColliders} from './garden-level.js';
import {groundAt} from './colliders.js';
import {addStoneEdges,facetedOctahedron,flutedPost} from './garden-ornaments.js';
import {cameraPointVisible} from './game-camera.js';

// Gameplay geometry only. Sky, castle, plants and finish art stay independent.
export function createGardenView(scene,{printLibrary}={}){
  const group=new THREE.Group();scene.add(group);
  const colliders=gardenColliders(),ink=0x31494a;
  const material=(color,extra={},role=null)=>{
    const m=new THREE.MeshBasicMaterial({color,...extra});
    return role?printLibrary?.decorate(m,role)||m:m;
  };
  const add=(geometry,color,extra={},role=null)=>{const mesh=new THREE.Mesh(geometry,material(color,extra,role));group.add(mesh);return mesh;};
  const outline=mesh=>mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.7})));
  const terrain=GARDEN.terrain,stairs=terrain.stairs,tier=terrain.startTier;
  const topRect=(x0,x1,z0,z1,color,exitHole=false,heightAt=()=>0,region='lower')=>{
    const shape=new THREE.Shape();shape.moveTo(x0,z0);shape.lineTo(x1,z0);shape.lineTo(x1,z1);shape.lineTo(x0,z1);shape.closePath();
    if(exitHole){const hole=new THREE.Path();hole.absarc(GARDEN.exit.x,GARDEN.exit.z,GARDEN.exit.radius,0,2*Math.PI,true);shape.holes.push(hole);}
    const geo=new THREE.ShapeGeometry(shape,48),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getY(i);p.setXYZ(i,x,heightAt(x,z),z);}
    geo.computeVertexNormals();const surface=add(geo,color,{side:THREE.DoubleSide},'floor');
    surface.userData.gardenFloor=region;surface.userData.pickableTerrain=true;
  };
  // Separate upper, ramp, and lower polygons keep real vertical ledge faces.
  topRect(-9.4,tier.minX,-5.2,terrain.frontZ,0xe9d5bb,false,()=>terrain.upperHeight,'upper');
  topRect(tier.minX,9.4,-5.2,tier.minZ,0xe9d5bb,false,()=>terrain.upperHeight,'upper');
  topRect(tier.minX,9.4,tier.maxZ,terrain.frontZ,0xe9d5bb,false,()=>terrain.upperHeight,'upper');
  const tierCuts=[tier.minX,...tier.steps.flatMap(s=>[s.x,s.x+s.width]),tier.maxX]
    .filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  const tierHeight=x=>groundAt(x,(tier.minZ+tier.maxZ)/2,[terrain]).height;
  for(let i=0;i<tierCuts.length-1;i++)topRect(tierCuts[i],tierCuts[i+1],tier.minZ,tier.maxZ,
    i%2?0xe3cbb5:0xecd8c1,false,x=>tierHeight(x),'start');
  const cuts=[terrain.frontZ,...stairs.steps.flatMap(s=>[s.z,s.z+s.width]),stairs.endZ].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++)topRect(stairs.minX,stairs.maxX,cuts[i],cuts[i+1],i%2?0xd9c6b1:0xe9d5bb,false,
    (x,z)=>groundAt((stairs.minX+stairs.maxX)/2,z,[terrain]).height,'stairs');
  topRect(-9.4,stairs.minX,terrain.frontZ,stairs.endZ,0xd9c6b1);
  topRect(stairs.maxX,9.4,terrain.frontZ,5.2,0xd9c6b1,true);
  topRect(-9.4,stairs.maxX,stairs.endZ,5.2,0xd9c6b1);
  const wall=(vertices,color=0xb6b0a0)=>{
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.computeVertexNormals();
    add(geo,color,{side:THREE.DoubleSide},'wall');
  };
  const wallZ=(x0,x1,z,top)=>wall([x0,top,z,x1,top,z,x0,0,z,x1,top,z,x1,0,z,x0,0,z]);
  const wallX=(x,z0,z1,h0,h1)=>wall([x,h0,z0,x,h1,z1,x,0,z0,x,h1,z1,x,0,z1,x,0,z0]);
  const tierWall=(x0,x1,z)=>{
    const y0=tierHeight(x0),y1=tierHeight(x1),base=terrain.upperHeight;
    wall([x0,y0,z,x1,y1,z,x0,base,z,x1,y1,z,x1,base,z,x0,base,z],0xc2aa98);
  };
  for(let i=0;i<tierCuts.length-1;i++){
    tierWall(tierCuts[i],tierCuts[i+1],tier.minZ);
    tierWall(tierCuts[i],tierCuts[i+1],tier.maxZ);
  }
  wallZ(-9.4,stairs.minX,terrain.frontZ,terrain.upperHeight);
  wallZ(stairs.maxX,9.4,terrain.frontZ,terrain.upperHeight);
  for(let i=0;i<cuts.length-1;i++){
    const z0=cuts[i],z1=cuts[i+1];
    const h0=groundAt((stairs.minX+stairs.maxX)/2,z0,[terrain]).height;
    const h1=groundAt((stairs.minX+stairs.maxX)/2,z1,[terrain]).height;
    wallX(stairs.minX,z0,z1,h0,h1);wallX(stairs.maxX,z0,z1,h0,h1);
  }
  wallZ(-9.4,9.4,-5.2,terrain.upperHeight);
  const baseShape=new THREE.Shape();baseShape.moveTo(-9.4,-5.2);baseShape.lineTo(9.4,-5.2);baseShape.lineTo(9.4,5.2);baseShape.lineTo(-9.4,5.2);baseShape.closePath();
  const baseHole=new THREE.Path();baseHole.absarc(GARDEN.exit.x,GARDEN.exit.z,GARDEN.exit.radius,0,2*Math.PI,true);baseShape.holes.push(baseHole);
  const foundation=add(new THREE.ExtrudeGeometry(baseShape,{depth:.55,bevelEnabled:false,curveSegments:48}),0xaaa698,{},'wall');foundation.rotation.x=Math.PI/2;foundation.position.y=-.012;
  // Sparse weathering is authored once in one line batch. It follows the
  // physical height function and never reads as an obstacle or collectible.
  let seed=87123;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const wear=[];const mark=(a,b)=>wear.push(...a,...b);
  for(let i=0;i<110;i++){
    const x=-8.8+random()*17.6,z=-4.85+random()*9.7;
    if(Math.hypot(x-GARDEN.exit.x,z-GARDEN.exit.z)<1.15)continue;
    const len=.035+random()*.12,turn=(random()-.5)*.04;
    const a=[x,groundAt(x,z,colliders).height+.022,z];
    const b=[x+len,groundAt(x+len,z+turn,colliders).height+.022,z+turn];
    mark(a,b);
    if(i%3===0)mark(b,[x+len+.035,groundAt(x+len+.035,z+turn-.025,colliders).height+.022,z+turn-.025]);
    if(i%5===0){const r=.012+random()*.02;
      for(let k=0;k<6;k++){const u=k*Math.PI/3,v=(k+1)*Math.PI/3;
        mark([x+r*Math.cos(u),a[1],z+r*Math.sin(u)],[x+r*Math.cos(v),a[1],z+r*Math.sin(v)]);}
    }
  }
  for(let i=0;i<24;i++){
    const x=-8.6+random()*17.2,y=.12+random()*1.3,z=terrain.frontZ+.023;
    mark([x,y,z],[x+.045,y-.13,z]);mark([x+.045,y-.13,z],[x-.012,y-.24,z]);
  }
  const wearGeo=new THREE.BufferGeometry();wearGeo.setAttribute('position',new THREE.Float32BufferAttribute(wear,3));
  group.add(new THREE.LineSegments(wearGeo,new THREE.LineBasicMaterial({color:0x6d746e,transparent:true,opacity:.26,depthWrite:false})));
  addStoneEdges(group,GARDEN,colliders);
  const r=GARDEN.roof;
  const lintel=add(new THREE.BoxGeometry(r.maxX-r.minX,r.top-r.bottom,r.maxZ-r.minZ),0xa5bfba,{transparent:true,opacity:.75},'lintel');
  lintel.position.set((r.minX+r.maxX)/2,(r.bottom+r.top)/2,(r.minZ+r.maxZ)/2);outline(lintel);
  // These pierced cream end supports occupy the original visual feet. The
  // turquoise collider span, its .32 underside and its exact opening remain
  // the only gameplay geometry of the low passage.
  const supportShape=new THREE.Shape();
  supportShape.moveTo(0,0);supportShape.lineTo(.75,0);supportShape.lineTo(.75,1.02);
  supportShape.lineTo(.61,1.06);supportShape.lineTo(.27,1.045);supportShape.lineTo(0,1.06);supportShape.closePath();
  const supportPore=new THREE.Path();supportPore.absellipse(.45,.81,.085,.14,0,Math.PI*2,true);
  supportShape.holes.push(supportPore);
  for(const z of [r.minZ-.14,r.maxZ+.14]){
    const foot=add(new THREE.ExtrudeGeometry(supportShape,{depth:.28,bevelEnabled:false,curveSegments:12}),
      0xdfcdb6,{},'wall');foot.position.z=z-.14;outline(foot);
  }
  const cap=new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(r.minX+.025,r.top+.006,r.minZ+.015),
    new THREE.Vector3(r.maxX-.025,r.top+.006,r.minZ+.015),
    new THREE.Vector3(r.maxX-.025,r.top+.006,r.maxZ-.015)]),
  new THREE.LineBasicMaterial({color:0xf0ddc6,transparent:true,opacity:.74}));group.add(cap);
  const postMaterial=material(0xe8d9c1,{vertexColors:true},'wall');
  const postInk=new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.7});
  const postGeometries=new Map();
  for(const p of GARDEN.posts){
    let shapes=postGeometries.get(p.height);
    if(!shapes){const body=flutedPost(p.radius,p.height);shapes={body,edges:new THREE.EdgesGeometry(body)};postGeometries.set(p.height,shapes);}
    const mesh=new THREE.Mesh(shapes.body,postMaterial);mesh.position.set(p.x,p.height/2,p.z);group.add(mesh);
    mesh.add(new THREE.LineSegments(shapes.edges,postInk));
  }
  const e=GARDEN.exit;
  const funnel=add(new THREE.CylinderGeometry(e.radius,e.bottomRadius,e.depth,48,1,true),0x888d87,{side:THREE.DoubleSide},'wall');funnel.position.set(e.x,-e.depth/2,e.z);
  // A recessed throat sits below the conical opening.
  const throat=add(new THREE.CircleGeometry(e.bottomRadius,40),0x263b3c);throat.rotation.x=-Math.PI/2;throat.position.set(e.x,-e.depth+.01,e.z);
  const rim=add(new THREE.TorusGeometry(e.radius,.035,6,48),0x31494a);rim.rotation.x=Math.PI/2;rim.position.set(e.x,.025,e.z);
  const pulse=(x,y,z,r,color)=>{
    const ring=add(new THREE.TorusGeometry(r,.018,5,32),color,{transparent:true,opacity:0,depthWrite:false});
    ring.rotation.x=Math.PI/2;ring.position.set(x,y,z);ring.visible=false;return ring;
  };
  const gems=GARDEN.gems.map(g=>{
    const gem=add(facetedOctahedron(.34),0xb5a5c7,{vertexColors:true},'gem');gem.position.set(g.x,groundAt(g.x,g.z,colliders).height+.34,g.z);outline(gem);
    const points=Array.from({length:65},(_,i)=>{const a=i/64*2*Math.PI;return new THREE.Vector3(g.x+Math.cos(a)*.47,groundAt(g.x,g.z,colliders).height+.025,g.z+Math.sin(a)*.47);});
    const track=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x886f98}));group.add(track);
    return {gem,track,burst:pulse(g.x,g.y??groundAt(g.x,g.z,colliders).height+.38,g.z,.4,0xf4d6ff)};
  });
  const gold=GARDEN.gold.map(([x,z])=>{
    const piece=add(facetedOctahedron(.13,'gold'),0xc89d46,{vertexColors:true},'gold');piece.position.set(x,groundAt(x,z,colliders).height+.13,z);outline(piece);
    return {piece,burst:pulse(x,groundAt(x,z,colliders).height+.17,z,.18,0xffd27a)};
  });
  const labels=[['FLOW UNDER',.4,1.2,2.2],['THE WAY DOWN',e.x,.12,e.z-1.1]].map(([text,x,y,z])=>{
    const el=document.createElement('div');el.className='world-label garden-label';el.textContent=text;document.querySelector('#app').append(el);return{el,position:new THREE.Vector3(x,y,z)};
  });
  return {group,setCollarReady(ready){funnel.visible=rim.visible=!ready;},update(sim,camera){
    const visible=sim.selectedTest==='garden'&&(sim.gardenLevelId===1||sim.gardenLevelId===2&&sim.descending&&sim.garden.phase==='arriving'&&sim.garden.arrivalTime<.85);group.visible=visible;
    labels.forEach(({el,position})=>{el.hidden=!visible||sim.isLocalGarden||sim.garden.phase!=='playing';if(!el.hidden){const v=position.clone().project(camera);
      el.hidden=!cameraPointVisible(v);if(!el.hidden){el.style.left=`${(v.x*.5+.5)*innerWidth}px`;el.style.top=`${(-v.y*.5+.5)*innerHeight}px`;}}});
    if(!visible||sim.isLocalGarden)return;
    sim.garden.gems.forEach((g,i)=>{const item=gems[i];item.gem.visible=!g.collected;item.track.visible=!g.collected;
      item.gem.material.color.setHex(g.coverage>.8?0xe3c8af:0xb5a5c7);item.track.geometry.setDrawRange(0,Math.max(2,Math.ceil(g.progress*65)));
      const age=sim.garden.elapsed-g.collectedAt,active=g.collected&&Number.isFinite(age)&&age>=0&&age<.9;
      item.burst.visible=active;
      if(active){item.burst.scale.setScalar(1+age*2.7);item.burst.material.opacity=(1-age/.9)*.9;}
    });
    sim.garden.gold.forEach((g,i)=>{const item=gold[i];item.piece.visible=!g.collected;item.piece.rotation.y=sim.fluid.time*.6+i;
      const age=sim.garden.elapsed-g.collectedAt,active=g.collected&&Number.isFinite(age)&&age>=0&&age<.55;
      item.burst.visible=active;
      if(active){item.burst.scale.setScalar(1+age*3.5);item.burst.material.opacity=(1-age/.55)*.9;}
    });
  }};
}
