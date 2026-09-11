(() => {
  "use strict";

  const modules = [
    { slug: "signal", title: "Signal Garden", type: "Generative systems", description: "A responsive field of small signals that gathers, drifts, and reorganizes around attention without demanding it.", tags: ["Creative code", "Sound", "WebGL"] },
    { slug: "atlas", title: "Soft Atlas", type: "Spatial archive", description: "A map for uncertain territory, pairing hand-drawn geography with a searchable index of stories, routes, and loose ends.", tags: ["Mapping", "Archives", "Research"] },
    { slug: "relay", title: "Relay / 03", type: "Network study", description: "A compact visualization of how ideas move between people, where transmission leaves a trace and pauses become part of the record.", tags: ["Networks", "Data", "Motion"] },
    { slug: "ledger", title: "Living Ledger", type: "Editorial tool", description: "A public notebook that treats budgets, decisions, and context as one continuous editorial object instead of separate reports.", tags: ["Publishing", "Governance", "Type"] },
    { slug: "orbit", title: "Near Orbit", type: "Ambient interface", description: "A quiet peripheral interface for things that matter later: slow signals, shared observations, and work still finding its shape.", tags: ["Ambient UI", "Prototype", "3D"] },
    { slug: "commons", title: "Common Ground", type: "Civic platform", description: "A lightweight meeting surface designed to make shared questions visible before a group rushes toward answers.", tags: ["Community", "Participation", "Tools"] },
  ];

  const gallery = document.querySelector("[data-gallery]");
  const dialog = document.querySelector(".detail-dialog");
  const detailTitle = document.querySelector("#detail-title");
  const detailDescription = document.querySelector("#detail-description");
  const detailIndex = document.querySelector("[data-detail-index]");
  const detailTags = document.querySelector("[data-detail-tags]");
  const detailVisual = document.querySelector("[data-detail-visual]");
  const viewStatus = document.querySelector("#view-status");
  const viewButtons = [...document.querySelectorAll("[data-view-option]")];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastTrigger = null;
  let spatialScene = null;

  function artwork(slug) {
    const art = document.createElement("div");
    art.className = `module-art art-${slug}`;
    art.setAttribute("aria-hidden", "true");
    art.append(Object.assign(document.createElement("span"), { className: "shape" }));
    return art;
  }

  modules.forEach((module, index) => {
    const button = document.createElement("button");
    button.className = "module";
    button.type = "button";
    button.dataset.moduleIndex = String(index);
    button.setAttribute("aria-label", `Open ${module.title}: ${module.type}`);

    const inner = document.createElement("span");
    inner.className = "module-inner";
    inner.append(artwork(module.slug));
    const meta = document.createElement("span");
    meta.className = "module-meta";
    const names = document.createElement("span");
    const title = document.createElement("span");
    title.className = "module-title";
    title.textContent = module.title;
    const type = document.createElement("span");
    type.className = "module-type";
    type.textContent = module.type;
    names.append(title, document.createElement("br"), type);
    const number = document.createElement("span");
    number.className = "module-number";
    number.textContent = String(index + 1).padStart(2, "0");
    meta.append(names, number);
    inner.append(meta);
    button.append(inner);
    gallery.append(button);
  });

  function openDetail(index, trigger) {
    const module = modules[index];
    if (!module) return;
    lastTrigger = trigger;
    detailIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${module.type}`;
    detailTitle.textContent = module.title;
    detailDescription.textContent = module.description;
    detailTags.replaceChildren(...module.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }));
    detailVisual.className = `detail-visual art-${module.slug}`;
    detailVisual.replaceChildren(Object.assign(document.createElement("span"), { className: "shape" }));
    document.querySelector("[data-primary-link]").href = "https://portal.raidguild.org";
    document.querySelector("[data-secondary-link]").href = "https://raidguild.org";
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.querySelector("[data-close-detail]").focus({ preventScroll: true });
  }

  function closeDetail() {
    if (!dialog.open) return;
    dialog.close();
    document.body.style.overflow = "";
    lastTrigger?.focus({ preventScroll: true });
  }

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-module-index]");
    if (trigger) openDetail(Number(trigger.dataset.moduleIndex), trigger);
  });
  document.querySelector("[data-close-detail]").addEventListener("click", closeDetail);
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDetail(); });
  dialog.addEventListener("close", () => { document.body.style.overflow = ""; });

  function setView(view, announce = true) {
    const nextView = view === "spatial" ? "spatial" : "editorial";
    document.body.dataset.view = nextView;
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.viewOption === nextView)));
    if (nextView === "spatial") {
      spatialScene ??= createSpatialScene();
      spatialScene?.start();
    } else {
      spatialScene?.stop();
    }
    if (announce) viewStatus.textContent = `${nextView === "spatial" ? "3D" : "Editorial"} gallery view selected`;
  }

  viewButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewOption)));

  function createSpatialScene() {
    if (!window.THREE) return null;
    try {
      const canvas = document.querySelector("#spatial-scene");
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
      camera.position.set(0, 0, 9);
      const group = new THREE.Group();
      scene.add(group);

      const geometry = new THREE.IcosahedronGeometry(.42, 1);
      const materials = [0xd9ff43, 0xb2a1ff, 0xf05232, 0xf0efe9].map((color) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: .22 }));
      for (let index = 0; index < 13; index += 1) {
        const mesh = new THREE.Mesh(geometry, materials[index % materials.length]);
        const angle = index * 2.12;
        const radius = 2.4 + (index % 4) * 1.45;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * .7) * 3.6, -1 - (index % 5));
        mesh.scale.setScalar(.55 + (index % 3) * .35);
        mesh.rotation.set(angle, angle * .4, 0);
        group.add(mesh);
      }

      const points = [];
      for (let index = 0; index < 90; index += 1) {
        const angle = index * 1.67;
        const radius = 2 + (index % 17) * .52;
        points.push(Math.cos(angle) * radius, Math.sin(angle * .73) * 4.5, -3 - (index % 9) * .6);
      }
      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      scene.add(new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: 0xf0efe9, size: .025, transparent: true, opacity: .3 })));

      const pointer = new THREE.Vector2();
      let frame = 0;
      let running = false;
      function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      function render() {
        if (!running) return;
        const amount = motionQuery.matches ? 0 : 1;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * .65 * amount, .035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * .4 * amount, .035);
        group.rotation.y += .00055 * amount;
        group.rotation.x = camera.position.y * -.035;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      }
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", (event) => {
        pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      }, { passive: true });
      resize();
      renderer.render(scene, camera);
      return {
        start() { if (!running) { running = true; render(); } },
        stop() { running = false; cancelAnimationFrame(frame); renderer.render(scene, camera); },
      };
    } catch (error) {
      document.querySelector("#spatial-scene").hidden = true;
      return null;
    }
  }

  motionQuery.addEventListener?.("change", () => {
    if (document.body.dataset.view === "spatial") {
      spatialScene?.stop();
      spatialScene?.start();
    }
  });
  setView("editorial", false);
})();
