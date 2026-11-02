import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { guide, entries } from './content/guide.mjs';
import { renderPublication, renderIntegratedContentPrint } from './publication-render.mjs';
import { renderContentStudies } from './content-studies-render.mjs';
import { composePublication } from './compose-publication.mjs';
import { createFieldGuide } from './content/field-guide.mjs';
import { renderWeb } from './web-render.mjs';

const source = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(source, '../../public/raidguild-field-guide');
const sourcePublication = JSON.parse(await readFile(path.join(source, 'publication.json'), 'utf8'));
const contentStudies = JSON.parse(await readFile(path.join(source, 'content-studies.json'), 'utf8'));
const publication = composePublication(sourcePublication, contentStudies);
const fieldGuide = createFieldGuide(publication);
const chapters = publication.sections.filter((section) => ['party', 'raid', 'rip', 'kit'].includes(section.id));
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const external = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const itemHash = (entry, item) => item.hash || `${entry.id}-${item.id}`;
const dom = (entry, name) => entry.id === 'joining' ? name : `${entry.id}-${name}`;
const number = (index) => String(index + 1).padStart(2, '0');
const links = (item) => `${external(item.link, item.linkLabel)}${(item.extraLinks || []).map((extra) => ` · ${external(extra.url, extra.label)}`).join('')}`;
const kindLabel = (item) => item.kind === 'realm' ? 'IMAGINED REALM' : item.kind === 'gateway' ? 'GUILD GATEWAY' : item.kind === 'place' ? 'PRACTICAL PLACE' : 'JOINING STAGE';
const statusLabel = (status) => ({ planned: 'PLANNED', available: 'READ NOW', landscape: 'IN THIS LANDSCAPE' })[status];
const contentsMarkup = (item, id = '') => item.contents ? `<div ${id ? `id="${id}"` : ''} class="entry-contents"><span>IN THE FIELD GUIDE</span><strong>${escape(item.contents.title)}</strong><small>${statusLabel(item.contents.status)}</small>${item.contents.href ? `<a href="${escape(item.contents.href)}">Read now →</a>` : ''}</div>` : '';

if (entries.length !== 2 || entries[0].items.length !== 7 || entries[1].items.length !== 8 || entries.some((entry) => entry.items.some((item) => item.x < 0 || item.x > 100 || item.y < 0 || item.y > 100))) {
  throw new Error('Expected joining (7) and kingdom (8) entries with percentage coordinates.');
}

