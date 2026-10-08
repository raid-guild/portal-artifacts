import * as THREE from 'three';
import './style.css';
import {GARDEN,PASSAGE_GARDEN,REACH_GARDEN,GRIP_GARDEN,drainPosition,arrivalPosition,looseGardenParticles,gardenCanCast} from './garden-level.js';
import {createGardenView} from './garden-view.js';
import {createWeightGardenView} from './weight-garden-view.js';
import {createGardenScenery} from './garden-scenery.js';
import {createPrintedMaterialLibrary} from './printed-material.js';
import {setupGameShell} from './game-shell.js';
import {PullGesture} from './pull-gesture.js';
import {setupPickupAudio} from './pickup-audio.js';
const pickupAudio=setupPickupAudio();
if(import.meta.hot)import.meta.hot.dispose(()=>pickupAudio.dispose());
import {setupMusic} from './music.js';
const disposeMusic=setupMusic();
if(import.meta.hot)import.meta.hot.dispose(disposeMusic);
import { PuddleSimulation, GROWTH, PUDDLE_FIELD, PRESSURE, DT } from './simulation.js';
import { createSurfacePipeline } from './surface-pipeline.js';
import {GAP,FUNNEL,groundAt,segmentBlockedBySolid} from './colliders.js';
import {movementAxes} from './movement.js';
import {canStartControl,startPointerControl} from './game-input.js';
import {FollowGardenCamera,cameraPointVisible,gardenMovementBasis} from './game-camera.js';

const sim = new PuddleSimulation();
const perfEnabled=new URLSearchParams(location.search).has('perf');
const perfNode=perfEnabled?document.createElement('div'):null;
if(perfNode){
  perfNode.setAttribute('aria-label','Performance diagnostics');
  Object.assign(perfNode.style,{position:'fixed',right:'8px',bottom:'8px',zIndex:'1000',pointerEvents:'none',
    background:'rgba(27,43,45,.88)',color:'#f1e4cb',font:'12px/1.4 monospace',padding:'8px',whiteSpace:'pre'});
  document.body.append(perfNode);
}
sim.selectTest('garden');
const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0xc7e2df);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc7e2df);
const printLibrary=createPrintedMaterialLibrary();
const gardenView=createGardenView(scene,{printLibrary});
const weightGardenView=createWeightGardenView(scene,{printLibrary});
const passageGardenView=createWeightGardenView(scene,{printLibrary,level:PASSAGE_GARDEN});
const reachGardenView=createWeightGardenView(scene,{printLibrary,level:REACH_GARDEN});
const gripGardenView=createWeightGardenView(scene,{printLibrary,level:GRIP_GARDEN});
let localView=null;
const gardenScenery=createGardenScenery(scene,{printLibrary,onExitReady:ready=>{gardenView.setCollarReady(ready);weightGardenView.setCollarReady(ready);passageGardenView.setCollarReady(ready);reachGardenView.setCollarReady(ready);gripGardenView.setCollarReady(ready);}});
if(import.meta.hot)import.meta.hot.dispose(()=>{localView?.dispose();gardenScenery.dispose();weightGardenView.dispose();passageGardenView.dispose();reachGardenView.dispose();gripGardenView.dispose();printLibrary.dispose();});
const camera = new THREE.OrthographicCamera();
camera.position.set(9, 13, 18);
camera.lookAt(0, 1.65, 0);
const followCamera=new FollowGardenCamera();
let cameraMode='follow',activeCamera=camera,cameraFluid=sim.fluid;
const ink = 0x31494a, sand = 0xe9d5bb, coral = 0xc6746e;
const mat = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const lineMat = (color = ink, opacity = 1) => new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
const add = (geo, material, parent = scene) => { const o = new THREE.Mesh(geo, material); parent.add(o); return o; };

const terraceShape = new THREE.Shape();
terraceShape.moveTo(-8.3, -4.15);
terraceShape.bezierCurveTo(-8.2,-4.8,-6.9,-5.0,-5.7,-4.7);
terraceShape.bezierCurveTo(-2.2,-4.55,1.2,-4.83,4.4,-4.46);
terraceShape.bezierCurveTo(6.8,-4.15,8.4,-4.0,8.53,-3.23);
terraceShape.bezierCurveTo(8.87,-1.3,8.43,1.9,8.06,3.64);
terraceShape.bezierCurveTo(7.8,4.7,6.3,4.7,4.83,4.55);
terraceShape.bezierCurveTo(1.6,4.38,-1.5,4.66,-4.5,4.6);
terraceShape.bezierCurveTo(-6.56,4.7,-8.1,4.39,-8.41,3.47);
terraceShape.bezierCurveTo(-8.65,1.22,-8.73,-1.94,-8.3,-4.15);
const terrace = add(new THREE.ExtrudeGeometry(terraceShape,{depth:.58,bevelEnabled:false,curveSegments:5}),[mat(sand),mat(0x8d8a83)]);
terrace.rotation.x=Math.PI/2;
const flatTerraceGeometry=terrace.geometry;
const basinShape=terraceShape.clone(),basinHole=new THREE.Path();
basinHole.absarc(FUNNEL.x,FUNNEL.z,FUNNEL.radius,0,Math.PI*2,true);
basinShape.holes.push(basinHole);
const basinTerraceGeometry=new THREE.ExtrudeGeometry(basinShape,{depth:.58,bevelEnabled:false,curveSegments:24});
const pressureGroup=new THREE.Group();scene.add(pressureGroup);
const basin=add(new THREE.CylinderGeometry(FUNNEL.radius,FUNNEL.bottomRadius,FUNNEL.depth,64,1,true),
  mat(0xc5b8aa,{side:THREE.DoubleSide}),pressureGroup);
basin.position.set(FUNNEL.x,-FUNNEL.depth/2,FUNNEL.z);
const plate=add(new THREE.CylinderGeometry(FUNNEL.bottomRadius,FUNNEL.bottomRadius,.045,48),mat(0xb99b86),pressureGroup);
plate.position.set(FUNNEL.x,-FUNNEL.depth-.018,FUNNEL.z);
for(const [radius,y] of [[FUNNEL.radius,.012],[FUNNEL.bottomRadius,-FUNNEL.depth+.012]]){
  const ring=add(new THREE.TorusGeometry(radius,.013,4,64),mat(ink),pressureGroup);
  ring.rotation.x=Math.PI/2;ring.position.set(FUNNEL.x,y,FUNNEL.z);
}
const pressureGate=add(new THREE.BoxGeometry(PRESSURE.gateWidth,PRESSURE.gateHeight,4.6),
  mat(0xa5bfba,{transparent:true,opacity:.8}),pressureGroup);
