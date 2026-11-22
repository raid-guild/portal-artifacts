# Chapter 6: Castle Island

The Town Crier's conflicting delivery records lead across the river to Castle Island. At the dock, a beetle Quartermaster has a second manifest that contradicts the town copy. The party clears and reconciles the stores, then discovers a boat route upstream. The last level ends with a short “More levels coming soon” note and links back to Castle Island and the kingdom map.

## Play

Ten levels, 6.1–6.10, use the existing five symbols and familiar crates, salt crust, and seedpods. No sixth symbol, new obstacle, or new power is introduced here. Board shapes and combined goals add difficulty. The first fifty authored levels, their seeds, and their move caps remain unchanged. The Castle levels have recorded legal winning routes in `scripts/town-winning-routes.json` and are checked by `scripts/check-core.cjs`.

The Castle arrival introduces raid leader selection in the Raid Party dialogue. Every collected playable companion can lead. The Quartermaster appears there as an NPC and cannot be selected. The chosen leader becomes the walking player sprite across story scenes and provides their existing board ability. The selection persists in local and Portal saves; an active attempt freezes the ability at preparation, so switching the leader later cannot change that board. There is no per-level selector or recommendation badge.

Abilities are defined once in `services/leaderboards/src/dune-companions.json`: Keeper: nine reeds, one row Jet and one column Jet; Wayfinder: nine pennants, two Flywheels; Gatewright: nine keys, one Prism; Fieldkeeper: twelve reeds, two Flywheels; Town Crier: twelve pennants, two column Jets. Charges can repeat in one attempt as before.

## Deployment

Apply the idempotent `services/leaderboards/schema.sql` migration to add `dune_attempts.companion_snapshot` before deploying the updated service and public game artifact. Service readiness checks require the column. This chapter adds no new secret or live configuration; those deployment steps have not been performed here.

## Access and saves

Castle Island follows the Town finale and requires the Portal account's Dune Pass. The server validates the chapter transition and the selected unlocked companion. It stores a `companion_snapshot` with each Castle attempt, including attempts with no bought boosters. Preparation retries return the frozen snapshot. Existing active attempts can finish during a temporary commerce check outage; new attempts cannot start without verified access. Chapter 5 content remains available under its original move caps for older clients.

## Cascade presentation

Resolved gameplay clear waves trigger restrained effects beginning at wave four, with stronger tiers at six and eight. The effect shakes only the board art, limits live particles to 48, and raises tones within a bounded range. The existing callout appears at wave four. It does not fire for the coin finale; reduced motion and mute settings are honored.
