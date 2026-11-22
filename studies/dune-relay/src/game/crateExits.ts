import { BOARD_SIZE, playable, type BoardMask, type Cell } from "./core";

/** A crate can leave from any playable cell with no playable cell below it. */
export function crateExitCells(mask: BoardMask): Cell[] {
  const exits: Cell[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) for (let col = 0; col < BOARD_SIZE; col++) {
    const cell = { row, col };
    if (playable(mask, cell) && !playable(mask, { row: row + 1, col })) exits.push(cell);
  }
  return exits;
}
