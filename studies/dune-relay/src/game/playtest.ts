import type { Cell, Goals, Puzzle, Turn, TurnStats } from "./core";
import type { LevelDefinition, LevelId } from "./levels";
import type { BoosterKind } from "./boosters";
import type { CompanionSnapshot } from "./companionAbilities";

export const PLAYTEST_KEY = "dune-relay-playtest-v1";
export const GUEST_CAMPAIGN_KEY = "dune-relay-campaign-stats-guest-v1";
export function campaignArchiveKey(accountId?: string): string {
  return accountId ? `dune-relay-campaign-stats-account-${encodeURIComponent(accountId)}-v1` : GUEST_CAMPAIGN_KEY;
}
export const PLAYTEST_WALLET_KEY = "dune-relay-playtest-wallet-v1";
export type PlaytestWallet = { version: 1; coins: number };
export function normalizePlaytestWallet(value: unknown): PlaytestWallet {
  const candidate = value as Partial<PlaytestWallet> | null;
  return { version: 1, coins: candidate?.version === 1 && typeof candidate.coins === "number" && Number.isSafeInteger(candidate.coins) && candidate.coins >= 0 ? candidate.coins : 0 };
}
export function readPlaytestWallet(storage?: Pick<Storage, "getItem">): PlaytestWallet {
  try { return normalizePlaytestWallet(JSON.parse((storage ?? localStorage).getItem(PLAYTEST_WALLET_KEY) ?? "null")); }
  catch { return normalizePlaytestWallet(null); }
}
export function writePlaytestWallet(wallet: PlaytestWallet, storage?: Pick<Storage, "setItem">): boolean {
  try { (storage ?? localStorage).setItem(PLAYTEST_WALLET_KEY, JSON.stringify(normalizePlaytestWallet(wallet))); return true; }
  catch { return false; }
}
export const PLAYTEST_SCHEMA = 1;
export const MAX_ATTEMPTS = 200;
export type MoveRecord = { index: number; action: "swap" | "directPower" | "tileBomb" | "freeSwap"; from: Cell; to: Cell; at: string; movesRemaining: number; goalsRemaining: Goals; cleared: TurnStats["symbolsCleared"]; powersCreated: TurnStats["powersCreated"]; powersActivated: TurnStats["powersActivated"]; combinations: TurnStats["combinations"]; companionGrants: number; saltHits: number; saltBlocksBroken: number; seedpodHits: number; seedpodsOpened: number; cratesDelivered: number; reshuffles: number; tilesCleared: number };
export type AttemptOutcome = "playing" | "won" | "lost" | "abandoned";
export type AttemptRecord = { id: string; schemaVersion: 1; appVersion: string; rulesVersion: string; contentVersion: string; levelId: LevelId; chapter: string; companionId?: string | null; companionSnapshot?: CompanionSnapshot | null; authoredSeed: number; initialRngState: number; initialBoard: Puzzle["board"]; initialMask: Puzzle["mask"]; initialCurrent?: Puzzle["current"] | null; initialCurrents?: Puzzle["currents"] | null; initialCrust: Puzzle["crust"]; initialCondensation?: Puzzle["condensation"] | null; initialGoals: Goals; initialMoves: number; symbols: Puzzle["symbols"]; chargeSymbol: Puzzle["chargeSymbol"]; chargeTarget: number; grantedPower: Puzzle["grantedPower"]; grantCount: number; startingBoosters?: BoosterKind[]; boosterCost?: number; boosterMode?: "campaign" | "sandbox" | "replay"; playMode?: "campaign" | "sandbox" | "replay"; startedAt: string; endedAt: string | null; outcome: AttemptOutcome; terminationReason: string | null; activeMs: number; movesUsed: number; movesRemaining: number; goalsRemaining: Goals; totals: TurnStats; moves: MoveRecord[] };
export type PlaytestArchive = { schemaVersion: 1; droppedAttempts: number; attempts: AttemptRecord[] };
export function emptyArchive(): PlaytestArchive { return { schemaVersion: 1, droppedAttempts: 0, attempts: [] }; }
export function emptyTotals(): TurnStats { return { symbolsCleared: {}, powersCreated: { jet: 0, flywheel: 0, prism: 0 }, powersActivated: { jet: 0, flywheel: 0, prism: 0 }, combinations: {}, companionGrants: 0, saltHits: 0, saltBlocksBroken: 0, seedpodHits: 0, seedpodsOpened: 0, cratesDelivered: 0, reshuffles: 0, tilesCleared: 0 }; }
export function startAttempt(level: LevelDefinition, puzzle: Puzzle, now = new Date(), startingBoosters: BoosterKind[] = [], boosterCost = 0, boosterMode: "campaign" | "sandbox" | "replay" = "campaign", companionSnapshot: CompanionSnapshot | null = null): AttemptRecord {
  return { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`, schemaVersion: 1, appVersion: "0.1.0", rulesVersion: level.chapter === "collection" ? "condensation-1" : level.chapter === "river" ? "river-2" : level.chapter === "castle" ? "castle-1" : level.chapter === "town" ? "town-1" : level.chapter === "farmland" ? "farmland-1" : "gatehouse-3", contentVersion: "chapter-8-1", levelId: level.id, chapter: level.chapter ?? "oasis", companionId:companionSnapshot?.id??null,companionSnapshot, authoredSeed: level.seed, initialRngState: puzzle.seed, initialBoard: puzzle.board.map(row => row.map(tile => tile && { ...tile })), initialMask: puzzle.mask.map(row => [...row]), initialCurrent: puzzle.current?.map(cell=>({...cell})) ?? null, initialCurrents: puzzle.currents?.map(route=>({...route,cells:route.cells.map(cell=>({...cell}))})) ?? null, initialCrust: puzzle.crust.map(row => [...row]), initialCondensation: puzzle.condensation ? { collectors: puzzle.condensation.collectors.map(row=>[...row]), wet: puzzle.condensation.wet.map(row=>[...row]) } : null, initialGoals: { ...puzzle.goals }, initialMoves: puzzle.moves, symbols: [...puzzle.symbols], chargeSymbol: puzzle.chargeSymbol, chargeTarget: puzzle.keeperTarget, grantedPower: puzzle.grantedPower, grantCount: puzzle.grantCount, startingBoosters: [...startingBoosters], boosterCost, boosterMode, playMode: boosterMode, startedAt: now.toISOString(), endedAt: null, outcome: "playing", terminationReason: null, activeMs: 0, movesUsed: 0, movesRemaining: puzzle.moves, goalsRemaining: { ...puzzle.goals }, totals: emptyTotals(), moves: [] };
}
export function appendTurn(attempt: AttemptRecord, turn: Turn, from: Cell, to: Cell, at = new Date(), tool?:"tileBomb"|"freeSwap"): AttemptRecord {
  if (!turn.valid || attempt.outcome !== "playing") return attempt;
  const stats = turn.stats;
  const totals = { ...attempt.totals, symbolsCleared: { ...attempt.totals.symbolsCleared }, powersCreated: { ...attempt.totals.powersCreated }, powersActivated: { ...attempt.totals.powersActivated }, combinations: { ...attempt.totals.combinations } };
  for (const [kind, count] of Object.entries(stats.symbolsCleared)) totals.symbolsCleared[kind as keyof typeof totals.symbolsCleared] = (totals.symbolsCleared[kind as keyof typeof totals.symbolsCleared] ?? 0) + count;
  for (const [kind, count] of Object.entries(stats.powersCreated)) totals.powersCreated[kind as keyof typeof totals.powersCreated] += count;
  for (const [kind, count] of Object.entries(stats.powersActivated)) totals.powersActivated[kind as keyof typeof totals.powersActivated] += count;
  for (const [kind, count] of Object.entries(stats.combinations)) totals.combinations[kind] = (totals.combinations[kind] ?? 0) + count;
  totals.companionGrants += stats.companionGrants; totals.saltHits += stats.saltHits; totals.saltBlocksBroken += stats.saltBlocksBroken; totals.seedpodHits = (totals.seedpodHits ?? 0) + stats.seedpodHits; totals.seedpodsOpened = (totals.seedpodsOpened ?? 0) + stats.seedpodsOpened; totals.cratesDelivered = (totals.cratesDelivered ?? 0) + stats.cratesDelivered; totals.reshuffles += stats.reshuffles; totals.tilesCleared += stats.tilesCleared;
  const move: MoveRecord = { index: attempt.moves.length + 1, action: tool ?? (from.row === to.row && from.col === to.col ? "directPower" : "swap"), from: { ...from }, to: { ...to }, at: at.toISOString(), movesRemaining: turn.state.moves, goalsRemaining: { ...turn.state.goals }, cleared: { ...stats.symbolsCleared }, powersCreated: { ...stats.powersCreated }, powersActivated: { ...stats.powersActivated }, combinations: { ...stats.combinations }, companionGrants: stats.companionGrants, saltHits: stats.saltHits, saltBlocksBroken: stats.saltBlocksBroken, seedpodHits: stats.seedpodHits, seedpodsOpened: stats.seedpodsOpened, cratesDelivered: stats.cratesDelivered, reshuffles: stats.reshuffles, tilesCleared: stats.tilesCleared };
  return { ...attempt, totals, moves: [...attempt.moves, move], movesUsed: attempt.movesUsed + (tool?0:1), movesRemaining: turn.state.moves, goalsRemaining: { ...turn.state.goals } };
}
export function finishAttempt(attempt: AttemptRecord, outcome: Exclude<AttemptOutcome, "playing">, reason: string, at = new Date()): AttemptRecord {
  return attempt.outcome === "playing" ? { ...attempt, outcome, terminationReason: reason, endedAt: at.toISOString() } : attempt;
}
export function addAttempt(archive: PlaytestArchive, attempt: AttemptRecord): PlaytestArchive {
  const attempts = [...archive.attempts.filter(entry => entry.id !== attempt.id), attempt];
  const excess = Math.max(0, attempts.length - MAX_ATTEMPTS);
  return { schemaVersion: 1, droppedAttempts: archive.droppedAttempts + excess, attempts: excess ? attempts.slice(excess) : attempts };
}
export function readArchive(storage?: Pick<Storage, "getItem" | "setItem">, key = PLAYTEST_KEY): PlaytestArchive {
  try { const data = JSON.parse((storage ?? localStorage).getItem(key) ?? "null"); if (data?.schemaVersion === 1 && Array.isArray(data.attempts)) {
    return { schemaVersion: 1, droppedAttempts: Number(data.droppedAttempts) || 0, attempts: data.attempts.slice(-MAX_ATTEMPTS).map((entry: AttemptRecord) => { const normalized = { ...entry, startingBoosters: entry.startingBoosters ?? [], boosterCost: entry.boosterCost ?? 0, boosterMode: entry.boosterMode ?? "sandbox", playMode: entry.playMode ?? entry.boosterMode ?? "sandbox", totals: { ...emptyTotals(), ...entry.totals, cratesDelivered: entry.totals?.cratesDelivered ?? 0 } }; return normalized.outcome === "playing" ? finishAttempt(normalized, "abandoned", "interrupted") : normalized; }) };
  }} catch {}
  return emptyArchive();
}
export function writeArchive(archive: PlaytestArchive, storage?: Pick<Storage, "setItem">, key = PLAYTEST_KEY) { try { (storage ?? localStorage).setItem(key, JSON.stringify(archive)); } catch {} }
function csvCell(value: unknown): string { const content = value === undefined || value === null ? "" : typeof value === "string" ? value : JSON.stringify(value); return `"${content.replaceAll('"', '""')}"`; }
export function archiveJson(archive: PlaytestArchive): string { return JSON.stringify(archive, null, 2); }
export function archiveCsv(archive: PlaytestArchive): string {
  const fields = ["id","levelId","chapter","companionId","companionSnapshot","playMode","rulesVersion","contentVersion","authoredSeed","initialRngState","startingBoosters","boosterCost","boosterMode","startedAt","endedAt","outcome","terminationReason","activeMs","movesUsed","movesRemaining","initialMoves","initialCondensation","initialGoals","goalsRemaining","symbols","chargeSymbol","chargeTarget","grantedPower","grantCount","tilesCleared","symbolsCleared","powersCreated","powersActivated","combinations","companionGrants","saltHits","saltBlocksBroken","seedpodHits","seedpodsOpened","cratesDelivered","reshuffles"] as const;
  const rows = archive.attempts.map(a => ({ ...a, tilesCleared:a.totals.tilesCleared,symbolsCleared:a.totals.symbolsCleared,powersCreated:a.totals.powersCreated,powersActivated:a.totals.powersActivated,combinations:a.totals.combinations,companionGrants:a.totals.companionGrants,saltHits:a.totals.saltHits,saltBlocksBroken:a.totals.saltBlocksBroken,seedpodHits:a.totals.seedpodHits??0,seedpodsOpened:a.totals.seedpodsOpened??0,cratesDelivered:a.totals.cratesDelivered??0,reshuffles:a.totals.reshuffles }));
  return [fields.join(","), ...rows.map(row => fields.map(field => csvCell(row[field])).join(","))].join("\r\n") + "\r\n";
}
