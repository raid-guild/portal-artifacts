# Gameplay / graphics boundary

This handoff describes Hanging Nursery (Level 1), Counterweight Cistern (Level 2), The Silt Loom (Level 3), The Threadworks (Level 4), and Rootwell Gallery (Level 5). The authoritative geometry for all seven campaign levels is `src/garden-level.js`; use those descriptors rather than older screenshots or retired level notes.

Gameplay integration lives in `src/garden-level.js`, `src/editor-stage-view.js`, `src/game-shell.js`, `src/game.css`, `src/main.js`, and `src/simulation.js`. All seven levels use the shared editor-stage renderer. Graphics work can add assets under `public/art/` and concept/model sources under `art/`. Coordinate concurrent edits to gameplay files.

## Hanging Nursery

The nursery teaches gathering, spreading under an arcade, and enclosing gems. Its recognizable spaces are an arrival bowl, planting pockets, a squeeze arcade, a gem cup, an optional raised crossing, and a drain court. Keep three gems, 17 gold, and the 297-particle capacity (65 starting particles). The 30-second target is an expert replay goal; tablet reading pauses active time.

- Board: X -9 to 9, Z -4.8 to 4.8. Start at (7, -2.6), on the raised patch at Y 2.16. Two short descents lead left to the upper lane at Y 1.62.
- Arrival bowl: centered on the start, radius .85, bottom radius .6, depth .1.
- Upper planting pools: (4.8, -2.6) and (2.5, -3.2). Gold draws the player left toward the arcade.
- Squeeze arcade: X .35–1, Z -4.1–-1.2, underside Y 1.94, top Y 2.7. Its .32 clearance lets a loose body pass. End supports and a short garden divider are explicit solid fixtures. Preserve the open crossing at Z -2.7.
- First gem cup: (-1.7, -2.7), radius 1, bottom radius .65, depth .1. The gem is at its center. Keep it broad enough for gathering around the gem.
- West descent: the existing six .27 drops in X -8.8–-6.2 turn toward the lower court, ending at Z 2.1 and Y 0. The exposed upper ledge remains an optional shortcut.
- Lower pools: (-5.8, 2.5) and (4.8, 3.5). The broad ground route runs around Z 3.5 and catches falls from the crossing.
- Raised branch: west ramp X -6.5–-4.6, Z .55–2.05, rising to Y .7; west bridge X -4.6–-.15, Z .7–1.9; reward landing X -1.1–2.5, Z -.2–2.7; east bridge X 2.15–3.65, Z .7–1.9; descending ramp X 3.65–5.45, Z .55–2.05. Bridge undersides are at Y .32, tops at .7. The landing must stay wide enough for full gem absorption.
- Second gem: (.8, 1.25), base Y .7 on the landing. Third gem: (5.6, 2.6), on the lower drain approach.
- Drain: (7.6, 2.8), rim radius .95, throat radius .36, depth .9. Keep its position aligned with the decorative collar. Circular paving and planting distinguish its court.

The old uniform pillar barrier and lower lintel are retired. Do not reintroduce them from old references.

## Counterweight Cistern

Level 2 starts at (7.6, -2.8) on Y 2.16. The upper settling gallery has two shallow collection pockets, and the west stair descends to a Y 1.08 basin chamber. Shed at the basin rim to leave at least 48 real loose pieces; the weight raises a moving shutter across the middle terrace. The east stair then drops to a Y 0 filter court. Two alternating stone ribs make a gentle winding route toward the western drain. The exposed ledges still allow faster drops that miss rewards.

- Board: X -9 to 9, Z -6 to 4.8. Preserve the two existing stair turns, start at (7.6, -2.8), and drain at (-7.6, 3.65).
- Upper pockets: centers (5.3, -3.3) and (2.6, -2.4), radius .9, depth .12. They are shallow enough to gather from while moving. The first gem remains at (-1.5, -2.8).
- Basin: (-2.5, .35), radius 1.15, depth .75, on the middle terrace. Its sage rim, floor cue, and conduit lead toward the shutter at X 1.5. The gate threshold stays 48, releases below 36, and retains its occupied-passage protection. The middle gem remains at (4, .35).
- Filter ribs: X 2.7–3.1, Z 2–3.15 and X .1–.5, Z 3.65–4.8. They rise .7 from the lower floor. Pass below the first rib in screen depth, then above the second; the ground around them remains broad enough to recover from a drop. The final gem stays at (-3.5, 3.6).
- Four tablets: the arrival explains the water's weight; a stone at (-4.5, .4) teaches shedding before the basin; a stone at (.15, .35) explains leaving the deposit behind before the shutter; the lower stone at (5.5, 3.6) gives context for the filters. Preserve their surface heights and read behavior.

This level keeps three gems, 17 gold, 297 particles with 65 starting, and the 45-second expert target. The revised content has a new ranked identity and fresh Level 2 personal best while earned unlocks survive.

## The Silt Loom

Level 3 uses the same three descending terrace heights as the cistern. Thirteen banks of paired stone ribs make 26 independent editor blocks. Each bank spans the terrace except for a narrow slot; the slots alternate in depth so the whole body must squeeze and turn. Three 1.1-wide upper east slots teach the action before the open reform court and first gem at (-1.6, -3.2). Two more banks guard the west stair. The next two banks lead from the stair toward the basin, a third guards the east middle turn, and five banks weave around the lower filter. The 1.1-wide first group gives even a large body enough clearance to follow its brain through the turns; the remaining slots are 1.0 wide.

