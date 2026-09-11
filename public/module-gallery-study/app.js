(() => {
  "use strict";

  const modules = [
    { slug: "signal", title: "Signal Garden", type: "Generative systems", caption: "Signals / drift / attention", description: "A responsive field of small signals that gathers, drifts, and reorganizes around attention without demanding it.", tags: ["Creative code", "Sound", "WebGL"], format: "feature", typeStyle: "serif" },
    { slug: "atlas", title: "Soft Atlas", type: "Spatial archive", caption: "Routes through uncertainty", description: "A map for uncertain territory, pairing hand-drawn geography with a searchable index of stories, routes, and loose ends.", tags: ["Mapping", "Archives", "Research"], format: "wide", typeStyle: "italic" },
    { slug: "relay", title: "Relay / 03", type: "Network study", caption: "Transmission leaves a trace", description: "A compact visualization of how ideas move between people, where transmission leaves a trace and pauses become part of the record.", tags: ["Networks", "Data", "Motion"], format: "standard", typeStyle: "mono" },
    { slug: "ledger", title: "Living Ledger", type: "Editorial tool", caption: "Context is the record", description: "A public notebook that treats budgets, decisions, and context as one continuous editorial object instead of separate reports.", tags: ["Publishing", "Governance", "Type"], format: "tall", typeStyle: "serif" },
    { slug: "orbit", title: "Near Orbit", type: "Ambient interface", caption: "For what matters later", description: "A quiet peripheral interface for things that matter later: slow signals, shared observations, and work still finding its shape.", tags: ["Ambient UI", "Prototype", "3D"], format: "wide", typeStyle: "display" },
    { slug: "commons", title: "Common Ground", type: "Civic platform", caption: "Questions before answers", description: "A lightweight meeting surface designed to make shared questions visible before a group rushes toward answers.", tags: ["Community", "Participation", "Tools"], format: "compact", typeStyle: "sans" },
    { slug: "tide", title: "Tidal Memory", type: "Data portrait", caption: "The archive breathes", description: "A tidal portrait of collective memory where records surface, recede, and return with new relationships attached.", tags: ["Data", "Memory", "Visualization"], format: "tall", typeStyle: "italic" },
    { slug: "loom", title: "Protocol Loom", type: "Coordination study", caption: "Rules become texture", description: "A tactile model of shared protocols, weaving permissions and handoffs into a pattern people can read at a glance.", tags: ["Protocols", "Coordination", "Systems"], format: "standard", typeStyle: "mono" },
    { slug: "afterimage", title: "Afterimage FM", type: "Sonic essay", caption: "Tune the residual", description: "A browser radio assembled from residual tones, field recordings, and the quiet static between remembered places.", tags: ["Audio", "Essay", "Broadcast"], format: "feature", typeStyle: "display" },
    { slug: "index", title: "Unfinished Index", type: "Research tool", caption: "Entries resist closure", description: "An index that foregrounds omissions and contradictions, keeping research open to revision instead of forcing completion.", tags: ["Research", "Taxonomy", "Publishing"], format: "compact", typeStyle: "serif" },
    { slug: "chorus", title: "Small Chorus", type: "Participatory audio", caption: "Many voices / one room", description: "A shared vocal instrument where short contributions overlap into a changing, collectively authored atmosphere.", tags: ["Voice", "Participation", "Sound"], format: "wide", typeStyle: "italic" },
    { slug: "fieldnotes", title: "Field Notes 11", type: "Mobile notebook", caption: "Observed in motion", description: "A pocket notebook for observations made between destinations, tuned for fragments, sketches, and locationless context.", tags: ["Mobile", "Notes", "Fieldwork"], format: "standard", typeStyle: "mono" },
    { slug: "threshold", title: "Threshold Weather", type: "Ambient display", caption: "A forecast for change", description: "A slow display that translates organizational pressure into weather without pretending uncertainty is a number.", tags: ["Climate", "Ambient", "Organizations"], format: "tall", typeStyle: "display" },
    { slug: "kiln", title: "Open Kiln", type: "Learning platform", caption: "Practice under heat", description: "A studio for learning in public, where drafts, critique, and repeated attempts remain visible beside finished work.", tags: ["Learning", "Practice", "Community"], format: "feature", typeStyle: "serif" },
    { slug: "braid", title: "Three-Part Braid", type: "Narrative system", caption: "Stories cross and return", description: "Three accounts unfold in parallel, crossing at shared events while preserving the friction between their perspectives.", tags: ["Narrative", "Archives", "Interface"], format: "standard", typeStyle: "italic" },
    { slug: "weather", title: "Local Weather", type: "Community sensor", caption: "Conditions, collectively", description: "A neighborhood sensor assembled from human reports, making room for felt conditions that instruments overlook.", tags: ["Civic tech", "Sensors", "Care"], format: "wide", typeStyle: "sans" },
    { slug: "interval", title: "Useful Interval", type: "Time study", caption: "Pause has a shape", description: "A set of temporal tools for protecting the useful interval between response, decision, and irreversible action.", tags: ["Time", "Tools", "Governance"], format: "compact", typeStyle: "mono" },
    { slug: "beacon", title: "Quiet Beacon", type: "Presence signal", caption: "Visible without urgency", description: "A low-pressure presence signal for distributed teams that communicates availability without manufacturing urgency.", tags: ["Presence", "Remote work", "Signals"], format: "tall", typeStyle: "display" },
    { slug: "lattice", title: "Care Lattice", type: "Mutual-aid map", caption: "Support has structure", description: "A privacy-minded map of mutual support that reveals capacity and connection while resisting extractive profiles.", tags: ["Care", "Mapping", "Privacy"], format: "feature", typeStyle: "serif" },
    { slug: "murmur", title: "Public Murmur", type: "Listening space", caption: "Soft signals accumulate", description: "An anonymous listening space where small concerns can accumulate into patterns without becoming a popularity contest.", tags: ["Listening", "Public space", "Moderation"], format: "standard", typeStyle: "italic" },
    { slug: "archive", title: "Archive of Maybe", type: "Speculative catalog", caption: "Evidence for alternatives", description: "A catalog of proposals that never happened, treating unrealized futures as evidence rather than failure.", tags: ["Speculation", "Catalog", "Futures"], format: "wide", typeStyle: "display" },
    { slug: "switchyard", title: "Switchyard", type: "Workflow model", caption: "Handoffs become legible", description: "A visual switchyard for complex collaborations, showing where work waits, forks, returns, and changes hands.", tags: ["Workflow", "Operations", "Networks"], format: "tall", typeStyle: "mono" },
    { slug: "pollen", title: "Pollen Office", type: "Distributed studio", caption: "Ideas travel lightly", description: "A playful studio model for distributing tiny prompts that cross-pollinate work without central assignment.", tags: ["Studio", "Prompts", "Networks"], format: "compact", typeStyle: "sans" },
    { slug: "nightshift", title: "Night Shift", type: "Maintenance log", caption: "Care after closing", description: "A luminous record of invisible maintenance: the fixes, checks, and acts of care that happen after closing.", tags: ["Maintenance", "Labor", "Logging"], format: "feature", typeStyle: "display" },
    { slug: "measure", title: "Counter Measure", type: "Metrics critique", caption: "Count what escapes", description: "A counter-dashboard that pairs every metric with what it excludes, delays, or quietly changes through observation.", tags: ["Metrics", "Ethics", "Data"], format: "standard", typeStyle: "mono" },
    { slug: "vessel", title: "Borrowed Vessel", type: "Object archive", caption: "Use leaves a contour", description: "An object archive organized by traces of use, repair, lending, and the stories carried between temporary keepers.", tags: ["Objects", "Repair", "Archives"], format: "tall", typeStyle: "serif" },
    { slug: "assembly", title: "Assembly Line", type: "Decision theater", caption: "A room for dissent", description: "A decision space that gives proposals, objections, and unresolved tensions equal visual weight before a vote.", tags: ["Decisions", "Facilitation", "Governance"], format: "wide", typeStyle: "sans" },
    { slug: "echo", title: "Echo Practice", type: "Conversation tool", caption: "Return before reply", description: "A conversation tool that asks participants to reflect what they heard before adding a new position.", tags: ["Dialogue", "Reflection", "Practice"], format: "compact", typeStyle: "italic" },
    { slug: "wayfinder", title: "Wayfinder Zero", type: "Orientation system", caption: "Begin from where you are", description: "An orientation system that starts with present constraints and relationships instead of an idealized destination.", tags: ["Orientation", "Strategy", "Mapping"], format: "feature", typeStyle: "display" },
    { slug: "aperture", title: "Shared Aperture", type: "Collective camera", caption: "Attention edits the frame", description: "A collective camera whose framing emerges from many partial views, revealing how attention edits every record.", tags: ["Imaging", "Collective", "Perception"], format: "wide", typeStyle: "serif" },
  ];

  const gallery = document.querySelector("[data-gallery]");
  const columnInput = document.querySelector("#column-count");
  const columnOutput = document.querySelector("#column-output");
  const viewStatus = document.querySelector("#view-status");
  const viewButtons = [...document.querySelectorAll("[data-view-option]")];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const columnPreferences = { desktop: 5, mobile: 2 };
  let activeModule = null;
  let peekedModule = null;
  let spatialScene = null;
  let mobileInertElements = [];

  function artwork(module) {
    const art = document.createElement("span");
    art.className = `module-art art-${module.slug}`;
    art.setAttribute("aria-hidden", "true");
    art.append(
      Object.assign(document.createElement("span"), { className: "shape" }),
      Object.assign(document.createElement("span"), { className: "art-grain" }),
      Object.assign(document.createElement("span"), { className: "art-caption", textContent: module.caption }),
    );
    return art;
  }

  function makeDetail(module, index) {
    const detail = document.createElement("div");
    const detailId = `module-detail-${index + 1}`;
    detail.className = "module-detail";
    detail.id = detailId;
    detail.setAttribute("role", "region");
    detail.setAttribute("aria-labelledby", `${detailId}-title`);
    detail.hidden = true;

    const back = document.createElement("button");
    back.className = "back-button";
    back.type = "button";
    back.dataset.closeDetail = "";
    back.innerHTML = '<span aria-hidden="true">←</span> Back to gallery';

    const layout = document.createElement("div");
    layout.className = "detail-layout";
    const visual = document.createElement("div");
    visual.className = "detail-visual";
    visual.append(artwork(module));

    const copy = document.createElement("div");
    copy.className = "detail-copy";
    const kicker = document.createElement("p");
    kicker.className = "module-kicker";
    kicker.textContent = `${String(index + 1).padStart(2, "0")} / ${module.type}`;
    const title = document.createElement("h3");
    title.id = `${detailId}-title`;
    title.textContent = module.title;
    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = module.description;
    const tags = document.createElement("ul");
    tags.className = "detail-tags";
    tags.setAttribute("aria-label", "Module tags");
    tags.append(...module.tags.map((tag) => Object.assign(document.createElement("li"), { textContent: tag })));
    const actions = document.createElement("div");
    actions.className = "detail-actions";
    actions.innerHTML = '<a href="https://portal.raidguild.org" target="_blank" rel="noopener noreferrer">Explore project <span aria-hidden="true">↗</span></a><a href="https://raidguild.org" target="_blank" rel="noopener noreferrer">Field notes <span aria-hidden="true">↗</span></a>';
    copy.append(kicker, title, description, tags, actions);
    layout.append(visual, copy);
    detail.append(back, layout);
    return detail;
  }

  modules.forEach((module, index) => {
    const card = document.createElement("article");
    card.className = `module format-${module.format} type-${module.typeStyle}`;
    card.dataset.moduleIndex = String(index);

    const inner = document.createElement("div");
    inner.className = "module-inner";
    const trigger = document.createElement("button");
    trigger.className = "module-trigger";
    trigger.type = "button";
    trigger.dataset.moduleTrigger = "";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `module-detail-${index + 1}`);
    trigger.setAttribute("aria-label", `Unfold ${module.title}: ${module.type}`);

    const meta = document.createElement("span");
    meta.className = "module-meta";
    const names = document.createElement("span");
    const title = Object.assign(document.createElement("span"), { className: "module-title", textContent: module.title });
    const type = Object.assign(document.createElement("span"), { className: "module-type", textContent: module.type });
    names.append(title, document.createElement("br"), type);
    const number = Object.assign(document.createElement("span"), { className: "module-number", textContent: String(index + 1).padStart(2, "0") });
    meta.append(names, number);
    trigger.append(artwork(module), meta);
    inner.append(trigger, makeDetail(module, index));
    card.append(inner);
    gallery.append(card);
  });

  const cards = [...gallery.querySelectorAll(".module")];
  document.querySelector("#module-count").textContent = String(modules.length).padStart(2, "0");

  function columnMode() {
    return mobileQuery.matches ? "mobile" : "desktop";
  }

  function applyColumns(value, announce = true) {
    const mode = columnMode();
    const min = mode === "mobile" ? 1 : 3;
    const max = mode === "mobile" ? 3 : 8;
    const columns = Math.max(min, Math.min(max, Number(value)));
    columnPreferences[mode] = columns;
    columnInput.min = String(min);
    columnInput.max = String(max);
    columnInput.value = String(columns);
    columnInput.setAttribute("aria-valuetext", `${columns} ${columns === 1 ? "column" : "columns"}`);
    columnOutput.value = String(columns);
    columnOutput.textContent = String(columns);
    animateLayout(() => {
      clearPeek(false);
      gallery.style.setProperty("--columns", String(columns));
      gallery.dataset.columns = String(columns);
    });
    if (announce) {
      const selected = activeModule ? ` ${modules[Number(activeModule.dataset.moduleIndex)].title} remains open.` : "";
      viewStatus.textContent = `Gallery arranged in ${columns} ${columns === 1 ? "column" : "columns"}.${selected}`;
    }
  }

  function syncColumnRange(announce = false) {
    const mode = columnMode();
    applyColumns(columnPreferences[mode], announce);
  }

  function animateLayout(mutate) {
    cards.forEach((card) => card.getAnimations().forEach((animation) => animation.cancel()));
    const before = new Map(cards.map((card) => [card, card.getBoundingClientRect()]));
    mutate();
    if (motionQuery.matches) return;
    requestAnimationFrame(() => {
      cards.forEach((card) => {
        const first = before.get(card);
        const last = card.getBoundingClientRect();
        if (!first || !last.width || !last.height) return;
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(1 - sx) + Math.abs(1 - sy) < .02) return;
        card.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "top left" },
            { transform: "none", transformOrigin: "top left" },
          ],
          { duration: activeModule ? 720 : 520, easing: "cubic-bezier(.2,.82,.2,1)" },
        );
      });
    });
  }

  columnInput.addEventListener("input", () => applyColumns(columnInput.value));

  function clearPeek(animate = true) {
    if (!peekedModule) return;
    const mutate = () => {
      peekedModule?.classList.remove("is-peek");
      cards.forEach((card) => card.classList.remove("is-neighbor"));
      peekedModule = null;
      gallery.classList.remove("has-peek");
    };
    animate ? animateLayout(mutate) : mutate();
  }

  function setPeek(card) {
    if (activeModule || card === peekedModule || mobileQuery.matches) return;
    animateLayout(() => {
      peekedModule?.classList.remove("is-peek");
      cards.forEach((item) => item.classList.remove("is-neighbor"));
      peekedModule = card;
      const index = cards.indexOf(card);
      cards.forEach((item, itemIndex) => {
        if (itemIndex > index && itemIndex <= index + 2) item.classList.add("is-neighbor");
      });
      card.classList.add("is-peek");
      gallery.classList.add("has-peek");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => setPeek(card));
    card.querySelector("[data-module-trigger]").addEventListener("focus", () => setPeek(card));
  });
  gallery.addEventListener("pointerleave", () => clearPeek());

  function syncMobileDetailIsolation() {
    mobileInertElements.forEach((element) => { element.inert = false; });
    mobileInertElements = [];
    if (!activeModule || !mobileQuery.matches) return;

    const background = document.querySelectorAll(
      ".skip-link, .masthead, .intro, .section-heading, .gallery-help, footer, .module:not(.is-open)",
    );
    background.forEach((element) => {
      if (!element.inert) {
        element.inert = true;
        mobileInertElements.push(element);
      }
    });
  }

  function containMobileDetailFocus(event) {
    if (event.key !== "Tab" || !activeModule || !mobileQuery.matches) return;
    const detail = activeModule.querySelector(".module-detail");
    const focusable = [...detail.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")]
      .filter((element) => !element.hidden && element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focused = document.activeElement;
    if (!detail.contains(focused) || (!event.shiftKey && focused === last) || (event.shiftKey && focused === first)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }

  function openDetail(card) {
    if (activeModule === card) return;
    if (activeModule) closeDetail(false);
    clearPeek(false);
    const detail = card.querySelector(".module-detail");
    detail.hidden = false;
    activeModule = card;
    animateLayout(() => {
      gallery.classList.add("has-open");
      card.classList.add("is-open");
      card.querySelector("[data-module-trigger]").setAttribute("aria-expanded", "true");
      document.body.classList.add("detail-open");
    });
    syncMobileDetailIsolation();
    requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth", block: "center" });
      card.querySelector("[data-close-detail]").focus({ preventScroll: true });
    });
    viewStatus.textContent = `${modules[Number(card.dataset.moduleIndex)].title} unfolded in the gallery`;
  }

  function closeDetail(restoreFocus = true) {
    if (!activeModule) return;
    const card = activeModule;
    const trigger = card.querySelector("[data-module-trigger]");
    mobileInertElements.forEach((element) => { element.inert = false; });
    mobileInertElements = [];
    animateLayout(() => {
      card.querySelector(".module-detail").hidden = true;
      card.classList.remove("is-open");
      gallery.classList.remove("has-open");
      trigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("detail-open");
      activeModule = null;
    });
    const finish = () => { if (restoreFocus) trigger.focus({ preventScroll: true }); };
    motionQuery.matches ? finish() : window.setTimeout(finish, 730);
    viewStatus.textContent = "Returned to the module gallery";
  }

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-module-trigger]");
    if (trigger) openDetail(trigger.closest(".module"));
    if (event.target.closest("[data-close-detail]")) closeDetail();
  });
  document.addEventListener("keydown", (event) => {
    containMobileDetailFocus(event);
    if (event.key === "Escape" && activeModule) {
      event.preventDefault();
      closeDetail();
    }
  });

  function directionalTarget(origin, key) {
    const originRect = origin.getBoundingClientRect();
    const ox = originRect.left + originRect.width / 2;
    const oy = originRect.top + originRect.height / 2;
    const horizontal = key === "ArrowLeft" || key === "ArrowRight";
    const sign = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    return cards
      .map((card) => card.querySelector("[data-module-trigger]"))
      .filter((candidate) => candidate !== origin && candidate.offsetParent)
      .map((candidate) => {
        const rect = candidate.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - ox;
        const dy = rect.top + rect.height / 2 - oy;
        const primary = horizontal ? dx : dy;
        const secondary = horizontal ? dy : dx;
        return { candidate, primary, score: Math.abs(primary) + Math.abs(secondary) * 1.7 };
      })
      .filter(({ primary }) => Math.sign(primary) === sign)
      .sort((a, b) => a.score - b.score)[0]?.candidate;
  }

  gallery.addEventListener("keydown", (event) => {
    if (document.body.dataset.view !== "spatial" || activeModule || !event.key.startsWith("Arrow")) return;
    const origin = event.target.closest("[data-module-trigger]");
    if (!origin) return;
    const target = directionalTarget(origin, event.key);
    if (target) {
      event.preventDefault();
      target.focus();
    }
  });

  function setView(view, announce = true) {
    const nextView = view === "spatial" ? "spatial" : "editorial";
    clearPeek(false);
    animateLayout(() => { document.body.dataset.view = nextView; });
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.viewOption === nextView)));
    if (nextView === "spatial") {
      spatialScene ??= createSpatialScene();
      spatialScene?.start();
    } else {
      spatialScene?.stop();
    }
    if (announce) viewStatus.textContent = nextView === "spatial" ? "Spatial field selected. Use arrow keys for directional navigation." : "Editorial mosaic selected.";
  }

  viewButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewOption)));

  gallery.addEventListener("pointermove", (event) => {
    if (document.body.dataset.view !== "spatial" || motionQuery.matches) return;
    const rect = gallery.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    gallery.style.setProperty("--field-rx", `${(-y * 2.2).toFixed(2)}deg`);
    gallery.style.setProperty("--field-ry", `${(x * 2.8).toFixed(2)}deg`);
    gallery.style.setProperty("--field-rx-inverse", `${(y * 2.2).toFixed(2)}deg`);
    gallery.style.setProperty("--field-ry-soft", `${(-x * 2.1).toFixed(2)}deg`);
    gallery.style.setProperty("--field-rx-soft", `${(-y * 1.45).toFixed(2)}deg`);
    gallery.style.setProperty("--field-ry-deep", `${(x * 3.6).toFixed(2)}deg`);
  }, { passive: true });

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
      const materials = [0xd9ff43, 0xb2a1ff, 0xf05232, 0xf0efe9].map((color) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: .2 }));
      for (let index = 0; index < 13; index += 1) {
        const mesh = new THREE.Mesh(geometry, materials[index % materials.length]);
        const angle = index * 2.12;
        const radius = 2.4 + (index % 4) * 1.45;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * .7) * 3.6, -1 - (index % 5));
        mesh.scale.setScalar(.55 + (index % 3) * .35);
        mesh.rotation.set(angle, angle * .4, 0);
        group.add(mesh);
      }
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
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * .55 * amount, .035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * .35 * amount, .035);
        group.rotation.y += .00045 * amount;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      }
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", (event) => pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1), { passive: true });
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
  mobileQuery.addEventListener?.("change", () => {
    syncColumnRange(true);
    syncMobileDetailIsolation();
    if (activeModule && mobileQuery.matches && !activeModule.contains(document.activeElement)) {
      activeModule.querySelector("[data-close-detail]").focus({ preventScroll: true });
    }
  });
  syncColumnRange(false);
  setView("editorial", false);
})();
