# Chance Pint

An interactive Three.js product study for the Blender pint-glass prototype. The published static site lives at `/chance-pint/` in `public/chance-pint/`.

## Run

Requires Node 20.19 or newer.

```sh
cd studies/chance-pint
npm ci
npm test
npm run dev
npm run build
```

`npm run build` writes the production bundle to `../../public/chance-pint/`. The site has no runtime service, external assets, or third-party requests.

## Interaction

Drag the glass to orbit through a full turn in either direction and above or below it; scroll to zoom. The camera preset buttons give front, back, top, bottom, and track-focused reset views. The die controls choose d4, d6, d8, d10, d12, or d20 and either A or B print track. The pour slider changes the visible liquid and reading. A numeric seed redraws all twelve tracks; 7319 restores the exact shuffle in the Blender original. Auto spin stops on manual drag and respects the operating system's reduced-motion preference. If WebGL is unavailable, the page shows a local preview of the original Blender model and keeps the die, pour, and seed reading controls usable.

## Model and interpretation

The glass dimensions and print placement follow `model-source/build_glass.py`: 150 mm high, 54 mm foot diameter, 86 mm rim diameter, reading zone 15–128 mm. Band heights are derived from equal *interior volume* increments, then numbers are printed bottom to top. The original Blender file, render, generator, and exact JSON layout are preserved in `model-source/` and `art/` for provenance. The web glass is a procedural Three.js reconstruction so all labels and the interior pour remain interactive.

This is a concept study. A fixed printed shuffle can be memorized, and the liquid level is controlled here by a slider. No claim of cryptographic randomness or physical fairness is made. A physical version would need calibration and play testing for repeatable readings, liquid dynamics, and print legibility.

## Assets and license

Three.js is bundled locally under its MIT license (see `LICENSES.md`). DM Sans is served locally under its SIL Open Font License. The original Blender model and preview came from the user's prototype.
