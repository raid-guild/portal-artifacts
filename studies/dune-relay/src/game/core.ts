export type SymbolKind = "water" | "gear" | "leaf" | "pennant" | "key";
export type Direction = "row" | "column";
export type Power = "flywheel" | "prism";
export type Tile = { id: number; kind: SymbolKind | "seedpod" | "crate"; jet?: Direction; power?: Power; hp?: number };
export type Board = (Tile | null)[][];
export type BoardMask = boolean[][];
export type CrustGrid = number[][];
export function boardMask(shape?: "clippedCorners" | "twinChambers" | "steppedBasin"): BoardMask {
  return Array.from({ length: BOARD_SIZE }, (_, row) => Array.from({ length: BOARD_SIZE }, (_, col) => {
    if (shape === "clippedCorners") return !((row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1));
    if (shape === "twinChambers") return col <= 2 || col >= 6 || (row >= 3 && row <= 5);
    if (shape === "steppedBasin") {
      const width = row < 2 ? 5 : row < 4 ? 7 : 9;
      return col >= (BOARD_SIZE - width) / 2 && col < (BOARD_SIZE + width) / 2;
    }
    return true;
  }));
}
export function playable(mask: BoardMask, cell: Cell): boolean { return inside(cell) && mask[cell.row][cell.col]; }
export type Cell = { row: number; col: number };
export type PuzzleAction = { kind: "swap" | "freeSwap"; from: Cell; to: Cell } | { kind: "tileBomb"; target: Cell };
export type CurrentEdge = "left" | "right" | "top" | "bottom";
export type CurrentRoute = { id: string; cells: Cell[]; closure: "loop" } | { id: string; cells: Cell[]; closure: "edgeWrap"; entry: CurrentEdge; exit: CurrentEdge };
export type CurrentMotion = { routeId: string; tileId: number; from: Cell; to: Cell; wrap?: { entry: CurrentEdge; exit: CurrentEdge } };
export type Goals = { water: number; leaf: number; pennant?: number; key?: number; crust?: number; seedpod?: number; crate?: number; condensation?: number };
export type GoalKind = keyof Goals;
import type { LevelDefinition, PlayableLevelDefinition } from "./levels";
export type Puzzle = {
  board: Board;
  mask: BoardMask;
  crust: CrustGrid;
  moves: number;
  goals: Goals;
  keeperCharge: number;
  symbols: SymbolKind[];
  chargeSymbol: SymbolKind;
  grantedPower: "jets" | "flywheels" | "prism";
  grantCount: number;
  grantedJetDirection?: Direction;
  keeperTarget: number;
  keeperFired: boolean;
  seed: number;
  nextId: number;
  status: "playing" | "won" | "lost";
  unlocked: Power[];
  opening?: [Cell, Cell];
  current?: Cell[];
  currents?: CurrentRoute[];
  condensation?: { collectors: BoardMask; wet: BoardMask };
};
export type Turn = {
  state: Puzzle;
  valid: boolean;
  cleared: Cell[];
  jetsCreated: Cell[];
  powersCreated: { cell: Cell; power: "jet" | Power }[];
  keeperJets: Cell[];
  shuffled: boolean;
  steps: TurnStep[];
  stats: TurnStats;
};
export type TurnStats = { symbolsCleared: Partial<Record<SymbolKind, number>>; powersCreated: Record<"jet" | Power, number>; powersActivated: Record<"jet" | Power, number>; combinations: Record<string, number>; companionGrants: number; saltHits: number; saltBlocksBroken: number; seedpodHits: number; seedpodsOpened: number; cratesDelivered: number; reshuffles: number; tilesCleared: number };
function emptyTurnStats(): TurnStats { return { symbolsCleared: {}, powersCreated: { jet: 0, flywheel: 0, prism: 0 }, powersActivated: { jet: 0, flywheel: 0, prism: 0 }, combinations: {}, companionGrants: 0, saltHits: 0, saltBlocksBroken: 0, seedpodHits: 0, seedpodsOpened: 0, cratesDelivered: 0, reshuffles: 0, tilesCleared: 0 }; }
export type TurnStep = {
  kind: "swap" | "bomb" | "convert" | "clear" | "fall" | "deliver" | "refill" | "keeper" | "shuffle" | "current";
  board: Board;
  crust: CrustGrid;
  wet?: BoardMask;
  spread?: Cell[];
  cells: Cell[];
  currentMotions?: CurrentMotion[];
  currentRouteIds?: string[];
  collections?: { cell: Cell; kind: GoalKind }[];
  deliveries?: { cell: Cell; id: number }[];
  crustHits?: Cell[];
  podHits?: Cell[];
  podEvents?: { after: number; hits: { cell: Cell; hp: number; id: number }[] }[];
  crustEvents?: { after: number; hits: { cell: Cell; hp: number }[] }[];
  jets: { cell: Cell; direction: Direction }[];
  effects?: { cell: Cell; power: Power; targets: Cell[]; selected?: SymbolKind; converted?: boolean; convertedTo?: "jet" | "flywheel" }[];
  sequence?: { kind: "jet" | "effect"; index: number }[];
  goals: Goals;
  keeperCharge: number;
};

const kinds: SymbolKind[] = ["water", "gear", "leaf"];
export const BOARD_SIZE = 9;
export const START_MOVES = 24;
export const TARGETS: Goals = { water: 18, leaf: 18 };
export const KEEPER_TARGET = 9;

function random(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next, next / 4294967296];
}

function key(cell: Cell): string { return `${cell.row},${cell.col}`; }
function inside(cell: Cell): boolean { return cell.row >= 0 && cell.row < BOARD_SIZE && cell.col >= 0 && cell.col < BOARD_SIZE; }
function orthogonal(cell: Cell): Cell[] { return [{ row: cell.row - 1, col: cell.col }, { row: cell.row + 1, col: cell.col }, { row: cell.row, col: cell.col - 1 }, { row: cell.row, col: cell.col + 1 }].filter(inside); }
function at(board: Board, cell: Cell): Tile | null { return board[cell.row][cell.col]; }
export function isPod(tile: Tile | null | undefined): boolean { return tile?.kind === "seedpod"; }
export function isCrate(tile: Tile | null | undefined): boolean { return tile?.kind === "crate"; }
export function isSpecial(tile: Tile | null | undefined): boolean { return Boolean(tile?.jet || tile?.power); }
function isSymbol(tile: Tile | null | undefined): tile is Tile & { kind: SymbolKind } { return Boolean(tile && ["water", "gear", "leaf", "pennant", "key"].includes(tile.kind) && !isSpecial(tile)); }
function copy(board: Board): Board { return board.map(row => row.map(tile => tile && { ...tile })); }
function copyCrust(crust: CrustGrid): CrustGrid { return crust.map(row => [...row]); }
function copyMask(mask: BoardMask): BoardMask { return mask.map(row => [...row]); }
function emptyCrust(): CrustGrid { return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)); }

