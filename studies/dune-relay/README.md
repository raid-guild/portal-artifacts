# Dune Relay · Oasis, Open Desert, River Gatehouse, Farmland

Portal signed launch and account saves are described in [docs/portal-cloud-save.md](docs/portal-cloud-save.md). Guest progress remains on this device; playtest mode remains separate. Settings offers JSON and CSV level stats exports for guests and Portal players. Stats stay on this device in separate guest and per-account archives; signing in or importing guest progress does not move stats into an account, and exports contain no Portal identity or cloud operations.

Run `npm ci` and `npm run dev` here, then open http://localhost:3000. Mobile is optimized for landscape; desktop plays in a normal browser window. Tap or click a destination to walk there, or use WASD.

Forty authored levels are defined in `src/game/levels.ts`. The first thirty are the guest demo. The first ten restore the Oasis and introduce Jets, Flywheels, Prisms, combinations, and varied board shapes. The next ten cross the Open Desert: the Wayfinder introduces coral pennants and grants two Flywheels every nine pennants; levels 15–20 introduce salt crust. At level 20 the beacon lights, the supplied caravan departure film plays, and the Wayfinder points the party toward the River Gatehouse on the bridge into farmland.

Chapter 3 has ten playable levels (21–30). The Gatewright introduces violet keys as a fifth symbol; every nine keys grants one Prism that stays idle until swapped or double-tapped. Levels 21–24 practice the new symbol on square and clipped boards. Level 25 introduces two-hit salt, with a guided first move that visibly cracks a block. Levels 26–30 combine one- and two-hit crust with clipped corners, twin chambers, and a stepped board. The salt goal counts broken blocks, not damage. Every cell in a normal match, including the cell retained as a newly created power, damages adjacent salt once per match. Tiles cleared by a Prism also damage adjacent salt; Jets and Flywheels must strike salt directly. Separate chained power activations can damage one block more than once. The final level raises the bridge gate, then plays the crossing film into farmland. A thank-you message ends the guest demo. Portal players can explicitly claim the free Farmland chapter after completing those thirty levels.

Chapter 4 has ten playable levels (31–40) across the fields. The Fieldkeeper is a leafy Druid farmer whose repeatable twelve-reed charge sends two Flywheels. Bronze-bound seedpods fall but cannot be swapped; each needs two hits. Ordinary matches damage adjacent pods once per connected event, while Jets and Flywheels must hit them directly. Prisms damage pods beside cleared normal tiles; Prism plus Prism hits every pod once. The five existing matching symbols stay in use. See the [Chapter 4 spec](docs/CHAPTER_4_FARMLAND_SPEC.md) for the level route and tuning notes.

Before each level, a starting-booster dialog offers a horizontal Water Jet (300 coins), Flywheel (300), and Prism (500). Each is limited to one per attempt and starts on the board, arriving from the active companion after the goals banner. The board stays locked until the delivery ends. Reduced motion uses a short destination reveal. You can start without buying anything. The selection is charged only after the new board has loaded; Cancel and interrupted loads cost nothing. Retry opens a fresh selection. In isolated playtest mode, the same prices use a separate test wallet, earned from test-level wins; campaign coins stay untouched. The test wallet survives reload and level replay, and Restart sequence resets it to zero.

The Kingdom Map uses a single image coordinate plane for its routes and landmarks. The Open Desert marker sits above the camel train, and the Gatehouse marker points to the river bridge. The Raid Party shows recruited companions. Completed levels do not award coins again.

During a win, **Skip reveal** is available from the goals banner onward. It awards the same coins and leaves the same settled board as watching the full finale. Prisms fire only when swapped or double-tapped; a Jet or Flywheel passes over an idle Prism. Falling tiles land with a short stagger, and a quick swipe selects one adjacent tile along the strongest swipe direction. **Full screen** appears whenever the browser allows it and the game is outside fullscreen, including after exiting it. Mobile entry requests fullscreen; desktop starts windowed and can enter it manually. A rejected or stalled request shows a retry message and records the failure in exported diagnostics. The button follows the browser's actual fullscreen state even if a previous request finishes late.

For development, open http://localhost:3000/?playtest=1. After acknowledging the demo ending, a Playtest entry also appears on the home screen and in Settings. Settings lets you replay any of the forty levels, preview all chapter transitions (including the Gatehouse gate rise, crossing film, demo ending, and Gatehouse-to-Farmland story handoff), or return to the campaign. The Farmland preview follows the handoff, kingdom map, and Fieldkeeper conversation before the level shop; individual Replay buttons still open a level directly. The previews use sandbox progress and keep the current playtest coin wallet. **Export level stats (JSON)** downloads a full attempt log with initial board, authored seed, starting boosters, per-move inputs and mechanic counters. **Export level stats (CSV)** downloads one row per attempt for tuning. Attempts include wins, losses, abandonments, active time, cleared symbols, power creation/activation and combinations, salt hits, companion grants, and reshuffles. The archive uses a separate local key, keeps the latest 200 attempts with a truncation count, and never changes campaign rewards. An interrupted attempt is marked abandoned on reload. Animation and coin finale time are excluded from active play time.

Campaign saves use version 5 and migrate v1–v4 progress, coins, companions, and chapter checkpoints. A completed Open Desert campaign resumes at its departure film; an older save that has completed level 30 resumes the demo ending. The gate rise, crossing film, thank-you message, and acknowledged demo each have a durable checkpoint. From board Settings, **Return to story** leaves the current level; unfinished progress restarts on reentry and spent boosters remain spent. Sound is synthesized locally, with separate effects, ambience, and music controls in Settings. Each reached chapter unlocks its soundtrack for manual selection; Follow chapter is the default. Oasis and Open Desert use desert wind, while Gatehouse uses river and machinery ambience.

