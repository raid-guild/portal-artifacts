export const CHAPTER_GUIDE_VERSION = 1;
export const CHAPTER_GUIDE_KEY = `orbit-lab-chapter-guides-v${CHAPTER_GUIDE_VERSION}`;

export const CHAPTER_GUIDES = Object.freeze({
  1: { chapter: 1, title: 'Bend the light', instruction: 'Tap open space to place a well. Its gravity bends the light’s path. Place a second ahead to turn again.', detail: 'Two wells can exist at once. A new well replaces the oldest; tap Remove well or press Space while flying to remove the oldest. Wells also fade with time. Tap Start to release.', illustration: 'wells' },
  4: { chapter: 2, title: 'Wait for an opening', instruction: 'A stillness node catches your light. Watch the moving embers, then release when the path is clear.', detail: 'An eclipse also holds you and darkens the room. Tap the release button or press Space to leave.', illustration: 'stillness' },
  7: { chapter: 3, title: 'Wait in the dark', instruction: 'An eclipse holds your light and darkens the room. Watch the ember’s orbit before entering.', detail: 'The danger keeps moving in the dark. Time its pattern, then tap Release or press Space to leave the eclipse.', illustration: 'shadows' },
  10: { chapter: 4, title: 'Cross the divide', instruction: 'Matching portals join distant rooms. Enter one to emerge from its partner.', detail: 'You keep your momentum. The exit mark shows your new direction; place a well beyond it to guide the landing.', illustration: 'portals' },
  13: { chapter: 5, title: 'Something follows', instruction: 'Orange embers can chase your light. Lead them away from the route, then slip past.', detail: 'Walls slow them and portals leave them behind. Their turns take time, so a sharp change of course can make an opening.', illustration: 'chasers' },
});

export function readChapterGuides(storage) {
  try {
    const value = JSON.parse(storage?.getItem(CHAPTER_GUIDE_KEY) || '[]');
    return new Set(Array.isArray(value) ? value.filter(id => Number.isInteger(id) && CHAPTER_GUIDES[id]) : []);
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
  if (kind === 'wells') return `<svg class="guide-wells-motion" viewBox="0 0 320 124" role="img" aria-label="The light curves around well one and well two. Placing well three replaces well one; removing well two leaves well three pulling the light.">${common}<path class="guide-path guide-path-a" d="M18 79 C60 85 61 40 97 42 S135 86 163 80 S196 36 219 43 S257 76 301 52"/><circle class="guide-well guide-well-one" cx="88" cy="44" r="12"/><circle class="guide-well guide-well-two" cx="204" cy="45" r="12"/><circle class="guide-well guide-well-three" cx="267" cy="70" r="12"/><circle class="guide-light" r="5"><animateMotion dur="8s" repeatCount="indefinite" path="M18 79 C60 85 61 40 97 42 S135 86 163 80 S196 36 219 43 S257 76 301 52"/></circle><text x="83" y="24">1</text><text x="200" y="24">2</text><text x="263" y="101">3</text><g class="guide-phase guide-phase-one"><text x="104" y="114">PLACE WELL 1</text></g><g class="guide-phase guide-phase-two"><text x="108" y="114">ADD WELL 2</text></g><g class="guide-phase guide-phase-three"><text x="82" y="114">NEW WELL REPLACES 1</text></g><g class="guide-phase guide-phase-four"><text x="60" y="114">REMOVE OLDEST → FOLLOW NEW PULL</text></g></svg><svg class="guide-wells-static" viewBox="0 0 320 124" role="img" aria-label="Four steps: place well one, add well two, a new well replaces one, then remove the oldest so well three steers the light.">${common}<path class="guide-path" d="M7 79 Q48 29 74 63 M86 79 Q126 28 153 63 M166 79 Q205 26 231 63 M244 78 Q271 38 300 48"/><circle class="guide-well" cx="39" cy="48" r="8"/><circle class="guide-well" cx="108" cy="48" r="8"/><circle class="guide-well" cx="135" cy="57" r="8"/><circle class="guide-well" cx="184" cy="49" r="8"/><circle class="guide-well" cx="215" cy="56" r="8"/><circle class="guide-well" cx="269" cy="64" r="8"/><text x="11" y="105">1 PLACE</text><text x="88" y="105">2 ADD</text><text x="161" y="105">3 REPLACE</text><text x="242" y="105">REMOVE</text></svg>`;
  if (kind === 'portals') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters one portal and emerges from its matching partner.">${common}<path class="guide-path" d="M20 72 H120 M194 72 H300"/><circle class="guide-portal" cx="130" cy="72" r="21"/><circle class="guide-portal" cx="183" cy="72" r="21"/><circle class="guide-light guide-moving" cx="35" cy="72" r="5"/></svg>`;
  if (kind === 'chasers') return `<svg viewBox="0 0 320 124" role="img" aria-label="A chasing ember follows the light around a wall.">${common}<path class="guide-path" d="M22 90 Q115 90 129 41 H289"/><path class="guide-wall" d="M148 25 V90"/><circle class="guide-ember" cx="74" cy="90" r="8"/><circle class="guide-light guide-moving" cx="34" cy="90" r="5"/></svg>`;
  if (kind === 'stillness') return `<svg viewBox="0 0 320 124" role="img" aria-label="The light waits in a stillness node as an ember crosses, then releases.">${common}<path class="guide-path" d="M24 67 H290"/><circle class="guide-still" cx="145" cy="67" r="21"/><circle class="guide-light guide-moving" cx="36" cy="67" r="5"/><circle class="guide-ember" cx="233" cy="67" r="7"/></svg>`;
  return `<svg viewBox="0 0 320 124" role="img" aria-label="The light enters an eclipse and darkens while an orbiting ember continues its path.">${common}<circle class="guide-still" cx="137" cy="62" r="27"/><circle cx="137" cy="62" r="11" fill="#02070c"/><path class="guide-path" d="M28 62 H110 M164 62 H294"/><path class="guide-path" d="M225 21 A40 40 0 1 1 224 104"/><circle class="guide-ember" cx="226" cy="21" r="7"/><circle class="guide-light" cx="55" cy="62" r="5"/><text x="90" y="111">WAIT · OBSERVE · RELEASE</text></svg>`;
}
