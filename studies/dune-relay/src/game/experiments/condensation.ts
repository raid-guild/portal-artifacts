import type { PlayableLevelDefinition } from "../levels";

// Deliberately absent from LEVEL_ORDER: this board is a memory-only mechanic test.
const collectors = Array.from({ length: 25 }, (_, index) => ({ row: 2 + Math.floor(index / 5), col: 2 + index % 5 }));
export const CONDENSATION_LEVEL: PlayableLevelDefinition = {
  id: "condensation-experiment",
  title: "CONDENSATION TEST",
  chapter: "river",
  seed: 19027,
  moves: 26,
  goals: { water: 0, leaf: 0, condensation: 22 },
  symbols: ["water", "gear", "leaf", "pennant", "key"],
  lesson: "practice",
  opening: [{ row: 4, col: 3 }, { row: 4, col: 4 }],
  keeperTarget: 9,
  condensation: { collectors, wet: [{ row: 3, col: 3 }, { row: 4, col: 4 }, { row: 5, col: 5 }] },
  briefing: "Match through a silver wet collector to coat every collector in that match. Wet powers carry the spray across their hit area. Cover all 25 collectors.",
  victoryEyebrow: "CONDENSATION TEST",
  victoryTitle: "Collectors filled!",
  victoryMessage: "The whole collector patch is wet.",
};
