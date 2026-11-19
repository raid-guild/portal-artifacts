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
