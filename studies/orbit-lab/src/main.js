import { primaryControl } from './controls.js';
import { createStudyVisual } from './study-visuals.js';
import { OpticsStudy, OPTICAL_STUDIES } from './optics.js';
import { guideShape, channelWalls, constrainChannel } from './guide.js';
import { Experiment } from './experiment.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { STEP, acceleration, addWell, predict, remaining, wellPower } from './physics.js';
import { BLOB_RADIUS, SPEED_CAP, canPlaceWell, capVelocity, firstImpact, predictToImpact, mazeAcceleration } from './level.js';
import './style.css';
import { OrbitAudio } from './audio.js';
import { drawFinishArt } from './finish-art.js';
import { DEMOS, getDemo, DEFAULT_WELL_STRENGTH, gravityExchange, plateActivated } from './demos.js';
import { createBurnout, stepBurnout, cameraFrame, PICKUP_LIFE } from './burnout.js';
import { followFrame, followPosition } from './follow-camera.js';
import { CAMPAIGN, campaignPointAllowed, canPlaceCampaignWell, createCampaign, getCampaignLevel, nextCampaignLevel, stepCampaign } from './campaign.js';
import { BEST_GATES_KEY, SOUND_GATE_COLORS, betterGateMask, createSoundGates, gateCount, gatePattern, stepSoundGates, validateBestGates } from './sound-gates.js';
const route = new URLSearchParams(location.search);
let campaignMode = ['1', '2'].includes(route.get('campaign')) && !route.has('demo');
let campaignLevelId = campaignMode ? Number(route.get('campaign')) : 1;
let activeDemo = campaignMode ? getCampaignLevel(campaignLevelId) : getDemo(route.get('demo'));
let activeLevel = structuredClone(activeDemo.level);
let heroGravity = activeDemo.heroGravity;
let gateOpen = false;
const audio = new OrbitAudio();
let lastSoundWellTime = 0;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="scene" id="scene"><canvas id="minimap" width="360" height="203" role="img" aria-label="Map showing walls, the portal, wells, the glowing dot, and the current view"></canvas></div>
  <header class="chrome"><div class="brand"><span class="brand-orbit" aria-hidden="true">◎</span> ORBIT LAB</div><div class="actions"><button id="pause" class="quiet-button" type="button" aria-label="Pause" title="Pause (P)" disabled>Ⅱ</button><button id="galleryButton" class="quiet-button" type="button" aria-label="Demo gallery" title="Demo gallery">⊞</button><button id="restart" class="quiet-button" type="button" aria-label="Restart" title="Restart (R)">↺</button><button id="settingsButton" class="quiet-button" type="button" aria-label="Settings" aria-haspopup="dialog" aria-controls="settings" title="Settings">⚙</button></div></header>
  <div class="play-control"><button id="primaryAction" class="primary-button" type="button" title="Primary action (Space)">Start</button></div>
  <div class="scene-caption" id="sceneCaption">PLACE A WELL · THEN START</div>
  <div class="death-flash" id="deathFlash"></div>
  <dialog id="settings" class="settings"><div class="settings-head"><div><span class="eyebrow">ORBIT LAB</span><h1>Settings</h1></div><button id="closeSettings" class="quiet-button" type="button" aria-label="Close settings">×</button></div>
    <p class="settings-intro">Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.</p>
    <div class="game-modes"><button id="homeFromSettings" type="button">Home</button><button id="browseDemos" type="button">Browse studies</button></div><p id="activeDemoLabel" class="microcopy"></p>
    <div class="control-group"><div class="control-heading"><label for="strength">Gravity strength</label><output id="strengthValue">70</output></div><input id="strength" type="range" min="35" max="180" step="1" value="70"></div>
    <div class="control-group"><div class="control-heading"><label for="heroGravity">Dot gravity</label><output id="heroGravityValue">0</output></div><input id="heroGravity" type="range" min="0" max="30" step="1" value="0"><p id="heroGravityHelp" class="microcopy">Attracts loose moons, with a small reaction on the dot.</p></div>
    <label class="toggle-row">Sound<input id="soundEnabled" type="checkbox" checked></label>
    <div class="control-group"><div class="control-heading"><label for="lifetime">Well lifetime</label><output id="lifetimeValue">8.0s</output></div><input id="lifetime" type="range" min="2" max="16" step="0.5" value="8"><p class="microcopy">New wells use this lifetime.</p></div>
    <div class="control-group"><div class="control-heading">How wells end</div><div class="segmented" role="group" aria-label="How wells end"><button class="selected" data-mode="fade">Fade out</button><button data-mode="snap">Snap off</button></div><p class="microcopy" id="modeHelp">Pull weakens over the last 20% of a well’s life.</p></div>
    <label class="toggle-row"><span>Show predicted path</span><input id="showForecast" type="checkbox"></label><p id="forecastHelp" class="microcopy"></p>
    <div class="settings-stats"><div>State <strong id="stateLabel">READY</strong></div><div>Attempts <strong id="attempts">1</strong></div><div>Time <strong id="runTime">0.0s</strong></div><div>Speed <strong id="speed">0.00 u/s</strong></div></div>
    <div class="active-heading"><span>Active wells</span><small id="wellCount">0 / 2</small></div><div class="well-list" id="wellList"></div><button id="release" class="release-button" type="button">Release all wells</button>
    <p class="settings-help">Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R restarts · E removes oldest / releases capture · 1 / 2 remove a specific well.</p>
  </dialog>
  <div class="demo-note" id="demoNote"><strong id="demoTitle"></strong><span id="demoObjective"></span><div id="resourceHud" class="resource-hud hidden"><div class="resource-top"><span>LIGHT</span><span id="resourceValue">60%</span><span id="gateStatus">GATE OPEN</span></div><div class="resource-track"><i id="resourceFill"></i><b></b><b></b></div></div><div id="campaignGateHud" class="campaign-gate-hud hidden" aria-live="polite">♪ <span id="campaignGateCount">0/3 gates</span></div></div>
  <dialog id="gallery" class="gallery"><div class="gallery-heading"><div><span class="eyebrow">ORBIT LAB / MECHANICS GALLERY</span><h1>World studies.</h1><p>One new rule at a time. Experiments in gravity, light, and sound.</p></div><div class="gallery-actions"><button id="homeFromGallery" class="quiet-button" aria-label="Home" title="Home">⌂</button><button id="closeGallery" class="quiet-button" aria-label="Close gallery"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div><nav id="demoCategories" class="demo-categories" aria-label="Study categories"></nav><div class="demo-grid" id="demoGrid"></div><p class="gallery-footer">Every study starts paused. Place a well, then Start. Wells now begin at strength 70; settings let you compare.</p></dialog>
  <div id="home" class="home-overlay hidden"><div class="home-card"><span class="eyebrow">ORBIT LAB</span><h1>A little light in a large world.</h1><p>Draw a path with temporary gravity. Keep your light alive until you reach the portal.</p><button id="startCampaign" class="primary-button" type="button">Campaign ↗</button><button id="studyHome" class="home-secondary" type="button">Studies</button></div></div>
  <div id="levelSelect" class="home-overlay hidden"><div class="home-card level-select-card"><span class="eyebrow">CAMPAIGN / LEVELS</span><h1>Choose a crossing.</h1><div class="level-cards"><button class="level-card" data-campaign-level="1" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C40 39 65 32 103 32 S130 30 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/><circle cx="65" cy="33" r="6" fill="none" stroke="#7de6df"/></svg><span>01 / LIGHT & DISTANCE</span><strong>The long crossing</strong><small>A clear chamber. Keep the fire alive to reach the far portal.</small><em data-complete="1"></em><span data-gate-best="1"></span></button><button class="level-card" data-campaign-level="2" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C39 39 50 58 80 58 S117 32 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="85" cy="28" r="16" fill="#ff8a32"/><circle cx="85" cy="28" r="24" fill="none" stroke="#ff8a32" opacity=".4"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/></svg><span>02 / GRAVITY & DANGER</span><strong>The heavy neighbor</strong><small>A giant ember bends your path. Keep outside its fire.</small><em data-complete="2"></em><span data-gate-best="2"></span></button></div><button id="levelsBack" class="home-secondary" type="button">Back home</button></div></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><div class="result-actions"><button id="driftRestart" class="primary-button">Try again ↗</button><button id="driftHome" class="home-secondary" type="button">Home</button></div></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card trail-result"><span class="eyebrow" id="resultEyebrow">COURSE COMPLETE</span><h2 id="resultTitle">Your orbit.</h2><canvas id="winArtwork" width="1280" height="720" role="img" aria-label="The complete glowing trail drawn during your run"></canvas><p id="winStats"></p><p id="winGateStats" class="gate-result hidden"></p><div class="result-actions"><button id="winRestart" class="primary-button">Fly again ↗</button><button id="winHome" class="home-secondary" type="button">Home</button></div></div></div>
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sceneElement.appendChild(renderer.domElement);
const minimap = $('#minimap');
const minimapContext = minimap.getContext('2d');

