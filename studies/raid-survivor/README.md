# Raid Survivor Portal artifact

Build with Node 22+ using `npm ci && npm run build`. Vite emits the deployable
site to `../../public/raid-survivor/` with base path `/raid-survivor/`.
`npm test` runs the build, game simulation, and approved music tests. Fonts are
self-hosted through Fontsource; art attribution is in `ATTRIBUTION.md`.

Portal-ranked play uses the same-origin `/leaderboard-api/raid-survivor` API.
Standalone and sandboxed visitors can play as guests, and every rankable run
saves its score locally. Launch through Portal to acquire a ranked session.
No standalone Node server or local auth store is deployed with this game.

On touch screens, drag and hold anywhere on the playfield to steer continuously.
A joystick ring follows the hero; steering is relative to the original finger
grab, so a stationary held finger keeps moving. Release or return to the small
deadzone to stop. Bomb and Dash
sit along the bottom edge, with Backpack above them. Manual touch aim remains
an optional separate stick in Settings. Keyboard movement and mouse aim remain
available on desktop.

Vault blessings: elite enemies have a 30% chest chance, elite brutes 45%, and
regular brutes 8%, when the 45-second chest cooldown is ready and no chest is
already waiting. Moloch always drops a chest, bypassing those restrictions.

## Balance and late encounters

The first 45 seconds ramp enemy arrivals from 1.2× the normal interval to the
normal interval; the opening group is 18. Ordinary enemy contact and projectile
damage ramp from 85% to 100% over the first minute. Enemies close to useful
attack distances instead of stopping far from the player.

At 2:00, elite brutes become Juggernauts: a fixed lane warns for 0.9 seconds,
then charges for 0.55 seconds and recovers for 0.65 seconds. At 3:00, elite
cultists become Hexcasters: they fix a ground mark for 1.2 seconds. These
variants have 6× and 7× their respective elite HP so a representative evolved
three-weapon build sees their first warning. Earlier elites and ordinary enemy
HP are unchanged. At 6:00 and 9:00, later Moloch tiers add fixed ground marks
and elite escorts. Escorts replace upcoming ordinary spawns. Warning hazards
(maximum 12) are independent of cosmetic effects; enemy shots cap at 280.

The tuning values live near the encounter logic in `src/game.ts`; HUD clock
layout lives in `src/style.css`. Run `npm test` for simulation and music checks,
then `npm run benchmark` for horde and mixed late encounter timings. The mixed
benchmark is bounded and does not represent a full twelve-minute playthrough
or all player builds. In a development preview, `__raidDebug.setupLateEncounter`
accepts `juggernaut`, `hexcaster`, `ascended`, or `unbound`; `stepDemo(seconds)`
advances fixed simulation time while keeping the encounter paused.
