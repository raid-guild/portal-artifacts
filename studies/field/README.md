# FIELD — Interior verification

Standalone spatial horror demo. Published at `/field/` on the portal-artifacts Railway service.

## Edit and run

The canonical, buildless HTML, CSS, Three.js modules, models and audio live in `../../public/field/`. `dist` is a symlink there so the retained tests and Blender scripts use the same source. No Sites account or build step is needed. Fonts and dependencies are served locally under the host CSP.

From this directory run:

```sh
python3 -m http.server 5173 --directory ../../public
node tests/maze-core.test.mjs
node tests/check-flow.mjs
node tests/tutorial-actions.mjs
node tests/atmosphere.test.mjs
```

Open `http://localhost:5173/field/`. Use WASD, Shift to run, E for doors, C to crouch, M for the map and V for sound. Type GOD for the debug destination picker.

Editable Blender files are in `outputs/`. Regeneration scripts in `tools/` derive paths from their own location; run them with Blender Python using `runpy.run_path` and the absolute script path. Runtime audio includes the user's original office-doom track converted to MP3.

## Publish

Commit this repository and push to GitHub. Deploy the repository root to the existing portal-artifacts Railway service using its Dockerfile and Caddyfile. Keep all other published demo paths intact.

Migrated from FIELD Sites source commit `7029d414dc24e76f164054dbe8867e5abb7ebb96`. The previous Sites deployment remains a historical copy.

## Second look / Goatman

A stationary Blender model (`outputs/FIELD-goatman.blend`, reproducible with
`tools/create_goatman.py`) exports to `public/field/assets/goatman.glb`.
Natural encounters are seeded, begin at facility index 7 (facility 8), and use
selected full-width long corridors. Walk past the dark stretch while looking
forward, then turn back. Approaching dissolves the silhouette between 19 and
11 meters; looking away removes it. No animation, sound cue, pursuit or collision.
The controller keeps only one encounter and a depth high-water mark, so revisits
do not replay it and memory stays bounded.

GOD → **Second look / Goatman** → **Go to facility / find room** places the player
in an armed hallway facing away. Turn around to test. Mobile GOD remains hidden
behind five quick taps on SURVEY CONTROLS in Menu.

Run `node tests/second-look.test.mjs` from this directory for seeded eligibility,
visibility, distance fade, revisits and corridor clearance checks.

### Fur and recessed-eye revision

The approved editable revision is `outputs/FIELD-goatman-fur.blend`, scene
`Goatman_GLB_Inspection`. It includes the slender shape keys, rounded shoulders,
recessed sockets and red emissive eyes. `tools/export_goatman_fur.py` evaluates
those edits in an isolated export scene and bakes the fur color/normal atlas.
The GLB contains four material groups and embedded textures; the runtime clones
these materials, preserves the textures and eye emission, and applies the same
faint encounter opacity/fade to all groups. The original `create_goatman.py`
remains the untextured base model generator, not the approved revision exporter.

## Camera room

Seeded camera rooms can appear after facility 7, among the regular office rooms.
They contain one central CCTV stand or three corner stands. The camera heads pan
and tilt slowly toward the player while they are in the room; tiny red indicators
blink independently. These are simulated props, with no device camera access.

GOD → **Camera room** → **Go to facility / find room** jumps to one for testing.
The Blender source is `outputs/FIELD-surveillance-camera.blend`; reproduce it with
`tools/create_camera.py`. The runtime asset is `public/field/assets/surveillance-camera.glb`.

Run `node tests/surveillance.test.mjs` and `node tests/camera-asset.test.mjs`
from this directory to check layouts, stand collisions, tracking, blinking,
exported lens direction, world offsets, crouching and material cleanup.

## Nursery / Facility 009

Facility index 8 is always a 10 × 10 m nursery, including after hidden revisions.
Two cream cribs, a moss-green recliner and scattered blocks sit on a whole-room
vertex-colored grass floor with dirt patches. Three framed photographs use UV
windows into the supplied reference, preserved in `references/nursery-family.png`.
The photograph is packed into the GLB; no external image request is required.

GOD → **Nursery / Facility 009** jumps directly to this room regardless of the
search-from field. Furniture collision preserves a clear central path and the
exit doorway. `tools/create_nursery.py` generates the asset library and a staged
Blender study at `outputs/FIELD-nursery.blend`.

Run `node tests/nursery.test.mjs` and `node tests/nursery-asset.test.mjs` from this
directory. The latter checks exported geometry and runtime assembly without
image decoding; the photographs were visually checked in the Blender render.

The nursery loops the user-provided `nursery-doom.wav`, encoded as
`public/field/assets/nursery-doom.mp3` for browser playback. It has its own wall
music channel, with the existing distance falloff, low-pass muffling and stereo
positioning. Office rooms continue to use `office-doom.mp3`; both follow the
shared sound toggle and pause state. `tests/atmosphere.test.mjs` covers routing.