const scene = new THREE.Scene();
const experiment = new Experiment(scene, audio);
const optics = new OpticsStudy(scene);
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

scene.add(new THREE.AmbientLight(0xaacadd, 1.2));
// A real lit backdrop receives the moving walls' shadows.
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x2c4350, roughness: 1, metalness: 0 }));
floor.position.z = -.9;
floor.receiveShadow = true;
scene.add(floor);
const blobLight = new THREE.PointLight(0x66e9f2, 85, 50, 1.5);
blobLight.castShadow = true;
blobLight.shadow.mapSize.set(window.innerWidth <= 700 ? 512 : 1024, window.innerWidth <= 700 ? 512 : 1024);
blobLight.shadow.camera.near = .1;
blobLight.shadow.camera.far = 50;
blobLight.shadow.bias = -.0003;
blobLight.shadow.normalBias = .015;
scene.add(blobLight);
const core = new THREE.Group();
const blob = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), new THREE.MeshBasicMaterial({ color: 0xdffff8 }));
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
fireGradient.addColorStop(0, 'rgba(225,255,249,1)');
fireGradient.addColorStop(.16, 'rgba(102,233,242,.95)');
fireGradient.addColorStop(.38, 'rgba(64,204,217,.4)');
fireGradient.addColorStop(1, 'rgba(64,204,217,0)');
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
  fragmentShader: 'varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(.25,.8,.85),vec3(.9,1.,.96),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat);}',
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
function clearTrail() { archiveContext.clearRect(0, 0, archiveCanvas.width, archiveCanvas.height); archiveHalfWidth = 13; archiveHalfHeight = 9; archive.scale.set(1, 1, 1); archiveTexture.needsUpdate = true; trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0); }
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
const wallBodies = [], wallMeshes = [], hazardGroups = [];
function createWalls(level) {
 for(const profile of level.channel ? channelWalls(level.channel) : []) {
  const shape=new THREE.Shape(profile.map(p=>new THREE.Vector2(p.x,p.y)));
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:4,bevelEnabled:false,steps:1});geometry.translate(0,0,-1);
  const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}));mesh.castShadow=true;wallMeshes.push(mesh);mazeGroup.add(mesh);
 }

 for (const profile of level.guides || []) {
  const wall = new CANNON.Body({mass:0,material:wallMaterial,shape:guideShape(profile)});world.addBody(wall);wallBodies.push(wall);
  const shape = new THREE.Shape(profile.map(p=>new THREE.Vector2(p.x,p.y)));
  const geometry = new THREE.ExtrudeGeometry(shape,{depth:4,bevelEnabled:false,steps:1});geometry.translate(0,0,-1);
  const mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}));mesh.castShadow=true;wallMeshes.push(mesh);mazeGroup.add(mesh);
 }

