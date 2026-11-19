# Dune Relay lore and campaign direction

**Status:** Flexible starting point for future development

**Date:** November 19, 2026

## Purpose and working agreement

Use this as a shared reference for the kingdom journey, story, party, and introduction of mechanics. The broad direction was agreed in conversation; chapter names, characters, powers, obstacles, and level counts remain open to revision through writing and playtesting. This is not an implementation checklist or a commitment to build every proposed mechanic.

The route contains sixteen chapters, including two in the sky. Ten levels per chapter would mean 160 total levels, or 130 beyond the current thirty-level demo. That is a planning scale, not a production promise. The demo's existing “70 new levels” teaser would need reconsideration if this larger scope becomes the release plan.

## Story foundation

The kingdom's water, trade, and communication systems have stopped working together. The party begins by repairing one pump. Each repair reveals a neighboring community's problem and makes the next journey possible.

Over time, the party discovers that communities have protected their own supplies and infrastructure in ways that leave everyone worse off. The larger journey is about restoring cooperation as well as machinery. Moloch gives that failure a visible form and becomes the final confrontation.

Early chapters should feel like tangible local adventures. Introduce the larger explanation gradually through broken shipments, conflicting reports, isolated mechanisms, and people the player meets. Express Guild ideas through characters and consequences rather than lengthy explanations of organizational practices.

## Field guide grounding and game adaptation

The Field Guide uses **Queen Raida** as its spelling. She is a scout and scribe who gathers context and helps people understand what is happening; people retain judgment and make decisions. **Moloch** represents coordination failure: individually reasonable incentives can produce an outcome nobody wanted.

The guide's classes provide useful foundations for new companions:

- **Druid:** data, patterns, and evidence. A farm character can track growing seasons, water levels, and harvest yields.
- **Bard:** communication and helping useful stories reach people.
- **Artificer:** automation, tools, and dependable recurring systems.
- **Necromancer:** restoring and operating systems; a natural fit for aging mountain infrastructure.

These are established class concepts. The specific people, dialogue, powers, and adventure in this document are proposed game adaptations. The kingdom geography is an illustrated metaphor in the guide, not a statement of actual Guild departments, ranks, or policies.

Sources:

