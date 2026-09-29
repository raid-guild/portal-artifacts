# Ragdoll Lab

An interactive Three.js study of passive ragdolls. The default Bowling scene sends one character down a long slide into ten standing ragdolls. The Free drop and Stairs studies remain available. Goatman is a skinned GLB driven by 13 rigid bodies and 12 cone twist joints; the visible-collider mannequin is selectable. Bowling uses one shared physics world with 11 independent rigs, 143 bodies and 132 joints.

Run locally:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Run `npm test` for the physics stability and reset checks. There is no package installation or build step: `dist/vendor` contains Three.js 0.186.1, OrbitControls 0.186.1, and cannon-es 0.20.0 with their licenses.

The Goatman physics profile is `dist/assets/goatman-ragdoll.json`; its rig and skin are in `dist/assets/goatman-rigged.glb`. Each named bone follows its matching physics body through a cached rest-pose offset. Triangle skin weights select the body when dragging the character. If the asset fails to load, the mannequin remains usable.

Both characters use simplified box, sphere and capsule-like collision shapes. Goatman colliders cover the main limbs and torso, not horn tips or fingers. Cone twist constraints approximate motion rather than anatomical hinges. The joint slider scales each constraint's cone and twist angles. The simulation runs at a fixed 120 Hz step, with frame delta capped to avoid large jumps after a hidden tab returns.

On Bowling, the launcher lies feet-first above the slide and gets one small starting velocity. Gravity and contact friction drive the rest. Ten standing targets are held as kinematic bodies until a moving ragdoll actually contacts them; released targets can free others. The pin count reports released targets, not a visual scoring guess. Overview frames the course; Launch switches to Follow, and orbiting cancels Follow.

The Floor grip slider controls the deck, stairs and flat ground; Slide grip controls the ramp. A small `TimeStepFrictionSolver` adapter corrects cannon-es friction bounds from force units to impulse units and divides a contact pair's budget across its contact points. This makes the sliders physically progressive at the fixed timestep without modifying the vendored engine. High Slide grip can intentionally stop the launcher before the rack.

The optional `document.modelContext` integration registers a configure/reset tool in browsers that support WebMCP. Ordinary controls work without that API.
