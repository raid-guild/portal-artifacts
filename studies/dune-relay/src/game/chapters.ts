import { assetUrl } from "./assetUrl";
import type { CompanionId } from "./save";
export type ChapterId = "oasis" | "caravan" | "gatehouse" | "farmland" | "town";
export const CHAPTERS = {
  oasis: { title: "The Oasis", endpoint: "openWaterway", image: assetUrl("/oasis.webp"), companion: "keeper", chargeSymbol: "leaf", grant: { kind: "jet", count: 2 } },
  caravan: { title: "The Open Desert", endpoint: "lightTheRoute", image: assetUrl("/caravan.webp"), companion: "wayfinder", chargeSymbol: "pennant", grant: { kind: "flywheel", count: 2 } },
  gatehouse: { title: "The River Gatehouse", endpoint: "openTheCrossing", image: assetUrl("/gatehouse.webp"), companion: "gatewright", chargeSymbol: "key", grant: { kind: "prism", count: 1 } },
  town: { title: "Town on the Hill", endpoint: "openTheMarket", image: assetUrl("/town.webp"), companion: "towncrier", chargeSymbol: "pennant", grant: { kind: "jet", count: 2 } },
  farmland: { title: "The Seed Ledger", endpoint: "openTheHarvestRoad", image: assetUrl("/farmland.webp"), companion: "fieldkeeper", chargeSymbol: "leaf", grant: { kind: "flywheel", count: 2 } },
} as const;
export const COMPANIONS: Record<CompanionId, { name: string; portrait: string; biography: string; symbol: string; power: string; chapter: ChapterId }> = {
  keeper: { name: "The Keeper", portrait: assetUrl("/sprites/keeper-avatar.png"), biography: "The pump's engineer knows the old relay network. He joins the water caravan when the Oasis can tend its own machines.", symbol: "Reed seals", power: "Charge reeds to send two Pressure Jets", chapter: "oasis" },
  wayfinder: { name: "The Wayfinder", portrait: assetUrl("/sprites/wayfinder-avatar.png"), biography: "Navigator of the walker caravan. She reads the wind pennants and guides travelers between buried beacons.", symbol: "Wind pennants", power: "Two Flywheels every nine pennants", chapter: "caravan" },
  gatewright: { name: "The Gatewright", portrait: assetUrl("/sprites/gatewright-avatar.png"), biography: "Engineer of the river crossing. She tends the counterweights and keeps the bridge open to the farmland.", symbol: "Violet keys", power: "One Prism every nine keys", chapter: "gatehouse" },
  towncrier: { name: "The Town Crier", portrait: assetUrl("/sprites/towncrier-avatar.png"), biography: "A blue-feathered Bard courier who keeps the market routes and contradictory delivery ledgers. He joins the party to trace the missing castle shipments.", symbol: "Route pennants", power: "Rally Call: two vertical Jets every twelve pennants", chapter: "town" },
  fieldkeeper: { name: "The Fieldkeeper", portrait: assetUrl("/sprites/fieldkeeper-avatar.png"), biography: "A stocky leafy Druid farmer who reads harvest patterns, water levels, and missing deliveries. He joins the raid to find where the supply records diverged.", symbol: "Reed seals", power: "Harvest Rhythm: two Flywheels every twelve reeds", chapter: "farmland" },
};
