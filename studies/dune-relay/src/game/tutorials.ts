import type { LevelId } from "./levels";
import type { CompanionId } from "./save";

export const TUTORIALS = [
  { id: "jet", level: "pumpHouse", title: "Pressure Jet", speaker: "keeper", summary: "Match four in a line. Double tap the Jet to fire across its arrow.", stages: ["Swap to line up four water canteens.", "Four in a row make a horizontal Jet at the swap.", "Double tap the Jet to fire it.", "The beam clears its whole row."] },
  { id: "flywheel", level: "primePump", title: "Flywheel", speaker: "keeper", summary: "Match an L or T. Fire the gear to clear a 3×3 patch.", stages: ["Swap to complete an L of five canteens.", "The L makes a Flywheel at the swap.", "Double tap the Flywheel to spin it.", "Its 3×3 patch clears."] },
  { id: "prism", level: "prismTower", title: "Prism", speaker: "keeper", summary: "Match five, then swap the Prism with a symbol to clear that symbol everywhere.", stages: ["Swap to line up five reeds.", "A Prism appears at the swap.", "Swap it with a water canteen.", "Rainbow beams clear water, leaving other symbols."] },
  { id: "combo", level: "oasisRelay", title: "Jet + Jet", speaker: "keeper", summary: "Combine two Jets to fire both a row and a column.", stages: ["Two horizontal Jets sit side by side.", "Swap the Jets together.", "Both directions fire, even from two horizontal Jets.", "The cross clears its row and column."] },
  { id: "salt", level: "saltSealedIntake", title: "Salt Crust", speaker: "wayfinder", summary: "Match beside salt to crack it. Jets and Flywheels need a direct hit; Prism clears can crack adjacent salt.", stages: ["Salt blocks this square.", "Match next to the crust.", "The adjacent match cracks it.", "Jets and Flywheels must hit salt directly. Prism-cleared tiles can crack neighboring salt."] },
  { id: "layeredSalt", level: "saltboundHinges", title: "Layered Salt", speaker: "gatewright", summary: "Strong crust takes two hits. Only the final break counts toward the goal.", stages: ["This crust has two layers.", "A neighboring match removes one layer.", "The cracked crust needs one more hit.", "Match beside it again.", "The second hit breaks it and counts toward the goal."] },
  { id: "crate", level: "marketArrival", title: "Delivery Crates", speaker: "towncrier", summary: "Clear beneath a crate. It falls, then delivers at any bottom edge of the board.", stages: ["Cargo begins above the market.", "Match beneath the crate to open a gap.", "The crate falls through the gap.", "At a bottom edge it disappears and counts as a delivery."] },
  { id: "seedpod", level: "seedStore", title: "Seedpod", speaker: "fieldkeeper", summary: "Seedpods cannot be swapped. Match beside one to crack it; it falls with the board and opens on a second hit.", stages: ["This pod cannot be swapped.", "Match below and beside it to crack the shell.", "The cracked pod falls into the gap.", "Match beside it again.", "The second hit opens the pod."] },
] as const satisfies readonly { id: string; level: LevelId; title: string; speaker: CompanionId; summary: string; stages: readonly string[] }[];
export type TutorialId = (typeof TUTORIALS)[number]["id"];
export type Tutorial = (typeof TUTORIALS)[number];
export const TUTORIAL_BY_LEVEL = Object.fromEntries(TUTORIALS.map(t => [t.level,t])) as Partial<Record<LevelId,Tutorial>>;
export function tutorialAvailable(t: Tutorial, completed: readonly LevelId[], accessible: LevelId | null, farmlandUnlocked: boolean, sandbox = false, seen: ReadonlySet<TutorialId> = new Set()): boolean {
  if (sandbox) return true;
  if (t.level === "seedStore" && !farmlandUnlocked) return false;
  if (t.level === "marketArrival" && accessible !== "marketArrival" && !completed.includes("marketArrival") && !seen.has(t.id)) return false;
  return completed.includes(t.level) || accessible === t.level || seen.has(t.id);
}
