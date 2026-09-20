# Chapter three: The Workshop

## Chapter brief

After Rook helps the traveler open the transit crossing, the traveler reaches a
shared workshop inside the floating citadel. Keeper Orin, Mica, and Sable teach
the player that a raid is complementary work around one promise: define the
need, build a durable handoff, and find a route through the world. The chapter
ends when the three contributions hold together and the traveler accepts the
open chair. The next story hook is **The First Raid** and the unfinished walking
lantern in the traveler's notebook.

Target playtime is 10–15 minutes. The chapter has no timed action, consumable
essential item, irreversible wrong choice, backend, account, wallet, or network
dependency.

## Scene graph and state table

```text
Crossing completed
  -> Workshop arrival
  -> meet Orin / Mica / Sable in any order
  -> receive brief / continuity key / route thread
  -> place each contribution at its matching station in any order
  -> assembled raid
  -> take the open chair
  -> place at the table / The First Raid hook
```

| Durable state | Available action | Result | Recovery |
| --- | --- | --- | --- |
| Role not met / item locked | Talk to that role | Marks role met; item enters inventory | Repeat talk gives role-specific guidance |
| Item in inventory | Use on matching station | Item becomes placed; objective count advances | Order independent |
| Item in inventory | Use on wrong target | Specific mismatch feedback; item remains in inventory | Player can immediately retry |
| All three items placed | Inspect or choose shared table | Offers the open chair | Hint points to the table |
| Raid assembled | Take place at table | Sets `joined`; completion dialog opens | Repeat is idempotent |

Hints first identify an unmet person, then the next unplaced contribution, then
the open chair. Every incorrect combination preserves the item and state.

## Inventory and object contract

| Item/object | Affordance and acquisition | Valid use | Persistence / accessibility |
| --- | --- | --- | --- |
| Raid brief | Orin gives it after first conversation | Open ledger | `locked` → `inventory` → `placed`; button and station have explicit names |
| Continuity key | Mica gives it after first conversation | Brass signal frame | Same three-state lifecycle; code-authored icon and non-color completion check |
| Route thread | Sable gives it after first conversation | Route board | Same three-state lifecycle; wrong station gives route-specific correction |
| Shared table | Inspectable from arrival | Completion action after assembly | Cannot complete early; open-chair action remains keyboard reachable |
| Citadel window | Scenery-only inspection | None | Named hotspot reinforces continuity with the crossing |
| Notebook | Carried from chapter one | Role-specific optional dialogue | Never consumed; sets up the next chapter |

Inventory is derived from item locations. Repeated conversations, uses, and
completion actions do not duplicate items or undo progress.

## NPC and dialogue sheets

| NPC | Silhouette and motivation | Dialogue states | Behavior and access |
| --- | --- | --- | --- |
| Keeper Orin | Older, silver hair, round spectacles, teal overshirt and work apron; keeps the shared promise visible | Arrival attention; first meeting gives brief; repeat explains context; notebook response; completion welcome | Fixed station behind table; descriptive hotspot; no real-person likeness |
| Mica · Builder | Copper curls, compact tool belt, careful hands at brass apparatus; wants the handoff to survive reality | First meeting gives key; repeat names signal frame; notebook response | Fixed builder station; pointer, touch, Enter/Space paths |
| Sable · Strategist | Tall figure with ochre scarf, map case and route scroll; connects working things to people and place | First meeting gives thread; repeat names route board; notebook response | Fixed map station; logical tab order and explicit label |

The background contains only these three original NPCs. The player remains a
separate sprite. NPCs do not animate independently, so reduced motion requires
no alternate pose and dialogue cannot desynchronize from puzzle state.

## Composition and hotspot map

The 1672×941 scene uses a fixed wide camera. The lower 22% is the walkable band
(`x 8–94`, `y 82–95`). The left window and bench establish arrival; NPCs read
left-to-right as Sable (41%,45%), Orin (65%,43%), and Mica (89%,42%). Puzzle
stations sit below them: ledger (58%,60%), signal frame (72%,60%), route board
(83%,59%), and shared table (70%,70%). Mobile overrides separate clustered
targets while retaining 44px controls. Labels, icons, completion checks, focus,
and selection feedback are authored overlays.

## Save schema and migration

The storage key remains `raidguild:last-mile:room-one`. Version 3 adds the
canonical `workshop` object:

```text
metOrin, metMica, metSable: boolean
brief, key, thread: locked | inventory | placed
assembled, joined: boolean
```

The parser validates role/item correspondence, assembly truth, the joined guard,
room/transit continuity, prior chapter invariants, and coordinates. Version-1
saves migrate through the existing crossing migration. Version-2 saves preserve
their complete transit state; a completed crossing enters the Workshop at
`{x:12,y:91}`, while unfinished saves remain in their prior room. Unsupported,
missing, contradictory, or impossible states are rejected. Version-3 state is
saved after each interaction, movement, room transition, and visibility change.

## Walkthrough

1. Repair the walker, accept Rook's ride, set the Spire/Lantern route, transmit,
   and step through the arch.
2. Talk with Orin, Mica, and Sable in any order.
3. Put the raid brief in the open ledger, the continuity key in the signal
   frame, and the route thread on the route board. A wrong pairing gives a
   useful correction and preserves the item.
4. Select the shared raid table and take the open chair.
5. The completion dialog welcomes the player and names **The First Raid**.

## Art and performance

The exact production edit prompt and notes are in
`source-records/art/prompts/workshop-background-v2.txt` and
`workshop-production-notes.md`. The lossless master is
`original-art/workshop-background-v2.png`; its 427,880-byte quality-86 WebP is
served lazily. See `ASSET_MANIFEST.sha256` and `OPTIMIZATION.md` for hashes and
budget evidence.

## Acceptance checklist

- [x] Golden path, wrong-target recovery, order independence, repeat actions,
  mid-puzzle reload, completion, and v2 boundary migration have automated tests.
- [x] Existing chapter unit and browser scenarios remain in the suite.
- [x] Pointer, touch-sized controls, keyboard activation, focus return,
  explicit labels, live dialogue, non-color completion cues, and reduced-motion
  behavior are implemented.
- [x] Desktop, portrait-mobile, direct, and Portal-style sandboxed iframe paths
  are covered by Workshop browser tests.
- [x] The Workshop adds no private request, credential, cookie, service, or
  eager chapter-one image transfer.
- [x] Exact prompt, edit input, masters, derivative settings, hashes, and source
  notes are preserved.
- [ ] Independent verification and review of the committed candidate remain for
  the next workflow steps.