function renderEntry(entry) {
  const first = entry.items[0];
  const joining = entry.id === 'joining';
  const textItems = entry.items.map((item, index) => `
    <li id="${dom(entry, `text-${item.id}`)}"><span id="${itemHash(entry, item)}" class="fragment-target" aria-hidden="true"></span>
      <span class="stage-number" aria-hidden="true">${number(index)}</span><div><span class="item-kind">${kindLabel(item)}</span><h3>${escape(item.title)}</h3><p class="stage-lead">${escape(item.lead)}</p><p>${escape(item.detail)}</p>${contentsMarkup(item)}<p class="stage-source">${links(item)}</p></div>
    </li>`).join('');
  const hotspots = entry.items.map((item, index) => `<a class="hotspot ${item.kind === 'realm' ? 'hotspot-realm' : item.kind === 'gateway' ? 'hotspot-gateway' : ''}" href="#${itemHash(entry, item)}" data-item="${escape(item.id)}" style="--x:${item.x}%;--y:${item.y}%" aria-label="${escape(`${item.kind === 'realm' ? 'Conceptual realm' : joining ? 'Stage' : 'Landmark'} ${index + 1}: ${item.title}`)}"><span>${index + 1}</span></a>`).join('');
  const paidMarker = entry.paidWork ? '<a class="hotspot hotspot-paid" href="#paid-work" data-paid="true" style="--x:76%;--y:63%" aria-label="Side trail: before receiving paid Raid work"><span aria-hidden="true">↝</span></a>' : '';
  const paidAside = entry.paidWork ? `<div class="side-note"><div class="side-note-mark">↝</div><div><h3>${escape(entry.paidWork.title)}</h3><p>${escape(entry.paidWork.lead)} ${escape(entry.paidWork.detail)}</p>${external(entry.paidWork.link, entry.paidWork.linkLabel)}</div></div>` : '';
  const paidText = entry.paidWork ? `<aside id="paid-work" class="payment-card"><span aria-hidden="true">↝</span><div><h3>${escape(entry.paidWork.title)}</h3><p><strong>${escape(entry.paidWork.lead)}</strong> ${escape(entry.paidWork.detail)}</p>${external(entry.paidWork.link, entry.paidWork.linkLabel)}</div></aside>` : '';
  const landmarkNav = !joining ? `<nav class="landmark-nav" aria-label="Kingdom landmarks"><div><span class="eyebrow">LOOK BEYOND THE PINS</span><h2>Choose a landmark</h2><p>Numbers identify places on the map, not pages or reading order.</p></div><ol>${entry.items.map((item, index) => `<li><a href="#${itemHash(entry, item)}"><span class="landmark-number">${number(index)}</span><span class="landmark-label"><strong>${escape(item.title)}</strong><small>${escape(item.contents.title)} · ${statusLabel(item.contents.status)}</small></span></a></li>`).join('')}</ol></nav>` : '';
  return `<section id="${joining ? 'reader' : 'kingdom-reader'}" class="reader ${joining ? '' : 'landscape-reader'}" data-entry="${entry.id}" aria-labelledby="${dom(entry, 'reader-title')}">
    <div class="reader-head"><div><a class="back-link" href="#library">← Back to collection</a><div class="eyebrow">${escape(entry.eyebrow)}</div><h1 id="${dom(entry, 'reader-title')}">${escape(entry.title)}</h1><p>${escape(entry.intro)}</p></div><nav class="reader-tabs" aria-label="${escape(entry.title)} views"><a href="#${entry.mapHash}" data-view="map">Explore map</a><a href="#${entry.textHash}" data-view="text">Read text</a><a href="#${entry.sourcesHash}" data-view="sources">Sources</a></nav></div>
    <div id="${dom(entry, 'map-view')}" class="map-view"><span id="${entry.mapHash}" class="fragment-target" aria-hidden="true"></span><div class="reader-layout"><div class="map-column"><div class="map-toolbar"><span>${joining ? 'THE JOINING ROUTE' : 'THE GUILD LANDSCAPE'}</span><div class="zoom-controls" aria-label="Map zoom"><button type="button" id="${dom(entry, 'zoom-out')}" aria-label="Zoom out">−</button><output id="${dom(entry, 'zoom-value')}" aria-live="polite">Fit</output><button type="button" id="${dom(entry, 'zoom-in')}" aria-label="Zoom in">+</button><button type="button" id="${dom(entry, 'zoom-reset')}">Fit</button></div></div><div class="map-scroll" id="${dom(entry, 'map-scroll')}" tabindex="0" aria-label="Illustrated map; scroll to explore when zoomed"><div class="map-scale" id="${dom(entry, 'map-scale')}"><div class="map-canvas"><img src="./${escape(entry.image)}" alt="${escape(entry.imageAlt)}" width="${entry.imageWidth}" height="${entry.imageHeight}">${hotspots}${paidMarker}</div></div></div><p class="art-note">${joining ? 'Concept illustration with captions embedded in the image. Use the numbered markers or text view for editable, current notes.' : 'Illustrated metaphor. The numbered landmarks and notes are editable separately from the artwork.'}</p></div><aside id="${dom(entry, 'detail-panel')}" class="detail-panel" aria-labelledby="${dom(entry, 'detail-title')}"><div class="detail-top"><span class="eyebrow">${joining ? 'WAYPOINT NOTES' : 'LANDMARK NOTES'}</span><span id="${dom(entry, 'progress')}" class="progress">01 / ${number(entry.items.length - 1)}</span></div><div class="detail-content"><span id="${dom(entry, 'detail-number')}" class="detail-number" aria-hidden="true">01</span><div><span id="${dom(entry, 'detail-kind')}" class="item-kind">${kindLabel(first)}</span><h2 id="${dom(entry, 'detail-title')}" tabindex="-1" aria-live="polite">${escape(first.title)}</h2><p id="${dom(entry, 'detail-lead')}" class="detail-lead">${escape(first.lead)}</p><p id="${dom(entry, 'detail-body')}">${escape(first.detail)}</p>${contentsMarkup(first, dom(entry, 'detail-contents'))}<p id="${dom(entry, 'detail-link')}" class="detail-link">${links(first)}</p></div></div><nav class="step-nav" aria-label="${joining ? 'Stage' : 'Landmark'} navigation"><a id="${dom(entry, 'previous')}" href="#${itemHash(entry, first)}">← Previous</a><a id="${dom(entry, 'next')}" href="#${itemHash(entry, entry.items[1])}">Next ${joining ? 'stop' : 'landmark'} →</a></nav>${paidAside}</aside></div>${landmarkNav}</div>
    <div id="${dom(entry, 'text-view')}" class="transcript" aria-labelledby="${dom(entry, 'text-title')}"><span id="${entry.textHash}" class="fragment-target" aria-hidden="true"></span><div class="text-intro"><span class="eyebrow">${joining ? 'THE COMPLETE ROUTE' : 'THE COMPLETE LANDSCAPE'}</span><h2 id="${dom(entry, 'text-title')}">${escape(entry.textTitle)}</h2><p>${escape(entry.textIntro)}</p></div><ol class="stage-list">${textItems}</ol>${paidText}</div>
    <div id="${dom(entry, 'sources-view')}" class="sources-view"><span id="${entry.sourcesHash}" class="fragment-target" aria-hidden="true"></span><span class="eyebrow">CARTOGRAPHER'S NOTES</span><h2>Where this map comes from</h2><p>${escape(entry.sourceIntro)}</p><ul>${entry.sources.map((citation) => `<li>${external(citation.url, citation.label)}</li>`).join('')}</ul><p>${escape(entry.sourceNote)}</p></div>
  </section>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#172940">
  <title>${escape(guide.title)} · An illustrated guide to Guild life</title>
  <meta name="description" content="Explore RaidGuild's lore, people, classes, projects, and field notes in an illustrated longform guide.">
  <link rel="canonical" href="${guide.canonical}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="RaidGuild Artifacts"><meta property="og:title" content="RaidGuild Field Guide · Illustrated atlas"><meta property="og:description" content="Read ${publication.pages.length} illustrated pages of Guild maps, history, classes, resources, and paths forward.">
  <meta property="og:url" content="${guide.canonical}"><meta property="og:image" content="${guide.canonical}field-guide-social-v2.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Crossed swords and a Field Guide title over the Guild's illustrated Moloch kingdom, in the Louchi palette.">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="RaidGuild Field Guide · Illustrated atlas"><meta name="twitter:description" content="Read ${publication.pages.length} illustrated pages and explore two interactive Guild maps."><meta name="twitter:image" content="${guide.canonical}field-guide-social-v2.png"><meta name="twitter:image:alt" content="Crossed swords and a Field Guide title over the Guild's illustrated Moloch kingdom, in the Louchi palette.">
  <link rel="stylesheet" href="./content-studies.css"><link rel="stylesheet" href="./styles.css"><link rel="stylesheet" href="./publication.css"><link rel="stylesheet" href="./book-workbook.css"><link rel="stylesheet" href="./web.css"><link rel="stylesheet" href="./louchi-theme.css"><script type="importmap">{"imports":{"three":"./vendor/three/build/three.module.js"}}</script><script type="module" src="./app.js"></script><script type="module" src="./blood-of-moloch-activate.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a><div class="site-shell">
    <header class="masthead"><a class="brand" href="#longform" aria-label="RaidGuild Field Guide home"><span class="brand-seal" aria-hidden="true">RG</span><span>RAIDGUILD <strong>FIELD GUIDE</strong></span></a><span class="masthead-note">AN ILLUSTRATED GUIDE TO GUILD LIFE <span aria-hidden="true">✦</span> VOLUME 01</span><a class="header-link" href="./content-studies.html#content-studies">Content studies ↗</a><a class="header-link" href="https://handbook.raidguild.org/docs/membership/join-the-guild" target="_blank" rel="noopener noreferrer">The handbook ↗</a></header>
    <main id="main" tabindex="-1"><p id="route-notice" class="route-notice" role="status" hidden></p>
      <section id="library" class="library" aria-labelledby="library-title"><div class="library-hero"><div class="library-copy"><span class="eyebrow">FIELD GUIDE / ISSUE 01</span><h1 id="library-title">Explore the Guild, <em>one map</em> at a time.</h1><p class="hero-lead">Follow the joining route, then wander the Guild Kingdom: a landscape of collaboration, shared resources, and imagined possibilities.</p><div class="hero-actions"><a class="primary-button" href="#kingdom-map">Explore the kingdom <span aria-hidden="true">→</span></a><a class="secondary-button" href="#map">Follow the joining route ↗</a></div><p class="hero-footnote">Illustrated interpretations. The linked handbook holds current process details.</p></div><div class="hero-art"><img src="./style-landscape-reference.png" alt="An armored traveler looks across an oasis toward desert citadel spires beneath a floating planet" width="2200" height="940"></div></div>
      <div class="section-rule"><span>THE COLLECTION</span><span>02 MAPS · ${String(chapters.length).padStart(2, '0')} CHAPTERS</span></div><div class="shelves"><article class="shelf-card available"><div class="shelf-index">01 / JOURNEY MAP</div><h3>Your path into the Guild</h3><p>Seven stops from first contact to active membership.</p><ul><li><a href="#map">Open the joining map ↗</a></li><li><a href="#text">Read the complete route ↗</a></li></ul></article><article class="shelf-card available kingdom-card"><div class="shelf-index">02 / LANDSCAPE MAP</div><h3>The Guild Kingdom</h3><p>Five practical places, a Guild gateway, and two imagined realms.</p><ul><li><a href="#kingdom-map">Explore the kingdom ↗</a></li><li><a href="#kingdom-text">Read the landmarks ↗</a></li></ul></article><article class="shelf-card available"><div class="shelf-index">${String(chapters.length).padStart(2, '0')} / BOOK CHAPTERS</div><h3>Explore the illustrated chapters</h3><p>Meet the party, trace a Raid and an improvement proposal, then open the Guild Kit.</p><ul>${chapters.map((section) => `<li><a href="#page${section.pageNumbers[0]}">${escape(section.title)} ↗</a></li>`).join('')}</ul></article></div></section>
      ${renderWeb(fieldGuide)}
      ${renderPublication(publication)}
      ${entries.map(renderEntry).join('\n')}
    </main><footer class="site-footer"><span>RAIDGUILD FIELD GUIDE · VOLUME 01</span><span>Drawn for curious builders. <a href="#library">Return to the collection ↑</a></span></footer>
  </div>
</body>
</html>`;

await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'index.html'), html);
await writeFile(path.join(output, 'content-studies.html'), renderContentStudies(contentStudies));
await writeFile(path.join(output, 'integrated-content-print.html'), renderIntegratedContentPrint(publication));
await writeFile(path.join(output, 'publication.json'), JSON.stringify(publication, null, 2) + '\n');
const assets = [
  ['art/raidguild-crossed-swords.svg', 'raidguild-crossed-swords.svg'],
  ['styles.css', 'styles.css'], ['app.js', 'app.js'], ['publication.css', 'publication.css'], ['publication.js', 'publication.js'], ['book-workbook.css', 'book-workbook.css'], ['web.css', 'web.css'], ['web.js', 'web.js'], ['louchi-theme.css', 'louchi-theme.css'], ['content-studies.css', 'content-studies.css'], ['content-studies.json', 'content-studies.json'], ['content/guide.mjs', 'guide.mjs'], ['content/kingdom.mjs', 'kingdom.mjs'],
  ['art/joining-map-concept-v1.png', 'joining-map-concept-v1.png'], ['art/guild-kingdom-concept-v2.png', 'guild-kingdom-concept-v2.png'],
  ['art/style-landscape-reference.png', 'style-landscape-reference.png'], ['art/field-guide-social-v2.png', 'field-guide-social-v2.png'],
  ['art/blood-of-moloch-tallboy-print.png', 'blood-of-moloch-tallboy-print.png'], ['art/blood-of-moloch-label.png', 'blood-of-moloch-label.png'], ['art/raidbrood-axes.png', 'raidbrood-axes.png'], ['art/blood-of-moloch-tallboy.glb', 'blood-of-moloch-tallboy.glb'],
  ['blood-of-moloch-activate.js', 'blood-of-moloch-activate.js'], ['blood-of-moloch-viewer.js', 'blood-of-moloch-viewer.js'],
];
for (const asset of Object.values(publication.assets)) {
  if (!/^art\/[a-z0-9-]+\.png$/.test(asset.path)) throw new Error(`Publication asset not on art path: ${asset.path}`);
  assets.push([asset.path, path.basename(asset.path)]);
}
for (const [target, input] of new Map(assets.map(([input, target]) => [target, input]))) await copyFile(path.join(source, input), path.join(output, target));
for (const font of ['Grinder-Refined-Regular.woff2','Grinder-Refined-Italic.woff2','Grinder-Refined-Retalic.woff2','Ubuntu-Variable.ttf','UbuntuMono-Regular.ttf','UbuntuMono-Bold.ttf','UbuntuMono-UFL.txt','README.md']) {
  await mkdir(path.join(output, 'fonts'), { recursive: true });
  await copyFile(path.join(source, 'fonts', font), path.join(output, 'fonts', font));
}
for (const file of ['LICENSE', 'build/three.core.js', 'build/three.module.js', 'examples/jsm/loaders/GLTFLoader.js', 'examples/jsm/controls/OrbitControls.js', 'examples/jsm/utils/BufferGeometryUtils.js']) {
  await mkdir(path.dirname(path.join(output, 'vendor/three', file)), {recursive:true});
  await copyFile(path.join(source, 'vendor/three', file), path.join(output, 'vendor/three', file));
}
console.log(`Built ${output}`);
