import { renderContentStudyBody } from './content-studies-render.mjs';
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const assetUrl = (publication, id) => `./${publication.assets[id].path.split('/').at(-1)}`;
const cropStyle = (crop = [0, 0, 1, 1]) => {
  const [x, y, width, height] = crop;
  return `--crop-width:${100 / width}%;--crop-height:${100 / height}%;--crop-left:${-100 * x / width}%;--crop-top:${-100 * y / height}%`;
};
const cropImage = (publication, id, crop, className = 'book-art-window') => className === 'role-portrait'
  ? `<div class="role-portrait"><div class="role-crop-frame" style="--crop-aspect:${(1.5 * crop[2] / crop[3]).toFixed(6)}"><img src="${assetUrl(publication, id)}" alt="${escape(publication.assets[id].alt)}" style="${cropStyle(crop)}"></div></div>`
  : `<div class="${className}"><img src="${assetUrl(publication, id)}" alt="${escape(publication.assets[id].alt)}" style="${cropStyle(crop)}"></div>`;
const sourceLink = (publication, key) => `<a href="${escape(publication.sources[key].url)}" target="_blank" rel="noopener noreferrer">${escape(publication.sources[key].title)} ↗</a>`;

function renderBlock(publication, block, page) {
  const title = block.title ? `<h3>${escape(block.title)}</h3>` : '';
  if (block.type === 'paragraph' || block.type === 'caption') return `<section class="book-block book-${block.type}">${title}<p>${escape(block.text)}</p></section>`;
  if (block.type === 'contents') return `<section class="book-block book-contents-block">${title}<ol>${block.items.map((item) => `<li><a href="#page${item.destination.pageNumber}"><span>${escape(item.text || String(item.destination.pageNumber).padStart(2, '0'))}</span><strong>${escape(item.title)}</strong></a></li>`).join('')}</ol></section>`;
  if (block.type === 'roles') return `<section class="book-block book-roles">${title}<div class="role-grid">${block.items.map((item) => `<article class="role-card">${cropImage(publication, item.assetId, item.crop, 'role-portrait')}<div><span class="role-skill">${escape(item.skill)}</span><h4>${escape(item.title)}</h4><p>${escape(item.text)}</p></div></article>`).join('')}</div></section>`;
  if (block.type === 'steps') {
    const diagram = publication.pages.find((candidate) => candidate.diagram?.notesPage === page.number)?.diagram;
    return `<section class="book-block book-steps${diagram ? ' diagram-notes' : ''}">${title}<ol>${block.items.map((item, index) => {
      const noteId = diagram ? `${diagram.id}-${item.id}-note` : '';
      const heading = item.destination ? `<a href="#page${item.destination.pageNumber}">${escape(item.title)}</a>` : escape(item.title);
      const number = diagram ? `<a class="book-step-number diagram-back" href="#${diagram.id}-${item.id}-spot" aria-label="Back to ${escape(item.title)} marker on the ${diagram.id} diagram">${String(index + 1).padStart(2, '0')}</a>` : `<span class="book-step-number">${String(index + 1).padStart(2, '0')}</span>`;
      return `<li${noteId ? ` id="${noteId}" data-diagram-target="note" data-diagram-id="${diagram.id}" data-diagram-item="${escape(item.id)}"` : ''}>${number}<div><h4${noteId ? ' tabindex="-1"' : ''}>${heading}</h4><p>${escape(item.text)}</p></div></li>`;
    }).join('')}</ol></section>`;
  }
  if (block.type === 'links') return `<section class="book-block book-links">${title}<ul>${block.items.map((item) => `<li><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗</a>${item.text ? `<p>${escape(item.text)}</p>` : ''}</li>`).join('')}</ul></section>`;
  throw new Error(`Unknown publication block type: ${block.type}`);
}

