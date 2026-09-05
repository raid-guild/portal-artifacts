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
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.28;
  controls.update();

  scene.add(new THREE.HemisphereLight(0xb9e2df, 0x6b3821, 1.85));
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
  let vesselBaseY = 0;
  let motionEnabled = !reducedMotion;

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

  function addCockpitInterior(model) {
    const interior = new THREE.Group();
    interior.name = "Cockpit Interior Detail";

    const charcoal = new THREE.MeshStandardMaterial({
      color: 0x171d1c,
      roughness: 0.94,
      metalness: 0.08,
    });
    const leather = new THREE.MeshStandardMaterial({
      color: 0x3a2118,
      roughness: 1,
      metalness: 0,
    });
    const instrument = new THREE.MeshStandardMaterial({
      color: 0x151a18,
      roughness: 0.72,
      metalness: 0.22,
    });
    const amber = new THREE.MeshStandardMaterial({
      color: 0xd77d31,
      emissive: 0x8e2e08,
      emissiveIntensity: 1.7,
      roughness: 0.5,
    });
    const brass = new THREE.MeshStandardMaterial({
      color: 0x8a5a2d,
      roughness: 0.7,
      metalness: 0.34,
    });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.12, 3.42), charcoal);
    floor.position.set(-4.36, 3.62, 0);
    interior.add(floor);

    for (let index = 0; index < 7; index += 1) {
      const floorStrip = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.035, 0.035), brass);
      floorStrip.position.set(-4.36, 3.7, -1.34 + index * 0.45);
      interior.add(floorStrip);
    }

    [-0.68, 0.68].forEach(function (z, index) {
      const seat = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.38, 0.68), leather);
      base.position.y = 0.12;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.22, 0.5), leather);
      back.position.set(0.25, 0.75, 0);
      back.rotation.z = -0.12;
      seat.add(base, back);

      const shoulderBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.82, 0.56), brass);
      shoulderBar.position.set(0.19, 0.82, 0);
      shoulderBar.rotation.z = -0.12;
      seat.add(shoulderBar);

      seat.position.set(-4.05 + index * 0.16, 4.15, z);
      interior.add(seat);
    });

    const consolePanel = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.2, 2.4), instrument);
    consolePanel.position.set(-5.12, 4.45, 0);
    consolePanel.rotation.z = -0.18;
    interior.add(consolePanel);

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const gauge = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), amber);
        gauge.position.set(-5.42, 4.25 + row * 0.32, -0.68 + column * 0.45);
        interior.add(gauge);
      }
    }

    [-0.72, 0.72].forEach(function (z) {
      const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.045, 7, 18), brass);
      yoke.position.set(-4.84, 4.82, z);
      yoke.rotation.y = Math.PI / 2;
      interior.add(yoke);

      const yokeStem = cylinderBetween(
        new THREE.Vector3(-4.82, 4.8, z),
        new THREE.Vector3(-5.18, 4.52, z),
        0.035,
        brass
      );
      interior.add(yokeStem);
    });

    for (let index = 0; index < 5; index += 1) {
      const lever = cylinderBetween(
        new THREE.Vector3(-5.02, 4.0, -0.52 + index * 0.25),
        new THREE.Vector3(-4.82, 4.38 + (index % 2) * 0.11, -0.52 + index * 0.25),
        0.025,
        brass
      );
      interior.add(lever);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), index === 2 ? amber : charcoal);
      knob.position.set(-4.82, 4.38 + (index % 2) * 0.11, -0.52 + index * 0.25);
      interior.add(knob);
    }

    const rearBulkhead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.15, 3.55), charcoal);
    rearBulkhead.position.set(-3.13, 5.18, 0);
    interior.add(rearBulkhead);

    const warmCabinLight = new THREE.PointLight(0xf19b50, 0.5, 5.5, 2);
    warmCabinLight.position.set(-4.45, 6.05, 0.35);
    interior.add(warmCabinLight);

    interior.traverse(function (object) {
      if (object.isMesh) object.castShadow = false;
    });
    model.add(interior);
  }

  function addRaidGuildStamp(model) {
    new THREE.TextureLoader(manager).load("./assets/raidguild-symbol.svg?v=brand", function (texture) {
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const stampMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x7a4435,
        transparent: true,
        opacity: 0.78,
        alphaTest: 0.045,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        side: THREE.DoubleSide,
      });
      [1, -1].forEach(function (side) {
        const stamp = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.62), stampMaterial.clone());
        stamp.name = side === 1 ? "RaidGuild Hull Stamp Starboard" : "RaidGuild Hull Stamp Port";
        stamp.position.set(-1.75, 5.35, side * 2.47);
        stamp.rotation.y = side === 1 ? 0 : Math.PI;
        stamp.rotation.z = side * -0.035;
        stamp.renderOrder = 4;
        model.add(stamp);
      });
    });
  }

  new THREE.GLTFLoader(manager).load(
    "./assets/walker.glb?v=hull-canopy",
    function (gltf) {
      vessel = gltf.scene;
      const initialBounds = new THREE.Box3().setFromObject(vessel);
      const initialSize = initialBounds.getSize(new THREE.Vector3());
      const targetLength = 20;
      const scale = targetLength / Math.max(initialSize.x, initialSize.z);
      vessel.scale.setScalar(scale);

      const bounds = new THREE.Box3().setFromObject(vessel);
      const center = bounds.getCenter(new THREE.Vector3());
      vessel.position.x -= center.x;
      vessel.position.z -= center.z;
      vessel.position.y -= bounds.min.y - terrainHeight(0, 0) + 0.08;
      vessel.rotation.y = -0.32;
      vesselBaseY = vessel.position.y;

      vessel.traverse(function (object) {
        if (!object.isMesh) return;

        if (object.name.indexOf("Expedition Insignia") === 0) {
          object.visible = false;
          return;
        }

        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(function (material) {
          if (!material) return;

          const isCockpitGlass = /glass|canopy/i.test(material.name);
          if (isCockpitGlass) {
            material.color.setHex(0x315c68);
            material.transparent = true;
            material.opacity = 0.5;
            material.depthWrite = false;
            material.side = THREE.DoubleSide;
            material.roughness = 0.26;
            material.metalness = 0;
            material.envMapIntensity = 0.18;
            if ("transmission" in material) material.transmission = 0.18;
            if ("thickness" in material) material.thickness = 0.22;
            if ("ior" in material) material.ior = 1.43;
            if ("clearcoat" in material) material.clearcoat = 0.12;
            if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.48;
            object.castShadow = false;
            object.renderOrder = 3;
          } else {
            if ("roughness" in material) material.roughness = Math.max(material.roughness || 0, 0.78);
            if ("metalness" in material) material.metalness = Math.min(material.metalness || 0, 0.28);
          }

          if (material.map) material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
          material.needsUpdate = true;
        });
      });

      addCockpitInterior(vessel);
      addRaidGuildStamp(vessel);

      scene.add(vessel);
    },
    function (event) {
      if (event.total) loadingProgress.style.width = `${Math.round((event.loaded / event.total) * 100)}%`;
    }
  );

  motionToggle.setAttribute("aria-pressed", String(motionEnabled));
  motionToggle.innerHTML = `<span class="button-icon" aria-hidden="true">◉</span>Drift ${motionEnabled ? "on" : "off"}`;
  motionToggle.addEventListener("click", function () {
    motionEnabled = !motionEnabled;
    controls.autoRotate = motionEnabled;
    motionToggle.setAttribute("aria-pressed", String(motionEnabled));
    motionToggle.innerHTML = `<span class="button-icon" aria-hidden="true">◉</span>Drift ${motionEnabled ? "on" : "off"}`;
  });

  resetButton.addEventListener("click", function () {
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
  });

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  function render() {
    const elapsed = clock.getElapsedTime();
    if (motionEnabled) {
      dust.rotation.y = elapsed * 0.004;
      if (vessel) vessel.position.y = vesselBaseY + Math.sin(elapsed * 0.72) * 0.018;
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
        5.6 + Math.sin(cycle * 8 + index) * 0.5 + cycle * 1.6,
        7.7 + cycle * 8.5,
        -1.6 + Math.cos(cycle * 6 + index) * 0.35
      );
      const size = 0.4 + cycle * 2.8;
      puff.scale.set(size, size, 1);
      puff.material.opacity = Math.sin(cycle * Math.PI) * 0.24;
    });
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }
  render();
})();
