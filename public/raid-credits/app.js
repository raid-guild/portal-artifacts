const disciplines = [
  {
    id: "summoner",
    name: "Summoner",
    sigil: "S",
    color: "#ff6b8c",
    description: "Calls the crew together and turns a promising signal into a clear quest.",
  },
  {
    id: "cleric",
    name: "Cleric",
    sigil: "C",
    color: "#ffc857",
    description: "Protects the party, tends the process, and keeps collaboration healthy.",
  },
  {
    id: "monk",
    name: "Monk",
    sigil: "M",
    color: "#64d6c4",
    description: "Finds focus in the noise and shapes complexity into a usable system.",
  },
  {
    id: "ranger",
    name: "Ranger",
    sigil: "R",
    color: "#89e36b",
    description: "Maps the terrain, tracks the edge cases, and tests the path ahead.",
  },
  {
    id: "warrior",
    name: "Warrior",
    sigil: "W",
    color: "#ff815f",
    description: "Builds with conviction and carries the implementation across the finish line.",
  },
  {
    id: "paladin",
    name: "Paladin",
    sigil: "P",
    color: "#b28aff",
    description: "Aligns purpose, product, and delivery so the whole raid lands together.",
  },
];

const maxPartySize = 4;
const grid = document.querySelector("[data-discipline-grid]");
const partyList = document.querySelector("[data-party-list]");
const partyEmpty = document.querySelector("[data-party-empty]");
const partyCount = document.querySelector("[data-party-count]");
const partyNotice = document.querySelector("[data-party-notice]");
const shareButton = document.querySelector("[data-share-party]");
const clearButton = document.querySelector("[data-clear-party]");
const playbackButtons = [...document.querySelectorAll("[data-playback-open]")];
const selected = new Set();

function safePartyFromUrl() {
  const requested = new URLSearchParams(window.location.search)
    .get("party")
    ?.split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean);

  if (!requested) return [];

  const known = new Set(disciplines.map(({ id }) => id));
  return [...new Set(requested)].filter((id) => known.has(id)).slice(0, maxPartySize);
}

function updateUrl() {
  const url = new URL(window.location.href);
  if (selected.size) {
    url.searchParams.set("party", [...selected].join(","));
  } else {
    url.searchParams.delete("party");
  }
  try {
    window.history.replaceState({}, "", url);
  } catch {
    // A sandboxed iframe without same-origin permission can reject URL updates.
  }
  return url;
}

function renderParty() {
  const atLimit = selected.size >= maxPartySize;
  partyList.replaceChildren();

  disciplines.forEach((discipline) => {
    const button = grid.querySelector(`[data-discipline="${discipline.id}"]`);
    const isSelected = selected.has(discipline.id);
    button.setAttribute("aria-pressed", String(isSelected));
    button.disabled = atLimit && !isSelected;
    button.querySelector("[data-action]").textContent = isSelected ? "−" : "+";

    if (!isSelected) return;

    const item = document.createElement("li");
    item.innerHTML = `<span style="color: ${discipline.color}" aria-hidden="true">${discipline.sigil}</span><strong>${discipline.name}</strong>`;
    partyList.append(item);
  });

  partyCount.textContent = `${selected.size} / ${maxPartySize}`;
  partyEmpty.hidden = selected.size > 0;
  shareButton.disabled = selected.size === 0;
  clearButton.disabled = selected.size === 0;
  playbackButtons.forEach((button) => {
    button.disabled = selected.size === 0;
  });
  updateUrl();
}

disciplines.forEach((discipline) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "discipline";
  button.dataset.discipline = discipline.id;
  button.style.setProperty("--role-color", discipline.color);
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `
    <span class="discipline__sigil" aria-hidden="true">${discipline.sigil}</span>
    <span>
      <strong>${discipline.name}</strong>
      <small>${discipline.description}</small>
    </span>
    <span class="discipline__action" data-action aria-hidden="true">+</span>
  `;
  button.addEventListener("click", () => {
    partyNotice.textContent = "";
    if (selected.has(discipline.id)) {
      selected.delete(discipline.id);
    } else if (selected.size < maxPartySize) {
      selected.add(discipline.id);
    }
    renderParty();
  });
  grid.append(button);
});

safePartyFromUrl().forEach((id) => selected.add(id));
renderParty();

clearButton.addEventListener("click", () => {
  selected.clear();
  partyNotice.textContent = "Roster cleared.";
  renderParty();
  grid.querySelector("button")?.focus();
});

shareButton.addEventListener("click", async () => {
  const url = updateUrl();
  try {
    await navigator.clipboard.writeText(url.href);
    partyNotice.textContent = "Party link copied.";
  } catch {
    partyNotice.textContent = "Party link is ready in the address bar.";
  }
});

