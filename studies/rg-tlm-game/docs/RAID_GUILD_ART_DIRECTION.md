# The Last Mile — art direction and image prompts

Working art brief, September 19, 2026. Based on [the story](RAID_GUILD_STORY.md) and the reviewed Raid Guild redesign. Prompts are ready for concept exploration; character appearances and production measurements below are proposals. The [first scene concept](../art/concepts/scene-01-stranded-walker-v1.png) has been generated; see its [exact prompt](../art/prompts/scene-01-stranded-walker-v1.txt) and [review notes](../art/prompts/scene-01-stranded-walker-v1.md).

Progress: the user approved the first scene's visual direction. Its richer ink drawing and detailed surfaces now guide the remaining concepts. [The crossing](../art/concepts/scene-02-crossing-v1.png) and [the workshop](../art/concepts/scene-03-workshop-v1.png) have been generated using that image as an explicit reference. [Generation notes](../art/prompts/scenes-02-03-generation-notes.md) record the references and remaining production adjustments. The prompts below preserve the original planning brief; exact submitted prompts are in `../art/prompts/`.

## The visual idea

An illustrated science-fantasy travel journal: immense landscapes, improbable machinery, and people who take care of what they build. Fine ink contours, restrained surface texture, clear color shapes, and practical clothing. The emotional progression is **distance → connection → belonging**.

Keep the new brand's illustrated look. King's Quest informs the scene-based interaction; the supplied Raid Guild imagery informs the artwork.

| Constant | Proposed direction |
| --- | --- |
| Format | Landscape 16:9, fixed camera for each room |
| Delivery target | 1920 × 1080 backgrounds when supported; adapt from the generator's actual output dimensions |
| Camera | Moderate wide view, slightly elevated, visible ground plane, restrained perspective |
| Drawing | Fine dark blue ink contours, broad color shapes, light paper grain, selective hatching |
| Materials | Worn enamel, matte metal, canvas, stone, paper, plants |
| Color | Coral and apricot light; deep teal and blue shadows; parchment clothing; sparse cyan machine light |
| Shape | Tall rock spires, rounded machine bodies, slender mechanical legs, curved arches |
| Light | One late afternoon; outdoor light comes from upper left, workshop light enters from a left-hand window |
| Detail | Strong silhouettes and quiet spaces around important objects |
| Mood | Curious, expansive, inhabited, gently funny |

The palette names are a visual interpretation of the reference art, not official color-token specifications. Use supplied brand tokens when available.

## References to carry between generations

Use the actual images as visual references when generating. Links in a prompt are not a substitute for attaching the images through the image tool's reference mechanism.

