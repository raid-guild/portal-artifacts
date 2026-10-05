# Powder — Field studies

A buildless Three.js powder game study. The canonical published files live in
`public/powder-study/`; this study's `dist` symlink points there, so there is
only one runtime copy to maintain.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --directory public
```

Open <http://localhost:4173/powder-study/> in a browser with WebGL enabled.
Three.js, fonts, and artwork are served from this repository. There is no
installation, build, or live service requirement.

## Controls

Select a material, then drag across the world to paint. Right-click to erase.
The brush slider changes the radius, and the circle cursor previews its size.
Use Pause, Step, Reset, and Clear to inspect a reaction. Space toggles play,
`S` steps, `R` resets, `C` clears, `0` selects the eraser, `1`–`9`
select materials, and `[`/`]` change the brush size when the page or canvas
has keyboard focus. All controls are also clickable or keyboard focusable.

## Grow a forest

Choose **Tiny forest** to watch five supported seeds sprout into trees. To make
one yourself, place a Seed on sand, stone, wood, or an existing plant, then
bring Water directly beside it. The seed consumes one water particle and
branches upward without further watering. Painted Plant can wake in the same
way with a smaller energy budget. Each tree has finite energy and height,
mature stems cannot recharge, and terminal tips form small leaf clusters.
Fire burns plants; acid dissolves them.

## Source and tests

- `dist/simulation.js`: cellular rules, growth, and experiment arrangements
- `dist/materials.js`: material definitions and palette
- `dist/renderer.js`: Three.js texture display
- `dist/main.js`: controls, fixed simulation loop, and optional WebMCP tools
- `dist/styles.css`: responsive interface

Run deterministic simulation checks from the repository root:

```sh
node --experimental-default-type=module --test studies/powder-study/tests/simulation.test.mjs
```

The source was integrated from the completed Powder study at
`outputs/powder-study/`, Git revision `bf1b3ebbc665a6df137c0feb4efd5ae8e76bb7be`.
The simulation is a creative toy; worlds remain in the current browser session
and are not saved across reloads.

## Publish

The existing Caddy/Railway service serves `/powder-study/` after this repository
is merged to `main`. Edit the canonical files in `public/powder-study/`; no
build or copy step is required. Keep this path stable for Portal embeds.
Bundled fonts include their OFL notices in `dist/assets/fonts/`, and Three.js
includes its license in `dist/vendor/`.