function renderDiagram(publication, page) {
  const { diagram } = page;
  const notesPage = publication.pages[diagram.notesPage - 1];
  const items = notesPage.blocks.find((block) => block.type === 'steps').items;
  const byId = new Map(items.map((item, index) => [item.id, { ...item, index }]));
  const spots = diagram.hotspots.map((spot) => {
    const item = byId.get(spot.itemId);
    return `<a id="${diagram.id}-${spot.itemId}-spot" class="diagram-hotspot" href="#${diagram.id}-${spot.itemId}-note" data-diagram-target="spot" data-diagram-id="${diagram.id}" data-diagram-item="${escape(spot.itemId)}" style="--x:${spot.x}%;--y:${spot.y}%" aria-label="${escape(item.title)}: read the ${diagram.id} diagram note"><span aria-hidden="true">${item.index + 1}</span></a>`;
  }).join('');
  const nav = `<nav class="diagram-caption-nav" aria-label="${escape(page.title)} notes"><span>READ THE CAPTIONS · SCROLL IMAGE SIDEWAYS FOR MORE MARKERS</span>${items.map((item, index) => `<a href="#${diagram.id}-${item.id}-note" data-diagram-id="${diagram.id}" data-diagram-item="${escape(item.id)}">${index + 1}. ${escape(item.title)}</a>`).join('')}</nav>`;
  const image = `<div class="book-art-window diagram-art"><div class="diagram-scroll" tabindex="0" aria-label="${escape(page.title)} image; scroll to explore markers"><div class="diagram-plane"><img src="${assetUrl(publication, page.art.assetId)}" alt="${escape(publication.assets[page.art.assetId].alt)}" width="1536" height="1024">${spots}</div></div></div>`;
  return { image, nav };
}

function renderPage(publication, page) {
  if (page.layout === 'workbook') {
    const next = {lore:['culture','Is this your kind of party?'],culture:['joining','Follow the joining route'],classes:['classes2','Meet more classes'],classes2:['classes3','Meet more classes'],classes3:['classes4','Meet more classes'],classes4:['classes5','Meet more classes'],classes5:['classes6','Meet more classes'],classes6:['warlock','Meet the Warlock'],warlock:['artificer','Meet the Artificer'],brood:['branches','Explore other paths'],branches:['worksheet','Make your character'],worksheet:['sidequest','Plan your side quest'],sidequest:['mmd','Try Meme Driven Development'],mmd:['membership','Prepare your membership request'],membership:['backstory','Write your backstory'],backstory:['mapgrid','Draw the next map'],mapgrid:['credits1','Meet the Guild roll'],credits1:['back','Until the next quest']};
    const [nextId,nextLabel]=next[page.workbookPage.id]||['airship','Board the Raid airship'];
    const nextPage=publication.pages.find((candidate)=>candidate.sourceRef?.pageId===nextId)||publication.pages.find((candidate)=>candidate.legacyNumber===(nextId==='joining'?4:nextId==='back'?16:8));
    const sheetLink=`<a href="#page${nextPage.number}">${nextLabel} →</a>`;
    const body = renderContentStudyBody(page.workbookPage,publication);
    return `<article id="page${page.number}" class="book-page book-workbook workbook-page layout-${escape(page.workbookPage.layout)}" data-page="${page.number}" data-section="${escape(page.sectionId)}" aria-labelledby="page${page.number}-title"><header class="workbook-page-head"><span class="eyebrow">FIELD GUIDE / ${String(page.number).padStart(2,'0')} OF ${publication.pages.length}</span><h2 id="page${page.number}-title" tabindex="-1">${escape(page.title)}</h2><p>${escape(page.intro)}</p></header>${body}<footer class="workbook-page-foot"><span>RAIDGUILD · FIELD GUIDE</span>${sheetLink}<span>${String(page.number).padStart(2,'0')} / ${publication.pages.length}</span></footer></article>`;
  }
  if (page.layout === 'resources-and-next') {
    const links=page.blocks.find(block=>block.type==='links').items;
    const steps=page.blocks.find(block=>block.type==='steps').items;
    return `<article id="page${page.number}" class="book-page layout-resources-and-next" data-page="${page.number}" data-section="${escape(page.sectionId)}" aria-labelledby="page${page.number}-title"><div class="book-page-inner"><header class="book-page-header"><span class="book-eyebrow">${escape(page.eyebrow)}</span><h2 id="page${page.number}-title">${escape(page.title)}</h2><p>${escape(page.intro)}</p></header><div class="doors-columns"><section><h3>Five public doors</h3><ul>${links.map(item=>`<li><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗</a><p>${escape(item.text)}</p></li>`).join('')}</ul></section><section><h3>Five possible moves</h3><ol>${steps.map((item,i)=>`<li><b>0${i+1}</b><div><h4>${escape(item.title)}</h4><p>${escape(item.text)}</p></div></li>`).join('')}</ol></section></div><aside class="doors-atlas-note"><strong>Atlas field notes.</strong> The Gathering Hall, Workshop, Expedition Dock, Archive, and Commons are places to gather, build, raid, learn, and share. Queen Raida helps surface context; people make the judgments. Moloch names coordination failure. The arrival road is yours to walk.</aside><footer class="book-folio"><span>RAIDGUILD FIELD GUIDE</span><span>${String(page.number).padStart(2,'0')}</span></footer></div></article>`;
  }
  if (page.layout === 'closing-quote') {
    return `<article id="page${page.number}" class="book-page layout-closing-quote" data-page="${page.number}" data-section="${escape(page.sectionId)}" aria-labelledby="page${page.number}-title"><img class="closing-castle-art" src="${assetUrl(publication,page.art.assetId)}" alt="${escape(publication.assets[page.art.assetId].alt)}"><div class="closing-quote-inner"><blockquote><span class="book-eyebrow">${escape(page.eyebrow)}</span><h2 id="page${page.number}-title">${escape(page.title)}</h2><p>${escape(page.quote)}</p></blockquote><span class="closing-quote-mark">RAIDGUILD · FIELD GUIDE</span></div><footer class="book-folio"><span>THE ROAD CONTINUES</span><span>${String(page.number).padStart(2,'0')}</span></footer></article>`;
  }
  const diagram = page.diagram ? renderDiagram(publication, page) : null;
  const art = diagram?.image || (page.art ? cropImage(publication, page.art.assetId, page.art.crop) : '');
  const sources = page.sourceIds?.length ? `<p class="book-page-sources">Sources: ${page.sourceIds.map((key) => sourceLink(publication, key)).join(' · ')}</p>` : '';
  const anchor = page.number === 1 ? '<span id="book-cover" class="fragment-target" aria-hidden="true"></span>' : page.number === 3 ? '<span id="book-contents" class="fragment-target" aria-hidden="true"></span>' : '';
  return `<article id="page${page.number}" class="book-page layout-${escape(page.layout)}" data-page="${page.number}" data-section="${escape(page.sectionId)}" aria-labelledby="page${page.number}-title">${anchor}<div class="book-page-inner"><header class="book-page-header"><span class="book-eyebrow">${escape(page.eyebrow)}</span><h2 id="page${page.number}-title">${escape(page.title)}</h2><p>${escape(page.intro)}</p></header>${art}<div class="book-page-body">${diagram?.nav || ''}${page.blocks.map((block) => renderBlock(publication, block, page)).join('')}${sources}</div><footer class="book-folio"><span>RAIDGUILD FIELD GUIDE</span><span>${String(page.number).padStart(2, '0')}</span></footer></div></article>`;
}

