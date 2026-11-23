import type { Cell } from "./core";
import type { PlayableLevelDefinition } from "./levels";

/** Playtest-only route. It has no LevelId and never enters campaign saves. */
export const RIVER_CURRENT: Cell[] = [
  { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
  { row: 4, col: 5 }, { row: 5, col: 5 }, { row: 5, col: 4 },
  { row: 5, col: 3 }, { row: 4, col: 3 },
];

export const RIVER_BEND: PlayableLevelDefinition = {
  id: "riverBendPreview", title: "RIVER BEND", chapter: "castle", seed: 72891,
  moves: 26, goals: { water: 24, leaf: 24 },
  symbols: ["water", "gear", "leaf", "pennant", "key"],
  lesson: "current", current: RIVER_CURRENT, keeperTarget: 9,
  opening: [{ row: 2, col: 4 }, { row: 2, col: 5 }],
  briefing: "Match and swap tiles in the water normally. After each move, the current carries all tiles on its path one space clockwise. Any matches it makes will clear.",
  victoryEyebrow: "RIVER BEND OPEN", victoryTitle: "The current carries us onward!",
  victoryMessage: "This is an isolated preview of the river mechanic.",
};
