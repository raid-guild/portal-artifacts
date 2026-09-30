# Ragdoll Lab

The canonical buildless HTML, CSS, JavaScript, GLB, fonts, and vendored libraries
live in `../../public/ragdoll-lab/`. The `dist` symlink points there so the retained
physics tests exercise the published source. No package installation is needed.

## Preview and test

From the repository root:

```sh
python3 -m http.server 5173 --directory public
```

Open `http://localhost:5173/ragdoll-lab/`. From this study directory, run `npm test`.

Plinko drops one ragdoll onto fifteen targets arranged down a shallow vertical
board. Targets stay mounted until struck; released ragdolls can knock the next
rows loose. Use Drop/Pause/Resume, Reset board, and Frame board. Board grip controls
the walls; Impact boost adds a downward/sideways kick per struck target. Set it to
zero to watch a cascade driven by natural collisions alone.

Bowling launches one ragdoll down a long slide into ten targets. Targets hold their
starting pose until struck, then participate in the same physical simulation.
Use Launch/Pause/Resume, Reset to rerack, Overview/Follow, and drag a visible limb.
Drop and Stairs retain the smaller experiments. Character selects Goatman or
Mannequin. Gravity ranges from 0–20 m/s² across all scenes. Bowling’s Impact boost
adds one upward/outward kick per struck target; zero keeps natural collisions.
Slide grip and floor grip control separate surfaces.

On phones, Drop or Launch and Reset stay visible; Settings opens a scrollable drawer.
Touch Camera mode orbits and zooms; Grab mode pulls a body without orbiting.
Display → Show render FPS enables a rendering-speed badge on any screen.
Display → Graphics quality → Low reduces 3D resolution, disables shadows, and
caps rendering at 30 FPS. The choice is saved in this browser; physics timing and
the current simulation are preserved when switching quality.

All runtime dependencies and fonts are served from the same origin under the
existing portal-artifacts Content Security Policy. This artifact uses no keys,
Portal credentials, cookies, private APIs, or external runtime requests.

## Physics implementation

See [implementation notes](IMPLEMENTATION.md) for engine versions, friction
normalization, constraint and sleep behavior, and the focused regression suite.
Friction remains a gravity-based approximation; the application fixes the
engine's per-contact impulse scaling so intermediate grip values are useful.

## Editable Goatman

`outputs/goatman-rigged.blend` contains the rigged copy of the approved FIELD
Goatman, retaining its baked fur and red eyes. The GLB uses 13 deform bones and
blended joint weights. Fingers follow the forearms; horns follow the head.
Collision shapes simplify the silhouette, especially horn tips and fingers.

To regenerate from the original FIELD source in this repository, run
`tools/rig_goatman.py` using Blender Python (`runpy.run_path` with its absolute
path). It appends the approved FIELD source into a separate scene, matches baked
runtime vertices to that source, assigns weights, and writes the rigged GLB,
physics profile, and editable Blender copy. It does not modify FIELD's files.

## Publishing

Commit this repository and push the branch to GitHub. The existing Railway service
publishes `/ragdoll-lab/` after the branch is merged into `main`. This study does
not change the deployment service or other artifact paths.

The development copy is also published privately with Sites. Portal's public
runtime source does not include Sites hosting metadata or credentials.