function renderAtlasSpread(publication, spread) {
  const artPage = publication.pages[spread.artPage - 1];
  const notesPage = publication.pages[spread.notesPage - 1];
  const atlas = spread.atlas;
  const artSources = artPage.sourceIds.map((key) => sourceLink(publication, key)).join(' · ');
  const notesSources = notesPage.sourceIds.map((key) => sourceLink(publication, key)).join(' · ');
  const spots = atlas.landmarks.map((landmark) => `<a id="atlas-${landmark.id}-spot" class="atlas-hotspot" href="#atlas-${landmark.id}-note" data-atlas-target="spot" data-atlas-id="${escape(landmark.id)}" style="--x:${landmark.x}%;--y:${landmark.y}%" aria-label="${escape(landmark.title)}: read atlas note"><span aria-hidden="true">${landmark.number}</span></a>`).join('');
  const cards = atlas.landmarks.map((landmark) => {
    const destination = landmark.destination?.pageNumber ? `#page${landmark.destination.pageNumber}` : `#${landmark.destination.hash}`;
    const pageLabel = landmark.destination?.pageNumber ? `PAGE ${String(landmark.destination.pageNumber).padStart(2, '0')} · ` : '';
    return `<article id="atlas-${landmark.id}-note" class="atlas-card" data-atlas-target="note" data-atlas-id="${escape(landmark.id)}" style="--card-x:${landmark.card.x}%;--card-y:${landmark.card.y}%;--card-width:${landmark.card.width}%"><a class="atlas-return" href="#atlas-${landmark.id}-spot" aria-label="Back to ${escape(landmark.title)} marker">${landmark.number}</a><div><h3 tabindex="-1">${escape(landmark.title)}</h3><p>${escape(landmark.meaning)}</p><a class="atlas-destination" href="${destination}">${pageLabel}${escape(landmark.destination.label)} →</a></div></article>`;
  }).join('');
  return `<article id="page${artPage.number}" class="atlas-canvas" data-page="${artPage.number}" aria-labelledby="page${artPage.number}-title"><div class="atlas-map-wrap"><div class="atlas-title-overlay"><span class="book-eyebrow">${escape(artPage.eyebrow)}</span><h2 id="page${artPage.number}-title">${escape(artPage.title)}</h2></div><div class="atlas-map-scroll" tabindex="0" aria-label="Guild Kingdom atlas; scroll sideways for more landmarks"><div class="atlas-map-shell"><img src="${assetUrl(publication, artPage.art.assetId)}" alt="${escape(publication.assets[artPage.art.assetId].alt)}" width="1774" height="887">${spots}</div></div><div class="atlas-overlay-cards">${cards}</div><svg class="atlas-leader-lines" aria-hidden="true" focusable="false"></svg><div class="atlas-folio-overlay">RAIDGUILD FIELD GUIDE <span>${String(artPage.number).padStart(2,'0')}–${String(notesPage.number).padStart(2,'0')}</span></div></div><details id="page${notesPage.number}" class="atlas-details" data-page="${notesPage.number}" open><summary id="book-contents"><span>FIELD NOTES AND CONTENTS</span><strong>Open the atlas notes</strong></summary><div class="atlas-details-body"><section id="atlas-field-notes"><header><span class="book-eyebrow">${escape(artPage.eyebrow)}</span><h2 tabindex="-1">${escape(artPage.title)} · field notes</h2><p>${escape(artPage.intro)}</p></header>${artPage.blocks.map((block) => renderBlock(publication, block, artPage)).join('')}<p class="book-page-sources">Sources: ${artSources}</p></section><section class="atlas-contents" aria-labelledby="page${notesPage.number}-title"><header><span class="book-eyebrow">${escape(notesPage.eyebrow)}</span><h2 id="page${notesPage.number}-title" tabindex="-1">${escape(notesPage.title)}</h2><p>${escape(notesPage.intro)}</p></header><div class="atlas-contents-body">${notesPage.blocks.map((block) => renderBlock(publication, block, notesPage)).join('')}</div><p class="book-page-sources">Sources: ${notesSources}</p></section></div></details></article>`;
}

