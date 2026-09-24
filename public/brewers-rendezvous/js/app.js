import { stops, breweryStops } from './content.js';
import { createPark } from './park.js';
import { neighbors } from './neighbors.js';
import { createNeighborUI } from './neighbor-ui.js';

const $ = (id) => document.getElementById(id);
const state = { index: 0, visited: new Set(['arrival']), tasted: new Set(), park: null, readerOpen: false, labelsVisible: true, sceneStatus: 'loading', boothStatuses: {}, pouring: false };
const labels = new Map();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function makeLabels() {
  const container = $('stop-labels');
  for (const stop of [...stops,...neighbors]) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'stop-label';
    button.style.setProperty('--dot', stop.color || '#7c9b85');
    button.textContent = stop.kind ? (stop.kind==='music'?'♫ Riverside stage':`Chat · ${stop.name}`) : stop.type === 'beer' ? stop.title : stop.id === 'community' ? 'Water + music' : stop.id === 'departure' ? 'The way out' : 'Start here';
    button.setAttribute('aria-label', stop.kind?`Visit ${stop.name}`:`Visit ${stop.title}`);
    button.addEventListener('click', () => {if(stop.kind)neighborUI.visit(stop.id);else{selectStop(stop.id);state.park?.goTo(stop.id);}});
    container.appendChild(button);labels.set(stop.id,button);
  }
}

function updateLabels(positions, _player, overview) {
  for (const [id, button] of labels) {
    const p = positions.get(id); if (!p) continue;
    // Keep each label on the compositor layer and at the camera's exact
    // projected pixel. Animating the same transform on hover caused a laggy
    // wobble while orbiting the park.
    button.style.transform = `translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) translate(-50%,-50%)`;
    button.hidden = !state.labelsVisible || !p.visible || state.readerOpen || (overview && window.innerWidth < 760 && id !== stops[state.index].id);
  }
}

function fillGlass() {
  const fraction = state.tasted.size / breweryStops.length;
  const level = 53 - fraction * 39;
  $('glass-fill').setAttribute('y', String(level));
  $('glass-fill').setAttribute('height', String(53 - level));
  $('glass-foam').setAttribute('d', `M9 ${level}h30`);
  $('taster-count').textContent = `${state.tasted.size} / ${breweryStops.length}`;
  const latest = [...state.tasted].at(-1);
  const color = breweryStops.find(s => s.id === latest)?.beerColor ?? '#d79542';
  $('glass-fill').setAttribute('fill', color);
}

function renderCard() {
  const stop = stops[state.index];
  $('card-eyebrow').textContent = stop.eyebrow.toUpperCase();
  $('card-stamp').textContent = `FIELD NOTE ${String(state.index + 1).padStart(2,'0')}`;
  $('card-title').textContent = stop.title;
  $('card-kicker').textContent = stop.kicker || stop.style || '';
  const sealed=stop.type==='beer'&&!state.tasted.has(stop.id)&&state.sceneStatus!=='fallback';
  $('card-body').textContent = sealed ? `${stop.beer} is on tap. Step up for a little pour—then open my field note.` : stop.body;
  $('card-note').textContent = sealed ? 'Fill your taster to reveal my tasting note.' : stop.note || '';
  $('beer-detail').hidden = stop.type !== 'beer';
  $('brewery-link').hidden = stop.type !== 'beer';
  if (stop.type === 'beer') {
    $('beer-name').textContent = stop.beer;
    $('beer-style').textContent = stop.style;
    $('beer-verdict').textContent = sealed ? '' : stop.verdict;
    $('beer-verdict').hidden = sealed;
    $('beer-label-caption').textContent = state.tasted.has(stop.id) ? 'IN THE TASTER' : 'ON TAP';
    $('brewery-link').href = stop.url;
    $('brewery-link').textContent = `${stop.linkLabel || 'Meet the brewery'} ↗`;
  }
  $('next-button').innerHTML = state.index === stops.length - 1 ? 'Walk again <span aria-hidden="true">↺</span>' : state.index === 0 ? 'Begin the walk <span aria-hidden="true">→</span>' : 'Next stop <span aria-hidden="true">→</span>';
  $('progress-label').textContent = `STOP ${String(state.index+1).padStart(2,'0')} / ${String(stops.length).padStart(2,'0')}`;
  $('progress-bar').style.width = `${((state.index+1)/stops.length)*100}%`;
  for (const [id, button] of labels) {
    button.classList.toggle('is-current', id === stop.id);
    button.classList.toggle('is-visited', state.visited.has(id) && id !== stop.id);
    button.setAttribute('aria-current', id === stop.id ? 'step' : 'false');
  }
  fillGlass();
  renderTasting();
}

function selectStop(id) {
  neighborUI.dismiss();
  const index = stops.findIndex(s => s.id === id); if (index < 0) return;
  if(index!==state.index){cancelTasting();state.park?.cancelApproach();}
  state.index = index; state.visited.add(id);
  renderCard();
}

