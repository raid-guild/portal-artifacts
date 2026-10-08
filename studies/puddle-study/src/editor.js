import * as THREE from 'three';
import './editor.css';
import {createBlankDraft,draftFromPreset,compileDraft,validateDraft,exportDraft,importDraft,DraftHistory,
  addDraftObject,moveDraftObject,rotateDraftObject,deleteDraftObject,clearDraftObjects,duplicateDraftObject,draftPosition,resetDraftPaint,resizeDraftFootprint,alignAttachedBasinHeight,placedObjectDefaults,unsupportedFunnelAt,snapDraftObjectToHighest,WorkbenchSimulation} from './editor-workbench.js';
import {createEditorStageView,editorStageHitInfo} from './editor-stage-view.js';
import {createSurfacePipeline} from './surface-pipeline.js';
import {gardenColliders,arrivalPosition,drainPosition,gardenHint} from './garden-level.js';
import {groundAt} from './colliders.js';
import {DT} from './simulation.js';
import {PullGesture} from './pull-gesture.js';
import {movementAxes} from './movement.js';
import {setupMusic} from './music.js';
import {setupPickupAudio} from './pickup-audio.js';
import {createLocalLevelLibrary,localStorageForPage,localPageQuery} from './local-levels.js';
import {createPrintedMaterialLibrary} from './printed-material.js';
import {paintFaceForHit,paintArea,movePaintWithinFace} from './editor-paint.js';
import {TouchJoystick} from './touch-joystick.js';
import {bindHoldButton,bindPullButton} from './touch-actions.js';

const $=id=>document.getElementById(id),copy=o=>JSON.parse(JSON.stringify(o));
const storageKey='puddle-level-workshop-v3',memory=new URLSearchParams(location.search).get('storage')==='memory';
const testSession=new URLSearchParams(location.search).get('storage')==='test';
const editorStorage=localStorageForPage(location.search),localLibrary=createLocalLevelLibrary({storage:editorStorage});
document.querySelector('header a').href=`./index.html${localPageQuery(location.search)}`;
let linkedLevelId=null,linkedDocument=null;
let draft=createBlankDraft(),startup='Blank garden ready. Choose a tool or load a preset.';
if(memory)startup='Temporary test session. Export JSON to keep this draft.';
try{if(!memory){const saved=editorStorage?.getItem(storageKey)||editorStorage?.getItem('puddle-level-workshop-v2')||editorStorage?.getItem('puddle-level-workshop-v1');
  if(saved){draft=importDraft(saved);startup='Loaded your local garden.';}}}catch{startup='Local save unavailable; export a JSON backup.';}
const requestedLevel=new URLSearchParams(location.search).get('level');
if(requestedLevel){const entry=localLibrary.get(requestedLevel);
  if(entry)try{draft=importDraft(entry.document);linkedLevelId=entry.id;linkedDocument=entry.document;
    startup=`Editing saved local level “${entry.name}”.`;}catch{startup='That local level could not be opened; your draft is safe.';}
  else startup='That local level was not found; your draft is safe.';}
let history=new DraftHistory(draft),selected=null,tool='select',playing=false,sim=null,view=null,
  drag=null,aim=null,pendingPreview=false,frameCount=0,orbit={azimuth:.19,elevation:.85,distance:22.5},
  pointerPose=null,brushStart=null,paintMode='fill';
const keys=new Set(),canvas=$('world'),scene=new THREE.Scene();scene.background=new THREE.Color(0xc6dfd9);
const joystick=new TouchJoystick({onDoubleTap:(x,y)=>{
  if(!playing||sim?.garden.phase!=='playing'||!sim.gardenInputArmed||!sim.gardenLevel.tendrils)return;
  if(aimAt({clientX:x,clientY:y})){const target={...aim};sim.castTendril(target);}

}});
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
const printLibrary=createPrintedMaterialLibrary();
const camera=new THREE.PerspectiveCamera(42,1,.1,160),target=new THREE.Vector3(0,.5,0),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
const handles=new THREE.Group();scene.add(handles);
const handleGeo=new THREE.SphereGeometry(.27,12,8),haloGeo=new THREE.TorusGeometry(.34,.048,6,20),
  haloMaterial=new THREE.MeshBasicMaterial({color:0xf5e9d2,transparent:true,opacity:1,depthTest:false,depthWrite:false}),
  handleMaterials={start:0xb96e68,exit:0x364f4c,flesh:0x80a593,
  gem:0x9b81ae,gold:0xd1a04d,pillar:0xe2d1b9,block:0xb3a792,lowgap:0x8aa69e,stairs:0xb6ba9b,label:0x755c78,
  basin:0xa78374,paint:0x91b7aa,cutter:0xb66a67};
const markerMaterials=new Map(Object.entries(handleMaterials).map(([key,color])=>[key,new THREE.MeshBasicMaterial({color,transparent:true,opacity:1,depthTest:false,depthWrite:false})]));
const outlineMaterial=new THREE.MeshBasicMaterial({color:0xa65855,wireframe:true,transparent:true,opacity:1,depthTest:false,depthWrite:false});
const ghost=new THREE.Mesh(new THREE.BoxGeometry(.6,.06,.6),new THREE.MeshBasicMaterial({color:0xb47870,transparent:true,opacity:.48,depthWrite:false}));
scene.add(ghost);ghost.visible=false;
const pipeline=createSurfacePipeline(),bodyMaterial=new THREE.MeshBasicMaterial({color:0xc6746e,transparent:true,opacity:.85}),
  poolMaterial=new THREE.MeshBasicMaterial({color:0x86a398,transparent:true,opacity:.83}),
  body=pipeline.create(bodyMaterial,48,{priority:0}),poolSurfaces=[];
scene.add(body.mesh);
const brain=new THREE.Mesh(new THREE.SphereGeometry(.072,12,8),new THREE.MeshBasicMaterial({color:0x795952}));scene.add(brain);
const aimRing=new THREE.Mesh(new THREE.TorusGeometry(.22,.018,5,32),new THREE.MeshBasicMaterial({color:0x805976}));
aimRing.rotation.x=-Math.PI/2;scene.add(aimRing);aimRing.visible=false;
const music=setupMusic(),audio=setupPickupAudio();let recall=false;
const editorMusicPanel=document.querySelector('.stage-panel > .music-controls');
const pull=new PullGesture(()=>{recall=true;});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),snap=n=>$('snap').checked?Math.round(n*4)/4:Math.round(n*100)/100;
function status(message){$('status').textContent=message;}
function persist(){try{if(!memory)editorStorage?.setItem(storageKey,exportDraft(draft));return !memory&&!!editorStorage;}catch{return false;}}
function updateLinkedStatus(){const node=$('linked-level');if(!node)return;
  node.textContent=linkedLevelId?`Local level · ${linkedLevelId.slice(0,8)}${linkedDocument===exportDraft(draft)?' · saved':' · unsaved changes'}`:
    'Not linked to a local level';}
