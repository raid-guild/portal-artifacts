import { primaryControl } from './controls.js';
import { createDimmerVisual, createEclipseVisual, createStudyVisual } from './study-visuals.js';
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
import { loadAudioPreferences, saveAudioPreferences } from './audio-preferences.js';
import { predictCampaignPath } from './campaign-forecast.js';
import { resolvePlayControls } from './campaign-controls.js';
import { drawFinishArt } from './finish-art.js';
import { presentRunResult } from './run-result.js';
import { createDeathTransition, stepDeathTransition } from './death-transition.js';
import { captureTrailImage, createTrailGalleryStore, safeBrowserStorage } from './trail-gallery.js';
import { DEMOS, getDemo, DEFAULT_WELL_STRENGTH, gravityExchange, plateActivated } from './demos.js';
import { createEncounterState, stepEncounter, hazardPhase, mineAvailability, ENCOUNTER } from './encounter.js';
import { createBurnout, stepBurnout, cameraFrame, PICKUP_LIFE } from './burnout.js';
import { followFrame, followPosition } from './follow-camera.js';
import { CAMPAIGN, CAMPAIGN_LEVELS, campaignPointAllowed, canPlaceCampaignWell, createCampaign, getCampaignLevel, stepCampaign } from './campaign.js';
import { createEncounterVitality, stepEncounterVitality } from './encounter-vitality.js';
import { getChapterEncounter, chapterEncounterAvailable, readEncounterWins, saveEncounterWin, publicEncounterAchievements } from './chapter-encounters.js';
import { createMineGesture, MINE_HOLD_MS } from './mine-gesture.js';
import { BEST_GATES_KEY, SOUND_GATE_COLORS, betterGateMask, createSoundGates, gateCount, gatePattern, stepSoundGates, validateBestGates } from './sound-gates.js';
import { campaignGuideTarget, projectCampaignGuide } from './campaign-guide.js';
import { collectCompanionLight, commitCompanionCaptures, createEntityRuntime, entityAcceleration, holdsCampaignLight, releaseEntityHold, stepEntityRuntime } from './entity-runtime.js';
import { compileLevelDocument } from './level-document.js';
import { createEditor } from './editor.js';
import { makeBlankLevelDocument } from './editor-model.js';
import { campaignTemplateOptions, createCampaignTemplate } from './editor-campaign.js';
import { INFINITE_VERSION, generateInfiniteLevel, infiniteRunSeed, normalizeInfiniteSeed, normalizeInfiniteStage, randomInfiniteSeed } from './infinite.js';
import { wallCorners } from './wall-geometry.js';
import { createCompanionState, stepCompanion } from './companion.js';
import { createMoonHeat, moonEmberContact, stepMoonHeat } from './moon-heat.js';
import { EMBER_IMMUNITY, oldestOwnedMoon, rescuePosition, rescueVelocity, safeHeroPoint } from './moon-benefits.js';
import { ALL_CAMPAIGN_IDS, CHAPTERS, availableCampaignIds, campaignContinuation, campaignLevelAvailable, chapterUnlocked, earnedNotes, getChapter } from './chapter.js';
import { CHAPTER_GUIDES, readChapterGuides, acknowledgeChapterGuide, shouldShowChapterGuide, chapterGuideGraphic } from './chapter-tutorial.js';
import { createTransmission } from './transmission.js';
import { phraseForLevel, createPhraseState, stepPhrase, phraseRewardAt, phrasePulsePoint, phraseAcquireEnvelope, readDiscoveredPhrases, saveDiscoveredPhrase, publicPhraseAchievements, phraseAchievementById } from './phrase.js';
const route = new URLSearchParams(location.search);
let chapterEncounterId = !route.has('demo') && /^[1-5]$/.test(route.get('encounter') || '') ? Number(route.get('encounter')) : null;
let campaignMode = ALL_CAMPAIGN_IDS.some(id => String(id) === route.get('campaign')) && !route.has('demo') && !chapterEncounterId;
let campaignLevelId = campaignMode ? Number(route.get('campaign')) : 1;
const initialBestGates = (() => { try { return validateBestGates(JSON.parse(localStorage.getItem(BEST_GATES_KEY) || '{}'), ALL_CAMPAIGN_IDS); } catch { return {}; } })();
const lockedCampaignRoute = campaignMode && !campaignLevelAvailable(campaignLevelId, initialBestGates);
if (lockedCampaignRoute) campaignLevelId = availableCampaignIds(initialBestGates).at(-1);
const lockedEncounterRoute = !!chapterEncounterId && !chapterEncounterAvailable(chapterEncounterId, initialBestGates);
let infiniteMode = !route.has('demo') && !campaignMode && !chapterEncounterId && !!normalizeInfiniteSeed(route.get('infinite'));
let infiniteSeed = infiniteMode ? normalizeInfiniteSeed(route.get('infinite')) : '';
let infiniteStage = infiniteMode ? normalizeInfiniteStage(route.get('stage')) : 1;
function infiniteDemo(seed, stage) {
  const compiled = compileLevelDocument(generateInfiniteLevel(seed, stage));
  return { id: 'infinite', title: `Infinite Play · Stage ${stage}`, color: '#a2efe7',
    objective: `Seed ${seed} · Stage ${stage} · Follow the gates and carry your light to the portal.`,
    mechanic: 'campaign', heroGravity: 0, moons: [], level: compiled.level, document: compiled.document,
    entities: compiled.entities, settings: compiled.settings,
    soundGates: compiled.entities.filter(e => e.type === 'soundGate').map(e => ({ id: e.slot, x: e.x, y: e.y, radius: e.radius })) };
}
let activeDemo = chapterEncounterId ? getChapterEncounter(chapterEncounterId) : infiniteMode ? infiniteDemo(infiniteSeed, infiniteStage) : campaignMode ? getCampaignLevel(campaignLevelId) : getDemo(route.get('demo'));
let activeLevel = structuredClone(activeDemo.level);
let heroGravity = activeDemo.heroGravity;
let gateOpen = false;
const audio = new OrbitAudio();
const audioPreferences = loadAudioPreferences(localStorage);
audio.setMusicSource(`${import.meta.env.BASE_URL}audio/little-light-song.mp3`);
audio.setEffects(audioPreferences.effectsEnabled, audioPreferences.effectsVolume);
audio.setMusic(audioPreferences.musicEnabled, audioPreferences.musicVolume);
audio.setEnabled(!audioPreferences.muted);
let lastSoundWellTime = 0;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="scene" id="scene"><canvas id="minimap" width="360" height="203" role="img" aria-label="Map showing walls, the portal, wells, the glowing dot, and the current view"></canvas><div id="bossDirection" class="boss-direction hidden" aria-label="Ember is off screen"><b>➤</b><span>EMBER</span></div><div id="campaignDirection" class="campaign-direction hidden" role="img" aria-label="Next gate is off screen"><b>➤</b><span>GATE 1</span></div></div>
  <header class="chrome"><div class="brand"><span class="brand-orbit" aria-hidden="true">◎</span> ORBIT LAB</div><div class="actions"><button id="pause" class="quiet-button" type="button" aria-label="Pause" title="Pause (P)" disabled>Ⅱ</button><button id="galleryButton" class="quiet-button" type="button" aria-label="Demo gallery" title="Demo gallery">⊞</button><button id="restart" class="quiet-button" type="button" aria-label="Restart" title="Restart (R)">↺</button><button id="muteAll" class="quiet-button" type="button" aria-label="Mute all audio" title="Mute all audio" aria-pressed="false">🔊</button><button id="settingsButton" class="quiet-button" type="button" aria-label="Settings" aria-haspopup="dialog" aria-controls="settings" title="Settings">⚙</button></div></header>
  <div class="play-control"><button id="dropMine" class="mine-thumb hidden" type="button" aria-label="Drop mine" title="Drop mine · costs 8% light">Drop<br>mine</button><button id="primaryAction" class="primary-button" type="button" title="Primary action (Space)">Start</button></div><div id="mineHoldRing" class="mine-hold-ring hidden" aria-hidden="true"></div>
  <div class="scene-caption" id="sceneCaption">PLACE A WELL · THEN START</div>
  <dialog id="chapterGuide" class="chapter-guide" aria-labelledby="chapterGuideTitle" aria-describedby="chapterGuideDescription chapterGuideDetail chapterGuideGoal"><div class="chapter-guide-card"><span class="eyebrow" id="chapterGuideEyebrow"></span><h2 id="chapterGuideTitle"></h2><div id="chapterGuideIllustration" class="chapter-guide-illustration"></div><p id="chapterGuideDescription"></p><p id="chapterGuideDetail"></p><p class="chapter-guide-goal" id="chapterGuideGoal">Collect at least one sound gate, then reach the exit portal.</p><button id="chapterGuideDone" class="primary-button" type="button">Got it</button></div></dialog>
  <dialog id="settings" class="settings"><div class="settings-head"><div><span class="eyebrow">ORBIT LAB</span><h1>Settings</h1></div><button id="closeSettings" class="quiet-button" type="button" aria-label="Close settings">×</button></div>
    <p class="settings-intro">Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.</p>
    <div class="game-modes experiment-setting"><button id="homeFromSettings" type="button">Home</button><button id="browseDemos" type="button">Browse studies</button></div><p id="activeDemoLabel" class="microcopy experiment-setting"></p>
    <div class="control-group experiment-setting"><div class="control-heading"><label for="strength">Gravity strength</label><output id="strengthValue">70</output></div><input id="strength" type="range" min="35" max="180" step="1" value="70"></div>
    <div class="control-group experiment-setting"><div class="control-heading"><label for="heroGravity">Dot gravity</label><output id="heroGravityValue">0</output></div><input id="heroGravity" type="range" min="0" max="30" step="1" value="0"><p id="heroGravityHelp" class="microcopy">Attracts loose moons, with a small reaction on the dot.</p></div>
    <label class="toggle-row"><span>Sound effects</span><input id="soundEnabled" type="checkbox" checked></label>
    <div class="control-group audio-volume"><div class="control-heading"><label for="effectsVolume">Sound effects volume</label><output id="effectsVolumeValue">100%</output></div><input id="effectsVolume" type="range" min="0" max="100" step="1" value="100"></div>
    <label class="toggle-row"><span>Music</span><input id="musicEnabled" type="checkbox" checked></label>
    <div class="control-group audio-volume"><div class="control-heading"><label for="musicVolume">Music volume</label><output id="musicVolumeValue">15%</output></div><input id="musicVolume" type="range" min="0" max="100" step="1" value="15"></div>
    <div class="control-group experiment-setting"><div class="control-heading"><label for="lifetime">Well lifetime</label><output id="lifetimeValue">8.0s</output></div><input id="lifetime" type="range" min="2" max="16" step="0.5" value="8"><p class="microcopy">New wells use this lifetime.</p></div>
    <div class="control-group experiment-setting"><div class="control-heading">How wells end</div><div class="segmented" role="group" aria-label="How wells end"><button class="selected" data-mode="fade">Fade out</button><button data-mode="snap">Snap off</button></div><p class="microcopy" id="modeHelp">Pull weakens over the last 20% of a well’s life.</p></div>
    <label class="toggle-row"><span>Show predicted path</span><input id="showForecast" type="checkbox"></label><p id="forecastHelp" class="microcopy"></p>
    <div id="encounterBehaviorRow" class="control-group experiment-setting hidden"><div class="control-heading"><label for="encounterBehavior">Ember behavior</label></div><select id="encounterBehavior"><option value="adaptive">Adaptive</option><option value="chase">Chase</option><option value="flee">Flee</option></select></div>
    <div class="settings-stats experiment-setting"><div>State <strong id="stateLabel">READY</strong></div><div>Attempts <strong id="attempts">1</strong></div><div>Time <strong id="runTime">0.0s</strong></div><div>Speed <strong id="speed">0.00 u/s</strong></div></div>
    <div class="active-heading experiment-setting"><span>Active wells</span><small id="wellCount">0 / 2</small></div><div class="well-list experiment-setting" id="wellList"></div><button id="release" class="release-button experiment-setting" type="button">Release all wells</button>
    <p class="settings-help">Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R restarts · E removes oldest / releases capture · 1 / 2 remove a specific well.</p>
  </dialog>
  <div class="demo-note" id="demoNote"><strong id="demoTitle"></strong><span id="demoObjective"></span><div id="companionHud" class="companion-hud hidden" aria-live="polite"></div><div id="duelMeters" class="duel-meters hidden"><div id="resourceHud" class="resource-hud hidden"><div class="resource-top"><span id="resourceLabel">LIGHT</span><span id="resourceValue">60%</span><span id="gateStatus">GATE OPEN</span></div><div class="resource-track"><i id="resourceFill"></i><b></b><b></b></div></div><div id="bossResourceHud" class="resource-hud boss-resource hidden"><div class="resource-top"><span>EMBER LIGHT</span><span id="bossResourceValue">60%</span><span id="bossIntent">RETREATING</span></div><div class="resource-track"><i id="bossResourceFill"></i><b></b><b></b></div></div></div><div id="campaignGateHud" class="campaign-gate-hud hidden" aria-live="polite"><span id="campaignGateCount">0/3 gates</span><span id="campaignGateIcons"></span></div></div>
  <dialog id="gallery" class="gallery"><div class="gallery-heading"><div><span class="eyebrow">ORBIT LAB / MECHANICS GALLERY</span><h1>World studies.</h1><p>One new rule at a time. Experiments in gravity, light, and sound.</p></div><div class="gallery-actions"><button id="homeFromGallery" class="quiet-button" aria-label="Home" title="Home">⌂</button><button id="closeGallery" class="quiet-button" aria-label="Close gallery"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div><nav id="demoCategories" class="demo-categories" aria-label="Study categories"></nav><div class="demo-grid" id="demoGrid"></div><p class="gallery-footer">Every study starts paused. Place a well, then Start. Wells now begin at strength 70; settings let you compare.</p></dialog>
  <div id="home" class="home-overlay hidden"><div class="home-card"><span class="eyebrow">ORBIT LAB</span><h1>A little light in a large world.</h1><p>Draw a path with temporary gravity. Keep your light alive until you reach the portal.</p><button id="startCampaign" class="primary-button" type="button">Campaign ↗</button><button id="achievementsHome" class="home-secondary" type="button">Achievements ♪</button><button id="trailGalleryHome" class="home-secondary trail-gallery-link" type="button">Trail maps ◇</button><button id="startInfinite" class="home-secondary" type="button">Infinite Play</button><button id="studyHome" class="home-secondary" type="button">Studies</button><button id="openEditor" class="home-secondary" type="button">Level editor</button></div></div>
  <div id="infiniteSelect" class="home-overlay hidden"><div class="home-card infinite-select-card"><span class="eyebrow">INFINITE PLAY</span><h1>Every seed makes a world.</h1><p>Cross a new chamber each stage. Generation ${INFINITE_VERSION} adds companion moons, heavy neighbors, and orbiting embers. A seed and stage repeat within this generation.</p><label for="infiniteSeed">World seed</label><input id="infiniteSeed" type="text" maxlength="128" autocomplete="off" spellcheck="false"><div class="infinite-select-actions"><button id="beginInfinite" class="primary-button" type="button">Start crossing ↗</button><button id="infiniteBack" class="home-secondary" type="button">Back home</button></div></div></div>
  <div id="levelSelect" class="home-overlay hidden"><div class="home-card level-select-card"><span class="eyebrow">CAMPAIGN</span><h1>Choose a crossing.</h1><p id="levelUnlockHint" class="microcopy"></p><button id="achievementsLevels" class="home-secondary" type="button">Achievements ♪</button><button id="trailGalleryLevels" class="home-secondary trail-gallery-link" type="button">View trail maps ◇</button><div class="chapter-list" id="levelCards"></div><button id="levelsBack" class="home-secondary" type="button">Back home</button></div></div>
  <dialog id="achievements" class="achievements" aria-labelledby="achievementsTitle"><div class="achievements-head"><div><span class="eyebrow">YOUR DISCOVERIES</span><h2 id="achievementsTitle">Achievements.</h2><p>Hidden melodies and chapter encounters</p><p id="achievementsCount"></p></div><button id="closeAchievements" class="quiet-button" type="button" aria-label="Close achievements">×</button></div><div id="achievementsList" class="achievements-list"></div></dialog>
  <dialog id="phraseReplay" class="phrase-replay" aria-labelledby="phraseReplayTitle"><div class="phrase-replay-card"><span class="eyebrow">DISCOVERED MELODY</span><h2 id="phraseReplayTitle">Your phrase.</h2><p>Listen to the path you played.</p><div class="phrase-replay-notes" id="phraseReplayNotes" aria-hidden="true"></div><div class="phrase-replay-actions"><button id="restartPhraseReplay" class="home-secondary" type="button">Replay ♫</button><button id="closePhraseReplay" class="home-secondary" type="button">Close</button></div></div></dialog>
  <dialog id="trailGallery" class="trail-gallery" aria-label="Trail maps"><div class="trail-gallery-head"><div><span class="eyebrow">YOUR FLIGHTS</span><h1>Trail maps.</h1><p>The last finished flight from each campaign level, including the paths your moons made.</p></div><button id="closeTrailGallery" class="quiet-button" type="button" aria-label="Close trail maps">×</button></div><p id="trailGalleryNotice" class="trail-gallery-notice" role="status"></p><div id="trailGalleryGrid" class="trail-gallery-grid"></div></dialog>
  <dialog id="trailDetail" class="trail-detail" aria-label="Trail map detail"><div class="trail-detail-head"><span class="eyebrow" id="trailDetailLevel"></span><button id="closeTrailDetail" class="quiet-button" type="button" aria-label="Close trail detail">×</button></div><img id="trailDetailImage" alt="Glowing flight path and moon trails from this level"><h2 id="trailDetailTitle"></h2><p id="trailDetailStats"></p><div class="result-actions"><button id="playTrailLevel" class="primary-button" type="button">Play this level ↗</button><button id="backToTrailGallery" class="home-secondary" type="button">Back to maps</button></div></dialog>
  <div id="transmission" class="transmission hidden" inert role="dialog" aria-modal="true" aria-label="The transmission" aria-describedby="transmissionDescription"><canvas id="transmissionCanvas" aria-hidden="true"></canvas><div class="transmission-ui"><span class="eyebrow" id="transmissionHeading">CHAPTER ONE / TRANSMISSION</span><p id="transmissionCaption" aria-live="polite">A CALL INTO THE DARK</p><div><button id="transmissionMute" class="home-secondary" type="button">Mute</button><button id="skipTransmission" class="home-secondary" type="button">Skip · Esc</button></div></div><p class="transmission-description" id="transmissionDescription">A small light sends a five-note call into the dark. After a silence, a sound answers from beyond the screen. Press Escape or Skip to return to the levels.</p></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><div class="result-actions"><button id="driftRestart" class="primary-button" type="button">Retry</button><button id="driftHome" class="home-secondary" type="button">Home</button></div></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card trail-result"><span class="eyebrow" id="resultEyebrow">COURSE COMPLETE</span><h2 id="resultTitle">Your orbit.</h2><canvas id="winArtwork" width="1280" height="720" role="img" aria-label="The complete glowing trail drawn during your run"></canvas><p id="artworkUnavailable" class="microcopy hidden" role="status">Trail artwork unavailable for this flight.</p><p id="winStats"></p><p id="winGateStats" class="gate-result hidden"></p><p id="campaignUnlockHint" class="microcopy hidden"></p><p id="infiniteResult" class="infinite-result hidden"></p><div class="result-actions"><button id="winRestart" class="primary-button">Fly again ↗</button><button id="winEditor" class="home-secondary hidden" type="button">Back to editor</button><button id="editInfinite" class="home-secondary hidden" type="button">Edit this level</button><button id="copyInfinite" class="home-secondary hidden" type="button">Copy link</button><button id="winHome" class="home-secondary" type="button">Home</button></div></div></div>
