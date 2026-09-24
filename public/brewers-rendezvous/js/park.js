import * as THREE from 'three';
import { GLTFLoader } from '../vendor/loaders/GLTFLoader.js';
import { stops, breweryStops } from './content.js';
import { neighbors } from './neighbors.js';
import { neighborStatus } from './neighbor-state.js';
import { localToWorld, parkBlocked, routeIsClear } from './layout.js';
import { createAmbience } from './ambience.js';
import { createValley } from './valley.js';
import { visitorRoutes } from './crowd-routes.js';
import { projectLabels } from './label-projection.js';
import { createPointerGesture } from './pointer-gesture.js';
import { boothStatus, servicePoint, createPourSession } from './tasting.js';
import { createPourScene } from './pour-scene.js';

const mat = (color, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
const palette = {
  grass: mat('#93ad79'), grassLight: mat('#acc392'), grassDark: mat('#759669'),
  path: mat('#d5c7a8'), bank: mat('#c3b994'), river: new THREE.MeshStandardMaterial({ color: '#7eabb0', roughness: .48, metalness: .04 }),
  ink: mat('#314938'), wood: mat('#76513a'), woodLight: mat('#b57d50'), cream: mat('#f6ead0'),
  shadow: new THREE.MeshBasicMaterial({ color: '#284833', transparent: true, opacity: .12, depthWrite: false })
};

function mesh(geometry, material, x = 0, y = 0, z = 0, parent) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.receiveShadow = true;
  object.castShadow = true;
  parent.add(object);
  return object;
}
function box(w, h, d, material, x, y, z, parent) { return mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent); }
function disc(radius, material, x, y, z, parent) {
  const o = mesh(new THREE.CircleGeometry(radius, 24), material, x, y, z, parent);
  o.rotation.x = -Math.PI / 2;
  o.castShadow = false;
  return o;
}
function tentRoof(color, parent) {
  const y = 2.85, edge = 2.1, peak = 3.52, half = 2.65;
  const positions = new Float32Array([
    -half,y,-edge, 0,peak,-edge, 0,peak,edge, -half,y,-edge, 0,peak,edge, -half,y,edge,
    0,peak,-edge, half,y,-edge, half,y,edge, 0,peak,-edge, half,y,edge, 0,peak,edge,
    -half,y,-edge, half,y,-edge, 0,peak,-edge, -half,y,edge, 0,peak,edge, half,y,edge
  ]);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geo.computeVertexNormals();
  const roof = mesh(geo, new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 1, flatShading: true }), 0, 0, 0, parent);
  roof.castShadow = true;
  for (const x of [-2.35, 2.35]) for (const z of [-1.8, 1.8]) box(.14, 2.72, .14, palette.woodLight, x, 1.36, z, parent);
  box(4.7, .82, 1.1, palette.woodLight, 0, 1.02, 1.37, parent);
  box(4.72, .13, 1.18, palette.cream, 0, 1.51, 1.37, parent);
  return roof;
}
function booth(stop, scene, clickable, roofObstacles) {
  const center = localToWorld(stop, 0, -1.3);
  const group = new THREE.Group(); group.position.set(center.x, 0, center.z);group.rotation.y=stop.facing||0;scene.add(group);
  const matCanopy = mat(stop.color);
  roofObstacles.push(tentRoof(stop.color, group));
  box(4.5, .16, .06, palette.cream, 0, 2.77, 1.9, group);
  for (let i = -2; i <= 2; i++) {
    const flag = mesh(new THREE.ConeGeometry(.18, .22, 3), i % 2 ? matCanopy : palette.cream, i * .75, 2.6, 1.97, group);
    flag.rotation.z = Math.PI;
  }
  // Tiny taps and cups help these read as brewery booths even when labels are hidden.
  for (let i = -1; i <= 1; i++) {
    box(.1, .52, .1, palette.ink, i * .92, 1.87, 1.4, group);
    mesh(new THREE.CylinderGeometry(.14, .11, .29, 8), palette.cream, i * .92 + .26, 1.74, 1.42, group);
  }
  group.traverse((child) => { if (child.isMesh) clickable.set(child, stop.id); });
  return group;
}
function ellipse(x, z, rx, rz, material, scene, y = .04) {
  const object = mesh(new THREE.CircleGeometry(1, 32), material, x, y, z, scene);
  object.rotation.x = -Math.PI / 2; object.scale.set(rx, rz, 1); object.castShadow = false;
  return object;
}
function makeScene(scene, clickable, roofObstacles) {
  scene.background = null;
  scene.fog = new THREE.Fog('#dce7d2', 60, 105);
  const ground = box(53, .95, 34, palette.grass, 0, -.54, 2.4, scene);
  ground.castShadow = false;
  box(53, .23, 4.35, palette.bank, 0, -.01, -10.9, scene);
  box(53, .1, 4, palette.river, 0, .08, -12.22, scene);
  box(53, .07, 2.45, palette.path, 0, .03, 15.95, scene);
  const lawnPatches = [[-20,-5,3.4,1.6],[-6,-5.2,4.6,1.2],[6,-5.6,3.2,1.1],[18,-7,3,1.2],[-18,7,3,1.4],[-4,7,4,1],[10,7,3,1.4],[-18,14,3,1],[-4,14,4,1],[10,14,4,1]];
  lawnPatches.forEach(([x,z,rx,rz], i) => ellipse(x,z,rx,rz,i%2?palette.grassDark:palette.grassLight,scene,.045));
  // Pale path cuts the tent row without asking visitors to follow one strict route.
  ellipse(-3.8, 5.05, 22, 1.35, palette.path, scene, .07);
  ellipse(16.5, 5.05, 5.6, 1.35, palette.path, scene, .07);
  // River stones and loose clusters of flowers.
  for (let i=0;i<45;i++) {
    const x=-25+(i*11.73)%50, z=-9.9+((i*7.31)%13);
    if(z>-7.5 && z<8.8 && i%3===0) {
      const flower=mesh(new THREE.IcosahedronGeometry(.10+(i%3)*.027,0),mat(i%2?'#f1d59a':'#f8ece0'),x,.2,z,scene);flower.castShadow=false;
    } else if(z<-7.5) {
      const stone=mesh(new THREE.DodecahedronGeometry(.23+(i%4)*.07,0),mat('#c7c5ad'),x,.09,-9.85+(i%3)*.3,scene);
      stone.scale.y=.42;
    }
  }
  breweryStops.forEach(s=>booth(s,scene,clickable,roofObstacles));
  // Water station. The aqua cooler reads from a distance.
  box(3.15,.83,1.25,palette.woodLight,13.5,.56,1.3,scene);
  box(1.08,1.22,1.05,mat('#b8d3d1'),12.4,1.46,1.3,scene);
  mesh(new THREE.CylinderGeometry(.23,.23,.2,12),palette.cream,12.4,2.17,1.3,scene);
  box(.32,.13,.22,palette.ink,12.4,1.21,1.87,scene);
  box(1.3,.18,1.2,palette.cream,14.45,1.05,1.3,scene);
  // Small outdoor stage at the east end.
  box(6.8,.75,3.4,palette.wood,17.2,.46,-5.15,scene);
  for(const x of [14.3,20.1]) box(.24,3.2,.24,palette.woodLight,x,2.03,-6.65,scene);
  const stageRoof=box(6.8,.2,3.4,mat('#507168'),17.2,3.62,-5.15,scene); stageRoof.rotation.z=-.035;
  for(const x of [15.2,19.2]) box(.75,1.25,.62,palette.ink,x,1.45,-4.25,scene);
  mesh(new THREE.CylinderGeometry(.06,.06,1.5,8),palette.ink,17.4,1.55,-4.15,scene);
  // Wayfinding mark along Sackett Ave.
  box(.12,2.15,.12,palette.wood,21.3,1.08,15,scene);
  box(1.5,.66,.13,palette.cream,21.3,2.2,15,scene);
  for(const stop of stops.filter(s=>s.type==='story')) {
    const hit=mesh(new THREE.CylinderGeometry(1.3,1.3,.03,16),new THREE.MeshBasicMaterial({visible:false}),stop.x,.1,stop.z,scene);
    clickable.set(hit,stop.id);
  }
  return ground;
}

