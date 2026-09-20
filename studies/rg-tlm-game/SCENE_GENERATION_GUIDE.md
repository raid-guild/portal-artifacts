# The Last Mile scene and chapter generation guide

Use this workflow for every future scene. It is a production contract: a scene
is not ready to build until its brief, state transitions, walkthrough, visual
records, budgets, and acceptance checks agree. The guide itself grants no scope;
the Workshop is separately authorized by request #2866 and specified in
[`docs/WORKSHOP.md`](docs/WORKSHOP.md).

## 1. Staged discovery

Ask only about material gaps. Stop asking when the answer already exists in the
story, art direction, current save schema, or an approved brief.

### Stage A — authority and outcome

1. What scene or chapter is authorized, and what is explicitly out of scope?
2. What should the player feel, learn, change, or carry out of it?
3. Which reviewed story/art references are canonical?
4. Must an existing public path, save key, or deployed behavior remain stable?

Safe defaults: preserve `/rg-tlm-game/`, the `raidguild:last-mile:room-one` save
key, current controls, existing endings, and all prior chapter state. Add no
backend, account, wallet, timer, combat, destructive choice, or essential-item
loss unless specifically approved.

### Stage B — narrative and continuity

Ask only if missing: entry state, exit state, principal beat, NPC change,
estimated play time, and whether the scene is optional or required. Default to
one clear emotional beat, 3–5 minutes, a warm collaborative tone, and a visible
connection to the previous scene. Check names, carried objects, established
knowledge, time of day, traveler/Rook silhouettes, Guild symbols, and unresolved
promises against `docs/` and earlier prompts.

### Stage C — interaction and state

Ask only if missing: required actions, puzzle answer, allowable order, hint
ladder, failure response, inventory changes, and persistence boundary. Default
to inspect/talk/use verbs already taught; harmless retry; no random solution;
all essential items recoverable; and autosave after authored state changes.

### Stage D — presentation

Ask only if missing: camera, composition, new characters/props, responsive
exceptions, motion, audio, and supplied references. Default to the established
1672×941 painted fantasy-adventure scene plane, foreground walking strip,
separate transparent interactive layers, no audio dependency, 44px touch
targets, keyboard parity, and reduced-motion-safe transitions.

Record answers in `templates/scene-brief.md`. Mark an assumption as `DEFAULT`,
not as an approval. Escalate only contradictions that materially change story,
state, art ownership, public behavior, or infrastructure.

## 2. Scene contract

Complete this compact contract before implementation:

```text
Scene ID / title:
Narrative purpose:
Player promise:
Entry state and visible opening:
Exit state and next-scene handoff:
Target duration / pacing beats:
Continuity dependencies:
Primary loop: observe → approach → act → feedback → state change
Required interactions / optional interactions:
Puzzle rule and answer:
Hint ladder (nudge / method / answer):
Failure and recovery:
Save fields read / written:
Assets loaded at entry / deferred:
Walkthrough:
```

The scene graph must name every node and transition. A useful minimum is:

```text
entry
  ├─ explore → inspect/talk → return to explore
  ├─ collect/use → prerequisite state → puzzle-ready
  ├─ wrong action → specific feedback → unchanged recoverable state
  └─ solve → completion feedback → explicit exit → next entry
```

For each transition, specify trigger, guard, state mutation, feedback, focus
destination, save point, and repeat behavior. Write a numbered golden-path
walkthrough and at least three recovery walkthroughs: wrong order, interrupted
session/reload, and repeated solved action. If any reachable state lacks a next
action, the design has a soft lock and is not ready.

## 3. Objects and inventory

Use one row per object:

| Field | Required content |
| --- | --- |
| ID / label | Stable code ID and player-facing name |
| Affordance | What makes it look inspectable, collectible, usable, or scenery-only |
| Acquisition | Preconditions, feedback, and item location after taking |
| Uses / combinations | Valid targets, order rules, and specific wrong-target feedback |
| Consumption | `never`, `on use`, or `on chapter exit`; essential items default to `never` |
| Persistence | Ground/inventory/placed/packed state and migration default |
| Accessibility | Hotspot label, keyboard order, non-color cue, touch size |
| Continuity | Earlier origin and later consequence |

Inventory must be derived from authored item locations rather than duplicated
flags. Repeated take/use actions are idempotent. A player may never lose the only
route to progress.

## 4. NPC specification

For every NPC, record:

```text
Role in this scene / relationship to the player:
Immediate motivation / withheld information:
Silhouette, palette, scale, canonical references:
Idle, attentive, task, settled, and reduced-motion poses:
Movement anchors, walkable route, collision exclusions:
Dialogue states: first meeting / help / prerequisite / solved / repeat / return
Interruption and resume rules:
Keyboard and screen-reader name/description:
Continuity facts that must not drift:
```

