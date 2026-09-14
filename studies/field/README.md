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