pressureGate.position.set(PRESSURE.gateX,PRESSURE.gateHeight/2,0);
pressureGate.add(new THREE.LineSegments(new THREE.EdgesGeometry(pressureGate.geometry),lineMat()));
for(const z of [-3.3,3.3]){
  const wall=add(new THREE.BoxGeometry(.5,1.3,2),mat(0xb5c5b7),pressureGroup);
  wall.position.set(PRESSURE.gateX,.65,z);
  wall.add(new THREE.LineSegments(new THREE.EdgesGeometry(wall.geometry),lineMat(ink,.65)));
}
const signalPoints=[new THREE.Vector3(FUNNEL.x, .028, -FUNNEL.radius),
  new THREE.Vector3(FUNNEL.x,.028,-2),new THREE.Vector3(PRESSURE.gateX,.028,-2)];
const signalLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(signalPoints),lineMat(0x9a7778));pressureGroup.add(signalLine);
const pressureExit=add(new THREE.TorusGeometry(.5,.025,5,40),mat(0x8aaea5),pressureGroup);
pressureExit.rotation.x=Math.PI/2;pressureExit.position.set(3,.05,0);

const legacyDecor=new THREE.Group();scene.add(legacyDecor);
const contourPts = terraceShape.getPoints(95).map(p=>new THREE.Vector3(p.x,.025,p.y));
legacyDecor.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(contourPts),lineMat()));

// Thin printed contour lines and shallow growth seams establish the terrace scale.
for(const [x,z,rx,rz] of [[-5.8,2.5,1.2,.43],[3.8,-2.7,1.4,.3],[6.5,3.1,.95,.25]]){
  const pts=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;pts.push(new THREE.Vector3(x+Math.cos(a)*rx,.035,z+Math.sin(a)*rz));}
  legacyDecor.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lineMat(0x8e8c80,.5)));
}

function stalk(x,z,height,tint=0xa4b1a4,scale=1){
  const group=new THREE.Group();legacyDecor.add(group);group.position.set(x,0,z);
  const points=[new THREE.Vector3(0,0,0),new THREE.Vector3(-.12*scale,height*.35,0),new THREE.Vector3(.14*scale,height*.78,-.1*scale),new THREE.Vector3(.26*scale,height,.08*scale)];
  const curve=new THREE.CatmullRomCurve3(points);
  add(new THREE.TubeGeometry(curve,24,.055*scale,6,false),mat(tint),group);
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),lineMat(ink,.75)));
  for(const [y,dir] of [[.38,1],[.68,-1]]){
    const leaf=add(new THREE.SphereGeometry(1,8,5),mat(0x9caea3),group);
    leaf.position.set(dir*.22*scale,height*y,0);leaf.scale.set(.27*scale,.06*scale,.09*scale);leaf.rotation.z=dir*.25;
  }
  return group;
}
for(const p of [[-6,2.9,1.25],[-5.35,3.1,.8],[2.9,3.35,.9],[6.75,-3.2,1.4],[7.35,-2.95,.85]])stalk(...p);

// The distant spiral and arch sit behind the terrace, with complete tips in the sky.
const oldTowerDecor=new THREE.Group();scene.add(oldTowerDecor);
const tower=new THREE.Group();oldTowerDecor.add(tower);tower.position.set(3.8,-1.4,-8.2);
const towerCore=add(new THREE.CylinderGeometry(.36,.83,5.8,13,1),mat(0xb7beb0),tower);towerCore.position.y=2.9;
const spiralPts=[];for(let i=0;i<=160;i++){const t=i/160;const a=t*6*Math.PI;spiralPts.push(new THREE.Vector3(Math.cos(a)*(.78-.22*t),t*5.9,Math.sin(a)*(.78-.22*t)));}
add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralPts),160,.09,5,false),mat(0xd8c3b1),tower);
tower.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiralPts),lineMat(ink,.58)));
const rim=add(new THREE.TorusGeometry(.44,.07,7,30),mat(0xd2baae),tower);rim.rotation.x=Math.PI/2;rim.position.y=5.9;
const archPoints=[new THREE.Vector3(-7,-1.4,-7.8),new THREE.Vector3(-6,1.6,-7.9),new THREE.Vector3(-4.9,3.5,-8),new THREE.Vector3(-3.55,3.2,-7.9),new THREE.Vector3(-2.8,.45,-7.8)];
const archCurve=new THREE.CatmullRomCurve3(archPoints);
add(new THREE.TubeGeometry(archCurve,50,.23,7,false),mat(0xc1c4b7),oldTowerDecor);
oldTowerDecor.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(archCurve.getPoints(50)),lineMat(ink,.55)));
const gapGroup=new THREE.Group();scene.add(gapGroup);
const roofSize=[GAP.roof.maxX-GAP.roof.minX,GAP.roof.top-GAP.roof.bottom,GAP.roof.maxZ-GAP.roof.minZ];
const roof=add(new THREE.BoxGeometry(...roofSize),mat(0x9abfba,{transparent:true,opacity:.78}),gapGroup);
roof.position.set((GAP.roof.minX+GAP.roof.maxX)/2,(GAP.roof.bottom+GAP.roof.top)/2,0);
roof.add(new THREE.LineSegments(new THREE.EdgesGeometry(roof.geometry),lineMat(ink,.75)));
for(const wall of [GAP.leftWall,GAP.rightWall]){
  const block=add(new THREE.BoxGeometry(wall.maxX-wall.minX,wall.maxY-wall.minY,wall.maxZ-wall.minZ),mat(0xb5c5b7),gapGroup);
  block.position.set((wall.minX+wall.maxX)/2,(wall.minY+wall.maxY)/2,(wall.minZ+wall.maxZ)/2);
  block.add(new THREE.LineSegments(new THREE.EdgesGeometry(block.geometry),lineMat(ink,.65)));
}
const gapExit=add(new THREE.TorusGeometry(.5,.03,5,32),mat(0x8aaea5),gapGroup);
gapExit.rotation.x=Math.PI/2;gapExit.position.set(1.7,.055,0);
const growthGroup=new THREE.Group();scene.add(growthGroup);
const growthRing=add(new THREE.TorusGeometry(.48,.018,5,40),mat(0x9e7779),growthGroup);
growthRing.rotation.x=Math.PI/2;growthRing.position.set(GROWTH.spoutX,.04,GROWTH.spoutZ);
const growthStem=add(new THREE.CylinderGeometry(.055,.11,.7,10),mat(0xa2c3b9),growthGroup);
growthStem.position.set(GROWTH.spoutX,GROWTH.spoutY+.38,GROWTH.spoutZ);
growthStem.add(new THREE.LineSegments(new THREE.EdgesGeometry(growthStem.geometry),lineMat(ink,.6)));
const growthLip=add(new THREE.TorusGeometry(.13,.026,5,28),mat(ink),growthGroup);
growthLip.rotation.x=Math.PI/2;growthLip.position.set(GROWTH.spoutX,GROWTH.spoutY,GROWTH.spoutZ);
const bodyMat=new THREE.MeshLambertMaterial({color:0xdb8e83,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false});
scene.add(new THREE.HemisphereLight(0xffffff,0xa07872,2));
const surfacePipeline=createSurfacePipeline();
if(import.meta.hot)import.meta.hot.dispose(()=>surfacePipeline.dispose());
const bodySurface=surfacePipeline.create(bodyMat,48,{priority:0});
const bodyGroup=new THREE.Group();scene.add(bodyGroup);
const supplyGroup=new THREE.Group();scene.add(supplyGroup);
const body=bodySurface.mesh;bodyGroup.add(body);body.renderOrder=4;
const supplyMat=new THREE.MeshLambertMaterial({color:0xa9c9bf,transparent:true,opacity:.78,side:THREE.DoubleSide,depthWrite:false});
const supplySurface=surfacePipeline.create(supplyMat);
supplyGroup.add(supplySurface.mesh);supplySurface.mesh.renderOrder=3;
const shedSurface=surfacePipeline.create(supplyMat);
supplyGroup.add(shedSurface.mesh);shedSurface.mesh.renderOrder=3;
const fieldSurfaces=PUDDLE_FIELD.patches.map(()=>{
  const surface=surfacePipeline.create(supplyMat,28);
  supplyGroup.add(surface.mesh);surface.mesh.renderOrder=3;
  return surface;
});
function ensurePoolSurfaces(count){while(fieldSurfaces.length<count){const surface=surfacePipeline.create(supplyMat,28);
  supplyGroup.add(surface.mesh);surface.mesh.renderOrder=3;fieldSurfaces.push(surface);}}