function commit(message='Garden updated.'){
  history.commit(draft);selected=draft.objects.some(o=>o.id===selected)?selected:null;
  renderEditor();pendingPreview=true;
  const saved=persist();updateLinkedStatus();status(memory?message+' Temporary session · export to keep this draft.':
    saved?message+' Saved locally.':message+' Export a backup if local save is unavailable.');
}
function selectedObject(){return draft.objects.find(o=>o.id===selected)||null;}
function positionOf(o){return draftPosition(o);}
function clearHandles(){for(const m of [...handles.children]){handles.remove(m);if(m.geometry!==handleGeo&&m.geometry!==haloGeo)m.geometry.dispose();}}
function renderHandles(){clearHandles();if(playing)return;
  if(!draft.boundary||!draft.terrain)return;
  const previewDraft=drag?.mode==='move'?{...draft,objects:draft.objects.filter(o=>o.kind!=='cutter')}:draft;
  let level;try{level=compileDraft(previewDraft);}catch{level=compileDraft({...draft,
    objects:draft.objects.filter(o=>o.kind!=='cutter')});}
  for(const o of draft.objects){const p=positionOf(o);if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))continue;
    const material=markerMaterials.get(o.kind)||markerMaterials.get('block');
    const m=new THREE.Mesh(handleGeo,material);m.position.set(p.x,o.kind==='cutter'?o.y:o.kind==='label'?o.base+o.offset:
      o.kind==='paint'&&o.face!=='floor'?((o.minY??o.base??0)+(o.maxY??draft.objects.find(item=>item.id===o.targetId)?.maxY??2))/2:
      o.kind==='paint'?o.base+.15:
      o.kind==='pillar'?(o.base??0)+o.height+.28:
      o.kind==='basin'&&Number.isFinite(o.base)?o.base+.3:
      Math.max(0,groundAt(p.x,p.z,gardenColliders(level)).height)+.35,p.z);
    m.userData.editorId=o.id;m.renderOrder=11;m.scale.setScalar(o.id===selected?1.35:1);handles.add(m);
    const halo=new THREE.Mesh(haloGeo,haloMaterial);halo.position.copy(m.position);halo.userData.editorId=o.id;
    halo.userData.handleHalo=true;halo.renderOrder=10;halo.scale.setScalar(o.id===selected?1.35:1);
    halo.quaternion.copy(camera.quaternion);handles.add(halo);
    if(o.id===selected){const ring=new THREE.Mesh(new THREE.TorusGeometry(.31,.025,5,28),outlineMaterial);
      ring.rotation.x=-Math.PI/2;ring.position.copy(m.position);ring.position.y-=.18;ring.userData.editorId=o.id;
      ring.renderOrder=12;handles.add(ring);}
  }
}
function resetSurfaces(){pipeline.invalidate();for(const s of poolSurfaces.splice(0)){scene.remove(s.mesh);s.dispose();}
  for(let i=0;i<draft.objects.filter(o=>o.kind==='flesh').length+1;i++){const s=pipeline.create(poolMaterial,28,{priority:1});poolSurfaces.push(s);scene.add(s.mesh);}}
function rebuild(test=false){const checks=validateDraft(draft);
  if(!draft.boundary||!draft.terrain){view?.dispose();view=null;sim=null;body.mesh.visible=brain.visible=false;return;}
  let level;
  try{level=compileDraft(draft);}catch{
    const sourceOnly={...draft,objects:draft.objects.filter(o=>o.kind!=='cutter')};
    level=compileDraft(sourceOnly);level.editorCutters=draft.objects.filter(o=>o.kind==='cutter');
  }
  view?.dispose();view=createEditorStageView(scene,level,{printLibrary,labelRoot:$('app')});view.setEditing(!test);
  if(checks.errors.length){sim=null;pipeline.invalidate();body.mesh.visible=brain.visible=false;
    for(const surface of poolSurfaces)surface.mesh.visible=false;
    pendingPreview=false;renderHandles();return;}
  sim=new WorkbenchSimulation(draft);
  resetSurfaces();aim=null;clearInput();
  if(test){sim.garden.phase='arriving';sim.garden.arrivalTime=0;sim.gardenInputArmed=false;}
  else{sim.garden.phase='playing';for(let i=0;i<4;i++)sim.step({});}
  for(const surface of poolSurfaces)surface.mesh.visible=true;
  updateParticles();pendingPreview=false;renderHandles();
}
function updateParticles(){if(!sim)return;
  const c=sim.activeColliders(),particles=sim.fluid.particles,state=sim.garden,
    arriving=playing&&(state.phase==='arriving'||state.phase==='settling');
  const pose=(p,i)=>arriving?arrivalPosition(p,i,state.arrivalTime,sim.gardenLevel,sim.fluid.coatIndices):
    playing&&state.phase==='draining'?drainPosition(p,state.drainTime,sim.gardenLevel):p;
  body.mesh.visible=brain.visible=state.phase!=='complete';
  body.update(particles.flatMap((p,i)=>p.feedstock?[]:[pose(p,i)]),c,sim.fluid.radius,{maskTerrain:!arriving&&state.phase!=='draining'});
  for(let i=0;i<poolSurfaces.length;i++)poolSurfaces[i].update(particles.filter(p=>p.feedstock&&
    (i===poolSurfaces.length-1?p.patchId===undefined:p.patchId===i)),c,sim.fluid.radius);
  const b=pose(sim.brain,sim.fluid.brainIndex);brain.position.set(b.x,b.y,b.z);
}
function fitDistance(){const elev=clamp(orbit.elevation,.12,1.55),az=orbit.azimuth,
  b=draft.boundary||{minX:-9,maxX:9,minZ:-6,maxZ:4.8},width=b.maxX-b.minX+1.4,depth=b.maxZ-b.minZ+1.4,
  horizontal=width*Math.abs(Math.cos(az))+depth*Math.abs(Math.sin(az)),
  vertical=(width*Math.abs(Math.sin(az))+depth*Math.abs(Math.cos(az)))*Math.sin(elev)+4*Math.cos(elev),
  tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  return Math.max(horizontal/(2*tangent*camera.aspect),vertical/(2*tangent))*1.06;
}
function fitCamera(){orbit.distance=Math.max(orbit.distance,fitDistance());updateCamera();}
function updateCamera(){const elev=clamp(orbit.elevation,.12,1.55),az=orbit.azimuth,d=orbit.distance;
  camera.position.set(target.x+Math.sin(az)*Math.cos(elev)*d,target.y+Math.sin(elev)*d,target.z+Math.cos(az)*Math.cos(elev)*d);
  camera.up.set(0,1,0);camera.lookAt(target);camera.updateMatrixWorld();}
