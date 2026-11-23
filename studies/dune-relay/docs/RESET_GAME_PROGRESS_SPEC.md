# Dune Relay reset game progress

**Status:** Potential future feature, not scheduled or implemented
**Date:** November 23, 2026

## Purpose

Let players start the story and campaign again from the Oasis. Chapter replays remain available for revisiting individual puzzles; resetting begins a fresh progression while preserving claimed access.

## Proposed player flow

Place **Reset game progress** near the bottom of Settings. Open a confirmation that explains what will be cleared and whether the reset affects this device or the player's Portal campaign across devices.

Offer **Export progress first**, **Cancel**, and **Reset and start over**. Do not require a typed confirmation phrase. After a successful reset, return to the opening Oasis welcome screen.

## What resets

- Completed levels, chapter progression, and story transitions.
- Campaign coins and saved booster selections or inventory, if present.
- Companion recruitment and active companion selection, returning to the initial campaign defaults.
- Seen tutorial history so introductions can play again.

## What remains

- Portal login and identity.
- Claimed Farmland access and the Dune Pass. Campaign progression gates still apply during the new run.
- Sound and accessibility preferences.
- Diagnostic and playtest history, retained separately so multiple runs can be compared. Close an active attempt as abandoned before resetting.

Resetting progression must not revoke entitlements, remove purchases, or sign the player out.

## Guest and Portal saves

For a guest, reset the campaign in the current browser or installed app storage context. Explain that other devices and separate storage contexts are unaffected.

For a Portal player, reset the cloud campaign and the corresponding local account save. Wait for server confirmation before reporting success. If the server cannot be reached, retain the existing campaign and offer Retry or Cancel rather than silently resetting only the local copy.

A future implementation must prevent queued saves or an older save from another device from restoring pre-reset progress. Use a server-authoritative campaign revision or reset generation, and reject stale writes. Keep access claims separate from campaign state.

## Verification before release

- A fresh run starts at the Oasis with initial coins, companions, story state, and tutorials.
- Claimed access survives, but later chapters still require the new run's progression.
- A Portal reset remains reset after reload and after opening another device; stale saves cannot undo it.
- Failed or interrupted cloud resets recover without claiming success or corrupting progress.
- Guest resets leave Portal campaigns, preferences, diagnostics, and playtest archives intact.
- Repeated confirmation clicks cannot create conflicting resets.

Related reference: [Portal cloud saves](portal-cloud-save.md). Offline reset and synchronization behavior should be revisited with the [offline play proposal](ASSET_PIPELINE_AND_OFFLINE_PLAY_SPEC.md).
