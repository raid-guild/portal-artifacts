const publication = document.getElementById('book');
const spreads = [...publication.querySelectorAll('.book-spread')];
const previous = document.getElementById('book-previous');
const next = document.getElementById('book-next');
const progress = document.getElementById('book-progress');
const illustrated = [...publication.querySelectorAll('.illustrated-canvas')];
const atlas = publication.querySelector('.atlas-canvas');
const atlasDetails = publication.querySelector('.atlas-details');
const trail = publication.querySelector('.trail-canvas');
const trailDetails = publication.querySelector('.trail-details');
const printMedia = matchMedia('print');
const totalPages = Number(publication.dataset.pageCount);
printMedia.addEventListener('change', () => {
  atlasDetails.open = printMedia.matches || ['book-contents', 'page3', 'atlas-field-notes'].includes(location.hash.slice(1));
  trailDetails.open = printMedia.matches || location.hash === '#page21';
});

function drawTrailLeaders() {
  const area = trail.querySelector('.trail-art-wrap');
  const svg = trail.querySelector('.trail-leader-lines');
  if (!area.getBoundingClientRect().width || getComputedStyle(svg).display === 'none') return;
  const bounds = area.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  svg.replaceChildren();
  for (const note of trail.querySelectorAll('[data-diagram-target="note"]')) {
    const spot = trail.querySelector(`#rip-${note.dataset.diagramItem}-spot`);
    const from = note.getBoundingClientRect();
    const to = spot.getBoundingClientRect();
    const x1 = from.left + from.width / 2 - bounds.left;
    const y1 = (from.top < to.top ? from.bottom : from.top) - bounds.top;
    const x2 = to.left + to.width / 2 - bounds.left;
    const y2 = to.top + to.height / 2 - bounds.top;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    svg.append(path);
  }
}

function drawAtlasLeaders() {
  const area = atlas.querySelector('.atlas-map-wrap');
  const svg = atlas.querySelector('.atlas-leader-lines');
  if (!area.getBoundingClientRect().width || getComputedStyle(svg).display === 'none') return;
  const bounds = area.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  svg.replaceChildren();
  for (const note of atlas.querySelectorAll('[data-atlas-target="note"]')) {
    const spot = atlas.querySelector(`#atlas-${note.dataset.atlasId}-spot`);
    const from = note.getBoundingClientRect();
    const to = spot.getBoundingClientRect();
    const x1 = from.left + from.width / 2 - bounds.left;
    const y1 = (from.top < to.top ? from.bottom : from.top) - bounds.top;
    const x2 = to.left + to.width / 2 - bounds.left;
    const y2 = to.top + to.height / 2 - bounds.top;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    svg.append(path);
  }
}

function drawLeaders(canvas) {
  const area = canvas.querySelector('.spread-illustration');
  const svg = canvas.querySelector('.leader-lines');
  if (!area.getBoundingClientRect().width || getComputedStyle(svg).display === 'none') return;
  const bounds = area.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  svg.replaceChildren();
  for (const note of canvas.querySelectorAll('[data-diagram-target="note"]')) {
    const spot = canvas.querySelector(`#${note.dataset.diagramId}-${note.dataset.diagramItem}-spot`);
    const from = note.getBoundingClientRect();
    const to = spot.getBoundingClientRect();
    const x1 = (from.left < bounds.left + bounds.width / 2 ? from.right : from.left) - bounds.left;
    const y1 = from.top + from.height / 2 - bounds.top;
    const x2 = to.left + to.width / 2 - bounds.left;
    const y2 = to.top + to.height / 2 - bounds.top;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    svg.append(path);
  }
}

const leaderObserver = new ResizeObserver(() => illustrated.forEach(drawLeaders));
for (const canvas of illustrated) {
  leaderObserver.observe(canvas);
  canvas.querySelector('.diagram-scroll').addEventListener('scroll', () => drawLeaders(canvas), { passive: true });
}
leaderObserver.observe(atlas);
atlas.querySelector('.atlas-map-scroll').addEventListener('scroll', drawAtlasLeaders, { passive: true });
leaderObserver.observe(trail);
trail.querySelector('.trail-image-scroll').addEventListener('scroll', drawTrailLeaders, { passive: true });

export function isPublicationHash(hash) {
  return ['book-cover', 'book-contents', 'book-read-all', 'atlas-field-notes'].includes(hash) || /^page\d+$/.test(hash) && !!document.getElementById(hash)?.matches('[data-page]') || !!document.getElementById(hash)?.matches('[data-diagram-target],[data-atlas-target]');
}