let firstResize=true,prePlayDistance=null;
function resize(){const rect=$('app').getBoundingClientRect();if(!rect.width||!rect.height)return;
  renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
  if(firstResize){firstResize=false;fitCamera();}else if(playing)fitCamera();else updateCamera();}
new ResizeObserver(resize).observe($('app'));
$('top-view').onclick=()=>{orbit={azimuth:0,elevation:1.54,distance:19.5};fitCamera();};
$('tower-view').onclick=()=>{orbit={azimuth:.19,elevation:.85,distance:22.5};fitCamera();};
$('reset-view').onclick=()=>{target.set(0,.5,0);orbit={azimuth:.19,elevation:.85,distance:22.5};fitCamera();};
canvas.addEventListener('wheel',e=>{e.preventDefault();orbit.distance=clamp(orbit.distance*Math.exp(e.deltaY*.001),9,70);updateCamera();},{passive:false});
const tools=[['select','Select / move'],['erase','Erase'],['pillar','Pillar'],['block','Block'],['lowgap','Low gap'],
  ['stairs','Ramp'],['flesh','Loose flesh'],['gem','Gem'],['gold','Gold'],['start','Start'],['exit','Exit'],['label','Label'],
  ['basin','Basin · shallow clay depression'],['cutter-box','Cut box'],['cutter-cylinder','Cut cylinder'],
  ['paint-slip','Paint slippery'],['paint-sticky','Paint sticky'],['paint-normal','Paint normal']];
function renderTools(){$('tools').replaceChildren(...tools.map(([key,name])=>{const button=document.createElement('button');button.textContent=name;
  button.classList.toggle('active',tool===key);button.setAttribute('aria-pressed',String(tool===key));button.onclick=()=>{tool=key;activePaintFace=null;$('paint-apply').disabled=true;
    $('paint-apply').textContent=key==='paint-normal'?'Clear selected face':'Fill selected face';
    $('paint-selection').textContent='Selected face: none';ghost.visible=false;
    ghost.material.wireframe=false;ghost.material.opacity=.48;renderTools();
    status(key.startsWith('paint-')?paintMode==='fill'?'Click a flat face, then choose Fill selected face.':'Drag a rectangle on one flat face.':key==='select'?'Click or drag a piece.':`Click the garden to use ${name.toLowerCase()}.`);};return button;}));}
function pointFromEvent(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);const hit=view&&raycaster.intersectObjects(view.group.children,true)
    .find(h=>h.object.userData.pickableTerrain);
  const p=hit?.point;if(!p)return null;
  const n=hit.face?.normal.clone().transformDirection(hit.object.matrixWorld)||new THREE.Vector3(0,1,0);
  const face=Math.abs(n.y)>.55?'floor':Math.abs(n.x)>Math.abs(n.z)?(n.x>0?'east':'west'):(n.z>0?'south':'north');
  const b=draft.boundary,source=editorStageHitInfo(hit);return {x:snap(clamp(p.x,b.minX+.2,b.maxX-.2)),y:p.y,z:snap(clamp(p.z,b.minZ+.2,b.maxZ-.2)),
    face,...source};}
function hitPaintPatch(e){if(!view)return null;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(view.group.children,true)
    .find(h=>h.object.userData.editorPaintId||h.object.userData.pickableTerrain)?.object.userData.editorPaintId||null;}
function hitHandle(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(handles.children,false)[0]?.object.userData.editorId||null;}
function dragPoint(e,height){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);const p=new THREE.Vector3();
  if(!raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-height),p))return null;
  const b=draft.boundary;return {x:snap(clamp(p.x,b.minX+.2,b.maxX-.2)),y:height,
    z:snap(clamp(p.z,b.minZ+.2,b.maxZ-.2)),face:'floor'};}
const defaultObject=placedObjectDefaults;
function place(kind,p){if((kind==='exit'||kind==='basin'&&!p.targetId)&&
  unsupportedFunnelAt(draft,p.x,p.z,kind==='exit'?.95:.85)){
    status('Place exits and basins on open terrain, away from raised structures.');return;}
  if(kind==='start'||kind==='exit'){
    const old=draft.objects.find(o=>o.kind===kind);if(old){old.x=p.x;old.z=p.z;if(kind==='start')old.base=Math.max(0,p.y);
      if($('snap-high').checked&&kind==='start')snapDraftObjectToHighest(draft,old.id);
      selected=old.id;commit(`${kind} moved.`);return;}}
  const object=addDraftObject(draft,kind.startsWith('cutter-')?'cutter':kind,defaultObject(kind,p));
  if($('snap-high').checked&&kind!=='cutter-box'&&kind!=='cutter-cylinder'&&kind!=='exit')
    snapDraftObjectToHighest(draft,object.id);
  selected=object.id;commit(`${kind==='stairs'?'Ramp':kind} placed.`);}
function erase(id=selected){if(!id||!deleteDraftObject(draft,id))return;selected=null;commit('Object removed.');}
function rotateSelection(){if(!selected||!rotateDraftObject(draft,selected))return;commit('Rotated a quarter turn.');}
let activePaintFace=null;
function paint(area){if(!area)return;
  resetDraftPaint(draft,area);
  if(tool==='paint-normal'){selected=null;commit('Paint cleared from this area.');return;}
  const object=addDraftObject(draft,'paint',{...area,surface:tool==='paint-slip'?'slippery':'sticky'});
  selected=object.id;commit('Surface painted.');}