Dialogue must react to current state, never imply an unperformed action, and
offer a useful help branch. Ambient behavior stops for dialogs, hidden tabs, and
`prefers-reduced-motion`. Keep story state pure; animation controllers present
state and do not own puzzle truth.

## 5. Environment and controls

Produce a composition map naming background, foreground walkable polygon/band,
hotspots, occluders, collision exclusions, character anchors, dialogue-safe
space, and crop-safe zones. Verify wide desktop, laptop, portrait mobile, and
short landscape. Art, sprites, props, and hotspots share the same scene plane;
never correct a composition by independently stretching one layer.

Every action must work by pointer/touch and keyboard. Preserve visible focus,
logical tab order, 44×44 CSS-pixel touch targets, meaningful button names,
status/dialog announcements, non-color feedback, sufficient contrast, and no
keyboard trap. Decorative art uses empty alt text; a scene's primary image gets
a concise description. Reduced motion removes walking/ambient/crossfade motion
without removing state feedback. Screen-reader text must expose objective,
selected item, action result, and modal purpose.

## 6. Image production and provenance

1. Copy canonical references into the protected source record or record stable
   URL, owner/license, retrieval date, dimensions, SHA-256, and exact role.
2. Save the exact submitted prompt before generation. Record tool/model/version,
   date, seed or job ID when available, referenced images, and operator edits.
3. Label each output as `generated`, `authored`, or `generated + authored
   overlay`. Route symbols, canonical marks, text, UI, hotspot geometry, and
   collision data should be authored overlays, not generated pixels.
4. Preserve the original output losslessly under `original-art/`; derive runtime
   assets from it. Never overwrite the master.
5. Background master: 1672×941 (16:9-ish scene plane). Transparent atlas: retain
   the measured native dimensions and alpha. Avoid upscaling.
6. Name files `<scene-or-character>-<state>-vN.<ext>`. A changed prompt or
   composition increments `vN`; encoding-only derivatives keep the basename and
   change extension.
7. Optimize reviewed masters to WebP. Current settings are quality 88 for opaque
   backgrounds and 90 for alpha sprites. Confirm dimensions, transparency,
   silhouette clips, and a real-browser visual before replacing references.
8. Update source metadata, prompt records, asset manifest, tests, optimization
   report, and work log together.

Negative constraints always name functional failures: no text or pseudo-logos,
no watermark, no cropped interaction object, no duplicate limbs, no baked-in
character intended for a separate layer, no changed camera, no shifted terrain,
no opaque sprite background, and no unsafe foreground obstruction.

## 7. Copy-ready prompt templates

The fill-in template is also in `templates/image-prompt.md`.

### Environment state pair

```text
Create a production background for “The Last Mile,” a warm painted
fantasy-adventure with crisp illustrated forms, weathered teal machinery, coral
light, and humane lived-in detail. Use [REFERENCE FILES] as explicit composition,
palette, and world references. Canvas exactly 1672×941. Camera: [CAMERA]. Keep
[WALKABLE FOREGROUND] clear. Include [LANDMARKS]. Exclude all separate-layer
characters, props, text, UI, logos, and symbols. State: [DAMAGED/REPAIRED/ACTIVE].
For a paired state, preserve camera, geometry, lighting, and every unchanged
pixel-region conceptually; change only [EXACT STATE DELTA]. No watermark, no
border, no photorealism, no cropped landmarks, no extra objects.
```

Example — Guild antechamber background (design example, not authorization):

```text
Create a production background for “The Last Mile” in the established painted
fantasy-adventure style. Canvas exactly 1672×941. A wind-worn Guild antechamber
inside the coral citadel, viewed from a fixed three-quarter camera; amber evening
light, teal repaired machinery, plaster, hanging plants, and practical maker
clutter. Keep the lower 22% as an unobstructed walkable stone strip and reserve
the lower-right for dialogue. Include a closed brass workshop door and a blank
ledger stand. Exclude characters, readable text, emblems, UI, loose inventory,
and light effects intended as overlays. No watermark, pseudo-lettering,
photorealism, fisheye lens, cropped door, or foreground blockage.
```

### Transparent NPC atlas

```text
Using [CANONICAL CHARACTER REFERENCES], create one transparent PNG atlas for
[NPC], matching The Last Mile's hand-painted fantasy-adventure style and stable
silhouette: [SILHOUETTE]. Exact canvas [WIDTH×HEIGHT]. Show [POSE LIST] with
generous non-overlapping gutters, consistent scale, ground line, costume,
lighting, face, and handedness. Full body and all extremities visible. Alpha
background only. No labels, grid, shadow, props not named, duplicate body parts,
cropped boots, costume drift, watermark, or opaque matte.
```

Example — keeper atlas:

```text
Using the approved citadel and traveler references, create one transparent
1536×1024 PNG atlas for the Guild keeper. Stable silhouette: short square coat,
rolled sleeves, round reading lenses, copper tool-chain, dark boots. Four poses:
neutral welcome, listening, pointing to a ledger, delighted recognition. Keep
identical proportions, costume, left/right handedness, warm upper-left light,
full body, shared ground line, and wide gutters. Painted fantasy-adventure,
not animation-film 3D. No text, badge design, extra tools, duplicate limbs,
cropping, cast shadow, watermark, or opaque background.
```