function matches(board: Board): Cell[][] {
  const groups: Cell[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col];
      if (!isSymbol(tile)) continue;
      if (col === 0 || isSpecial(board[row][col - 1]) || board[row][col - 1]?.kind !== tile.kind) {
        let end = col + 1;
        while (end < BOARD_SIZE && isSymbol(board[row][end]) && board[row][end]?.kind === tile.kind) end++;
        if (end - col >= 3) groups.push(Array.from({ length: end - col }, (_, offset) => ({ row, col: col + offset })));
      }
      if (row === 0 || isSpecial(board[row - 1][col]) || board[row - 1][col]?.kind !== tile.kind) {
        let end = row + 1;
        while (end < BOARD_SIZE && isSymbol(board[end][col]) && board[end][col]?.kind === tile.kind) end++;
        if (end - row >= 3) groups.push(Array.from({ length: end - row }, (_, offset) => ({ row: row + offset, col })));
      }
    }
  }
  return groups;
}

function hasLegalMove(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const here = board[row][col];
      if (!here || isPod(here) || isCrate(here)) continue;
      if (isSpecial(here)) return true;
      for (const neighbor of [{ row: row + 1, col }, { row, col: col + 1 }]) {
        if (!inside(neighbor) || !at(board, neighbor) || isPod(at(board, neighbor)) || isCrate(at(board, neighbor)) || here.kind === at(board, neighbor)?.kind) continue;
        [board[row][col], board[neighbor.row][neighbor.col]] = [board[neighbor.row][neighbor.col], board[row][col]];
        const legal = matches(board).length > 0;
        [board[row][col], board[neighbor.row][neighbor.col]] = [board[neighbor.row][neighbor.col], board[row][col]];
        if (legal) return true;
      }
    }
  }
  return false;
}

export function legalMove(board: Board): [Cell, Cell] | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const from = { row, col };
      if (!at(board, from) || isPod(at(board, from)) || isCrate(at(board, from))) continue;
      for (const to of [{ row, col: col + 1 }, { row: row + 1, col }]) {
        if (!inside(to) || !at(board, to) || isPod(at(board, to)) || isCrate(at(board, to))) continue;
        if (isSpecial(at(board, from)) || isSpecial(at(board, to))) return [from, to];
        if (at(board, from)?.kind === at(board, to)?.kind) continue;
        [board[row][col], board[to.row][to.col]] = [board[to.row][to.col], board[row][col]];
        const legal = matches(board).length > 0;
        [board[row][col], board[to.row][to.col]] = [board[to.row][to.col], board[row][col]];
        if (legal) return [from, to];
      }
    }
  }
  return null;
}

function makesMatch(board: Board, cell: Cell): boolean {
  const kind = at(board, cell)?.kind;
  if (!kind || !isSymbol(at(board, cell))) return false;
  for (const [dr, dc] of [[1, 0], [0, 1]]) {
    let count = 1;
    for (const sign of [-1, 1]) {
      let neighbor = { row: cell.row + dr * sign, col: cell.col + dc * sign };
      while (inside(neighbor) && isSymbol(at(board, neighbor)) && at(board, neighbor)?.kind === kind) {
        count++;
        neighbor = { row: neighbor.row + dr * sign, col: neighbor.col + dc * sign };
      }
    }
    if (count >= 3) return true;
  }
  return false;
}

function fill(board: Board, mask: BoardMask, seed: number, nextId: number, requireMove: boolean, symbols: SymbolKind[] = kinds, crust: CrustGrid = emptyCrust()): { seed: number; nextId: number; shuffled: boolean } {
  const holes: Cell[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) if (mask[row][col] && !crust[row][col] && !board[row][col]) holes.push({ row, col });
  const shuffled = symbols.slice();
  // A nearly empty finale board can make exhaustive backtracking take minutes.
  // Bound the search, then use a deterministic, match-free rescue layout.
  let visits = 0;
  const maxVisits = 5000;
  function visit(index: number, value: number): number | null {
    if (++visits > maxVisits) return null;
    if (index === holes.length) return !requireMove || hasLegalMove(board) ? value : null;
    const cell = holes[index];
    let current = value;
    const order = shuffled.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const [next, roll] = random(current);
      current = next;
      const j = Math.floor(roll * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (const kind of order) {
      board[cell.row][cell.col] = { id: nextId + index, kind };
      if (!makesMatch(board, cell)) {
        const result = visit(index + 1, current);
        if (result !== null) return result;
      }
    }
    board[cell.row][cell.col] = null;
    return null;
  }
  const result = visit(0, seed);
  if (result !== null) return { seed: result, nextId: nextId + holes.length, shuffled: false };
  // A three-color diagonal pattern has no equal adjacent tiles. Keep Jet tiles
  // (and every tile ID) in place so their special behavior survives a rescue.
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const tile = board[row][col];
    if (!mask[row][col] || crust[row][col] || isSpecial(tile) || isPod(tile) || isCrate(tile)) continue;
    board[row][col] = { id: tile?.id ?? nextId++, kind: symbols[(row + col) % symbols.length] };
  }
  if (requireMove && !hasLegalMove(board)) {
    const rescue = board.flat().find(tile => tile && isSymbol(tile));
    if (rescue) rescue.jet = "row";
  }
  return { seed: random(seed)[0], nextId, shuffled: true };
}

function settle(board: Board, mask: BoardMask, crust: CrustGrid = emptyCrust()): void {
  for (let col = 0; col < BOARD_SIZE; col++) {
    let bottom = BOARD_SIZE - 1;
    while (bottom >= 0) {
      if (!mask[bottom][col] || crust[bottom][col]) { board[bottom][col] = null; bottom--; continue; }
      let top = bottom;
      while (top > 0 && mask[top - 1][col] && !crust[top - 1][col]) top--;
      const tiles: Tile[] = [];
      for (let row = bottom; row >= top; row--) if (board[row][col]) tiles.push(board[row][col]!);
      for (let row = bottom, index = 0; row >= top; row--) board[row][col] = tiles[index++] ?? null;
      bottom = top - 1;
    }
  }
}

function newBoard(seed: number, nextId: number, mask: BoardMask, symbols: SymbolKind[] = kinds, crust: CrustGrid = emptyCrust(), carry?: Board): { board: Board; seed: number; nextId: number } {
  const board: Board = Array.from({ length: BOARD_SIZE }, (_, row) => Array.from({ length: BOARD_SIZE }, (_, col) => carry?.[row][col] && (isPod(carry[row][col]) || isCrate(carry[row][col]) || isSpecial(carry[row][col])) ? { ...carry[row][col]! } : null));
  const result = fill(board, mask, seed, nextId, true, symbols, crust);
  return { board, ...result };
}

function lessonMove(board: Board, lesson: LevelDefinition["lesson"], crust: CrustGrid = emptyCrust()): [Cell, Cell] | undefined {
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const from = { row, col };
    for (const to of [{ row, col: col + 1 }, { row: row + 1, col }]) {
      if (!inside(to) || !at(board, from) || !at(board, to) || isSpecial(at(board, from)) || isSpecial(at(board, to)) || isPod(at(board, from)) || isPod(at(board, to)) || isCrate(at(board, from)) || isCrate(at(board, to)) || at(board, from)?.kind === at(board, to)?.kind) continue;
      [board[from.row][from.col], board[to.row][to.col]] = [board[to.row][to.col], board[from.row][from.col]];
      const groups = matches(board);
      const components = matchComponents(groups);
      const hasFive = components.some(component => component.some(group => group.length >= 5));
      const hasCross = components.some(component => component.length > 1);
      const hasFour = components.some(component => component.some(group => group.length === 4));
      const hasPennant = groups.some(group => group.some(cell => board[cell.row][cell.col]?.kind === "pennant"));
      const hasKey = groups.some(group => group.some(cell => board[cell.row][cell.col]?.kind === "key"));
      const breaksCrust = groups.some(group => group.some(cell => orthogonal(cell).some(neighbor => crust[neighbor.row][neighbor.col] > 0)));
      const hitsPod = groups.some(group => group.some(cell => orthogonal(cell).some(neighbor => isPod(at(board, neighbor)))));
      [board[from.row][from.col], board[to.row][to.col]] = [board[to.row][to.col], board[from.row][from.col]];
      if (lesson === "seedpod" && hitsPod || lesson === "crust" && breaksCrust || lesson === "pennant" && hasPennant || lesson === "key" && hasKey || lesson === "prism" && hasFive || lesson === "flywheel" && hasCross && !hasFive || lesson === "jet" && hasFour && !hasCross && !hasFive) return [from, to];
    }
  }
  return undefined;
}

