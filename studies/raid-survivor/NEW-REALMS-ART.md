# Desert Oasis and Frozen Highlands art

Generated with the built-in imagegen tool on 2026-10-03. The original six
floor and monster PNGs live in
this study's `public/` directory and are copied into the deployment by Vite.
Original 1254 × 1254 ImageGen output is preserved outside this repository in
`outputs/raid-survivor-new-realms-art/originals/` and the ImageGen archive.
Committed game files are nearest-neighbor reductions: 512 × 512 opaque terrain
and 256 × 256 RGBA sprites with genuine alpha. Run
`python3 scripts/optimize-new-realm-art.py /path/to/originals` with Pillow to
reproduce them. Vite copies those optimized files unchanged, and the renderer
uses nearest-neighbor filtering and mirrors right-facing sprites for leftward
movement. The runtime does not load the original monster or floor outputs.

These are original game interpretations, **not original NFT artwork**. Canonical
MonsterMaps records came from the existing Ethereum mainnet metadata export at
block 26114270, contract `0xecb9b2ea457740fbde58c758e4c574834224413e`.
Chuul and Dogmole are canonically Mountain creatures, adapted to this snowy
arena; the original metadata does not describe them as having ice powers.

## `public/terrain/desert-floor.png`

Final prompt:

> Use case: stylized-concept. Asset type: production seamless repeating ground texture for Desert Oasis realm in Raid Survivor, a retro top-down pixel-art horde shooter. Create one opaque square texture of windswept desert sand, muted ochre and dusty brown-gold with fine angular sand ripples, tiny scattered sandstone chips, very sparse dried grass. Directly overhead orthographic flat view. Genuine chunky 16-bit pixel art, hard pixel clusters, limited subdued mid-dark palette; clear enough to read as warm desert, low contrast to keep small colorful enemies and bright attack warnings legible over it. Uniform diffuse light, no horizon or perspective. Tile edges seamlessly repeat with opposite edges. No central focal point, no grid, no borders, no text, no characters, no large rocks, no water pools or palms (those are separate gameplay landmarks). No gradients or painterly brushwork. Single production tile fills image.

## `public/terrain/ice-floor.png`

Final prompt:

> Use case: stylized-concept. Asset type: production seamless repeating ground texture for Frozen Reach snow and ice realm in Raid Survivor, a retro top-down pixel-art horde shooter. One opaque square tile, perfectly repeating seamless edges. Directly overhead orthographic ground, blue-grey compacted snow and muted slate cyan ice plates, sparse angular frost cracks and small wind-carved snow streaks. Chunky 16-bit pixel art, hard square pixel clusters, restrained palette in medium-dark blue grey with small muted pale ice accents. Low contrast playable background for brightly colored enemies and projectile telegraphs. Read unmistakably as frozen snow and ice without brilliant white glare. Flat uniform diffuse lighting. No horizon, perspective, shadows from tall objects, grid, border, text, characters, rocks or large crystals (landmarks will be separate). Organic irregular all-over distribution, no centered composition or giant circular motif. No smooth gradients or painting. Production tile fills image.

## `public/sprites/monsters/deathwisp-1201.png`

Final prompt:

> Use case: stylized-concept. Asset type: one production transparent enemy sprite for Raid Survivor retro top-down horde shooter. New original game interpretation of MonsterMaps Deathwisp #1201, scrawny desert Fey with Evasive, Hop, Charge traits. Single small wiry desert fey, long bent springlike legs, pointed ears, angular amber eyes, ragged ochre hood and sand-colored wrap, dark indigo face, tiny curved claw hands, little turquoise talisman. Three-quarter front facing screen RIGHT, entire compact hunched full body visible, sprite readable at 48 pixels, grounded hopping pose. Chunky 16-bit pixel art, crisp square pixel clusters, strong 1-2 pixel style dark outline, limited sand/indigo/teal palette. One centered sprite occupying 80 percent of square canvas with transparent margin. ACTUAL TRANSPARENT BACKGROUND, no ground, no cast shadow outside body, scenery, text, frame, grid, duplicate pose, particle cloud, blur or smooth painting. Designed for horizontal mirroring. This is an invented game illustration inspired by metadata, not original NFT artwork.

## `public/sprites/monsters/buraq-83.png`

Final prompt:

> Use case: stylized-concept. Asset type: one transparent production pixel-art enemy sprite for Raid Survivor retro top-down horde shooter. Original game interpretation of Buraq #83, gigantic flying Noctiny of the Desert with Poison Breath and Resize. Draw one imposing nocturnal desert winged creature: broad batlike violet-black wings, compact sturdy sand-gold armored torso, long angular jackal/bat muzzle, turquoise eyes, small jade green throat sac glowing with poison, powerful claw feet hanging beneath hovering body, short curled tail. Three-quarter front view facing screen RIGHT, full body and wings fit inside square canvas, compact wide silhouette readable at 64 pixels. Chunky 16-bit game pixel art with hard square clusters, dark outline, limited indigo, muted gold, jade and bone palette. Centered sprite occupies80percent ofcanvas withtransparentmargin. Actual transparentbackground. No ground, outsidebodyshadow, scenery, text, grid, frame, multipleposes, projectile clouds, blur, gradients or smooth illustration. Can mirror horizontally. Creature design is a game interpretation, not canonical NFT art.

