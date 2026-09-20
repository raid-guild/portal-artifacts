# Traveler animation — first pass

Created September 19, 2026 using the built-in image tool in reference-image editing mode. The approved [standing traveler](../../public/art/traveler-idle-v1.png) supplied character identity and costume. The side atlas also served as a reference for the front and back views. Original concepts and the old standing asset remain unchanged.

| View | Original generated atlas | Exact prompt |
| --- | --- | --- |
| Right / side | [PNG](../../public/art/sprites/traveler-right-v1.png) | [Prompt](traveler-walk-right-v1.txt) |
| Front / approaching | [PNG](../../public/art/sprites/traveler-front-v1.png) | [Prompt](traveler-walk-front-v1.txt) |
| Back / receding | [PNG](../../public/art/sprites/traveler-back-v1.png) | [Prompt](traveler-walk-back-v1.txt) |

Each output is a transparent **1254 × 1254 RGBA PNG**, despite the requested 2048 × 2048 size. Each contains eight poses in four columns and two rows: idle, six walking poses, and a spare idle. Runtime frame indices are 0 for idle and 1–6 for walking; frame 7 is unused. Left-facing poses mirror the right atlas.

## Rendering and reuse

Open `/sprites.html` on the local server to compare all four directions, pause motion, show standing poses, and adjust playback speed. The game uses the same renderer.

The generated strides do not fit a perfectly uniform grid. Some bounding boxes cross neighboring cells. `scripts/measure_sprites.py` reads connected alpha silhouettes and writes per-pose bounds, head-centered horizontal anchors, ground baselines, and outline clips into `src/sprite-data.json`. It does not edit image pixels. `src/traveler.ts` draws from the preserved source atlases using those clips, avoiding chopped boots or fragments of neighboring poses.

To replace an atlas: preserve this version, generate a new reference-based image, update the filename in the measurement script, then run `python3 scripts/measure_sprites.py` (requires Pillow). The script expects eight disconnected full-body figures arranged in two rows. Review the resulting animation before accepting it. Run the build and tests afterward.

Walking advances every 110 ms through six frames. Movement direction is selected using scene-space distances, so unequal scene width and height do not skew turns. The traveler faces interaction targets on arrival and returns to the appropriate standing pose. Reduced-motion mode updates position and facing immediately without the walk cycle. Direction and animation phase are transient; existing saves remain compatible.

## Review and remaining polish

- The generated poses visibly change knees, boots, arms, and cape. They preserve the coral cape, cream tunic, teal trousers, dark hair, and ochre satchel.
- This is a first animation pass: some garment/satchel details vary between frames. Mirroring also swaps the satchel side. Separate left and diagonal sheets can follow if needed.
- Rook remains part of the background artwork. These sheets animate the traveler only.
- Browser checks inspect changing lower-body pixels during all four movement directions, check canvas edges for clipping, and verify standing on arrival and reduced-motion behavior.
- Review screenshots: [direction comparison](../qa/traveler-directions.png), [traveler in the room](../qa/traveler-in-room.png).