/** The route is terrain: occupants (including powers) move, the route does not. */
export function advanceCurrent(board: Board, path: readonly Cell[]): Board {
  const next = copy(board);
  path.forEach((destination, index) => {
    const source = path[(index + path.length - 1) % path.length];
    next[destination.row][destination.col] = board[source.row][source.col] && { ...board[source.row][source.col]! };
  });
  return next;
}

function validatedCurrent(path: readonly Cell[] | undefined, mask: BoardMask): Cell[] | undefined {
  if (!path) return undefined;
  if (path.length < 4 || new Set(path.map(key)).size !== path.length || path.some(cell => !playable(mask, cell)) ||
      path.some((cell, index) => Math.abs(cell.row - path[(index + 1) % path.length].row) + Math.abs(cell.col - path[(index + 1) % path.length].col) !== 1))
    throw new Error("Current must be a distinct, playable orthogonal closed loop");
  return path.map(cell => ({ ...cell }));
}

function validatedCurrents(routes: readonly CurrentRoute[] | undefined, mask: BoardMask): CurrentRoute[] | undefined {
  if (!routes) return undefined;
  if (routes.length < 1 || routes.length > 4) throw new Error("Current must have one to four routes");
  const ids = new Set<string>(), used = new Set<string>();
  const onEdge = (cell: Cell, edge: CurrentEdge) => edge === "left" ? cell.col === 0 : edge === "right" ? cell.col === BOARD_SIZE - 1 : edge === "top" ? cell.row === 0 : cell.row === BOARD_SIZE - 1;
  return routes.map(route => {
    if (!route.id || ids.has(route.id) || route.cells.length < 4) throw new Error("Current route IDs must be unique and routes need four cells");
    ids.add(route.id);
    for (let i = 0; i < route.cells.length; i++) {
      const cell = route.cells[i];
      if (!playable(mask, cell) || used.has(key(cell))) throw new Error("Current routes must use distinct playable cells");
      used.add(key(cell));
      if (i && Math.abs(cell.row - route.cells[i-1].row) + Math.abs(cell.col - route.cells[i-1].col) !== 1) throw new Error("Current route must be orthogonal");
    }
    const first = route.cells[0], last = route.cells[route.cells.length - 1];
    if (route.closure === "loop") {
      if (Math.abs(first.row-last.row)+Math.abs(first.col-last.col)!==1) throw new Error("Current loop must close orthogonally");
    } else if (route.closure === "edgeWrap") {
      const edges: CurrentEdge[] = ["left","right","top","bottom"];
      if (!edges.includes(route.entry) || !edges.includes(route.exit)) throw new Error("Current edge wrap must name valid outer edges");
      const opposite = ({left:"right",right:"left",top:"bottom",bottom:"top"} as const)[route.entry];
      if (route.exit!==opposite || !onEdge(first,route.entry) || !onEdge(last,route.exit) || (route.entry==="left" || route.entry==="right" ? first.row!==last.row : first.col!==last.col)) throw new Error("Current edge wrap must pair opposite outer edges");
    } else {
      throw new Error("Current closure must be a loop or edge wrap");
    }
    return route.closure === "loop" ? { id: route.id, closure: "loop" as const, cells: route.cells.map(cell => ({...cell})) } : { id:route.id, closure:"edgeWrap" as const, entry:route.entry, exit:route.exit, cells:route.cells.map(cell=>({...cell})) };
  });
}

