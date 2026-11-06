# Orbit Lab content handoff

Prepared November 5, 2026 for a writer developing a blog article, project profile, or launch story. Orbit Lab is the repository name; **Little Light** is a working public name used in teaser materials, not a confirmed final title.

The strongest story is how a small experiment in indirect movement became a game about signal and connection. The player places temporary gravity wells rather than steering the character directly. A glowing dot curves through dark chambers, gathers light and sound, and leaves a drawing of its journey. Its search for an answering signal gives those physical and musical systems a narrative purpose.

## Current facts and publication status

The local source contains **15 campaign levels in five chapters** and **26 selectable studies**, plus seeded Infinite Play and a level editor. These counts were checked against `CAMPAIGN_LEVELS` and `DEMOS`, not inferred from marketing copy. Chapter Five and the death ripple remain uncommitted in this checkout at preparation time; do not present them as deployed features without checking the release.

Campaign completion requires reaching the portal with at least one of three sound gates collected in the same successful attempt. Collecting all three earns a note in the chapter transmission and makes the level available as an editor template. Death does not bank gates. Successful best patterns persist locally.

The editor exports and imports JSON. Those documents use the same compiler and runtime as official campaign levels. Sharing currently means exchanging a level file; do not imply an online community gallery, hosted publishing system, or multiplayer. Infinite Play uses a seed and stage within a generator version; an exported document preserves a particular layout independently of later generator changes.

The browser game uses **Three.js** for rendering and **cannon-es** for physics, alongside custom rules for gravity, collisions, companions, pursuit, light and audio. Do not describe every interaction as a physically exact simulation. Progress and drafts are stored on the device; account sync and leaderboard integration are not established features of this game.

## How the idea developed

The conversation began with Ultimate Chicken Horse: players construct a course that must remain possible, then compete to survive it. The interesting question was what a single-player version of building ahead of a moving character might feel like. Super Meat Boy and Loop Hero were references for action and indirect construction, not templates copied wholesale.

The proposed character moved from a swinging figure to an elastic blob, then toward orbital movement. Temporary gravity wells became the central action: place a source of attraction, let the dot curve around it, and let that pull weaken or disappear. Removing a well becomes a steering decision as meaningful as placing one.

The next step was a maze. Black walls, a glowing moving dot, persistent trails and a purple exit established the visual vocabulary. The direction then became explicitly about **gravity, light and sound**. The dot illuminates nearby space; walls cast shadows; its energy runs down; wells play successive notes. Those choices made the world feel coherent before it had a conventional story.

Rather than add every idea to one level, development moved into single-rule studies. Stillness, eclipse, impulses, orbiting danger, companions, portals, light pickups, dimmers and sound gates could each be tried with little surrounding context. Several ideas stayed exploratory, including filters, lenses and prisms. A study's existence does not mean its mechanic belongs in the campaign.

Campaign development then supplied an arc: a lonely light hears a signal and tries to find its source. Three-level chapters end in short, skippable, replayable transmissions. The dot sends a melody into space, waits, and hears an answer. More complete finishes fill notes in that call without adding an ever-growing stack of musical layers.

Two campaign layouts, now Levels 5 and 6, came from the creator's editor exports. That is a useful concrete example of the editor serving as a development tool as well as a player feature.

## The development process

The recurring loop was to describe a desired feeling, build the smallest playable experiment, try it in the browser, and revise what the interaction revealed. Human feedback often concerned a very specific moment: light leaking around a corner, a sound too quiet or too loud, an awkward phone rotation, or a route that was technically possible but too easy.

The creator supplied creative direction, screenshots, playtest observations, authored levels and media. Codex assisted with implementation, investigation and verification. In the later work, planning, implementation and independent review were separated into successive agent phases. This was an iterative collaboration; avoid implying that the first prompt produced the finished design or that the developer merely watched automation work.

Mechanics that survived the studies were represented as configurable elements in a shared level format. Embers could vary in size, gravity and motion rather than requiring a separate hardcoded object for every idea. Campaign maps, editor playtests and generated rooms could then exercise the same underlying rules.

Verification combined geometry and state tests, scripted routes using real Cannon physics, and browser checks. The most recent local test run passed 37 test files. Those checks establish specific behavior and example routes; they do not establish perfect balance, universal mobile performance, or that every optional three-gate route has been completed by a person.

