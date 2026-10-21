import { drawWall, structureAt, WALL_CONFIG } from './wall.mjs?v=visibility-1';
import { activeCue, bundledCues, validateCues } from './lyrics.mjs?v=full-song-1';
import { analyzeAudioBlob } from './onsets.mjs';
import { createInkwash } from './vendor/inkwash.js';
import { createSculpture } from './sculpture.mjs?v=continuous-flow-1';
import { createFractal } from './fractal.mjs?v=bank-1';
import { createFold } from './fold.mjs?v=zoom-1';
import { drawSputnik } from './sputnik.mjs?v=sputnik-detail-1';

const $ = id => document.getElementById(id);
const canvas = $('scene');
const ctx = canvas.getContext('2d', { alpha: true });
const audio = $('audio');
const playButton = $('playButton');
const timeline = $('timeline');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let width = 0, height = 0, dpr = 1;
let audioContext, analyser, source, frequency;
let animation = 0, fileURL = null, messageTimer = 0;
let sourceReplaced = false;
let onsetSchedule = Object.freeze([]), analysisGeneration = 0;
let inkwash = null, sculpture = null, fractal = null, fractalKind = null, backgroundMode = 'fold';
const foldStructures = { clouds: 0, caverns: 1, ribbons: 2 };
let foldStructure = 'clouds';
let foldZoom = 10;
function syncBackgroundControls() {
  const hidden = backgroundMode !== 'fold';
  $('foldStructureControl').hidden = hidden;
  $('foldZoomControl').hidden = hidden;
  $('dockZoomChoices').hidden = hidden;
  $('dockStructureChoices').hidden = hidden;
  const visibleMode = backgroundMode === 'canvas' ? 'ink' : backgroundMode;
  $('backgroundSelect').value = visibleMode;
  $('foldZoomSelect').value = String(foldZoom);
  $('foldStructureSelect').value = foldStructure;
  document.querySelectorAll('[data-structure]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.structure === foldStructure));
  });
  document.querySelectorAll('[data-background]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.background === visibleMode));
  });
  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.zoom) === foldZoom));
  });
}
let pendingSharedRestore = null, sharedContextLost = false;
let fieldPainted = false, fieldFailed = false, lastInkFrame = 0;
let sculpturePose = { time: 0, energy: { bass: 0, mid: 0, treble: 0, pulse: 0 } };
const sculptureBands = { bass: 0, mid: 0, treble: 0 };
let lastSculptureEnergyTime = 0;
let breakHistory = Object.freeze([]), nextBreakId = 1, choreographyFrozen = false, deferredSchedule = null;
let pointerEnabled = true;
let wallVisible = false;
let sputnikVisible = true;
let verticalOrbit = { yaw: 0, pitch: 0, roll: 0 };
let orientationTurn = 0, orientationTween = null;
const BANK_LIMIT = Math.PI / 10;
const BANK_RESPONSE = .6; // Slow approach and return: about five seconds to 95%.
const ORIENTATION_DURATION = 8000;
const heldBankKeys = new Set(), heldBankPointers = new Map();
let bankAngle = 0, lastBankFrame = 0;
let backgroundTime = 0, backgroundAudioTime = 0, backgroundFrameTime = 0;
let rewindHeld = false, rewindPointer = null, rewindKeyboard = false;
const bankMode = () => backgroundMode === 'fold' || backgroundMode === 'fractal';
const rewindMode = () => bankMode() || backgroundMode === 'sculpture';
function syncRewindControl() {
  const button = $('backgroundRewindButton');
  button.hidden = !rewindMode();
  button.disabled = reducedMotion.matches;
  button.setAttribute('aria-pressed', String(rewindHeld));
  button.title = rewindHeld ? 'Rewinding background (3×)' : 'Hold to rewind background (3×)';
}
function resetBackgroundClock() {
  backgroundTime = backgroundAudioTime = audio.currentTime || 0;
  backgroundFrameTime = performance.now();
}
function advanceBackgroundClock(now = performance.now()) {
  const audioTime = audio.currentTime || 0;
  if (rewindHeld) backgroundTime = Math.max(0, backgroundTime - 3 * Math.max(0, (now - backgroundFrameTime) / 1000));
  else backgroundTime = Math.max(0, backgroundTime + audioTime - backgroundAudioTime);
  backgroundAudioTime = audioTime;
  backgroundFrameTime = now;
}
function cancelBackgroundRewind() {
  if (rewindHeld) advanceBackgroundClock();
  rewindPointer = null;
  rewindKeyboard = false;
  rewindHeld = false;
  syncRewindControl();
}
function setBackgroundRewindHeld() {
  const held = rewindMode() && !reducedMotion.matches && (rewindPointer !== null || rewindKeyboard);
  if (held === rewindHeld) return;
  advanceBackgroundClock();
  rewindHeld = held;
  syncRewindControl();
  if (held) startFrames();
  else if (audio.paused) stopFrames();
  else render();
}
function bankDirection() {
  const left = heldBankKeys.has('KeyA') || [...heldBankPointers.values()].includes(-1);
  const right = heldBankKeys.has('KeyD') || [...heldBankPointers.values()].includes(1);
  return Number(right) - Number(left);
}
function bankMoving() { return bankMode() && !reducedMotion.matches && Math.abs(bankDirection() * BANK_LIMIT - bankAngle) > .0001; }
function syncBankInput() {
  if (reducedMotion.matches) { bankAngle = bankDirection() * BANK_LIMIT; render(); }
  else if (bankMoving()) startFrames();
}
function clearBank(resetAngle = false, repaint = true) {
  heldBankKeys.clear(); heldBankPointers.clear();
  if (resetAngle) { bankAngle = 0; lastBankFrame = 0; if (repaint) render(); }
  else syncBankInput();
}
let shownPhase = '', shownSecond = '', shownTimeline = -1;
const pointer = { x: 0, y: 0, active: false };
let cues = bundledCues;
$('lyricsEditor').value = JSON.stringify(bundledCues, null, 2);
let lastCue = null;
const energy = { bass: 0, mid: 0, treble: 0 };

