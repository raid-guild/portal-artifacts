import type { Cell, Goals, SymbolKind } from "./core";

export const LEVEL_ORDER = ["pumpHouse", "primePump", "prismTower", "oasisRelay", "palmIntake", "irrigationChannels", "twinTanks", "pressureManifold", "aqueductRise", "openWaterway", "caravanPennants", "pennantLine", "walkersFoot", "caravanLaunch", "saltSealedIntake", "cisternFlush", "saltwindCrossing", "twinReservoirs", "beaconAscent", "lightTheRoute", "gatehouseApproach", "gatewrightWorkshop", "signalBalcony", "bridgeControls", "saltboundHinges", "riverSluice", "counterweightRoom", "pairedWinches", "gatehouseCrown", "openTheCrossing", "seedStore", "threshingYard", "irrigationBeds", "terraceChannels", "saltedFurrows", "pairedGranaries", "sluiceGarden", "harvestTerraces", "convoyStores", "openTheHarvestRoad", "marketArrival", "courierSteps", "terraceDeliveries", "splitMarket", "saltedStorefronts", "awningLanes", "seedExchange", "neighborhoodRounds", "townLedger", "openTheMarket", "castleReceivingDock", "provisionStores", "saltboundStorehouse", "castleSeedVault", "dividedCourtyard", "terraceDispatch", "contradictoryOrders", "reservoirLedger", "reservoirControls", "openTheUpstreamRoute"] as const;
export type LevelId = (typeof LEVEL_ORDER)[number];
export type LevelDefinition = {
  id: LevelId;
  title: string;
  seed: number;
  moves: number;
  goals: Goals;
  chapter?: "oasis" | "caravan" | "gatehouse" | "farmland" | "town" | "castle";
  symbols?: SymbolKind[];
  chargeSymbol?: SymbolKind;
  grantedPower?: "jets" | "flywheels" | "prism";
  grantCount?: number;
  grantedJetDirection?: "row" | "column";
  lesson: "jet" | "flywheel" | "prism" | "combo" | "practice" | "pennant" | "key" | "crust" | "seedpod" | "crate";
  opening?: [Cell, Cell];
  boardShape?: "clippedCorners" | "twinChambers" | "steppedBasin";
  keeperTarget?: number;
  destination: keyof typeof MAP_DESTINATIONS;
  crust?: { row: number; col: number; hp?: number }[];
  seedpods?: { row: number; col: number; hp?: number }[];
  crates?: Cell[];
  briefing: string;
  victoryEyebrow: string;
  victoryTitle: string;
  victoryMessage: string;
};

// A local, playable experiment may use the same board rules without becoming a
// campaign level (or acquiring a save ID and cloud entitlement).
export type PlayableLevelDefinition = Omit<LevelDefinition, "id" | "lesson" | "destination"> & {
  id: string;
  lesson: LevelDefinition["lesson"] | "current";
  destination?: LevelDefinition["destination"];
  current?: Cell[];
};

