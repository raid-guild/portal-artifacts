# Chance Pint

An interactive Three.js product study for a pint glass with six ordered die lanes, four play lanes, and a RaidGuild brand face. The static build is published from `public/chance-pint/` at `/chance-pint/`.

## Run

Requires Node 20.19 or newer.

```sh
cd studies/chance-pint
npm ci
npm test
npm run dev
npm run build
```

`npm run build` writes to `../../public/chance-pint/`. All runtime assets are local.

## Glass and coaster

The glass has one fixed ordered lane each for d4, d6, d8, d10, d12, and d20. D10 is printed 0–9. Sigils, Party patterns, Compass directions, and a vertical Meter occupy four more faces; the last face carries the RaidGuild sigil. Shorter sequences repeat in full cycles for consistent density. Both meters retain their teal–gold–pink gradients in either ink finish. Each numbered lane uses equal interior-volume bands from 15–128 mm on a 150 mm glass. The foot has a separate turn meter read at the coaster pointer.

The coaster offset is a separate control from camera orbit and the foot meter. Choose a die and offset from 0 to `die − 1`. A printed value becomes a played value by modular addition: for d6, printed 6 with offset +1 plays 1; for d10, printed 9 with offset +1 plays 0. The lookup shows every printed-to-played pair for the active die, including while viewing a non-die face. The coaster never changes the printed glass.

Drag to orbit above or below the glass, scroll to zoom, use camera presets, or enable auto spin. The liquid slider previews a reading. Print ink (plum or cream) and studio (teal or cream) are independent visual choices. If WebGL is unavailable, the original Blender preview appears and the lane, pour, coaster, and studio backdrop controls still work; print ink preview is disabled because the static image cannot change ink.

## Source and limits

The original Blender `.blend`, render, generator, and layout JSON remain in `model-source/` and `art/` as an archive of the first prototype. The web study reconstructs the glass procedurally and uses a revised eleven-face print. The original shuffled layout is preserved for provenance but is no longer used in the web print.

A fixed liquid level and printed marks do not establish fair randomness. Physical band calibration, headspace, foam, and legibility need play testing. The coaster offset is a transparent mapping, not a source of randomness.

## Assets

Three.js is bundled under MIT and DM Sans/Archivo under their accompanying licenses (see `LICENSES.md`). The sigil path was fetched from `https://www.raidguild.org/images/icons/venture/ico-logo.svg`; the original bytes are archived in `art/raidguild-sigil-source.svg` and the runtime copy changes only its fill to the observed hot pink. The source design uses cream (`#efe9d7`, `#f9f7e7`), teal (`#102d2c`), and hot pink (`#ee3c78`).
