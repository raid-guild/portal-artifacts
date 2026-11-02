import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { guide, entries } from './content/guide.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const published = path.resolve(here, '../../public/raidguild-field-guide');
const html = await readFile(path.join(published, 'index.html'), 'utf8');
const app = await readFile(path.join(published, 'app.js'), 'utf8');
const css = await readFile(path.join(published, 'styles.css'), 'utf8');
const publicationCss = await readFile(path.join(published, 'publication.css'), 'utf8');
const publication = JSON.parse(await readFile(path.join(here, 'publication.json'), 'utf8'));
const edition = JSON.parse(await readFile(path.join(published, 'publication.json'), 'utf8'));
const printExtract = await readFile(path.join(published, 'integrated-content-print.html'), 'utf8');
const social = await readFile(path.join(published, 'field-guide-social-v3.png'));
const studies = JSON.parse(await readFile(path.join(here, 'content-studies.json'), 'utf8'));
const studiesHtml = await readFile(path.join(published, 'content-studies.html'), 'utf8');
const studiesCss = await readFile(path.join(published, 'content-studies.css'), 'utf8');
assert.deepEqual(studies.pageSizeInches, [7, 10]);
assert.deepEqual(studies.pages.map((page) => [page.label, page.id]), [["01", "lore"], ["02", "culture"], ["03", "classes"], ["04", "classes2"], ["05", "classes3"], ["06", "classes4"], ["07", "classes5"], ["08", "classes6"], ["09", "warlock"], ["10", "artificer"], ["11", "brood"], ["12", "branches"], ["13", "worksheet"], ["14", "sidequest"], ["15", "mmd"], ["16", "membership"], ["17", "backstory"], ["18", "mapgrid"], ["19", "credits1"]]);
assert.equal(studies.pages.find(page=>page.id==='lore').sections.length, 3);
assert.equal(studies.pages.find(page=>page.id==='lore').aboutNote, '');
assert.ok(studies.pages.find(page=>page.id==='lore').sections.flatMap((section) => section.paragraphs).join(' ').includes('2019'));
assert.ok(studies.pages.find(page=>page.id==='lore').sections.flatMap((section) => section.paragraphs).join(' ').includes('Ven, Dekan, and Sam'));
assert.ok(studies.pages.find(page=>page.id==='lore').sections.flatMap((section) => section.paragraphs).join(' ').includes('Cooper Turley'));
assert.ok(studies.pages.find(page=>page.id==='lore').sourceIds.includes('odyssy'));
assert.equal(studies.sources.odyssy.url, 'https://medium.com/metacartel/meet-odyssy-the-dao-launchers-d25fea4e169f');
assert.equal(studies.pages.find(page=>page.id==='lore').chronology.length, 5);
assert.equal(studies.pages.find(page=>page.id==='brood').layout,'sidequest-story');
assert.equal(studies.pages.find(page=>page.id==='sidequest').layout,'quest-journal');
assert.equal(studies.pages.find(page=>page.id==='sidequest').prompts.length,4);
for(const rendered of [studiesHtml,html,printExtract]) assert.ok(rendered.includes('Blood of Moloch') && rendered.includes('Sasquatch'));
assert.ok(html.includes('id="page6"') && html.includes('id="page7"'));
const studyRoles = studies.pages.filter(page=>page.layout==='class-duo').flatMap((page) => page.profiles);
assert.equal(studyRoles.length, 12);
assert.deepEqual(studyRoles.map((role) => role.roleId), ['cleric','monk','bard','wizard','warrior','archer','hunter','ranger','paladin','necromancer','druid','mystic-alchemist']);
const publishedRoles = publication.pages.filter((page) => [6,7].includes(page.number)).flatMap((page) => page.blocks.find((block) => block.type === 'roles').items);
for (const role of studyRoles) {
  const original = publishedRoles.find((item) => item.id === role.roleId);
  assert.equal(role.skill, original.skill);
  assert.deepEqual(role.crop, original.crop);
  const profileWords=[role.opening,role.partyRole,role.fieldNote,...role.defaultSkills,...role.paths.flatMap((path)=>[path.title,path.text]),...role.signatureMoves.map((move)=>move.text),role.gear].join(' ').split(/\s+/).length;
  assert.ok(profileWords >= 230 && profileWords <= 260, `${role.roleId} has ${profileWords} words`);
  assert.equal(role.signatureMoves.length, 2);
  assert.ok(role.defaultSkills.length >= 3 && role.defaultSkills.length <= 5);
  assert.ok(role.defaultSkills.every((skill) => skill.length > 2));
  assert.deepEqual(Object.keys(role.stats), ['STR','DEX','CON','INT','WIS','CHA']);
  assert.ok(Object.values(role.stats).every((score) => Number.isInteger(score) && score >= 8 && score <= 18));
}
assert.deepEqual(Object.values(studies.statKey), ['Shipping','Adaptation','Follow-through','Systems','Judgment','Connection']);
assert.equal(studiesHtml.split('Suggested archetype stats. Redistribute freely.').length - 1, 1);
assert.equal(studies.pages.find(page=>page.id==='worksheet').sections.length, 6);
assert.equal(studies.pages.find(page=>page.id==='worksheet').abilityFields.length, 6);
assert.equal(studies.pages.find(page=>page.id==='warlock').profile.roleId, 'warlock');
assert.equal(studies.pages.find(page=>page.id==='warlock').profile.skill, 'Forward Deployed Engineer');
assert.deepEqual(Object.values(studies.pages.find(page=>page.id==='warlock').profile.stats), [12,16,14,17,14,15]);
assert.equal(studies.pages.find(page=>page.id==='artificer').profile.roleId, 'artificer');
assert.equal(studies.pages.find(page=>page.id==='artificer').profile.skill, 'Automation & Agent Systems');
assert.deepEqual(Object.values(studies.pages.find(page=>page.id==='artificer').profile.stats), [10,15,14,18,16,12]);
assert.equal(studies.pages.find(page=>page.id==='worksheet').identityFields.length, 6);
const allProfiles=[...studyRoles,studies.pages.find(page=>page.id==='warlock').profile,studies.pages.find(page=>page.id==='artificer').profile];
assert.equal(allProfiles.length,14);
assert.ok(allProfiles.every((profile)=>profile.paths.length===3));
assert.equal(allProfiles.flatMap((profile)=>profile.paths).length,42);
assert.ok(allProfiles.flatMap((profile)=>profile.paths).every((path)=>path.text.trim().split(/\s+/).length>=12&&path.text.trim().split(/\s+/).length<=18));
for (const profile of allProfiles) {
  const words=[profile.opening,profile.partyRole,profile.fieldNote,...profile.defaultSkills,...profile.paths.flatMap((path)=>[path.title,path.text]),...profile.signatureMoves.map((move)=>move.text),profile.gear].join(' ').split(/\s+/).length;
  assert.ok(words>=230&&words<=260,`${profile.roleId} has ${words} words`);
}
for (const [id,titles] of Object.entries({bard:['Storytelling','Audiovisual','Campaigns'],wizard:['Contract Craft','Protocol Design','Security'],druid:['Analytics','Machine Learning','Data Engineering'],archer:['Product Design','Visual Identity','Creative Technology'],warlock:['Discovery','Systems Integration','Field Delivery'],artificer:['Automations','Agents','Toolmaking']})) assert.deepEqual(allProfiles.find((profile)=>profile.roleId===id).paths.map((path)=>path.title),titles);
assert.deepEqual(Object.values(studies.pages.find(page=>page.id==='artificer').profile.stats),[10,15,14,18,16,12]);
assert.deepEqual(studies.pages.find(page=>page.id==='worksheet').identityFields.slice(2,4),['Path / specialization','Current focus']);
assert.ok(studiesHtml.includes('id="study-warlock"') && studiesHtml.includes('id="study-artificer"'));
assert.ok(studiesHtml.includes('warlock-louchi-v1.png'));
assert.ok(studies.pages.find(page=>page.id==='warlock').profile.assetId === 'warlock' && studies.art.warlock.path === 'art/warlock-louchi-v1.png');
for (const page of studies.pages) assert.ok(studiesHtml.includes(`id="study-${page.id}"`));
for (const role of studyRoles) assert.ok(studiesHtml.includes(`id="class-${role.roleId}"`));
for (const [, target] of studiesHtml.matchAll(/href="#([^"]+)"/g)) assert.ok(studiesHtml.includes(`id="${target}"`));
assert.ok(studiesCss.includes('@page{size:7in 10in'));
assert.ok(html.includes('href="./content-studies.html#content-studies"'));
assert.equal(edition.schemaVersion, 2);
assert.equal(edition.pages.length, 35);
assert.equal(edition.spreads.length, 18);
assert.deepEqual(edition.spreads.map((spread)=>spread.pageNumbers), [[1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29],[30,31],[32,33],[34,35]]);
assert.deepEqual(edition.pages.filter(page=>page.sourceRef?.document==='workbook').map(page=>[page.number,page.sourceRef.pageId]), [[4,'lore'],[5,'culture'],[10,'classes'],[11,'classes2'],[12,'classes3'],[13,'classes4'],[14,'classes5'],[15,'classes6'],[16,'warlock'],[17,'artificer'],[26,'brood'],[27,'branches'],[28,'worksheet'],[29,'sidequest'],[30,'mmd'],[31,'membership'],[32,'backstory'],[33,'mapgrid'],[34,'credits1']]);
assert.equal(edition.assets.warlock.path, 'art/warlock-louchi-v1.png');
assert.equal(edition.assets.artificer.path, 'art/artificer-louchi-v1.png');
assert.equal(edition.pathsIntro, studies.pathsIntro);
for (const rendered of [html, studiesHtml, printExtract]) assert.ok(rendered.includes(studies.pathsIntro));
for (const rendered of [html, studiesHtml, printExtract]) assert.ok(!rendered.includes('<p class="workbook-sources"></p>'));
assert.equal(edition.assets.party.width, 1536);
assert.equal(edition.assets.party.height, 1024);
assert.ok(!html.includes('NaN') && !printExtract.includes('NaN') && !studiesHtml.includes('NaN'));
assert.ok(html.includes('Field Guide class · Forward Deployed Engineer'));
assert.deepEqual(edition.pages.filter((page)=>page.legacyNumber).map((page)=>page.legacyNumber), Array.from({length:16},(_,index)=>index+1));
for (const page of edition.pages) assert.ok(html.includes(`id="page${page.number}"`));
for (const number of [4,5,10,11,12,13,14,15,16,17,26,27,28,29,30,31,32,33,34]) assert.ok(printExtract.includes(`id="page${number}"`));
assert.equal((printExtract.match(/<article id="page\d+" class="workbook-page/g)||[]).length,19);

assert.deepEqual(entries.map((entry) => entry.id), ['joining', 'kingdom']);
assert.equal(publication.schemaVersion, 1);
assert.deepEqual(publication.pageSizeInches, [7, 10]);
assert.equal(publication.pages.length, 16);
assert.equal(publication.sections.length, 8);
assert.deepEqual(publication.spreads.map((spread) => spread.pageNumbers), [[1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15], [16]]);
assert.deepEqual(publication.spreads.filter((spread) => spread.layout).map((spread) => [spread.layout, spread.artPage, spread.notesPage]), [['atlas-spread', 2, 3], ['illustrated-spread', 8, 9], ['trail-spread', 10, 11], ['illustrated-spread', 12, 13]]);
const trail = publication.spreads.find((spread) => spread.layout === 'trail-spread').trail;
const trailItems = publication.pages[10].blocks.find((block) => block.type === 'steps').items;
assert.deepEqual(trail.hotspots.map((spot) => spot.itemId), trailItems.map((item) => item.id));
assert.deepEqual(trail.cards.map((card) => card.itemId), trailItems.map((item) => item.id));
assert.equal((html.match(/class="trail-image-plane"/g) || []).length, 1);
assert.equal(trail.hotspots.length, 6);
for (const spot of trail.hotspots) assert.ok(spot.x >= 0 && spot.x <= 100 && spot.y >= 0 && spot.y <= 100);
for (const card of trail.cards) assert.ok(card.x >= 0 && card.y >= 0 && card.width > 0 && card.x + card.width <= 100);
for (const item of trailItems) {
  assert.ok(html.includes(`id="rip-${item.id}-spot"`));
  assert.ok(html.includes(`id="rip-${item.id}-note"`));
}
assert.equal((html.match(/class="atlas-map-shell"/g) || []).length, 1);
const atlas = publication.spreads.find((spread) => spread.layout === 'atlas-spread').atlas;
assert.equal(atlas.landmarks.length, 8);
assert.equal(edition.spreads.find(spread=>spread.layout==='atlas-spread').atlas.landmarks.find(item=>item.id==='moloch').destination.pageNumber,24);
assert.deepEqual(atlas.landmarks.map((landmark) => landmark.id), entries[1].items.map((item) => item.id));
for (const landmark of atlas.landmarks) {
  assert.ok(html.includes(`id="atlas-${landmark.id}-spot"`));
  assert.ok(html.includes(`id="atlas-${landmark.id}-note"`));
  assert.ok(landmark.x >= 0 && landmark.x <= 100 && landmark.y >= 0 && landmark.y <= 100);
  assert.ok(landmark.card.x >= 0 && landmark.card.y >= 0 && landmark.card.width > 0 && landmark.card.x + landmark.card.width <= 100);
}
assert.equal((html.match(/class="diagram-plane"/g) || []).length, 2);
assert.deepEqual(publication.spreads.flatMap((spread) => spread.pageNumbers), Array.from({ length: 16 }, (_, index) => index + 1));
assert.deepEqual(publication.pages.filter((page) => page.diagram).map((page) => [page.number, page.diagram.id, page.diagram.notesPage, page.diagram.hotspots.length]), [[8, 'airship', 9, 7], [12, 'walker', 13, 6]]);
for (const page of publication.pages.filter((candidate) => candidate.diagram)) {
  const { diagram } = page;
  const noteItems = publication.pages[diagram.notesPage - 1].blocks.find((block) => block.type === 'steps').items;
  const spread = publication.spreads.find((candidate) => candidate.artPage === page.number);
  assert.deepEqual([...spread.calloutSides.left, ...spread.calloutSides.right].sort(), noteItems.map((item) => item.id).sort());
  assert.deepEqual(diagram.hotspots.map((spot) => spot.itemId), noteItems.map((item) => item.id));
  for (const spot of diagram.hotspots) {
    assert.ok(spot.x >= 0 && spot.x <= 100 && spot.y >= 0 && spot.y <= 100);
    assert.ok(html.includes(`id="${diagram.id}-${spot.itemId}-spot"`));
    assert.ok(html.includes(`id="${diagram.id}-${spot.itemId}-note"`));
  }
  for (const [index, first] of diagram.hotspots.entries()) for (const second of diagram.hotspots.slice(index + 1)) {
    assert.ok(Math.hypot((first.x - second.x) * 6, (first.y - second.y) * 4) >= 44, `${diagram.id} markers overlap at minimum plane width`);
  }
}
const sections = new Map(publication.sections.map((section) => [section.id, section]));
for (const page of publication.pages) {
  assert.ok(sections.get(page.sectionId)?.pageNumbers.includes(page.number));
  assert.ok(publication.assets[page.art.assetId]);
  assert.ok(html.includes(`id="page${page.number}"`));
  for (const sourceId of page.sourceIds) assert.ok(publication.sources[sourceId]);
  for (const block of page.blocks) {
    assert.ok(['paragraph', 'caption', 'steps', 'roles', 'links', 'contents'].includes(block.type));
    for (const item of block.items || []) {
      for (const sourceId of item.sourceIds || []) assert.ok(publication.sources[sourceId]);
      if (item.destination) assert.ok(sections.get(item.destination.sectionId)?.pageNumbers.includes(item.destination.pageNumber));
      if (item.assetId) assert.ok(publication.assets[item.assetId]);
    }
  }
}
for (const asset of Object.values(publication.assets)) {
  assert.match(asset.path, /^art\/[a-z0-9-]+\.png$/);
  assert.ok((await stat(path.join(here, asset.path))).size > 0);
  assert.ok((await stat(path.join(published, path.basename(asset.path)))).size > 0);
}
const roleItems = publication.pages.filter((page) => [6, 7].includes(page.number)).flatMap((page) => page.blocks.filter((block) => block.type === 'roles').flatMap((block) => block.items));
assert.equal(roleItems.length, 12);
assert.ok(roleItems.every((role) => role.assetId === 'party' && role.crop.length === 4 && role.text.startsWith('You might be')));
assert.deepEqual(roleItems.map((role) => [role.crop[1], role.crop[3]]), [[0, 0.353516], [0, 0.353516], [0.353516, 0.300781], [0.353516, 0.300781], [0.654297, 0.345703], [0.654297, 0.345703], [0, 0.353516], [0, 0.353516], [0.353516, 0.300781], [0.353516, 0.300781], [0.654297, 0.345703], [0.654297, 0.345703]]);
assert.deepEqual(roleItems.map((role) => role.skill), ['Account Manager', 'Support', 'Builder', 'Design', 'Backend Dev', 'DevOps', 'Marketing', 'Smart Contracts', 'BizDev', 'UX/User Testing', 'Data Science/Analytics', 'DAO Consultant']);
assert.equal(publication.pages[12].blocks.find((block) => block.type === 'steps').items.length, 6);
assert.deepEqual(publication.pages[1].blocks.find((block) => block.type === 'steps').items.map((item) => item.destination.pageNumber), [6, 8, 10, 12, 14]);
assert.ok(html.includes('28–33'));
assert.equal(publication.pages[14].blocks.find((block) => block.type === 'steps').items.length, 5);
assert.ok(publication.pages[8].blocks.find((block) => block.type === 'steps').items.some((item) => item.text.includes('agreed delivery lead')));
assert.deepEqual(publication.pages[10].blocks.find((block) => block.type === 'steps').items.map((item) => item.id), ['describe-problem', 'find-collaborators', 'shape-proposal', 'record-final-rip', 'seek-approval', 'deliver-report']);
assert.equal(edition.pages[23].layout,'resources-and-next');
assert.equal(edition.pages[23].blocks.find(block=>block.type==='links').items.length,5);
assert.equal(edition.pages[23].blocks.find(block=>block.type==='steps').items.length,5);
assert.equal(edition.pages[24].layout,'closing-quote');
assert.ok(!html.includes('Editorial source note'));
for(const token of ['Meme Driven Development','proof of touching grass','Cohort number','Demo Day / date','Member champion','Portal profile URL','Cited works / links','Backstory journal','Draw the next map']) assert.ok(html.includes(token));
assert.ok(html.includes('href="#page10"') && html.includes('href="#page28"'));
assert.ok(publicationCss.includes('@page{size:7in 10in'));
assert.ok(publicationCss.includes('html.js .reader[data-active="true"]'));
assert.ok(html.includes('id="book-cover"') && html.includes('id="book-contents"') && html.includes('id="book-read-all"'));
assert.ok(!html.includes('Still on the drawing table'));
assert.ok(html.includes('Explore the illustrated chapters'));
assert.equal(entries[0].items.length, 7);
assert.equal(entries[1].items.length, 8);
assert.deepEqual(entries[1].items.map((item) => item.kind), ['place', 'place', 'place', 'place', 'place', 'realm', 'realm', 'gateway']);
assert.deepEqual(entries[1].items.map((item) => [item.id, item.contents.title, item.contents.status, item.contents.href || null]), [
  ['gathering-hall', 'Meet the party', 'available', '#page8'],
  ['workshop', 'Improvement trail', 'available', '#page20'],
  ['expedition-dock', 'How a Raid works · airship', 'available', '#page18'],
  ['archive', 'Where next', 'available', '#page24'],
  ['commons', 'Guild Kit', 'available', '#page22'],
  ['raida', 'Feature within Guild Kit', 'available', '#page23'],
  ['moloch', 'Why we build together', 'available', '#page24'],
  ['arrival-road', 'Joining the Guild', 'available', '#page6'],
]);
for (const entry of entries) {
  assert.ok(html.includes(`id="${entry.mapHash}"`));
  assert.ok(html.includes(`id="${entry.textHash}"`));
  assert.ok(html.includes(`id="${entry.sourcesHash}"`));
  assert.ok(html.includes(`href="#${entry.mapHash}"`));
  for (const item of entry.items) {
    const hash = item.hash || `${entry.id}-${item.id}`;
    assert.ok(item.x >= 0 && item.x <= 100 && item.y >= 0 && item.y <= 100);
    assert.ok(item.link.startsWith('https://'));
    assert.ok(html.includes(`href="#${hash}"`));
    assert.ok(html.includes(`id="${hash}"`));
  }
}
assert.ok(html.includes('href="#paid-work"'));
assert.ok(html.includes('https://discord.gg/rGFpfQf'));
assert.ok(html.includes('It is not a gate to full DAO membership.'));
assert.ok(html.includes('other than your cohort host'));
assert.ok(html.includes('Queen Raida helps surface useful developments, gather context'));
assert.ok(html.includes('id="kingdom-arrival-road"'));
assert.ok(html.includes('IN THE FIELD GUIDE'));
assert.ok(html.includes('Shared ownership, useful tools, and deliberate cooperation'));
assert.ok(html.includes(`rel="canonical" href="${guide.canonical}"`));
assert.ok(html.includes(`property="og:image" content="${guide.canonical}field-guide-social-v3.png"`));
assert.ok(!html.includes('src="https://'));
assert.ok(!html.includes('wip-queen-raida-content-reference.png'));
assert.ok(!html.includes('wip-moloch-content-reference.png'));
assert.ok(app.includes("import { entries } from './guide.mjs'"));
assert.ok(app.includes('history.replaceState'));
assert.ok(css.includes('.js .reader:not([data-active="true"])'));
assert.equal(social.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(social.readUInt32BE(16), 1200);
assert.equal(social.readUInt32BE(20), 630);
for (const filename of ['styles.css', 'app.js', 'guide.mjs', 'kingdom.mjs', 'joining-map-concept-v1.png', 'guild-kingdom-concept-v2.png', 'style-landscape-reference.png']) {
  assert.ok((await stat(path.join(published, filename))).size > 0);
}
const allIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(allIds).size, allIds.length, 'Duplicate HTML IDs');
const ids = new Set(allIds);
for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.has(target), `Missing native fragment destination: #${target}`);
}
console.log('Field Guide publication and companion map checks passed.');

const credits=studies.pages.filter(page=>page.layout==='member-credits').flatMap(page=>page.members);assert.equal(credits.length,145);assert.equal(new Set(credits.map(name=>name.toLowerCase())).size,145);assert.ok(!credits.includes('Queen Raida'));for(const name of ['Elliott Conway','Yalor','Hammad Jutt','peth','Scottrepreneur'])assert.ok(studies.pages.find(page=>page.id==='lore').sections.flatMap(s=>s.paragraphs).join(' ').includes(name));

assert.ok(!html.includes('Dekan recalls')&&!html.includes('Dekan remembers')&&!html.includes('A reflection tool, not an application'));assert.equal(studies.pages.filter(page=>page.layout==='member-credits').length,1);
