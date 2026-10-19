import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { STEP, acceleration, addWell, predict, remaining, wellPower } from './physics.js';
import { LEVEL, BLOB_RADIUS, SPEED_CAP, canPlaceWell, capVelocity, firstImpact, predictToImpact } from './level.js';
import './style.css';

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="scene" id="scene"></div>
  <header class="chrome"><div class="brand"><span class="brand-orbit" aria-hidden="true">◎</span> ORBIT LAB</div><div class="actions"><button id="restart" class="quiet-button" type="button" aria-label="Restart" title="Restart (R)">↺</button><button id="settingsButton" class="quiet-button" type="button" aria-label="Settings" aria-haspopup="dialog" aria-controls="settings" title="Settings">⚙</button></div></header>
  <div class="play-control"><button id="pause" class="primary-button" type="button">Start <span aria-hidden="true">↗</span></button></div>
  <div class="scene-caption" id="sceneCaption">PLACE A WELL · THEN START</div>
  <div class="death-flash" id="deathFlash"></div>
  <dialog id="settings" class="settings"><div class="settings-head"><div><span class="eyebrow">ORBIT LAB</span><h1>Settings</h1></div><button id="closeSettings" class="quiet-button" type="button" aria-label="Close settings">×</button></div>
    <p class="settings-intro">Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.</p>
    <div class="game-modes" role="group" aria-label="Game mode"><button class="selected" data-game="maze">Maze</button><button data-game="sandbox">Orbit</button></div>
    <div class="control-group"><div class="control-heading"><label for="strength">Gravity strength</label><output id="strengthValue">100</output></div><input id="strength" type="range" min="35" max="180" step="1" value="100"></div>
    <div class="control-group"><div class="control-heading"><label for="lifetime">Well lifetime</label><output id="lifetimeValue">8.0s</output></div><input id="lifetime" type="range" min="2" max="16" step="0.5" value="8"><p class="microcopy">New wells use this lifetime.</p></div>
    <div class="control-group"><div class="control-heading">How wells end</div><div class="segmented" role="group" aria-label="How wells end"><button class="selected" data-mode="fade">Fade out</button><button data-mode="snap">Snap off</button></div><p class="microcopy" id="modeHelp">Pull weakens over the last 20% of a well’s life.</p></div>
    <label class="toggle-row"><span>Show predicted path</span><input id="showForecast" type="checkbox"></label>
    <div class="settings-stats"><div>State <strong id="stateLabel">READY</strong></div><div>Attempts <strong id="attempts">1</strong></div><div>Time <strong id="runTime">0.0s</strong></div><div>Speed <strong id="speed">0.00 u/s</strong></div></div>
    <div class="active-heading"><span>Active wells</span><small id="wellCount">0 / 2</small></div><div class="well-list" id="wellList"></div><button id="release" class="release-button" type="button">Release all wells</button>
    <p class="settings-help">Tap open space to place a well. On desktop, right-click a well to remove it. Space starts or pauses · R restarts · E releases wells.</p>
  </dialog>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><button id="driftRestart" class="primary-button">Try again ↗</button></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card"><span class="eyebrow">COURSE COMPLETE</span><h2>Through the portal.</h2><p id="winStats"></p><button id="winRestart" class="primary-button">Try again ↗</button></div></div>
