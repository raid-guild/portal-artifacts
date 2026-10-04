# Balance pass QA

Run `npm run balance:qa -- --baseline <saved-game-bundle.mjs> --out <report.json>`
from this directory. The script bundles the current `game.ts`, imports the saved
pre-pass bundle, and runs both with the same seeded fixtures. It also writes a
separate `pacing/comparison.json` beside the report. The comparison for this
pass is at `outputs/raid-survivor-balance-qa/after-pass-comparison.json` in the
task workspace; its baseline is the saved `baseline-game.mjs` there.

The 20-second weapon fixtures use immortal stationary targets, two seconds of
warmup, and seed 771. A single boss sits six units ahead; the dense fixtures
use 49 rats in a grid or 24 in a ring. This measures repeatable throughput,
not the time to defeat real enemies.

| Fixture | Before | After |
| --- | ---: | ---: |
| Rank 5 Storm Coil, lone boss DPS | 69.444 | 69.444 |
| Rank 5 Storm Coil, 49-rat grid DPS | 5131.944 | 1402.778 |
| Rank 5 Storm Coil, 24-rat ring DPS | 1069.444 | 715.278 |
| Wizard bomb, nine clustered brutes, total damage | 307.8 | 486 |
| Ranger / Dwarf bomb, same fixture | 734.4 / 594 | 734.4 / 594 |
| Xorn / Efreeti warnings over 30 seconds under continuous Frost hits | 0 / 0 | 4 / 4 |
| Forest elite brute HP at paced second 239 | 373.59 | 1291.999 |
| Forest elite brute HP at paced second 240 | 2246.4 | 1310.4 |
| Forest elite brute HP at paced second 300 | 2538 | 2538 |

All 108 opening survival fixtures use finite health, three seeds, every hero
and realm, and three distinct modes. `stationary` and `orbit-move` use the
same starting loadout; `orbit-move` steers toward a radius-20 circle around
(90,90) at angle `elapsed × 0.085`. `orbit-build` stays stationary with an
upgraded Orbit weapon and passives. Before and after were identical in all
108 fixtures. The death counts were 17/36 stationary, 13/36 moving, and 9/36
Orbit-build. The 24 mid/late fixed-build runs have matched stationary/moving
pairs; two stationary Ice runs differed in kills by at most five, with the same
survival time and remaining health. Moving fixed-build pairs were identical.
Human steering, adaptive reward choices, and actual phone rendering
are outside this comparison, so it does not establish a human win rate or
device frame rate.

An independent after-QA pass confirmed the earlier 72 opening fixtures were identical,
both Frost targets started four periodic charges with no warning while frozen,
and an upgraded Wizard bomb dealt 230.85 to each of nine clustered targets.
The elite charge warning remained 0.9 seconds.

## Checkpoint and Molten Vault expansion

The same harness now includes Warrior and Tavern Keeper, plus Molten Vault.
The v3 run at `outputs/raid-survivor-progression-qa/v3-combat-balance.json`
contains 225 current opening fixtures and 36 mid/late fixtures. The saved
pre-expansion bundle has the original 108 and 24 fixtures. The current opening
fixtures reached at most 157 enemies and 4 enemy shots; these counts are
observations for these seeds, not device performance measurements. All 72
old-weapon throughput fixtures match the saved bundle exactly after reseeding
weapon RNG following arena setup. The original Ranger, Wizard, and Dwarf bomb
totals remain 734.4, 486, and 594 against nine clustered brutes.

In the 108 shared opening fixtures, current runs died 26 times versus 39 in
the saved bundle. The difference is entirely in Guild Training (14 versus
27); Forest, Desert, and Ice death counts were unchanged (1, 7, and 4).
Training's first ordinary ranged foe enters at 30 seconds, followed by a
second at 60 seconds. New
hero and Lava outcomes have no pre-expansion counterpart. The new-hero
primary figures use immortal clustered targets and describe throughput only;
they do not predict human survival or mobile frame rate.