Run `npm run test:core` for seeded level, rules, migration, and statistics checks; `npm run typecheck` and `npm run build` for production verification. The static build is in `out/`.

For browser interaction regression checks, start `npm run dev` in one terminal, then run `npm run test:browser` in another. Set `DUNE_TEST_URL` to test a deployed artifact instead; set `CHROMIUM_EXECUTABLE` if Chrome is not on the default path. The suite uses native touch events and checks quick swipes, tap controls, mobile fullscreen reentry, and winning reveal Skip in the banner, conversion, chain, and refill phases. Failure screenshots go to ignored `test-results/` (or `DUNE_TEST_RESULTS_DIR`).

Run `npm run test:collections` against the same running game to check an actual non-reduced-motion goal flight and capture `test-results/collect-flight-desktop.png`. Set `DUNE_TEST_URL` to the game root, for example `DUNE_TEST_URL=http://127.0.0.1:3101/dune-relay/ npm run test:collections` for a static subpath export. `CHROMIUM_EXECUTABLE` overrides the default Chrome path.

Run `npm run test:stats` against the same running game to verify guest and mocked Portal gameplay stats, JSON/CSV downloads, account isolation, and HUD layout at desktop and mobile sizes. For a static artifact, set `DUNE_TEST_URL` to its game subpath, for example `DUNE_TEST_URL=http://127.0.0.1:3103/dune-relay/ npm run test:stats`. Screenshots are saved in `test-results/`.

The intro and chapter films do not run Phaser behind them. A film attaches its video source after the previous game reports destruction, and releases it on exit. Mobile canvas backing pixels are capped at about two million. Scene transitions wait for the new scene and show a recovery card if assets or graphics fail. Settings can export a bounded local diagnostics JSON with scene, canvas, transition, media, and browser error events; no diagnostics are sent to a server. Playtest attempts under the updated match-origin salt rules carry `rulesVersion: gatehouse-3`.

Wide mobile landscape viewports fill the available screen. The walkable map uniformly covers the width while keeping its landmarks and hit targets aligned; only upper sky is cropped. The puzzle keeps its square tiles and authored 960×540 play area centered over extended scenery. Desktop continues to use a windowed 16:9 frame, and touch coordinates follow the active camera during resize.

## Future feature specifications

[Lore and campaign direction](docs/LORE_AND_CAMPAIGN_SPEC.md) records the flexible sixteen-chapter kingdom route, field-guide grounding, proposed companions, and mechanic progression. It is a starting point for future writing and playtesting, not a fixed production plan.

[Asset loading and offline play](docs/ASSET_PIPELINE_AND_OFFLINE_PLAY_SPEC.md) is a draft for asset optimization, loading recovery, caching, offline downloads, and safe updates. It describes future work rather than current offline support.

## November 19 difficulty pass

A single-player playtest found comfortable early lessons and a close Gatehouse finish, with several generous practice levels between them. The first tuning pass reduced the move budgets for Palm Intake (27→24), Irrigation Channels (27→23), Twin Tanks (27→25), Pennant Line (28→25), Walker’s Foot (28→26), Caravan Launch (28→25), Cistern Flush (28→25), and Saltwind Crossing (28→25). The opening power lessons and Gatehouse budgets stayed as authored for that pass. Attempts from that pass carry `contentVersion: chapter-3-2`; older records keep their original version. For identical solutions across those eight levels, the three-coins-per-spare-move reward totals 69 fewer coins.

A second full playtest suggested a small adjustment to four generous practice levels. Palm Intake now has 22 moves (down from 24), and Signal Balcony has 27 (down from 30). Pennant Line keeps 25 moves but asks for 36 water and 30 pennants (previously 30 and 24); Walker’s Foot keeps 26 moves but asks for 42 water and 33 pennants (previously 36 and 27). Tutorial introductions, close finishes, board seeds, and game rules are unchanged. The two move cuts reduce identical-solution rewards by up to 15 coins in total; higher goals may also require more moves and reduce rewards further. Those attempts carried `contentVersion: chapter-3-3`, while archived attempts retain their original versions. Chapter 4 attempts use `chapter-4-1`; a prepared Chapter 3 attempt may still finish with its original version. These changes are intentionally modest and need another unboosted playtest to measure their effect on human difficulty.

## Portal Artifacts build

Use Node.js 20.19 or newer.

The editable game lives in `studies/dune-relay/`. From this directory:

```sh
npm ci
npm run test:core
npm run typecheck
npm run build:artifact
```

`build:artifact` creates a subpath-safe Next static export and replaces only `public/dune-relay/` in the Portal Artifacts repository after the build succeeds. The published URL is `https://portal-artifacts-production.up.railway.app/dune-relay/`; campaign JSON/CSV exports are in Settings, and playtest replay is at `/dune-relay/?playtest=1`. The regular `npm run dev` remains rooted at `/` for local development.

The game works as a guest with local campaign saves. A Portal embed without storage access can still play and collect level stats in memory for its current session. For file exports inside a sandboxed iframe, the embedding page must allow downloads.

The share cover `public/dune-relay-social-v1.png` is an actual title-screen screenshot at 1200 × 630. Generated game art and the source of both edited cutscenes are documented in [ASSETS.md](ASSETS.md). Barlow Condensed and DM Sans are bundled under their licenses in `public/fonts/`.