const video = document.querySelector("[data-archive-video]");
const videoButton = document.querySelector("[data-video-toggle]");
const mediaStatus = document.querySelector("[data-media-status]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setVideoButton(isPaused) {
  videoButton.textContent = isPaused ? "Play background" : "Pause background";
  videoButton.setAttribute("aria-pressed", String(isPaused));
}

function startVideo() {
  if (reducedMotion.matches) {
    video.pause();
    mediaStatus.textContent = "Reduced motion · transmission paused";
    setVideoButton(true);
    return;
  }

  video.play().then(
    () => {
      mediaStatus.textContent = "Archive transmission online";
      setVideoButton(false);
    },
    () => {
      mediaStatus.textContent = "Transmission ready · press play";
      setVideoButton(true);
    },
  );
}

video.addEventListener("canplay", startVideo, { once: true });
video.addEventListener("error", () => {
  mediaStatus.textContent = "Archive video unavailable · static mode active";
  videoButton.hidden = true;
});

videoButton.addEventListener("click", () => {
  if (video.paused) {
    video.play().then(() => {
      mediaStatus.textContent = "Archive transmission online";
      setVideoButton(false);
    });
  } else {
    video.pause();
    mediaStatus.textContent = "Archive transmission paused";
    setVideoButton(true);
  }
});

reducedMotion.addEventListener("change", startVideo);
if (video.readyState >= 3) startVideo();

const audio = document.querySelector("[data-archive-audio]");
const audioStatus = document.querySelector("[data-audio-status]");
const playback = document.querySelector("[data-playback]");
const playbackVideo = document.querySelector("[data-playback-video]");
const playbackClose = document.querySelector("[data-playback-close]");
const playbackCredits = document.querySelector("[data-playback-credits]");
const playbackStatus = document.querySelector("[data-playback-status]");
const backgroundContent = [...document.body.children].filter(
  (element) => !element.matches(".playback, script, noscript"),
);
let playbackTrigger = null;
let lockedScrollY = 0;
let resumeBackgroundVideo = false;

function renderPlaybackCredits() {
  playbackCredits.replaceChildren();
  disciplines.forEach((discipline) => {
    if (!selected.has(discipline.id)) return;
    const item = document.createElement("li");
    item.style.setProperty("--credit-color", discipline.color);
    item.innerHTML = `
      <span aria-hidden="true">${discipline.sigil}</span>
      <div>
        <strong>${discipline.name}</strong>
        <small>${discipline.description}</small>
      </div>
    `;
    playbackCredits.append(item);
  });
}

function lockPageScroll() {
  lockedScrollY = window.scrollY;
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.classList.add("playback-open");
}

function unlockPageScroll() {
  const scrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  document.body.classList.remove("playback-open");
  document.body.style.top = "";
  window.scrollTo(0, lockedScrollY);
  window.requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = scrollBehavior;
  });
}

async function openPlayback(trigger) {
  if (!selected.size || !playback.hidden) return;

  playbackTrigger = trigger;
  resumeBackgroundVideo = !video.paused;
  video.pause();
  renderPlaybackCredits();
  lockPageScroll();
  playback.hidden = false;
  backgroundContent.forEach((element) => {
    element.inert = true;
  });
  playback.classList.remove("is-playing");
  void playback.offsetWidth;
  playback.classList.add("is-playing");
  playbackClose.focus();

  audio.currentTime = 0;
  playbackVideo.currentTime = 0;
  const playbackAttempts = [audio.play()];
  if (!reducedMotion.matches) playbackAttempts.push(playbackVideo.play());
  const results = await Promise.allSettled(playbackAttempts);
  const audioStarted = results[0]?.status === "fulfilled";
  playbackStatus.textContent = audioStarted
    ? reducedMotion.matches
      ? "Reduced motion mode · credits are stationary"
      : "Voyager playing · close or press Escape to stop"
    : "Audio unavailable · visual credits continue";
}

function closePlayback() {
  if (playback.hidden) return;

  audio.pause();
  audio.currentTime = 0;
  playbackVideo.pause();
  playbackVideo.currentTime = 0;
  playback.classList.remove("is-playing");
  playback.hidden = true;
  backgroundContent.forEach((element) => {
    element.inert = false;
  });
  playbackStatus.textContent = "";
  unlockPageScroll();

  if (resumeBackgroundVideo && !reducedMotion.matches) {
    video.play().catch(() => {});
  }
  playbackTrigger?.focus();
  playbackTrigger = null;
}

playbackButtons.forEach((button) => {
  button.addEventListener("click", () => openPlayback(button));
});

playbackClose.addEventListener("click", closePlayback);

document.addEventListener("keydown", (event) => {
  if (playback.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closePlayback();
  } else if (event.key === "Tab") {
    event.preventDefault();
    playbackClose.focus();
  }
});

audio.addEventListener("ended", closePlayback);
audio.addEventListener("error", () => {
  audioStatus.textContent = "The archive track could not be loaded. All other features remain available.";
  if (!playback.hidden) playbackStatus.textContent = "Audio unavailable · visual credits continue";
});