const brainCore=add(new THREE.SphereGeometry(.105,16,12),mat(0x344f50,{depthTest:true,depthWrite:true}));
scene.remove(brainCore);bodyGroup.add(brainCore);
brainCore.renderOrder=5;
let lastSurfaceMs=0;
let surfaceSource='';
let surfaceFluid=sim.fluid;
let fallbackSurfaceTick=0;
const particleGeometry=new THREE.SphereGeometry(sim.fluid.radius*.65,6,5);
const particleDebug=new THREE.InstancedMesh(particleGeometry,mat(0x933f45),GROWTH.capacity);
particleDebug.visible=false;particleDebug.frustumCulled=false;particleDebug.renderOrder=6;scene.add(particleDebug);
const particleTransform=new THREE.Object3D();
const toggleParticles=()=>{particleDebug.visible=!particleDebug.visible;
  document.querySelector('#particles-toggle').textContent=particleDebug.visible?'P / HIDE PARTICLES':'P / SHOW PARTICLES';};
document.querySelector('#particles-toggle').addEventListener('click',toggleParticles);

const aim={x:FUNNEL.x,z:FUNNEL.z},raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let hasGardenAim=false;
const aimRing=add(new THREE.TorusGeometry(.16,.015,5,24),mat(0x9c6760));aimRing.rotation.x=Math.PI/2;
const aimLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),
  new THREE.LineDashedMaterial({color:0x8f8274,dashSize:.09,gapSize:.09,transparent:true,opacity:.6}));scene.add(aimLine);
function aimFromPointer(e){
  const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  activeCamera.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer,activeCamera);
  const reach=sim.selectedTest==='garden'&&gardenCanCast(sim.gardenLevel);
  const activeGardenView=sim.isLocalGarden?localView:
    [gardenView,weightGardenView,passageGardenView,reachGardenView,gripGardenView][sim.gardenLevelId-1];
  const targets=reach?activeGardenView?.group.children.filter(o=>o.userData.pickableTerrain)||[]:
    [terrace,...(sim.selectedTest==='pressure'?[basin,plate]:[])];
  const hits=raycaster.intersectObjects(targets,false);
  if(hits.length){aim.x=hits[0].point.x;aim.z=hits[0].point.z;if(reach)hasGardenAim=true;return true;}
  return false;
}
function nearestRemoteAim(){
  const pools=sim.gardenLevel.pools.map(([x,z],i)=>({x,z,i}))
    .filter(p=>sim.fluid.particles.some(q=>q.feedstock&&q.patchId===p.i));
  return pools.sort((a,b)=>Math.hypot(a.x-sim.brain.x,a.z-sim.brain.z)-Math.hypot(b.x-sim.brain.x,b.z-sim.brain.z))[0]||
    {x:sim.brain.x+1.5,z:sim.brain.z};
}
function cast(pointerAim=false){
  if(sim.selectedTest==='pressure')sim.castTendril(aim);
  else if(sim.selectedTest==='garden'&&gardenCanCast(sim.gardenLevel)){
    const target=pointerAim&&hasGardenAim?aim:nearestRemoteAim();
    sim.castTendril(target);
  }
}
canvas.addEventListener('pointermove',aimFromPointer);
canvas.addEventListener('pointerdown',e=>{if(e.button===0&&(sim.selectedTest==='pressure'||sim.selectedTest==='garden'&&gardenCanCast(sim.gardenLevel))){
  const hit=aimFromPointer(e);if(hit)cast(true);
}});
const castButton=document.querySelector('#cast');castButton.addEventListener('click',cast);
const keys=new Set(),touchMove=new Set(),blockedUntilRelease=new Set();
let pushing=false,shedding=false;
const pullGesture=new PullGesture(()=>{
  if(sim.selectedTest==='pressure'||sim.selectedTest==='garden'&&gardenCanCast(sim.gardenLevel)&&sim.garden.phase==='playing'&&sim.gardenInputArmed)
    sim.tendril.toggleRecall();
});
const shedButton=document.querySelector('#shed');
const pullButton=document.querySelector('#pull');
const applyMaterial=()=>{sim.fluid.cohesion=Number(document.querySelector('#cohesion').value);
  sim.fluid.viscosity=Number(document.querySelector('#viscosity').value);};
