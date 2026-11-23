import { LEVEL_ORDER, LEVELS } from "./levels";
import type { Region, Save } from "./save";

export type KingdomPreview = { id: string; title: string; subtitle: string; predecessor: Region; anchor: { x: number; y: number }; label: { x: number; y: number } };

export const KINGDOM_PREVIEWS: KingdomPreview[] = [
  { id: "river", title: "RIVER JOURNEY", subtitle: "Coming soon", predecessor: "castle", anchor: { x: 900, y: 420 }, label: { x: 639, y: 222 } },
];

// Adding authored levels for a chapter publishes it. A teaser is never a playable destination.
export const RELEASED_CHAPTERS = new Set<string>(LEVEL_ORDER.map(id => LEVELS[id].chapter ?? "oasis"));

export function pendingKingdomPreview(save: Pick<Save, "completed">, released = RELEASED_CHAPTERS): KingdomPreview | null {
  for (const preview of KINGDOM_PREVIEWS) {
    if (released.has(preview.id)) continue;
    const predecessorLevels = LEVEL_ORDER.filter(id => (LEVELS[id].chapter ?? "oasis") === preview.predecessor);
    if (predecessorLevels.length && predecessorLevels.every(id => save.completed.includes(id))) return preview;
  }
  return null;
}
