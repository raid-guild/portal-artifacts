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

Drag the glass to orbit through a full turn in either direction and above or below it; scroll to zoom. The camera preset buttons give front, back, top, bottom, and track-focused reset views. The die controls choose d4, d6, sigils, d10, Party / Compass, or d20. D4 uses side A only; its opposite side is a RaidGuild brand face. The other dice have A and B print tracks. The pour slider changes the visible liquid and reading. A numeric seed redraws the shuffled result tracks; 7319 restores the exact shuffle in the Blender original. The Brand camera preset frames the live RaidGuild sigil without changing the selected die or reading. Auto spin stops on manual drag and respects the operating system's reduced-motion preference. If WebGL is unavailable, the page shows a local preview of the original Blender model and keeps the die, pour, and seed reading controls usable.

## Model and interpretation

The glass dimensions and print placement follow `model-source/build_glass.py`: 150 mm high, 54 mm foot diameter, 86 mm rim diameter, reading zone 15–128 mm. Band heights are derived from equal *interior volume* increments, then numbers are printed bottom to top. The original Blender file, render, generator, and exact JSON layout (including the archived B/d4 permutation now hidden behind the brand face) are preserved in `model-source/` and `art/` for provenance. The web glass is a procedural Three.js reconstruction so all labels and the interior pour remain interactive.

This is a concept study. A fixed printed shuffle can be memorized, and the liquid level is controlled here by a slider. No claim of cryptographic randomness or physical fairness is made. A physical version would need calibration and play testing for repeatable readings, liquid dynamics, and print legibility.

## Assets and license

Three.js is bundled locally under its MIT license (see `LICENSES.md`). DM Sans is served locally under its SIL Open Font License. The original Blender model and preview came from the user's prototype. The sigil path was fetched from the live RaidGuild site at `https://www.raidguild.org/images/icons/venture/ico-logo.svg`; the original bytes are archived in `art/raidguild-sigil-source.svg`, and the runtime copy changes only its fill to the live hot pink. The visual study uses the observed cream (`#efe9d7`, `#f9f7e7`), teal (`#102d2c`), and hot pink (`#ee3c78`) identity. Display headings and the branded print lane use Last Duel under RaidGuild’s license; interface copy uses DM Sans and system fallbacks.

Printed sequences repeat to keep the column densities close: d4 and d10 have 20 bands, d6 has 18, Party and Compass each have 20, sigils have 24, and d20 has 20. The sigil lane uses one original d8 shuffle slot with icons in place of numbers. The other slot is a fixed teal–gold–pink Pour Meter that reads 0–100% across the usable liquid volume and is unaffected by the shuffle seed. Each column repeats whole cycles, preserving equal numbers of bands per outcome.