for(const id of ['cohesion','viscosity'])document.getElementById(id).addEventListener('input',applyMaterial);
function clearInputs(){
  for(const key of keys)blockedUntilRelease.add(key);
  keys.clear();touchMove.clear();pullGesture.cancel();sim.tendril.recalling=false;pushing=false;shedding=false;
  hasGardenAim=false;
  pullButton.setAttribute('aria-pressed','false');
}
function syncOozeButton(){
  const b=document.querySelector('#ooze-forward');
  b.classList.toggle('selected',sim.oozeForward);
  b.textContent=sim.oozeForward?'STOP OOZING':'OOZE FORWARD';
}
function resetStudy(size=sim.size){clearInputs();if(sim.selectedTest==='garden'){gameShell.restartCurrent();return;}if(sim.retrievalSetup)sim.setupRetrieval();else sim.reset(size);applyMaterial();syncOozeButton();}
document.querySelector('#retrieval-setup').addEventListener('click',()=>{clearInputs();sim.setupRetrieval();aim.x=FUNNEL.x;aim.z=FUNNEL.z;applyMaterial();});
document.querySelector('#shedding-setup').addEventListener('click',()=>{clearInputs();sim.retrievalSetup=false;sim.reset(1);aim.x=FUNNEL.x;aim.z=FUNNEL.z;applyMaterial();});
function toggleCamera(){
  cameraMode=cameraMode==='follow'?'tower':'follow';
  if(cameraMode==='follow'&&sim.selectedTest==='garden')followCamera.reset(sim,innerWidth/innerHeight);
  activeCamera=sim.selectedTest==='garden'&&cameraMode==='follow'?followCamera.camera:camera;
  activeCamera.updateMatrixWorld(true);
}
const gameShell=setupGameShell(sim,{clearInputs,onStart:()=>{disposeMusic.begin();pickupAudio.unlock();},
  onLocalReady:async(level,current)=>{const {createEditorStageView}=await import('./editor-stage-view.js');
    if(!current())return;localView?.dispose();localView=createEditorStageView(scene,level,{printLibrary,labelRoot:document.querySelector('#app')});
    localView.setEditing(false);localView.setPlaying(true);},
  onCameraToggle:toggleCamera,cameraMode:()=>cameraMode,
  onChange:()=>{
    if(!sim.isLocalGarden&&localView){localView.dispose();localView=null;}
    if(sim.selectedTest!=='garden'||sim.fluid!==cameraFluid&&!sim.descending)followCamera.initialized=false;
    cameraFluid=sim.fluid;applyMaterial();resize();
  }});
window.addEventListener('blur',clearInputs);
window.addEventListener('keydown',e=>{
  if(document.documentElement.classList.contains('booting'))return;
  if(gameShell.handleKey(e))return;
  if(e.target.closest?.('.music-controls')||e.target.matches?.('input,select,textarea'))return;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(blockedUntilRelease.has(e.code))return;
  keys.add(e.code);
  if(e.repeat)return;
  if(e.code==='KeyR')resetStudy();
  if(e.code==='KeyP')toggleParticles();
  if(e.code==='KeyE')cast();
  if(e.code==='Space')pullGesture.down('keyboard',performance.now());
});
window.addEventListener('keyup',e=>{if(e.code==='Space')pullGesture.up('keyboard',performance.now());keys.delete(e.code);blockedUntilRelease.delete(e.code);});
document.querySelector('#reset').addEventListener('click',()=>resetStudy());
pullButton.addEventListener('pointerdown',e=>startPointerControl(sim,e,()=>{
  pullGesture.down(`pointer-${e.pointerId}`,performance.now());pullButton.setPointerCapture(e.pointerId);}));
pullButton.addEventListener('pointerup',e=>{if(canStartControl(sim))pullGesture.up(`pointer-${e.pointerId}`,performance.now());else pullGesture.cancel();});
for(const type of ['pointercancel','lostpointercapture'])pullButton.addEventListener(type,()=>pullGesture.cancel());
pullButton.addEventListener('click',e=>{if(e.detail===0&&canStartControl(sim)&&
  (sim.selectedTest==='pressure'||sim.selectedTest==='garden'&&gardenCanCast(sim.gardenLevel)))sim.tendril.toggleRecall();});
shedButton.addEventListener('pointerdown',e=>startPointerControl(sim,e,()=>{
  shedding=true;shedButton.setPointerCapture(e.pointerId);}));
for(const type of ['pointerup','pointercancel','lostpointercapture'])shedButton.addEventListener(type,()=>shedding=false);
const pushButton=document.querySelector('#push');
pushButton.addEventListener('pointerdown',e=>startPointerControl(sim,e,()=>{
  pushing=true;pushButton.setPointerCapture(e.pointerId);}));
for(const type of ['pointerup','pointercancel','lostpointercapture'])pushButton.addEventListener(type,()=>pushing=false);
for(const b of document.querySelectorAll('[data-move]')){
  const dir=b.dataset.move;
  b.addEventListener('pointerdown',e=>startPointerControl(sim,e,()=>{
    touchMove.add(dir);b.setPointerCapture(e.pointerId);}));
  for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>touchMove.delete(dir));
}
for(const b of document.querySelectorAll('[data-size]'))b.addEventListener('click',()=>{
  resetStudy(Number(b.dataset.size));
  document.querySelectorAll('[data-size]').forEach(x=>x.classList.toggle('selected',x===b));
});
for(const b of document.querySelectorAll('[data-test]'))b.addEventListener('click',()=>{
  if(b.dataset.test==='grip'&&!gameShell.canPlayLevel(5))return;
  clearInputs();
  if(b.dataset.test==='grip'){
    disposeMusic.begin();pickupAudio.unlock();sim.startGarden(5,{newGame:true,practice:true});
  }else sim.selectTest(b.dataset.test);
  followCamera.initialized=false;cameraFluid=sim.fluid;
  applyMaterial();
  document.querySelectorAll('[data-test]').forEach(x=>x.classList.toggle('selected',x===b));
  syncOozeButton();resize();
});
document.querySelector('#ooze-forward').addEventListener('click',()=>{
  sim.oozeForward=!sim.oozeForward;syncOozeButton();
});

