# Dune Relay reset game progress

**Status:** Reset deployed; outage recovery follow-up in progress
**Date:** November 24, 2026

## Purpose

Let players start the story and campaign again from the Oasis. Chapter replays remain available for revisiting individual puzzles; resetting begins a fresh progression while preserving claimed access.

## Player flow

Place **Start over** near the bottom of Settings. Open a confirmation that explains what will be cleared and whether the reset affects this device or the player's Portal campaign across devices.

Offer **Export progress first**, **Cancel**, and **Erase progress and start over**. Do not require a typed confirmation phrase. After a successful reset, return to the opening Oasis welcome screen.

## What resets

- Completed levels, chapter progression, and story transitions.
- Campaign coins and saved booster selections or inventory, if present.
- Companion recruitment and active companion selection, returning to the initial campaign defaults.
- Seen tutorial history so introductions can play again.

## What remains

- Portal login and identity.
- Claimed Farmland access and the Dune Pass. Campaign progression gates still apply during the new run.
- Immutable daily and chapter gift claim history, the current daily visit, and the one-time Fieldkeeper toolkit claim. Claimed gifts cannot be farmed by starting over; unseen claimed gifts are marked presented.
- Sound and accessibility preferences.
- Diagnostic and playtest history, retained separately so multiple runs can be compared. Close an active attempt as abandoned before resetting.

Resetting progression must not revoke entitlements, remove purchases, or sign the player out.

## Guest and Portal saves

For a guest, reset the campaign in the current browser or installed app storage context. Explain that other devices and separate storage contexts are unaffected.

For a Portal player, check cloud readiness before creating a reset request. If readiness fails, keep the current campaign and leave Cancel available. Reset the cloud campaign and corresponding local account save only after confirmation. If the result is uncertain, retain the request ID and offer explicit Retry, Cancel, and Close for now. Closing keeps a visible resolution notice and pauses gameplay and economic writes. Reloading must not automatically resend a destructive reset. Cancellation uses the same request ID: the server either records a cancellation tombstone before the reset, or reports that the reset already applied and returns the canonical profile. A delayed reset cannot erase progress after a confirmed cancellation.

The server increments a campaign generation and stamps new attempts and writes with it. Stale attempts, checkpoints, purchase/tool requests and imports cannot revive an earlier run. A pending reset request is stored separately on the device. Keep access claims separate from campaign state.

## Verification before release

- A fresh run starts at the Oasis with initial coins, companions, story state, and tutorials.
- Claimed access survives, but later chapters still require the new run's progression.
- A Portal reset remains reset after reload and after opening another device; stale saves cannot undo it.
- Failed or interrupted cloud resets recover without claiming success or corrupting progress.
- Guest resets leave Portal campaigns, preferences, diagnostics, and playtest archives intact.
- Repeated confirmation clicks cannot create conflicting resets.

Related reference: [Portal cloud saves](portal-cloud-save.md). Offline reset and synchronization behavior should be revisited with the [offline play proposal](ASSET_PIPELINE_AND_OFFLINE_PLAY_SPEC.md).

## November 24 outage and recovery

The deployed reset path returned HTTP 500 because the production Dune schema was missing inventory columns, the reward table, and the runtime role's DELETE grant on completions. This left a Pixel player in an uncertain reset dialog; the old client disabled Cancel and automatically resent the reset after reload. The production database received a narrow additive Dune migration and grants on November 24. `/leaderboard-api/dune-relay/ready` then returned 200 with an empty missing list. No player's reset was invoked during repair. The client and API recovery changes described above require a separate deployment.

## Rollout

Apply the updated `services/leaderboards/schema.sql` as database owner, then `services/leaderboards/ops/dune-grants.sql` in new environments. The migration adds `dune_attempts.campaign_generation`; the runtime role gets DELETE only on `dune_completions`. Deploy the API before the static game, and check `/leaderboard-api/dune-relay/ready`. Old API binaries do not preserve reset-generation metadata and must not be rolled back without retaining normalization support.

## Implementation validation

Typecheck, core checks, and all 128 service API tests passed against a disposable local database. The reset browser suite covers cancellation and permanent confirmation at 648×666, 844×390, 667×375, and 960×540; guest preference preservation; Portal reload recovery before and after server commit; stale-device queues; delayed pre-reset gift responses; and reset conflicts during tool and purchase recovery. Independent review findings were fixed and re-reviewed.