function renderReader() {
  const container = $('reader-stops'); container.replaceChildren();
  stops.forEach((stop, i) => {
    const section = document.createElement('section');section.className = 'reader-stop';
    section.id = `read-${stop.id}`;
    const number = document.createElement('span');number.className='reader-number';number.textContent=String(i+1).padStart(2,'0');section.appendChild(number);
    const main = document.createElement('div');
    const eyebrow=document.createElement('span');eyebrow.className='reader-eyebrow';eyebrow.textContent=stop.eyebrow;main.appendChild(eyebrow);
    const title=document.createElement('h3');title.textContent=stop.title;main.appendChild(title);
    if(stop.type==='beer'){
      const beer=document.createElement('p');beer.className='reader-verdict';beer.textContent=`${stop.beer} · ${stop.verdict}`;main.appendChild(beer);
    }
    const body=document.createElement('p');body.textContent=stop.body;main.appendChild(body);
    if(stop.brewery){const brewery=document.createElement('p');brewery.textContent=stop.brewery;main.appendChild(brewery);}
    if(stop.note){const note=document.createElement('p');note.className='reader-note';note.textContent=stop.note;main.appendChild(note);}
    if(stop.url){const link=document.createElement('a');link.href=stop.url;link.rel='noopener noreferrer';link.target='_blank';link.textContent=`${stop.linkLabel || 'Meet the brewery'} ↗`;main.appendChild(link);}
    section.appendChild(main);container.appendChild(section);
  });
}

function renderTasting() {
  const stop=stops[state.index], beer=stop.type==='beer', collected=state.tasted.has(stop.id);
  $('tasting-controls').hidden=!beer;
  $('tasting-journal').hidden=!beer;
  $('story-card').classList.toggle('is-pouring',state.pouring);
  $('tasting-stamp').hidden=!collected;
  $('tasting-stamp').textContent=collected?`Tasted · ${stop.title}`:'';
  for(const button of $('tasting-journal').querySelectorAll('[data-journal]')){
    const tasted=state.tasted.has(button.dataset.journal);
    button.classList.toggle('is-collected',tasted);
    button.setAttribute('aria-label',`${button.dataset.name}: ${tasted?'collected':'not collected'}`);
  }
  if(!beer)return;
  const action=$('taste-button'),cancel=$('cancel-tasting'),status=$('tasting-status');
  action.disabled=false;cancel.hidden=true;
  const boothState=state.park?.getBoothStatus(stop.id)??state.boothStatuses[stop.id]??'far';
  if(state.pouring){
    action.textContent=`Pouring ${stop.beer}…`;action.disabled=true;cancel.hidden=false;
    status.textContent='A little amber, a little foam. Coming right up.';
  }else if(state.sceneStatus==='loading'){
    action.textContent='Opening the park…';action.disabled=true;status.textContent='Your host will be ready in a moment.';
  }else if(state.sceneStatus==='fallback'){
    action.textContent=collected?'Note saved ✓':'Save tasting note';action.disabled=collected;
    status.textContent='The tasting note is available without the 3D scene.';
  }else if(boothState==='approaching'){
    action.textContent='Walking to the booth…';action.disabled=true;cancel.hidden=false;
    status.textContent='Your host has a glass waiting at the counter.';
  }else if(boothState==='ready'){
    action.textContent=collected?'Watch the pour again':'Fill my taster';
    status.textContent=collected?'One stamp, as many replays as you like.':'You’re at the counter. Ready for a pour?';
  }else{
    action.textContent=collected?'Return to the booth':'Walk to the booth';
    status.textContent='Step up to the counter to fill your glass.';
  }
}
function collectTasting(id) {
  const first=!state.tasted.has(id);state.tasted.add(id);state.pouring=false;
  $('tasting-announcement').textContent=first?`${stops.find(s=>s.id===id).title} collected. ${state.tasted.size} of ${breweryStops.length} journal stamps.`:'Pour complete. Your journal stamp is already saved.';
  renderCard();
}
function cancelTasting() {
  state.park?.cancelPour();state.park?.cancelApproach();state.pouring=false;
  renderTasting();
}
function taste() {
  const stop=stops[state.index];if(stop.type!=='beer'||state.pouring)return;
  if(state.sceneStatus==='fallback'){collectTasting(stop.id);return;}
  if(!state.park)return;
  if(state.park.getBoothStatus(stop.id)!=='ready'){
    state.park.goTo(stop.id);renderTasting();return;
  }
  state.pouring=true;renderTasting();
  const started=state.park.pour(stop.id,{
    onComplete:()=>collectTasting(stop.id),
    onCancel:()=>{state.pouring=false;renderTasting();$('tasting-announcement').textContent='Pour canceled. Your journal is unchanged.';}
  });
  if(!started){state.pouring=false;renderTasting();}
}
$('taste-button').addEventListener('click',taste);
$('cancel-tasting').addEventListener('click',cancelTasting);