Source lives in `studies/orbit-lab`; the build publishes to `public/orbit-lab`. Editable source and rebuilt output are committed together. The technical README describes the commands and packaging in more detail.

## Lessons with useful examples

### Separate interesting physics from a dependable game rule

Naturally orbiting moons could fall far behind a fast-moving player or transfer to a well. That motion was interesting, but losing a companion accidentally made it difficult to rely on. Collectible companion moons therefore gained a more dependable ownership and return behavior while retaining orbital movement.

Companions developed several roles: gathering light, slowing its loss, and being consumed to rescue the hero or buy time in last embers. The design question became what emotional and strategic role an orbiting body should play, rather than whether a simulation alone would produce a good companion.

### Let one element carry several meanings

Light is simultaneously the character's appearance, a source of visibility and shadow, and a dwindling resource. Sound gates are both optional route challenges and contributions to the emerging signal. A successful run's trail is both movement feedback and an image of what happened.

A strong article can follow one of these threads rather than list all the features. The same mechanic becoming visual, strategic and narrative is more revealing than the number of objects available in the editor.

### Keep the musical layers bounded

Well placements already play a rotating set of notes. Gates add bass, offbeat and chime parts within a level. Adding three permanent instrumental layers every level would become crowded quickly. Chapter transmissions instead turn strong finishes into missing notes in a call and response.

Recorded background music was introduced quietly, with separate music and sound-effect controls. It dips beneath gate activity and last embers, and stops for transmissions. Its subjective balance remains a listening decision, not something a passing automated test can settle.

### Teach a rule before demanding combinations

One-rule studies made it easier to distinguish a promising mechanic from an overloaded scene. Chapters then recombine familiar elements: stillness with orbital timing, eclipse with remembered danger, portals with separated rooms, and pursuit with escape routes.

The creator pushed back when later levels still felt like tutorials. Levels 8 and 9 became larger and more demanding, with diversions, timing and route planning. In Chapter Five, the later levels were revised again so an automated sequence of directed releases could not carry the dot all the way home; the final passages require player wells.

### Predictability and exploration can conflict

Authored light pickups help make a route learnable and testable. Disabling random recharges also made the newer levels feel less inviting to explore. Following playtest feedback, Levels 13–15 regained random light spawns alongside fixed pickups.

This is a particularly useful development anecdote: a change made to support predictable routes had a cost to the desired feeling of exploration, and the player's observation exposed it.

### Simpler controls still need explicit rules

The primary button and Space share Start, Resume, release from a capture, and removal of the oldest well. Pause and other navigation live in the top toolbar. Campaign settings were reduced to audio and predicted-path preferences, while experimental physics controls remained available in studies and playtests.

Locking campaign physics prevents adjusting gravity or lifetime from becoming an unintended part of solving the campaign. A compact interface is valuable only when its state transitions remain understandable.

### A bug report can reveal a misleading symptom

A phone screenshot appeared to show a frozen Infinite Play finish. The crucial clarification was that it happened while selecting **Following the echo** from the campaign menu, and refresh made it work.

The confirmed fault was a transition-order bug: prediction used the newly selected level's entities with the previous level's runtime. Reset stopped partway through, leaving the old scene and title visible. Separating cleanup from forecast updates fixed the actual transition. A separate result-screen safeguard also made optional artwork failures recoverable, but it was not the confirmed cause of this report.