for (const rect of level.walls) {
  const wall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Box(new CANNON.Vec3(rect.w / 2, rect.h / 2, 0.7)) });
  wall.position.set(rect.x, rect.y, 0);
  world.addBody(wall);
  wall.isGate = !!rect.gate; wallBodies.push(wall);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(rect.w, rect.h, 4, 4, 0.18), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  // Span below the floor and above the lights: no light can pass over a wall end.
  mesh.position.set(rect.x, rect.y, 1);
  mesh.castShadow = true;
  mesh.userData.gate = !!rect.gate; wallMeshes.push(mesh); mazeGroup.add(mesh);
}
}
const hazardSparks = [];
const emberMap = new THREE.CanvasTexture(fireCanvas);
// Warm texture separate from the cyan hero and portal.
const emberCanvas = document.createElement('canvas'); emberCanvas.width = emberCanvas.height = 128;
const emberContext = emberCanvas.getContext('2d');
const emberGradient = emberContext.createRadialGradient(64, 64, 0, 64, 64, 64);
emberGradient.addColorStop(0, 'rgba(255,170,85,1)'); emberGradient.addColorStop(.2, 'rgba(255,143,40,.65)'); emberGradient.addColorStop(1, 'rgba(255,70,10,0)');
emberContext.fillStyle = emberGradient; emberContext.fillRect(0, 0, 128, 128);
emberMap.image = emberCanvas; emberMap.needsUpdate = true;
function createHazards(level) {
for (const spike of level.spikes) {
  const group = new THREE.Group(); group.position.set(spike.x, spike.y, 1.2); mazeGroup.add(group); hazardGroups.push(group);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.22, 20, 12), new THREE.MeshBasicMaterial({ color: 0xff7a24 })); group.add(dot);
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberMap, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending })); aura.scale.set(1.35, 1.35, 1); group.add(aura);
  const light = new THREE.PointLight(0xff8a32, 4, 4, 2); light.position.z = -.1;
  light.castShadow = true; light.shadow.mapSize.set(256, 256); light.shadow.camera.near = .1; light.shadow.camera.far = 4; light.shadow.bias = -.0003;
  group.add(light);
  const positions = new Float32Array(18 * 3), heat = new Float32Array(18);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('heat', new THREE.BufferAttribute(heat, 1).setUsage(THREE.DynamicDrawUsage));
  const material = sparkMaterial.clone();
  material.fragmentShader = 'varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(1.,.2,.02),vec3(1.,.72,.2),vHeat),pow(1.-r,2.)*vHeat*.65);}';
  const points = new THREE.Points(geometry, material); points.frustumCulled = false; group.add(points);
  hazardSparks.push({ positions, heat, geometry, material });
}
}
function updateHazardSparks() {
  for (const emitter of hazardSparks) {
    emitter.material.uniforms.pixelRatio.value = renderer.getPixelRatio();
    for (let i = 0; i < 18; i++) {
      const age = (simTime * .75 + i / 18) % 1;
      const angle = i * 2.39996;
      const distance = .15 + age * (.3 + (i % 4) * .08);
      emitter.positions.set([Math.cos(angle) * distance, Math.sin(angle) * distance, .2], i * 3);
      emitter.heat[i] = (1 - age) ** 2;
    }
    emitter.geometry.attributes.position.needsUpdate = true; emitter.geometry.attributes.heat.needsUpdate = true;
  }
}
const portal = new THREE.Group(); portal.position.set(activeLevel.goal.x, activeLevel.goal.y, 1); mazeGroup.add(portal);
const portalAura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending, color: 0x91c8ff })); portalAura.scale.set(4.5, 4.5, 1); portal.add(portalAura);
const portalCore = new THREE.Mesh(new THREE.CircleGeometry(0.64, 64), new THREE.MeshBasicMaterial({ color: 0x081e39, transparent: true, opacity: 0.88, side: THREE.DoubleSide })); portal.add(portalCore);
for (let i = 0; i < 3; i++) { const loop = ring(0.65 + i * 0.16, new THREE.LineBasicMaterial({ color: i === 0 ? 0xb1fff0 : 0x78afff, transparent: true, opacity: 0.78 - i * 0.18 })); loop.position.z = 0.2 + i * .02; portal.add(loop); }
const portalLight = new THREE.PointLight(0xa66bff, 8, 6, 2);
portalLight.position.z = .1; portalLight.castShadow = true;
portalLight.shadow.mapSize.set(256, 256); portalLight.shadow.camera.near = .1; portalLight.shadow.camera.far = 6; portalLight.shadow.bias = -.0003;
portal.add(portalLight);
const portalSparkPositions = new Float32Array(32 * 3), portalSparkHeat = new Float32Array(32);
const portalSparkGeometry = new THREE.BufferGeometry();
portalSparkGeometry.setAttribute('position', new THREE.BufferAttribute(portalSparkPositions, 3).setUsage(THREE.DynamicDrawUsage));
portalSparkGeometry.setAttribute('heat', new THREE.BufferAttribute(portalSparkHeat, 1).setUsage(THREE.DynamicDrawUsage));
const portalSparkMaterial = sparkMaterial.clone();
portalSparkMaterial.fragmentShader = 'varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(.4,.12,1.),vec3(.85,.6,1.),vHeat),pow(1.-r,2.)*vHeat);}';
const portalSparkPoints = new THREE.Points(portalSparkGeometry, portalSparkMaterial); portalSparkPoints.frustumCulled = false; portal.add(portalSparkPoints);
function updatePortalSparks() {
  portalSparkMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
  for (let i = 0; i < 32; i++) {
    const age = (simTime * .5 + i / 32) % 1, angle = i * 2.39996 + age * .9;
    const radius = .8 + age * .8;
    portalSparkPositions.set([Math.cos(angle) * radius, Math.sin(angle) * radius, .4], i * 3);
    portalSparkHeat[i] = Math.sin(age * Math.PI);
  }
  portalSparkGeometry.attributes.position.needsUpdate = true; portalSparkGeometry.attributes.heat.needsUpdate = true;
}
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
let gameMode = activeDemo.sandbox ? 'sandbox' : 'maze';
let attempts = 0;
let won = false;
let resetTimer = null;
let burnout = null;
let campaign = null;
let soundGates = null;
let wellsUsed = 0;
let homeOpen = false;
let visitedBounds = null;
const completionKey = 'orbit-lab-campaign-complete-v1';
let completedLevels = (() => { try { return new Set(JSON.parse(localStorage.getItem(completionKey) || '[]').filter(id => [1, 2].includes(id))); } catch { return new Set(); } })();
function markLevelComplete(id) { completedLevels.add(id); try { localStorage.setItem(completionKey, JSON.stringify([...completedLevels])); } catch {} }
let bestGates = (() => { try { return validateBestGates(JSON.parse(localStorage.getItem(BEST_GATES_KEY) || '{}')); } catch { return {}; } })();
function saveBestGates(id, mask) {
  const best = betterGateMask(bestGates[id], mask);
  if (best === bestGates[id]) return;
  bestGates = { ...bestGates, [id]: best };
  try { localStorage.setItem(BEST_GATES_KEY, JSON.stringify(bestGates)); } catch {}
}
function appendGatePatternIcons(element, mask) {
  const names = ['Cyan bass', 'Violet offbeat', 'Gold chime'];
  const icons = document.createElement('span');
  icons.className = 'gate-pattern-icons';
  icons.setAttribute('role', 'img');
  icons.setAttribute('aria-label', names.map((name, id) => `${name} ${mask & (1 << id) ? 'acquired' : 'not acquired'}`).join(', '));
  names.forEach((_, id) => {
    const icon = document.createElement('i');
    icon.style.setProperty('--gate-color', SOUND_GATE_COLORS[id]);
    icon.classList.toggle('acquired', !!(mask & (1 << id)));
    icons.append(icon);
  });
  element.append(' ', icons);
}
function setHomeOpen(open, screen = 'home') {
  homeOpen = open;
  $('#home').classList.toggle('hidden', !open || screen !== 'home');
  $('#levelSelect').classList.toggle('hidden', !open || screen !== 'levels');
  for (const selector of ['.chrome', '.scene', '.play-control']) $(selector).inert = open;
  if (open) (screen === 'levels' ? $('[data-campaign-level="1"]') : $('#startCampaign')).focus();
}
const pickupGroup = new THREE.Group(); scene.add(pickupGroup);
const pickupMeshes = new Map();
const campaignGateGroup = new THREE.Group(); scene.add(campaignGateGroup);
const campaignGateMeshes = [];
let gateFrame = null;

function rebuildCampaignGates() {
  for (const mesh of campaignGateMeshes) disposeObject(mesh);
  campaignGateMeshes.length = 0;
  if (!campaignMode) return;
  for (const gate of activeDemo.soundGates) {
    const group = new THREE.Group(); group.position.set(gate.x, gate.y, 1.5);
    const color = new THREE.Color(SOUND_GATE_COLORS[gate.id]);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.set(3.5, 3.5, 1);
    const outer = ring(gate.radius, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .88 }));
    const inner = ring(gate.radius * .72, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .37 }));
    group.add(halo, outer, inner); campaignGateGroup.add(group);
    campaignGateMeshes.push(group);
  }
}
function updateCampaignGates() {
  for (const gate of activeDemo.soundGates || []) {
    const group = campaignGateMeshes[gate.id]; if (!group) continue;
    const acquired = !!(soundGates?.mask & (1 << gate.id));
    const pulse = 1 + (acquired ? .08 : .035) * Math.sin(simTime * Math.PI * 8);
    group.scale.setScalar(pulse);
    group.children[0].material.opacity = acquired ? .13 : .32;
    group.children[1].material.opacity = acquired ? .32 : .88;
    group.children[2].material.opacity = acquired ? .17 : .37;
  }
}

