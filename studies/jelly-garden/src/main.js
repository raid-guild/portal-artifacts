import * as THREE from 'three';
import { SoftShell, SmoothSkin, FIXED_DT } from './physics.js';
import { BounceMotion, interpolateBuffer, worldGravity } from './motion.js';
import { buildLogoGeometry } from './logo-geometry.js';
import { LogoField, restAnchorFromHit } from './logo-physics.js';
import { jellyMaterial } from './jelly-material.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { KeepUppy, formatTime } from './keep-uppy.js';
import './style.css';

const host=document.querySelector('#scene');
let renderer;
try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
catch { document.querySelector('#fallback').hidden=false; throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.35;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
host.append(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xfbf5eb);
const pmrem=new THREE.PMREMGenerator(renderer),softboxRoom=new THREE.Scene();
softboxRoom.background=new THREE.Color(0x504952);
for(const [x,y,z,w,h,color] of [[-3,3,5,3.2,3.8,0xffffff],[4,1,3,2.7,2.4,0xe4f4ff],[0,4,-3,2.3,2.7,0xffe4ce]]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(4),side:THREE.DoubleSide}));
  panel.position.set(x,y,z);panel.lookAt(0,0,0);softboxRoom.add(panel);
}
scene.environment=pmrem.fromScene(softboxRoom,.025).texture;
softboxRoom.traverse(object=>{object.geometry?.dispose();object.material?.dispose()});pmrem.dispose();
const camera=new THREE.OrthographicCamera(-6,6,5,-5,.1,100);
const viewTarget=new THREE.Vector3(0,.45,0);
camera.position.set(0,7.4,14);camera.lookAt(viewTarget);
let orbit=null;
function rebuildOrbit(target=viewTarget){
  orbit?.dispose();
  orbit=new OrbitControls(camera,renderer.domElement);
  orbit.target.copy(target);
  orbit.enableDamping=true;orbit.dampingFactor=.085;orbit.enablePan=false;
  orbit.minPolarAngle=THREE.MathUtils.degToRad(15);orbit.maxPolarAngle=THREE.MathUtils.degToRad(85);
  orbit.minZoom=.75;orbit.maxZoom=1.6;
  orbit.mouseButtons={LEFT:THREE.MOUSE.ROTATE,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};
  orbit.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_ROTATE};
  orbit.update();
}
rebuildOrbit();
function resetView(){camera.position.set(0,7.4,14);camera.zoom=1;camera.updateProjectionMatrix();camera.lookAt(viewTarget);rebuildOrbit(viewTarget)}
function freezeOrbit(){rebuildOrbit(orbit.target.clone())}
scene.add(new THREE.HemisphereLight(0xffffff,0xecc7b4,1.9));
const key=new THREE.DirectionalLight(0xffffff,2.25);key.position.set(-3,10,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9});key.shadow.bias=-.00025;scene.add(key);
const fill=new THREE.DirectionalLight(0xe6f5ff,1.1);fill.position.set(4,4,-5);scene.add(fill);
const mat=(color,roughness=.55)=>new THREE.MeshStandardMaterial({color,roughness});
const faceMat=(color,roughness=.38)=>new THREE.MeshStandardMaterial({color,roughness,transparent:true,opacity:1,depthWrite:true});
const sphere=(r,w=20,h=12)=>new THREE.SphereGeometry(r,w,h);
const add=(geometry,material,parent=scene)=>{const m=new THREE.Mesh(geometry,material);parent.add(m);return m};
const palette={cream:0xf6d9af,grass:0xc9e0ae,rim:0xe5edce,leaf:0x78b583,peach:0xff927c,mint:0x81d5ba,lilac:0xc0a1ef};
const backdrop=add(new THREE.PlaneGeometry(200,200),mat(0xfbf5eb));backdrop.rotation.x=-Math.PI/2;backdrop.position.y=-.6;backdrop.receiveShadow=true;
const island=add(new THREE.CylinderGeometry(5,5.18,.48,96),mat(palette.cream));island.position.y=-.33;island.receiveShadow=true;
const lawn=add(new THREE.CylinderGeometry(4.76,4.85,.18,96),mat(palette.grass));lawn.position.y=-.025;lawn.receiveShadow=true;
const rim=add(new THREE.TorusGeometry(4.79,.055,10,96),mat(palette.rim));rim.rotation.x=Math.PI/2;rim.position.y=.07;
function flower(x,z,color,size=.13){const stem=add(new THREE.CylinderGeometry(.018,.028,.26,8),mat(palette.leaf));stem.position.set(x,.23,z);for(let i=0;i<5;i++){const p=add(sphere(size,12,8),mat(color)),a=i*Math.PI*2/5;p.position.set(x+Math.cos(a)*size*.84,.37,z+Math.sin(a)*size*.84);p.scale.set(.85,.48,.85)}const middle=add(sphere(size*.48,12,8),mat(0xffe199));middle.position.set(x,.385,z);const leaf=add(sphere(size*.76,10,8),mat(palette.leaf));leaf.position.set(x-.12,.16,z+.05);leaf.scale.set(1,.22,.5);leaf.rotation.y=-.4}
for(const [x,z,c,s] of [[-3.6,-1.1,0xff9eae,.13],[-2.8,1.8,0xffce8b,.12],[-1.1,-3.25,0xffa9b4,.12],[2.9,1.9,0xffd288,.14],[3.6,-1.35,0xd6b3f4,.12],[.6,-3.65,0xffa9b4,.1]])flower(x,z,c,s);
for(const [x,z,r] of [[-3.7,.8,.21],[3.5,.35,.19],[-.7,3.6,.17]]){const leaf=add(sphere(r),mat(0x9ac58e));leaf.position.set(x,.13,z);leaf.scale.set(1.4,.38,.75);leaf.rotation.y=.65}
const pad=new THREE.Group();pad.position.set(0,.08,.65);scene.add(pad);
const padBase=add(new THREE.CylinderGeometry(1.36,1.49,.14,64),mat(0xb6d3a4),pad);padBase.position.y=.015;padBase.receiveShadow=true;
const padTop=add(new THREE.CylinderGeometry(1.26,1.32,.2,64),mat(0xe2b7cd,.32),pad);padTop.position.y=.15;padTop.receiveShadow=true;
const padRing=add(new THREE.TorusGeometry(1.27,.062,12,64),mat(0xf5dbe6,.3),pad);padRing.rotation.x=Math.PI/2;padRing.position.y=.255;
let padOffset=0,padVelocity=0,previousPadOffset=0;
const dark=faceMat(0x4d4146,.3),highlight=faceMat(0xffffff,.15);
class Creature{
 constructor(name,color,x,z,radius,onPad=false){
  this.name=name;this.radius=radius;this.onPad=onPad;this.restCenter=new THREE.Vector3(x,radius+(onPad?.23:.08),z);this.root=new THREE.Group();this.root.position.copy(this.restCenter);this.root.position.y+=.46;scene.add(this.root);
  this.motion=new BounceMotion(this.root.position.y,radius);this.previousY=this.motion.y;
  this.shell=new SoftShell(radius);this.previousCage=Float32Array.from(this.shell.positions);this.renderCage=Float32Array.from(this.shell.positions);
  this.cageGeometry=this.shell.geometry.clone();this.skin=new SmoothSkin(this.shell);
  this.skinRest=Float32Array.from(this.skin.geometry.attributes.position.array);this.skinRestNormals=Float32Array.from(this.skin.geometry.attributes.normal.array);
  this.previousSkin=Float32Array.from(this.skinRest);this.currentSkin=Float32Array.from(this.skinRest);this.renderSkin=Float32Array.from(this.skinRest);
  this.mesh=add(this.skin.geometry,jellyMaterial(color),this.root);this.mesh.castShadow=true;this.mesh.receiveShadow=false;this.mesh.userData.creature=this;
  this.wire=add(this.cageGeometry,new THREE.MeshBasicMaterial({color:0x594a61,wireframe:true,transparent:true,opacity:.27,depthWrite:false}),this.root);this.wire.visible=false;
  this.landmarks=[];
  const feature=(object,x,y,protrude)=>{const z=Math.sqrt(Math.max(.1,radius*radius-x*x-y*y)),base=new THREE.Vector3(x,y,z),near=[];for(let i=0;i<this.shell.rest.length;i+=3){const d=(this.shell.rest[i]-x)**2+(this.shell.rest[i+1]-y)**2+(this.shell.rest[i+2]-z)**2;near.push([d,i])}near.sort((a,b)=>a[0]-b[0]);const anchors=near.slice(0,5).map(([d,i])=>({i,w:1/(d+.01)})),total=anchors.reduce((s,a)=>s+a.w,0);anchors.forEach(a=>a.w/=total);object.position.set(x,y,z+protrude);object.renderOrder=10;this.root.add(object);this.landmarks.push({object,base,protrude,anchors})};
  for(const x of [-.255,.255]){const eye=add(sphere(radius*.082,18,12),dark,new THREE.Group());eye.scale.set(.82,1.25,.56);feature(eye,x*radius,.105*radius,.13*radius);const glint=add(sphere(radius*.022,10,8),highlight,new THREE.Group());feature(glint,(x-.027)*radius,.14*radius,.19*radius);const cheek=add(sphere(radius*.115,16,10),faceMat(0xec909a),new THREE.Group());cheek.scale.set(1,.45,.35);feature(cheek,x*1.7*radius,-.12*radius,.08*radius)}
  const smile=add(new THREE.TorusGeometry(radius*.062,radius*.018,8,22,Math.PI),dark,new THREE.Group());smile.rotation.z=Math.PI;feature(smile,0,-.165*radius,.15*radius);
  const tuft=add(sphere(radius*.16),faceMat(name==='Peachy'?0xf48672:name==='Minty'?0x6fc8ae:0xa68bd8),new THREE.Group());tuft.scale.set(.42,1.3,.52);tuft.rotation.z=-.45;feature(tuft,-.08*radius,.93*radius,.02*radius);this.updateSkinPhysics();this.updateRender(1);
 }
 updateSkinPhysics(settings={softness:.65,damping:.38}){
  this.skin.update(this.shell.unwaved,false);
  const position=this.skin.geometry.attributes.position.array;
  this.shell.waves.applyTo(position,this.skinRest,this.skinRestNormals,settings.softness,settings.damping);
  this.currentSkin.set(position);
 }
 updateRender(alpha){
  interpolateBuffer(this.renderCage,this.previousCage,this.shell.positions,alpha);
  this.root.position.y=this.previousY+(this.motion.y-this.previousY)*alpha;
  this.cageGeometry.attributes.position.array.set(this.renderCage);
  this.cageGeometry.attributes.position.needsUpdate=true;
  this.cageGeometry.computeBoundingSphere();
  interpolateBuffer(this.renderSkin,this.previousSkin,this.currentSkin,alpha);
  this.skin.geometry.attributes.position.array.set(this.renderSkin);
  this.skin.geometry.attributes.position.needsUpdate=true;
  this.skin.geometry.computeVertexNormals();this.skin.geometry.computeBoundingSphere();
  for(const {object,base,protrude,anchors} of this.landmarks){const p=base.clone();p.z+=protrude;for(const {i,w} of anchors){p.x+=(this.renderCage[i]-this.shell.rest[i])*w;p.y+=(this.renderCage[i+1]-this.shell.rest[i+1])*w;p.z+=(this.renderCage[i+2]-this.shell.rest[i+2])*w}object.position.copy(p)}
 }
 reset(){this.shell.reset();this.motion.reset(this.restCenter.y+.46);this.previousY=this.motion.y;this.previousCage.set(this.shell.positions);this.updateSkinPhysics();this.previousSkin.set(this.currentSkin);this.root.position.copy(this.restCenter);this.root.position.y=this.motion.y;this.updateRender(1)}
}
class LogoCreature{
 constructor(geometry){
  this.name='RaidGuild';this.radius=1.34;this.onPad=true;
  this.restCenter=new THREE.Vector3(0,1.95,.65);
  this.root=new THREE.Group();this.root.position.copy(this.restCenter);scene.add(this.root);
  this.motion=new BounceMotion(this.restCenter.y,-geometry.boundingBox.min.y);this.previousY=this.motion.y;
  this.shell=new LogoField(geometry);this.previousCage=Float32Array.from(this.shell.positions);this.renderCage=Float32Array.from(this.shell.positions);
  this.renderGeometry=geometry.clone();
  this.mesh=add(this.renderGeometry,jellyMaterial(0xbd482d,{logo:true}),this.root);
  this.mesh.castShadow=true;this.mesh.receiveShadow=false;this.mesh.userData.creature=this;
  this.wire=add(this.renderGeometry,new THREE.MeshBasicMaterial({color:0x542519,wireframe:true,transparent:true,opacity:.21,depthWrite:false}),this.root);
  this.wire.visible=controls.wireframe.checked;
 }
 beginGrab(local,visualLocal,faceIndex){
  const anchor=restAnchorFromHit(this.shell.restGeometry,this.renderGeometry,faceIndex,visualLocal);
  return this.shell.beginGrab(anchor,local);
 }
 updateRender(alpha){
  interpolateBuffer(this.renderCage,this.previousCage,this.shell.positions,alpha);
  this.root.position.y=this.previousY+(this.motion.y-this.previousY)*alpha;
  const position=this.renderGeometry.attributes.position;
  let changed=false;
  for(let i=0;i<this.renderCage.length;i++)if(Math.abs(position.array[i]-this.renderCage[i])>1e-7){changed=true;break}
  if(changed){
    position.array.set(this.renderCage);position.needsUpdate=true;
    this.renderGeometry.computeVertexNormals();this.renderGeometry.computeBoundingSphere();
  }
 }
 reset(){this.shell.reset();this.motion.reset(this.restCenter.y);this.previousY=this.motion.y;this.previousCage.set(this.shell.positions);this.updateRender(1)}
}
const creatures=[new Creature('Peachy',palette.peach,0,.65,1.11,true),new Creature('Minty',palette.mint,-2.45,-.25,.82),new Creature('Lulu',palette.lilac,2.42,-.25,.9)];
let mode='raidguild',logoCreature=null;
let scoreStorage=null;try{scoreStorage=window.localStorage}catch{}
const keep=new KeepUppy(scoreStorage);
const keepStart=document.querySelector('#keep-start'),keepTime=document.querySelector('#keep-time'),keepClicks=document.querySelector('#keep-clicks'),keepBest=document.querySelector('#keep-best'),keepLast=document.querySelector('#keep-last'),keepStatus=document.querySelector('#keep-status');
function updateKeepUI(announcement=''){
  keepStart.disabled=mode==='raidguild'&&!logoCreature;
  keepStart.textContent=keep.phase==='ended'?'Play again':keep.phase==='armed'||keep.phase==='running'?'Restart round':'Start round';
  keepTime.textContent=formatTime(keep.time);keepClicks.textContent=String(keep.clicks);
  keepBest.textContent=keep.best[mode]?formatTime(keep.best[mode].time):'—';
  keepLast.textContent=keep.last?`Last ${formatTime(keep.last.time)} · ${keep.last.clicks} ${keep.last.clicks===1?'click':'clicks'}${keep.landed?` · ${activeBodies().find(c=>c.motion===keep.landed)?.name??'Jelly'} landed`:''}`:'';
  if(announcement)keepStatus.textContent=announcement;
}
for(const creature of creatures)creature.root.visible=false;
fetch(`${import.meta.env.BASE_URL}assets/raidguild-stamp.svg`).then(response=>{
  if(!response.ok)throw new Error(`RaidGuild mark: ${response.status}`);
  return response.text();
}).then(svg=>{
  logoCreature=new LogoCreature(buildLogoGeometry(svg));logoCreature.root.visible=mode==='raidguild';
  if(mode==='raidguild')select(logoCreature);
  updateKeepUI();
}).catch(error=>{console.error(error);document.querySelector('#fallback').hidden=false});
const activeBodies=()=>mode==='raidguild'?(logoCreature?[logoCreature]:[]):creatures;
function resetStage(){
  keep.cancel();
  cancelInteractions();
  stretch=0;lastDragDelta.set(0,0,0);waveCooldown=0;
  for(const creature of creatures)creature.reset();
  logoCreature?.reset();
  for(const ripple of ripples){scene.remove(ripple.mesh);ripple.mesh.geometry.dispose();ripple.mesh.material.dispose()}
  ripples.length=0;padOffset=padVelocity=previousPadOffset=0;padTop.position.y=.15;padRing.position.y=.255;
  accumulator=0;readoutTime=0;impactCooldown=0;
  motionDisplay.textContent='at rest';
  updateKeepUI();
}
function setMode(next){
  resetStage();
  mode=next;
  for(const creature of creatures)creature.root.visible=mode==='garden';
  if(logoCreature)logoCreature.root.visible=mode==='raidguild';
  document.querySelector('#raidguild-mode').setAttribute('aria-pressed',String(mode==='raidguild'));
  document.querySelector('#garden-mode').setAttribute('aria-pressed',String(mode==='garden'));
  document.querySelector('#intro-heading').innerHTML=mode==='raidguild'?'Make the mark<br/>a little <em>squishy.</em>':'Give the world<br/>a little <em>squish.</em>';
  document.querySelector('#intro-copy').textContent=mode==='raidguild'?'Grab the RaidGuild mark. Stretch it, bounce it, and watch it spring back.':'Grab a jelly friend. Stretch, bounce, and watch it find its shape again.';
  document.querySelector('#reset').textContent=mode==='raidguild'?'Reset mark':'Reset garden';
  document.querySelector('.model-note p').textContent=mode==='raidguild'
    ?'The official RaidGuild mark is a softly inflated SVG shape. Its spring carries weight while grounded, deeper impacts flatten it further, and signed ripples travel across its translucent surface. This is a tactile shape study, not a full fluid simulation.'
    :'Linked points form each jelly’s soft cage. Weight sags the body on contact, impacts deepen the squash, and a smooth translucent skin carries traveling crests and troughs. Contact is approximate, not a full fluid simulation.';
  host.setAttribute('aria-label',mode==='raidguild'?'Interactive 3D RaidGuild mark. Drag the mark to stretch it, drag the background to move the view, or press Space to bounce. Wheel or pinch to zoom.':'Interactive 3D jelly garden. Drag a creature to stretch it, drag the background to move the view, press 1, 2, or 3 to select, or press Space to bounce. Wheel or pinch to zoom.');
  if(mode==='garden')select(creatures[0]);
  else if(logoCreature)select(logoCreature);
  else nameDisplay.textContent='RaidGuild';
  resize();
  resetView();
  updateKeepUI();
}
document.querySelector('#raidguild-mode').addEventListener('click',()=>setMode('raidguild'));
document.querySelector('#garden-mode').addEventListener('click',()=>setMode('garden'));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ripples=[];function bloom(x,z,color=0xffffff){if(reducedMotion)return;const mesh=add(new THREE.TorusGeometry(.28,.023,6,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.62,depthWrite:false}));mesh.rotation.x=Math.PI/2;mesh.position.set(x,.13,z);ripples.push({mesh,age:0})}
const controls={softness:document.querySelector('#softness'),damping:document.querySelector('#damping'),gravity:document.querySelector('#gravity'),wireframe:document.querySelector('#wireframe')};
for(const key of ['softness','damping','gravity'])controls[key].addEventListener('input',()=>{document.querySelector(`#${key}-value`).value=`${controls[key].value}%`});
controls.wireframe.addEventListener('change',()=>{for(const c of creatures)c.wire.visible=controls.wireframe.checked;if(logoCreature)logoCreature.wire.visible=controls.wireframe.checked});
let moveView=false;
const moveViewButton=document.querySelector('#move-view');
moveViewButton.addEventListener('click',()=>{cancelInteractions();moveView=!moveView;moveViewButton.setAttribute('aria-pressed',String(moveView))});
document.querySelector('#reset-view').addEventListener('click',()=>{cancelInteractions();resetView()});
let selected=creatures[0],paused=false,activePointer=null,activeCreature=null,grabOrigin=null,stretch=0,waveCooldown=0;
const lastDragDelta=new THREE.Vector3();
const nameDisplay=document.querySelector('#selected-name'),motionDisplay=document.querySelector('#motion-readout');
function select(c){selected=c;nameDisplay.textContent=c.name;document.querySelector('.dot').style.background=`#${c.mesh.material.color.getHexString()}`}
function poke(c,showRipple=true){
  if(paused||!activeBodies().includes(c))return false;
  c.motion.kick(.058);c.shell.addWave(new THREE.Vector3(0,0,c===logoCreature ? .19 : c.radius),.7);
  if(showRipple)bloom(c.root.position.x,c.root.position.z,c.mesh.material.color);
  keep.bounce(c.motion);updateKeepUI();motionDisplay.textContent='boing!';return true;
}
host.addEventListener('keydown',e=>{if(['1','2','3'].includes(e.key)){if(mode!=='garden')setMode('garden');select(creatures[Number(e.key)-1]);e.preventDefault()}else if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&mode==='garden'){const n=creatures.indexOf(selected)+(e.key==='ArrowRight'?1:-1);select(creatures[(n+creatures.length)%creatures.length]);e.preventDefault()}else if((e.key===' '||e.key==='Enter')&&selected){if(!e.repeat)poke(selected);e.preventDefault()}});
document.querySelector('#pause').addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'Resume':'Pause';e.currentTarget.setAttribute('aria-pressed',String(paused));if(keep.phase==='armed'||keep.phase==='running')keepStatus.textContent=paused?'Round paused.':'Round resumed.'});
document.querySelector('#reset').addEventListener('click',()=>{resetStage();if(mode==='garden')select(creatures[0]);else if(logoCreature)select(logoCreature)});
keepStart.addEventListener('click',()=>{
  if(mode==='raidguild'&&!logoCreature)return;
  resetStage();
  if(paused){paused=false;const button=document.querySelector('#pause');button.textContent='Pause';button.setAttribute('aria-pressed','false')}
  const team=activeBodies();
  keep.start(mode,team.map(c=>c.motion));
  for(const c of team)c.motion.kick(.085);
  updateKeepUI('Round started. Keep every jelly in the air.');
  host.focus({preventScroll:true});
});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),dragPlane=new THREE.Plane(),hit=new THREE.Vector3();
const cameraPointers=new Set();
function setPointer(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height*2-1));ray.setFromCamera(pointer,camera)}
function simulationLocal(c,worldPoint){const local=c.root.worldToLocal(worldPoint.clone());local.y+=c.root.position.y-c.motion.y;return local}
function finishJelly(e,complete){
  if(activePointer!==e.pointerId)return;
  if(activeCreature){
    const c=activeCreature;
    c.shell.endGrab();
    if(complete){const world=c.root.localToWorld(c.shell.grabTarget.clone());bloom(world.x,world.z,c.mesh.material.color);if(stretch<.08)poke(c,false);else c.shell.addWave(grabOrigin,Math.min(1.5,stretch*1.6))}
  }
  activePointer=null;activeCreature=null;grabOrigin=null;lastDragDelta.set(0,0,0);
  renderer.domElement.style.cursor='grab';
  if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
}
function cancelInteractions(){
  if(activePointer!==null)finishJelly({pointerId:activePointer},false);
  for(const id of cameraPointers)if(renderer.domElement.hasPointerCapture(id))renderer.domElement.releasePointerCapture(id);
  cameraPointers.clear();freezeOrbit();
  renderer.domElement.style.cursor='grab';
}
renderer.domElement.addEventListener('pointerdown',e=>{
  // This capture router owns a sequence before OrbitControls' bubble listener.
  if(activePointer!==null){e.stopImmediatePropagation();return}
  if(cameraPointers.size||moveView||e.button!==0||paused){cameraPointers.add(e.pointerId);host.focus({preventScroll:true});renderer.domElement.style.cursor='grabbing';return}
  setPointer(e);
  const found=ray.intersectObjects(activeBodies().map(c=>c.mesh))[0];
  if(!found){cameraPointers.add(e.pointerId);host.focus({preventScroll:true});renderer.domElement.style.cursor='grabbing';return}
  const c=found.object.userData.creature,local=simulationLocal(c,found.point);
  if(c===logoCreature){const visualLocal=c.root.worldToLocal(found.point.clone());if(!c.beginGrab(local,visualLocal,found.faceIndex)){e.stopImmediatePropagation();return}}
  else c.shell.beginGrab(local);
  freezeOrbit();select(c);activeCreature=c;activePointer=e.pointerId;stretch=0;
  host.focus({preventScroll:true});renderer.domElement.setPointerCapture(e.pointerId);
  grabOrigin=local.clone();lastDragDelta.set(0,0,0);dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()),found.point);
  renderer.domElement.style.cursor='grabbing';e.preventDefault();e.stopImmediatePropagation();
},true);
renderer.domElement.addEventListener('pointermove',e=>{
  if(activePointer===e.pointerId&&activeCreature){
    setPointer(e);
    if(ray.ray.intersectPlane(dragPlane,hit)){
      const c=activeCreature,local=simulationLocal(c,hit),delta=local.clone().sub(grabOrigin);
      if(delta.length()>c.radius*1.55)delta.setLength(c.radius*1.55);
      c.shell.updateGrab(grabOrigin.clone().add(delta));
      if(delta.distanceTo(lastDragDelta)>c.radius*.08&&waveCooldown<=0){c.shell.addWave(grabOrigin,Math.min(1,delta.distanceTo(lastDragDelta)*2));lastDragDelta.copy(delta);waveCooldown=.09}
      stretch=c===logoCreature?(c.shell.active?.target.length()||0)/c.radius:delta.length()/c.radius;
      motionDisplay.textContent=`${Math.round(stretch*100)}% stretch`;
    }
    e.stopImmediatePropagation();return;
  }
  if(activePointer!==null){e.stopImmediatePropagation();return}
  if(cameraPointers.has(e.pointerId))return;
  setPointer(e);renderer.domElement.style.cursor=moveView||ray.intersectObjects(activeBodies().map(c=>c.mesh)).length?'grab':'move';
},true);
for(const type of ['pointerup','pointercancel'])renderer.domElement.addEventListener(type,e=>{
  if(activePointer===e.pointerId){finishJelly(e,type==='pointerup');e.stopImmediatePropagation();return}
  cameraPointers.delete(e.pointerId);renderer.domElement.style.cursor='grab';
},true);
renderer.domElement.addEventListener('lostpointercapture',e=>{
  if(activePointer===e.pointerId)finishJelly(e,false);
  cameraPointers.delete(e.pointerId);
},true);
renderer.domElement.addEventListener('wheel',e=>{if(activePointer!==null){e.preventDefault();e.stopImmediatePropagation()}},{capture:true,passive:false});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('blur',cancelInteractions);
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);const aspect=w/h,width=mode==='raidguild'?(aspect<.8?5.2:aspect<1.25?7.4:8.4):(aspect<.8?10.4:aspect<1.25?11.2:12.2);const verticalOffset=mode==='raidguild'?(aspect<.8?.65:.8):0;camera.left=-width/2;camera.right=width/2;camera.top=width/(2*aspect)+verticalOffset;camera.bottom=-width/(2*aspect)+verticalOffset;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
let last=performance.now(),accumulator=0,readoutTime=0,impactCooldown=0;
const physicsSettings=()=>({softness:Number(controls.softness.value)/100,damping:Number(controls.damping.value)/100,gravity:Number(controls.gravity.value)/100});
function surfaceFor(c,x,z){
  if(!c.onPad)return .09;
  // A smooth contact rim prevents either body from changing support height
  // abruptly as lateral squash carries a tip across the pad's boundary.
  const t=THREE.MathUtils.clamp((1.35-Math.hypot(x,z))/.35,0,1);
  return .09+(.15+padOffset)*t*t*(3-2*t);
}
function supportHeight(c){
  const p=c.shell.positions;let needed=-Infinity;
  for(let i=0;i<p.length;i+=3)needed=Math.max(needed,surfaceFor(c,p[i],p[i+2])-p[i+1]);
  if(c.currentSkin)for(let i=0;i<c.currentSkin.length;i+=3)needed=Math.max(needed,surfaceFor(c,c.currentSkin[i],c.currentSkin[i+2])-c.currentSkin[i+1]);
  return needed;
}
function advanceCreature(c,settings){
  const handleImpact=impact=>{
    c.shell.impact(impact);
    if(impact<=.003)return;
    let lowest=1,minY=Infinity;for(let i=1;i<c.shell.positions.length;i+=3)if(c.shell.positions[i]<minY){minY=c.shell.positions[i];lowest=i}
    c.shell.addWave(new THREE.Vector3(c.shell.rest[lowest-1],c.shell.rest[lowest],c.shell.rest[lowest+1]),Math.min(1.5,impact/.06));
    if(c.onPad){
      padVelocity-=impact/FIXED_DT*.12;
      if(impactCooldown<=0){bloom(c.restCenter.x,c.restCenter.z,c.mesh.material.color);impactCooldown=.35}
    }
  };
  const impact=c.motion.beforeShape(supportHeight(c),settings.gravity,settings.damping,c.shell.squash,c.shell.squashVelocity);
  if(impact>0)handleImpact(impact);
  const neighbors=mode==='garden'?creatures.filter(other=>other!==c).map(other=>({x:other.root.position.x-c.root.position.x,y:other.motion.comY-c.motion.y,z:other.root.position.z-c.root.position.z,radius:other.radius*.82})):[];
  c.shell.step({...settings,contactLoad:c.motion.grounded?worldGravity(settings.gravity):0,centerY:c.motion.y,floorAt:(x,z)=>surfaceFor(c,x,z),collisions:neighbors});
  c.updateSkinPhysics?.(settings);
  const lateImpact=c.motion.afterShape(supportHeight(c),c.shell.squash,c.shell.squashVelocity,settings.gravity);
  if(lateImpact>0)handleImpact(lateImpact);
}
function animate(now){
  requestAnimationFrame(animate);
  orbit.update();
  const elapsed=Math.min((now-last)/1000,.05);last=now;
  if(!paused){
    accumulator+=elapsed;
    while(accumulator>=FIXED_DT){
      const settings=physicsSettings();
      previousPadOffset=padOffset;
      const padLoad=activeBodies().filter(c=>c.onPad&&c.motion.grounded).length*worldGravity(settings.gravity)*.18;
      padVelocity+=(-65*padOffset-14*padVelocity-padLoad)*FIXED_DT;padOffset+=padVelocity*FIXED_DT;
      padOffset=Math.max(-.1,Math.min(.015,padOffset));
      for(const c of activeBodies()){c.previousY=c.motion.y;c.previousCage.set(c.shell.positions);if(c.currentSkin)c.previousSkin.set(c.currentSkin)}
      for(const c of activeBodies())advanceCreature(c,settings);
      const team=activeBodies();
      const loss=keep.tick(FIXED_DT,motion=>{const c=team.find(body=>body.motion===motion);return c?motion.y-supportHeight(c):0});
      if(loss){const name=team.find(c=>c.motion===loss.landed)?.name??'A jelly';updateKeepUI(`${name} landed. Round over: ${formatTime(loss.result.time)} with ${loss.result.clicks} ${loss.result.clicks===1?'click':'clicks'}.`)}
      else if(keep.phase==='running') {keepTime.textContent=formatTime(keep.time);keepClicks.textContent=String(keep.clicks)}
      impactCooldown=Math.max(0,impactCooldown-FIXED_DT);accumulator-=FIXED_DT;
      waveCooldown=Math.max(0,waveCooldown-FIXED_DT);
    }
    for(let i=ripples.length-1;i>=0;i--){
      const r=ripples[i];r.age+=elapsed;r.mesh.scale.setScalar(1+r.age*2.5);r.mesh.material.opacity=Math.max(0,.62-r.age*.75);
      if(r.age>.85){scene.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose();ripples.splice(i,1)}
    }
    readoutTime+=elapsed;
    if(activePointer===null&&readoutTime>.16){
      readoutTime=0;const shell=selected.shell;let energy=0;
      for(let i=0;i<shell.positions.length;i++)energy+=(shell.positions[i]-shell.previous[i])**2;
      const speed=Math.sqrt(energy/shell.positions.length);
      motionDisplay.textContent=speed>.002?`${Math.round(speed*1000)} motion`:'at rest';
    }
  }
  const alpha=accumulator/FIXED_DT;
  for(const c of activeBodies())c.updateRender(alpha);
  const visualPad=previousPadOffset+(padOffset-previousPadOffset)*alpha;
  padTop.position.y=.15+visualPad;padRing.position.y=.255+visualPad;
  renderer.render(scene,camera);
}
setMode('raidguild');
requestAnimationFrame(animate);
if(document.modelContext?.registerTool){
  const register=definition=>{
    try { Promise.resolve(document.modelContext.registerTool(definition)).catch(error=>console.warn('Optional model tool unavailable:',error)); }
    catch(error){ console.warn('Optional model tool unavailable:',error); }
  };
  register({name:'reset_jelly_garden',description:'Reset the creatures and effects in Jelly Garden.',inputSchema:{type:'object',properties:{},additionalProperties:false},execute:async(args={})=>{
    if(args===null||typeof args!=='object'||Array.isArray(args)||Object.keys(args).length)throw new Error('Expected an empty object');
    document.querySelector('#reset').click();return {content:[{type:'text',text:'Garden reset.'}]};
  }});
  register({name:'set_jelly_physics',description:'Set Jelly Garden softness, damping, or gravity from 0 to 100.',inputSchema:{type:'object',properties:{softness:{type:'number',minimum:0,maximum:100},damping:{type:'number',minimum:0,maximum:100},gravity:{type:'number',minimum:0,maximum:100}},additionalProperties:false},execute:async(args={})=>{
    if(args===null||typeof args!=='object'||Array.isArray(args))throw new Error('Expected an object');
    const keys=Object.keys(args);
    for(const key of keys)if(!['softness','damping','gravity'].includes(key)||!Number.isFinite(args[key])||args[key]<0||args[key]>100)throw new Error('Only softness, damping, and gravity from 0 to 100 are accepted');
    for(const key of keys){controls[key].value=String(args[key]);controls[key].dispatchEvent(new Event('input'));}
    return {content:[{type:'text',text:'Physics controls updated.'}]};
  }});
}
