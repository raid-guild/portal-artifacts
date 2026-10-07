import * as THREE from 'three';
import { createFly } from './fly.js';
import { DEFAULTS, PRESETS, FlightSimulation, depthRange } from './flight.js';
import './style.css';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#world');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34.7, 1, 0.1, 300);
camera.position.set(0, 0, 160);
camera.lookAt(0, 0, 0);
scene.add(new THREE.AmbientLight(0xffffff, 2.1));
const keyLight = new THREE.DirectionalLight(0xfff1da, 2.4);
keyLight.position.set(-4, 9, 30);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xc6e7d4, 1.5);
rimLight.position.set(8, -4, 15);
scene.add(rimLight);

const fly = createFly();
scene.add(fly.object);

const shadowPixels = new Uint8Array(96 * 96 * 4);
for (let y = 0; y < 96; y++) {
  for (let x = 0; x < 96; x++) {
    const radius = Math.hypot((x - 47.5) / 47.5, (y - 47.5) / 47.5);
    const alpha = Math.pow(Math.max(0, 1 - radius * radius), 3);
    const i = (y * 96 + x) * 4;
    shadowPixels[i] = 24;
    shadowPixels[i + 1] = 35;
    shadowPixels[i + 2] = 26;
    shadowPixels[i + 3] = Math.round(alpha * 210);
  }
}
const shadowTexture = new THREE.DataTexture(shadowPixels, 96, 96, THREE.RGBAFormat);
shadowTexture.needsUpdate = true;
shadowTexture.magFilter = THREE.LinearFilter;
const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.18, depthWrite: false });
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 6.8), shadowMaterial);
shadow.position.z = 0.2;
scene.add(shadow);

const trailCount = 145;
const trailPositions = new Float32Array(trailCount * 3);
const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
trailGeometry.setDrawRange(0, 0);
const trail = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ color: 0xb86846, transparent: true, opacity: 0.52, depthWrite: false }));
scene.add(trail);
let trailPoints = [];
let trailClock = 0;

const sim = new FlightSimulation(1001);
let config = { ...DEFAULTS };
let spots = [{ id: 1, x: 0.54, y: 0.42, depth: 45, strength: 100 }];
let nextSpotId = 2;
let selectedId = 1;
let bounds = { halfWidth: 50 };
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let slow = false;
let showTrail = false;
let showDiagnostics = false;
let pointer = { x: 0, y: 0, active: false };
let pointerSuppressedUntil = 0;
let lastNow = performance.now();
let accumulator = 0;
const STEP = 1 / 120;

const inputIds = ['speed', 'burstMultiplier', 'turnFrequency', 'turnSharpness', 'depthTravel', 'attractionStrength', 'attractionRadius', 'cursorSensitivity', 'cursorResponse', 'randomTurns'];
const outputFormat = {
  speed: v => v,
  burstMultiplier: v => `${Number(v).toFixed(1)}×`,
  turnFrequency: v => `${Number(v).toFixed(1)}/s`,
  turnSharpness: v => `${v}%`,
  depthTravel: v => `${v}%`,
  attractionStrength: v => `${v}%`,
  attractionRadius: v => `${v}u`,
  cursorSensitivity: v => `${v}%`,
};

function syncControls() {
  for (const id of inputIds) {
    const el = document.getElementById(id);
    if (el.type === 'checkbox') el.checked = config[id];
    else el.value = config[id];
    const output = document.getElementById(`${id}-value`);
    if (output) output.value = outputFormat[id](config[id]);
  }
  $('#speed-readout').textContent = `${config.speed} u/s`;
}

for (const id of inputIds) {
  const el = document.getElementById(id);
  el.addEventListener(el.type === 'range' ? 'input' : 'change', () => {
    config[id] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
    $('#preset').value = 'custom';
    pointerSuppressedUntil = performance.now() + 700;
    const output = document.getElementById(`${id}-value`);
    if (output) output.value = outputFormat[id](config[id]);
    $('#speed-readout').textContent = `${config.speed} u/s`;
  });
}
$('#preset').addEventListener('change', e => {
  const preset = PRESETS[e.target.value];
  if (!preset) return;
  config = { ...preset };
  syncControls();
});

