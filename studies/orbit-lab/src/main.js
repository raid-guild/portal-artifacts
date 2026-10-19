import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { STEP, acceleration, addWell, predict, remaining, wellPower } from './physics.js';
import { LEVEL, BLOB_RADIUS, SPEED_CAP, canPlaceWell, capVelocity, firstImpact, predictToImpact } from './level.js';
import './style.css';

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="scene" id="scene"></div>
  <div class="grain"></div>
  <header class="topbar">
    <div class="brand"><span class="brand-mark">✳</span><span>ORBIT<span class="brand-light">LAB</span></span><span class="brand-sub">/ GRAVITY PLAYGROUND</span></div>
    <div class="top-actions"><span class="live-indicator"><i></i> <span id="modeLabel">MAZE RUN</span></span><button class="icon-button" id="pause" title="Pause or resume (Space)" aria-label="Pause or resume">Ⅱ</button><button class="icon-button restart" id="restart" title="Restart (R)" aria-label="Restart">↺</button></div>
  </header>
  <aside class="panel">
    <div class="eyebrow"><span class="tiny-star">✦</span> EXPERIMENT 002 <span class="eyebrow-line"></span></div>
    <div class="game-modes" role="group" aria-label="Game mode"><button class="selected" data-game="maze">Maze</button><button data-game="sandbox">Sandbox</button></div>
    <h1>Bend the flight.<br><em>Find the exit.</em></h1>
    <p class="lede">Guide the blob through the maze. Place wells to pull it around walls and toward the exit.</p>
    <div class="run-stats"><span>ATTEMPTS <b id="attempts">1</b></span><span>TIME <b id="runTime">0.0s</b></span></div>
    <div class="status-row"><span>THE BLOB</span><strong id="stateLabel"><span class="status-dot"></span> IN ORBIT</strong></div>
    <div class="control-group">
      <div class="control-heading"><label for="strength">GRAVITY STRENGTH</label><output id="strengthValue">100</output></div>
      <input id="strength" type="range" min="35" max="180" step="1" value="100" />
      <div class="scale-label"><span>GENTLE PULL</span><span>STRONG PULL</span></div>
    </div>
    <div class="control-group">
      <div class="control-heading"><label for="lifetime">WELL LIFETIME</label><output id="lifetimeValue">8.0s</output></div>
      <input id="lifetime" type="range" min="2" max="16" step="0.5" value="8" />
      <div class="scale-label"><span>QUICK RELEASE</span><span>LONG ORBIT</span></div>
      <p class="microcopy">Applies to new wells; restart to use now.</p>
    </div>
    <div class="control-group ending">
      <div class="control-heading"><span>HOW WELLS END</span></div>
      <div class="segmented" role="group" aria-label="How wells end"><button class="selected" data-mode="fade">◒ &nbsp; Fade out</button><button data-mode="snap">✳ &nbsp; Snap off</button></div>
      <p class="microcopy" id="modeHelp">Pull weakens over the last 20% of a well’s life.</p>
    </div>
    <div class="active-heading"><span>ACTIVE WELLS</span><small id="wellCount">1 / 2</small></div>
    <div class="well-list" id="wellList"></div>
    <button id="release" class="release-button">Release all wells <span>↗</span></button>
  </aside>
  <div class="hint" id="hint"><div class="hint-icon">＋</div><div><strong>Place a well, then press Space</strong><span>Steer around walls and spikes to reach the green exit.</span></div></div>
  <div class="forecast-caption" id="forecastCaption">PATH TO NEXT IMPACT · NO WELL</div>
  <div class="death-flash" id="deathFlash"></div>
  <div class="bottom-bar"><span><span id="bottomMode">02 &nbsp; / &nbsp; GRAVITY MAZE</span></span><span class="desktop-instructions">CLICK <b>PLACE WELL</b> &nbsp;·&nbsp; RIGHT CLICK <b>REMOVE</b> &nbsp;·&nbsp; SPACE <b>PAUSE</b> &nbsp;·&nbsp; R <b>RESTART</b></span><span id="speed">0.00 u/s</span></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="drift-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The blob drifted beyond the visible arena. Try catching it sooner, or start again.</p><button id="driftRestart">Restart experiment ↗</button></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="drift-card"><span class="eyebrow">COURSE COMPLETE</span><h2>Made it through.</h2><p id="winStats"></p><button id="winRestart">Try again ↗</button></div></div>