function renderTrailSpread(publication, spread) {
  const artPage = publication.pages[spread.artPage - 1];
  const notesPage = publication.pages[spread.notesPage - 1];
  const items = notesPage.blocks.find((block) => block.type === 'steps').items;
  const trail = spread.trail;
  const byId = new Map(items.map((item, index) => [item.id, { ...item, number: index + 1 }]));
  const spots = trail.hotspots.map((spot) => {
    const item = byId.get(spot.itemId);
    return `<a id="rip-${spot.itemId}-spot" class="trail-hotspot" href="#rip-${spot.itemId}-note" data-diagram-target="spot" data-diagram-id="rip" data-diagram-item="${escape(spot.itemId)}" style="--x:${spot.x}%;--y:${spot.y}%" aria-label="${escape(item.title)}: read trail step"><span aria-hidden="true">${item.number}</span></a>`;
  }).join('');
  const cards = items.map((item, index) => {
    const card = trail.cards.find((candidate) => candidate.itemId === item.id);
    return `<article id="rip-${item.id}-note" class="trail-card" data-diagram-target="note" data-diagram-id="rip" data-diagram-item="${escape(item.id)}" style="--card-x:${card.x}%;--card-y:${card.y}%;--card-width:${card.width}%"><a class="trail-return diagram-back" href="#rip-${item.id}-spot" aria-label="Back to ${escape(item.title)} marker">${index + 1}</a><div><h3 tabindex="-1">${escape(item.title)}</h3><p>${escape(item.text)}</p></div></article>`;
  }).join('');
  const artSources = artPage.sourceIds.map((key) => sourceLink(publication, key)).join(' · ');
  const notesSources = notesPage.sourceIds.map((key) => sourceLink(publication, key)).join(' · ');
  return `<article id="page${artPage.number}" class="trail-canvas" data-page="${artPage.number}" aria-labelledby="page${artPage.number}-title"><header class="trail-header"><span class="book-eyebrow">${escape(artPage.eyebrow)}</span><h2 id="page${artPage.number}-title">${escape(artPage.title)}</h2><p>${escape(artPage.intro)}</p></header><div class="trail-art-wrap"><div class="trail-image-scroll" tabindex="0" aria-label="Improvement trail illustration; scroll sideways for steps"><div class="trail-image-plane"><img src="${assetUrl(publication, artPage.art.assetId)}" alt="${escape(publication.assets[artPage.art.assetId].alt)}" width="1536" height="1024">${spots}</div></div><div class="trail-cards">${cards}</div><svg class="trail-leader-lines" aria-hidden="true" focusable="false"></svg><div class="trail-folio">RAIDGUILD FIELD GUIDE <span>${String(artPage.number).padStart(2,'0')}–${String(notesPage.number).padStart(2,'0')}</span></div></div><details id="page${notesPage.number}" class="trail-details" data-page="${notesPage.number}" open><summary>ABOUT THE TRAIL · READ SOURCE NOTES</summary><div class="trail-details-body"><section><span class="book-eyebrow">${escape(artPage.eyebrow)}</span><h2 tabindex="-1">${escape(artPage.title)} · field notes</h2>${artPage.blocks.map((block) => renderBlock(publication, block, artPage)).join('')}<p class="book-page-sources">Sources: ${artSources}</p></section><section><span class="book-eyebrow">${escape(notesPage.eyebrow)}</span><h2 id="page${notesPage.number}-title" tabindex="-1">${escape(notesPage.title)}</h2><p>${escape(notesPage.intro)}</p>${notesPage.blocks.filter((block) => block.type !== 'steps').map((block) => renderBlock(publication, block, notesPage)).join('')}<p class="book-page-sources">Sources: ${notesSources}</p></section></div></details></article>`;
}

