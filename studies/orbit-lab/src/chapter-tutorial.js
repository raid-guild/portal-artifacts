export const CHAPTER_GUIDE_VERSION = 3;
export const CHAPTER_GUIDE_KEY = `orbit-lab-chapter-guides-v${CHAPTER_GUIDE_VERSION}`;

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
    const old = JSON.parse(storage?.getItem('orbit-lab-chapter-guides-v2') || storage?.getItem('orbit-lab-chapter-guides-v1') || '[]');
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
  if (kind === 'portals') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters one portal and emerges from its matching partner.">${common}<path class="guide-path" d="M20 72 H120 M194 72 H300"/><circle class="guide-portal" cx="130" cy="72" r="21"/><circle class="guide-portal" cx="183" cy="72" r="21"/><circle class="guide-light guide-moving" cx="35" cy="72" r="5"/></svg>`;
  if (kind === 'chasers') return `<svg viewBox="0 0 320 124" role="img" aria-label="A chasing ember follows the light around a wall.">${common}<path class="guide-path" d="M22 90 Q115 90 129 41 H289"/><path class="guide-wall" d="M148 25 V90"/><circle class="guide-ember" cx="74" cy="90" r="8"/><circle class="guide-light guide-moving" cx="34" cy="90" r="5"/></svg>`;
  if (kind === 'stillness') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light waits in a stillness node as an ember crosses, then releases.">${common}<path class="guide-path" d="M24 67 H290"/><circle class="guide-still" cx="145" cy="67" r="21"/><circle class="guide-light guide-moving" cx="36" cy="67" r="5"/><circle class="guide-ember" cx="233" cy="67" r="7"/></svg>`;
  return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters an eclipse and darkens while an orbiting ember continues its path.">${common}<circle class="guide-still" cx="137" cy="62" r="27"/><circle cx="137" cy="62" r="11" fill="#02070c"/><path class="guide-path" d="M28 62 H110 M164 62 H294"/><path class="guide-path" d="M225 21 A40 40 0 1 1 224 104"/><circle class="guide-ember" cx="226" cy="21" r="7"/><circle class="guide-light" cx="55" cy="62" r="5"/><text x="90" y="111">WAIT · OBSERVE · RELEASE</text></svg>`;
}