1. [Desert traveler](https://raidguild-website-redesign-production.up.railway.app/images/neo/hero-light-poster.png): linework, outdoor palette, sense of distance.
2. [Guild builders](https://raidguild-website-redesign-production.up.railway.app/images/neo/guild-builders-v1.png): clothing, equipment, human scale, practical character design.
3. [Coral citadel](https://raidguild-website-redesign-production.up.railway.app/images/neo/sky-citadel.png): architectural shapes, floating structures, vegetation.

See also the [brand archive](https://raidguild-brand-guide-production.up.railway.app/). New supplied assets should become the reference authority for their corresponding character or object.

Once selected, reuse the same approved traveler, Rook, keeper, walker, and citadel references. Give each reference one clear role. Maintain a small contact sheet recording the chosen designs and their filenames.

## Generation order

1. **One mood image:** the stranded walker scene. Compare two or three interpretations of the same composition, changing only how flat or textured the drawing feels.
2. **Cast and walker references:** settle silhouettes, clothing, faces, proportions, and machine construction.
3. **Three scene compositions:** establish framing, entrances, interaction positions, and room-to-room continuity.
4. **Playable scene layers:** produce empty backgrounds and separate movable objects, characters, foreground pieces, and state changes.
5. **Small assets:** inventory images, the notebook illustration, transit controls, and ending detail.

Review each stage before expanding the asset set. Choose a visual direction with one strong scene first. Character animation requires a separate alignment and cleanup pass after the static designs are settled.

## Shared prompt block

Prepend this to the individual prompts below. For the first mood image, attach the three brand references. For later images, attach the relevant approved game references as well.

> Create an original illustration for The Last Mile, a small point-and-click adventure in Raid Guild's science-fantasy world. Follow the attached reference images for fine ink contours, expansive compositions, practical traveler clothing, and the relationship between warm coral light and cool blue-teal shadows. Use broad, clean color shapes, restrained hatching, and subtle paper texture. Materials feel handled and repaired: matte enamel, canvas, stone, paper, and worn metal. Technology has understandable hinges, handles, panels, and tools. Preserve readable silhouettes and purposeful empty space. Add charm through specific lived-in details. Avoid photorealism, glossy 3D rendering, heavy bloom, dense surface noise, and extreme lens distortion. Do not render captions, interface elements, watermarks, or invented logos; leave intended label and emblem surfaces blank.

## Prompt 1 — first mood image

**Purpose:** establish the visual direction. This is a complete composition, not a final game background. Characters and machinery can appear together here.

> Wide 16:9 scene at a remote desert waystation in late afternoon. An immense apricot sky and distant violet rock spires fill the upper half. In the right half, a compact four-legged cargo walker leans awkwardly with one broad foot sunk into coral sand. Its rounded teal cabin, patched cream canopy, exposed leg joints, and tied-down supply crates make its function clear. Beside the damaged leg, a mechanic has paused her work and is looking toward an approaching traveler.
>
> The traveler enters from the lower left, small against the landscape, wearing a short faded-coral cape and carrying a notebook satchel. Their pose suggests curiosity and hesitation. The mechanic wears a parchment work jacket and dark utility trousers. A simple jack and a broad metal plate sit visibly near the walker. Keep both people's hands and tools visually distinct. Across the bottom third, leave a broad, continuous stretch of sand that could serve as a playable walking area. Light comes from upper left; long blue shadows fall right. A weathered shelter and an unmarked cloth pennant suggest a route maintained by travelers. The emotional focus is the first encounter between two strangers, with the enormous landscape giving them room.

**Compare:** A: clean, nearly flat color; B: slightly more paper texture and atmospheric distance. Keep layout, palette, and subject unchanged so the comparison is useful.

## Prompts 2–4 — character design references

These are proposed designs, adjustable to future supplied assets. Generate each character separately. A turnaround is a design reference; individual gameplay poses should later be generated and aligned separately.

**Traveler**

> Character reference sheet of one adult human traveler, with an androgynous appearance, warm brown skin, short dark wavy hair, a short faded-coral shoulder cape, parchment tunic, deep teal trousers, practical boots, and a small ochre crossbody notebook satchel. A visible, expressive face; attentive posture; lightly worn clothing. Show a full-body front three-quarter view, side view, and back view of the same design at equal scale against plain warm ivory. Keep all accessories and garment construction consistent. Use a compact, readable silhouette with no trailing fabric near the feet. Include no weapons, lettering, scenery, or additional character concepts.

**Rook**

> Character reference sheet of one adult woman mechanic with a broad, sturdy build, medium-brown skin, close-cropped dark hair, a parchment work jacket with sleeves rolled to the elbows, muted indigo utility trousers, amber work gloves tucked into her belt, and heavy practical boots. Her silhouette feels grounded; her expression is dryly amused. Small signs of repeated repairs on her clothing. Show full-body front three-quarter, side, and back views at equal scale on plain warm ivory. Repeat the same pockets, seams, and tools in every view. No armor, weapons, scenery, text, or alternate costumes.

**The keeper**

> Character reference sheet of one older adult workshop host with deep brown skin, silver hair gathered behind the head, small round spectacles, a long muted-teal overshirt, a parchment apron with two large tool pockets, rust-colored trousers, and comfortable shoes. Open posture and an interested, slightly distracted expression. Show full-body front three-quarter, side, and back views at equal scale on plain warm ivory. Preserve the same face, clothes, and proportions across views. The design should feel like someone who sorts tools and welcomes visitors throughout the day. No ceremonial robes, crowns, scenery, lettering, or alternate costumes.

**Consistency check:** the traveler is recognized by cape and satchel; Rook by sturdy shape and short work jacket; the keeper by long overshirt and apron. They should remain distinguishable at gameplay size.

## Prompt 5 — walker design reference

> Design one small four-legged cargo walker for the attached mechanic. Its cabin accommodates a pilot and one passenger. Use a rounded teal enamel cabin, a patched cream canvas sunshade, four articulated metal legs with broad feet, and a rear rack carrying ordinary workshop supplies. Each joint has a clear mechanical purpose. It feels maintainable, slightly ungainly, and dependable. Show one large three-quarter view and a smaller side view of exactly the same machine against plain ivory, with a simple human silhouette for scale. Keep the silhouette distinct and the cargo load modest. Leave a small pennant blank for a later supplied Guild emblem. No weapons, ornamental machinery, text, environment, or alternative designs.

After approval, create stranded and repaired versions from the same reference and scene camera. Preserve body details, light, canvas size, and ground contact. Change only leg articulation and the cabin light. At the crossing, reuse the design with a deliberate docking pose.

## Prompts 6–8 — clean scene backgrounds

These prompts generate environments without actors and movable puzzle objects. Use the approved compositions as references. For every scene, keep characters, interaction overlays, and foreground occluders on separate layers during integration.

**Scene 1: waystation**

> Produce the clean environment plate for the approved stranded-walker composition, in wide 16:9. Preserve the camera, coral sand, remote shelter, apricot sky, violet rock spires, and upper-left sunlight. The traveler will enter from the left. Reserve the right-center ground for the cargo walker and mechanic, with enough space beneath the future chassis for a visible repair interaction. The lower third must contain a continuous readable walking surface. Keep stones and shelter supports outside that route. Leave a quiet area beside the future walker for a jack and metal plate. Render only fixed scenery: no characters, walker, tools, cargo plate, active effects, cast shadows from absent objects, text, or interface. The ground should continue naturally through all reserved areas.

**Scene 2: crossing**

> Wide 16:9 environment plate of a cliffside transit landing overlooking a floating coral citadel. The same late-afternoon sun lights the scene from upper left. Place the distant citadel left of center, above blue atmospheric cloud layers, with planted terraces and tall slender spires. It should clearly match the approved citadel design. A weathered transit arch stands on the right, large enough for the approved cargo walker to pass through. Keep its aperture empty, showing the distant landscape. Provide a level landing across the lower third, room for the walker to dock at the arch, and a waist-high control pedestal reachable by a walking character. Leave the pedestal face plain for separately authored controls. Keep the cliff edge clearly separated from the safe walking surface by a low curb. No characters, vehicles, symbols, lettering, portal effects, interface, or foreground props covering the walking route.

**Scene 3: workshop**

> Wide 16:9 environment plate inside the same floating citadel: a shared workshop with coral-plaster arches, teal structural fittings, and a tall left-hand window overlooking the desert. Warm late-afternoon light enters through the window. Put a long, worn worktable at center-right, its near edge reachable from the open floor. Provide an empty chair and a clear place on the table for a notebook and a membership ledger. A bench by the window is ready for a new arrival. Shelves contain a few unfinished instruments, spare parts, rolled maps, and healthy trailing plants. Mismatched mugs and repaired furniture suggest a community with history. Keep the entry on the left and a continuous open walking route across the lower third. Concentrate small decorative detail along the back wall. No people, foreground clutter blocking the route, notebook, ledger, badge, lettering, or interface.

## Prompt 9 — individual props and inventory images

Use this template once per object. Replace the braces before generation, and attach the approved object reference if one exists.

> One isolated {OBJECT}, matching the approved reference, shown at a clear three-quarter angle in the game's ink-and-color illustration style. Center it with generous padding and a readable silhouette. Preserve {IDENTIFYING DETAILS}. Soft upper-left light, restrained texture. No floor, cast shadow, text, labels, frame, or other objects. Transparent background if the generator supports it; otherwise use a plain contrasting matte for later cleanup. This image will be viewed small in an inventory, so prioritize the shape and function.

| Object | Identifying details |
| --- | --- |
| Notebook | Ochre cloth cover, coral elastic closure, worn corners, no writing |
| Cargo plate | Broad dull-teal rectangular metal plate, clipped corners, two recessed grip holes |
| Jack | Compact mechanical screw jack, wide upper saddle, clear folding crank |
| Badge base | Small parchment-and-coral metal badge; blank face for the exact Guild mark |

Make the world versions match the inventory versions. Small controls and the canonical crossed-swords mark should be composited from precise authored assets rather than relying on generated lettering or geometry.

## Prompt 10 — the notebook invention

> Close view of a worn notebook lying open, viewed nearly straight down, in the game's hand-drawn illustration style. On the right page, draw a charming small brass lantern with four spindly jointed legs and an oversized glass body. A few alternate leg sketches and a little drawing of it tipping sideways show that its maker is still working out its balance. On the left page, leave most of the paper blank for a separately authored transit map and symbols. Fine blue ink, faint coral pencil corrections, warm ivory paper, gentle wear. No readable words, decorative border, hands, props outside the notebook, or invented interface.

The route sketch, two-part address, clue labels, and ledger text must be authored exactly and kept consistent with the actual puzzle. Generated drawings provide atmosphere; the implemented controls provide the reliable solution.

## Production handoff

The attractive composition and the usable room are separate deliverables. Save the selected composition as a reference, then prepare:

- Fixed background and any separate foreground layer.
- Character and walker cutouts with consistent ground anchors and separate shadows.
- Plate, jack, notebook, ledger, and badge assets in the states the story needs.
- Arch light/effect overlay and exact route-control graphics.
- Authored walkable regions, interaction targets, and positions where characters stand to perform actions.

Before final polish, place rough characters and clickable targets over each background. Check that the player can reach every target and that scenery overlaps them correctly. Reserve interface space in the application layout; do not bake interface artwork or text into the scene.

Inspect every generated asset at its intended display size. Reference images and careful prompts improve consistency but do not guarantee aligned animations, exact symbols, clean transparency, or stable geometry between states. Use edits of approved images and explicit cleanup for those needs. Small cutouts may need stronger outlines than the backgrounds.

## What to plan after visual direction

1. A simple blocking sketch for each scene: entrances, walking space, NPC positions, puzzle targets, and foreground overlap.
2. An interaction script: every inspect response, conversation choice, item use, and repeat-action response.
3. A state list tying each story change to its art: walker stranded/repaired, arch idle/active, notebook closed/open, membership offered/accepted.
4. The first playable scene using rough assets, followed by final art integration once its interactions work.

Implementation update: the first room is playable using clean/repaired background derivatives and a transparent traveler. See [runtime art notes](../art/prompts/room-one-production-notes.md) and [the active plan](../PLAN.md). Next art work is refining the temporary tool illustrations and preparing the crossing's production layers. Additional style comparisons are unnecessary unless the user wants a change.
