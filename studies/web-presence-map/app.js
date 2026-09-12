const NODES = [
  {
    id: "front-door",
    label: "raidguild.org",
    type: "Public arrival",
    category: "front-door",
    group: "Public path",
    description: "The public front door: a cinematic introduction to RaidGuild, its work, and its invitation to venture beyond.",
    audience: "Prospective clients, collaborators, and curious visitors",
    relation: "Begins the journey and leads into the community world",
    status: "wip",
    url: "https://raidguild-website-redesign-production.up.railway.app/",
    destination: "Open the WIP front door",
    parent: null,
    x: 50,
    y: 8,
    order: 1,
  },
  {
    id: "venture-beyond",
    label: "Venture Beyond",
    type: "Community world",
    category: "community",
    group: "Public path",
    description: "The shared narrative layer where visitors encounter the guild as a living world rather than a list of services.",
    audience: "Newcomers moving from interest toward participation",
    relation: "Connects the public story to the Portal and knowledge routes",
    status: "wip",
    url: "https://raidguild-website-redesign-production.up.railway.app/",
    destination: "Visit Venture Beyond",
    parent: "front-door",
    x: 50,
    y: 25,
    order: 2,
  },
  {
    id: "raidguild",
    label: "RaidGuild",
    type: "Center of gravity",
    category: "community",
    group: "Community core",
    description: "The guild itself: a community of builders, designers, strategists, and operators coordinating around meaningful work.",
    audience: "Members, partners, clients, and contributors",
    relation: "Holds the community core and the four specialist spearheads in orbit",
    status: "live",
    url: null,
    destination: "Ecosystem center — no single destination",
    parent: "venture-beyond",
    x: 50,
    y: 47,
    order: 3,
    hub: true,
  },
  {
    id: "portal",
    label: "Portal",
    type: "Community gate",
    category: "community",
    group: "Community core",
    description: "The gateway into member-facing content, operational modules, experiments, and the path to joining RaidGuild.",
    audience: "Members and prospective contributors",
    relation: "Routes the community world into capabilities and internal systems",
    status: "wip",
    url: null,
    destination: "Destination not yet confirmed",
    parent: "raidguild",
    x: 50,
    y: 68,
    order: 4,
  },
  {
    id: "handbook",
    label: "Handbook",
    type: "Knowledge route",
    category: "knowledge",
    group: "Knowledge routes",
    description: "Durable guidance for how the guild works, coordinates, and makes decisions.",
    audience: "Contributors learning RaidGuild's operating model",
    relation: "Branches from the community world and supports Portal journeys",
    status: "wip",
    url: null,
    destination: "Destination not yet confirmed",
    parent: "venture-beyond",
    x: 29,
    y: 57,
    order: 5,
  },
  {
    id: "process-docs",
    label: "Process docs",
    type: "Knowledge route",
    category: "knowledge",
    group: "Knowledge routes",
    description: "Working documentation for repeatable guild practices, delivery patterns, and stewardship.",
    audience: "Active members and operators",
    relation: "Extends the Handbook with task-level guidance",
    status: "planned",
    url: null,
    destination: "Planned route — no public URL",
    parent: "handbook",
    x: 20,
    y: 71,
    order: 6,
  },
  {
    id: "content",
    label: "CMS content",
    type: "Capability",
    category: "internal",
    group: "Portal capabilities",
    description: "The publishing layer for stories, references, updates, and other shared guild knowledge.",
    audience: "Editors, stewards, and readers",
    relation: "A capability reached through Portal",
    status: "wip",
    url: null,
    destination: "Portal capability — no public URL",
    parent: "portal",
    x: 35,
    y: 83,
    order: 7,
  },
  {
    id: "operations",
    label: "Operations",
    type: "Internal systems",
    category: "internal",
    group: "Portal capabilities",
    description: "Tools that help the guild coordinate work, ownership, scheduling, and ongoing operations.",
    audience: "Members and guild operators",
    relation: "An authenticated capability reached through Portal",
    status: "wip",
    url: null,
    destination: "Internal route — no public URL",
    parent: "portal",
    x: 50,
    y: 91,
    order: 8,
  },
  {
    id: "artifacts",
    label: "Games & artifacts",
    type: "Experimental layer",
    category: "internal",
    group: "Portal capabilities",
    description: "Interactive studies, games, and small tools that make the guild's ideas tangible.",
    audience: "Community members and invited visitors",
    relation: "A sandboxed creative surface reached through Portal",
    status: "live",
    url: null,
    destination: "Collection is surfaced inside Portal",
    parent: "portal",
    x: 65,
    y: 83,
    order: 9,
  },
  {
    id: "join",
    label: "Join flow",
    type: "Participation route",
    category: "community",
    group: "Portal capabilities",
    description: "The pathway from exploring the guild to becoming an active contributor.",
    audience: "Prospective members",
    relation: "A community conversion path routed through Portal",
    status: "wip",
    url: null,
    destination: "Destination not yet confirmed",
    parent: "portal",
    x: 78,
    y: 71,
    order: 10,
  },
  {
    id: "applied-ai",
    label: "Applied AI",
    type: "Tip of the spear",
    category: "spear",
    group: "Specialist offerings",
    description: "Forward-deployed AI specialists building practical workflows and intelligent systems with partner teams.",
    audience: "Organizations ready to apply AI to real operations",
    relation: "An outward-facing specialist offering and relationship funnel",
    status: "live",
    url: "https://raidguild.ai/",
    destination: "Explore RaidGuild AI",
    parent: "raidguild",
    x: 81,
    y: 19,
    order: 11,
  },
  {
    id: "onchain",
    label: "Onchain systems",
    type: "Tip of the spear",
    category: "spear",
    group: "Specialist offerings",
    description: "A focused path for protocols, smart contracts, and systems designed to live onchain.",
    audience: "Protocol teams and organizations building decentralized infrastructure",
    relation: "An outward-facing specialist offering; canonical subdomain is reserved",
    status: "wip",
    url: null,
    destination: "onchain.raidguild.org — WIP, not yet linked",
    parent: "raidguild",
    x: 87,
    y: 42,
    order: 12,
  },
  {
    id: "placement",
    label: "Placement",
    type: "Tip of the spear",
    category: "spear",
    group: "Specialist offerings",
    description: "A future path for placing trusted guild talent into aligned teams and engagements.",
    audience: "Teams seeking experienced embedded contributors",
    relation: "A planned relationship funnel branching from the guild",
    status: "planned",
    url: null,
    destination: "placement.raidguild.org — unconfirmed",
    parent: "raidguild",
    x: 18,
    y: 19,
    order: 13,
  },
  {
    id: "forge",
    label: "Forge",
    type: "Tip of the spear",
    category: "spear",
    group: "Specialist offerings",
    description: "An emerging game-studio identity for autonomous worlds, playful systems, and experimental hardware.",
    audience: "Game, world-building, and emerging-technology partners",
    relation: "A WIP specialist offering branching from the guild",
    status: "wip",
    url: null,
    destination: "forge.raidguild.org — not yet confirmed for this map",
    parent: "raidguild",
    x: 13,
    y: 42,
    order: 14,
  },
];

