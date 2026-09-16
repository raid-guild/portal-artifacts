# Lunar Republic

A standalone Three.js strategy-game prologue about a lunar revolution. Published at `/lunar-republic/` on the portal-artifacts Railway service.

Canonical runtime source lives in `../../public/lunar-republic/`; `dist` is a symlink to that directory. No Sites service or build step is needed. Serve `dist/` with any static web server; no account, backend, or build step is required. From this folder, `npm start` serves the game at http://localhost:4173.

## Play

Choose a city and operation. Adjust bearing and rail charge until the arrival solution is green, or use the suggested solution. Launching or waiting advances one shift. Buy upgrades under Station; read incoming shuttle schedules under Dispatches. Progress saves to browser-local storage and is specific to the browser and origin.

Deliver ore to Port Azure for return supplies. Two relief deliveries ally Meridian. Gain three pressure through strikes or an initial demonstration to unlock Vesper's surrender once Meridian is allied. Alternatively destroy shipyards and military command, then clear any deployed blockade. One successful Azure delivery is required to complete the chapter.

## Implementation

- `dist/game.js`: deterministic campaign rules and save validation.
- `dist/world.js`: Three.js station, orbital chart, cities, trajectories, and flight/impact animation. Static geometry is batched for fewer draw calls.
- `dist/app.js`: accessible HTML controls, game orchestration, local save, optional synthesized audio.
- `authoring/catapult.blend`: Blender source for accelerator collars and excavator.
- `authoring/build_catapult.py`: recreates and exports the authored asset in an isolated Blender background session.
- `dist/assets/catapult.json`: exported Blender mesh data consumed by Three.js.
- `tests/game.test.js`: campaign, recovery, combat, progression, and persistence checks. Run `npm test`.

This first chapter uses a deterministic, deliberately simplified arrival-corridor model. Flight paths are illustrative, not a real Earth–Moon orbital solution. City destruction uses persistent district integrity rather than individual-building physics. Return shuttles are scheduled deliveries rather than piloted vehicles.

## Dependencies

Three.js 0.180.0 is vendored locally under its MIT license. Font files are vendored from Google Fonts (DM Sans and Barlow Condensed) under the SIL Open Font License. The game works without external network dependencies once served locally.

## Expansion points

Extend city/mission definitions and the pure campaign state before adding further rendering detail. Future work can replace the arrival model with tested orbital integration without coupling the campaign to the renderer; introduce additional chapter data; and expand cargo handling and diplomacy.

## Publish

Commit and push this repository, then deploy the repository root to the existing `portal-artifacts` Railway service. All fonts, Three.js modules, and Blender exports are served locally under the existing Content Security Policy.

Migrated from Lunar Republic source commit `8293723af46262b0c728222d818006cf155b37e1`. Saves are browser-local and origin-specific; progress from the previous Sites URL does not transfer automatically.