function findPart(root, name) { return root.getObjectByName(name); }
function setupCharacter(root) {
  root.traverse((node)=> { if(node.isMesh) {node.castShadow=true;node.receiveShadow=true;} });
  return {
    root, body:findPart(root,'Body'), head:findPart(root,'Head'),
    left:findPart(root,'ArmL'),right:findPart(root,'ArmR'),
    legL:findPart(root,'LegL'),legR:findPart(root,'LegR'),tail:findPart(root,'Tail')
  };
}
function animateCharacter(character, time, moving, amplitude = 1) {
  if(!character) return;
  const sway=Math.sin(time*7.5)* (moving?.24:.028)*amplitude;
  if(character.left) character.left.rotation.x=sway;
  if(character.right) character.right.rotation.x=-sway;
  if(character.legL) character.legL.rotation.x=-sway;
  if(character.legR) character.legR.rotation.x=sway;
  if(character.body) character.body.position.y= Math.abs(Math.sin(time*7.5))*(moving?.055:.015)*amplitude;
  if(character.head) character.head.rotation.z=Math.sin(time*1.9)*.035*amplitude;
  if(character.tail) character.tail.rotation.y=Math.sin(time*2.2)*.12*amplitude;
}

export async function createPark(host, onInteract, onReady, onFailure) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
  } catch(error) { onFailure(error); return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.02;
  renderer.autoClear=false;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Miniature Riverside Park. Tap to walk, drag to rotate, scroll to zoom, use arrow keys or W A S D to walk relative to the camera, and Q or E to rotate. Select labeled stops to explore.');
  renderer.domElement.setAttribute('role','application');
  renderer.domElement.tabIndex = 0;

  const scene=new THREE.Scene(), clickable=new WeakMap(),roofObstacles=[];
  const valley=createValley();
  const ground=makeScene(scene,clickable,roofObstacles);
  let bandPlaying=false;
  const neighborActors=new Map();
  const mapAnchors=[...stops,...neighbors.map(n=>({...n,labelHeight:n.kind==='music'?4.4:2.8}))];
  let ambience=createAmbience(scene,ground);
  function disposeAmbience(){ambience?.dispose();ambience=null;}
  scene.add(new THREE.HemisphereLight('#f8f1dc','#54755e',1.5));
  const sun=new THREE.DirectionalLight('#fff0cc',2.0);sun.position.set(-18,30,20);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-32;sun.shadow.camera.right=32;sun.shadow.camera.top=26;sun.shadow.camera.bottom=-26;
  sun.shadow.normalBias=.035;sun.shadow.bias=-.00008;scene.add(sun);
  const camera=new THREE.OrthographicCamera(-30,30,17,-17,.1,150);
  const followCamera=new THREE.PerspectiveCamera(50,1,.1,150);
  let viewMode='diorama',followZoom=1;
  const activeCamera=()=>viewMode==='follow'&&!serviceView?followCamera:camera;
  const homeYaw=Math.atan2(31,35),homeElevation=Math.atan2(29,Math.hypot(31,35));
  const cameraRadius=Math.hypot(31,29,35);
  let yaw=homeYaw,elevation=homeElevation;
  const focus=new THREE.Vector3(0,1.6,0);
  let targetFocus=focus.clone();
  const playerPos=new THREE.Vector3(-4.5,0,5.8), target=playerPos.clone();
  let player=null, playerParts=null, paused=false, reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ambience.setReduced(reduced);
  let contextWasLost=false;
  let gesture=null, serviceView=null, approachingBooth=null;
  const pourRigs=new Map();
  const pourSession=createPourSession();
  function contextLost(event){event.preventDefault();contextWasLost=true;paused=true;gesture?.cancel();pourSession.cancel();for(const rig of pourRigs.values())rig.dispose();pourRigs.clear();disposeAmbience();valley.dispose();onFailure(new Error('WebGL context was lost.'));}
  renderer.domElement.addEventListener('webglcontextlost',contextLost,false);
  const npcs=[], patrols=[], trees=[];
  const loader=new GLTFLoader();
  function load(path) {return new Promise((resolve,reject)=>loader.load(path,g=>resolve(g.scene),undefined,reject));}
  const loaded=await Promise.allSettled([
    load('./assets/models/character-fox.glb'), load('./assets/models/character-bear.glb'),
    load('./assets/models/character-rabbit.glb'), load('./assets/models/cottonwood.glb')
  ]);
  if(contextWasLost){renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.domElement.remove();return null;}
  if(loaded.some(r=>r.status==='rejected')) {
    onFailure(new Error('Some scene models could not load.'));
    renderer.domElement.removeEventListener('webglcontextlost',contextLost);
    disposeAmbience();valley.dispose();
    renderer.dispose();renderer.domElement.remove();return null;
  }
  const [fox,bear,rabbit,tree]=loaded.map(r=>r.value);
  player=fox; player.position.copy(playerPos);player.scale.setScalar(1.6);scene.add(player);playerParts=setupCharacter(player);
  const addNpc=(model,x,z,yaw=0,y=0)=>{const actor=model.clone(true);actor.position.set(x,y,z);actor.rotation.y=yaw;actor.scale.setScalar(1.6);scene.add(actor);const parts=setupCharacter(actor);npcs.push(parts);return parts;};
  const hostModels={bear,fox,rabbit};
  const boothHosts=new Map(breweryStops.map((stop,index)=>{
    // The counter's rear edge is at local Z -.52. Leave room for the
    // scaled character's body and muzzle on the staff side of every booth.
    const point=localToWorld(stop,0,-1.15);
    return [stop.id,addNpc(hostModels[stop.host]||[bear,rabbit,bear][index%3],point.x,point.z,stop.facing||0)];
  }));
  for(const stop of breweryStops)pourRigs.set(stop.id,createPourScene(scene,boothHosts.get(stop.id),stop));
  const performer=addNpc(fox,16.7,-4.7,0,.84);
  for(const person of neighbors){
    const actor=person.kind==='music'?performer:addNpc(hostModels[person.animal],person.x,person.z,person.facing||0);
    neighborActors.set(person.id,actor);
    actor.root.traverse(node=>{if(node.isMesh)clickable.set(node,`neighbor:${person.id}`);});
  }
  // A compact synth at paw height, with alternating black and white keys.
  const keyboard=new THREE.Group();scene.add(keyboard);
  box(2.65,.2,.78,palette.ink,16.7,1.83,-4.05,keyboard);
  for(let i=0;i<18;i++)box(.133,.07,.55,palette.cream,15.49+i*.142,1.965,-3.99,keyboard);
  for(let i=0;i<17;i++)if(![2,6].includes(i%7))box(.075,.07,.3,palette.ink,15.56+i*.142,2.035,-4.11,keyboard);
  for(const x of [15.7,17.7])box(.1,.85,.1,palette.ink,x,1.31,-4.05,keyboard);
  keyboard.traverse(node=>{if(node.isMesh)clickable.set(node,'neighbor:keys');});
  // These positions keep the monumental crowns around the booth row, rather than across it.
  [
    [-23,-6.6,1.12],[-16,-7.8,.97],[-8,-8.1,1.08],[1,-7.9,.99],
    [10,-8.1,1.05],[23,-7.2,1.18],[-24,6.3,.9],[23,4.6,.78]
  ].forEach(([x,z,s])=>{
    const t=tree.clone(true);t.position.set(x,0,z);t.scale.setScalar(s);t.rotation.y=(x*17)%6;
    t.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});
    scene.add(t);trees.push(t);
    ellipse(x,z,2.4*s,1.2*s,palette.shadow,scene,.09);
  });
  ambience.attachTrees(trees);
  onReady();
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2(), groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  let zoom=1, overview=false, focusStop=null;
  const keys=new Set();let selected=null, selectedNeighbor=null, approachingNeighbor=null, last=performance.now(), elapsed=0, route=[];
  const blocked=(x,z)=>parkBlocked(x,z,breweryStops);
  const cupGlass=new THREE.MeshStandardMaterial({color:'#e4eee7',transparent:true,opacity:.3,depthWrite:false,roughness:.25,metalness:.02});
  const cupBeer=mat('#d99132',.4),cupFoam=mat('#fff5d7');
  const cupShape=new THREE.CylinderGeometry(.075,.06,.24,8,1,true),beerShape=new THREE.CylinderGeometry(.064,.053,.15,8),foamShape=new THREE.CylinderGeometry(.066,.066,.018,8);
  function giveTaster(parts){
    if(!parts.right)return null;
    parts.right.rotation.x=-.45;
    parts.right.rotation.z=.35;
    const glass=new THREE.Group();glass.position.set(.425,.61,.14);
    const shell=new THREE.Mesh(cupShape,cupGlass);shell.castShadow=false;glass.add(shell);
    const beer=new THREE.Mesh(beerShape,cupBeer);beer.position.y=-.035;glass.add(beer);
    const foam=new THREE.Mesh(foamShape,cupFoam);foam.position.y=.05;glass.add(foam);
    parts.root.add(glass);
    return glass;
  }
  visitorRoutes.forEach((route,number)=>{
    if(!routeIsClear(route.points,breweryStops))throw new Error(`Animal patrol ${number+1} crosses a park obstacle.`);
    const actor=hostModels[route.animal].clone(true);
    actor.position.set(route.points[0][0],0,route.points[0][1]);
    actor.scale.setScalar(1.6);scene.add(actor);
    const parts=setupCharacter(actor);
    actor.traverse(node=>{if(node.isMesh){node.castShadow=false;node.receiveShadow=false;}});
    const glass=route.glass?giveTaster(parts):null;
    const shadow=ellipse(actor.position.x,actor.position.z,.46,.27,palette.shadow,scene,.095);
    patrols.push({parts,glass,shadow,points:route.points,index:1,speed:route.speed,pause:1.5+(number%4)*.55,phase:number*1.31});
  });
  function updatePatrols(dt){
    for(const patrol of patrols){
      const actor=patrol.parts.root;
      let moving=false;
      if(patrol.pause>0)patrol.pause=Math.max(0,patrol.pause-dt);
      else{
        const next=patrol.points[patrol.index];
        const dx=next[0]-actor.position.x,dz=next[1]-actor.position.z;
        const distance=Math.hypot(dx,dz);
        if(distance<.06){
          patrol.index=(patrol.index+1)%patrol.points.length;
          patrol.pause=2+((patrol.index+patrol.phase*3)%4)*.52;
        }else{
          const step=Math.min(distance,dt*patrol.speed);
          let vx=dx/distance,vz=dz/distance;
          // Gentle separation is enough for this small crowd. Recheck each
          // frame, so a stopped player does not trap an NPC in a long wait.
          const neighbors=[playerPos,...[...neighborActors.values()].map(n=>n.root.position),...patrols.filter(other=>other!==patrol).map(other=>other.parts.root.position)];
          for(const near of neighbors){
            const awayX=actor.position.x-near.x,awayZ=actor.position.z-near.z;
            const gap=Math.hypot(awayX,awayZ);
            if(gap>1.45)continue;
            const safe=Math.max(gap,.08),weight=(1.45-gap)*2.1;
            vx+=awayX/safe*weight;vz+=awayZ/safe*weight;
            if(gap<.3){vx+=(patrol.phase%2?1:-1)*.35;vz+=.25;}
          }
          const vectorLength=Math.hypot(vx,vz)||1;
          vx/=vectorLength;vz/=vectorLength;
          const candidateX=actor.position.x+vx*step,candidateZ=actor.position.z+vz*step;
          const separated=neighbors.every(near=>{
            const before=Math.hypot(actor.position.x-near.x,actor.position.z-near.z);
            const after=Math.hypot(candidateX-near.x,candidateZ-near.z);
            return after>.61 || (before<=.61 && after>before);
          });
          if(!blocked(candidateX,candidateZ)&&separated){
            actor.position.x=candidateX;actor.position.z=candidateZ;
            moving=true;
          }
          const aim=moving?Math.atan2(vx,vz):Math.atan2(dx,dz);
          const difference=Math.atan2(Math.sin(aim-actor.rotation.y),Math.cos(aim-actor.rotation.y));
          actor.rotation.y+=difference*Math.min(1,dt*3.8);
        }
      }
      patrol.shadow.position.x=actor.position.x;
      patrol.shadow.position.z=actor.position.z;
      animateCharacter(patrol.parts,elapsed+patrol.phase,moving,.82);
      if(patrol.glass){
        const lift=!moving&&patrol.pause>0&&Math.sin(elapsed*.57+patrol.phase)>.76;
        const amount=lift?1:0;
        patrol.parts.right.rotation.x=-.45;
        patrol.parts.right.rotation.z=THREE.MathUtils.lerp(patrol.parts.right.rotation.z,.35+amount*1.35,Math.min(1,dt*4));
        patrol.glass.position.x=THREE.MathUtils.lerp(patrol.glass.position.x,.425+amount*.075,Math.min(1,dt*4));
        patrol.glass.position.y=THREE.MathUtils.lerp(patrol.glass.position.y,.61+amount*.36,Math.min(1,dt*4));
      }
    }
  }
  function findRoute(toX,toZ){
    const unit=1.05,xmin=-24,zmin=-8.4,nx=47,nz=23;
    const coord=(x,z)=>[Math.max(0,Math.min(nx-1,Math.round((x-xmin)/unit))),Math.max(0,Math.min(nz-1,Math.round((z-zmin)/unit)))];
    const key=(x,z)=>z*nx+x;
    const [sx,sz]=coord(playerPos.x,playerPos.z);
    let [gx,gz]=coord(toX,toZ);
    if(blocked(toX,toZ)||blocked(xmin+gx*unit,zmin+gz*unit)){
      let best=Infinity;
      for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
        const wx=xmin+x*unit,wz=zmin+z*unit;
        if(blocked(wx,wz))continue;
        const d=(wx-toX)**2+(wz-toZ)**2;
        if(d<best){best=d;gx=x;gz=z;}
      }
    }
    const queue=[[sx,sz]],came=new Map([[key(sx,sz),null]]);
    let goal=null;
    for(let qi=0;qi<queue.length;qi++){
      const [x,z]=queue[qi];if(x===gx&&z===gz){goal=key(x,z);break;}
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const xx=x+dx,zz=z+dz,k=key(xx,zz),wx=xmin+xx*unit,wz=zmin+zz*unit;
        if(xx<0||xx>=nx||zz<0||zz>=nz||came.has(k)||blocked(wx,wz))continue;
        came.set(k,key(x,z));queue.push([xx,zz]);
      }
    }
    if(goal===null)return [];
    const points=[];for(let k=goal;k!==null;k=came.get(k))points.push(new THREE.Vector3(xmin+(k%nx)*unit,0,zmin+Math.floor(k/nx)*unit));
    points.reverse();points.shift();
    const simplified=[];
    for(let i=0;i<points.length;i++){
      const last=simplified.at(-1),next=points[i+1];
      if(last&&next){const dx=points[i].x-last.x,dz=points[i].z-last.z,dx2=next.x-points[i].x,dz2=next.z-points[i].z;if(Math.abs(dx*dz2-dz*dx2)<.01)continue;}
      simplified.push(points[i]);
    }
    if(!blocked(toX,toZ))simplified.push(new THREE.Vector3(toX,0,toZ));
    return simplified;
  }
  function setTarget(x,z){
    const toX=THREE.MathUtils.clamp(x,-24,24),toZ=THREE.MathUtils.clamp(z,-8.5,14.25);
    route=findRoute(toX,toZ);
    if(reduced){
      const destination=route.at(-1);
      if(destination)playerPos.copy(destination);
      target.copy(playerPos);route=[];player.position.copy(playerPos);
    } else if(route.length) target.copy(route.shift()); else target.copy(playerPos);
  }
  function focusOn(stop){overview=false;focusStop=stop;if(viewMode!=='follow')zoom=1;resize();}
  function goTo(id){
    const stop=stops.find(s=>s.id===id);if(!stop)return;
    selectedNeighbor=null;approachingNeighbor=null;pourSession.cancel();focusOn(stop);selected=id;approachingBooth=stop.type==='beer'?id:null;
    const point=servicePoint(stop);
    setTarget(point?.x??stop.x,point?.z??stop.z+(stop.id==='community'?2.4:0));
  }
  function cancelApproach(){approachingBooth=null;selected=null;selectedNeighbor=null;approachingNeighbor=null;route=[];target.copy(playerPos);}
  function getNeighborStatus(id){return neighborStatus(playerPos,neighbors.find(n=>n.id===id),approachingNeighbor===id);}
  function goToNeighbor(id){
    const person=neighbors.find(n=>n.id===id);if(!person)return;
    pourSession.cancel();cancelApproach();keys.clear();focusOn(person);
    selectedNeighbor=id;approachingNeighbor=id;setTarget(person.meet.x,person.meet.z);
  }
  function getBoothStatus(id){return boothStatus(playerPos,stops.find(s=>s.id===id),approachingBooth===id);}
  function restoreServiceView(){
    if(!serviceView)return;
    const previous=serviceView;serviceView=null;
    if(!previous.orbitChanged){yaw=previous.yaw;elevation=previous.elevation;}
    zoom=previous.zoom;
    overview=previous.overview;focusStop=previous.focusStop;focus.copy(previous.focus);
    resize();
  }
  function pour(id,{onComplete,onCancel}){
    const stop=stops.find(s=>s.id===id),rig=pourRigs.get(id);
    if(paused||!stop||stop.type!=='beer'||!rig||pourSession.active||getBoothStatus(id)!=='ready')return false;
    cancelApproach();keys.clear();player.rotation.y=(stop.facing||0)+Math.PI;
    if(!reduced){
      serviceView={stop,yaw,elevation,zoom,overview,focusStop,focus:focus.clone(),orbitChanged:false};
      yaw=(stop.facing||0)+.14;elevation=THREE.MathUtils.degToRad(20);zoom=host.clientWidth<760?2.45:3.2;overview=false;
      const pourFocus=localToWorld(stop,host.clientWidth<760?0:-2.15,.4);
      focus.set(pourFocus.x,host.clientWidth<760?-.7:1.5,pourFocus.z);resize();
    }
    return pourSession.start({reduced,
      onFrame:sample=>rig.update(sample),
      onComplete:()=>{rig.complete();restoreServiceView();onComplete?.();},
      onCancel:()=>{rig.cancel();restoreServiceView();onCancel?.();}
    });
  }
  const interact=(id)=>{const stop=stops.find(s=>s.id===id);if(stop)focusOn(stop);selected=null;approachingBooth=null;route=[];target.copy(playerPos);onInteract(id);};
  function resize(){
    const w=host.clientWidth,h=host.clientHeight; if(!w||!h)return;
    const aspect=w/h;const mobile=w<760;
    const viewHeight=(mobile?28:Math.max(29,52/aspect))/zoom;
    camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
    camera.updateProjectionMatrix();followCamera.aspect=aspect;followCamera.updateProjectionMatrix();renderer.setSize(w,h,false);
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  function getZoom(){return viewMode==='follow'&&!serviceView?followZoom:zoom;}
  function setZoom(value){
    overview=false;
    if(viewMode==='follow'&&!serviceView){
      followZoom=THREE.MathUtils.clamp(value,.6,1.7);
      return followZoom;
    }
    zoom=THREE.MathUtils.clamp(value,.18,4);resize();return zoom;
  }
  function wheelZoom(event){
    if(paused)return;
    event.preventDefault();
    // Normalize mouse wheels (lines/pages) and trackpads (pixels).
    const unit=event.deltaMode===1?16:event.deltaMode===2?host.clientHeight:1;
    const delta=THREE.MathUtils.clamp(event.deltaY*unit,-250,250);
    if(delta)setZoom(getZoom()*Math.exp(-delta*.0015));
  }
  function pickAt(event){
    if(pourSession.active)return;
    const rect=renderer.domElement.getBoundingClientRect();pointer.set(((event.clientX-rect.left)/rect.width)*2-1,-((event.clientY-rect.top)/rect.height)*2+1);
    raycaster.setFromCamera(pointer,activeCamera());
    const hits=raycaster.intersectObjects(scene.children,true);
    for(const hit of hits){let obj=hit.object;while(obj){const id=clickable.get(obj);if(id){if(id.startsWith('neighbor:'))onReady.neighborSelected?.(id.slice(9));else{onInteract(id);goTo(id);}return;}obj=obj.parent;}}
    const where=new THREE.Vector3();if(raycaster.ray.intersectPlane(groundPlane,where)){focusStop=null;approachingBooth=null;selected=null;selectedNeighbor=null;approachingNeighbor=null;setTarget(where.x,where.z);}
  }
  gesture=createPointerGesture({
    onTap:pickAt,
    onOrbit:(dx,dy)=>{
      if(serviceView)serviceView.orbitChanged=true;
      yaw-=dx*.007;
      elevation=THREE.MathUtils.clamp(elevation+dy*.005,THREE.MathUtils.degToRad(25),THREE.MathUtils.degToRad(65));
    },
    onDragStart:()=>renderer.domElement.classList.add('is-dragging'),
    onDragEnd:()=>renderer.domElement.classList.remove('is-dragging')
  });
  function pointerDown(event){
    if(!gesture.down(event))return;
    renderer.domElement.focus({preventScroll:true});
    renderer.domElement.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  function pointerMove(event){if(gesture.move(event))event.preventDefault();}
  function pointerUp(event){
    if(!gesture.up(event))return;
    if(renderer.domElement.hasPointerCapture(event.pointerId))renderer.domElement.releasePointerCapture(event.pointerId);
    event.preventDefault();
  }
  function pointerCancel(event){gesture.cancel(event.pointerId);}
  function pointerCaptureLost(event){gesture.cancel(event.pointerId);}
  function canvasBlur(){keys.clear();gesture.cancel();}
  function windowBlur(){keys.clear();gesture.cancel();}
  function suppressContextMenu(event){event.preventDefault();}
  function keyDown(event){
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','q','e','W','A','S','D','Q','E'].includes(event.key)){event.preventDefault();keys.add(event.key.toLowerCase());}
    if(!pourSession.active&&(event.key==='Enter'||event.key===' ')){
      const neighbor=neighbors.find(n=>getNeighborStatus(n.id)==='ready');
      if(neighbor){event.preventDefault();onReady.neighborSelected?.(neighbor.id);return;}
      const near=stops.find(s=>Math.hypot(s.x-playerPos.x,s.z-playerPos.z)<3.5);
      if(near){event.preventDefault();interact(near.id);}
    }
  }
  function keyUp(event){keys.delete(event.key.toLowerCase());}
  renderer.domElement.addEventListener('wheel',wheelZoom,{passive:false});
  renderer.domElement.addEventListener('pointerdown',pointerDown);
  renderer.domElement.addEventListener('pointermove',pointerMove);
  renderer.domElement.addEventListener('pointerup',pointerUp);
  renderer.domElement.addEventListener('pointercancel',pointerCancel);
  renderer.domElement.addEventListener('lostpointercapture',pointerCaptureLost);
  renderer.domElement.addEventListener('contextmenu',suppressContextMenu);
  renderer.domElement.addEventListener('keydown',keyDown);
  renderer.domElement.addEventListener('blur',canvasBlur);
  window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',windowBlur);
  let lastBoothStatus=null;
  function frame(now){
    if(paused)return;
    const dt=Math.min((now-last)/1000,.055);last=now;
    if(!reduced){elapsed+=dt;ambience.update(dt);}
    if(serviceView&&(keys.has('q')||keys.has('e')))serviceView.orbitChanged=true;
    if(keys.has('q'))yaw-=dt*1.35;
    if(keys.has('e'))yaw+=dt*1.35;
    let side=0,forward=0;
    if(keys.has('arrowleft')||keys.has('a'))side--;
    if(keys.has('arrowright')||keys.has('d'))side++;
    if(keys.has('arrowup')||keys.has('w'))forward++;
    if(keys.has('arrowdown')||keys.has('s'))forward--;
    if(pourSession.active){side=0;forward=0;}
    let mx=side*Math.cos(yaw)-forward*Math.sin(yaw);
    let mz=-side*Math.sin(yaw)-forward*Math.cos(yaw);
    if(mx||mz){
      const len=Math.hypot(mx,mz);mx/=len;mz/=len;
      const nextX=playerPos.x+mx*dt*6,nextZ=playerPos.z+mz*dt*6;
      if(!blocked(nextX,playerPos.z))playerPos.x=nextX;
      if(!blocked(playerPos.x,nextZ))playerPos.z=nextZ;
      target.copy(playerPos);route=[];selected=null;selectedNeighbor=null;approachingNeighbor=null;approachingBooth=null;focusStop=null;
    }
    const dx=target.x-playerPos.x,dz=target.z-playerPos.z,dist=Math.hypot(dx,dz);
    const moving=!!(mx||mz)||dist>.09;
    if(!(mx||mz)&&dist>.09){const step=Math.min(dist,dt*5.3);playerPos.x+=dx/dist*step;playerPos.z+=dz/dist*step;}
    if(!(mx||mz)&&dist<=.09&&route.length){target.copy(route.shift());}
    player.position.copy(playerPos);
    if(moving){let angle=Math.atan2(mx||dx,mz||dz);player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,angle,Math.min(1,dt*10));}
    if(selectedNeighbor&&dist<.11&&!route.length){selectedNeighbor=null;approachingNeighbor=null;target.copy(playerPos);}
    if(selected&&dist<.11&&!route.length){const id=selected;selected=null;interact(id);}
    if(!reduced){animateCharacter(playerParts,elapsed,moving);npcs.forEach((n,i)=>animateCharacter(n,elapsed+i*1.4,false,.65));updatePatrols(dt);}
    if(bandPlaying&&!reduced){
      if(performer.left)performer.left.rotation.x=-1.13+Math.sin(elapsed*9)*.13;
      if(performer.right)performer.right.rotation.x=-1.13+Math.sin(elapsed*11+1)*.13;
      if(performer.head)performer.head.rotation.x=.10+Math.sin(elapsed*3)*.035;
    }
    const mobile=host.clientWidth<760;
    pourSession.update(dt);
    const statusKey=`${approachingBooth||''}:${approachingNeighbor||''}:${Math.round(playerPos.x*10)}:${Math.round(playerPos.z*10)}`;
    if(statusKey!==lastBoothStatus){lastBoothStatus=statusKey;onReady.updateBooth?.(Object.fromEntries(stops.filter(s=>s.type==='beer').map(s=>[s.id,getBoothStatus(s.id)])));onReady.updateNeighbors?.();}
    if(serviceView){const p=localToWorld(serviceView.stop,mobile?0:-2.15,.4);targetFocus.set(p.x,mobile?-.7:1.5,p.z);}
    else if(gesture.dragging)targetFocus.copy(focus);
    else targetFocus.set(mobile&&!overview?(focusStop?.x??playerPos.x):0,1.3,mobile&&!overview?(focusStop?.z??THREE.MathUtils.clamp(playerPos.z-1,-3,11)):2.4);
    if(reduced)focus.copy(targetFocus);
    else focus.lerp(targetFocus,Math.min(1,dt*(mobile?2.5:1.6)));
    const viewRadius=serviceView?4.5:cameraRadius;
    const horizontal=viewRadius*Math.cos(elevation);
    camera.position.set(focus.x+Math.sin(yaw)*horizontal,focus.y+Math.sin(elevation)*viewRadius,focus.z+Math.cos(yaw)*horizontal);
    camera.lookAt(focus);
    const followDistance=9/followZoom;
    const followTarget=new THREE.Vector3(playerPos.x-Math.sin(yaw)*.5,1.55,playerPos.z-Math.cos(yaw)*.5);
    const followDesired=new THREE.Vector3(playerPos.x+Math.sin(yaw)*followDistance,6.1+(elevation-homeElevation)*5.5,playerPos.z+Math.cos(yaw)*followDistance);
    // Keep the entire avatar visible, including feet, when the opposite tent
    // row lies between the follow camera and the character.
    if(viewMode==='follow'&&!serviceView){
      for(let clearance=0;clearance<9;clearance++){
        let roofInFront=false;
        for(const bodyHeight of [.1,.8,1.5]){
          const from=new THREE.Vector3(playerPos.x,bodyHeight,playerPos.z);
          const direction=followDesired.clone().sub(from),distance=direction.length();direction.normalize();
          raycaster.set(from,direction);raycaster.far=distance-.25;
          if(raycaster.intersectObjects(roofObstacles,false).length){roofInFront=true;break;}
        }
        if(!roofInFront)break;
        followDesired.y+=1.15;
      }
    }
    raycaster.far=Infinity;
    if(reduced)followCamera.position.copy(followDesired);else{
      followCamera.position.lerp(followDesired,Math.min(1,dt*6));
      if(followCamera.position.y<followDesired.y)followCamera.position.y=followDesired.y;
    }
    followCamera.lookAt(followTarget);
    // Cut away only a cottonwood that sits directly between the close camera
    // and the fox. Whole-park and pour views always retain every tree.
    trees.forEach(tree=>{tree.visible=true;});
    if(viewMode==='follow'&&!serviceView){
      const from=new THREE.Vector3(playerPos.x,1.25,playerPos.z);
      const sight=followCamera.position.clone().sub(from);
      raycaster.set(from,sight.clone().normalize());raycaster.far=sight.length();
      for(const hit of raycaster.intersectObjects(trees,true)){
        let root=hit.object;while(root.parent&&root.parent!==scene)root=root.parent;
        if(trees.includes(root))root.visible=false;
      }
      raycaster.far=Infinity;
    }
    const viewCamera=activeCamera();
    const labelPositions=projectLabels(mapAnchors,viewCamera,host.clientWidth,host.clientHeight,serviceView?.stop.id);
    renderer.clear();
    valley.render(renderer,yaw,host.clientWidth,host.clientHeight);
    renderer.clearDepth();
    renderer.render(scene,viewCamera);
    if(onReady.updateLabels)onReady.updateLabels(labelPositions,playerPos,overview);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return {goTo,getBoothStatus,goToNeighbor,getNeighborStatus,clearMovement:()=>keys.clear(),setBandPlaying:value=>{bandPlaying=Boolean(value);if(!bandPlaying){if(performer.left)performer.left.rotation.x=0;if(performer.right)performer.right.rotation.x=0;if(performer.head)performer.head.rotation.x=0;}},pour,cancelPour:()=>pourSession.cancel(),cancelApproach,getPlayer:()=>playerPos.clone(),getViewMode:()=>viewMode,setViewMode:mode=>{viewMode=mode==='follow'?'follow':'diorama';overview=false;focusStop=null;resize();return viewMode;},setReduced:v=>{reduced=v;ambience?.setReduced(v);if(v){pourSession.finish();for(const patrol of patrols)if(patrol.glass){patrol.parts.right.rotation.x=-.45;patrol.parts.right.rotation.z=.35;patrol.glass.position.set(.425,.61,.14);}}if(v&&route.length){playerPos.copy(route.at(-1));target.copy(playerPos);route=[];player.position.copy(playerPos);if(selected)interact(selected);selectedNeighbor=null;approachingNeighbor=null;onReady.updateNeighbors?.();}},setZoom,showOverview:()=>{pourSession.cancel();viewMode='diorama';overview=true;focusStop=null;yaw=homeYaw;elevation=homeElevation;zoom=host.clientWidth<760?.19:.66;resize();},getZoom,destroy:()=>{
    paused=true;pourSession.cancel();for(const rig of pourRigs.values())rig.dispose();pourRigs.clear();gesture.cancel();resizeObserver.disconnect();renderer.domElement.removeEventListener('pointerdown',pointerDown);
    renderer.domElement.removeEventListener('wheel',wheelZoom);
    renderer.domElement.removeEventListener('pointermove',pointerMove);
    renderer.domElement.removeEventListener('pointerup',pointerUp);
    renderer.domElement.removeEventListener('pointercancel',pointerCancel);
    renderer.domElement.removeEventListener('lostpointercapture',pointerCaptureLost);
    renderer.domElement.removeEventListener('contextmenu',suppressContextMenu);
    renderer.domElement.removeEventListener('webglcontextlost',contextLost);
    renderer.domElement.removeEventListener('keydown',keyDown);
    renderer.domElement.removeEventListener('blur',canvasBlur);
    window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',windowBlur);
    disposeAmbience();valley.dispose();
    cupShape.dispose();beerShape.dispose();foamShape.dispose();cupGlass.dispose();cupBeer.dispose();cupFoam.dispose();
    renderer.dispose();renderer.domElement.remove();
  }};
}