function loaderStage(message) { if ($('loaderStage').textContent !== message) $('loaderStage').textContent = message; }
function revealWhenReady() {
  if ((fieldPainted || fieldFailed) && !$('loader').classList.contains('hidden')) {
    loaderStage('Ready');
    $('loader').classList.add('hidden');
  }
}
function installAnalysis({ duration, events }, generation) {
  if (generation !== analysisGeneration) return;
  const schedule = Object.freeze(events.map(event => Object.freeze({
    time: event.time / duration * WALL_CONFIG.phases.at(-1),
    strength: event.strength,
  })));
  if (choreographyFrozen) { deferredSchedule = schedule; render(); return; }
  onsetSchedule = schedule;
  render();
}
function analyzeSource(blob, generation) {
  return analyzeAudioBlob(blob).then(result => installAnalysis(result, generation))
    .catch(error => { if (generation === analysisGeneration) console.warn('Using timed rise without attack analysis:', error); });
}

function validateBundledAnalysis(data) {
  if (!data || !Number.isFinite(data.duration) || data.duration <= 0 || !Array.isArray(data.events)) throw new Error('Invalid bundled onset data.');
  let previousTime = -1;
  for (const event of data.events) {
    if (!event || !Number.isFinite(event.time) || event.time < 0 || event.time > data.duration ||
        !Number.isFinite(event.strength) || event.strength < 0 || event.strength > 1 || event.time < previousTime) {
      throw new Error('Invalid bundled onset event.');
    }
    previousTime = event.time;
  }
  return data;
}

function resetAnalysis(preserveSculpture = false) {
  energy.bass = energy.mid = energy.treble = 0;
  if (!preserveSculpture) sculptureBands.bass = sculptureBands.mid = sculptureBands.treble = 0;
  lastSculptureEnergyTime = 0;
  if (!audioContext || !source || !analyser) return;
  // A fresh analyser also clears its internal FFT smoothing history.
  source.disconnect();
  analyser.disconnect();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = .76;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  frequency = new Uint8Array(analyser.frequencyBinCount);
}

const clipDuration = () => Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : WALL_CONFIG.phases.at(-1);
const canonicalTime = () => Math.min(WALL_CONFIG.phases.at(-1), (audio.currentTime || 0) / clipDuration() * WALL_CONFIG.phases.at(-1));
function sculptureDriveAt(seconds) {
  return .48 * Math.max(0, seconds);
}
function clearBreaks() {
  breakHistory = Object.freeze([]);
  nextBreakId = 1;
  choreographyFrozen = false;
  if (deferredSchedule) { onsetSchedule = deferredSchedule; deferredSchedule = null; }
}
function triggerBreak() {
  if (!wallVisible) return;
  if (audio.paused || audio.ended) { showStatus('Press play to break the wall.'); return; }
  const start = canonicalTime();
  const peak = structureAt(audio.currentTime, clipDuration(), onsetSchedule, breakHistory).height;
  const entry = Object.freeze({
    id: nextBreakId++, start,
    end: start + WALL_CONFIG.breakDurationSeconds * WALL_CONFIG.phases.at(-1) / clipDuration(),
    peak, floor: Math.max(2, peak * WALL_CONFIG.collapseFloorRatio),
  });
  breakHistory = Object.freeze([...breakHistory.filter(item => item.start < start - .0001), entry]);
  choreographyFrozen = true;
  render();
}
const formatTime = seconds => {
  const whole = Math.floor(Math.max(0, seconds || 0));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};