export const LEVELS: Record<LevelId, LevelDefinition> = {
  pumpHouse: {
    id: "pumpHouse", title: "PUMP HOUSE", seed: 1337, moves: 24, lesson: "jet", destination: "pumpHouse",
    goals: { water: 36, leaf: 36 },
    briefing: "The intake is dry. Match the water canteens and reed seals to wake the pump. Line up four to make a Pressure Jet. Clear nine reeds and I'll send two more Jets into the board.",
    victoryEyebrow: "PUMP HOUSE RESTORED", victoryTitle: "Water for the oasis!",
    victoryMessage: "The intake is open. Follow the canal to the flywheel station.",
  },
  primePump: {
    id: "primePump", title: "FLYWHEEL STATION", seed: 2718, moves: 25, lesson: "flywheel", destination: "pumpHouse",
    goals: { water: 40, leaf: 40 },
    briefing: "The flywheel is jammed. Match an L or T to build a spinning gear. Fire it to clear a 3×3 patch. Pressure Jets still charge every nine reeds.",
    victoryEyebrow: "FLYWHEEL SPINNING", victoryTitle: "The pressure is rising!",
    victoryMessage: "The flywheel turns. A prism at the light tower can guide the water onward.",
  },
  prismTower: {
    id: "prismTower", title: "PRISM TOWER", seed: 5271, moves: 26, lesson: "prism", destination: "pumpHouse",
    goals: { water: 44, leaf: 44 },
    briefing: "The tower needs light. Line up five symbols to make a Prism. Swap it with a symbol to send rainbow beams to every matching tile. Double tap to choose the most common symbol.",
    victoryEyebrow: "PRISM LIT", victoryTitle: "Light across the oasis!",
    victoryMessage: "The beams reach the final relay. Bring the new powers together.",
  },
  oasisRelay: {
    id: "oasisRelay", title: "OASIS RELAY", seed: 8017, moves: 27, lesson: "combo", destination: "pumpHouse",
    goals: { water: 48, leaf: 48 },
    briefing: "The relay is ready. Combine Jets for a cross, or spin a Flywheel with a Jet for three rows and columns. Pair a Prism with a Jet or Flywheel to turn every tile of that power's original symbol into copies, then fire them all.",
    victoryEyebrow: "OASIS RELAY RESTORED", victoryTitle: "The oasis is alive!",
    victoryMessage: "The relay is running. Follow the water left toward the Palm Intake.",
  },
  palmIntake: {
    id: "palmIntake", title: "PALM INTAKE", seed: 4319, moves: 22, lesson: "practice", destination: "palmIntake", boardShape: "clippedCorners",
    goals: { water: 48, leaf: 48 },
    briefing: "The palms need a wider flow. This intake has clipped corners; use the powers you know to collect water and reeds across the new shape.",
    victoryEyebrow: "PALM INTAKE OPEN", victoryTitle: "Water reaches the palms!",
    victoryMessage: "The nearby irrigation channels still need pressure.",
  },
  irrigationChannels: {
    id: "irrigationChannels", title: "IRRIGATION CHANNELS", seed: 6127, moves: 23, lesson: "practice", destination: "irrigationChannels", boardShape: "clippedCorners",
    goals: { water: 56, leaf: 52 },
    briefing: "The channels stretch farther than the intake. Work the same shaped board, build your own powers, and send water and reeds toward the fields.",
    victoryEyebrow: "CHANNELS FLOWING", victoryTitle: "The fields can drink!",
    victoryMessage: "The tanks beyond the channels need a stronger flow.",
  },
  twinTanks: {
    id: "twinTanks", title: "TWIN TANKS", seed: 7431, moves: 25, lesson: "practice", destination: "twinTanks", boardShape: "twinChambers",
    goals: { water: 56, leaf: 52 },
    briefing: "Two tank chambers meet at a narrow bridge. Place your Jets, Flywheels, and Prisms where they can reach both sides.",
    victoryEyebrow: "TWIN TANKS FILLED", victoryTitle: "The tanks are filling!",
    victoryMessage: "The pressure manifold is ready for the next flow.",
  },
  pressureManifold: {
    id: "pressureManifold", title: "PRESSURE MANIFOLD", seed: 8819, moves: 27, lesson: "practice", destination: "pressureManifold", boardShape: "twinChambers", keeperTarget: 12,
    goals: { water: 56, leaf: 52 },
    briefing: "The larger network needs more pressure. Clear twelve reeds to call in two Jets. Use the same bridged chambers and build your own combinations.",
    victoryEyebrow: "MANIFOLD PRESSURIZED", victoryTitle: "The pipes are singing!",
    victoryMessage: "The aqueduct is ready to carry water uphill.",
  },
  aqueductRise: {
    id: "aqueductRise", title: "AQUEDUCT RISE", seed: 9157, moves: 27, lesson: "practice", destination: "aqueductRise", boardShape: "steppedBasin", keeperTarget: 12,
    goals: { water: 71, leaf: 67 },
    briefing: "The aqueduct rises in steps. Its narrow upper rows open into a broad basin below. Aim your powers where they can reach the most tiles.",
    victoryEyebrow: "AQUEDUCT RISING", victoryTitle: "Water climbs the arches!",
    victoryMessage: "One final outlet will open the waterway across the oasis.",
  },
  openWaterway: {
    id: "openWaterway", title: "OPEN THE WATERWAY", seed: 10429, moves: 27, lesson: "practice", destination: "openWaterway", boardShape: "steppedBasin", keeperTarget: 12,
    goals: { water: 98, leaf: 90 },
    briefing: "The last outlet needs a full surge. Use every power and combination you learned to open the waterway.",
    victoryEyebrow: "OASIS RESTORED", victoryTitle: "The waterway is open!",
    victoryMessage: "The Oasis chapter is complete. The road across the kingdom now awaits the raid party.",
  },
  caravanPennants: {
    id: "caravanPennants", title: "WINDWARD TRAIL", seed: 17761, moves: 28, lesson: "pennant", destination: "caravanPennants", chapter: "caravan",
    symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    goals: { water: 24, leaf: 0, pennant: 18 },
    briefing: "The route pennants have blown free. Match three coral pennants to mark the safe path. Every nine pennants gives the Wayfinder enough tailwind to send two Flywheels onto the board.",
    victoryEyebrow: "WINDWARD TRAIL MARKED", victoryTitle: "The caravan can move!",
    victoryMessage: "The route beacon waits beyond the next dune.",
  },
  pennantLine: { id: "pennantLine", title: "PENNANT LINE", seed: 18331, moves: 25, lesson: "practice", destination: "pennantLine", chapter: "caravan", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    goals: { water: 36, leaf: 0, pennant: 30 }, briefing: "The wind has scattered the markers. Gather water and pennants to carry the line across the dunes.", victoryEyebrow: "LINE SECURED", victoryTitle: "The pennants hold!", victoryMessage: "The walker can find firm footing ahead." },
  walkersFoot: { id: "walkersFoot", title: "WALKER'S FOOT", seed: 19441, moves: 26, lesson: "practice", destination: "walkersFoot", chapter: "caravan", boardShape: "clippedCorners", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    goals: { water: 42, leaf: 0, pennant: 33 }, briefing: "The walker's foot presses into uneven sand. Work around the clipped corners and keep the pennants flying.", victoryEyebrow: "FOOTING FOUND", victoryTitle: "The walker advances!", victoryMessage: "The launch trail rises beyond the ridge." },
  caravanLaunch: { id: "caravanLaunch", title: "CARAVAN LAUNCH", seed: 20719, moves: 25, lesson: "practice", destination: "caravanLaunch", chapter: "caravan", boardShape: "clippedCorners", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    goals: { water: 42, leaf: 0, pennant: 30 }, briefing: "The caravan is moving. Send water to its tanks and enough pennants to keep everyone on course.", victoryEyebrow: "CARAVAN LAUNCHED", victoryTitle: "Into the open desert!", victoryMessage: "A pale salt crust blocks the next intake." },
  saltSealedIntake: { id: "saltSealedIntake", title: "SALT-SEALED INTAKE", seed: 21841, moves: 28, lesson: "crust", destination: "saltSealedIntake", chapter: "caravan", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[1,[3,5]],[2,[2,6]],[3,[2,6]],[4,[2,6]],[5,[2,6]],[6,[3,5]]]), goals: { water: 0, leaf: 0, pennant: 18, crust: 12 }, briefing: "Salt has sealed the intake. Normal matches and Prism-cleared symbols crack nearby crust. Jets and Flywheels must hit it directly. Break every salt block and gather eighteen pennants.", victoryEyebrow: "INTAKE UNSEALED", victoryTitle: "The crust gives way!", victoryMessage: "The cistern can be flushed clean." },
  cisternFlush: { id: "cisternFlush", title: "CISTERN FLUSH", seed: 22903, moves: 25, lesson: "practice", destination: "cisternFlush", chapter: "caravan", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[1,[1,4,7]],[2,[2,5,8]],[3,[1,4,7]],[5,[1,4,7]],[6,[2,5,8]],[7,[1,4,7]]]), goals: { water: 30, leaf: 0, pennant: 0, crust: 18 }, briefing: "Clear the salt from the cistern and collect water for the long crossing.", victoryEyebrow: "CISTERN FLUSHED", victoryTitle: "Fresh water aboard!", victoryMessage: "A saltwind blows across the trail." },
  saltwindCrossing: { id: "saltwindCrossing", title: "SALTWIND CROSSING", seed: 23771, moves: 25, lesson: "practice", destination: "saltwindCrossing", chapter: "caravan", boardShape: "clippedCorners", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[1,[1,3,5,7]],[2,[2,6]],[3,[1,3,5,7]],[4,[2,6]],[5,[1,3,5,7]],[6,[2,6]],[7,[1,3,5,7]]]), goals: { water: 0, leaf: 0, pennant: 27, crust: 22 }, briefing: "The crossing narrows at its corners. Break salt along the trail and keep twenty-seven pennants visible through the wind.", victoryEyebrow: "CROSSING CLEARED", victoryTitle: "The caravan passes!", victoryMessage: "Two reservoirs lie ahead." },
  twinReservoirs: { id: "twinReservoirs", title: "TWIN RESERVOIRS", seed: 24889, moves: 29, lesson: "practice", destination: "twinReservoirs", chapter: "caravan", boardShape: "twinChambers", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[0,[1,7]],[1,[1,7]],[2,[1,7]],[3,[1,4,5,7]],[4,[1,4,5,7]],[5,[1,4,5,7]],[6,[1,7]],[7,[1,7]],[8,[1,7]]]), goals: { water: 36, leaf: 0, pennant: 0, crust: 24 }, briefing: "The paired reservoirs meet through a narrow bridge. Break the salt in both chambers and fill the water tanks.", victoryEyebrow: "RESERVOIRS OPEN", victoryTitle: "Both tanks are flowing!", victoryMessage: "The route beacon rises above the dunes." },
  beaconAscent: { id: "beaconAscent", title: "BEACON ASCENT", seed: 25991, moves: 29, lesson: "practice", destination: "beaconAscent", chapter: "caravan", boardShape: "steppedBasin", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[0,[3,5]],[1,[3,5]],[2,[2,4,6]],[3,[2,4,6]],[4,[1,3,5,7]],[5,[1,3,5,7]],[6,[1,3,5,7]],[7,[2,5,7]],[8,[2,5,7]]]), goals: { water: 0, leaf: 0, pennant: 30, crust: 28 }, briefing: "Follow the stepped ascent to the beacon. Break the salt and fly thirty route pennants along its height.", victoryEyebrow: "ASCENT OPEN", victoryTitle: "The beacon is in reach!", victoryMessage: "One last surge can light the route." },
  lightTheRoute: { id: "lightTheRoute", title: "LIGHT THE ROUTE", seed: 27109, moves: 30, lesson: "practice", destination: "lightTheRoute", chapter: "caravan", boardShape: "steppedBasin", symbols: ["water", "gear", "leaf", "pennant"], chargeSymbol: "pennant", grantedPower: "flywheels", keeperTarget: 9,
    crust: saltCells([[0,[3,5]],[1,[3,5]],[2,[2,4,6]],[3,[2,4,6]],[4,[1,3,5,7]],[5,[1,3,5,7]],[6,[1,3,5,7]],[7,[0,2,5,7,8]],[8,[0,2,5,7,8]]]), goals: { water: 42, leaf: 0, pennant: 0, crust: 32 }, briefing: "The route is nearly ours. Clear every salt block and bring forty-two water canteens to the beacon.", victoryEyebrow: "ROUTE BEACON LIT", victoryTitle: "The desert road shines!", victoryMessage: "The Open Desert chapter is complete. From here, the kingdom's next roads can be charted." },
  gatehouseApproach: gatehouseLevel("gatehouseApproach", "GATEHOUSE APPROACH", 30119, 22, { water: 24, leaf: 0, key: 18 }, "key", "gatehouseApproach", "The Gatewright's violet keys fit the old lock. Match three keys to wake the gate; every nine keys lets me place one Prism on the board."),
  gatewrightWorkshop: gatehouseLevel("gatewrightWorkshop", "GATEWRIGHT'S WORKSHOP", 31213, 23, { water: 0, leaf: 0, key: 24, pennant: 24 }, "practice", "gatewrightWorkshop", "Collect keys to charge my Prism. It waits on the board until you swap or double-tap it."),
  signalBalcony: gatehouseLevel("signalBalcony", "SIGNAL BALCONY", 32303, 27, { water: 30, leaf: 0, key: 27 }, "practice", "signalBalcony", "Five symbols now cross the signal balcony. Swap a Prism with a symbol to clear that symbol across the board.", "clippedCorners"),
  bridgeControls: gatehouseLevel("bridgeControls", "BRIDGE CONTROLS", 33409, 30, { water: 36, leaf: 0, key: 30 }, "practice", "bridgeControls", "The controls spread across two corners. Build and combine the familiar powers to keep the bridge moving.", "clippedCorners"),
  saltboundHinges: gatehouseLevel("saltboundHinges", "SALTBOUND HINGES", 34511, 25, { water: 0, leaf: 0, key: 24, crust: 8 }, "crust", "saltboundHinges", "Thick salt takes two hits. Match beside it, clear a neighboring symbol with a Prism, or hit it directly with a Jet or Flywheel. A cracked block needs one more hit; the salt goal counts blocks broken.", undefined, layeredSalt([[1,[2,6]],[2,[2,6]],[6,[2,6]],[7,[2,6]]], [[1,6],[2,6],[6,2],[7,6]])),
  riverSluice: gatehouseLevel("riverSluice", "RIVER SLUICE", 35617, 26, { water: 36, leaf: 0, key: 0, crust: 12 }, "practice", "riverSluice", "Clear the sluice's layered salt and collect water for the gate's channels.", undefined, layeredSalt([[1,[1,4,7]],[2,[2,6]],[4,[1,7]],[6,[2,6]],[7,[1,4,7]]], [[1,1],[1,7],[2,6],[6,2],[7,1],[7,7]])),
  counterweightRoom: gatehouseLevel("counterweightRoom", "COUNTERWEIGHT ROOM", 36721, 32, { water: 0, leaf: 0, key: 30, crust: 14 }, "practice", "counterweightRoom", "Aim Jets through the salt to free the counterweights. A Prism can also crack salt beside the symbols it clears.", "clippedCorners", layeredSalt([[1,[1,3,5,7]],[2,[2,6]],[4,[1,7]],[6,[2,6]],[7,[1,3,5,7]]], [[1,1],[1,5],[2,6],[4,1],[4,7],[6,2],[7,3],[7,7]])),
  pairedWinches: gatehouseLevel("pairedWinches", "PAIRED WINCHES", 37831, 33, { water: 36, leaf: 0, key: 0, crust: 16 }, "practice", "pairedWinches", "Two winches share a narrow passage. Flywheel combinations can strike the salt across both chambers.", "twinChambers", layeredSalt([[0,[1,7]],[1,[1,7]],[2,[1,7]],[3,[1,7]],[4,[1,7]],[5,[1,7]],[6,[1,7]],[7,[1,7]]], [[0,1],[1,7],[2,1],[3,7],[4,1],[5,7],[6,1],[7,7]])),
  gatehouseCrown: gatehouseLevel("gatehouseCrown", "GATEHOUSE CROWN", 38933, 33, { water: 0, leaf: 0, key: 36, crust: 18 }, "practice", "gatehouseCrown", "Climb the stepped crown. Break the salt and gather the keys that lift the gate.", "steppedBasin", layeredSalt([[0,[3,5]],[1,[3,5]],[2,[2,6]],[3,[2,6]],[4,[1,7]],[5,[1,7]],[6,[1,7]],[7,[1,7]],[8,[2,6]]], [[0,3],[1,5],[2,2],[2,6],[3,2],[4,7],[5,1],[6,7],[7,1],[8,6]])),
  openTheCrossing: gatehouseLevel("openTheCrossing", "OPEN THE CROSSING", 40127, 34, { water: 48, leaf: 0, key: 0, crust: 20 }, "practice", "openTheCrossing", "The crossing is close. Clear every saltbound control and send water through the gatehouse to open the bridge.", "steppedBasin", layeredSalt([[0,[3,5]],[1,[3,5]],[2,[2,4,6]],[3,[2,4,6]],[4,[1,7]],[5,[1,7]],[6,[1,7]],[7,[1,7]],[8,[0,8]]], [[0,3],[1,5],[2,2],[2,6],[3,4],[3,6],[4,1],[5,7],[6,1],[7,7],[8,0],[8,8]])),
  seedStore: farmlandLevel("seedStore", "SEED STORE", 41131, 24, 4, 24, 0, "seedpod", "seedStore", "The sealed stores have waited through the drought. Match beside each bronze-bound pod twice to open it. Pods fall, but cannot be swapped."),
  threshingYard: farmlandLevel("threshingYard", "THRESHING YARD", 42221, 26, 6, 0, 24, "practice", "threshingYard", "The pods tumble with the harvest. Follow their fall, then match beside them again. Twelve reeds call two Flywheels from the Fieldkeeper."),
  irrigationBeds: farmlandLevel("irrigationBeds", "IRRIGATION BEDS", 43313, 29, 8, 30, 0, "practice", "irrigationBeds", "A Flywheel can strike pods directly. Its nine tiles count as one hit per pod, so look for a second opening.", "clippedCorners"),
  terraceChannels: farmlandLevel("terraceChannels", "TERRACE CHANNELS", 44417, 30, 8, 36, 0, "practice", "terraceChannels", "Send Jets across the channels. A beam cracks any pod it touches, wherever the pod has fallen.", "steppedBasin"),
  saltedFurrows: farmlandLevel("saltedFurrows", "SALTED FURROWS", 45521, 30, 8, 30, 0, "practice", "saltedFurrows", "Clear the old salt and open the seedpods together. Normal matches crack both nearby; Jets and Flywheels need direct hits.", undefined, [[1,[1,7]],[3,[1,7]]] ),
  pairedGranaries: farmlandLevel("pairedGranaries", "PAIRED GRANARIES", 46633, 33, 8, 24, 0, "practice", "pairedGranaries", "The granaries share a narrow passage. Keep matches available on both sides as the pods fall.", "twinChambers", [[1,[1,7]],[4,[1,7]]] ),
  sluiceGarden: farmlandLevel("sluiceGarden", "SLUICE GARDEN", 47731, 24, 10, 36, 0, "practice", "sluiceGarden", "The water gardens have layered salt around the pods. Direct your powers at the seals and nearby symbols.", "clippedCorners", [[1,[2,6]],[3,[2,6]],[5,[2,6]],[7,[2,6]]], [[1,2],[5,6]] ),
  harvestTerraces: farmlandLevel("harvestTerraces", "HARVEST TERRACES", 48859, 32, 12, 36, 0, "practice", "harvestTerraces", "The terraces grow wider toward the road. Let falling pods reach clear match lanes before striking.", "steppedBasin", [[2,[2,6]],[4,[1,7]],[6,[1,7]],[8,[1,7]]], [[2,2],[6,7]] ),
  convoyStores: farmlandLevel("convoyStores", "CONVOY STORES", 49937, 32, 12, 30, 0, "practice", "convoyStores", "The convoy waits for both stores. Combine powers to open the remaining pods and clear the salt.", "twinChambers", [[1,[1,7]],[3,[1,7]],[5,[1,7]],[7,[1,7]]], [[1,1],[3,7],[5,1],[7,7]] ),
  openTheHarvestRoad: farmlandLevel("openTheHarvestRoad", "OPEN THE HARVEST ROAD", 51047, 34, 12, 48, 0, "practice", "openTheHarvestRoad", "One last surge will open the seed stores and load the harvest convoy. The Fieldkeeper's ledger points beyond the fields.", "clippedCorners", [[0,[2,6]],[2,[1,7]],[4,[1,7]],[6,[1,7]],[8,[2,6]],[3,[3,5]]], [[0,2],[2,7],[4,1],[6,7],[8,6]] ),
  marketArrival: townLevel("marketArrival", "MARKET ARRIVAL", 52153, 22, 1, "crate", "marketArrival", "The first cargo box waits above the market. Clear tiles beneath it and let it fall off any bottom edge to deliver it."),
  courierSteps: townLevel("courierSteps", "COURIER STEPS", 53267, 24, 2, "practice", "courierSteps", "Two deliveries are waiting. Open a path below each crate; a power can clear tiles but cannot break the cargo."),
  terraceDeliveries: townLevel("terraceDeliveries", "TERRACE DELIVERIES", 54371, 25, 3, "practice", "terraceDeliveries", "The clipped terraces have several bottom edges. Deliver three crates from the upper market.", "clippedCorners"),
  splitMarket: townLevel("splitMarket", "SPLIT MARKET", 55489, 26, 4, "practice", "splitMarket", "Two stalls share a narrow crossing. Move cargo down either side to the open exits.", "twinChambers"),
  saltedStorefronts: townLevel("saltedStorefronts", "SALTED STOREFRONTS", 56591, 27, 4, "practice", "saltedStorefronts", "Salt slows the loading line. Break the crust to open a route for the crates.", undefined, 6),
  awningLanes: townLevel("awningLanes", "AWNING LANES", 57709, 28, 5, "practice", "awningLanes", "The market broadens below the awnings. Crates leave at each open lower edge; two salt blocks need two hits.", "steppedBasin", 8, 0, 2),
  seedExchange: townLevel("seedExchange", "SEED EXCHANGE", 58831, 28, 5, "practice", "seedExchange", "Open the seedpods while the cargo descends; pods and crates both fall but only crates leave at the market exit.", "clippedCorners", 0, 4),
  neighborhoodRounds: townLevel("neighborhoodRounds", "NEIGHBORHOOD ROUNDS", 59921, 30, 6, "practice", "neighborhoodRounds", "Deliver six crates, open the seedpods, and clear the salt. Gather pennants to call the Crier's vertical Jets.", "twinChambers", 6, 4, 0, 24),
  townLedger: townLevel("townLedger", "TOWN LEDGER", 61031, 30, 6, "practice", "townLedger", "The records disagree. Clear the layered salt, open the seedpods, and send the cargo to every available exit.", "steppedBasin", 8, 6, 2, 0, 30),
  openTheMarket: townLevel("openTheMarket", "OPEN THE MARKET", 62143, 32, 7, "practice", "openTheMarket", "The market opens at sunset. Deliver seven crates and clear the last seals while the Crier checks the castle-bound ledger.", "clippedCorners", 10, 6, 4, 36),
  castleReceivingDock: castleLevel("castleReceivingDock", "RECEIVING DOCK", 63247, 24, 2, 0, 0, 0, 24, 0, "The quartermaster checks the incoming manifest. Deliver the first two crates and collect water for the castle cistern."),
  provisionStores: castleLevel("provisionStores", "PROVISION STORES", 64373, 25, 3, 0, 0, 0, 0, 24, "The castle's provision list does not agree with the town's. Move three crates through the storehouse.", "clippedCorners"),
  saltboundStorehouse: castleLevel("saltboundStorehouse", "SALTBOUND STOREHOUSE", 65479, 27, 3, 8, 0, 0, 0, 0, "Old salt seals the loading lanes. Clear it and get the cargo to the lower exits."),
  castleSeedVault: castleLevel("castleSeedVault", "SEED VAULT", 66587, 28, 4, 0, 6, 0, 24, 0, "Open the seed vault while the crates descend; the water ledger is still short.", "clippedCorners"),
  dividedCourtyard: castleLevel("dividedCourtyard", "DIVIDED COURTYARD", 67691, 29, 5, 8, 0, 0, 0, 0, "Two courtyard lanes lead to separate exits. Keep both sides moving.", "twinChambers"),
  terraceDispatch: castleLevel("terraceDispatch", "TERRACE DISPATCH", 68797, 29, 5, 0, 6, 0, 0, 0, "The terraces are ready for dispatch. Break the pods as you deliver the cargo.", "steppedBasin", 24),
  contradictoryOrders: castleLevel("contradictoryOrders", "CONTRADICTORY ORDERS", 69911, 30, 5, 6, 4, 2, 0, 0, "Two ledgers name different destinations. Open the seals and deliver the five crates.", "clippedCorners"),
  reservoirLedger: castleLevel("reservoirLedger", "RESERVOIR LEDGER", 71023, 30, 6, 0, 8, 0, 36, 0, "The reservoir account is short. Bring water while the last stores move out.", "clippedCorners"),
  reservoirControls: castleLevel("reservoirControls", "RESERVOIR CONTROLS", 72139, 31, 6, 12, 0, 6, 0, 0, "The old controls are layered with salt. Crack them open and find the upstream route.", "steppedBasin", 0, 36),
  openTheUpstreamRoute: castleLevel("openTheUpstreamRoute", "OPEN THE UPSTREAM ROUTE", 73243, 32, 7, 10, 8, 4, 36, 0, "The castle records point upstream. Deliver the final stores and open the boat route.", "clippedCorners"),

};


