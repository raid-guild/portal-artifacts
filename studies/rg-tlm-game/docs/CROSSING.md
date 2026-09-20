# The crossing — implementation brief

The traveler rides with Rook to a cliffside transit landing. Rook stays in the cabin to hold the docking contacts steady. The Guild is visible across the gap.

Puzzle: the notebook's Guild route is **Spire → Lantern**. The pedestal has two labeled rings: destination (Quarry, Spire, Harbor, Orchard) and beacon (Hammer, Leaf, Lantern, Wave). It starts at Quarry / Hammer. Reading the notebook or asking Rook supplies the address. Cycle both rings and pull the signal lever. Wrong routes respond without consuming anything; the correct route opens the arch and brings a greeting from the keeper.

Implement exploration targets for the citadel, Rook, docked walker, route inscription, pedestal, and arch. Walking stays on a safe foreground stone strip. A close-up shows the two ring controls and an optional notebook page beside them. Keep symbols, text labels, and answer sourced from the same authored data.

Save version 2 adds room identity, route selections, notebook-read flag, arch activation, and crossing completion. Preserve the existing storage key for automatic migration. Migrate departed version-1 games directly to the crossing entrance; preserve unfinished room-one progress and inventory.

The Workshop is the next playable chapter. Stepping through the activated arch
now transfers directly to it while preserving the crossing state and inventory.

Status: implemented and verified. The local game remains at `http://localhost:4173/`. Accept the ride after repairing the walker; an old save with the ride already accepted migrates here automatically.

## Controls and walkthrough

1. Inspect the floating citadel, inscription, arch, or docked walker. Talk to Rook for context or help.
2. Click Notebook in the satchel to read its route sketch. Escape or the close button returns to the landing.
3. Click Route pedestal. The traveler approaches, then the close-up opens. Open notebook here to keep the clue beside the controls.
4. Click the place ring once to reach Spire. Click the beacon ring twice to reach Lantern. Previous buttons rotate backward; Enter/Space operate the focused controls.
5. Pull the signal lever. Wrong settings produce repeatable feedback without losing anything. The correct pair locks the rings and opens the arch.
6. Return to the landing, select Transit arch, then Step through the arch. The
   traveler enters the Workshop at its arrival point and can continue immediately.

Progress saves after each selection and interaction. Refresh midway through the
rings or after activation to continue. Restart explicitly clears all three
chapters and returns to the waystation.

## Implementation map

| File | Role |
| --- | --- |
| `src/game.ts` | Version-2 shared state, migration, room-one rules, ride transition |
| `src/transit.ts` | Route symbols, solution, crossing dialogue, safe puzzle rules |
| `src/rooms.ts` | Per-room targets and approach positions |
| `src/crossing-panel.ts` | Accessible route-book and pedestal dialog |
| `src/route-art.ts` | Exact authored SVG symbols shared by clue, controls, and scene |
| `src/crossing.css` | Scene layers, ring overlays, responsive route-book styles |
| `src/main.ts` | Room presentation, walking, interaction, saving, completion |
| `src/transit.test.ts` | Puzzle prerequisites, repetition, migration, validation |
| `tests/crossing.spec.ts` | Real-browser notebook/puzzle, reload, completion, keyboard/mobile |

The storage key remains `raidguild:last-mile:room-one` for compatibility. The
crossing introduced version 2; the current version-3 parser preserves these
saves and moves completed crossings to the Workshop. Room identity must agree
with prior progress; active routes require the correct symbols; completed
crossings require an active arch. Unknown or contradictory saves recover safely.
Transient dialog state and animation phases are not saved.

## Art and current limits

The original concept is preserved. [Generated background variants and prompts](../art/prompts/crossing-production-notes.md) remove the baked-in traveler and provide the illuminated arch. The traveler uses the existing directional sprites. Rook is seated in the background here, keeping the walker docked; her animated standing routine remains in room one. Symbol shapes and labels are authored UI, not generated lettering.

Movement follows a safe foreground strip, without general navigation. Activation
crossfades to a generated image; stepping through changes rooms without an
animated vehicle transit. There is no audio.

Verification: 20 unit tests, 11 browser tests, and type-check/production build passed across the project. Additional checks at 1366×768, 1920×900, 2560×1080, 844×390, 320×568, and 390×844 found no page overflow and all crossing target centers within the scene. QA images are in `art/qa/crossing-*.png`.

The implemented continuation is documented in [The Workshop](WORKSHOP.md).
