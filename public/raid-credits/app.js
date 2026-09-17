const snapshot = window.RAID_CREDITS_SNAPSHOT;
const members = Array.isArray(snapshot?.members) ? snapshot.members : [];
const creditColors = ["#ff6b8c", "#ffc857", "#64d6c4", "#89e36b", "#ff815f", "#b28aff"];

const memberGrid = document.querySelector("[data-member-grid]");
const memberSearch = document.querySelector("[data-member-search]");
const memberMatch = document.querySelector("[data-member-match]");
const rosterCount = document.querySelector("[data-roster-count]");
const snapshotDate = document.querySelector("[data-snapshot-date]");
const playbackButtons = [...document.querySelectorAll("[data-playback-open]")];

function memberInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? `${words[0][0]}${words.at(-1)[0]}` : words[0]?.slice(0, 2) || "RG")
    .toUpperCase();
}

function renderMemberGrid(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleMembers = normalizedQuery
    ? members.filter(({ displayName, handle }) =>
        `${displayName} ${handle}`.toLocaleLowerCase().includes(normalizedQuery),
      )
    : members;
  const fragment = document.createDocumentFragment();

  visibleMembers.forEach((member, index) => {
    const card = document.createElement("article");
    card.className = "member-card";
    card.setAttribute("role", "listitem");
    card.style.setProperty("--member-color", creditColors[index % creditColors.length]);

    const sigil = document.createElement("span");
    sigil.className = "member-card__sigil";
    sigil.setAttribute("aria-hidden", "true");
    sigil.textContent = memberInitials(member.displayName);

    const identity = document.createElement("div");
    const name = document.createElement("strong");
    const handle = document.createElement("small");
    name.textContent = member.displayName;
    handle.textContent = `@${member.handle}`;
    identity.append(name, handle);
    card.append(sigil, identity);
    fragment.append(card);
  });

  memberGrid.replaceChildren(fragment);
  memberMatch.textContent = normalizedQuery
    ? `${visibleMembers.length} of ${members.length} raiders shown`
    : `${members.length} raiders shown`;
}

rosterCount.textContent = `${members.length} raiders`;
snapshotDate.textContent = snapshot?.capturedAt
  ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(
      new Date(snapshot.capturedAt),
    )
  : "Unavailable";
playbackButtons.forEach((button) => {
  button.disabled = members.length === 0;
});
renderMemberGrid();

memberSearch.addEventListener("input", () => renderMemberGrid(memberSearch.value));

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
const playbackRoll = document.querySelector("[data-playback-roll]");
const playbackStatus = document.querySelector("[data-playback-status]");
const backgroundContent = [...document.body.children].filter(
  (element) => !element.matches(".playback, script, noscript"),
);
let playbackTrigger = null;
let lockedScrollY = 0;
let resumeBackgroundVideo = false;

function renderPlaybackCredits() {
  const fragment = document.createDocumentFragment();
  members.forEach((member, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--credit-color", creditColors[index % creditColors.length]);

    const sigil = document.createElement("span");
    sigil.setAttribute("aria-hidden", "true");
    sigil.textContent = memberInitials(member.displayName);

    const identity = document.createElement("div");
    const name = document.createElement("strong");
    const handle = document.createElement("small");
    name.textContent = member.displayName;
    handle.textContent = `@${member.handle}`;
    identity.append(name, handle);
    item.append(sigil, identity);
    fragment.append(item);
  });
  playbackCredits.replaceChildren(fragment);
  playbackRoll.style.setProperty("--credit-duration", `${Math.max(96, members.length * 0.75)}s`);
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
  if (!members.length || !playback.hidden) return;

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
      : `${members.length} raiders · close or press Escape to stop`
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

audio.addEventListener("ended", () => {
  if (!playback.hidden) playbackStatus.textContent = "Soundtrack complete · credits continue";
});
audio.addEventListener("error", () => {
  audioStatus.textContent = "The archive track could not be loaded. All other features remain available.";
  if (!playback.hidden) playbackStatus.textContent = "Audio unavailable · visual credits continue";
});
