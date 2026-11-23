# Chapter 7: River Journey

After Castle Island's manifest points upstream, the Quartermaster provisions a repair boat. Skiff, a river pilot and supporting NPC, meets the raid on deck. The crew follows the current toward water that is moving but not reaching the people waiting for it. The journey ends with a view of the water collection station at the second oasis. That station is a Coming Soon marker; no final video is available for this chapter.

## Play and progression

River Journey contains ten authored levels, 7.1–7.10, on 9×9 boards. Five existing matching symbols and all five selectable raid leaders carry over. Skiff is in the Raid Party list as an NPC and cannot be selected. Four boat destinations group the levels: helm (7.1–7.3), intake/bow (7.4–7.5), cargo (7.6–7.8), and chart table (7.9–7.10). The boat is a walkable, static perspective scene. The player and Skiff walk or pace on its deck. Skiff's dialogue introduces the rule and offers short contextual tips on return visits.

The first three levels teach current movement without other obstacles. Salt freezes the route in 7.4–7.5. Crate delivery returns in 7.6–7.8. The final pair combines current, salt, and crate goals. The level table, seeds, budgets, shapes, paths, goals, and placements are authoritative in `src/game/levels.ts`; `scripts/fixtures/river-winning-routes.json` records a legal no-booster win for every level with every selectable companion. These witness routes prove reachability, not human difficulty.

## Current rule

Blue water tiles and arrows show a clockwise path. Symbols in the water swap and match normally. After an accepted turn's normal clear, fall, and refill, every occupant on the path moves to the next path cell simultaneously. The moved board resolves matches before checking crate exits; any resulting clears, falls, and deliveries animate. A carried power does not fire merely because it moved; a power newly created this turn remains protected. The path moves only once per accepted turn, including direct power activation. Invalid swaps, hints, reshuffles, and the coin finale do not advance it.

Any salt crust remaining on any path cell freezes the entire loop. Off-path crust does not stop it. The last block may break in the normal clear of a turn; the current then moves in that same turn. A frosted route stays visibly stopped until the salt-break animation completes. Once moving, a crate that lands on a valid bottom-edge exit delivers even if the shift creates no match. Every authored board mask retains its own bottom exits.

## Access, saves, and replay

This chapter requires the Portal Dune Pass, including a free $0 claim option. Guest play remains available through the earlier demo chapters. Castle's chapter finale hands off through the kingdom map and boat arrival. A legacy save that completed all 60 existing levels and acknowledged Castle's ending may board River without replaying Castle. River completion awards coins normally, then presents a brief Skiff celebration and the Coming Soon map destination. Completed River levels follow the same chapter-replay rule: replay is available after completing the chapter and earns no further coins.

The authored content version is `chapter-7-1`; current rules version is `river-1`. Progress retains the v5 save key with additive River fields. No new service secret or migration is required beyond the existing Dune Pass setup.
