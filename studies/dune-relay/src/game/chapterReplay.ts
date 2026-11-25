import { LEVELS, LEVEL_ORDER, MAP_DESTINATIONS, type LevelId } from "./levels";
import type { Region, Save } from "./save";

export type ReplayDestination = { destination: keyof typeof MAP_DESTINATIONS; levels: LevelId[] };
export type ReplayAccess = { farmland: boolean; town: boolean; castle?: boolean; river?: boolean; collection?: boolean };
export function chapterLevelLabel(id: LevelId): string {
  const index = LEVEL_ORDER.indexOf(id);
  return `${Math.floor(index / 10) + 1}.${index % 10 + 1}`;
}
export function isChapterFinalLevel(id: LevelId): boolean {
  const index = LEVEL_ORDER.indexOf(id);
  return index >= 0 && (index === LEVEL_ORDER.length - 1 || (LEVELS[LEVEL_ORDER[index + 1]].chapter ?? "oasis") !== (LEVELS[id].chapter ?? "oasis"));
}
function access(value: boolean | ReplayAccess): ReplayAccess { return typeof value === "boolean" ? { farmland: value, town: false, castle: false, river: false, collection: false } : value; }
export function chapterLevels(region: Region): LevelId[] {
  return LEVEL_ORDER.filter(id => (LEVELS[id].chapter ?? "oasis") === region);
}
export function chapterReplayReady(save: Pick<Save,"completed">, region: Region, unlocked: boolean | ReplayAccess): boolean {
  const verified = access(unlocked);
  return (region !== "farmland" || verified.farmland) && (region !== "town" || verified.town) && (region !== "castle" || Boolean(verified.castle)) && (region !== "river" || Boolean(verified.river)) && (region !== "collection" || Boolean(verified.collection)) && chapterLevels(region).every(id => save.completed.includes(id));
}
export function replayDestinations(save: Pick<Save,"completed">, region: Region, unlocked: boolean | ReplayAccess): ReplayDestination[] {
  if (!chapterReplayReady(save,region,unlocked)) return [];
  const groups = new Map<keyof typeof MAP_DESTINATIONS,LevelId[]>();
  for (const id of chapterLevels(region)) {
    const destination=LEVELS[id].destination;
    groups.set(destination,[...(groups.get(destination)??[]),id]);
  }
  return [...groups].map(([destination,levels])=>({destination,levels}));
}
export function replayAllowed(save: Pick<Save,"completed">, id: LevelId, unlocked: boolean | ReplayAccess): boolean {
  return save.completed.includes(id) && chapterReplayReady(save,LEVELS[id].chapter??"oasis",unlocked);
}
