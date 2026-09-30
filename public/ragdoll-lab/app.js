import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { clone as cloneSkeleton } from './vendor/SkeletonUtils.js';
import { createSimulation, validateProfile } from './physics.js';
import { interpolateBodyQuaternion } from './renderMath.js';
import { createSkinnedRagdoll } from './skinnedRagdoll.js';

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
  simulation = createSimulation();
  simulation.reset('bowling');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1b232b');
  scene.fog = new THREE.Fog('#1b232b', 12, 27);
  const camera = new THREE.PerspectiveCamera(42, 1, .05, 100);
  camera.position.set(3.7, 3, 5.2);
  camera.lookAt(0, 1.55, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
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
  const dynamicMeshes = [];
  const staticMeshes = [];
  const pickMeshes = [];
  let goatTemplate = null;
  const goatRigs = new Map();
  let goatProfile = null;
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
    const primaryMaterial = body.ragdollInstance.role === 'pin' ? accentMaterial : bodyMaterial;
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
    for (const rig of goatRigs.values()) scene.remove(rig.root);
    goatRigs.clear();
    for (const mesh of staticMeshes) { scene.remove(mesh); mesh.geometry.dispose(); }
    staticMeshes.length = 0;
    const goatActive = simulation.readFrame().profileId === 'goatman' && goatTemplate;
    if (goatActive) {
      for (const instance of simulation.instances) {
        const rig = createSkinnedRagdoll({ scene: cloneSkeleton(goatTemplate.scene) }, goatProfile);
        goatRigs.set(instance.id, rig);
        scene.add(rig.root);
        for (const mesh of rig.meshes) { mesh.userData.rig = rig; mesh.userData.instanceId = instance.id; pickMeshes.push(mesh); }
      }
    } else for (const body of simulation.bodies) makeBodyVisual(body);
    for (const body of simulation.staticBodies) {
      const [x, y, z] = body.halfExtentsTag;
      const isFloor = body.idTag === 'floor';
      const material = body.idTag.startsWith('slide-') ? slideMaterial : body.idTag.includes('rail') ? railMaterial : body.idTag === 'deck' ? deckMaterial : isFloor ? floorMaterial : treadMaterial;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(x * 2, y * 2, z * 2), material);
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
      mesh.receiveShadow = true;
      mesh.castShadow = !isFloor;
      scene.add(mesh);
      staticMeshes.push(mesh);
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
    if (simulation.readFrame().profileId === 'goatman' && goatRigs.size) {
      for (const instance of simulation.instances) goatRigs.get(instance.id)?.pose(instance.bodies, alpha);
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
    $('play-label').textContent = snap.paused ? bowling ? (snap.time === 0 ? 'Launch' : 'Resume') : 'Play simulation' : 'Pause simulation';
    $('play-icon').textContent = snap.paused ? '▶' : 'Ⅱ';
    $('live-chip').textContent = snap.paused ? '● PAUSED' : '● LIVE';
    $('live-chip').classList.toggle('playing', !snap.paused);
    $('status-text').textContent = snap.paused ? (snap.time ? 'SIMULATION PAUSED' : bowling ? 'READY TO LAUNCH' : 'READY TO DROP') : 'SIMULATION LIVE';
    $('sim-time').textContent = snap.time.toFixed(1);
    $('scene-title').textContent = bowling ? 'BOWLING COURSE' : snap.scene === 'drop' ? 'FREE DROP' : 'STAIR FALL';
    $('scene-help').textContent = bowling ? 'Launch one ragdoll down the long slide into ten standing ragdolls.' : snap.scene === 'drop' ? 'Watch joints absorb the landing on a flat plane.' : 'A forward lean sends the body down five steps.';
    $('study-title').innerHTML = bowling ? 'Cause a<br><em>pileup.</em>' : 'Make a body<br><em>fall.</em>';
    $('study-intro').textContent = bowling ? 'One launcher, ten ragdoll targets, and a long run downhill.' : 'Thirteen connected rigid bodies. Twelve joints. One very unforgiving floor.';
    for (const name of ['bowling', 'drop', 'stairs']) {
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
    $('pin-count').textContent = `${snap.releasedPins}/10`;
    $('pin-stat').hidden = !bowling;
    $('slide-grip-setting').hidden = !bowling;
    $('impact-boost-setting').hidden = !bowling;
    $('camera-control').hidden = !bowling;
    $('reset-button').title = bowling ? 'Rerack simulation' : 'Reset simulation';
    $('reset-button').setAttribute('aria-label', $('reset-button').title);
    grid.visible = ring.visible = !bowling;
    scene.fog.near = bowling ? 34 : 12;
    scene.fog.far = bowling ? 90 : 27;
    updateCameraButtons();
  }
  function reset(nextScene) {
    releaseDrag();
    simulation.reset(nextScene);
    frameDelta();
    rebuildVisuals();
    syncVisuals();
    frameScene();
    updateUI();
  }
  function configure(values) { simulation.configure(values); updateUI(); return simulation.snapshot(); }
  function switchCharacter(value) {
    if (value !== 'mannequin' && value !== 'goatman') return;
    if (value === 'goatman' && !goatTemplate) return;
    releaseDrag();
    simulation.setProfile(value === 'goatman' ? goatProfile : null);
    frameDelta();
    rebuildVisuals();
    syncVisuals();
    frameScene();
    updateUI();
    $('character-status').textContent = value === 'goatman' ? 'Rigged skin follows the 13 physics bodies.' : 'Thirteen visible rigid bodies and their joints.';
  }
  $('character').addEventListener('change', event => switchCharacter(event.target.value));
  $('play-button').addEventListener('click', () => {
    const before = simulation.readFrame();
    simulation.setPaused(!before.paused);
    if (before.scene === 'bowling' && before.paused && before.time === 0) {
      setCameraMode('follow');
      if (window.innerWidth <= 850) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelector('.viewport-wrap').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }
    frameDelta(); updateUI();
  });
  $('reset-button').addEventListener('click', () => reset());
  $('scene-bowling').addEventListener('click', () => { cameraMode = 'overview'; reset('bowling'); });
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
  function releaseDrag() {
    if (!activeDrag) return;
    simulation.endDrag();
    if (renderer.domElement.hasPointerCapture(activeDrag.pointerId)) renderer.domElement.releasePointerCapture(activeDrag.pointerId);
    activeDrag = null;
    $('selection-label').hidden = true;
    controls.enabled = true;
    renderer.domElement.style.cursor = 'grab';
  }
  renderer.domElement.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    setPointer(event);
    if (simulation.readFrame().profileId === 'goatman') for (const rig of goatRigs.values()) rig.refreshBounds();
    const hit = raycaster.intersectObjects(pickMeshes, false)[0];
    if (!hit) return;
    const instance = simulation.instances.find(item => item.id === hit.object.userData.instanceId);
    const body = simulation.readFrame().profileId === 'goatman' ? hit.object.userData.rig.pickBody(hit, instance.bodyById) : hit.object.userData.body;
    if (!body) return;
    event.stopImmediatePropagation();
    event.preventDefault();
    controls.enabled = false;
    dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), hit.point);
    if (!simulation.beginDrag(body, hit.point.toArray())) return;
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
  renderer.domElement.addEventListener('pointerup', releaseDrag);
  renderer.domElement.addEventListener('pointercancel', releaseDrag);
  window.addEventListener('blur', releaseDrag);
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
    if (simulation.readFrame().scene === 'bowling' && cameraMode === 'follow') {
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
    if (frame.scene === 'bowling') {
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
    const goat = frame.profileId === 'goatman' && goatProfile;
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
    frameScene();
  }
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  resize();
  syncVisuals();
  updateUI();
  renderer.setAnimationLoop(() => {
    const delta = frameDelta();
    simulation.step(delta);
    syncVisuals();
    updateFollow();
    controls.update();
    const frame = simulation.readFrame();
    $('sim-time').textContent = frame.time.toFixed(1);
    if (frame.scene === 'bowling') $('pin-count').textContent = `${frame.releasedPins}/10`;
    renderer.render(scene, camera);
  });
  document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); });

  (async () => {
    try {
      const profileResponse = await fetch(new URL('./assets/goatman-ragdoll.json', import.meta.url));
      if (!profileResponse.ok) throw new Error(`Profile HTTP ${profileResponse.status}`);
      const profile = validateProfile(await profileResponse.json());
      const gltf = await new GLTFLoader().loadAsync(new URL(profile.asset, import.meta.url).href);
      goatProfile = profile;
      goatTemplate = gltf;
      $('character').disabled = false;
      $('character').options[0].textContent = 'Goatman';
      $('character-status').textContent = 'Rigged skin follows the 13 physics bodies.';
      switchCharacter('goatman');
    } catch (cause) {
      console.warn('Goatman asset unavailable:', cause);
      $('character').disabled = true;
      $('character').value = 'mannequin';
      $('character-status').textContent = 'Goatman could not load. The mannequin study is ready.';
    }
  })();

  // Progressive enhancement: expose the same validated controls to supporting browser agents.
  if (document.modelContext?.registerTool) {
    try {
    webToolController = new AbortController();
    webTool = Promise.resolve(document.modelContext.registerTool({
      name: 'configure_ragdoll_study',
      description: 'Configure or reset Ragdoll Lab. Choose bowling, drop or stairs; adjust gravity, impact boost, damping, grip, joint range and speed.',
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      signal: webToolController.signal,
      inputSchema: { type: 'object', properties: {
        scene: { type: 'string', enum: ['bowling', 'drop', 'stairs'] },
        character: { type: 'string', enum: ['goatman', 'mannequin'] },
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
          if (nextScene !== undefined && !['bowling', 'drop', 'stairs'].includes(nextScene)) throw new RangeError('Invalid scene');
          if (character !== undefined && !['goatman', 'mannequin'].includes(character)) throw new RangeError('Invalid character');
          if (character === 'goatman' && !goatTemplate) throw new Error('Goatman is not loaded');
          if (shouldReset !== undefined && typeof shouldReset !== 'boolean') throw new TypeError('Invalid reset');
          if (paused !== undefined && typeof paused !== 'boolean') throw new TypeError('Invalid paused');
          simulation.configure(values);
          if (character !== undefined) switchCharacter(character);
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