function showStatus(message) {
  $('status').textContent = message;
  $('status').classList.add('show');
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => $('status').classList.remove('show'), 3600);
}
function resize() {
  width = innerWidth; height = innerHeight;
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  try { inkwash?.resize(width,height); } catch(error) {
    if (backgroundMode === 'ink') useFallback(error);
    else { try { inkwash?.dispose(); } catch {} inkwash = null; }
  }
  try { fractal?.resize(width,height); } catch(error) {
    if (backgroundMode === 'fold') useFoldFallback(error);
    else if (backgroundMode === 'fractal') useFractalFallback(error);
    else { try { fractal?.dispose(); } catch {} fractal = null; }
  }
  try { sculpture?.resize(width,height); } catch(error) {
    if (backgroundMode === 'sculpture') useSculptureFallback(error);
    else { try { sculpture?.dispose(); } catch {} sculpture = null; }
  }
  render();
}
function useFallback(error) {
  setSceneOverlays(false, false);
  cancelBackgroundRewind();
  resetBackgroundClock();
  clearBank(true, false);
  if (inkwash) { try { inkwash.dispose(); } catch {} inkwash = null; }
  $('field').style.display = 'none';
  $('sculpture').style.display = 'none';
  $('fractal').style.display = 'none';
  document.body.classList.remove('fractal-mode');
  backgroundMode = 'canvas';
  syncBackgroundControls();
  syncRewindControl();
  fieldFailed = true;
  revealWhenReady();
  if (error) { console.warn('Inkwash unavailable:', error); showStatus('Fluid ink unavailable; using the Canvas wash.'); }
}
function prepareInk() {
  if (inkwash) return true;
  loaderStage('Preparing ink');
  try {
    inkwash = createInkwash($('field'));
    inkwash.resize(width,height);
    inkwash.reset(reducedMotion.matches ? 0 : audio.currentTime || 0);
    lastInkFrame = 0;
    return true;
  } catch(error) { useFallback(error); return false; }
}
function useFoldFallback(error) {
  setSceneOverlays(false, false);
  cancelBackgroundRewind();
  resetBackgroundClock();
  clearBank(true, false);
  if (fractal) { try { fractal.dispose(); } catch {} fractal = null; fractalKind = null; }
  console.warn('Fold unavailable:', error);
  showStatus('Fold unavailable; using Fractal.');
  backgroundMode = 'fractal';
  syncBackgroundControls();
  setBackground('fractal');
}
function useFractalFallback(error) {
  setSceneOverlays(false, false);
  cancelBackgroundRewind();
  resetBackgroundClock();
  clearBank(true, false);
  if (fractal) { try { fractal.dispose(); } catch {} fractal = null; fractalKind = null; }
  $('fractal').style.display = 'none';
  console.warn('Fractal unavailable:', error);
  showStatus('Fractal unavailable; using Sculpture.');
  backgroundMode = 'sculpture';
  syncBackgroundControls();
  setBackground('sculpture');
}
function useSculptureFallback(error) {
  setSceneOverlays(false, false);
  cancelBackgroundRewind();
  resetBackgroundClock();
  clearBank(true, false);
  if (sculpture) { try { sculpture.dispose(); } catch {} sculpture = null; }
  $('sculpture').style.display = 'none';
  console.warn('Sculpture unavailable:',error);
  showStatus('Sculpture unavailable; using Ink.');
  backgroundMode = 'ink';
  syncBackgroundControls();
  syncRewindControl();
  document.body.classList.remove('fractal-mode');
  $('fractal').style.display = 'none';
  if (prepareInk()) $('field').style.display = '';
  else fieldFailed = true;
  render();
}
function setSceneOverlays(wall, craft) {
  wallVisible = wall;
  sputnikVisible = craft;
  document.body.classList.toggle('wall-hidden', !wallVisible);
  const wallButton = $('wallVisibilityButton');
  wallButton.setAttribute('aria-pressed', String(wallVisible));
  wallButton.setAttribute('aria-label', wallVisible ? 'Hide wall' : 'Show wall');
  wallButton.title = wallVisible ? 'Hide wall (W)' : 'Show wall (W)';
  $('breakButton').disabled = !wallVisible;
  $('verticalOrbitButton').disabled = !wallVisible;
  const craftButton = $('sputnikVisibilityButton');
  craftButton.setAttribute('aria-pressed', String(sputnikVisible));
  craftButton.setAttribute('aria-label', sputnikVisible ? 'Hide satellite' : 'Show satellite');
  craftButton.title = sputnikVisible ? 'Hide satellite (S)' : 'Show satellite (S)';
}
function setBackground(mode) {
  if (mode !== backgroundMode) { setSceneOverlays(false, false); clearBank(true, false); cancelBackgroundRewind(); resetBackgroundClock(); }
  if (mode === 'fold' || mode === 'fractal') {
    if (fractal && fractalKind !== mode) { fractal.dispose(); fractal = null; fractalKind = null; }
    if (!fractal) {
      try { fractal = mode === 'fold' ? createFold($('fractal')) : createFractal($('fractal')); fractal.resize(width,height); fractalKind = mode; }
      catch(error) { if (mode === 'fold') useFoldFallback(error); else useFractalFallback(error); return; }
    }
    backgroundMode = mode;
  } else if (mode === 'sculpture') {
    if (!sculpture) {
      try { sculpture = createSculpture($('sculpture')); sculpture.resize(width,height); }
      catch(error) { useSculptureFallback(error); return; }
    }
    backgroundMode = 'sculpture';
    sculpturePose = {time: audio.currentTime || 0, energy: {...sculptureBands,pulse:0,drive:sculptureDriveAt(audio.currentTime || 0)}};
  } else {
    backgroundMode = 'ink';
    if (!prepareInk()) return;
    lastInkFrame = 0;
  }
  syncBackgroundControls();
  syncRewindControl();
  $('sculpture').style.display = backgroundMode === 'sculpture' ? '' : 'none';
  $('fractal').style.display = (backgroundMode === 'fractal' || backgroundMode === 'fold') ? '' : 'none';
  document.body.classList.toggle('fractal-mode', backgroundMode === 'fractal' || backgroundMode === 'fold');
  document.body.classList.toggle('bank-mode', bankMode());
  $('field').style.display = backgroundMode === 'ink' ? '' : 'none';
  fieldFailed = false;
  render();
}
function readBand(fromHz, toHz) {
  if (!analyser || !frequency) return 0;
  const nyquist = audioContext.sampleRate / 2;
  const start = Math.max(0, Math.floor(fromHz / nyquist * frequency.length));
  const end = Math.min(frequency.length, Math.max(start + 1, Math.ceil(toHz / nyquist * frequency.length)));
  let total = 0;
  for (let i = start; i < end; i++) total += frequency[i];
  return total / (end - start) / 255;
}
function updateEnergy() {
  if (!analyser || audio.paused || reducedMotion.matches) return;
  analyser.getByteFrequencyData(frequency);
  const bass = readBand(45, 240), mid = readBand(250, 2400), treble = readBand(2600, 9000);
  energy.bass += (Math.min(1, bass * 1.95) - energy.bass) * .24;
  energy.mid += (Math.min(1, mid * 2.1) - energy.mid) * .22;
  energy.treble += (Math.min(1, treble * 2.6) - energy.treble) * .2;
  // The bundled track holds the low band around 0.56–0.89; the shared wall
  // mapping clips it near 1. Sculpture uses a separate contrast window.
  const now = performance.now();
  const dt = lastSculptureEnergyTime ? Math.min(.25, Math.max(0, (now-lastSculptureEnergyTime)/1000)) : .016;
  lastSculptureEnergyTime = now;
  for (const [key, value, low, span] of [['bass',bass,.48,.40],['mid',mid,.18,.44],['treble',treble,.02,.28]]) {
    const target = Math.max(0, Math.min(1, (value-low)/span));
    const tau = target > sculptureBands[key] ? .095 : .24;
    sculptureBands[key] += (target-sculptureBands[key]) * (1-Math.exp(-dt/tau));
  }
}
function updateLyrics() {
  const cue = $('lyricsEnabled').checked ? activeCue(cues, audio.currentTime) : null;
  if (cue === lastCue) return;
  lastCue = cue;
  $('lyricOverlay').textContent = cue?.text || '';
  $('lyricOverlay').classList.toggle('has-cue', !!cue);
}
function render(now = performance.now()) {
  advanceBackgroundClock(now);
  updateEnergy();
  if ((backgroundMode === 'fractal' || backgroundMode === 'fold') && fractal) {
    try {
      if (backgroundMode === 'fold') fractal.render(backgroundTime,reducedMotion.matches,bankAngle,foldStructures[foldStructure],foldZoom);
      else fractal.render(backgroundTime,reducedMotion.matches,bankAngle,0);
      fieldPainted = true; revealWhenReady();
    }
    catch(error) { if (backgroundMode === 'fold') useFoldFallback(error); else useFractalFallback(error); }
  } else if (backgroundMode === 'sculpture' && sculpture) {
    try {
      if (rewindHeld && !reducedMotion.matches) sculpturePose = {time:backgroundTime, energy:{...sculpturePose.energy,drive:sculptureDriveAt(backgroundTime)}};
      else if (!audio.paused && !reducedMotion.matches) sculpturePose = {time:backgroundTime, energy:{...sculptureBands,pulse:0,drive:sculptureDriveAt(backgroundTime)}};
      sculpture.render(sculpturePose.time,sculpturePose.energy,reducedMotion.matches);
      fieldPainted = true;
      revealWhenReady();
    } catch(error) { useSculptureFallback(error); }
  } else if (backgroundMode === 'ink' && inkwash) {
    try {
      const now = performance.now();
      const dt = lastInkFrame ? Math.min(.05, Math.max(0, (now-lastInkFrame)/1000)) : 0;
      lastInkFrame = now;
      if (!audio.paused && !reducedMotion.matches) inkwash.update(dt, energy, 0, true);
      inkwash.render();
      fieldPainted = true;
      revealWhenReady();
    } catch (error) { useFallback(error); }
  }
  const state = drawWall(ctx, width, height, audio.currentTime || 0, clipDuration(), energy, pointerEnabled ? pointer : null, reducedMotion.matches, onsetSchedule, breakHistory, verticalOrbit, backgroundMode === 'canvas', backgroundMode === 'fractal' || backgroundMode === 'fold', wallVisible);
  if (sputnikVisible) drawSputnik(ctx, width, height, audio.currentTime || 0, reducedMotion.matches,
    backgroundMode === 'fractal' || backgroundMode === 'fold');
  const phase = ['01 / ASSEMBLE', '02 / LAYER', '03 / ASCEND', '04 / RELEASE', '05 / REBUILD'][state.segment];
  if (phase !== shownPhase) { $('phaseLabel').textContent = phase; shownPhase = phase; }
  const progress = Math.min(1, Math.max(0, (audio.currentTime || 0) / clipDuration()));
  const timelineStep = Math.round(progress * 1000);
  if (timelineStep !== shownTimeline) {
    timeline.value = String(timelineStep);
    timeline.style.setProperty('--progress', `${progress * 100}%`);
    shownTimeline = timelineStep;
  }
  const second = formatTime(audio.currentTime);
  if (second !== shownSecond) { $('currentTime').textContent = second; shownSecond = second; }
  updateLyrics();
}
function frame(now) {
  animation = 0;
  const dt = lastBankFrame ? Math.min(.25, Math.max(0, (now - lastBankFrame) / 1000)) : 1 / 60;
  lastBankFrame = now;
  if (bankMode()) {
    const target = bankDirection() * BANK_LIMIT;
    bankAngle += (target - bankAngle) * (1 - Math.exp(-BANK_RESPONSE * dt));
    if (Math.abs(target - bankAngle) < .0001) bankAngle = target;
  }
  if (orientationTween) {
    const { from, target, start } = orientationTween;
    const progress = Math.min(1, (now - start) / ORIENTATION_DURATION);
    const eased = progress * progress * (3 - 2 * progress);
    verticalOrbit = Object.fromEntries(Object.keys(target).map(axis => [axis, from[axis] + (target[axis] - from[axis]) * eased]));
    if (progress >= 1) orientationTween = null;
  }
  render(now);
  if ((!audio.paused && !audio.ended && !reducedMotion.matches) || orientationTween || bankMoving() || (rewindHeld && backgroundTime > 0)) startFrames();
  else lastBankFrame = 0;
}
function startFrames() { if (!animation) { if (!lastBankFrame) lastBankFrame = performance.now(); animation = requestAnimationFrame(frame); } }
function stopFrames() {
  if (orientationTween || bankMoving() || (rewindHeld && backgroundTime > 0)) { startFrames(); return; }
  if (animation) cancelAnimationFrame(animation);
  animation = 0; lastBankFrame = 0; render();
}
function syncPlayButton() {
  const playing = !audio.paused && !audio.ended;
  playButton.classList.toggle('is-playing', playing);
  playButton.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');
  if (playing && !reducedMotion.matches) startFrames(); else stopFrames();
}
async function prepareAudio() {
  if (audioContext) { if (audioContext.state === 'suspended') await audioContext.resume(); return; }
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  try {
    audioContext = new Context();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = .76;
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    frequency = new Uint8Array(analyser.frequencyBinCount);
    await audioContext.resume();
  } catch (error) {
    console.warn('Audio analysis unavailable:', error);
    showStatus('Audio plays, but music response is unavailable in this browser.');
  }
}
async function togglePlayback() {
  if (!audio.paused) { audio.pause(); return; }
  if (audio.ended || audio.currentTime >= clipDuration() - .05) {
    clearBreaks();
    audio.currentTime = 0;
    cancelBackgroundRewind();
    resetBackgroundClock();
    inkwash?.reset(0);
    sculpturePose = {time:0,energy:{bass:0,mid:0,treble:0,pulse:0,drive:0}};
    render();
  }
  await prepareAudio();
  try { await audio.play(); } catch (error) { showStatus('Could not play this audio file.'); }
}

