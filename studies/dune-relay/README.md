# Dune Relay · Oasis, Open Desert, River Gatehouse

Run `npm ci` and `npm run dev` here, then open http://localhost:3000. Mobile is optimized for landscape; desktop plays in a normal browser window. Tap or click a destination to walk there, or use WASD.

The thirty authored levels are defined in `src/game/levels.ts`. The first ten restore the Oasis and introduce Jets, Flywheels, Prisms, combinations, and varied board shapes. The next ten cross the Open Desert: the Wayfinder introduces coral pennants and grants two Flywheels every nine pennants; levels 15–20 introduce salt crust. At level 20 the beacon lights, the supplied caravan departure film plays, and the Wayfinder points the party toward the River Gatehouse on the bridge into farmland.

Chapter 3 has ten playable levels (21–30). The Gatewright introduces violet keys as a fifth symbol; every nine keys grants one Prism that stays idle until swapped or double-tapped. Levels 21–24 practice the new symbol on square and clipped boards. Level 25 introduces two-hit salt, with a guided first move that visibly cracks a block. Levels 26–30 combine one- and two-hit crust with clipped corners, twin chambers, and a stepped board. The salt goal counts broken blocks, not damage. Normal matches damage adjacent salt; powers must strike salt directly. Separate chained power activations can damage one block more than once. The final level opens the bridge; farmland remains a later chapter.

The Kingdom Map uses a single image coordinate plane for its routes and landmarks. The Open Desert marker sits above the camel train, and the Gatehouse marker points to the river bridge. The Raid Party shows recruited companions. Completed levels do not award coins again.

For development, open http://localhost:3000/?playtest=1. Settings lets you replay any of the thirty levels or preview either chapter transition. **Export level stats (JSON)** downloads a full attempt log with initial board, authored seed, per-move inputs and mechanic counters. **Export level stats (CSV)** downloads one row per attempt for tuning. Attempts include wins, losses, abandonments, active time, cleared symbols, power creation/activation and combinations, salt hits, companion grants, and reshuffles. The archive uses a separate local key, keeps the latest 200 attempts with a truncation count, and never changes campaign rewards. An interrupted attempt is marked abandoned on reload. Animation and coin finale time are excluded from active play time.

Campaign saves use version 4 and migrate v1–v3 progress, coins, companions, and pending Oasis handoff. A completed Open Desert campaign resumes at its departure film. Checkpoints for film, dialogue, map, and arrival are idempotent. Sound is synthesized locally, with separate effects and ambience controls in Settings.

Run `npm run test:core` for seeded level, rules, migration, and statistics checks; `npm run typecheck` and `npm run build` for production verification. The static build is in `out/`.

## Portal Artifacts build

Use Node.js 20.19 or newer.

The editable game lives in `studies/dune-relay/`. From this directory:

```sh
npm ci
npm run test:core
npm run typecheck
npm run build:artifact
```

`build:artifact` creates a subpath-safe Next static export and replaces only `public/dune-relay/` in the Portal Artifacts repository after the build succeeds. The published URL is `https://portal-artifacts-production.up.railway.app/dune-relay/`; playtest replay and JSON/CSV exports are at `/dune-relay/?playtest=1`. The regular `npm run dev` remains rooted at `/` for local development.

The game works as a guest with local campaign saves. A Portal embed without storage access can still play in memory for its current session. For playtest file exports inside a sandboxed iframe, the embedding page must allow downloads. Portal authentication and shared saves are future integrations.

The share cover `public/dune-relay-social-v1.png` is an actual title-screen screenshot at 1200 × 630. Generated game art and the source of both edited cutscenes are documented in [ASSETS.md](ASSETS.md). Barlow Condensed and DM Sans are bundled under their licenses in `public/fonts/`.
