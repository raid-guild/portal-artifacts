import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import './style.css';
import { createHarvester } from './harvester.js';
import { createSplashSystem } from './splashes.js';
import { bindAtmosphereControls, createAtmosphere, environmentUniforms, settings } from './atmosphere.js';
bindAtmosphereControls();

const canvas=document.querySelector('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=innerWidth<700;
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.75));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.fog=new THREE.Fog('#c29aa3',65,250);
const camera=new THREE.PerspectiveCamera(mobile?57:45,innerWidth/innerHeight,.1,700);
const home=new THREE.Vector3(), focus=new THREE.Vector3();
function fitHome(){const k=THREE.MathUtils.clamp(1.58/(innerWidth/innerHeight),1,1.8);home.set(5*(k-1),21+9*(k-1),49*k);focus.set(4*(k-1),7,-10);}
fitHome();
camera.position.copy(home);
const controls=new OrbitControls(camera,canvas);controls.target.copy(focus);controls.enableDamping=true;controls.dampingFactor=.055;controls.enablePan=false;controls.minDistance=29;controls.maxDistance=120;controls.minPolarAngle=.72;controls.maxPolarAngle=1.43;controls.minAzimuthAngle=-.65;controls.maxAzimuthAngle=.65;controls.rotateSpeed=.38;controls.zoomSpeed=.65;controls.update();
let seed=92;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const shared={time:{value:0},windTime:{value:0},gust:{value:0}};
const hemi=new THREE.HemisphereLight('#d9d9f0','#565074',1.65);scene.add(hemi);
const sunLight=new THREE.DirectionalLight('#ffd0a0',2.0);sunLight.position.set(-40,40,25);sunLight.castShadow=true;sunLight.shadow.mapSize.set(2048,2048);Object.assign(sunLight.shadow.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:170});sunLight.shadow.bias=-.0006;sunLight.shadow.normalBias=.09;scene.add(sunLight);
const sky=new THREE.Mesh(new THREE.SphereGeometry(450,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uDay:environmentUniforms.daylight,uLow:environmentUniforms.skyLow,uMid:environmentUniforms.skyMid,uHigh:environmentUniforms.skyHigh},vertexShader:`varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float uDay;uniform vec3 uLow,uMid,uHigh;varying vec3 vP;void main(){vec3 d=normalize(vP);float h=max(d.y,0.);vec3 low=uLow;vec3 mid=uMid;vec3 high=uHigh;vec3 c=mix(low,mid,smoothstep(0.,.17,h));c=mix(c,high,smoothstep(.055,.25,h));float s=pow(max(dot(d,normalize(vec3(-.7,.09,-1.))),0.),24.);c+=s*vec3(.12,.075,.02)*uDay;vec2 st=vec2(atan(d.z,d.x),asin(d.y))*260.;float star=fract(sin(dot(floor(st),vec2(127.1,311.7)))*43758.5453);float pin=(1.-smoothstep(.02,.17,length(fract(st)-.5)))*step(.995,star)*smoothstep(.02,.18,d.y);c+=pin*vec3(.8,.87,1.)*(1.-smoothstep(.24,.55,uDay));gl_FragColor=vec4(c,1.);}`}));scene.add(sky);
const sun=new THREE.Mesh(new THREE.CircleGeometry(5,64),new THREE.MeshBasicMaterial({color:'#ffe7af',fog:false}));sun.position.set(-67,10,-125);sun.lookAt(camera.position);scene.add(sun);
const glowMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;gl_FragColor=vec4(1.,.72,.4,pow(max(0.,1.-r),3.)*.22);}`});const sunHalo=new THREE.Mesh(new THREE.PlaneGeometry(36,36),glowMat);sunHalo.position.copy(sun.position).add(new THREE.Vector3(0,0,-1));sunHalo.lookAt(camera.position);scene.add(sunHalo);

// Broad, calm dunes; close to the lake the terrain settles below its waterline.
const groundGeo=new THREE.PlaneGeometry(600,600,150,150);groundGeo.rotateX(-Math.PI/2);
const pos=groundGeo.attributes.position;
for(let i=0;i<pos.count;i++){let x=pos.getX(i),z=pos.getZ(i),d=Math.hypot(x/16,z/12);let y=(Math.sin(x*.065+z*.04)*1.5+Math.sin(z*.105-x*.025)*1.1)*THREE.MathUtils.smoothstep(d,1.05,4)-.3;pos.setY(i,y);}groundGeo.computeVertexNormals();
const groundMat=new THREE.MeshToonMaterial({color:'#dc956e'});
groundMat.onBeforeCompile=s=>{s.uniforms.uGrit=environmentUniforms.grain;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vGround;').replace('#include <begin_vertex>','#include <begin_vertex>\nvGround=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vGround;uniform float uGrit;').replace('#include <color_fragment>',`#include <color_fragment>
float strata=sin(vGround.z*.53+sin(vGround.x*.075)*2.+sin(vGround.x*.3)*.3);float band=smoothstep(.7,.9,strata);diffuseColor.rgb*=1.-band*.08;float grit=fract(sin(dot(floor(vGround.xz*32.),vec2(12.9898,78.233)))*43758.5453);vec2 footprint=fwidth(vGround.xz*32.);float gritFade=1.-smoothstep(.25,1.,max(footprint.x,footprint.y));diffuseColor.rgb*=1.+(grit-.5)*uGrit*.2*gritFade;
float basin=length(vGround.xz/vec2(15.5,11.));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.24,.29,.28),.25*(1.-smoothstep(1.05,1.5,basin)));`);};
const ground=new THREE.Mesh(groundGeo,groundMat);ground.receiveShadow=true;scene.add(ground);

const waterGeo=new THREE.CircleGeometry(1,128);
const wp=waterGeo.attributes.position;
for(let i=1;i<wp.count;i++){let a=Math.atan2(wp.getY(i),wp.getX(i));let r=1+.035*Math.sin(a*5)+.018*Math.cos(a*9);wp.setXY(i,wp.getX(i)*12*r,wp.getY(i)*8*r);}
const rippleSlots=Array.from({length:10},()=>new THREE.Vector4(0,0,-100,0));
const waterShader={uniforms:{color:{value:new THREE.Color('#78e5d8')},tDiffuse:{value:null},textureMatrix:{value:new THREE.Matrix4()},uDay:environmentUniforms.daylight,uStrength:environmentUniforms.ripple,uTime:shared.time,uRipples:{value:rippleSlots}},vertexShader:`uniform mat4 textureMatrix;varying vec4 vUv;varying vec3 vWorld;void main(){vUv=textureMatrix*vec4(position,1.);vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform vec3 color;uniform float uTime,uDay,uStrength;uniform vec4 uRipples[10];varying vec4 vUv;varying vec3 vWorld;
void main(){vec2 p=vWorld.xz;float a=atan(-p.y/8.,p.x/12.);float edge=length(p/vec2(12.,8.))/(1.+.035*sin(a*5.)+.018*cos(a*9.));
float wave=sin(p.x*2.4+p.y*1.9+uTime*.65)*.45+sin(p.y*4.1-p.x*.7-uTime*.8)*.25;
float rip=0.;float cavity=0.;vec2 offset=vec2(sin(p.y*3.+uTime*.7),cos(p.x*2.-uTime*.4))*.0015;
for(int i=0;i<10;i++){float age=uTime-uRipples[i].z;float dist=distance(p,uRipples[i].xy);float ring=dist-age*2.8;float envelope=exp(-ring*ring*1.6)*exp(-age*.3)*step(0.,age)*uRipples[i].w;float v=sin(ring*12.)*envelope*uStrength;rip+=v;cavity+=exp(-dist*dist*.95)*exp(-pow((age-.36)*4.5,2.))*step(0.,age)*uStrength*uRipples[i].w;offset+=normalize(p-uRipples[i].xy+vec2(.001))*v*.009;}
vec2 uv=vUv.xy/vUv.w+offset;vec3 reflection=texture2D(tDiffuse,uv).rgb;
vec3 deep=vec3(.065,.45,.48);vec3 shallow=vec3(.39,.79,.73);vec3 c=mix(deep,shallow,smoothstep(.1,1.,edge));c=mix(c,reflection,.32);c=mix(c,vec3(.025,.25,.29),min(.65,cavity*.5));c+=wave*.012+rip*vec3(.26,.38,.32);c+=max(0.,rip)*vec3(.12,.2,.17);
float foam=smoothstep(.965,.987,edge+sin(a*41.+uTime)*.004);c=mix(c,vec3(.82,.98,.88),foam*.92);
float threads=pow(max(0.,sin(p.x*1.7+p.y*7.+wave*2.+uTime*.45)),28.);c+=threads*.035;
c*=.18+.82*uDay;gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`};
const water=new Reflector(waterGeo,{textureWidth:mobile?512:1024,textureHeight:mobile?512:1024,clipBias:.003,shader:waterShader});water.rotation.x=-Math.PI/2;water.position.y=.075;scene.add(water);
// Reflector clones its uniforms. Keep the shared clock and ripple buffer live.
water.material.uniforms.uDay=environmentUniforms.daylight;water.material.uniforms.uStrength=environmentUniforms.ripple;water.material.uniforms.uTime=shared.time;water.material.uniforms.uRipples.value=rippleSlots;

const ramp=new THREE.DataTexture(new Uint8Array([85,140,200,255]),4,1,THREE.RedFormat);ramp.needsUpdate=true;ramp.minFilter=THREE.NearestFilter;ramp.magFilter=THREE.NearestFilter;
const mats=new Map();
function stylize(root){
 const palette={'Sandstone • peach':'#cc805f','Sandstone • gold':'#f2a273','Sandstone • mauve':'#5c5b85','Palm • bark':'#424e59','Palm • blue spruce':'#2c505a','Palm • sage':'#49716b','Shrub • dusty sage':'#4b676b','Airship • ivory silk':'#ffd29e','Airship • bronze':'#64516a','Airship • windows':'#adffe5'};
 const parts=new Map();root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh)return;const old=o.material,key=old.name;const shell=/^(Wheelhouse_|Side_window|Front_window|Door_glass|Cabin_beacon)/.test(o.name);const groupKey=key+(shell?'|cabin':'');
  if(!mats.has(key)){const m=new THREE.MeshToonMaterial({color:palette[key]||old.color,gradientMap:ramp,side:THREE.DoubleSide});m.name=key;if(/windows|luminous/.test(key)){m.emissive=new THREE.Color('#9dffe0');m.emissiveIntensity=.5;}mats.set(key,m);}
  if(!parts.has(groupKey))parts.set(groupKey,{key,shell,geos:[]});const geometry=o.geometry.clone().applyMatrix4(o.matrixWorld);for(const attr of Object.keys(geometry.attributes)){if(!['position','normal'].includes(attr))geometry.deleteAttribute(attr);}parts.get(groupKey).geos.push(geometry);
 });
 const optimized=new THREE.Group();for(const {key,shell,geos} of parts.values()){const mesh=new THREE.Mesh(mergeGeometries(geos,false),mats.get(key));mesh.name=key;mesh.userData.cabinShell=shell;mesh.castShadow=true;mesh.receiveShadow=!key.startsWith('Airship');optimized.add(mesh);}return optimized;
}
const loader=new GLTFLoader();let loaded=0;const keys=['basin','palm-0','palm-1','palm-2','bush-0','bush-1','spire','mesa','boulder','agave','airship','harvester','water-balloon','control-room'];
const kit={};
function place(key,x,y,z,s=1,rot=0){const o=kit[key].clone(true);o.position.set(x,y,z);o.scale.setScalar(s);o.rotation.y=rot;scene.add(o);return o;}
function scatter(key,transforms,wind=false){const src=kit[key];src.updateMatrixWorld(true);src.traverse(o=>{if(!o.isMesh)return;const mat=o.material.clone();if(wind){mat.onBeforeCompile=s=>{s.uniforms.uWindTime=shared.windTime;s.uniforms.uWindStrength=environmentUniforms.wind;s.uniforms.uGust=shared.gust;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float uWindTime;uniform float uGust;uniform float uWindStrength;').replace('#include <begin_vertex>',`#include <begin_vertex>
float phase=instanceMatrix[3].x*.37+instanceMatrix[3].z*.29;
float sway=sin(uWindTime*1.15+phase)*.07+sin(uWindTime*2.4+phase)*.024;
transformed.x+=pow(max(position.y,0.)/5.,2.)*sway*(1.+uGust*2.)*uWindStrength;
transformed.z+=pow(max(position.y,0.)/5.,2.)*sin(uWindTime*.9+phase)*.07*uWindStrength;`);};mat.customProgramCacheKey=()=> 'wind-v1';}
const inst=new THREE.InstancedMesh(o.geometry,mat,transforms.length);const dummy=new THREE.Object3D();transforms.forEach((t,i)=>{dummy.position.set(t.x,t.y||0,t.z);dummy.rotation.y=t.r||0;dummy.scale.setScalar(t.s||1);dummy.updateMatrix();inst.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(dummy.matrix,o.matrixWorld));});inst.castShadow=true;inst.receiveShadow=true;inst.computeBoundingSphere();scene.add(inst);});}

// Graphic clouds are shallow, softly shaded procedural cards, not particle volumes.
const clouds=[];
function makeCloudTexture(){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#b57f93';ctx.beginPath();ctx.ellipse(505,181,482,18,0,0,7);ctx.fill();ctx.fillStyle='#ffc391';ctx.beginPath();ctx.moveTo(20,180);for(let i=0;i<19;i++){const x=75+i*46,r=15+rand()*36;ctx.moveTo(x+r,158);ctx.arc(x,158-r*.2,r,Math.PI,Math.PI*2);}ctx.lineTo(990,181);ctx.lineTo(20,181);ctx.fill();const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;}
const cloudTex=makeCloudTexture();for(let i=0;i<13;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(25+rand()*32,6+rand()*6),new THREE.MeshBasicMaterial({map:cloudTex,transparent:true,depthWrite:false,fog:true,opacity:.62+rand()*.25}));m.position.set((rand()-.5)*220,12+rand()*40,-85-rand()*90);scene.add(m);clouds.push({mesh:m,x:m.position.x,phase:rand()*8});}
const atmosphere=createAtmosphere({scene,camera,hemi,sunLight,sun,sunHalo,clouds,shared,reduced});

let harvester,shipView=false,roomView=false,viewTransition=null;
let ship,tour=false,clockTime=0,ready=false,rippleIndex=0,rippleCount=0;
async function init(){try{await Promise.all(keys.map(async key=>{const gltf=await loader.loadAsync(`${import.meta.env.BASE_URL}models/${key}.glb`);kit[key]=stylize(gltf.scene);document.querySelector('#load-status').textContent=`Shaping the landscape · ${++loaded} / ${keys.length}`;}));
place('basin',0,0,0);
const palms=[[],[],[]], bushes=[[],[]], rocks=[];
for(let i=0;i<67;i++){const a=i/67*Math.PI*2+(rand()-.5)*.13,r=1.12+rand()*.2;palms[i%3].push({x:Math.cos(a)*14*r,z:Math.sin(a)*10*r,s:.59+rand()*.32,r:rand()*6.28});}
for(let i=0;i<310;i++){const a=rand()*Math.PI*2,r=.92+rand()*.59;bushes[i%2].push({x:Math.cos(a)*14*r,z:Math.sin(a)*10*r,s:.65+rand()*.95,r:rand()*6.28});}
for(let i=0;i<85;i++){const a=rand()*Math.PI*2,r=20+rand()*50;rocks.push({x:Math.cos(a)*r,z:Math.sin(a)*r-8,y:-.2,s:.25+rand()*1.8,r:rand()*6});}
palms.forEach((p,i)=>scatter('palm-'+i,p,true));bushes.forEach((p,i)=>scatter('bush-'+i,p));scatter('boulder',rocks);
place('spire',28,-.5,-46,1.23,-.35);place('spire',-33,-.5,-71,.49,.3);place('spire',-67,-.5,-100,.42,2);place('spire',9,-.5,-96,.5,-1);place('spire',75,-.5,-105,.82,.1);
for(let i=0;i<15;i++)place('mesa',(rand()-.5)*170,-.4,-36-rand()*94,.5+rand()*.75,rand()*6.3);
place('boulder',-22,-.4,21,4,.4);place('boulder',22,-.3,24,4.8,2);place('boulder',17,-.4,19,2,2.2);
place('agave',-19,1,23,3.1,0);place('agave',19,1.2,24,3.9,1);place('agave',24,1.5,20,2.4,1.5);place('agave',-23,.5,16,1.7,2.5);place('agave',12,.1,17,1.1,1);
ship=place('airship',-14,25,-42,1.48);ship.rotation.y=.15;
harvester=createHarvester({scene,hull:kit.harvester,balloon:kit['water-balloon'],roomModel:kit['control-room'],emitWave,reduced,camera});document.querySelector('#ship-view').disabled=false;
ready=true;document.querySelector('#loading').classList.add('done');document.querySelector('#loading').setAttribute('aria-hidden','true');window.__oasis={getStats:()=>({transitioning:!!viewTransition,view:roomView?'room':shipView?'ship':'vista',machinery:harvester.sound.stats(),ready,ripples:rippleCount,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,airship:ship.position.toArray(),camera:camera.position.toArray(),time:clockTime}),waterPoint:()=>{const p=new THREE.Vector3(0,.08,0).project(camera);return{x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight};}};
}catch(e){console.error(e);document.querySelector('#load-status').textContent='The landscape could not load. Please refresh to try again.';}}

const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let down=null;
function emitWave(x,z,amount=1){rippleSlots[rippleIndex].set(x,z,clockTime,amount);rippleIndex=(rippleIndex+1)%10;}
const splashes=createSplashSystem({scene,daylight:environmentUniforms.daylight,reduced,onReturn:emitWave});
function rippleAt(x,z){splashes.spawn(x,z,clockTime,settings.ripple/100);rippleSlots[rippleIndex].set(x,z,clockTime,1);rippleIndex=(rippleIndex+1)%10;rippleCount++;document.querySelector('#water-hint').classList.add('dismiss');playDrop();}
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,id:e.pointerId};});
canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7){down=null;return;}down=null;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);if(harvester?.cockpit.hit(raycaster))return;if(roomView)return;const boatHit=harvester&&raycaster.intersectObject(harvester.root,true)[0];const hit=raycaster.intersectObject(water)[0];if(boatHit&&(!hit||boatHit.distance<hit.distance)){if(!shipView)setShipView(true);return;}if(hit)rippleAt(hit.point.x,hit.point.z);});
canvas.addEventListener('pointercancel',()=>down=null);
canvas.addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);canvas.style.cursor=raycaster.intersectObject(water).length?'crosshair':'grab';});
canvas.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(shipView)document.querySelector('#pump').click();else rippleAt(0,0);}if(!roomView&&(e.code==='ArrowLeft'||e.code==='ArrowRight')){e.preventDefault();const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.code==='ArrowLeft'?-.06:.06);camera.position.copy(controls.target).add(offset);controls.update();}});
let toastTimer;function toast(s){const el=document.querySelector('#toast');el.textContent=s;el.classList.add('active');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('active'),2500);}
function setTour(v){tour=v;document.querySelector('#tour').setAttribute('aria-pressed',String(v));if(v)document.body.classList.add('exploring');}
document.querySelector('#tour').onclick=()=>{if(shipView)setShipView(false);setTour(!tour);toast(tour?'Drifting through the expanse':'The view is yours');};
controls.addEventListener('start',()=>{setTour(false);document.body.classList.add('exploring');});
function setShipView(v,immediate=false,cabin=false){
 if(v&&!harvester)return;const wasRoom=roomView;const cameraFrom=camera.position.clone(),targetFrom=controls.target.clone();shipView=v;roomView=v&&cabin;setTour(false);document.body.classList.toggle('room-view',roomView);document.querySelector('#ship-radio').hidden=!roomView;document.querySelector('#room-view').setAttribute('aria-pressed',String(roomView));document.querySelector('#deck-view').setAttribute('aria-pressed',String(!roomView));harvester?.cockpit.setView(roomView?'room':v?'ship':'vista',true);document.querySelector('#operator-panel').open=!roomView;document.querySelector('#work-order').open=true;document.body.classList.toggle('ship-view',v);document.querySelector('#harvest-panel').hidden=!v;document.querySelector('#ship-view').setAttribute('aria-pressed',String(v));document.querySelector('#ship-view').innerHTML=v?'<span>↗</span> Vista':'<span>⚓</span> Ship view';
 if(v){document.querySelector('#atmosphere').open=false;document.querySelector('#water-hint').classList.add('dismiss');}
 controls.minDistance=v?2.5:29;controls.maxDistance=v?10:120;controls.minPolarAngle=v?.25:.72;controls.maxPolarAngle=v?1.48:1.43;controls.minAzimuthAngle=v?-Infinity:-.65;controls.maxAzimuthAngle=v?Infinity:.65;
 let target=v?harvester.root.position.clone().add(new THREE.Vector3(0,innerWidth<700?-.4:.5,0)):focus.clone();let end=v?target.clone().add(new THREE.Vector3(-3.4,3.2,4.4).multiplyScalar(innerWidth<700?1.25:1)):home.clone();
 if(roomView){const pose=harvester.cockpit.pose();target=pose.target;end=pose.position;}camera.near=roomView?.012:.1;camera.fov=roomView?(innerWidth<700?76:65):(innerWidth<700?57:45);camera.updateProjectionMatrix();
 // Clear residual orbit damping before starting the cinematic approach.
 controls.enableDamping=false;controls.update();controls.enableDamping=true;controls.enabled=false;
 if(immediate||reduced||wasRoom||roomView){
  viewTransition=null;camera.position.copy(end);controls.target.copy(target);camera.lookAt(target);controls.enabled=!roomView;harvester?.cockpit.setView(roomView?'room':v?'ship':'vista');if(!roomView)controls.update();
 }else{camera.position.copy(cameraFrom);controls.target.copy(targetFrom);viewTransition={from:cameraFrom,targetFrom,to:end,target,age:0,duration:2.3};}
}
document.querySelector('#room-view').onclick=()=>setShipView(true,false,true);document.querySelector('#deck-view').onclick=()=>setShipView(true);
document.querySelector('#ship-view').onclick=()=>setShipView(!shipView);
document.querySelector('#reset').onclick=()=>{setShipView(false);document.body.classList.remove('exploring');toast('Back to the oasis');};
function clean(v){document.body.classList.toggle('clean',v);document.querySelector('#show').hidden=!v;document.querySelector('footer').inert=v;document.querySelector('header').inert=v;document.querySelector('#atmosphere').inert=v;document.querySelector('#harvest-panel').inert=v;(v?document.querySelector('#show'):document.querySelector('#hide')).focus();}
document.querySelector('#hide').onclick=()=>clean(true);document.querySelector('#show').onclick=()=>clean(false);addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')clean(!document.body.classList.contains('clean'));if(e.key==='Escape')clean(false);});
let audioCtx,master,sound=false;function initAudio(){audioCtx=new AudioContext();master=audioCtx.createGain();master.gain.value=0;master.connect(audioCtx.destination);const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*5,audioCtx.sampleRate);const a=buffer.getChannelData(0);let last=0;for(let i=0;i<a.length;i++){last=(last+(Math.random()*2-1)*.022)/1.025;a[i]=last;}const noise=audioCtx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=500;const gain=audioCtx.createGain();gain.gain.value=.45;noise.connect(filter).connect(gain).connect(master);noise.start();for(const frequency of [110,164.81,220.2]){const o=audioCtx.createOscillator();o.type='sine';o.frequency.value=frequency;const g=audioCtx.createGain();g.gain.value=.009;o.connect(g).connect(master);o.start();}}
document.querySelector('#sound').onclick=async()=>{try{if(!audioCtx)initAudio();await audioCtx.resume();sound=!sound;master.gain.setTargetAtTime(sound?.6:0,audioCtx.currentTime,.7);document.querySelector('#sound').setAttribute('aria-pressed',String(sound));}catch(e){toast('Sound is unavailable in this browser');}};
function playDrop(){if(!sound||!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.setValueAtTime(580+Math.random()*200,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(150,audioCtx.currentTime+.35);g.gain.setValueAtTime(.065,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1.1);o.connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+1.2);}
let ripplePreview;document.querySelector('#tune-ripple').addEventListener('input',()=>{clearTimeout(ripplePreview);ripplePreview=setTimeout(()=>{if(ready)rippleAt(0,0);},100);});
const hintPosition=new THREE.Vector3();const hint=document.querySelector('#water-hint');
const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);if(document.hidden)return;clockTime+=dt;shared.time.value=clockTime;if(!reduced)shared.windTime.value+=dt*environmentUniforms.wind.value;atmosphere.update(dt);const t=clockTime;shared.gust.value=reduced?0:Math.pow(.5+.5*Math.sin(t*.17),5);if(ship&&!reduced){ship.position.set(-14+Math.sin(t*.027)*13,25+Math.sin(t*.22)*.45,-42+Math.sin(t*.019)*5);ship.rotation.z=Math.sin(t*.14)*.012;ship.rotation.y=t*.016;}
if(!reduced){clouds.forEach(({mesh,x,phase})=>{mesh.position.x=x+Math.sin(shared.windTime.value*.012+phase)*7;mesh.quaternion.copy(camera.quaternion);});}if(harvester)harvester.update(dt,t,ship);if(roomView&&!viewTransition&&harvester){const pose=harvester.cockpit.pose();camera.position.copy(pose.position);controls.target.copy(pose.target);camera.lookAt(pose.target);}if(tour&&!viewTransition){const az=Math.sin(t*.045)*.4;const distance=home.z+11;camera.position.set(focus.x+Math.sin(az)*distance,home.y+Math.sin(t*.06)*3,Math.cos(az)*distance-10);camera.lookAt(controls.target);}if(viewTransition){const v=viewTransition;v.age+=dt;const p=v.duration?Math.min(1,v.age/v.duration):1;const ease=p*p*(3-2*p);camera.position.lerpVectors(v.from,v.to,ease);controls.target.lerpVectors(v.targetFrom,v.target,ease);camera.lookAt(controls.target);if(p===1){viewTransition=null;harvester?.cockpit.setView(roomView?'room':shipView?'ship':'vista');controls.enabled=!roomView;if(!roomView)controls.update();}}else if(!roomView)controls.update();if(ready&&!hint.classList.contains('dismiss')){hintPosition.set(0,.08,0).project(camera);hint.style.left=((hintPosition.x+1)*innerWidth/2)+'px';hint.style.top=((1-hintPosition.y)*innerHeight/2)+'px';}splashes.update(clockTime);renderer.render(scene,camera);atmosphere.renderGrain(renderer);}
addEventListener('resize',()=>{fitHome();camera.aspect=innerWidth/innerHeight;setShipView(shipView,true,roomView);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
init();frame();