playButton.addEventListener('click', togglePlayback);
$('sputnikVisibilityButton').addEventListener('click', () => {
  setSceneOverlays(wallVisible, !sputnikVisible);
  render();
});
$('wallVisibilityButton').addEventListener('click', () => {
  setSceneOverlays(!wallVisible, sputnikVisible);
  render();
});
$('breakButton').addEventListener('click', triggerBreak);
audio.addEventListener('play', syncPlayButton);
audio.addEventListener('pause', () => { resetAnalysis(true); syncPlayButton(); });
audio.addEventListener('ended', () => { resetAnalysis(); syncPlayButton(); });
audio.addEventListener('timeupdate', () => { if (audio.paused || reducedMotion.matches) render(); });
audio.addEventListener('seeking', () => { cancelBackgroundRewind(); resetBackgroundClock(); resetAnalysis(); });
audio.addEventListener('seeked', () => { cancelBackgroundRewind(); resetBackgroundClock(); resetAnalysis(); inkwash?.reset(reducedMotion.matches ? 0 : audio.currentTime || 0); sculpturePose = {time:audio.currentTime || 0,energy:{bass:0,mid:0,treble:0,pulse:0,drive:sculptureDriveAt(audio.currentTime || 0)}}; lastInkFrame = 0; render(); });
audio.addEventListener('loadedmetadata', () => { $('duration').textContent = formatTime(audio.duration); render(); });
audio.addEventListener('error', () => showStatus('Audio could not be loaded. Choose a local audio file.'));
timeline.addEventListener('input', () => { cancelBackgroundRewind(); resetAnalysis(); audio.currentTime = Number(timeline.value) / 1000 * clipDuration(); resetBackgroundClock(); render(); });
audio.volume = Number($('volume').value) / 100;
$('volume').addEventListener('input', event => { audio.volume = Number(event.target.value) / 100; });
$('replaceButton').addEventListener('click', () => $('audioFile').click());
$('audioFile').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('audio/')) { showStatus('Choose an audio file.'); return; }
  sourceReplaced = true;
  clearBank(true);
  cancelBackgroundRewind();
  resetBackgroundClock();
  audio.pause();
  const generation = ++analysisGeneration;
  fieldPainted = false;
  inkwash?.reset(0); lastInkFrame = 0;
  sculpturePose = {time:0,energy:{bass:0,mid:0,treble:0,pulse:0,drive:0}};
  $('loader').classList.remove('hidden');
  clearBreaks();
  deferredSchedule = null;
  onsetSchedule = Object.freeze([]);
  void analyzeSource(file, generation);
  if (fileURL) URL.revokeObjectURL(fileURL);
  fileURL = URL.createObjectURL(file);
  audio.src = fileURL;
  audio.load();
  resetBackgroundClock();
  $('trackName').textContent = file.name;
  $('recordingTitle').textContent = file.name.replace(/\.[^.]+$/, '');
  $('recordingArtist').textContent = 'Local audio';
  $('sourceLabel').textContent = 'LOCAL AUDIO · FULL FILE';
  document.title = `Wall / Rise — ${file.name}`;
  $('duration').textContent = '0:00';
  cues = [];
  $('lyricsEditor').value = '[]';
  $('lyricsError').textContent = '';
  $('lyricOverlay').textContent = '';
  $('lyricOverlay').classList.remove('has-cue');
  lastCue = undefined;
  resetAnalysis();
  render();
  showStatus('Local audio loaded. Wall timing scales to its length.');
  event.target.value = '';
});

