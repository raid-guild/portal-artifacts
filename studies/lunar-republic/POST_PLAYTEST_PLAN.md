# Lunar Republic: post-playtest plan

Status: proposed roadmap, pending player feedback. Updated September 22, 2026.

This document defines how we will use the first playtest to finish the prologue, then decide whether to add replayability and further chapters. It records no player findings and makes no delivery-date commitments.

## Product goal

Make one satisfying, understandable game about winning lunar independence through orbital skill, allied trade, station development, and pressure on Vesper. Preserve the cartoon science-fiction art direction and hands-on trajectory plotting. Polish the first scenario before expanding its world.

## Current baseline

The current build contains:

- One scenario with Port Azure, Meridian, Vesper, and the lunar station.
- Manual direction, muzzle-speed, and departure-delay controls, with optional first-delivery guidance.
- Shared orbital prediction, campaign resolution, and flight playback.
- Six-hour shifts: waiting advances one; launches advance departure plus flight time rounded up to shifts.
- Immediate station upgrades, production each shift, and separately scheduled return shuttles.
- Freight, relief, demonstrations, district strikes, and blockade clearing.
- One priority Azure delivery request and preparing blockade fleets that timely shipyard strikes can delay.
- Radio messages and a launch timeline showing requests, threats, arrivals, and resource consequences.
- Diplomatic and military completion routes.
- A Prologue complete screen with campaign statistics, Continue building, and a confirmed Start again action.
- Browser-local saves and a dedicated mobile plotting interface.

This is a playable prologue. It does not yet offer multiple chapters or randomized campaign setups. We do not yet have evidence that new players consistently understand and enjoy the whole loop.

Existing checks in [PLAYABILITY.md](PLAYABILITY.md) demonstrate technical viability, not first-time player comprehension. Implementation details and local setup are in [README.md](README.md).

## Questions for the playtest

1. Can a new player identify the first objective and land freight without a facilitator taking over?
2. Does plotting feel like learning a skill? Can players explain a miss and make a purposeful adjustment?
3. Before committing, can players predict arrival, intervening threats, and the later return of supplies?
4. Do upgrades, freight, demonstrations, and strikes present understandable choices?
5. After a miss, expired bonus, or blockade, can players identify a viable next action?
6. Can players explain their current objective and how the prologue ends?
7. Does the ending make completing the playtest unmistakable and satisfying?
8. Can mobile players watch the plot, adjust controls, and inspect the timeline comfortably?
9. Would they play again, and what different decision would they try?

## Gather evidence

Begin with a small qualitative round including first-time desktop and mobile players. Record prior knowledge and help received. Include people who stop early; an unfinished session is useful evidence.

Let players attempt the opening with the existing guide. If help becomes necessary, record their intended action, the point of confusion, and the exact hint. Ask them to predict an upcoming arrival or threat before launching, then compare their explanation with the result. Guessing a correct outcome does not establish understanding.

At the end, ask what felt satisfying, frustrating, unnecessary, and worth trying differently. Capture device/browser, build revision, first-delivery attempts, major decisions, completion or stopping point, and useful quotes. Record campaign shifts separately from real session duration.

Start with facilitator notes and volunteered screenshots or saves. Ask before recording sessions or collecting identifiable information. Building an automatic telemetry service is outside this initial scope.

### Findings template

| Field | Entry |
| --- | --- |
| Build and device | Revision, browser, viewport or phone model |
| Player context | First-time/returning, relevant experience, help received |
| Intended action | What the player thought they were doing |
| Observed behavior | What happened, with campaign shift where useful |
| Evidence | Quote, screenshot, reproduction steps, or supplied save |
| Consequence | Blocked progress, confusion, unintended cost, discomfort, or preference |
| Working explanation | Hypothesis, distinguished from observation |
| Proposed response | Smallest change that could address the issue |
| Verification | What a new attempt must demonstrate |
| Decision | Fix now, investigate, defer, or preserve current behavior |

Do not generalize a small sample to all players. Seek recurring patterns, reproducible failures, and clear causes. Record disagreements as well as agreement.

## Prioritization

| Priority | Examples | Action |
| --- | --- | --- |
| P0: blockers | Crash, lost save, inaccessible essential control, forecast/result disagreement, no viable route forward | Resolve before another round |
| P1: comprehension and completion | First-delivery confusion, hidden time costs, unclear recovery, unreadable mobile controls, unrecognized ending | Address observed consequences first |
| P2: choice and pacing | Dominant strategy, repetitive waiting, upgrades without a useful role, arbitrary-feeling pressure | Investigate once players understand the rules |
| P3: expansion | Additional destinations, chapters, narrative systems, optional visual polish | Defer from the next implementation batch |

