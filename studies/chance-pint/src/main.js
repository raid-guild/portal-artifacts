import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DICE, READ_BOTTOM, READ_TOP, bandEdges, makeLayout, readTrack } from './model.js';
import './style.css';

const viewer = document.getElementById('viewer');
const pour = document.getElementById('pour');
const pourValue = document.getElementById('pour-value');
const result = document.getElementById('result');
const readingTrack = document.getElementById('reading-track');
const diceGrid = document.getElementById('dice-grid');
const seedField = document.getElementById('seed');
const seedError = document.getElementById('seed-error');
const spinButton = document.getElementById('spin');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const colors = ['#77d3c0', '#ffc675', '#87b8f3', '#ee8e9d', '#bd98e3', '#d6e283'];

let layout = makeLayout(7319);
let dieIndex = 3;
let repeat = 0;
let selected = 3;
let height = Number(pour.value);
let liquid;
let printSleeve;
let selectedBand;
let spinning = false;
let focusedAngle = 0;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#102936');
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1500);
camera.position.set(125, 172, 340);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
} catch {
  renderer = null;
}
if (renderer) {
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
viewer.appendChild(renderer.domElement);
viewer.querySelector('.viewer-loading').remove();
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 75, 0);
controls.enableDamping = !reducedMotion.matches;
controls.dampingFactor = 0.06;
controls.minDistance = 180;
controls.maxDistance = 650;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enablePan = false;
controls.update();

scene.add(new THREE.HemisphereLight(0xd7f3ff, 0x163042, 3.2));
function area(x, y, z, color, intensity) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  scene.add(light);
}
area(-150, 270, 220, 0xffe7ba, 3.4);
area(170, 180, -120, 0xa7dcff, 2.4);
area(30, 70, 280, 0xffffff, 1.1);

const stage = new THREE.Group();
scene.add(stage);
// No pedestal: the camera can orbit below the glass and see its underside.
const baseGlow = new THREE.Mesh(new THREE.CircleGeometry(83, 96), new THREE.MeshBasicMaterial({color:'#97bcb2',transparent:true,opacity:.08,depthWrite:false}));
baseGlow.rotation.x = -Math.PI/2;
baseGlow.position.y = -4.4;
stage.add(baseGlow);

// Blender prototype geometry: 150 mm tall, 54 mm foot, 86 mm rim.
const glassProfile = [
  [0,0], [25,0], [26.8,.8], [27.2,2], [43,150],
  [40.2,150], [24,6], [0,6],
].map(([r,y]) => new THREE.Vector2(r,y));
const glassGeo = new THREE.LatheGeometry(glassProfile, 128);
const glass = new THREE.Mesh(glassGeo, new THREE.MeshPhysicalMaterial({
  color:'#d7f2f1',metalness:0,roughness:.025,transmission:.98,thickness:.2,
  ior:1.46,transparent:true,opacity:.18,side:THREE.FrontSide,depthWrite:false,
  clearcoat:1,clearcoatRoughness:.03,
}));
glass.renderOrder = 3;
stage.add(glass);
const rim = new THREE.Mesh(new THREE.TorusGeometry(41.6,1.4,12,128),new THREE.MeshPhysicalMaterial({color:'#e6f8f9',roughness:.06,metalness:.1,transparent:true,opacity:.84}));
rim.rotation.x = Math.PI/2;
rim.position.y = 150;
rim.renderOrder = 4;
stage.add(rim);
const baseRing = new THREE.Mesh(new THREE.TorusGeometry(26.6,.9,10,128),new THREE.MeshStandardMaterial({color:'#c4e2e1',transparent:true,opacity:.55,metalness:.3,roughness:.16}));
baseRing.rotation.x = Math.PI/2;
baseRing.position.y = 1;
stage.add(baseRing);