`;

const $ = (selector) => document.querySelector(selector);
const sceneElement = $('#scene');
const wellList = $('#wellList');
const strengthInput = $('#strength');
const lifetimeInput = $('#lifetime');
const settings = $('#settings');
const caption = $('#sceneCaption');
const showForecast = $('#showForecast');
function persistAudioPreferences() { saveAudioPreferences(localStorage, audioPreferences); }
function syncMuteControl() {
  const button = $('#muteAll');
  button.setAttribute('aria-pressed', String(audioPreferences.muted));
  button.setAttribute('aria-label', audioPreferences.muted ? 'Unmute all audio' : 'Mute all audio');
  button.title = audioPreferences.muted ? 'Unmute all audio' : 'Mute all audio';
  button.textContent = audioPreferences.muted ? '🔇' : '🔊';
  $('#transmissionMute').textContent = audioPreferences.muted ? 'Unmute' : 'Mute';
}
$('#soundEnabled').checked = audioPreferences.effectsEnabled;
$('#effectsVolume').value = String(Math.round(audioPreferences.effectsVolume * 100));
$('#effectsVolumeValue').textContent = `${Math.round(audioPreferences.effectsVolume * 100)}%`;
$('#musicEnabled').checked = audioPreferences.musicEnabled;
$('#musicVolume').value = String(Math.round(audioPreferences.musicVolume * 100));
$('#musicVolumeValue').textContent = `${Math.round(audioPreferences.musicVolume * 100)}%`;
showForecast.checked = audioPreferences.showForecast;
syncMuteControl();
const pauseButton = $('#pause');
const driftOverlay = $('#driftOverlay');
const winOverlay = $('#winOverlay');
let resultArtworkGeneration = 0;
function invalidateRunArtwork() { resultArtworkGeneration++; }
let activeTransmissionChapter = 1;
const transmission = createTransmission({ overlay: $('#transmission'), canvas: $('#transmissionCanvas'), caption: $('#transmissionCaption'), audio,
  onFinish: () => { $('#levelSelect').inert = false; showLevelSelect(); $(`[data-replay-chapter="${activeTransmissionChapter}"]`)?.focus(); } });
function startTransmission(chapterId = 1) {
  const chapter = getChapter(chapterId);
  if (!chapterUnlocked(bestGates, chapter.id)) return;
  invalidateRunArtwork();
  activeTransmissionChapter = chapter.id;
  paused = true; audio.stopHeartbeat(); audio.trail(false, 0, 0); audio.orb(false, 0);
  winOverlay.classList.add('hidden'); driftOverlay.classList.add('hidden');
  for (const selector of ['.chrome', '.scene', '.play-control', '#levelSelect']) $(selector).inert = true;
  $('#transmissionHeading').textContent = chapter.heading;
  $('#transmissionDescription').textContent = chapter.description;
  $('#transmissionMute').textContent = audio.enabled ? 'Mute' : 'Unmute';
  audio.syncMusic(false);
  transmission.start(earnedNotes(bestGates, chapter.id), chapter.id); $('#skipTransmission').focus();
}
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

function releaseDirectionMark(radius, degrees) {
  const angle = degrees * Math.PI / 180, dx = Math.cos(angle), dy = Math.sin(angle);
  const sideX = -dy, sideY = dx;
  const tip = radius * 1.06, back = radius * .7, halfWidth = radius * .18;
  const marker = line([
    { x: dx * back + sideX * halfWidth, y: dy * back + sideY * halfWidth, z: .24 },
    { x: dx * tip, y: dy * tip, z: .24 },
    { x: dx * back - sideX * halfWidth, y: dy * back - sideY * halfWidth, z: .24 },
  ], new THREE.LineBasicMaterial({ color: 0xffd58e, transparent: true, opacity: .84, depthTest: false, depthWrite: false }));
  marker.renderOrder = 1001;
  return marker;
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
// Dark dust lives in world space on the lit floor, beneath the walls' shadows.
const chapterBackdrop = {
  amount: { value: 0 },
  center: { value: new THREE.Vector2() },
  seed: { value: 0 },
  scale: { value: .06 },
  density: { value: 0 },
  strands: { value: 0 },
  tint: { value: new THREE.Color(0x5b7484) },
};
floor.material.onBeforeCompile = shader => {
  Object.assign(shader.uniforms, { chapterAmount: chapterBackdrop.amount, chapterCenter: chapterBackdrop.center,
    chapterSeed: chapterBackdrop.seed, chapterScale: chapterBackdrop.scale, chapterDensity: chapterBackdrop.density,
    chapterStrands: chapterBackdrop.strands, chapterTint: chapterBackdrop.tint });
  shader.vertexShader = 'varying vec2 chapterWorld;\n' + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nchapterWorld = (modelMatrix * vec4(transformed, 1.0)).xy;');
  shader.fragmentShader = `uniform float chapterAmount;
    uniform vec2 chapterCenter;
    uniform float chapterSeed;
    uniform float chapterScale;
    uniform float chapterDensity;
    uniform float chapterStrands;
    uniform vec3 chapterTint;
    varying vec2 chapterWorld;
    float dustHash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float dustNoise(vec2 p) {
      vec2 cell = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(dustHash(cell), dustHash(cell + vec2(1.0, 0.0)), f.x),
        mix(dustHash(cell + vec2(0.0, 1.0)), dustHash(cell + vec2(1.0, 1.0)), f.x), f.y);
    }
    float dustFbm(vec2 p) {
      float value = 0.0;
      float weight = 0.5;
      for (int i = 0; i < 4; i++) {
        value += weight * dustNoise(p);
        p *= 2.03;
        weight *= 0.5;
      }
      return value / 0.9375;
    }
  ` + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
    if (chapterAmount > 0.0) {
      vec2 p = (chapterWorld - chapterCenter) * chapterScale;
      vec2 offset = vec2(chapterSeed * 3.71, chapterSeed * 5.29);
      // The long levels compress only the horizontal band coordinate, so the
      // diagonal crosses the starting view and remains in the playfield.
      vec2 domain = vec2(p.x * 0.42, p.y);
      vec2 q = vec2(dot(domain, vec2(0.866, 0.5)), dot(domain, vec2(-0.5, 0.866)));
      float crossWarp = 0.18 * (dustNoise(vec2(q.x * 2.7, chapterSeed) + offset) - 0.5);
      float lane = q.y + crossWarp - 0.07 * sin(q.x * 0.7 + chapterSeed);
      float band = exp(-pow(abs(lane) / 0.66, 1.5));
      float n = dustFbm(vec2(q.x * 6.0, lane * 12.0) + offset * 0.41);
      float patches = smoothstep(0.44 - chapterDensity * 0.25,
        0.64 - chapterDensity * 0.25, n);
      float fine = dustFbm(vec2(q.x * 9.0, lane * 19.0) + offset);
      float riftWarp = (n - 0.5) * 0.18;
      float rift = 1.0 - smoothstep(0.10, 0.24, abs(lane + riftWarp));
      float dust = band * clamp(0.12 + 0.25 * patches + 0.62 * rift
        + 0.12 * chapterStrands * smoothstep(0.54, 0.70, fine), 0.0, 1.0);
      diffuseColor.rgb += (vec3(0.08, 0.10, 0.13) + chapterTint * 0.12)
        * chapterAmount * band * 0.15;
      diffuseColor.rgb *= 1.0 - chapterAmount * dust * 0.80;
      vec2 starCoord = chapterWorld * 3.0;
      vec2 starCell = floor(starCoord);
      vec2 starPoint = vec2(dustHash(starCell + 37.1), dustHash(starCell + 91.7));
      float starDistance = length(fract(starCoord) - starPoint);
      float starRadius = mix(0.035, 0.075, dustHash(starCell + 26.4));
      float starAa = max(length(fwidth(starCoord)) * 0.4, 0.003);
      float star = (1.0 - smoothstep(starRadius - starAa,
        starRadius + starAa, starDistance))
        * step(mix(0.985, 0.60, band), dustHash(starCell + 54.3));
      float starBrightness = mix(0.055, 0.16, dustHash(starCell + 12.8));
      diffuseColor.rgb += vec3(0.72, 0.86, 1.0) * star * starBrightness
        * (1.0 - 0.85 * dust) * chapterAmount;
    }
  `);
};
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
const deathRipple = new THREE.Mesh(new THREE.RingGeometry(1, 1.075, 72), new THREE.MeshBasicMaterial({ color: 0x8af5f1, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
deathRipple.position.z = 2.15;
deathRipple.visible = false;
scene.add(deathRipple);

// A bounded ember pool; particles drift behind the fireball without affecting physics.
const SPARK_COUNT = 128;
const sparks = Array.from({ length: SPARK_COUNT }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, duration: 1 }));
const sparkPositions = new Float32Array(SPARK_COUNT * 3);
const sparkHeat = new Float32Array(SPARK_COUNT);
const sparkGeometry = new THREE.BufferGeometry();
sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3).setUsage(THREE.DynamicDrawUsage));
sparkGeometry.setAttribute('heat', new THREE.BufferAttribute(sparkHeat, 1).setUsage(THREE.DynamicDrawUsage));
const sparkMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { pixelRatio: { value: renderer.getPixelRatio() }, fade: { value: 1 } },
  vertexShader: 'attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}',
  fragmentShader: 'uniform float fade; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(.25,.8,.85),vec3(.9,1.,.96),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat*fade);}',
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
const moonArchiveCanvas = document.createElement('canvas');
moonArchiveCanvas.width = archiveCanvas.width; moonArchiveCanvas.height = archiveCanvas.height;
const moonArchiveContext = moonArchiveCanvas.getContext('2d');
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
  const moonCopy = document.createElement('canvas');
  moonCopy.width = moonArchiveCanvas.width; moonCopy.height = moonArchiveCanvas.height;
  moonCopy.getContext('2d').drawImage(moonArchiveCanvas, 0, 0);
  archiveContext.clearRect(0, 0, archiveCanvas.width, archiveCanvas.height);
  moonArchiveContext.clearRect(0, 0, moonArchiveCanvas.width, moonArchiveCanvas.height);
  const w = archiveCanvas.width * archiveHalfWidth / nextX;
  const h = archiveCanvas.height * archiveHalfHeight / nextY;
  archiveContext.drawImage(copy, (archiveCanvas.width - w) / 2, (archiveCanvas.height - h) / 2, w, h);
  moonArchiveContext.drawImage(moonCopy, (moonArchiveCanvas.width - w) / 2, (moonArchiveCanvas.height - h) / 2, w, h);
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
function clearTrail() { archiveContext.clearRect(0, 0, archiveCanvas.width, archiveCanvas.height); moonArchiveContext.clearRect(0, 0, moonArchiveCanvas.width, moonArchiveCanvas.height); archiveHalfWidth = 13; archiveHalfHeight = 9; archive.scale.set(1, 1, 1); archiveTexture.needsUpdate = true; trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0); }
function archiveSegment(a, b) {
  const sx = archiveCanvas.width / (archiveHalfWidth * 2), sy = archiveCanvas.height / (archiveHalfHeight * 2);
  archiveContext.beginPath(); archiveContext.moveTo((a.x + archiveHalfWidth) * sx, (archiveHalfHeight - a.y) * sy); archiveContext.lineTo((b.x + archiveHalfWidth) * sx, (archiveHalfHeight - b.y) * sy);
  archiveContext.strokeStyle = 'rgba(80,226,222,.095)'; archiveContext.lineWidth = 2; archiveContext.lineCap = 'round'; archiveContext.stroke(); archiveTexture.needsUpdate = true;
}
function archiveCompanionSegment(a, b) {
  expandArchive(Math.max(Math.abs(a.x), Math.abs(b.x)) + 2, Math.max(Math.abs(a.y), Math.abs(b.y)) + 2);
  const sx = moonArchiveCanvas.width / (archiveHalfWidth * 2), sy = moonArchiveCanvas.height / (archiveHalfHeight * 2);
  moonArchiveContext.beginPath();
  moonArchiveContext.moveTo((a.x + archiveHalfWidth) * sx, (archiveHalfHeight - a.y) * sy);
  moonArchiveContext.lineTo((b.x + archiveHalfWidth) * sx, (archiveHalfHeight - b.y) * sy);
  moonArchiveContext.strokeStyle = 'rgba(195,174,255,.22)';
  moonArchiveContext.lineWidth = 1.25;
  moonArchiveContext.lineCap = 'round';
  moonArchiveContext.stroke();
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
  if (rect.angle) wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rect.angle);
  world.addBody(wall);
  wall.isGate = !!rect.gate; wallBodies.push(wall);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(rect.w, rect.h, 4, 4, 0.18), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  // Span below the floor and above the lights: no light can pass over a wall end.
  mesh.position.set(rect.x, rect.y, 1);
  mesh.rotation.z = rect.angle || 0;
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
  material.fragmentShader = 'uniform float fade; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(1.,.2,.02),vec3(1.,.72,.2),vHeat),pow(1.-r,2.)*vHeat*.65*fade);}';
  const points = new THREE.Points(geometry, material); points.frustumCulled = false; group.add(points);
  group.userData.setFade = fade => {
    group.visible = fade > 0;
    dot.material.transparent = true; dot.material.opacity = fade;
    aura.material.opacity = .7 * fade; light.intensity = 4 * fade;
    material.uniforms.fade.value = fade;
  };
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
  portalSparkMaterial.fragmentShader = 'uniform float fade; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(.4,.12,1.),vec3(.85,.6,1.),vHeat),pow(1.-r,2.)*vHeat*fade);}';
const portalSparkPoints = new THREE.Points(portalSparkGeometry, portalSparkMaterial); portalSparkPoints.frustumCulled = false; portal.add(portalSparkPoints);
// One encounter visual is reused across the study; the boss and its warning
// occupy world space, so the existing camera and wells still describe motion.
const encounterGroup = new THREE.Group(); scene.add(encounterGroup); encounterGroup.visible = false;
const encounterCore = new THREE.Mesh(new THREE.SphereGeometry(ENCOUNTER.bossRadius, 24, 16), new THREE.MeshBasicMaterial({ color: 0xff8c39, transparent: true }));
encounterCore.position.z = 1.15; encounterGroup.add(encounterCore);
const encounterGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberMap, transparent: true, opacity: .72, depthWrite: false, blending: THREE.AdditiveBlending }));
encounterGlow.position.z = 1.2; encounterGlow.scale.set(4.2, 4.2, 1); encounterGroup.add(encounterGlow);
const encounterLight = new THREE.PointLight(0xff8a32, 9, 8, 2); encounterLight.position.z = 1.1; encounterGroup.add(encounterLight);
const encounterRim = ring(ENCOUNTER.bossRadius + .16, new THREE.LineBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: .9 }));
encounterRim.position.z = 1.55; encounterGroup.add(encounterRim);
const encounterHazards = Array.from({ length: ENCOUNTER.maxMinesPerOwner * 2 }, () => {
  const group = new THREE.Group(); scene.add(group); group.visible = false;
  const disk = new THREE.Mesh(new THREE.CircleGeometry(ENCOUNTER.burstRadius, 40),
    new THREE.MeshBasicMaterial({ color: 0xff7e35, transparent: true, opacity: .12, depthWrite: false, side: THREE.DoubleSide }));
  disk.position.z = 1.35; group.add(disk);
  const rim = ring(ENCOUNTER.burstRadius, new THREE.LineBasicMaterial({ color: 0xffad68, transparent: true, opacity: .7 }));
  rim.position.z = 1.48; group.add(rim);
  const core = new THREE.Mesh(new THREE.CircleGeometry(.2, 16), new THREE.MeshBasicMaterial({ color: 0xffc379, transparent: true }));
  core.position.z = 1.5; group.add(core);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberMap, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.z = 1.4; glow.scale.set(2.3, 2.3, 1); group.add(glow);
  return { group, disk, rim, core, glow };
});
const encounterWake = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
  new THREE.LineBasicMaterial({ color: 0xffae6a, transparent: true, opacity: .7 }));
encounterWake.position.z = 1.35; encounterGroup.add(encounterWake);
function updateEncounterVisual(now) {
  const state = encounter;
  encounterGroup.visible = !!state && activeDemo.mechanic === 'encounter';
  encounterHazards.forEach((visual, index) => {
    const hazard = encounterGroup.visible ? state.hazards[index] : null;
    visual.group.visible = !!hazard;
    if (!hazard) return;
    visual.group.position.set(hazard.x, hazard.y, 0);
    const phase = hazardPhase(hazard.age);
    const fade = phase === 'fading' ? Math.max(0, 1 - (hazard.age - ENCOUNTER.warnDuration - ENCOUNTER.activeDuration) / ENCOUNTER.fadeDuration) : 1;
    const friendly = hazard.owner === 'hero';
    visual.disk.material.color.setHex(friendly ? 0x35bfe5 : 0xff7e35);
    visual.rim.material.color.setHex(friendly ? 0x9eeeff : 0xffad68);
    visual.core.material.color.setHex(friendly ? 0xd9ffff : 0xffc379);
    visual.disk.material.opacity = (phase === 'active' ? .52 : phase === 'warning' ? .12 : .16) * fade;
    visual.rim.material.opacity = (phase === 'active' ? .95 : .6) * fade;
    visual.core.material.opacity = fade;
    visual.glow.material.opacity = (phase === 'active' ? .8 : .4) * fade;
  });
  if (!encounterGroup.visible) { $('#bossDirection').classList.add('hidden'); return; }
  encounterGroup.position.set(state.boss.x, state.boss.y, 0);
  encounterRim.material.opacity = state.ramArmed ? .9 : .2;
  encounterWake.visible = state.phase === 'flee';
  if (encounterWake.visible) {
    const points = encounterWake.geometry.attributes.position;
    const speed = Math.hypot(state.boss.vx, state.boss.vy) || 1;
    points.setXYZ(0, 0, 0, 0);
    points.setXYZ(1, -state.boss.vx / speed * 2, -state.boss.vy / speed * 2, 0);
    points.needsUpdate = true;
  }
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const burst = Math.max(0, 1 - encounterFlashAge / .55);
  encounterCore.material.color.setHex(state.phase === 'resolved' ? 0xc5ffee : 0xff8c39);
  encounterLight.color.setHex(state.phase === 'resolved' ? 0xaaffde : 0xff8a32);
  const bossEnergy = encounterVitality?.boss.energy ?? 1;
  encounterCore.material.opacity = .08 + bossEnergy * .92;
  encounterGlow.material.opacity = Math.min(1, (state.phase === 'resolved' ? 1 : .18 + bossEnergy * .55) + burst * .25);
  encounterGlow.scale.setScalar(reduced ? 4.2 : 4.2 + burst * 1.6);
  encounterLight.intensity = Math.min(18, (state.phase === 'resolved' ? 17 : 2 + bossEnergy * 10) + burst * 7);
  const arrow = $('#bossDirection');
  if (!chapterEncounterId || state.phase === 'resolved' || won || drifted || deathTransition || winOverlay.classList.contains('hidden') === false) { arrow.classList.add('hidden'); return; }
  const dx = state.boss.x - camera.position.x, dy = state.boss.y - camera.position.y;
  const halfW = camera.right, halfH = camera.top;
  const offscreen = Math.abs(dx) > halfW - 1 || Math.abs(dy) > halfH - 1;
  arrow.classList.toggle('hidden', !offscreen);
  if (offscreen) {
    arrow.style.left = `${Math.max(11, Math.min(88, 50 + dx / halfW * 42))}%`;
    arrow.style.top = `${Math.max(17, Math.min(78, 50 - dy / halfH * 38))}%`;
    arrow.style.setProperty('--boss-arrow-angle', `${Math.atan2(-dy, dx)}rad`);
  }
}
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
const officialCampaign = () => campaignMode && !editorPlaytest;
const fixedCampaignControls = () => (campaignMode || !!chapterEncounterId) && !editorPlaytest;
const resolvedControls = () => resolvePlayControls({ campaignMode: campaignMode || !!chapterEncounterId, editorPlaytest, settings: activeDemo.settings,
  strength: Number(strengthInput.value), lifetime: Number(lifetimeInput.value), mode, heroGravity });