const EDGES = [
  ["front-door", "venture-beyond", "primary"],
  ["venture-beyond", "raidguild", "primary"],
  ["raidguild", "portal", "primary"],
  ["venture-beyond", "handbook", "knowledge"],
  ["handbook", "process-docs", "knowledge"],
  ["portal", "content", "internal"],
  ["portal", "operations", "internal"],
  ["portal", "artifacts", "internal"],
  ["portal", "join", "internal"],
  ["raidguild", "applied-ai", "spear"],
  ["raidguild", "onchain", "spear"],
  ["raidguild", "placement", "spear"],
  ["raidguild", "forge", "spear"],
];

const TOUR = [
  "front-door",
  "venture-beyond",
  "raidguild",
  "portal",
  "content",
  "operations",
  "artifacts",
  "join",
  "applied-ai",
  "onchain",
  "placement",
  "forge",
];

const GROUP_ORDER = ["Public path", "Community core", "Knowledge routes", "Portal capabilities", "Specialist offerings"];
const byId = new Map(NODES.map((node) => [node.id, node]));
const nodeLayer = document.querySelector("#node-layer");
const routes = document.querySelector("#routes");
const mapView = document.querySelector("#map-view");
const systemView = document.querySelector("#system-view");
const systemTree = document.querySelector("#system-tree");
const detail = document.querySelector("#field-note");
const announcer = document.querySelector("#announcer");
const scrubber = document.querySelector("#tour-scrubber");
const tourToggle = document.querySelector("#tour-toggle");
const tourCount = document.querySelector("#tour-count");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let selectedId = "raidguild";
let tourIndex = 0;
let tourTimer = null;
let detailPinned = false;
let detailId = null;