This supports an article about investigating state and context rather than accepting the first plausible explanation from a screenshot. Relevant fix: [PR 127](https://github.com/raid-guild/portal-artifacts/pull/127).

### Fair danger can be outsmarted

Chapter Five's chasers respect walls and steer around nearby obstacles, without solving the entire maze. Their speed and acceleration are bounded. They can remain trapped in a separate room when the hero uses a portal.

The creator explicitly wanted that escape to remain valid. A limitation in enemy behavior can be an intentional opportunity for the player, rather than something to eliminate with omniscient navigation.

## Campaign story outline

| Chapter | Design focus | Narrative movement |
| --- | --- | --- |
| The First Signal | Light, distance, gravity and initial danger | A call into the dark receives an answer |
| Finding the Frequency | Stillness, impulses and orbital openings | The light learns to reply in rhythm |
| Through the Silence | Eclipse, memory and more demanding routes | Connection persists when danger cannot be seen |
| Across the Divide | Paired portals, separated rooms and return journeys | Two distant signals find a shared note |
| Something Heard Us | Pursuit, diversion and escape | Other things have heard the call; the familiar answer remains |

The final identity of the answering presence and the full campaign ending are still open creative decisions. Do not invent a resolved ending or promise a fixed final level count.

## Blog angles and possible structure

**Recommended angle: Finding a story inside a physics experiment.** Open with a little dot arcing through darkness and leaving a drawing. Return to the first question about building ahead of a moving character, follow the studies into gravity, light and sound, then show how an answering melody gave those systems a reason to exist. Close with player-authored levels and the questions still being explored.

Other viable pieces:

- **Designing a game through single-rule studies.** Show two or three experiments, what each revealed, and what changed when mechanics were combined.
- **When the path becomes the reward.** Focus on persistent trails, the result artwork and the campaign trail gallery.
- **Making a signal playable.** Focus on well notes, gate rhythm, missing melody notes and chapter transmissions.
- **Building with an AI coding collaborator.** Use concrete feedback, the shared level format, route tests and the transition bug to show where human judgment and verification mattered.

Possible opening, written as draft copy rather than a creator quote:

> A small light moves through a mostly empty world. You cannot steer it directly. You place gravity in its path, listen as each well adds a note, and hope that somewhere beyond the dark, something is listening.

## Material for the writer

Start with these repository sources:

- [Technical README](../README.md) for controls, build process and mechanics. Some passages still describe twelve levels and no external audio files; use current source for counts and audio behavior.
- [Campaign definitions](../src/campaign.js) and [chapter definitions](../src/chapter.js) for current level and chapter facts.
- [Studies](../src/demos.js) for the experimental questions and descriptions.
- [Level documents](../src/levels/) for the actual authored maps, including the editor-built Levels 5 and 6.
- [Chapter Five route tests](../src/chapter-five-routes.test.js), [chaser tests](../src/chaser.test.js), and [result tests](../src/run-result.test.js) for specific behavior that has been exercised.
- [Chapter Four and audio PR](https://github.com/raid-guild/portal-artifacts/pull/125) and [transition fix PR](https://github.com/raid-guild/portal-artifacts/pull/127) for reviewable change summaries.

Media in the original development workspace, outside the repository:

- `outputs/orbit-lab-teaser/video/previews/little-light-launch-v2.mp4` — launch teaser with the Portal CTA and RaidGuild credit.
- `outputs/orbit-lab-teaser/video/previews/contact-sheet.jpg` — a quick index to the teaser treatment.
- `outputs/orbit-lab-backdrops/` — screenshots of the dust background, controls, progression, death ripple, and Chapter Five layout.
- `outputs/orbit-lab-teaser/video/public/suno-song.wav` — the polished user-supplied song. Confirm publication rights and credit for music and generated media before reuse.

The recorded production route is `https://portal-artifacts-production.up.railway.app/orbit-lab/`; `portal.raidguild.org` appears in the teaser CTA. Confirm the intended public destination and release status before publishing. Do not circulate localhost links as public demos.

Useful fresh captures would show a single gravity-well slingshot, a moon gathering light, an eclipse concealing moving danger, a portal escape leaving a chaser behind, and a full trail drawing after a finish. A transmission excerpt can communicate the narrative without explanatory UI.

## Questions to ask the creator

1. What first made the orbital movement feel worth turning into a game?
2. Which playtest most changed your understanding of the core rules?
3. What should a failed attempt feel like, especially when its trail is beautiful?
4. How much should players know about whoever is answering the signal?
5. Which design decisions did coding assistance accelerate, and which still required repeated hands-on play?
6. What name, credits, release destination and next milestone should the article use?

Before final copy, confirm the public name and attribution, the deployed feature set, the level count, and the availability of sharing. The teaser's earlier **20+ campaign levels** line is a planned marketing claim, not supported by the current fifteen-level source. Avoid invented player statistics, a fixed development-time claim, or claims that the game is finished.
