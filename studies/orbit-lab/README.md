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

The root route opens Home, with Campaign, Infinite Play, World Studies, and the
Level editor. Campaign
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

In Level 2, a living owned moon can sacrifice itself when the dot touches a
lethal ember. The dot returns to a safe point, flies outward, and has 1.25
seconds of ember-only protection. A moon burns out after one cumulative second
of direct contact with the giant; cooling takes two seconds. When the last
embers timer reaches zero, a living moon instead buys four more seconds.
Pickups resolve first, so a collected ember saves the moon. Either benefit
consumes the oldest living owned moon; hot moons are still eligible.

## Level editor

Home also opens the Level editor. It starts from Level 1 as an editable draft.
The Add element menu includes **Companion moon**. Its selected properties show
position and collection radius; the core radius stays fixed at 0.16. A moon
collects light and can be spent to save the dot from an ember or buy four
seconds when the last-embers timer expires. Embers have a **Burns companion
moons** checkbox, available only when they are fixed and lethal. Switching
motion or turning off lethal clears that flag in the same undoable edit.
Imported JSON with an invalid combination is rejected by validation.
Choose **Select** to move an element and inspect its properties; **Wall** and
**Erase** paint continuously with a 1, 2, or 3-unit grid brush. Adjacent paint
merges into exact wall regions without filling bends or holes; Erase cuts only
the brushed area and can split a wall. **Line** lays a polyline through tapped
vertices; Finish line, double-click, or Enter commits it as one undoable wall,
while Cancel line or Escape discards the preview. Select a line to drag the
whole shape or its point handles and edit thickness and point coordinates in
Selected properties. The shared compiler turns each segment into a rotated
wall with overlapping joints, collision, shadows, and a minimap outline. The
inspector reports the 300-piece compiled wall budget. Start and Exit
are unique movable markers. The element menu includes embers (fixed, chasing,
or orbiting), sound gates, directional impulses, timed stillness and eclipse,
light pickups and dimmers, and paired transport portals. The inspector edits
level bounds, light and well rules, and every selected element's values. Pan,
zoom, fit, undo, and redo support larger rooms. On narrow screens, **Properties**
opens the inspector drawer.

For an orbiting ember, the editor draws its orbit, center, starting body, and
direction. Select the moving body or the center; clicking a shared center
cycles through bodies. The inspector uses **Seconds per revolution** while the
version 1 JSON keeps linear speed, and changing the orbit radius preserves a
finite period. Direction can be clockwise or counterclockwise; older JSON
defaults to counterclockwise. The **Orbit ring · 3 embers** palette option places
three separately editable embers with 120-degree phase spacing in one undoable
action. An out-of-bounds ring or a body initially on Start/Exit is rejected.

The draft saves in this browser's local storage after edits; **Save draft**
also shows save status. **Export JSON** downloads a normalized version 1 level
document. **Import JSON** validates a file before replacing the draft, leaving
the current work in place if the file is invalid. Invalid drafts remain
editable, with errors shown and Playtest/Export disabled until fixed.
**Playtest** compiles a snapshot into the same bounded campaign physics. Its
header and result card return to the editor with draft, selection, view, and
undo history intact. Playtests do not update campaign completion or best-gate
records. The document keeps the required exit separate from transport pairs;
interior walls are editable while the four perimeter walls derive from bounds.
The two shipped campaign levels are version 1 JSON files in `src/levels/` and
use this same compiler and mixed-entity runtime. Gallery studies keep their
own experimental rules.

## Infinite Play

Home's **Infinite Play** accepts a seed (up to 64 Unicode characters) or offers
a random one. Generation 2 adds two collectible companion moons, larger heavy
neighbors, and pairs of orbiting embers in several seeded encounter arrangements.
The moons gather light, can be sacrificed for an ember rescue or four more
seconds in last embers, and can burn out against the fixed heavy neighbors.
A seed and stage reproduce the same 96 × 54 room within this generator version,
including three optional sound gates, three authored recharge embers, and short
interior walls. Existing seed links now produce generation 2 layouts; exported
JSON freezes an exact level independently of future generator updates.
Its generated room uses the same version
1 document compiler, physics, follow camera, minimap, light meter, and result
art as Campaign. The generator reserves a wide, gently bending route and
verifies a margin-clear path to the exit using each orbit's full swept envelope;
this geometric check does not prove a gravity-driven route is physically easy.
A deterministic fallback retains companions and a simple encounter if attempts
fail. Difficulty rises gradually through the first ten
stages. Stage numbers are capped at 1,000,000.

**Retry** regenerates the same seed and stage and resets the attempt's light,
wells, and gate pattern. A successful **Continue** advances one stage. The
result shows the seed, stage and generator version, offers a shareable `?infinite=<seed>&stage=<n>`
link, and can load that generated document into the editor for changes. This
explicitly replaces the current editor draft as one undoable step; it does not
write campaign completion or gate records. Generated levels use only authored
recharge embers rather than periodic random spawns.

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
`/orbit-lab/?demo=drift`, `satellites`, `slingshot`, `gate`, `maze`, `orbit`,
or `companion`.

- **A gentle curve:** an open room for temporary-well steering.
- **A little gravity:** the hero attracts three loose moons. Set Dot gravity
  to zero in Settings to compare. The moons also respond to player wells.
- **Close to the flame:** a stronger fixed ember and a barrier explore hazard
  slingshots. Its core is still fatal.
- **Bring a moon:** move the gold moon onto the gold ring to latch a gate open.
- **The winding room:** the original maze remains as a reference.
- **An orbital sketch:** the original wall-free orbit experiment.
- **A companion returns:** one owned moon follows the dot in an open room. A
  nearby well can borrow its orbit; it returns smoothly as the well fades.

The hero has mass 1 and each moon mass 0.08. Dot gravity defaults to 12 in the
moon studies and is adjustable from 0 to 30. Attraction is softened; moon and
hero forces are equal and opposite, so the hero never accelerates itself.
The portal and hazards remain fixed. Trajectory prediction is disabled in
moving-moon studies rather than pretending their trajectories are static. The
companion study uses its own soft orbital steering and does not apply the
reciprocal Dot gravity used by the older moon studies. Collection, extra life,
and resource effects remain outside this first companion experiment.

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
