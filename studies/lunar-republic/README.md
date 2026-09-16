# Lunar Republic

A standalone Three.js strategy-game prologue about a lunar revolution. Published at `/lunar-republic/` on the portal-artifacts Railway service.

Canonical runtime source lives in `../../public/lunar-republic/`; `dist` is a symlink to that directory. No Sites service or build step is needed. Serve `dist/` with any static web server; no account, backend, or build step is required. From this folder, `npm start` serves the game at http://localhost:4173.

## Play

Choose a city and operation. Open **Plot trajectory**. Adjust launch direction (degrees), muzzle speed (km/s), and departure delay (hours). Drag the lunar aiming handle or use keyboard-accessible sliders and numeric inputs. Use **Arrival close-up** to bring the entry cross inside the gold target arc. There is no automatic aiming solution. Launches advance the departure-plus-flight duration rounded up to six-hour campaign shifts; waiting advances one shift. Buy upgrades under Station; read incoming shuttle schedules under Dispatches. Progress saves to browser-local storage and is specific to the browser and origin.

Deliver ore to Port Azure for return supplies. Two relief deliveries ally Meridian. Gain three pressure through strikes or an initial demonstration to unlock Vesper's surrender once Meridian is allied. Alternatively destroy shipyards and military command, then clear any deployed blockade. One successful Azure delivery is required to complete the chapter.

## Implementation

- `dist/game.js`: deterministic campaign rules, orbital outcome integration, and save validation.
- `dist/orbital.js`: gravity integration, event detection, moving targets, and entry assessment.
- `dist/plotter.js`: interactive top-down system and arrival plots, lunar aiming handle, and previous-shot overlay.
- `dist/world.js`: Three.js station, orbital chart, cities, simulated-orbit playback, and flight/impact animation. Static geometry is batched for fewer draw calls.
- `dist/app.js`: accessible HTML controls, game orchestration, local save, optional synthesized audio.
- `authoring/catapult.blend`: Blender source for accelerator collars and excavator.
- `authoring/build_catapult.py`: recreates and exports the authored asset in an isolated Blender background session.
- `dist/assets/catapult.json`: exported Blender mesh data consumed by Three.js.
- `tests/game.test.js` and `tests/orbital.test.js`: campaign, persistence, outcome parity, timestep convergence, and Jacobi-integral checks. Run `npm test`.

The orbital model integrates a fictional circular restricted three-body system using adaptive RK4 in an inertial barycentric frame. Pelagos and Selene have Earth/Moon-like gravitational parameters but a deliberately closer 60,000 km separation; Pelagos rotates every 12 hours. Trajectory, forecast, mission resolution, and cinematic orbital playback share the same simulated path. Planet interception is tested at a 100 km atmospheric boundary. Freight also requires entry speed ≤11.5 km/s and flight-path angle 8–78°; atmospheric descent and recovery are abstracted, not simulated. Planetary destinations are in the playable orbital plane. City destruction uses persistent district integrity rather than individual-building physics. Return shuttles are scheduled deliveries rather than piloted vehicles.

## Dependencies

Three.js 0.180.0 is vendored locally under its MIT license. Font files are vendored from Google Fonts (DM Sans and Barlow Condensed) under the SIL Open Font License. The game works without external network dependencies once served locally.

## Expansion points

Extend city/mission definitions and the pure campaign state before adding further rendering detail. Future work can add atmospheric flight, non-circular orbits, additional chapters, and cargo handling without coupling campaign rules to the renderer.

## Publish

Commit and push this repository, then deploy the repository root to the existing `portal-artifacts` Railway service. All fonts, Three.js modules, and Blender exports are served locally under the existing Content Security Policy.

Migrated from Lunar Republic source commit `8293723af46262b0c728222d818006cf155b37e1`. Saves are browser-local and origin-specific; progress from the previous Sites URL does not transfer automatically.

## Orbital plotting notes

Existing browser saves remain compatible. The orbital clock defaults from the saved shift until the next time advance. The last attempted shot is saved for comparison, including unsuccessful flights. A missed shot requires explicit confirmation before spending resources. Failed trajectories receive lunar-fallback, system-escape, or no-arrival feedback; they do not play a city impact.

Destinations use generous receiving regions for the prologue (850 km cargo radius, 500 km demonstration, 250 km strike). These represent campaign-scale entry corridors, not precision surface guidance.
