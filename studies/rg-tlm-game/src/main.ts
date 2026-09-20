import './style.css';
import './layout.css';
import './room-art.css';
import './crossing.css';
import './workshop.css';
import { act, clampPosition, hint, initialState, inventory, labels, objective, parseSave, SAVE_KEY, type Action, type Item, type Reply, type State, type Target } from './game';
import { icon } from './icons';
import { TravelerSprite, facingForDelta } from './traveler';
import { paintedItem, RookSprite, toolsReady } from './room-art';
import { AmbientNpc, rookRoutine } from './npc';
import { roomTargets } from './rooms';
import { CrossingPanel, crossingDialogs } from './crossing-panel';
import { beacons, destinations } from './transit';
import { routeSymbol } from './route-art';

const art = `${import.meta.env?.BASE_URL ?? '/'}art/`;
let saved: State | null = null;
let saveAvailable = true;
let recovery = false;
try { const raw = localStorage.getItem(SAVE_KEY); saved = parseSave(raw); recovery = !!raw && !saved; }
catch { saveAvailable = false; }
let state = saved ?? initialState();
let playing = false;
let selected: Item | null = null;
let target: Target | null = null;
let conversation = false;
let moving = false;
let movement = 0;
let reveal = false;
let reply: Reply = { speaker: 'The waystation', text: 'The map ends here. Someone has written “ask for the Guild” in the margin. You were hoping for an address.' };

