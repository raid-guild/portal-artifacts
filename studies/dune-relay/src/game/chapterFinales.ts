import type { Region } from "./save";

export type ChapterFinale = { source: `/${string}`; poster: `/${string}`; caption: string; label: string };

// A chapter gets a replay action when its closing film has been released.
export const CHAPTER_FINALES: Partial<Record<Region, ChapterFinale>> = {
  collection: { source: "/cinematics/collection-airship-takeoff.mp4", poster: "/cinematics/collection-airship-takeoff-poster.webp", caption: "The reservoirs are full. The airship lifts toward the twin towers.", label: "The airship takes off from the Collection Station" },
  river: { source: "/cinematics/river-upstream-journey.mp4", poster: "/cinematics/river-upstream-journey-poster.webp", caption: "The repair boat heads upstream toward the water collection station.", label: "The repair boat heads upstream along the river" },
  castle: { source: "/cinematics/castle-upstream-departure.mp4", poster: "/cinematics/castle-upstream-departure-poster.webp", caption: "The upstream route opens. The raid’s journey will continue.", label: "The boat departs Castle Island for the upstream route" },
  town: { source: "/cinematics/town-market-opens.mp4", poster: "/cinematics/town-market-opens-poster.webp", caption: "The market opens. The next delivery crosses to Castle Island.", label: "The Town market opens for deliveries" },
  farmland: { source: "/cinematics/farmland-harvest.mp4", poster: "/cinematics/farmland-harvest-poster.webp", caption: "The seed stores open. The harvest convoy can move again.", label: "The farmland harvest route opens" },
  gatehouse: { source: "/cinematics/gatehouse-crossing.mp4", poster: "/cinematics/gatehouse-crossing-poster.webp", caption: "The bridge opens. The road carries on into farmland.", label: "The gate rises and the bridge opens into farmland" },
  caravan: { source: "/cinematics/caravan-departure.mp4", poster: "/cinematics/caravan-departure-poster.webp", caption: "The beacon lights the path. The walkers depart for the river.", label: "The walker train departs for the river" },
  oasis: { source: "/cinematics/oasis-awakens.mp4", poster: "/cinematics/oasis-awakens-poster.webp", caption: "The pump house wakes. Water crosses the oasis.", label: "The pump house comes to life" },
};