function castleLevel(id: LevelId, title: string, seed: number, moves: number, crates: number, salt: number, pods: number, thick: number, water: number, leaf: number, briefing: string, shape?: LevelDefinition["boardShape"], pennant = 0, key = 0): LevelDefinition {
  const base = townLevel(id, title, seed, moves, crates, "practice", id as keyof typeof MAP_DESTINATIONS, briefing, shape, salt, pods, thick, pennant, water);
  return { ...base, chapter: "castle", goals: { ...base.goals, leaf, key }, victoryEyebrow: "CASTLE ISLAND", victoryTitle: id === "openTheUpstreamRoute" ? "The upstream route is open!" : "The manifest is coming together!", victoryMessage: id === "openTheUpstreamRoute" ? "The quartermaster has found a water route beyond the castle. A boat waits at the dock." : "Another delivery is accounted for." };
}

function townLevel(id: LevelId, title: string, seed: number, moves: number, crateCount: number, lesson: LevelDefinition["lesson"], destination: keyof typeof MAP_DESTINATIONS, briefing: string, boardShape?: LevelDefinition["boardShape"], saltCount = 0, podCount = 0, thickCount = 0, pennant = 0, water = 0): LevelDefinition {
  const mask = (row:number,col:number) => boardShape === "twinChambers" ? col <= 2 || col >= 6 || row >= 3 && row <= 5 : boardShape === "steppedBasin" ? col >= (9-(row<2?5:row<4?7:9))/2 && col < (9+(row<2?5:row<4?7:9))/2 : boardShape === "clippedCorners" ? !(row===0||row===8) || !(col===0||col===8) : true;
  const candidates: [number,number][] = [[1,1],[1,7],[1,3],[1,5],[2,2],[2,6],[2,0],[2,8],[2,3],[2,5],[1,4],[2,4],[3,1],[3,7]];
  const crates = candidates.filter(([r,c]) => mask(r,c) && mask(r+1,c)).slice(0,crateCount).map(([row,col])=>({row,col}));
  if (crates.length!==crateCount) throw new Error(`Not enough crate cells for ${id}`);
  const occupied=new Set(crates.map(({row,col})=>`${row},${col}`));
  const saltCandidates: [number,number][] = [[4,1],[4,7],[5,2],[5,6],[6,1],[6,7],[7,2],[7,6],[3,2],[3,6],[5,3],[5,5]];
  const crust=saltCandidates.filter(([r,c])=>mask(r,c)&&!occupied.has(`${r},${c}`)).slice(0,saltCount).map(([row,col],i)=>({row,col,hp:i<thickCount?2:1}));
  if(crust.length!==saltCount) throw new Error(`Not enough salt cells for ${id}`);
  crust.forEach(({row,col})=>occupied.add(`${row},${col}`));
  const podCandidates: [number,number][] = [[3,3],[3,5],[4,2],[4,6],[5,1],[5,7],[6,3],[6,5],[4,4]];
  const seedpods=podCandidates.filter(([r,c])=>mask(r,c)&&!occupied.has(`${r},${c}`)).slice(0,podCount).map(([row,col])=>({row,col,hp:2}));
  if(seedpods.length!==podCount) throw new Error(`Not enough pod cells for ${id}`);
  return { id,title,seed,moves,goals:{water,leaf:0,pennant,crate:crateCount,crust:saltCount,seedpod:podCount},lesson,destination,briefing,boardShape,crust,seedpods,crates,chapter:"town",symbols:["water","gear","leaf","pennant","key"],chargeSymbol:"pennant",grantedPower:"jets",grantedJetDirection:"column",grantCount:2,keeperTarget:12,
    victoryEyebrow:"TOWN ON THE HILL",victoryTitle:id==="openTheMarket"?"The market is open!":"A delivery reaches the market!",victoryMessage:id==="openTheMarket"?"The cargo arrived, but the castle-bound records still disagree. The Crier will follow the trail to Castle Island.":"The next neighborhood still needs its delivery." };
}