function readStoredTheme() {
  try {
    return localStorage.getItem("raidguild-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("raidguild-theme", theme);
  } catch {
    // Storage is intentionally unavailable in sandboxed cross-origin iframes.
  }
}

function nodeMarkup(node) {
  return `<span class="node-copy"><span class="node-label">${node.label}</span><span class="node-type">${node.type}</span></span><span class="mobile-status">${node.status}</span>`;
}

function renderNodes() {
  nodeLayer.innerHTML = "";
  NODES.forEach((node, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `map-node${node.hub ? " hub" : ""}`;
    button.dataset.id = node.id;
    button.dataset.index = String(index + 1).padStart(2, "0");
    button.dataset.category = node.category;
    button.style.setProperty("--x", node.x);
    button.style.setProperty("--y", node.y);
    button.setAttribute("aria-label", `${node.label}, ${node.type}, ${node.status}. Open field note.`);
    button.innerHTML = nodeMarkup(node);
    button.addEventListener("click", () => selectNode(node.id, true));
    button.addEventListener("mouseenter", () => previewNode(node.id));
    button.addEventListener("focus", () => previewNode(node.id));
    button.addEventListener("mouseleave", restoreSelection);
    button.addEventListener("blur", restoreSelection);
    nodeLayer.append(button);
  });
}

function renderRoutes() {
  routes.setAttribute("viewBox", "0 0 100 100");
  routes.setAttribute("preserveAspectRatio", "none");
  routes.innerHTML = EDGES.map(([fromId, toId, type]) => {
    const from = byId.get(fromId);
    const to = byId.get(toId);
    const bend = Math.max(4, Math.abs(to.x - from.x) * 0.18);
    const controlY = (from.y + to.y) / 2 - (type === "spear" ? bend : 0);
    const d = `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${controlY} ${to.x} ${to.y}`;
    return `<path class="route ${type}" data-from="${fromId}" data-to="${toId}" d="${d}" />`;
  }).join("");
}

function renderSystem() {
  systemTree.innerHTML = GROUP_ORDER.map((group) => {
    const nodes = NODES.filter((node) => node.group === group);
    return `<section class="system-group"><h2>${group}</h2><ol class="system-list">${nodes.map((node) => `
      <li><button class="system-node" type="button" data-id="${node.id}" aria-label="Open ${node.label} field note">
        <span class="system-number">${String(node.order).padStart(2, "0")}</span>
        <span class="system-name">${node.label}</span>
        <span class="system-status">${node.status}</span>
      </button></li>`).join("")}</ol></section>`;
  }).join("");
  systemTree.querySelectorAll(".system-node").forEach((button) => {
    button.addEventListener("click", () => selectNode(button.dataset.id, true));
    button.addEventListener("mouseenter", () => previewNode(button.dataset.id));
    button.addEventListener("focus", () => previewNode(button.dataset.id));
    button.addEventListener("mouseleave", restoreSelection);
    button.addEventListener("blur", restoreSelection);
  });
}

function setDetail(node, announce = false) {
  detailId = node.id;
  document.querySelector("#detail-index").textContent = `RG—${String(node.order).padStart(2, "0")}`;
  const status = document.querySelector("#detail-status");
  status.textContent = node.status.toUpperCase();
  status.dataset.status = node.status;
  document.querySelector("#detail-category").textContent = node.type;
  document.querySelector("#detail-title").textContent = node.label;
  document.querySelector("#detail-purpose").textContent = node.description;
  document.querySelector("#detail-audience").textContent = node.audience;
  document.querySelector("#detail-relation").textContent = node.relation;
  const destination = document.querySelector("#detail-destination");
  destination.innerHTML = node.url
    ? `<a class="destination-link" href="${node.url}" target="_self" rel="noreferrer"><span>${node.destination}</span><span aria-hidden="true">↗</span></a>`
    : `<span class="destination-muted"><span>${node.destination}</span><span aria-hidden="true">—</span></span>`;
  if (announce) announcer.textContent = `${node.label} selected. ${node.status}. ${node.description}`;
}

function openDetail(isPreview = false) {
  detail.classList.add("is-open");
  detail.classList.toggle("is-preview", isPreview);
  detail.setAttribute("aria-hidden", "false");
  detail.removeAttribute("inert");
}

function closeDetail() {
  detail.classList.remove("is-open");
  detail.classList.remove("is-preview");
  detail.setAttribute("aria-hidden", "true");
  detail.setAttribute("inert", "");
}

function setHighlight(id, preview = false) {
  const connected = new Set([id]);
  EDGES.forEach(([from, to]) => {
    if (from === id || to === id) { connected.add(from); connected.add(to); }
  });
  document.querySelectorAll(".map-node, .system-node").forEach((element) => {
    const isTarget = element.dataset.id === id;
    element.classList.toggle("is-selected", !preview && element.dataset.id === selectedId);
    element.classList.toggle("is-dimmed", preview && !connected.has(element.dataset.id));
    if (isTarget && tourTimer) element.classList.add("is-tour");
    else element.classList.remove("is-tour");
  });
  routes.querySelectorAll(".route").forEach((route) => {
    const active = route.dataset.from === id || route.dataset.to === id;
    route.classList.toggle("is-active", active);
    route.classList.toggle("is-dimmed", preview && !active);
  });
}

function selectNode(id, announce = false) {
  const node = byId.get(id);
  if (!node) return;
  selectedId = id;
  if (announce) detailPinned = true;
  setDetail(node, announce);
  setHighlight(id);
  openDetail(false);
}

function previewNode(id) {
  const node = byId.get(id);
  if (!node) return;
  setDetail(node);
  setHighlight(id, true);
  openDetail(true);
}

function restoreSelection() {
  const node = byId.get(selectedId);
  if (detailId !== selectedId) setDetail(node);
  setHighlight(selectedId);
  if (!detailPinned) closeDetail();
}

function setView(view) {
  const isMap = view === "map";
  mapView.hidden = !isMap;
  systemView.hidden = isMap;
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  announcer.textContent = `${isMap ? "Map" : "System"} view active.`;
}

function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  const isNight = theme === "night";
  const toggle = document.querySelector("#theme-toggle");
  toggle.setAttribute("aria-label", `Switch to ${isNight ? "day" : "night"} chart`);
  toggle.querySelector(".theme-icon").textContent = isNight ? "☼" : "☾";
  toggle.querySelector(".theme-label").textContent = isNight ? "Day chart" : "Night chart";
  if (persist) storeTheme(theme);
}