function paintPlanePoint(e,face){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);const n=new THREE.Vector3(face.face==='west'?-1:face.face==='east'?1:0,
    face.face==='floor'?1:0,face.face==='north'?-1:face.face==='south'?1:0),
    edge=face.face==='floor'?face.base:face.edge,
    onPlane=face.face==='floor'?new THREE.Vector3(0,edge,0):
      ['east','west'].includes(face.face)?new THREE.Vector3(edge,0,0):new THREE.Vector3(0,0,edge);
  const p=new THREE.Vector3();return raycaster.ray.intersectPlane(new THREE.Plane().setFromNormalAndCoplanarPoint(n,onPlane),p)?p:null;}
function showPaintPreview(area){if(!area){ghost.visible=false;return;}ghost.visible=true;
  ghost.material.wireframe=paintMode==='fill'&&!!activePaintFace;
  ghost.material.opacity=ghost.material.wireframe ? .95 : .48;
  ghost.material.color.setHex(ghost.material.wireframe?0x23484c:tool==='paint-slip'?0x4aaec5:tool==='paint-sticky'?0x7da987:0xb77972);
  if(area.face==='floor'){ghost.position.set((area.minX+area.maxX)/2,area.base+.055,(area.minZ+area.maxZ)/2);
    ghost.scale.set((area.maxX-area.minX)/.6,1,(area.maxZ-area.minZ)/.6);}
  else{const y=(area.minY+area.maxY)/2;
    ghost.position.set((area.minX+area.maxX)/2,y,(area.minZ+area.maxZ)/2);
    ghost.scale.set(Math.max(.06,area.maxX-area.minX)/.6,(area.maxY-area.minY)/.06,Math.max(.06,area.maxZ-area.minZ)/.6);}}
function selectPaintFace(p){const face=paintFaceForHit(draft,p);if(face.error){activePaintFace=null;$('paint-apply').disabled=true;
    $('paint-selection').textContent='Selected face: none';ghost.visible=false;status(face.error);return null;}
  if(tool==='paint-slip'&&face.face!=='floor'){activePaintFace=null;$('paint-apply').disabled=true;
    $('paint-selection').textContent='Selected face: none';status('Slippery paint works on floors and tops.');return null;}
  activePaintFace={face,point:p};$('paint-apply').disabled=false;showPaintPreview(paintArea(face,p,p,'fill'));
  const owner=face.targetId?draft.objects.find(o=>o.id===face.targetId):null;
  $('paint-selection').textContent=`Selected face: ${owner?.kind||'terrain'} · ${face.face==='floor'?'top':face.face+' wall'}`;
  status(`${face.face==='floor'?'Top':face.face+' wall'} selected${owner?' on '+owner.kind:''}. Choose ${tool==='paint-normal'?'Clear selected face':'Fill selected face'} to apply.`);
  return face;}
$('paint-fill').onchange=()=>{paintMode='fill';activePaintFace=null;$('paint-apply').disabled=true;
  $('paint-selection').textContent='Selected face: none';ghost.visible=false;status('Click a flat face, then choose Fill selected face.');};
$('paint-rectangle').onchange=()=>{paintMode='rectangle';activePaintFace=null;$('paint-apply').disabled=true;
  $('paint-selection').textContent='Selected face: none';ghost.visible=false;status('Drag a rectangle on one flat face.');};
$('paint-apply').onclick=()=>{if(activePaintFace&&tool.startsWith('paint-'))paint(paintArea(activePaintFace.face,activePaintFace.point,activePaintFace.point,'fill'));
  activePaintFace=null;$('paint-apply').disabled=true;$('paint-selection').textContent='Selected face: none';ghost.visible=false;};
canvas.addEventListener('pointerdown',e=>{if(playing){if(e.pointerType==='touch'){
    if(sim.garden.phase!=='playing'||!sim.gardenInputArmed)return;
    e.preventDefault();joystick.down(e.pointerId,e.clientX,e.clientY,performance.now());canvas.setPointerCapture(e.pointerId);
  }else if(e.button===0&&sim.gardenLevel.tendrils&&sim.garden.phase==='playing'&&aimAt(e))cast();return;}
  if(e.button===2||e.altKey){drag={mode:'orbit',clientX:e.clientX,clientY:e.clientY,az:orbit.azimuth,el:orbit.elevation};canvas.setPointerCapture(e.pointerId);return;}
  const id=tool.startsWith('paint-')?null:hitHandle(e);
  const p=pointFromEvent(e);
  if(!p&&!id){if(tool==='select'){selected=null;renderEditor();return;}
    status('Place on the visible garden floor or a supported top.');return;}
  if(e.button!==0)return;
  if(tool!=='select'&&tool!=='erase'&&!tool.startsWith('paint-')&&p?.face!=='floor'){
    status('Place new pieces on a floor or supported top.');return;}
  if(tool==='select'){selected=id||hitPaintPatch(e);const current=selectedObject();
    if(current?.kind==='paint'){
      const center={targetId:current.targetId||null,face:current.face,x:(current.minX+current.maxX)/2,
        y:current.face==='floor'?current.base:((current.minY??current.base??0)+(current.maxY??draft.objects.find(item=>item.id===current.targetId)?.maxY??2))/2,
        z:(current.minZ+current.maxZ)/2,part:current.part};
      const face=paintFaceForHit(draft,center),start=face.error?null:paintPlanePoint(e,face);
      drag=start?{mode:'move-paint',start,face,origin:copy(current),moved:false}:null;
    }else{const planeY=p?.y??(current?.base??0),start=id?dragPoint(e,planeY):null;
      drag=id&&start?{mode:'move',start,planeY,origin:positionOf(current),moved:false}:null;}
    renderEditor();if(drag)canvas.setPointerCapture(e.pointerId);}
  else if(tool==='erase')erase(id);
  else if(tool.startsWith('paint-')){const face=selectPaintFace(p);if(!face)return;
    if(paintMode==='rectangle'){brushStart=p;drag={mode:'paint',face};canvas.setPointerCapture(e.pointerId);}}
  else place(tool,p);
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointermove',e=>{if(playing){if(e.pointerType==='touch')joystick.move(e.pointerId,e.clientX,e.clientY);
  else if(sim.gardenLevel.tendrils)aimAt(e);return;}
  if(drag?.mode==='orbit'){orbit.azimuth=drag.az+(e.clientX-drag.clientX)*.007;orbit.elevation=clamp(drag.el+(e.clientY-drag.clientY)*.006,.12,1.55);updateCamera();return;}
  const p=drag?.mode==='move'?dragPoint(e,drag.planeY):pointFromEvent(e);
  if(drag?.mode==='paint'){showPaintPreview(paintArea(drag.face,brushStart,paintPlanePoint(e,drag.face),'rectangle'));return;}
  if(tool.startsWith('paint-')&&paintMode==='fill'&&activePaintFace){showPaintPreview(paintArea(activePaintFace.face,null,null,'fill'));return;}
  if(drag?.mode==='move-paint'){
    const hit=paintPlanePoint(e,drag.face),object=selectedObject();if(!hit||!object)return;
    Object.assign(object,drag.origin);
    if(movePaintWithinFace(draft,object,hit.x-drag.start.x,hit.y-drag.start.y,hit.z-drag.start.z)){
      drag.moved=true;showPaintPreview(object);}return;}
  if(!p)return;pointerPose=p;
  if(drag?.mode==='move'){const x=drag.origin.x+p.x-drag.start.x,z=drag.origin.z+p.z-drag.start.z;
    if(moveDraftObject(draft,selected,snap(x),snap(z))){
      const object=selectedObject();if(object?.kind==='label')object.base=p.y;
      drag.moved=true;renderHandles();pendingPreview=true;}}
  else{ghost.visible=tool!=='select'&&tool!=='erase';if(ghost.visible)ghost.position.set(p.x,p.y+.05,p.z);}
});
canvas.addEventListener('pointerup',e=>{if(playing){if(e.pointerType==='touch')joystick.up(e.pointerId,e.clientX,e.clientY,performance.now());return;}
  if(drag?.mode==='move'&&drag.moved){
    if($('snap-high').checked)snapDraftObjectToHighest(draft,selected);
    commit('Object moved.');}
  if(drag?.mode==='move-paint'&&drag.moved)commit('Paint moved on its face.');
  if(drag?.mode==='paint'){const area=paintArea(drag.face,brushStart,paintPlanePoint(e,drag.face),'rectangle');
    if(area)paint(area);else status('Drag across the face to size a rectangle. A click alone does not paint.');}
  drag=null;brushStart=null;
  if(tool.startsWith('paint-')&&paintMode==='fill'&&activePaintFace)
    showPaintPreview(paintArea(activePaintFace.face,null,null,'fill'));
  else ghost.visible=false;});