let previousFocus = null;
function openReader() {
  neighborUI.dismiss();cancelTasting();
  previousFocus = document.activeElement;
  state.readerOpen = true;
  $('experience').inert = true;
  $('experience').setAttribute('aria-hidden','true');
  $('reader').hidden = false;
  document.body.style.overflow = 'hidden';
  $('reader').querySelector('.reader-panel').scrollTop = 0;
  $('reader').querySelector('.reader-close').focus();
  for(const button of labels.values())button.hidden=true;
}
function closeReader() {
  state.readerOpen = false;$('reader').hidden = true;document.body.style.overflow='';
  $('experience').inert = false;
  $('experience').removeAttribute('aria-hidden');
  previousFocus?.focus?.();
}
function onAction(event) {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'read') openReader();
  if (action === 'close-reader') closeReader();
  if (action === 'zoom-in') state.park?.setZoom(state.park.getZoom()+.2);
  if (action === 'zoom-out') state.park?.setZoom(state.park.getZoom()-.2);
  if (action === 'overview') {state.park?.showOverview();$('follow-toggle').setAttribute('aria-pressed','false');$('follow-toggle').textContent='Follow character';}
  if (action === 'follow' && state.park) {
    const mode=state.park.setViewMode(state.park.getViewMode()==='follow'?'diorama':'follow');
    $('follow-toggle').setAttribute('aria-pressed',String(mode==='follow'));
    $('follow-toggle').textContent=mode==='follow'?'Diorama view':'Follow character';
  }
  if (action === 'labels') {
    state.labelsVisible = !state.labelsVisible;
    $('labels-toggle').setAttribute('aria-pressed',String(state.labelsVisible));
    $('scene-caption').hidden = !state.labelsVisible;
    if(!state.labelsVisible)for(const button of labels.values())button.hidden=true;
  }
}
document.addEventListener('click', onAction);
document.addEventListener('keydown', (event) => {
  if (!state.readerOpen) return;
  if (event.key === 'Escape') { event.preventDefault();closeReader();return; }
  if (event.key === 'Tab') {
    const panel=$('reader').querySelector('.reader-panel');
    const focusables = [...panel.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden && el.getClientRects().length);
    const first=focusables[0],last=focusables.at(-1);
    if(!focusables.length){event.preventDefault();panel.focus();return;}
    if(!panel.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();return;}
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
});
$('next-button').addEventListener('click', () => {
  const next = (state.index + 1) % stops.length;
  selectStop(stops[next].id);
  state.park?.goTo(stops[next].id);
});
function setCardExpanded(expanded){
  if(!expanded && $('card-details').contains(document.activeElement))$('card-toggle').focus();
  $('story-card').classList.toggle('is-compact',!expanded);
  $('card-details').hidden=!expanded;
  $('card-toggle').textContent=expanded?'Close field note':'Open field note';
  $('card-toggle').setAttribute('aria-expanded',String(expanded));
}
$('card-toggle').addEventListener('click', () => setCardExpanded($('card-details').hidden));
function makeJournal(){
  const wrap=$('journal-stamps');
  for(const stop of breweryStops){
    const stamp=document.createElement('span');stamp.dataset.journal=stop.id;stamp.dataset.name=stop.title;
    stamp.textContent=stop.title.split(/\s+/).map(word=>word[0]).join('').slice(0,2).toUpperCase();
    wrap.appendChild(stamp);
  }
  const summary=document.createElement('small');summary.textContent=`${breweryStops.length} good discoveries. One afternoon in Salida.`;wrap.appendChild(summary);
}
prefersReducedMotion.addEventListener('change', e => state.park?.setReduced(e.matches));
const neighborUI=createNeighborUI({getPark:()=>state.park,isFallback:()=>state.sceneStatus==='fallback',beforeVisit:()=>{cancelTasting();if(state.readerOpen)closeReader();}});
makeJournal();makeLabels();renderReader();renderCard();
const ready = () => { $('park-fallback').hidden = true;state.sceneStatus='ready';renderTasting(); };
ready.updateBooth = statuses => {state.boothStatuses=statuses;renderTasting();};
ready.updateLabels = updateLabels;
ready.neighborSelected=id=>neighborUI.visit(id);
ready.updateNeighbors=()=>neighborUI.update();
createPark($('park'), id=>selectStop(id), ready, () => {
  state.sceneStatus='fallback';state.pouring=false;renderTasting();
  $('park-fallback').hidden = false;
  $('stop-labels').hidden = true;
  $('follow-toggle').disabled=true;neighborUI.update();
}).then(park => { state.park = park; if(!park)state.sceneStatus='fallback';renderTasting(); });