$('verticalOrbitButton').addEventListener('click', () => {
  const from = { ...verticalOrbit };
  orientationTurn++;
  const index = (orientationTurn - 1) % 4;
  const target = { yaw: orientationTurn * 75, pitch: [25, -30, 38, -18][index], roll: [24, -28, 36, -16][index] };
  if (reducedMotion.matches) { orientationTween = null; verticalOrbit = target; render(); }
  else { orientationTween = { from, target, start: performance.now() }; startFrames(); }
});

$('pointerButton').addEventListener('click', () => {
  pointerEnabled = !pointerEnabled;
  $('pointerButton').setAttribute('aria-pressed', String(pointerEnabled));
  $('pointerButton').textContent = pointerEnabled ? 'Pointer on' : 'Pointer off';
  render();
});
function changeBackground(event) {
  const mode = event.target.value;
  if (!['fold', 'fractal', 'sculpture', 'ink'].includes(mode)) { syncBackgroundControls(); return; }
  pendingSharedRestore = null;
  if (sharedContextLost && (mode === 'fold' || mode === 'fractal')) {
    pendingSharedRestore = mode;
    useFractalFallback(new Error('WebGL context lost'));
  } else setBackground(mode);
}
$('backgroundSelect').addEventListener('change', changeBackground);
document.querySelectorAll('[data-background]').forEach(button => {
  button.addEventListener('click', () => changeBackground({ target: { value: button.dataset.background } }));
});
function changeFoldStructure(choice) {
  if (!Object.hasOwn(foldStructures, choice)) { syncBackgroundControls(); return; }
  foldStructure = choice;
  syncBackgroundControls();
  render();
}
$('foldStructureSelect').addEventListener('change', event => changeFoldStructure(event.target.value));
document.querySelectorAll('[data-structure]').forEach(button => {
  button.addEventListener('click', () => changeFoldStructure(button.dataset.structure));
});