function stopTour() {
  window.clearInterval(tourTimer);
  tourTimer = null;
  tourToggle.setAttribute("aria-pressed", "false");
  tourToggle.querySelector("span:first-child").textContent = "▶";
  tourToggle.querySelector(".tour-label").textContent = "Trace the journey";
  document.querySelectorAll(".is-tour").forEach((element) => element.classList.remove("is-tour"));
}

function showTourStep(index, announce = true) {
  tourIndex = Math.max(0, Math.min(TOUR.length - 1, Number(index)));
  scrubber.value = String(tourIndex);
  tourCount.textContent = `${String(tourIndex + 1).padStart(2, "0")} / ${String(TOUR.length).padStart(2, "0")}`;
  const id = TOUR[tourIndex];
  selectNode(id, announce);
  document.querySelectorAll(`[data-id="${id}"]`).forEach((element) => element.classList.add("is-tour"));
}

function startTour() {
  if (reducedMotion.matches) {
    showTourStep(tourIndex === TOUR.length - 1 ? 0 : tourIndex + 1);
    return;
  }
  if (tourIndex === TOUR.length - 1) tourIndex = 0;
  tourToggle.setAttribute("aria-pressed", "true");
  tourToggle.querySelector("span:first-child").textContent = "Ⅱ";
  tourToggle.querySelector(".tour-label").textContent = "Pause journey";
  showTourStep(tourIndex);
  tourTimer = window.setInterval(() => {
    if (tourIndex >= TOUR.length - 1) { stopTour(); return; }
    showTourStep(tourIndex + 1);
  }, 2200);
}

renderNodes();
renderRoutes();
renderSystem();
selectNode(selectedId);
closeDetail();

document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelector("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "night" ? "day" : "night"));
document.querySelector("#close-detail").addEventListener("click", () => { detailPinned = false; closeDetail(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { stopTour(); detailPinned = false; closeDetail(); }
});

tourToggle.addEventListener("click", () => tourTimer ? stopTour() : startTour());
scrubber.addEventListener("input", () => { stopTour(); showTourStep(scrubber.value); });

const storedTheme = readStoredTheme();
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
applyTheme(storedTheme === "day" || storedTheme === "night" ? storedTheme : preferredTheme, false);

if (!reducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * -7;
    const y = (event.clientY / window.innerHeight - 0.5) * -5;
    mapView.style.setProperty("--shift-x", `${x}px`);
    mapView.style.setProperty("--shift-y", `${y}px`);
  }, { passive: true });
}
