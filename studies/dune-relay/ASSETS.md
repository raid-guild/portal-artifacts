# Caravan chapter assets

New illustrations were generated with the built-in ImageGen tool, using the existing Oasis game art and the user-provided RaidGuild Field Guide as references. The delivery mission and Wayfinder are original game fiction. The guide describes the walker as a metaphor for shared people, tools, and operations.

Reference: https://portal-artifacts-production.up.railway.app/raidguild-field-guide/#longform-walker-governance-note

## Saved assets

- `public/caravan.webp`: new generated caravan background, converted to WebP.
- `public/sprites/wayfinder-avatar.png`: generated circular portrait, transparent outside the medallion.
- `public/sprites/wayfinder.png`: generated eight-frame 4×2 walking sheet; `wayfinder-frames.json` records measured frame bounds.
- `public/sprites/pennant.png`: generated fourth-symbol tile, transparent background.
- `public/kingdom.webp`: existing Field Guide artwork, converted from `guild-kingdom-concept-v2.png` on the reference site.
- `public/cinematics/oasis-awakens.mp4`: user-provided Pump House film, full 20-second duration, optimized to 960×548 H.264/AAC with front-loaded MP4 metadata, approximately 4 MB.
- `public/cinematics/oasis-awakens-poster.webp`: first frame of that user-provided film.

## ImageGen prompt set

### Caravan background

Use case: illustration-story. Asset type: production browser game walkable landscape background, widescreen 16:9. Reference 1 defines the RaidGuild desert WALKER vehicle: enormous rust-orange rounded capsule habitation pod on FOUR stout articulated hydraulic legs, curved glass cockpit at front, rooftop antennas, satellite dish, brass plumbing; render assembled exterior, NOT exploded or cutaway. Reference2 defines existing game's fine black ink contour, flat watercolor colors, Franco-Belgian desert dieselpunk linework and landscape perspective. Create new scene 'The Dune Caravan': open sunlit ochre desert with mesas, a stationary caravan of TWO these inhabited walkers receding into distance, four camels carrying teal brass water canisters, canvas shade awnings and coral wind pennants. Largest walker in right middle ground, front cockpit facing left, visibly parked, side hatch ladder and awning. Smaller walker to far left distance. Camera broad scenic groundlevel slightly elevated like existing oasis; generous pale winding WALKABLE EMPTY SAND PATH horizontally along lower 28 percent of image, no rocks or vehicles blocking foreground path. Warm peach sandstone, bright pale cyan sky, rusty vermilion walker, turquoise tanks, cream canvas, sparse sage vegetation. Detailed inviting magical engineering world. No player characters or closeup humans (game sprites layered later), no buildings resembling pump house, no UI, no lettering or labels, no borders. Wide landscape image.

### Wayfinder portrait

Use case: illustration-story. Production game character circular portrait sprite. Reference is STYLE ONLY existing Keeper avatar, create DIFFERENT person 'The Wayfinder': young adult woman desert caravan navigator, warm brown skin, short dark curly hair peeking from a coral-red wrapped headscarf, brass goggles above brow, cream travel coat over muted turquoise tunic, small triangular coral wind pennant clasp, leather shoulder strap with brass compass. Calm capable friendly expression, three-quarter face toward viewer's LEFT. Fine black ink contours and flat watercolor colors like existing Franco-Belgian dieselpunk reference. Circular cream medallion framing shoulders and head with thin brass rim, fully opaque cream inside circle and genuinely transparent OUTSIDE circle, clean isolated avatar, no text. Matching round portrait size and graphic readability. Clearly a new young character distinct from older bearded Keeper.

### Wayfinder walking sheet

Use case: illustration-story. Asset: production animated character sprite sheet, 4 columns x 2 rows of eight equal SQUARE CELLS, overall aspect2:1. Reference1 is IDENTITY, same female Wayfinder young brown skin freckles short dark curls coral headscarf brass forehead goggles cream travelcoat turquoise tunic leather compass strap coral pennantclasp. Full body add cream trousers and brown practical boots. Reference2 is exact sprite SHEET LAYOUT and fine ink watercolor gameart STYLE, not character identity. Render eight complete isolated full-body Wayfinder poses aligned same feet baseline, same scale with generous transparent spacing inside each cell. TOP ROW faces RIGHT: cell0 idlefeet together, cell1 walking leftfootforward/rightback, cell2 passingstep legsnearcenter, cell3 rightfootforward/leftback. BOTTOM ROW faces LEFT: cell4 idle, cell5 walking leftfootforward/rightback, cell6 passingstep, cell7 opposite stride. Side or slight3/4 profiles matching reference2; no front facing characters. Arms swing subtly opposite legs, coherent movement sequence. Coat and scarf same lengths in eachframe. All8framesvisible uncropped consistent character samehairfaceoutfit, no extrapeople, no gridlines, no borders, no labels. Genuinely transparent background. Precise4x2 alignedgrid.