canvas.addEventListener('pointercancel',e=>{if(playing){joystick.cancel(e.pointerId);return;}
  if((drag?.mode==='move'||drag?.mode==='move-paint')&&drag.moved){draft=copy(history.states[history.index]);pendingPreview=true;renderEditor();}drag=null;brushStart=null;ghost.visible=false;});
canvas.addEventListener('lostpointercapture',e=>{if(playing&&e.pointerType==='touch'&&joystick.touches.has(e.pointerId))joystick.cancel(e.pointerId);});
function addField(label,value,change,{step=.1,min,max}={}){const wrap=document.createElement('label');wrap.textContent=label;
  const input=document.createElement('input');input.type='number';input.value=Number(value.toFixed(3));input.step=step;
  if(min!==undefined)input.min=min;if(max!==undefined)input.max=max;
  input.onchange=()=>{const n=Number(input.value);if(!Number.isFinite(n)||min!==undefined&&n<min||max!==undefined&&n>max){input.value=value;status('Enter a finite value within the shown limits.');return;}
    change(n);commit();};wrap.append(input);return wrap;}
function addTextField(label,value,change){const wrap=document.createElement('label');wrap.textContent=label;
  const input=document.createElement('input');input.type='text';input.maxLength=120;input.value=value;
  input.onchange=()=>{const text=input.value.trim();if(!text){input.value=value;status('Enter some text for the label.');return;}
    change(text);commit();};wrap.append(input);return wrap;}
