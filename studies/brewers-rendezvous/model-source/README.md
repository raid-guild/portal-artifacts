# Rendezvous miniature models

These original models were built for the Riverside Park story prototype. `build_models.py` regenerates the editable `.blend` sources and four GLBs using Blender 5.2 in a separate background process. It does not open or modify a running Blender scene.

- Characters use one common upright body design. Their `CharacterRoot` origin sits at the feet, Y is up in exported GLB, and the face points toward +Z.
- Shared animation pivots are direct children of `CharacterRoot`: `Body` at the origin, `Head` at Y 0.941, arms at Y 0.783, legs at Y 0.393. `Tail` is optional and species-specific.
- The cottonwood is about 15 units tall with a broad, high summer canopy. Its editable source keeps leaf clumps separate; the GLB joins each material into one mesh to reduce draw calls.
- All surfaces use simple matte materials so the website can apply its own lighting and toon treatment. No image textures or external assets are needed.

Run from this directory:

```sh
blender --background --factory-startup --python build_models.py
blender --background --factory-startup --python render_previews.py -- character-fox cottonwood
```