function makeWell(x, y, strength, lifetime, createdAt) {
  const id = nextWellId++;
  const color = id % 2 ? blue : purple;
  const group = new THREE.Group();
  group.position.set(x, y, activeLevel.channel ? 4 : 1);
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
  if (settings.open || gallery.open || homeOpen) return;
  if (campaignMode && !canPlaceCampaignWell(wellsUsed)) return;
  if (gameMode === 'maze' && !(campaignMode ? campaignPointAllowed({ x, y }, activeLevel) : canPlaceWell({ x, y }, activeLevel))) return;
  const well = makeWell(x, y, Number(strengthInput.value), Number(lifetimeInput.value), simTime);
  if (campaignMode) wellsUsed++;
  audio.placement(); lastSoundWellTime = simTime;
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
  audio.reset(); lastSoundWellTime = 0;
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  releaseAll();
  rebuildExperiment();
  wellsUsed = 0;
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
  caption.textContent = gameMode === 'maze' ? 'PLACE A WELL · THEN START' : 'TAP START TO RELEASE';
  body.force.setZero();
  body.angularVelocity.setZero();
  if (gameMode === 'maze') {
    body.position.set(activeLevel.spawn.x, activeLevel.spawn.y, 0);
    body.velocity.set(activeLevel.spawn.vx, activeLevel.spawn.vy, 0);
    attempts += 1;
    $('#attempts').textContent = attempts;
    if (campaignMode) visitedBounds = { minX: body.position.x, maxX: body.position.x, minY: body.position.y, maxY: body.position.y };
  } else {
    body.position.set(4, 0, 0);
    const selectedStrength = Number(strengthInput.value);
    body.velocity.set(0, Math.sqrt(selectedStrength * 4 * 4 / Math.pow(4 * 4 + 0.75 * 0.75, 1.5)), 0);
    wells = [makeWell(0, 0, selectedStrength, Number(lifetimeInput.value), 0)];
  }
  resize();
  updateCamera(0, true);
  $('#runTime').textContent = '0.0s';
  redrawWellList();
  updateForecast();
  updateStatus();
  lastFrame = performance.now();
}

function failRun(reason = 'darkness') {
  if (drifted || won) return;
  audio.death();
  audio.stopHeartbeat();
  drifted = true;
  paused = true; runState = 'dead';
  $('#deathFlash').classList.add('visible');
  updateStatus();
  if (campaignMode) {
    showRunArt(false, reason);
    return;
  }
  resetTimer = setTimeout(reset, 420);
}

function showRunArt(success, reason = 'darkness') {
  if (campaignMode) saveBestGates(campaignLevelId, soundGates?.mask || 0);
  const last = trailCount ? trailSamples[(trailStart + trailCount - 1) % TRAIL_CAPACITY] : activeLevel.spawn;
  archiveSegment(last, body.position);
  const bounds = campaignMode ? {
    minX: Math.min(visitedBounds.minX, activeLevel.spawn.x, body.position.x) - 6,
    maxX: Math.max(visitedBounds.maxX, activeLevel.spawn.x, body.position.x) + 6,
    minY: Math.min(visitedBounds.minY, activeLevel.spawn.y, body.position.y) - 6,
    maxY: Math.max(visitedBounds.maxY, activeLevel.spawn.y, body.position.y) + 6,
  } : activeLevel.bounds;
  drawFinishArt($('#winArtwork'), archiveCanvas, archiveHalfWidth, archiveHalfHeight, bounds, activeLevel.spawn, body.position);
  $('#resultEyebrow').textContent = success ? 'COURSE COMPLETE' : 'SIGNAL LOST';
  $('#resultTitle').textContent = campaignMode ? success ? 'Light carried home.' : reason === 'manual' ? 'Journey ended.' : reason === 'hazard' ? 'Taken by the ember.' : 'The light went out.' : 'Your orbit.';
  $('#winStats').textContent = `${simTime.toFixed(1)} seconds  ·  ${attempts} attempt${attempts === 1 ? '' : 's'}${campaignMode ? `  ·  ${wellsUsed} well${wellsUsed === 1 ? '' : 's'} placed` : ''}`;
  $('#winGateStats').classList.toggle('hidden', !campaignMode);
  if (campaignMode) {
    $('#winGateStats').textContent = `Gates ${gateCount(soundGates.mask)}/3 · ${gatePattern(soundGates.mask)}`;
    appendGatePatternIcons($('#winGateStats'), soundGates.mask);
  }
  $('#winRestart').textContent = campaignMode ? success ? 'Continue ↗' : 'Retry ↗' : 'Fly again ↗';
  winOverlay.classList.remove('hidden');
}

function winRun() {
  if (won) return;
  audio.portal();
  audio.stopHeartbeat();
  won = true;
  paused = true; runState = 'won';
  if (campaignMode) markLevelComplete(campaignLevelId);
  showRunArt(true);
  updateStatus();
}

function selectDemo(id) {
  campaignMode = false; setHomeOpen(false);
  activeDemo = getDemo(id); gameMode = activeDemo.sandbox ? 'sandbox' : 'maze';
  heroGravity = activeDemo.heroGravity;
  strengthInput.value = DEFAULT_WELL_STRENGTH; $('#strengthValue').textContent = DEFAULT_WELL_STRENGTH;
  $('#heroGravity').value = heroGravity; $('#heroGravityValue').textContent = heroGravity;
  attempts = 0; resumeAfterSettings = false;
  const url = new URL(location.href); url.searchParams.delete('campaign'); url.searchParams.set('demo', activeDemo.id); history.replaceState(null, '', url);
  resize(); reset();
}

function selectCampaign(levelId = 1) {
  campaignMode = true; setHomeOpen(false);
  activeDemo = getCampaignLevel(levelId); campaignLevelId = activeDemo.id; gameMode = 'maze'; heroGravity = 0;
  strengthInput.value = DEFAULT_WELL_STRENGTH; $('#strengthValue').textContent = DEFAULT_WELL_STRENGTH;
  attempts = 0; resumeAfterSettings = false; resumeAfterGallery = false;
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.set('campaign', String(campaignLevelId)); history.replaceState(null, '', url);
  resize(); reset();
}

