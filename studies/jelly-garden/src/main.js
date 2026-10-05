import * as THREE from 'three';
import { SoftShell, SmoothSkin, FIXED_DT } from './physics.js';
import { BounceMotion, interpolateBuffer } from './motion.js';
import './style.css';

const host=document.querySelector('#scene');
let renderer;
try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
catch { document.querySelector('#fallback').hidden=false; throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.48;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
host.append(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-6,6,5,-5,.1,100);
camera.position.set(0,7.4,14);camera.lookAt(0,.45,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xecc7b4,3));
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,10,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9});key.shadow.bias=-.00025;scene.add(key);
const fill=new THREE.DirectionalLight(0xe6f5ff,.65);fill.position.set(4,4,-5);scene.add(fill);
const mat=(color,roughness=.55)=>new THREE.MeshStandardMaterial({color,roughness});
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
const dark=mat(0x4d4146,.3),highlight=mat(0xffffff,.15);
class Creature{
 constructor(name,color,x,z,radius,onPad=false){
  this.name=name;this.radius=radius;this.onPad=onPad;this.restCenter=new THREE.Vector3(x,radius+(onPad?.23:.08),z);this.root=new THREE.Group();this.root.position.copy(this.restCenter);this.root.position.y+=.46;scene.add(this.root);
  this.motion=new BounceMotion(this.root.position.y);this.previousY=this.motion.y;
  this.shell=new SoftShell(radius);this.previousCage=Float32Array.from(this.shell.positions);this.renderCage=Float32Array.from(this.shell.positions);
  this.cageGeometry=this.shell.geometry.clone();this.skin=new SmoothSkin(this.shell);this.mesh=add(this.skin.geometry,new THREE.MeshPhysicalMaterial({color,roughness:.29,clearcoat:.85,clearcoatRoughness:.12}),this.root);this.mesh.castShadow=true;this.mesh.receiveShadow=false;this.mesh.userData.creature=this;
  this.wire=add(this.cageGeometry,new THREE.MeshBasicMaterial({color:0x594a61,wireframe:true,transparent:true,opacity:.27,depthWrite:false}),this.root);this.wire.visible=false;
  this.landmarks=[];
  const feature=(object,x,y,protrude)=>{const z=Math.sqrt(Math.max(.1,radius*radius-x*x-y*y)),base=new THREE.Vector3(x,y,z),near=[];for(let i=0;i<this.shell.rest.length;i+=3){const d=(this.shell.rest[i]-x)**2+(this.shell.rest[i+1]-y)**2+(this.shell.rest[i+2]-z)**2;near.push([d,i])}near.sort((a,b)=>a[0]-b[0]);const anchors=near.slice(0,5).map(([d,i])=>({i,w:1/(d+.01)})),total=anchors.reduce((s,a)=>s+a.w,0);anchors.forEach(a=>a.w/=total);object.position.set(x,y,z+protrude);this.root.add(object);this.landmarks.push({object,base,protrude,anchors})};
  for(const x of [-.255,.255]){const eye=add(sphere(radius*.082,18,12),dark,new THREE.Group());eye.scale.set(.82,1.25,.56);feature(eye,x*radius,.105*radius,.13*radius);const glint=add(sphere(radius*.022,10,8),highlight,new THREE.Group());feature(glint,(x-.027)*radius,.14*radius,.19*radius);const cheek=add(sphere(radius*.115,16,10),mat(0xec909a),new THREE.Group());cheek.scale.set(1,.45,.35);feature(cheek,x*1.7*radius,-.12*radius,.08*radius)}
  const smile=add(new THREE.TorusGeometry(radius*.062,radius*.018,8,22,Math.PI),dark,new THREE.Group());smile.rotation.z=Math.PI;feature(smile,0,-.165*radius,.15*radius);
  const tuft=add(sphere(radius*.16),mat(name==='Peachy'?0xf48672:name==='Minty'?0x6fc8ae:0xa68bd8),new THREE.Group());tuft.scale.set(.42,1.3,.52);tuft.rotation.z=-.45;feature(tuft,-.08*radius,.93*radius,.02*radius);this.updateRender(1);
 }
 updateRender(alpha){
  interpolateBuffer(this.renderCage,this.previousCage,this.shell.positions,alpha);
  this.root.position.y=this.previousY+(this.motion.y-this.previousY)*alpha;
  this.cageGeometry.attributes.position.array.set(this.renderCage);
  this.cageGeometry.attributes.position.needsUpdate=true;
  this.cageGeometry.computeBoundingSphere();
  this.skin.update(this.renderCage);
  for(const {object,base,protrude,anchors} of this.landmarks){const p=base.clone();p.z+=protrude;for(const {i,w} of anchors){p.x+=(this.renderCage[i]-this.shell.rest[i])*w;p.y+=(this.renderCage[i+1]-this.shell.rest[i+1])*w;p.z+=(this.renderCage[i+2]-this.shell.rest[i+2])*w}object.position.copy(p)}
 }
 reset(){this.shell.reset();this.motion.reset(this.restCenter.y+.46);this.previousY=this.motion.y;this.previousCage.set(this.shell.positions);this.root.position.copy(this.restCenter);this.root.position.y=this.motion.y;this.updateRender(1)}
}
const creatures=[new Creature('Peachy',palette.peach,0,.65,1.11,true),new Creature('Minty',palette.mint,-2.45,-.25,.82),new Creature('Lulu',palette.lilac,2.42,-.25,.9)];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ripples=[];function bloom(x,z,color=0xffffff){if(reducedMotion)return;const mesh=add(new THREE.TorusGeometry(.28,.023,6,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.62,depthWrite:false}));mesh.rotation.x=Math.PI/2;mesh.position.set(x,.13,z);ripples.push({mesh,age:0})}
const controls={softness:document.querySelector('#softness'),damping:document.querySelector('#damping'),gravity:document.querySelector('#gravity'),wireframe:document.querySelector('#wireframe')};
for(const key of ['softness','damping','gravity'])controls[key].addEventListener('input',()=>{document.querySelector(`#${key}-value`).value=`${controls[key].value}%`});
controls.wireframe.addEventListener('change',()=>creatures.forEach(c=>c.wire.visible=controls.wireframe.checked));
let selected=creatures[0],paused=false,activePointer=null,activeCreature=null,grabOrigin=null,stretch=0;
const nameDisplay=document.querySelector('#selected-name'),motionDisplay=document.querySelector('#motion-readout');
function select(c){selected=c;nameDisplay.textContent=c.name;document.querySelector('.dot').style.background=`#${c.mesh.material.color.getHexString()}`}
function poke(c,showRipple=true){if(paused)return;c.motion.kick(.058);c.shell.squashVelocity=Math.max(c.shell.squashVelocity,.55);if(showRipple)bloom(c.root.position.x,c.root.position.z,c.mesh.material.color);motionDisplay.textContent='boing!'}
host.addEventListener('keydown',e=>{if(['1','2','3'].includes(e.key)){select(creatures[Number(e.key)-1]);e.preventDefault()}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=creatures.indexOf(selected)+(e.key==='ArrowRight'?1:-1);select(creatures[(n+creatures.length)%creatures.length]);e.preventDefault()}else if(e.key===' '||e.key==='Enter'){poke(selected);e.preventDefault()}});
document.querySelector('#pause').addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'Resume':'Pause';e.currentTarget.setAttribute('aria-pressed',String(paused))});
document.querySelector('#reset').addEventListener('click',()=>{for(const c of creatures)c.reset();for(const r of ripples){scene.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose()}ripples.length=0;padOffset=padVelocity=previousPadOffset=stretch=0;padTop.position.y=.15;padRing.position.y=.255;if(activeCreature)activeCreature.shell.endGrab();if(activePointer!==null&&renderer.domElement.hasPointerCapture(activePointer))renderer.domElement.releasePointerCapture(activePointer);activePointer=null;activeCreature=null;grabOrigin=null;renderer.domElement.style.cursor='default';accumulator=0;impactCooldown=0;select(creatures[0]);motionDisplay.textContent='at rest'});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),dragPlane=new THREE.Plane(),hit=new THREE.Vector3();
function setPointer(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height*2-1));ray.setFromCamera(pointer,camera)}
function simulationLocal(c,worldPoint){const local=c.root.worldToLocal(worldPoint.clone());local.y+=c.root.position.y-c.motion.y;return local}
function release(e){if(activePointer!==e.pointerId)return;if(activeCreature){const c=activeCreature;if(e.type==='pointerup'){const world=c.root.localToWorld(c.shell.grabTarget.clone());bloom(world.x,world.z,c.mesh.material.color);if(stretch<.08)poke(c,false)}c.shell.endGrab()}activePointer=null;activeCreature=null;grabOrigin=null;renderer.domElement.style.cursor='default';if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId)}
renderer.domElement.addEventListener('pointerdown',e=>{if(paused||activePointer!==null)return;setPointer(e);const found=ray.intersectObjects(creatures.map(c=>c.mesh))[0];if(!found)return;const c=found.object.userData.creature;select(c);activeCreature=c;activePointer=e.pointerId;stretch=0;host.focus({preventScroll:true});renderer.domElement.setPointerCapture(e.pointerId);const local=simulationLocal(c,found.point);c.shell.beginGrab(local);grabOrigin=local.clone();dragPlane.setFromNormalAndCoplanarPoint(camera.position.clone().sub(found.point).normalize(),found.point);renderer.domElement.style.cursor='grabbing';e.preventDefault()});
renderer.domElement.addEventListener('pointermove',e=>{setPointer(e);if(activePointer===e.pointerId&&activeCreature){if(ray.ray.intersectPlane(dragPlane,hit)){const c=activeCreature,local=simulationLocal(c,hit),delta=local.clone().sub(grabOrigin);if(delta.length()>c.radius*1.55)delta.setLength(c.radius*1.55);c.shell.updateGrab(grabOrigin.clone().add(delta));stretch=delta.length()/c.radius;motionDisplay.textContent=`${Math.round(stretch*100)}% stretch`}}else renderer.domElement.style.cursor=ray.intersectObjects(creatures.map(c=>c.mesh)).length?'grab':'default'});
renderer.domElement.addEventListener('pointerup',release);renderer.domElement.addEventListener('pointercancel',release);renderer.domElement.addEventListener('lostpointercapture',e=>{if(activePointer===e.pointerId){activePointer=null;if(activeCreature)activeCreature.shell.endGrab();activeCreature=null}});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);const aspect=w/h,width=aspect<.8?10.4:aspect<1.25?11.2:12.2;camera.left=-width/2;camera.right=width/2;camera.top=width/(2*aspect);camera.bottom=-camera.top;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
let last=performance.now(),accumulator=0,readoutTime=0,impactCooldown=0;
const physicsSettings=()=>({softness:Number(controls.softness.value)/100,damping:Number(controls.damping.value)/100,gravity:Number(controls.gravity.value)/100});
function surfaceFor(c,x,z){return c.onPad&&Math.hypot(x,z)<1.16?.24+padOffset:.09}
function supportHeight(c){
  const p=c.shell.positions;let needed=-Infinity;
  for(let i=0;i<p.length;i+=3)needed=Math.max(needed,surfaceFor(c,p[i],p[i+2])-p[i+1]);
  return needed;
}
function advanceCreature(c,settings){
  const impact=c.motion.beforeShape(supportHeight(c),settings.gravity,settings.damping);
  if(impact>.006){
    c.shell.impact(impact);
    if(c.onPad&&impact>.015){
      padVelocity-=impact*.38;
      padOffset=Math.max(-.1,Math.min(.015,padOffset+padVelocity*.35));
      if(impactCooldown<=0){bloom(c.restCenter.x,c.restCenter.z,c.mesh.material.color);impactCooldown=.35}
    }
  }
  const neighbors=creatures.filter(other=>other!==c).map(other=>({x:other.root.position.x-c.root.position.x,y:other.motion.y-c.motion.y,z:other.root.position.z-c.root.position.z,radius:other.radius*.82}));
  c.shell.step({...settings,centerY:c.motion.y,floorAt:(x,z)=>surfaceFor(c,x,z),collisions:neighbors});
  c.motion.afterShape(supportHeight(c),c.shell.squash,c.shell.squashVelocity,settings.damping);
}
function animate(now){
  requestAnimationFrame(animate);
  const elapsed=Math.min((now-last)/1000,.05);last=now;
  if(!paused){
    accumulator+=elapsed;
    while(accumulator>=FIXED_DT){
      const settings=physicsSettings();
      previousPadOffset=padOffset;
      padVelocity+=(-padOffset)*.12;padVelocity*=.82;padOffset+=padVelocity;
      padOffset=Math.max(-.1,Math.min(.015,padOffset));
      for(const c of creatures){c.previousY=c.motion.y;c.previousCage.set(c.shell.positions)}
      for(const c of creatures)advanceCreature(c,settings);
      impactCooldown=Math.max(0,impactCooldown-FIXED_DT);accumulator-=FIXED_DT;
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
  for(const c of creatures)c.updateRender(alpha);
  const visualPad=previousPadOffset+(padOffset-previousPadOffset)*alpha;
  padTop.position.y=.15+visualPad;padRing.position.y=.255+visualPad;
  renderer.render(scene,camera);
}
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