A single severe reproducible defect can outrank a frequent cosmetic request. Player suggestions identify needs; they do not automatically determine the solution.

## Stage 1: make the existing prologue understandable

Select a bounded batch addressing the highest-priority findings. Avoid combining interface and economy changes unless the evidence requires both.

| Area | Possible response, conditional on findings | Acceptance check |
| --- | --- | --- |
| Opening and aiming | Improve local guidance, control feedback, or miss explanations | A new player makes a delivery and explains their adjustment without being given final settings |
| Time and operations | Clarify departure, arrival, enemy action, deadline, and shuttle labels | Players distinguish arrival from payment and describe consequences before launch |
| Recovery | Surface an available action; explain held shipments and expired bonuses | A player continues after a miss and blockade without resetting or injected resources |
| Completion | Improve objectives, report, or ending actions | Players recognize completion and understand Continue building versus Start again |
| Mobile | Adjust touch targets, plot space, control placement, or dialogs | Essential actions work without clipping, accidental input, or repeated scrolling between plot and controls |

**Gate:** no known P0 remains, and follow-up observations show the addressed misunderstandings have improved. This is a qualitative decision, not a promised completion-rate target.

## Stage 2: make decisions worth understanding

Begin balance work only when observations distinguish difficulty from unclear presentation.

- Check whether slower or delayed shots create useful energy-versus-time decisions.
- Check whether priority freight and fleet disruption offer viable competing choices.
- Check whether production and upgrades support recovery without making effortless waiting the answer to every problem.
- Check whether diplomatic and military routes have understandable costs and consequences.
- Change a small related set of values at a time; record the expected effect before testing.

Preserve ordinary trade when optional requests expire. Do not add starvation failure, mandatory deadlines, or new economic systems merely to make the game harder.

**Acceptance:** representative runs complete both routes without resource injection, recover from plausible mistakes, and expose meaningful reasons to choose one action over another. Observe whether players notice those tradeoffs.

**Gate:** retain changes only when rules checks and another player round support the intended improvement. Revise changes that merely add delay or confusion.

## Stage 3: test modest replayability

Once the scenario is understandable and satisfying, prototype a small set of authored starting-condition variants. Candidates include an initial station upgrade, a different opening freight opportunity, or a different enemy schedule. Start with one variation axis so its effect can be evaluated.

Keep the original guided scenario available. Expose each variant's starting conditions and preserve the same forecasting rules. Prefer reproducible presets before procedural generation. Each preset needs viability checks and an identifier retained in its save.

**Acceptance:** returning players identify a different useful strategy; variation changes a meaningful decision rather than merely adding waiting or shortages.

**Gate:** expand only if players want another run and variants deliver distinct choices. Otherwise return to clarity and pacing work.

## Deferred scope

Do not schedule another chapter until the first scenario earns another playthrough. Also defer branching dialogue trees, many new cities, fleet simulation, atmospheric flight, elaborate cargo pickups, deep manufacturing chains, accounts, and leaderboards. These remain possibilities, not prerequisites for a finished prologue.

## Implementation and verification

Keep campaign rules in `public/lunar-republic/game.js`, orbital behavior in `orbital.js`, and presentation in the existing UI, timeline, guidance, radio, and rendering modules. Preview and committed launches must continue to share resolution logic. Radio explains available actions without becoming a required progression gate.

Preserve browser-local saves. Validate optional fields conservatively and label unavailable legacy statistics honestly.

For each implementation batch:

1. Record the finding, hypothesis, proposed change, and expected player-visible effect.
2. Run `npm test --prefix studies/lunar-republic` and add focused regression coverage for changed rules, persistence, or reproduced defects.
3. Check preview/commit parity and timing boundaries when time or economy rules change.
4. Exercise affected flows on desktop, narrow mobile portrait, short landscape, and keyboard controls.
5. Verify fresh, continuing, and completed saves when persistence or completion changes.
6. Review independently, fix actionable findings, and deploy through the existing Railway workflow within the agreed release scope.
7. Update [PLAYABILITY.md](PLAYABILITY.md), distinguishing automated checks from player evidence.

## Decisions after results arrive

- Is optional aiming guidance sufficient, or does the opening need a shorter guided sequence?
- Is the main challenge trajectory discovery, scheduling, resource management, or a particular balance of the three?
- Do players want a tighter ending or meaningful activity after independence?
- Are completion statistics motivating without pushing one prescribed strategy?
- Which starting-condition variation gives the clearest reason to replay?
- Does feedback justify a second chapter or another polish pass?

The next deliverable after feedback is a findings summary and a ranked, bounded implementation batch. Expansion is a decision supported by that evidence, not an automatic next step.