function renderIllustratedSpread(publication, spread) {
  const artPage = publication.pages[spread.artPage - 1];
  const notesPage = publication.pages[spread.notesPage - 1];
  const items = notesPage.blocks.find((block) => block.type === 'steps').items;
  const byId = new Map(items.map((item, index) => [item.id, { ...item, index }]));
  const callouts = (side) => `<ol class="callout-side callout-${side}">${spread.calloutSides[side].map((id) => {
    const item = byId.get(id);
    return `<li id="${artPage.diagram.id}-${id}-note" data-diagram-target="note" data-diagram-id="${artPage.diagram.id}" data-diagram-item="${escape(id)}" style="--callout-order:${item.index + 1}"><a class="callout-back diagram-back" href="#${artPage.diagram.id}-${id}-spot" aria-label="Back to ${escape(item.title)} marker on the ${artPage.diagram.id} diagram">${item.index + 1}</a><div><h3 tabindex="-1">${escape(item.title)}</h3><p>${escape(item.text)}</p></div></li>`;
  }).join('')}</ol>`;
  const spots = artPage.diagram.hotspots.map((spot) => {
    const item = byId.get(spot.itemId);
    return `<a id="${artPage.diagram.id}-${spot.itemId}-spot" class="diagram-hotspot" href="#${artPage.diagram.id}-${spot.itemId}-note" data-diagram-target="spot" data-diagram-id="${artPage.diagram.id}" data-diagram-item="${escape(spot.itemId)}" style="--x:${spot.x}%;--y:${spot.y}%" aria-label="${escape(item.title)}: read the ${artPage.diagram.id} diagram note"><span aria-hidden="true">${item.index + 1}</span></a>`;
  }).join('');
  const artCaption = artPage.blocks.map((block) => renderBlock(publication, block, artPage)).join('');
  const otherBlocks = notesPage.blocks.filter((block) => block.type !== 'steps').map((block) => renderBlock(publication, block, notesPage)).join('');
  const sources = [...new Set([...artPage.sourceIds, ...notesPage.sourceIds])].map((key) => sourceLink(publication, key)).join(' · ');
  return `<article id="page${artPage.number}" class="illustrated-canvas" data-page="${artPage.number}" data-diagram="${artPage.diagram.id}" aria-labelledby="page${artPage.number}-title"><header class="spread-header"><span class="book-eyebrow">${escape(artPage.eyebrow)}</span><h2 id="page${artPage.number}-title">${escape(artPage.title)}</h2><p>${escape(artPage.intro)}</p></header><div class="spread-illustration"><div class="diagram-scroll" tabindex="0" aria-label="${escape(artPage.title)} image; scroll sideways for markers"><div class="diagram-plane"><img src="${assetUrl(publication, artPage.art.assetId)}" alt="${escape(publication.assets[artPage.art.assetId].alt)}" width="1536" height="1024">${spots}</div></div><div class="spread-callouts" aria-label="${escape(notesPage.title)}">${callouts('left')}${callouts('right')}</div><svg class="leader-lines" aria-hidden="true" focusable="false"></svg></div><section id="page${notesPage.number}" class="illustrated-notes" data-page="${notesPage.number}" aria-labelledby="page${notesPage.number}-title"><span class="book-eyebrow">${escape(notesPage.eyebrow)}</span><h2 id="page${notesPage.number}-title" tabindex="-1">${escape(notesPage.title)}</h2><p>${escape(notesPage.intro)}</p><p class="diagram-scroll-hint">Scroll the image sideways for more markers. Select a numbered marker or read a caption at either edge.</p><div class="illustrated-footnotes">${artCaption}${otherBlocks}</div><p class="book-page-sources">Sources: ${sources}</p></section><footer class="spread-folio">RAIDGUILD FIELD GUIDE <span>${String(artPage.number).padStart(2, '0')}–${String(notesPage.number).padStart(2, '0')}</span></footer></article>`;
}

