# Ragdoll Lab

An interactive Three.js study of ragdolls that can stand after settling. The initial Free drop scene starts with one character above a flat floor. Plinko drops one character through fifteen targets arranged in five rows; Bowling and Stairs are also available. Vitalik (a stylized human) and Goatman are skinned GLBs driven by 13 rigid bodies and 12 cone twist joints; the visible-collider mannequin is also selectable. Vitalik is selected when its asset loads, unless the visitor has already chosen another character. Plinko uses one shared physics world with 16 independent rigs, 208 bodies and 192 joints. Bowling has 11 rigs, 143 bodies and 132 joints.

Run locally:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Run `npm test` for the physics stability and reset checks. There is no package installation or build step: `dist/vendor` contains Three.js 0.186.1, OrbitControls 0.186.1, and cannon-es 0.20.0 with their licenses.

The character profiles are `dist/assets/vitalik-ragdoll.json` and `dist/assets/goatman-ragdoll.json`; their matching rigged GLBs are in the same directory. Each named bone follows its matching physics body through a cached rest-pose offset. Triangle skin weights select the body when dragging the character. Either rig can load independently; the mannequin remains usable if both assets fail.

All three characters use simplified box, sphere and capsule-like collision shapes. Goatman colliders cover the main limbs and torso, not horn tips or fingers; Vitalik's hands and shoe detail are represented by the nearest limb and foot colliders. Cone twist constraints approximate motion rather than anatomical hinges. The joint slider scales each constraint's cone and twist angles. The simulation runs at a fixed 120 Hz step, with frame delta capped to avoid large jumps after a hidden tab returns.

On Plinko, gravity alone drops the top ragdoll. Fifteen targets are held in place until a released ragdoll actually hits them; each target can then free others. The board has physical sides, back, floor and transparent front guard. The mounting rings are visual guides, not hidden pegs. Impact boost adds one bounded downward and sideways change to the struck target's whole body, while zero keeps the natural collision. The Released count reports real contact releases. Frame board restores the full-board camera.

On Bowling, the launcher lies feet-first above the slide and gets one small starting velocity. Gravity and contact friction drive the rest. Ten standing targets are held as kinematic bodies until a moving ragdoll actually contacts them; released targets can free others. A real moving ragdoll impact also gives the newly released target one coherent upward and outward kick. Impact boost scales that kick; zero keeps the natural collision. It never fires from a floor collision or a manual drag. The pin count reports released targets, not a visual scoring guess. Overview frames the course; Launch switches to Follow, and orbiting cancels Follow.

The Floor grip slider controls the deck, stairs and flat ground; the scene-specific grip slider controls the Bowling ramp or Plinko board walls. A small `TimeStepFrictionSolver` adapter corrects cannon-es friction bounds from force units to impulse units and divides a contact pair's budget across its contact points. This makes the sliders physically progressive at the fixed timestep without modifying the vendored engine. High Slide grip can intentionally stop the launcher before the rack.

Auto get up is on by default. A released ragdoll must fall onto clear supported ground and remain quiet for about one second before its connected rigid bodies follow a three-second turn, arm-plant, crouch and stand animation. The standing body holds its pose until dragged or struck. Held targets, bodies still in the air, zero gravity, crowded spots and unsupported edges do not start recovery. Turning Auto get up off returns recovering or standing bodies to dynamic physics; reset clears their recovery state. This is a procedural animation of the existing colliders, not a new skeletal animation or an anatomical joint model.

Gravity is adjustable from 0 to 20 m/s² in every scene and takes effect immediately on released ragdolls. Impact boost is available in Plinko and Bowling and ranges from 0 to 2×. Both settings persist through reset, scene, and character changes.

The optional `document.modelContext` integration registers a configure/reset tool in browsers that support WebMCP. Ordinary controls work without that API.

On narrow screens, Launch, Reset and Settings stay beside the full-height viewport. Settings opens the same controls in a native dialog. Touch starts in Camera mode for orbit and pinch zoom; Grab mode pulls a touched body and ignores empty-space drags. A second finger cancels a grab until both fingers lift. Mouse picking on desktop keeps its direct drag behavior. The Display setting can show actual rendered frames per wall-clock second; the FPS readout continues while the physics simulation is paused and resets its sample after tab visibility changes.

Graphics quality has Standard and Low settings. Standard keeps the current resolution and shadows. Low renders at reduced resolution without shadow passes and caps drawing at 30 FPS; simulation stepping and camera interaction continue on every animation callback. The preference is saved locally when browser storage is available, with Standard as a safe fallback.

Vitalik's editable Blender 5.2 source, exact front/back projection guide, generated paint sheet, baked 2K atlas and bake provenance live in the accompanying study outputs. `tools/build_vitalik.py` creates only the `Vitalik_Study` scene, preserving other scenes in an open `.blend`; `tools/bake_vitalik.py` projects the approved sheet per texture pixel, continues sweater bands at side seams, bakes to the model's ordinary nonoverlapping UVs, and exports the skinned GLB. The user-provided reference photo is not bundled. To reproduce in another directory, set `VITALIK_SITE_ROOT` to this project, `VITALIK_OUTPUT_ROOT` to the directory holding `vitalik-projection.json` and `vitalik-rigged.blend`, and `VITALIK_IMAGE_SOURCE` to the generated front/back sheet; run the builder and then the baker with Blender's `--python` option. The bake source is the unbaked `.blend` produced by the builder. The final GLB embeds its atlas, so the site does not need the projection sheet at runtime.

The shoulder repair uses `tools/vitalik_weights.py`, shared by the builder and `tools/repair_vitalik_shoulders.py`. The repair changes only the connected sweater’s bone weights in an existing saved Blender file; geometry, UVs, and its baked texture stay unchanged. Run it on the baked and unbaked files in background Blender, setting `VITALIK_EXPORT_GLB` only when exporting the baked model. The exported-asset regression checks sideways and overhead arm poses.