The west stair reaches a basin at (-2.3, .45) on Y 1.08. Shed 64 real particles to lift the shutter at X 1.7; it releases below 48 when unoccupied. Once the core clears the shutter, a tendril cast back toward the bowl can recover the deposit, and the green pool at (3.1, .45) supplies more flesh before the second gem at (4.3, .45). The middle east slot at (5.7, 1.1) leads to the right descent. The lower court has five staggered slots and the long low filter roof at X -1.15–1.15. The body spreads under its Y .3 clearance to reach the last gem at (-4.3, 3.55) and drain at (-7.6, 3.65). An exposed ledge drop can still finish with missed rewards.

Five low memory stones introduce the water filter, narrow openings, 64-piece deposit, tendril recovery from beyond the shutter, and releasing Contract under the final roof. The course keeps three gems, 17 gold, 297 particles with 65 starting, and the 50-second expert target. Its revised content has a fresh Level 3 score identity while earned Level 4 access survives.

## The Threadworks

Level 4 descends through three terraces: an upper collection gallery, a narrow raised shuttle, and a folded lower court. The upper entrance at X 4 and exit at X -4 each have a 1.1-wide opening. A first green pool leads through the entrance to an open casting bank at (.7, -3.65). Three shallow wells at (-1.8, -4.8), (-2, -2.35), and (2.7, -4.9) hold 174 real pieces of green flesh. Up to three tendrils can gather them from the bank, and walking into each well remains possible. The first gem waits in a broad west court at (-5.4, -3.55). Recall strands before passing the west opening so the whole body follows.

The west stair descends to Y 1.08 and a rising ramp leads onto a Y 1.76 shuttle. The exposed 1.7-wide shuttle and its two paired pinch guards ask the body to narrow through 1.25-wide slots. Its eastern landing, X 2.5–5.6 and Z -1.2–1.9, holds the second gem with room to surround it. The ramp on the east side returns to the middle terrace. Falling from the shuttle lands on the lower route and skips the raised reward. The ground route also passes beneath a low roof at X -1.8–-.7.

The right descent reaches four alternating lower stone baffles. Their open ends force turns around the court and the low lintel near X 2.3 asks the body to spread underneath. The last gem is at (-3.8, 3.55) with a clear enclosure court before the drain at (-7.6, 3.65). Thin grooves and well rings are visual cues only; collision uses the authored fixtures. Keep three gems, 17 gold, 297 particles with 65 starting, and the 55-second expert target. Five memory stones introduce the wells, real casting and recall, whole-body passage, the optional raised route, and the lower folds. All five are positioned before the relevant action. This revision has its own ranked content identity and fresh Level 4 score record while an earned Level 5 unlock remains valid.

## Memory tablets

The nursery's five low stones introduce gathering, the arcade, gem enclosure, the raised branch, and the old drain. Four cistern stones continue the story and teach the counterweight. Five silt loom stones explain the filter route and its deposit. Five threadworks stones teach real casting and recall, whole-body movement, and the raised and lower branches. Their stable IDs and exact positions are in the campaign level descriptors.

Connected living flesh covering a tablet briefly opens its first message without requiring contraction. Reading pauses physics and the timer. Continue resumes after clearing held controls. Read history survives restarts; a nearby Read/Reread action or Q opens the message again. E remains the tendril action. Tablets do not count toward collectible scores.

Use a pale inscription and a clear read state, distinct from violet gems and gold. Keep messages before the action they explain. The editor supports tablet title, short text, tutorial/story category, control hint, and surface height; campaign and editor play tests share behavior.

## Shared art and tower rules

Decoration must follow collision geometry. Retain warm inked stone, thin contours, coral living flesh, sage loose flesh, gold pieces, and violet faceted gems. Keep backgrounds separate from playable surfaces, and avoid obscuring narrow paths or the drain.

Existing tower assets load from `public/art/tower/`; the sky is `public/art/tower-sky-v3.png`, and the shared stone texture is `public/art/textures/stone-ink-v1.png`. Modeled openings/supports have procedural fallbacks. Coral/sage growth and trim are decorative.

All storeys start high and descend through visible depth. Simulation coordinates are local; rendering offsets each storey by -7.2 × (level ID - 1). A decorative chute can bridge differing exit/start X/Z positions. Only pink living flesh streams into the next start; green supply stays on the board. Follow and tower views share the same physical route.

Rootwell Gallery starts on the upper terrace at (7.6, -3.2). A cut-through well redirects the gold trail north before two offset 1.1-wide jamb openings. The lower floor has three middle ribs, the original sage grip ramp and high platform with marked faces on both sides, and a full-width turquoise slip strip. Gather at the ramp before climbing so the connected body follows over the lip to the high gem. Two more cut-through wells shape the low return, which crosses a covered arch before the final gem and drain. The five tablets explain the physical choices in sequence. Preserve the three gems, 17 gold, four flesh pools, and 297-particle capacity. The campaign start, grip assembly, and 60-second target are unchanged.

Levels 6–7 retain their previous layouts. Consult their current descriptors for geometry and mechanic configuration. Existing Workshop saves remain independent. Earned campaign unlocks survive migration, while changed Levels 1–5 use course-specific score records and leaderboard content identities.

Preview: http://127.0.0.1:5180/puddle-study/. Material studies and the editor remain available from the game menu.
