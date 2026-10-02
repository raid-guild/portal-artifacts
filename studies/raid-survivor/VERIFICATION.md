# Verification — 2 October 2026

## Passed

- TypeScript and Vite production build.
- Simulation regression suite: distinct starting weapons, 2,400-enemy cap, evolved three-weapon loadout, backpack swaps, maximum-rank reward fallback, sequential overlapping chest rewards, bounded pickups, boss collisions across grid cells, queries before first tick, meteor damage independent of visual effects, and clear/endless progression.
- Auth/API tests: signed Portal contract, invalid token rejection, run ownership, same-origin writes, finish idempotence, elapsed validation, persisted scores, bounded/expiring run tickets and replacement handling.
- Browser checks: character selection, reduced-motion and animated casino rewards, clear screen protected from Escape, endless continuation, portrait dual-touch movement/aim, pointer cancellation, backpack in portrait and landscape, death and restart. No JavaScript exceptions in final runs.
- Screenshots inspected for desktop menu, mobile gameplay, level rewards, and casino rewards.

## Performance evidence and limits

The reusable `npm run benchmark` tests three rank-five weapons against durable enemies after 600 warmup ticks, then samples 300 simulation ticks. On this host (Intel Core Ultra 5 226V), the 2,400-enemy run measured approximately 0.18 ms mean and 0.28 ms p95 per simulation tick. These are simulation-only Node timings, not rendered frame rates.

Headless Chromium rendered crowds of approximately 1,000 and 2,000 enemies with 11 draw calls. The browser reported ANGLE/SwiftShader software rendering. At 1440×960 it was slow: approximately 83 ms median frame interval at 1,000 and 167 ms at 2,000. The latter sample also encountered the level-up modal, so it is not a clean continuous-combat benchmark. These results establish that the crowd renders and remains bounded; they do not establish a smooth hardware frame rate. Physical phone and hardware-GPU testing remain necessary.

Real Portal launch registration and production deployment are not configured. The callback contract is tested locally. Shared leaderboard scores are suitable for casual play because combat totals originate in the client. See README.md for deployment and persistence requirements.

## Accepted polish pass

- Production build and 15 gameplay tests passed after the polish changes; auth tests and the Portal/leaderboard API regression test also passed.
- Browser verified left/right hero facing, visible reference enemy sprites, Q bomb activation, paused recharge, default automatic targeting, optional dual-touch aim, two-pointer cancellation, ham/shrine healing (65 to 100 HP), Moloch's visible sprite and distinct arrival/defeat banners, and landscape backpack access.
- Casino checks verified the full buildup and reveal, immediate Skip, stable status after waiting beyond the canceled stages, local reduced-motion mode, and the operating-system reduced-motion preference. Final browser run reported no JavaScript errors.
- Manual motion reduction omits moving spotlight/ray/confetti elements. Boss and enemy resources are disposed on restart; the existing simulation benchmark remains available. Real phone/GPU performance limits above still apply.
- New Moloch artwork was generated with the built-in ImageGen tool. Its exact prompt is in art/moloch-generation.txt and the saved transparent asset is public/characters/moloch.png.

## Vault Runner music integration

- The approved standalone music test remains byte identical (SHA-256 `f58d6f891f35219c93534e814570fd1fb4843c25e232d43402fb8c87e444d287`).
- A deterministic Web Audio trace test compares all 1,024 sixteenth-note steps of the game engine against the standalone source, including graph creation and audio parameter automation.
- A mocked transport test covers rapid repeated starts, one context and timer, mute and volume changes, tab hide/show, pagehide/pageshow, and disposal.
- Music has its own audio context and persisted controls; sound effects retain their separate toggle. Browser playback still needs a manual listening check on each target device.
- Final browser checks passed with no JavaScript errors: cold load created no music context; starting and three retries kept exactly one music context and scheduler; mute remained independent of SFX; keyboard volume adjustment and persistence worked; hiding suspended playback and restoring resumed the same transport.
- Browser OfflineAudioContext comparisons sampled two bars from each of the four sections at 22,050 Hz. Maximum absolute sample difference from the approved engine was below 4.5e-8 (floating-point precision); output was finite, nonzero, and bounded.
- Deferred resume/suspend race regression tests and a focused independent re-review passed. The API integration regression test passed with temporary loopback access.

## Player death presentation

- Added a 1.3-second atlas-based pixel melt and a layered impact/descending-tone/fizzle death cue. Local and system reduced motion use a 250 ms fade. Banking and abandoning skip combat-death effects.
- Fatal contact and projectile regression tests verify that healing, rewards, and weapon fire cannot occur after the fatal hit. Production build, gameplay/music regression suites, and an isolated Portal/API regression run passed.
- Sequential desktop/mobile Chromium checks passed with no JavaScript errors: frozen simulation before results, one cue per defeat, three retries without duplicate music, SFX mute, both reduced-motion settings, hidden-tab presentation pause, immediate cleanup when replacing a dying run, and bank/abandon behavior.
- Chromium ran with gesture-required audio autoplay; both audio contexts were created within the Enter Vault gesture, with none created on cold load. Physical-device listening is still a manual check.
- HUD controls and sticks are disabled during death. The FX canvas was checked for zero remaining hero pixels at completion. Desktop/mobile screenshots were captured and inspected.
- Independent review findings were fixed and re-reviewed clean. The approved standalone music SHA-256 remains unchanged.

## Portal Artifacts integration — 2 October 2026

- Built for `/raid-survivor/` and served through the repository's Caddy configuration. Fonts and all game assets loaded from the subpath with no CSP or JavaScript errors. Font licenses ship in `public/fonts/`.
- Q fires while a HUD button is focused, has an on-screen desktop keycap and accessible shortcut metadata, and does not fire in settings. Touch bombing remains available.
- Fourteen shared-service tests passed on Node 24 with disposable PostgreSQL: the eight existing Cosmic tests were retained, plus Raid scoring/auth/ownership/CSRF/idempotency/rate-limit checks and combined-service tests with and without the Raid secret. Game/music suites and production build passed.
- Caddy configuration validation passed. The additive schema was applied twice with existing scored rows for both games; counts and score totals were preserved.
- Browser checks covered a synthetic signed Portal launch, path-scoped HttpOnly cookie, clean return URL, ranked run creation and score submission, isolated Cosmic rankings, desktop/mobile layout, API failure/local-score fallback, and retry.
- A delayed session lookup does not block local play or attach a ranked session to an already-started local run. Failed launches clean the URL and link to the specific Portal module. Opaque scripts-only sandbox embeds played and ended runs without storage exceptions or leaderboard API calls.
- Independent review completed; startup and Portal-link findings were fixed and rechecked. The music engine and approved standalone composition remain unchanged.
- Railway was inspected read-only to confirm existing service routing and missing Raid launch-secret configuration. No production migration, secret update, Portal registry update, deployment, or merge was performed. Rollout steps are in `services/leaderboards/README.md`.
