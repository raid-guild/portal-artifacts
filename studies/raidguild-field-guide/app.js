import { entries } from './guide.mjs';
import { isPublicationHash, showPublication } from './publication.js';
import { isWebHash, showWeb, leaveWeb } from './web.js';

const root = document.documentElement;
root.classList.add('js');
const $ = (id) => document.getElementById(id);
const dom = (entry, name) => entry.id === 'joining' ? name : `${entry.id}-${name}`;
const hashFor = (entry, item) => item.hash || `${entry.id}-${item.id}`;
const readerFor = (entry) => $(entry.id === 'joining' ? 'reader' : `${entry.id}-reader`);
const zoom = Object.fromEntries(entries.map((entry) => [entry.id, 100]));
const routes = new Map([['library', { view: 'library' }]]);

for (const entry of entries) {
  routes.set(entry.mapHash, { entry, view: 'map', index: 0 });
  routes.set(entry.textHash, { entry, view: 'text' });
  routes.set(entry.sourcesHash, { entry, view: 'sources' });
  entry.items.forEach((item, index) => routes.set(hashFor(entry, item), { entry, view: 'map', index }));
  if (entry.paidWork) routes.set('paid-work', { entry, view: 'map', paid: true });
}

function sourceLinks(item) {
  const anchors = [{ url: item.link, label: item.linkLabel }, ...(item.extraLinks || [])];
  const nodes = [];
  anchors.forEach(({ url, label }, index) => {
    if (index) nodes.push(document.createTextNode(' · '));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = `${label} ↗`;
    nodes.push(anchor);
  });
  return nodes;
}

function updateContents(entry, item) {
  const panel = $(dom(entry, 'detail-contents'));
  if (!panel) return;
  panel.replaceChildren();
  panel.hidden = !item.contents;
  if (!item.contents) return;
  const label = document.createElement('span');
  label.textContent = 'IN THE FIELD GUIDE';
  const title = document.createElement('strong');
  title.textContent = item.contents.title;
  const status = document.createElement('small');
  status.textContent = { planned: 'PLANNED', available: 'READ NOW', landscape: 'IN THIS LANDSCAPE' }[item.contents.status];
  const nodes = [label, title, status];
  if (item.contents.href) {
    const link = document.createElement('a');
    link.href = item.contents.href;
    link.textContent = 'Read now →';
    nodes.push(link);
  }
  panel.replaceChildren(...nodes);
}

function showItem(entry, index) {
  const reader = readerFor(entry);
  const item = entry.items[index];
  $(dom(entry, 'detail-panel')).classList.remove('paid-selected');
  $(dom(entry, 'detail-number')).textContent = String(index + 1).padStart(2, '0');
  $(dom(entry, 'progress')).textContent = `${String(index + 1).padStart(2, '0')} / ${String(entry.items.length).padStart(2, '0')}`;
  $(dom(entry, 'detail-kind')).textContent = item.kind === 'realm' ? 'IMAGINED REALM' : item.kind === 'gateway' ? 'GUILD GATEWAY' : item.kind === 'place' ? 'PRACTICAL PLACE' : 'JOINING STAGE';
  $(dom(entry, 'detail-title')).textContent = item.title;
  $(dom(entry, 'detail-lead')).textContent = item.lead;
  $(dom(entry, 'detail-body')).textContent = item.detail;
  updateContents(entry, item);
  $(dom(entry, 'detail-link')).replaceChildren(...sourceLinks(item));
  const previous = $(dom(entry, 'previous'));
  const next = $(dom(entry, 'next'));
  previous.href = `#${hashFor(entry, entry.items[Math.max(0, index - 1)])}`;
  next.href = `#${hashFor(entry, entry.items[Math.min(entry.items.length - 1, index + 1)])}`;
  for (const [element, disabled] of [[previous, index === 0], [next, index === entry.items.length - 1]]) {
    if (disabled) { element.setAttribute('aria-disabled', 'true'); element.tabIndex = -1; }
    else { element.removeAttribute('aria-disabled'); element.removeAttribute('tabindex'); }
  }
  reader.querySelectorAll('.hotspot').forEach((hotspot) => {
    if (hotspot.dataset.item === String(item.id)) hotspot.setAttribute('aria-current', 'step');
    else hotspot.removeAttribute('aria-current');
  });
  reader.querySelectorAll('.landmark-nav a').forEach((anchor) => {
    if (anchor.hash === `#${hashFor(entry, item)}`) anchor.setAttribute('aria-current', 'location');
    else anchor.removeAttribute('aria-current');
  });
}