### Pennant tile

Use case: illustration-story. Asset: single match3 tile sprite on transparentbackground. Create one clearly triangular CORAL RED WIND PENNANT attached to a short vertical brass flagpole; slightclothcurve but simple broad recognizable triangle pointing RIGHT. A tiny cream stitchline near edge, brasspole rings, darkblack ink contours, subtle flatwatercolor texture. Color coralvermilion distinctfrom tealwater greenleaf and goldgear. ReferenceWayfinderportrait styleonly, associatedpennantclasp scaledinto large readable boardicon. Icon fills squarecanvas center with generous10%transparentmargin no frame no circularmedallion no portrait no words no surroundingobjects. Crisp graphic silhouette readable at43pixels. Do notcreate multiple variants or sprite sheet. Genuinely transparent background.

## Chapter 2 salt and beacon assets

Generated with built-in ImageGen for the full Chapter 2 level sequence:

- `public/sprites/salt-crust.png`: solid, one-hit salt obstruction; future durability is game state, not a new symbol.
- `public/sprites/route-beacon.png`: unlit desert beacon prop; the game adds the completion light.

### Salt crust prompt

Use case: illustration-story. Production match3 browsergame solid OBSTACLE sprite on genuinely transparent background. Create ONE chunky SALT CRUST BLOCK, a rounded almost-square squat chunk of sun-baked ivory white crystalline salt with pale warm sandstone shadows, a few broad visible cracks, three or four tiny salt crystal points on top. It occupies a whole board square and is an obstruction, NOT a collectible gemstone or symbol. Fine dark ink outlines, flat watercolor shading and subtle paper texture matching the supplied existing game icon STYLE. Main square face faces viewer with a small top face showing thickness, very shallow3/4 perspective. Strong clear near-square silhouette readable at43pixels, warm cream almostwhite contrasts existing gold gear green leaf and teal canteen. No coolblue ice, no grass, no tileboardbackground, no UI, no lettering, no borderframe, no pedestal, no extraobjects, no multiplevariations, no shadows outside isolatedobject. Centered with8percenttransparentmargin.

### Route beacon prompt

Use case: illustration-story. Production game environmental PROP sprite, genuinely transparent background. One freestanding DESERT ROUTE BEACON, a slender dieselpunk brass-and-dark-teal signal tower about twice a person's height, tallportraitsilhouette. Three broad weathered sandstone feet support a cylindrical rust-orange and teal machinery pedestal with small wheel and brasspipes; slender metal mast rises to a protective brass cage lantern containing a pale turquoise faceted glass lens. Small coral triangularwindpennant hangingjustbelowlantern. Finial antenna tiny atverytop. Lamp UNLIT neutralblueglass, no emitted light beams because gameanimateslight separately. Reference defines fine black ink linework, flatwatercolorcolors, desertcaravan materials, handdrawn engineeringstyle. Fulltower seen threequarterfront, allfeetandtopvisible, isolated withnobackdropnosky nofloorsurface noattachedpeople noborders nolettering. Cleanreadable silhouette seenat130pixelshigh. Leave10percenttransparentmargin. No multipleobjects or variations.


## Chapter 3 River Gatehouse assets

Generated using built-in ImageGen. Saved in `public/gatehouse.webp`, `public/sprites/gatewright-avatar.png`, `public/sprites/gatewright.png` (with measured `gatewright-frames.json`), `public/sprites/key.png`, `public/sprites/salt-crust-2.png`, and `public/sprites/bridge-gate.png`. The river bridge into farmland is the chapter location; no coastal fort is used.

User-supplied caravan departure film: `grok-video-8a5c4c58-8976-4c14-820b-e4c7806cce7a.mp4`, full22-second duration, encoded native736×400 H.264/AAC96k CRF28 faststart as `public/cinematics/caravan-departure.mp4` (2.8MB), with firstframe `caravan-departure-poster.webp`.