const targets = () => roomTargets[state.room];
const allTargets = { ...roomTargets.waystation, ...roomTargets.crossing, ...roomTargets.workshop };
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <main>
    <h1 class="sr-only">The Last Mile — A Raid Guild adventure</h1>
    <section class="game" aria-label="The Last Mile adventure">
      <div class="scene" id="scene" tabindex="0" aria-label="Waystation. Click the foreground to walk, or use the arrow keys. Tab to discover objects.">
        <div class="scene-world" id="scene-world">
        <img class="background waystation-art" data-src="${art}room-01-background-v2.webp" alt="A teal cargo walker stranded beside a desert waystation." draggable="false" />
        <img class="background repaired waystation-art" id="repaired-art" data-src="${art}room-01-repaired-v2.webp" alt="" draggable="false" />
        <img class="background crossing-art" data-src="${art}crossing-background-v1.webp" alt="A stone transit landing overlooking the floating coral citadel, with Rook docked beneath an old arch." draggable="false" />
        <img class="background crossing-art" id="crossing-active" data-src="${art}crossing-active-v1.webp" alt="" draggable="false" />
        <img class="background workshop-art" data-src="${art}workshop-background-v2.webp" alt="A sunlit common workshop inside the floating citadel, where three guild roles wait around a shared raid table." draggable="false" />
        <div class="scene-content" id="scene-content" inert>
          <div id="destination" class="destination" aria-hidden="true"></div>
          <div id="rook" class="rook" aria-hidden="true"><span class="rook-shadow"></span><canvas id="rook-sprite"></canvas></div>
          <div id="player" class="player" aria-hidden="true"><span class="player-shadow"></span><canvas id="traveler" width="384" height="576"></canvas></div>
          <div id="ground-plate" class="ground-prop ground-plate" aria-hidden="true">${paintedItem('plate')}</div>
          <div id="ground-jack" class="ground-prop ground-jack" aria-hidden="true">${paintedItem('jack')}</div>
          <span class="scene-ring" id="scene-destination" aria-hidden="true"></span><span class="scene-ring" id="scene-beacon" aria-hidden="true"></span>
          ${Object.entries(allTargets).map(([id, t]) => `<button class="hotspot" id="hotspot-${id}" data-target="${id}" style="--x:${t.x}%;--y:${t.y}%" aria-label="${t.label}"><span class="hotspot-dot">${id === 'exit' || id === 'arch' ? '→' : id === 'repair' ? icon('wrench') : '+'}</span><span class="hotspot-label">${t.label}</span></button>`).join('')}
          <div id="walk-cue" class="walk-cue">Click the sand to walk <span>·</span> Click a person or object to interact</div>
        </div>
        </div>
        <div class="scene-caption"><span class="tiny-dot"></span> <span id="place-caption">THE SALT ROAD</span> <span class="caption-divider">/</span> LATE AFTERNOON</div>
        <div class="opening" id="opening">
          <p class="eyebrow">THE LAST MILE · A RAID GUILD ADVENTURE</p><h2 id="opening-title">A long road.<br>A little company.</h2>
          <p id="opening-description">You have a notebook full of unfinished ideas<br class="desktop-break"> and a map that ends somewhere around here.</p>
          <button class="primary begin" id="begin" disabled>${saved?.started ? 'Continue the journey' : 'Begin the journey'} ${icon('arrow')}</button>
          <p class="opening-note" id="loading-note">Preparing the road…</p>
          <span class="opening-footer" id="opening-chapter">CHAPTER ONE <span>—</span> THE STRANDED WALKER</span>
        </div>
      </div>
      <div class="game-toolbar"><div class="objective"><span class="tiny-dot"></span><span id="objective">Your journey starts here</span></div><div class="toolbar-actions"><button id="reveal" aria-pressed="false" disabled>${icon('eye')} <span>Show targets</span></button><button id="hint" disabled>${icon('spark')} <span>A little hint</span></button><button id="restart" disabled>Restart</button></div></div>
      <div class="play-panel" id="play-panel" hidden>
        <section class="dialogue" aria-label="Story and actions"><div class="speaker-row"><span id="speaker">The waystation</span><span id="target-label"></span></div><p id="dialogue-text" aria-live="polite" aria-atomic="true"></p><div class="actions" id="actions"></div></section>
        <aside class="satchel" aria-label="Your satchel"><div class="satchel-title">YOUR SATCHEL <span id="item-count">01</span></div><div id="inventory" class="inventory"></div><div id="selection" class="selection">Select an item, then something in the scene.</div></aside>
      </div>
      <footer class="page-footer"><span id="chapter-label">The Last Mile / Chapter one</span><span id="save-status">Progress stays in this browser.</span></footer>
    </section>
  </main>
  <dialog id="restart-dialog"><p class="eyebrow">BACK TO THE WAYSTATION</p><h2>Start the journey again?</h2><p>Your progress in all three chapters will be cleared. You will return to the stranded walker.</p><div class="modal-actions"><button id="keep-playing">Keep exploring</button><button class="primary" id="confirm-restart">Start again</button></div></dialog>
  <dialog id="ending-dialog" aria-labelledby="ending-title"><span class="ending-icon">${icon('compass')}</span><p class="eyebrow">CHAPTER THREE COMPLETE</p><h2 id="ending-title">A place<br>at the table.</h2><p>Your brief, build, and route hold together. Orin turns the open chair toward you while Mica makes room for your notebook and Sable adds your path to the map.</p><div class="ending-note">Welcome to RaidGuild. Your Workshop progress is saved. Next: <strong>The First Raid</strong>—and perhaps a walking lantern that finally stays upright.</div><button class="primary" id="back-to-room">Stay at the table ${icon('arrow')}</button></dialog>
  ${crossingDialogs}