const moonGroup = new THREE.Group(); scene.add(moonGroup);
const moonEntries = [];
let plateRing = null;
function disposeObject(object) {
  object.parent?.remove(object);
  object.traverse(child => { child.geometry?.dispose(); child.material?.dispose(); child.shadow?.map?.dispose(); });
}
function setGateOpen(open) {
  if (gateOpen === open) return;
  gateOpen = open;
  for (const wall of wallBodies) if (wall.isGate) {
    if (open && world.bodies.includes(wall)) world.removeBody(wall);
    if (!open && !world.bodies.includes(wall)) world.addBody(wall);
  }
  for (const mesh of wallMeshes) if (mesh.userData.gate) mesh.visible = !open;
  activeLevel.walls = activeDemo.level.walls.filter(wall => !wall.gate || !open).map(wall => ({ ...wall }));
  if (gateFrame) for (const marker of gateFrame.children) marker.material.opacity = open ? .38 : .75;
}
function syncPickups() {
  const pickups = campaign?.pickups || burnout?.pickups || [];
  const activeIds = new Set(pickups.map(pickup => pickup.id));
  for (const [id, mesh] of pickupMeshes) if (!activeIds.has(id)) { disposeObject(mesh); pickupMeshes.delete(id); }
  for (const pickup of pickups) {
    if (!pickupMeshes.has(pickup.id)) {
      const mesh = createStudyVisual(.22, 0xffe4a8);
      mesh.position.set(pickup.x, pickup.y, 1.65);
      pickupGroup.add(mesh); pickupMeshes.set(pickup.id, mesh);
    }
    const mesh = pickupMeshes.get(pickup.id);
    const left = Math.max(0, (campaign ? CAMPAIGN.pickupLife : PICKUP_LIFE) - (simTime - pickup.createdAt));
    const fade = Math.min(1, left / 3);
    mesh.userData.animate(simTime, renderer.getPixelRatio());
    mesh.userData.setFade(fade);
    mesh.scale.setScalar(.96 + .06 * Math.sin(simTime * 3 + pickup.id));
  }
}
function updateResourceHud() {
  const hud = $('#resourceHud'); hud.classList.toggle('hidden', !burnout && !campaign);
  hud.classList.toggle('campaign-resource', !!campaign);
  $('#campaignGateHud').classList.toggle('hidden', !campaign);
  if (!burnout && !campaign) return;
  const energy = campaign?.energy ?? burnout.energy;
  $('#resourceValue').textContent = `${Math.round(energy * 100)}%`;
  $('#resourceFill').style.width = `${energy * 100}%`;
  $('#gateStatus').textContent = campaign ? energy > 0 ? `${wellsUsed} WELL${wellsUsed === 1 ? '' : 'S'}` : `DARK ${Math.ceil(campaign.graceLeft)}s` : burnout.pendingClose ? 'GATE CLOSING' : burnout.gateOpen ? 'GATE OPEN' : 'GATE CLOSED';
  if (campaign) $('#campaignGateCount').textContent = `${gateCount(soundGates?.mask || 0)}/3 gates`;
}
function rebuildExperiment() {
  activeLevel = structuredClone(activeDemo.level); gateOpen = false;
  burnout = activeDemo.mechanic === 'burnout' ? createBurnout() : null;
  campaign = campaignMode ? createCampaign() : null;
  soundGates = campaignMode ? createSoundGates() : null;
  rebuildCampaignGates();
  for (const mesh of pickupMeshes.values()) disposeObject(mesh);
  pickupMeshes.clear();
  if (gateFrame) disposeObject(gateFrame);
  gateFrame = null;
  experiment.reset(activeDemo);
  if (burnout || campaign) experiment.brightness = (campaign || burnout).energy;
  optics.reset(activeDemo);
  blobLight.color.setHex(OPTICAL_STUDIES.has(activeDemo.mechanic)?0xffffff:0x66e9f2);
  for (const wall of wallBodies) world.removeBody(wall);
  wallBodies.length = 0;
  for (const mesh of wallMeshes) disposeObject(mesh);
  wallMeshes.length = 0;
  for (const group of hazardGroups) disposeObject(group);
  hazardGroups.length = 0; hazardSparks.length = 0;
  for (const entry of moonEntries) { world.removeBody(entry.body); disposeObject(entry.mesh); disposeObject(entry.trail); }
  moonEntries.length = 0;
  if (plateRing) disposeObject(plateRing);
  plateRing = null;
  mazeGroup.visible = !activeDemo.sandbox; startingOrbit.visible = !!activeDemo.sandbox;
  if (!activeDemo.sandbox) { createWalls(activeLevel); createHazards(activeLevel); }
  portal.position.set(activeLevel.goal.x, activeLevel.goal.y, 1);
  portal.scale.setScalar(activeLevel.goal.radius);
  if (burnout) {
    const gate = activeLevel.walls.find(wall => wall.gate);
    gateFrame = new THREE.Group(); gateFrame.position.set(gate.x, gate.y, 1.3);
    for (const y of [-gate.h / 2 + .7, gate.h / 2 - .7]) {
      const marker = line([{ x: -.65, y }, { x: .65, y }], new THREE.LineBasicMaterial({ color: 0xffd98b, transparent: true, opacity: .38 }));
      gateFrame.add(marker);
    }
    mazeGroup.add(gateFrame);
    setGateOpen(true);
  }
  updateResourceHud();
  for (const moon of activeDemo.moons) {
    const satellite = new CANNON.Body({ mass: .08, shape: new CANNON.Sphere(.16), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
    satellite.position.set(moon.x, moon.y, 0); satellite.velocity.set(moon.vx, moon.vy, 0); world.addBody(satellite);
    const mesh = new THREE.Group();
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 12), new THREE.MeshBasicMaterial({ color: activeDemo.plate ? 0xffd88a : 0xd8cdff }));
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: activeDemo.plate ? 0xffb853 : 0xbda3ff, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending }));
    aura.scale.set(1.2, 1.2, 1); mesh.add(dot, aura); moonGroup.add(mesh);
    const positions = new Float32Array(160 * 3);
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)); geometry.setDrawRange(0, 0);
    const trail = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: activeDemo.plate ? 0xf2c66a : 0xb9a5eb, transparent: true, opacity: .28, depthWrite: false }));
    trail.frustumCulled = false; moonGroup.add(trail);
    moonEntries.push({ body: satellite, mesh, trail, positions, count: 0, lastSample: -1 });
  }
  if (activeDemo.plate) {
    plateRing = new THREE.Group(); plateRing.position.set(activeDemo.plate.x, activeDemo.plate.y, .7);
    plateRing.add(ring(activeDemo.plate.radius, new THREE.LineBasicMaterial({ color: 0xffd88a, transparent: true, opacity: .9 })));
    plateRing.add(ring(activeDemo.plate.radius * .8, new THREE.LineDashedMaterial({ color: 0xffd88a, transparent: true, opacity: .3, dashSize: .1, gapSize: .12 })));
    plateRing.children[1].computeLineDistances(); mazeGroup.add(plateRing);
  }
  const moving = moonEntries.length > 0 || !!activeDemo.mechanic;
  $('#heroGravity').disabled = !moonEntries.length;
  $('#heroGravity').value = heroGravity; $('#heroGravityValue').textContent = heroGravity;
  $('#heroGravityHelp').textContent = moving ? 'Pulls loose moons; their small mass also tugs back. Set 0 to compare.' : 'Choose a moon study to explore the dot’s own gravity.';
  showForecast.disabled = moving; forecast.visible = showForecast.checked && !moving;
  $('#forecastHelp').textContent = moving ? 'Prediction is off for interactive studies. Watch the rule unfold in motion.' : 'Preview stops at the next wall, ember, or portal contact.';
  $('#activeDemoLabel').textContent = activeDemo.title;
  $('.settings-help').textContent = `Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R ${campaignMode ? 'ends the attempt' : 'restarts'} · E removes oldest / releases capture · 1 / 2 remove a specific well.`;
  $('#demoTitle').textContent = activeDemo.title;
  $('#demoObjective').textContent = activeDemo.objective;
  $('#demoNote').style.setProperty('--demo-color', activeDemo.color);
  for (const card of document.querySelectorAll('[data-demo]')) card.setAttribute('aria-pressed', String(card.dataset.demo === activeDemo.id));
}
function applyMoonGravity() {
  if (!moonEntries.length) return;
  const moons = moonEntries.map(entry => ({ x: entry.body.position.x, y: entry.body.position.y, mass: entry.body.mass }));
  const exchange = gravityExchange(body.position, moons, heroGravity);
  body.applyForce(new CANNON.Vec3(exchange.hero.x * body.mass, exchange.hero.y * body.mass, 0));
  for (let i = 0; i < moonEntries.length; i++) {
    const satellite = moonEntries[i].body;
    const a = mazeAcceleration(satellite.position, wells, simTime, mode, activeLevel);
    satellite.applyForce(new CANNON.Vec3((a.x + exchange.moons[i].x) * satellite.mass, (a.y + exchange.moons[i].y) * satellite.mass, 0));
  }
}
function updateGate() {
  for (const entry of moonEntries) { entry.body.position.z = 0; entry.body.velocity.z = 0; capVelocity(entry.body.velocity); }
  if (gateOpen || !plateActivated(activeDemo.plate, moonEntries.map(entry => entry.body.position))) return;
  setGateOpen(true);
  for (const mark of plateRing.children) mark.material.color.setHex(0x87f9ce);
  $('#demoObjective').textContent = 'Gate open. Take your trail through the portal.';
  audio.tone(392, 0, 1.3, .1); audio.tone(523.25, .15, 1.3, .1);
}
function updateMoonVisuals() {
  for (const entry of moonEntries) {
    const p = entry.body.position; entry.mesh.position.set(p.x, p.y, 2);
    if (simTime - entry.lastSample < .05 || paused) continue;
    entry.lastSample = simTime;
    if (entry.count === 160) { entry.positions.copyWithin(0, 3); entry.count--; }
    entry.positions.set([p.x, p.y, .8], entry.count++ * 3);
    entry.trail.geometry.attributes.position.needsUpdate = true; entry.trail.geometry.setDrawRange(0, entry.count);
  }
}