### Transparent prop sheet

```text
Create a transparent [WIDTH×HEIGHT] prop sheet for The Last Mile containing
[PROPS], each shown once at game-readable three-quarter view, separated by wide
gutters. Match [SCENE REFERENCE] lighting, outline weight, teal/coral/brass
palette, and worn handmade materials. Preserve believable affordances at small
display size. No labels, text, symbols, people, duplicate props, overlaps,
cropping, shadow outside each object's footprint, watermark, or opaque matte.
```

Example — route-repair props:

```text
Create a transparent 1536×1024 prop sheet containing one folded canvas cable
sling, one brass continuity key, and one palm-sized ceramic signal lamp. Painted
fantasy-adventure, warm upper-left light, teal/coral/brass palette, sturdy maker
construction, readable grips and insertion points. Separate objects by at least
12% canvas width. No labels, runes, logos, characters, duplicates, overlap,
cropping, watermark, or opaque background.
```

## 8. Performance and loading budget

Treat budgets as gates, not aspirations:

- Initial route: at most 3.0 MB image bytes, 100 KB compressed JS, 40 KB
  compressed CSS, 14 requests, and only the active scene state.
- Opaque 1672×941 background: target ≤450 KB each. Alpha atlas: target ≤500 KB.
- New chapter art must not load before it is the current scene. Load the current
  background and required sprites first; enable play only after those decode.
- Preload likely next-state/current-chapter art after explicit Begin/Continue or
  during genuine idle time. Load later chapters on transition intent, with a
  visible non-blocking preparation state if decode is not complete.
- Reuse atlases and authored vectors. Do not duplicate the same pixels under
  multiple URLs. Record cold-cache bytes, FCP, ready/decode time, request count,
  viewport, browser, host, and five-run median before and after.
- Verify no eager hidden `<img>`, CSS background, module preload, or sprite
  constructor silently defeats the loading plan.

## 9. Save schema and migration

Never change the existing storage key. Each serialized state has an integer
`version`. To add fields: define the new canonical state; parse JSON defensively;
validate types, enums, invariants, and coordinates; migrate every supported old
version explicitly; supply deterministic defaults for new optional state; reject
impossible combinations; and serialize only authored data. Derived inventory,
objectives, labels, and animation state do not belong in the save.

Tests must cover fresh state, every old-version migration, mid-puzzle reload,
chapter boundary reload, solved reload, invalid JSON, unsupported future version,
missing fields, impossible combinations, unavailable storage, and restart. Keep
the previous parser fixtures so backward compatibility cannot regress silently.

## 10. QA matrix

Use `templates/chapter-acceptance.md` and record evidence.

- Unit: rules, order independence, guards, idempotence, hints, failure recovery,
  migrations, invalid saves, derived inventory, and objective text.
- Browser: fresh/continued play, complete walkthrough, wrong order, reload at
  each durable state, restart, keyboard-only, touch, dialogs, focus return,
  reduced motion, and storage failure.
- Visual: 1440×900, 1366×768, 1920×1080, 390×844, 320×568, and 844×390;
  compare composition, alpha edges, crops, hotspots, dialogue, and overlays.
- Iframe/CSP: sandboxed Portal-style iframe, no top navigation dependency, no
  blocked resource, no private API/cookie/credential use, and approved
  `frame-ancestors` behavior.
- Accessibility: landmarks/name/role/value, heading/dialog structure, tab order,
  visible focus, 44px targets, contrast, non-color cues, live feedback, zoom,
  reduced motion, and a screen-reader smoke pass.
- Network/console: zero unexpected 4xx/5xx, mixed content, CSP errors, page
  errors, console errors, duplicate transfers, or eager later-chapter art.

## 11. Definition of ready and done

Ready means authorization and exclusions are linked; the scene contract,
graph, interactions, object/NPC specs, save delta, walkthrough, composition map,
prompt plan, budget, and acceptance cases are complete; canonical references and
provenance are available; and no material question remains hidden as an
assumption.

Done means editable source and published output match; exact prompts, references,
masters, derivatives, hashes, and production notes are preserved; migrations and
all planned tests pass; direct and iframe desktop/mobile checks pass; visual
review finds no material regression; measured bytes/timing meet budget or an
approved exception is documented; the work log names commands, evidence,
limitations, and next step; and the public path/save contract remain compatible.

Required artifacts: approved brief, discovery answers, scene graph, walkthrough,
object table, NPC specs, composition/hotspot map, exact prompts, reference
manifest, original masters, optimized derivatives, production notes, asset hash
manifest, source changes, unit/browser/visual evidence, accessibility/network/
console checklists, performance report, migration notes, and work-log entry.
