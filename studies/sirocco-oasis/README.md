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
- **Ship view** approaches Morrow, the ring-shaped water harvester. Run the five-stage work order from the panel or physical controls. **Control room** takes the operator’s seat; the field receiver is audible only there. **Vista** returns to the landscape; harvesting and deliveries continue. Your shift and quota are saved in this browser.
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
- `public/models/` — 14 separate GLB assets: basin, three palms, two bushes, spire, mesa, boulders, agave, airship, harvester, lift balloon, and control room.
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

`blender/harvester.blend` and `blender/build_harvester.py` contain the editable barge. The engine is mounted beside the wheelhouse, clear of the balloon cradles. `blender/control-room.blend` and its authoring script contain the cabin console and receiver housing. Physical runtime buttons, displays and dial drive the same state as the HTML panel.

Every batch requires five manual starts, with no automatic progression:

1. Open intake — 8 seconds.
2. Prime lines — 12 seconds.
3. Fill reservoirs — 60 seconds at 1×; adjustable from 0.5× to 1.5×.
4. Seal and pressure-test — 15 seconds.
5. File dispatch — 10 seconds, then launch up to three balloons.

The current stage can pause/resume. On the console, press the illuminated stage button or the pause switch; click the rate dial to cycle its settings. The physical console is inside the cabin; Ship view uses the operator panel. The quota is **1,000 delivered vessels**, credited on arrival at the moving airship, with the final consignment limited to the remaining capacity. At 1× there are at least 334 cycles and about 9.7 hours of operation, plus operator delays. Up to nine vessels can be airborne.

The current stage, elapsed operation, fill, rate, deliveries and flights are stored under `sirocco.morrow.v2` in localStorage. Save occurs on actions, stage changes, deliveries, every five simulation seconds, and when leaving the page. Work pauses when the page is hidden/closed; there is no offline production. Reloading resumes the saved shift. Storage is local to this browser and origin, not an account or shared multiplayer quota. If storage is unavailable the panel reports session-only operation.

The cabin radio plays the three user-supplied songs: **01 Pump Man**, **02 Mesa Jam**, and **03 Oasis Vibes**. Browser copies are 192 kbps MP3 files in `public/audio/radio/`; the original WAV files are unchanged. Tap its display to change station and its lower minus/plus zones to change volume. Accessible sliders are in the fold-out Operator panel. It starts silent and pauses immediately outside the control room or when the page is hidden. These tracks belong to the oasis; the walker radio retains its existing playlist.

Run `node tests/harvest-state.test.mjs` from this study to check every manual gate, pause/resume, saved mid-fill and mid-flight state, bounded flights, full quota completion and the one-vessel final dispatch. The barge is approximately 11% of the lake’s width. The cabin uses a fixed seated camera. Switching to or from the cabin is an instant cut; return to Deck to orbit.

## Splash animation

`src/splashes.js` stages a hollow twelve-point crown, outward ballistic droplets, a delayed central jet, a detached tip droplet, and a return wave. It is an art-directed approximation, not a Navier–Stokes fluid simulation. Five reusable splash slots and 125 instanced droplets bound rapid-tap costs; crown/jet geometry is deformed in the vertex shader. Shoreline clipping prevents splash sheets and droplets extending onto the sand. Reduced-motion preference retains surface ripples and omits vertical splashes.

## Recorded machinery sound

Each of the five work stages layers CC0 diesel, generator, ratchet, impact and air-release recordings. The first operator action unlocks Web Audio; there is no sound on page load. **Machinery** is a separate saved volume control, independent of ambient Sound and the cabin radio. Pausing fades the running layers; pressure-test completion vents and dispatch releases the latches. Pump rate changes diesel playback speed. The cabin muffles high frequencies and the vista attenuates the machinery with distance. Low-shelf EQ adds weight, with compression to control layered peaks. Leaving the tab suspends the machinery context.

The five short, mono recordings total about 488 KiB. Three loop seams are crossfaded offline; buffers are decoded once, with two sustained voices per stage and a cap of twelve total voices including fading layers and one-shots. `audio-source/fetch.py` and `prepare.py` reproduce the downloads and edits from the repository root (Python 3 and FFmpeg required). Temporary source recordings are kept in `work/mechanics/` during preparation.

Recording credits (CC0 1.0; also shipped in `public/audio/machinery/credits.json`):

- [Car engine — BeeProductive](https://freesound.org/people/BeeProductive/sounds/395586/)
- [Diesel Power Generator — qubodup](https://freesound.org/people/qubodup/sounds/189896/)
- [Clunky Metal Noise — Swedger](https://freesound.org/people/Swedger/sounds/170633/)
- [Air release — davidlay1](https://freesound.org/people/davidlay1/sounds/416080/)
- [Turnstile — strikingtwice](https://freesound.org/people/strikingtwice/sounds/260208/)

`node tests/machinery-audio.test.mjs` checks all five stages in Chrome: real nonzero Web Audio output, two running layers, pause, mute/unmute, room/vista mix and no runtime errors. It uses isolated browser contexts and leaves the user's saved shift untouched.