const effectiveMode = () => resolvedControls().mode;
const effectiveStrength = () => resolvedControls().strength;
const effectiveLifetime = () => resolvedControls().lifetime;
let paused = true;
let runState = 'ready';
let resumeAfterSettings = false;
let drifted = false;
let frameCount = 0;
let pointer = null;
let pointerDownAt = 0;
const mineGesture = createMineGesture();
let mineHoldTimer = null;
function releaseCanvasPointer(id) {
  if (id !== undefined && renderer.domElement.hasPointerCapture?.(id)) renderer.domElement.releasePointerCapture(id);
}
function cancelMineHold() {
  clearTimeout(mineHoldTimer); mineHoldTimer = null; mineGesture.cancel();
  releaseCanvasPointer(pointer?.id);
  pointer = null;
  $('#mineHoldRing').classList.add('hidden');
}
let gameMode = activeDemo.sandbox ? 'sandbox' : 'maze';
let attempts = 0;
let won = false;
let deathTransition = null;
function cancelDeathTransition() {
  deathTransition = null;
  deathRipple.visible = false;
  core.visible = true;
}
let burnout = null;
let encounter = null;
let encounterFlashAge = Infinity;
let encounterVitality = null;
let encounterMineQueued = false;
let encounterSizzleUntil = -1;
let lastEncounterSizzleTime = -1;
let encounterPreviousLifetime = null;
let campaign = null;
let editorPlaytest = false;
let editor;
let soundGates = null;
let phraseState = createPhraseState();
let phraseReward = null;
let phraseReplay = null;
let phraseReplayIndex = -1;
let phraseReplayReturnFocus = null;
let achievementsReturnFocus = null;
const phraseAcquireAge = new Array(8).fill(Infinity);
let discoveredPhrases = readDiscoveredPhrases(safeBrowserStorage(window, 'localStorage'));
const activePhrase = () => officialCampaign() ? phraseForLevel(campaignLevelId) : null;
const phraseActive = () => !!activePhrase();
let entityRuntime = null;
let emberImmuneUntil = -1;
let lastSafeHero = null;
let moonCueUntil = -1;
const hasCompanionRule = () => activeDemo.mechanic === 'companion' || (activeDemo.entities || []).some(entity => entity.type === 'companion');
let wellsUsed = 0;
let homeOpen = false;
let visitedBounds = null;
const challengeMode = () => campaignMode || infiniteMode || !!chapterEncounterId;
const completionKey = 'orbit-lab-campaign-complete-v1';
let completedLevels = (() => { try { return new Set(JSON.parse(localStorage.getItem(completionKey) || '[]').filter(id => ALL_CAMPAIGN_IDS.includes(id))); } catch { return new Set(); } })();
function markLevelComplete(id) { completedLevels.add(id); try { localStorage.setItem(completionKey, JSON.stringify([...completedLevels])); } catch {} }
let bestGates = initialBestGates;
let encounterWins = readEncounterWins(safeBrowserStorage(window, 'localStorage'));
const chapterGuideStorage = safeBrowserStorage(window, 'localStorage');
let seenChapterGuides = readChapterGuides(chapterGuideStorage);
const chapterGuide = $('#chapterGuide');
let chapterGuideFocus = null;
let chapterGuideLevelId = null;
function closeChapterGuide({ acknowledge = false, restoreFocus = true } = {}) {
  if (!chapterGuide.open) return;
  if (acknowledge && chapterGuideLevelId) seenChapterGuides = acknowledgeChapterGuide(chapterGuideStorage, seenChapterGuides, chapterGuideLevelId);
  chapterGuide.close();
  chapterGuideLevelId = null;
  const focus = chapterGuideFocus;
  chapterGuideFocus = null;
  if (restoreFocus && focus?.isConnected && !focus.closest('.hidden')) focus.focus();
  else if (restoreFocus && !homeOpen) $('#primaryAction').focus();
}
function openChapterGuide(levelId, focusTarget = document.activeElement) {
  const guide = CHAPTER_GUIDES[levelId];
  if (!guide || chapterGuide.open || settings.open || gallery.open || transmission.active || editor?.open) return false;
  chapterGuideFocus = focusTarget;
  chapterGuideLevelId = levelId;
  $('#chapterGuideEyebrow').textContent = `CHAPTER ${guide.chapter} / FIELD GUIDE`;
  $('#chapterGuideTitle').textContent = guide.title;
  $('#chapterGuideDescription').textContent = guide.instruction;
  $('#chapterGuideDetail').textContent = guide.detail;
  $('#chapterGuideIllustration').innerHTML = chapterGuideGraphic(guide.illustration);
  pointer = null;
  chapterGuide.showModal();
  $('#chapterGuideDone').focus();
  return true;
}
$('#chapterGuideDone').addEventListener('click', () => closeChapterGuide({ acknowledge: true }));
chapterGuide.addEventListener('cancel', event => { event.preventDefault(); closeChapterGuide({ acknowledge: true }); });
const trailGalleryStore = createTrailGalleryStore({ persistent: safeBrowserStorage(window, 'localStorage'), session: safeBrowserStorage(window, 'sessionStorage'), levelIds: ALL_CAMPAIGN_IDS });
let trailGalleryReturnFocus = null;
let trailDetailLevelId = null;
let trailDetailGoingToLevel = false;
function updateTrailGalleryNotice() {
  $('#trailGalleryNotice').textContent = trailGalleryStore.storage === 'session' ? 'Device storage is full. These maps will last for this browser session.' : trailGalleryStore.storage === 'memory' ? 'Device storage is unavailable. These maps will last until this page closes.' : '';
}
function renderTrailGallery() {
  const grid = $('#trailGalleryGrid');
  grid.replaceChildren();
  for (const level of CAMPAIGN_LEVELS.filter(item => campaignLevelAvailable(item.id, bestGates))) {
    const record = trailGalleryStore.get(level.id);
    const card = document.createElement('button'); card.type = 'button'; card.className = 'trail-gallery-card';
    card.dataset.trailLevel = String(level.id); card.disabled = !record;
    const art = document.createElement('span'); art.className = 'trail-gallery-art';
    if (record) { const image = document.createElement('img'); image.src = record.image; image.alt = ''; art.append(image); }
    else art.textContent = 'NO FLIGHT YET';
    const label = document.createElement('span'); label.className = 'trail-gallery-label';
    label.textContent = `${String(level.id).padStart(2, '0')} / ${level.title}`;
    const latest = document.createElement('span'); latest.className = 'trail-gallery-outcome';
    latest.textContent = record ? `${record.outcome === 'complete' ? 'REACHED THE PORTAL' : 'SIGNAL LOST'} · ${record.seconds.toFixed(1)}s · ${record.wells} well${record.wells === 1 ? '' : 's'}` : 'Finish a run to leave a trail';
    card.append(art, label, latest); grid.append(card);
  }
  updateTrailGalleryNotice();
}
function renderLevelTrailThumbs() {
  for (const level of CAMPAIGN_LEVELS) {
    const card = $(`[data-campaign-level="${level.id}"]`), record = trailGalleryStore.get(level.id);
    if (!card) continue;
    card.querySelector('.level-card-trail')?.remove();
    card.querySelector('svg').classList.toggle('hidden', !!record);
    let caption = card.querySelector('.level-card-last');
    if (!caption) { caption = document.createElement('span'); caption.className = 'level-card-last'; card.append(caption); }
    caption.textContent = record ? `Last flight: ${record.outcome === 'complete' ? 'portal reached' : 'signal lost'} · ${record.seconds.toFixed(1)}s` : 'Last flight: none';
    if (record) { const img = document.createElement('img'); img.className = 'level-card-trail'; img.src = record.image; img.alt = ''; card.insertBefore(img, card.firstChild); }
  }
}
function openTrailGallery() {
  trailGalleryReturnFocus = document.activeElement;
  renderTrailGallery(); $('#trailGallery').showModal(); $('#closeTrailGallery').focus();
}
function openTrailDetail(id) {
  if (!campaignLevelAvailable(id, bestGates)) return;
  const record = trailGalleryStore.get(id), level = CAMPAIGN_LEVELS.find(item => item.id === id);
  if (!record || !level) return;
  trailDetailLevelId = id;
  $('#trailDetailImage').src = record.image;
  $('#trailDetailLevel').textContent = `LEVEL ${String(id).padStart(2, '0')} / ${level.title}`;
  $('#trailDetailTitle').textContent = record.outcome === 'complete' ? 'Portal reached.' : 'Signal lost.';
  $('#trailDetailStats').textContent = `${record.seconds.toFixed(1)} seconds · ${record.attempts} attempt${record.attempts === 1 ? '' : 's'} · ${record.wells} well${record.wells === 1 ? '' : 's'} · ${gateCount(record.gates)}/3 gates ${record.outcome === 'complete' ? 'scored' : 'collected, not scored'}`;
  appendGatePatternIcons($('#trailDetailStats'), record.gates);
  $('#trailDetail').showModal(); $('#closeTrailDetail').focus();
}
function saveBestGates(id, mask) {
  const best = betterGateMask(bestGates[id], mask);
  if (best === bestGates[id]) return;
  bestGates = { ...bestGates, [id]: best };
  try { localStorage.setItem(BEST_GATES_KEY, JSON.stringify(bestGates)); } catch {}
}
function appendGatePatternIcons(element, mask) {
  element.querySelector('.gate-pattern-icons')?.remove();
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
  if (open) $('#campaignDirection').classList.add('hidden');
  $('#home').classList.toggle('hidden', !open || screen !== 'home');
  $('#levelSelect').classList.toggle('hidden', !open || screen !== 'levels');
  $('#infiniteSelect').classList.toggle('hidden', !open || screen !== 'infinite');
  for (const selector of ['.chrome', '.scene', '.play-control']) $(selector).inert = open;
  if (open) (screen === 'levels' ? $('[data-campaign-level="1"]') : screen === 'infinite' ? $('#infiniteSeed') : $('#startCampaign')).focus();
}
const pickupGroup = new THREE.Group(); scene.add(pickupGroup);
const pickupMeshes = new Map();
const campaignGateGroup = new THREE.Group(); scene.add(campaignGateGroup);
const campaignGateMeshes = [];
const phraseGroup = new THREE.Group(); scene.add(phraseGroup);
const phraseGateMeshes = [];
const phrasePulse = new THREE.Mesh(new THREE.CircleGeometry(.43, 32), new THREE.MeshBasicMaterial({ color: 0xc6fff2, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
phrasePulse.position.z = 2.2; phrasePulse.visible = false; scene.add(phrasePulse);
const phrasePulseAura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0x9fffe1, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
phrasePulseAura.scale.set(13, 13, 1); phrasePulseAura.visible = false; scene.add(phrasePulseAura);
const phrasePulseOuter = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0x77e9e5, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
phrasePulseOuter.scale.set(26, 26, 1); phrasePulseOuter.visible = false; scene.add(phrasePulseOuter);
const phrasePulseLight = new THREE.PointLight(0xc6ffe1, 0, 18, 2); scene.add(phrasePulseLight);
const phraseAcquireLight = new THREE.PointLight(0xc6ffe1, 0, 12, 2); scene.add(phraseAcquireLight);
let phraseRouteLine = null;
const entityGroup = new THREE.Group(); scene.add(entityGroup);
const entityMeshes = new Map();
let gateFrame = null;
const portalPairColors = [0x76e9e3, 0xc3a8ff, 0xffca91, 0x9fcbff];
function portalPairIndex(entity) {
  const pairs = [...new Set((activeDemo.entities || []).filter(item => item.type === 'portal').map(item => item.pairId))];
  return pairs.indexOf(entity.pairId);
}

function rebuildEntityVisuals() {
  for (const mesh of entityMeshes.values()) disposeObject(mesh);
  entityMeshes.clear();
  for (const entity of activeDemo.entities || []) {
    if (entity.type === 'soundGate') continue;
    let mesh;
    if (entity.type === 'eclipse') {
      mesh = createEclipseVisual(entity.radius);
    } else if (entity.type === 'dimmer') {
      mesh = createDimmerVisual(.22);
    } else if (entity.type === 'ember' || entity.type === 'lightPickup' || entity.type === 'portal' || entity.type === 'companion') {
      const color = entity.type === 'ember' ? 0xff8a32 : entity.type === 'lightPickup' ? 0xffdf9b : entity.type === 'portal' ? portalPairColors[portalPairIndex(entity) % portalPairColors.length] : 0xcdb7ff;
      mesh = createStudyVisual(entity.type === 'ember' || entity.type === 'portal' || entity.type === 'companion' ? entity.radius : .22, color, entity.type === 'portal');
      if (entity.type === 'portal') {
        const pair = portalPairIndex(entity);
        mesh.add(ring(entity.radius * 1.17, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .72 })));
        for (let tick = 0; tick <= pair; tick++) {
          const angle = Math.PI / 2 + (tick - pair / 2) * .25;
          mesh.add(line([{ x: Math.cos(angle) * entity.radius * 1.20, y: Math.sin(angle) * entity.radius * 1.20 },
            { x: Math.cos(angle) * entity.radius * 1.39, y: Math.sin(angle) * entity.radius * 1.39 }],
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: .9 })));
        }
        mesh.add(releaseDirectionMark(entity.radius, entity.exitDirection));
      }
      if (entity.type === 'companion') {
        const influence = ring(entity.captureRadius, new THREE.LineDashedMaterial({ color: 0xcdb7ff, transparent: true, opacity: .24, dashSize: .14, gapSize: .17, depthWrite: false }));
        influence.computeLineDistances(); mesh.add(influence);
      }
    } else {
      const color = entity.type === 'portal' ? 0x79e1d6 : entity.type === 'impulse' ? 0x76e9e3 : entity.type === 'eclipse' ? 0x675d84 : 0xffd98b;
      mesh = new THREE.Group();
      mesh.add(ring(entity.radius, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .86 })));
      mesh.add(ring(entity.radius * .72, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .32 })));
    }
    if ((entity.type === 'stillness' || entity.type === 'eclipse') && Number.isFinite(entity.releaseDirection)) {
      mesh.add(releaseDirectionMark(entity.radius, entity.releaseDirection));
    }
    mesh.position.set(entity.x, entity.y, 1.45); entityGroup.add(mesh); entityMeshes.set(entity.id, mesh);
  }
}
function updateEntityVisuals() {
  if (!entityRuntime) return;
  const exposure = entityRuntime.eclipseMultiplier;
  for (const entity of activeDemo.entities || []) {
    const mesh = entityMeshes.get(entity.id), item = entityRuntime.items[entity.id];
    if (!mesh || !item) continue;
    mesh.position.set(item.x, item.y, 1.45);
    mesh.visible = !item.used;
    mesh.userData.animate?.(simTime, renderer.getPixelRatio());
    if (mesh.userData.setFade) mesh.userData.setFade(item.used ? 0 : entity.type === 'ember' ? exposure : 1);
  }
}

function rebuildCampaignGates() {
  for (const mesh of campaignGateMeshes) disposeObject(mesh);
  campaignGateMeshes.length = 0;
  if (!challengeMode()) return;
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
function rebuildPhraseGates() {
  for (const mesh of phraseGateMeshes) { phraseGroup.remove(mesh); disposeObject(mesh); }
  phraseGateMeshes.length = 0;
  phrasePulse.visible = phrasePulseAura.visible = phrasePulseOuter.visible = false;
  if (!phraseActive()) return;
  for (const gate of activePhrase().gates) {
    const group = new THREE.Group(); group.position.set(gate.x, gate.y, 1.7);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xb9f7df, transparent: true, opacity: .05, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.set(3.1, 3.1, 1);
    group.add(halo, ring(gate.radius, new THREE.LineBasicMaterial({ color: 0xa7e5d7, transparent: true, opacity: .14 })),
      ring(gate.radius * .68, new THREE.LineBasicMaterial({ color: 0xe3fff0, transparent: true, opacity: .08 })));
    // A small glowing note pip sits above the physical impulse ring.
    const pipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xc7ffdf, transparent: true, opacity: .26, blending: THREE.AdditiveBlending, depthWrite: false }));
    pipGlow.position.set(.12, 1.42, .04); pipGlow.scale.set(1.2, 1.2, 1);
    const pip = new THREE.Mesh(new THREE.CircleGeometry(.14, 16), new THREE.MeshBasicMaterial({ color: 0xd9ffe6, transparent: true, opacity: .72, depthWrite: false }));
    pip.position.set(0, 1.22, .08); pip.scale.set(.72, 1, 1);
    const stem = line([{ x: .1, y: 1.24 }, { x: .1, y: 1.86 }], new THREE.LineBasicMaterial({ color: 0xd9ffe6, transparent: true, opacity: .65 }));
    stem.position.z = .08;
    group.add(pipGlow, pip, stem);
    phraseGroup.add(group); phraseGateMeshes.push(group);
  }
}
function updatePhraseGates(now) {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  let youngest = Infinity, newestIndex = -1;
  phraseGateMeshes.forEach((group, index) => {
    const completed = index < phraseState.next;
    const next = index === phraseState.next;
    const visible = completed || next;
    group.visible = visible;
    if (!visible) return;
    const anticipation = phraseState.next >= activePhrase().gates.length - 3 ? .2 : 0;
    const replayAge = phraseReward ? phraseReward.elapsed - (1.05 + index * .37) : Infinity;
    const flash = replayAge >= 0 && replayAge < .37 ? 1 - replayAge / .37 : 0;
    const age = phraseAcquireAge[index];
    const { pulse: acquire, scale: acquireScale, glow: acquireGlow } = phraseAcquireEnvelope(age, reducedMotion);
    if (age < youngest) { youngest = age; newestIndex = index; }
    group.scale.setScalar(reducedMotion ? 1 : acquireScale + flash * .52 + (next ? .09 + anticipation : .035) * Math.sin(now * .004 + index * .4));
    group.children[0].scale.setScalar(reducedMotion ? 3.1 : 3.1 + flash * 4.4 + acquireGlow);
    group.children[0].material.opacity = flash ? .45 + flash * .45 : acquire ? .25 + acquire * .6 : completed ? .25 : .35 + anticipation;
    group.children[1].material.opacity = completed ? .55 : .8;
    group.children[2].material.opacity = completed ? .25 : .48;
    group.children[3].material.opacity = .26 + flash * .55 + acquire * .35;
    group.children[4].material.opacity = .72 + flash * .28;
  });
  phraseAcquireLight.intensity = newestIndex >= 0 ? phraseAcquireEnvelope(youngest, reducedMotion).light : 0;
  if (phraseAcquireLight.intensity) {
    const gate = activePhrase().gates[newestIndex];
    phraseAcquireLight.position.set(gate.x, gate.y, 1.8);
  }
}
function cancelPhraseReward() {
  if (phraseReward) { phraseReward = null; phrasePulse.visible = phrasePulseAura.visible = phrasePulseOuter.visible = false; phrasePulseLight.intensity = 0; resize(); }
  if (phraseRouteLine) { scene.remove(phraseRouteLine); disposeObject(phraseRouteLine); phraseRouteLine = null; }
  audio.stopScene();
}
function clearPhraseAcquireVisual() { phraseAcquireAge.fill(Infinity); phraseAcquireLight.intensity = 0; }
function startPhraseReward() {
  const storage = safeBrowserStorage(window, 'localStorage');
  saveDiscoveredPhrase(storage, campaignLevelId);
  discoveredPhrases = { ...discoveredPhrases, [campaignLevelId]: true };
  phraseReward = { elapsed: 0, played: -1 };
  if (phraseRouteLine) { scene.remove(phraseRouteLine); disposeObject(phraseRouteLine); }
  const routeSegments = []; let segment = [];
  phraseState.path.forEach((point, index) => { if (phraseState.breakIndices?.includes(index)) { if (segment.length > 1) routeSegments.push(segment); segment = []; } segment.push(new THREE.Vector3(point.x, point.y, 1.9)); });
  if (segment.length > 1) routeSegments.push(segment);
  phraseRouteLine = new THREE.Group();
  for (const points of routeSegments) phraseRouteLine.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xb4ffe0, transparent: true, opacity: .25, blending: THREE.AdditiveBlending, depthWrite: false })));
  scene.add(phraseRouteLine);
  accumulator = 0;
  audio.stopHeartbeat();
  caption.textContent = 'THE PASSAGE REMEMBERS YOUR PHRASE';
  caption.classList.add('phrase-cue');
  updateControls();
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
  $('#wellCount').textContent = `${wells.length} / ${challengeMode() ? activeDemo.settings.maxActiveWells : 2}`;
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
  if (encounterResolving() || phraseReward || drifted || won) return;
  if (settings.open || gallery.open || homeOpen || editor?.open) return;
  if (challengeMode() && !canPlaceCampaignWell(wellsUsed, activeDemo.settings.maxTotalWells)) return;
  if (gameMode === 'maze' && !(challengeMode() ? campaignPointAllowed({ x, y }, activeLevel) : canPlaceWell({ x, y }, activeLevel))) return;
  const well = makeWell(x, y, effectiveStrength(), effectiveLifetime(), simTime);
  if (challengeMode()) wellsUsed++;
  audio.placement(); lastSoundWellTime = simTime;
  const maxActive = challengeMode() ? activeDemo.settings.maxActiveWells : 2;
  const old = wells.length >= maxActive ? wells[0] : null;
  wells = addWell(wells, well, maxActive);
  if (old) disposeWell(old);
  redrawWellList(); updateForecast();
  if (old && !wells.includes(old)) disposeWell(old);
  redrawWellList();
  updateForecast();
  if (runState === 'ready') caption.textContent = 'TAP START TO RELEASE';
}