function renderInspector(){const panel=$('inspector');panel.replaceChildren();const o=selectedObject();
  if(!o){const text=document.createElement('p');text.className='hint';text.textContent='Select an object in the 3D garden.';panel.append(text);return;}
  const title=document.createElement('div');title.className='selection-title';title.textContent=(o.kind==='stairs'?'RAMP':o.kind.toUpperCase())+' · '+o.id;panel.append(title);
  const pos=positionOf(o);if(pos&&Number.isFinite(pos.x)){
    const fields=document.createElement('div');fields.className='fields';fields.append(
      addField('X',pos.x,n=>moveDraftObject(draft,o.id,n,pos.z)),
      addField('Z',pos.z,n=>moveDraftObject(draft,o.id,pos.x,n)));panel.append(fields);}
  const number=(label,value,change,options)=>panel.append(addField(label,value,change,options));
  const rect=(r=o)=>{const center={x:(r.minX+r.maxX)/2,z:(r.minZ+r.maxZ)/2};
    const b=draft.boundary;
    number('Width',r.maxX-r.minX,n=>resizeDraftFootprint(draft,o.id,'width',n),
      {min:.15,max:Math.max(.15,2*Math.min(center.x-b.minX,b.maxX-center.x))});
    number('Depth',r.maxZ-r.minZ,n=>resizeDraftFootprint(draft,o.id,'depth',n),
      {min:.15,max:Math.max(.15,2*Math.min(center.z-b.minZ,b.maxZ-center.z))});};
  const choice=(label,value,options,change)=>{const wrap=document.createElement('label');wrap.textContent=label+' ';
    const select=document.createElement('select');for(const v of options){const item=document.createElement('option');item.value=v;item.textContent=v;select.append(item);}
    select.value=value;select.onchange=()=>{change(select.value);commit();};wrap.append(select);panel.append(wrap);};
  if(['block','lowgap','legacy-roof','legacy-passage','slippery'].includes(o.kind))rect();
  if(o.kind==='block'){number('Base height',o.minY??0,n=>{const delta=n-(o.minY??0);o.minY=n;o.maxY+=delta;
      alignAttachedBasinHeight(draft,o.id,o.maxY);},{min:0,max:8});
    number('Height',o.maxY-(o.minY??0),n=>{o.maxY=(o.minY??0)+n;
      alignAttachedBasinHeight(draft,o.id,o.maxY);},{min:.15,max:8});}
  if(o.kind==='lowgap'||o.kind==='legacy-roof'||o.kind==='legacy-passage'){
    number('Clearance',o.bottom,n=>{o.bottom=n;},{min:.16,max:3});
    number('Top height',o.top,n=>{o.top=n;alignAttachedBasinHeight(draft,o.id,o.top);},{min:.2,max:8});
    if(o.kind==='lowgap'){number('End support width',o.supportWidth??.16,n=>{o.supportWidth=n;},{min:.08,max:.6});
      choice('Opening direction',o.axis||'z',['x','z'],n=>{o.axis=n;});}}
  if(o.kind==='start'){number('Start height',o.base??0,n=>{o.base=n;},{min:0,max:16});
    const hint=document.createElement('p');hint.className='hint';
    hint.textContent='Set this to the platform top (Base height + Height), or use the Start tool and click its top surface.';panel.append(hint);}
  if(o.kind==='label'){panel.append(addTextField('Text',o.text,n=>{o.text=n;}));
    number('Surface height',o.base,n=>{o.base=n;},{min:-8,max:16});
    number('Height above surface',o.offset,n=>{o.offset=n;},{min:0,max:8});}
  if(['block','pillar','stairs','lowgap','start','label','basin'].includes(o.kind)){
    const snapButton=document.createElement('button');snapButton.textContent='Snap to highest surface';
    snapButton.onclick=()=>{const result=snapDraftObjectToHighest(draft,o.id);
      if(result.ok)commit(`Snapped to height ${result.height.toFixed(2)}.`);else status(result.reason);};
    panel.append(snapButton);}
  if(o.kind==='pillar'){number('Radius',o.radius,n=>{o.radius=n;},{min:.12,max:2});
    number('Height',o.height,n=>{o.height=n;alignAttachedBasinHeight(draft,o.id,(o.base??0)+o.height);},{min:.1,max:5});
    number('Base height',o.base??0,n=>{o.base=n;alignAttachedBasinHeight(draft,o.id,o.base+o.height);},{min:0,max:8});}
  if(o.kind==='stairs'){number('Run',o.run,n=>resizeDraftFootprint(draft,o.id,'run',n),{min:.4,max:8});
    number('Width',o.width,n=>resizeDraftFootprint(draft,o.id,'width',n),{min:.4,max:5});
    number('Rise',o.rise,n=>{o.rise=n;},{min:.2,max:5});
    number('Visual divisions',o.steps,n=>{o.steps=Math.round(n);},{min:1,max:12,step:1});
    number('Base height',o.base??0,n=>{o.base=n;},{min:0,max:8});
    choice('Direction',o.axis==='x'?(o.reverse?'west':'east'):(o.reverse?'north':'south'),
      ['east','south','west','north'],n=>{o.axis=n==='east'||n==='west'?'x':'z';o.reverse=n==='west'||n==='north';});}
  if(['exit','basin','pressure-basin'].includes(o.kind)){
    number('Rim radius',o.radius,n=>{o.radius=n;},{min:.35,max:2});
    number('Bottom radius',o.bottomRadius,n=>{o.bottomRadius=n;},{min:.15,max:1.5});
    number('Depression depth',o.depth,n=>{o.depth=n;},{min:.1,max:2});}
  if(o.kind==='flesh')number('Share weight',o.weight??1,n=>{o.weight=n;},{min:.01,max:100,step:.25});
  if(o.kind==='pressure-gate'){
    number('Width',o.width,n=>{o.width=n;},{min:.2,max:2});
    number('Clear opening',o.opening,n=>{o.opening=n;},{min:.2,max:2});
    number('Needed particles',o.threshold,n=>{o.threshold=Math.round(n);},{min:1,max:297,step:1});}
  if(o.kind==='grip'){
    rect(o.platform);number('Platform top',o.platform.maxY,n=>{o.platform.maxY=n;o.climbHeight=n-(o.ramp.axis==='x'?Math.max(o.ramp.minHeight,o.ramp.maxHeight):Math.max(o.ramp.northHeight,o.ramp.southHeight));
      alignAttachedBasinHeight(draft,o.id,n);},{min:.3,max:8});
    number('Ramp rise',o.ramp.axis==='x'?Math.abs(o.ramp.maxHeight-o.ramp.minHeight):Math.abs(o.ramp.southHeight-o.ramp.northHeight),n=>{
      if(o.ramp.axis==='x')o.ramp.maxHeight=o.ramp.minHeight+n;else o.ramp.southHeight=o.ramp.northHeight+n;},{min:.1,max:2});}
  if(o.kind==='paint'){
    choice('Surface',o.surface,['slippery','sticky'],n=>{o.surface=n;});
    const owner=draft.objects.find(item=>item.id===o.targetId);
    const bounds=owner?.kind==='block'||['legacy-roof','legacy-passage','lowgap'].includes(owner?.kind)?owner:
      owner?.kind==='grip'?owner.platform:owner?.kind==='pillar'?{minX:owner.x-owner.radius,maxX:owner.x+owner.radius,minZ:owner.z-owner.radius,maxZ:owner.z+owner.radius}:
      owner?.kind==='stairs'?{minX:owner.x-(owner.axis==='x'?owner.run:owner.width)/2,
        maxX:owner.x+(owner.axis==='x'?owner.run:owner.width)/2,
        minZ:owner.z-(owner.axis==='z'?owner.run:owner.width)/2,
        maxZ:owner.z+(owner.axis==='z'?owner.run:owner.width)/2}:draft.boundary;
    const resize=(axis,n)=>{const lo=`min${axis}`,hi=`max${axis}`,center=(o[lo]+o[hi])/2;
      o[lo]=Math.max(bounds[lo],center-n/2);o[hi]=Math.min(bounds[hi],center+n/2);};
    if(o.face==='floor'){
      number('Patch width',o.maxX-o.minX,n=>resize('X',n),{min:.12,max:bounds.maxX-bounds.minX});
      number('Patch depth',o.maxZ-o.minZ,n=>resize('Z',n),{min:.12,max:bounds.maxZ-bounds.minZ});
      if(!owner)number('Terrain height',o.base??0,n=>{o.base=n;},{min:0,max:8});
    }else{
      const axis=['east','west'].includes(o.face)?'Z':'X';
      number('Wall patch width',o[`max${axis}`]-o[`min${axis}`],n=>resize(axis,n),
        {min:.12,max:bounds[`max${axis}`]-bounds[`min${axis}`]});
      const top=owner?.maxY??owner?.top??owner?.platform?.maxY??8,bottom=owner?.minY??owner?.bottom??owner?.platform?.minY??0;
      number('Wall patch height',(o.maxY??top)-(o.minY??bottom),n=>{
        const center=((o.minY??bottom)+(o.maxY??top))/2;o.minY=Math.max(bottom,center-n/2);o.maxY=Math.min(top,center+n/2);
      },{min:.12,max:top-bottom});
    }}
  if(o.kind==='cutter'){
    number('Center Y',o.y,n=>{o.y=n;},{min:-8,max:20});
    choice('Shape',o.shape,['box','cylinder'],n=>{o.shape=n;
      if(n==='box'){o.width??=1.4;o.depth??=1.4;}else o.radius??=.45;});
    if(o.shape==='box'){
      number('Width',o.width,n=>{o.width=n;},{min:.1,max:20});
      number('Depth',o.depth,n=>{o.depth=n;},{min:.1,max:20});
    }else number('Radius',o.radius,n=>{o.radius=n;},{min:.05,max:10});
    number('Height',o.height,n=>{o.height=n;},{min:.1,max:20});
    for(const axis of ['x','y','z'])number(`Rotate ${axis.toUpperCase()}°`,o.rotation[axis],n=>{o.rotation[axis]=n;},
      {step:1,min:-360,max:360});
  }
  const duplicate=document.createElement('button');duplicate.textContent='Duplicate';duplicate.onclick=()=>{const added=duplicateDraftObject(draft,o.id);
    if(!added){status('There is no room on the board to duplicate this piece with its basin.');return;}
    selected=added.id;commit('Object duplicated.');};
  const rotate=document.createElement('button');rotate.textContent='Rotate 90°';rotate.onclick=rotateSelection;
  const remove=document.createElement('button');remove.textContent='Delete';remove.onclick=()=>erase(o.id);
  panel.append(duplicate,rotate,remove);
}
function renderEditor(){updateLinkedStatus();const errors=validateDraft(draft).errors;
  $('preset').value=String(draft.presetId||0);$('name').value=draft.name;$('total').value=draft.totalFlesh;
  $('seed').value=draft.startingFlesh;
  $('undo').disabled=history.index===0;$('redo').disabled=history.index===history.states.length-1;
  $('clear-all').disabled=playing||draft.objects.length===0;
  const poolBudget=draft.totalFlesh-draft.startingFlesh,poolCount=draft.objects.filter(o=>o.kind==='flesh').length;
  $('play').disabled=errors.length>0;$('budget').textContent=`${draft.startingFlesh} starting · ${poolBudget} ${poolCount?'assigned to pools':'pool budget (add flesh pools)'}`;
  $('validation').replaceChildren();for(const text of errors){const li=document.createElement('li');li.className='error';li.textContent=text;$('validation').append(li);}
  if(!errors.length){const li=document.createElement('li');li.className='good';li.textContent='Ready for a physical play test.';$('validation').append(li);}
  renderTools();renderInspector();renderHandles();}
