import { World } from './simulation.js';
import { WorldView } from './renderer.js';
import { MATERIALS, SAND, EMPTY } from './materials.js';

const $ = selector => document.querySelector(selector);
const world = new World(256, 160);
world.seed('riverbed');
let view;
try { view = new WorldView($('#world-canvas'), world); }
catch (error) { console.error(error); $('#render-error').hidden = false; }

let selected = SAND, brushSize = 4, playing = true, preset = 'riverbed';
let painting = false, eraseStroke = false, previousPoint = null;
const presets = [
  { id: 'riverbed', name: 'Riverbed', number: '01', tag: 'WATER + EARTH', description: 'Follow the current.' },
  { id: 'pocket-volcano', name: 'Pocket volcano', number: '02', tag: 'HEAT + STONE', description: 'Let the landscape change.' },
  { id: 'tiny-forest', name: 'Tiny forest', number: '03', tag: 'WATER + LIFE', description: 'Watch new trees burst upward.' },
  { id: 'acid-rain', name: 'Acid rain', number: '04', tag: 'ACID + STONE', description: 'Watch the ground erode.' },
];

function selectMaterial(id) {
  if (!MATERIALS.some(m => m.id === id)) return false;
  selected = id;
  for (const button of document.querySelectorAll('[data-material]')) {
    const active = Number(button.dataset.material) === id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  const material = MATERIALS.find(m => m.id === id);
  $('#selected-hint').textContent = `${material.name}: ${material.hint}.`;
  return true;
}
function loadPreset(id) {
  const item = presets.find(p => p.id === id);
  if (!item) return false;
  preset = id; world.seed(id); $('#scene-title').textContent = item.name;
  for (const card of document.querySelectorAll('[data-preset]')) card.classList.toggle('active', card.dataset.preset === id);
  updateStats(); view?.render(); return true;
}
function updateStats() {
  const { active } = world.counts();
  $('#particle-count').textContent = `${active.toLocaleString()} PARTICLES`;
  $('#play-status').textContent = playing ? 'SIMULATING' : 'PAUSED';
  $('#play-button').innerHTML = playing ? 'Ⅱ <span>Pause</span>' : '▷ <span>Play</span>';
  $('#play-button').setAttribute('aria-label', playing ? 'Pause simulation' : 'Resume simulation');
}
function pointerPoint(event) {
  const rect = $('#world-canvas').getBoundingClientRect();
  return { x: Math.floor((event.clientX-rect.left)/rect.width*world.width), y: Math.floor((event.clientY-rect.top)/rect.height*world.height) };
}
function drawAt(point) {
  const type = eraseStroke ? EMPTY : selected;
  if (previousPoint) {
    const steps = Math.max(Math.abs(point.x-previousPoint.x), Math.abs(point.y-previousPoint.y));
    for (let i = 0; i <= steps; i++) world.paint(Math.round(previousPoint.x+(point.x-previousPoint.x)*i/Math.max(1,steps)), Math.round(previousPoint.y+(point.y-previousPoint.y)*i/Math.max(1,steps)), type, brushSize);
  } else world.paint(point.x, point.y, type, brushSize);
  previousPoint = point; view?.render(); updateStats();
}

$('#material-list').innerHTML = MATERIALS.map(m => `<button type="button" class="material-item" data-material="${m.id}" aria-pressed="false" title="${m.hint}"><span class="material-swatch" style="--swatch:${m.color}">${m.symbol}</span><span class="material-name">${m.name}</span></button>`).join('');
$('#material-list').addEventListener('click', event => { const button = event.target.closest('[data-material]'); if (button) selectMaterial(Number(button.dataset.material)); });
$('#preset-list').innerHTML = presets.map(p => `<button type="button" class="preset-card" data-preset="${p.id}"><span class="preset-top"><span>${p.number} / ${p.tag}</span></span><strong>${p.name}</strong><span class="preset-description">${p.description}</span></button>`).join('');
$('#preset-list').addEventListener('click', event => { const button = event.target.closest('[data-preset]'); if (button) loadPreset(button.dataset.preset); });
$('#brush-size').addEventListener('input', event => { brushSize = Number(event.target.value); $('#brush-value').textContent = `${brushSize} PX`; updateBrushOutline(); });
$('#play-button').addEventListener('click', () => { playing = !playing; updateStats(); });
$('#step-button').addEventListener('click', () => { world.step(); view?.render(); updateStats(); });
$('#reset-button').addEventListener('click', () => loadPreset(preset));
$('#clear-button').addEventListener('click', () => { world.clear(); view?.render(); updateStats(); });
const canvas = $('#world-canvas');
const brushOutline = document.createElement('div');
brushOutline.className = 'brush-outline';
brushOutline.setAttribute('aria-hidden', 'true');
canvas.parentElement.append(brushOutline);
let hoverPoint = null;
function updateBrushOutline() {
  if (!hoverPoint) { brushOutline.hidden = true; return; }
  const rect = canvas.getBoundingClientRect();
  const diameter = Math.max(6, brushSize * 2 * rect.width / world.width);
  brushOutline.hidden = false;
  brushOutline.style.width = `${diameter}px`;
  brushOutline.style.height = `${diameter}px`;
  brushOutline.style.left = `${hoverPoint.x - rect.left}px`;
  brushOutline.style.top = `${hoverPoint.y - rect.top}px`;
}
canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.addEventListener('pointerdown', event => { event.preventDefault(); painting = true; eraseStroke = event.button === 2; previousPoint = null; canvas.setPointerCapture(event.pointerId); hoverPoint = {x:event.clientX,y:event.clientY}; updateBrushOutline(); drawAt(pointerPoint(event)); });
canvas.addEventListener('pointermove', event => { hoverPoint = {x:event.clientX,y:event.clientY}; updateBrushOutline(); if (painting) drawAt(pointerPoint(event)); });
canvas.addEventListener('pointerenter', event => { hoverPoint = {x:event.clientX,y:event.clientY}; updateBrushOutline(); });
canvas.addEventListener('pointerleave', () => { if (!painting) { hoverPoint = null; updateBrushOutline(); } });
for (const name of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(name, () => { painting = false; previousPoint = null; });
document.addEventListener('keydown', event => {
  if (event.target !== document.body && event.target !== canvas) return;
  if (event.target instanceof HTMLElement && event.target.closest('button,a,input,select,textarea,[contenteditable]')) return;
  if (event.code === 'Space') { event.preventDefault(); playing = !playing; updateStats(); }
  else if (event.key.toLowerCase() === 's') { world.step(); view?.render(); updateStats(); }
  else if (event.key.toLowerCase() === 'r') loadPreset(preset);
  else if (event.key.toLowerCase() === 'c') { world.clear(); view?.render(); updateStats(); }
  else if (event.key === '0') selectMaterial(EMPTY);
  else if (event.key === '[' || event.key === ']') { brushSize = Math.max(1,Math.min(12,brushSize+(event.key === ']' ? 1 : -1))); $('#brush-size').value = brushSize; $('#brush-value').textContent = `${brushSize} PX`; }
  else if (/^[1-9]$/.test(event.key)) selectMaterial(Number(event.key));
});
selectMaterial(SAND); loadPreset('riverbed');
let last = performance.now(), accumulator = 0, frames = 0;
function animate(now) {
  const delta = Math.min(100, now-last); last = now;
  if (playing) {
    accumulator += delta;
    let ticks = 0;
    while (accumulator >= 1000/30 && ticks++ < 3) { world.step(); accumulator -= 1000/30; }
    if (ticks > 0) view?.render();
    if (ticks > 3) accumulator = 0;
    if (++frames % 15 === 0) updateStats();
  } else accumulator = 0;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

if (document.modelContext?.registerTool) {
  const lifetime = new AbortController();
  window.addEventListener('pagehide', () => lifetime.abort(), { once: true });
  const result = value => ({ content: [{ type: 'text', text: value }] });
  const register = spec => {
    try { Promise.resolve(document.modelContext.registerTool(spec, { signal: lifetime.signal })).catch(error => console.warn('Model tool registration failed', spec.name, error)); }
    catch (error) { console.warn('Model tool registration failed', spec.name, error); }
  };
  register({
    name: 'get_powder_state',
    description: 'Get the current Powder world status and selected material.',
    annotations: { readOnlyHint: true },
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    execute: () => result(JSON.stringify({ preset, playing, selected: MATERIALS.find(m => m.id === selected)?.name, brushSize, ...world.counts() }))
  });
  register({
    name: 'load_powder_preset',
    description: 'Load a named Powder experiment.',
    annotations: { readOnlyHint: false, destructiveHint: false },
    inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: presets.map(p => p.id) } }, required: ['preset'], additionalProperties: false },
    execute: input => {
      if (!input || typeof input.preset !== 'string' || !presets.some(p => p.id === input.preset)) throw new TypeError('Invalid preset');
      loadPreset(input.preset);
      return result(`Loaded ${input.preset}`);
    }
  });
  register({
    name: 'select_powder_material',
    description: 'Choose a Powder painting material by name.',
    annotations: { readOnlyHint: false, destructiveHint: false },
    inputSchema: { type: 'object', properties: { material: { type: 'string', enum: MATERIALS.map(m => m.name) } }, required: ['material'], additionalProperties: false },
    execute: input => {
      if (!input || typeof input.material !== 'string') throw new TypeError('Invalid material');
      const match = MATERIALS.find(m => m.name === input.material);
      if (!match) throw new TypeError('Invalid material');
      selectMaterial(match.id);
      return result(`Selected ${match.name}`);
    }
  });
}
