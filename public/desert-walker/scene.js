(function () {
  "use strict";

  const canvas = document.querySelector("#scene");
  const loadingScreen = document.querySelector("#loading");
  const loadingProgress = document.querySelector("#loading-progress");
  const errorMessage = document.querySelector("#scene-error");
  const motionToggle = document.querySelector("#motion-toggle");
  const resetButton = document.querySelector("#reset-view");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xc9a36d, 0.0068);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.03;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 500);
  const homePosition = new THREE.Vector3(24, 12.5, 29);
  const homeTarget = new THREE.Vector3(0, 4.1, 0);
  camera.position.copy(homePosition);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.copy(homeTarget);
  controls.enableDamping = true;
  controls.dampingFactor = 0.045;
  controls.enablePan = false;
  controls.minDistance = 17;
  controls.maxDistance = 58;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.48;
  // Idle camera motion is time-based and yields immediately to manual controls.
  controls.autoRotate = false;
  controls.update();

  const skyLight = new THREE.HemisphereLight(0xb9e2df, 0x6b3821, 1.85);
  scene.add(skyLight);
  const sun = new THREE.DirectionalLight(0xffd69b, 3.1);
  sun.position.set(-28, 42, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 28;
  sun.shadow.camera.bottom = -15;
  sun.shadow.bias = -0.00025;
  scene.add(sun);

  function terrainHeight(x, z) {
    const broad = Math.sin(x * 0.035 + 0.8) * 1.3 + Math.cos(z * 0.044) * 1.05;
    const crossed = Math.sin((x + z) * 0.082) * 0.32 + Math.cos((x - z) * 0.061) * 0.24;
    const clearing = Math.exp(-(x * x + z * z) / 680) * 1.7;
    return broad + crossed - clearing - 1.3;
  }

  let terrainSurface;

  function makeTerrain() {
    const geometry = new THREE.PlaneGeometry(320, 320, 110, 110);
    const positions = geometry.attributes.position;
    const colors = [];
    const low = new THREE.Color(0x9e5936);
    const high = new THREE.Color(0xd9a45d);

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const height = terrainHeight(x, -y);
      positions.setZ(i, height);
      const tint = THREE.MathUtils.clamp((height + 3) / 6, 0, 1);
      const color = low.clone().lerp(high, tint);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
    terrainSurface = terrain;
    terrain.updateMatrixWorld(true);
  }

  function makeMesa(x, z, radius, height, seed) {
    const mesa = new THREE.Group();
    const shades = [0x8d492f, 0xa85d38, 0xbb7044, 0xcf8650];
    const tiers = 4;

    for (let i = 0; i < tiers; i += 1) {
      const tierRadius = radius * (1 - i * 0.13) * (0.9 + Math.sin(seed + i) * 0.08);
      const tierHeight = height * (0.34 - i * 0.035);
      const geometry = new THREE.CylinderGeometry(
        tierRadius * (0.82 + i * 0.02),
        tierRadius,
        tierHeight,
        7,
        1
      );
      const material = new THREE.MeshStandardMaterial({
        color: shades[(seed + i) % shades.length],
        roughness: 1,
        flatShading: true,
      });
      const tier = new THREE.Mesh(geometry, material);
      tier.position.y = i * height * 0.2 + tierHeight * 0.5;
      tier.rotation.y = seed * 0.7 + i * 0.24;
      tier.castShadow = true;
      tier.receiveShadow = true;
      mesa.add(tier);
    }

    mesa.position.set(x, terrainHeight(x, z), z);
    scene.add(mesa);
  }

  function makeRock(x, z, scale, seed) {
    const geometry = new THREE.DodecahedronGeometry(scale, 0);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
      const factor = 0.82 + ((i * 17 + seed * 13) % 11) / 35;
      position.setXYZ(i, position.getX(i) * factor, position.getY(i), position.getZ(i) * factor);
    }
    geometry.computeVertexNormals();
    const rock = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: seed % 2 ? 0x8c4b32 : 0xa65e3a, roughness: 1, flatShading: true })
    );
    rock.position.set(x, terrainHeight(x, z) + scale * 0.45, z);
    rock.rotation.set(seed * 0.31, seed * 0.8, seed * 0.17);
    rock.scale.y = 0.65;
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
  }

  function makeDust() {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i < 900; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 115;
      points.push(
        Math.cos(angle) * distance,
        Math.random() * 5.5 + terrainHeight(Math.cos(angle) * distance, Math.sin(angle) * distance),
        Math.sin(angle) * distance
      );
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffd295,
      size: 0.09,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    });
    const dust = new THREE.Points(geometry, material);
    dust.name = "windblown-dust";
    scene.add(dust);
    return dust;
  }

  function makeMoonTexture(size, warm) {
    const moonCanvas = document.createElement("canvas");
    moonCanvas.width = 256;
    moonCanvas.height = 256;
    const context = moonCanvas.getContext("2d");
    const gradient = context.createRadialGradient(104, 84, 14, 128, 128, 116);
    gradient.addColorStop(0, warm ? "#fff0bd" : "#d8ede0");
    gradient.addColorStop(0.72, warm ? "#dcc18f" : "#a9cbc4");
    gradient.addColorStop(1, "rgba(116, 137, 122, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(128, 128, 116, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.16;
    context.fillStyle = "#667b70";
    [[84, 78, 19], [164, 116, 28], [104, 168, 15], [174, 66, 10], [67, 139, 12]].forEach(function (crater) {
      context.beginPath();
      context.arc(crater[0], crater[1], crater[2], 0, Math.PI * 2);
      context.fill();
    });
    const texture = new THREE.CanvasTexture(moonCanvas);
    texture.encoding = THREE.sRGBEncoding;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false });
    const moon = new THREE.Sprite(material);
    moon.scale.set(size, size, 1);
    return moon;
  }

  function cylinderBetween(start, end, radius, material) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.74, radius, direction.length(), 6),
      material
    );
    branch.position.copy(start).add(end).multiplyScalar(0.5);
    branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    branch.castShadow = true;
    return branch;
  }

  function makeDeadTree(x, z, scale) {
    const tree = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x50372c, roughness: 1, flatShading: true });
    const segments = [
      [[0, 0, 0], [0.2, 4.8, 0], 0.32],
      [[0.2, 3.4, 0], [-1.9, 6.1, 0.2], 0.2],
      [[-1.9, 6.1, 0.2], [-2.65, 7.1, -0.15], 0.11],
      [[0.1, 4.2, 0], [2.1, 6.35, -0.25], 0.18],
      [[2.1, 6.35, -0.25], [3.25, 6.8, -0.55], 0.1],
      [[1.25, 5.45, -0.12], [1.5, 7.2, 0.25], 0.09],
      [[-0.9, 4.85, 0.1], [-0.65, 6.65, 0.55], 0.08],
    ];
    segments.forEach(function (segment) {
      tree.add(cylinderBetween(
        new THREE.Vector3().fromArray(segment[0]),
        new THREE.Vector3().fromArray(segment[1]),
        segment[2],
        wood
      ));
    });
    tree.position.set(x, terrainHeight(x, z), z);
    tree.scale.setScalar(scale);
    tree.rotation.y = -0.7;
    scene.add(tree);
  }

  function makeOutpost(x, z) {
    const outpost = new THREE.Group();
    const rust = new THREE.MeshStandardMaterial({ color: 0x9b512f, roughness: 0.94, metalness: 0.14, flatShading: true });
    const dark = new THREE.MeshStandardMaterial({ color: 0x393d39, roughness: 0.9, metalness: 0.24 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x446e75, roughness: 1, side: THREE.DoubleSide });

    const generator = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 1.65), rust);
    generator.position.y = 0.9;
    generator.castShadow = true;
    outpost.add(generator);

    [-1, 1].forEach(function (side) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.28, 12), dark);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * 1.05, 0.48, 0.93);
      wheel.castShadow = true;
      outpost.add(wheel);
    });

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 7.2, 8), dark);
    mast.position.set(-0.7, 4.2, 0);
    mast.castShadow = true;
    outpost.add(mast);

    const flagGeometry = new THREE.PlaneGeometry(2.4, 1.15, 12, 3);
    flagGeometry.translate(1.2, 0, 0);
    const flag = new THREE.Mesh(flagGeometry, cloth);
    flag.position.set(-0.68, 6.6, 0);
    flag.rotation.y = 0.2;
    flag.castShadow = true;
    flag.userData.basePositions = flagGeometry.attributes.position.array.slice();
    outpost.add(flag);

    for (let i = 0; i < 3; i += 1) {
      const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 1.2, 10), i === 1 ? dark : rust);
      canister.position.set(2 + i * 0.58, 0.62, 0.15 + (i % 2) * 0.28);
      canister.castShadow = true;
      outpost.add(canister);
    }

    outpost.position.set(x, terrainHeight(x, z), z);
    outpost.rotation.y = -0.35;
    scene.add(outpost);
    return flag;
  }

  function makeBirds() {
    const flock = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: 0x324d4c, transparent: true, opacity: 0.72 });
    for (let i = 0; i < 7; i += 1) {
      const span = 0.55 + (i % 3) * 0.18;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-span, 0, 0), new THREE.Vector3(0, -0.2, 0),
        new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(span, 0, 0),
      ]);
      const bird = new THREE.LineSegments(geometry, material);
      bird.position.set(i * 2.6, Math.sin(i * 1.7) * 1.4, Math.cos(i) * 2.2);
      bird.rotation.y = -0.25;
      flock.add(bird);
    }
    flock.position.set(-46, 29, -54);
    scene.add(flock);
    return flock;
  }

  function makeSmokeTexture() {
    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.width = 128;
    smokeCanvas.height = 128;
    const context = smokeCanvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 6, 64, 64, 60);
    gradient.addColorStop(0, "rgba(226, 213, 179, .72)");
    gradient.addColorStop(0.45, "rgba(127, 120, 104, .31)");
    gradient.addColorStop(1, "rgba(90, 89, 83, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(smokeCanvas);
  }

  function makeSmoke() {
    const texture = makeSmokeTexture();
    const puffs = [];
    for (let i = 0; i < 10; i += 1) {
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4, depthWrite: false });
      const puff = new THREE.Sprite(material);
      puff.userData.phase = i / 10;
      puff.position.set(5.6, 7.7, -1.6);
      scene.add(puff);
      puffs.push(puff);
    }
    return puffs;
  }

  makeTerrain();
  [
    [-61, -57, 9, 24, 1],
    [-42, -78, 4, 17, 2],
    [29, -91, 7, 25, 3],
    [57, -66, 11, 18, 4],
    [80, -43, 5, 15, 5],
    [-89, -31, 8, 14, 6],
  ].forEach((args) => makeMesa.apply(null, args));

  [
    [-18, 16, 2.4, 1], [-23, 17, 1.3, 2], [19, 15, 2.2, 3], [24, 14, 1.1, 4],
    [-34, 4, 1.7, 5], [35, -1, 1.5, 6], [12, -18, 1.25, 7], [-8, -23, 1.8, 8],
  ].forEach((args) => makeRock.apply(null, args));

  const dust = makeDust();
  const largeMoon = makeMoonTexture(27, false);
  largeMoon.position.set(-58, 42, -102);
  scene.add(largeMoon);
  const smallMoon = makeMoonTexture(10, true);
  smallMoon.position.set(-35, 52, -108);
  smallMoon.material.opacity = 0.55;
  scene.add(smallMoon);
  makeDeadTree(-25, 10, 1.05);
  const flag = makeOutpost(17, 9);
  const birds = makeBirds();
  const smoke = makeSmoke();
  let vessel;
  let mixer;
  let engineFlame;
  let flameTime = 0;
  let vesselRadius = 0;
  const smokeOrigin = new THREE.Vector3(5.6, 7.7, -1.6);
  let motionEnabled = !reducedMotion;
  const idleOrbit = {
    interacting: false,
    resumeAt: 0,
    rebase: true,
    time: 0,
    radius: 0,
    phi: 0,
    spherical: new THREE.Spherical(),
    offset: new THREE.Vector3(),
  };

  function pauseIdleOrbit(delay) {
    idleOrbit.resumeAt = performance.now() + delay;
    idleOrbit.rebase = true;
  }
  controls.addEventListener("start", function () {
    idleOrbit.interacting = true;
    pauseIdleOrbit(4000);
  });
  controls.addEventListener("end", function () {
    idleOrbit.interacting = false;
    pauseIdleOrbit(4000);
  });

  function updateIdleCamera(delta) {
    if (!vessel || !motionEnabled || idleOrbit.interacting || performance.now() < idleOrbit.resumeAt) return;
    const orbit = idleOrbit.spherical.setFromVector3(idleOrbit.offset.copy(camera.position).sub(controls.target));
    if (idleOrbit.rebase) {
      idleOrbit.radius = orbit.radius;
      idleOrbit.phi = orbit.phi;
      idleOrbit.time = 0;
      idleOrbit.rebase = false;
    }
    // Ease into a sweeping orbit, linger near bow/stern, and gently crane/dolly.
    // Cap frame time so returning to a backgrounded tab never jumps the camera.
    const step = Math.min(delta, 0.05);
    idleOrbit.time += step;
    const ease = THREE.MathUtils.smoothstep(idleOrbit.time, 0, 3);
    const bowAngle = vessel.rotation.y - Math.PI / 2;
    const pace = 0.052 * (1 - 0.32 * Math.cos(2 * (orbit.theta - bowAngle)));
    orbit.theta -= step * pace * ease;
    const phi = THREE.MathUtils.clamp(
      idleOrbit.phi + Math.sin(idleOrbit.time * 0.16) * 0.085,
      controls.minPolarAngle + 0.025,
      controls.maxPolarAngle - 0.025
    );
    const radius = Math.min(controls.maxDistance, idleOrbit.radius * (1 + 0.055 * (1 - Math.cos(idleOrbit.time * 0.13))));
    const blend = 1 - Math.exp(-step * ease * 0.7);
    orbit.phi = THREE.MathUtils.lerp(orbit.phi, phi, blend);
    orbit.radius = THREE.MathUtils.lerp(orbit.radius, radius, blend);
    camera.position.copy(controls.target).add(idleOrbit.offset.setFromSpherical(orbit));
  }

  function makeEngineFlame(model) {
    const flame = new THREE.Group();
    flame.name = "Rear_Engine_Blue_Flame";
    // GLB coordinates are meters, Y-up. The aft nozzle points along local +X.
    flame.position.set(4.62, 3.5, 0);
    const time = { value: 0 };
    const vertexShader = `
      uniform float time;
      varying vec2 flameUV;
      varying vec3 flameNormal;
      varying vec3 flameView;
      void main() {
        flameUV = uv;
        vec3 p = position;
        float taper = sin(uv.y * 3.14159265);
        float ripple = sin(uv.y * 19.0 - time * 8.0 + uv.x * 6.2831853);
        p.y += taper * ripple * 0.026;
        p.z += taper * sin(uv.y * 15.0 - time * 6.0) * 0.022;
        vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
        flameNormal = normalize(normalMatrix * normal);
        flameView = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `;
    const fragmentShader = `
      uniform float time;
      uniform float strength;
      uniform vec3 baseColor;
      uniform vec3 tipColor;
      varying vec2 flameUV;
      varying vec3 flameNormal;
      varying vec3 flameView;
      void main() {
        float axial = flameUV.y;
        float stream = sin(axial * 31.0 - time * 11.0 + sin(flameUV.x * 6.2831853) * 2.4);
        float fine = sin(axial * 67.0 - time * 17.0 + cos(flameUV.x * 18.849556) * 1.3);
        float wisps = 0.76 + stream * 0.16 + fine * 0.08;
        float fade = pow(1.0 - axial, 0.7) * smoothstep(0.0, 0.075, axial);
        vec3 color = mix(baseColor, tipColor, smoothstep(0.08, 0.85, axial));
        float softEdge = pow(abs(dot(normalize(flameNormal), normalize(flameView))), 0.65);
        gl_FragColor = vec4(color, min(0.92, fade * wisps * strength * softEdge));
        #include <tonemapping_fragment>
        #include <encodings_fragment>
      }
    `;
    function plume(name, radius, length, strength, base, tip) {
      const geometry = new THREE.ConeGeometry(radius, length, 24, 12, true);
      geometry.translate(0, length / 2, 0);
      geometry.rotateZ(-Math.PI / 2);
      const material = new THREE.ShaderMaterial({
        uniforms: { time, strength: { value: strength }, baseColor: { value: new THREE.Color(base) }, tipColor: { value: new THREE.Color(tip) } },
        vertexShader, fragmentShader,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true,
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.renderOrder = 2;
      flame.add(mesh);
      return mesh;
    }
    const outer = plume("Exhaust_Blue_Outer_Plume", 0.34, 1.65, 1.8, 0x004aff, 0x081dcc);
    const core = plume("Exhaust_Cyan_White_Core", 0.18, 1.02, 1.15, 0x9aefff, 0x0875ff);
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const context = glowCanvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(190, 247, 255, 0.95)");
    gradient.addColorStop(0.25, "rgba(63, 186, 255, 0.7)");
    gradient.addColorStop(0.6, "rgba(15, 78, 255, 0.22)");
    gradient.addColorStop(1, "rgba(15, 78, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    glowTexture.encoding = THREE.sRGBEncoding;
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, depthTest: true, opacity: 0.8,
    }));
    glow.name = "Exhaust_Nozzle_Glow";
    glow.position.x = 0.09;
    glow.scale.set(0.82, 0.82, 1);
    flame.add(glow);
    const light = new THREE.PointLight(0x248bff, 1.2, 4, 2);
    light.name = "Exhaust_Blue_Spill";
    light.position.x = 0.35;
    flame.add(light);
    model.add(flame);
    return { flame, time, outer, core, glow, light };
  }

  function updateEngineFlame(delta) {
    if (!engineFlame) return;
    if (motionEnabled) flameTime += Math.min(delta, 0.05);
    engineFlame.time.value = flameTime;
    const pulse = Math.sin(flameTime * 6.3) * 0.045 + Math.sin(flameTime * 10.7) * 0.025;
    engineFlame.outer.scale.x = 1 + pulse;
    engineFlame.core.scale.x = 1 + pulse * 0.7;
    engineFlame.glow.material.opacity = 0.8 + pulse;
    engineFlame.light.intensity = 1.2 + pulse * 2;
  }

  const manager = new THREE.LoadingManager();
  manager.onProgress = function (_url, loaded, total) {
    loadingProgress.style.width = `${Math.round((loaded / total) * 100)}%`;
  };
  manager.onLoad = function () {
    loadingProgress.style.width = "100%";
    window.setTimeout(() => loadingScreen.classList.add("is-complete"), 250);
  };
  manager.onError = function () {
    errorMessage.hidden = false;
    loadingScreen.classList.add("is-complete");
  };

  let cockpitMode = false;
  const cockpitLook = { yaw: 0, pitch: -0.216, pointer: null, x: 0, y: 0 };
  function endCockpitLook() {
    const pointer = cockpitLook.pointer;
    cockpitLook.pointer = null;
    if (pointer !== null && canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
    canvas.classList.remove("looking");
  }
  canvas.addEventListener("pointerdown", function (event) {
    if (!cockpitMode || cockpitLook.pointer !== null || event.button !== 0) return;
    event.preventDefault();
    cockpitLook.pointer = event.pointerId;
    cockpitLook.x = event.clientX; cockpitLook.y = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("looking");
  });
  canvas.addEventListener("pointermove", function (event) {
    if (!cockpitMode || cockpitLook.pointer !== event.pointerId) return;
    const sensitivity = Math.PI / Math.max(320, Math.min(innerWidth, innerHeight));
    cockpitLook.yaw -= (event.clientX-cockpitLook.x)*sensitivity;
    cockpitLook.pitch = THREE.MathUtils.clamp(cockpitLook.pitch + (event.clientY-cockpitLook.y)*sensitivity, -1.22, 1.22);
    cockpitLook.x = event.clientX; cockpitLook.y = event.clientY;
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (type) {
    canvas.addEventListener(type, function (event) {
      if (cockpitLook.pointer === event.pointerId) endCockpitLook();
    });
  });
  window.addEventListener("blur", endCockpitLook);
  document.addEventListener("visibilitychange", endCockpitLook);
  let manualDrive = false;
  const driveKeys = new Set();
  const cameraToggle = document.querySelector("#camera-toggle");
  const driveStatus = document.querySelector("#drive-status");
  const keyDirections = {KeyW:"forward",ArrowUp:"forward",KeyS:"back",ArrowDown:"back",KeyA:"left",ArrowLeft:"left",KeyD:"right",ArrowRight:"right"};
  function takeControl() {
    manualDrive = true; walkEnabled = false; updateWalkButton();
    driveStatus.textContent = "Manual · Hold arrows or WASD to steer";
  }
  window.addEventListener("keydown", function (event) {
    if (!keyDirections[event.code] || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    event.preventDefault(); takeControl(); driveKeys.add(keyDirections[event.code]);
  });
  window.addEventListener("keyup", function (event) {
    if (keyDirections[event.code]) { event.preventDefault(); driveKeys.delete(keyDirections[event.code]); }
  });
  function releaseDrive() { driveKeys.clear(); }
  window.addEventListener("blur", releaseDrive);
  document.addEventListener("visibilitychange", releaseDrive);
  document.querySelectorAll("[data-drive]").forEach(function (button) {
    button.addEventListener("pointerdown", function (event) {
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      takeControl(); driveKeys.add(button.dataset.drive);
    });
    ["pointerup","pointercancel","lostpointercapture"].forEach(function (type) {
      button.addEventListener(type,function () { driveKeys.delete(button.dataset.drive); });
    });
  });
  function setCockpit(enabled) {
    endCockpitLook();
    cockpitMode = enabled;
    if (enabled) { cockpitLook.yaw = 0; cockpitLook.pitch = -0.216; }
    resetButton.innerHTML = enabled ? "Center view" : '<span class="button-icon" aria-hidden="true">↺</span> Reset view';
    controls.enabled = !enabled;
    camera.fov = enabled ? 74 : 39;
    camera.near = enabled ? 0.025 : 0.1;
    cameraToggle.textContent = enabled ? "Exterior view" : "Cockpit view";
    cameraToggle.setAttribute("aria-pressed",String(enabled));
    document.body.classList.toggle("cockpit-view",enabled);
    document.querySelector(".controls p").textContent = enabled ? "Drag to look · Arrows to steer" : "Drag to orbit · Scroll to zoom";
    if (!enabled) { camera.position.copy(homePosition); controls.target.copy(homeTarget); }
    resize(); pauseIdleOrbit(1500);
  }
  cameraToggle.addEventListener("click", function () { if (vessel) setCockpit(!cockpitMode); });
  function updateCockpitCamera() {
    if (!vessel) return;
    camera.position.copy(vessel.localToWorld(new THREE.Vector3(-2.98,4.0,0.38)));
    const direction = new THREE.Vector3(
      -Math.cos(cockpitLook.pitch)*Math.cos(cockpitLook.yaw),
      Math.sin(cockpitLook.pitch),
      Math.cos(cockpitLook.pitch)*Math.sin(cockpitLook.yaw)
    );
    camera.lookAt(vessel.localToWorld(new THREE.Vector3(-2.98,4.0,0.38).add(direction)));
  }
  let walking;
  let walkEnabled = !reducedMotion;
  const walkToggle = document.querySelector("#walk-toggle");
  const groundRay = new THREE.Raycaster();
  function footHeight(point) {
    groundRay.set(new THREE.Vector3(point.x, 50, point.z), new THREE.Vector3(0, -1, 0));
    const hit = groundRay.intersectObject(terrainSurface)[0];
    return (hit ? hit.point.y : terrainHeight(point.x, point.z)) + 0.035;
  }

  function prepareWalking(model) {
    const legs = [];
    model.traverse(function (root) {
      if (!root.userData.articulated) return;
      const hip = new THREE.Vector3().fromArray(root.userData.restHip);
      const knee = new THREE.Vector3().fromArray(root.userData.restKnee);
      const ankle = new THREE.Vector3().fromArray(root.userData.restAnkle);
      const neutral = ankle.clone(); neutral.y = 0;
      const planted = model.localToWorld(neutral.clone()); planted.y = footHeight(planted);
      legs.push({root, hip, knee, ankle, neutral, planted,
        upper: model.getObjectByName(root.name + "_Upper"),
        lower: model.getObjectByName(root.name + "_Lower"),
        foot: model.getObjectByName(root.name + "_Foot"),
        contact: model.getObjectByName(root.name + "_FootContact"),
        upperDirection: knee.clone().sub(hip), lowerDirection: ankle.clone().sub(knee)});
    });
    if (legs.length !== 4) throw new Error("Walking requires four articulated legs");
    const order = ["Leg_Front_Port", "Leg_Rear_Starboard", "Leg_Front_Starboard", "Leg_Rear_Port"];
    legs.sort((a, b) => order.indexOf(a.root.name) - order.indexOf(b.root.name));
    model.position.y -= model.scale.x * 0.23;
    walking = {legs, time: 0, step: -1, origin: model.position.clone(), yaw: model.rotation.y};
    solveWalkingPose();
  }

  function solveWalkingPose() {
    vessel.updateMatrixWorld(true);
    // Lower the chassis on uneven ground before a supporting leg reaches full extension.
    let supportedHeight = vessel.position.y;
    walking.legs.forEach(function (leg) {
      const hipWorld = vessel.localToWorld(leg.hip.clone());
      const reach = (leg.upperDirection.length() + leg.lowerDirection.length()) * vessel.scale.x * 0.98;
      const horizontal = Math.hypot(hipWorld.x-leg.planted.x, hipWorld.z-leg.planted.z);
      const vertical = Math.sqrt(Math.max(0, reach*reach-horizontal*horizontal));
      supportedHeight = Math.min(supportedHeight, leg.planted.y + leg.ankle.y*vessel.scale.x
        + vertical - leg.hip.y*vessel.scale.x);
    });
    vessel.position.y = supportedHeight;
    vessel.updateMatrixWorld(true);
    walking.legs.forEach(function (leg) {
      const ankle = vessel.worldToLocal(leg.planted.clone()); ankle.y += leg.ankle.y;
      const direction = ankle.clone().sub(leg.hip);
      const l1 = leg.upperDirection.length(), l2 = leg.lowerDirection.length();
      const distance = THREE.MathUtils.clamp(direction.length(), Math.abs(l1-l2)+0.001, l1+l2-0.001);
      direction.normalize();
      // Bend toward the original knee, preserving the mechanical elbow direction.
      const restAxis = leg.ankle.clone().sub(leg.hip).normalize();
      const pole = leg.upperDirection.clone().addScaledVector(restAxis, -leg.upperDirection.dot(restAxis));
      pole.addScaledVector(direction, -pole.dot(direction)).normalize();
      const along = (l1*l1 - l2*l2 + distance*distance)/(2*distance);
      const knee = leg.hip.clone().addScaledVector(direction, along)
        .addScaledVector(pole, Math.sqrt(Math.max(0, l1*l1-along*along)));
      leg.upper.position.copy(leg.hip);
      leg.upper.quaternion.setFromUnitVectors(leg.upperDirection.clone().normalize(), knee.clone().sub(leg.hip).normalize());
      leg.lower.position.copy(knee);
      leg.lower.quaternion.setFromUnitVectors(leg.lowerDirection.clone().normalize(), ankle.clone().sub(knee).normalize());
      leg.foot.position.copy(ankle);
      if (leg.contact) leg.contact.position.copy(vessel.worldToLocal(leg.planted.clone()));
    });
    vessel.updateMatrixWorld(true);
  }

  function updateWalking(delta) {
    if (!walking) return;
    const throttle = (driveKeys.has("forward") ? 1 : 0) - (driveKeys.has("back") ? 1 : 0);
    const steering = (driveKeys.has("left") ? 1 : 0) - (driveKeys.has("right") ? 1 : 0);
    const driving = manualDrive && (throttle !== 0 || steering !== 0);
    // Finish the lifted foot's step after releasing steering, then stand still.
    if (!walkEnabled && !driving && (walking.step < 0 || walking.time/1.2-walking.step >= 0.85)) return;
    const dt = Math.min(delta, 0.05);
    walking.time += dt;
    const previous = vessel.position.clone();
    const speed = manualDrive ? throttle*0.35 : 0.35;
    vessel.rotation.y += (manualDrive ? steering*0.045 : 0.025)*dt;
    const forward = new THREE.Vector3(-1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),vessel.rotation.y);
    const next = vessel.position.clone().addScaledVector(forward,speed*dt);
    // Keep manual exploration inside the terrain and lit clearing.
    if (Math.hypot(next.x,next.z) < 32) { vessel.position.x=next.x; vessel.position.z=next.z; }
    vessel.position.y = walking.origin.y + terrainHeight(vessel.position.x,vessel.position.z)
      - terrainHeight(walking.origin.x,walking.origin.z) + Math.sin(walking.time*Math.PI*2/4.8)*0.035;
    vessel.updateMatrixWorld(true);
    const step = Math.floor(walking.time/1.2);
    const phase = (walking.time/1.2)%1;
    const leg = walking.legs[step%4];
    if (step !== walking.step) {
      walking.step = step;
      leg.start = leg.planted.clone();
      const landing = leg.neutral.clone(); landing.x -= (manualDrive ? throttle : 1)*0.28;
      leg.end = vessel.localToWorld(landing);
      leg.end.y = footHeight(leg.end);
    }
    const t = Math.min(phase/0.85, 1);
    const eased = t*t*(3-2*t);
    leg.planted.lerpVectors(leg.start,leg.end,eased);
    leg.planted.y += Math.pow(Math.sin(Math.PI*t),2)*0.58;
    solveWalkingPose();
    const follow = vessel.position.clone().sub(previous);
    camera.position.add(follow); controls.target.add(follow);
    homeTarget.add(follow); homePosition.add(follow);
    smokeOrigin.copy(vessel.localToWorld(new THREE.Vector3(2.5,4.7,0)));
  }
  function updateWalkButton() {
    walkToggle.setAttribute("aria-pressed",String(walkEnabled));
    walkToggle.textContent = walkEnabled ? "Pause walk" : "Auto walk";
  }
  walkToggle.addEventListener("click",function () { walkEnabled = !walkEnabled; manualDrive = false; releaseDrive(); driveStatus.textContent = "Hold arrows or WASD to take control"; updateWalkButton(); });
  updateWalkButton();

  function prepareVesselMaterials(model) {
    const prepared = new Set();
    model.traverse(function (object) {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(function (material) {
        if (!material) return;
        const isGlass = material.name === "Cockpit_Glass_SmokeBlue";
        const isMark = material.name === "RaidGuild_Canonical_Oxide_Decal";
        const isEmissive = material.emissive && material.emissive.getHex() !== 0;
        if (isGlass) {
          object.castShadow = false;
          object.receiveShadow = false;
          object.renderOrder = 3;
        }
        if (isMark) {
          object.castShadow = false;
          object.renderOrder = 2;
        }
        if (prepared.has(material)) return;
        prepared.add(material);
        if (isGlass) {
          material.color.setHex(0x70969a);
          material.transparent = true;
          material.opacity = 0.52;
          material.roughness = 0.32;
          material.metalness = 0;
          material.depthWrite = false;
          material.side = THREE.FrontSide;
          material.envMapIntensity = 0.18;
          if ("transmission" in material) material.transmission = 0.18;
          if ("thickness" in material) material.thickness = 0;
          if ("ior" in material) material.ior = 1.43;
        } else if (isMark) {
          material.color.setHex(0x906b59);
          material.transparent = false;
          material.alphaTest = 0.35;
          material.side = THREE.FrontSide;
          material.polygonOffset = true;
          material.polygonOffsetFactor = -1;
          material.polygonOffsetUnits = -1;
        } else if (!isEmissive) {
          // The supplied rust texture carries the paint color; keep its natural variation.
          if (material.name === "01 • weathered ochre enamel") material.color.setHex(0xffffff);
          if (material.name === "02 • pale service panels") material.color.setHex(0xe3c6a7);
          if (/^(01|02) •/.test(material.name) && material.map) {
            material.bumpMap = material.map;
            material.bumpScale = 0.025;
          }
          if ("roughness" in material) material.roughness = Math.max(material.roughness, 0.78);
          if ("metalness" in material) material.metalness = Math.min(material.metalness, 0.28);
        }
        if (material.map) material.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        material.needsUpdate = true;
      });
    });
  }

  new THREE.GLTFLoader(manager).load(
    "./assets/walker.glb?v=55f1723b5f11",
    function (gltf) {
      try {
        vessel = gltf.scene;
        vessel.name = "Desert_Walker_Q4";
        const initialBounds = new THREE.Box3().setFromObject(vessel);
        const initialSize = initialBounds.getSize(new THREE.Vector3());
        vessel.scale.setScalar(20 / Math.max(initialSize.x, initialSize.z));
        // Keep the existing camera's home direction, presenting the new bow toward it.
        vessel.rotation.y = Math.PI - 0.32;
        const bounds = new THREE.Box3().setFromObject(vessel);
        const center = bounds.getCenter(new THREE.Vector3());
        vessel.position.set(-center.x, terrainHeight(0, 0) - bounds.min.y, -center.z);
        prepareVesselMaterials(vessel);
        scene.add(vessel);
        prepareWalking(vessel);
        engineFlame = makeEngineFlame(vessel);
        const fittedBounds = new THREE.Box3().setFromObject(vessel);
        vesselRadius = fittedBounds.getBoundingSphere(new THREE.Sphere()).radius;
        homeTarget.y = fittedBounds.getCenter(new THREE.Vector3()).y;
        controls.target.copy(homeTarget);
        // Smoke follows the aft machinery in model space after normalization.
        smokeOrigin.copy(vessel.localToWorld(new THREE.Vector3(2.5, 4.7, 0)));
        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(vessel);
          gltf.animations.forEach(function (clip) { mixer.clipAction(clip).play(); });
        }
        resize();
        camera.position.copy(homePosition);
        controls.update();
      } catch (error) {
        if (vessel) scene.remove(vessel);
        manager.onError();
        console.error("Unable to prepare survey vessel", error);
      }
    },
    function (event) {
      if (event.total) loadingProgress.style.width = `${Math.round((event.loaded / event.total) * 100)}%`;
    },
    function (error) {
      manager.onError();
      console.error("Unable to load survey vessel", error);
    }
  );

  motionToggle.setAttribute("aria-pressed", String(motionEnabled));
  motionToggle.innerHTML = `<span class="button-icon" aria-hidden="true">◉</span>Drift ${motionEnabled ? "on" : "off"}`;
  motionToggle.addEventListener("click", function () {
    motionEnabled = !motionEnabled;
    pauseIdleOrbit(500);
    motionToggle.setAttribute("aria-pressed", String(motionEnabled));
    motionToggle.innerHTML = `<span class="button-icon" aria-hidden="true">◉</span>Drift ${motionEnabled ? "on" : "off"}`;
  });

  resetButton.addEventListener("click", function () {
    if (cockpitMode) {
      cockpitLook.yaw = 0; cockpitLook.pitch = -0.216;
      endCockpitLook(); updateCockpitCamera(); return;
    }
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
    pauseIdleOrbit(1500);
  });

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    if (vesselRadius && !cockpitMode) {
      const halfVerticalFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * camera.aspect);
      const fitDistance = vesselRadius / Math.sin(Math.min(halfVerticalFov, halfHorizontalFov)) * 1.08;
      const direction = new THREE.Vector3(24, 8.4, 29).normalize();
      const homeDistance = Math.max(new THREE.Vector3(24, 8.4, 29).length(), fitDistance);
      homePosition.copy(homeTarget).addScaledVector(direction, homeDistance);
      controls.maxDistance = Math.max(58, homeDistance * 1.2);
      // On a narrower viewport, move outward only as needed to keep the whole vessel visible.
      if (camera.position.distanceTo(controls.target) < fitDistance) {
        camera.position.sub(controls.target).normalize().multiplyScalar(fitDistance).add(controls.target);
      }
    }
    camera.updateProjectionMatrix();
    idleOrbit.rebase = true;
  }

  window.addEventListener("resize", resize);
  resize();

  const stormSlider = document.querySelector("#sandstorm");
  const timeSlider = document.querySelector("#day-time");
  const weather = { storm: 0.15, hour: 15, time: 0 };
  // Interpolate an art-directed day rather than snapping between lighting presets.
  const dayPalette = [
    [0,0x101d36,0x394960,0x273347,0x768eb9,0x302d3d,0.55,0.32],
    [5,0x253354,0x95695d,0x62515b,0xa497b8,0x53392d,0.7,0.5],
    [7,0x8b9ca7,0xe8aa79,0xc99a76,0xffba7b,0x774f35,1.2,2.2],
    [12,0x66aeb8,0xd8b477,0xc9a36d,0xffe7b9,0x6b3821,1.85,3.1],
    [16,0x74a8ad,0xddaa71,0xc9a36d,0xffd69b,0x6b3821,1.65,2.8],
    [18,0x665f83,0xe79860,0xb87d60,0xff9856,0x623633,1.05,2.1],
    [20,0x1d2c49,0x665775,0x494459,0x9aadd7,0x342e40,0.6,0.42],
    [24,0x101d36,0x394960,0x273347,0x768eb9,0x302d3d,0.55,0.32]
  ];
  function applyAtmosphere() {
    weather.storm = Number(stormSlider.value)/100;
    weather.hour = Number(timeSlider.value);
    const hour = weather.hour, storm = weather.storm;
    let index=0; while(index<dayPalette.length-2 && hour>dayPalette[index+1][0]) index++;
    const a=dayPalette[index],b=dayPalette[index+1],t=(hour-a[0])/(b[0]-a[0]);
    const color = n => new THREE.Color(a[n]).lerp(new THREE.Color(b[n]),t);
    const night = hour<6 || hour>19;
    const sand = new THREE.Color(night ? 0x66594c : 0xb78d59);
    const top=color(1).lerp(sand,storm*0.8), horizon=color(2).lerp(sand,storm*0.85);
    document.querySelector("#experience").style.background = `linear-gradient(${top.getStyle()} 0%, ${horizon.getStyle()} 75%, ${horizon.getStyle()} 100%)`;
    scene.fog.color.copy(color(3)).lerp(sand,storm*0.8);
    scene.fog.density=0.0068+storm*storm*0.025;
    skyLight.color.copy(color(4)); skyLight.groundColor.copy(color(5));
    skyLight.intensity=THREE.MathUtils.lerp(a[6],b[6],t)*(1-storm*0.25);
    sun.color.copy(color(4));sun.intensity=THREE.MathUtils.lerp(a[7],b[7],t)*(1-storm*0.78);
    const angle=(hour-6)/12*Math.PI;
    sun.position.set(Math.cos(angle)*42,Math.max(8,Math.sin(angle)*48),18);
    largeMoon.material.opacity=(night?0.95:0.5)*(1-storm*0.95);
    smallMoon.material.opacity=(night?0.9:0.45)*(1-storm*0.95);
    dust.material.opacity=0.12+storm*0.3;
    sandMaterial.uniforms.tint.value.copy(scene.fog.color);
    sandMaterial.uniforms.intensity.value=storm;
    sandGeometry.setDrawRange(0,Math.floor(6000*storm));
    document.querySelector("#storm-value").textContent = `${Math.round(storm*100)}% · ${storm<0.1?"Clear":storm<0.4?"Breeze":storm<0.75?"Blowing sand":"Sandstorm"}`;
    const minutes=Math.round(hour*60)%1440;
    const label=`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`;
    document.querySelector("#time-value").textContent=label;
    timeSlider.setAttribute("aria-valuetext",label);
    stormSlider.setAttribute("aria-valuetext",document.querySelector("#storm-value").textContent);
  }
  const sandGeometry=new THREE.BufferGeometry();
  const sandPositions=new Float32Array(6000*3);
  for(let i=0;i<sandPositions.length;i+=3) {
    sandPositions[i]=Math.random()*100-50; sandPositions[i+1]=Math.random()*32-5; sandPositions[i+2]=Math.random()*100-50;
  }
  sandGeometry.setAttribute("position",new THREE.BufferAttribute(sandPositions,3));
  const sandMaterial=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{tint:{value:new THREE.Color()},intensity:{value:0.15},inverseVessel:{value:new THREE.Matrix4()}},
    vertexShader:`uniform mat4 inverseVessel; varying vec3 cabin;
      void main(){vec4 world=modelMatrix*vec4(position,1.);cabin=(inverseVessel*world).xyz;
      vec4 view=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*view;
      gl_PointSize=clamp(38./max(1.,-view.z),1.,5.);}`,
    fragmentShader:`uniform vec3 tint;uniform float intensity;varying vec3 cabin;
      void main(){if(abs(cabin.x)<4.4 && cabin.y>2.3 && cabin.y<4.9 && abs(cabin.z)<1.4)discard;
      float r=length(gl_PointCoord-vec2(.5));float alpha=(1.-smoothstep(.12,.5,r))*(.22+intensity*.38);
      gl_FragColor=vec4(tint,alpha);}`
  });
  const stormSand=new THREE.Points(sandGeometry,sandMaterial);
  stormSand.name="Atmosphere_Windblown_Sand";stormSand.frustumCulled=false;scene.add(stormSand);
  stormSlider.addEventListener("input",applyAtmosphere);
  timeSlider.addEventListener("input",applyAtmosphere);
  applyAtmosphere();
  function updateAtmosphere(delta) {
    if(vessel) {
      stormSand.position.set(vessel.position.x,0,vessel.position.z);
      sandMaterial.uniforms.inverseVessel.value.copy(vessel.matrixWorld).invert();
    }
    if(!motionEnabled || weather.storm===0)return;
    const dt=Math.min(delta,0.05);weather.time+=dt;
    const wind=(2+weather.storm*18)*(1+Math.sin(weather.time*0.7)*0.22);
    for(let i=0;i<sandGeometry.drawRange.count*3;i+=3){
      sandPositions[i]=((sandPositions[i]+50+dt*wind)%100)-50;
      sandPositions[i+2]=((sandPositions[i+2]+50+dt*wind*0.23)%100)-50;
    }
    sandGeometry.attributes.position.needsUpdate=true;
  }

  const soundscape = window.createWalkerAudio();
  const clock = new THREE.Clock();
  function render() {
    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;
    updateWalking(delta);
    if (mixer && motionEnabled) mixer.update(delta);
    if (motionEnabled) {
      dust.rotation.y = elapsed * 0.004;
      birds.position.x = -46 + ((elapsed * 1.05) % 32);
      birds.children.forEach(function (bird, index) {
        bird.position.y += Math.sin(elapsed * 2.1 + index) * 0.0016;
        bird.rotation.z = Math.sin(elapsed * 2.5 + index * 0.8) * 0.09;
      });
      const flagPositions = flag.geometry.attributes.position;
      const flagBase = flag.userData.basePositions;
      for (let i = 0; i < flagPositions.count; i += 1) {
        const x = flagBase[i * 3];
        flagPositions.setZ(i, Math.sin(elapsed * 3.2 + x * 2.1) * (0.07 + x * 0.075));
      }
      flagPositions.needsUpdate = true;
    }
    smoke.forEach(function (puff, index) {
      const cycle = (elapsed * (motionEnabled ? 0.08 : 0) + puff.userData.phase) % 1;
      puff.position.set(
        smokeOrigin.x + Math.sin(cycle * 8 + index) * 0.5 + cycle * 1.6,
        smokeOrigin.y + cycle * 8.5,
        smokeOrigin.z + Math.cos(cycle * 6 + index) * 0.35
      );
      const size = 0.4 + cycle * 2.8;
      puff.scale.set(size, size, 1);
      puff.material.opacity = Math.sin(cycle * Math.PI) * 0.24;
    });
    updateAtmosphere(delta);
    updateEngineFlame(delta);
    if (cockpitMode) updateCockpitCamera();
    else { updateIdleCamera(delta); controls.update(); }
    soundscape.update(delta, {storm:weather.storm, cockpit:cockpitMode,
      walkTime:walking ? walking.time : 0,
      distance:vessel ? camera.position.distanceTo(vessel.position) : 40});
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }
  render();
})();
