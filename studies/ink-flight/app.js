import { createInkwash } from './vendor/inkwash.js';
import { activeCue, canInstallBundledLyrics, validateCues } from './lyrics.mjs';
import { clearPointerPulse, clearPointerResponse, pointerResponse, updatePointerPulse } from './pointer.mjs';
import { drawRoad } from './road.mjs';
import { captureDust, drawDust } from './dust.mjs';
import { drawSunset, loadSunset } from './sunset.mjs';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('scene');
  const ctx = canvas.getContext('2d', { alpha: true });
  const washCanvas = $('wash');
  let inkwash = null;
  let monochrome = false;
  const paletteButton = $('paletteButton');
  const mouseButton = $('mouseButton');
  let mouseEnabled = true;
  const pointer = {x: 0, y: 0, active: false};
  const pointerPulse = {cooldown: 0};
  let fallback = new URLSearchParams(location.search).has('fallback');
  const audio = $('audio');
  const playButton = $('playButton');
  const timeline = $('timeline');
  const status = $('status');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const random = (a, b) => a + Math.random() * (b - a);
  let W = innerWidth, H = innerHeight, dpr = 1;
  let time = 0, lastTime = 0, hovered = null, selected = null;
  let audioContext, analyser, mediaSource, gain, frequency;
  let bass = 0, mid = 0, treble = 0;
  let messageTimer, objectURL, sourceGeneration = 0, playPending = false;
  let lyricCues = [], displayedCue = null;
  let lyricDocument = {cues: []};
  let customLyricsApplied = false, lyricsEditorDirty = false, pendingBundledLyrics = null;
  const lyricOverlay = $('lyricOverlay');
  const lyricText = $('lyricText');
  const lyricsDialog = $('lyricsDialog');
  const lyricsEditor = $('lyricsEditor');
  const lyricsEnabled = $('lyricsEnabled');
  const lyricsError = $('lyricsError');
  const lyricsDraftNote = $('lyricsDraftNote');
  let zoomState = 'flock', zoomProgress = 0, zoomClock = 0, detailClock = 0;
  let roadState = 'off', roadClock = 0, roadReveal = 0, roadExitVisibility = 0;
  let dustState = null, dustClock = 0;
  let landscapeKind = 'road', sunsetReady = false;
  const sunsetButton = $('sunsetButton');
  const roadButton = $('roadButton');
  const followButton = $('followButton');
  const sceneAvailable = () => zoomState === 'flock' && roadState === 'off';
  function setSceneButtons() {
    const available = sceneAvailable();
    roadButton.disabled = !available;
    sunsetButton.disabled = !available || !sunsetReady;
    followButton.disabled = !available;
  }
  function showDetailControls(label) {
    $('detailLabel').textContent = label;
    $('detailControls').classList.add('active');
    $('detailControls').classList.toggle('road-active', !label.startsWith('01'));
    $('detailControls').setAttribute('aria-hidden', 'false');
    $('detailControls').removeAttribute('inert');
    setSceneButtons();
  }
  function hideDetailControls() {
    $('detailControls').classList.remove('active');
    $('detailControls').classList.remove('road-active');
    $('detailControls').setAttribute('aria-hidden', 'true');
    $('detailControls').setAttribute('inert', '');
  }
  function clearPointerInteraction() {
    pointer.active = false;
    hovered = null;
    canvas.style.cursor = 'default';
    clearPointerPulse(pointerPulse);
    for (const member of birds) clearPointerResponse(member.pointerState);
  }
  let target = null, origin = { x: 0, y: 0 };
  let previousFrame = 0;
  let fpsFrames = 0, fpsElapsed = 0;
  const ZOOM_FRAME_RATE = 24;
  const ZOOM_FRAME_COUNT = 384;
  const ZOOM_DURATION = ZOOM_FRAME_COUNT / ZOOM_FRAME_RATE;

  const sprites = new Map();
  const loading = new Set();
  const failedSprites = new Set();
  const MAX_LOADING = 4;
  const spritePath = index => `assets/zoom-birds/frame_${String(index + 1).padStart(4, '0')}.webp`;
  function loadSprite(index) {
    index = clamp(index, 0, ZOOM_FRAME_COUNT - 1);
    if (sprites.has(index) || loading.has(index) || failedSprites.has(index) || loading.size >= MAX_LOADING) return;
    loading.add(index);
    const image = new Image();
    image.onload = () => {
      loading.delete(index);
      sprites.set(index, image);
      // Keep decoded image memory bounded even during repeated zooms.
      while (sprites.size > 20) sprites.delete(sprites.keys().next().value);
    };
    image.onerror = () => {
      loading.delete(index);
      failedSprites.add(index);
      if (failedSprites.size === 1) showStatus('A bird animation frame could not be loaded.');
    };
    image.src = spritePath(index);
  }
  for (let i = 0; i < 8; i++) loadSprite(i);

  function resize() {
    const oldW = W, oldH = H;
    W = innerWidth; H = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (inkwash) {
      try { inkwash.resize(W, H); } catch (error) { useFallback(error); }
    }
    if (oldW && oldH && birds.length) {
      for (const bird of birds) { bird.x *= W / oldW; bird.y *= H / oldH; }
      origin.x *= W / oldW;
      origin.y *= H / oldH;
    }
    const desired = birdCount();
    if (birds.length > desired) {
      birds.length = desired;
      if (hovered && hovered.id >= desired) {
        hovered = null;
        canvas.style.cursor = 'default';
      }
      if (selected && selected.id >= desired) selected = null;
      // A return zoom must still land on a bird visible in the resized flock.
      if (target && target.id >= desired) target = nearestBird(target.x, target.y, Infinity) || birds[0];
    } else {
      for (let i = birds.length; i < desired; i++) birds.push(new Bird(i));
    }
  }

  const birds = [];
  const birdCount = () => W < 700 ? 180 : 280;
  const EDGE = 80;
  const NEIGHBOR_RADIUS = 125;
  const shortest = (delta, span) => {
    const circumference = span + 2 * EDGE;
    return delta - Math.round(delta / circumference) * circumference;
  };
  const steer = (x, y, vx, vy, speed, maxForce) => {
    const mag = Math.hypot(x, y);
    if (mag < 1e-5) return [0, 0];
    const dx = x / mag * speed - vx, dy = y / mag * speed - vy;
    const force = Math.hypot(dx, dy) || 1;
    return [dx / force * Math.min(force, maxForce), dy / force * Math.min(force, maxForce)];
  };
  function neighborhood(snapshot) {
    const columns = Math.max(1, Math.floor((W + 2 * EDGE) / NEIGHBOR_RADIUS));
    const rows = Math.max(1, Math.floor((H + 2 * EDGE) / NEIGHBOR_RADIUS));
    const cellW = (W + 2 * EDGE) / columns;
    const cellH = (H + 2 * EDGE) / rows;
    const cells = Array.from({length: columns * rows}, () => []);
    const index = (column, row) => ((row + rows) % rows) * columns + (column + columns) % columns;
    const column = x => Math.min(columns - 1, Math.max(0, Math.floor((x + EDGE) / cellW)));
    const row = y => Math.min(rows - 1, Math.max(0, Math.floor((y + EDGE) / cellH)));
    for (const bird of snapshot) cells[index(column(bird.x), row(bird.y))].push(bird);
    return {snapshot, cells, index, column, row};
  }
  function groupGuide(seconds, group) {
    const split = Math.sin(seconds * TAU / 11.2 + .55);
    const direction = group ? 1 : -1;
    const spread = Math.abs(split);
    const baseX = W * (.50 + .19 * Math.sin(seconds * .34));
    const baseY = H * (.47 + .16 * Math.sin(seconds * .29 + .8));
    return {
      x: baseX + direction * W * .105 * spread * Math.cos(seconds * .19 + group),
      y: baseY + direction * H * .085 * spread * Math.sin(seconds * .23 + group)
    };
  }
  class Bird {
    constructor(i) {
      this.id = i;
      this.group = i % 2;
      const g = groupGuide(0, this.group);
      const theta = random(0, TAU), radius = Math.sqrt(Math.random()) * Math.min(W,H) * .14;
      this.x = g.x + Math.cos(theta) * radius;
      this.y = g.y + Math.sin(theta) * radius * .75;
      const heading = random(-.7, .7);
      const speed = random(110, 146);
      this.vx = Math.cos(heading) * speed;
      this.vy = Math.sin(heading) * speed;
      this.heading = heading;
      this.size = random(6, 11);
      this.width = random(2, 4);
      this.depth = random(.72, 1.15);
      this.delay = random(0, .8);
      this.pointerState = {time: 0, ready: true, x: 0, y: 0};
    }
    update(dt, neighborhood, pulse) {
      let sx=0, sy=0, ax=0, ay=0, cx=0, cy=0, na=0, nc=0;
      const {snapshot, cells, index, column, row} = neighborhood;
      const self = snapshot[this.id];
      const nearest = [];
      const separation = 16, alignment = 84, cohesion = 125;
      const centerColumn = column(self.x), centerRow = row(self.y);
      const visited = new Set();
      for (let offsetY = -1; offsetY <= 1; offsetY++) for (let offsetX = -1; offsetX <= 1; offsetX++) {
        const cellIndex = index(centerColumn + offsetX, centerRow + offsetY);
        if (visited.has(cellIndex)) continue;
        visited.add(cellIndex);
        for (const other of cells[cellIndex]) {
          if (other.id === this.id) continue;
          const dx=shortest(other.x-self.x,W), dy=shortest(other.y-self.y,H);
          const d2=dx*dx+dy*dy;
          if (d2 >= cohesion*cohesion || d2 < .01) continue;
          const item={other,dx,dy,d2};
          let at=nearest.length;
          while (at>0 && nearest[at-1].d2>d2) at--;
          if (at<8) { nearest.splice(at,0,item); if (nearest.length>8) nearest.pop(); }
        }
      }
      for (const {other,dx,dy,d2} of nearest) {
        const d=Math.sqrt(d2);
        if (d<separation) {
          const weight=(separation-d)/separation;
          sx-=dx/d*weight; sy-=dy/d*weight;
        }
        if (d<alignment) { ax+=other.vx; ay+=other.vy; na++; }
        if (d>27) { cx+=dx; cy+=dy; nc++; }
      }
      const speed=130+mid*31, force=198;
      const sep=steer(sx,sy,self.vx,self.vy,speed,force);
      const ali=steer(na?ax/na:0,na?ay/na:0,self.vx,self.vy,speed,force);
      const coh=steer(nc?cx/nc:0,nc?cy/nc:0,self.vx,self.vy,speed,force);
      const seconds=time/1000-this.delay;
      const guide=groupGuide(seconds,this.group);
      const next=groupGuide(seconds+.12,this.group);
      const toX=guide.x-self.x, toY=guide.y-self.y;
      const far=Math.hypot(toX,toY)>34;
      const pull=far?steer(toX,toY,self.vx,self.vy,speed,force):[0,0];
      const path=steer(next.x-guide.x,next.y-guide.y,self.vx,self.vy,speed,force);
      const wave=Math.sin(self.x*.012+self.y*.008+seconds*1.3+this.group);
      const [px, py, disrupted] = sceneAvailable() && mouseEnabled
        ? pointerResponse(self.x, self.y, pointer, this.id, this.pointerState, dt, pulse)
        : [0, 0, 0];
      const together = 1 - disrupted * .92;
      let fx=sep[0]*1.4+ali[0]*1.3*together+coh[0]*.75*together+pull[0]*.52*together+path[0]*.6*together+Math.cos(wave)*7+px;
      let fy=sep[1]*1.4+ali[1]*1.3*together+coh[1]*.75*together+pull[1]*.52*together+path[1]*.6*together+Math.sin(wave)*7+py;
      const magnitude=Math.hypot(fx,fy) || 1;
      const forceLimit = disrupted ? 340 : 180;
      if (magnitude>forceLimit) { fx=fx/magnitude*forceLimit; fy=fy/magnitude*forceLimit; }
      const vx=self.vx+fx*dt, vy=self.vy+fy*dt;
      const desired=Math.atan2(vy,vx);
      const turn=Math.atan2(Math.sin(desired-this.heading),Math.cos(desired-this.heading));
      const turnLimit = disrupted ? 5.5 : 2.7;
      this.heading+=clamp(turn,-turnLimit*dt,turnLimit*dt);
      const chosen=clamp(Math.hypot(vx,vy),102,disrupted ? 210 : 168);
      this.vx=Math.cos(this.heading)*chosen; this.vy=Math.sin(this.heading)*chosen;
      this.x+=this.vx*dt; this.y+=this.vy*dt;
      if (this.x < -EDGE) this.x += W+2*EDGE;
      if (this.x > W+EDGE) this.x -= W+2*EDGE;
      if (this.y < -EDGE) this.y += H+2*EDGE;
      if (this.y > H+EDGE) this.y -= H+2*EDGE;
    }
    draw(scale=1, alpha=1) {
      const length=this.size*this.depth*scale;
      const half=length*.5;
      const width=this.width*this.depth*scale;
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.heading);
      ctx.globalAlpha=alpha*(this.depth<.9?.72:.95);
      ctx.fillStyle='#242a2a';
      ctx.beginPath();
      ctx.moveTo(half,0);
      ctx.quadraticCurveTo(0,-width,-half,0);
      ctx.quadraticCurveTo(0,width,half,0);
      ctx.fill();
      ctx.restore();
    }
  }
  for (let i = 0; i < birdCount(); i++) birds.push(new Bird(i));
  function useFallback(error) {
    if (inkwash) { inkwash.dispose(); inkwash = null; }
    fallback = true;
    washCanvas.style.display = 'none';
    document.body.dataset.inkEngine = 'canvas';
    if (error) {
      console.warn('Inkwash engine unavailable:', error);
      document.body.dataset.inkError = error.message || String(error);
      showStatus('Fluid ink unavailable; using the Canvas wash.');
    }
  }
  if (!fallback) {
    try { inkwash = createInkwash(washCanvas); inkwash.setMonochrome(monochrome); document.body.dataset.inkEngine = 'webgl2'; }
    catch (error) { useFallback(error); }
  } else useFallback();
  washCanvas.addEventListener('webglcontextlost', event => { event.preventDefault(); useFallback(new Error('WebGL context lost')); });
  paletteButton.addEventListener('click', () => {
    monochrome = !monochrome;
    inkwash?.setMonochrome(monochrome);
    paletteButton.textContent = monochrome ? 'Color' : 'B&W';
    paletteButton.setAttribute('aria-label', monochrome ? 'Switch ink wash to color' : 'Switch ink wash to black and white');
    paletteButton.setAttribute('aria-pressed', String(monochrome));
    document.body.dataset.palette = monochrome ? 'monochrome' : 'color';
  });
  mouseButton.addEventListener('click', () => {
    mouseEnabled = !mouseEnabled;
    pointer.active = false;
    if (!mouseEnabled) {
      clearPointerPulse(pointerPulse);
      for (const bird of birds) clearPointerResponse(bird.pointerState);
    }
    mouseButton.textContent = mouseEnabled ? 'Mouse: On' : 'Mouse: Off';
    mouseButton.setAttribute('aria-label', mouseEnabled ? 'Turn mouse interaction off' : 'Turn mouse interaction on');
    mouseButton.setAttribute('aria-pressed', String(mouseEnabled));
  });
  resize();
  addEventListener('resize', resize);

  function measureDock() {
    const dock = document.querySelector('.dock');
    document.documentElement.style.setProperty('--dock-clearance', `${Math.ceil(innerHeight - dock.getBoundingClientRect().top)}px`);
  }
  new ResizeObserver(measureDock).observe(document.querySelector('.dock'));
  addEventListener('resize', measureDock);
  measureDock();

  function syncLyrics() {
    const cue = lyricsEnabled.checked ? activeCue(lyricCues, audio.currentTime) : null;
    if (cue !== displayedCue) {
      displayedCue = cue;
      lyricText.textContent = cue?.text || '';
      lyricOverlay.classList.toggle('has-lyric', !!cue);
    }
    const t = audio.currentTime;
    const opacity = cue ? (reducedMotion.matches ? 1 :
      Math.min(1, Math.max(0, (t - cue.start) / .28), Math.max(0, (cue.end - t) / .34))) : 0;
    lyricOverlay.style.opacity = String(opacity);
  }
  function syncLyricsEditor() {
    lyricsEditor.value = JSON.stringify(lyricDocument, null, 2);
    lyricsDraftNote.hidden = lyricDocument.status !== 'draft';
  }
  function installBundledLyrics() {
    if (!pendingBundledLyrics || !canInstallBundledLyrics(sourceGeneration, customLyricsApplied, lyricsDialog.open, lyricsEditorDirty)) return;
    lyricDocument = pendingBundledLyrics;
    pendingBundledLyrics = null;
    lyricCues = lyricDocument.cues;
    syncLyricsEditor();
    syncLyrics();
  }
  const bundledLyricsGeneration = sourceGeneration;
  fetch('assets/lyrics.json').then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(data => {
    const cues = validateCues(data);
    if (sourceGeneration !== bundledLyricsGeneration || customLyricsApplied) return;
    pendingBundledLyrics = {...data, cues};
    installBundledLyrics();
  }).catch(() => {
    if (sourceGeneration === bundledLyricsGeneration) showStatus('Timed lyrics could not be loaded.');
  });
  const songDialog = $('songDialog');
  $('songInfoButton').addEventListener('click', () => songDialog.showModal());
  $('songInfoClose').addEventListener('click', () => songDialog.close());
  $('lyricsButton').addEventListener('click', () => {
    lyricsError.textContent = '';
    syncLyricsEditor();
    lyricsDialog.showModal();
  });
  lyricsEditor.addEventListener('input', () => { lyricsEditorDirty = true; });
  lyricsDialog.addEventListener('close', () => {
    // Closing discards unapplied edits; a delayed bundled draft may now load.
    lyricsEditorDirty = false;
    installBundledLyrics();
  });
  $('lyricsClose').addEventListener('click', () => lyricsDialog.close());
  lyricsEnabled.addEventListener('change', syncLyrics);
  $('lyricsForm').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const data = JSON.parse(lyricsEditor.value);
      const cues = validateCues(data);
      lyricCues = cues;
      lyricDocument = {...data, cues};
      customLyricsApplied = true;
      pendingBundledLyrics = null;
      lyricsEditorDirty = false;
      lyricsError.textContent = '';
      syncLyricsEditor();
      syncLyrics();
      lyricsDialog.close();
    } catch (error) {
      lyricsError.textContent = error instanceof SyntaxError ? 'Invalid JSON. Check commas and quotation marks.' : error.message;
    }
  });


  function showStatus(message) {
    status.textContent = message;
    status.classList.add('show');
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => status.classList.remove('show'), 3000);
  }

  function setupAudio() {
    if (audioContext) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { showStatus('This browser does not support audio analysis.'); return; }
    audioContext = new AudioContextClass();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = .82;
    frequency = new Uint8Array(analyser.frequencyBinCount);
    gain = audioContext.createGain();
    gain.gain.value = Number($('volume').value) / 100;
    mediaSource = audioContext.createMediaElementSource(audio);
    mediaSource.connect(analyser);
    analyser.connect(gain);
    gain.connect(audioContext.destination);
  }
  // A Blob URL makes the bundled track seekable even on simple local servers
  // that do not implement HTTP Range requests. The original src remains a
  // fallback if fetching fails.
  const bundledReady = fetch('assets/my-head-spins-full.m4a')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.blob();
    })
    .then(blob => {
      if (sourceGeneration !== 0) return;
      objectURL = URL.createObjectURL(blob);
      audio.src = objectURL;
      audio.load();
    })
    .catch(() => {
      if (sourceGeneration === 0) showStatus('Using the original audio source; seeking may be limited.');
    });
  async function play() {
    if (playPending) return;
    const requestGeneration = sourceGeneration;
    playPending = true;
    try {
      setupAudio();
      if (audioContext?.state === 'suspended') await audioContext.resume();
      if (requestGeneration === 0) await bundledReady;
      if (requestGeneration !== sourceGeneration) return;
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      if (requestGeneration === sourceGeneration) showStatus(`Audio could not play: ${error.message || 'try another file'}`);
    } finally {
      if (requestGeneration === sourceGeneration) playPending = false;
    }
  }
  function togglePlay() { if (audio.paused) play(); else audio.pause(); }
  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }
  function syncTransport() {
    const isPlaying = !audio.paused && !audio.ended;
    playButton.classList.toggle('is-playing', isPlaying);
    playButton.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
    $('soundIndicator').classList.toggle('is-paused', !isPlaying);
    $('soundIndicator').lastChild.textContent = isPlaying ? ' SOUND ON' : ' SOUND OFF';
    $('currentTime').textContent = formatTime(audio.currentTime);
    $('duration').textContent = formatTime(audio.duration);
    const progress = audio.duration ? audio.currentTime / audio.duration : 0;
    if (!timeline.matches(':active')) timeline.value = String(Math.round(progress * 1000));
    timeline.style.setProperty('--progress', `${progress * 100}%`);
    syncLyrics();
  }
  playButton.addEventListener('click', togglePlay);
  for (const event of ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate', 'seeked']) audio.addEventListener(event, syncTransport);
  audio.addEventListener('error', () => showStatus('This audio file could not be loaded. Choose another file.'));
  timeline.addEventListener('input', () => {
    const progress = Number(timeline.value) / 1000;
    timeline.style.setProperty('--progress', `${progress * 100}%`);
    if (Number.isFinite(audio.duration)) audio.currentTime = progress * audio.duration;
    syncTransport();
  });
  $('volume').addEventListener('input', event => { if (gain) gain.gain.value = Number(event.target.value) / 100; });
  $('loadButton').addEventListener('click', () => $('audioFile').click());
  $('audioFile').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const wasPlaying = !audio.paused || playPending;
    sourceGeneration++;
    pendingBundledLyrics = null;
    lyricCues = [];
    lyricDocument = {cues: []};
    displayedCue = null;
    lyricText.textContent = '';
    lyricOverlay.classList.remove('has-lyric');
    lyricOverlay.style.opacity = '0';
    syncLyricsEditor();
    playPending = false;
    audio.pause();
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = URL.createObjectURL(file);
    audio.src = objectURL;
    audio.load();
    $('trackName').textContent = file.name.replace(/\.[^.]+$/, '');
    showStatus(`Loaded ${file.name}`);
    if (wasPlaying) await play();
    event.target.value = '';
  });
  addEventListener('pagehide', event => {
    if (!event.persisted && objectURL) {
      URL.revokeObjectURL(objectURL);
      objectURL = null;
    }
    if (!event.persisted) inkwash?.dispose();
  });

  function measureBands(dt) {
    let low = 0, middle = 0, upper = 0;
    if (analyser && !audio.paused) {
      analyser.getByteFrequencyData(frequency);
      const nyquist = audioContext.sampleRate / 2;
      const binHz = nyquist / frequency.length;
      const average = (from, to) => {
        let sum = 0, count = 0;
        for (let i = Math.max(1, Math.floor(from / binHz)); i < Math.min(frequency.length, Math.ceil(to / binHz)); i++) {
          sum += frequency[i]; count++;
        }
        return count ? sum / count / 255 : 0;
      };
      low = average(35, 180); middle = average(180, 1800); upper = average(1800, 8000);
    }
    const smooth = (value, wanted) => lerp(value, wanted, 1 - Math.exp(-dt * (wanted > value ? 5 : 2.5)));
    bass = smooth(bass, low); mid = smooth(mid, middle); treble = smooth(treble, upper);
  }

  const stains = [
    {x:.2,y:.57,r:.34,color:[64,91,91],phase:1.1},
    {x:.49,y:.45,r:.38,color:[89,109,104],phase:2.7},
    {x:.84,y:.33,r:.32,color:[158,126,88],phase:4.3},
    {x:.7,y:.73,r:.25,color:[117,137,130],phase:5.8}
  ];
  function paintWash(dt) {
    ctx.fillStyle = monochrome ? '#efefef' : '#eee9dd'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < stains.length; i++) {
      const stain = stains[i];
      const movement = reducedMotion.matches ? .15 : 1;
      const x = W * stain.x + Math.sin(time * .00012 + stain.phase) * W * .055 * movement;
      const y = H * stain.y + Math.cos(time * .00016 + stain.phase) * H * .05 * movement;
      const radius = Math.max(W, H) * stain.r * (1 + bass * .16);
      const [r0,g0,b0] = stain.color;
      const gray = Math.round(.2126*r0 + .7152*g0 + .0722*b0);
      const [r,g,b] = monochrome ? [gray,gray,gray] : [r0,g0,b0];
      const gradient = ctx.createRadialGradient(x, y, radius * .07, x, y, radius);
      gradient.addColorStop(0, `rgba(${r},${g},${b},${.24 + bass * .12})`);
      gradient.addColorStop(.38, `rgba(${r},${g},${b},${.17 + mid * .08})`);
      gradient.addColorStop(.7, `rgba(${r},${g},${b},.07)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.save(); ctx.translate(x, y); ctx.scale(1.2, .72);
      ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.fill(); ctx.restore();
    }
    // Ragged translucent pigment blooms, composed from overlapping wet edges.
    for (let layer = 0; layer < 3; layer++) {
      const centerX = W * (.39 + layer * .17);
      const centerY = H * (.51 + Math.sin(layer * 2.1) * .13);
      const radius = Math.min(W, H) * (.25 + layer * .025) * (1 + bass * .12);
      ctx.beginPath();
      for (let point = 0; point <= 96; point++) {
        const a = point / 96 * TAU;
        const wave = 1 + .12 * Math.sin(a * 5 + layer) + .07 * Math.cos(a * 9 - layer * 2) + .05 * Math.sin(a * 17 + time * .00024);
        const px = centerX + Math.cos(a) * radius * wave * 1.55;
        const py = centerY + Math.sin(a) * radius * wave * .61;
        if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = monochrome ? 'rgba(90,90,90,.075)' : layer === 1 ? 'rgba(105,128,123,.075)' : 'rgba(99,91,75,.06)';
      ctx.lineWidth = 1.3 + mid * 3;
      ctx.stroke();
    }
    // Flecks follow upper frequencies, but stay sparse and quiet.
    const flecks = 16 + Math.round(treble * 42);
    for (let i = 0; i < flecks; i++) {
      const seed = i * 127.1;
      const x = (Math.sin(seed * 12.17) * 43758.5 % 1 + 1) % 1 * W;
      const y = (Math.cos(seed * 8.43) * 23421.1 % 1 + 1) % 1 * H;
      const radius = .5 + (i % 4) * .38 + treble * .6;
      ctx.fillStyle = `rgba(${monochrome ? '78,78,78' : '72,83,79'},${.04 + treble * .08})`;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    }
  }

  function nearestBird(x, y, maximum = 32) {
    let result = null, best = maximum;
    for (const bird of birds) {
      const distance = Math.hypot(x - bird.x, y - bird.y);
      if (distance < best) { result = bird; best = distance; }
    }
    return result;
  }
  function accessibleBird() {
    return selected || nearestBird(W * .5, H * .47, Infinity) || birds[0];
  }
  function follow(bird) {
    if (!bird || !sceneAvailable()) return;
    target = bird; selected = bird;
    clearPointerInteraction();
    origin = {x: bird.x, y: bird.y};
    zoomState = 'enter'; zoomClock = 0; detailClock = 0; zoomProgress = 0;
    previousFrame = 0;
    showDetailControls('01 / FLIGHT');
    $('captionText').textContent = 'A closer look at flight';
    loadSprite(0);
  }
  function startDust(owner) {
    if (reducedMotion.matches) { returnToFlock(); return; }
    dustState = captureDust(canvas, W, H); dustClock = 0;
    if (owner === 'bird') zoomState = 'dust'; else roadState = 'dust';
    hideDetailControls();
    $('captionText').textContent = 'Dust in the wind';
  }
  function dustVisibility() { return 1 - ease(clamp((dustClock - 3.8) / 2.2, 0, 1)); }
  function updateDust(dt) {
    if (!dustState) return;
    dustClock += dt;
    if (zoomState === 'dust') zoomProgress = dustVisibility();
    if (dustClock >= 6) {
      dustState = null;
      if (zoomState === 'dust') { zoomState = 'flock'; zoomProgress = 0; target = null; }
      if (roadState === 'dust') { roadState = 'off'; roadReveal = 0; }
      $('captionText').textContent = 'Choose a bird, then follow its flight';
      setSceneButtons();
    }
  }
  function returnToFlock() {
    if (dustState) return;
    if (roadState !== 'off') {
      if (roadState !== 'exit') {
        roadExitVisibility = roadVisibility();
        roadClock = 0;
        roadState = 'exit';
        hideDetailControls();
      }
      return;
    }
    if (zoomState === 'flock' || zoomState === 'exit') return;
    if (target) origin = {x: target.x, y: target.y};
    zoomState = 'exit'; zoomClock = 0;
    hideDetailControls();
  }
  function startRoad(kind = 'road') {
    if (!sceneAvailable() || (kind === 'sunset' && !sunsetReady)) return;
    landscapeKind = kind;
    clearPointerInteraction();
    selected = null;
    roadState = 'active'; roadClock = 0; roadReveal = 0;
    showDetailControls(kind === 'sunset' ? '03 / SUNSET' : '02 / COUNTRY ROAD');
    $('captionText').textContent = kind === 'sunset' ? 'Dust in the wind' : 'A road into the distance';
  }
  function roadVisibility() {
    if (roadState === 'off') return 0;
    if (roadState === 'dust') return dustVisibility();
    if (roadState === 'exit') return roadExitVisibility * (1 - ease(clamp(roadClock / (reducedMotion.matches ? .16 : 1.2), 0, 1)));
    return ease(clamp(roadClock / (reducedMotion.matches ? .16 : 1), 0, 1));
  }
  function updateRoad(dt) {
    if (roadState === 'off' || roadState === 'dust') return;
    roadClock += dt;
    if (roadState === 'exit') {
      if (roadVisibility() <= 0) {
        roadState = 'off'; roadReveal = 0;
        $('captionText').textContent = 'Choose a bird, then follow its flight';
        setSceneButtons();
      }
      return;
    }
    roadReveal = landscapeKind === 'sunset' ? roadClock : reducedMotion.matches ? 1 : clamp((roadClock - .12) / 10, 0, 1);
    if (roadClock >= (reducedMotion.matches ? 3.16 : landscapeKind === 'sunset' ? 35.2 : 13.12)) {
      if (landscapeKind === 'road') startDust('road'); else returnToFlock();
    }
  }
  function paintRoad() {
    if (roadState === 'dust') return;
    const visibility = roadVisibility();
    if (!visibility) return;
    const dockTop = document.querySelector('.dock').getBoundingClientRect().top;
    // The reference drawing ends above the playback dock, even on a phone.
    const top = Math.min(H * .16, 120);
    const bottom = Math.min(H * .91, dockTop - 20);
    const height = Math.max(100, bottom - top);
    const width = Math.min(W * .83, height * 1.62);
    if (landscapeKind === 'sunset') {
      const sunsetWidth = Math.min(W * .90, height * 1.5);
      const sunsetHeight = sunsetWidth / 1.5;
      drawSunset(ctx, {x:(W-sunsetWidth)/2, y:top+(height-sunsetHeight)/2, width:sunsetWidth, height:sunsetHeight}, roadReveal, visibility, reducedMotion.matches);
    } else drawRoad(ctx, {x:(W-width)/2, y:top, width, height}, roadReveal, visibility);
  }
  canvas.addEventListener('pointermove', event => {
    if (!sceneAvailable()) return;
    if (mouseEnabled && (event.pointerType !== 'touch' || event.buttons)) {
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
    }
    hovered = nearestBird(event.clientX, event.clientY, event.pointerType === 'touch' ? 42 : 30);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  });
  canvas.addEventListener('pointerleave', () => { pointer.active = false; hovered = null; canvas.style.cursor = 'default'; });
  canvas.addEventListener('pointerup', event => { if (event.pointerType === 'touch') pointer.active = false; });
  canvas.addEventListener('pointercancel', () => { pointer.active = false; });
  addEventListener('blur', () => { pointer.active = false; });
  canvas.addEventListener('pointerdown', event => {
    if (!sceneAvailable()) return;
    if (mouseEnabled && event.pointerType === 'touch') { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; }
    const bird = nearestBird(event.clientX, event.clientY, event.pointerType === 'touch' ? 47 : 34);
    if (bird) follow(bird);
  });
  followButton.addEventListener('click', () => follow(accessibleBird()));
  roadButton.addEventListener('click', () => startRoad());
  sunsetButton.addEventListener('click', () => startRoad('sunset'));
  loadSunset().then(() => { sunsetReady = true; setSceneButtons(); }).catch(error => showStatus(error.message));
  $('returnButton').addEventListener('click', returnToFlock);
  $('fullscreenButton').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => showStatus('Fullscreen is unavailable here.'));
  });
  addEventListener('keydown', event => {
    const focused = document.activeElement;
    const tag = focused?.tagName;
    if (lyricsDialog.open || songDialog.open || focused?.isContentEditable) return;
    if (event.key === 'Escape') returnToFlock();
    if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
    if (event.key.toLowerCase() === 'f') { event.preventDefault(); if (sceneAvailable()) follow(accessibleBird()); else returnToFlock(); }
    if (event.key === 'Enter' && sceneAvailable()) follow(accessibleBird());
  });

  function updateZoom(dt) {
    if (zoomState === 'enter') {
      zoomClock += dt;
      zoomProgress = ease(clamp(zoomClock / (reducedMotion.matches ? .16 : .78), 0, 1));
      if (zoomProgress >= 1) { zoomState = 'detail'; zoomClock = 0; detailClock = 0; }
    } else if (zoomState === 'detail') {
      detailClock += dt;
      if (detailClock >= ZOOM_DURATION) startDust('bird');
    } else if (zoomState === 'exit') {
      zoomClock += dt;
      zoomProgress = 1 - ease(clamp(zoomClock / (reducedMotion.matches ? .16 : .72), 0, 1));
      if (zoomProgress <= 0) {
        zoomState = 'flock'; target = null; zoomProgress = 0;
        $('captionText').textContent = 'Choose a bird, then follow its flight';
        setSceneButtons();
      }
    }
  }
  function paintSelection(bird, opacity = 1) {
    if (!bird) return;
    ctx.save();
    ctx.globalAlpha = opacity * .58;
    ctx.strokeStyle = '#8f795e'; ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.arc(bird.x, bird.y, bird.size * 2.1, 0, TAU); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  }
  function paintDetail() {
    if (!target || zoomProgress <= 0 || zoomState === 'dust') return;
    const progress = zoomProgress;
    const detailAlpha = progress;
    const frame = reducedMotion.matches ? 0 : Math.min(ZOOM_FRAME_COUNT - 1, Math.floor(detailClock * ZOOM_FRAME_RATE));
    for (let offset = 0; offset < 9; offset++) loadSprite(Math.min(ZOOM_FRAME_COUNT - 1, frame + offset));
    const image = sprites.get(frame) || sprites.get(previousFrame) || sprites.get(0);
    if (sprites.has(frame)) previousFrame = frame;
    if (!image) return;
    // Keep the entire source frame visible as the pair changes position.
    const width = Math.min(W * .94, H * .90 * image.width / image.height);
    const height = width * image.height / image.width;
    const pulse = reducedMotion.matches ? 1 : 1 + bass * .022;
    // The transparent pair starts at the chosen flock bird and grows into its
    // full detail view. On return it follows that bird's current flight path.
    const landing = zoomState === 'exit' ? target : origin;
    const centerX = reducedMotion.matches ? W * .52 : lerp(landing.x, W * .52, progress);
    const centerY = reducedMotion.matches ? H * .46 : lerp(landing.y, H * .46, progress);
    const startScale = Math.min(1, target.size * target.depth * 3 / width);
    const revealScale = reducedMotion.matches ? 1 : lerp(startScale, 1, progress);
    ctx.save();
    ctx.globalAlpha = detailAlpha;
    ctx.translate(centerX, centerY);
    ctx.scale(pulse * revealScale, pulse * revealScale);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
  function tick(now) {
    requestAnimationFrame(tick);
    syncLyrics();
    const elapsed = Math.max(0, (now - lastTime) / 1000 || 0);
    lastTime = now;
    // Ignore tab suspension, but let UI transitions use real elapsed time at low FPS.
    const wallDt = elapsed > 1 ? 0 : elapsed;
    fpsFrames++;
    fpsElapsed += wallDt;
    if (fpsElapsed >= 1) {
      document.body.dataset.frameRate = String(Math.round(fpsFrames / fpsElapsed));
      fpsFrames = 0; fpsElapsed = 0;
    }
    const motionDt = Math.min(wallDt, .18);
    const inkDt = Math.min(wallDt, .05);
    if (!reducedMotion.matches) time += wallDt * 1000;
    if (!(reducedMotion.matches && audio.paused)) measureBands(wallDt);
    updateZoom(wallDt);
    updateRoad(wallDt);
    updateDust(wallDt);
    if (inkwash) {
      try {
        if (!reducedMotion.matches) inkwash.update(inkDt, {bass, mid, treble}, 0, !audio.paused);
        inkwash.render();
        ctx.clearRect(0, 0, W, H);
      } catch (error) { useFallback(error); paintWash(motionDt); }
    } else paintWash(motionDt);
    if (!reducedMotion.matches) {
      const steps = Math.max(1, Math.ceil(motionDt / (1 / 60)));
      for (let sub=0;sub<steps;sub++) {
        const state = neighborhood(birds.map(bird => ({id:bird.id,x:bird.x,y:bird.y,vx:bird.vx,vy:bird.vy})));
        const pulse = sceneAvailable() && mouseEnabled
          ? updatePointerPulse(pointer, state.snapshot, pointerPulse, motionDt/steps)
          : null;
        for (const bird of birds) bird.update(motionDt/steps, state, pulse);
      }
    }
    const flockAlpha = (1 - zoomProgress) * (1 - roadVisibility());
    if (flockAlpha > 0) for (const bird of birds) bird.draw(1, flockAlpha);
    if (sceneAvailable()) paintSelection(hovered || selected, hovered ? 1 : .35);
    paintDetail();
    paintRoad();
    if (dustState) drawDust(ctx, dustState, dustClock, W, H);
  }
  requestAnimationFrame(tick);
  syncTransport();
})();
