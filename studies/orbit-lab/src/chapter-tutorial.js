export const CHAPTER_GUIDE_VERSION = 4;
export const CHAPTER_GUIDE_KEY = `orbit-lab-chapter-guides-v${CHAPTER_GUIDE_VERSION}`;

export const CHAPTER_ONE_STEPS = Object.freeze([
  { title: 'Bend, burn, coast', instruction: 'Tap ahead to place one gravity well. Tap somewhere else to replace it and turn your path.', detail: 'Hold Shift or the Burn circle to accelerate. Press Space or tap Remove well to clear the well and coast.', illustration: 'wells', goal: 'Place → replace → Burn → coast' },
  { title: 'Carry your light', instruction: 'Your light slowly burns down as you travel. Burn spends it faster while accelerating.', detail: 'Collect a brighter to recharge. At zero, your last embers give you a short chance to find more light before the run ends.', illustration: 'light', goal: 'Keep an eye on the light meter' },
  { title: 'Find the sound gates', instruction: 'Colored rings are sound gates. Passing through one adds its voice to the music.', detail: 'Collect at least one gate and reach the exit to unlock the next level. Collect all three for a complete crossing.', illustration: 'gates', goal: 'One gate unlocks · three complete the song' },
  { title: 'Reach the exit', instruction: 'The violet portal is the exit. Fly through it to finish the level.', detail: 'Your collected gates count only when you reach the exit. The finished trail and your crossing are saved together.', illustration: 'exit', goal: 'Collect a gate, then enter the exit portal' },
  { title: 'Read the colors', instruction: 'Orange embers are dangerous. Touching one can extinguish your light.', detail: 'Some later levels also have matching pairs of travel portals that carry you safely between rooms. They are passage points; the violet portal is the exit.', illustration: 'hazards', goal: 'Orange danger · matching pairs · violet exit' },
]);

export function chapterGuidePages(levelId) {
  return levelId === 1 ? CHAPTER_ONE_STEPS : CHAPTER_GUIDES[levelId] ? [CHAPTER_GUIDES[levelId]] : [];
}
export function chapterGuideStep(levelId, index = 0) {
  const pages = chapterGuidePages(levelId);
  return pages[Math.min(Math.max(0, index), Math.max(0, pages.length - 1))] || null;
}
export function chapterGuideNext(levelId, index) {
  const last = chapterGuidePages(levelId).length - 1;
  return index >= last ? null : Math.max(0, index + 1);
}

export const CHAPTER_GUIDES = Object.freeze({
  1: { chapter: 1, title: 'Bend, burn, coast', instruction: 'Tap ahead to place one gravity well. Tap somewhere else to replace it and turn your path.', detail: 'Hold Shift or the separate Burn circle to accelerate in your current direction. Release it to stop burning. Press Space or tap Remove to clear the well and coast; right-click or E also works. Burn uses 5% light per second while it accelerates you.', illustration: 'wells' },
  4: { chapter: 2, title: 'Wait for an opening', instruction: 'A stillness node catches your light. Watch the moving embers, then release when the path is clear.', detail: 'An eclipse also holds you and darkens the room. Tap the release button or press Space to leave.', illustration: 'stillness' },
  7: { chapter: 3, title: 'Wait in the dark', instruction: 'An eclipse holds your light and darkens the room. Watch the ember’s orbit before entering.', detail: 'The danger keeps moving in the dark. Time its pattern, then tap Release or press Space to leave the eclipse.', illustration: 'shadows' },
  10: { chapter: 4, title: 'Cross the divide', instruction: 'Matching portals join distant rooms. Enter one to emerge from its partner.', detail: 'You keep your momentum. The exit mark shows your new direction; place a well beyond it to guide the landing.', illustration: 'portals' },
  13: { chapter: 5, title: 'Something follows', instruction: 'Orange embers can chase your light. Lead them away from the route, then slip past.', detail: 'Walls slow them and portals leave them behind. Their turns take time, so a sharp change of course can make an opening.', illustration: 'chasers' },
});

