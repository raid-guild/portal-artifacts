import type { Save } from "./save";
import { LEVEL_ORDER } from "./levels";
import { arrangements } from "./music";

export type SoundtrackId = "oasis" | "caravan" | "gatehouse" | "farmland" | "town" | "castle";
export type TrackPreference = "auto" | SoundtrackId;

export const SOUNDTRACKS: ReadonlyArray<{ id: SoundtrackId; title: string; chapter: string; bpm: number }> = [
  { id: "oasis", title: "Water Finds a Way", chapter: "Oasis", bpm: arrangements.oasis.bpm },
  { id: "caravan", title: "The Walker's Road", chapter: "Open Desert", bpm: arrangements.caravan.bpm },
  { id: "gatehouse", title: "River and Counterweight", chapter: "Bridge Gatehouse", bpm: arrangements.gatehouse.bpm },
  { id: "town", title: "Lanterns at the Market", chapter: "Town on the Hill", bpm: arrangements.town.bpm },
  { id: "castle", title: "The Ledger at Dusk", chapter: "Castle Island", bpm: arrangements.castle.bpm },
  { id: "farmland", title: "Seeds After Rain", chapter: "Farmland", bpm: arrangements.farmland.bpm },
];

export function getUnlockedSoundtracks(save: Save): SoundtrackId[] {
  const unlocked: SoundtrackId[] = ["oasis"];
  const reachedCaravan = save.oasisTransition === "arrival" || save.oasisTransition === "ready"
    || save.transition?.to === "caravan" && save.transition.stage === "arrival"
    || save.region === "caravan" || save.region === "gatehouse"
    || save.completed.some(id => LEVEL_ORDER.indexOf(id) >= 10);
  if (reachedCaravan) unlocked.push("caravan");
  const reachedGatehouse = save.transition?.to === "gatehouse" && save.transition.stage === "arrival"
    || save.gatehouseReady || save.region === "gatehouse"
    || save.completed.some(id => LEVEL_ORDER.indexOf(id) >= 20);
  if (reachedGatehouse) unlocked.push("gatehouse");
  if (save.farmlandReady || save.region === "farmland" || save.completed.some(id => LEVEL_ORDER.indexOf(id) >= 30)) unlocked.push("farmland");
  if (save.townReady || save.region === "town" || save.completed.some(id => LEVEL_ORDER.indexOf(id) >= 40)) unlocked.push("town");
  if (save.castleReady || save.region === "castle" || save.completed.some(id => LEVEL_ORDER.indexOf(id) >= 50)) unlocked.push("castle");
  return unlocked;
}

export function normalizeAudioPreferences(value: unknown): { muted: boolean; sfx: number; ambience: number; music: number; track: TrackPreference } {
  const object = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const level = (name: string, fallback: number) => typeof object[name] === "number" && Number.isFinite(object[name])
    ? Math.max(0, Math.min(1, object[name])) : fallback;
  const track = object.track;
  return {
    muted: typeof object.muted === "boolean" ? object.muted : false,
    sfx: level("sfx", 0.7),
    ambience: level("ambience", 0.22),
    music: level("music", 0.25),
    track: track === "oasis" || track === "caravan" || track === "gatehouse" || track === "farmland" || track === "town" || track === "castle" ? track : "auto",
  };
}