`;

const $ = (selector) => document.querySelector(selector);
const sceneElement = $('#scene');
const wellList = $('#wellList');
const strengthInput = $('#strength');
const lifetimeInput = $('#lifetime');
const hint = $('#hint');
const pauseButton = $('#pause');
const driftOverlay = $('#driftOverlay');
const winOverlay = $('#winOverlay');
const mazeGroup = new THREE.Group();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;
sceneElement.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 100);
camera.position.set(0, 0, 30);
camera.lookAt(0, 0, 0);

const blue = 0x66e9f2;
const purple = 0x9b90ff;
const white = 0xe8faff;
const baseLine = new THREE.LineBasicMaterial({ color: 0x263b55, transparent: true, opacity: 0.34 });

function line(points, material, closed = false) {
  const path = closed ? [...points, points[0]] : points;
  const geometry = new THREE.BufferGeometry().setFromPoints(path.map((p) => new THREE.Vector3(p.x, p.y, p.z || 0)));
  return new THREE.Line(geometry, material);
}

function ring(radius, material, segments = 96) {
  const points = Array.from({ length: segments }, (_, i) => ({ x: Math.cos(i / segments * Math.PI * 2) * radius, y: Math.sin(i / segments * Math.PI * 2) * radius, z: 0 }));
  return line(points, material, true);
}

const background = new THREE.Group();
scene.add(background);
scene.add(mazeGroup);
for (let n = -40; n <= 40; n += 2) {
  background.add(line([{ x: -60, y: n, z: -6 }, { x: 60, y: n, z: -6 }], baseLine));
  background.add(line([{ x: n, y: -60, z: -6 }, { x: n, y: 60, z: -6 }], baseLine));
}
const stars = new THREE.Group();
scene.add(stars);
let seed = 387;
const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const starGeometry = new THREE.CircleGeometry(0.022, 6);
for (let i = 0; i < 210; i++) {
  const star = new THREE.Mesh(starGeometry, new THREE.MeshBasicMaterial({ color: i % 7 === 0 ? 0x7888ba : 0x4d7892, transparent: true, opacity: 0.2 + random() * 0.4 }));
  star.position.set((random() - 0.5) * 95, (random() - 0.5) * 75, -3);
  star.scale.setScalar(0.6 + random() * 1.4);
  stars.add(star);
}

scene.add(new THREE.AmbientLight(0xaacaff, 1.8));
const blobLight = new THREE.PointLight(0x76f7e9, 34, 16);
scene.add(blobLight);
const core = new THREE.Group();
const blob = new THREE.Mesh(new THREE.SphereGeometry(0.31, 32, 24), new THREE.MeshPhysicalMaterial({ color: 0xa9fff1, emissive: 0x34babe, emissiveIntensity: 0.35, metalness: 0.02, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15 }));
blob.scale.set(1.12, 0.91, 0.87);
core.add(blob);
const blobHalo = ring(0.52, new THREE.LineBasicMaterial({ color: 0x78ffe9, transparent: true, opacity: 0.32 }));
core.add(blobHalo);
core.position.z = 2;
scene.add(core);

const trailMaterial = new THREE.LineBasicMaterial({ color: blue, transparent: true, opacity: 0.67 });
const trail = new THREE.Line(new THREE.BufferGeometry(), trailMaterial);
trail.position.z = 0.7;
scene.add(trail);
const forecastMaterial = new THREE.LineDashedMaterial({ color: 0x92faff, transparent: true, opacity: 0.45, dashSize: 0.11, gapSize: 0.14 });
const forecast = new THREE.Line(new THREE.BufferGeometry(), forecastMaterial);
forecast.position.z = 0.15;
scene.add(forecast);
const startingOrbit = ring(4, new THREE.LineDashedMaterial({ color: 0x708ca9, transparent: true, opacity: 0.17, dashSize: 0.055, gapSize: 0.12 }));
startingOrbit.computeLineDistances();
startingOrbit.position.set(0, 0, -0.1);
scene.add(startingOrbit);

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0), allowSleep: false });
const blobMaterial = new CANNON.Material('blob');
const wallMaterial = new CANNON.Material('wall');
world.addContactMaterial(new CANNON.ContactMaterial(blobMaterial, wallMaterial, { friction: 0, restitution: 0.1 }));
const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(BLOB_RADIUS), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
world.addBody(body);
const wallBodies = [];
for (const rect of LEVEL.walls) {
  const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, 0.7)) });
  wall.position.set(rect.x, rect.y, 0);
  world.addBody(wall);
  wallBodies.push(wall);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(rect.w, rect.h, 0.75), new THREE.MeshStandardMaterial({ color: 0x365870, emissive: 0x173448, emissiveIntensity: 0.45, metalness: 0.2, roughness: 0.62 }));
  mesh.position.set(rect.x, rect.y, 0);
  mazeGroup.add(mesh);
}
for (const spike of LEVEL.spikes) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.75, 3), new THREE.MeshBasicMaterial({ color: 0xff7882 }));
  mesh.rotation.z = Math.PI;
  mesh.position.set(spike.x, spike.y, 0.62);
  mazeGroup.add(mesh);
  const warning = new THREE.Mesh(new THREE.PlaneGeometry(spike.w, spike.h), new THREE.MeshBasicMaterial({ color: 0xff6b80, transparent: true, opacity: 0.28 }));
  warning.position.set(spike.x, spike.y, 0.6);
  mazeGroup.add(warning);
}
const goalMesh = ring(LEVEL.goal.radius, new THREE.LineBasicMaterial({ color: 0x8cfab5, transparent: true, opacity: 0.95 }));
goalMesh.position.set(LEVEL.goal.x, LEVEL.goal.y, 0.8);
mazeGroup.add(goalMesh);
const goalDisc = new THREE.Mesh(new THREE.CircleGeometry(LEVEL.goal.radius, 48), new THREE.MeshBasicMaterial({ color: 0x63eaa2, transparent: true, opacity: 0.12 }));
goalDisc.position.set(LEVEL.goal.x, LEVEL.goal.y, 0.3);
mazeGroup.add(goalDisc);
function mapLabel(text, color, x, y) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 42);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false }));
  sprite.position.set(x, y, 2);
  sprite.scale.set(2.6, 0.65, 1);
  mazeGroup.add(sprite);
}
mapLabel('START', '#9be6f0', -10, -6.15);
mapLabel('EXIT', '#a1ffbb', LEVEL.goal.x, LEVEL.goal.y + 1.65);

let simTime = 0;
let accumulator = 0;
let lastFrame = performance.now();
let wells = [];
let nextWellId = 1;
let mode = 'fade';
let paused = false;
let drifted = false;
let trails = [];
let frameCount = 0;
let pointer = null;
let pointerDownAt = 0;
let firstPlace = true;
let gameMode = 'maze';
let attempts = 0;
let won = false;
let resetTimer = null;

function makeWell(x, y, strength, lifetime, createdAt) {
  const id = nextWellId++;
  const color = id % 2 ? blue : purple;
  const group = new THREE.Group();
  group.position.set(x, y, 1);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.2, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32 }));
  const nucleus = new THREE.Mesh(new THREE.CircleGeometry(0.082, 32), new THREE.MeshBasicMaterial({ color: white }));
  const inner = ring(0.29, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 }));
  const outer = ring(0.6, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }));
  const field = ring(1.2, new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.21, dashSize: 0.07, gapSize: 0.11 }));
  field.computeLineDistances();
  const timer = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
  group.add(disc, nucleus, inner, outer, field, timer);
  scene.add(group);
  return { id, x, y, strength, lifetime, createdAt, group, disc, inner, outer, field, timer, color };
}

function disposeWell(well) {
  scene.remove(well.group);
  well.group.traverse((child) => { child.geometry?.dispose(); child.material?.dispose(); });
}

function redrawWellList() {
  $('#wellCount').textContent = `${wells.length} / 2`;
  wellList.innerHTML = wells.length ? wells.map((well) => `
    <div class="well-item" style="--well-color:${well.id % 2 ? '#66e9f2' : '#9b90ff'}">
      <span class="well-glyph">✳</span><span class="well-name">WELL ${String(well.id).padStart(2, '0')}</span>
      <span class="well-timer" data-well-time="${well.id}">${remaining(well, simTime).toFixed(1)}s</span>
      <button data-remove="${well.id}" aria-label="Remove well ${well.id}" title="Remove well">×</button>
    </div>`).join('') : `<p class="empty-wells">No wells active. Place one in the arena.</p>`;
}

function removeWell(id) {
  const index = wells.findIndex((well) => well.id === id);
  if (index === -1) return;
  disposeWell(wells[index]);
  wells.splice(index, 1);
  redrawWellList();
  updateForecast();
}

function placeWell(x, y) {
  if (drifted || won) return;
  if (gameMode === 'maze' && !canPlaceWell({ x, y })) {
    $('#forecastCaption').textContent = 'PLACE WELLS IN OPEN SPACE';
    return;
  }
  const well = makeWell(x, y, Number(strengthInput.value), Number(lifetimeInput.value), simTime);
  const old = wells[0];
  wells = addWell(wells, well);
  if (old && !wells.includes(old)) disposeWell(old);
  redrawWellList();
  updateForecast();
  if (firstPlace) { hint.classList.add('hidden'); firstPlace = false; }
}

function releaseAll() {
  wells.forEach(disposeWell);
  wells = [];
  redrawWellList();
  updateForecast();
}

function reset() {
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  releaseAll();
  simTime = 0;
  accumulator = 0;
  trails = [];
  drifted = false;
  won = false;
  paused = gameMode === 'maze';
  driftOverlay.classList.add('hidden');
  winOverlay.classList.add('hidden');
  $('#deathFlash').classList.remove('visible');
  pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  body.force.setZero();
  body.angularVelocity.setZero();
  if (gameMode === 'maze') {
    body.position.set(LEVEL.spawn.x, LEVEL.spawn.y, 0);
    body.velocity.set(LEVEL.spawn.vx, LEVEL.spawn.vy, 0);
    attempts += 1;
    $('#attempts').textContent = attempts;
  } else {
    body.position.set(4, 0, 0);
    const selectedStrength = Number(strengthInput.value);
    body.velocity.set(0, Math.sqrt(selectedStrength * 4 * 4 / Math.pow(4 * 4 + 0.75 * 0.75, 1.5)), 0);
    wells = [makeWell(0, 0, selectedStrength, Number(lifetimeInput.value), 0)];
  }
  $('#runTime').textContent = '0.0s';
  redrawWellList();
  updateForecast();
  updateStatus();
  lastFrame = performance.now();
}

function failRun() {
  if (drifted || won) return;
  drifted = true;
  paused = true;
  $('#deathFlash').classList.add('visible');
  updateStatus();
  resetTimer = setTimeout(reset, 420);
}

function winRun() {
  if (won) return;
  won = true;
  paused = true;
  $('#winStats').textContent = `${simTime.toFixed(1)} seconds · ${attempts} attempt${attempts === 1 ? '' : 's'}`;
  winOverlay.classList.remove('hidden');
  updateStatus();
}

function switchGame(next) {
  if (next === gameMode) return;
  gameMode = next;
  mazeGroup.visible = next === 'maze';
  for (const wall of wallBodies) {
    if (next === 'maze' && !world.bodies.includes(wall)) world.addBody(wall);
    if (next === 'sandbox' && world.bodies.includes(wall)) world.removeBody(wall);
  }
  startingOrbit.visible = next === 'sandbox';
  $('.run-stats').style.display = next === 'maze' ? '' : 'none';
  $('#forecastCaption').style.display = next === 'maze' ? '' : 'none';
  $('.panel h1').innerHTML = next === 'maze' ? 'Bend the flight.<br><em>Find the exit.</em>' : 'Make gravity.<br><em>Make a path.</em>';
  $('.lede').textContent = next === 'maze' ? 'Guide the blob through the maze. Place wells to pull it around walls and toward the exit.' : 'Drop temporary gravity wells to bend the blob’s flight. Catch an orbit, then let it go.';
  $('#modeLabel').textContent = next === 'maze' ? 'MAZE RUN' : 'LIVE SIMULATION';
  $('#bottomMode').innerHTML = next === 'maze' ? '02 &nbsp; / &nbsp; GRAVITY MAZE' : '01 &nbsp; / &nbsp; ORBITAL PLAYGROUND';
  hint.querySelector('strong').textContent = next === 'maze' ? 'Place a well, then press Space' : 'Click anywhere to place a well';
  hint.querySelector('span').textContent = next === 'maze' ? 'Steer around walls and spikes to reach the green exit.' : 'Only two can exist at once. New ones replace the oldest.';
  firstPlace = true;
  hint.classList.remove('hidden');
  $('.game-modes').querySelectorAll('button').forEach((button) => button.classList.toggle('selected', button.dataset.game === next));
  if (next === 'maze') attempts = 0;
  resize();
  reset();
}

function currentState() {
  return { x: body.position.x, y: body.position.y, vx: body.velocity.x, vy: body.velocity.y };
}

function updateForecast() {
  const result = gameMode === 'maze' ? predictToImpact(currentState(), wells, simTime, 3, mode) : { points: predict(currentState(), wells, simTime, 5.5, mode, 7), impact: null };
  const points = result.points;
  if (gameMode === 'maze') $('#forecastCaption').textContent = `PATH TO NEXT IMPACT · ${result.impact?.toUpperCase() || 'CLEAR'}`;
  forecast.geometry.dispose();
  forecast.geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
  forecast.computeLineDistances();
}

function updateTrail() {
  const last = trails[trails.length - 1];
  if (!last || Math.hypot(last.x - body.position.x, last.y - body.position.y) > 0.045) {
    trails.push({ x: body.position.x, y: body.position.y });
    if (trails.length > 260) trails.shift();
    trail.geometry.dispose();
    trail.geometry = new THREE.BufferGeometry().setFromPoints(trails.map((p) => new THREE.Vector3(p.x, p.y, 0)));
  }
}

function updateWellVisuals() {
  for (const well of wells) {
    const fraction = remaining(well, simTime) / well.lifetime;
    const power = wellPower(well, simTime, mode);
    well.disc.material.opacity = 0.13 + power * 0.24;
    well.inner.material.opacity = 0.25 + power * 0.6;
    well.outer.material.opacity = 0.1 + power * 0.4;
    well.field.material.opacity = 0.04 + power * 0.19;
    well.outer.scale.setScalar(1 + (1 - fraction) * 0.13);
    const segments = Math.max(1, Math.round(fraction * 72));
    const points = Array.from({ length: segments + 1 }, (_, i) => {
      const angle = Math.PI / 2 - (i / 72) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 0.76, Math.sin(angle) * 0.76, 0);
    });
    well.timer.geometry.dispose();
    well.timer.geometry = new THREE.BufferGeometry().setFromPoints(points);
    const item = wellList.querySelector(`[data-well-time="${well.id}"]`);
    if (item) item.textContent = `${remaining(well, simTime).toFixed(1)}s`;
  }
}

function updateStatus() {
  const state = won ? 'FINISHED' : drifted ? 'HIT HAZARD' : paused ? 'READY' : wells.length ? 'IN FLIGHT' : 'COASTING';
  $('#stateLabel').innerHTML = `<span class="status-dot${drifted ? ' warning' : ''}"></span> ${state}`;
  $('#speed').textContent = `${Math.hypot(body.velocity.x, body.velocity.y).toFixed(2)} u/s`;
}

function resize() {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  const aspect = width / height;
  const visibleWidth = gameMode === 'maze' ? Math.max(27.5, 19 * aspect) : Math.max(21, 16 * aspect);
  const visibleHeight = visibleWidth / aspect;
  camera.left = -visibleWidth / 2;
  camera.right = visibleWidth / 2;
  camera.top = visibleHeight / 2;
  camera.bottom = -visibleHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
}

function eventWorld(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * 2 - 1;
  const y = 1 - (event.clientY - rect.top) / rect.height * 2;
  return { x: x * camera.right, y: y * camera.top };
}

function closestWell(point) {
  return wells.find((well) => Math.hypot(well.x - point.x, well.y - point.y) < 0.9);
}

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerDownAt = performance.now();
  pointer = { ...eventWorld(event), clientX: event.clientX, clientY: event.clientY };
});
renderer.domElement.addEventListener('pointermove', (event) => {
  pointer = { ...eventWorld(event), clientX: event.clientX, clientY: event.clientY };
});
renderer.domElement.addEventListener('pointerleave', () => { pointer = null; });
renderer.domElement.addEventListener('pointerup', (event) => {
  if (event.button !== 0 || !pointer) return;
  if (Math.hypot(event.clientX - pointer.clientX, event.clientY - pointer.clientY) > 15) return;
  if (performance.now() - pointerDownAt > 600) return;
  const point = eventWorld(event);
  placeWell(point.x, point.y);
});
renderer.domElement.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const well = closestWell(eventWorld(event));
  if (well) removeWell(well.id);
});

wellList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (button) removeWell(Number(button.dataset.remove));
});
strengthInput.addEventListener('input', () => {
  $('#strengthValue').textContent = strengthInput.value;
  for (const well of wells) well.strength = Number(strengthInput.value);
  updateForecast();
});
lifetimeInput.addEventListener('input', () => { $('#lifetimeValue').textContent = `${Number(lifetimeInput.value).toFixed(1)}s`; });
$('.segmented').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode]');
  if (!button) return;
  mode = button.dataset.mode;
  for (const tab of $('.segmented').children) tab.classList.toggle('selected', tab === button);
  $('#modeHelp').textContent = mode === 'fade' ? 'Pull weakens over the last 20% of a well’s life.' : 'Pull stays full strength, then vanishes instantly.';
  updateForecast();
});
$('#release').addEventListener('click', releaseAll);
$('#restart').addEventListener('click', reset);
$('#driftRestart').addEventListener('click', reset);
$('#winRestart').addEventListener('click', reset);
$('.game-modes').addEventListener('click', (event) => { const button = event.target.closest('[data-game]'); if (button) switchGame(button.dataset.game); });
pauseButton.addEventListener('click', togglePause);
function togglePause() {
  if (drifted || won) return;
  paused = !paused;
  pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  lastFrame = performance.now();
  updateStatus();
}
window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement) return;
  const key = event.key.toLowerCase();
  if (key === ' ') { event.preventDefault(); togglePause(); }
  if (key === 'r') reset();
  if (key === 'e') releaseAll();
});
window.addEventListener('resize', resize);

function frame(now) {
  requestAnimationFrame(frame);
  const elapsed = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  if (!paused && !drifted && !won) {
    accumulator += elapsed;
    while (accumulator >= STEP) {
      for (const expired of wells.filter((well) => remaining(well, simTime) <= 0)) removeWell(expired.id);
      const before = { x: body.position.x, y: body.position.y };
      const a = acceleration(body.position, wells, simTime, mode);
      body.applyForce(new CANNON.Vec3(a.x * body.mass, a.y * body.mass, 0));
      world.step(STEP);
      body.position.z = 0;
      body.velocity.z = 0;
      if (gameMode === 'maze') {
        capVelocity(body.velocity, SPEED_CAP);
        const impact = firstImpact(before, body.position);
        if (impact?.type === 'spike') { failRun(); break; }
        if (impact?.type === 'goal') { winRun(); break; }
      }
      simTime += STEP;
      accumulator -= STEP;
    }
    updateTrail();
    if (gameMode === 'maze') $('#runTime').textContent = `${simTime.toFixed(1)}s`;
    frameCount++;
    if (frameCount % 8 === 0) updateForecast();
    if (gameMode === 'sandbox' && (Math.abs(body.position.x) > camera.right + 1.5 || Math.abs(body.position.y) > camera.top + 1.5)) {
      drifted = true;
      driftOverlay.classList.remove('hidden');
    }
  }
  core.position.set(body.position.x, body.position.y, 2);
  blobLight.position.set(body.position.x, body.position.y, 3);
  const velocityAngle = Math.atan2(body.velocity.y, body.velocity.x);
  blob.rotation.z = velocityAngle;
  const speed = Math.hypot(body.velocity.x, body.velocity.y);
  blob.scale.x = 1.07 + Math.min(0.25, speed * 0.02);
  blob.scale.y = 0.93 - Math.min(0.12, speed * 0.009);
  blobHalo.rotation.z += elapsed * 0.15;
  updateWellVisuals();
  if (frameCount % 12 === 0 || paused || drifted) updateStatus();
  renderer.render(scene, camera);
}

mazeGroup.visible = true;
startingOrbit.visible = false;
resize();
reset();
requestAnimationFrame(frame);