export function renderPublication(publication) {
  const sections = publication.sections.map((section) => `<a href="#page${section.pageNumbers[0]}"><span>${String(section.pageNumbers[0]).padStart(2, '0')}</span>${escape(section.title)}</a>`).join('');
  const spreads = publication.spreads.map((spread, index) => {
    const firstPage = publication.pages[spread.pageNumbers[0] - 1];
    return `<div class="book-spread${spread.layout ? ` ${spread.layout}` : ''}" data-spread="${index + 1}" data-first-page="${spread.pageNumbers[0]}" data-longform-section="${escape(firstPage.sectionId)}" aria-label="Spread ${index + 1}">${spread.layout === 'atlas-spread' ? renderAtlasSpread(publication, spread) : spread.layout === 'trail-spread' ? renderTrailSpread(publication, spread) : spread.layout === 'illustrated-spread' ? renderIllustratedSpread(publication, spread) : spread.pageNumbers.map((number) => renderPage(publication, publication.pages[number - 1])).join('')}</div>`;
  }).join('');
  return `<section id="book" class="publication" aria-labelledby="book-title" data-page-count="${publication.pages.length}"><span id="book-read-all" class="fragment-target" aria-hidden="true"></span><div class="book-reader-head"><div><span class="eyebrow">${escape(publication.edition)}</span><h1 id="book-title">${escape(publication.title)}</h1><p>${publication.pages.length} illustrated and workbook pages to explore online or in print.</p></div><nav class="book-global-nav" aria-label="Field Guide reading modes"><a href="#longform" data-book-mode="longform">Web guide</a><a href="#book-cover" data-book-mode="cover">Book reader</a><a href="#book-contents" data-book-mode="contents">Contents</a><a href="#book-read-all" data-book-mode="all">Read all pages</a><a href="./raidguild-field-guide-print.pdf">Print edition PDF</a><a href="#library">Interactive maps</a></nav></div><nav class="book-section-nav" aria-label="Publication sections">${sections}</nav><div class="book-spreads">${spreads}</div><nav class="book-page-nav" aria-label="Publication navigation"><a id="book-previous" href="#page1">← Previous spread</a><span id="book-progress" aria-live="polite">Spread 1 of ${publication.spreads.length}</span><a id="book-next" href="#page2">Next spread →</a></nav></section>`;
}

export function renderIntegratedContentPrint(publication) {
  const numbers=publication.pages.filter((page)=>page.sourceRef?.document==='workbook').map((page)=>page.number);
  const pages=numbers.map((number)=>{
    const page=publication.pages[number-1];
    return `<article id="page${number}" class="workbook-page layout-${escape(page.workbookPage.layout)}" data-page="${number}"><header class="workbook-page-head"><span class="eyebrow">FIELD GUIDE / ${String(number).padStart(2,'0')} OF ${publication.pages.length}</span><h2>${escape(page.title)}</h2><p>${escape(page.intro)}</p></header>${renderContentStudyBody(page.workbookPage,publication)}<footer class="workbook-page-foot"><span>RAIDGUILD · FIELD GUIDE</span><span>${String(number).padStart(2,'0')} / ${publication.pages.length}</span></footer></article>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RaidGuild Field Guide · integrated content print</title><link rel="stylesheet" href="./content-studies.css"><link rel="stylesheet" href="./louchi-theme.css"></head><body>${pages}</body></html>`;
}