### Gatehouse background prompt

Use case: illustration-story. Production widescreen16:9 walkable browsergame landscape, Chapter3 THE RIVER GATEHOUSE. Reference1 establishes exact fine black ink outlines and flat watercolor Franco-Belgian dieselpunk game style. Reference2 establishes geographicstory river stone bridge leading into FARMLAND, not a coastal islandfort. Create beautiful sunlit rivercrossing atedgeofdesert and greenfarmland: old ivory limestone fortified gatehouse with two modest square towers and verdigris copper roofs stands on NEAR BANK in RIGHT middle ground, an arched stone bridge extends behind it across a flowing turquoise RIVER toward patchwork wheatfields orchards hedgerows and a windmill on farbank. Weathered brass winches, counterweight chains and indigo cloth banners signal machinery awaiting repair. Large front-facing gatehouse ARCH ENTRANCE near65%width/53%height, darkempty archaperture with NOportcullisbars (gamewilladdopeninggate). Warm stone apricotshadowstealbrassrivergrass. Clear pale stone-and-sand WALKABLEPATH across entirelower25%foreground with unobstructedspace forcharacters, leading toward gatehouse, lowstonecurbs atedges. Desert mesas in farleftdistance, greenerrollinghillsfarbankright, largepalecyanskywithcreamclouds. No ocean, no seasidefort, no mainroyalcastle, no close-uppeople or playersprites, no UI no labels nolettering no borders. Detailedinviting engineeringadventure world, consistent scale/perspective with reference1.

### Gatewright portrait prompt

Use case: illustration-story. Transparent production character portrait medallion for a dieselpunk desert/river browsergame. Reference image establishes fine black ink lines, flat watercolor shading, cream circular rim and crop ONLY; create a DIFFERENT character, THE GATEWRIGHT: broad-shouldered middle-aged woman river engineer, olive bronze skin, short silver hair under indigo work cap, brass goggles above forehead, calm capable friendly expression, cream rolled sleeve shirt and indigo work apron, violet key clasp. Head and shoulders three-quarter facing slightly left. Face large and readable at48px. Same cream circular portrait rim, transparent outside circle. No text no scenery no glow. Crisp restrained flat colors.

### Gatewright walking sheet prompt

Use case: illustration-story. Production transparent SPRITE SHEET, 4 columns x2rows eight evenly spaced full-body frames, widescreen2:1. Image1 CHARACTER IDENTITY Gatewright woman portrait, image2 LAYOUT/STYLE of existing walkinggame character. Same fineblackink watercolor adventure style. Gatewright broadshouldered middleaged woman, olive skin shortsilverhair indigocap brassgoggles, creamrolledsleeves indigoapron violetkeyclasp, tanworktrousers brownb oots toolbelt. All8frames SAMEcharacter sameheight samefootbaseline within each cell. TOPROW facesRIGHT: idle standing; walkstride frontlegforward; passingstep legsclose; oppositestride. BOTTOMROW facesLEFT: idle; walkstride; passingstep; oppositestride. Clear sideview, mildthreequarter torso, arms swing naturally. Onefigure only percell fullyvisible headtofeet no overlap acrosscell, no cropping. Empty transparent background, NO grid NO shadows NO letters NO numbers NO frameborders. Each character occupies80–90% cellheight. Preserve portraitidentity.

### Violet key tile prompt

Use case: illustration-story. Asset: single match3 game tile on genuine transparent background. Violet enamel mechanical KEY with broad hexagonal bow, round hole, short thick shaft with two broad teeth, diagonal bottomleft to topright silhouette. Brass inset edge and small rivets, rich matte violet surface, fine crisp black ink contours and restrained flat watercolor cel shading, Franco-Belgian desert dieselpunk adventure style. Readable at40px, fills central80% square with generous transparentmargin. One isolated key only, no background no lettering no glow no frame no medallion no otherobjects.

### Two-hit salt prompt

Use case: precise-object-edit. Reference is the existing ONE-HIT salt obstacle sprite from a match3 game. Create corresponding TWO-HIT version: preserve rounded square footprint, ivory salt crystalline material, crisp brownblack fine ink outline and watercolor style. Make surface visibly more intact with an additional thick pale layered outer crust and a few raised polygon crystal plates. Only subtle hairline cracks, NO deep central split. Looks distinctly thicker and stronger than reference at40px. Single square salt block, flat near-top-down view, transparent background, generousmargin matching reference. No text numerals UI glow border or extraobjects.