function showPaidWork(entry) {
  const paid = entry.paidWork;
  $(dom(entry, 'detail-panel')).classList.add('paid-selected');
  $(dom(entry, 'detail-number')).textContent = '↝';
  $(dom(entry, 'progress')).textContent = 'SIDE TRAIL';
  $(dom(entry, 'detail-kind')).textContent = 'BEFORE PAID WORK';
  $(dom(entry, 'detail-title')).textContent = paid.title;
  $(dom(entry, 'detail-lead')).textContent = paid.lead;
  $(dom(entry, 'detail-body')).textContent = paid.detail;
  $(dom(entry, 'detail-link')).replaceChildren(...sourceLinks({ link: paid.link, linkLabel: paid.linkLabel }));
  const reader = readerFor(entry);
  reader.querySelectorAll('.hotspot').forEach((hotspot) => hotspot.removeAttribute('aria-current'));
  reader.querySelector('.hotspot-paid').setAttribute('aria-current', 'location');
}

function setZoom(entry, next) {
  const value = Math.max(100, Math.min(175, next));
  zoom[entry.id] = value;
  $(dom(entry, 'map-scale')).style.width = `${value}%`;
  $(dom(entry, 'zoom-value')).textContent = value === 100 ? 'Fit' : `${value}%`;
  $(dom(entry, 'zoom-out')).disabled = value === 100;
  $(dom(entry, 'zoom-in')).disabled = value === 175;
}

function route(navigated = false) {
  const raw = location.hash.slice(1);
  let hash;
  try { hash = decodeURIComponent(raw) || 'longform'; }
  catch { hash = null; }
  if (!raw || isWebHash(hash)) {
    $('route-notice').hidden = true;
    root.dataset.route = 'web';
    root.dataset.entry = '';
    for (const entry of entries) readerFor(entry).dataset.active = 'false';
    showWeb(raw ? hash : 'longform', navigated);
    return;
  }
  leaveWeb();
  if (isPublicationHash(hash)) {
    $('route-notice').hidden = true;
    root.dataset.route = 'publication';
    root.dataset.entry = '';
    for (const entry of entries) readerFor(entry).dataset.active = 'false';
    showPublication(raw ? hash : 'book-cover');
    return;
  }
  const target = routes.get(hash);
  const notice = $('route-notice');
  notice.hidden = !!target;
  if (!target) {
    notice.textContent = 'That field note is not in the guide yet. Showing the collection.';
    history.replaceState(null, '', `${location.pathname}${location.search}#library`);
  }
  const active = target || routes.get('library');
  root.dataset.route = active.view === 'library' ? 'library' : 'reader';
  root.dataset.entry = active.entry?.id || '';
  for (const entry of entries) {
    const reader = readerFor(entry);
    reader.dataset.active = String(entry === active.entry);
    reader.dataset.view = entry === active.entry ? active.view : '';
    reader.querySelectorAll('.reader-tabs a').forEach((tab) => {
      if (entry === active.entry && tab.dataset.view === active.view) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  }
  if (active.entry) {
    if (active.paid) showPaidWork(active.entry);
    else if (active.view === 'map') showItem(active.entry, active.index);
    if ((active.paid || (active.view === 'map' && hash !== active.entry.mapHash)) && zoom[active.entry.id] > 100) {
      const reader = readerFor(active.entry);
      const hotspot = active.paid ? reader.querySelector('.hotspot-paid') : reader.querySelector(`.hotspot[data-item="${active.entry.items[active.index].id}"]`);
      const scroll = $(dom(active.entry, 'map-scroll'));
      scroll.scrollTo({ left: Math.max(0, hotspot.offsetLeft - scroll.clientWidth / 2), top: Math.max(0, hotspot.offsetTop - scroll.clientHeight / 2), behavior: 'instant' });
    }
    const selectedNote = active.paid || (active.view === 'map' && hash !== active.entry.mapHash);
    const showBelowMap = active.entry.id === 'kingdom' && selectedNote;
    const showMobileNote = navigated && selectedNote && matchMedia('(max-width: 760px)').matches;
    if (showBelowMap || showMobileNote) {
      $(dom(active.entry, 'detail-panel')).scrollIntoView({ block: 'start', behavior: 'instant' });
      $(dom(active.entry, 'detail-title')).focus({ preventScroll: true });
    }
  }
  if (!active.entry || (active.view !== 'map' || hash === active.entry.mapHash)) window.scrollTo({ top: 0, behavior: 'instant' });
}

for (const entry of entries) {
  $(dom(entry, 'zoom-out')).addEventListener('click', () => setZoom(entry, zoom[entry.id] - 25));
  $(dom(entry, 'zoom-in')).addEventListener('click', () => setZoom(entry, zoom[entry.id] + 25));
  $(dom(entry, 'zoom-reset')).addEventListener('click', () => setZoom(entry, 100));
  setZoom(entry, 100);
  readerFor(entry).addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor?.hash === location.hash && routes.has(location.hash.slice(1))) {
      event.preventDefault();
      route(true);
    }
  });
}
document.querySelector('.skip-link').addEventListener('click', (event) => { event.preventDefault(); $('main').focus(); });
window.addEventListener('hashchange', () => route(true));
route();