function releaseAll(refresh = true) {
  wells.forEach(disposeWell);
  wells = [];
  if (refresh) { redrawWellList(); updateForecast(); }
}

function reset() {
  cancelMineHold();
  cancelPhraseReward();
  phraseState = createPhraseState();
  clearPhraseAcquireVisual();
  caption.classList.remove('phrase-cue');
  invalidateRunArtwork();
  cancelDeathTransition();
  audio.reset(); lastSoundWellTime = 0;
  // No observers may run with the new document and the previous runtime.
  releaseAll(false);
  rebuildExperiment();
  wellsUsed = 0;
  simTime = 0;
  accumulator = 0;
  clearTrail();
  clearSparks();
  drifted = false;
  won = false;
  emberImmuneUntil = -1;
  moonCueUntil = -1;
  lastSafeHero = null;
  paused = true; runState = 'ready';
  driftOverlay.classList.add('hidden');
  winOverlay.classList.add('hidden');
  caption.textContent = gameMode === 'maze' ? 'PLACE A WELL · THEN START' : 'TAP START TO RELEASE';
  caption.classList.remove('moon-cue');
  body.force.setZero();
  body.angularVelocity.setZero();
  if (gameMode === 'maze') {
    body.position.set(activeLevel.spawn.x, activeLevel.spawn.y, 0);
    body.velocity.set(activeLevel.spawn.vx, activeLevel.spawn.vy, 0);
    lastSafeHero = { x: body.position.x, y: body.position.y };
    attempts += 1;
    $('#attempts').textContent = attempts;
    if (challengeMode()) visitedBounds = { minX: body.position.x, maxX: body.position.x, minY: body.position.y, maxY: body.position.y };
  } else {
    body.position.set(4, 0, 0);
    const selectedStrength = effectiveStrength();
    body.velocity.set(0, Math.sqrt(selectedStrength * 4 * 4 / Math.pow(4 * 4 + 0.75 * 0.75, 1.5)), 0);
    wells = [makeWell(0, 0, selectedStrength, effectiveLifetime(), 0)];
  }
  resize();
  updateCamera(0, true);
  $('#runTime').textContent = '0.0s';
  updateResourceHud();
  redrawWellList();
  updateForecast();
  updateStatus();
  lastFrame = performance.now();
}

function failRun(reason = 'darkness') {
  cancelMineHold();
  if (drifted || won) return;
  cancelPhraseReward();
  audio.death();
  audio.stopHeartbeat();
  encounterSizzleUntil = -1;
  encounterMineQueued = false;
  drifted = true;
  paused = true; runState = 'dead';
  deathTransition = { ...createDeathTransition(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches), reason };
  // An out-of-bounds drift should still leave a visible ripple at the edge.
  deathRipple.position.set(reason === 'drift' ? THREE.MathUtils.clamp(body.position.x, camera.position.x + camera.left + .6, camera.position.x + camera.right - .6) : body.position.x,
    reason === 'drift' ? THREE.MathUtils.clamp(body.position.y, camera.position.y + camera.bottom + .6, camera.position.y + camera.top - .6) : body.position.y, 2.15);
  forecast.visible = false;
  updateStatus();
}

function showRunArt(success, reason = 'darkness') {
  const artworkGeneration = ++resultArtworkGeneration;
  if (campaignMode && success && !editorPlaytest) saveBestGates(campaignLevelId, soundGates?.mask || 0);
  presentRunResult({
    outcome: success ? 'complete' : 'lost',
    mode: campaignMode || chapterEncounterId ? 'campaign' : infiniteMode ? 'infinite' : editorPlaytest ? 'editor' : 'study',
    populateCore() {
      $('#resultEyebrow').textContent = success ? chapterEncounterId ? 'ENCOUNTER COMPLETE' : 'COURSE COMPLETE' : 'SIGNAL LOST';
      $('#resultTitle').textContent = encounter ? success ? chapterEncounterId ? 'The answer holds.' : 'The ember went dark.' : reason === 'draw' ? 'Both lights went out.' : 'Your light went out.' : challengeMode() ? success ? 'Light carried home.' : reason === 'manual' ? 'Journey ended.' : reason === 'hazard' ? 'Taken by the ember.' : 'The light went out.' : 'Your orbit.';
      $('#winStats').textContent = `${simTime.toFixed(1)} seconds  ·  ${attempts} attempt${attempts === 1 ? '' : 's'}${challengeMode() ? `  ·  ${wellsUsed} well${wellsUsed === 1 ? '' : 's'} placed` : ''}`;
      $('#winGateStats').classList.toggle('hidden', !challengeMode() || !!chapterEncounterId);
      if (challengeMode() && !chapterEncounterId) {
        $('#winGateStats').textContent = `${success ? 'Gates' : 'Collected (not scored)'} ${gateCount(soundGates.mask)}/3 · ${gatePattern(soundGates.mask)}`;
        appendGatePatternIcons($('#winGateStats'), soundGates.mask);
      }
      $('#infiniteResult').classList.toggle('hidden', !infiniteMode);
      $('#editInfinite').classList.toggle('hidden', !infiniteMode);
      $('#copyInfinite').classList.toggle('hidden', !infiniteMode);
      if (infiniteMode) $('#infiniteResult').textContent = `Seed ${infiniteSeed} · Stage ${infiniteStage} · Generation ${INFINITE_VERSION}`;
      const next = campaignMode && success && !editorPlaytest ? campaignContinuation(campaignLevelId, bestGates) : null;
      const canContinue = next && (next.type === 'level' || next.type === 'transmission');
      $('#campaignUnlockHint').classList.toggle('hidden', !(campaignMode && success && !editorPlaytest && !canContinue));
      $('#campaignUnlockHint').textContent = 'Reach the portal with at least one gate to reveal the next level.';
      $('#winRestart').textContent = chapterEncounterId ? 'Retry' : infiniteMode && success || canContinue ? 'Continue ↗' : challengeMode() || encounter ? 'Retry' : 'Fly again ↗';
      $('#winHome').textContent = chapterEncounterId ? 'Back to chapters' : 'Home';
      $('#winEditor').classList.toggle('hidden', !editorPlaytest);
      $('#winArtwork').classList.remove('hidden');
      $('#artworkUnavailable').classList.add('hidden');
    },
    showResult() { winOverlay.classList.remove('hidden'); },
    scheduleArtwork(callback) { requestAnimationFrame(() => setTimeout(callback, 0)); },
    isCurrent() { return artworkGeneration === resultArtworkGeneration && !winOverlay.classList.contains('hidden'); },
    renderArtwork() {
      const last = trailCount ? trailSamples[(trailStart + trailCount - 1) % TRAIL_CAPACITY] : activeLevel.spawn;
      archiveSegment(last, body.position);
      const bounds = challengeMode() ? {
        minX: Math.min(visitedBounds.minX, activeLevel.spawn.x, body.position.x) - 6,
        maxX: Math.max(visitedBounds.maxX, activeLevel.spawn.x, body.position.x) + 6,
        minY: Math.min(visitedBounds.minY, activeLevel.spawn.y, body.position.y) - 6,
        maxY: Math.max(visitedBounds.maxY, activeLevel.spawn.y, body.position.y) + 6,
      } : activeLevel.bounds;
      drawFinishArt($('#winArtwork'), archiveCanvas, archiveHalfWidth, archiveHalfHeight, bounds, activeLevel.spawn, body.position, moonArchiveCanvas);
      if (campaignMode && !editorPlaytest) {
        const image = captureTrailImage($('#winArtwork'));
        if (image) trailGalleryStore.save({ levelId: campaignLevelId, outcome: success ? 'complete' : 'lost', seconds: Number(simTime.toFixed(1)), attempts, wells: wellsUsed, gates: soundGates?.mask || 0, image, savedAt: Date.now() });
        renderLevelTrailThumbs();
      }
    },
    artworkFailed() {
      $('#winArtwork').classList.add('hidden');
      $('#artworkUnavailable').classList.remove('hidden');
    },
  });
}

function winRun() {
  if (won) return;
  cancelPhraseReward();
  cancelDeathTransition();
  audio.portal();
  audio.stopHeartbeat();
  won = true;
  paused = true; runState = 'won';
  if (campaignMode && !editorPlaytest) markLevelComplete(campaignLevelId);
  if (chapterEncounterId) encounterWins = saveEncounterWin(safeBrowserStorage(window, 'localStorage'), encounterWins, chapterEncounterId);
  updateStatus();
  showRunArt(true);
}

function selectDemo(id) {
  cancelMineHold();
  if (transmission.active) transmission.stop(false);
  audio.setProfile('default');
  campaignMode = false; infiniteMode = false; editorPlaytest = false; chapterEncounterId = null; setHomeOpen(false);
  settings.classList.remove('campaign-settings');
  $('.settings-intro').textContent = id === 'encounter' ? 'Both lights burn down. Hold the empty field to drop a mine while flying (8% light); each ram costs both sides 12%. Catch shared recharge embers.' : 'Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.';
  $('#encounterBehaviorRow').classList.toggle('hidden', id !== 'encounter');
  const enteringEncounter = id === 'encounter' && encounterPreviousLifetime === null;
  const leavingEncounter = id !== 'encounter' && encounterPreviousLifetime !== null;
  if (enteringEncounter) { encounterPreviousLifetime = lifetimeInput.value; lifetimeInput.value = '16'; }
  if (leavingEncounter && encounterPreviousLifetime !== null) { lifetimeInput.value = encounterPreviousLifetime; encounterPreviousLifetime = null; }
  $('#lifetimeValue').textContent = `${Number(lifetimeInput.value).toFixed(1)}s`;
  activeDemo = getDemo(id); gameMode = activeDemo.sandbox ? 'sandbox' : 'maze';
  heroGravity = activeDemo.heroGravity;
  strengthInput.min = 35; strengthInput.max = 180; lifetimeInput.min = 2; lifetimeInput.max = 16;
  strengthInput.value = DEFAULT_WELL_STRENGTH; $('#strengthValue').textContent = DEFAULT_WELL_STRENGTH;
  $('#heroGravity').value = heroGravity; $('#heroGravityValue').textContent = heroGravity;
  attempts = 0; resumeAfterSettings = false;
  const url = new URL(location.href); url.searchParams.delete('campaign'); url.searchParams.delete('encounter'); url.searchParams.delete('infinite'); url.searchParams.delete('stage'); url.searchParams.set('demo', activeDemo.id); history.replaceState(null, '', url);
  reset();
}

function selectChapterEncounter(id) {
  if (!chapterEncounterAvailable(id, bestGates)) {
    showLevelSelect('Finish the third crossing of that chapter with at least one gate to unlock its encounter.');
    return false;
  }
  cancelMineHold();
  if (transmission.active) transmission.stop(false);
  audio.setProfile('chapter');
  chapterEncounterId = Number(id); campaignMode = false; infiniteMode = false; editorPlaytest = false; setHomeOpen(false);
  activeDemo = getChapterEncounter(id); gameMode = 'maze'; heroGravity = 0;
  settings.classList.add('campaign-settings');
  $('.settings-intro').textContent = 'The rules of this encounter are fixed. Adjust sound and the predicted path.';
  strengthInput.value = activeDemo.settings.wellStrength; $('#strengthValue').textContent = strengthInput.value;
  lifetimeInput.value = activeDemo.settings.wellLifetime; $('#lifetimeValue').textContent = `${Number(lifetimeInput.value).toFixed(1)}s`;
  attempts = 0; resumeAfterSettings = false; resumeAfterGallery = false;
  const url = new URL(location.href);
  for (const key of ['demo', 'campaign', 'infinite', 'stage']) url.searchParams.delete(key);
  url.searchParams.set('encounter', String(id)); history.replaceState(null, '', url);
  reset(); return true;
}

function selectCampaign(levelId = 1, { suppressGuide = false } = {}) {
  cancelMineHold();
  if (!campaignLevelAvailable(levelId, bestGates)) { showLevelSelect('That crossing is locked. Reach the portal with at least one gate to reveal the next level.'); return false; }
  if (transmission.active) transmission.stop(false);
  audio.setProfile('chapter');
  campaignMode = true; infiniteMode = false; editorPlaytest = false; chapterEncounterId = null; setHomeOpen(false);
  settings.classList.add('campaign-settings');
  $('.settings-intro').textContent = 'The gravity rules are fixed for this crossing. Adjust audio and choose whether to preview the next short stretch of your path.';
  activeDemo = getCampaignLevel(levelId); campaignLevelId = activeDemo.id; gameMode = 'maze'; heroGravity = 0;
  strengthInput.min = Math.min(35, activeDemo.settings.wellStrength); strengthInput.max = Math.max(180, activeDemo.settings.wellStrength);
  lifetimeInput.min = Math.min(2, activeDemo.settings.wellLifetime); lifetimeInput.max = Math.max(16, activeDemo.settings.wellLifetime);
  strengthInput.value = activeDemo.settings.wellStrength; $('#strengthValue').textContent = activeDemo.settings.wellStrength;
  lifetimeInput.value = activeDemo.settings.wellLifetime; $('#lifetimeValue').textContent = `${activeDemo.settings.wellLifetime.toFixed(1)}s`;
  attempts = 0; resumeAfterSettings = false; resumeAfterGallery = false;
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('encounter'); url.searchParams.delete('infinite'); url.searchParams.delete('stage'); url.searchParams.set('campaign', String(campaignLevelId)); history.replaceState(null, '', url);
  reset();
  if (!suppressGuide && shouldShowChapterGuide({ levelId, campaignMode, editorPlaytest, seen: seenChapterGuides })) openChapterGuide(levelId, $('#primaryAction'));
  return true;
}

function selectInfinite(seed, stage = 1) {
  cancelMineHold();
  if (transmission.active) transmission.stop(false);
  audio.setProfile('default');
  infiniteSeed = normalizeInfiniteSeed(seed) || randomInfiniteSeed();
  infiniteStage = normalizeInfiniteStage(stage);
  infiniteMode = true; campaignMode = false; editorPlaytest = false; chapterEncounterId = null; setHomeOpen(false);
  settings.classList.remove('campaign-settings');
  $('.settings-intro').textContent = 'Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.';
  activeDemo = infiniteDemo(infiniteSeed, infiniteStage); gameMode = 'maze'; heroGravity = 0;
  strengthInput.min = Math.min(35, activeDemo.settings.wellStrength); strengthInput.max = Math.max(180, activeDemo.settings.wellStrength);
  lifetimeInput.min = Math.min(2, activeDemo.settings.wellLifetime); lifetimeInput.max = Math.max(16, activeDemo.settings.wellLifetime);
  strengthInput.value = activeDemo.settings.wellStrength; $('#strengthValue').textContent = activeDemo.settings.wellStrength;
  lifetimeInput.value = activeDemo.settings.wellLifetime; $('#lifetimeValue').textContent = `${activeDemo.settings.wellLifetime.toFixed(1)}s`;
  attempts = 0; resumeAfterSettings = false; resumeAfterGallery = false;
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('campaign'); url.searchParams.delete('encounter'); url.searchParams.set('infinite', infiniteSeed); url.searchParams.set('stage', String(infiniteStage)); history.replaceState(null, '', url);
  reset();
}

