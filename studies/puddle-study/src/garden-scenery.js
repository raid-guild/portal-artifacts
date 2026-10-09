import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GARDEN,WEIGHT_GARDEN,PASSAGE_GARDEN,REACH_GARDEN,GRIP_GARDEN,HOLLOW_CROWN,EMBER_CASCADE,gardenWorldOffset} from './garden-level.js';
import {groundAt} from './colliders.js';

const files={spine:'tower-spine-v3.glb',facadeA:'storey-facade-a-v3.glb',facadeB:'storey-facade-b-v3.glb',
  sideL1:'side-parapet-l1-v3.glb',sideDepth:'side-parapet-depth-v3.glb',sideGrip:'side-parapet-grip-v3.glb',
  rearL1:'rear-arch-wings-l1-v3.glb',rearDepth:'rear-arch-wings-v3.glb',
  trim:'switchback-trim-v2.glb',collar:'exit-collar-v2.glb'};
const base=(import.meta.env?.BASE_URL||'/').replace(/\/?$/,'/');
const ink=0x4d625d;

const stone=(color,decorate)=>decorate(new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),'wall');
export function disposeGraph(node){
  const geometry=new Set(),material=new Set(),texture=new Set();
  node.traverse(o=>{if(o.geometry)geometry.add(o.geometry);
    for(const m of (Array.isArray(o.material)?o.material:o.material?[o.material]:[])){
      material.add(m);for(const v of Object.values(m))if(v?.isTexture)texture.add(v);
    }
  });
  for(const g of geometry)g.dispose();for(const m of material)m.dispose();for(const t of texture)t.dispose();
}
function join(geometries){const merged=mergeGeometries(geometries,false);for(const g of geometries)g.dispose();return merged;}
function cylinderBetween(a,b,ra,rb,sides=6){
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),dir=end.clone().sub(start);
  const g=new THREE.CylinderGeometry(rb,ra,dir.length(),sides,1);
  g.applyMatrix4(new THREE.Matrix4().compose(start.add(end).multiplyScalar(.5),
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()),new THREE.Vector3(1,1,1)));
  return g;
}
function oval(cx,cy,rx,ry){const h=new THREE.Path();h.absellipse(cx,cy,rx,ry,0,Math.PI*2,true);return h;}
function archSpandrel(x0,x1,yTop,yBottom,z,seed){
  const shape=new THREE.Shape();
  const mid=(x0+x1)/2;
  shape.moveTo(x0,yTop);shape.lineTo(x1,yTop);shape.lineTo(x1-.08,yBottom);
  shape.lineTo(x1-.42,yBottom);
  shape.bezierCurveTo(x1-.55,-1.55,mid+.9,-.55,mid,-.52);
  shape.bezierCurveTo(mid-.9,-.55,x0+.55,-1.55,x0+.42,yBottom);
  shape.lineTo(x0+.08,yBottom);shape.closePath();
  // Asymmetric piercings sit in the solid shoulders above the arch opening.
  shape.holes.push(oval(x0+.44+(seed%2)*.035,-.49-(seed%3)*.045,.13+(seed%2)*.025,.31+(seed%3)*.035));
  if(seed%2===0)shape.holes.push(oval(x1-.45,-.42-(seed%3)*.06,.105,.255));
  const g=new THREE.ExtrudeGeometry(shape,{depth:.11,bevelEnabled:false,curveSegments:8,steps:1});
  g.translate(0,0,z);return {geometry:g,holes:shape.holes.map(h=>h.getPoints(24))};
}
function makeFrontBoundaryCrest(root,level,decorate){
  const b=level.boundary,innerZ=b.maxZ,outerZ=innerZ+.4;
  const x0=b.minX-.4,x1=b.maxX+.4;
  const crest=new THREE.Group();crest.name=`front-boundary-crest-${level.id}`;
  crest.userData.playableBoundaryZ=innerZ;
  const stoneFace=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,.32,outerZ-innerZ),stone(0xe5d4be,decorate));
  stoneFace.name=`front-boundary-stone-${level.id}`;
  stoneFace.position.set((x0+x1)/2,0,(innerZ+outerZ)/2);crest.add(stoneFace);
  const edge=new THREE.BufferGeometry();edge.setAttribute('position',new THREE.Float32BufferAttribute([
    x0+.08,.166,innerZ+.004,x1-.08,.166,innerZ+.004,
  ],3));
  const contour=new THREE.LineSegments(edge,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.7}));
  contour.name=`front-boundary-ink-${level.id}`;crest.add(contour);
  root.add(crest);return crest;
}
function makeDetails(root,level,decorate){
  // The authored facade is beneath the slab and may load after the scene.
  // This visible top crest stays independent of the arcade fallback toggle.
  makeFrontBoundaryCrest(root,level,decorate);
  const fallback=new THREE.Group();fallback.name=`fallback-arcade-${level.id}`;root.add(fallback);
  const webs=[],ribs=[],coral=[],sage=[],holeContours=[];
  // Each pierced shoulder grows from a facade support and leaves a large
  // arched void. The opening reaches the lower edge rather than reading as a
  // suspended plate with face-like holes.
  // The playable slab reaches maxZ + .4; the webs must tuck under that lip.
  const arcadeBays=[-9.55,-4.78,0,4.78,9.55],frontZ=level.boundary.maxZ+.35;
  for(let i=0;i<arcadeBays.length-1;i++){
    const x0=arcadeBays[i],x1=arcadeBays[i+1];
    const panel=archSpandrel(x0,x1,-.04,-2.75,frontZ,i);
    webs.push(panel.geometry);holeContours.push(...panel.holes);
    ribs.push(cylinderBetween([x0+.22,-.04,frontZ+.12],[x0+.18,-2.75,frontZ+.13],.16,.08));
    ribs.push(cylinderBetween([x1-.22,-.04,frontZ+.12],[x1-.18,-2.75,frontZ+.13],.16,.08));
  }
  // Rear ribs meet the existing spine and deck instead of floating between
  // its arches.
  const rearZ=level.boundary.minZ-.33,high=level.terrain.upperHeight??level.terrain.frontHeight??level.start.y??0;
  for(const x of [-7.6,-3.1,3.1,7.6]){
    // Short rooted gussets, seated against the underside of the rear lip.
    ribs.push(cylinderBetween([x,high-.035,rearZ],[x-.42,high-.82,rearZ-.3],.17,.07));
    ribs.push(cylinderBetween([x,high-.035,rearZ],[x+.28,high-.61,rearZ-.28],.13,.055));
  }
  const clusterPositions=[[-8.6,.03,frontZ],[-5.5,.03,frontZ],[-1.6,.03,frontZ],[2.8,.03,frontZ],[8.4,.03,frontZ],
    [-7.5,high+.02,rearZ],[-.7,high+.02,rearZ],[7.5,high+.02,rearZ]];
  for(let i=0;i<clusterPositions.length;i++){
    const [x,y,z]=clusterPositions[i];
    const prominent=i===0||i===4;
    for(let j=0;j<(prominent?5:3);j++){
      const a=j*2.4+i*.7,height=(prominent?1.13:.62)+.18*((i+j)%3),bend=(prominent?.43:.19)+.06*(j%2);
      const mid=[x+Math.cos(a)*bend*.42,y+height*.48,z+Math.sin(a)*bend*.42];
      const tip=[x+Math.cos(a)*bend,y+height,z+Math.sin(a)*bend];
      coral.push(cylinderBetween([x,y,z],mid,prominent?.13:.065,prominent?.09:.043,7),
        cylinderBetween(mid,tip,prominent?.09:.043,prominent?.024:.012,7));
      for(const sign of [-1,1]){
        const branch=[mid[0]+Math.cos(a+sign*.72)*bend*(prominent?1.15:.77),mid[1]+height*.35,
          mid[2]+Math.sin(a+sign*.72)*bend*(prominent?1.15:.77)];
        coral.push(cylinderBetween(mid,branch,prominent?.064:.027,prominent?.019:.009,6));
        if(prominent||j%2===0){const leaf=new THREE.IcosahedronGeometry(prominent?.125:.076,0);
          leaf.scale(.92,1.45,.66);leaf.translate(...branch);sage.push(leaf);}
      }
      if(j%2===0){const leaf=new THREE.IcosahedronGeometry(prominent?.12:.088,0);leaf.scale(.86,1.5,.65);leaf.translate(...tip);sage.push(leaf);}
      if(prominent){
        const paddle=new THREE.IcosahedronGeometry(.2,0);paddle.scale(.8,.55,1.45);
        paddle.rotateY(a);paddle.translate(x+Math.cos(a)*.2,y+.12,z+Math.sin(a)*.2);sage.push(paddle);
      }
    }
  }
  if(webs.length){
    const webGeometry=join(webs);
    const silhouette=new THREE.Mesh(webGeometry.clone(),new THREE.MeshBasicMaterial({color:ink,side:THREE.BackSide,transparent:true,opacity:.38,depthWrite:false}));
    silhouette.scale.set(1.004,1.009,1.004);silhouette.frustumCulled=false;fallback.add(silhouette);
    const web=new THREE.Mesh(webGeometry,stone(0xe2cfb4,decorate));web.frustumCulled=false;fallback.add(web);
  }
  const ribMesh=new THREE.Mesh(join(ribs),stone(0xcbb79c,decorate));ribMesh.frustumCulled=false;fallback.add(ribMesh);
  for(const [geometry,material] of [[join(coral),new THREE.MeshBasicMaterial({color:0xbd8278})],
    [join(sage),new THREE.MeshBasicMaterial({color:0x8ba9a0})]]){
    const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;root.add(mesh);
  }
  // One authored line batch: hole contours, vertical fractures and quiet
  // floor seams, with no per-triangle outline pass.
  const lines=[];
  const segment=(a,b)=>lines.push(...a,...b);
  for(const loop of holeContours)for(let k=0;k<loop.length;k++){
    const a=loop[k],b=loop[(k+1)%loop.length];segment([a.x,a.y,frontZ+.135],[b.x,b.y,frontZ+.135]);
  }
  for(let i=0;i<arcadeBays.length-1;i++){
    const fx=arcadeBays[i]+.8;segment([fx,-.04,frontZ+.14],[fx+.07,-.32,frontZ+.14]);segment([fx+.07,-.32,frontZ+.14],[fx-.03,-.53,frontZ+.14]);
  }
  for(const x of [-7,-3.2,.5,4.1,7.4]){
    segment([x,.016,frontZ-.38],[x+.7,.016,frontZ-.47]);segment([x+.7,.016,frontZ-.47],[x+.9,.016,frontZ-.52]);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
  fallback.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.5})));
  // The GLB trim predates the raised start patch. This thin seam reads as
  // joinery at its edge without adding a second floor or obstacle.
  if(level.id===1){
    const seam=[];const edge=(a,b)=>seam.push(...a,...b);
    const tier=GARDEN.terrain.startTier;
    for(const x of [tier.minX,...tier.steps.flatMap(s=>[s.x+s.width,s.x]),tier.maxX]){
      const y=groundAt(x,(tier.minZ+tier.maxZ)/2,[GARDEN.terrain]).height+.019;
      edge([x,y,tier.minZ+.04],[x,y,tier.maxZ-.04]);
    }
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(seam,3));
    root.add(new THREE.LineSegments(sg,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.58})));
  }
  return fallback;
}
function makeArchitectureFallback(root,level,decorate){
  const side=new THREE.Group(),rear=new THREE.Group();
  side.name=`fallback-side-${level.id}`;rear.name=`fallback-rear-${level.id}`;
  root.add(side,rear);
  const t=level.terrain,b=level.boundary;
  const bands=t.type==='flat'?[[b.minZ,b.maxZ,0]]:
    t.type==='switchback'?[[b.minZ,t.frontZ,t.upperHeight],[t.frontZ,b.maxZ,0]]:
    [[b.minZ,t.frontZ,t.frontHeight],[t.frontZ,t.rearZ,t.middleHeight],[t.rearZ,b.maxZ,0]];
  const rails=[];
  for(const [z0,z1,height] of bands)for(const x of [-9.21,9.21]){
    const g=new THREE.BoxGeometry(.34,.63,z1-z0);
    g.translate(x,height+.075,(z0+z1)/2);rails.push(g);
  }
  side.add(new THREE.Mesh(join(rails),stone(0xe0cdb4,decorate)));
  const high=t.upperHeight??t.frontHeight??level.start.y??0,rearZ=b.minZ-.28,arches=[];
  for(const [a,c] of [[-9.4,-2.75],[2.75,9.4]]){
    const mid=(a+c)/2;
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(a,high,rearZ),new THREE.Vector3(a+.45,high+1.7,rearZ),
      new THREE.Vector3(mid,high+3.3,rearZ),new THREE.Vector3(c-.45,high+1.8,rearZ),
      new THREE.Vector3(c,high,rearZ)]);
    arches.push(new THREE.TubeGeometry(curve,28,.22,6,false));
  }
  rear.add(new THREE.Mesh(join(arches),stone(0xe3d1ba,decorate)));
  return {side,rear};
}