## `public/sprites/monsters/chuul-9189.png`

Final prompt:

> Use case: stylized-concept. Asset type: single composite transparent production pixel-art enemy sprite for Raid Survivor retro top-down horde shooter. Original game adaptation of Chuul #9189, Swarm of Tiny Monstrosities of the Mountains with Thorny Lash and Ethereal Jaunt, for snowy mountain arena. Draw a tightly packed cluster of THREE tiny stout chitinous mountain critters that reads as ONE compact swarm silhouette: dark navy and desaturated violet armored shells, pale bone thorn spines, small red-magenta eyes, short hooked legs, one curled thorny feeler, powder snow caught atop their shells. Three-quarter front view facing screen RIGHT, all creatures in one tight overlapping group, full body composite visible. Chunky16bit pixelart hard square clusters darkoutline, limited navy purple bone palette withsmallmagentaaccents for readability on bluegreysnow. Centered group occupies75percent squarecanvas,transparentmargin. Actual transparentbackground. No ground, scenery, text, border, grid, outsidebodyshadow, separate poses, multiple disconnected clusters, smoke or particlecloud, smoothpainting or blur. Mirrors horizontally. Game art inspired by metadata, not original NFT artwork; cold palette does not imply canonical ice powers.

## `public/sprites/monsters/dogmole-8965.png`

Final prompt:

> Use case: stylized-concept. Asset type: one transparent production enemy sprite for Raid Survivor retro pixel-art top-down horde shooter. Original game illustration inspired by MonsterMaps Dogmole #8965, gigantic Demon of the Mountains, Club and Fist, Groundbreaker, Gallop, Physical Damage weakness. One enormous low-slung stocky mole-hound demon, broad charcoal furred body, heavy shoulders, short bulldog muzzle and blunt tusks, two tiny hot amber eyes, gigantic pale stone-armored shovel fists with three thick digging claws, stout bent hind legs, two small curved stone horns, a few snow flecks along shoulders. Aggressive hunched full-body stance poised to pound the ground. Three-quarter front view facing screen RIGHT, entire compact powerful silhouette readable at64pixels. Hard square pixel clusters, chunky16bit game art, strong darkoutline, limited charcoal/brown-grey/ivory palette, amber and muted garnet accents. Single centered sprite occupies80percent squarecanvas withtransparentmargin. Actual transparentbackground. No ground, outsidebodyshadow, scenery, text, border, grid, multipleposes, particles, glowclouds, blur or smoothpainting. Horizontalmirroring compatible. Not canonical NFT art, no invented text or metadata inimage.

## Obstacle decals

`public/terrain/oasis-pool.png` and `public/terrain/ice-wall.png` were generated
with built-in ImageGen using the Desert and Ice floor art as style references.
The transparent originals were copied unchanged from the local generated image
outputs into the game. The full prompts are saved in `obstacle-prompts.json`
beside this document. The renderer scales the water and ridge artwork to the
existing gameplay colliders; their surrounding sand and snow are decorative.
These two obstacle decals are an exception to the earlier asset resize: the
runtime loads the generated 1254 × 1254 oasis and 2172 × 724 ice PNGs directly,
with RGBA transparency and nearest-neighbor filtering.

## Molten Vault and new guild heroes

`public/terrain/lava-floor.png` was generated with the built-in image generation
tool for this game. Its complete generation prompt and tool attribution are in
[`lava-art-prompt.json`](lava-art-prompt.json). The renderer repeats this opaque
basalt tile with nearest-neighbor filtering and a subdued tint so enemies and
projectiles remain visible.

`public/sprites/characters/warrior.png` and
`public/sprites/characters/tavern-keeper.png`, with their JSON frame maps and
previews, are copied from the local Raid Guild
`reference/public/sprites/characters/` source. They use the same ten-frame,
54 × 68 pixel character atlas format as the existing playable classes; they
were not generated for this expansion.

### Native Molten Vault monsters

The following transparent sprites are original gameplay adaptations generated
with the built-in `image_gen.imagegen` tool and copied unchanged into the game:

- `public/sprites/monsters/tosculi-3015.png` — Tosculi Hive-Queen #3015;
  one compact swarm silhouette rendered as a single enemy.
- `public/sprites/monsters/seahag-5413.png` — Sea Hag #5413;
  a stout breath attacker with poison and flame throat accents.
- `public/sprites/monsters/hezrou-3112.png` — Hezrou #3112;
  a colossal slithering fiend carrying a fiery greatsword.

The full prompts, tool attribution, generated filenames, and final asset paths
are preserved in [`lava-monster-art-prompts.json`](lava-monster-art-prompts.json).
The PNGs retain real RGBA transparency. The two smaller monster images are
1374 × 1145 pixels; Hezrou is 1254 × 1254 pixels.

These images are not original NFT artwork. Exact canonical sheet lines and
provenance are in [`public/lava-monstermaps-sheets.json`](public/lava-monstermaps-sheets.json),
taken from the previously captured Ethereum mainnet export at block 26114270,
contract `0xecb9b2ea457740fbde58c758e4c574834224413e`. A refresh attempt on
2026-10-04 returned HTTP 403, so no fresh verification is claimed. Canonical
names, habitats, alignments, and traits stay unchanged in the Monster Book;
their Lava roles and the new visuals are game adaptations.
