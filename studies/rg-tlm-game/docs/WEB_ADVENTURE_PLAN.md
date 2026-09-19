# First web adventure: working plan

**September 19 update:** The active direction is now a tiny adventure in the Raid Guild brand universe about finding the Guild and becoming a member. See [the current story proposal](RAID_GUILD_STORY.md). Its proposed 10–15 minute, three-scene scope replaces the six-scene target and provisional outpost story below. The remaining document is the earlier technical planning reference.

Drafted September 18, 2026. This is a proposed plan, not an implementation. Confirmed direction: an original adventure in a different setting from King's Quest, with point-and-click walking, examining, talking, and item use. Desktop browser first is a proposed scope choice. The science-fiction premise below is provisional.

## Goal

Make one small, complete adventure that captures the pleasure of exploring strange places, meeting memorable characters, and solving connected puzzles. Use King's Quest as a design reference. Learn which tools and content structures deserve to become reusable by finishing this game first.

The first success is a game someone can open in a browser, understand, finish, and enjoy. A general game creator comes later.

## What this directory tells us

The directory contains packed DOS/AGI game resources, supporting binaries, and `AGI_REVERSE_ENGINEERING_NOTES.md`. There is no existing web application or Git repository in this directory.

A read-only check of directory entries, resource signatures, and payload bounds found 90 LOGIC resources, 82 PICTURE resources, 118 VIEW resources, and 22 valid SOUND resources. Sound IDs 34–37 point to invalid resource spans. This confirms the inventory in the existing notes; it does not establish that every script or puzzle has been decoded or understood.

AGI separates pictures, animated views, inventory, vocabulary, and executable logic. Shared state connects those resources. Its pictures also encode information that affects movement and drawing order. The useful modern equivalent is explicit scene data, character and item definitions, and named story state.