function demoThumbnail(demo) {
  const bounds = demo.level.bounds;
  const sx = 170 / (bounds.maxX - bounds.minX), sy = 100 / (bounds.maxY - bounds.minY);
  const x = (value) => (value - bounds.minX) * sx;
  const y = (value) => (bounds.maxY - value) * sy;
  const radius = (value) => value * Math.min(sx, sy);
  const walls = demo.sandbox ? '' : demo.level.walls.map(w => `<rect x="${x(w.x - w.w / 2)}" y="${y(w.y + w.h / 2)}" width="${w.w * sx}" height="${w.h * sy}" rx="1" fill="#02070c"/>`).join('');
  const moons = demo.moons.map(m => `<circle cx="${x(m.x)}" cy="${y(m.y)}" r="2" fill="${demo.color}"/>`).join('');
  const embers = demo.level.spikes.map(m => `<circle cx="${x(m.x)}" cy="${y(m.y)}" r="2" fill="#ffa75b"/>`).join('');
  const mark = (mx,my,r,color) => `<circle cx="${x(mx)}" cy="${y(my)}" r="${radius(r)}" stroke="${color}" fill="none" stroke-width="1"/>`;
  const guideMarks = (demo.level.channel ? channelWalls(demo.level.channel) : (demo.level.guides || [])).map(profile => `<polygon points="${profile.map(p=>`${x(p.x)},${y(p.y)}`).join(' ')}" fill="#02070c"/>`).join('');
  const opticalMarks = OPTICAL_STUDIES.has(demo.mechanic) ? `<path d="M85 50 L155 25 L155 75 Z" fill="${demo.color}" opacity=".25"/><path d="M85 35 L85 65" stroke="${demo.color}" stroke-width="2"/>` : '';
  const studyMarks = activeDemo && demo.mechanic ? (['power','dimmer','sound'].includes(demo.mechanic) ? [-5,0,5].map(mx=>mark(mx,0,.65,demo.color)).join('') : demo.mechanic==='burnout' ? mark(-5,1,.65,'#ffd98b')+mark(5,0,1,'#ffd98b') : demo.mechanic==='portals' ? mark(-3,0,1,'#76e9e3')+mark(6,-3,1,'#76e9e3') : demo.mechanic==='clock' ? mark(0,0,3.5,'#ff8a32') : ['giant','chaser'].includes(demo.mechanic) ? mark(0,0,demo.mechanic==='giant'?1.6:.3,'#ff8a32') : ['sticky','eclipse','boost','hidden'].includes(demo.mechanic) ? mark(-3,0,.85,demo.color) : '') : '';
  return `<svg viewBox="0 0 170 100" aria-hidden="true"><rect width="170" height="100" rx="5" fill="#102b38"/>${walls}${guideMarks}<path d="M25 70 C30 20 75 20 85 50 S120 80 140 30" fill="none" stroke="${demo.color}" opacity=".7" stroke-width=".7"/>${moons}${opticalMarks}${studyMarks}${demo.sandbox ? '<ellipse cx="85" cy="50" rx="28" ry="25" fill="none" stroke="#9acfff" stroke-width=".6"/>' : embers}<circle cx="${x(demo.level.spawn.x)}" cy="${y(demo.level.spawn.y)}" r="2.4" fill="#dffff9"/><circle cx="${x(demo.level.goal.x)}" cy="${y(demo.level.goal.y)}" r="${Math.max(4,radius(demo.level.goal.radius))}" stroke="#bc9aff" stroke-width=".8" fill="none"/>${demo.plate ? mark(demo.plate.x,demo.plate.y,demo.plate.radius,'#ffd88a') : ''}</svg>`;
}
const gallery = $('#gallery');
$('#demoGrid').innerHTML = DEMOS.map(demo => `<button type="button" class="demo-card" data-demo="${demo.id}" style="--demo-color:${demo.color}" aria-pressed="false">${demoThumbnail(demo)}<span class="demo-rule">${demo.rule}</span><strong>${demo.title}</strong><span>${demo.description}</span><em>${demo.question}</em></button>`).join('');
const demoCategories = [
  ['All', DEMOS.map(demo => demo.id)],
  ['Gravity', ['drift','satellites','slingshot','gate','orbit','release','boost','sticky','giant','chaser','clock']],
  ['Light', ['eclipse','power','dimmer','hidden','shadow-posts','filters','lens','prism','burnout']],
  ['Sound', ['sound']],
  ['Space & paths', ['maze','guide','portals','wideworld']],
];
$('#demoCategories').innerHTML = demoCategories.map(([name, ids], index) => `<button type="button" data-category="${index}" aria-pressed="${index === 0}">${name}<span>${ids.length}</span></button>`).join('');
$('#demoCategories').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  const ids = demoCategories[Number(button.dataset.category)][1];
  for (const chip of $('#demoCategories').querySelectorAll('button')) chip.setAttribute('aria-pressed', String(chip === button));
  for (const card of $('#demoGrid').querySelectorAll('[data-demo]')) card.hidden = !ids.includes(card.dataset.demo);
});
let resumeAfterGallery = false;
let galleryReturnHome = false;
function openGallery() {
  galleryReturnHome = homeOpen;
  if (homeOpen) setHomeOpen(false);
  resumeAfterGallery = runState === 'running';
  if (resumeAfterGallery) togglePause();
  settings.close(); gallery.showModal();
}
function showHome() {
  resumeAfterGallery = false; resumeAfterSettings = false; galleryReturnHome = false;
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  if (settings.open) settings.close();
  if (gallery.open) gallery.close();
  paused = true;
  audio.stopHeartbeat();
  if (runState === 'running') runState = 'paused';
  setHomeOpen(true);
  winOverlay.classList.add('hidden'); driftOverlay.classList.add('hidden');
  $('#deathFlash').classList.remove('visible');
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('campaign'); history.replaceState(null, '', url);
  updateControls();
}
function showLevelSelect() {
  showHome();
  for (const badge of $('#levelSelect').querySelectorAll('[data-complete]')) badge.textContent = completedLevels.has(Number(badge.dataset.complete)) ? 'COMPLETE ✓' : 'NOT YET COMPLETE';
  for (const badge of $('#levelSelect').querySelectorAll('[data-gate-best]')) {
    const mask = bestGates[Number(badge.dataset.gateBest)];
    badge.textContent = mask === undefined ? 'Best attempt: — / 3 gates' : `Best attempt: ${gateCount(mask)}/3 gates · ${gatePattern(mask)}`;
    appendGatePatternIcons(badge, mask ?? 0);
  }
  setHomeOpen(true, 'levels');
}
$('#galleryButton').addEventListener('click', () => campaignMode ? showHome() : openGallery());
$('#browseDemos').addEventListener('click', () => { resumeAfterSettings = false; openGallery(); });
$('#homeFromSettings').addEventListener('click', showHome);
$('#homeFromGallery').addEventListener('click', showHome);
$('#startCampaign').addEventListener('click', showLevelSelect);
$('#levelsBack').addEventListener('click', showHome);
$('#levelSelect').addEventListener('click', event => { const card = event.target.closest('[data-campaign-level]'); if (card) selectCampaign(Number(card.dataset.campaignLevel)); });
$('#studyHome').addEventListener('click', openGallery);
$('#closeGallery').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => { if (galleryReturnHome) showHome(); else if (resumeAfterGallery && runState === 'paused' && !won && !drifted) togglePause(); resumeAfterGallery = false; galleryReturnHome = false; });
$('#demoGrid').addEventListener('click', (event) => { const card = event.target.closest('[data-demo]'); if (!card) return; resumeAfterGallery = false; galleryReturnHome = false; selectDemo(card.dataset.demo); gallery.close(); });
$('#heroGravity').addEventListener('input', (event) => { heroGravity = Number(event.target.value); $('#heroGravityValue').textContent = heroGravity; });

