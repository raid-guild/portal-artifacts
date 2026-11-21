import { LEVELS, LEVEL_ORDER, MAP_DESTINATIONS, type LevelId } from "./levels";
import type { Region, Save } from "./save";

export type ReplayDestination = { destination: keyof typeof MAP_DESTINATIONS; levels: LevelId[] };
export function chapterLevels(region: Region): LevelId[] {
  return LEVEL_ORDER.filter(id => (LEVELS[id].chapter ?? "oasis") === region);
}
export function chapterReplayReady(save: Pick<Save,"completed">, region: Region, farmlandUnlocked: boolean): boolean {
  return (region !== "farmland" || farmlandUnlocked) && chapterLevels(region).every(id => save.completed.includes(id));
}
export function replayDestinations(save: Pick<Save,"completed">, region: Region, farmlandUnlocked: boolean): ReplayDestination[] {
  if (!chapterReplayReady(save,region,farmlandUnlocked)) return [];
  const groups = new Map<keyof typeof MAP_DESTINATIONS,LevelId[]>();
  for (const id of chapterLevels(region)) {
    const destination=LEVELS[id].destination;
    groups.set(destination,[...(groups.get(destination)??[]),id]);
  }
  return [...groups].map(([destination,levels])=>({destination,levels}));
}
export function replayAllowed(save: Pick<Save,"completed">, id: LevelId, farmlandUnlocked: boolean): boolean {
  return save.completed.includes(id) && chapterReplayReady(save,LEVELS[id].chapter??"oasis",farmlandUnlocked);
}