function farmlandLevel(id: LevelId, title: string, seed: number, moves: number, podCount: number, water: number, leaf: number, lesson: LevelDefinition["lesson"], destination: keyof typeof MAP_DESTINATIONS, briefing: string, boardShape?: LevelDefinition["boardShape"], saltRows: [number,number[]][] = [], thick: [number,number][] = []): LevelDefinition {
  const candidatePods = [ [1,3],[1,5],[2,1],[2,7],[3,3],[3,5],[4,2],[4,6],[5,1],[5,7],[6,3],[6,5], ...Array.from({length:81},(_,i)=>[Math.floor(i/9),i%9]) ];
  const mask = (row:number,col:number) => boardShape === "twinChambers" ? col <= 2 || col >= 6 || row >= 3 && row <= 5 : boardShape === "steppedBasin" ? col >= (9-(row<2?5:row<4?7:9))/2 && col < (9+(row<2?5:row<4?7:9))/2 : boardShape === "clippedCorners" ? !(row===0||row===8) || !(col===0||col===8) : true;
  const salt = layeredSalt(saltRows, thick);
  const occupied = new Set(salt.map(cell=>`${cell.row},${cell.col}`));
  const used = new Set<string>();
  const seedpods = candidatePods.filter(([row,col])=>{ const cell=`${row},${col}`; if (!mask(row,col) || occupied.has(cell) || used.has(cell)) return false; used.add(cell); return true; }).slice(0,podCount).map(([row,col])=>({row,col,hp:2}));
  if (seedpods.length!==podCount) throw new Error(`Not enough seedpod cells for ${id}`);
  return { id, title, seed, moves, goals:{water,leaf,seedpod:podCount,crust:salt.length}, lesson, destination, briefing, boardShape, crust:salt, seedpods, chapter:"farmland", symbols:["water","gear","leaf","pennant","key"], chargeSymbol:"leaf", grantedPower:"flywheels", grantCount:2, keeperTarget:12,
    victoryEyebrow:"FARMLAND RECOVERS", victoryTitle:id==="openTheHarvestRoad"?"The harvest road is open!":"The fields are waking!", victoryMessage:id==="openTheHarvestRoad"?"The harvest convoy is ready. The ledger says missing deliveries began farther upstream, near the town on the hill.":"The next store needs a little more water and care." };
}

