# Water Collection Station art

Illustrations generated with the built-in ImageGen tool on November 25, 2026. No API/CLI fallback was used. The takeoff film was supplied by the game creator and optimized with FFmpeg. These are project assets; runtime code does not depend on the generator's output directory.

| Asset | Saved location | Native size |
| --- | --- | --- |
| Maintenance-deck background | `../public/collection-station.webp` | 1672 × 941 |
| Artificer walking sheet | `../public/sprites/artificer.png` | 1774 × 887, RGBA |
| Artificer frame metadata | `../public/sprites/artificer-frames.json` | Four columns, two rows; actual cell bounds |
| Artificer portrait | `../public/sprites/artificer-avatar.png` | 1254 × 1254, RGBA |
| Airship takeoff film | `../public/cinematics/collection-airship-takeoff.mp4` | 736 × 400, 24 fps, 10.04 seconds |
| Takeoff poster | `../public/cinematics/collection-airship-takeoff-poster.webp` | 736 × 400 |

The background was encoded as WebP without changing its native pixel dimensions. The transparent sheet and portrait retain the generated pixels and alpha. Frame metadata uses the native sheet dimensions rather than assuming 256-pixel cells. Frames 0–3 face right, and 4–7 face left, matching the existing game animation convention. The default generator originals remain preserved.

## References

- Existing Dune Relay `../public/river-boat.webp`: illustration style and deck perspective.
- The creator's supplied Field Guide airship screenshot: vessel and collection architecture. Original concept: `../../raidguild-field-guide/art/raid-spherical-airship-concept-v1.png`.
- Sirocco's `../../../public/sirocco-oasis/sirocco-social.png`: oasis, desert and balloon atmosphere.
- The creator's supplied Artificer reference: existing character identity. Original art: `../../raidguild-field-guide/art/artificer-louchi-v1.png`. “Louchi” identifies the art style/provenance, not the character's name.
- Existing `../public/sprites/skiff.png`: sprite-sheet layout and walking phases only.

## Final prompt set

### Background

Use case: illustration-story. Asset: finished 16:9 wide browser-game chapter background, ideally 1920x1080. Generate a new Water Collection Station scene. Reference 1 is the exact Dune Relay ink-and-watercolor game art style, perspective and rendering fidelity. Reference 2 supplies the peach round airship design, timber decks, brass machinery, ropes and collector architecture; ignore its labels/UI/cutaway framing. Reference 3 supplies the second oasis atmosphere, turquoise basin, desert mesas and rounded balloon silhouette; retain Reference 1's illustrated style, not low-poly 3D. View from a broad stationary wooden maintenance platform at this smaller desert oasis, underneath and alongside a moored peach canvas airship. The peach balloon canopy and curved ribs dominate the upper left and middle; brass cooling coils, hanging condensation nets with pearly droplets, glass reservoirs and gutters run along the left and right margins and far railing. Beyond: turquoise oasis water, palms, sandstone mesas, and a distant hill with two small landing towers. Warm soft morning light with pale mist. Crucial gameplay composition: the lower 40 percent is a continuous broad open walkable deck with a readable floor and room across it for ten separate interaction points; keep the lower middle uncluttered and open standing space around 58 percent width/76 percent height. Rich equipment is at the margins/back, never a barrier across the foreground. Close enough to feel on the maintenance deck, not a distant aerial view of the entire globe. Entire image full bleed. No people, no characters, no baked-in labels, numbers, markers, UI, logos, watermark or text. Preserve elegant detailed ink outlines and warm painted storybook materials.

### Walking sheet

Use case: illustration-story, production 2D game walking sprite sheet. Generate the Artificer from Reference 1, preserving the distinctive ivory skull-like beaked mask with backward spines, dark eye socket, gray mechanical limbs and claw hands, rust-red long scarf/cape, weathered ivory work coat, dark violet work trousers, brass articulated feet, leather tool belts and mechanical backpack. Reference 2 is ONLY the game sprite-sheet layout, scale and walking phases; do not copy its otter character. Output genuinely transparent background, ideally 1024x512 wide 2:1, eight full-body sprites arranged EXACTLY 4 equal columns x 2 equal rows. Each sprite fits in its own square cell with clear transparent separation. TOP ROW: four right-facing walking cycle frames (neutral/contact, forward stride, passing, opposite stride). BOTTOM ROW: same four poses facing LEFT. Identical character proportions, face, costume, tools and scale in every cell; feet on the same baseline within each cell; no clipping across cells. Frame0 right-facing neutral can serve as idle. Character carries a small brass measuring/repair instrument; keep full feet readable. Two very small brass insect helper drones hover close to the shoulders inside each cell, with slight wing/hover variation between poses, never separate full-size figures. Fine ink outlines and painted storybook material shading matching Dune Relay/Field Guide art, crisp readable silhouettes for small game sprites, not pixel art, not photoreal. No scenery, floor, drop shadow, text, labels, frame borders or extra characters. Actual alpha transparency, no painted checkerboard.

### Portrait

Use case: illustration-story. Asset: finished square transparent head-and-shoulders portrait for a small circular game avatar, ideally512x512. Reference1 is the exact Artificer identity and Field Guide ink/paint style; Reference2 is the same character's approved game sprite sheet for costume continuity. Show this nonhuman Artificer: distinctive ivory skull-like beaked mask, elegant backward bony spines, dark eye socket, gray mechanical neck and shoulder fittings, rich rust-red scarf, weathered ivory coat and brass backpack details. Close three-quarter view angled slightly right, attentive and precise, a mysterious capable engineer rather than a human face. Keep entire head, beak tip and backward spines comfortably within the central circular-safe 80 percent of the square; shoulders form a compact bust beneath. One small brass insect assistant may hover close by the shoulder inside that safe area. Crisp detailed ink outlines and warm storybook painted shading, same style as reference, readable silhouette at small UI size. Genuine transparent background around the portrait. No circular border, colored backdrop, lettering, logo, watermark or scenery. Preserve this existing character; do not invent a moth or add human skin.

## Inspection

The native walking sheet and circular portrait were checked on an opaque background in a browser to verify actual PNG transparency, framing and character continuity. In-game sizing and story-scene placement are checked separately with the chapter browser tests.

## Takeoff film

Source: creator-supplied `grok-video-84614e92-9915-404a-acfd-f7072b188b76.mp4`. The opening matches the collection deck; the closing shot approaches the Twin Towers above the clouds. The optimized 2.45 MiB copy retains the native resolution and audio, using H.264 Main level 3.1, yuv420p, 24 fps and AAC at 96 kbps. The MP4 `moov` atom precedes media data for progressive playback. An attached JPEG video stream from the source is excluded. The first-frame poster is encoded as WebP.

The chapter uses the existing film player, Skip control, replay and media-source cleanup. Its saved `collectionEnding: celebration` phase denotes this presentation; it advances to `thanks` after the film and `done` after the concluding dialogue.
