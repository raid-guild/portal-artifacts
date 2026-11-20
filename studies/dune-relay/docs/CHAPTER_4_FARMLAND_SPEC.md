# Chapter 4: Farmland

**Status:** Implemented first playable chapter; tune from playtest evidence.  
**Date:** November 20, 2026

## Story and access

The raised River Gatehouse bridge leads across the river into working fields. The water is back, but bronze-bound seedpods were sealed through the drought and the planting channels still need attention. The Fieldkeeper, a stocky leafy Druid farmer, joins the party. He reads the fields' water and harvest patterns and records clues pointing beyond the farms. The chapter ends when the seed stores open and the harvest road is ready; the next destination remains a story promise, not another playable chapter.

The first thirty levels remain the guest demo. Finishing level 30 offers a free, explicit Farmland grant to a signed-in Portal player. A guest may finish the demo and keep local progress, then sign in and claim the grant. The grant is stored on the account and checked by the server for starting, resuming, finishing, and saving Farmland progress. Guest imports stop at level 30. Developer playtest controls can preview the chapter locally without changing production entitlement rules.

## New board rule: seedpods

Seedpods are finite authored obstacles, not a sixth matching symbol. They occupy a cell, fall with gravity, and cannot be swapped. Each starts with two hit points. One hit opens the shell visually; a second removes it and counts toward the pod goal. Its identity and hit points survive falling and no-move reshuffles.

- One connected ordinary match or cascade event hits each adjacent pod once, including a match that leaves a newly created power at its origin. Separate cascade events can hit it again.
- Jets and Flywheels hit only pods in their direct effect area, once per triggered power. Their existing direct-hit salt rule remains intact.
- A Prism clearing one symbol hits pods adjacent to its cleared normal tiles once per activation. Prism plus Prism strikes every pod directly once. A pod can take another hit from a later triggered power.
- Refills do not spawn pods. Level goals count only the authored pod set, so every board has a finite completion path.

The Fieldkeeper's repeatable companion charge uses twelve reeds. On each charge, it resets and sends two Flywheels into the board. The matching pool remains water, gear, reeds, pennant, and key. The pod's intact and cracked sprites and impact sound make its state readable at board size.

## Level route

| Level | Stop | Main lesson |
| --- | --- | --- |
| 31 | Seed Store | Match beside a pod twice. |
| 32 | Threshing Yard | Follow falling pods; meet the Fieldkeeper's charge. |
| 33 | Irrigation Beds | Direct Flywheel hits on a clipped board. |
| 34 | Terrace Channels | Aim Jets across stepped lanes. |
| 35 | Salted Furrows | Distinguish nearby ordinary matches from direct power hits. |
| 36 | Paired Granaries | Keep both chambers playable while pods fall. |
| 37 | Sluice Garden | Combine layered salt and pods. |
| 38 | Harvest Terraces | Use gravity and changing board width. |
| 39 | Convoy Stores | Combine powers and clear split stores. |
| 40 | Open the Harvest Road | Chapter climax with pods, salt, and collection goals. |

Levels use the established data definitions and deterministic seeds so goals, board masks, move budgets, and initial pod locations can be tuned programmatically. Playtest exports include pod hits, opened pods, remaining pods, and the other existing move and power statistics. Compare spare moves and losses across players before tightening budgets; the first two levels should prioritize understanding the rule, while the last levels should leave less room for mistakes.

## Presentation

The kingdom map marks the fields on the far side of the bridge. The walkable Farmland scene uses terraces, a waterwheel, a barn, and the Fieldkeeper along the foreground road. The chapter has its own background track, story and party portraits, field map stops, pod hit effects, and the existing curtain transition. Chapter 4 completion returns to the map with a closing story moment. No Chapter 5 levels are exposed yet.
