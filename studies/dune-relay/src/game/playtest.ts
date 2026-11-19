import type { Cell, Goals, Puzzle, Turn, TurnStats } from "./core";
import type { LevelDefinition, LevelId } from "./levels";

export const PLAYTEST_KEY = "dune-relay-playtest-v1";
export const PLAYTEST_SCHEMA = 1;
export const MAX_ATTEMPTS = 200;
export type MoveRecord = { index: number; action: "swap" | "directPower"; from: Cell; to: Cell; at: string; movesRemaining: number; goalsRemaining: Goals; cleared: TurnStats["symbolsCleared"]; powersCreated: TurnStats["powersCreated"]; powersActivated: TurnStats["powersActivated"]; combinations: TurnStats["combinations"]; companionGrants: number; saltHits: number; saltBlocksBroken: number; reshuffles: number; tilesCleared: number };
export type AttemptOutcome = "playing" | "won" | "lost" | "abandoned";
export type AttemptRecord = { id: string; schemaVersion: 1; appVersion: string; rulesVersion: string; contentVersion: string; levelId: LevelId; chapter: string; authoredSeed: number; initialRngState: number; initialBoard: Puzzle["board"]; initialMask: Puzzle["mask"]; initialCrust: Puzzle["crust"]; initialGoals: Goals; initialMoves: number; symbols: Puzzle["symbols"]; chargeSymbol: Puzzle["chargeSymbol"]; chargeTarget: number; grantedPower: Puzzle["grantedPower"]; grantCount: number; startedAt: string; endedAt: string | null; outcome: AttemptOutcome; terminationReason: string | null; activeMs: number; movesUsed: number; movesRemaining: number; goalsRemaining: Goals; totals: TurnStats; moves: MoveRecord[] };
export type PlaytestArchive = { schemaVersion: 1; droppedAttempts: number; attempts: AttemptRecord[] };
export function emptyArchive(): PlaytestArchive { return { schemaVersion: 1, droppedAttempts: 0, attempts: [] }; }
export function emptyTotals(): TurnStats { return { symbolsCleared: {}, powersCreated: { jet: 0, flywheel: 0, prism: 0 }, powersActivated: { jet: 0, flywheel: 0, prism: 0 }, combinations: {}, companionGrants: 0, saltHits: 0, saltBlocksBroken: 0, reshuffles: 0, tilesCleared: 0 }; }
export function startAttempt(level: LevelDefinition, puzzle: Puzzle, now = new Date()): AttemptRecord {
  return { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`, schemaVersion: 1, appVersion: "0.1.0", rulesVersion: "gatehouse-2", contentVersion: "chapter-3-1", levelId: level.id, chapter: level.chapter ?? "oasis", authoredSeed: level.seed, initialRngState: puzzle.seed, initialBoard: puzzle.board.map(row => row.map(tile => tile && { ...tile })), initialMask: puzzle.mask.map(row => [...row]), initialCrust: puzzle.crust.map(row => [...row]), initialGoals: { ...puzzle.goals }, initialMoves: puzzle.moves, symbols: [...puzzle.symbols], chargeSymbol: puzzle.chargeSymbol, chargeTarget: puzzle.keeperTarget, grantedPower: puzzle.grantedPower, grantCount: puzzle.grantCount, startedAt: now.toISOString(), endedAt: null, outcome: "playing", terminationReason: null, activeMs: 0, movesUsed: 0, movesRemaining: puzzle.moves, goalsRemaining: { ...puzzle.goals }, totals: emptyTotals(), moves: [] };
}
export function appendTurn(attempt: AttemptRecord, turn: Turn, from: Cell, to: Cell, at = new Date()): AttemptRecord {
  if (!turn.valid || attempt.outcome !== "playing") return attempt;
  const stats = turn.stats;
  const totals = { ...attempt.totals, symbolsCleared: { ...attempt.totals.symbolsCleared }, powersCreated: { ...attempt.totals.powersCreated }, powersActivated: { ...attempt.totals.powersActivated }, combinations: { ...attempt.totals.combinations } };
  for (const [kind, count] of Object.entries(stats.symbolsCleared)) totals.symbolsCleared[kind as keyof typeof totals.symbolsCleared] = (totals.symbolsCleared[kind as keyof typeof totals.symbolsCleared] ?? 0) + count;
  for (const [kind, count] of Object.entries(stats.powersCreated)) totals.powersCreated[kind as keyof typeof totals.powersCreated] += count;
  for (const [kind, count] of Object.entries(stats.powersActivated)) totals.powersActivated[kind as keyof typeof totals.powersActivated] += count;
  for (const [kind, count] of Object.entries(stats.combinations)) totals.combinations[kind] = (totals.combinations[kind] ?? 0) + count;
  totals.companionGrants += stats.companionGrants; totals.saltHits += stats.saltHits; totals.saltBlocksBroken += stats.saltBlocksBroken; totals.reshuffles += stats.reshuffles; totals.tilesCleared += stats.tilesCleared;
  const move: MoveRecord = { index: attempt.moves.length + 1, action: from.row === to.row && from.col === to.col ? "directPower" : "swap", from: { ...from }, to: { ...to }, at: at.toISOString(), movesRemaining: turn.state.moves, goalsRemaining: { ...turn.state.goals }, cleared: { ...stats.symbolsCleared }, powersCreated: { ...stats.powersCreated }, powersActivated: { ...stats.powersActivated }, combinations: { ...stats.combinations }, companionGrants: stats.companionGrants, saltHits: stats.saltHits, saltBlocksBroken: stats.saltBlocksBroken, reshuffles: stats.reshuffles, tilesCleared: stats.tilesCleared };
  return { ...attempt, totals, moves: [...attempt.moves, move], movesUsed: attempt.movesUsed + 1, movesRemaining: turn.state.moves, goalsRemaining: { ...turn.state.goals } };
}
export function finishAttempt(attempt: AttemptRecord, outcome: Exclude<AttemptOutcome, "playing">, reason: string, at = new Date()): AttemptRecord {
  return attempt.outcome === "playing" ? { ...attempt, outcome, terminationReason: reason, endedAt: at.toISOString() } : attempt;
}
export function addAttempt(archive: PlaytestArchive, attempt: AttemptRecord): PlaytestArchive {
  const attempts = [...archive.attempts.filter(entry => entry.id !== attempt.id), attempt];
  const excess = Math.max(0, attempts.length - MAX_ATTEMPTS);
  return { schemaVersion: 1, droppedAttempts: archive.droppedAttempts + excess, attempts: excess ? attempts.slice(excess) : attempts };
}
export function readArchive(storage?: Pick<Storage, "getItem" | "setItem">): PlaytestArchive {
  try { const data = JSON.parse((storage ?? localStorage).getItem(PLAYTEST_KEY) ?? "null"); if (data?.schemaVersion === 1 && Array.isArray(data.attempts)) {
    return { schemaVersion: 1, droppedAttempts: Number(data.droppedAttempts) || 0, attempts: data.attempts.slice(-MAX_ATTEMPTS).map((entry: AttemptRecord) => entry.outcome === "playing" ? finishAttempt(entry, "abandoned", "interrupted") : entry) };
  }} catch {}
  return emptyArchive();
}
export function writeArchive(archive: PlaytestArchive, storage?: Pick<Storage, "setItem">) { try { (storage ?? localStorage).setItem(PLAYTEST_KEY, JSON.stringify(archive)); } catch {} }
function csvCell(value: unknown): string { const content = typeof value === "string" ? value : JSON.stringify(value); return `"${content.replaceAll('"', '""')}"`; }
export function archiveJson(archive: PlaytestArchive): string { return JSON.stringify(archive, null, 2); }
export function archiveCsv(archive: PlaytestArchive): string {
  const fields = ["id","levelId","chapter","authoredSeed","initialRngState","startedAt","endedAt","outcome","terminationReason","activeMs","movesUsed","movesRemaining","initialMoves","initialGoals","goalsRemaining","symbols","chargeSymbol","chargeTarget","grantedPower","grantCount","tilesCleared","symbolsCleared","powersCreated","powersActivated","combinations","companionGrants","saltHits","saltBlocksBroken","reshuffles"] as const;
  const rows = archive.attempts.map(a => ({ ...a, tilesCleared:a.totals.tilesCleared,symbolsCleared:a.totals.symbolsCleared,powersCreated:a.totals.powersCreated,powersActivated:a.totals.powersActivated,combinations:a.totals.combinations,companionGrants:a.totals.companionGrants,saltHits:a.totals.saltHits,saltBlocksBroken:a.totals.saltBlocksBroken,reshuffles:a.totals.reshuffles }));
  return [fields.join(","), ...rows.map(row => fields.map(field => csvCell(row[field])).join(","))].join("\r\n") + "\r\n";
}