const spotLayer = $('#spot-layer');
function suppressPointer() { pointerSuppressedUntil = performance.now() + 750; }
function spotById(id) { return spots.find(s => s.id === id); }
function updateSelectedSpot() {
  const spot = spotById(selectedId);
  $('#selected-spot').hidden = !spot;
  if (!spot) return;
  $('#spot-depth').value = spot.depth;
  $('#spot-depth-value').value = `${spot.depth}%`;
  $('#spot-strength').value = spot.strength;
  $('#spot-strength-value').value = `${spot.strength}%`;
}
function renderSpots() {
  spotLayer.replaceChildren();
  for (const spot of spots) {
    const button = document.createElement('button');
    button.className = `spot ${spot.id === selectedId ? 'selected' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-label', `Attraction spot ${spot.id}. Drag or use arrow keys to move.`);
    button.setAttribute('aria-pressed', String(spot.id === selectedId));
    button.style.left = `${spot.x * 100}%`;
    button.style.top = `${spot.y * 100}%`;
    button.innerHTML = '<span class="spot-core"></span><span class="spot-orbit"></span>';
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      selectedId = spot.id;
      for (const item of spotLayer.children) {
        const selected = item.dataset.id === String(spot.id);
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      }
      updateSelectedSpot();
      button.focus();
      button.setPointerCapture(event.pointerId);
      suppressPointer();
    });
    button.addEventListener('pointermove', event => {
      if (!button.hasPointerCapture(event.pointerId)) return;
      spot.x = Math.max(0.05, Math.min(0.95, event.clientX / innerWidth));
      spot.y = Math.max(0.06, Math.min(0.94, event.clientY / innerHeight));
      button.style.left = `${spot.x * 100}%`;
      button.style.top = `${spot.y * 100}%`;
      suppressPointer();
    });
    button.addEventListener('keydown', event => {
      const step = event.shiftKey ? 0.05 : 0.01;
      if (event.key === 'ArrowLeft') spot.x -= step;
      else if (event.key === 'ArrowRight') spot.x += step;
      else if (event.key === 'ArrowUp') spot.y -= step;
      else if (event.key === 'ArrowDown') spot.y += step;
      else if (event.key === 'Delete' || event.key === 'Backspace') {
        spots = spots.filter(s => s.id !== spot.id);
        selectedId = spots[0]?.id ?? null;
        renderSpots();
        $('#add-spot').focus();
        event.preventDefault();
        return;
      } else return;
      spot.x = Math.max(0.05, Math.min(0.95, spot.x));
      spot.y = Math.max(0.06, Math.min(0.94, spot.y));
      button.style.left = `${spot.x * 100}%`;
      button.style.top = `${spot.y * 100}%`;
      suppressPointer();
      event.preventDefault();
    });
    button.dataset.id = spot.id;
    spotLayer.append(button);
  }
  $('#spot-count').textContent = `${String(spots.length).padStart(2, '0')} / 03`;
  $('#add-spot').disabled = spots.length >= 3;
  updateSelectedSpot();
}
$('#add-spot').addEventListener('click', () => {
  if (spots.length >= 3) return;
  const i = spots.length;
  const spot = { id: nextSpotId++, x: 0.5 + i * 0.14, y: 0.34 + i * 0.12, depth: 45, strength: 100 };
  spots.push(spot);
  selectedId = spot.id;
  renderSpots();
  suppressPointer();
});
$('#remove-spot').addEventListener('click', () => {
  spots = spots.filter(s => s.id !== selectedId);
  selectedId = spots[0]?.id ?? null;
  renderSpots();
  suppressPointer();
});
for (const key of ['depth', 'strength']) {
  const input = document.getElementById(`spot-${key}`);
  input.addEventListener('input', () => {
    const spot = spotById(selectedId);
    if (!spot) return;
    spot[key] = Number(input.value);
    document.getElementById(`spot-${key}-value`).value = `${input.value}%`;
    suppressPointer();
  });
}
renderSpots();

function updatePauseButton() {
  $('#pause').innerHTML = paused ? '▶ <span>PLAY</span>' : 'Ⅱ <span>PAUSE</span>';
  $('#step').disabled = !paused;
  $('#status-text').textContent = paused ? 'PAUSED' : sim.state.toUpperCase();
}
$('#pause').addEventListener('click', () => { paused = !paused; accumulator = 0; updatePauseButton(); });
$('#step').addEventListener('click', () => { if (paused) { sim.step(STEP, config, bounds, spots, null); updateScene(); } });
$('#slow').addEventListener('click', () => {
  slow = !slow;
  $('#slow').setAttribute('aria-pressed', String(slow));
});
$('#reset-flight').addEventListener('click', () => {
  sim.reset();
  trailPoints = [];
  trailGeometry.setDrawRange(0, 0);
  accumulator = 0;
  updateScene();
});
$('#restore-defaults').addEventListener('click', () => {
  config = { ...DEFAULTS };
  $('#preset').value = 'default';
  spots = [{ id: 1, x: 0.54, y: 0.42, depth: 45, strength: 100 }];
  nextSpotId = 2;
  selectedId = 1;
  showTrail = false;
  showDiagnostics = false;
  slow = false;
  paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#slow').setAttribute('aria-pressed', 'false');
  $('#showTrail').checked = false;
  $('#showDiagnostics').checked = false;
  $('#diagnostics').hidden = true;
  syncControls();
  renderSpots();
  sim.reset();
  trailPoints = [];
  trailGeometry.setDrawRange(0, 0);
  accumulator = 0;
  updatePauseButton();
  updateScene();
});
$('#showTrail').addEventListener('change', e => {
  showTrail = e.target.checked;
  trail.visible = showTrail;
  if (!showTrail) { trailPoints = []; trailGeometry.setDrawRange(0, 0); }
});
$('#showDiagnostics').addEventListener('change', e => {
  showDiagnostics = e.target.checked;
  $('#diagnostics').hidden = !showDiagnostics;
});
$('#panel-toggle').addEventListener('click', () => {
  const expanded = $('#panel-toggle').getAttribute('aria-expanded') === 'true';
  $('#panel-toggle').setAttribute('aria-expanded', String(!expanded));
  $('#controls').classList.toggle('collapsed', expanded);
  $('#panel-chevron').textContent = expanded ? '+' : '−';
});
if (window.matchMedia('(max-width: 700px)').matches) {
  $('#panel-toggle').setAttribute('aria-expanded', 'false');
  $('#controls').classList.add('collapsed');
  $('#panel-chevron').textContent = '+';
}
updatePauseButton();
trail.visible = false;

function resize() {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, w < 700 ? 1.5 : 2));
  renderer.setSize(w, h, false);
  bounds.halfWidth = 50 * w / h;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  pointer = { x: event.clientX / innerWidth, y: event.clientY / innerHeight, active: true };
});
document.addEventListener('pointerleave', () => { pointer.active = false; });
window.addEventListener('blur', () => { pointer.active = false; });
window.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || event.target.closest('button, input, select, summary, a')) return;
  pointer = { x: event.clientX / innerWidth, y: event.clientY / innerHeight, active: true };
  setTimeout(() => { pointer.active = false; }, 500);
});
document.addEventListener('visibilitychange', () => {
  lastNow = performance.now();
  accumulator = 0;
});

function updateTrail(dt) {
  if (!showTrail) { trailGeometry.setDrawRange(0, 0); return; }
  trailClock += dt;
  if (trailClock > 0.035) {
    trailClock = 0;
    trailPoints.push({ ...sim.position });
    if (trailPoints.length > trailCount) trailPoints.shift();
  }
  for (let i = 0; i < trailPoints.length; i++) {
    trailPositions[i * 3] = trailPoints[i].x;
    trailPositions[i * 3 + 1] = trailPoints[i].y;
    trailPositions[i * 3 + 2] = trailPoints[i].z;
  }
  trailGeometry.attributes.position.needsUpdate = true;
  trailGeometry.setDrawRange(0, trailPoints.length);
}

function updateScene() {
  const p = sim.position;
  fly.object.position.set(p.x, p.y, p.z);
  fly.update({ time: sim.time, velocity: sim.velocity, lateral: sim.lastLateral });
  const ratio = 160 / (160 - p.z);
  const screenX = p.x * ratio;
  const screenY = p.y * ratio;
  // A fixed light angle separates the page shadow from the fly as it approaches.
  shadow.position.set(screenX + p.z * 0.19, screenY - p.z * 0.13, 0.2);
  shadow.scale.setScalar(0.7 + p.z / 42);
  shadowMaterial.opacity = Math.max(0.09, 0.23 - p.z * 0.0014);
  const depth = depthRange(config.depthTravel);
  const depthPercent = depth.max === depth.min ? 50 : Math.round(((p.z - depth.min) / (depth.max - depth.min)) * 100);
  $('#depth-marker').style.left = `${Math.max(0, Math.min(100, depthPercent))}%`;
  $('#depth-value').value = `${depthPercent}%`;
  $('#depth-motion').textContent = sim.velocity.z > 2 ? 'APPROACHING' : sim.velocity.z < -2 ? 'RECEDING' : 'LEVEL';
  $('#status-text').textContent = paused ? 'PAUSED' : sim.state.toUpperCase();
  if (showDiagnostics) {
    const spot = spotById(sim.targetId);
    $('#diagnostics').textContent = `STATE  ${sim.state.toUpperCase()}\nTARGET  ${spot ? 'SPOT ' + spot.id : sim.targetId || 'NONE'}\nHEADING  ${Math.round(Math.atan2(sim.heading.y, sim.heading.x) * 180 / Math.PI)}°\nPOSITION  ${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}\nRADIUS  ${config.attractionRadius}u\nBOUNDS  ±${bounds.halfWidth.toFixed(1)} × ±50`;
  }
}

function frame(now) {
  const elapsed = Math.min((now - lastNow) / 1000, 0.08);
  lastNow = now;
  if (!document.hidden && !paused) {
    accumulator += elapsed * (slow ? 0.25 : 1);
    let steps = 0;
    while (accumulator >= STEP && steps < 10) {
      sim.step(STEP, config, bounds, spots, now < pointerSuppressedUntil ? null : pointer);
      updateTrail(STEP);
      accumulator -= STEP;
      steps++;
    }
    if (steps >= 10) accumulator = 0;
  }
  updateScene();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
