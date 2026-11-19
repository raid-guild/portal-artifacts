import { BOARD_SIZE, type Board, type Cell, type Direction, type Power, type Puzzle, type TurnStep, isSpecial, resolveFinaleRefill } from "./core";

export type FinaleWave = { jets: TurnStep["jets"]; effects: NonNullable<TurnStep["effects"]>; removed: Cell[]; before: Board; after: Board };
export type FinalePlan = { conversions: { board: Board; moves: number }[]; waves: FinaleWave[]; refill: ReturnType<typeof resolveFinaleRefill>; board: Board };
const clone = (board: Board): Board => board.map(row => row.map(tile => tile && { ...tile }));
const key = (cell: Cell) => `${cell.row},${cell.col}`;

/** Build the complete finale before animating it, so Skip lands on exactly the same board. */
export function planFinale(puzzle: Puzzle): FinalePlan {
  const board = clone(puzzle.board);
  const cells: Cell[] = puzzle.mask.flatMap((row, r) => row.flatMap((yes, c) => yes && !puzzle.crust[r][c] ? [{ row: r, col: c }] : []));
  const conversions: FinalePlan["conversions"] = [];
  for (let i = 0; i < puzzle.moves; i++) {
    const start = (i * 11 + 9) % cells.length;
    let cell: Cell | undefined;
    for (let offset = 0; offset < cells.length; offset++) {
      const candidate = cells[(start + offset) % cells.length];
      const tile = board[candidate.row][candidate.col];
      if (tile && !isSpecial(tile)) { cell = candidate; break; }
    }
    if (!cell) break;
    const tile = board[cell.row][cell.col]!;
    if (puzzle.grantedPower === "flywheels") tile.power = "flywheel";
    else tile.jet = i % 2 ? "column" : "row";
    conversions.push({ board: clone(board), moves: puzzle.moves - i - 1 });
  }
  type FinalePower = { cell: Cell; jet?: Direction; power?: Power };
  const pending = new Map<string, FinalePower>();
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const tile = board[row][col];
    // Idle Prisms are not auto-fired by other powers or by the victory spectacle.
    if (tile?.jet || tile?.power === "flywheel") pending.set(key({ row, col }), { cell: { row, col }, jet: tile.jet, power: tile.power });
  }
  const waves: FinaleWave[] = [];
  let wave: FinalePower[] = [];
  while (wave.length || pending.size) {
    if (!wave.length) wave = [...pending.values()].slice(0, 3);
    for (const item of wave) pending.delete(key(item.cell));
    const before = clone(board);
    const jets = wave.filter(item => item.jet).map(item => ({ cell: item.cell, direction: item.jet! }));
    const effects: FinaleWave["effects"] = [];
    const hits = new Map<string, Cell>();
    const add = (cell: Cell) => {
      if (!puzzle.mask[cell.row]?.[cell.col] || board[cell.row][cell.col]?.power === "prism") return;
      hits.set(key(cell), cell);
    };
    for (const item of wave) {
      add(item.cell);
      if (item.jet) for (let n = 0; n < BOARD_SIZE; n++) add(item.jet === "row" ? { row: item.cell.row, col: n } : { row: n, col: item.cell.col });
      if (item.power === "flywheel") {
        const targets: Cell[] = [];
        for (let row = Math.max(0, item.cell.row - 1); row <= Math.min(BOARD_SIZE - 1, item.cell.row + 1); row++)
          for (let col = Math.max(0, item.cell.col - 1); col <= Math.min(BOARD_SIZE - 1, item.cell.col + 1); col++) {
            const cell = { row, col }; if (puzzle.mask[row][col]) { targets.push(cell); add(cell); }
          }
        effects.push({ cell: item.cell, power: "flywheel", targets });
      }
    }
    const triggered = new Map<string, FinalePower>();
    const removed: Cell[] = [];
    for (const cell of hits.values()) {
      const next = pending.get(key(cell));
      if (next) triggered.set(key(cell), next);
      else if (board[cell.row][cell.col]) { board[cell.row][cell.col] = null; removed.push(cell); }
    }
    for (const id of triggered.keys()) pending.delete(id);
    waves.push({ jets, effects, removed, before, after: clone(board) });
    wave = [...triggered.values()];
  }
  const refill = resolveFinaleRefill(puzzle, board);
  return { conversions, waves, refill, board: refill.board };
}
