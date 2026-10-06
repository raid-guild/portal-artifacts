# Jelly Garden

Editable source for the static Portal Artifacts study published at `/jelly-garden/`.

An interactive Three.js study of springy shapes. **RaidGuild** mode turns the official mark into a glossy, bendable 3D object: pull a part of the logo, let it recover, or bounce it. **Garden** mode has three soft creatures; Peachy lands on a compressible pad. The sliders change the feel, and **Show mesh** reveals the underlying triangles. Use the mode buttons to switch studies. The scene supports pointer dragging, number keys to select garden creatures, and Space or Enter to bounce the selection.

Drag empty scenery to orbit the camera; a left drag that starts on a jelly stretches it. Right drag orbits from anywhere. **Move view** makes every drag orbit, including on touch screens and over the jelly. Wheel or pinch zooms, and **Reset view** restores the front angle independently from the physics reset. Camera movement remains available while the simulation is paused.

**Keep them up** is an optional round. Start launches all bodies in the current mode without adding a click. Click/tap a body, or select one and press Space/Enter, to bounce it; every accepted bounce adds one click. Time begins once all bodies clear the floor and ends on the first landing, even a tiny contact or an automatic rebound. Pause freezes the clock, while Reset or a mode change cancels the round. The card shows the last result and a longest-time best for each mode, saved locally when browser storage is available. Free play continues after a loss.

## Rebuild and test

From this directory, with Node 20 or newer:

```sh
npm ci
node --test
npm run build
rsync -a --delete dist/ ../../public/jelly-garden/
```

The Vite build uses `/jelly-garden/` as its base path. The copied `dist` is the published artifact; `src/` and `tests/` are the editable source. No external services, keys, Portal cookies, or private APIs are required. The mark SVG and fonts are fetched from this origin, and the RaidGuild credit links to the public Portal.

## Model

The RaidGuild mark is extruded from the official SVG, retaining its cutouts. It uses a bounded Gaussian deformation field with a damped spring at each grab site, plus a continuous squash spring for bounces. This is a responsive shape model, not a finite-element simulation of rubber. It limits the bend gradient and checks substantial mesh triangles to prevent major foldovers; very thin bevel triangles are governed by the continuous field bound. The mark compresses toward its lower contact edge so the root does not jump as it flattens. Its silhouette, support height, and rendered positions follow the same deformation. The SVG parsing, extrusion, and grab model have focused tests against the actual logo artwork.

Each garden creature uses a welded icosphere cage. Its vertices are Verlet particles joined by edge length constraints. A Loop subdivision skin renders a smoother shape from those simulated points. A grab acts on a weighted patch; outward, inward, and sideways motion have separate bounds, and invalid folded or highly strained poses are rejected. A gentle rest shape constraint approximates volume recovery; this is a surface spring model, not a tetrahedral continuum or a strict incompressibility solver. The cage solver runs on an unscaled base shape; a separate positive squash transform flattens the visible body without its edge constraints immediately restoring it. Fixed time steps, velocity damping, root support, and a continuous damped squash spring keep interactions stable. Creature centers fall, stay in contact while the body compresses, and lift off during recovery. Impact changes spring velocity rather than resizing the body in one frame. The cage, skin, face, pad, and root position render from interpolated physics snapshots. Vertex collision against another creature uses an approximate sphere, so cross-creature contact is intentionally simplified. Facial features follow weighted nearby cage vertices. The pad uses a separate damped spring and releases a visual ripple on impact.

Both studies use the same progressive compression spring. Weight creates a sustained, softness-dependent sag only while supported; airborne gravity moves the body center without deforming its cage. A contact transfers the measured incoming speed into compression, so faster falls flatten more deeply and recovery can lift the center back into the air. The spring stiffens at deep compression, and damping controls energy loss rather than forcing an exact rest height. For a garden body at the highest gravity, the test equilibrium is about 93% height at firmness 0 and 68% at softness 100; an initial fall compresses further. These are settings-dependent measurements, not prescribed animation targets. Lateral expansion is capped at 1.6 to keep an extreme pancake in frame. Impacts and quick drags create bounded signed wave packets, with crests and troughs traveling across the actual 3D surface. Contact and release events vary their direction and phase deterministically. The garden samples the same waves on its finer rendered skin. A separate delayed shape mode shears and bulges opposite sides after an impact or release, then settles; still bodies remain still. The expanding ring on the ground is a separate decorative effect. The pad integrates its own spring and weight load.

Both surfaces use Three.js physical transmission with tinted absorption, refraction, and a locally generated three-softbox environment. The logo caps gently bulge away from SVG cutouts. These shaders make the surfaces look translucent, but the underlying motion is a bounded surface and shape model, not a simulated liquid volume. Opaque facial details render after the transmissive bodies so they stay readable.

The optional browser `document.modelContext` tools expose reset and physics controls when that API is available. They call the same UI actions as a person using the page.

## Fonts and artwork

The RaidGuild stamp is the approved SVG from the standalone Jelly Garden build. The variable DM Sans Latin WOFF2 and its SIL Open Font License were copied from `public/ragdoll-lab/assets/fonts/` in this repository. The variable Nunito Latin WOFF2 and its SIL Open Font License come from the [`@fontsource-variable/nunito` 5.3.0 package](https://www.npmjs.com/package/@fontsource-variable/nunito) (upstream: The Nunito Project). Both fonts are served locally from `public/assets/fonts/` beneath this study and copied into the artifact build.
