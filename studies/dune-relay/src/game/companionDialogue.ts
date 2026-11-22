import type { CompanionId, Region } from "./save";
import { LEVELS, type LevelId } from "./levels";

export type CompanionLine = { id: string; kind: "tip" | "observation" | "handbook"; text: string; source?: string };

const handbook = {
  overview: "https://handbook.raidguild.org/docs/overview/what-is-raidguild",
  roles: "https://handbook.raidguild.org/docs/membership/skills-roles",
  conduct: "https://handbook.raidguild.org/docs/overview/code-of-conduct",
  raiding: "https://handbook.raidguild.org/docs/raids/intro-to-raiding",
  joining: "https://handbook.raidguild.org/docs/membership/join-the-guild",
  prism: "https://handbook.raidguild.org/docs/agents/prism",
} as const;

const common: Record<CompanionId, CompanionLine[]> = {
  keeper: [
    { id: "keeper-open", kind: "handbook", text: "Open source is a Guild value. Leave something the next party can build on.", source: handbook.overview },
    { id: "keeper-tavern", kind: "handbook", text: "Tavern Keepers tend the Guild community. Not all maintenance needs a wrench.", source: handbook.roles },
    { id: "keeper-trouble", kind: "handbook", text: "Keep your party informed when trouble appears. Nobody likes a surprise leak.", source: handbook.conduct },
    { id: "keeper-machine", kind: "observation", text: "Machines complain before they quit. Worth listening." },
    { id: "keeper-water", kind: "observation", text: "The water knows where to go once the channels are open." },
  ],
  wayfinder: [
    { id: "wayfinder-party", kind: "handbook", text: "A Raid party forms around a problem. Different skills travel together.", source: handbook.raiding },
    { id: "wayfinder-portal", kind: "handbook", text: "Portal holds profiles and cohort interest. Discord is the live community space.", source: handbook.joining },
    { id: "wayfinder-clerics", kind: "handbook", text: "Clerics help manage client relationships on a Raid.", source: handbook.raiding },
    { id: "wayfinder-breather", kind: "observation", text: "Even walkers need a breather." },
    { id: "wayfinder-wind", kind: "observation", text: "Watch the pennants. They tell you what the wind is doing." },
  ],
  gatewright: [
    { id: "gatewright-monks", kind: "handbook", text: "Guild Monks coordinate delivery and keep milestones visible.", source: handbook.raiding },
    { id: "gatewright-wizards", kind: "handbook", text: "Wizards work with smart contracts. Their tools look different from my winch.", source: handbook.roles },
    { id: "gatewright-paladins", kind: "handbook", text: "Paladins build backend systems. Plenty of important work stays out of sight.", source: handbook.roles },
    { id: "gatewright-weight", kind: "observation", text: "Every counterweight has another side." },
    { id: "gatewright-bridge", kind: "observation", text: "A bridge is only as useful as its next crossing." },
  ],
  towncrier: [
    { id: "crier-ledger", kind: "observation", text: "The market received its crates, but the castle-bound copies disagree." },
    { id: "crier-route", kind: "observation", text: "A courier checks the exit before sending a crate downhill." },
    { id: "crier-call", kind: "tip", text: "Gather twelve pennants and I will rally two vertical Jets. They can clear a path beneath cargo." },
  ],
  fieldkeeper: [
    { id: "fieldkeeper-druids", kind: "handbook", text: "Druids work with research and data analysis. That suits my seed ledgers.", source: handbook.roles },
    { id: "fieldkeeper-rangers", kind: "handbook", text: "Rangers specialize in user experience and usability testing.", source: handbook.roles },
    { id: "fieldkeeper-raida", kind: "handbook", text: "Queen Raida helps preserve Guild knowledge. People still make the judgments.", source: handbook.prism },
    { id: "fieldkeeper-seeds", kind: "observation", text: "Seeds don't read promises. They need water." },
    { id: "fieldkeeper-ledger", kind: "observation", text: "A good ledger tells you where to look next." },
  ],
};

const companionForRegion: Record<Region, CompanionId> = { oasis: "keeper", caravan: "wayfinder", gatehouse: "gatewright", farmland: "fieldkeeper", town: "towncrier" };
const symbolName = { water: "water", gear: "gears", leaf: "reeds", pennant: "pennants", key: "keys" } as const;

export function eligibleCompanionLines(region: Region, pendingLevel: LevelId | null): CompanionLine[] {
  const companion = companionForRegion[region];
  const lines = common[companion];
  const candidate = pendingLevel ? LEVELS[pendingLevel] : null;
  const level = candidate && (candidate.chapter ?? "oasis") === region ? candidate : null;
  if (!level) return [...lines];
  const tips: CompanionLine[] = [];
  const charge = symbolName[level.chargeSymbol ?? "leaf"];
  const grant = level.grantedPower === "flywheels" ? "Flywheels" : level.grantedPower === "prism" ? "Prism" : "Jets";
  tips.push({ id: `${companion}-charge-${level.keeperTarget ?? 9}-${charge}-${grant}`, kind: "tip", text: `Clear ${level.keeperTarget ?? 9} ${charge} to call in ${level.grantCount ?? 2} ${grant}. The meter starts again after each charge.` });
  tips.push({ id: `${companion}-goal-${level.id}`, kind: "tip", text: `Next stop: ${level.title.toLowerCase()}. Check the goals before making your first move.` });
  if (level.lesson === "jet" || level.lesson === "flywheel" || level.lesson === "prism" || level.lesson === "combo" || level.lesson === "practice") {
    tips.push({ id: `${companion}-jet`, kind: "tip", text: "Four in a line makes a Jet. Its arrow shows the direction it will fire." });
  }
  if (level.lesson !== "jet") tips.push({ id: `${companion}-flywheel`, kind: "tip", text: "An L or T match makes a Flywheel. It clears a 3×3 patch." });
  if (level.lesson === "prism" || level.lesson === "combo" || level.lesson === "practice" && level.id !== "primePump") {
    tips.push({ id: `${companion}-prism`, kind: "tip", text: "Five in a line makes a Prism. Swap it with a symbol to clear that symbol." });
  }
  if (level.crust?.length) tips.push({ id: `${companion}-salt`, kind: "tip", text: "Match beside salt to crack it. Jets and Flywheels must hit it directly." });
  if (level.crates?.length) tips.push({ id: `${companion}-crates`, kind: "tip", text: "Crates fall into cleared gaps and deliver when they leave a bottom edge. Powers cannot destroy them." });
  if (level.seedpods?.length) tips.push({ id: `${companion}-pods`, kind: "tip", text: "Seedpods fall but won't swap. Crack each one twice with nearby matches." });
  if (level.boardShape) tips.push({ id: `${companion}-shape`, kind: "tip", text: "This board has narrow spaces. Watch where new tiles can fall." });
  const mixed: CompanionLine[] = [];
  const length = Math.max(tips.length, lines.length);
  for (let index = 0; index < length; index++) {
    if (tips[index]) mixed.push(tips[index]);
    if (lines[index]) mixed.push(lines[index]);
  }
  return mixed;
}

export function selectCompanionLine(region: Region, pendingLevel: LevelId | null, visitIndex: number, previousId?: string): CompanionLine {
  const lines = eligibleCompanionLines(region, pendingLevel);
  const index = Math.max(0, visitIndex) % lines.length;
  return lines[index].id === previousId ? lines[(index + 1) % lines.length] : lines[index];
}