function changeFoldZoom(event) {
  const zoom = Number(event.target.value);
  if (![1, 4, 10].includes(zoom)) { syncBackgroundControls(); return; }
  foldZoom = zoom;
  syncBackgroundControls();
  render();
}
$('foldZoomSelect').addEventListener('change', changeFoldZoom);
document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => changeFoldZoom({ target: { value: button.dataset.zoom } }));
});
canvas.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; if (audio.paused) startFrames(); });
canvas.addEventListener('pointerleave', () => { pointer.active = false; if (audio.paused) startFrames(); });
const setRecordView = on => {
  document.body.classList.toggle('recording-view', on);
  $('recordButton').setAttribute('aria-pressed', String(on));
  $('recordButton').textContent = on ? 'Exit record view' : 'Record view';
};
$('recordButton').addEventListener('click', () => setRecordView(!document.body.classList.contains('recording-view')));
$('fullscreenButton').addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { showStatus('Fullscreen is unavailable here.'); }
});

const dialog = $('lyricsDialog');
$('lyricsButton').addEventListener('click', () => dialog.showModal());
$('lyricsClose').addEventListener('click', () => dialog.close());
$('lyricsEnabled').addEventListener('change', () => { lastCue = undefined; render(); });
$('lyricsForm').addEventListener('submit', event => {
  event.preventDefault();
  try {
    cues = validateCues(JSON.parse($('lyricsEditor').value), clipDuration());
    $('lyricsError').textContent = '';
    lastCue = undefined;
    render();
    dialog.close();
    showStatus(cues.length ? `${cues.length} timed lyric cues applied.` : 'Lyrics cleared.');
  } catch (error) { $('lyricsError').textContent = error instanceof SyntaxError ? 'Enter valid JSON.' : error.message; }
});
document.addEventListener('keydown', event => {
  if (dialog.open || event.target.closest('input,textarea,select,[contenteditable]')) return;
  if (bankMode() && (event.code === 'KeyA' || event.code === 'KeyD')) {
    event.preventDefault();
    if (!event.repeat) { heldBankKeys.add(event.code); syncBankInput(); }
    return;
  }
  if (event.target.closest('button')) return;
  if (event.code === 'Space') { event.preventDefault(); togglePlayback(); }
  if (event.key.toLowerCase() === 'w') $('wallVisibilityButton').click();
  if (event.key.toLowerCase() === 's') $('sputnikVisibilityButton').click();
  if (event.key.toLowerCase() === 'b') triggerBreak();
  if (event.key.toLowerCase() === 'y') $('verticalOrbitButton').click();
  if (event.key.toLowerCase() === 'r') setRecordView(!document.body.classList.contains('recording-view'));
  if (event.key.toLowerCase() === 'f') $('fullscreenButton').click();
});
document.addEventListener('keyup', event => {
  if (heldBankKeys.delete(event.code)) { event.preventDefault(); syncBankInput(); }
});
for (const [id, direction] of [['bankLeftButton', -1], ['bankRightButton', 1]]) {
  const button = $(id);
  button.addEventListener('pointerdown', event => {
    if (!bankMode()) return;
    event.preventDefault();
    heldBankPointers.set(event.pointerId, direction);
    try { button.setPointerCapture(event.pointerId); } catch { /* A synthetic pointer has no capture target. */ }
    syncBankInput();
  });
}
const backgroundRewindButton = $('backgroundRewindButton');
backgroundRewindButton.addEventListener('pointerdown', event => {
  if (!rewindMode() || reducedMotion.matches) return;
  event.preventDefault();
  rewindPointer = event.pointerId;
  try { backgroundRewindButton.setPointerCapture(event.pointerId); } catch { /* Synthetic pointers have no capture target. */ }
  setBackgroundRewindHeld();
});
function releaseRewindPointer(event) {
  if (rewindPointer !== event.pointerId) return;
  rewindPointer = null;
  setBackgroundRewindHeld();
}
addEventListener('pointerup', releaseRewindPointer);
addEventListener('pointercancel', releaseRewindPointer);
backgroundRewindButton.addEventListener('lostpointercapture', releaseRewindPointer);
backgroundRewindButton.addEventListener('keydown', event => {
  if (event.code !== 'Space' && event.code !== 'Enter') return;
  event.preventDefault();
  if (!event.repeat) { rewindKeyboard = true; setBackgroundRewindHeld(); }
});
document.addEventListener('keyup', event => {
  if (!rewindKeyboard || (event.code !== 'Space' && event.code !== 'Enter')) return;
  event.preventDefault();
  rewindKeyboard = false;
  setBackgroundRewindHeld();
});
backgroundRewindButton.addEventListener('click', event => event.preventDefault());
function releaseBankPointer(event) {
  if (heldBankPointers.delete(event.pointerId)) syncBankInput();
}
addEventListener('pointerup', releaseBankPointer);
addEventListener('pointercancel', releaseBankPointer);
addEventListener('blur', () => { clearBank(); cancelBackgroundRewind(); if (audio.paused) stopFrames(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearBank(); cancelBackgroundRewind(); if (audio.paused) stopFrames(); } });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && orientationTween) { verticalOrbit = orientationTween.target; orientationTween = null; } if (reducedMotion.matches) bankAngle = bankDirection() * BANK_LIMIT; cancelBackgroundRewind(); resetBackgroundClock(); syncRewindControl(); inkwash?.reset(reducedMotion.matches ? 0 : audio.currentTime || 0); if (!reducedMotion.matches) sculpturePose = {time:audio.currentTime || 0,energy:{...sculptureBands,pulse:0,drive:sculptureDriveAt(audio.currentTime || 0)}}; if (audio.paused || reducedMotion.matches) stopFrames(); else startFrames(); render(); });
addEventListener('resize', resize);
addEventListener('beforeunload', () => { if (fileURL) URL.revokeObjectURL(fileURL); inkwash?.dispose(); sculpture?.dispose(); fractal?.dispose(); });
resize();
requestAnimationFrame(() => setTimeout(() => {
  loaderStage('Preparing fold');
  setBackground('fold');
},0));
$('field').addEventListener('webglcontextlost', event => { event.preventDefault(); if (backgroundMode === 'ink') { useFallback(new Error('WebGL context lost')); render(); } else { inkwash = null; } });
$('field').addEventListener('webglcontextrestored', () => {
  if (backgroundMode !== 'ink') return;
  inkwash = null;
  if (prepareInk()) { $('field').style.display = ''; fieldFailed=false; render(); }
});
$('fractal').addEventListener('webglcontextlost', event => {
  event.preventDefault();
  sharedContextLost = true;
  if (backgroundMode === 'fold' || backgroundMode === 'fractal') {
    pendingSharedRestore = backgroundMode;
    // Both shaders use this canvas. Creating Fractal before restoration would fail too.
    useFractalFallback(new Error('WebGL context lost'));
  } else { fractal = null; fractalKind = null; }
});
$('fractal').addEventListener('webglcontextrestored', () => {
  sharedContextLost = false;
  fractal = null; fractalKind = null;
  const mode = pendingSharedRestore;
  pendingSharedRestore = null;
  if (mode) setBackground(mode);
});
$('sculpture').addEventListener('webglcontextlost', event => { event.preventDefault(); if (backgroundMode === 'sculpture') useSculptureFallback(new Error('WebGL context lost')); });
$('sculpture').addEventListener('webglcontextrestored', () => {
  sculpture = null;
  if (backgroundMode === 'sculpture') setBackground('sculpture');
});

// The bundled song remains on its native URL so the browser can use byte ranges.
// Precomputed attacks are optional; timed wall rise remains usable without them.
const startupGeneration = ++analysisGeneration;
fetch('assets/rewind-full.onsets.json').then(response => {
  if (!response.ok) throw new Error(`Onset data fetch failed: ${response.status}`);
  return response.json();
}).then(data => {
  if (startupGeneration === analysisGeneration) installAnalysis(validateBundledAnalysis(data), startupGeneration);
}).catch(error => {
  if (startupGeneration === analysisGeneration) console.warn('Using timed rise without bundled onset data:', error);
});