export function readChapterGuides(storage) {
  try {
    const current = storage?.getItem(CHAPTER_GUIDE_KEY);
    if (current !== null && current !== undefined) {
      const value = JSON.parse(current);
      return new Set(Array.isArray(value) ? value.filter(id => Number.isInteger(id) && CHAPTER_GUIDES[id]) : []);
    }
    const old = JSON.parse(storage?.getItem('orbit-lab-chapter-guides-v3') || storage?.getItem('orbit-lab-chapter-guides-v2') || storage?.getItem('orbit-lab-chapter-guides-v1') || '[]');
    const migrated = new Set(Array.isArray(old) ? old.filter(id => id !== 1 && Number.isInteger(id) && CHAPTER_GUIDES[id]) : []);
    storage?.setItem(CHAPTER_GUIDE_KEY, JSON.stringify([...migrated]));
    return migrated;
  } catch { return new Set(); }
}

export function acknowledgeChapterGuide(storage, seen, levelId) {
  if (!CHAPTER_GUIDES[levelId]) return seen;
  const next = new Set([...seen, levelId]);
  try { storage?.setItem(CHAPTER_GUIDE_KEY, JSON.stringify([...next])); } catch {}
  return next;
}

export function shouldShowChapterGuide({ levelId, campaignMode, editorPlaytest, seen, locked = false }) {
  return !!campaignMode && !editorPlaytest && !locked && !!CHAPTER_GUIDES[levelId] && !seen.has(levelId);
}