References: [AGI runtime and resource model](https://www.agidev.com/articles/agispec/agispecs-3.html), [picture format](https://www.agidev.com/articles/agispec/agispecs-7.html), and [logic format](https://www.agidev.com/articles/agispec/agispecs-6.html).

Before implementation, study three concrete examples from this copy: a room transition, an inventory interaction, and a character or puzzle whose behavior changes after an event. Record each as input → condition → state change → visible response. Extract only enough material to answer these questions; a complete AGI port is a separate project.

Keep the original files intact. Build the web game in a sibling project with its own version control and original story, art, dialogue, and audio.

## Proposed scope

| Part | First-game target |
| --- | --- |
| Play time | Approximately 20–40 minutes, checked through playtesting |
| World | One compact region with six connected scenes |
| Cast | One playable character and three speaking NPCs |
| Inventory | Six to eight useful items |
| Puzzles | Three main puzzles and one optional discovery |
| Story | A clear opening, a developing problem, and one ending |
| Presentation | Consistent low-resolution 2D art; modest animation |
| Controls | Walk, examine, talk, take, and use/give items |
| Persistence | Local autosave, continue, and restart |
| Release | A static web build with no account required |

Every scene should advance a puzzle, reveal something about the world, or reward exploration. Avoid adding rooms just to increase the map size.

## A possible first story

Working title: **The Silent Relay**. A repair technician arrives at an isolated research outpost whose distress signal abruptly stopped. Restoring its transmitter reveals why someone disabled it. An approaching electrical storm provides narrative urgency; the first version has no real-time countdown.

Six possible scenes: landing platform, crew quarters, workshop, greenhouse, relay control room, and antenna roof. Three characters: a botanist, the station engineer, and a maintenance robot. The main puzzles restore auxiliary power, recover a missing transmitter component, and decode the antenna alignment instructions.

This premise is an example to make the scope concrete. The story brief should establish the protagonist's motivation, the characters' competing wants, the outpost's history, the reason for the sabotage, and the ending before detailed production begins.

The first playable puzzle could span the crew quarters and workshop: learn from the engineer that the auxiliary panel is missing a fuse, find a portable lamp, illuminate a dark parts cabinet, retrieve the spare fuse, and install it. The two inventory items are the lamp and fuse. The engineer's directions and the panel's inspection text provide clues. In the prototype, restoring power ends the slice. Later, power unlocks access to the rest of the outpost.

## What we need to create

| Component | Required design and content |
| --- | --- |
| World | Premise, tone, rules, geography, connections, and reasons to revisit places |
| Scenes | Background, exits, entry positions, walkable areas, obstacles, foreground layers, interaction targets, and state-dependent variants |
| Characters | Wants, personality, appearance references, dialogue, locations, story states, and required poses/animations |
| Items | Stable ID, name, icon, description, initial location, allowed uses, and any consumed/transformed states |
| Puzzles | Goal, clues, prerequisites, solution, failure responses, state changes, and optional hints |
| Story | Opening, dialogue, descriptions, event sequence, puzzle dependencies, and ending |
| Interface | Inventory, action feedback, dialogue choices, pause/settings, saves, and hotspot discovery |
| Sound | Scene ambience, interaction cues, a small music set, and independent volume controls |
| Presentation | Palette, scene resolution, sprite scale, perspective, typography, and animation rules |
| Quality | Walkthrough, alternate action orders, save/load checks, accessibility checks, and browser testing |

A scene illustration is only one asset in a playable room. Movement boundaries, clickable targets, and foreground masks must be authored and tested alongside it.

## Player experience

Click a destination to walk. Clicking a target exposes its relevant actions. Selecting an inventory item and then a target attempts a use or give interaction. Dialogue presents authored choices. Every attempted action gets a useful response, including plausible unsuccessful ideas.

Plan for legible text, keyboard-accessible interface controls, visible focus, adjustable audio, and an option to reveal interaction targets. If full keyboard navigation through a scene is included, define and test its movement and target-selection behavior explicitly.

Use forgiving puzzle design: essential items cannot disappear accidentally, repeated actions cannot duplicate rewards, and players can recover from mistakes. Add optional progressive hints. Mobile touch controls and small-screen layout should have their own later acceptance check rather than being assumed to work automatically.

## Technical approach

Proposed stack: TypeScript with Phaser for the 2D game, plus HTML/CSS for suitable interface elements. Phaser supports browser-based 2D games and JavaScript/TypeScript development; see its [official overview](https://docs.phaser.io/phaser/getting-started/what-is-phaser). Select and pin dependency versions during setup.

Keep three simple boundaries inside one application:

1. **Runtime:** input, walking, animation, drawing order, scene transitions, audio, and interface.
2. **Game content:** scene definitions, characters, items, dialogue, descriptions, and puzzle rules.
3. **Saved state:** current scene and position, inventory/item locations, named story flags, completed events, and settings.

Use typed content objects and stable IDs initially. Introduce schemas or an editor only when actual authoring work shows the need. Keep puzzle state changes independent of rendering so they can be checked without running animations.

For example, `use(lamp, cabinet)` checks that the player has the working lamp and the cabinet has not already been illuminated. Success reveals the fuse and records `cabinetIlluminated`; a separate take action moves the fuse into inventory. Repeating either action cannot duplicate the item. Using the fuse on the panel consumes it and sets `auxiliaryPowerOn`. Those states must survive leaving the room and reloading the browser.

Store saves locally with a game identifier and save-format version. Explain that local saves stay in that browser. Define compatibility behavior when the save format changes.

Use AI, where useful, to help draft story alternatives, dialogue, concept art, and asset variants during production. Maintain approved character references and an asset list. Review visual consistency, animation alignment, readability, and puzzle logic before accepting outputs. The initial game uses authored rules and dialogue, so completion does not depend on a live model service.

## Build sequence and completion gates

| Milestone | Deliverable | Complete when |
| --- | --- | --- |
| 1. Study and design | Three reference interaction notes; one-page story brief; world map; puzzle dependency diagram; art direction sample | We can explain the full route from opening to ending, including where each clue and required item appears |
| 2. Playable puzzle | Two rooms, one NPC, two items, walking, conversation, inventory, one complete puzzle, and saving | A fresh player can solve the puzzle; blocked uses respond sensibly; progress survives reload |
| 3. Complete rough game | All six rooms, three main puzzles, dialogue, optional discovery, and ending with placeholder art | The whole game is finishable; different legal action orders and revisits do not trap the player |
| 4. Art and sound | Consistent backgrounds, sprites, item icons, animation, music, ambience, and final writing | Visuals match interaction regions; important clues remain readable; audio settings work |
| 5. Release candidate | Browser-tested production build, onboarding, hints, save recovery, and completed playtest fixes | A new player can start and finish from the built site without developer instructions |

Build one representative room to final visual quality during milestone 2 to validate the asset workflow. Keep other rooms rough until their puzzles work. Estimate production effort after that milestone, when animation and scene-authoring costs are better understood.

Use targeted tests for puzzle prerequisites, item consumption, one-time rewards, and save/load. Add a browser smoke test for starting, interacting, changing rooms, and continuing a save. Manually check movement, foreground overlap, dialogue layout, sound, and supported screen sizes. An automated walkthrough verifies a known solution; human playtests check whether players can discover it.

## Repeatability after game one

During this game, keep stable IDs, content separate from runtime code, approved art references, and brief notes about how each scene was made. These are enough preparation for now.

After release, create one unrelated test room with a new character, item, and puzzle using the same runtime. Record which parts require code changes. Use that evidence to decide whether the next investment should be scene templates, a dialogue editor, puzzle visualization, an asset workflow, or a packaged engine.

The repeatability test is whether new content can produce a different playable adventure without rewriting the core interactions. A general editor, automatic game generation, accounts, cloud saves, multiplayer, voice acting, and unrestricted runtime AI are outside this first-game scope.

## Immediate next deliverable

Choose the specific setting and premise, then turn it into a one-page game brief, a six-scene map, and a puzzle dependency diagram. Point-and-click controls are already selected. Those three artifacts guide the first playable puzzle and expose missing clues or circular dependencies before implementation.