- [Published Field Guide](https://portal-artifacts-production.up.railway.app/raidguild-field-guide/)
- [Local kingdom lore and annotations](../../raidguild-field-guide/content/kingdom.mjs)
- [Local class profiles and lore](../../raidguild-field-guide/content-studies.json)
- [Kingdom artwork provenance](../../raidguild-field-guide/art/kingdom-source.md)

## Campaign route and progression

Chapters 1–3 describe the current playable direction. Chapters 4–16 are proposals. Destinations follow the agreed route; mechanics are candidates rather than a requirement to add a new rule at every stop.

| Chapter | Destination | Story and reason to continue | Gameplay direction |
| --- | --- | --- | --- |
| 1 | Oasis | Restore the pump and discover that the supply route has gone quiet. | Existing introduction to Jets, Flywheels, Prisms, and combinations. |
| 2 | Open Desert | Get the desert walker caravan moving toward the river. | Existing fourth matching symbol and salt crust. |
| 3 | River Gatehouse | Raise the gate and open the bridge into farmland. This is the river crossing, not the coastal fort. | Existing fifth symbol, stronger crust, and shaped boards. |
| 4 | Farmland | Water has returned, but stored seeds and neglected channels need attention before the farms recover. Meet a Druid-inspired companion. | Falling, multi-hit armored seedpods; retain five symbols. |
| 5 | Town on the Hill | Deliver the harvest and help neighborhoods coordinate supplies and information. Meet a Bard-inspired companion. | Delivery goals: guide supply pieces to marked exits. |
| 6 | Castle Island | Discover that reservoir records and actual deliveries disagree; organize an upstream investigation. | A milestone combining familiar mechanics rather than another obstacle. |
| 7 | River Journey | Follow the missing water upstream aboard a repair boat. | Clearly marked currents that shift pieces after a turn. |
| 8 | Second Oasis and Water Collection Station | Repair the collection balloons and discover why shipments stopped. Meet an Artificer-inspired companion. | Sixth symbol, with a balloon-themed power introduced later if useful. |
| 9 | Balloon Landing Zone | Ride to the twin towers and prepare an ascent into the clouds. | Develop balloon powers, delivery goals, and currents without another symbol. |
| 10 | Sky Castles Arrival | Reach Raida and reconnect scattered reports from across the kingdom. | Relay objectives: activate a set of connected mechanisms. |
| 11 | Sky Castles The Shared View | Raida assembles the evidence. The party chooses to investigate the mountain infrastructure. | A sky-region climax combining learned mechanics. |
| 12 | Mountain Villa and Balloon Landing | Land at an isolated maintenance station and meet a Necromancer-inspired restorer. | Seventh and final symbol, if playtesting supports it; simplify other demands during introduction. |
| 13 | Waterfall | Restore the great cascade and open the route toward the volcanic frontier. | Candidate frozen tile shells, or a chapter focused on vertical drops and transport. |
| 14 | Gates of Moloch | Reconnect defenses that have become isolated and obstructive. | Staged locks and coordinated objectives using established mechanics. |
| 15 | Lava Pool | Build a crossing through machinery that drains neighboring systems to keep itself running. | Candidate lava spread with visible warnings, bounded growth, and a clear prevention action. |
| 16 | Moloch | Break the mechanism that keeps the kingdom working against itself. | A multi-phase finale built from learned mechanics and party contributions. |

The river investigation leads to the second oasis because it houses water-collection balloons. Repairing them supplies transportation to the balloon landing zone and then the sky. This makes the return toward the desert a consequence of the investigation.

## Farmland starting concept

The next chapter should add a companion and a distinct obstacle without expanding the matching pool immediately.

**Armored seedpods** are the proposed coconut equivalent: tough seed husks with bronze bindings that crack visibly before opening. A possible introduction is:

> The water's back. But these seeds were sealed away through the drought. We need to open the stores and get the planting channels running before the next caravan leaves.

Initial rules to prototype:

- A pod occupies a cell and falls with gravity.
- It is an obstacle, not a sixth matching color.
- Two damaging events crack and open it; opening advances the harvest goal.
- Ordinary adjacent matches damage it.
- Jets and Flywheels require direct hits, consistent with salt.
- Teach pods alone before combining moving pods with stationary salt.
- Use finite, authored spawning so completion does not depend on an endless random supply.

The clearest first version falls but cannot be manually swapped. Swappability, Prism interactions, and whether overlapping effects count as separate hits remain design decisions before implementation. No existing salt behavior should change implicitly because a new obstacle is added.

The Druid's reading of harvest and water patterns can reveal that the farms' problem began upstream. Their story contribution should matter beyond granting a power-up.

## Party and matching symbols

A possible seven-companion core party is:

| Companion | First appearance | Story contribution |
| --- | --- | --- |
| Keeper | Oasis | Water systems and Pressure Jets |
| Wayfinder | Open Desert | Routes, travel, and Flywheels |
| Gatewright | River Gatehouse | Mechanisms and Prisms |
| Druid-inspired character | Farmland | Harvest patterns and recovery |
| Bard-inspired character | Hill Town | Communication and coordination |
| Artificer-inspired character | Collection Station | Balloons and automated machinery |
| Necromancer-inspired character | Mountain Villa | Restoring old infrastructure |

Queen Raida remains a major story character without needing to become a selectable companion. Other guide classes can appear as local contacts without expanding the permanent party.

A new companion does not require a new matching symbol. Hold at five through farmland, town, castle, and river. Consider the sixth at the collection station and the seventh in the mountains. Six or seven is the working endgame range, not a requirement to use seven if six plays better. New companions may charge from existing symbols or objectives; their exact abilities remain open.

## Chapter pacing and difficulty

Every chapter needs a new situation; it does not need a new rule. Alternate introductions with chapters that explore familiar combinations.

A starting rhythm for a ten-level chapter is two introduction levels, three practice levels, three combination levels, one harder challenge, and one story climax. Vary this when narrative or playtests call for it.

When introducing a symbol, simplify board shape, obstacles, or move pressure. When introducing an obstacle, keep the symbol pool familiar. Additional symbols reduce match opportunities, so avoid treating them as purely cosmetic unlocks. Measure the resulting difficulty rather than assuming every new symbol needs the same adjustment.

Each mechanic needs readable states, movement, impact, sound, and tutorial framing. Preserve the game's dynamic character through distinct power effects, companion reactions, and chapter finales. Boss phases and hazards should remain legible within deliberate turn-based play rather than introducing surprise real-time pressure.

## Transitions and final payoff

A chapter ending should resolve a local problem, show the change in the world, and provide a concrete reason to travel. Use the kingdom map to make the journey understandable. New backgrounds, music, story scenes, and selected cinematics can mark regional changes without requiring a large movie after every chapter.

Earlier repairs should visibly contribute to the finale: the oasis pumps, the caravan carries supplies, the town coordinates, Raida shares signals, and the mountain systems hold. Those relationships create openings on the final board. The restored kingdom and assembled party become the reason Moloch can be defeated.

## Decisions to revisit

Before building a chapter, refine its local story, companion identity, goals, and one primary gameplay lesson. Prototype new mechanics before locking later chapters around them. Revisit travel geography against the actual kingdom image, final symbol count, companion powers and selection, obstacle damage rules, boss phases, and the campaign's production scope.

Retain the route and cooperative story as the starting direction while allowing the details to evolve with art, lore review, and playtesting.
