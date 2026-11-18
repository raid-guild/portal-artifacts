import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BRAND_FACE_INDEX, COMPASS_MARKS, LANES, PARTY_MARKS, POUR_METER_INDEX, READ_BOTTOM, READ_TOP, bandEdges, coasterLookup, playedFace, printedMarks, readPourMeter, readTrack } from './model.js';
import './style.css';

const viewer = document.getElementById('viewer');
const pour = document.getElementById('pour');
const pourValue = document.getElementById('pour-value');
const result = document.getElementById('result');
const readingTrack = document.getElementById('reading-track');
const diceGrid = document.getElementById('dice-grid');
const offsetInput = document.getElementById('coaster-offset');
const offsetValue = document.getElementById('offset-value');
const lookup = document.getElementById('coaster-lookup');
const lookupDie = document.getElementById('lookup-die');
const spinButton = document.getElementById('spin');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let selected = 3;
let activeDie = 10;
let offset = 0;
let printInk = 'plum';
let studio = 'cream';
let height = Number(pour.value);
let liquid, printSleeve, selectedBand;
let spinning = false;
let focusedAngle = 0;
const FACE_COUNT = LANES.length;
const FACE_STEP = 2 * Math.PI / FACE_COUNT;
const faceAngle = index => (index - 3) * FACE_STEP;
const inkColor = () => printInk === 'plum' ? '#51243f' : '#f9f7e7';

function refreshLookup() {
  offsetInput.max = String(activeDie - 1);
  if (offset >= activeDie) offset = 0;
  offsetInput.value = String(offset);
  offsetValue.textContent = `+${offset}`;
  lookupDie.textContent = `D${activeDie} · PRINTED → PLAYED`;
  lookup.replaceChildren(...coasterLookup(activeDie, offset).map(({ printed, played }) => {
    const cell = document.createElement('span');
    cell.className = 'lookup-cell';
    cell.textContent = `${printed} → ${played}`;
    return cell;
  }));
}
function showTrackReading(level) {
  const lane = LANES[selected];
  const value = lane.kind === 'meter' ? readPourMeter(level) : readTrack(printedMarks(lane), level);
  result.style.color = '';
  if (lane.kind === 'brand') {
    result.textContent = '✦';
    readingTrack.textContent = 'RAIDGUILD / BRAND FACE';
  } else if (value == null) {
    result.textContent = '—';
    readingTrack.textContent = 'OUTSIDE READ ZONE';
  } else if (lane.kind === 'die') {
    result.textContent = playedFace(lane.die, value, offset);
    readingTrack.textContent = `D${lane.die} · PRINT ${value} → PLAY ${result.textContent}`;
  } else if (lane.kind === 'party') {
    result.textContent = value;
    readingTrack.textContent = `PARTY / ${PARTY_MARKS[lane.marks.indexOf(value)].name}`;
  } else if (lane.kind === 'meter') {
    result.textContent = `${value}%`;
    readingTrack.textContent = 'METER · FILL LEVEL';
  } else {
    result.textContent = value;
    readingTrack.textContent = lane.label;
  }
}
function selectLaneState(index) {
  selected = index;
  const lane = LANES[index];
  if (lane.kind === 'die') activeDie = lane.die;
  for (const button of diceGrid.querySelectorAll('button')) button.setAttribute('aria-pressed', String(Number(button.dataset.lane) === selected));
  refreshLookup();
  showTrackReading(Number(pour.value));
}
for (let i = 0; i < LANES.length; i++) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = LANES[i].label;
  button.dataset.lane = String(i);
  button.setAttribute('aria-pressed', 'false');
  diceGrid.appendChild(button);
}
offsetInput.addEventListener('input', () => {
  offset = Number(offsetInput.value);
  refreshLookup();
  showTrackReading(Number(pour.value));
});
for (const input of document.querySelectorAll('input[name="print-ink"]')) input.addEventListener('change', () => {
  printInk = input.value;
  document.documentElement.dataset.printInk = printInk;
  if (typeof redrawPrint === 'function') redrawPrint();
});
for (const input of document.querySelectorAll('input[name="studio"]')) input.addEventListener('change', () => {
  studio = input.value;
  document.documentElement.dataset.studio = studio;
  if (typeof setSceneStudio === 'function') setSceneStudio();
});
let redrawPrint, setSceneStudio;
const scene = new THREE.Scene();
scene.background = new THREE.Color(studio === 'teal' ? '#102d2c' : '#efe9d7');
setSceneStudio = () => { scene.background.set(studio === 'teal' ? '#102d2c' : '#efe9d7'); redrawPrint?.(); };
document.documentElement.dataset.studio = studio;
document.documentElement.dataset.printInk = printInk;
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

