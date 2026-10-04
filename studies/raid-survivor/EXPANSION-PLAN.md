# Forest and Monster Book implementation

- [x] Shared version 2 rules, canonical MonsterMaps records, and database schema.
- [x] Portal profile, mastery purchases, run checkpoints, and versioned leaderboards.
- [x] Training and Forest selection, unlocks, capped class skills, and guest persistence.
- [x] Forest behaviors, elemental counters, art, monster book, and level presentation.
- [x] Run and service tests, simulation benchmark, and production build.
- [x] Browser review of Portal profile, Forest selection, mastery purchase, monster book, leaderboard, and mobile layout at 412 × 915.
- [x] Targeted browser check of the ranked start skill snapshot after the review fix: cached profile had no Vitality, server profile gained rank 1, and the new ranked run correctly started at 105 health with rank 1 stored in its run configuration.
- [x] Independent review and targeted recheck completed; the mastery snapshot finding is resolved. Final verification: six client suites, twenty service tests, and production build pass.
- [ ] Physical Pixel 8 performance check at high enemy counts.

The first release has two single-run levels. Training unlocks Forest at 180 active seconds; Forest awards its milestone at 300 active seconds. A class earns each milestone once. Every class can spend up to two credits on distinct skills: vitality, agility, or bomb recharge. Existing version 1 scores stay available in a legacy board. Both levels share the same scoring formula.

## Desert Oasis and Frozen Highlands extension

- [x] Shared four-realm progression: Forest at 5:00 unlocks Desert; Desert at 7:00 unlocks Ice; Ice awards a credit at 9:00. Each milestone is awarded once per class, including profiles saved by the earlier release.
- [x] Two ranks per class skill and exact purchase retry keys, with the immutable server snapshot applied at ranked run start.
- [x] Four canonical MonsterMaps records, realm-specific counters and checkpoint validation, and all six leaderboard filters.
- [x] New realm pacing, attacks, warnings, power-up openings, art, and selected-realm GPU texture loading.
- [x] Focused rule, API, and simulation tests, production build, and horde benchmark.
- [x] Browser review of four realm cards, Desert/Ice visuals, Portal score saves, seven-entry book, and desktop/mobile layout at 412 × 915.
- [x] Independent review completed; duplicate Training filter, empty texture initialization, and oversized source-image findings fixed. A second agent pass was unavailable due to the session thread limit; primary inspected and verified those fixes.
- [x] Focused browser recheck: exactly six distinct leaderboard filters, optimized Desert/Ice textures render correctly, and switching from Ice to Desert emits no browser warnings or errors. Final production build and nine client test files pass; the service suite passed 25 tests.
- [ ] Physical Pixel 8 sustained performance check at high enemy counts.

All four realms are independent runs with the same score formula, a 12-minute
clear, and optional endless play. The Ice monsters' original on-chain Mountain
names are retained in the book while their game setting is Frozen Highlands.