### Closed gate prop prompt

Use case: illustration-story. Asset single transparent game environmental PROP: CLOSED PORTCULLIS for river stone gatehouse, matching reference fineblackink flatwatercolor brass dieselpunkengineering style. Only the freestanding gate grille, NO stonearch no background. Tall rectangular iron bars with ROUND ARCHED TOP, darkindigosteel verticalbars and horizontalcrossbraces, weatheredbrass hinge straps and tiny rivets, pointed lowerbarends and solid lowercrossbrace. Front facing almostflat elevation, width70%height, readable at120pixelshigh. Intended to overlay dark arched entrance then lift vertically whenbridge restored. Generoustransparentmargin, nofloor no shadows outside gate, no lettering no glow noextraobjects.


## Portal Artifacts presentation assets

- `public/dune-relay-social-v1.png` is a 1200 × 630 screenshot of the actual Dune Relay title screen for link unfurls; it is not generated concept art.
- `public/fonts/barlow-condensed-latin-{500,600,700,800}-normal.woff2` comes from `@fontsource/barlow-condensed@5.2.8` and includes its SIL OFL license as `barlow-condensed-OFL.txt`.
- `public/fonts/dm-sans-latin.woff2` and `dm-sans-LICENSE.txt` are copied from the existing Chance Pint artifact in this repository, also under SIL OFL.

## Gatehouse demo ending film

- User-provided source: `grok-video-500c359e-5a17-4a15-835f-3e169c836939.mp4` (20.041667 seconds, 736×400, H.264/AAC with an attached MJPEG thumbnail, 15,352,158 bytes).
- Published source asset: `public/cinematics/gatehouse-crossing.mp4`, 18.541667 seconds at native 736×400, 24 fps, H.264/yuv420p and AAC 96 kb/s, 3,162,068 bytes. The opening 1.5 seconds were trimmed; the inner doors open and the camera crosses toward the farmland. The attached thumbnail stream is excluded.
- Playback sequence: in-game portcullis rise → crossing film → demo thanks popup. Reuses renderer-idle gating, metadata preload, byte-range-capable hosting, Skip, and decoder cleanup.
- `public/cinematics/gatehouse-crossing-poster.webp` is the first frame of the optimized film, encoded as WebP quality 88.
- Encoding: `ffmpeg -ss 1.5 -i <source> -map 0:v:0 -map 0:a:0? -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart gatehouse-crossing.mp4`.

## Booster shop icon

- `public/sprites/jet-row.png` is a transparent crop of the existing horizontal Water Jet in `public/sprites/tiles.png`, used to display the complete icon in the pre-level shop without atlas clipping.

## RaidGuild settings stamp

`public/raidguild-stamp.svg` reuses the existing RaidGuild mark from the Portal Artifacts Field study (`public/field/assets/raidguild-stamp.svg`), recolored to the game’s pale gold. The Settings credit links to https://raidguild.org.

The same mark appears as a subtle lower-right watermark on the chapter scenery and kingdom map, anchored to the visible game frame so it stays in place across viewport sizes. It does not appear over cinematic video.

## Chapter 4 · Farmland

Generated with the built-in ImageGen tool, using the existing Gatehouse scenery and portrait treatment, the Field Guide's Druid, and the user's requested stocky leafy farmer design. The Fieldkeeper is a game adaptation of the guide's woodland Druid, not a human or a named Guild member. The farmer wears suspenders and work pants, with a round belly, leafy mane, root feet, seed pouch and field notebook.

Production assets:

- `public/farmland.webp`: new walkable farmland background, 1672 × 941, WebP quality 86 (about 566 KB).
- `public/sprites/fieldkeeper-avatar.png`: 512 × 512 circular farmer portrait; transparent outside its cream medallion.
- `public/sprites/fieldkeeper.png` and `fieldkeeper-frames.json`: 1024 × 512 eight-frame walking sheet, four right-facing poses then four left-facing poses; measured alpha bounds preserve feet alignment.
- `public/sprites/seedpod.png` and `seedpod-cracked.png`: aligned intact/two-hit and cracked/one-hit armored seedpods, genuine alpha, production-sized to 256 × 256 with Lanczos resampling.

