# Orbit Lab

A campaign crossing and a gallery of gravity, light, and sound experiments built
with Three.js and cannon-es. Place temporary gravity wells to bend the glowing
dot's flight toward the exit. The deployed route is `/orbit-lab/`.

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
  replaces the oldest. Tap **Start** to release the particle; the primary button then removes the oldest well or releases a capture. Pause is in the top toolbar.
- Use the gear for gravity strength, lifetime, fade or snap release, mode,
  forecast, active wells, run statistics, and help. Opening it pauses a running
  simulation; closing it resumes that run.
- Right-click a well or use its list button in Settings to remove it.
- Keyboard: Space performs the primary action (Start, Resume, Release, or remove oldest well); P pauses/resumes; R restarts the current mode; E removes the oldest well or releases a capture.

The root route opens Home, with Campaign and World Studies choices. Campaign
opens a two-level selector; `?campaign=1` and `?campaign=2` open either level
directly, while `?demo=<id>` keeps a study deep link. Campaign
starts with 60% light, burns 1.8 percentage points per simulation second,
and receives 30 points from each pale ember. Darkness gives eight seconds to
collect another ember before the run ends, marked by an accelerating heartbeat.
Both levels share a bounded 96 × 54 chamber with a portal 50 world units from
the start. Level 1 has an empty interior. Level 2 adds a giant orange ember
at the center; its gravity bends the dot and contact is lethal. Wells and
recharge embers cannot appear inside it. The camera follows the dot; the
minimap marks the dot, wells, embers, danger, portal, and current view. The
trail art records the full path. Campaign results show time, attempts, and wells
placed; Retry starts a new attempt. Continue advances to Level 2, then returns
to the level selector. Completed levels are marked locally. The restart
control ends a live campaign attempt, so it also works as a quick way to see
the full trail result.

Each campaign level also has three optional sound gates. Crossing cyan, violet,
and gold rings adds bass, offbeat, and chime parts to a shared quarter-second
rhythm without spending light; the exit stays available without them. The HUD,
minimap, and end-of-attempt card show the gates collected in that attempt. The
level selector keeps each level's best successful-attempt pattern separately from
its completion badge. Retry clears the active pattern. The gallery sound study
(`?demo=sound`) is titled **Crossing the gates** and remains a separate study.

Both maze and orbital sandbox begin ready, allowing placements before the
initial release. The maze room uses a 16:9 interior. On phones the playfield follows the device orientation, with a horizontal toolbar and floating primary action. Rotating updates the camera and touch mapping without restarting. The portal casts a faint purple light and sheds purple sparks. A spike hit resets the maze run. The orbit mode has no maze
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

The single primary button and Space start/resume the run, then remove the oldest
well or release a captured dot with its
incoming velocity. E removes/releases without starting or resuming; 1 / 2 remove the corresponding active
well. The settings still offer release-all. Portals preserve speed and rotate
momentum by a quarter turn, with a cooldown. Teleports split the trail without
clearing its permanent drawing. Hidden bodies reveal near the orb only with an
unobstructed line of sight, fully invisible otherwise. Light pickups/drains
change illumination without changing the collision radius. Sound gates add
bounded voices on a shared quarter-second clock with bass, offbeat, and chime parts. The S-channel uses smooth analytic wall contact;
chaser acceleration and speed are bounded. Forecast is disabled where it cannot
represent the interactive rule accurately.

### Channel and light studies

Follow the Bend now uses a smooth S-channel with continuous rendered walls and
analytic normal contact. A shared centerline drives its shape and collision response. Wells can be
placed beyond the channel walls, inside the room, so their pull guides the dot; tangential velocity survives wall contact.
The old convex-arch helpers remain available for geometry reference.

Four additional studies are available through the gallery or deep links:
`shadow-posts`, `filters`, `lens`, and `prism`. Posts are physical and cast real
shadows. The other three studies use non-colliding optical surfaces with shadow
proxies and additive floor projections that respond to the hero's position.
Filters tint a transmitted fan; the lens converges toward a focus then diverges;
the prism separates seven ordered color bands. Lens and prism behavior is a
stylized optical model, not a physical Snell-law simulation. A neutral light
source in optical studies makes color transmission readable; other studies keep
the cyan source. Projected light clips against opaque rectangular walls. No
extra shadow light is allocated per ray or band.

### Burning light and wider world

`?demo=burnout` starts with 60% light. It drains by 1.8 percentage points per
simulation second, down to 6%. Pale embers appear near the dot, expire after
18 seconds, and each restores 30 points when collected. The vertical gate
closes below 35% light and reopens above 50%; it waits to close if the dot is
inside it. The small in-play meter shows light and gate state. The world
pauses when the tab is hidden, so the resource does not drain offscreen.

`?demo=wideworld` uses a 96 × 54 room with sparse barriers and a portal twice
the usual radius. Gravity strength, speed cap, and well lifetime stay in the
same world units as the smaller rooms. The follow camera and minimap let the
dot travel through the room on desktop and phone. The trail archive returns
to its starting scale on reset before fitting the selected room.
