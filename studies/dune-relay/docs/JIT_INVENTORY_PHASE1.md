# Field Toolkit and in-game inventory (phase 1)

## Player rules

Farmland (Chapter 4) introduces the Fieldkeeper's toolkit. A Portal player who has arrived in Farmland can claim one Tile Bomb and one Free Swap. The claim is account scoped and works for older campaigns already past Farmland. The gift is offered during the next story visit, with a claim button in Settings if dismissed. Claiming twice gives no extra stock. Playtest stock is separate from the campaign.

On the first selection of either owned tool, a small animated board example explains its effect. The player can skip the example and use the tool immediately. These examples do not consume inventory and can be replayed from Settings → How to play. The Seedpod level's opening lesson remains separate; the tool example appears only when a tool is selected.

Playtest Settings also has **Preview Fieldkeeper gift**. Each preview claim grants one of each tool to the isolated playtest inventory so the layout and stock flow can be checked repeatedly; canceling leaves stock unchanged. The account-scoped campaign claim remains one-time.

Both tools cost 600 coins in the board UI. Buying adds one inventory copy; selecting a target spends one copy. Canceling selection preserves the copy. A Tile Bomb clears one ordinary symbol or directly hits one salt block or seedpod once. It does not damage adjacent obstacles. It cannot target a crate, hole, or power tile. A Free Swap exchanges adjacent movable tiles even when no match results; it cannot exchange a crate, seedpod, or salt cell, and identical ordinary tiles are a no-op. If a swap involves an existing power, its usual explicit behavior applies. Tool actions do not use a move or advance current routes, though their clears can cause normal cascades, goal credit, deliveries, and companion charge. Tools are available only while a campaign board is active and has moves remaining. The lost screen and replay mode have no tool controls.

Starting Water Jet, Flywheel, and Prism copies are part of the same inventory. The prelevel shop shows owned counts. Selecting one reserves an owned copy when available; any selected item without stock has the normal coin price. The account locks the funding split when preparing an attempt, then consumes owned copies and coins atomically at activation. Canceling before activation spends nothing. If another device spends reserved stock, activation fails and the player must refresh; it never silently substitutes a coin charge. Old prepared attempts without a funding quote retain their original all-coins rule.

## Save and recovery

Inventory and the one-time toolkit claim live at the top level of the server profile, outside the campaign save. Guest import and story checkpoints cannot grant, remove, or overwrite inventory. Account/profile row locks and operation receipts make gift, purchase, and consumption requests idempotent. An accepted tool target is journaled locally before the consume request. A timeout keeps the board unchanged and retries the same operation ID; a confirmed result and the subsequent stable board snapshot are stored before another action. A reload attempts to reconcile a pending action and restore the local board for that account and attempt. Cross-device inventory and chapter progress sync; cross-device midlevel board resume is outside this phase. Offline purchase and consumption are unavailable.

While a tool action is uncertain, ordinary swaps, tool cancellation, and leaving the board are blocked. The board offers **Retry pending tool action**, which resends the same operation ID. A definite validation, access, or revision rejection (HTTP 400/403/409) clears the journal and refreshes the profile; network failures and server errors retain the receipt for retry. The purchase dialog similarly keeps uncertain requests and releases a definitely rejected purchase for a fresh choice.
After a definite rejection, the latest Portal campaign replaces the local view. The pre-action board is restored only when that level remains the next playable level and the chapter is still available. If another device advanced the campaign, the player returns to the story map. Unsynced local checkpoints remain available for backup and conflict resolution in Settings.

The server checks account, chapter access, current active attempt, revision, inventory, tool sequence, submitted board fingerprint format, and positive moves remaining. It does not replay every normal board move; the local rules engine validates the exact target. This is not server-authoritative match-three play.

## Rollout

Apply the additive `services/leaderboards/schema.sql` migration with the database owner **before** serving the new backend or frontend. The backend Docker start command does not migrate automatically. Run `npm run migrate` in `services/leaderboards` with the appropriate owner database connection, then verify `/leaderboard-api/dune-relay/ready` reports the new `booster_funding` and `tool_sequence` columns. Deploy the backend before the game artifact. No live migration or deploy was run during implementation.

The new content version is `chapter-7-4`; the service retains the full `chapter-7-3` move-cap snapshot for previously started levels. Campaign Save remains v5.

## Verification

The change passes typechecking, the core suite (70 level baselines, River witnesses, and tool rules), and 121 API checks against disposable local PostgreSQL. Browser coverage includes mobile targeting/cancel, both tools, move-count exports, 600-coin purchases, owned starting boosters with zero coins, and eight recovery scenarios covering lost responses, definitive rejections, reloads, and cross-device stale receipts. Run `npm run test:jit-browser` against the sandbox and production preview URLs documented in the scripts. Production and sandbox builds are generated separately so public builds keep playtest disabled.

## Deferred work

Daily opening gifts and the chapter gift catalog are specified in [phase 2](REWARDS_PHASE2.md). Streaks, level achievements, and offline play remain deferred. Phase 1 introduced only the one-time Fieldkeeper gift and the inventory needed for tools and starting boosters.
