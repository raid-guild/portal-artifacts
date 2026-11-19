import type { Cell, Direction } from "./core";

/** Delay until a full-length Jet beam reaches a cell along its firing axis. */
export function beamTravelDelay(origin: Cell, direction: Direction, target: Cell, speed = 1): number {
  const from = direction === "row" ? origin.col : origin.row;
  const to = direction === "row" ? target.col : target.row;
  const reach = to < from ? from + 0.5 : 9 - from - 0.5;
  return Math.abs(to - from) / reach * 240 / speed;
}