function updateSkin(){
  lastSurfaceMs=0;
  const pressure=sim.selectedTest==='pressure',garden=sim.selectedTest==='garden';
  const source=`${sim.selectedTest}:${garden?sim.isLocalGarden?`local:${sim.localRun.id}:${sim.localRun.revision}`:sim.gardenLevelId:0}:${garden?sim.garden.phase:''}`;
  const sourceChanged=surfaceFluid!==sim.fluid||surfaceSource!==source;
  if(sourceChanged){surfacePipeline.invalidate();surfaceFluid=sim.fluid;surfaceSource=source;}
  const lowerGarden=garden&&!!sim.gardenLevel.gate,reachGarden=garden&&!!gardenCanCast(sim.gardenLevel);
  const worldY=garden?-(sim.gardenLevelId-1)*7.2:0;
  const arriving=garden&&sim.garden.phase==='arriving';
  bodyGroup.position.y=worldY;
  supplyGroup.position.y=worldY;
  terrace.visible=!garden;legacyDecor.visible=!garden;
  oldTowerDecor.visible=!garden||!gardenScenery.structuralReady;
  pressureGroup.visible=pressure;
  terrace.geometry=pressure?basinTerraceGeometry:flatTerraceGeometry;
  pressureGate.position.y=PRESSURE.gateHeight/2+sim.pressure.opening;
  plate.material.color.setHex(sim.pressure.active?0xd1ab8e:0xb99b86);
  signalLine.material.color.setHex(sim.pressure.active?0xb9856d:0x9a7778);
  shedButton.hidden=!(pressure||lowerGarden||garden&&sim.gardenLevel.editorCanShed);castButton.hidden=!(pressure||reachGarden);
  document.querySelector('#retrieval-controls').classList.toggle('active',pressure);
  if(reachGarden&&!hasGardenAim)Object.assign(aim,nearestRemoteAim());
  aimRing.visible=pressure||reachGarden;aimLine.visible=(pressure||reachGarden)&&sim.tendril.count<3;
  const ay=groundAt(aim.x,aim.z,sim.activeColliders()).height+.04;
  aimRing.position.set(aim.x,ay+worldY,aim.z);
  const line=aimLine.geometry.attributes.position;
  line.setXYZ(0,sim.brain.x,sim.brain.y+worldY,sim.brain.z);line.setXYZ(1,aim.x,ay+worldY,aim.z);line.needsUpdate=true;
  aimLine.computeLineDistances();
  aimRing.material.color.setHex(sim.tendril.active?0x739f8c:0x9c6760);
  gapGroup.visible=sim.selectedTest==='gap';
  growthGroup.visible=sim.selectedTest==='growth';
  document.querySelector('#gap-controls').classList.toggle('active',sim.selectedTest==='gap');
  body.visible=!(garden&&sim.garden.phase==='complete');
  if(surfacePipeline.workerEnabled||sourceChanged||fallbackSurfaceTick++%3===0){
    const surfaceStart=perfEnabled?performance.now():0;
    const growth=sim.selectedTest==='growth',field=sim.selectedTest==='field'||garden;
    const colliders=sim.activeColliders(),particles=sim.fluid.particles;
    let living=growth||field||pressure?particles.filter(p=>!p.feedstock):particles;
    if(arriving)living=particles.map((p,i)=>p.feedstock?null:arrivalPosition(p,i,sim.garden.arrivalTime,sim.gardenLevel,sim.fluid.coatIndices)).filter(Boolean);
    if(garden&&sim.garden.phase==='draining'){
      living=living.map(p=>drainPosition(p,sim.garden.drainTime,sim.gardenLevel));
    }
    const draining=garden&&sim.garden.phase==='draining';
    bodySurface.update(living,draining?[]:colliders,sim.fluid.radius,{maskTerrain:!draining});
    // Translate the last completed surface a short distance toward the actual
    // living body between worker builds. Never extrapolate across a solid.
    if(bodySurface.completedCentroid&&bodySurface.completedPosition&&living.length&&!arriving&&!draining){
      let x=0,y=0,z=0;for(const p of living){x+=p.x;y+=p.y;z+=p.z;}
      const old=bodySurface.completedCentroid,current={x:x/living.length,y:y/living.length,z:z/living.length};
      let dx=current.x-old.x,dy=current.y-old.y,dz=current.z-old.z;
      const distance=Math.hypot(dx,dy,dz),limit=.18*sim.size;
      if(distance>limit){const factor=limit/distance;dx*=factor;dy*=factor;dz*=factor;}
      if(distance>0&&!segmentBlockedBySolid(old,current,colliders,sim.fluid.radius*.3))
        body.position.set(bodySurface.completedPosition[0]+dx,bodySurface.completedPosition[1]+dy,bodySurface.completedPosition[2]+dz);
      else body.position.fromArray(bodySurface.completedPosition);
    }
    supplySurface.mesh.visible=growth||pressure;
    if(growth||pressure)supplySurface.update(particles.filter(p=>p.feedstock),colliders,sim.fluid.radius);
    const shed=garden?looseGardenParticles(particles):[];
    shedSurface.mesh.visible=shed.length>0;
    if(shed.length)shedSurface.update(shed,colliders,sim.fluid.radius);
    if(garden)ensurePoolSurfaces(sim.gardenLevel.pools.length);
    fieldSurfaces.forEach((surface,patchId)=>{
      const pool=field?particles.filter(p=>p.feedstock&&p.patchId===patchId):[];
      surface.mesh.visible=pool.length>0;
      if(pool.length)surface.update(pool,colliders,sim.fluid.radius);
    });
    if(perfEnabled)lastSurfaceMs=performance.now()-surfaceStart;
  }
  if(particleDebug.visible){
    particleDebug.count=garden&&sim.garden.phase==='complete'?0:sim.fluid.particles.length;
    sim.fluid.particles.forEach((p,i)=>{const q=garden&&sim.garden.phase==='draining'&&!p.feedstock?drainPosition(p,sim.garden.drainTime,sim.gardenLevel):
      arriving&&!p.feedstock?arrivalPosition(p,i,sim.garden.arrivalTime,sim.gardenLevel,sim.fluid.coatIndices):p;
      particleTransform.position.set(q.x,q.y+worldY,q.z);particleTransform.updateMatrix();
      particleDebug.setMatrixAt(i,particleTransform.matrix);});
    particleDebug.instanceMatrix.needsUpdate=true;
  }
  brainCore.position.set(sim.brain.x,sim.brain.y,sim.brain.z);
  brainCore.visible=!(garden&&sim.garden.phase==='complete');
  if(garden&&sim.garden.phase==='draining'){const p=drainPosition(sim.brain,sim.garden.drainTime,sim.gardenLevel);brainCore.position.set(p.x,p.y,p.z);}
  if(arriving){const p=arrivalPosition(sim.brain,sim.fluid.brainIndex,sim.garden.arrivalTime,sim.gardenLevel,sim.fluid.coatIndices);brainCore.position.set(p.x,p.y,p.z);}
  const denied=sim.tendril.feedback.startsWith('Not enough')&&sim.fluid.time<sim.tendril.feedbackUntil;
  bodyMat.opacity=.72+(denied?.18*Math.sin(sim.fluid.time*18)**2:0);
  brainCore.scale.setScalar(sim.size*(denied?1+.15*Math.sin(sim.fluid.time*18)**2:1));
}
let headingMode='';
function updateHud(){
  const mode=sim.selectedTest;
  if(mode==='garden'){
    const reach=!!gardenCanCast(sim.gardenLevel);
    pullButton.querySelector('span').textContent=reach&&sim.tendril.active?
      `Tap: ${sim.tendril.recalling?'pause':'recall'} / Hold: contract`:'Hold to contract';
    pullButton.setAttribute('aria-pressed',String(pullGesture.holding||reach&&sim.tendril.recalling));
    document.querySelector('.size-controls').hidden=true;
    document.querySelector('.instructions').textContent='WASD / ARROWS TO OOZE · SHIFT TO RUN · CLICK / E TO CAST · TAP SPACE TO RECALL · HOLD SPACE TO GATHER'+
      (sim.gardenLevel.gate||sim.gardenLevel.editorCanShed?' · HOLD F TO LEAVE FLESH':'');
    document.querySelector('#tendril-status').hidden=!reach;
    if(reach)document.querySelector('#tendril-status').textContent=
      `${sim.tendril.count}/3 TENDRILS · ${sim.tendril.recalling?'RECALLING · SPACE: PAUSE':'CLICK / E: CAST · SPACE: RECALL'}`;
    gameShell.update();return;
  }
  gameShell.update();
  document.querySelector('.instructions').textContent='WASD / ARROWS TO OOZE · TAP SPACE TO RECALL · HOLD TO CONTRACT · P SHOW PARTICLES';
  if(mode!==headingMode){
    const titles={field:'FIELD',growth:'GROWTH',gap:'LOW GAP',pressure:'TENDRILS'};
    const descriptions={pressure:'Cast a little of yourself. Draw the loose flesh home.',field:'Gather the small living puddles scattered across the terrace.',
      growth:'A small living puddle grows by gathering the falling flesh.',
      gap:'Lead the living puddle through a low passage.'};
    document.querySelector('header h1').innerHTML=`PUDDLE <em>/</em> ${titles[mode]}`;
    document.querySelector('header p').textContent=descriptions[mode];
    headingMode=mode;
  }
  let title='',hint='';
  if(mode==='pressure'){
    title=sim.pressure.complete?'THROUGH':sim.pressure.active?'WEIGHT HELD':sim.materialState==='shedding'?'SHEDDING':'FILL THE BASIN';
    hint=sim.pressure.complete?'Your deposit holds the gate. Press R to try another amount.':
      sim.pressure.active?'Leave the green flesh in the basin. Go around it and ooze under the raised gate.':
      'Approach the basin rim. Hold F to shed; loose flesh drains down. Leave 48 on the plate to raise the gate.';
  }else if(mode==='field'){
    title=sim.field.loose?'GATHERING':'FIELD ABSORBED';
    hint=sim.field.loose?'Move across the terrace. Touch a small puddle to draw its flesh into your body.':
      'All the loose puddles have joined the brain-connected body. Press R to scatter them again.';
  }else if(mode==='growth'){
    title=sim.growth.complete?'GROWN':sim.growth.absorbed?'ABSORBING':'SMALL PUDDLE';
    const exhausted=sim.growth.emitted>=GROWTH.capacity-GROWTH.seedCount;
    hint=sim.growth.complete?'The brain has grown stronger. Keep gathering or reset to try again.':
      exhausted?'The drip has ended. Gather the flesh already on the terrace.':
      'Follow the drip across the terrace. Touch loose flesh to absorb it and grow stronger.';
  }else{
    title=sim.gapStage==='through'?'THROUGH':sim.gapStage==='under'?'UNDER THE ROOF':'APPROACHING';
    hint=sim.gapStage==='through'?'The brain and almost all the flesh passed below the roof. Press R to try again.':
      sim.gapStage==='under'?'Keep moving forward; the low roof presses the body flat.':
      'Move right or tap Ooze Forward. The brain lowers before the roof; the flesh follows underneath.';
  }
  if(mode==='pressure'){
    const t=sim.tendril;
    if(t.active){title=t.recalling?'RECALLING':`${t.count} TENDRIL${t.count===1?'':'S'} OUT`;hint=t.recalling?'Gathering automatically. Tap Space to pause, or hold it to contract the body too.':t.count>=3?'All three strands are out. Tap Space to recall all; hold Space to gather the body.':'Click to cast another. Tap Space to recall all; hold Space to gather the body. Casting pauses recall.';}
    else if(t.state==='broken'){title='STRAND BROKEN';hint='The connection stretched or caught on an obstacle. Disconnected flesh turns green; cast again to recover it.';}
    else if(t.state==='need flesh'){title='MORE FLESH NEEDED';hint='Keep more than the minimum coating to cast a tendril. Gather loose flesh, or load Retrieval Setup.';}
    else if(sim.retrievalSetup){title=sim.pressure.weight?'CAST INTO THE BASIN':'FLESH RECOVERED';hint='Click the loose flesh in the basin to cast, or aim and press E. Tap Space to recall. Hold it to contract. F still sheds.';}
  }
  if(mode==='pressure'&&sim.fluid.time<sim.tendril.feedbackUntil){title=sim.tendril.feedback.startsWith('Not enough')?'NOT ENOUGH FLESH':'CAST STATUS';hint=sim.tendril.feedback;}
  document.querySelector('#tendril-status').hidden=mode!=='pressure';
  document.querySelector('#tendril-status').textContent=sim.tendril.active?
    `${sim.tendril.count}/3 TENDRILS · ${sim.tendril.recalling?'RECALLING · SPACE: PAUSE':'SPACE: RECALL'}`:'0/3 TENDRILS · CLICK TO CAST';
  document.querySelector('#mode').textContent=title;
  document.querySelector('#message').textContent=hint;
  const count=sim.fluid.particles.length,growth=mode==='growth',field=mode==='field',gap=mode==='gap';
  document.querySelector('#flesh-label').textContent=mode==='pressure'?'PLATE WEIGHT':gap?'FLESH THROUGH':field?'CONNECTED FLESH':'SIZE GOAL';
  document.querySelector('#reach-label').textContent='BRAIN POWER';
  document.querySelector('#flesh').textContent=mode==='pressure'?`${sim.pressure.weight} / ${PRESSURE.threshold}`:gap?`${Math.round(sim.fleshThrough*100)}%`:
    field?`${sim.fluid.attachedCount} / ${PUDDLE_FIELD.capacity-1}`:`${sim.fluid.attachedCount} / ${GROWTH.goal}`;
  document.querySelector('#flesh-fill').style.width=`${mode==='pressure'?Math.min(100,sim.pressure.weight/PRESSURE.threshold*100):gap?sim.fleshThrough*100:field?
    sim.fluid.attachedCount/(PUDDLE_FIELD.capacity-1)*100:
    Math.min(100,sim.fluid.attachedCount/GROWTH.goal*100)}%`;
  document.querySelector('#reach').textContent=`${Math.round(sim.fluid.brainPower*100)}%`;
  document.querySelector('#reach-fill').style.width=`${sim.fluid.brainPower*100}%`;
  document.querySelector('#growth-supply-row').hidden=gap;
  if(!gap){
    document.querySelector('#growth-supply-row span').textContent=mode==='pressure'?'BODY FLESH':field?'LOOSE FLESH':sim.growth.emitted>=GROWTH.capacity-GROWTH.seedCount?'DRIP ENDED':'LOOSE SUPPLY';
    document.querySelector('#growth-supply').textContent=String(mode==='pressure'?sim.fluid.particles.filter(p=>!p.feedstock).length-1:field?sim.field.loose:sim.fluid.particles.filter(q=>q.feedstock).length);
  }
  document.querySelector('.size-controls').hidden=!gap;
  pullButton.setAttribute('aria-pressed',String(pullGesture.holding||sim.tendril.recalling));
  pullButton.querySelector('span').textContent=sim.tendril.active?`Tap: ${sim.tendril.recalling?'pause':'recall'} / Hold: contract`:'Hold to contract';
  shedButton.setAttribute('aria-pressed',String(shedding||keys.has('KeyF')));
}
function updateWorldLabels(){
  const v=new THREE.Vector3();
  v.set(FUNNEL.x,.15,FUNNEL.z-1.5).project(activeCamera);
  const label=document.getElementById('pressure-label');
  label.textContent=`BASIN / ${sim.pressure.weight} OF ${PRESSURE.threshold}`;
  label.style.left=`${(v.x*.5+.5)*innerWidth}px`;label.style.top=`${(-v.y*.5+.5)*innerHeight}px`;
  label.style.display=sim.selectedTest==='pressure'&&cameraPointVisible(v)?'block':'none';
  v.set(GROWTH.spoutX,GROWTH.spoutY+1.05,GROWTH.spoutZ).project(activeCamera);
  const growthLabel=document.getElementById('growth-spout-label');
  growthLabel.style.left=`${(v.x*.5+.5)*innerWidth}px`;
  growthLabel.style.top=`${(-v.y*.5+.5)*innerHeight}px`;
  growthLabel.style.display=sim.selectedTest==='growth'&&cameraPointVisible(v)?'block':'none';
  v.set(0,1.55,0).project(activeCamera);
  const gapLabel=document.getElementById('gap-label');
  gapLabel.style.left=`${(v.x*.5+.5)*innerWidth}px`;
  gapLabel.style.top=`${(-v.y*.5+.5)*innerHeight}px`;
  gapLabel.style.display=sim.selectedTest==='gap'&&cameraPointVisible(v)?'block':'none';
}
function resize(){
  const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);
  const vertical=sim.selectedTest==='garden'?Math.max(17.2,22*h/w):['field','pressure'].includes(sim.selectedTest)?Math.max(16,22*h/w):w<760?17:11.5,aspect=w/h;
  camera.left=-vertical*aspect/2;camera.right=vertical*aspect/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();
  followCamera.resize(aspect);
}
window.addEventListener('resize',resize);resize();
let last=performance.now(),acc=0;
let lastIdleDraw=0;
let perfWindow={started:last,frames:0,frame:0,physics:0,surface:0,render:0,steps:0,intervals:[],meshStart:0,bodyMeshStart:0};
document.addEventListener('visibilitychange',()=>{last=performance.now();acc=0;});
function frame(now){
  const frameStart=perfEnabled?performance.now():0;
  const interval=Math.max(0,now-last),elapsed=Math.min(interval/1000,.08);last=now;
  if(document.hidden){acc=0;requestAnimationFrame(frame);return;}
  const idle=sim.selectedTest==='garden'&&['title','paused','complete'].includes(sim.garden.phase);
  if(idle){acc=0;if(now-lastIdleDraw<100){requestAnimationFrame(frame);return;}lastIdleDraw=now;}
  if(!idle)acc+=elapsed;
  const horizontal=(keys.has('KeyD')||keys.has('ArrowRight')||touchMove.has('right')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')||touchMove.has('left')?1:0);
  const vertical=(keys.has('KeyW')||keys.has('ArrowUp')||touchMove.has('up')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')||touchMove.has('down')?1:0);
  const basis=sim.selectedTest==='garden'?gardenMovementBasis():null;
  const forward=basis?.forward||camera.getWorldDirection(new THREE.Vector3());
  const right=basis?.right||new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
  if(!basis){forward.y=0;forward.normalize();right.y=0;right.normalize();}
  const {x,z}=movementAxes(sim.selectedTest,horizontal,vertical,right,forward);
  const contracting=pullGesture.update(now);
  const physicsStart=perfEnabled?performance.now():0;
  let steps=0;
  while(acc>=DT){const draining=sim.selectedTest==='garden'&&sim.garden.phase==='draining';sim.step({x:draining?0:x,z:draining?0:z,contract:draining?false:contracting,shed:shedding||keys.has('KeyF'),push:pushing||keys.has('ShiftLeft')||keys.has('ShiftRight')},DT);acc-=DT;steps++;}
  const physicsMs=perfEnabled?performance.now()-physicsStart:0;
  if(sim.selectedTest==='garden'){
    const descend=sim.descending&&sim.garden.phase==='arriving'?
      Math.max(0,sim.gardenLevelId-2)+Math.min(1,sim.garden.arrivalTime/1.1):sim.gardenLevelId-1;
    camera.position.set(5,18-7.2*descend,26);
    camera.lookAt(0,.6-7.2*descend,0);
  }else if(['field','pressure'].includes(sim.selectedTest)){
    camera.position.set(6.8,18.5,22.5);camera.lookAt(0,.7,0);
  }else if(innerWidth<760){
    const focusX=sim.brain.x+1.05;
    camera.position.set(focusX+9,13,sim.brain.z+19.65);
    camera.lookAt(focusX,1.65,sim.brain.z+1.65);
  }else{camera.position.set(9,13,18);camera.lookAt(0,1.65,0);}
  camera.updateMatrixWorld(true);
  activeCamera=sim.selectedTest==='garden'&&cameraMode==='follow'?followCamera.update(sim,elapsed,innerWidth/innerHeight):camera;
  activeCamera.updateMatrixWorld(true);
  syncOozeButton();updateSkin();updateHud();updateWorldLabels();gardenView.update(sim,activeCamera);weightGardenView.update(sim,activeCamera);passageGardenView.update(sim,activeCamera);reachGardenView.update(sim,activeCamera);gripGardenView.update(sim,activeCamera);
  const showUpper=sim.selectedTest==='garden'&&sim.descending&&sim.garden.phase==='arriving'&&sim.garden.arrivalTime<.5;
  if(sim.isLocalGarden){for(const view of [gardenView,weightGardenView,passageGardenView,reachGardenView,gripGardenView])view.group.visible=false;
    localView?.update(sim,activeCamera);}
  gardenScenery.update(sim.selectedTest==='garden',innerWidth,innerHeight,sim.gardenLevelId,showUpper,sim.isLocalGarden);
  pickupAudio.update(sim.selectedTest==='garden'?sim.garden:null);
  const renderStart=perfEnabled?performance.now():0;
  renderer.render(scene,activeCamera);
  if(document.documentElement.classList.contains('booting')){
    // The first scene and title card are both ready. Reveal them together on
    // the next frame, after WebGL has drawn rather than when the module loads.
    requestAnimationFrame(()=>{
      document.documentElement.classList.remove('booting');
      document.getElementById('boot-screen')?.remove();
    });
  }
  if(perfEnabled){
    perfWindow.frames++;perfWindow.frame+=performance.now()-frameStart;perfWindow.physics+=physicsMs;
    perfWindow.steps+=steps;perfWindow.intervals.push(interval);
    perfWindow.surface+=lastSurfaceMs;perfWindow.render+=performance.now()-renderStart;
    if(now-perfWindow.started>=1000){const n=perfWindow.frames||1;
      const sorted=perfWindow.intervals.slice().sort((a,b)=>a-b),pct=q=>sorted[Math.min(sorted.length-1,Math.floor(q*(sorted.length-1)))]||0;
      const fps=n*1000/(now-perfWindow.started),slow=sorted.filter(v=>v>25).length/n*100;
      const meshRate=(surfacePipeline.stats.completed-perfWindow.meshStart)*1000/(now-perfWindow.started);
      const bodyRate=(surfacePipeline.stats.bodyCompleted-perfWindow.bodyMeshStart)*1000/(now-perfWindow.started);
      perfNode.textContent=`CPU ms / frame · ${sim.selectedTest}${sim.selectedTest==='garden'?` ${sim.gardenLevelId}`:''}\n`+
        `total ${(perfWindow.frame/n).toFixed(1)} · physics ${(perfWindow.physics/n).toFixed(1)}\n`+
        `surface ${(perfWindow.surface/n).toFixed(1)} · render ${(perfWindow.render/n).toFixed(1)}\n`+
        `FPS ${fps.toFixed(1)} · interval p50 ${pct(.5).toFixed(1)} p95 ${pct(.95).toFixed(1)} · missed frames (>25ms) ${slow.toFixed(0)}%\n`+
        `steps/frame ${(perfWindow.steps/n).toFixed(2)} · body mesh ${bodyRate.toFixed(1)}/s age ${surfacePipeline.stats.bodyAgeMs.toFixed(0)}ms build ${surfacePipeline.stats.bodyBuildMs.toFixed(0)}ms\n`+
        `all meshes ${meshRate.toFixed(1)}/s · last build ${surfacePipeline.stats.buildMs.toFixed(0)}ms\n`+
        `worker ${surfacePipeline.workerEnabled?'on':'fallback'} · pending ${surfacePipeline.pendingCount} · GPU ${renderer.info.render.calls} calls / ${renderer.info.render.triangles} tris`;
      perfNode.dataset.fps=fps.toFixed(1);perfNode.dataset.p95=pct(.95).toFixed(1);
      perfNode.dataset.meshRate=bodyRate.toFixed(1);perfNode.dataset.meshAge=surfacePipeline.stats.bodyAgeMs.toFixed(0);
      perfNode.dataset.missedFrames=slow.toFixed(0);
      perfWindow={started:now,frames:0,frame:0,physics:0,surface:0,render:0,steps:0,intervals:[],meshStart:surfacePipeline.stats.completed,bodyMeshStart:surfacePipeline.stats.bodyCompleted};
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