$('load-preset').onclick=()=>{const id=Number($('preset').value);draft=id?draftFromPreset(id):createBlankDraft();linkedLevelId=null;linkedDocument=null;
  selected=null;tool='select';commit('Garden loaded. Undo restores the previous draft.');};
$('name').onchange=()=>{draft.name=$('name').value;commit();};
$('total').onchange=()=>{draft.totalFlesh=Number($('total').value);commit();};
$('seed').onchange=()=>{draft.startingFlesh=Number($('seed').value);commit();};

$('undo').onclick=()=>{draft=history.undo();selected=null;renderEditor();pendingPreview=true;persist();status('Undid the last edit.');};
$('redo').onclick=()=>{draft=history.redo();selected=null;renderEditor();pendingPreview=true;persist();status('Redid the edit.');};
$('clear-all').onclick=()=>{if(playing||!draft.objects.length)return;
  clearDraftObjects(draft);selected=null;activePaintFace=null;brushStart=null;drag=null;ghost.visible=false;
  $('paint-apply').disabled=true;$('paint-selection').textContent='Selected face: none';
  commit('All objects cleared. Add a start and exit before play testing.');};
$('save').onclick=()=>status(memory?'Temporary session · export to keep this draft.':
  persist()?'Draft saved locally.':'Local save unavailable; export a file instead.');
$('save-level').onclick=()=>{if(memory){status('Temporary session · export JSON to keep this level.');return;}
  try{const entry=localLibrary.save(exportDraft(draft),{id:linkedLevelId});linkedLevelId=entry.id;
    linkedDocument=entry.document;updateLinkedStatus();status(`Saved “${entry.name}” to Local Levels.`);}
  catch(error){status(`Could not save local level: ${error.message}`);}};
$('save-level-new').onclick=()=>{if(memory){status('Temporary session · export JSON to keep this level.');return;}
  try{const entry=localLibrary.save(exportDraft(draft),{asNew:true});linkedLevelId=entry.id;
    linkedDocument=entry.document;updateLinkedStatus();status(`Saved a new local level “${entry.name}”.`);}
  catch(error){status(`Could not save local level: ${error.message}`);}};
$('export').onclick=()=>{const blob=new Blob([exportDraft(draft)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=(draft.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'garden')+'.puddle.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Draft exported.');};
$('import').onclick=()=>{$('file').value='';$('file').click();};
$('file').onchange=async()=>{const file=$('file').files[0];if(!file)return;try{if(file.size>250000)throw new Error('Level file is too large.');
  const imported=importDraft(await file.text());draft=imported;linkedLevelId=null;linkedDocument=null;
  selected=null;tool='select';commit('Imported '+draft.name+'.');}
  catch(e){status('Import failed: '+e.message);}};
function clearInput(){keys.clear();joystick.cancel();contractHold.clear();shedHold.clear();runHold.clear();pull.cancel();recall=false;}
function togglePlay(){clearInput();if(!playing){const result=validateDraft(draft);if(result.errors.length)return status(result.errors[0]);
    prePlayDistance=orbit.distance;playing=true;rebuild(true);music.begin();audio.unlock();}
  else{playing=false;if(prePlayDistance!==null)orbit.distance=prePlayDistance;prePlayDistance=null;rebuild(false);}
  document.body.classList.toggle('playing',playing);$('play').textContent=playing?'■ Back to edit':'▶ Play test';
  $('restart').hidden=!playing;$('play-hud').hidden=!playing;$('touch').hidden=!playing;$('back-to-edit').hidden=!playing;
  $('play-settings').hidden=!playing;
  if(playing)$('play-settings-audio').append(editorMusicPanel);else document.querySelector('.stage-panel').append(editorMusicPanel);
  $('edit-panel').inert=playing;document.querySelector('.inspector').inert=playing;
  $('view-title').textContent=playing?'Play test · '+draft.name:'3D garden easel';
  for(const id of ['preset','load-preset','undo','redo','save','save-level','save-level-new','export','import'])$(id).disabled=playing||
    memory&&['save','save-level','save-level-new'].includes(id);
  $('undo').disabled=playing||history.index===0;
  $('redo').disabled=playing||history.index===history.states.length-1;
  $('play-help').textContent=playing?'WASD / arrows move · hold Space gathers · tap Space recalls · E casts · F sheds flesh · Shift runs · Escape returns.':'Right-drag or Alt-drag orbits; wheel zooms. Select, move, and paint directly in 3D.';
  status(playing?'Play test started. Return to edit whenever you like.':'Returned to your exact draft.');last=performance.now();acc=0;requestAnimationFrame(resize);}
$('play').onclick=togglePlay;$('restart').onclick=()=>{if(playing){clearInput();rebuild(true);status('Test restarted.');last=performance.now();acc=0;}};
$('play-settings-restart').onclick=()=>{$('restart').click();$('play-settings').open=false;};
$('back-to-edit').onclick=()=>{if(playing)togglePlay();};
function aimAt(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);const hit=view&&raycaster.intersectObjects(view.group.children,true).find(h=>h.object.userData.pickableTerrain);
  if(hit)aim={x:hit.point.x,z:hit.point.z};return !!hit;}