`;
function el<T extends HTMLElement = HTMLElement>(id: string) { return document.getElementById(id) as T; }
const scene = el('scene');
const player = el('player');
const traveler = new TravelerSprite(el<HTMLCanvasElement>('traveler'), `${art}sprites/`);
const restartDialog = el<HTMLDialogElement>('restart-dialog');
const endingDialog = el<HTMLDialogElement>('ending-dialog');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rookSprite = new RookSprite(el<HTMLCanvasElement>('rook-sprite'));
const rook = new AmbientNpc(el('rook'), frame => rookSprite.draw(frame), rookRoutine);
const crossing = new CrossingPanel(() => state, action => { perform(action); return reply; }, () => { syncRook(); if (playing) el<HTMLButtonElement>(target === 'pedestal' ? 'hotspot-pedestal' : 'scene').focus({ preventScroll: true }); });
function syncRook() {
  rook.update({ active: playing && state.room === 'waystation' && !document.hidden && !restartDialog.open && !endingDialog.open && !crossing.dialog.open, attentive: target === 'rook', settled: state.repaired, reducedMotion: reducedMotion.matches });
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); saveAvailable = true; }
  catch { saveAvailable = false; }
  el('save-status').textContent = saveAvailable ? 'Progress saved in this browser.' : 'Saving unavailable. Progress lasts for this visit.';
}
function setReply(r: Reply) { reply = r; renderPanel(); }
function renderPosition() {
  player.style.left = `${state.position.x}%`;
  player.style.top = `${state.position.y}%`;
  player.style.height = `${state.room === 'crossing' ? 39 + (state.position.y - 91) * .5 : state.room === 'workshop' ? 40 + (state.position.y - 82) * .55 : 45 + (state.position.y - 85) * .8}%`;
}
function loadSceneArt(room: State['room'], includeAlternate = false) {
  const selector = room === 'workshop' ? '.workshop-art' : room === 'crossing'
    ? includeAlternate ? '.crossing-art' : state.transit.active ? '#crossing-active' : '.crossing-art:not(#crossing-active)'
    : includeAlternate ? '.waystation-art' : state.repaired ? '#repaired-art' : '.waystation-art:not(#repaired-art)';
  document.querySelectorAll<HTMLImageElement>(selector).forEach(img => {
    if (!img.hasAttribute('src')) img.src = img.dataset.src!;
  });
}
function itemArt(item: Item) {
  return item === 'plate' || item === 'jack' ? paintedItem(item) : icon(item);
}
function render() {
  const atCrossing = state.room === 'crossing';
  const atWorkshop = state.room === 'workshop';
  loadSceneArt(state.room, playing);
  scene.classList.toggle('room-crossing', atCrossing);
  scene.classList.toggle('room-workshop', atWorkshop);
  scene.dataset.room = state.room;
  const place = atWorkshop ? 'Workshop. Click the open stone floor' : atCrossing ? 'Crossing. Click the stone landing' : 'Waystation. Click the foreground';
  scene.setAttribute('aria-label', `${place} to walk, or use the arrow keys. Tab to discover people and objects.`);
  el('place-caption').textContent = atWorkshop ? 'THE WORKSHOP' : atCrossing ? 'THE CROSSING' : 'THE SALT ROAD';
  el('chapter-label').textContent = `The Last Mile / Chapter ${atWorkshop ? 'three' : atCrossing ? 'two' : 'one'}`;
  el('opening-chapter').textContent = atWorkshop ? 'CHAPTER THREE — THE WORKSHOP' : atCrossing ? 'CHAPTER TWO — THE CROSSING' : 'CHAPTER ONE — THE STRANDED WALKER';
  el('opening-title').innerHTML = atWorkshop ? 'A shared table.<br>An open chair.' : atCrossing ? 'A little further.<br>Together.' : 'A long road.<br>A little company.';
  el('opening-description').textContent = atWorkshop ? 'The Guild is not a destination. It is people with different skills choosing to build together.' : atCrossing ? 'The Guild is in sight. Rook is waiting at the crossing, and your notebook holds the way forward.' : 'You have a notebook full of unfinished ideas and a map that ends somewhere around here.';
  el('crossing-active').classList.toggle('visible', state.transit.active);
  el('scene-destination').innerHTML = routeSymbol(destinations[state.transit.destination]);
  el('scene-beacon').innerHTML = routeSymbol(beacons[state.transit.beacon]);
  for (const id of Object.keys(allTargets) as Target[]) {
    const t = targets()[id];
    const hotspot = el(`hotspot-${id}`);
    hotspot.hidden = !t;
    if (t) {
      hotspot.style.setProperty('--x', `${t.x}%`); hotspot.style.setProperty('--y', `${t.y}%`);
      hotspot.setAttribute('aria-label', t.label); hotspot.querySelector('.hotspot-label')!.textContent = t.label;
    }
  }
  crossing.render();
  renderPosition();
  el('repaired-art').classList.toggle('visible', state.repaired);
  el('objective').textContent = playing ? objective(state) : 'Your journey starts here';
  el('scene-content').inert = !playing;
  el('opening').hidden = playing;
  el('play-panel').hidden = !playing;
  ['hint', 'reveal', 'restart'].forEach(id => el<HTMLButtonElement>(id).disabled = !playing);
  for (const item of ['plate', 'jack'] as const) {
    const prop = el(`ground-${item}`);
    prop.hidden = state[item] === 'inventory' || state[item] === 'packed';
    prop.classList.toggle('placed', state[item] === 'placed');
    el(`hotspot-${item}`).hidden = atCrossing || state[item] !== 'ground';
  }
  const inv = inventory(state);
  if (selected && !inv.includes(selected)) selected = null;
  el('inventory').innerHTML = inv.map(item => `<button class="inventory-item ${selected === item ? 'selected' : ''}" data-item="${item}" aria-label="Select ${labels[item]}" aria-pressed="${selected === item}">${itemArt(item)}<span>${labels[item]}</span></button>`).join('');
  el('item-count').textContent = String(inv.length).padStart(2, '0');
  el('selection').innerHTML = selected ? `<span>Use <b>${labels[selected]}</b> on a target.</span><button id="cancel-item" aria-label="Cancel selected item">Cancel ×</button>` : atWorkshop ? 'Talk with each role, then connect their contribution at the table.' : atCrossing ? 'Open your notebook to read the route sketch.' : 'Select an item, then something in the scene.';
  for (const [id, item] of [['ledger', 'brief'], ['frame', 'key'], ['routeboard', 'thread']] as const) {
    el(`hotspot-${id}`).classList.toggle('station-complete', state.workshop[item] === 'placed');
  }
  scene.classList.toggle('workshop-assembled', state.workshop.assembled);
  scene.classList.toggle('using-item', !!selected);
  renderPanel();
}

function button(text: string, action: string, primary = false) {
  return `<button data-action="${action}" ${moving ? 'disabled' : ''} class="${primary ? 'action-primary' : ''}">${text}</button>`;
}
function renderPanel() {
  syncRook();
  el('speaker').textContent = reply.speaker;
  el('dialogue-text').textContent = reply.text;
  el('target-label').textContent = moving ? 'ON YOUR WAY' : target ? targets()[target]?.label ?? '' : 'EXPLORE AT YOUR OWN PACE';
  const actions: string[] = [];
  if (selected === 'notebook') actions.push(button('Read notebook', 'notebook'));
  if (target) {
    actions.push(button('Examine', 'inspect'));
    if (selected) actions.push(button(`Use ${labels[selected]}`, 'use', true));
    else if (target === 'rook') {
      actions.push(button('Talk to Rook', 'talk', true));
      if (conversation && (!state.repaired || state.room === 'crossing')) {
        actions.push(button('Are you with the Guild?', 'guild'));
        actions.push(button('How can I help?', 'help'));
      }
      if (state.repaired && state.room === 'waystation') actions.push(button('Accept the ride', 'leave', true));
    } else if (state.room === 'workshop' && (target === 'orin' || target === 'mica' || target === 'sable')) {
      actions.push(button(`Talk to ${targets()[target]?.label.split(' · ')[0]}`, 'talk', true));
    } else if ((target === 'plate' || target === 'jack') && state[target] === 'ground') actions.push(button(`Take ${labels[target].toLowerCase()}`, 'take', true));
    else if (target === 'repair' && state.jack === 'placed' && !state.repaired) actions.push(button('Turn the crank', 'operate', true));
    else if (target === 'exit') actions.push(button(state.repaired ? 'Accept the ride' : 'Follow the road', 'leave', true));
    else if (target === 'pedestal') actions.push(button(state.transit.active ? 'View route' : 'Set the route', 'route', true));
    else if (target === 'arch') actions.push(button(state.transit.active ? 'Step through the arch' : 'Try the crossing', 'cross', true));
    else if (target === 'table' && state.room === 'workshop') actions.push(button(state.workshop.assembled ? 'Take your place at the table' : 'Review the raid', 'complete-raid', state.workshop.assembled));
  }
  if (!target && !selected) actions.push(`<span class="quiet-instruction">${state.room === 'workshop' ? 'No one builds alone. Start with a conversation.' : 'The road can wait. Have a look around.'}</span>`);
  el('actions').innerHTML = actions.join('');
}

function perform(action: Action) {
  const previousRoom = state.room;
  const result = act(state, action);
  state = result.state;
  reply = result.reply;
  if (action.type === 'talk') conversation = true;
  if (action.type === 'use') selected = null;
  if (state.room !== previousRoom) {
    ++movement; moving = false; target = null; selected = null; conversation = false;
    traveler.stand('right'); crossing.close(); el('destination').classList.remove('visible');
    el('scene-world').classList.remove('room-arrival');
    requestAnimationFrame(() => el('scene-world').classList.add('room-arrival'));
    el('walk-cue').innerHTML = state.room === 'workshop'
      ? 'Click the open floor to walk <span>·</span> Meet the people around the table'
      : 'Click the stone landing to walk <span>·</span> Inspect the route pedestal';
    el('walk-cue').classList.remove('faded');
    scene.focus({ preventScroll: true });
  }
  save(); render();
  if (action.type === 'transmit' && state.transit.active) loadSceneArt('workshop');
  if (action.type === 'complete-raid' && state.workshop.joined && !endingDialog.open) endingDialog.showModal();
  syncRook();
}

async function walk(x: number, y = 89): Promise<boolean> {
  const token = ++movement;
  const from = { ...state.position };
  const to = clampPosition(x, y, state.room);
  const distance = Math.hypot((to.x - from.x) * 16.72, (to.y - from.y) * 9.41);
  const facing = facingForDelta(to.x - from.x, to.y - from.y, traveler.facing);
  const duration = reducedMotion.matches || distance < .5 ? 0 : Math.max(260, distance / 330 * 1000);
  moving = duration > 0;
  if (moving) traveler.walk(facing);
  else traveler.stand(facing);
  el('destination').style.left = `${to.x}%`;
  el('destination').style.top = `${to.y}%`;
  el('destination').classList.toggle('visible', moving);
  el('walk-cue').classList.add('faded');
  renderPanel();
  const start = performance.now();
  return new Promise(resolve => {
    const tick = (now: number) => {
      if (token !== movement) { resolve(false); return; }
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      state.position = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
      renderPosition();
      traveler.draw(now);
      if (t < 1) requestAnimationFrame(tick);
      else { moving = false; traveler.stand(); el('destination').classList.remove('visible'); save(); renderPanel(); resolve(true); }
    };
    requestAnimationFrame(tick);
  });
}

async function chooseTarget(id: Target) {
  const info = targets()[id];
  if (!info) return;
  target = id; conversation = false;
  const item = selected;
  const arrived = await walk(info.stand, state.room === 'crossing' ? 93 : state.room === 'workshop' ? 88 : 88);
  if (!arrived || !playing) return;
  traveler.stand(facingForDelta(info.x - state.position.x, info.y - state.position.y, traveler.facing));
  if (item && selected === item) perform({ type: 'use', item, target: id });
  else if (state.room === 'crossing') perform({ type: 'inspect', target: id });
  else if (state.room === 'workshop') setReply({
    speaker: info.label,
    text: id === 'orin' ? 'Orin closes the ledger and gives you their full attention.' : id === 'mica' ? 'Mica steadies the brass frame and looks up from the workbench.' : id === 'sable' ? 'Sable tucks the route map beneath one arm.' : 'You take a closer look at this part of the shared raid.',
  });
  else setReply({ speaker: info.label, text: id === 'rook' ? 'Rook wipes the sand from her hands and looks your way.' : id === 'repair' ? 'The damaged linkage sits just above the sand. A little leverage would help.' : 'You take a closer look.' });
  if (id === 'pedestal') { selected = null; render(); crossing.open(false, item === 'notebook'); syncRook(); return; }
  el<HTMLButtonElement>('actions').querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
}

scene.addEventListener('click', event => {
  if (!playing) return;
  const hotspot = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-target]');
  if (hotspot) { void chooseTarget(hotspot.dataset.target as Target); return; }
  const bounds = el('scene-world').getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width * 100;
  const y = (event.clientY - bounds.top) / bounds.height * 100;
  const walkBoundary = state.room === 'crossing' ? 86 : state.room === 'workshop' ? 76 : 78;
  if (y < walkBoundary) {
    setReply({
      speaker: state.room === 'workshop' ? 'The Workshop' : state.room === 'crossing' ? 'The crossing' : 'The salt road',
      text: state.room === 'workshop' ? 'The open stone floor leads to every person and station. Click a person or object to approach it.' : state.room === 'crossing' ? 'The broad stone landing is safe underfoot. Click a person or object to approach it.' : 'The open sand in front of the walker makes a good path. Click a person or an object to approach it.',
    });
    return;
  }
  target = null; conversation = false;
  void walk(x, y);
});
scene.addEventListener('keydown', event => {
  if (!playing || event.target !== scene || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault(); target = null;
  const dx = event.key === 'ArrowLeft' ? -8 : event.key === 'ArrowRight' ? 8 : 0;
  const dy = event.key === 'ArrowUp' ? -3 : event.key === 'ArrowDown' ? 3 : 0;
  void walk(state.position.x + dx, state.position.y + dy);
});
el('inventory').addEventListener('click', e => {
  const item = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-item]')?.dataset.item as Item | undefined;
  if (!item) return;
  selected = selected === item ? null : item;
  render();
  if (selected === 'notebook') perform({ type: 'inspect', target: 'notebook' });
  if (item === 'notebook' && state.room === 'crossing') { selected = null; render(); crossing.open(true); syncRook(); return; }
  el('inventory').querySelector<HTMLButtonElement>(`[data-item="${item}"]`)?.focus({ preventScroll: true });
});
el('selection').addEventListener('click', e => { if ((e.target as HTMLElement).closest('#cancel-item')) { selected = null; render(); } });
el('actions').addEventListener('click', e => {
  const action = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-action]')?.dataset.action;
  if (!action || moving) return;
  if (action === 'notebook') { perform({ type: 'inspect', target: 'notebook' }); if (state.room === 'crossing') crossing.open(true); }
  else if (action === 'inspect' && target) perform({ type: 'inspect', target });
  else if (action === 'talk') perform({ type: 'talk', target: state.room === 'workshop' && (target === 'orin' || target === 'mica' || target === 'sable') ? target : undefined });
  else if (action === 'guild' || action === 'help') perform({ type: 'talk', topic: action });
  else if (action === 'take' && (target === 'plate' || target === 'jack')) perform({ type: 'take', item: target });
  else if (action === 'use' && selected && target) perform({ type: 'use', item: selected, target });
  else if (action === 'operate') perform({ type: 'operate' });
  else if (action === 'leave') perform({ type: 'leave' });
  else if (action === 'route') { crossing.open(); syncRook(); }
  else if (action === 'cross') perform({ type: 'cross' });
  else if (action === 'complete-raid') perform({ type: 'complete-raid' });
});

el('begin').addEventListener('click', event => {
  event.stopPropagation();
  playing = true; state.started = true; document.body.classList.add('is-playing'); save(); render(); scene.focus({ preventScroll: true });
  if (state.room === 'crossing') {
    setReply({ speaker: 'The crossing', text: state.transit.active ? 'The Guild’s beacon still holds the route open. Rook is ready when you are.' : 'Across the gap, the Guild hangs in the evening light. Rook holds the walker steady. “You set the route. I’ll keep us connected.”' });
    el('walk-cue').innerHTML = 'Click the stone landing to walk <span>·</span> Inspect the route pedestal';
  }
  else if (state.room === 'workshop') {
    setReply({ speaker: 'The Workshop', text: state.workshop.assembled ? 'The small raid is assembled. An open chair waits at the shared table.' : 'Orin, Mica, and Sable each hold a different part of the work. Start with the people; the pieces will follow.' });
    el('walk-cue').innerHTML = 'Click the open floor to walk <span>·</span> Meet the people around the table';
  }
  else if (state.repaired) setReply({ speaker: 'Rook', text: 'Welcome back. The walker is ready, and so is your seat. Shall we?' });
  else if (saved?.started) setReply({ speaker: 'The waystation', text: 'The road is right where you left it. So are your ideas. Pick up where you stopped.' });
  window.setTimeout(() => {
    loadSceneArt(state.room, true);
    if (state.room === 'waystation') loadSceneArt('crossing');
  }, 1000);
  syncRook();
});
el('reveal').addEventListener('click', () => {
  reveal = !reveal; scene.classList.toggle('reveal-targets', reveal);
  el('reveal').setAttribute('aria-pressed', String(reveal));
  el('reveal').querySelector('span')!.textContent = reveal ? 'Hide targets' : 'Show targets';
});
el('hint').addEventListener('click', () => setReply(hint(state)));
el('restart').addEventListener('click', () => { restartDialog.showModal(); syncRook(); });
el('keep-playing').addEventListener('click', () => restartDialog.close());
el('confirm-restart').addEventListener('click', () => {
  ++movement; moving = false; traveler.stand('right'); el('destination').classList.remove('visible');
  state = initialState(); state.started = true; saved = null; target = null; selected = null; conversation = false;
  crossing.close(); el('scene-world').classList.remove('room-arrival');
  el('walk-cue').innerHTML = 'Click the sand to walk <span>·</span> Click a person or object to interact';
  reply = { speaker: 'The waystation', text: 'The map ends here. Someone has written “ask for the Guild” in the margin. You were hoping for an address.' };
  restartDialog.close(); save(); render(); scene.focus({ preventScroll: true });
});
el('back-to-room').addEventListener('click', () => endingDialog.close());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !restartDialog.open && !endingDialog.open && !crossing.dialog.open) { selected = null; render(); }
});
document.addEventListener('visibilitychange', () => { if (playing) save(); syncRook(); });
reducedMotion.addEventListener('change', syncRook);
restartDialog.addEventListener('close', syncRook);
endingDialog.addEventListener('close', syncRook);

render();
if (!saveAvailable) el('save-status').textContent = 'Saving unavailable. Progress lasts for this visit.';
Promise.all([traveler.ready, rookSprite.ready, toolsReady.decode(), ...Array.from(document.querySelectorAll<HTMLImageElement>('.background[src]')).map(img => img.decode())])
  .then(() => { el<HTMLButtonElement>('begin').disabled = false; el('loading-note').textContent = recovery ? 'An older or unreadable save was found. A fresh journey is ready.' : 'Point, click, and take your time. Your progress is saved here.'; })
  .catch(() => { el('loading-note').textContent = 'The scene artwork could not load. Refresh the page to try again.'; });