The source Druid is visible in `../raidguild-field-guide/art/meet-the-party-twelve-louchi-v1.png` (bottom row, third column). The user also supplied a close view of that character. The Field Guide class describes a pattern reader; farming clothes, seed-ledger story, dialogue and Harvest Rhythm are game adaptations. No new matching symbol is introduced.

### Farmland background prompt

Use case illustration-story. Production background for Dune Relay browser adventure, new Chapter4 Farmland. Use attached gatehouse reference for fine black ink linework, flat watercolor color, warm sunlight, dieselpunk brass/verdigris machinery and landscape perspective. Create wide16:9 pastoral farmland beyond that bridge: river and small bridge receding at far left, rolling green terraces and golden grain, hillside town tiny in distance, cream limestone seed barn at middle right, irrigation waterwheel and teal brass sluice mechanism at middle left, canvas-covered seed stores beside barn, orchard and patchwork fields. Empty pale sandy walkable path winds across lower28percent unobstructed, branches toward barn and sluice. Landmarks distinct and well spaced for game interaction hotspots; gentle elevated groundlevel viewpoint matching reference. Verdant but still warm dry desert-edge farmland, cyan sky and cream clouds. No people, no UI, no text, no labels, no watermark. A scenic production game environment not screenshot.

### Farmer identity prompt

Usecase stylized-concept. Asset fullbody character sprite concept on genuinelytransparent background for DuneRelay. Use reference1 exact creature SPECIES as basis, reference2 fineblackink flatwatercolor game rendering. Create THE FIELDKEEPER as a FAT LEAFY FARMER GUY: short broad stocky male woodlandcreature with very round prominent belly, olivegreen barkskin, friendly broad rounded muzzle and darkeyes, thick bushy leafmane with tiny orangeberries around head/back/upperarms. He wears RUSTBROWN SUSPENDERS with brassbuckles over rolledsleeve creamworkshirt stretched over roundbelly, sturdy highwaisted fadedTEAL WORKPANTS with wide patchedknees and largepockets. Rootlike bare greenfeet with broadtoes. Smallcoral neckerchief, seedpouch/toolpouch and folding fieldnotebook onhip. No longcoat no robe no humanhair no humanface no glasses no hat, leafybody clearly nonhuman. Farmer practical earthy amiable confident, one hand resting onbelly, another near toolpouch. Mildthreequarterprofile facingRIGHT. Fullfigurevisible fromleafcrowntorootfeet, centeredwith10percenttransparentmargin. Crisp ink contours, restrained watercolor sameworldasreference. No text, no scenery, no shadow, no frame.

### Farmer walking-sheet prompt

Usecase identity-preserve. Productiongame animated walking SPRITESHEET,4columns x2rows exactly8equalsquarecells, overallaspect2:1, genuine transparentbackground. Reference1 EXACTIDENTITY samefatleafyfarmer maleFieldkeeper: olivegreen nonhuman woodlandcreature broadroundbelly, denseleafmane berries, friendlysmallroundmuzzle blackeyes, creamrolledsleeveworkshirt, rustbrownsuspenders, coralneckerchief, fadedtealpatchworkworkpants, toolpouch smallnotebook, bigrootfeet. Preserve fatbodyproportions andoutfit NOlongcoat NOhumans. Reference2 SHEETLAYOUTonly. Render8fullbodyfigures sameheight/scale feetalignedbaseline withineachcell, nooverlap. TOPROW facesRIGHT: idle; widewalk leftlegforward/rightback; passingstep legsnearcenter; widewalk rightlegforward/leftback. BOTTOMROW facesLEFT: idle; leftlegforwardstride; passing; oppositestride. Naturalarmsswing, gentlebellymovement, leafybacklightbounce. Clear sideprofile/slightthreequarter eachdirection, samecreature. Eachfigureoccupies82percentcellheight withcleantransparentgaps. Crispfineblackink flatwatercolor sameasreference1. No text no labels no grids no borders no scenery no groundshadows. Everycharacteruncropped fromleafcrowntorootfeet.

### Farmer avatar prompt