export function chapterGuideGraphic(kind) {
  const common = '<defs><filter id="tutorialGlow"><feGaussianBlur stdDeviation="3"/></filter></defs>';
  if (kind === 'wells') return `<svg class="guide-wells-motion" viewBox="0 0 320 124" role="img" aria-label="One well is placed, then replaced at a new position; Burn accelerates the light; removing the well lets it coast straight.">${common}<g class="guide-burn-stage guide-burn-stage-one"><path class="guide-path" d="M16 76 Q54 34 94 61 Q133 80 166 48"/><circle class="guide-well guide-burn-first-well" cx="63" cy="47" r="11"/><circle class="guide-well guide-burn-replacement-well" cx="146" cy="60" r="11"/><circle class="guide-light" cx="86" cy="61" r="5"/><text x="63" y="113">1 PLACE → REPLACE</text></g><g class="guide-burn-stage guide-burn-stage-two"><path class="guide-path" d="M88 61 Q137 70 182 51 L276 51"/><circle class="guide-well" cx="146" cy="60" r="11"/><g class="guide-burn-thrust"><circle class="guide-light" cx="180" cy="51" r="6"/><path d="M174 51 L153 51 M169 47 L156 43 M169 55 L156 59" fill="none" stroke="#8cf4ec" stroke-width="2" stroke-linecap="round"/></g><text x="88" y="113">2 SHIFT / BURN →</text></g><g class="guide-burn-stage guide-burn-stage-three"><path class="guide-path" d="M175 51 L305 51"/><g class="guide-burn-coast"><circle class="guide-light" cx="205" cy="51" r="5"/></g><text x="80" y="113">3 SPACE / REMOVE →</text></g></svg><svg class="guide-wells-static" viewBox="0 0 320 124" role="img" aria-label="Three steps: replace the one well, hold Burn to accelerate, then remove the well and coast straight.">${common}<path class="guide-path" d="M14 66 Q48 26 83 65 M115 66 L193 44 M224 44 L305 44"/><circle class="guide-well" cx="46" cy="45" r="9"/><circle class="guide-light" cx="148" cy="58" r="5"/><circle class="guide-light" cx="257" cy="44" r="5"/><text x="12" y="106">1 REPLACE</text><text x="113" y="106">2 SHIFT →</text><text x="218" y="106">3 REMOVE →</text></svg>`;
  if (kind === 'light') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light meter falls, a cyan brighter refills it, and the empty meter turns red during last embers.">${common}<path d="M35 30 H285" stroke="#4d7680" stroke-width="12" stroke-linecap="round"/><path class="guide-meter-fill" d="M35 30 H194" stroke="#8ff9e6" stroke-width="12" stroke-linecap="round"/><circle class="guide-light" cx="76" cy="78" r="9"/><circle cx="170" cy="78" r="12" fill="#0b3a48" stroke="#8ff9e6" stroke-width="2"/><circle cx="170" cy="78" r="4" fill="#d9fff9"/><path class="guide-path" d="M93 78 H149 M190 78 H252"/><circle cx="261" cy="78" r="7" fill="#ff7081" filter="url(#tutorialGlow)"/><text x="37" y="110">LIGHT</text><text x="137" y="110">RECHARGE</text><text x="234" y="110">LAST EMBERS</text></svg>`;
  if (kind === 'gates') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light crosses cyan, violet, and gold sound gate rings, collecting one, two, then three notes.">${common}<path class="guide-path" d="M20 67 H300"/><circle class="guide-gate guide-gate-cyan" cx="79" cy="67" r="21"/><circle class="guide-gate guide-gate-violet" cx="160" cy="67" r="21"/><circle class="guide-gate guide-gate-gold" cx="241" cy="67" r="21"/><circle class="guide-light guide-moving" cx="30" cy="67" r="5"/><text x="72" y="111">1</text><text x="153" y="111">2</text><text x="234" y="111">3</text></svg>`;
  if (kind === 'exit') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light follows a glowing trail from a collected cyan sound gate into the violet exit portal.">${common}<path class="guide-path" d="M16 84 C90 84 147 38 244 65"/><circle class="guide-gate guide-gate-cyan" cx="109" cy="60" r="17"/><circle class="guide-portal" cx="259" cy="67" r="29"/><circle cx="259" cy="67" r="22" fill="#071521" stroke="#c4b0ff" stroke-width="1"/><circle class="guide-light guide-moving" cx="43" cy="79" r="6"/><text x="70" y="112">GATE</text><text x="231" y="112">EXIT</text></svg>`;
  if (kind === 'hazards') return `<svg viewBox="0 0 320 124" role="img" aria-label="Orange ember is hazardous, matching portal rings transport safely, and the violet portal is the exit.">${common}<circle class="guide-ember" cx="55" cy="57" r="11"/><circle cx="55" cy="57" r="19" fill="none" stroke="#ffac6b" stroke-opacity=".35"/><circle class="guide-travel" cx="139" cy="57" r="19"/><circle class="guide-travel" cx="200" cy="57" r="19"/><path class="guide-path" d="M159 57 H180"/><circle class="guide-portal" cx="274" cy="57" r="22"/><text x="33" y="108">DANGER</text><text x="134" y="108">PAIR</text><text x="257" y="108">EXIT</text></svg>`;
  if (kind === 'portals') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters one portal and emerges from its matching partner.">${common}<path class="guide-path" d="M20 72 H120 M194 72 H300"/><circle class="guide-portal" cx="130" cy="72" r="21"/><circle class="guide-portal" cx="183" cy="72" r="21"/><circle class="guide-light guide-moving" cx="35" cy="72" r="5"/></svg>`;
  if (kind === 'chasers') return `<svg viewBox="0 0 320 124" role="img" aria-label="A chasing ember follows the light around a wall.">${common}<path class="guide-path" d="M22 90 Q115 90 129 41 H289"/><path class="guide-wall" d="M148 25 V90"/><circle class="guide-ember" cx="74" cy="90" r="8"/><circle class="guide-light guide-moving" cx="34" cy="90" r="5"/></svg>`;
  if (kind === 'stillness') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light waits in a stillness node as an ember crosses, then releases.">${common}<path class="guide-path" d="M24 67 H290"/><circle class="guide-still" cx="145" cy="67" r="21"/><circle class="guide-light guide-moving" cx="36" cy="67" r="5"/><circle class="guide-ember" cx="233" cy="67" r="7"/></svg>`;
  return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters an eclipse and darkens while an orbiting ember continues its path.">${common}<circle class="guide-still" cx="137" cy="62" r="27"/><circle cx="137" cy="62" r="11" fill="#02070c"/><path class="guide-path" d="M28 62 H110 M164 62 H294"/><path class="guide-path" d="M225 21 A40 40 0 1 1 224 104"/><circle class="guide-ember" cx="226" cy="21" r="7"/><circle class="guide-light" cx="55" cy="62" r="5"/><text x="90" y="111">WAIT · OBSERVE · RELEASE</text></svg>`;
}
