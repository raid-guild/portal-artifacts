import { LEVEL_ORDER, type LevelId } from "./levels";

export const SAVE_KEY = "dune-relay-campaign-v5";
const V4_SAVE_KEY = "dune-relay-campaign-v4";
const V3_SAVE_KEY = "dune-relay-campaign-v3";
const V2_SAVE_KEY = "dune-relay-campaign-v2";
const OLD_SAVE_KEY = "dune-relay-pump-house-v1";
export function clearLegacySaves(storage?:Pick<Storage,"removeItem">):void {
  try{for(const key of [V4_SAVE_KEY,V3_SAVE_KEY,V2_SAVE_KEY,OLD_SAVE_KEY])(storage??localStorage).removeItem(key);}catch{/* An unavailable store cannot be cleared. */}
}
export type Region = "oasis" | "caravan" | "gatehouse" | "farmland" | "town" | "castle" | "river";
export type CompanionId = "keeper" | "wayfinder" | "gatewright" | "fieldkeeper" | "towncrier";
export type OasisTransition = "locked" | "film" | "keeper" | "atlas" | "arrival" | "ready";
export type ChapterTransition = null | { from: "oasis" | "caravan" | "gatehouse" | "farmland" | "town" | "castle"; to: "caravan" | "gatehouse" | "farmland" | "town" | "castle" | "river"; stage: "film" | "handoff" | "atlas" | "arrival" };
export type DemoEnding = "locked" | "gate" | "film" | "thanks" | "done";
export type FarmlandEnding = "locked" | "film" | "thanks" | "done";
export type TownEnding = "locked" | "film" | "thanks" | "done";
export type CastleEnding = "locked" | "film" | "thanks" | "done";
export type RiverEnding = "locked" | "film" | "thanks" | "done";
export type Save = { version: 5; completed: LevelId[]; coins: number; region: Region; companions: CompanionId[]; oasisTransition: OasisTransition; transition: ChapterTransition; gatehouseReady: boolean; farmlandReady: boolean; townReady: boolean; castleReady: boolean; riverReady: boolean; activeCompanion: CompanionId | null; demoEnding: DemoEnding; farmlandEnding: FarmlandEnding; townEnding: TownEnding; castleEnding: CastleEnding; riverEnding: RiverEnding };
export const EMPTY_SAVE: Save = { version: 5, completed: [], coins: 0, region: "oasis", companions: [], oasisTransition: "locked", transition: null, gatehouseReady: false, farmlandReady: false, townReady: false, castleReady: false, riverReady: false, activeCompanion: null, demoEnding: "locked", farmlandEnding: "locked", townEnding: "locked", castleEnding: "locked", riverEnding: "locked" };
const oasisStages: OasisTransition[] = ["locked", "film", "keeper", "atlas", "arrival", "ready"];
const stageOrder = ["film", "handoff", "atlas", "arrival"] as const;
function validCoins(value: unknown): number { return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0; }
export function normalizeSave(value: Partial<Save> & { completed?: LevelId[] }): Save {
  const completed = LEVEL_ORDER.filter(id => Array.isArray(value.completed) && value.completed.includes(id));
  const oasisDone = completed.includes("openWaterway");
  const caravanDone = completed.includes("lightTheRoute");
  const gatehouseDone = completed.includes("openTheCrossing");
  const farmlandDone = completed.includes("openTheHarvestRoad");
  const townDone = completed.includes("openTheMarket");
  const castleDone = completed.includes("openTheUpstreamRoute");
  const riverDone = completed.includes("openTheCollectionRoute");
  let oasisTransition: OasisTransition = oasisStages.includes(value.oasisTransition as OasisTransition) ? value.oasisTransition as OasisTransition : "locked";
  if (oasisDone && oasisTransition === "locked") oasisTransition = "film";
  if (!oasisDone) oasisTransition = "locked";
  const oasisIndex = oasisStages.indexOf(oasisTransition);
  let transition: ChapterTransition = null;
  const stored = value.transition;
  if (stored && (stored.from === "oasis" && stored.to === "caravan" || stored.from === "caravan" && stored.to === "gatehouse" || stored.from === "gatehouse" && stored.to === "farmland" || stored.from === "farmland" && stored.to === "town" || stored.from === "town" && stored.to === "castle" || stored.from === "castle" && stored.to === "river") && stageOrder.includes(stored.stage)) transition = { ...stored };
  if (oasisDone && oasisTransition !== "ready" && !transition) transition = { from: "oasis", to: "caravan", stage: oasisTransition === "keeper" ? "handoff" : oasisTransition === "atlas" ? "atlas" : oasisTransition === "arrival" ? "arrival" : "film" };
  const gatehouseReady = Boolean(value.gatehouseReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 20) || value.region === "gatehouse" && !transition);
  if (caravanDone && oasisTransition === "ready" && !gatehouseReady && !transition) transition = { from: "caravan", to: "gatehouse", stage: "film" };
  if (transition?.from === "caravan" && !caravanDone) transition = null;
  if (transition?.from === "gatehouse" && !gatehouseDone) transition = null;
  if (transition?.from === "farmland" && !farmlandDone) transition = null;
  if (transition?.from === "town" && !townDone) transition = null;
  if (transition?.from === "castle" && !castleDone) transition = null;
  const farmlandReady = Boolean(gatehouseDone && (value.farmlandReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 30)));
  const townReady = Boolean(farmlandDone && (value.townReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 40)));
  const castleReady = Boolean(townDone && (value.castleReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 50)));
  const riverReady = Boolean(castleDone && (value.riverReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 60) || value.riverReady === undefined && value.castleEnding === "done"));
  const companions: CompanionId[] = [];
  if (oasisIndex >= 3) companions.push("keeper");
  if (oasisIndex >= 5) companions.push("wayfinder");
  if (gatehouseReady) companions.push("gatewright");
  if (farmlandReady) companions.push("fieldkeeper");
  if (townReady) companions.push("towncrier");
  const activeCompanion = castleReady && companions.includes(value.activeCompanion as CompanionId) ? value.activeCompanion as CompanionId : null;
  let region: Region = value.region === "oasis" ? "oasis" : value.region === "river" && riverReady ? "river" : value.region === "castle" && castleReady ? "castle" : value.region === "town" && townReady ? "town" : value.region === "farmland" && farmlandReady ? "farmland" : value.region === "gatehouse" && gatehouseReady ? "gatehouse" : oasisIndex >= 4 ? "caravan" : "oasis";
  if (transition?.stage === "arrival") region = transition.to;
  const endingStages: DemoEnding[] = ["locked", "gate", "film", "thanks", "done"];
  const demoEnding: DemoEnding = completed.includes("openTheCrossing") ? endingStages.includes(value.demoEnding as DemoEnding) && value.demoEnding !== "locked" ? value.demoEnding as DemoEnding : "gate" : "locked";
  const farmlandStages: FarmlandEnding[] = ["locked", "film", "thanks", "done"];
  const farmlandEnding: FarmlandEnding = farmlandDone ? farmlandStages.includes(value.farmlandEnding as FarmlandEnding) && value.farmlandEnding !== "locked" ? value.farmlandEnding as FarmlandEnding : "film" : "locked";
  const chapterEndings: TownEnding[] = ["film", "thanks", "done"];
  const townEnding: TownEnding = townDone ? chapterEndings.includes(value.townEnding as TownEnding) ? value.townEnding as TownEnding : "film" : "locked";
  const castleEnding: CastleEnding = castleDone ? chapterEndings.includes(value.castleEnding as CastleEnding) ? value.castleEnding as CastleEnding : "film" : "locked";
  const riverEnding: RiverEnding = riverDone ? chapterEndings.includes(value.riverEnding as RiverEnding) ? value.riverEnding as RiverEnding : "film" : "locked";
  if ((demoEnding === "gate" || demoEnding === "film" || demoEnding === "thanks") && transition?.to !== "farmland") region = "gatehouse";
  if ((farmlandEnding === "film" || farmlandEnding === "thanks") && transition?.to !== "town") region = "farmland";
  return { version: 5, completed, coins: validCoins(value.coins), region, companions, oasisTransition, transition, gatehouseReady, farmlandReady, townReady, castleReady, riverReady, activeCompanion, demoEnding, farmlandEnding, townEnding, castleEnding, riverEnding };
}
export function readSave(storage?: Pick<Storage, "getItem" | "setItem">): Save {
  try {
    const safeStorage = storage ?? localStorage;
    const parse = (key: string) => { try { return JSON.parse(safeStorage.getItem(key) ?? "null"); } catch { return null; } };
    const v5 = parse(SAVE_KEY); if (v5?.version === 5) return normalizeSave(v5);
    const v4 = parse(V4_SAVE_KEY); if (v4?.version === 4) { const migrated = normalizeSave(v4); try { safeStorage.setItem(SAVE_KEY, JSON.stringify(migrated)); } catch {} return migrated; }
    const v3 = parse(V3_SAVE_KEY); if (v3?.version === 3) { const migrated = normalizeSave(v3); try { safeStorage.setItem(SAVE_KEY, JSON.stringify(migrated)); } catch {} return migrated; }
    const v2 = parse(V2_SAVE_KEY); if (v2?.version === 2 && Array.isArray(v2.completed)) { const migrated = normalizeSave(v2); try { safeStorage.setItem(SAVE_KEY, JSON.stringify(migrated)); } catch {} return migrated; }
    const old = parse(OLD_SAVE_KEY); if (old?.version === 1 && typeof old.repaired === "boolean") { const migrated = normalizeSave({ completed: old.repaired ? ["pumpHouse"] : [], coins: old.coins }); try { safeStorage.setItem(SAVE_KEY, JSON.stringify(migrated)); } catch {} return migrated; }
  } catch {}
  return { ...EMPTY_SAVE, completed: [], companions: [] };
}
export function writeSave(save: Save, storage?: Pick<Storage, "setItem">): boolean { try { (storage ?? localStorage).setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; } }
export function completeLevel(save: Save, id: LevelId, coins: number): Save {
  if (save.completed.includes(id)) return save;
  return normalizeSave({ ...save, completed: [...save.completed, id], coins: save.coins + Math.max(0, Math.floor(coins)) });
}
export function advanceTransition(save: Save, expected: OasisTransition, next: OasisTransition): Save {
  if (save.oasisTransition !== expected || oasisStages.indexOf(next) !== oasisStages.indexOf(expected) + 1) return save;
  return normalizeSave({ ...save, oasisTransition: next, transition: next === "ready" ? null : { from: "oasis", to: "caravan", stage: next === "keeper" ? "handoff" : next === "atlas" ? "atlas" : next === "arrival" ? "arrival" : "film" } });
}
export function advanceChapterTransition(save: Save, expected: NonNullable<ChapterTransition>["stage"], next: NonNullable<ChapterTransition>["stage"] | "ready"): Save {
  const current = save.transition;
  if (!current || current.stage !== expected || (next !== "ready" && stageOrder.indexOf(next) !== stageOrder.indexOf(expected) + 1) || (next === "ready" && expected !== "arrival")) return save;
  return normalizeSave({ ...save, transition: next === "ready" ? null : { ...current, stage: next }, gatehouseReady: next === "ready" && current.to === "gatehouse" ? true : save.gatehouseReady, farmlandReady: next === "ready" && current.to === "farmland" ? true : save.farmlandReady, townReady: next === "ready" && current.to === "town" ? true : save.townReady, castleReady: next === "ready" && current.to === "castle" ? true : save.castleReady, riverReady: next === "ready" && current.to === "river" ? true : save.riverReady, region: next === "ready" ? current.to : save.region });
}
export function setActiveCompanion(save: Save, id: CompanionId): Save {
  if (!save.castleReady || !save.companions.includes(id)) return save;
  return normalizeSave({ ...save, activeCompanion: id });
}