scene.add(new THREE.HemisphereLight(0xd9f4eb, 0x081f1e, 3.2));
function area(x, y, z, color, intensity) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  scene.add(light);
}
area(-150, 270, 220, 0xf9f7e7, 3.4);
area(170, 180, -120, 0x9edbd2, 2.4);
area(30, 70, 280, 0xf9f7e7, 1.1);

const stage = new THREE.Group();
scene.add(stage);
// No pedestal: the camera can orbit below the glass and see its underside.
const baseGlow = new THREE.Mesh(new THREE.CircleGeometry(83, 96), new THREE.MeshBasicMaterial({color:'#ee3c78',transparent:true,opacity:.08,depthWrite:false}));
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
  color:'#f9f7e7',metalness:0,roughness:.025,transmission:.98,thickness:.2,
  ior:1.46,transparent:true,opacity:.18,side:THREE.FrontSide,depthWrite:false,
  clearcoat:1,clearcoatRoughness:.03,
}));
glass.renderOrder = 3;
stage.add(glass);
const rim = new THREE.Mesh(new THREE.TorusGeometry(41.6,1.4,12,128),new THREE.MeshPhysicalMaterial({color:'#f9f7e7',roughness:.06,metalness:.1,transparent:true,opacity:.84}));
rim.rotation.x = Math.PI/2;
rim.position.y = 150;
rim.renderOrder = 4;
stage.add(rim);
const baseRing = new THREE.Mesh(new THREE.TorusGeometry(26.6,.9,10,128),new THREE.MeshStandardMaterial({color:'#d6eae4',transparent:true,opacity:.55,metalness:.3,roughness:.16}));
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

// The ink wraps clockwise from a marked zero seam. The pointer follows the
// camera, so it reads the part of the glass facing the viewer.
const meterCanvas = document.createElement('canvas');
meterCanvas.width = 1024;
meterCanvas.height = 64;
const meterInk = meterCanvas.getContext('2d');
const meterTexture = new THREE.CanvasTexture(meterCanvas);
meterTexture.colorSpace = THREE.SRGBColorSpace;
function meterGradient(context, x0, y0, x1, y1) {
  const ramp = context.createLinearGradient(x0, y0, x1, y1);
  ramp.addColorStop(0, '#45d4be');
  ramp.addColorStop(.48, '#f8dc76');
  ramp.addColorStop(1, '#ff427f');
  return ramp;
}
const meterGradientOpacity = .8;
function drawFootInk() {
  meterInk.clearRect(0, 0, 1024, 64);
  meterInk.save();
  meterInk.globalAlpha = meterGradientOpacity;
  meterInk.fillStyle = meterGradient(meterInk, 0, 0, 1024, 0);
  meterInk.fillRect(0, 0, 1024, 64);
  meterInk.restore();
  meterInk.fillStyle = '#102d2c';
  for (let i = 0; i < 20; i++) {
    meterInk.fillRect(i * 1024 / 20, 0, i === 0 ? 12 : 4, i % 5 === 0 ? 44 : 24);
  }
  meterTexture.needsUpdate = true;
}
drawFootInk();
const meterStart = -Math.PI / 2;
const fullTurn = 2 * Math.PI;
const meterBand = new THREE.Mesh(
  surfaceGeometry(4, 12, .65, meterStart, meterStart + fullTurn),
  new THREE.MeshBasicMaterial({ map: meterTexture, transparent: true, depthWrite: false, toneMapped: false }),
);
stage.add(meterBand);
const meterPointer = new THREE.Mesh(
  new THREE.CircleGeometry(2.4, 3, Math.PI / 2),
  new THREE.MeshBasicMaterial({color:'#f9f7e7', side:THREE.DoubleSide, toneMapped:false}),
);
stage.add(meterPointer);
const meterReadout = document.querySelector('#turn-meter');
meterReadout.hidden = false;
let lastMeterValue = -1;
function updateTurnMeter() {
  const angle = controls.getAzimuthalAngle();
  const fraction = ((angle - meterStart) % fullTurn + fullTurn) % fullTurn / fullTurn;
  const value = Math.floor(fraction * 100);
  meterPointer.position.set(29.4 * Math.sin(angle), 2.7, 29.4 * Math.cos(angle));
  meterPointer.rotation.y = angle;
  if (value !== lastMeterValue) {
    meterReadout.textContent = `TURN METER · ${value}%`;
    lastMeterValue = value;
  }
}