function radius(y) { return 27 + 16*y/150; }
function innerRadius(y) { return 24 + 16*(y-6)/144; }
function surfaceGeometry(bottom, top, offset = .85, start = 0, end = Math.PI*2) {
  const segments = Math.max(8,Math.ceil((end-start)*28));
  const steps = 3;
  const vertices=[],uv=[],indices=[];
  for(let j=0;j<=steps;j++) {
    const y=bottom+(top-bottom)*j/steps;
    for(let i=0;i<=segments;i++) {
      const u=i/segments;
      const a=start+(end-start)*u;
      const r=radius(y)+offset;
      vertices.push(Math.sin(a)*r,y,Math.cos(a)*r);
      uv.push(u,(y-bottom)/(top-bottom));
    }
  }
  for(let j=0;j<steps;j++)for(let i=0;i<segments;i++) {
    const n=j*(segments+1)+i;
    indices.push(n,n+1,n+segments+1,n+1,n+segments+2,n+segments+1);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

const canvas = document.createElement('canvas');
canvas.width=4096; canvas.height=2048;
const ctx=canvas.getContext('2d');
const printTexture = new THREE.CanvasTexture(canvas);
printTexture.colorSpace=THREE.SRGBColorSpace;
printTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();
function drawPrint() {
  const w=canvas.width,h=canvas.height,sector=w/12;
  ctx.clearRect(0,0,w,h);
  const py=(y)=>h*(1-y/150);
  for(let k=0;k<12;k++) {
    const x=(k+.5)*sector;
    const track=layout.tracks[k];
    const accent=colors[k%6];
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=accent;
    ctx.font='700 68px Arial,sans-serif';
    ctx.fillText(`D${track.die}`,x,py(139));
    ctx.font='500 20px Arial,sans-serif';
    ctx.fillText(k<6?'A':'B',x,py(131.5));
    const edges=bandEdges(track.die);
    for(let i=0;i<track.die;i++) {
      const lo=edges[i],hi=edges[i+1];
      ctx.strokeStyle=accent;
      ctx.globalAlpha=.82;
      ctx.lineWidth=2.6;
      ctx.beginPath();ctx.moveTo(x-sector*.37,py(lo));ctx.lineTo(x+sector*.37,py(lo));ctx.stroke();
      ctx.globalAlpha=1;
      ctx.fillStyle='#fff9dd';
      ctx.font=`600 ${track.die===20?30:track.die>=12?38:46}px Arial,sans-serif`;
      ctx.fillText(String(track.bottom_to_top[i]),x,py((lo+hi)/2));
    }
    ctx.strokeStyle=accent;ctx.lineWidth=2.6;
    ctx.beginPath();ctx.moveTo(x-sector*.37,py(READ_TOP));ctx.lineTo(x+sector*.37,py(READ_TOP));ctx.stroke();
  }
  printTexture.needsUpdate=true;
}
const printGeo=surfaceGeometry(0,150,.95,-Math.PI/2-Math.PI/12,-Math.PI/2-Math.PI/12+Math.PI*2);
// The canvas starts with the A/d4 sector at angle -90°, matching the original Blender layout.
printSleeve = new THREE.Mesh(printGeo,new THREE.MeshBasicMaterial({map:printTexture,transparent:true,side:THREE.FrontSide,depthWrite:false,alphaTest:.08}));
printSleeve.renderOrder=5;
stage.add(printSleeve);
drawPrint();

function makeSelectedBand() {
  if(selectedBand){stage.remove(selectedBand);selectedBand.geometry.dispose();selectedBand.material.dispose();}
  const a=-Math.PI/2+selected*Math.PI/6;
  selectedBand=new THREE.Mesh(surfaceGeometry(10,144,.56,a-.21,a+.21),new THREE.MeshBasicMaterial({color:colors[selected%6],transparent:true,opacity:.12,side:THREE.FrontSide,depthWrite:false}));
  selectedBand.renderOrder=4;
  stage.add(selectedBand);
}
function setLiquid(y) {
  if(liquid){
    stage.remove(liquid);
    liquid.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.material){
        const materials=Array.isArray(o.material)?o.material:[o.material];
        for(const material of materials)material.dispose();
      }
    });
  }
  liquid=new THREE.Group();
  if(y<=6){stage.add(liquid);return;}
  const top=Math.max(6.5,y);
  const r=innerRadius(top)-.8;
  const profile=[[0,6.1],[23.3,6.1],[r,top],[0,top]].map(([x,v])=>new THREE.Vector2(x,v));
  const beer=new THREE.Mesh(new THREE.LatheGeometry(profile,96),new THREE.MeshPhysicalMaterial({color:'#ba742e',metalness:0,roughness:.22,transparent:true,opacity:.83,side:THREE.DoubleSide,depthWrite:false,clearcoat:.6}));
  beer.renderOrder=1;
  liquid.add(beer);
  const topDisc=new THREE.Mesh(new THREE.CircleGeometry(r,96),new THREE.MeshStandardMaterial({color:'#f3c26b',roughness:.42,metalness:0,transparent:true,opacity:.87,side:THREE.DoubleSide}));
  topDisc.rotation.x=-Math.PI/2;topDisc.position.y=top+.1;topDisc.renderOrder=2;liquid.add(topDisc);
  const foam=new THREE.Mesh(new THREE.TorusGeometry(r-.7,.65,8,96),new THREE.MeshBasicMaterial({color:'#ffe1a0',transparent:true,opacity:.68}));
  foam.rotation.x=Math.PI/2;foam.position.y=top+.3;foam.renderOrder=2;liquid.add(foam);
  stage.add(liquid);
}
function updateReading(){
  height=Number(pour.value);
  pourValue.textContent=`${Math.round(height)} MM`;
  const value=readTrack(layout.tracks[selected],height);
  result.textContent=value ?? '—';
  readingTrack.textContent=value == null ? 'OUTSIDE READ ZONE' : `D${DICE[dieIndex]} / SIDE ${repeat?'B':'A'}`;
  setLiquid(height);
}
function setSelected(index,moveCamera=true){
  selected=index;dieIndex=index%6;repeat=Math.floor(index/6);
  for(const button of diceGrid.querySelectorAll('button')) button.setAttribute('aria-pressed',String(Number(button.dataset.die)===dieIndex));
  for(const button of document.querySelectorAll('[data-repeat]')) button.setAttribute('aria-pressed',String(Number(button.dataset.repeat)===repeat));
  makeSelectedBand();
  updateReading();
  if(moveCamera)focusTrack(index);
}
function lookFrom(azimuth,polar=1.34,distance=360){
  const target=controls.target;
  camera.position.set(target.x+distance*Math.sin(polar)*Math.sin(azimuth),target.y+distance*Math.cos(polar),target.z+distance*Math.sin(polar)*Math.cos(azimuth));
  camera.lookAt(target);controls.update();
}
function focusTrack(index) {
  focusedAngle=-Math.PI/2+index*Math.PI/6;
  lookFrom(focusedAngle,1.35,330);
}
for(let i=0;i<DICE.length;i++){
  const button=document.createElement('button');button.type='button';button.textContent=`D${DICE[i]}`;button.dataset.die=String(i);button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>setSelected(i+repeat*6));diceGrid.appendChild(button);
}
for(const button of document.querySelectorAll('[data-repeat]'))button.addEventListener('click',()=>setSelected(dieIndex+Number(button.dataset.repeat)*6));
pour.addEventListener('input',updateReading);
document.getElementById('seed-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=Number(seedField.value);
  try{layout=makeLayout(value);drawPrint();updateReading();seedError.hidden=true;}
  catch(error){seedError.textContent=error.message;seedError.hidden=false;}
});
document.getElementById('reset-layout').addEventListener('click',()=>{seedField.value='7319';layout=makeLayout(7319);drawPrint();updateReading();seedError.hidden=true;});
spinButton.addEventListener('click',()=>{spinning=!spinning;spinButton.setAttribute('aria-pressed',String(spinning));});
renderer.domElement.addEventListener('pointerdown',()=>{if(spinning){spinning=false;spinButton.setAttribute('aria-pressed','false');}});
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{
  const view=button.dataset.view;
  if(view==='front')lookFrom(0,1.3);
  if(view==='back')lookFrom(Math.PI,1.3);
  if(view==='top')lookFrom(focusedAngle,.03,355);
  if(view==='bottom')lookFrom(focusedAngle,Math.PI-.03,355);
  if(view==='reset')focusTrack(selected);
});
reducedMotion.addEventListener('change',()=>{controls.enableDamping=!reducedMotion.matches;if(reducedMotion.matches&&spinning){spinning=false;spinButton.setAttribute('aria-pressed','false');}});
function resize(){const width=viewer.clientWidth,height=viewer.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(viewer);resize();
setSelected(3,true);
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);if(spinning&&!reducedMotion.matches){const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));lookFrom(spherical.theta+delta*.3,spherical.phi,spherical.radius);}controls.update();renderer.render(scene,camera);}
animate();

} else {
  viewer.classList.add('viewer-fallback');
  viewer.setAttribute('role', 'group');
  viewer.setAttribute('aria-label', 'Original Blender prototype preview; interactive 3D is unavailable');
  document.querySelector('.view-count').textContent = 'STATIC PREVIEW';
  viewer.innerHTML = `<div class="fallback-content"><img src="./prototype-preview.jpg" alt="Three views of the original Chance Pint Blender prototype"/><p>Interactive 3D is unavailable on this device. Explore the original prototype above and use the controls to preview its printed readings.</p></div>`;
  spinButton.hidden = true;
  document.querySelector('.presets').hidden = true;
  document.querySelector('.viewer-instruction').textContent = 'ORIGINAL BLENDER PROTOTYPE';
  function updateFallback() {
    const level = Number(pour.value);
    pourValue.textContent = `${Math.round(level)} MM`;
    const value = readTrack(layout.tracks[selected], level);
    result.textContent = value ?? '—';
    readingTrack.textContent = value == null ? 'OUTSIDE READ ZONE' : `D${DICE[dieIndex]} / SIDE ${repeat?'B':'A'}`;
  }
  function selectFallback(index) {
    selected=index; dieIndex=index%6; repeat=Math.floor(index/6);
    for(const button of diceGrid.querySelectorAll('button'))button.setAttribute('aria-pressed',String(Number(button.dataset.die)===dieIndex));
    for(const button of document.querySelectorAll('[data-repeat]'))button.setAttribute('aria-pressed',String(Number(button.dataset.repeat)===repeat));
    updateFallback();
  }
  for(let i=0;i<DICE.length;i++){
    const button=document.createElement('button');button.type='button';button.textContent=`D${DICE[i]}`;button.dataset.die=String(i);button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>selectFallback(i+repeat*6));diceGrid.appendChild(button);
  }
  for(const button of document.querySelectorAll('[data-repeat]'))button.addEventListener('click',()=>selectFallback(dieIndex+Number(button.dataset.repeat)*6));
  pour.addEventListener('input',updateFallback);
  document.getElementById('seed-form').addEventListener('submit',event=>{
    event.preventDefault();
    try{layout=makeLayout(Number(seedField.value));updateFallback();seedError.hidden=true;}
    catch(error){seedError.textContent=error.message;seedError.hidden=false;}
  });
  document.getElementById('reset-layout').addEventListener('click',()=>{seedField.value='7319';layout=makeLayout(7319);updateFallback();seedError.hidden=true;});
  selectFallback(3);
}