Usecase identity-preserve. Productiongame circularAVATAR for DuneRelay. Reference1 EXACTIDENTITY: sameFATleafyfarmer guy woodlandcreature olivegreenbarkskin, broadroundfriendlymuzzle blackeyes, denseleafmane orangeberries, creamrolledsleeveworkshirt, rustbrownsuspenders withgoldbuckles, smallcoralneckerchief. Createcloseheadandshoulderschestportrait withsuspendersvisible andgenerousroundneck/stockyshoulders conveying sameplumpfarmer. Threequarterface towardviewerLEFT, warmassuredgentlesmile. Nohumanface nohumanhair nohats nocloaks no spectacles. Reference2 circularportraitSTYLEONLY: creamopaqueinsidecircle thingoldrim, actualtransparentoutsidecircle. Preciseblackink, flatwatercolorcolors samegameworld, faceveryreadableat48pixels. No text, noglow, noscenery, no props blockingface. Preserveexactcreatureidentity fromref1.

### Intact seedpod prompt

Use case illustration-story. Production match3 obstacle game sprite on genuinely transparent background. ONE intact ARMORED SEEDPOD: squat oval tough chestnut-brown botanical seed husk with THREE broad weathered bronze bands around it, a tiny dry stem at top and an embossed leaf emblem in front. Recognizable organic seed storage capsule, not a metal bomb not a gear not a coconut. Broad readable silhouette fills80percent square, fine black ink contours and flat watercolor shadows same illustrated dieselpunk game style as reference. Intact tightly closed dark husk and bronze bindings, NO cracks yet. View shallow three-quarter top/front. Warm chestnut/bronze distinct from green leaves, teal canteens, gold gears. No base, no ground, no lettering, no glow, no circle no frame. Onlyoneobject isolated with10percenttransparentmargin. Readable at40pixels.

### Cracked seedpod prompt

Usecase precise-object-edit. Edit the attached DuneRelay cracked armoredseedpod sprite to be MUCH MORE OBVIOUSLY DAMAGED AT40PIXELS. Keepcenter, outerwidthheight andtopstem, chestnutbrown organichusk, fineblackink flatwatercolor style, transparentbackground. Replace subtlefinecrack with ONE HUGEOPEN centraljagged SPLIT spanning almosthalfpodwidth andtophalfthroughbottomhalf, exposing a LARGE BRIGHT CREAM GOLD SEEDCORE contrastingdarkbrownshell. Visiblytwistedbroken bronze bands: middleband splitwideopen withleafemblem broken tooneside, topband snappedgap nearfront. Two attachedhusk sides displaced slightlyoutward butstillonecoherent notdestroyedpod; retainlowerbandasbase. Mainrecognition at40px: intactisdarkbrown closed; damagedisBRIGHTPALEOPENcenter withbrokenmetal. Do notjustaddhairlinecracks. No glow, no particles, no surroundingobjects, no text, no shadowsoutsideobject. Singleisolatedsprite centeredongenuinelytransparentbackground, maintain10percentmargin.

## Farmland harvest ending film

- User-provided source: `grok-video-c2bdde7c-e550-46a8-b41e-18caf796c10e.mp4`, 16.041667 seconds, native 736 × 400 at 24 fps, H.264/AAC with an attached MJPEG thumbnail, 14,627,959 bytes.
- `public/cinematics/farmland-harvest.mp4`: full duration preserved, native dimensions/frame rate, H.264/yuv420p CRF 28, AAC 96 kb/s, faststart metadata, 3,482,689 bytes. Attached thumbnail stream excluded.
- `public/cinematics/farmland-harvest-poster.webp`: first frame, WebP quality 88.
- Sequence: level 40 coin finale → release board renderer → harvest film → Fieldkeeper closing story and Town on the Hill teaser. Uses the existing Skip, blocked-playback fallback and decoder cleanup.
- Encoding: `ffmpeg -i <source> -map 0:v:0 -map 0:a:0? -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart farmland-harvest.mp4`.

## Town and Castle chapter films