function selectEditorPlaytest(document) {
  cancelMineHold();
  if (transmission.active) transmission.stop(false);
  audio.setProfile('default');
  const compiled = compileLevelDocument(structuredClone(document));
  editorPlaytest = true; campaignMode = true; infiniteMode = false; chapterEncounterId = null; setHomeOpen(false);
  settings.classList.remove('campaign-settings');
  $('.settings-intro').textContent = 'Experiment with this level’s gravity and audio while playtesting.';
  for (const selector of ['.chrome', '.scene', '.play-control']) $(selector).inert = false;
  activeDemo = {
    id: 'editor-playtest', title: compiled.document.title, color: '#9ee6df',
    objective: 'Playtest your level. Return to the editor to revise it.',
    mechanic: 'campaign', heroGravity: 0, moons: [], level: compiled.level,
    document: compiled.document, entities: compiled.entities, settings: compiled.settings,
    soundGates: compiled.entities.filter(e => e.type === 'soundGate').map(e => ({ id: e.slot, x: e.x, y: e.y, radius: e.radius })),
  };
  gameMode = 'maze'; heroGravity = 0; attempts = 0; resumeAfterSettings = false; resumeAfterGallery = false;
  strengthInput.min = Math.min(35, compiled.settings.wellStrength); strengthInput.max = Math.max(180, compiled.settings.wellStrength);
  lifetimeInput.min = Math.min(2, compiled.settings.wellLifetime); lifetimeInput.max = Math.max(16, compiled.settings.wellLifetime);
  strengthInput.value = compiled.settings.wellStrength; $('#strengthValue').textContent = compiled.settings.wellStrength;
  lifetimeInput.value = compiled.settings.wellLifetime; $('#lifetimeValue').textContent = `${compiled.settings.wellLifetime.toFixed(1)}s`;
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('campaign'); url.searchParams.delete('encounter'); url.searchParams.delete('infinite'); url.searchParams.delete('stage'); history.replaceState(null, '', url);
  reset();
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
  const pickups = campaign?.pickups || encounterVitality?.pickups || burnout?.pickups || [];
  const activeIds = new Set(pickups.map(pickup => pickup.id));
  for (const [id, mesh] of pickupMeshes) if (!activeIds.has(id)) { disposeObject(mesh); pickupMeshes.delete(id); }
  for (const pickup of pickups) {
    if (!pickupMeshes.has(pickup.id)) {
      const mesh = createStudyVisual(.22, 0xffe4a8);
      mesh.position.set(pickup.x, pickup.y, 1.65);
      pickupGroup.add(mesh); pickupMeshes.set(pickup.id, mesh);
    }
    const mesh = pickupMeshes.get(pickup.id);
    const left = Math.max(0, (campaign || encounterVitality ? CAMPAIGN.pickupLife : PICKUP_LIFE) - (simTime - pickup.createdAt));
    const fade = Math.min(1, left / 3);
    mesh.userData.animate(simTime, renderer.getPixelRatio());
    mesh.userData.setFade(fade);
    mesh.scale.setScalar(.96 + .06 * Math.sin(simTime * 3 + pickup.id));
  }
}
function encounterMineStatus() {
  if (!encounter || !encounterVitality || !activeLevel || !body) return { available: false, reason: 'space', remaining: 0 };
  return mineAvailability(encounter, { owner: 'hero', actor: { x: body.position.x, y: body.position.y,
    vx: body.velocity.x, vy: body.velocity.y }, opponent: encounter.boss, bounds: activeLevel.bounds,
    walls: activeLevel.walls, energy: encounterVitality.hero.energy, time: simTime, placement: 'actor' });
}
function mineStatusCopy(status) {
  if (status.available) return 'MINE READY −8%';
  if (status.reason === 'light') return 'NEED 8% LIGHT';
  if (status.reason === 'cooldown') return `MINE IN ${status.remaining.toFixed(1)}s`;
  if (status.reason === 'capacity') return '2 MINES ACTIVE';
  if (status.reason === 'speed') return 'MOVE TO DROP MINE';
  return 'NEED CLEAR SPACE';
}
function queueHeroMine() {
  if (!encounter || runState !== 'running' || encounterResolving() || settings.open || gallery.open || homeOpen || editor?.open || chapterGuide.open) return;
  const status = encounterMineStatus();
  if (status.available) encounterMineQueued = true;
  else caption.textContent = mineStatusCopy(status);
}
function updateResourceHud() {
  const resource = campaign || encounterVitality?.hero || burnout;
  const hud = $('#resourceHud'); hud.classList.toggle('hidden', !resource);
  $('#duelMeters').classList.toggle('hidden', !resource);
  $('#bossResourceHud').classList.toggle('hidden', !encounterVitality);
  $('#resourceLabel').textContent = encounterVitality ? 'YOUR LIGHT' : 'LIGHT';
  hud.classList.toggle('campaign-resource', !!campaign || !!encounterVitality);
  $('#campaignGateHud').classList.toggle('hidden', !campaign);
  const lightHeld = !!campaign && holdsCampaignLight(entityRuntime);
  const graceResource = campaign || encounterVitality?.hero;
  const lastEmbers = !!graceResource && graceResource.energy <= 0 && !drifted && !won;
  hud.classList.toggle('last-embers', lastEmbers);
  hud.classList.toggle('sizzling', !!encounterVitality && simTime < encounterSizzleUntil && !lastEmbers);
  hud.classList.toggle('meter-paused', paused || homeOpen || document.hidden || lightHeld);
  if (!resource) return;
  const energy = resource.energy;
  $('#resourceValue').textContent = `${Math.round(energy * 100)}%`;
  $('#resourceFill').style.width = `${lastEmbers ? graceResource.graceLeft / (graceResource.graceDuration || CAMPAIGN.graceSeconds) * 100 : energy * 100}%`;
  if (lastEmbers) {
    $('#resourceValue').textContent = `${Math.ceil(graceResource.graceLeft)}s`;
    hud.style.setProperty('--warning-period', `${.55 + graceResource.graceLeft / (graceResource.graceDuration || CAMPAIGN.graceSeconds) * .65}s`);
  }
  $('#gateStatus').textContent = campaign ? lightHeld ? 'LIGHT HELD' : energy > 0 ? `${wellsUsed} WELL${wellsUsed === 1 ? '' : 'S'}` : 'LAST EMBERS' : encounterVitality ? energy <= 0 ? 'LAST EMBERS' : simTime < encounterSizzleUntil ? 'SIZZLING' : `HOLD: ${mineStatusCopy(encounterMineStatus())}` : burnout.pendingClose ? 'GATE CLOSING' : burnout.gateOpen ? 'GATE OPEN' : 'GATE CLOSED';
  if (encounterVitality) {
    const boss = encounterVitality.boss;
    const bossHud = $('#bossResourceHud');
    bossHud.classList.toggle('last-embers', boss.energy <= 0 && !won && !drifted);
    bossHud.classList.toggle('meter-paused', paused || homeOpen || document.hidden);
    $('#bossResourceValue').textContent = boss.energy > 0 ? `${Math.round(boss.energy * 100)}%` : `${Math.ceil(boss.graceLeft)}s`;
    $('#bossResourceFill').style.width = `${boss.energy > 0 ? boss.energy * 100 : boss.graceLeft / boss.graceDuration * 100}%`;
    $('#bossIntent').textContent = encounter?.intent === 'recharge' ? 'SEEKING LIGHT' : encounter?.intent === 'chase' ? 'CLOSING IN' : 'RETREATING';
  }
  if (campaign) {
    const mask = soundGates?.mask || 0;
    $('#campaignGateCount').textContent = `${gateCount(mask)}/3 gates`;
    const icons = $('#campaignGateIcons');
    if (icons.dataset.mask !== String(mask)) {
      icons.replaceChildren(); appendGatePatternIcons(icons, mask); icons.dataset.mask = String(mask);
    }
  }
}
function rebuildExperiment() {
  activeLevel = structuredClone(activeDemo.level); gateOpen = false;
  $('#campaignDirection').classList.add('hidden');
  campaignDirectionTarget = null;
  app.classList.toggle('encounter-mode', activeDemo.mechanic === 'encounter');
  $('#encounterBehaviorRow').classList.toggle('hidden', activeDemo.mechanic !== 'encounter');
  burnout = activeDemo.mechanic === 'burnout' ? createBurnout() : null;
  encounter = activeDemo.mechanic === 'encounter' ? createEncounterState(activeDemo.duel?.boss) : null;
  encounterVitality = encounter ? createEncounterVitality(2819, activeDemo.duel) : null;
  encounterMineQueued = false;
  encounterFlashAge = Infinity;
  encounterSizzleUntil = -1;
  lastEncounterSizzleTime = -1;
  campaign = campaignMode || infiniteMode ? createCampaign(infiniteMode ? infiniteRunSeed(infiniteSeed, infiniteStage) : 428, activeDemo.settings) : null;
  soundGates = campaignMode || infiniteMode ? createSoundGates() : null;
  rebuildCampaignGates();
  rebuildPhraseGates();
  entityRuntime = activeDemo.usesEntityRuntime || campaignMode || infiniteMode ? createEntityRuntime(activeDemo.entities || []) : null;
  rebuildEntityVisuals();
  for (const mesh of pickupMeshes.values()) disposeObject(mesh);
  pickupMeshes.clear();
  if (gateFrame) disposeObject(gateFrame);
  gateFrame = null;
  experiment.reset(activeDemo);
  if (burnout || campaign || encounterVitality) experiment.brightness = (campaign || encounterVitality?.hero || burnout).energy;
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
  if (!activeDemo.sandbox) { createWalls(activeLevel); if (!challengeMode()) createHazards(activeLevel); }
  portal.position.set(activeLevel.goal.x, activeLevel.goal.y, 1);
  portal.scale.setScalar(activeLevel.goal.radius);
  portal.visible = !encounter;
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
  for (const moon of activeDemo.moons) addMoon(moon, activeDemo.mechanic === 'companion');
  if (activeDemo.plate) {
    plateRing = new THREE.Group(); plateRing.position.set(activeDemo.plate.x, activeDemo.plate.y, .7);
    plateRing.add(ring(activeDemo.plate.radius, new THREE.LineBasicMaterial({ color: 0xffd88a, transparent: true, opacity: .9 })));
    plateRing.add(ring(activeDemo.plate.radius * .8, new THREE.LineDashedMaterial({ color: 0xffd88a, transparent: true, opacity: .3, dashSize: .1, gapSize: .12 })));
    plateRing.children[1].computeLineDistances(); mazeGroup.add(plateRing);
  }
  const moving = moonEntries.length > 0 || !!activeDemo.mechanic;
  $('#heroGravity').disabled = hasCompanionRule() || !moonEntries.length;
  $('#heroGravity').value = heroGravity; $('#heroGravityValue').textContent = heroGravity;
  $('#heroGravityHelp').textContent = hasCompanionRule() ? 'Companions follow the dot without pulling back. Try the loose moon studies for reciprocal gravity.' : moving ? 'Pulls loose moons; their small mass also tugs back. Set 0 to compare.' : 'Choose a moon study to explore the dot’s own gravity.';
  showForecast.disabled = !fixedCampaignControls() && moving; forecast.visible = showForecast.checked && (fixedCampaignControls() || !moving);
  $('#forecastHelp').textContent = fixedCampaignControls() ? 'A short preview; ends at the next interaction.' : moving ? 'Prediction is off for interactive studies. Watch the rule unfold in motion.' : 'Preview stops at the next wall, ember, or portal contact.';
  $('#activeDemoLabel').textContent = activeDemo.title;
  $('.settings-help').textContent = encounter ? 'Tap open space to place a well. Hold on empty space for half a second to spend 8% light on a mine. Drop mine also has its own thumb button. Space or the primary thumb button starts, releases, and removes wells. E also removes the oldest well; P pauses.' : `Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R ${challengeMode() ? 'ends the attempt' : 'restarts'} · E removes oldest / releases capture · 1 / 2 remove a specific well.`;
  $('#demoTitle').textContent = activeDemo.title;
  $('#demoObjective').textContent = activeDemo.objective;
  $('#demoNote').style.setProperty('--demo-color', activeDemo.color);
  $('#companionHud').classList.toggle('hidden', !hasCompanionRule());
  updateCompanionHud();
  for (const card of document.querySelectorAll('[data-demo]')) card.setAttribute('aria-pressed', String(card.dataset.demo === activeDemo.id));
}
function addMoon(moon, companion = false) {
    const satellite = new CANNON.Body({ mass: .08, shape: new CANNON.Sphere(.16), material: blobMaterial, linearDamping: 0, angularDamping: 0, fixedRotation: true });
    satellite.position.set(moon.x, moon.y, 0); satellite.velocity.set(moon.vx, moon.vy, 0); world.addBody(satellite);
    const mesh = new THREE.Group();
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 12), new THREE.MeshBasicMaterial({ color: activeDemo.plate ? 0xffd88a : 0xd8cdff }));
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: activeDemo.plate ? 0xffb853 : 0xbda3ff, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending }));
    aura.scale.set(1.2, 1.2, 1); mesh.add(dot, aura); moonGroup.add(mesh);
    const heatAura = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    heatAura.scale.set(1.1, 1.1, 1); mesh.add(heatAura);
    const heatSparks = [];
    if (companion) for (let i = 0; i < 5; i++) {
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      spark.scale.set(.15, .15, 1); mesh.add(spark); heatSparks.push(spark);
    }
    const positions = new Float32Array(160 * 3);
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)); geometry.setDrawRange(0, 0);
    const trail = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: activeDemo.plate ? 0xf2c66a : 0xb9a5eb, transparent: true, opacity: .28, depthWrite: false }));
    trail.frustumCulled = false; moonGroup.add(trail);
    moonEntries.push({ body: satellite, mesh, trail, positions, count: 0, lastSample: -1, lastArchive: { x: moon.x, y: moon.y }, companionState: companion ? createCompanionState() : null, heat: companion ? createMoonHeat() : null, heatAura, heatSparks });
}
function removeMoon(entry) {
  world.removeBody(entry.body);
  disposeObject(entry.mesh);
  disposeObject(entry.trail);
  moonEntries.splice(moonEntries.indexOf(entry), 1);
  updateCompanionHud();
}
function moonCue(message) {
  caption.textContent = message;
  caption.classList.add('moon-cue');
  moonCueUntil = simTime + 1.6;
}
function rescueHero(before, ember) {
  const moon = oldestOwnedMoon(moonEntries);
  if (!moon || !ember || simTime < emberImmuneUntil) return false;
  const point = rescuePosition({ before, lastSafe: lastSafeHero, ember, level: activeLevel, entities: activeDemo.entities, runtime: entityRuntime });
  if (!point) return false;
  removeMoon(moon);
  const velocity = rescueVelocity(point, ember);
  body.position.set(point.x, point.y, 0);
  body.previousPosition.copy(body.position);
  body.interpolatedPosition.copy(body.position);
  body.velocity.set(velocity.x, velocity.y, 0);
  body.force.setZero();
  body.aabbNeedsUpdate = true;
  body.wakeUp();
  lastSafeHero = point;
  emberImmuneUntil = simTime + EMBER_IMMUNITY;
  trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0);
  audio.tone(783.99, 0, .22, .09);
  audio.tone(523.25, .12, .4, .06);
  moonCue('MOON SAVED YOU');
  return true;
}
function acquireCompanions(ids) {
  for (const item of commitCompanionCaptures(entityRuntime, ids)) {
    const dx = item.x - body.position.x, dy = item.y - body.position.y;
    const distance = Math.hypot(dx, dy) || 1;
    addMoon({ x: item.x, y: item.y, vx: body.velocity.x - dy / distance * 1.35, vy: body.velocity.y + dx / distance * 1.35 }, true);
    audio.tone(659.25, 0, .26, .055);
  }
  updateCompanionHud();
}
function updateCompanionHud() {
  if (!hasCompanionRule()) return;
  const entries = moonEntries.filter(entry => entry.companionState);
  const count = entries.length;
  const hud = $('#companionHud');
  const phases = [...new Set(entries.map(entry => entry.heat?.smoldering ? 'smoldering' : entry.companionState.phase))];
  const moonSources = (activeDemo.entities || []).filter(entity => entity.type === 'companion');
  const allSpent = moonSources.length > 0 && moonSources.every(entity => entityRuntime?.items[entity.id]?.used);
  const label = `${count} companion${count === 1 ? '' : 's'}${phases.length ? ` · ${phases.join(' / ')}` : allSpent ? ' · none remaining' : ' · find the pale moons'}`;
  if (hud.textContent !== label) hud.textContent = label;
  hud.dataset.phase = phases.length === 1 ? phases[0] : '';
}
function applyMoonGravity(heroActualAcceleration) {
  if (!moonEntries.length) return;
  const looseEntries = moonEntries.filter(entry => !entry.companionState);
  if (looseEntries.length) {
    const moons = looseEntries.map(entry => ({ x: entry.body.position.x, y: entry.body.position.y, mass: entry.body.mass }));
    const exchange = gravityExchange(body.position, moons, heroGravity);
    body.applyForce(new CANNON.Vec3(exchange.hero.x * body.mass, exchange.hero.y * body.mass, 0));
    for (let i = 0; i < looseEntries.length; i++) {
      const satellite = looseEntries[i].body;
      const a = mazeAcceleration(satellite.position, wells, simTime, effectiveMode(), activeLevel);
      satellite.applyForce(new CANNON.Vec3((a.x + exchange.moons[i].x) * satellite.mass, (a.y + exchange.moons[i].y) * satellite.mass, 0));
    }
  }
  const companions = moonEntries.filter(entry => entry.companionState);
  if (!companions.length) return;
  const heroWellAcceleration = acceleration(body.position, wells, simTime, effectiveMode());
  for (const entry of companions) {
    const satellite = entry.body;
    const moonWellAcceleration = acceleration(satellite.position, wells, simTime, effectiveMode());
    const result = stepCompanion(entry.companionState, {
      hero: { x: body.position.x, y: body.position.y, vx: body.velocity.x, vy: body.velocity.y },
      moon: { x: satellite.position.x, y: satellite.position.y, vx: satellite.velocity.x, vy: satellite.velocity.y },
      heroAcceleration: heroActualAcceleration, heroWellAcceleration, moonWellAcceleration,
      wells, time: simTime, dt: STEP,
    });
    entry.companionState = result.state;
    satellite.applyForce(new CANNON.Vec3(result.acceleration.x * satellite.mass, result.acceleration.y * satellite.mass, 0));
    if (result.returned && simTime >= entry.companionState.returnToneAt) {
      audio.tone(523.25, 0, .18, .025);
      entry.companionState.returnToneAt = simTime + 4;
    }
  }
}
function updateGate() {
  for (const entry of moonEntries) { entry.body.position.z = 0; entry.body.velocity.z = 0; capVelocity(entry.body.velocity, entry.companionState ? Math.max(18, Math.hypot(body.velocity.x, body.velocity.y) + 8) : 10); }
  if (gateOpen || !plateActivated(activeDemo.plate, moonEntries.map(entry => entry.body.position))) return;
  setGateOpen(true);
  for (const mark of plateRing.children) mark.material.color.setHex(0x87f9ce);
  $('#demoObjective').textContent = 'Gate open. Take your trail through the portal.';
  audio.tone(392, 0, 1.3, .1); audio.tone(523.25, .15, 1.3, .1);
}
function updateMoonVisuals() {
  for (const entry of moonEntries) {
    const p = entry.body.position; entry.mesh.position.set(p.x, p.y, 2);
    if (entry.companionState) {
      entry.trail.material.opacity = entry.companionState.phase === 'returning' ? .5 : entry.companionState.phase === 'borrowed' ? .25 : .32;
      entry.mesh.children[1].material.opacity = entry.companionState.phase === 'returning' ? .68 : .52;
      const heat = entry.heat?.heat || 0;
      entry.heatAura.material.opacity = heat ? .35 + .3 * Math.sin(simTime * 18) ** 2 : 0;
      entry.heatAura.scale.setScalar(1.1 + heat * .4);
      entry.mesh.children[0].material.color.setHex(heat ? 0xffba7c : 0xd8cdff);
      for (let i = 0; i < entry.heatSparks.length; i++) {
        const spark = entry.heatSparks[i];
        const age = (simTime * (2.3 + i * .17) + i * .23) % 1;
        const angle = i * 2.4 + simTime * .9;
        spark.position.set(Math.cos(angle) * (.12 + age * .3), Math.sin(angle) * (.12 + age * .3), .04);
        spark.material.opacity = heat ? Math.min(.6, heat / .7) * (1 - age) : 0;
      }
    }
    if (simTime - entry.lastSample < .05 || paused) continue;
    entry.lastSample = simTime;
    if (entry.count === 160) { entry.positions.copyWithin(0, 3); entry.count--; }
    entry.positions.set([p.x, p.y, .8], entry.count++ * 3);
    entry.trail.geometry.attributes.position.needsUpdate = true; entry.trail.geometry.setDrawRange(0, entry.count);
  }
}
function recordCompanionMotion() {
  const collectors = [];
  for (const entry of [...moonEntries]) {
    if (!entry.companionState) continue;
    const to = { x: entry.body.position.x, y: entry.body.position.y };
    const from = entry.lastArchive;
    archiveCompanionSegment(from, to);
    entry.lastArchive = to;
    if (challengeMode() && visitedBounds) {
      visitedBounds.minX = Math.min(visitedBounds.minX, from.x, to.x);
      visitedBounds.maxX = Math.max(visitedBounds.maxX, from.x, to.x);
      visitedBounds.minY = Math.min(visitedBounds.minY, from.y, to.y);
      visitedBounds.maxY = Math.max(visitedBounds.maxY, from.y, to.y);
    }
    const contact = moonEmberContact(from, to, .16, activeDemo.entities, entityRuntime);
    const wasSmoldering = entry.heat.smoldering;
    const thermal = stepMoonHeat(entry.heat, contact, STEP);
    entry.heat = thermal.state;
    if (thermal.ignited) audio.tone(261.63, 0, .13, .032, 174.61);
    if (thermal.burned) {
      audio.noise(.18, 1700, .07);
      removeMoon(entry);
      continue;
    }
    // A crossing that starts or ends hot cannot gather light in this step.
    if (!wasSmoldering && !thermal.state.smoldering && !contact) collectors.push({ from, to, radius: .16 });
  }
  return collectors;
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
  const studyMarks = activeDemo && demo.mechanic ? (demo.mechanic === 'encounter' ? `<path d="M35 72 Q66 70 83 46" fill="none" stroke="#ffae69" stroke-width="1" opacity=".65"/><circle cx="${x(0)}" cy="${y(0)}" r="${radius(.85)}" fill="#ff8a32"/>` : ['power','dimmer','sound'].includes(demo.mechanic) ? [-5,0,5].map(mx=>mark(mx,0,.65,demo.color)).join('') : demo.mechanic==='burnout' ? mark(-5,1,.65,'#ffd98b')+mark(5,0,1,'#ffd98b') : demo.mechanic==='portals' ? mark(-3,0,1,'#76e9e3')+mark(6,-3,1,'#76e9e3') : demo.mechanic==='clock' ? mark(0,0,3.5,'#ff8a32') : ['giant','chaser'].includes(demo.mechanic) ? mark(0,0,demo.mechanic==='giant'?1.6:.3,'#ff8a32') : ['sticky','eclipse','boost','hidden'].includes(demo.mechanic) ? mark(-3,0,.85,demo.color) : '') : '';
  return `<svg viewBox="0 0 170 100" aria-hidden="true"><rect width="170" height="100" rx="5" fill="#102b38"/>${walls}${guideMarks}<path d="M25 70 C30 20 75 20 85 50 S120 80 140 30" fill="none" stroke="${demo.color}" opacity=".7" stroke-width=".7"/>${moons}${opticalMarks}${studyMarks}${demo.sandbox ? '<ellipse cx="85" cy="50" rx="28" ry="25" fill="none" stroke="#9acfff" stroke-width=".6"/>' : embers}<circle cx="${x(demo.level.spawn.x)}" cy="${y(demo.level.spawn.y)}" r="2.4" fill="#dffff9"/>${demo.mechanic === 'encounter' ? '' : `<circle cx="${x(demo.level.goal.x)}" cy="${y(demo.level.goal.y)}" r="${Math.max(4,radius(demo.level.goal.radius))}" stroke="#bc9aff" stroke-width=".8" fill="none"/>`}${demo.plate ? mark(demo.plate.x,demo.plate.y,demo.plate.radius,'#ffd88a') : ''}</svg>`;
}
const gallery = $('#gallery');
$('#demoGrid').innerHTML = DEMOS.map(demo => `<button type="button" class="demo-card" data-demo="${demo.id}" style="--demo-color:${demo.color}" aria-pressed="false">${demoThumbnail(demo)}<span class="demo-rule">${demo.rule}</span><strong>${demo.title}</strong><span>${demo.description}</span><em>${demo.question}</em></button>`).join('');
const demoCategories = [
  ['All', DEMOS.map(demo => demo.id)],
  ['Gravity', ['drift','satellites','companion','slingshot','gate','orbit','release','boost','sticky','giant','chaser','clock','encounter']],
  ['Light', ['eclipse','power','dimmer','hidden','shadow-posts','filters','lens','prism','burnout']],
  ['Sound', ['sound','encounter']],
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
  cancelMineHold();
  encounterMineQueued = false;
  cancelPhraseReward();
  clearPhraseAcquireVisual();
  closePhraseReplay();
  closeAchievements();
  closeChapterGuide({ restoreFocus: false });
  invalidateRunArtwork();
  cancelDeathTransition();
  if (transmission.active) transmission.stop(false);
  resumeAfterGallery = false; resumeAfterSettings = false; galleryReturnHome = false;
  editor?.hide();
  if (settings.open) settings.close();
  if (gallery.open) gallery.close();
  paused = true;
  audio.stopHeartbeat();
  if (runState === 'running') runState = 'paused';
  setHomeOpen(true);
  winOverlay.classList.add('hidden'); driftOverlay.classList.add('hidden');
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('campaign'); url.searchParams.delete('encounter'); url.searchParams.delete('infinite'); url.searchParams.delete('stage'); history.replaceState(null, '', url);
  updateControls();
}
function showEditor() {
  cancelMineHold();
  cancelPhraseReward();
  clearPhraseAcquireVisual();
  closePhraseReplay();
  closeAchievements();
  closeChapterGuide({ restoreFocus: false });
  invalidateRunArtwork();
  cancelDeathTransition();
  if (transmission.active) transmission.stop(false);
  resumeAfterGallery = false; resumeAfterSettings = false;
  if (settings.open) settings.close(); if (gallery.open) gallery.close();
  paused = true; audio.stopHeartbeat();
  if (runState === 'running') runState = 'paused';
  setHomeOpen(false);
  for (const selector of ['.chrome', '.scene', '.play-control']) $(selector).inert = true;
  winOverlay.classList.add('hidden'); driftOverlay.classList.add('hidden');
  const url = new URL(location.href);
  for (const key of ['demo', 'campaign', 'encounter', 'infinite', 'stage']) url.searchParams.delete(key);
  history.replaceState(null, '', url);
  editor.show(); updateControls();
}
editor = createEditor({
  mount: app, defaultDocument: makeBlankLevelDocument(), onHome: showHome, onPlay: selectEditorPlaytest,
  getCampaignTemplates: () => campaignTemplateOptions(CAMPAIGN_LEVELS, bestGates),
  createCampaignTemplate: id => createCampaignTemplate(CAMPAIGN_LEVELS, bestGates, id),
});
function renderCampaignCards() {
  const available = new Set(availableCampaignIds(bestGates));
  $('#levelCards').innerHTML = CHAPTERS.filter(chapter => chapter.levelIds.some(id => available.has(id))).map(chapter => `<section class="chapter-group"><div class="chapter-group-heading"><h2>${chapter.label} <span>${chapter.name}</span></h2><button class="chapter-guide-replay home-secondary" data-guide-level="${chapter.levelIds[0]}" type="button" aria-label="Chapter ${chapter.id} guide">Chapter guide ◇</button></div><div class="level-cards">${CAMPAIGN_LEVELS.filter(level => level.chapter === chapter.id && available.has(level.id)).map(level => `<div class="level-card-wrap"><button class="level-card" data-campaign-level="${level.id}" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C42 39 65 53 100 34 S132 30 147 30" fill="none" stroke="${level.color}" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/><circle cx="80" cy="40" r="10" fill="none" stroke="${level.color}"/></svg><span>${String(level.id).padStart(2, '0')} / ${level.kicker}</span><strong>${level.title}</strong><small>${level.summary}</small><em data-complete="${level.id}"></em><span data-gate-best="${level.id}"></span><span data-earned-note="${level.id}"></span></button>${phraseForLevel(level.id) && discoveredPhrases[level.id] ? `<div class="phrase-discovery"><span>PHRASE DISCOVERED ♪</span><button type="button" data-replay-phrase="${level.id}">Replay phrase ♫</button></div>` : ''}</div>`).join('')}</div><div class="chapter-footer"><button class="home-secondary ${chapterUnlocked(bestGates, chapter.id) ? '' : 'hidden'}" data-replay-chapter="${chapter.id}" type="button">Replay ${chapter.label.toLowerCase()} transmission ◇</button><button class="home-secondary ${chapterEncounterAvailable(chapter.id, bestGates) ? '' : 'hidden'}" data-chapter-encounter="${chapter.id}" type="button">${encounterWins.has(chapter.id) ? 'Encounter complete ✓' : 'Chapter encounter ✦'}</button></div></section>`).join('');
}
function renderAchievements() {
  const entries = publicPhraseAchievements(discoveredPhrases);
  const encounters = publicEncounterAchievements(encounterWins);
  $('#achievementsCount').textContent = `${entries.filter(entry => entry.discovered).length} / ${entries.length} melodies · ${encounters.filter(entry => entry.discovered).length} / ${encounters.length} encounters`;
  const list = $('#achievementsList'); list.replaceChildren();
  for (const entry of entries) {
    const row = document.createElement('div'); row.className = 'achievement-row';
    const notes = document.createElement('span'); notes.className = 'achievement-notes'; notes.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 8; i++) notes.append(document.createElement('i'));
    const detail = document.createElement('div'); detail.className = 'achievement-detail';
    const title = document.createElement('strong'); title.textContent = entry.title;
    const status = document.createElement('small'); status.textContent = entry.discovered ? 'MELODY FOUND' : 'NOT YET DISCOVERED';
    detail.append(title, status); row.append(notes, detail);
    if (entry.discovered) {
      row.classList.add('discovered');
      const listen = document.createElement('button'); listen.type = 'button'; listen.className = 'home-secondary';
      listen.textContent = 'Listen ♫'; listen.dataset.achievement = entry.id;
      row.append(listen);
    }
    list.append(row);
  }
  const heading = document.createElement('h3'); heading.className = 'encounter-achievements-heading'; heading.textContent = 'Chapter encounters'; list.append(heading);
  for (const entry of encounters) {
    const row = document.createElement('div'); row.className = 'achievement-row encounter-achievement';
    const mark = document.createElement('span'); mark.className = 'encounter-achievement-mark'; mark.textContent = entry.discovered ? '✦' : '◇'; mark.setAttribute('aria-hidden', 'true');
    const detail = document.createElement('div'); detail.className = 'achievement-detail';
    const title = document.createElement('strong'); title.textContent = entry.discovered ? entry.title : `Chapter ${entry.id} encounter`;
    const status = document.createElement('small'); status.textContent = entry.discovered ? 'ENCOUNTER COMPLETE' : 'NOT YET COMPLETE';
    detail.append(title, status); row.append(mark, detail); list.append(row);
  }
}
function closeAchievements() {
  if ($('#achievements').open) $('#achievements').close();
}
function openAchievements() {
  achievementsReturnFocus = document.activeElement;
  renderAchievements(); $('#achievements').showModal(); $('#closeAchievements').focus();
}
function closePhraseReplay({ restoreFocus = true } = {}) {
  if (!phraseReplay && !$('#phraseReplay').open) return;
  phraseReplay = null; phraseReplayIndex = -1;
  audio.stopPhraseSound();
  if ($('#phraseReplay').open) $('#phraseReplay').close();
  if (restoreFocus && phraseReplayReturnFocus?.isConnected) phraseReplayReturnFocus.focus();
  phraseReplayReturnFocus = null;
}
function startPhraseReplay(levelId) {
  const phrase = phraseForLevel(levelId);
  if (!phrase || !discoveredPhrases[levelId]) return;
  const returnFocus = $('#phraseReplay').open ? phraseReplayReturnFocus : document.activeElement;
  closePhraseReplay({ restoreFocus: false });
  phraseReplayReturnFocus = returnFocus;
  phraseReplay = { elapsed: 0, phrase };
  phraseReplayIndex = -1;
  $('#phraseReplayTitle').textContent = publicPhraseAchievements(discoveredPhrases).find(entry => entry.id === phraseAchievementByIdForLevel(levelId)?.id)?.title || 'Your phrase.';
  $('#phraseReplayNotes').innerHTML = phrase.notes.map((_, index) => `<i aria-hidden="true" data-phrase-note="${index}"></i>`).join('');
  if (!$('#phraseReplay').open) $('#phraseReplay').showModal();
  $('#closePhraseReplay').focus();
}
function phraseAchievementByIdForLevel(levelId) {
  return publicPhraseAchievements(discoveredPhrases).find(entry => phraseAchievementById(entry.id)?.levelId === levelId);
}
function showLevelSelect(message = '') {
  showHome();
  renderCampaignCards();
  $('#levelUnlockHint').textContent = message || 'Reach the portal with at least one sound gate to reveal the next level.';
  renderLevelTrailThumbs();
  for (const badge of $('#levelSelect').querySelectorAll('[data-complete]')) {
    const id = Number(badge.dataset.complete);
    badge.textContent = completedLevels.has(id) ? bestGates[id] > 0 ? 'PATH REVEALED ✓' : 'PORTAL REACHED · GATE NEEDED' : 'NOT YET COMPLETE';
  }
  for (const badge of $('#levelSelect').querySelectorAll('[data-gate-best]')) {
    const mask = bestGates[Number(badge.dataset.gateBest)];
    badge.textContent = mask === undefined ? 'Best finish: — / 3 gates' : `Best finish: ${gateCount(mask)}/3 gates · ${gatePattern(mask)}`;
    appendGatePatternIcons(badge, mask ?? 0);
  }
  for (const badge of $('#levelSelect').querySelectorAll('[data-earned-note]')) badge.textContent = bestGates[Number(badge.dataset.earnedNote)] === 7 ? 'TRANSMISSION NOTE EARNED ♪' : 'Transmission note: find all 3 gates';
  for (const replay of $('#levelSelect').querySelectorAll('[data-replay-chapter]')) replay.classList.toggle('hidden', !chapterUnlocked(bestGates, Number(replay.dataset.replayChapter)));
  setHomeOpen(true, 'levels');
  const cards = $('#levelCards').querySelectorAll('[data-campaign-level]');
  cards[cards.length - 1]?.focus();
}
$('#levelSelect').addEventListener('click', event => { const replay = event.target.closest('[data-replay-chapter]'); if (replay) startTransmission(Number(replay.dataset.replayChapter)); });
$('#levelSelect').addEventListener('click', event => { const encounterButton = event.target.closest('[data-chapter-encounter]'); if (encounterButton) selectChapterEncounter(Number(encounterButton.dataset.chapterEncounter)); });
$('#levelSelect').addEventListener('click', event => { const button = event.target.closest('[data-replay-phrase]'); if (button) startPhraseReplay(Number(button.dataset.replayPhrase)); });
$('#achievementsHome').addEventListener('click', openAchievements);
$('#achievementsLevels').addEventListener('click', openAchievements);
$('#closeAchievements').addEventListener('click', closeAchievements);
$('#achievements').addEventListener('cancel', event => { event.preventDefault(); if ($('#phraseReplay').open) closePhraseReplay(); else closeAchievements(); });
$('#achievements').addEventListener('close', () => { if (achievementsReturnFocus?.isConnected) achievementsReturnFocus.focus(); achievementsReturnFocus = null; });
$('#achievementsList').addEventListener('click', event => {
  const button = event.target.closest('[data-achievement]');
  const achievement = button && phraseAchievementById(button.dataset.achievement);
  if (achievement) startPhraseReplay(achievement.levelId);
});
$('#restartPhraseReplay').addEventListener('click', () => { if (phraseReplay) startPhraseReplay(phraseReplay.phrase.levelId); });
$('#closePhraseReplay').addEventListener('click', closePhraseReplay);
$('#phraseReplay').addEventListener('cancel', event => { event.preventDefault(); closePhraseReplay(); });
$('#levelSelect').addEventListener('click', event => { const replay = event.target.closest('[data-guide-level]'); if (replay) openChapterGuide(Number(replay.dataset.guideLevel), replay); });
$('#skipTransmission').addEventListener('click', () => transmission.stop());
$('#transmissionMute').addEventListener('click', () => { audioPreferences.muted = !audioPreferences.muted; audio.setEnabled(!audioPreferences.muted); persistAudioPreferences(); syncMuteControl(); });
$('#galleryButton').addEventListener('click', () => editorPlaytest ? showEditor() : challengeMode() ? showHome() : openGallery());
$('#browseDemos').addEventListener('click', () => { resumeAfterSettings = false; openGallery(); });
$('#homeFromSettings').addEventListener('click', showHome);
$('#homeFromGallery').addEventListener('click', showHome);
$('#startCampaign').addEventListener('click', () => showLevelSelect());
$('#trailGalleryHome').addEventListener('click', openTrailGallery);
$('#trailGalleryLevels').addEventListener('click', openTrailGallery);
$('#closeTrailGallery').addEventListener('click', () => $('#trailGallery').close());
$('#trailGallery').addEventListener('close', () => trailGalleryReturnFocus?.focus());
$('#trailGalleryGrid').addEventListener('click', event => { const card = event.target.closest('[data-trail-level]'); if (card) openTrailDetail(Number(card.dataset.trailLevel)); });
$('#closeTrailDetail').addEventListener('click', () => $('#trailDetail').close());
$('#backToTrailGallery').addEventListener('click', () => $('#trailDetail').close());
$('#trailDetail').addEventListener('close', () => { if (!trailDetailGoingToLevel) $(`[data-trail-level="${trailDetailLevelId}"]`)?.focus(); trailDetailGoingToLevel = false; });
$('#playTrailLevel').addEventListener('click', () => { const id = trailDetailLevelId; if (!campaignLevelAvailable(id, bestGates)) return; trailDetailGoingToLevel = true; trailGalleryReturnFocus = null; $('#trailDetail').close(); $('#trailGallery').close(); selectCampaign(id); });
$('#startInfinite').addEventListener('click', () => {
  $('#infiniteSeed').value = randomInfiniteSeed();
  setHomeOpen(true, 'infinite');
});
$('#infiniteBack').addEventListener('click', showHome);
$('#beginInfinite').addEventListener('click', () => selectInfinite($('#infiniteSeed').value, 1));
$('#infiniteSeed').addEventListener('keydown', event => { if (event.key === 'Enter') selectInfinite(event.currentTarget.value, 1); });
$('#openEditor').addEventListener('click', showEditor);
$('#levelsBack').addEventListener('click', showHome);
$('#levelSelect').addEventListener('click', event => { const card = event.target.closest('[data-campaign-level]'); if (card) selectCampaign(Number(card.dataset.campaignLevel)); });
$('#studyHome').addEventListener('click', openGallery);
$('#closeGallery').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => { if (galleryReturnHome) showHome(); else if (resumeAfterGallery && runState === 'paused' && !won && !drifted) togglePause(); resumeAfterGallery = false; galleryReturnHome = false; });
$('#demoGrid').addEventListener('click', (event) => { const card = event.target.closest('[data-demo]'); if (!card) return; resumeAfterGallery = false; galleryReturnHome = false; selectDemo(card.dataset.demo); gallery.close(); });
$('#heroGravity').addEventListener('input', (event) => { if (fixedCampaignControls()) { heroGravity = 0; event.target.value = '0'; return; } heroGravity = Number(event.target.value); $('#heroGravityValue').textContent = heroGravity; });