const canvas = document.createElement('canvas');
canvas.width = 4096; canvas.height = 2048;
const ctx = canvas.getContext('2d');
const brandStamp = new Image();
brandStamp.onload = () => drawPrint();
brandStamp.src = `${import.meta.env.BASE_URL}raidguild-sigil.svg`;
const printTexture = new THREE.CanvasTexture(canvas);
printTexture.colorSpace = THREE.SRGBColorSpace;
printTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
function drawPrint() {
  const w = canvas.width, h = canvas.height, sector = w / FACE_COUNT;
  const py = y => h * (1 - y / 150);
  const ink = inkColor();
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  function lettering(mark, x, y, size, maxWidth) {
    ctx.font = `800 ${size}px Archivo, DM Sans, Arial, sans-serif`;
    ctx.strokeStyle = printInk === 'plum' ? '#f9f7e7' : '#51243f';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeText(String(mark), x, y, maxWidth);
    ctx.fillStyle = ink;
    ctx.fillText(String(mark), x, y, maxWidth);
  }
  function text(mark, x, y, size, maxWidth = sector * .9) {
    lettering(mark, x, py(y), size, maxWidth);
  }
  function line(x, y, width) {
    ctx.fillStyle = ink;
    ctx.fillRect(x - width / 2, py(y) - 1.4, width, 2.8);
  }
  for (let k = 0; k < FACE_COUNT; k++) {
    const lane = LANES[k];
    const x = (k + .5) * sector;
    if (lane.kind === 'brand') {
      text('CHANCE', x, 118, 78);
      text('PINT', x, 110, 78);
      if (brandStamp.complete && brandStamp.naturalWidth) {
        ctx.save();
        ctx.translate(x, py(24));
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(brandStamp, -91, -91, 182, 182);
        ctx.restore();
      }
      ctx.save();
      ctx.translate(x, py(53));
      ctx.rotate(-Math.PI / 2);
      lettering('RAIDGUILD', 0, 0, 96, h * 40 / 150);
      ctx.restore();
      continue;
    }
    text(lane.label, x, 139, lane.kind === 'meter' ? 51 : 65);
    if (lane.kind === 'meter') {
      const edges = bandEdges(20);
      ctx.fillStyle = meterGradient(ctx, 0, py(READ_BOTTOM), 0, py(READ_TOP));
      const barWidth = 174;
      const top = py(READ_TOP);
      const bottom = py(READ_BOTTOM);
      ctx.save();
      ctx.globalAlpha = meterGradientOpacity;
      ctx.fillRect(x - barWidth / 2, top - 4, barWidth, bottom - top + 8);
      ctx.restore();
      edges.forEach((edge, i) => line(x, edge, i % 5 === 0 ? barWidth : 100));
      continue;
    }
    const marks = printedMarks(lane);
    const edges = bandEdges(marks.length);
    for (let i = 0; i < marks.length; i++) {
      const lo = edges[i], hi = edges[i + 1];
      line(x, lo, sector * .65);
      text(marks[i], x, (lo + hi) / 2, marks.length >= 20 ? 36 : 42);
    }
    line(x, READ_TOP, sector * .65);
  }
  printTexture.needsUpdate = true;
}
redrawPrint = () => { drawPrint(); drawFootInk(); };
const printStart = faceAngle(0) - FACE_STEP / 2;
const printGeo = surfaceGeometry(0, 150, .95, printStart, printStart + Math.PI * 2);
// One permanent lane per face; the coaster changes the played value, never the ink.
printSleeve = new THREE.Mesh(printGeo,new THREE.MeshBasicMaterial({map:printTexture,transparent:true,side:THREE.FrontSide,depthWrite:false,alphaTest:.08}));
printSleeve.renderOrder=5;
stage.add(printSleeve);
drawPrint();
document.fonts.load('800 72px "Archivo"').then(drawPrint).catch(() => {});