export function setGardenStoreyVisibility(upperDetails,lowerStorey,loaded,levelId=1,showPredecessor=false,thirdStorey=null,fourthStorey=null,fifthStorey=null,sixthStorey=null,seventhStorey=null){
  const upperVisible=levelId===1||levelId===2&&showPredecessor;
  upperDetails.visible=upperVisible;
  lowerStorey.visible=levelId===2||levelId===3&&showPredecessor;
  if(thirdStorey)thirdStorey.visible=levelId===3||levelId===4&&showPredecessor;
  if(fourthStorey)fourthStorey.visible=levelId===4||levelId===5&&showPredecessor;
  if(fifthStorey)fifthStorey.visible=levelId===5||levelId===6&&showPredecessor;
  if(sixthStorey)sixthStorey.visible=levelId===6||levelId===7&&showPredecessor;
  if(seventhStorey)seventhStorey.visible=levelId===7;
  for(const key of ['trim','collar'])if(loaded.has(key))loaded.get(key).visible=upperVisible;
}

export function createGardenScenery(scene,{onExitReady=()=>{},printLibrary,loadAsset,loadSky}={}){
  const root=new THREE.Group();root.name='garden-tower-scenery';scene.add(root);
  const upperDetails=new THREE.Group();upperDetails.name='upper-garden-details';root.add(upperDetails);
  const decorate=(material,role)=>printLibrary?.decorate(material,role)||material;
  const upperFallback=makeDetails(upperDetails,GARDEN,decorate);
  const lowerStorey=new THREE.Group();lowerStorey.position.y=-7.2;root.add(lowerStorey);
  const thirdStorey=new THREE.Group();thirdStorey.position.y=-14.4;root.add(thirdStorey);
  const fourthStorey=new THREE.Group();fourthStorey.position.y=-21.6;root.add(fourthStorey);
  const fifthStorey=new THREE.Group();fifthStorey.position.y=-28.8;root.add(fifthStorey);
  const sixthStorey=new THREE.Group();sixthStorey.position.y=-36;root.add(sixthStorey);
  const seventhStorey=new THREE.Group();seventhStorey.position.y=gardenWorldOffset(7);root.add(seventhStorey);
  const lowerFallbacks=[upperFallback];
  for(const [storey,level] of [[lowerStorey,WEIGHT_GARDEN],[thirdStorey,PASSAGE_GARDEN],
    [fourthStorey,REACH_GARDEN],[fifthStorey,GRIP_GARDEN],[sixthStorey,HOLLOW_CROWN],[seventhStorey,EMBER_CASCADE]])lowerFallbacks.push(makeDetails(storey,level,decorate));
  const architectureFallbacks=[
    [upperDetails,GARDEN],[lowerStorey,WEIGHT_GARDEN],[thirdStorey,PASSAGE_GARDEN],
    [fourthStorey,REACH_GARDEN],[fifthStorey,GRIP_GARDEN],[sixthStorey,HOLLOW_CROWN],[seventhStorey,EMBER_CASCADE],
  ].map(([storey,level])=>makeArchitectureFallback(storey,level,decorate));
  // A small open chute mouth marks the new high landing without obscuring the
  // pink stream. It is decorative; the moving particles remain the only body.
  const chute=new THREE.Group();chute.position.set(WEIGHT_GARDEN.start.x,0,WEIGHT_GARDEN.start.z);lowerStorey.add(chute);
  const mouth=new THREE.Mesh(new THREE.TorusGeometry(.31,.055,7,28),stone(0xd4bba6,(m,role)=>printLibrary?.decorate(m,role)||m));
  mouth.rotation.x=Math.PI/2;mouth.position.y=2.93;chute.add(mouth);
  const chuteRibs=[-.27,.27].map(x=>cylinderBetween([x,2.92,0],[x*.75,3.48,.48],.055,.032,6));
  chute.add(new THREE.Mesh(join(chuteRibs),stone(0xc9b39e,(m,role)=>printLibrary?.decorate(m,role)||m)));
  const thirdChute=chute.clone(true);
  thirdChute.position.set(PASSAGE_GARDEN.start.x,0,PASSAGE_GARDEN.start.z);
  thirdStorey.add(thirdChute);
  const fourthChute=chute.clone(true);
  fourthChute.position.set(REACH_GARDEN.start.x,0,REACH_GARDEN.start.z);
  fourthStorey.add(fourthChute);
  const fifthChute=chute.clone(true);
  fifthChute.position.set(GRIP_GARDEN.start.x,0,GRIP_GARDEN.start.z);
  fifthStorey.add(fifthChute);
  const sixthChute=chute.clone(true);sixthChute.position.set(HOLLOW_CROWN.start.x,
    HOLLOW_CROWN.start.y-2.16,HOLLOW_CROWN.start.z);sixthStorey.add(sixthChute);
  const seventhChute=chute.clone(true);seventhChute.position.set(EMBER_CASCADE.start.x,EMBER_CASCADE.start.y-2.16,EMBER_CASCADE.start.z);seventhStorey.add(seventhChute);
  const loaded=new Map(),loader=new GLTFLoader(),skyLoader=new THREE.TextureLoader();
  const requestAsset=loadAsset||((url,onLoad,onError)=>loader.load(url,onLoad,undefined,onError));
  const requestSky=loadSky||((url,onLoad,onError)=>skyLoader.load(url,onLoad,undefined,onError));
  let disposed=false,sky=null,structuralReady=false;
  const fallbackSpine=()=>loader.load(`${base}art/tower/tower-spine-v2.glb`,gltf=>{
    if(disposed||loaded.has('spine')){disposeGraph(gltf.scene);return;}
    gltf.scene.traverse(o=>{if(!o.isMesh)return;
      for(const m of (Array.isArray(o.material)?o.material:[o.material]))
        if(/Sand|Shell|Bone/i.test(m.name))printLibrary?.decorate(m,'wall');
    });
    loaded.set('spine',gltf.scene);root.add(gltf.scene);structuralReady=true;
  },undefined,()=>{});
  for(const [key,file] of Object.entries(files))requestAsset(`${base}art/tower/${file}`,gltf=>{
    if(disposed){disposeGraph(gltf.scene);return;}
    gltf.scene.traverse(o=>{if(!o.isMesh)return;
      for(const m of (Array.isArray(o.material)?o.material:[o.material])){
        // This thin violet insert sits directly behind the new pierced
        // shoulder row and repeats as a necklace of uniform purple ovals.
        // Keep the rest of the authored trim and its ink seams intact.
        if(key==='trim'&&/Violet recess/i.test(m.name))m.visible=false;
        const role=/Bone|Shell|Warm|Hole interior|Crest/i.test(m.name)?'wall':
          /Violet/i.test(m.name)&&key==='spine'?'violetStone':null;
        if(role)printLibrary?.decorate(m,role);
      }
    });
    loaded.set(key,gltf.scene);
    if(key==='facadeA'||key==='facadeB'){
      const destinations=key==='facadeA'?
        [[upperDetails,0],[thirdStorey,2],[fifthStorey,4]]:
        [[lowerStorey,1],[fourthStorey,3],[sixthStorey,5],[seventhStorey,6]];
      for(const [storey,index] of destinations){storey.add(gltf.scene.clone(true));lowerFallbacks[index].visible=false;}
    }else if(key==='sideL1'){
      upperDetails.add(gltf.scene.clone(true));architectureFallbacks[0].side.visible=false;
    }else if(key==='sideDepth')for(const [storey,index] of [[lowerStorey,1],[thirdStorey,2],[fourthStorey,3]]){
      storey.add(gltf.scene.clone(true));architectureFallbacks[index].side.visible=false;
    }
    else if(key==='sideGrip'){
      fifthStorey.add(gltf.scene.clone(true));architectureFallbacks[4].side.visible=false;
    }else if(key==='rearL1'){
      upperDetails.add(gltf.scene.clone(true));architectureFallbacks[0].rear.visible=false;
    }
    else if(key==='rearDepth'){
      for(const [storey,index] of [[lowerStorey,1],[thirdStorey,2],[fourthStorey,3],[fifthStorey,4],[sixthStorey,5],[seventhStorey,6]]){
        storey.add(gltf.scene.clone(true));architectureFallbacks[index].rear.visible=false;
      }
    }else root.add(gltf.scene);
    if(key==='collar'){
      const lowerCollar=gltf.scene.clone(true);
      lowerCollar.position.x=WEIGHT_GARDEN.exit.x-GARDEN.exit.x;
      lowerCollar.position.z=WEIGHT_GARDEN.exit.z-GARDEN.exit.z-lowerStorey.position.z;
      lowerStorey.add(lowerCollar);
      const thirdCollar=gltf.scene.clone(true);
      thirdCollar.position.x=PASSAGE_GARDEN.exit.x-GARDEN.exit.x;
      thirdCollar.position.z=PASSAGE_GARDEN.exit.z-GARDEN.exit.z-thirdStorey.position.z;
      thirdStorey.add(thirdCollar);
      const fourthCollar=gltf.scene.clone(true);
      fourthCollar.position.x=REACH_GARDEN.exit.x-GARDEN.exit.x;
      fourthCollar.position.z=REACH_GARDEN.exit.z-GARDEN.exit.z-fourthStorey.position.z;
      fourthStorey.add(fourthCollar);
      const fifthCollar=gltf.scene.clone(true);
      fifthCollar.position.x=GRIP_GARDEN.exit.x-GARDEN.exit.x;
      fifthCollar.position.z=GRIP_GARDEN.exit.z-GARDEN.exit.z-fifthStorey.position.z;
      fifthStorey.add(fifthCollar);
      const seventhCollar=gltf.scene.clone(true);seventhCollar.position.x=EMBER_CASCADE.exit.x-GARDEN.exit.x;seventhCollar.position.z=EMBER_CASCADE.exit.z-GARDEN.exit.z-seventhStorey.position.z;seventhStorey.add(seventhCollar);
    }
    if(key==='spine'||key==='facadeA'||key==='facadeB')structuralReady=true;
    if(key==='collar')onExitReady(true);
  },()=>{
    if(disposed)return;
    if(key==='spine')fallbackSpine();
    if(key==='collar')onExitReady(false);
  });
  requestSky(`${base}art/tower-sky-v3.png`,texture=>{
    if(disposed){texture.dispose();return;}
    texture.colorSpace=THREE.SRGBColorSpace;sky=texture;
  },()=>{});
  const clear=new THREE.Color(0xc7e2df),skyAspect=1536/1024;
  return {
    get structuralReady(){return structuralReady;},
    get loadedCount(){return loaded.size;},
    update(active,width,height,levelId=1,showUpperDuringDescent=false,skyOnly=false){
      root.visible=active&&!skyOnly;
      setGardenStoreyVisibility(upperDetails,lowerStorey,loaded,levelId,showUpperDuringDescent,thirdStorey,fourthStorey,fifthStorey,sixthStorey,seventhStorey);
      if(active&&sky){
        const aspect=width/height;
        if(aspect>skyAspect){sky.repeat.set(1,skyAspect/aspect);sky.offset.set(0,(1-sky.repeat.y)/2);}
        else{sky.repeat.set(aspect/skyAspect,1);sky.offset.set((1-sky.repeat.x)/2,0);}
        scene.background=sky;
      }else scene.background=clear;
    },
    dispose(){if(disposed)return;disposed=true;onExitReady(false);scene.remove(root);disposeGraph(root);sky?.dispose();scene.background=clear;}
  };
}
