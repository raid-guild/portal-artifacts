# Ragdoll Lab

An interactive Three.js study of passive ragdolls. The default Plinko scene drops one character through fifteen targets arranged in five rows; Bowling, Free drop and Stairs remain available. Goatman is a skinned GLB driven by 13 rigid bodies and 12 cone twist joints; the visible-collider mannequin is selectable. Plinko uses one shared physics world with 16 independent rigs, 208 bodies and 192 joints. Bowling has 11 rigs, 143 bodies and 132 joints.

Run locally:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Run `npm test` for the physics stability and reset checks. There is no package installation or build step: `dist/vendor` contains Three.js 0.186.1, OrbitControls 0.186.1, and cannon-es 0.20.0 with their licenses.

The Goatman physics profile is `dist/assets/goatman-ragdoll.json`; its rig and skin are in `dist/assets/goatman-rigged.glb`. Each named bone follows its matching physics body through a cached rest-pose offset. Triangle skin weights select the body when dragging the character. If the asset fails to load, the mannequin remains usable.

Both characters use simplified box, sphere and capsule-like collision shapes. Goatman colliders cover the main limbs and torso, not horn tips or fingers. Cone twist constraints approximate motion rather than anatomical hinges. The joint slider scales each constraint's cone and twist angles. The simulation runs at a fixed 120 Hz step, with frame delta capped to avoid large jumps after a hidden tab returns.

On Plinko, gravity alone drops the top ragdoll. Fifteen targets are held in place until a released ragdoll actually hits them; each target can then free others. The board has physical sides, back, floor and transparent front guard. The mounting rings are visual guides, not hidden pegs. Impact boost adds one bounded downward and sideways change to the struck target's whole body, while zero keeps the natural collision. The Released count reports real contact releases. Frame board restores the full-board camera.

On Bowling, the launcher lies feet-first above the slide and gets one small starting velocity. Gravity and contact friction drive the rest. Ten standing targets are held as kinematic bodies until a moving ragdoll actually contacts them; released targets can free others. A real moving ragdoll impact also gives the newly released target one coherent upward and outward kick. Impact boost scales that kick; zero keeps the natural collision. It never fires from a floor collision or a manual drag. The pin count reports released targets, not a visual scoring guess. Overview frames the course; Launch switches to Follow, and orbiting cancels Follow.

The Floor grip slider controls the deck, stairs and flat ground; the scene-specific grip slider controls the Bowling ramp or Plinko board walls. A small `TimeStepFrictionSolver` adapter corrects cannon-es friction bounds from force units to impulse units and divides a contact pair's budget across its contact points. This makes the sliders physically progressive at the fixed timestep without modifying the vendored engine. High Slide grip can intentionally stop the launcher before the rack.

Gravity is adjustable from 0 to 20 m/s² in every scene and takes effect immediately on released ragdolls. Impact boost is available in Plinko and Bowling and ranges from 0 to 2×. Both settings persist through reset, scene, and character changes.

The optional `document.modelContext` integration registers a configure/reset tool in browsers that support WebMCP. Ordinary controls work without that API.

On narrow screens, Launch, Reset and Settings stay beside the full-height viewport. Settings opens the same controls in a native dialog. Touch starts in Camera mode for orbit and pinch zoom; Grab mode pulls a touched body and ignores empty-space drags. A second finger cancels a grab until both fingers lift. Mouse picking on desktop keeps its direct drag behavior. The Display setting can show actual rendered frames per wall-clock second; the FPS readout continues while the physics simulation is paused and resets its sample after tab visibility changes.

Graphics quality has Standard and Low settings. Standard keeps the current resolution and shadows. Low renders at reduced resolution without shadow passes and caps drawing at 30 FPS; simulation stepping and camera interaction continue on every animation callback. The preference is saved locally when browser storage is available, with Standard as a safe fallback.