- User sources: `grok-video-2d50c4b7-67cb-4c8d-9731-fd860ba27566.mp4` (Town market, 10.041667 seconds) and `grok-video-07d7e29f-5541-4d63-8661-874f80202c11.mp4` (Castle dock, 16.041667 seconds). Both are native 736 × 400.
- `public/cinematics/town-market-opens.mp4` (2,621,438 bytes) plays after level 50's coin finale and before the Crier's closing dialogue. `public/cinematics/castle-upstream-departure.mp4` (2,837,462 bytes) plays after level 60's finale and before the Quartermaster's closing dialogue. First-frame WebP posters at quality 88 use matching `-poster.webp` names.
- Full durations are preserved. Encoding uses H.264/yuv420p CRF 28 at the native dimensions, AAC 96 kb/s, and faststart metadata, mapping only the main video and audio streams. The films reuse the existing metadata preload, renderer release, Skip, blocked-playback fallback, and decoder cleanup.

## Mechanic lesson sprite crops

`public/sprites/tutorial-water.png`, `tutorial-leaf.png`, `tutorial-gear.png`, `tutorial-jet-row.png`, and `tutorial-jet-column.png` are deterministic transparent crops from the existing `tiles.png` sheet. Their rectangles come from `frames.json` (`tiles[0..4].bounds`) and preserve the source art's aspect ratio. The tutorial also reuses the existing Prism, Flywheel, salt, seedpod, and companion portrait sprites. No new artwork was generated for these lessons.

The cascade callout uses `public/fonts/archivo-italic.ttf`, copied from this repository's Chance Pint study. Its Open Font License is retained at `public/fonts/archivo-OFL.txt`.

## Hill Town / Chapter 5 generated art (2026-11-21)

Generated with the built-in ImageGen tool using the established game art as references. Source PNGs are retained in the session generated-images directory; runtime assets are copied into this study and require no external image service.

- `public/town.webp`: 1672 × 941 sunset Hill Town; WebP quality 88. Town layout generated against `farmland.webp`, then lighting edited to early evening without moving landmarks. Cream stone, teal roofs, market awnings on the left, delivery depot centrally, bell/horn hall on the right, open walkable foreground. Orange-pink/lavender sky, golden windows and lanterns; foreground remains readable.
- `public/sprites/towncrier.png`: genuine-alpha 1024 × 512, four right-facing poses then four left-facing poses (idle, stride, passing, opposite stride). Blue-teal nonhuman bird Bard with orange beak, oversized cream courier coat, vermilion scarf, teal trousers, brass horn and delivery-tag backpack. Uniformly resized from the generated 1774 × 887 sheet. `towncrier-frames.json` records eight 256 × 256 cells and measured alpha bounds (threshold 8).
- `public/sprites/towncrier-avatar.png`: 512 × 512 circular parchment/brass portrait, transparent exterior, same bird identity facing left. Generated from the walking-sheet identity and Fieldkeeper portrait layout references.
- `public/sprites/delivery-crate.png`: 256 × 256 genuine-alpha cargo sprite, resized from a generated square PNG. Honey-brown timber, broad X-bracing, bronze corners, muted teal cloth binding and a blank ivory delivery tag. No damage variants: this cargo cannot be destroyed.

### Generation prompts and edits

Town: Production illustrated environment for Dune Relay, using farmland reference for precise black ink contours, flat watercolor, cream limestone, teal roofs, brass dieselpunk fittings and warm landscape perspective. Hill Town market plaza with distinct awnings, depot and bell/horn hall, empty connected foreground paths, no people, labels, UI or logo. Follow-up precise lighting edit: preserve the complete layout and objects, change only time of day to a readable early-evening sunset, orange-pink/lavender sky, warm lit windows and lanterns, gentle cool shadows, no dark nighttime foreground.

Crier sheet: Production animated character sheet, exactly four columns by two rows, equal square cells, transparent background. Friendly nonhuman blue-teal bird Bard, orange beak, oversized cream courier coat, vermilion scarf/lining, patched teal trousers, brass horn, delivery-tag backpack and golden bird feet. Top four face right; bottom four face left. Idle, broad stride, passing step, opposite stride; consistent scale and feet baseline, full figures, no scenery/shadows/text/grid. Fine black ink and flat watercolor matching the Fieldkeeper reference. Avatar: preserve this exact identity in the existing circular parchment/gold portrait format, clear head-and-shoulders view facing left, transparent outside the medallion.

Crate: Single match-three cargo tile sprite on true transparent background. Seedpod reference for ink/rendering style only. Sturdy square delivery crate, honey-brown timber and broad X-bracing, small bronze corners, muted teal cloth binding, large blank ivory tag at upper right. Instantly readable at 45 pixels and distinct from round seedpods and powers. Slight three-quarter front with a little top visible, strong simple square filling about 85 percent of canvas. No ground shadow, text, numbers, UI, glow, damage, locks, gems or coins.

