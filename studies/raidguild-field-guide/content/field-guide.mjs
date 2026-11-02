import { guide as joiningGuide } from './guide.mjs';
import { kingdom } from './kingdom.mjs';
// One semantic edition for the printed book and the web experience. The web
// renderer selects and presents this material; it does not maintain prose.
export function createFieldGuide(publication) {
  const pages = new Map(publication.pages.map((item) => [item.id, item]));
  const page = (id) => {
    const item = pages.get(id);
    if (!item) throw new Error(`Missing Field Guide page ${id}`);
    return item;
  };
  const workbook = (id) => page(`workbook-${id}`).workbookPage;
  const art = (id) => publication.assets[page(id).art.assetId];
  const steps = (id) => page(id).blocks.find((block) => block.type === 'steps')?.items || [];
  const spread = (id) => publication.spreads.find((item) => item.pageNumbers.includes(page(id).number));
  const classes = publication.pages.flatMap((item) => item.workbookPage?.profiles || (item.workbookPage?.profile ? [item.workbookPage.profile] : []));
  const kingdomDestinations = { 'gathering-hall':'classes', workshop:'rip', 'expedition-dock':'airship', archive:'onward', commons:'walker', raida:'walker', moloch:'onward', 'arrival-road':'joining' };
  return {
    publication,
    hero: { art: art('cover') },
    world: { art: art('kingdom-plate'), landmarks: kingdom.items.map((item) => ({ ...item, text:item.detail, webHref: `#longform-${kingdomDestinations[item.id]}`, destination:{label:item.contents.title} })) },
    history: { lore: workbook('lore'), culture: workbook('culture'), art: art('participation-notes') },
    joining: { art: art('joining-plate'), steps: steps('joining-steps'), spots: joiningGuide.stages.map((stage) => ({ itemId:String(stage.id), x:stage.x, y:stage.y })) },
    party: { art: art('party-left') },
    classes,
    diagrams: [
      { id: 'airship', art: art('airship-plate'), intro: 'A Raid brings complementary skills together around a client’s goal. Explore the airship to see how the party moves from agreement to delivery.', spots: page('airship-plate').diagram.hotspots, notes: steps('airship-notes') },
      { id: 'rip', art: art('rip-trail'), intro: page('rip-trail').intro, spots: spread('rip-trail').trail.hotspots, notes: steps('rip-steps') },
      { id: 'walker', art: art('walker-plate'), intro: 'Shared people, tools, and operations help a party keep moving. Open the walker to see what supports Guild work.', spots: page('walker-plate').diagram.hotspots, notes: steps('guild-kit') },
    ],
    onward: page('public-doors'),
    sidequests: { brood: workbook('brood'), branches: workbook('branches'), mmd: workbook('mmd') },
    credits: workbook('credits1'),
    closing: { art: art('participation-notes'), quote: page('participation-notes').quote },
  };
}