export function showPublication(hash) {
  const all = hash === 'book-read-all';
  const diagramTarget = document.getElementById(hash)?.matches('[data-diagram-target]') ? document.getElementById(hash) : null;
  const atlasTarget = document.getElementById(hash)?.matches('[data-atlas-target]') ? document.getElementById(hash) : null;
  const page = diagramTarget ? Number(diagramTarget.closest('.book-spread').dataset.firstPage) : atlasTarget || hash === 'atlas-field-notes' ? 2 : hash === 'book-contents' ? 3 : hash.startsWith('page') ? Number(hash.slice(4)) : 1;
  const spread = spreads.findIndex((element) => element.querySelector(`[data-page="${page}"]`)) + 1;
  publication.dataset.view = all ? 'all' : 'spread';
  for (const [index, element] of spreads.entries()) element.dataset.active = String(all || index + 1 === spread);
  progress.textContent = all ? `All ${totalPages} pages` : `Spread ${spread} of ${spreads.length}`;
  previous.href = `#page${spreads[Math.max(0, spread - 2)].dataset.firstPage}`;
  next.href = `#page${spreads[Math.min(spreads.length - 1, spread)].dataset.firstPage}`;
  for (const [element, disabled] of [[previous, spread === 1], [next, spread === spreads.length]]) {
    if (disabled || all) { element.setAttribute('aria-disabled', 'true'); element.tabIndex = -1; }
    else { element.removeAttribute('aria-disabled'); element.removeAttribute('tabindex'); }
  }
  publication.querySelectorAll('.book-global-nav a').forEach((anchor) => {
    const active = anchor.hash === `#${hash}` || (hash.startsWith('page') && anchor.hash === '#book-cover' && page <= 2);
    if (active) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
  publication.querySelectorAll('[data-diagram-item]').forEach((element) => {
    const selected = diagramTarget && element.dataset.diagramId === diagramTarget.dataset.diagramId && element.dataset.diagramItem === diagramTarget.dataset.diagramItem;
    if (element.matches('.diagram-hotspot,.trail-hotspot,.diagram-caption-nav a,[data-diagram-target="note"]')) {
      if (selected) element.setAttribute('aria-current', 'location');
      else element.removeAttribute('aria-current');
    }
    if (element.matches('[data-diagram-target="note"]')) element.dataset.selected = String(!!selected);
  });
  atlasDetails.open = printMedia.matches || all || ['book-contents', 'page3', 'atlas-field-notes'].includes(hash);
  trailDetails.open = printMedia.matches || all || hash === 'page21';
  atlas.querySelectorAll('[data-atlas-id]').forEach((element) => {
    if (atlasTarget && element.dataset.atlasId === atlasTarget.dataset.atlasId) element.setAttribute('aria-current', 'location');
    else element.removeAttribute('aria-current');
  });
  if (diagramTarget) {
    const focusTarget = diagramTarget.matches('[data-diagram-target="note"]') ? diagramTarget.querySelector('h3,h4') : diagramTarget;
    focusTarget.focus({ preventScroll: true });
    focusTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  } else if (atlasTarget) {
    const focusTarget = atlasTarget.matches('[data-atlas-target="note"]') ? atlasTarget.querySelector('h3') : atlasTarget;
    focusTarget.focus({ preventScroll: true });
    focusTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  } else if (hash === 'atlas-field-notes') {
    const target = document.getElementById(hash);
    target.querySelector('h2').focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  } else if ([3, 21, 23, 25].includes(page) && (hash === 'book-contents' || hash === `page${page}`)) {
    const target = document.getElementById(`page${page}`);
    const heading = [3, 23].includes(page) ? document.getElementById(`page${page}-title`) : target.querySelector('h2');
    heading.focus({ preventScroll: true });
    ([3, 23].includes(page) ? heading : target).scrollIntoView({ block: 'start', behavior: 'instant' });
  } else if (hash === `page${page}` && page !== Number(spreads[spread - 1]?.dataset.firstPage)) {
    const target = document.getElementById(hash);
    const heading = target.querySelector('h2');
    heading?.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' });
  } else window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(() => { illustrated.forEach(drawLeaders); drawAtlasLeaders(); drawTrailLeaders(); });
}

publication.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor?.hash === location.hash && isPublicationHash(location.hash.slice(1))) {
    event.preventDefault();
    showPublication(location.hash.slice(1));
  }
});
