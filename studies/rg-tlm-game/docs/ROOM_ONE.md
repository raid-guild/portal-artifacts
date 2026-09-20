# First playable room

The waystation is the first playable chapter. Repairing the walker and accepting
Rook's ride transfers to [the crossing](CROSSING.md), preserving the notebook and
repair progress; completing the route then opens [the Workshop](WORKSHOP.md).

## Controls

- Click the foreground sand to walk. Movement is constrained to a safe band in front of the walker.
- Click a target to approach it, then choose an action beneath the scene.
- Collect items with Take. Select an item in the satchel, then click a scene target to use it.
- Select the notebook to read it. Escape or Cancel clears the selected item.
- Show targets labels every interaction point. A little hint gives a clue for the current puzzle step.
- Tab focuses controls and scene hotspots; Enter or Space activates buttons. When the scene itself has focus, arrow keys move the traveler.
- Progress autosaves in this browser. Reload and Continue to resume. Restart asks before clearing this chapter's progress.

## Walkthrough

1. Begin the journey.
2. Approach Rook and talk. Ask about the Guild or how to help.
3. Approach the cargo plate and take it.
4. Select the cargo plate in the satchel, then click the repair point.
5. Approach the screw jack and take it.
6. Select the jack in the satchel, then click the repair point.
7. Choose Turn the crank. Rook fixes the linkage; the background changes to the repaired walker.
8. Talk to Rook or select the road ahead, then Accept the ride.

Tools can be collected in either order. Trying the jack first gives feedback and preserves the item. Talking first is optional. Placing tools directly through the walker hotspot also works. Repeated actions never duplicate or consume essential items.

## Implementation map

| File | Responsibility |
| --- | --- |
| `src/game.ts` | State, puzzle rules, descriptions, inventory, hints, save validation |
| `src/main.ts` | Scene layout, input, walking, UI rendering, local storage, dialogs |
| `src/traveler.ts` | Direction selection, six-frame walk cycle, idle poses, canvas sprite rendering |
| `src/npc.ts` | Interruptible ambient NPC pose routines |
| `src/room-art.ts`, `src/room-art.css` | Rook sprite and painted ground/inventory props |
| `src/room-sprite-data.json` | Rook and tool atlas bounds and silhouette clips |
| `src/sprite-data.json` | Measured atlas pose bounds, ground anchors, and silhouette clips |
| `scripts/measure_sprites.py` | Regenerates JSON metadata from original atlas alpha; requires Pillow |
| `sprites.html`, `src/sprite-preview.ts` | Interactive four-direction motion preview |
| `src/style.css` | Responsive interface, layered scene, transitions, reduced-motion behavior |
| `src/layout.css` | Full-window layout, bottom/side control docks, fixed-aspect scene plane |
| `src/icons.ts` | Authored interface and temporary tool illustrations |
| `src/game.test.ts` | Puzzle, inventory, save integrity and order-independence checks |
| `src/traveler.test.ts`, `tests/traveler.spec.ts` | Direction/frame selection, visible leg motion, stopping, reduced motion, and gallery checks |
| `tests/room.spec.ts` | Real-browser chapter completion, reloading, restart, keyboard, mobile and storage fallback |
| `tests/npc.spec.ts` | NPC activity, attention, pauses, reduced motion, painted props, repair completion |
| `public/art/` | Runtime scene and traveler images |

Save key: `raidguild:last-mile:room-one`; current format version 3, including
room, transit, and Workshop state. Version-1 and version-2 saves migrate
automatically: unfinished repairs stay here, accepted rides enter the crossing,
and completed crossings enter the Workshop. Unknown, broken, or contradictory
saves are rejected and a fresh start is offered. Item locations are the source
of truth for inventory. Selected items and open dialogue are transient; puzzle
progress and position persist.

## Current visual limits

- The traveler has six walking frames and an idle pose in four directions. Left mirrors right (including the satchel); diagonal movement chooses the dominant direction. This first generated set has small costume variations between poses. See [animation notes](../art/prompts/traveler-animation-notes.md).
- Rook is a separate four-pose sprite with an interruptible work routine. She stays near one anchor; she does not yet walk between stations or animate the final repair. The walker repair still crossfades between two backgrounds.
- Plate and jack use transparent painted artwork in the scene and inventory. The repair target has a brass-colored wrench marker. See [Rook and tools](../art/prompts/rook-and-tools-notes.md).
- Ground movement uses an authored foreground band, not general navigation or obstacle routing.
- No sound yet. External web fonts have local serif/sans-serif fallbacks.
- The ending is fictional and is not a real-world Guild membership workflow.

## Continuation

The crossing, Workshop, and save migrations are implemented. See the linked
chapter briefs for their walkthroughs and acceptance contracts.
