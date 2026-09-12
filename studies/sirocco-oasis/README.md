# Sirocco — a desert reverie

An interactive Three.js landscape with original models authored in Blender through Blender MCP. Inspired by the supplied painted oasis.

## Run

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a deployable static build, run `npm run build`; the complete browser application is in `dist/`. Serve it over HTTP, rather than opening index.html as a file.

## Explore

- Tap or click the pond for a crown splash, airborne droplets, a Worthington-style central jet, and overlapping return ripples. The water reflects the splash and surrounding landscape.
- Drag to orbit. Scroll or pinch to approach.
- **Ship view** approaches Morrow, the ring-shaped water harvester. Start/pause its pumps, adjust the pump rate, then release three full lift balloons toward the moving airship. **Vista** returns to the landscape; harvesting and deliveries continue. Delivery counts reset when the page reloads.
- **Drift** starts a slow camera journey. Dragging stops it.
- **Sound** enables a synthesized wind bed and soft water notes. Audio is off until requested.
- **Reset view** returns to the responsive opening composition.
- **H** hides or shows the interface; **Escape** restores it.
- Focus the scene and press **Space** for a central ripple; left/right arrow keys adjust the orbit.

## Atmosphere controls

The translucent top-right panel collapses to its title and starts collapsed on phones.

- **Time of day:** 00:00–24:00; adjusts sky, sun position, lighting, fog color, stars, and water brightness.
- **Sandstorm:** 0–100%; six large procedural rolling cloud sheets and distance haze.
- **Wind:** 0–100%; controls palm sway, cloud drift, and sand-cloud advection. At zero, wind-driven motion stops.
- **Texture / grit:** 0–100%; static screen grain plus antialiased close-up ground grain.
- **Ripple strength:** 0–200%; scales the crown, jet, droplets, and surface ripples, previewing the effect as adjusted. At zero, the impact effect is suppressed.
- **Restore sunset:** restores all five controls without moving the camera.

Sand sheets are skipped at zero storm and excluded from the reflection pass to keep GPU cost bounded. Grain uses one transparent screen pass without another render target. Settings are temporary for the current page session.

## Files

- `src/main.js` — layout, instancing, toon palette, sky, reflection/ripple shader, wind, dust, clouds, airship path, camera, and synthesized audio.
- `src/style.css` — responsive overlay controls.
- `public/models/` — 13 separate GLB assets: basin, three palms, two bushes, spire, mesa, boulders, agave, airship, harvester, and lift balloon.
- `blender/oasis-assets.blend` — editable original models in a dedicated asset scene. The preexisting Blender scene was preserved.
- `blender/build_assets.py` — reproducible asset-authoring script. Paths resolve relative to the Blender scripts; no machine-specific directory is needed. Run in Blender with a window context or via the interactive MCP.
- `blender/palm-preview.png` — prototype render inspected before assembly.

The scene merges asset primitives by material and instances vegetation and scattered stones. Water uses one plane with a planar reflection target (512px on small screens, 1024px on desktop) and ten reusable ripple slots. No external model or texture downloads are required. Typography uses system font fallbacks, with no external font requests.

## Scope and performance

The airship follows a slow looping path. Camera movement is constrained to the composed vista, with a close orbit around the harvester. This is a stylized scene, not an open-world simulation. Reduced-motion preference disables autonomous airship, foliage gust, cloud, and dust motion; deliberate camera controls and water interactions remain available.

Chrome desktop rendering and interaction checks are included in the development verification. Performance depends on the device and WebGL2 support; a physical low-end mobile GPU has not been benchmarked. The harvester and reusable balloon add approximately 2.4 MB of GLB data before transfer compression. Material batching keeps their draw calls low.

## Portal Artifacts deployment

Published at `/sirocco-oasis/`. Build and copy from the repository root:

```sh
cd studies/sirocco-oasis
npm ci
npm run build
cd ../..
mkdir -p public/sirocco-oasis
cp -R studies/sirocco-oasis/dist/. public/sirocco-oasis/
```

The existing Caddy/Railway service serves the checked-in public build. Keep this stable URL. The Blender files remain in `studies/` and are not publicly served.

## Water harvester

`blender/harvester.blend` and `blender/build_harvester.py` contain the editable model and reproducible authoring script. `src/harvester.js` handles vessel motion, reservoir inflation, pumping rings, and deliveries; `src/harvest-state.js` owns the bounded batch state. Three balloons fill in 18 simulation seconds at 1× pump rate. At most nine vessels can be airborne. Departures are staggered and target the live airship position. The barge is approximately 11% of the lake’s width; Ship view has its own orbit limits and responsive framing.

Run `node tests/harvest-state.test.mjs` from this study to check pause/resume, capacity, delivery timing, repeat cycles, and flight bounds.

## Splash animation

`src/splashes.js` stages a hollow twelve-point crown, outward ballistic droplets, a delayed central jet, a detached tip droplet, and a return wave. It is an art-directed approximation, not a Navier–Stokes fluid simulation. Five reusable splash slots and 125 instanced droplets bound rapid-tap costs; crown/jet geometry is deformed in the vertex shader. Shoreline clipping prevents splash sheets and droplets extending onto the sand. Reduced-motion preference retains surface ripples and omits vertical splashes.
