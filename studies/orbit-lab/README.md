# Orbit Lab

A gallery of six small gravity and level-design experiments built with Three.js and cannon-es. Place temporary
gravity wells to bend a blob's flight around walls and spikes toward the exit.
The Orbit mode in Settings keeps the open-ended orbital playground. The deployed route is
`/orbit-lab/`.

## Develop, test, and publish

Requires Node.js 20.19 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/orbit-lab/`. From this directory, run `npm test`
for geometry, collision prediction, and a scripted Cannon physics traversal;
run `npm run build` to replace only `../../public/orbit-lab/`. Commit editable
source and rebuilt public output together. The Caddy route allows public asset
CORS for Portal's scripts-only sandbox iframe. The game code and fonts load
from this artifact and the game has no backend; the Portal packaging step
injects its site-wide analytics and outbound-link scripts.

## Controls

- Click or tap open space to place a well. Two may exist at once; a third
  replaces the oldest. Tap **Start** to release the particle; the same button
  pauses and resumes.
- Use the gear for gravity strength, lifetime, fade or snap release, mode,
  forecast, active wells, run statistics, and help. Opening it pauses a running
  simulation; closing it resumes that run.
- Right-click a well or use its list button in Settings to remove it.
- Keyboard: Space starts or pauses; R restarts the current mode; E releases
  all wells.

Both maze and orbital sandbox begin ready, allowing placements before the
initial release. The maze room uses a 16:9 interior; phone controls sit in a narrow side rail. Upright phones present the playfield sideways, and rotating updates the camera and touch mapping without restarting. The portal casts a faint purple light and sheds purple sparks. A spike hit resets the maze run. The orbit mode has no maze
collisions. Luminous recent trails burn down into a faint, persistent archive
that clears on restart. Recent glow uses fixed-size ribbon buffers; its faint raster archive expands with the visible world on resize without discarding earlier marks.

## Sound

Player wells default to strength 70. A procedural, original five-note synth call advances with each valid placement. The flight tone fades with time since placement; death and the portal have separate synthesized cues. Sound starts only after an interaction and can be muted in Settings. There are no external sound files or audio requests.

## Assets and attribution

The app uses locally hosted Space Grotesk and DM Mono fonts. The license texts
for those fonts and the bundled Three.js and cannon-es dependencies are in
`public/licenses/` and are copied to the published artifact. The social card
`public/orbit-lab-social-v3.jpg` is a 1200 × 630 composition of the actual
gallery screenshot (`outputs/orbit-demo-gallery.jpg` in the prototype workspace)
with an added title. Earlier v1/v2 images remain for existing shared links.
Canonical and social metadata use the production `/orbit-lab/` URL.

## Mechanics gallery

The gallery opens on a fresh visit; the grid button returns to it at any time.
Every study resets to its own paused starting state. Share a study using
`/orbit-lab/?demo=drift`, `satellites`, `slingshot`, `gate`, `maze`, or `orbit`.

- **A gentle curve:** an open room for temporary-well steering.
- **A little gravity:** the hero attracts three loose moons. Set Dot gravity
  to zero in Settings to compare. The moons also respond to player wells.
- **Close to the flame:** a stronger fixed ember and a barrier explore hazard
  slingshots. Its core is still fatal.
- **Bring a moon:** move the gold moon onto the gold ring to latch a gate open.
- **The winding room:** the original maze remains as a reference.
- **An orbital sketch:** the original wall-free orbit experiment.

The hero has mass 1 and each moon mass 0.08. Dot gravity defaults to 12 in the
moon studies and is adjustable from 0 to 30. Attraction is softened; moon and
hero forces are equal and opposite, so the hero never accelerates itself.
The portal and hazards remain fixed. Trajectory prediction is disabled in
moving-moon studies rather than pretending their trajectories are static.

Preset definitions and the reciprocal-gravity/switch helpers live in
`src/demos.js`. To add a study, define its room, spawn, portal, hazards,
moons and optional plate there. No new services or dependencies are needed.
Tests cover preset validity, force balance, zero-gravity comparison, the moon
switch, and a live Cannon traversal of the reference maze at strength 70.

### Single-rule studies

The gallery now includes thirteen isolated mechanic studies (`?demo=release`,
`boost`, `sticky`, `eclipse`, `power`, `dimmer`, `guide`, `giant`, `chaser`,
`clock`, `sound`, `hidden`, and `portals`). Existing six studies remain available.
Each adds one mechanic to basic well steering; these are tuning experiments.

The in-play action removes the oldest well, or releases a captured dot with its
incoming velocity. E performs that action; 1 / 2 remove the corresponding active
well. The settings still offer release-all. Portals preserve speed and rotate
momentum by a quarter turn, with a cooldown. Teleports split the trail without
clearing its permanent drawing. Hidden bodies reveal near the orb only with an
unobstructed line of sight, fully invisible otherwise. Light pickups/drains
change illumination without changing the collision radius. Sound gates add
bounded voices on a shared quarter-second clock with bass, offbeat, and chime parts. Guiding walls use one continuous convex collider;
chaser acceleration and speed are bounded. Forecast is disabled where it cannot
represent the interactive rule accurately.