function currentState() {
  return { x: body.position.x, y: body.position.y, vx: body.velocity.x, vy: body.velocity.y };
}

function updateForecast() {
  if (!showForecast.checked || activeDemo.moons.length) return;
  const result = gameMode === 'maze' ? predictToImpact(currentState(), wells, simTime, 3, mode, activeLevel) : { points: predict(currentState(), wells, simTime, 5.5, mode, 7), impact: null };
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
  updateControls();
  const state = won ? 'FINISHED' : drifted ? 'LOST' : runState === 'ready' ? 'READY' : paused ? 'PAUSED' : 'IN FLIGHT';
  $('#stateLabel').textContent = state;
  $('#speed').textContent = `${Math.hypot(body.velocity.x, body.velocity.y).toFixed(2)} u/s`;
}

function resize() {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  const aspect = width / height;
  const frame = campaignMode || activeDemo.id === 'wideworld' ? followFrame(aspect) : gameMode === 'maze' ? cameraFrame(activeDemo.level.bounds, aspect) : { width: Math.max(21, 16 * aspect), height: Math.max(21, 16 * aspect) / aspect };
  const visibleWidth = frame.width;
  const visibleHeight = frame.height;
  camera.left = -visibleWidth / 2;
  camera.right = visibleWidth / 2;
  camera.top = visibleHeight / 2;
  camera.bottom = -visibleHeight / 2;
  camera.updateProjectionMatrix();
  const bounds = activeLevel.bounds;
  expandArchive(Math.max(camera.right + 2, Math.abs(bounds.minX) + 2, Math.abs(bounds.maxX) + 2), Math.max(camera.top + 2, Math.abs(bounds.minY) + 2, Math.abs(bounds.maxY) + 2));
  updateCamera(0, true);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  sparkMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
}

function updateCamera(dt, snap = false) {
  floor.position.x = 0; floor.position.y = 0;
  if (!campaignMode && activeDemo.id !== 'wideworld') {
    camera.position.x = 0; camera.position.y = 0;
    return;
  }
  const next = followPosition(camera.position, body.position, body.velocity, activeLevel.bounds,
    { width: camera.right - camera.left, height: camera.top - camera.bottom }, dt, snap);
  camera.position.x = next.x; camera.position.y = next.y;
  if (campaignMode) expandArchive(Math.abs(camera.position.x) + camera.right + 3, Math.abs(camera.position.y) + camera.top + 3);
}

