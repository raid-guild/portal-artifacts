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
