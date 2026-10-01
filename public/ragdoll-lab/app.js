import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { clone as cloneSkeleton } from './vendor/SkeletonUtils.js';
import { createSimulation, validateProfile } from './physics.js?v=vitalik-20261001';
import { interpolateBodyQuaternion } from './renderMath.js';
import { createSkinnedRagdoll } from './skinnedRagdoll.js';
import { createTouchPolicy, createFpsCounter, clearOrbitInertia } from './interaction.js';
import { readQuality, saveQuality, createRenderGate, driveRenderFrame } from './quality.js';
import { createCharacterSelection } from './characterSelection.js?v=vitalik-20261001';

const $ = id => document.getElementById(id);
const viewport = $('viewport');
const error = $('error-message');
let simulation;
let renderer;
let resizeObserver;
let controls;
let activeDrag = null;
let webTool;
let webToolController;

try {
  const qualityStorage = (() => { try { return window.localStorage; } catch { return null; } })();
  let graphicsQuality = readQuality(qualityStorage);
  const renderGate = createRenderGate(graphicsQuality);
  simulation = createSimulation();
  simulation.reset('drop');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1b232b');
  scene.fog = new THREE.Fog('#1b232b', 12, 27);
  const camera = new THREE.PerspectiveCamera(42, 1, .05, 200);
  camera.position.set(3.7, 3, 5.2);
  camera.lookAt(0, 1.55, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const pixelRatioFor = quality => quality === 'low' ? .75 * Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatioFor(graphicsQuality));
  renderer.shadowMap.enabled = graphicsQuality === 'standard';
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  viewport.prepend(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.55, 0);
  controls.enableDamping = true;
  controls.minDistance = 2.3;
  controls.maxDistance = 13;
  controls.maxPolarAngle = Math.PI * .48;
  const touchPolicy = createTouchPolicy();
  const fpsCounter = createFpsCounter();
  $('graphics-quality').value = graphicsQuality;
  function applyGraphicsQuality(value) {
    if (value === graphicsQuality) return;
    graphicsQuality = value;
    saveQuality(qualityStorage, value);
    renderGate.setQuality(value);
    renderer.setPixelRatio(pixelRatioFor(value));
    renderer.setSize(Math.max(1, viewport.clientWidth), Math.max(1, viewport.clientHeight), false);
    renderer.shadowMap.enabled = value === 'standard';
    if (value === 'standard') { renderer.shadowMap.needsUpdate = true; key.shadow.needsUpdate = true; }
    const materials = new Set();
    scene.traverse(object => {
      if (Array.isArray(object.material)) for (const material of object.material) materials.add(material);
      else if (object.material) materials.add(object.material);
    });
    for (const material of materials) material.needsUpdate = true;
    fpsCounter.reset(performance.now());
    if ($('show-fps').checked) $('fps-badge').textContent = '— FPS';
  }
  $('graphics-quality').addEventListener('change', event => applyGraphicsQuality(event.target.value));
  const narrowScreen = window.matchMedia('(max-width: 850px)');
  const panel = document.querySelector('.panel');
  const panelHome = panel.parentNode;
  const panelNext = panel.nextSibling;
  const buttonRow = panel.querySelector('.button-row');
  const buttonHome = buttonRow.parentNode;
  const buttonNext = buttonRow.nextSibling;
  const settingsDialog = $('settings-dialog');
  let touchMode = 'camera';
  function reconnectOrbit() { controls.disconnect(); clearOrbitInertia(controls); controls.connect(renderer.domElement); controls.enabled = true; }
  function closeSettings() { if (settingsDialog.open) settingsDialog.close(); }
  function syncResponsiveLayout() {
    releaseDrag();
    touchPolicy.reset();
    reconnectOrbit();
    if (narrowScreen.matches) {
      $('mobile-action-mount').append(buttonRow);
      $('settings-mount').append(panel);
    } else {
      closeSettings();
      buttonHome.insertBefore(buttonRow, buttonNext);
      panelHome.insertBefore(panel, panelNext);
    }
  }
  narrowScreen.addEventListener('change', syncResponsiveLayout);
  $('open-settings').addEventListener('click', () => {
    releaseDrag();
    touchPolicy.reset();
    reconnectOrbit();
    settingsDialog.showModal();
    $('close-settings').focus();
  });
  $('close-settings').addEventListener('click', closeSettings);
  settingsDialog.addEventListener('click', event => { if (event.target === settingsDialog) closeSettings(); });
  settingsDialog.addEventListener('close', () => { releaseDrag(); (narrowScreen.matches ? $('open-settings') : $('play-button')).focus(); });
  function setTouchMode(mode) {
    releaseDrag();
    touchPolicy.reset();
    reconnectOrbit();
    touchMode = mode;
    for (const choice of ['camera', 'grab']) {
      const active = choice === mode;
      $(`touch-${choice}`).classList.toggle('active', active);
      $(`touch-${choice}`).setAttribute('aria-pressed', String(active));
    }
    $('touch-hint').textContent = mode === 'camera' ? 'Drag to orbit · pinch to zoom' : 'Touch a body to pull it';
  }
  $('touch-camera').addEventListener('click', () => setTouchMode('camera'));
  $('touch-grab').addEventListener('click', () => setTouchMode('grab'));
  $('show-fps').addEventListener('change', event => {
    const enabled = event.target.checked;
    fpsCounter.setEnabled(enabled, performance.now());
    $('fps-badge').hidden = !enabled;
    $('fps-badge').textContent = '— FPS';
  });
  syncResponsiveLayout();
  const ambient = new THREE.HemisphereLight('#cbdfe7', '#26303a', 2.4);
  scene.add(ambient);
  const key = new THREE.DirectionalLight('#fff1d8', 3.1);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.bias = -.0005;
  scene.add(key);
  scene.add(key.target);
  const fill = new THREE.DirectionalLight('#5cc4c4', 1.8);
  fill.position.set(4, 3, -5);
  scene.add(fill);

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#f17b55', metalness: .18, roughness: .42 });
  const bodyDark = new THREE.MeshStandardMaterial({ color: '#bd553d', metalness: .12, roughness: .52 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: '#81e0ce', metalness: .15, roughness: .35, emissive: '#12453f', emissiveIntensity: .15 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#293640', metalness: .05, roughness: .88 });
  const treadMaterial = new THREE.MeshStandardMaterial({ color: '#40525a', metalness: .08, roughness: .75 });
  const slideMaterial = new THREE.MeshStandardMaterial({ color: '#39505b', metalness: .09, roughness: .76 });
  const railMaterial = new THREE.MeshStandardMaterial({ color: '#5f7b80', metalness: .2, roughness: .5 });
  const deckMaterial = new THREE.MeshStandardMaterial({ color: '#34484c', metalness: .06, roughness: .85 });
  const boardMaterial = new THREE.MeshStandardMaterial({ color: '#24373d', metalness: .08, roughness: .86 });
  const boardFrameMaterial = new THREE.MeshStandardMaterial({ color: '#608b91', metalness: .2, roughness: .56 });
  const boardGuardMaterial = new THREE.MeshBasicMaterial({ color: '#9bd5d1', transparent: true, opacity: .065, depthWrite: false, side: THREE.DoubleSide });
  const mountMaterial = new THREE.MeshBasicMaterial({ color: '#90d7c9', transparent: true, opacity: .35, depthWrite: false });
  const dynamicMeshes = [];
  const staticMeshes = [];
  const pickMeshes = [];
  const characterAssets = new Map();
  const characterRigs = new Map();
  const characterSelection = createCharacterSelection();
  const characterNames = { goatman: 'Goatman', vitalik: 'Vitalik · stylized' };
  let cameraMode = 'overview';
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const dragPoint = new THREE.Vector3();
  const intersection = new THREE.Vector3();
  const previousRenderQuaternion = new THREE.Quaternion();
  const currentRenderQuaternion = new THREE.Quaternion();
  let lastFrame = performance.now();
  const frameDelta = () => { const now = performance.now(); const delta = Math.max(0, (now - lastFrame) / 1000); lastFrame = now; return delta; };

  function pickable(mesh, body) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.body = body;
    pickMeshes.push(mesh);
    return mesh;
  }
  function makeBodyVisual(body) {
    const group = new THREE.Group();
    const id = body.idTag;
    const shape = body.shapeTag;
    const isHead = id === 'head';
    const isFoot = id.endsWith('foot');
    const primaryMaterial = ['pin', 'target'].includes(body.ragdollInstance.role) ? accentMaterial : bodyMaterial;
    if (shape instanceof Object && 'radius' in shape && isHead) {
      const mesh = pickable(new THREE.Mesh(new THREE.SphereGeometry(shape.radius, 24, 16), primaryMaterial), body);
      group.add(mesh);
      const face = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), accentMaterial);
      face.position.set(0, .025, .145);
      group.add(face);
    } else if (shape.halfExtents) {
      const h = shape.halfExtents;
      const mesh = pickable(new THREE.Mesh(new THREE.BoxGeometry(h.x * 2, h.y * 2, h.z * 2), isFoot ? bodyDark : primaryMaterial), body);
      group.add(mesh);
      if (id === 'chest') {
        const badge = new THREE.Mesh(new THREE.BoxGeometry(.12, .025, .012), accentMaterial);
        badge.position.set(0, .08, h.z + .008);
        group.add(badge);
      }
    } else {
      const radius = shape.radiusTop;
      const length = shape.height + 2 * radius;
      const main = pickable(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, Math.max(.01, length - 2 * radius), 14), primaryMaterial), body);
      group.add(main);
      for (const sign of [-1, 1]) {
        const cap = pickable(new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 10), primaryMaterial), body);
        cap.position.y = sign * (length / 2 - radius);
        group.add(cap);
      }
    }
    scene.add(group);
    dynamicMeshes.push({ body, group });
  }
  function rebuildVisuals() {
    for (const { group } of dynamicMeshes) {
      scene.remove(group);
      group.traverse(item => item.geometry?.dispose());
    }
    dynamicMeshes.length = 0;
    pickMeshes.length = 0;
    for (const rig of characterRigs.values()) scene.remove(rig.root);
    characterRigs.clear();
    for (const mesh of staticMeshes) { scene.remove(mesh); mesh.geometry.dispose(); }
    staticMeshes.length = 0;
    const characterAsset = characterAssets.get(simulation.readFrame().profileId);
    if (characterAsset) {
      for (const instance of simulation.instances) {
        const rig = createSkinnedRagdoll({ scene: cloneSkeleton(characterAsset.template.scene) }, characterAsset.profile);
        characterRigs.set(instance.id, rig);
        scene.add(rig.root);
        for (const mesh of rig.meshes) { mesh.userData.rig = rig; mesh.userData.instanceId = instance.id; pickMeshes.push(mesh); }
      }
    } else for (const body of simulation.bodies) makeBodyVisual(body);
    for (const body of simulation.staticBodies) {
      const [x, y, z] = body.halfExtentsTag;
      const isFloor = body.idTag === 'floor';
      const material = body.idTag === 'board-front' ? boardGuardMaterial : body.idTag === 'board-back' ? boardMaterial : body.idTag.startsWith('board-side') ? boardFrameMaterial : body.idTag === 'board-floor' ? deckMaterial : body.idTag.startsWith('slide-') ? slideMaterial : body.idTag.includes('rail') ? railMaterial : body.idTag === 'deck' ? deckMaterial : isFloor ? floorMaterial : treadMaterial;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(x * 2, y * 2, z * 2), material);
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
      mesh.receiveShadow = body.idTag !== 'board-front';
      mesh.castShadow = !isFloor && body.idTag !== 'board-front';
      if (body.idTag === 'board-front') mesh.renderOrder = 5;
      scene.add(mesh);
      staticMeshes.push(mesh);
    }
    if (simulation.readFrame().scene === 'plinko') {
      for (let row = 0; row < 5; row++) for (let column = 0; column <= row; column++) {
        const mark = new THREE.Mesh(new THREE.RingGeometry(.13, .16, 20), mountMaterial);
        mark.position.set((column - row / 2) * 1.8, 15.35 - 3 * row, -.535);
        mark.renderOrder = 1;
        scene.add(mark);
        staticMeshes.push(mark);
      }
    }
  }
  const grid = new THREE.GridHelper(30, 30, '#566f77', '#3c5059');
  grid.position.y = .004;
  grid.material.transparent = true;
  grid.material.opacity = .42;
  scene.add(grid);
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.51, 96), new THREE.MeshBasicMaterial({ color: '#759b9d', transparent: true, opacity: .20, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = .008;
  scene.add(ring);
  rebuildVisuals();

  function syncVisuals() {
    const alpha = simulation.interpolationAlpha();
    if (characterRigs.size) {
      for (const instance of simulation.instances) characterRigs.get(instance.id)?.pose(instance.bodies, alpha);
      return;
    }
    for (const { body, group } of dynamicMeshes) {
      group.position.copy(body.previousPosition).lerp(body.position, alpha);
      interpolateBodyQuaternion(body.previousQuaternion, body.quaternion, alpha, group.quaternion, previousRenderQuaternion, currentRenderQuaternion);
    }
  }
  function updateUI() {
    const snap = simulation.snapshot();
    const bowling = snap.scene === 'bowling';
    const plinko = snap.scene === 'plinko';
    $('play-label').textContent = snap.paused ? bowling ? (snap.time === 0 ? 'Launch' : 'Resume') : plinko ? (snap.time === 0 ? 'Drop' : 'Resume') : 'Play simulation' : 'Pause simulation';
    $('play-icon').textContent = snap.paused ? '▶' : 'Ⅱ';
    $('live-chip').textContent = snap.paused ? '● PAUSED' : '● LIVE';
    $('live-chip').classList.toggle('playing', !snap.paused);
    $('status-text').textContent = snap.paused ? (snap.time ? 'SIMULATION PAUSED' : bowling ? 'READY TO LAUNCH' : 'READY TO DROP') : 'SIMULATION LIVE';
    $('sim-time').textContent = snap.time.toFixed(1);
    $('scene-title').textContent = plinko ? 'PLINKO BOARD' : bowling ? 'BOWLING COURSE' : snap.scene === 'drop' ? 'FREE DROP' : 'STAIR FALL';
    $('scene-help').textContent = plinko ? 'Drop one ragdoll through fifteen targets arranged in five rows.' : bowling ? 'Launch one ragdoll down the long slide into ten standing ragdolls.' : snap.scene === 'drop' ? 'Watch joints absorb the landing on a flat plane.' : 'A forward lean sends the body down five steps.';
    $('study-title').innerHTML = plinko ? 'Watch them<br><em>cascade.</em>' : bowling ? 'Cause a<br><em>pileup.</em>' : 'Make a body<br><em>fall.</em>';
    $('study-intro').textContent = plinko ? 'One dropper, fifteen ragdoll targets, and gravity.' : bowling ? 'One launcher, ten ragdoll targets, and a long run downhill.' : 'Thirteen connected rigid bodies. Twelve joints. One very unforgiving floor.';
    for (const name of ['plinko', 'bowling', 'drop', 'stairs']) {
      const active = name === snap.scene;
      $(`scene-${name}`).classList.toggle('active', active);
      $(`scene-${name}`).setAttribute('aria-pressed', String(active));
    }
    $('speed').value = String(snap.settings.speed);
    $('gravity').value = String(snap.settings.gravity);
    $('impact-boost').value = String(snap.settings.impactBoost);
    $('damping').value = String(snap.settings.damping);
    $('friction').value = String(snap.settings.friction);
    $('slide-grip').value = String(snap.settings.slideGrip);
    $('joint-range').value = String(snap.settings.jointRange);
    $('damping-value').textContent = snap.settings.damping.toFixed(2);
    $('gravity-value').textContent = `${snap.settings.gravity.toFixed(2)} m/s²`;
    $('impact-boost-value').textContent = `${snap.settings.impactBoost.toFixed(1)}×`;
    $('friction-value').textContent = snap.settings.friction.toFixed(2);
    $('slide-grip-value').textContent = snap.settings.slideGrip.toFixed(2);
    $('joint-range-value').textContent = `${snap.settings.jointRange}%`;
    $('character').value = snap.profileId;
    $('body-count').textContent = String(snap.bodies);
    $('joint-count').textContent = String(snap.joints);
    $('pin-count').textContent = `${snap.releasedTargets}/${snap.totalTargets}`;
    $('target-stat-label').textContent = plinko ? 'RELEASED' : 'PINS HIT';
    $('pin-stat').hidden = !(bowling || plinko);
    $('slide-grip-setting').hidden = !(bowling || plinko);
    $('slide-grip-label').textContent = plinko ? 'Board grip' : 'Slide grip';
    $('slide-grip-help').textContent = plinko ? 'Grip against the board walls.' : 'Lower values let the launcher travel farther.';
    $('impact-boost-setting').hidden = !(bowling || plinko);
    $('impact-boost-help').textContent = plinko ? 'Adds one downward and sideways kick on contact. Zero keeps the natural collision.' : 'Adds one upward and outward kick on contact. Zero keeps the natural collision.';
    $('camera-control').hidden = !(bowling || plinko);
    $('camera-control').classList.toggle('board-camera', plinko);
    $('camera-overview').textContent = plinko ? 'Frame board' : 'Overview';
    $('camera-follow').hidden = !bowling;
    $('reset-button').title = plinko ? 'Reset board' : bowling ? 'Rerack simulation' : 'Reset simulation';
    $('reset-button').setAttribute('aria-label', $('reset-button').title);
    grid.visible = ring.visible = !(bowling || plinko);
    scene.fog.near = plinko ? 30 : bowling ? 34 : 12;
    scene.fog.far = plinko ? 110 : bowling ? camera.aspect < .75 ? 150 : 90 : 27;
    key.position.set(plinko ? -6 : -3, plinko ? 25 : 7, plinko ? 16 : 5);
    key.target.position.set(0, plinko ? 10 : 0, 0);
    key.shadow.camera.left = plinko ? -10 : -8;
    key.shadow.camera.right = plinko ? 10 : 8;
    key.shadow.camera.top = plinko ? 13 : 8;
    key.shadow.camera.bottom = plinko ? -13 : -8;
    key.shadow.camera.updateProjectionMatrix();
    fill.position.set(plinko ? 5 : 4, plinko ? 14 : 3, plinko ? 12 : -5);
    updateCameraButtons();
  }
  function reset(nextScene) {
    releaseDrag();
    touchPolicy.reset();
    reconnectOrbit();
    simulation.reset(nextScene);
    frameDelta();
    rebuildVisuals();
    syncVisuals();
    frameScene();
    updateUI();
  }
  function configure(values) { simulation.configure(values); updateUI(); return simulation.snapshot(); }
  function switchCharacter(value, deliberate = false) {
    if (value !== 'mannequin' && !characterAssets.has(value)) return;
    if (deliberate) characterSelection.choose(value);
    releaseDrag();
    touchPolicy.reset();
    reconnectOrbit();
    simulation.setProfile(characterAssets.get(value)?.profile ?? null);
    frameDelta();
    rebuildVisuals();
    syncVisuals();
    frameScene();
    updateUI();
    $('character-status').textContent = value === 'mannequin' ? 'Thirteen visible rigid bodies and their joints.' : 'Rigged skin follows the 13 physics bodies.';
  }
  $('character').addEventListener('change', event => switchCharacter(event.target.value, true));
  for (const type of ['pointerdown', 'keydown']) $('character').addEventListener(type, () => {
    if (simulation.readFrame().profileId === 'mannequin') characterSelection.choose('mannequin');
  });
  $('play-button').addEventListener('click', () => {
    const before = simulation.readFrame();
    simulation.setPaused(!before.paused);
    if (before.scene === 'bowling' && before.paused && before.time === 0) {
      setCameraMode('follow');
    }
    frameDelta(); updateUI();
  });
  $('reset-button').addEventListener('click', () => reset());
  $('scene-bowling').addEventListener('click', () => { cameraMode = 'overview'; reset('bowling'); });
  $('scene-plinko').addEventListener('click', () => { cameraMode = 'overview'; reset('plinko'); });
  $('scene-drop').addEventListener('click', () => reset('drop'));
  $('scene-stairs').addEventListener('click', () => reset('stairs'));
  $('camera-overview').addEventListener('click', () => setCameraMode('overview'));
  $('camera-follow').addEventListener('click', () => setCameraMode('follow'));
  $('speed').addEventListener('change', e => configure({ speed: Number(e.target.value) }));
  for (const [id, key] of [['gravity', 'gravity'], ['impact-boost', 'impactBoost'], ['damping', 'damping'], ['friction', 'friction'], ['slide-grip', 'slideGrip'], ['joint-range', 'jointRange']]) {
    $(id).addEventListener('input', e => configure({ [key]: Number(e.target.value) }));
  }
  function setPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }
  function releaseDrag(event) {
    if (!activeDrag || (event?.pointerId !== undefined && event.pointerId !== activeDrag.pointerId)) return;
    const owner = activeDrag;
    activeDrag = null;
    simulation.endDrag();
    if (renderer.domElement.hasPointerCapture(owner.pointerId)) renderer.domElement.releasePointerCapture(owner.pointerId);
    $('selection-label').hidden = true;
    controls.enabled = true;
    renderer.domElement.style.cursor = 'grab';
  }
  renderer.domElement.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') {
      touchPolicy.down(event.pointerId);
      if (touchPolicy.blocked) releaseDrag();
      if (touchMode === 'camera') return;
      event.stopImmediatePropagation();
      event.preventDefault();
      if (!touchPolicy.canGrab(event.pointerId)) return;
    } else if (event.button !== 0) return;
    if (activeDrag) return;
    setPointer(event);
    if (characterRigs.size) for (const rig of characterRigs.values()) rig.refreshBounds();
    const hit = raycaster.intersectObjects(pickMeshes, false)[0];
    if (!hit) return;
    const instance = simulation.instances.find(item => item.id === hit.object.userData.instanceId);
    const body = characterRigs.size ? hit.object.userData.rig.pickBody(hit, instance.bodyById) : hit.object.userData.body;
    if (!body) return;
    if (event.pointerType !== 'touch') { event.stopImmediatePropagation(); event.preventDefault(); }
    dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), hit.point);
    if (!simulation.beginDrag(body, hit.point.toArray())) return;
    controls.enabled = false;
    simulation.setPaused(false);
    activeDrag = { pointerId: event.pointerId };
    $('selection-label').textContent = `PULLING ${body.instanceId === 'single' ? '' : `${body.instanceId.toUpperCase()} · `}${body.idTag.replaceAll('-', ' ').toUpperCase()}`;
    $('selection-label').hidden = false;
    renderer.domElement.setPointerCapture(event.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
    updateUI();
  }, { capture: true });
  renderer.domElement.addEventListener('pointermove', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    setPointer(event);
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      dragPoint.copy(intersection);
      simulation.moveDrag(dragPoint.toArray());
    }
  });
  function pointerDone(event) {
    if (event.pointerType === 'touch') touchPolicy.up(event.pointerId);
    releaseDrag(event);
  }
  document.addEventListener('pointerup', pointerDone, { capture: true });
  document.addEventListener('pointercancel', pointerDone, { capture: true });
  renderer.domElement.addEventListener('lostpointercapture', releaseDrag);
  window.addEventListener('blur', () => { releaseDrag(); touchPolicy.reset(); reconnectOrbit(); });
  renderer.domElement.style.cursor = 'grab';

  function updateCameraButtons() {
    for (const mode of ['overview', 'follow']) {
      const active = cameraMode === mode;
      $(`camera-${mode}`).classList.toggle('active', active);
      $(`camera-${mode}`).setAttribute('aria-pressed', String(active));
    }
  }
  function setCameraMode(mode) {
    cameraMode = mode;
    frameScene();
    updateCameraButtons();
  }
  controls.addEventListener('start', () => {
    if (['bowling', 'plinko'].includes(simulation.readFrame().scene) && (cameraMode === 'follow' || cameraMode === 'overview')) {
      cameraMode = 'free';
      updateCameraButtons();
    }
  });
  const followTarget = new THREE.Vector3();
  const followDelta = new THREE.Vector3();
  function updateFollow() {
    if (cameraMode !== 'follow' || simulation.readFrame().scene !== 'bowling') return;
    const pelvis = simulation.instances[0]?.bodyById.get('pelvis');
    if (!pelvis) return;
    followTarget.set(pelvis.position.x, pelvis.position.y + .35, pelvis.position.z + 1.1);
    followDelta.subVectors(followTarget, controls.target).multiplyScalar(.075);
    controls.target.add(followDelta);
    camera.position.add(followDelta);
  }

  function frameScene() {
    const frame = simulation.readFrame();
    if (frame.scene === 'plinko') {
      const shortLandscape = narrowScreen.matches && window.innerHeight <= 450 && camera.aspect > 1.6;
      const portrait = camera.aspect < .75;
      const target = new THREE.Vector3(0, shortLandscape ? 8 : portrait ? 8.5 : 9.2, 0);
      controls.maxDistance = 80;
      controls.maxPolarAngle = Math.PI * .75;
      controls.target.copy(target);
      camera.position.copy(target).add(new THREE.Vector3(0, 0, shortLandscape ? 40 : portrait ? 38 : 36));
      camera.lookAt(target);
      controls.update();
      return;
    }
    controls.maxPolarAngle = Math.PI * .48;
    if (frame.scene === 'bowling') {
      if (cameraMode !== 'follow' && camera.aspect < .75) {
        const target = new THREE.Vector3(0, 5, 2);
        controls.maxDistance = 90;
        controls.target.copy(target);
        camera.position.copy(target).add(new THREE.Vector3(8, 42, 48));
        camera.lookAt(target);
        controls.update();
        return;
      }
      if (cameraMode !== 'follow' && narrowScreen.matches && window.innerHeight <= 450 && camera.aspect > 1.6) {
        const target = new THREE.Vector3(0, 4, 5);
        controls.maxDistance = 90;
        controls.target.copy(target);
        camera.position.copy(target).add(new THREE.Vector3(19.5, 28, 48));
        camera.lookAt(target);
        controls.update();
        return;
      }
      const portraitScale = Math.max(1, .82 / Math.max(.3, camera.aspect));
      let target, offset;
      if (cameraMode === 'follow') {
        const pelvis = simulation.instances[0]?.bodyById.get('pelvis');
        target = pelvis ? new THREE.Vector3(pelvis.position.x, pelvis.position.y + .35, pelvis.position.z + 1.1) : new THREE.Vector3(0, 11, -23);
        offset = new THREE.Vector3(5.8, 4.2, 8.5);
      } else {
        target = new THREE.Vector3(0, 3.6, -1);
        offset = new THREE.Vector3(19.5, 25, 44);
      }
      controls.maxDistance = 90;
      controls.target.copy(target);
      camera.position.copy(target).add(offset.multiplyScalar(portraitScale));
      camera.lookAt(target);
      controls.update();
      return;
    }
    controls.maxDistance = 13;
    const stairs = frame.scene === 'stairs';
    const goat = frame.profileId === 'goatman';
    const target = goat ? new THREE.Vector3(stairs ? -.45 : 0, stairs ? 1.8 : 1.5, 0) :
      stairs ? new THREE.Vector3(-.3, 1.7, 0) : new THREE.Vector3(0, 1.55, 0);
    const offset = goat ? stairs ? new THREE.Vector3(6.3, 4.1, 8.8) : new THREE.Vector3(4.7, 3, 7.1) :
      stairs ? new THREE.Vector3(5, 3.1, 7) : new THREE.Vector3(3.7, 1.45, 5.2);
    const portraitScale = Math.max(1, .78 / Math.max(.3, camera.aspect));
    controls.target.copy(target);
    camera.position.copy(target).add(offset.multiplyScalar(portraitScale));
    camera.lookAt(target);
    controls.update();
  }
  function resize() {
    const width = Math.max(1, viewport.clientWidth), height = Math.max(1, viewport.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (['bowling', 'plinko'].includes(simulation.readFrame().scene) && cameraMode === 'overview') {
      scene.fog.far = simulation.readFrame().scene === 'plinko' ? 110 : camera.aspect < .75 ? 150 : 90;
      frameScene();
    }
  }
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  resize();
  frameScene();
  syncVisuals();
  updateUI();
  function physicsTick() { simulation.step(frameDelta()); }
  function cameraTick() {
    updateFollow();
    controls.update();
  }
  function drawFrame() {
    syncVisuals();
    const frame = simulation.readFrame();
    $('sim-time').textContent = frame.time.toFixed(1);
    if (frame.totalTargets) $('pin-count').textContent = `${frame.releasedTargets}/${frame.totalTargets}`;
    renderer.render(scene, camera);
    const fps = fpsCounter.frame(performance.now());
    if (fps !== null) $('fps-badge').textContent = `${fps} FPS`;
  }
  renderer.setAnimationLoop(() => driveRenderFrame(renderGate, performance.now(), physicsTick, cameraTick, drawFrame));
  document.addEventListener('visibilitychange', () => {
    lastFrame = performance.now();
    renderGate.reset();
    fpsCounter.reset(lastFrame);
    if ($('show-fps').checked) $('fps-badge').textContent = '— FPS';
    if (document.hidden) { releaseDrag(); touchPolicy.reset(); reconnectOrbit(); }
  });

  for (const id of ['vitalik', 'goatman']) (async () => {
    try {
      const profileResponse = await fetch(new URL(`./assets/${id}-ragdoll.json`, import.meta.url));
      if (!profileResponse.ok) throw new Error(`Profile HTTP ${profileResponse.status}`);
      const profile = validateProfile(await profileResponse.json());
      if (profile.id !== id) throw new Error('Profile identity does not match the requested character');
      const template = await new GLTFLoader().loadAsync(new URL(profile.asset, import.meta.url).href);
      characterAssets.set(id, { profile, template });
      const option = $('character').querySelector(`option[value="${id}"]`);
      option.disabled = false;
      option.textContent = characterNames[id];
      const suggested = characterSelection.loaded(id);
      if (suggested) switchCharacter(suggested);
      else if (simulation.readFrame().profileId === 'mannequin') $('character-status').textContent = 'Choose a rigged character or the visible-collider mannequin.';
    } catch (cause) {
      console.warn(`${characterNames[id]} asset unavailable:`, cause);
      const option = $('character').querySelector(`option[value="${id}"]`);
      option.textContent = `${characterNames[id]} · unavailable`;
      option.disabled = true;
      const suggested = characterSelection.loadFailed(id);
      if (suggested) switchCharacter(suggested);
      else if (simulation.readFrame().profileId === 'mannequin') $('character-status').textContent = 'A rigged character could not load. The mannequin study is ready.';
    }
  })();

  // Progressive enhancement: expose the same validated controls to supporting browser agents.
  if (document.modelContext?.registerTool) {
    try {
    webToolController = new AbortController();
    webTool = Promise.resolve(document.modelContext.registerTool({
      name: 'configure_ragdoll_study',
      description: 'Configure or reset Ragdoll Lab. Choose plinko, bowling, drop or stairs; adjust gravity, impact boost, damping, grip, joint range and speed.',
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      signal: webToolController.signal,
      inputSchema: { type: 'object', properties: {
        scene: { type: 'string', enum: ['plinko', 'bowling', 'drop', 'stairs'] },
        character: { type: 'string', enum: ['vitalik', 'goatman', 'mannequin'] },
        reset: { type: 'boolean' },
        paused: { type: 'boolean' },
        gravity: { type: 'number', minimum: 0, maximum: 20 },
        impactBoost: { type: 'number', minimum: 0, maximum: 2 },
        damping: { type: 'number', minimum: 0, maximum: .8 },
        friction: { type: 'number', minimum: 0, maximum: 1 },
        slideGrip: { type: 'number', minimum: 0, maximum: .5 },
        jointRange: { type: 'number', minimum: 25, maximum: 125 },
        speed: { type: 'number', enum: [.25, .5, 1] }
      }, additionalProperties: false },
      execute: async input => {
        try {
          if (input == null || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Expected settings object');
          const { scene: nextScene, character, reset: shouldReset, paused, ...values } = input;
          if (nextScene !== undefined && !['plinko', 'bowling', 'drop', 'stairs'].includes(nextScene)) throw new RangeError('Invalid scene');
          if (character !== undefined && !['vitalik', 'goatman', 'mannequin'].includes(character)) throw new RangeError('Invalid character');
          if (character !== undefined && character !== 'mannequin' && !characterAssets.has(character)) throw new Error(`${characterNames[character]} is not loaded`);
          if (shouldReset !== undefined && typeof shouldReset !== 'boolean') throw new TypeError('Invalid reset');
          if (paused !== undefined && typeof paused !== 'boolean') throw new TypeError('Invalid paused');
          simulation.configure(values);
          if (character !== undefined) switchCharacter(character, true);
          if (nextScene !== undefined || shouldReset) reset(nextScene);
          if (paused !== undefined) simulation.setPaused(paused);
          updateUI();
          return { content: [{ type: 'text', text: JSON.stringify(simulation.snapshot()) }] };
        } catch (cause) { return { isError: true, content: [{ type: 'text', text: cause.message }] }; }
      }
    })).catch(cause => { console.warn('Optional WebMCP tool could not register:', cause); return null; });
    } catch (cause) { console.warn('Optional WebMCP tool could not register:', cause); }
  }
} catch (cause) {
  console.error(cause);
  error.hidden = false;
  error.textContent = `The 3D study could not start: ${cause.message}. Try a browser with WebGL enabled.`;
  $('status-text').textContent = 'UNAVAILABLE';
}
window.addEventListener('pagehide', () => {
  webToolController?.abort();
  webTool?.then(tool => tool?.unregister?.());
  resizeObserver?.disconnect();
  renderer?.setAnimationLoop(null);
});