function currentState() {
  return { x: body.position.x, y: body.position.y, vx: body.velocity.x, vy: body.velocity.y };
}

function updateForecast() {
  if (deathTransition) { forecast.visible = false; return; }
  if (!showForecast.checked || (!fixedCampaignControls() && activeDemo.moons.length)) return;
  const result = fixedCampaignControls() ? predictCampaignPath(currentState(), wells, simTime, activeLevel, activeDemo.entities || [], entityRuntime) : gameMode === 'maze' ? predictToImpact(currentState(), wells, simTime, 3, mode, activeLevel) : { points: predict(currentState(), wells, simTime, 5.5, mode, 7), impact: null };
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
    const power = wellPower(well, simTime, effectiveMode());
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
  const frame = challengeMode() || activeDemo.id === 'wideworld' ? followFrame(aspect) : gameMode === 'maze' ? cameraFrame(activeDemo.level.bounds, aspect) : { width: Math.max(21, 16 * aspect), height: Math.max(21, 16 * aspect) / aspect };
  const visibleWidth = frame.width;
  const visibleHeight = frame.height;
  camera.left = -visibleWidth / 2;
  camera.right = visibleWidth / 2;
  camera.top = visibleHeight / 2;
  camera.bottom = -visibleHeight / 2;
  camera.updateProjectionMatrix();
  const bounds = activeLevel.bounds;
  const chapterStyle = (campaignMode || chapterEncounterId) && !infiniteMode && !editorPlaytest ? {
    1: { amount: .73, seed: 1.4, scale: .058, density: -.05, strands: .05, tint: 0x526675 },
    2: { amount: .77, seed: 7.8, scale: .068, density: -.015, strands: .68, tint: 0x496d79 },
    3: { amount: .82, seed: 13.2, scale: .075, density: .09, strands: .18, tint: 0x685b7d },
    4: { amount: .78, seed: 19.6, scale: .068, density: .02, strands: .45, tint: 0x776b67 },
    5: { amount: .83, seed: 27.1, scale: .063, density: .08, strands: .26, tint: 0x795868 },
  }[activeDemo.chapter] : undefined;
  chapterBackdrop.amount.value = chapterStyle?.amount ?? 0;
  chapterBackdrop.center.value.set((bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2);
  if (chapterStyle) {
    chapterBackdrop.seed.value = chapterStyle.seed;
    chapterBackdrop.scale.value = chapterStyle.scale;
    chapterBackdrop.density.value = chapterStyle.density;
    chapterBackdrop.strands.value = chapterStyle.strands;
    chapterBackdrop.tint.value.setHex(chapterStyle.tint);
  }
  // The follow camera can travel beyond the old 200-unit floor on wide
  // campaign levels. Keep its lit backdrop beneath the whole playfield.
  floor.scale.set(
    Math.max(1, (bounds.maxX - bounds.minX + visibleWidth + 12) / 200),
    Math.max(1, (bounds.maxY - bounds.minY + visibleHeight + 12) / 200),
    1,
  );
  expandArchive(Math.max(camera.right + 2, Math.abs(bounds.minX) + 2, Math.abs(bounds.maxX) + 2), Math.max(camera.top + 2, Math.abs(bounds.minY) + 2, Math.abs(bounds.maxY) + 2));
  updateCamera(0, true);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  sparkMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
}

function updateCamera(dt, snap = false) {
  floor.position.x = (activeLevel.bounds.minX + activeLevel.bounds.maxX) / 2;
  floor.position.y = (activeLevel.bounds.minY + activeLevel.bounds.maxY) / 2;
  if (!challengeMode() && activeDemo.id !== 'wideworld') {
    camera.position.x = 0; camera.position.y = 0;
    return;
  }
  const next = followPosition(camera.position, body.position, body.velocity, activeLevel.bounds,
    { width: camera.right - camera.left, height: camera.top - camera.bottom }, dt, snap);
  camera.position.x = next.x; camera.position.y = next.y;
  if (challengeMode()) expandArchive(Math.abs(camera.position.x) + camera.right + 3, Math.abs(camera.position.y) + camera.top + 3);
}

let campaignDirectionTarget = null;
function updateCampaignDirection() {
  const marker = $('#campaignDirection');
  if (!officialCampaign() || !soundGates || homeOpen || editor?.open || transmission.active ||
      phraseReward || phraseReplay || document.hidden || deathTransition || won || drifted ||
      document.querySelector('dialog[open]') || !winOverlay.classList.contains('hidden') ||
      !driftOverlay.classList.contains('hidden')) {
    marker.classList.add('hidden');
    return;
  }
  const target = campaignGuideTarget(activeDemo.soundGates, soundGates.mask, activeLevel.goal);
  if (!target) { marker.classList.add('hidden'); return; }
  const sceneRect = sceneElement.getBoundingClientRect();
  const blocked = ['#demoNote', '#minimap', '.play-control'].flatMap(selector => {
    const element = $(selector);
    if (!element || element.classList.contains('hidden')) return [];
    const rect = element.getBoundingClientRect();
    return [{ left: rect.left - sceneRect.left - 10, right: rect.right - sceneRect.left + 10,
      top: rect.top - sceneRect.top - 10, bottom: rect.bottom - sceneRect.top + 10 }];
  });
  const point = projectCampaignGuide(target,
    { x: camera.position.x, y: camera.position.y, left: camera.left, right: camera.right, top: camera.top, bottom: camera.bottom },
    { width: sceneRect.width, height: sceneRect.height },
    { left: 42, right: 42, top: 32, bottom: 42 }, blocked);
  if (!point) { marker.classList.add('hidden'); return; }
  marker.style.left = `${point.x}px`;
  marker.style.top = `${point.y}px`;
  marker.style.color = target.color;
  marker.style.setProperty('--guide-angle', `${point.angle}rad`);
  marker.querySelector('span').textContent = target.label;
  const key = `${target.kind}:${target.id ?? 'exit'}`;
  if (key !== campaignDirectionTarget) {
    marker.setAttribute('aria-label', `${target.kind === 'exit' ? 'Exit portal' : target.label} is off screen`);
    campaignDirectionTarget = key;
  }
  marker.classList.remove('hidden');
}

function drawMinimap() {
  minimap.classList.toggle('visible', challengeMode() || activeDemo.id === 'wideworld');
  if (!challengeMode() && activeDemo.id !== 'wideworld') return;
  const ctx = minimapContext, w = minimap.width, h = minimap.height;
  const bounds = activeLevel.bounds;
  const sx = w / (bounds.maxX - bounds.minX), sy = h / (bounds.maxY - bounds.minY);
  const x = value => (value - bounds.minX) * sx;
  const y = value => (bounds.maxY - value) * sy;
  const eclipseExposure = entityRuntime?.eclipseMultiplier ?? experiment.eclipseExposure;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#07151f'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#476877'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.fillStyle = '#324b56';
  for (const wall of activeLevel.walls) {
    const corners = wallCorners(wall); ctx.beginPath(); ctx.moveTo(x(corners[0].x), y(corners[0].y));
    for (const corner of corners.slice(1)) ctx.lineTo(x(corner.x), y(corner.y));
    ctx.closePath(); ctx.fill();
  }
  const marker = (px, py, radius, color) => {
    ctx.beginPath(); ctx.arc(x(px), y(py), radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  };
  marker(activeLevel.goal.x, activeLevel.goal.y, 6, '#a994ff');
  if (challengeMode()) for (const gate of activeDemo.soundGates) marker(gate.x, gate.y, 4, soundGates?.mask & (1 << gate.id) ? '#6d8993' : SOUND_GATE_COLORS[gate.id]);
  if (phraseActive()) for (const gate of activePhrase().gates) {
    if (gate.index > phraseState.next) break;
    marker(gate.x, gate.y, gate.index === phraseState.next ? 4 : 2.5, gate.index === phraseState.next ? '#d7ffde' : '#7cbaa9');
  }
  for (const pickup of campaign?.pickups || encounterVitality?.pickups || []) marker(pickup.x, pickup.y, 3, '#ffd58e');
  if (entityRuntime) for (const entity of activeDemo.entities) if (entity.type !== 'soundGate') {
    const item = entityRuntime.items[entity.id]; if (!item || item.used) continue;
    if (entity.type === 'ember' && eclipseExposure <= 0) continue;
    ctx.globalAlpha = entity.type === 'ember' ? eclipseExposure : 1;
    const portalIndex = entity.type === 'portal' ? portalPairIndex(entity) : -1;
    const portalColor = portalIndex >= 0 ? `#${portalPairColors[portalIndex % portalPairColors.length].toString(16).padStart(6, '0')}` : '';
    marker(item.x, item.y, entity.type === 'ember' ? Math.max(3, entity.radius * Math.min(sx, sy)) : 3,
      entity.type === 'ember' ? '#e36d31' : entity.type === 'portal' ? portalColor : entity.type === 'companion' ? '#cdb7ff' : entity.type === 'dimmer' ? '#bfa5ff' : '#ffd58e');
    if (portalIndex >= 0) {
      ctx.strokeStyle = portalColor; ctx.lineWidth = 1;
      for (let tick = 0; tick <= portalIndex; tick++) {
        const tx = x(item.x) + 5 + tick * 3;
        ctx.beginPath(); ctx.moveTo(tx, y(item.y) - 5); ctx.lineTo(tx, y(item.y) - 8); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  for (const entry of moonEntries) if (entry.companionState) marker(entry.body.position.x, entry.body.position.y, 2.5, '#cdb7ff');
  if (!entityRuntime && eclipseExposure > 0) for (const danger of activeLevel.dangers || []) { ctx.beginPath(); ctx.arc(x(danger.x), y(danger.y), danger.radius * Math.min(sx, sy), 0, Math.PI * 2); ctx.fillStyle = '#e36d31'; ctx.globalAlpha = eclipseExposure; ctx.fill(); ctx.globalAlpha = 1; }
  for (const well of wells) marker(well.x, well.y, 3.5, '#79d6ef');
  if (encounter) {
    marker(encounter.boss.x, encounter.boss.y, 5, '#ff9852');
    for (const mine of encounter.hazards) marker(mine.x, mine.y, 2.5, mine.owner === 'hero' ? '#77e8ef' : '#ff9852');
  }
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
  if (chapterGuide.open) return;
  if (event.button !== 0) return;
  if (pointer) { cancelMineHold(); return; }
  pointerDownAt = performance.now();
  pointer = { id: event.pointerId, clientX: event.clientX, clientY: event.clientY };
  renderer.domElement.setPointerCapture?.(event.pointerId);
  const empty = !closestWell(eventWorld(event));
  const eligible = !!encounter && runState === 'running' && empty && !settings.open && !gallery.open && !homeOpen && !editor?.open && !won && !drifted;
  mineGesture.begin(event.pointerId, event.clientX, event.clientY, pointerDownAt, eligible);
  if (eligible) {
    const ring = $('#mineHoldRing'); ring.style.left = `${event.clientX}px`; ring.style.top = `${event.clientY}px`;
    ring.classList.remove('hidden'); ring.classList.remove('charging'); void ring.offsetWidth; ring.classList.add('charging');
    mineHoldTimer = setTimeout(() => {
      if (mineGesture.hold(event.pointerId, performance.now()) && !paused && !document.hidden) queueHeroMine();
      ring.classList.add('hidden');
    }, MINE_HOLD_MS);
  }
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (pointer?.id !== event.pointerId) return;
  const rect = renderer.domElement.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    cancelMineHold();
    return;
  }
  if (mineGesture.move(event.pointerId, event.clientX, event.clientY)) {
    clearTimeout(mineHoldTimer); mineHoldTimer = null; $('#mineHoldRing').classList.add('hidden');
  }
});
renderer.domElement.addEventListener('pointercancel', (event) => { if (pointer?.id === event.pointerId) cancelMineHold(); });
renderer.domElement.addEventListener('lostpointercapture', (event) => { if (pointer?.id === event.pointerId) cancelMineHold(); });
window.addEventListener('blur', cancelMineHold);
renderer.domElement.addEventListener('pointerup', (event) => {
  if (pointer?.id !== event.pointerId) return;
  if (chapterGuide.open || event.button !== 0) { cancelMineHold(); return; }
  const down = pointer; pointer = null;
  releaseCanvasPointer(event.pointerId);
  clearTimeout(mineHoldTimer); mineHoldTimer = null; $('#mineHoldRing').classList.add('hidden');
  if (mineGesture.hold(event.pointerId, performance.now()) && !paused && !document.hidden) queueHeroMine();
  const action = mineGesture.end(event.pointerId, event.clientX, event.clientY, performance.now());
  if (action !== 'tap') return;
  if (Math.hypot(event.clientX - down.clientX, event.clientY - down.clientY) > 15) return;
  const point = eventWorld(event); placeWell(point.x, point.y);
});
renderer.domElement.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  if (encounterResolving() || phraseReward || chapterGuide.open) return;
  const well = closestWell(eventWorld(event));
  if (well) removeWell(well.id);
});

wellList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (button) removeWell(Number(button.dataset.remove));
});
strengthInput.addEventListener('input', () => {
  if (fixedCampaignControls()) { strengthInput.value = String(activeDemo.settings.wellStrength); return; }
  $('#strengthValue').textContent = strengthInput.value;
  for (const well of wells) well.strength = Number(strengthInput.value);
  updateForecast();
});
lifetimeInput.addEventListener('input', () => { if (fixedCampaignControls()) { lifetimeInput.value = String(activeDemo.settings.wellLifetime); return; } $('#lifetimeValue').textContent = `${Number(lifetimeInput.value).toFixed(1)}s`; });
$('.segmented').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode]');
  if (!button || fixedCampaignControls()) return;
  mode = button.dataset.mode;
  for (const tab of $('.segmented').children) tab.classList.toggle('selected', tab === button);
  $('#modeHelp').textContent = mode === 'fade' ? 'Pull weakens over the last 20% of a well’s life.' : 'Pull stays full strength, then vanishes instantly.';
  updateForecast();
});
$('#release').addEventListener('click', releaseAll);
showForecast.addEventListener('change', () => { audioPreferences.showForecast = showForecast.checked; persistAudioPreferences(); forecast.visible = showForecast.checked; updateForecast(); });
$('#settingsButton').addEventListener('click', () => { resumeAfterSettings = runState === 'running'; if (resumeAfterSettings) togglePause(); settings.showModal(); });
$('#closeSettings').addEventListener('click', () => settings.close());
settings.addEventListener('close', () => { if (resumeAfterSettings && runState === 'paused' && !drifted && !won) togglePause(); resumeAfterSettings = false; });
$('#restart').addEventListener('click', () => { if (challengeMode()) failRun('manual'); else reset(); });
$('#driftRestart').addEventListener('click', reset);
$('#driftHome').addEventListener('click', showHome);
$('#winRestart').addEventListener('click', () => { if (infiniteMode && won) selectInfinite(infiniteSeed, infiniteStage + 1); else if (campaignMode && won && !editorPlaytest) { const next = campaignContinuation(campaignLevelId, bestGates); if (next.type === 'level') selectCampaign(next.id); else if (next.type === 'transmission') startTransmission(next.chapterId); else if (next.type === 'retry') reset(); else showLevelSelect(); } else reset(); });
$('#winEditor').addEventListener('click', showEditor);
$('#editInfinite').addEventListener('click', () => { if (infiniteMode && editor.loadDocument(activeDemo.document)) showEditor(); });
$('#copyInfinite').addEventListener('click', async () => {
  if (!infiniteMode) return;
  const url = new URL(location.href); url.searchParams.delete('demo'); url.searchParams.delete('campaign'); url.searchParams.set('infinite', infiniteSeed); url.searchParams.set('stage', String(infiniteStage));
  try { await navigator.clipboard.writeText(url.href); $('#copyInfinite').textContent = 'Copied ✓'; }
  catch { $('#infiniteResult').textContent = url.href; $('#infiniteResult').tabIndex = 0; $('#infiniteResult').focus(); $('#copyInfinite').textContent = 'Select link above'; }
});
$('#winHome').addEventListener('click', () => chapterEncounterId ? showLevelSelect() : showHome());
pauseButton.addEventListener('click', () => { if (runState !== 'ready') togglePause(); });
$('#soundEnabled').addEventListener('change', (event) => { audioPreferences.effectsEnabled = event.target.checked; audio.setEffects(audioPreferences.effectsEnabled, audioPreferences.effectsVolume); persistAudioPreferences(); });
$('#effectsVolume').addEventListener('input', (event) => { audioPreferences.effectsVolume = Number(event.target.value) / 100; $('#effectsVolumeValue').textContent = `${event.target.value}%`; audio.setEffects(audioPreferences.effectsEnabled, audioPreferences.effectsVolume); persistAudioPreferences(); });
$('#musicEnabled').addEventListener('change', (event) => { audioPreferences.musicEnabled = event.target.checked; audio.setMusic(audioPreferences.musicEnabled, audioPreferences.musicVolume); persistAudioPreferences(); });
$('#musicVolume').addEventListener('input', (event) => { audioPreferences.musicVolume = Number(event.target.value) / 100; $('#musicVolumeValue').textContent = `${event.target.value}%`; audio.setMusic(audioPreferences.musicEnabled, audioPreferences.musicVolume); persistAudioPreferences(); });
$('#muteAll').addEventListener('click', () => { audioPreferences.muted = !audioPreferences.muted; audio.setEnabled(!audioPreferences.muted); persistAudioPreferences(); syncMuteControl(); });
document.addEventListener('pointerdown', () => audio.unlock(), { capture: true });
document.addEventListener('keydown', () => audio.unlock(), { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) { $('#campaignDirection').classList.add('hidden'); cancelMineHold(); closePhraseReplay({ restoreFocus: false }); audio.stopHeartbeat(); audio.stopScene(); encounterSizzleUntil = -1; encounterMineQueued = false; audio.context?.suspend().catch(() => {}); } else if (audio.enabled) audio.context?.resume().catch(() => {}); lastFrame = performance.now(); accumulator = 0; });
function contextAction() {
  if (encounterResolving() || phraseReward || transmission.active || settings.open || gallery.open || homeOpen || editor?.open || won || drifted) return;
  if (entityRuntime?.held) releaseEntityHold(entityRuntime, body, simTime);
  else if (experiment.held) experiment.release(body);
  else if (wells.length) removeWell(wells[0].id);
}
function encounterResolving() { return encounter?.phase === 'resolved' && !won && !drifted; }
function updateControls() {
  const control = primaryControl({state:runState,held:!!(experiment.held || entityRuntime?.held),wellCount:wells.length});
  const button = $('#primaryAction');
  button.textContent = control.label;
  button.title = 'Primary action (Space)';
  button.setAttribute('aria-label', control.label);
  button.disabled = encounterResolving() || !!phraseReward || control.disabled || settings.open || gallery.open || homeOpen || editor?.open;
  const mineButton = $('#dropMine');
  mineButton.classList.toggle('hidden', !encounter);
  const mineStatus = encounterMineStatus();
  const mineBlocked = runState !== 'running' || encounterResolving() || !!phraseReward || settings.open || gallery.open || homeOpen || editor?.open || chapterGuide.open || transmission.active || won || drifted;
  mineButton.disabled = mineBlocked || !mineStatus.available || encounterMineQueued;
  const mineHelp = mineStatusCopy(mineStatus);
  mineButton.title = `Drop mine · ${mineHelp}`;
  mineButton.setAttribute('aria-label', `Drop mine · ${mineHelp}`);
  pauseButton.disabled = encounterResolving() || homeOpen || !['running','paused'].includes(runState);
  $('#settingsButton').disabled = encounterResolving();
  $('#restart').disabled = encounterResolving() || !!phraseReward || homeOpen || (challengeMode() && (runState === 'ready' || won || drifted));
  $('#restart').textContent = challengeMode() ? '✕' : '↺';
  $('#restart').setAttribute('aria-label', challengeMode() ? 'Die' : 'Restart');
  $('#restart').title = challengeMode() ? 'Die (R)' : 'Restart (R)';
  $('#galleryButton').textContent = editorPlaytest ? '▤' : challengeMode() ? '⌂' : '⊞';
  $('#galleryButton').setAttribute('aria-label', editorPlaytest ? 'Back to editor' : challengeMode() ? 'Home' : 'Demo gallery');
  $('#galleryButton').title = editorPlaytest ? 'Back to editor' : challengeMode() ? 'Home' : 'Demo gallery';
  const canResume = runState === 'paused';
  pauseButton.textContent = canResume ? '▷' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', canResume ? 'Resume' : 'Pause');
  pauseButton.title = canResume ? 'Resume (P)' : 'Pause (P)';
}
function primaryAction() {
  if (encounterResolving() || phraseReward || chapterGuide.open || transmission.active || settings.open || gallery.open || homeOpen || editor?.open || won || drifted) return;
  const control = primaryControl({state:runState,held:!!(experiment.held || entityRuntime?.held),wellCount:wells.length});
  if (control.action === 'start' || control.action === 'resume') togglePause();
  else if (control.action === 'release') { if (!releaseEntityHold(entityRuntime, body, simTime)) experiment.release(body); }
  else if (control.action === 'remove') removeWell(wells[0].id);
  updateControls();
}
$('#primaryAction').addEventListener('click', primaryAction);
$('#dropMine').addEventListener('click', () => {
  cancelMineHold();
  queueHeroMine();
  updateControls();
});
function togglePause() {
  cancelMineHold();
  if (encounterResolving() || chapterGuide.open || drifted || won || homeOpen || editor?.open || settings.open || gallery.open) return;
  paused = !paused;
  if (paused) { audio.stopHeartbeat(); if (encounterVitality) { audio.stopScene(); encounterSizzleUntil = -1; encounterMineQueued = false; } }
  runState = paused ? 'paused' : 'running';
  updateControls();
  caption.textContent = paused ? 'PAUSED' : '';
  lastFrame = performance.now(); updateStatus();
}
window.addEventListener('keydown', (event) => {
  if (encounterResolving() || chapterGuide.open) return;
  if (transmission.active) { if (event.key === 'Escape') { event.preventDefault(); transmission.stop(); } return; }
  if (settings.open || gallery.open || homeOpen || editor?.open || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const key = event.key.toLowerCase();
  if (key === ' ' && !won && !drifted) { event.preventDefault(); if (!event.repeat) primaryAction(); return; }
  if (event.repeat) return;
  if (key === 'p' && runState !== 'ready') { event.preventDefault(); togglePause(); }
  if (key === 'm' && encounter && runState === 'running') { event.preventDefault(); queueHeroMine(); }
  if (key === 'r' && !phraseReward) { if (challengeMode()) { if (runState === 'running' || runState === 'paused') failRun('manual'); } else reset(); }
  if (key === 'e') contextAction();
  if (key === '1' && wells[0]) removeWell(wells[0].id);
  if (key === '2' && wells[1]) removeWell(wells[1].id);
});
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(sceneElement);
window.visualViewport?.addEventListener('resize', resize);

function advancePhraseReward(elapsed) {
  if (!phraseReward || paused) return;
  phraseReward.elapsed += elapsed;
  const beat = phraseRewardAt(phraseReward.elapsed);
  if (beat.replayIndex > phraseReward.played) {
    for (let i = phraseReward.played + 1; i <= beat.replayIndex; i++) audio.phraseNote(activePhrase().notes[i], true);
    phraseReward.played = beat.replayIndex;
  }
  const at = phrasePulsePoint(phraseState, phraseReward.elapsed);
  if (at && !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
    phrasePulse.visible = phrasePulseAura.visible = phrasePulseOuter.visible = true;
    phrasePulse.position.set(at.x, at.y, 2.2);
    phrasePulseAura.position.set(at.x, at.y, 2.14);
    phrasePulseOuter.position.set(at.x, at.y, 2.12);
    phrasePulse.scale.setScalar(1 + .3 * Math.sin(phraseReward.elapsed * 19));
    phrasePulse.material.opacity = beat.replayIndex < 0 ? .32 : .75;
    phrasePulseAura.material.opacity = beat.replayIndex < 0 ? .34 : .7;
    phrasePulseOuter.material.opacity = beat.replayIndex < 0 ? .12 : .26;
    phrasePulseLight.position.set(at.x, at.y, 2.2);
    phrasePulseLight.intensity = beat.replayIndex < 0 ? 18 : 52;
  } else phrasePulse.visible = phrasePulseAura.visible = phrasePulseOuter.visible = false;
  if (!phrasePulse.visible) phrasePulseLight.intensity = 0;
  if (phraseRouteLine) for (const segment of phraseRouteLine.children) segment.material.opacity = beat.replayIndex < 0 ? .35 : .55;
  if (beat.finished) {
    phraseReward = null;
    phrasePulse.visible = phrasePulseAura.visible = phrasePulseOuter.visible = false;
    phrasePulseLight.intensity = 0;
    if (phraseRouteLine) { scene.remove(phraseRouteLine); disposeObject(phraseRouteLine); phraseRouteLine = null; }
    caption.classList.remove('phrase-cue');
    caption.textContent = '';
    resize();
    updateControls();
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const elapsed = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  if (document.hidden || transmission.active) { audio.syncMusic(false); accumulator = 0; return; }
  if (phraseReplay) {
    phraseReplay.elapsed += elapsed;
    const index = Math.min(phraseReplay.phrase.notes.length - 1, Math.floor(phraseReplay.elapsed / .43));
    if (index > phraseReplayIndex) {
      for (let i = phraseReplayIndex + 1; i <= index; i++) audio.phraseNote(phraseReplay.phrase.notes[i], true);
      phraseReplayIndex = index;
      for (const note of $('#phraseReplayNotes').children) note.classList.toggle('played', Number(note.dataset.phraseNote) <= index);
    }
    // Leave the sheet open through the final room tail so it can be replayed.
  }
  advancePhraseReward(elapsed);
  if (!paused && !drifted && !won && !phraseReward) {
    accumulator += elapsed;
    while (accumulator >= STEP) {
      if (encounter?.phase === 'resolved') {
        const outcome = stepEncounter(encounter, { before: body.position, hero: body.position, dt: STEP, bounds: activeLevel.bounds, walls: activeLevel.walls });
        encounter = outcome.state;
        simTime += STEP; accumulator -= STEP;
        if (outcome.state.complete) { winRun(); break; }
        continue;
      }
      for (const expired of wells.filter((well) => remaining(well, simTime) <= 0)) removeWell(expired.id);
      const before = { x: body.position.x, y: body.position.y };
      const a = gameMode === 'maze' ? mazeAcceleration(body.position, wells, simTime, effectiveMode(), activeLevel) : acceleration(body.position, wells, simTime, effectiveMode());
      body.applyForce(new CANNON.Vec3(a.x * body.mass, a.y * body.mass, 0));
      const heroActualAcceleration = { ...a };
      if (entityRuntime) { const pull = entityAcceleration(body.position, activeDemo.entities, entityRuntime); body.applyForce(new CANNON.Vec3(pull.x * body.mass, pull.y * body.mass, 0)); heroActualAcceleration.x += pull.x; heroActualAcceleration.y += pull.y; }
      applyMoonGravity(heroActualAcceleration);
      world.step(STEP);
      if(activeLevel.channel) constrainChannel(body.position,body.velocity,activeLevel.channel,BLOB_RADIUS);
      updateGate();
      const moonCollectors = recordCompanionMotion();
      body.position.z = 0;
      body.velocity.z = 0;
      if (gameMode === 'maze') {
        capVelocity(body.velocity, Math.max(activeDemo.mechanic === 'boost' ? 16 : SPEED_CAP,
          ...(activeDemo.entities || []).filter(entity => entity.type === 'impulse').map(entity => entity.speed)));
        const special = experiment.step(body, before, simTime, wells, effectiveMode(), failRun);
        if (drifted) break;
        const physicalEnd = { x: body.position.x, y: body.position.y };
        let entityStep = null;
        if (entityRuntime) {
          // A rescued sweep is rolled back before any pending pickup or capture
          // can be committed on the next tick.
          const entitySnapshot = challengeMode() && simTime >= emberImmuneUntil && oldestOwnedMoon(moonEntries) ? structuredClone(entityRuntime) : null;
          entityStep = stepEntityRuntime(entityRuntime, activeDemo.entities, before, body, simTime, STEP, activeLevel.bounds, { emberImmune: simTime < emberImmuneUntil, walls: activeLevel.walls, duel: !!encounter });
          if (entityStep.died) {
            if (challengeMode() && rescueHero(before, entityStep.fatalEmber)) {
              if (entitySnapshot) entityRuntime = entitySnapshot;
              simTime += STEP;
              accumulator -= STEP;
              continue;
            }
            failRun('hazard'); break;
          }
          if (moonCollectors.length) {
            const light = collectCompanionLight(entityRuntime, activeDemo.entities, moonCollectors, simTime, body.position);
            entityStep.energyDelta += light.energyDelta;
            if (light.collected) entityStep.tones.push('lightPickup');
          }
          for (const tone of entityStep.tones) audio.tone(tone === 'lightPickup' ? 587.33 : tone === 'dimmer' ? 196 : tone === 'portal' ? 330 : 440, 0, .35, .08);
        }
        const duelHeroEnd = entityStep?.teleported ? physicalEnd : body.position;
        const encounterConfig = activeDemo.duel ? { ...ENCOUNTER, speed: activeDemo.duel.bossSpeed,
          bossMines: activeDemo.duel.bossMines, bossSeeksLight: activeDemo.duel.bossSeeksLight,
          rechargeThreshold: activeDemo.duel.rechargeThreshold } : ENCOUNTER;
        if (encounter) {
          const bossBefore = { x: encounter.boss.x, y: encounter.boss.y };
          const outcome = stepEncounter(encounter, { before, hero: duelHeroEnd, heroVelocity: body.velocity,
            dt: STEP, time: simTime, bounds: activeLevel.bounds, walls: activeLevel.walls,
            heroEnergy: encounterVitality.hero.energy, bossEnergy: encounterVitality.boss.energy,
            pickups: encounterVitality.pickups, dropMine: encounterMineQueued,
            behavior: chapterEncounterId === 1 ? 'flee' : $('#encounterBehavior').value, config: encounterConfig });
          encounterMineQueued = false;
          encounter = outcome.state;
          if (outcome.events.includes('hit')) {
            if (outcome.knockback) {
              body.velocity.x += outcome.knockback.x; body.velocity.y += outcome.knockback.y;
              capVelocity(body.velocity, SPEED_CAP);
            }
            encounterFlashAge = 0;
            const note = [329.628, 440, 523.251][(encounter.hits - 1) % 3];
            audio.tone(note, 0, .8, .15, note, true);
          }
          if (outcome.events.includes('heroDrop') || outcome.events.includes('bossDrop')) audio.tone(246.94, 0, .16, .035, 220, true);
          if (outcome.events.some(event => event.startsWith('heroDropRejected:'))) caption.textContent = `MINE: ${outcome.events.find(event => event.startsWith('heroDropRejected:')).split(':')[1].toUpperCase()}`;
          if (outcome.events.includes('burst')) { audio.tone(110, 0, .4, .1, 82.41, true); caption.textContent = 'DODGE THE EMBER BURST'; }
          if (encounterVitality && encounter.phase !== 'resolved') {
            const result = stepEncounterVitality(encounterVitality, { heroBefore: before, hero: duelHeroEnd, arrival: entityStep?.teleported ? body.position : null,
              bossBefore, boss: encounter.boss, dt: STEP, time: simTime, level: activeLevel,
              hazards: encounter.hazards, heroExposureSeconds: outcome.heroExposureSeconds + (entityStep?.emberExposureSeconds || 0),
              bossExposureSeconds: outcome.bossExposureSeconds, costs: outcome.costs, duel: activeDemo.duel,
              heroLightPaused: holdsCampaignLight(entityRuntime) });
            encounterVitality = result.state;
            experiment.brightness = encounterVitality.hero.energy;
            if (result.collected.hero || result.collected.boss) { audio.stopHeartbeat(); audio.tone(587.33, 0, .35, .08); }
            for (const beat of result.heartbeat) audio.heartbeat(beat.part, beat.urgency);
            if (outcome.heroExposureSeconds + (entityStep?.emberExposureSeconds || 0) > 0) {
              encounterSizzleUntil = simTime + .18;
              if (simTime - lastEncounterSizzleTime >= .18) {
                audio.noise(.13, 1900, .025, true);
                audio.tone(164.81, 0, .12, .025, 123.47, true);
                lastEncounterSizzleTime = simTime;
              }
            }
            if (result.result === 'draw' || result.result === 'hero') { failRun(result.result === 'draw' ? 'draw' : 'darkness'); break; }
            if (result.result === 'boss') {
              encounter.phase = 'resolved'; encounter.phaseTime = 0;
              body.velocity.set(0, 0, 0);
              audio.tone(659.255, 0, 1.5, .16, 659.255, true);
              caption.textContent = 'THE ANSWER HOLDS';
            }
          }
        }
        if (soundGates) {
          const result = stepSoundGates(soundGates, activeDemo.soundGates, before,
            entityStep?.teleported ? physicalEnd : body.position, simTime,
            entityStep?.teleported ? body.position : null);
          soundGates = result.state;
          for (const id of result.acquired) audio.gateAcquire(id);
          for (const { id, beat } of result.beats) audio.gateBeat(id, beat);
        }
        if (phraseActive() && !phraseState.complete) {
          const result = stepPhrase(phraseState, before, entityStep?.teleported ? physicalEnd : body.position,
            entityStep?.teleported ? body.position : null, activePhrase());
          phraseState = result.state;
          for (const index of result.acquired) { audio.phraseNote(activePhrase().notes[index]); phraseAcquireAge[index] = 0; }
          if (result.acquired.length && !phraseState.complete) {
            caption.textContent = `PHRASE ${phraseState.next} / ${activePhrase().gates.length} · FOLLOW THE NEXT LIGHT`;
            caption.classList.add('phrase-cue');
          }
          if (phraseState.complete) startPhraseReward();
        }
        if (special === 'teleport' || entityStep?.teleported) {
          if (trailCount) archiveSegment(trailSamples[(trailStart + trailCount - 1) % TRAIL_CAPACITY], before);
          trailStart = 0; trailCount = 0; trailGeometry.setDrawRange(0, 0);
          before.x = body.position.x; before.y = body.position.y;
        }
        if (campaign) {
          const lightPaused = holdsCampaignLight(entityRuntime);
          const result = stepCampaign(campaign, { before, hero: body.position, collectors: moonCollectors, dt: STEP, time: simTime, level: activeLevel, config: activeDemo.settings || CAMPAIGN, extraEnergy: entityStep?.energyDelta || 0, availableCompanions: moonEntries.filter(entry => entry.companionState?.owned && !entry.heat?.burned).length, lightPaused });
          if (lightPaused) audio.stopHeartbeat();
          campaign = result.state;
          if (result.consumedCompanion) {
            const moon = oldestOwnedMoon(moonEntries);
            if (moon) removeMoon(moon);
            audio.stopHeartbeat();
            audio.tone(392, 0, .22, .08);
            audio.tone(587.33, .16, .38, .06);
            moonCue('MOON BOUGHT 4 SECONDS');
          }
          experiment.brightness = campaign.energy * (entityRuntime?.eclipseMultiplier ?? 1);
          visitedBounds.minX = Math.min(visitedBounds.minX, body.position.x);
          visitedBounds.maxX = Math.max(visitedBounds.maxX, body.position.x);
          visitedBounds.minY = Math.min(visitedBounds.minY, body.position.y);
          visitedBounds.maxY = Math.max(visitedBounds.maxY, body.position.y);
          if (result.collected) { audio.stopHeartbeat(); audio.tone(587.33, 0, .35, .08); }
          for (const beat of result.heartbeat) audio.heartbeat(beat.part, beat.urgency);
          if (result.failed) { failRun(); break; }
        }
        if (burnout) {
          const result = stepBurnout(burnout, { before, hero: body.position, collectors: moonCollectors, level: activeDemo.level, dt: STEP, time: simTime });
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
        if (entityStep?.companions?.length) acquireCompanions(entityStep.companions);
        if (impact?.type === 'goal' && !encounter) { winRun(); break; }
        if (challengeMode() && safeHeroPoint(body.position, activeLevel, activeDemo.entities || [], entityRuntime)) lastSafeHero = { x: body.position.x, y: body.position.y };
      }
      simTime += STEP;
      accumulator -= STEP;
      if (phraseReward) { accumulator = 0; break; }
    }
    updateTrail();
    if (gameMode === 'maze') $('#runTime').textContent = `${simTime.toFixed(1)}s`;
    frameCount++;
    if (frameCount % 8 === 0) updateForecast();
    if (gameMode === 'sandbox' && (Math.abs(body.position.x) > camera.right + 1.5 || Math.abs(body.position.y) > camera.top + 1.5)) {
      failRun('drift');
    }
  }
  core.position.set(body.position.x, body.position.y, 2);
  if (moonCueUntil >= 0 && simTime >= moonCueUntil) {
    moonCueUntil = -1;
    caption.classList.remove('moon-cue');
    if (runState === 'running') caption.textContent = '';
  }
  blobLight.position.set(body.position.x, body.position.y, 1.1);
  const eclipseExposure = entityRuntime?.eclipseMultiplier ?? experiment.eclipseExposure;
  const orbPulse = audio.orb(!homeOpen && !editor?.open && !gallery.open && !settings.open && !drifted && !won && !document.hidden, now / 1000, experiment.brightness);
  updateControls();
  blobLight.intensity = 85 * experiment.brightness;
  blob.material.transparent = !!campaign || !!encounterVitality || eclipseExposure < 1;
  blob.material.opacity = (campaign || encounterVitality ? .08 + (campaign || encounterVitality.hero).energy * .92 : 1) * eclipseExposure;
  blob.scale.setScalar(1 + orbPulse * .055);
  heroGlow.scale.setScalar(2.3 + orbPulse * .25);
  if (simTime < emberImmuneUntil) {
    heroGlow.scale.setScalar(3.1 + orbPulse * .3);
    heroGlow.material.color.setHex(0xcdb7ff);
  } else heroGlow.material.color.setHex(encounterVitality && simTime < encounterSizzleUntil ? 0xffbb8d : 0xffffff);
  heroGlow.material.opacity = (.83 + orbPulse * .17) * Math.min(1, experiment.brightness);
  sparkMaterial.uniforms.fade.value = eclipseExposure;
  let deathFinished = false;
  let deathFade = 1;
  if (deathTransition) {
    const visual = stepDeathTransition(deathTransition, elapsed);
    deathTransition = visual.transition;
    deathFinished = visual.finished;
    deathFade = visual.fade;
    blob.material.transparent = true;
    blob.material.opacity *= deathFade;
    blob.scale.setScalar(Math.max(0.001, 1 - (1 - deathFade) * .7));
    heroGlow.material.opacity *= deathFade;
    blobLight.intensity *= deathFade;
    sparkMaterial.uniforms.fade.value *= deathFade;
    deathRipple.visible = visual.ring > 0;
    deathRipple.scale.setScalar(visual.radius);
    deathRipple.material.opacity = visual.ring * .9;
    if (deathFinished) core.visible = false;
  } else {
    core.visible = !drifted;
    blob.scale.setScalar(1);
    deathRipple.visible = false;
    if (drifted) { blobLight.intensity = 0; heroGlow.material.opacity = 0; sparkMaterial.uniforms.fade.value = 0; }
  }
  if (!paused && !drifted && !won) updateSparks(elapsed);
  if (gameMode === 'maze') {
    updateHazardSparks();
    for (const hazard of hazardGroups) hazard.userData.setFade?.(eclipseExposure);
  }
  if (gameMode === 'maze') updatePortalSparks();
  portal.rotation.z += elapsed * 0.35; portalAura.material.opacity = 0.35 + Math.sin(now * 0.002) * 0.1;
  if (encounterFlashAge < .55) encounterFlashAge = Math.min(.55, encounterFlashAge + elapsed);
  updateEncounterVisual(now);
  if (encounter && !won && !drifted) $('#demoObjective').textContent = encounter.phase === 'resolved' ? 'THE ANSWER HOLDS' : 'Ram · hold for mine · collect shared light';
  experiment.updateVisuals(body.position, simTime, experiment.brightness, renderer.getPixelRatio(), eclipseExposure);
  updateEntityVisuals();
  if (soundGates) updateCampaignGates();
  if (phraseActive()) {
    for (let i = 0; i < phraseAcquireAge.length; i++) if (phraseAcquireAge[i] < .75) phraseAcquireAge[i] = Math.min(.75, phraseAcquireAge[i] + elapsed);
    updatePhraseGates(now);
  } else phraseAcquireLight.intensity = 0;
  if (activeDemo.mechanic === 'sound') $('#demoObjective').textContent = `Cross rings to add rhythm · ${experiment.layers.size}/3 voices active${experiment.layers.size ? ' · ' + ['bass','offbeat','chime'].filter((_,i)=>experiment.layers.has(i)).join(' + ') : ' · cyan bass / violet offbeat / gold chime'}`;
  optics.update(body.position, experiment.brightness * deathFade);
  if (burnout || campaign || encounterVitality) { syncPickups(); updateResourceHud(); }
  updateCompanionHud();
  updateMoonVisuals();
  updateWellVisuals();
  updateCamera(deathTransition ? 0 : elapsed);
  if (phraseReward) {
    const aspect = Math.max(.4, sceneElement.clientWidth / Math.max(1, sceneElement.clientHeight));
    const route = phraseState.path;
    const xs = route.map(point => point.x), ys = route.map(point => point.y);
    const width = Math.max(40, Math.max(...xs) - Math.min(...xs) + 12, (Math.max(...ys) - Math.min(...ys) + 12) * aspect);
    camera.left = -width / 2; camera.right = width / 2;
    camera.top = width / aspect / 2; camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    camera.position.x = (Math.min(...xs) + Math.max(...xs)) / 2;
    camera.position.y = (Math.min(...ys) + Math.max(...ys)) / 2;
  }
  updateCampaignDirection();
  drawMinimap();
  audio.trail(!phraseReward && !homeOpen && !editor?.open && !paused && !drifted && !won && !document.hidden, Math.hypot(body.velocity.x, body.velocity.y), simTime - lastSoundWellTime);
  audio.syncMusic(fixedCampaignControls() && !homeOpen && !editor?.open && !gallery.open && !settings.open && !paused && !drifted && !won,
    phraseReward ? .13 : campaign?.energy <= 0 ? .16 : (soundGates?.mask || 0) ? .45 : 1);
  if (frameCount % 12 === 0 || paused || drifted) updateStatus();
  renderer.render(scene, camera);
  if (deathFinished) {
    const reason = deathTransition.reason;
    deathTransition = null;
    if (challengeMode() || encounter) showRunArt(false, reason);
    else if (reason === 'drift') driftOverlay.classList.remove('hidden');
    else reset();
  }
}

mazeGroup.visible = !activeDemo.sandbox;
startingOrbit.visible = !!activeDemo.sandbox;
if (route.has('demo')) selectDemo(activeDemo.id);
else if (chapterEncounterId) { const requested = chapterEncounterId; if (lockedEncounterRoute) { selectCampaign(availableCampaignIds(initialBestGates).at(-1), { suppressGuide: true }); showLevelSelect('That encounter is locked. Finish its third crossing with at least one gate to reveal it.'); } else selectChapterEncounter(requested); }
else if (campaignMode) { selectCampaign(campaignLevelId, { suppressGuide: lockedCampaignRoute }); if (lockedCampaignRoute) showLevelSelect('That crossing is locked. Reach the portal with at least one gate to reveal the next level.'); }
else if (infiniteMode) selectInfinite(infiniteSeed, infiniteStage);
else { selectDemo(activeDemo.id); showHome(); }
requestAnimationFrame(frame);
