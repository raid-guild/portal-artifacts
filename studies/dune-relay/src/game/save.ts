import { LEVEL_ORDER, type LevelId } from "./levels";

export const SAVE_KEY = "dune-relay-campaign-v5";
const V4_SAVE_KEY = "dune-relay-campaign-v4";
const V3_SAVE_KEY = "dune-relay-campaign-v3";
const V2_SAVE_KEY = "dune-relay-campaign-v2";
const OLD_SAVE_KEY = "dune-relay-pump-house-v1";
export type Region = "oasis" | "caravan" | "gatehouse" | "farmland";
export type CompanionId = "keeper" | "wayfinder" | "gatewright" | "fieldkeeper";
export type OasisTransition = "locked" | "film" | "keeper" | "atlas" | "arrival" | "ready";
export type ChapterTransition = null | { from: "oasis" | "caravan" | "gatehouse"; to: "caravan" | "gatehouse" | "farmland"; stage: "film" | "handoff" | "atlas" | "arrival" };
export type DemoEnding = "locked" | "gate" | "film" | "thanks" | "done";
export type Save = { version: 5; completed: LevelId[]; coins: number; region: Region; companions: CompanionId[]; oasisTransition: OasisTransition; transition: ChapterTransition; gatehouseReady: boolean; farmlandReady: boolean; demoEnding: DemoEnding };
export const EMPTY_SAVE: Save = { version: 5, completed: [], coins: 0, region: "oasis", companions: [], oasisTransition: "locked", transition: null, gatehouseReady: false, farmlandReady: false, demoEnding: "locked" };
const oasisStages: OasisTransition[] = ["locked", "film", "keeper", "atlas", "arrival", "ready"];
const stageOrder = ["film", "handoff", "atlas", "arrival"] as const;
function validCoins(value: unknown): number { return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0; }
export function normalizeSave(value: Partial<Save> & { completed?: LevelId[] }): Save {
  const completed = LEVEL_ORDER.filter(id => Array.isArray(value.completed) && value.completed.includes(id));
  const oasisDone = completed.includes("openWaterway");
  const caravanDone = completed.includes("lightTheRoute");
  const gatehouseDone = completed.includes("openTheCrossing");
  let oasisTransition: OasisTransition = oasisStages.includes(value.oasisTransition as OasisTransition) ? value.oasisTransition as OasisTransition : "locked";
  if (oasisDone && oasisTransition === "locked") oasisTransition = "film";
  if (!oasisDone) oasisTransition = "locked";
  const oasisIndex = oasisStages.indexOf(oasisTransition);
  let transition: ChapterTransition = null;
  const stored = value.transition;
  if (stored && (stored.from === "oasis" && stored.to === "caravan" || stored.from === "caravan" && stored.to === "gatehouse" || stored.from === "gatehouse" && stored.to === "farmland") && stageOrder.includes(stored.stage)) transition = { ...stored };
  if (oasisDone && oasisTransition !== "ready" && !transition) transition = { from: "oasis", to: "caravan", stage: oasisTransition === "keeper" ? "handoff" : oasisTransition === "atlas" ? "atlas" : oasisTransition === "arrival" ? "arrival" : "film" };
  const gatehouseReady = Boolean(value.gatehouseReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 20) || value.region === "gatehouse" && !transition);
  if (caravanDone && oasisTransition === "ready" && !gatehouseReady && !transition) transition = { from: "caravan", to: "gatehouse", stage: "film" };
  if (transition?.from === "caravan" && !caravanDone) transition = null;
  if (transition?.from === "gatehouse" && !gatehouseDone) transition = null;
  const farmlandReady = Boolean(gatehouseDone && (value.farmlandReady || completed.some(id => LEVEL_ORDER.indexOf(id) >= 30)));
  const companions: CompanionId[] = [];
  if (oasisIndex >= 3) companions.push("keeper");
  if (oasisIndex >= 5) companions.push("wayfinder");
  if (gatehouseReady) companions.push("gatewright");
  if (farmlandReady) companions.push("fieldkeeper");
  let region: Region = value.region === "oasis" ? "oasis" : value.region === "farmland" && farmlandReady ? "farmland" : value.region === "gatehouse" && gatehouseReady ? "gatehouse" : oasisIndex >= 4 ? "caravan" : "oasis";
  if (transition?.stage === "arrival") region = transition.to;
  const endingStages: DemoEnding[] = ["locked", "gate", "film", "thanks", "done"];
  const demoEnding: DemoEnding = completed.includes("openTheCrossing") ? endingStages.includes(value.demoEnding as DemoEnding) && value.demoEnding !== "locked" ? value.demoEnding as DemoEnding : "gate" : "locked";
  if ((demoEnding === "gate" || demoEnding === "film" || demoEnding === "thanks") && transition?.to !== "farmland") region = "gatehouse";
  return { version: 5, completed, coins: validCoins(value.coins), region, companions, oasisTransition, transition, gatehouseReady, farmlandReady, demoEnding };
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
  return normalizeSave({ ...save, transition: next === "ready" ? null : { ...current, stage: next }, gatehouseReady: next === "ready" && current.to === "gatehouse" ? true : save.gatehouseReady, farmlandReady: next === "ready" && current.to === "farmland" ? true : save.farmlandReady, region: next === "ready" ? current.to : save.region });
}