function drawMinimap() {
  minimap.classList.toggle('visible', campaignMode || activeDemo.id === 'wideworld');
  if (!campaignMode && activeDemo.id !== 'wideworld') return;
  const ctx = minimapContext, w = minimap.width, h = minimap.height;
  const bounds = activeLevel.bounds;
  const sx = w / (bounds.maxX - bounds.minX), sy = h / (bounds.maxY - bounds.minY);
  const x = value => (value - bounds.minX) * sx;
  const y = value => (bounds.maxY - value) * sy;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#07151f'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#476877'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.fillStyle = '#324b56';
  for (const wall of activeLevel.walls) ctx.fillRect(x(wall.x - wall.w / 2), y(wall.y + wall.h / 2), wall.w * sx, wall.h * sy);
  const marker = (px, py, radius, color) => {
    ctx.beginPath(); ctx.arc(x(px), y(py), radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  };
  marker(activeLevel.goal.x, activeLevel.goal.y, 6, '#a994ff');
  if (campaignMode) for (const gate of activeDemo.soundGates) marker(gate.x, gate.y, 4, soundGates?.mask & (1 << gate.id) ? '#6d8993' : SOUND_GATE_COLORS[gate.id]);
  for (const pickup of campaign?.pickups || []) marker(pickup.x, pickup.y, 3, '#ffd58e');
  for (const danger of activeLevel.dangers || []) { ctx.beginPath(); ctx.arc(x(danger.x), y(danger.y), danger.radius * Math.min(sx, sy), 0, Math.PI * 2); ctx.fillStyle = '#e36d31'; ctx.fill(); }
  for (const well of wells) marker(well.x, well.y, 3.5, '#79d6ef');
  ctx.strokeStyle = '#d6f9f0'; ctx.lineWidth = 1.5;
  const viewLeft = Math.max(bounds.minX, camera.position.x + camera.left);
  const viewRight = Math.min(bounds.maxX, camera.position.x + camera.right);
  const viewTop = Math.min(bounds.maxY, camera.position.y + camera.top);
  const viewBottom = Math.max(bounds.minY, camera.position.y + camera.bottom);
  ctx.strokeRect(x(viewLeft), y(viewTop), Math.max(0, viewRight - viewLeft) * sx, Math.max(0, viewTop - viewBottom) * sy);
  marker(body.position.x, body.position.y, 4, '#eafff5');
}

function eventWorld(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const u = (event.clientX - rect.left) / rect.width;
  const v = (event.clientY - rect.top) / rect.height;
  const x = u * 2 - 1;
  const y = 1 - v * 2;
  return { x: camera.position.x + x * camera.right, y: camera.position.y + y * camera.top };
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
$('#restart').addEventListener('click', () => { if (campaignMode) failRun('manual'); else reset(); });
$('#driftRestart').addEventListener('click', reset);
$('#driftHome').addEventListener('click', showHome);
$('#winRestart').addEventListener('click', () => { if (campaignMode && won) { const next = nextCampaignLevel(campaignLevelId); if (next) selectCampaign(next.id); else showLevelSelect(); } else reset(); });
$('#winHome').addEventListener('click', showHome);
pauseButton.addEventListener('click', () => { if (runState !== 'ready') togglePause(); });
$('#soundEnabled').addEventListener('change', (event) => audio.setEnabled(event.target.checked));
document.addEventListener('pointerdown', () => audio.unlock(), { capture: true });
document.addEventListener('keydown', () => audio.unlock(), { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) { audio.stopHeartbeat(); audio.context?.suspend().catch(() => {}); } lastFrame = performance.now(); accumulator = 0; });
function contextAction() {
  if (settings.open || gallery.open || homeOpen || won || drifted) return;
  if (experiment.held) experiment.release(body);
  else if (wells.length) removeWell(wells[0].id);
}
function updateControls() {
  const control = primaryControl({state:runState,held:!!experiment.held,wellCount:wells.length});
  const button = $('#primaryAction');
  button.textContent = control.label;
  button.disabled = control.disabled || settings.open || gallery.open || homeOpen;
  pauseButton.disabled = homeOpen || !['running','paused'].includes(runState);
  $('#restart').disabled = homeOpen || (campaignMode && (runState === 'ready' || won || drifted));
  $('#restart').textContent = campaignMode ? '✕' : '↺';
  $('#restart').setAttribute('aria-label', campaignMode ? 'Die' : 'Restart');
  $('#restart').title = campaignMode ? 'Die (R)' : 'Restart (R)';
  $('#galleryButton').textContent = campaignMode ? '⌂' : '⊞';
  $('#galleryButton').setAttribute('aria-label', campaignMode ? 'Home' : 'Demo gallery');
  $('#galleryButton').title = campaignMode ? 'Home' : 'Demo gallery';
  const canResume = runState === 'paused';
  pauseButton.textContent = canResume ? '▷' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', canResume ? 'Resume' : 'Pause');
  pauseButton.title = canResume ? 'Resume (P)' : 'Pause (P)';
}
function primaryAction() {
  if (settings.open || gallery.open || homeOpen || won || drifted) return;
  const control = primaryControl({state:runState,held:!!experiment.held,wellCount:wells.length});
  if (control.action === 'start' || control.action === 'resume') togglePause();
  else if (control.action === 'release') experiment.release(body);
  else if (control.action === 'remove') removeWell(wells[0].id);
  updateControls();
}
$('#primaryAction').addEventListener('click', primaryAction);
function togglePause() {
  if (drifted || won || homeOpen || settings.open || gallery.open) return;
  paused = !paused;
  if (paused) audio.stopHeartbeat();
  runState = paused ? 'paused' : 'running';
  updateControls();
  caption.textContent = paused ? 'PAUSED' : '';
  lastFrame = performance.now(); updateStatus();
}
window.addEventListener('keydown', (event) => {
  if (settings.open || gallery.open || homeOpen || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const key = event.key.toLowerCase();
  if (key === ' ' && !won && !drifted) { event.preventDefault(); if (!event.repeat) primaryAction(); return; }
  if (event.repeat) return;
  if (key === 'p' && runState !== 'ready') { event.preventDefault(); togglePause(); }
  if (key === 'r') { if (campaignMode) { if (runState === 'running' || runState === 'paused') failRun('manual'); } else reset(); }
  if (key === 'e') contextAction();
  if (key === '1' && wells[0]) removeWell(wells[0].id);
  if (key === '2' && wells[1]) removeWell(wells[1].id);
});
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(sceneElement);
window.visualViewport?.addEventListener('resize', resize);

function frame(now) {
  requestAnimationFrame(frame);
  const elapsed = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  if (document.hidden) { accumulator = 0; return; }
  if (!paused && !drifted && !won) {
    accumulator += elapsed;
    while (accumulator >= STEP) {
      for (const expired of wells.filter((well) => remaining(well, simTime) <= 0)) removeWell(expired.id);
      const before = { x: body.position.x, y: body.position.y };
      const a = gameMode === 'maze' ? mazeAcceleration(body.position, wells, simTime, mode, activeLevel) : acceleration(body.position, wells, simTime, mode);
      body.applyForce(new CANNON.Vec3(a.x * body.mass, a.y * body.mass, 0));
      applyMoonGravity();
      world.step(STEP);
      if(activeLevel.channel) constrainChannel(body.position,body.velocity,activeLevel.channel,BLOB_RADIUS);
      updateGate();
      body.position.z = 0;
      body.velocity.z = 0;
      if (gameMode === 'maze') {
        capVelocity(body.velocity, activeDemo.mechanic === 'boost' ? 16 : SPEED_CAP);
        const special = experiment.step(body, before, simTime, wells, mode, failRun);
        if (drifted) break;
        if (soundGates) {
          const result = stepSoundGates(soundGates, activeDemo.soundGates, before, body.position, simTime);
          soundGates = result.state;
          for (const id of result.acquired) audio.gateAcquire(id);
          for (const { id, beat } of result.beats) audio.gateBeat(id, beat);
        }
        if (special === 'teleport') {
          if (trailCount) archiveSegment(trailSamples[(trailStart + trailCount - 1) % TRAIL_CAPACITY], before);
          trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0);
          before.x = body.position.x; before.y = body.position.y;
        }
        if (campaign) {
          const result = stepCampaign(campaign, { before, hero: body.position, dt: STEP, time: simTime, level: activeLevel });
          campaign = result.state;
          experiment.brightness = campaign.energy;
          visitedBounds.minX = Math.min(visitedBounds.minX, body.position.x);
          visitedBounds.maxX = Math.max(visitedBounds.maxX, body.position.x);
          visitedBounds.minY = Math.min(visitedBounds.minY, body.position.y);
          visitedBounds.maxY = Math.max(visitedBounds.maxY, body.position.y);
          if (result.collected) { audio.stopHeartbeat(); audio.tone(587.33, 0, .35, .08); }
          for (const beat of result.heartbeat) audio.heartbeat(beat.part, beat.urgency);
          if (result.failed) { failRun(); break; }
        }
        if (burnout) {
          const result = stepBurnout(burnout, { before, hero: body.position, level: activeDemo.level, dt: STEP, time: simTime });
          burnout = result.state;
          experiment.brightness = burnout.energy;
          if (result.collected) audio.tone(587.33, 0, .35, .08);
          if (result.gateChanged) {
            setGateOpen(burnout.gateOpen);
            audio.tone(burnout.gateOpen ? 523.25 : 196, 0, .5, .08);
          }
        }
        const impact = firstImpact(before, body.position, activeLevel);
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
      audio.death();
      drifted = true; paused = true; runState = 'dead'; updateStatus();
      driftOverlay.classList.remove('hidden');
    }
  }
  core.position.set(body.position.x, body.position.y, 2);
  blobLight.position.set(body.position.x, body.position.y, 1.1);
  const orbPulse = audio.orb(!homeOpen && !gallery.open && !settings.open && !drifted && !won && !document.hidden, now / 1000, experiment.brightness);
  updateControls();
  blobLight.intensity = 85 * experiment.brightness;
  blob.material.transparent = !!campaign;
  blob.material.opacity = campaign ? .08 + campaign.energy * .92 : 1;
  blob.scale.setScalar(1 + orbPulse * .055);
  heroGlow.scale.setScalar(2.3 + orbPulse * .25);
  heroGlow.material.opacity = (.83 + orbPulse * .17) * Math.min(1, experiment.brightness);
  if (!paused && !drifted && !won) updateSparks(elapsed);
  if (gameMode === 'maze') updateHazardSparks();
  if (gameMode === 'maze') updatePortalSparks();
  portal.rotation.z += elapsed * 0.35; portalAura.material.opacity = 0.35 + Math.sin(now * 0.002) * 0.1;
  experiment.updateVisuals(body.position, simTime, experiment.brightness, renderer.getPixelRatio());
  if (soundGates) updateCampaignGates();
  if (activeDemo.mechanic === 'sound') $('#demoObjective').textContent = `Cross rings to add rhythm · ${experiment.layers.size}/3 voices active${experiment.layers.size ? ' · ' + ['bass','offbeat','chime'].filter((_,i)=>experiment.layers.has(i)).join(' + ') : ' · cyan bass / violet offbeat / gold chime'}`;
  optics.update(body.position,experiment.brightness);
  if (burnout || campaign) { syncPickups(); updateResourceHud(); }
  updateMoonVisuals();
  updateWellVisuals();
  updateCamera(elapsed);
  drawMinimap();
  audio.trail(!homeOpen && !paused && !drifted && !won && !document.hidden, Math.hypot(body.velocity.x, body.velocity.y), simTime - lastSoundWellTime);
  if (frameCount % 12 === 0 || paused || drifted) updateStatus();
  renderer.render(scene, camera);
}

mazeGroup.visible = !activeDemo.sandbox;
startingOrbit.visible = !!activeDemo.sandbox;
if (route.has('demo')) selectDemo(activeDemo.id);
else if (campaignMode) selectCampaign(campaignLevelId);
else { selectDemo(activeDemo.id); showHome(); }
requestAnimationFrame(frame);