function layeredSalt(rows: [number, number[]][], thick: [number, number][]) {
  const strong = new Set(thick.map(([row, col]) => `${row},${col}`));
  return saltCells(rows).map(cell => ({ ...cell, hp: strong.has(`${cell.row},${cell.col}`) ? 2 : 1 }));
}
function gatehouseLevel(id: LevelId, title: string, seed: number, moves: number, goals: Goals, lesson: LevelDefinition["lesson"], destination: keyof typeof MAP_DESTINATIONS, briefing: string, boardShape?: LevelDefinition["boardShape"], crust?: LevelDefinition["crust"]): LevelDefinition {
  return { id, title, seed, moves, goals, lesson, destination, briefing, boardShape, crust, chapter: "gatehouse", symbols: ["water", "gear", "leaf", "pennant", "key"], chargeSymbol: "key", grantedPower: "prism", grantCount: 1, keeperTarget: 9,
    victoryEyebrow: "RIVER GATEHOUSE", victoryTitle: id === "openTheCrossing" ? "The crossing is open!" : "The gate is closer!", victoryMessage: id === "openTheCrossing" ? "The River Gatehouse chapter is complete. The road into farmland is clear." : "One more control brings the bridge closer to opening." };
}

function saltCells(rows: [number, number[]][]): { row: number; col: number }[] {
  return rows.flatMap(([row, cols]) => cols.map(col => ({ row, col })));
}

