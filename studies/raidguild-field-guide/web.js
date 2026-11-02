const web = document.getElementById('web-guide');
const stages = [...web.querySelectorAll('[data-web-stage]')];
const sectionIds = new Set([...web.querySelectorAll('[data-web-section]')].map((node) => node.dataset.webSection));
const classIds = new Set([...web.querySelectorAll('[data-web-class]')].map((node) => node.dataset.webClass));
const pageSections = new Map([[1,'home'],[2,'world'],[3,'world'],[4,'history'],[5,'history'],[6,'joining'],[7,'joining'],[8,'classes'],[9,'classes'],[10,'classes'],[11,'classes'],[12,'classes'],[13,'classes'],[14,'classes'],[15,'classes'],[16,'classes'],[17,'classes'],[18,'airship'],[19,'airship'],[20,'rip'],[21,'rip'],[22,'walker'],[23,'walker'],[24,'onward'],[25,'onward'],[26,'sidequests'],[27,'sidequests'],[28,'sidequests'],[29,'sidequests'],[30,'sidequests'],[31,'sidequests'],[32,'sidequests'],[33,'sidequests'],[34,'credits'],[35,'onward']]);

function stageItem(stage, itemId) {
  const nodes = [...stage.querySelectorAll(`[data-web-item]`)];
  if (!nodes.some((node) => node.dataset.webItem === itemId)) return false;
  for (const node of nodes) {
    const active = node.dataset.webItem === itemId;
    if (node.matches('a')) node.setAttribute('aria-current', String(active));
    if (node.matches('[data-web-note]')) node.hidden = !active;
  }
  return true;
}

function selectClass(id) {
  if (!classIds.has(id)) return false;
  for (const node of web.querySelectorAll('[data-web-class]')) node.hidden = node.dataset.webClass !== id;
  for (const node of web.querySelectorAll('[data-web-class-link]')) node.setAttribute('aria-current', String(node.dataset.webClassLink === id));
  const roster = web.querySelector('.web-class-roster');
  const selected = roster?.querySelector(`[data-web-class-link="${CSS.escape(id)}"]`);
  if (roster && selected) {
    const box = roster.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (matchMedia('(max-width:700px)').matches) roster.scrollLeft += item.left - box.left - (box.width - item.width) / 2;
    else roster.scrollTop += item.top - box.top - (box.height - item.height) / 2;
  }
  return true;
}

function targetFromHash(hash) {
  if (!hash || hash === 'longform') return {section:'home'};
  if (!hash.startsWith('longform-')) return null;
  let suffix = hash.slice(9);
  if (suffix.startsWith('page')) return {section:pageSections.get(Number(suffix.slice(4))) || 'home'};
  const aliases = {party:'classes',raid:'airship',kit:'walker',doors:'onward',supplement:'sidequests',appendix:'sidequests',credits:'credits'};
  if (aliases[suffix]) return {section:aliases[suffix]};
  if (sectionIds.has(suffix)) return {section:suffix};
  if (suffix.startsWith('class-')) {
    const id = suffix.slice(6).split('-path-')[0];
    if (classIds.has(id)) return {section:'classes',classId:id};
  }
  if (suffix.startsWith('atlas-')) suffix = `world-${suffix.slice(6)}`;
  for (const stage of stages) {
    const id = stage.dataset.webStage;
    if (!suffix.startsWith(`${id}-`)) continue;
    const itemId = suffix.slice(id.length+1).replace(/-(?:note|spot)$/,'');
    if (stage.querySelector(`[data-web-item="${CSS.escape(itemId)}"]`)) return {section:id,stage,itemId};
  }
  return null;
}

export function isWebHash(hash) { return !!targetFromHash(hash); }

export function showWeb(hash, navigated = false, preserveScroll = false) {
  const target = targetFromHash(hash) || {section:'home'};
  const sectionStage = stages.find((stage) => stage.dataset.webStage === target.section);
  const firstItem = sectionStage?.querySelector('[data-web-note]')?.dataset.webItem;
  if (sectionStage && firstItem) stageItem(sectionStage,target.itemId || firstItem);
  if (target.section === 'classes') selectClass(target.classId || web.querySelector('[data-web-class]')?.dataset.webClass);
  web.querySelectorAll('[data-preview]').forEach((node) => delete node.dataset.preview);
  for (const link of web.querySelectorAll('.web-nav nav a')) {
    const active = link.hash === `#longform-${target.section}` || (target.section === 'world' && link.hash === '#longform-world') || (target.section === 'classes' && link.hash === '#longform-classes') || (['airship','rip','walker'].includes(target.section) && link.hash === '#longform-airship');
    if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  }
  if (preserveScroll) return;
  const section = web.querySelector(`#web-section-${CSS.escape(target.section)}`);
  requestAnimationFrame(() => {
    if (target.section === 'home') window.scrollTo({top:0,behavior:'instant'});
    else section?.scrollIntoView({block:'start',behavior:'instant'});
  });
}

export function leaveWeb() {
  web.querySelectorAll('[data-brood-can][data-active="true"] [data-brood-close]').forEach((button) => button.click());
}

web.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[data-web-select],a[data-web-class-link]');
  if (!anchor) return;
  event.preventDefault();
  const hash = anchor.hash.slice(1);
  if (location.hash.slice(1) !== hash) history.pushState(null,'',`#${hash}`);
  showWeb(hash,false,true);
  if (event.detail === 0) {
    const target = targetFromHash(hash);
    const heading = target.classId ? web.querySelector(`[data-web-class="${CSS.escape(target.classId)}"] h3`) : target.stage?.querySelector(`[data-web-note][data-web-item="${CSS.escape(target.itemId)}"] h3`);
    heading?.focus({preventScroll:true});
  }
});

for (const stage of stages) {
  let preview = null;
  const reset = () => {
    if (preview && web.matches(':hover')) {
      stage.querySelectorAll('[data-preview]').forEach((node)=>delete node.dataset.preview);
      const current = stage.querySelector('a[data-web-select][aria-current="true"]');
      if (current) stageItem(stage,current.dataset.webItem);
    }
    preview = null;
  };
  stage.addEventListener('pointerover',(event)=>{
    if (event.pointerType === 'touch') return;
    const link = event.target.closest('a[data-web-select]');
    if (!link || !stage.contains(link) || preview === link.dataset.webItem) return;
    preview = link.dataset.webItem;
    for (const node of stage.querySelectorAll(`a[data-web-select][data-web-item="${CSS.escape(preview)}"]`)) node.dataset.preview = 'true';
    for (const node of stage.querySelectorAll('[data-web-note]')) node.hidden = node.dataset.webItem !== preview;
  });
  stage.addEventListener('pointerout',(event)=>{
    if (event.pointerType === 'touch') return;
    const next = event.relatedTarget?.closest?.('a[data-web-select]');
    if (next && stage.contains(next) && next.dataset.webItem === preview) return;
    reset();
  });
  stage.addEventListener('focusin',(event)=>{
    const link=event.target.closest('a[data-web-select]');
    if (link) for(const node of stage.querySelectorAll('[data-web-note]')) node.hidden = node.dataset.webItem !== link.dataset.webItem;
  });
  stage.addEventListener('focusout',(event)=>{
    if (event.relatedTarget?.closest?.('a[data-web-select]')) return;
    const current=stage.querySelector('a[data-web-select][aria-current="true"]');
    if(current)stageItem(stage,current.dataset.webItem);
  });
}