`;

const $ = (selector) => document.querySelector(selector);
const sceneElement = $('#scene');
const wellList = $('#wellList');
const strengthInput = $('#strength');
const lifetimeInput = $('#lifetime');
const settings = $('#settings');
const caption = $('#sceneCaption');
const showForecast = $('#showForecast');
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
const baseLine = new THREE.LineBasicMaterial({ color: 0x263b55, transparent: true, opacity: 0.10 });

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
const blobLight = new THREE.PointLight(0xff953d, 34, 16);
scene.add(blobLight);
const core = new THREE.Group();
const blob = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), new THREE.MeshBasicMaterial({ color: 0xfff4cd }));
core.add(blob);
function glowTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const glow = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  glow.addColorStop(0, 'rgba(189,255,247,.95)'); glow.addColorStop(.13, 'rgba(109,250,231,.72)'); glow.addColorStop(.35, 'rgba(58,215,225,.24)'); glow.addColorStop(1, 'rgba(58,215,225,0)');
  context.fillStyle = glow; context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}
const glowMap = glowTexture();
const fireCanvas = document.createElement('canvas'); fireCanvas.width = fireCanvas.height = 128;
const fireContext = fireCanvas.getContext('2d');
const fireGradient = fireContext.createRadialGradient(64, 64, 0, 64, 64, 64);
fireGradient.addColorStop(0, 'rgba(255,250,205,1)');
fireGradient.addColorStop(.16, 'rgba(255,193,78,.95)');
fireGradient.addColorStop(.38, 'rgba(255,83,20,.4)');
fireGradient.addColorStop(1, 'rgba(255,40,5,0)');
fireContext.fillStyle = fireGradient; fireContext.fillRect(0, 0, 128, 128);
const heroGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(fireCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
heroGlow.scale.set(2.4, 2.4, 1); heroGlow.position.z = .1; core.add(heroGlow);
core.position.z = 2;
scene.add(core);

// A bounded ember pool; particles drift behind the fireball without affecting physics.
const SPARK_COUNT = 128;
const sparks = Array.from({ length: SPARK_COUNT }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, duration: 1 }));
const sparkPositions = new Float32Array(SPARK_COUNT * 3);
const sparkHeat = new Float32Array(SPARK_COUNT);
const sparkGeometry = new THREE.BufferGeometry();
sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3).setUsage(THREE.DynamicDrawUsage));
sparkGeometry.setAttribute('heat', new THREE.BufferAttribute(sparkHeat, 1).setUsage(THREE.DynamicDrawUsage));
const sparkMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { pixelRatio: { value: renderer.getPixelRatio() } },
  vertexShader: 'attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}',
  fragmentShader: 'varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(1.,.12,.01),vec3(1.,.85,.35),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat);}',
});
const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial); sparkPoints.frustumCulled = false; scene.add(sparkPoints);
let sparkIndex = 0, sparkAccumulator = 0;
function clearSparks() { for (const spark of sparks) spark.life = 0; sparkHeat.fill(0); sparkGeometry.attributes.heat.needsUpdate = true; sparkAccumulator = 0; }
function updateSparks(dt) {
  sparkAccumulator += dt * 36;
  while (sparkAccumulator >= 1) {
    sparkAccumulator--;
    const spark = sparks[sparkIndex++ % SPARK_COUNT];
    const angle = Math.random() * Math.PI * 2;
    const scatter = .6 + Math.random() * 1.5;
    spark.x = body.position.x; spark.y = body.position.y;
    spark.vx = -body.velocity.x * .14 + Math.cos(angle) * scatter;
    spark.vy = -body.velocity.y * .14 + Math.sin(angle) * scatter;
    spark.duration = spark.life = .5 + Math.random() * 1.4;
  }
  for (let i = 0; i < SPARK_COUNT; i++) {
    const spark = sparks[i]; spark.life = Math.max(0, spark.life - dt);
    spark.x += spark.vx * dt; spark.y += spark.vy * dt;
    spark.vx *= Math.exp(-dt * 1.3); spark.vy *= Math.exp(-dt * 1.3);
    sparkPositions.set([spark.x, spark.y, 2.2], i * 3);
    sparkHeat[i] = spark.life / spark.duration;
  }
  sparkGeometry.attributes.position.needsUpdate = true; sparkGeometry.attributes.heat.needsUpdate = true;
}

// The archive is painted in world coordinates and stays until a deliberate reset.
const archiveCanvas = document.createElement('canvas');
archiveCanvas.width = 1536; archiveCanvas.height = 1064;
const archiveContext = archiveCanvas.getContext('2d');
const archiveTexture = new THREE.CanvasTexture(archiveCanvas);
archiveTexture.colorSpace = THREE.SRGBColorSpace;
const archive = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), new THREE.MeshBasicMaterial({ map: archiveTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
archive.position.z = 0.62; scene.add(archive);
let archiveHalfWidth = 13, archiveHalfHeight = 9;
function expandArchive(halfWidth, halfHeight) {
  const nextX = Math.max(archiveHalfWidth, halfWidth);
  const nextY = Math.max(archiveHalfHeight, halfHeight);
  if (nextX === archiveHalfWidth && nextY === archiveHalfHeight) return;
  const copy = document.createElement('canvas');
  copy.width = archiveCanvas.width; copy.height = archiveCanvas.height;
  copy.getContext('2d').drawImage(archiveCanvas, 0, 0);
  archiveContext.clearRect(0, 0, archiveCanvas.width, archiveCanvas.height);
  const w = archiveCanvas.width * archiveHalfWidth / nextX;
  const h = archiveCanvas.height * archiveHalfHeight / nextY;
  archiveContext.drawImage(copy, (archiveCanvas.width - w) / 2, (archiveCanvas.height - h) / 2, w, h);
  archiveHalfWidth = nextX; archiveHalfHeight = nextY;
  archive.scale.set(nextX / 13, nextY / 9, 1);
  archiveTexture.needsUpdate = true;
}
// Fixed-size buffers: soft ribbon replaces unsupported wide WebGL lines.
const TRAIL_CAPACITY = 640;
const trailSamples = Array.from({ length: TRAIL_CAPACITY }, () => ({ x: 0, y: 0, time: 0 }));
let trailStart = 0, trailCount = 0;
const trailPositions = new Float32Array(TRAIL_CAPACITY * 18);
const trailSides = new Float32Array(TRAIL_CAPACITY * 6);
const trailIntensity = new Float32Array(TRAIL_CAPACITY * 6);
const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3).setUsage(THREE.DynamicDrawUsage));
trailGeometry.setAttribute('side', new THREE.BufferAttribute(trailSides, 1));
trailGeometry.setAttribute('intensity', new THREE.BufferAttribute(trailIntensity, 1).setUsage(THREE.DynamicDrawUsage));
for (let i = 0; i < TRAIL_CAPACITY; i++) trailSides.set([-1, 1, -1, 1, 1, -1], i * 6);
trailGeometry.setDrawRange(0, 0);
const trail = new THREE.Mesh(trailGeometry, new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: 'attribute float side; attribute float intensity; varying float vSide; varying float vIntensity; void main(){vSide=side;vIntensity=intensity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'varying float vSide; varying float vIntensity; void main(){float glow=exp(-7.*vSide*vSide);float core=exp(-150.*vSide*vSide);gl_FragColor=vec4(mix(vec3(.25,.8,.85),vec3(.9,1.,.96),core),vIntensity*(glow*.48+core*.7));}',
}));
trail.frustumCulled = false;
trail.position.z = 0.72; scene.add(trail);
function clearTrail() { archiveContext.clearRect(0, 0, archiveCanvas.width, archiveCanvas.height); archiveTexture.needsUpdate = true; trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0); }
function archiveSegment(a, b) {
  const sx = archiveCanvas.width / (archiveHalfWidth * 2), sy = archiveCanvas.height / (archiveHalfHeight * 2);
  archiveContext.beginPath(); archiveContext.moveTo((a.x + archiveHalfWidth) * sx, (archiveHalfHeight - a.y) * sy); archiveContext.lineTo((b.x + archiveHalfWidth) * sx, (archiveHalfHeight - b.y) * sy);
  archiveContext.strokeStyle = 'rgba(80,226,222,.095)'; archiveContext.lineWidth = 2; archiveContext.lineCap = 'round'; archiveContext.stroke(); archiveTexture.needsUpdate = true;
}
const forecastMaterial = new THREE.LineDashedMaterial({ color: 0x92faff, transparent: true, opacity: 0.25, dashSize: 0.11, gapSize: 0.14 });
const forecast = new THREE.Line(new THREE.BufferGeometry(), forecastMaterial);
forecast.position.z = 0.15;
scene.add(forecast); forecast.visible = false;
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
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(rect.w, rect.h, 0.75, 4, 0.18), new THREE.MeshBasicMaterial({ color: 0x000000 }));
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
const portal = new THREE.Group(); portal.position.set(LEVEL.goal.x, LEVEL.goal.y, 1); mazeGroup.add(portal);
const portalAura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending, color: 0x91c8ff })); portalAura.scale.set(4.5, 4.5, 1); portal.add(portalAura);
const portalCore = new THREE.Mesh(new THREE.CircleGeometry(0.64, 64), new THREE.MeshBasicMaterial({ color: 0x081e39, transparent: true, opacity: 0.88, side: THREE.DoubleSide })); portal.add(portalCore);
for (let i = 0; i < 3; i++) { const loop = ring(LEVEL.goal.radius * (0.65 + i * 0.16), new THREE.LineBasicMaterial({ color: i === 0 ? 0xb1fff0 : 0x78afff, transparent: true, opacity: 0.78 - i * 0.18 })); loop.position.z = 0.2 + i * .02; portal.add(loop); }
let simTime = 0;
let accumulator = 0;
let lastFrame = performance.now();
let wells = [];
let nextWellId = 1;
let mode = 'fade';
let paused = true;
let runState = 'ready';
let resumeAfterSettings = false;
let drifted = false;
let frameCount = 0;
let pointer = null;
let pointerDownAt = 0;
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
  if (settings.open) return;
  if (gameMode === 'maze' && !canPlaceWell({ x, y })) return;
  const well = makeWell(x, y, Number(strengthInput.value), Number(lifetimeInput.value), simTime);
  const old = wells[0];
  wells = addWell(wells, well);
  if (old && !wells.includes(old)) disposeWell(old);
  redrawWellList();
  updateForecast();
  if (runState === 'ready') caption.textContent = 'TAP START TO RELEASE';
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
  clearTrail();
  clearSparks();
  drifted = false;
  won = false;
  paused = true; runState = 'ready';
  driftOverlay.classList.add('hidden');
  winOverlay.classList.add('hidden');
  $('#deathFlash').classList.remove('visible');
  pauseButton.innerHTML = 'Start <span aria-hidden="true">↗</span>';
  caption.textContent = gameMode === 'maze' ? 'PLACE A WELL · THEN START' : 'TAP START TO RELEASE';
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
  paused = true; runState = 'dead';
  $('#deathFlash').classList.add('visible');
  updateStatus();
  resetTimer = setTimeout(reset, 420);
}

function winRun() {
  if (won) return;
  won = true;
  paused = true; runState = 'won';
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
  $('.game-modes').querySelectorAll('button').forEach((button) => button.classList.toggle('selected', button.dataset.game === next));
  if (next === 'maze') attempts = 0;
  resize();
  reset();
}

function currentState() {
  return { x: body.position.x, y: body.position.y, vx: body.velocity.x, vy: body.velocity.y };
}

function updateForecast() {
  if (!showForecast.checked) return;
  const result = gameMode === 'maze' ? predictToImpact(currentState(), wells, simTime, 3, mode) : { points: predict(currentState(), wells, simTime, 5.5, mode, 7), impact: null };
  const points = result.points;

  forecast.geometry.dispose();
  forecast.geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
  forecast.computeLineDistances();
}

function updateTrail() {
  const point = { x: body.position.x, y: body.position.y, time: simTime };
  const sampleAt = (i) => trailSamples[(trailStart + i) % TRAIL_CAPACITY];
  const last = trailCount ? sampleAt(trailCount - 1) : null;
  if (!last || simTime - last.time >= 1 / 30) {
    if (last) archiveSegment(last, point);
    if (trailCount === TRAIL_CAPACITY) { trailStart = (trailStart + 1) % TRAIL_CAPACITY; trailCount--; }
    Object.assign(sampleAt(trailCount++), point);
  }
  while (trailCount > 1 && sampleAt(1).time < simTime - 20) { trailStart = (trailStart + 1) % TRAIL_CAPACITY; trailCount--; }
  for (let i = 1; i < trailCount; i++) {
    const a = sampleAt(i - 1), b = sampleAt(i);
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / length * .14, ny = (b.x - a.x) / length * .14;
    const offset = (i - 1) * 18;
    trailPositions.set([a.x-nx,a.y-ny,0,a.x+nx,a.y+ny,0,b.x-nx,b.y-ny,0,a.x+nx,a.y+ny,0,b.x+nx,b.y+ny,0,b.x-nx,b.y-ny,0], offset);
    trailIntensity.fill(Math.max(0, 1 - (simTime - b.time) / 20) ** 2, (i - 1) * 6, i * 6);
  }
  trailGeometry.attributes.position.needsUpdate = true;
  trailGeometry.attributes.intensity.needsUpdate = true;
  trailGeometry.setDrawRange(0, Math.max(0, trailCount - 1) * 6);
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
  const state = won ? 'FINISHED' : drifted ? 'LOST' : runState === 'ready' ? 'READY' : paused ? 'PAUSED' : 'IN FLIGHT';
  $('#stateLabel').textContent = state;
  $('#speed').textContent = `${Math.hypot(body.velocity.x, body.velocity.y).toFixed(2)} u/s`;
}

function resize() {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  const aspect = width / height;
  const visibleWidth = gameMode === 'maze' ? Math.max(28, 19 * aspect) : Math.max(21, 16 * aspect);
  const visibleHeight = visibleWidth / aspect;
  camera.left = -visibleWidth / 2;
  camera.right = visibleWidth / 2;
  camera.top = visibleHeight / 2;
  camera.bottom = -visibleHeight / 2;
  camera.updateProjectionMatrix();
  expandArchive(camera.right + 2, camera.top + 2);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  sparkMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
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
  if (event.button !== 0 || pointer) return;
  pointerDownAt = performance.now();
  pointer = { id: event.pointerId, clientX: event.clientX, clientY: event.clientY };
});
renderer.domElement.addEventListener('pointercancel', (event) => { if (pointer?.id === event.pointerId) pointer = null; });
renderer.domElement.addEventListener('pointerup', (event) => {
  const down = pointer; pointer = null;
  if (event.button !== 0 || !down || down.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - down.clientX, event.clientY - down.clientY) > 15) return;
  if (performance.now() - pointerDownAt > 600) return;
  const point = eventWorld(event); placeWell(point.x, point.y);
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
showForecast.addEventListener('change', () => { forecast.visible = showForecast.checked; updateForecast(); });
$('#settingsButton').addEventListener('click', () => { resumeAfterSettings = runState === 'running'; if (resumeAfterSettings) togglePause(); settings.showModal(); });
$('#closeSettings').addEventListener('click', () => settings.close());
settings.addEventListener('close', () => { if (resumeAfterSettings && runState === 'paused' && !drifted && !won) togglePause(); resumeAfterSettings = false; });
$('#restart').addEventListener('click', reset);
$('#driftRestart').addEventListener('click', reset);
$('#winRestart').addEventListener('click', reset);
$('.game-modes').addEventListener('click', (event) => { const button = event.target.closest('[data-game]'); if (button) switchGame(button.dataset.game); });
pauseButton.addEventListener('click', togglePause);
function togglePause() {
  if (drifted || won || settings.open) return;
  paused = !paused;
  runState = paused ? 'paused' : 'running';
  pauseButton.innerHTML = paused ? 'Resume <span aria-hidden="true">↗</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  caption.textContent = paused ? 'PAUSED' : '';
  lastFrame = performance.now(); updateStatus();
}
window.addEventListener('keydown', (event) => {
  if (settings.open || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const key = event.key.toLowerCase();
  if (key === ' ' && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); togglePause(); }
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
      drifted = true; paused = true; runState = 'dead'; updateStatus();
      driftOverlay.classList.remove('hidden');
    }
  }
  core.position.set(body.position.x, body.position.y, 2);
  blobLight.position.set(body.position.x, body.position.y, 3);
  const pulse = 1 + Math.sin(now * .014) * .05;
  blob.scale.setScalar(pulse);
  heroGlow.scale.setScalar(2.4 + Math.sin(now * .011) * .12);
  if (!paused && !drifted && !won) updateSparks(elapsed);
  portal.rotation.z += elapsed * 0.35; portalAura.material.opacity = 0.35 + Math.sin(now * 0.002) * 0.1;
  updateWellVisuals();
  if (frameCount % 12 === 0 || paused || drifted) updateStatus();
  renderer.render(scene, camera);
}

mazeGroup.visible = true;
startingOrbit.visible = false;
resize();
reset();
requestAnimationFrame(frame);