export function createPuzzle(seedOrLevel: number | PlayableLevelDefinition = Date.now() >>> 0): Puzzle {
  const level = typeof seedOrLevel === "number" ? undefined : seedOrLevel;
  const seed = level?.seed ?? seedOrLevel as number;
  if (level?.boardLayout && level.boardShape) throw new Error("Choose a board layout or shape, not both");
  if (level?.boardLayout && (level.boardLayout.length !== BOARD_SIZE || level.boardLayout.some(row=>row.length!==BOARD_SIZE || /[^#.]/.test(row)))) throw new Error("Board layout must be nine rows of # and .");
  const mask = level?.boardLayout ? level.boardLayout.map(row=>[...row].map(cell=>cell==="#")) : boardMask(level?.boardShape);
  const current = validatedCurrent(level?.current, mask);
  if (current && level?.currents) throw new Error("Choose legacy current or named currents");
  const currents = validatedCurrents(level?.currents ?? (current ? [{id:"main",cells:current,closure:"loop"}] : undefined), mask);
  const condensation = level?.condensation;
  if (condensation && level?.goals.condensation !== condensation.collectors.length - condensation.wet.length) throw new Error("Invalid condensation terrain or goal");
  const collectors = mask.map(row => row.map(() => false));
  const wet = mask.map(row => row.map(() => false));
  for (const cell of condensation?.collectors ?? []) {
    if (!playable(mask, cell) || collectors[cell.row][cell.col]) throw new Error("Invalid condensation collector");
    collectors[cell.row][cell.col] = true;
  }
  for (const cell of condensation?.wet ?? []) {
    if (!inside(cell) || !collectors[cell.row][cell.col] || wet[cell.row][cell.col]) throw new Error("Invalid initial condensation");
    wet[cell.row][cell.col] = true;
  }
  const crust = emptyCrust();
  for (const cell of level?.crust ?? []) {
    if (!playable(mask, cell) || crust[cell.row][cell.col] || !Number.isInteger(cell.hp ?? 1) || (cell.hp ?? 1) < 1 || (cell.hp ?? 1) > 5) throw new Error(`Invalid salt crust at ${cell.row},${cell.col}`);
    crust[cell.row][cell.col] = cell.hp ?? 1;
  }
  if (condensation && condensation.wet.some(cell => crust[cell.row][cell.col] > 0)) throw new Error("A wet collector cannot start under salt");
  if (level?.goals.crust !== undefined && level.goals.crust !== (level.crust?.length ?? 0)) throw new Error(`Salt goal differs from placed blocks in ${level.id}`);
  const symbols = level?.symbols ?? kinds;
  let fresh = newBoard(seed || 1, 1, mask, symbols, crust);
  const placePods = (fresh: { board: Board; seed: number; nextId: number }) => {
    for (const cell of level?.seedpods ?? []) {
      if (!playable(mask, cell) || crust[cell.row][cell.col] || isPod(fresh.board[cell.row][cell.col]) || !Number.isInteger(cell.hp ?? 2) || (cell.hp ?? 2) < 1 || (cell.hp ?? 2) > 5) throw new Error(`Invalid seedpod at ${cell.row},${cell.col}`);
      fresh.board[cell.row][cell.col] = { id: fresh.nextId++, kind: "seedpod", hp: cell.hp ?? 2 };
    }
    return fresh;
  };
  if (level?.goals.seedpod !== undefined && level.goals.seedpod !== (level.seedpods?.length ?? 0)) throw new Error(`Seedpod goal differs from placed pods in ${level.id}`);
  if (level?.seedpods?.length) fresh = placePods(fresh);
  if (level?.goals.crate !== undefined && level.goals.crate !== (level.crates?.length ?? 0)) throw new Error(`Crate goal differs from placed cargo in ${level.id}`);
  const placeCrates = (fresh: { board: Board; seed: number; nextId: number }) => {
    const occupied = new Set<string>();
    for (const cell of level?.crates ?? []) {
      if (!playable(mask, cell) || crust[cell.row][cell.col] || isPod(fresh.board[cell.row][cell.col]) || occupied.has(key(cell)) || !playable(mask, { row: cell.row + 1, col: cell.col })) throw new Error(`Invalid crate at ${cell.row},${cell.col}`);
      occupied.add(key(cell)); fresh.board[cell.row][cell.col] = { id: fresh.nextId++, kind: "crate" };
    }
    return fresh;
  };
  if (level?.crates?.length) fresh = placeCrates(fresh);
  let opening: [Cell, Cell] | undefined = level?.condensation || level?.lesson === "current" ? level.opening : undefined;
  if (level?.lesson === "combo") {
    fresh.board[3][3] = { ...fresh.board[3][3]!, jet: "row" };
    fresh.board[3][4] = { ...fresh.board[3][4]!, power: "flywheel" };
    opening = [{ row: 3, col: 3 }, { row: 3, col: 4 }];
  } else if (level && level.lesson !== "practice" && level.lesson !== "crate" && level.lesson !== "current" && level.lesson !== "wrapCurrent" && level.lesson !== "frozenCurrent" && level.lesson !== "condensation") {
    opening = lessonMove(fresh.board, level.lesson, crust);
    for (let attempt = 1; !opening && attempt < 50; attempt++) {
      fresh = newBoard((seed + attempt * 7919) >>> 0, 1, mask, symbols, crust);
      if (level.seedpods?.length) fresh = placePods(fresh);
      if (level.crates?.length) fresh = placeCrates(fresh);
      opening = lessonMove(fresh.board, level.lesson, crust);
    }
  }
  if ((level?.seedpods?.length || level?.crates?.length) && !hasLegalMove(fresh.board)) fresh = newBoard(fresh.seed, fresh.nextId, mask, symbols, crust, fresh.board);
  return { ...fresh, mask, crust, ...(current ? { current } : {}), ...(currents ? { currents } : {}), ...(condensation ? { condensation: { collectors, wet } } : {}), symbols: [...symbols], chargeSymbol: level?.chargeSymbol ?? "leaf", grantedPower: level?.grantedPower ?? "jets", grantCount: level?.grantCount ?? 2, moves: level?.moves ?? START_MOVES,
    goals: level ? { ...level.goals } : { ...TARGETS },
    keeperCharge: 0, keeperTarget: level?.keeperTarget ?? KEEPER_TARGET, keeperFired: false, grantedJetDirection: level?.grantedJetDirection, status: "playing",
    unlocked: level?.lesson === "jet" ? [] : level?.lesson === "flywheel" ? ["flywheel"] : ["flywheel", "prism"], opening };
}

function jetCells(cell: Cell, direction: Direction, mask: BoardMask): Cell[] {
  return Array.from({ length: BOARD_SIZE }, (_, n) => direction === "row" ? { row: cell.row, col: n } : { row: n, col: cell.col }).filter(hit => playable(mask, hit));
}

/** The victory refill deliberately permits matches; ordinary turns still use fill(). */
export function resolveFinaleRefill(previous: Puzzle, clearedBoard: Board): { board: Board; steps: TurnStep[] } {
  const board = copy(clearedBoard);
  const steps: TurnStep[] = [];
  let seed = previous.seed;
  let nextId = previous.nextId;
  const record = (kind: TurnStep["kind"], cells: Cell[] = [], jets: TurnStep["jets"] = []) => {
    steps.push({ kind, board: copy(board), crust: copyCrust(previous.crust), cells: cells.map(cell => ({ ...cell })),
      jets: jets.map(jet => ({ cell: { ...jet.cell }, direction: jet.direction })),
      goals: { ...previous.goals }, keeperCharge: previous.keeperCharge });
  };
  const randomRefill = () => {
    for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
      if (!previous.mask[row][col] || previous.crust[row][col] || board[row][col]) continue;
      const [next, roll] = random(seed);
      seed = next;
      board[row][col] = { id: nextId++, kind: previous.symbols[Math.floor(roll * previous.symbols.length)] };
    }
    record("refill");
  };
  const clearMatches = (groups: Cell[][]) => {
    const removal = new Map<string, Cell>();
    for (const group of groups) for (const cell of group) removal.set(key(cell), cell);
    const queue = [...removal.values()];
    const fired = new Set<string>();
    const jets: TurnStep["jets"] = [];
    while (queue.length) {
      const cell = queue.pop()!;
      const tile = at(board, cell);
      if (!tile?.jet || fired.has(key(cell))) continue;
      fired.add(key(cell));
      jets.push({ cell, direction: tile.jet });
      for (const hit of jetCells(cell, tile.jet, previous.mask)) if (at(board, hit)?.power !== "prism" && !isPod(at(board,hit)) && !isCrate(at(board,hit)) && !removal.has(key(hit))) {
        removal.set(key(hit), hit);
        queue.push(hit);
      }
    }
    for (const cell of removal.values()) if (at(board, cell)?.power !== "prism" && !isPod(at(board,cell)) && !isCrate(at(board,cell))) board[cell.row][cell.col] = null;
    record("clear", [...removal.values()], jets);
    settle(board, previous.mask, previous.crust);
    record("fall");
  };

  settle(board, previous.mask, previous.crust);
  record("fall");
  randomRefill();
  // Keep the spectacle finite even if a lucky refill repeatedly makes matches.
  for (let round = 0; round < 5; round++) {
    const groups = matches(board);
    if (!groups.length) return { board, steps };
    clearMatches(groups);
    if (round < 4) randomRefill();
  }
  // Drain matches without adding new random symbols, then make a match-free final fill.
  let groups = matches(board);
  while (groups.length) {
    clearMatches(groups);
    groups = matches(board);
  }
  const result = fill(board, previous.mask, seed, nextId, false, previous.symbols, previous.crust);
  record(result.shuffled ? "shuffle" : "refill");
  return { board, steps };
}

function area(cell: Cell, radius: number, mask: BoardMask): Cell[] {
  const result: Cell[] = [];
  for (let row = cell.row - radius; row <= cell.row + radius; row++)
    for (let col = cell.col - radius; col <= cell.col + radius; col++)
      if (playable(mask, { row, col })) result.push({ row, col });
  return result;
}

function selectedKind(board: Board, symbols: SymbolKind[]): SymbolKind {
  const count = new Map<SymbolKind, number>(symbols.map(kind => [kind, 0]));
  for (const row of board) for (const tile of row) if (isSymbol(tile)) count.set(tile.kind, count.get(tile.kind)! + 1);
  return symbols.reduce((best, kind) => count.get(kind)! > count.get(best)! ? kind : best, symbols[0]);
}

function matchComponents(groups: Cell[][]): Cell[][][] {
  const components: Cell[][][] = [];
  const unseen = new Set(groups.map((_, i) => i));
  while (unseen.size) {
    const first = unseen.values().next().value as number;
    unseen.delete(first);
    const component = [groups[first]];
    const seen = new Set(groups[first].map(key));
    let changed = true;
    while (changed) {
      changed = false;
      for (const i of [...unseen]) if (groups[i].some(cell => seen.has(key(cell)))) {
        unseen.delete(i); component.push(groups[i]);
        groups[i].forEach(cell => seen.add(key(cell)));
        changed = true;
      }
    }
    components.push(component);
  }
  return components;
}

export function playTurn(previous: Puzzle, from: Cell, to: Cell): Turn { return resolveAction(previous, { kind: "swap", from, to }); }

export function resolveAction(previous: Puzzle, action: PuzzleAction): Turn {
  const invalid: Turn = { state: previous, valid: false, cleared: [], jetsCreated: [], powersCreated: [], keeperJets: [], shuffled: false, steps: [], stats: emptyTurnStats() };
  if (previous.status !== "playing" || previous.moves <= 0) return invalid;
  const bomb = action.kind === "tileBomb";
  const from = bomb ? action.target : action.from, to = bomb ? action.target : action.to;
  if (!playable(previous.mask, from) || !playable(previous.mask, to)) return invalid;
  if (bomb) {
    const target = at(previous.board, from);
    if (!previous.crust[from.row][from.col] && !isPod(target) && (!target || isSpecial(target) || isCrate(target))) return invalid;
    if (isSpecial(target) || isCrate(target)) return invalid;
  } else if (!at(previous.board, from) || !at(previous.board, to) || isPod(at(previous.board, from)) || isPod(at(previous.board, to)) || isCrate(at(previous.board, from)) || isCrate(at(previous.board, to)) || action.kind==='freeSwap' && (previous.crust[from.row][from.col] > 0 || previous.crust[to.row][to.col] > 0)) return invalid;
  const distance = Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
  const direct = !bomb && distance === 0 && isSpecial(at(previous.board, from));
  if (!bomb && distance !== 1 && !direct) return invalid;
  if (action.kind === "freeSwap" && isSymbol(at(previous.board, from)) && isSymbol(at(previous.board, to)) && !isSpecial(at(previous.board, from)) && !isSpecial(at(previous.board, to)) && at(previous.board, from)?.kind === at(previous.board, to)?.kind) return invalid;
  // Water belongs to the net, but a power picked up from that net carries
  // water for this activation even after the swap lands it on dry ground.
  const carriedWetPowers = new Set<number>();
  if (!bomb && !direct && previous.condensation) for (const cell of [from, to]) {
    const tile = at(previous.board, cell);
    if (tile && isSpecial(tile) && previous.condensation.wet[cell.row][cell.col]) carriedWetPowers.add(tile.id);
  }
  const board = copy(previous.board);
  if (!direct && !bomb) [board[from.row][from.col], board[to.row][to.col]] = [board[to.row][to.col], board[from.row][from.col]];
  // Match resolution may turn either swapped tile into a power. Combo and
  // Prism selection must refer to the tiles the player actually swapped.
  const swappedFrom = { ...at(board, from) } as Tile;
  const swappedTo = { ...at(board, to) } as Tile;
  const swappedTwoPowers = !direct && !bomb && isSpecial(swappedFrom) && isSpecial(swappedTo);
  const initial = matches(board);
  const activated = (bomb ? [] : direct ? [from] : [from, to]).filter(cell => isSpecial(at(board, cell)));
  // Prisms only fire when the player selected them. A beam or later cascade
  // can pass over an idle Prism without consuming it.
  const selectedPrisms = new Set(activated.map(cell => at(board, cell)).filter(tile => tile?.power === "prism").map(tile => tile!.id));
  if (!bomb && action.kind !== "freeSwap" && !initial.length && !activated.length) return invalid;
  const state: Puzzle = { ...previous, board, crust: copyCrust(previous.crust), ...(previous.condensation ? { condensation: { collectors: copyMask(previous.condensation.collectors), wet: copyMask(previous.condensation.wet) } } : {}), moves: previous.moves - (action.kind === "swap" ? 1 : 0), goals: { ...previous.goals } };
  const cleared = new Map<string, Cell>();
  const jetsCreated: Cell[] = [];
  const powersCreated: Turn["powersCreated"] = [];
  const keeperJets: Cell[] = [];
  const steps: TurnStep[] = [];
  const stats = emptyTurnStats();
  // A Prism combo transforms normal tiles before detonating them. Retain their
  // original symbol for goal and Keeper credit while the tiles are special.
  const convertedOriginals = new Map<number, SymbolKind>();
  const record = (kind: TurnStep["kind"], cells: Cell[] = [], jets: TurnStep["jets"] = [], effects: NonNullable<TurnStep["effects"]> = [], sequence: NonNullable<TurnStep["sequence"]> = [], crustHits: Cell[] = [], crustEvents: NonNullable<TurnStep["crustEvents"]> = [], podHits: Cell[] = [], podEvents: NonNullable<TurnStep["podEvents"]> = [], collections: NonNullable<TurnStep["collections"]> = [], spread: Cell[] = []) => {
    steps.push({ kind, board: copy(board), crust: copyCrust(state.crust), cells: cells.map(cell => ({ ...cell })), crustHits: crustHits.map(cell => ({ ...cell })), crustEvents, podHits: podHits.map(cell => ({ ...cell })), podEvents, jets: jets.map(jet => ({ cell: { ...jet.cell }, direction: jet.direction })), effects, sequence,
      collections: collections.map(credit => ({ cell: { ...credit.cell }, kind: credit.kind })), ...(state.condensation ? { wet: copyMask(state.condensation.wet), spread: spread.map(cell => ({ ...cell })) } : {}), goals: { ...state.goals }, keeperCharge: state.keeperCharge });
  };
  if (bomb) record("bomb", [from]);
  else if (!direct) record("swap", [from, to]);
  const createdThisTurn = new Set<number>();
  const countedPowerActivations = new Set<number>();
  let iterations = 0;
  const resolveGroups = (initialGroups: Cell[][], initialForced: Cell[]) => {
  let groups = initialGroups;
  let forced = initialForced;
  while ((groups.length || forced.length) && iterations++ < 50) {
    // All spread decisions in this clear wave use the terrain as it stood
    // before any match or power in the wave fired.
    const wetBefore = state.condensation ? copyMask(state.condensation.wet) : undefined;
    const crustBefore = state.condensation ? copyCrust(state.crust) : undefined;
    const wasWet = (cell: Cell) => Boolean(wetBefore?.[cell.row]?.[cell.col]);
    const removal = new Map<string, Cell>();
    for (const group of groups) for (const cell of group) removal.set(key(cell), cell);
    for (const cell of forced) removal.set(key(cell), cell);
    if (groups.length) for (const component of matchComponents(groups)) {
      const cells = [...new Map(component.flat().map(cell => [key(cell), cell])).values()];
      const five = component.find(group => group.length >= 5);
      const cross = component.length > 1;
      const four = component.find(group => group.length >= 4);
      if (!five && !cross && !four) continue;
      const intersection = cross ? cells.find(cell => component.filter(group => group.some(member => key(member) === key(cell))).length > 1) : undefined;
      const firstWave = iterations === 1;
      const line = component.reduce((longest, group) => group.length > longest.length ? group : longest, component[0]);
      const center = line[Math.floor((line.length - 1) / 2)];
      const origin = [firstWave ? to : undefined, firstWave ? from : undefined, intersection, center, ...cells].find(cell => cell && cells.some(member => key(member) === key(cell)) && isSymbol(at(board, cell)))!;
      const tile = at(board, origin)!;
      if (five && state.unlocked.includes("prism")) tile.power = "prism";
      else if (cross && state.unlocked.includes("flywheel")) tile.power = "flywheel";
      else if (four) tile.jet = four[0].row === four[1].row ? "row" : "column";
      else continue;
      createdThisTurn.add(tile.id);
      powersCreated.push({ cell: origin, power: tile.power ?? "jet" });
      stats.powersCreated[tile.power ?? "jet"]++;
      if (tile.jet) jetsCreated.push(origin);
    }
    // A freshly created power is visible in this step but cannot detonate this turn.
    const protectedCells = new Set<string>();
    for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col];
      if (tile && createdThisTurn.has(tile.id)) protectedCells.add(key({ row, col }));
    }
    const fired = new Set<number>();
    const jets: TurnStep["jets"] = [];
    const effects: NonNullable<TurnStep["effects"]> = [];
    const sequence: NonNullable<TurnStep["sequence"]> = [];
    type DamageEvent = { kind: "match" | "power" | "prism"; clears: Map<string, Cell>; adjacency: Map<string, Cell>; direct: Map<string, Cell>; wetTargets: Map<string, Cell>; eligibleWetTargets: Map<string, Cell>; wetOrigin: boolean; after: number };
    const events: DamageEvent[] = [];
    // Only the powers explicitly created by this Prism combo inherit its water.
    const wetPrismCopies = new Set<number>();
    const newEvent = (kind: DamageEvent["kind"]): DamageEvent => { const event = { kind, clears: new Map<string, Cell>(), adjacency: new Map<string, Cell>(), direct: new Map<string, Cell>(), wetTargets: new Map<string, Cell>(), eligibleWetTargets: new Map<string, Cell>(), wetOrigin: false, after: -1 }; events.push(event); return event; };
    const claimed = new Set<string>();
    const claim = (cell: Cell, event: DamageEvent) => {
      const tile = at(board, cell);
      if (!isSymbol(tile) || protectedCells.has(key(cell)) || claimed.has(key(cell))) return;
      claimed.add(key(cell)); event.clears.set(key(cell), cell);
    };
    if (bomb && iterations === 1) {
      const event = newEvent("power");
      event.direct.set(key(from), from);
      if (!state.crust[from.row][from.col] && !isPod(at(board, from))) claim(from, event);
    }
    for (const component of matchComponents(groups)) {
      const event = newEvent("match");
      event.wetOrigin = component.some(group => group.some(wasWet));
      for (const cell of component.flat()) { event.adjacency.set(key(cell), cell); claim(cell, event); }
    }
    const fireJet = (cell: Cell, direction: Direction) => { jets.push({ cell, direction }); sequence.push({ kind: "jet", index: jets.length - 1 }); };
    const fireEffect = (effect: NonNullable<TurnStep["effects"]>[number]) => { effects.push(effect); sequence.push({ kind: "effect", index: effects.length - 1 }); };
    const queue: Cell[] = [...removal.values()];
    const addHits = (hits: Cell[], event: DamageEvent) => {
      for (const hit of hits) {
        event.wetTargets.set(key(hit), hit);
        if (state.crust[hit.row][hit.col] > 0 || isPod(at(board, hit))) event.direct.set(key(hit), hit);
        const occupant = at(board, hit);
        if (isPod(occupant) || isCrate(occupant)) continue;
        if (occupant?.power === "prism" && !selectedPrisms.has(occupant.id)) continue;
        if (!removal.has(key(hit))) removal.set(key(hit), hit);
        claim(hit, event);
        queue.push(hit);
      }
    };
    const wetJetRay = (origin: Cell, direction: Direction, event: DamageEvent) => {
      // Each side of the beam picks up water independently. A wet net behind
      // the origin cannot coat squares on the opposite side or earlier hits.
      const axis = direction === "row" ? origin.col : origin.row;
      if (event.wetOrigin) event.eligibleWetTargets.set(key(origin), origin);
      for (const step of [-1, 1]) {
        let wet = event.wetOrigin || wasWet(origin);
        for (let n = axis + step; n >= 0 && n < BOARD_SIZE; n += step) {
          const cell = direction === "row" ? { row: origin.row, col: n } : { row: n, col: origin.col };
          if (!playable(state.mask, cell)) continue;
          if (wasWet(cell)) wet = true;
          if (wet) event.eligibleWetTargets.set(key(cell), cell);
        }
      }
    };
    if (iterations === 1 && swappedTwoPowers) {
      const left = at(board, from)!; const right = at(board, to)!;
      const comboName = [left.power ?? "jet", right.power ?? "jet"].sort().join("+");
      stats.combinations[comboName] = (stats.combinations[comboName] ?? 0) + 1;
      stats.powersActivated[left.power ?? "jet"]++;
      stats.powersActivated[right.power ?? "jet"]++;
      countedPowerActivations.add(left.id); countedPowerActivations.add(right.id);
      fired.add(left.id); fired.add(right.id);
      const event = newEvent("power");
      event.wetOrigin = wasWet(from) || wasWet(to) || carriedWetPowers.has(left.id) || carriedWetPowers.has(right.id);
      if (event.wetOrigin) { event.wetTargets.set(key(from), from); event.wetTargets.set(key(to), to); }
      if (!((left.power === "prism") !== (right.power === "prism"))) {
        event.clears.set(key(from), from); event.clears.set(key(to), to);
      }
      if (left.power === "prism" && right.power === "prism") {
        event.kind = "prism";
        addHits(Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, n) => ({ row: Math.floor(n / BOARD_SIZE), col: n % BOARD_SIZE })).filter(cell => playable(state.mask, cell)), event);
        fireEffect({ cell: to, power: "prism", targets: [...removal.values()] });
      } else if (left.power === "prism" || right.power === "prism") {
        const partner = left.power === "prism" ? right : left;
        if (event.wetOrigin) wetPrismCopies.add(partner.id);
        const target = partner.kind as SymbolKind;
        const hits = board.flatMap((row, r) => row.flatMap((tile, c) => isSymbol(tile) && tile.kind === target ? [{ row: r, col: c }] : []));
        for (const hit of hits) event.wetTargets.set(key(hit), hit);
        for (const cell of hits) {
          const tile = at(board, cell)!;
          if (event.wetOrigin) wetPrismCopies.add(tile.id);
          convertedOriginals.set(tile.id, tile.kind as SymbolKind);
          if (partner.jet) tile.jet = partner.jet;
          else tile.power = "flywheel";
        }
        // This snapshot lets the rainbow rays visibly turn symbols into powers
        // before any of the copied powers fire in the following clear step.
        record("convert", hits, [], [{ cell: left.power === "prism" ? from : to, power: "prism", targets: hits, selected: target,
          convertedTo: partner.jet ? "jet" : "flywheel" }]);
        // Conversion is not a power hit. The copied powers each make their own event.
        for (const hit of hits) { if (!removal.has(key(hit))) removal.set(key(hit), hit); queue.push(hit); }
        fired.delete(partner.id); // The original partner joins the same chain.
      } else if (left.power === "flywheel" && right.power === "flywheel") {
        const hits = area(to, 2, state.mask); fireEffect({ cell: to, power: "flywheel", targets: hits }); addHits(hits, event);
      } else if (left.power === "flywheel" || right.power === "flywheel") {
        const beams: { cell: Cell; direction: Direction }[] = [];
        const hits = [-1, 0, 1].flatMap(offset => {
          const row = Math.max(0, Math.min(BOARD_SIZE - 1, to.row + offset));
          const col = Math.max(0, Math.min(BOARD_SIZE - 1, to.col + offset));
          beams.push({ cell: { row, col: to.col }, direction: "row" }, { cell: { row: to.row, col }, direction: "column" });
          return [...jetCells({ row, col: to.col }, "row", state.mask), ...jetCells({ row: to.row, col }, "column", state.mask)];
        });
        fireEffect({ cell: to, power: "flywheel", targets: hits });
        beams.forEach(beam => { fireJet(beam.cell, beam.direction); wetJetRay(beam.cell, beam.direction, event); }); addHits(hits, event);
      } else {
        for (const direction of ["row", "column"] as const) { fireJet(to, direction); wetJetRay(to, direction, event); addHits(jetCells(to, direction, state.mask), event); }
      }
      event.after = sequence.length - 1;
    }
    let head = 0;
    while (head < queue.length) {
      const cell = queue[head++]; const tile = at(board, cell);
      if (!tile || !isSpecial(tile) || fired.has(tile.id) || protectedCells.has(key(cell)) || tile.power === "prism" && !selectedPrisms.has(tile.id)) continue;
      fired.add(tile.id);
      if (!countedPowerActivations.has(tile.id)) { stats.powersActivated[tile.power ?? "jet"]++; countedPowerActivations.add(tile.id); }
      const event = newEvent(tile.power === "prism" ? "prism" : "power");
      event.wetOrigin = wasWet(cell) || carriedWetPowers.has(tile.id) || wetPrismCopies.has(tile.id);
      event.clears.set(key(cell), cell);
      if (event.wetOrigin) event.wetTargets.set(key(cell), cell);
      if (tile.jet) { fireJet(cell, tile.jet); wetJetRay(cell, tile.jet, event); addHits(jetCells(cell, tile.jet, previous.mask), event); }
      if (tile.power === "flywheel") { const hits = area(cell, 1, state.mask); fireEffect({ cell, power: "flywheel", targets: hits, converted: convertedOriginals.has(tile.id) }); addHits(hits, event); }
      if (tile.power === "prism") {
        const target = !direct && iterations === 1 && activated.some(member => key(member) === key(cell))
          ? key(cell) === key(from) && isSymbol(swappedTo) ? swappedTo.kind
            : key(cell) === key(to) && isSymbol(swappedFrom) ? swappedFrom.kind : undefined
          : undefined;
        const selected = target ?? selectedKind(board, state.symbols);
        const hits = board.flatMap((row, r) => row.flatMap((piece, c) => isSymbol(piece) && piece.kind === selected ? [{ row: r, col: c }] : []));
        fireEffect({ cell, power: "prism", targets: hits, selected }); addHits(hits, event);
      }
      event.after = sequence.length - 1;
    }
    const crustHits = new Map<string, Cell>();
    const podHits = new Map<string, Cell>();
    const podEvents: NonNullable<TurnStep["podEvents"]> = [];
    const openedPods: Cell[] = [];
    const crustEvents: NonNullable<TurnStep["crustEvents"]> = [];
    const collections: NonNullable<TurnStep["collections"]> = [];
    const spread: Cell[] = [];
    const freedByWetEvent = new Map<(typeof events)[number], Cell[]>();
    for (const event of events) {
      const candidates = new Map(event.direct);
      if (event.kind === "match" || event.kind === "prism") for (const cell of (event.kind === "match" ? event.adjacency : event.clears).values()) {
        // A Prism's cleared normal symbols crack neighboring salt just like a
        // match. Its own origin and any converted powers do not radiate hits.
        if (event.kind === "prism" && !isSymbol(at(board, cell))) continue;
        for (const neighbor of orthogonal(cell)) if (state.crust[neighbor.row][neighbor.col] > 0) candidates.set(key(neighbor), neighbor);
      }
      const hits: { cell: Cell; hp: number }[] = [];
      for (const cell of candidates.values()) if (state.crust[cell.row][cell.col] > 0) {
        state.crust[cell.row][cell.col]--;
        stats.saltHits++;
        crustHits.set(key(cell), cell);
        hits.push({ cell: { ...cell }, hp: state.crust[cell.row][cell.col] });
        if (state.crust[cell.row][cell.col] === 0) {
          stats.saltBlocksBroken++;
          if (event.wetOrigin || event.eligibleWetTargets.has(key(cell))) freedByWetEvent.set(event, [...(freedByWetEvent.get(event) ?? []), cell]);
          if ((state.goals.crust ?? 0) > 0) { state.goals.crust!--; collections.push({ cell, kind: "crust" }); }
        }
      }
      if (hits.length) crustEvents.push({ after: event.after, hits });
      const podCandidates = new Map(event.direct);
      if (event.kind === "match" || event.kind === "prism") for (const cell of (event.kind === "match" ? event.adjacency : event.clears).values()) {
        if (event.kind === "prism" && !isSymbol(at(board, cell))) continue;
        for (const neighbor of orthogonal(cell)) if (isPod(at(board, neighbor))) podCandidates.set(key(neighbor), neighbor);
      }
      const podDamage: { cell: Cell; hp: number; id: number }[] = [];
      for (const cell of podCandidates.values()) {
        const tile = at(board, cell);
        if (!isPod(tile)) continue;
        tile!.hp = Math.max(0, (tile!.hp ?? 2) - 1);
        stats.seedpodHits++; podHits.set(key(cell), cell);
        podDamage.push({ cell: { ...cell }, hp: tile!.hp, id: tile!.id });
        if (tile!.hp === 0) {
          stats.seedpodsOpened++;
          if ((state.goals.seedpod ?? 0) > 0) { state.goals.seedpod!--; collections.push({ cell, kind: "seedpod" }); }
          board[cell.row][cell.col] = null; openedPods.push(cell);
        }
      }
      if (podDamage.length) podEvents.push({ after: event.after, hits: podDamage });
    }
    // Resolve salt first. A power that strikes salt cracks it, but cannot wet
    // the net underneath in the same clear wave, even if another power also hits.
    // Origins and beam pickup use the pre-wave snapshot, so newly wet cells cannot
    // propagate again until a later cascade wave.
    if (state.condensation) for (const event of events) {
      const targets = event.kind === "match" ? event.adjacency : event.wetTargets.size ? event.wetTargets : event.clears;
      const eligible = event.wetOrigin ? targets.values() : event.eligibleWetTargets.values();
      for (const cell of [...eligible, ...(freedByWetEvent.get(event) ?? [])]) if (state.condensation.collectors[cell.row][cell.col] && !state.condensation.wet[cell.row][cell.col] && state.crust[cell.row][cell.col] === 0 && (event.kind === "match" || crustBefore?.[cell.row]?.[cell.col] === 0)) {
        state.condensation.wet[cell.row][cell.col] = true;
        spread.push(cell);
        if ((state.goals.condensation ?? 0) > 0) { state.goals.condensation!--; collections.push({ cell, kind: "condensation" }); }
      }
    }
    const removed: Cell[] = [];
    for (const cell of removal.values()) {
      if (protectedCells.has(key(cell))) continue;
      const tile = at(board, cell);
      if (!tile) continue;
      if (bomb && iterations === 1 && key(cell) === key(from) && (previous.crust[from.row][from.col] > 0 || isPod(tile))) continue;
      if (tile.power === "prism" && !selectedPrisms.has(tile.id)) continue;
      if (isCrate(tile) || isPod(tile)) continue;
      const collected = convertedOriginals.get(tile.id) ?? (isSymbol(tile) ? tile.kind : undefined);
      stats.tilesCleared++;
      if (collected) stats.symbolsCleared[collected] = (stats.symbolsCleared[collected] ?? 0) + 1;
      if (collected && collected in state.goals) {
        const goal = collected as GoalKind;
        if ((state.goals[goal] ?? 0) > 0) { state.goals[goal]!--; collections.push({ cell, kind: goal }); }
      }
      if (collected === state.chargeSymbol) state.keeperCharge++;
      convertedOriginals.delete(tile.id);
      board[cell.row][cell.col] = null; cleared.set(key(cell), cell); removed.push(cell);
    }
    record("clear", [...removed, ...openedPods], jets, effects, sequence, [...crustHits.values()], crustEvents, [...podHits.values()], podEvents, collections, spread);
    settle(board, state.mask, state.crust); record("fall");
    deliverAtExits();
    groups = matches(board); forced = [];
  }
  };
  // Cargo exits at every bottom edge of the authored board mask. Salt is
  // support, not an exit: a crate resting on it waits until it is broken.
  function deliverAtExits() {
    for (let deliveryRound = 0; deliveryRound < BOARD_SIZE; deliveryRound++) {
      const deliveries: { cell: Cell; id: number }[] = [];
      const credits: NonNullable<TurnStep["collections"]> = [];
      for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = { row, col }, cargo = board[row][col];
        if (!isCrate(cargo) || playable(state.mask, { row: row + 1, col })) continue;
        deliveries.push({ cell, id: cargo!.id }); board[row][col] = null;
        stats.cratesDelivered++;
        if ((state.goals.crate ?? 0) > 0) { state.goals.crate!--; credits.push({ cell, kind: "crate" }); }
      }
      if (!deliveries.length) break;
      record("deliver", deliveries.map(item => item.cell), [], [], [], [], [], [], [], credits);
      steps[steps.length - 1].deliveries = deliveries;
      settle(board, state.mask, state.crust); record("fall");
    }
  }
  resolveGroups(initial, bomb ? [from] : activated);
  let refill = fill(board, state.mask, state.seed, state.nextId, false, state.symbols, state.crust);
  state.seed = refill.seed; state.nextId = refill.nextId;
  record(refill.shuffled ? "shuffle" : "refill");
  let refillShuffled = refill.shuffled;
  const routes = state.currents ?? (state.current ? [{id:"main",closure:"loop" as const,cells:state.current}] : []);
  const activeRoutes = routes.filter(route => !route.cells.some(cell => state.crust[cell.row][cell.col] > 0));
  if (action.kind === "swap" && activeRoutes.length) {
    const before = copy(board), motions: CurrentMotion[] = [];
    for (const route of activeRoutes) route.cells.forEach((from,index) => {
      const to = route.cells[(index+1)%route.cells.length], tile = before[from.row][from.col];
      board[to.row][to.col] = tile && {...tile};
      if (tile) motions.push({routeId:route.id,tileId:tile.id,from:{...from},to:{...to},...(index===route.cells.length-1 && route.closure==="edgeWrap" ? {wrap:{entry:route.entry,exit:route.exit}} : {})});
    });
    record("current", activeRoutes.flatMap(route=>route.cells));
    steps[steps.length-1].currentMotions = motions;
    steps[steps.length-1].currentRouteIds = activeRoutes.map(route=>route.id);
    const currentGroups = matches(board);
    if (currentGroups.length) {
      resolveGroups(currentGroups, []);
      refill = fill(board, state.mask, state.seed, state.nextId, false, state.symbols, state.crust);
      state.seed = refill.seed; state.nextId = refill.nextId;
      record(refill.shuffled ? "shuffle" : "refill");
      refillShuffled ||= refill.shuffled;
    } else {
      // A carried crate can reach a bottom exit without making a match.
      deliverAtExits();
      const deliveryGroups = matches(board);
      if (deliveryGroups.length) {
        resolveGroups(deliveryGroups, []);
        refill = fill(board, state.mask, state.seed, state.nextId, false, state.symbols, state.crust);
        state.seed = refill.seed; state.nextId = refill.nextId;
        record(refill.shuffled ? "shuffle" : "refill");
        refillShuffled ||= refill.shuffled;
      }
    }
  }
  if (state.keeperCharge >= state.keeperTarget) {
    const positions: Cell[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) if (isSymbol(board[row][col])) positions.push({ row, col });
    if (positions.length >= state.grantCount) {
      for (let index = 0; index < state.grantCount; index++) {
        const [next, roll] = random(state.seed); state.seed = next;
        const cell = positions.splice(Math.floor(roll * positions.length), 1)[0];
        if (state.grantedPower === "flywheels") board[cell.row][cell.col]!.power = "flywheel";
        else if (state.grantedPower === "prism") board[cell.row][cell.col]!.power = "prism";
        else board[cell.row][cell.col]!.jet = state.grantedJetDirection ?? (index === 0 ? "row" : "column");
        keeperJets.push(cell);
      }
      state.keeperFired = true; state.keeperCharge = 0; stats.companionGrants++; record("keeper", keeperJets);
    }
  }
  state.status = Object.values(state.goals).every(value => value === 0) ? "won" : state.moves === 0 ? "lost" : "playing";
  let shuffled = refillShuffled;
  if (state.status === "playing" && !hasLegalMove(board)) {
    const fresh = newBoard(state.seed, state.nextId, state.mask, state.symbols, state.crust, board);
    state.board = fresh.board; state.seed = fresh.seed; state.nextId = fresh.nextId; shuffled = true;
    stats.reshuffles++;
    steps.push({ kind: "shuffle", board: copy(state.board), crust: copyCrust(state.crust), cells: [], jets: [], goals: { ...state.goals }, keeperCharge: state.keeperCharge });
  }
  if (refillShuffled) stats.reshuffles++;
  return { state, valid: true, cleared: [...cleared.values()], jetsCreated, powersCreated, keeperJets, shuffled, steps, stats };
}

export function coinReward(moves: number): number { return 20 + Math.max(0, moves) * 3; }