function makeSelectedBand() {
  if(selectedBand){stage.remove(selectedBand);selectedBand.geometry.dispose();selectedBand.material.dispose();}
  const a=faceAngle(selected);
  selectedBand=new THREE.Mesh(surfaceGeometry(10,144,.56,a-FACE_STEP*.4,a+FACE_STEP*.4),new THREE.MeshBasicMaterial({color:'#ee3c78',transparent:true,opacity:.1,side:THREE.FrontSide,depthWrite:false}));
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
  height = Number(pour.value);
  pourValue.textContent = `${Math.round(height)} MM`;
  showTrackReading(height);
  setLiquid(height);
}
function setSelected(index, moveCamera = true){
  selectLaneState(index);
  makeSelectedBand();
  updateReading();
  if (moveCamera) focusTrack(selected);
}
function lookFrom(azimuth,polar=1.34,distance=360){
  const target=controls.target;
  camera.position.set(target.x+distance*Math.sin(polar)*Math.sin(azimuth),target.y+distance*Math.cos(polar),target.z+distance*Math.sin(polar)*Math.cos(azimuth));
  camera.lookAt(target);controls.update();
}
function focusTrack(index) {
  focusedAngle=faceAngle(index);
  lookFrom(focusedAngle,1.35,330);
}
for (const button of diceGrid.querySelectorAll('button')) button.addEventListener('click', () => setSelected(Number(button.dataset.lane)));
pour.addEventListener('input', updateReading);
spinButton.addEventListener('click',()=>{spinning=!spinning;spinButton.setAttribute('aria-pressed',String(spinning));});
renderer.domElement.addEventListener('pointerdown',()=>{if(spinning){spinning=false;spinButton.setAttribute('aria-pressed','false');}});
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{
  const view=button.dataset.view;
  if(view==='front')lookFrom(0,1.3);
  if(view==='back')lookFrom(Math.PI,1.3);
  if(view==='top')lookFrom(focusedAngle,.03,355);
  if(view==='bottom')lookFrom(focusedAngle,Math.PI-.03,355);
  if(view==='brand'){focusedAngle=faceAngle(BRAND_FACE_INDEX);lookFrom(focusedAngle,1.35,330);}
  if(view==='reset')focusTrack(selected);
});
reducedMotion.addEventListener('change',()=>{controls.enableDamping=!reducedMotion.matches;if(reducedMotion.matches&&spinning){spinning=false;spinButton.setAttribute('aria-pressed','false');}});
let renderedWidth = 0;
let renderedHeight = 0;
function resize() {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;
  if (!width || !height || (width === renderedWidth && height === renderedHeight)) return;
  renderedWidth = width;
  renderedHeight = height;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewer);resize();
setSelected(3,true);
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);if(spinning&&!reducedMotion.matches){const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));lookFrom(spherical.theta+delta*.3,spherical.phi,spherical.radius);}controls.update();updateTurnMeter();renderer.render(scene,camera);}
animate();

} else {
  viewer.classList.add('viewer-fallback');
  viewer.setAttribute('role', 'group');
  viewer.setAttribute('aria-label', 'Original Blender prototype preview; interactive 3D is unavailable');
  document.querySelector('.view-count').textContent = 'STATIC PREVIEW';
  viewer.innerHTML = `<div class="fallback-content"><img src="./prototype-preview.jpg" alt="Three views of the original Chance Pint Blender prototype"/><p>Interactive 3D is unavailable on this device. Explore the original prototype above and use the controls to preview its printed readings.</p></div>`;
  spinButton.hidden = true;
  for (const input of document.querySelectorAll('input[name="print-ink"]')) input.disabled = true;
  const inkNote = document.createElement('p');
  inkNote.className = 'palette-fallback-note';
  inkNote.textContent = 'Print ink preview needs the 3D view. Studio color still changes the backdrop.';
  document.querySelector('.palette-section').appendChild(inkNote);
  document.querySelector('.presets').hidden = true;
  document.querySelector('.viewer-instruction').textContent = 'ORIGINAL BLENDER PROTOTYPE';
  function updateFallback() {
    const level = Number(pour.value);
    pourValue.textContent = `${Math.round(level)} MM`;
    showTrackReading(level);
  }
  function selectFallback(index) {
    selectLaneState(index);
    updateFallback();
  }
  for (const button of diceGrid.querySelectorAll('button')) button.addEventListener('click', () => selectFallback(Number(button.dataset.lane)));
  pour.addEventListener('input', updateFallback);
  selectFallback(3);
}