function cast(){if(!playing||!sim?.gardenLevel.tendrils||sim.garden.phase!=='playing'||!sim.gardenInputArmed)return;
  if(!aim){const target=sim.gardenLevel.pools.map(([x,z],i)=>({x,z,i})).filter(p=>sim.fluid.particles.some(q=>q.feedstock&&q.patchId===p.i))
    .sort((a,b)=>Math.hypot(a.x-sim.brain.x,a.z-sim.brain.z)-Math.hypot(b.x-sim.brain.x,b.z-sim.brain.z))[0];
    aim=target||{x:sim.brain.x+1.5,z:sim.brain.z};}
  if(aim){const ok=sim.castTendril(aim);status(ok?'Tendril cast. Tap Space to recall.':sim.tendril.feedback||'Cast at loose flesh on a clear path.');}}
function editingInput(e){return e.target.matches('input,select,textarea');}
window.addEventListener('keydown',e=>{if(editingInput(e))return;
  if(!playing){if((e.ctrlKey||e.metaKey)&&e.code==='KeyZ'){e.preventDefault();(e.shiftKey?$('redo'):$('undo')).click();}
    else if(e.code==='Delete'||e.code==='Backspace'){e.preventDefault();erase();}
    else if(e.code==='KeyR'){e.preventDefault();rotateSelection();}
    else if(e.code==='Escape'){selected=null;renderEditor();}return;}
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(e.code==='Escape'){togglePlay();return;}if(e.repeat)return;keys.add(e.code);
  if(e.code==='Space'&&sim.garden.phase==='playing')pull.down('keyboard',performance.now());
  if(e.code==='KeyE')cast();});
window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space')pull.up('keyboard',performance.now());});
window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{clearInput();acc=0;last=performance.now();});
const canTouchAct=()=>playing&&sim?.garden.phase==='playing'&&sim.gardenInputArmed;
const contractHold=bindPullButton($('contract'),pull,canTouchAct);
const shedHold=bindHoldButton($('shed'),canTouchAct);
const runHold=bindHoldButton($('run'),canTouchAct);
function updateHUD(){const s=sim.garden;$('score').textContent=matchMedia('(pointer: coarse), (max-width: 680px), (max-width: 1000px) and (max-height: 500px)').matches?
  `◇ ${s.gemCount}/${s.gems.length} · ● ${s.goldCount}/${s.gold.length}`:
  `${s.gemCount}/${s.gems.length} gems · ${s.goldCount}/${s.gold.length} gold · ${sim.fluid.attachedCount} attached flesh`;
  $('play-message').textContent=s.phase==='complete'?'Garden complete. Return to editing or restart.':gardenHint(sim).join(' · ')+(draft.tendrils?` · ${sim.tendril.count}/3 strands`:'');}
let last=performance.now(),acc=0;
function frame(now){const elapsed=clamp((now-last)/1000,0,.066);last=now;
  if(pendingPreview&&!playing){rebuild(false);pendingPreview=false;}
  if(playing&&sim&&!document.hidden){acc=Math.min(acc+elapsed,DT*4);
    const horizontal=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))+joystick.vector.x;
    const vertical=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'))-joystick.vector.y;
    const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);right.y=0;right.normalize();
    const forward=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);forward.y=0;forward.normalize();
    const axes=movementAxes('garden',horizontal,vertical,right,forward),contract=pull.update(now);
    while(acc>=DT){sim.step({...axes,contract,shed:keys.has('KeyF')||shedHold.active,push:keys.has('ShiftLeft')||keys.has('ShiftRight')||runHold.active,recallToggle:recall});recall=false;acc-=DT;}
    if(frameCount++%3===0)updateParticles();updateHUD();audio.update(sim.garden);}
  if(view&&sim)view.update(sim,camera);
  aimRing.visible=playing&&!!draft.tendrils&&!!aim&&sim.garden.phase==='playing';
  if(aimRing.visible)aimRing.position.set(aim.x,groundAt(aim.x,aim.z,sim.activeColliders()).height+.035,aim.z);
  for(const marker of handles.children)if(marker.userData.handleHalo)marker.quaternion.copy(camera.quaternion);
  renderer.render(scene,camera);requestAnimationFrame(frame);}
$('session-badge').hidden=!memory&&!testSession;
if(testSession)$('session-badge').textContent='Isolated test session · local levels stay separate from your saves';
if(memory){$('save').disabled=true;$('save').textContent='Save unavailable in test session';$('save').title='Export JSON to keep this draft.';}
renderEditor();rebuild(false);resize();status(startup);requestAnimationFrame(frame);
if(import.meta.hot)import.meta.hot.dispose(()=>{music();audio.dispose();view?.dispose();printLibrary.dispose();pipeline.dispose();
  handleGeo.dispose();haloGeo.dispose();haloMaterial.dispose();for(const m of markerMaterials.values())m.dispose();outlineMaterial.dispose();bodyMaterial.dispose();poolMaterial.dispose();renderer.dispose();});