Source generation IDs: town daylight `c5357ea7-b0cc-4c87-aed3-dbed5b2f1a68`; sunset edit `d9c25163-7275-4a3b-948d-38f441ef50e9`; walking sheet `d1580fe3-b553-4e03-8939-4624665dd799`; portrait `88fbac2b-b940-4982-8312-99bf45fef13a`; crate `9cfc05c0-500a-429f-accb-4e87a13c943d`. Deterministic resizing/compression uses Sharp with alpha preserved.

## Castle Island / Chapter 6 generated art (November 21, 2026)

Generated with the built-in ImageGen tool. Selected source PNGs are retained in the session generated-images directory; runtime copies below live in this study. Sharp performs only deterministic resizing, alpha-bound measurement, and WebP compression.

- `public/castle.webp`: 1672 × 941, WebP quality 88. Blue-hour river-island castle receiving courtyard, with repair boat/dock at left, storehouse centrally, castle gate/towers above right, and brass reservoir machinery at right. Open foreground paving supports walking. Style reference: `town.webp`; geography/architecture reference: the central river-island castle in `kingdom.webp`.
- `public/sprites/quartermaster.png`: genuine-alpha 1024 × 512, four right-facing then four left-facing poses: idle, broad stride, passing step, opposite stride. Olive-bronze beetle NPC with navy/teal gold-trimmed coat, cream cravat, rust waistcoat, brass measuring caliper and oversized oxblood ledger. `quartermaster-frames.json` records eight 256 × 256 frames and measured alpha bounds (threshold 8).
- `public/sprites/quartermaster-avatar.png`: genuine-alpha 512 × 512 circular parchment/brass-rim portrait. Same beetle identity facing left, with antennae and ledger visible. The quartermaster is an NPC, not a selectable companion.

### Prompt set

Background (`illustration-story`): Production wide 16:9 walkable Dune Relay background. Reference Town for fine crisp black ink, flat watercolor, detailed cream stone and teal/brass dieselpunk mechanisms; reference Kingdom for the central river-island white castle with copper-orange conical roofs, excluding sky castles and coastal fort. View from riverside receiving courtyard at gently elevated ground level: river and small timber dock with one modest repair boat at left, limestone courtyard and low storehouse/archive with delivery crates center-left, grand cream gate and orange-roofed towers above center-right, brass reservoir valves and pipes at right. Broad connected pale paving across lower thirty percent, paths to landmarks, foreground on land. Blue hour after sunset, lavender-blue sky with peach horizon, amber windows/lanterns, crisp visible foreground. No people, creatures, UI, lettering, logo, watermark or foreground clutter.

Walking sheet (`stylized-concept`): Production four-column/two-row sheet with eight equal square cells, overall 2:1, transparent background. Fieldkeeper reference supplies layout/rendering only. Small stout serious but charming nonhuman beetle quartermaster, olive-bronze segmented chitin and hard back carapace, curled antennae, black eyes, no human features. Two main arms, two tucked auxiliary arms, two sturdy booted legs. Navy/teal coat with gold trim, cream shirt/cravat, rust waistcoat, brass-button utility belt and caliper, oversized closed oxblood ledger with blank brass corners. Top row right-facing and bottom left-facing: idle, broad stride, passing, opposite stride. Consistent identity/scale/feet baseline, uncropped figures, clear cell gaps, crisp ink and flat watercolor readable at 85 pixels high. No text, grid, scenery, shadow or glow.

Portrait (`identity-preserve`): Exact same beetle from generated sheet; Fieldkeeper portrait supplies circular parchment/gold-rim format only. Clear close head-and-shoulders view facing left, curled antennae inside medallion, olive-bronze chitin, black eyes, navy coat, cream cravat, rust waistcoat and edge of oxblood ledger below face. Serious helpful expression, crisp ink and flat watercolor readable at 48 pixels. Transparent outside circle; no lettering, labels, scenery or glow.

Source generation IDs: castle `e5aad0b4-b9aa-4eee-9b92-75206a4ae808`; walking sheet `e18abb57-deb8-4d5c-8cd6-b74b27b8203d`; portrait `4846fe6b-0b0e-4809-a070-50c9c55467f3`. No existing asset was overwritten.
