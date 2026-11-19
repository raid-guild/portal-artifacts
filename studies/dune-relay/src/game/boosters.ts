import { BOARD_SIZE, isSpecial, type Cell, type Puzzle, type SymbolKind } from "./core";

export type BoosterKind = "jet" | "flywheel" | "prism";
export const BOOSTERS: { kind: BoosterKind; title: string; cost: number; description: string; image: string }[] = [
  { kind: "jet", title: "Water Jet", cost: 300, description: "Horizontal beam · starts on board", image: "/sprites/jet-row.png" },
  { kind: "flywheel", title: "Flywheel", cost: 300, description: "Clears a 3 × 3 area · starts on board", image: "/sprites/flywheel.png" },
  { kind: "prism", title: "Prism", cost: 500, description: "Clears one symbol · starts on board", image: "/sprites/prism.png" },
];
export function boosterCost(selected: readonly BoosterKind[]): number {
  if (new Set(selected).size !== selected.length || selected.some(kind => !BOOSTERS.some(item => item.kind === kind))) throw new Error("Invalid booster selection");
  return selected.reduce((sum, kind) => sum + BOOSTERS.find(item => item.kind === kind)!.cost, 0);
}
function cellKey(cell: Cell): string { return `${cell.row},${cell.col}`; }
function openingFootprint(puzzle: Puzzle): Set<string> {
  const excluded = new Set<string>();
  if (!puzzle.opening) return excluded;
  const [from, to] = puzzle.opening;
  excluded.add(cellKey(from)); excluded.add(cellKey(to));
  const board = puzzle.board.map(row => [...row]);
  [board[from.row][from.col], board[to.row][to.col]] = [board[to.row][to.col], board[from.row][from.col]];
  const groups: Cell[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const tile = board[row][col]; if (!tile || isSpecial(tile)) continue;
    for (const [dr, dc] of [[0,1],[1,0]]) {
      const previous = board[row-dr]?.[col-dc]; if (previous && !isSpecial(previous) && previous.kind === tile.kind) continue;
      const group: Cell[] = []; let r = row, c = col;
      while (board[r]?.[c] && !isSpecial(board[r][c]) && board[r][c]?.kind === tile.kind) { group.push({row:r,col:c}); r += dr; c += dc; }
      if (group.length >= 3) groups.push(group);
    }
  }
  // Protect the complete connected opening component, including its retained power origin.
  const selected = new Set<string>([cellKey(from), cellKey(to)]);
  let changed = true;
  while (changed) { changed = false; for (const group of groups) if (group.some(cell => selected.has(cellKey(cell)))) for (const cell of group) if (!selected.has(cellKey(cell))) { selected.add(cellKey(cell)); changed = true; } }
  return selected;
}
export type BoosterPlacement = { tileId: number; cell: Cell; kind: BoosterKind };
export function prepareStartingBoosters(puzzle: Puzzle, selected: readonly BoosterKind[]): { puzzle: Puzzle; placements: BoosterPlacement[] } {
  boosterCost(selected);
  const board = puzzle.board.map(row => row.map(tile => tile && { ...tile }));
  const excluded = openingFootprint(puzzle);
  const candidates: Cell[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const tile = board[row][col]; const cell = { row, col };
    if (puzzle.mask[row][col] && !puzzle.crust[row][col] && tile && !isSpecial(tile) && !excluded.has(cellKey(cell))) candidates.push(cell);
  }
  if (candidates.length < selected.length) throw new Error("No room for starting boosters");
  // Stable, dispersed positions. Neither RNG state nor tile identity changes.
  const positions = selected.map((_, index) => candidates.splice(Math.floor(((index + .5) / selected.length) * candidates.length), 1)[0]);
  const placements = selected.map((kind, index) => { const cell = positions[index]; const tile = board[cell.row][cell.col]!; if (kind === "jet") tile.jet = "row"; else tile.power = kind; return { tileId: tile.id, cell: { ...cell }, kind }; });
  return { puzzle: { ...puzzle, board, mask: puzzle.mask.map(row => [...row]), crust: puzzle.crust.map(row => [...row]), goals: { ...puzzle.goals }, symbols: [...puzzle.symbols] as SymbolKind[], opening: puzzle.opening && [{ ...puzzle.opening[0] }, { ...puzzle.opening[1] }] }, placements };
}
export function applyStartingBoosters(puzzle: Puzzle, selected: readonly BoosterKind[]): Puzzle { return prepareStartingBoosters(puzzle, selected).puzzle; }