export function nextLevel(completed: readonly LevelId[]): LevelId | null {
  return LEVEL_ORDER.find(id => !completed.includes(id)) ?? null;
}

export const MAP_DESTINATIONS = {
  pumpHouse: { marker: { x: 756, y: 289 }, label: { x: 730, y: 310 }, walk: { x: 700, y: 403 }, hit: { x: 756, y: 356, width: 118, height: 85 } },
  palmIntake: { marker: { x: 225, y: 365 }, label: { x: 225, y: 326 }, walk: { x: 225, y: 418 }, hit: { x: 225, y: 370, width: 100, height: 90 } },
  irrigationChannels: { marker: { x: 345, y: 385 }, label: { x: 335, y: 342 }, walk: { x: 330, y: 418 }, hit: { x: 345, y: 385, width: 90, height: 86 } },
  twinTanks: { marker: { x: 600, y: 315 }, label: { x: 600, y: 278 }, walk: { x: 600, y: 410 }, hit: { x: 600, y: 335, width: 105, height: 100 } },
  pressureManifold: { marker: { x: 895, y: 345 }, label: { x: 840, y: 305 }, walk: { x: 840, y: 420 }, hit: { x: 895, y: 360, width: 90, height: 110 } },
  aqueductRise: { marker: { x: 520, y: 280 }, label: { x: 540, y: 245 }, walk: { x: 540, y: 400 }, hit: { x: 520, y: 300, width: 105, height: 105 } },
  caravanPennants: { marker: { x: 730, y: 300 }, label: { x: 705, y: 260 }, walk: { x: 700, y: 420 }, hit: { x: 735, y: 330, width: 125, height: 100 } },
  pennantLine: { marker: { x: 345, y: 335 }, label: { x: 345, y: 285 }, walk: { x: 350, y: 430 }, hit: { x: 345, y: 350, width: 100, height: 95 } },
  walkersFoot: { marker: { x: 475, y: 365 }, label: { x: 475, y: 320 }, walk: { x: 475, y: 442 }, hit: { x: 475, y: 375, width: 100, height: 92 } },
  caravanLaunch: { marker: { x: 640, y: 320 }, label: { x: 640, y: 270 }, walk: { x: 625, y: 426 }, hit: { x: 640, y: 342, width: 100, height: 100 } },
  saltSealedIntake: { marker: { x: 240, y: 390 }, label: { x: 240, y: 345 }, walk: { x: 240, y: 440 }, hit: { x: 240, y: 390, width: 100, height: 100 } },
  cisternFlush: { marker: { x: 567, y: 330 }, label: { x: 567, y: 282 }, walk: { x: 545, y: 425 }, hit: { x: 567, y: 350, width: 100, height: 105 } },
  saltwindCrossing: { marker: { x: 390, y: 400 }, label: { x: 390, y: 355 }, walk: { x: 390, y: 455 }, hit: { x: 390, y: 400, width: 100, height: 96 } },
  twinReservoirs: { marker: { x: 745, y: 345 }, label: { x: 745, y: 300 }, walk: { x: 730, y: 435 }, hit: { x: 745, y: 365, width: 105, height: 105 } },
  beaconAscent: { marker: { x: 810, y: 340 }, label: { x: 805, y: 285 }, walk: { x: 805, y: 440 }, hit: { x: 810, y: 350, width: 100, height: 112 } },
  lightTheRoute: { marker: { x: 865, y: 345 }, label: { x: 843, y: 275 }, walk: { x: 840, y: 440 }, hit: { x: 865, y: 350, width: 90, height: 110 } },
  openWaterway: { marker: { x: 485, y: 350 }, label: { x: 555, y: 340 }, walk: { x: 500, y: 418 }, hit: { x: 485, y: 370, width: 100, height: 100 } },
  gatehouseApproach: { marker: { x: 710, y: 312 }, label: { x: 690, y: 270 }, walk: { x: 689, y: 442 }, hit: { x: 710, y: 335, width: 105, height: 115 } },
  gatewrightWorkshop: { marker: { x: 820, y: 375 }, label: { x: 820, y: 328 }, walk: { x: 810, y: 455 }, hit: { x: 820, y: 390, width: 92, height: 100 } },
  signalBalcony: { marker: { x: 575, y: 294 }, label: { x: 575, y: 248 }, walk: { x: 575, y: 432 }, hit: { x: 575, y: 312, width: 95, height: 110 } },
  bridgeControls: { marker: { x: 642, y: 377 }, label: { x: 642, y: 332 }, walk: { x: 640, y: 445 }, hit: { x: 642, y: 388, width: 90, height: 100 } },
  saltboundHinges: { marker: { x: 468, y: 337 }, label: { x: 468, y: 291 }, walk: { x: 468, y: 431 }, hit: { x: 468, y: 349, width: 92, height: 94 } },
  riverSluice: { marker: { x: 318, y: 380 }, label: { x: 318, y: 333 }, walk: { x: 318, y: 444 }, hit: { x: 318, y: 393, width: 100, height: 95 } },
  counterweightRoom: { marker: { x: 860, y: 306 }, label: { x: 838, y: 259 }, walk: { x: 835, y: 431 }, hit: { x: 860, y: 332, width: 94, height: 112 } },
  pairedWinches: { marker: { x: 770, y: 377 }, label: { x: 770, y: 330 }, walk: { x: 760, y: 454 }, hit: { x: 770, y: 391, width: 100, height: 100 } },
  gatehouseCrown: { marker: { x: 700, y: 224 }, label: { x: 700, y: 182 }, walk: { x: 685, y: 430 }, hit: { x: 700, y: 253, width: 105, height: 115 } },
  openTheCrossing: { marker: { x: 705, y: 330 }, label: { x: 706, y: 283 }, walk: { x: 690, y: 445 }, hit: { x: 705, y: 354, width: 115, height: 116 } },
  seedStore: { marker:{x:755,y:300},label:{x:755,y:255},walk:{x:730,y:424},hit:{x:755,y:325,width:105,height:105} },
  threshingYard: { marker:{x:626,y:337},label:{x:626,y:292},walk:{x:626,y:430},hit:{x:626,y:350,width:100,height:100} },
  irrigationBeds: { marker:{x:240,y:323},label:{x:240,y:280},walk:{x:260,y:425},hit:{x:240,y:340,width:100,height:105} },
  terraceChannels: { marker:{x:460,y:300},label:{x:460,y:255},walk:{x:460,y:420},hit:{x:460,y:330,width:100,height:100} },
  saltedFurrows: { marker:{x:360,y:340},label:{x:360,y:295},walk:{x:360,y:435},hit:{x:360,y:355,width:100,height:105} },
  pairedGranaries: { marker:{x:820,y:330},label:{x:820,y:285},walk:{x:800,y:430},hit:{x:820,y:345,width:100,height:100} },
  sluiceGarden: { marker:{x:270,y:355},label:{x:270,y:310},walk:{x:270,y:440},hit:{x:270,y:365,width:100,height:100} },
  harvestTerraces: { marker:{x:540,y:280},label:{x:540,y:235},walk:{x:540,y:420},hit:{x:540,y:300,width:100,height:100} },
  convoyStores: { marker:{x:735,y:345},label:{x:735,y:300},walk:{x:735,y:435},hit:{x:735,y:365,width:105,height:100} },

  marketArrival: {marker:{x:300,y:303},label:{x:300,y:258},walk:{x:300,y:430},hit:{x:300,y:340,width:110,height:100}},
  courierSteps: {marker:{x:430,y:295},label:{x:430,y:250},walk:{x:430,y:430},hit:{x:430,y:335,width:105,height:100}},
  terraceDeliveries: {marker:{x:230,y:340},label:{x:230,y:295},walk:{x:230,y:440},hit:{x:230,y:365,width:105,height:100}},
  splitMarket: {marker:{x:670,y:325},label:{x:670,y:280},walk:{x:670,y:440},hit:{x:670,y:355,width:105,height:100}},
  saltedStorefronts: {marker:{x:770,y:340},label:{x:770,y:295},walk:{x:770,y:445},hit:{x:770,y:365,width:105,height:100}},
  awningLanes: {marker:{x:360,y:330},label:{x:360,y:285},walk:{x:360,y:440},hit:{x:360,y:355,width:105,height:100}},
  seedExchange: {marker:{x:550,y:305},label:{x:550,y:260},walk:{x:550,y:435},hit:{x:550,y:335,width:105,height:100}},
  neighborhoodRounds: {marker:{x:700,y:300},label:{x:700,y:255},walk:{x:700,y:435},hit:{x:700,y:335,width:105,height:100}},
  townLedger: {marker:{x:600,y:310},label:{x:600,y:265},walk:{x:600,y:435},hit:{x:600,y:340,width:105,height:100}},
  openTheMarket: {marker:{x:820,y:295},label:{x:820,y:250},walk:{x:820,y:435},hit:{x:820,y:335,width:105,height:100}},
  castleReceivingDock: {marker:{x:220,y:335},label:{x:220,y:290},walk:{x:220,y:435},hit:{x:220,y:360,width:110,height:100}},
  provisionStores: {marker:{x:355,y:310},label:{x:355,y:265},walk:{x:355,y:430},hit:{x:355,y:345,width:110,height:100}},
  saltboundStorehouse: {marker:{x:470,y:320},label:{x:470,y:275},walk:{x:470,y:430},hit:{x:470,y:350,width:110,height:100}},
  castleSeedVault: {marker:{x:610,y:275},label:{x:610,y:230},walk:{x:610,y:420},hit:{x:610,y:310,width:110,height:105}},
  dividedCourtyard: {marker:{x:740,y:320},label:{x:740,y:275},walk:{x:740,y:430},hit:{x:740,y:350,width:110,height:100}},
  terraceDispatch: {marker:{x:840,y:340},label:{x:840,y:295},walk:{x:840,y:440},hit:{x:840,y:370,width:110,height:100}},
  contradictoryOrders: {marker:{x:300,y:365},label:{x:300,y:320},walk:{x:300,y:450},hit:{x:300,y:390,width:110,height:100}},
  reservoirLedger: {marker:{x:500,y:345},label:{x:500,y:300},walk:{x:500,y:440},hit:{x:500,y:375,width:110,height:100}},
  reservoirControls: {marker:{x:690,y:350},label:{x:690,y:305},walk:{x:690,y:440},hit:{x:690,y:375,width:110,height:100}},
  openTheUpstreamRoute: {marker:{x:870,y:295},label:{x:870,y:250},walk:{x:850,y:435},hit:{x:870,y:330,width:110,height:100}},
  openTheHarvestRoad: { marker:{x:875,y:360},label:{x:855,y:310},walk:{x:835,y:440},hit:{x:875,y:375,width:100,height:100} },
} as const;
