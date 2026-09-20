# Portal optimization work log

## September 19, 2026 — request #2858

- Based the revision on deployed source commit `37a92895bc84e65b4d6f4be2386cbb9f81b708d5`
  and canonical game source `e40e2acd5315db9ceed5517be7eff494874143be`.
- Imported the editable TypeScript/Vite source, tests, lockfile, and game docs.
- Preserved all 12 original PNG masters under `original-art/` and the canonical
  exact prompts/production notes under `source-records/`.
- Encoded 12 runtime WebP derivatives at quality 88 (opaque backgrounds) or 90
  (transparent atlases), preserving dimensions and alpha. Initial image bytes
  fell from 21,052,681 to 2,725,474 (−87.1%).
- Changed scene loading so only the active visual state blocks Begin/Continue;
  the current alternate and next scene preload only after the player begins.
- Added `SCENE_GENERATION_GUIDE.md` and copy-ready brief, prompt-record, and
  acceptance templates. The guide explicitly does not authorize the Workshop.
- Preserved the public path, gameplay, storage key, save version 2, and v1
  migration behavior. No backend, account, wallet, database, host policy, or
  unrelated artifact changed.
- Verification: `npm test` (20 passed), type-check/production build passed, and
  Playwright serial suite (11 passed). Direct desktop/mobile and sandboxed iframe
  smoke checks passed under the shared CSP model with reduced motion, no overflow,
  no unexpected 4xx/5xx, and no console/page errors. Parallel browser execution
  exceeded the worker host's thread limit, so the complete suite was rerun with
  `--workers=1` and passed.
- Visual/codec review: all dimensions match; decoded alpha RMSE is 0; visible
  premultiplied RGB PSNR is 33.84–38.17 dB; desktop/mobile visuals show no
  material regression.
- Limitation: network-idle and FCP are local representative measurements, not a
  throttled field benchmark. Live verification remains for the deploy step.

## September 20, 2026 — request #2866

- Based the Workshop revision on the exact deployed optimized source commit
  `942df30a0a4df76ae5fb7d35a5061c411563a0f0` and preserved its public path,
  prior chapters, shared host configuration, scene guide, and optimized art.
- Added a playable third chapter with three original role-based NPCs, a
  recoverable context/build/route assembly puzzle, progressive hints, explicit
  place-at-the-table ending, and **The First Raid** hook.
- Kept `raidguild:last-mile:room-one` stable while adding validated save version
  3. Version-1 and version-2 saves migrate deterministically; a completed
  crossing resumes at the Workshop entrance without losing earlier progress.
- Preserved the recovered Workshop draft, generated production master, exact
  edit prompt, production record, source metadata, hashes, and a 427,880-byte
  quality-86 WebP derivative. The new chapter image remains absent from a fresh
  chapter-one initial load and is prepared on crossing connection.
- Added authored item symbols and state overlays, direct/mobile/keyboard and
  reduced-motion interactions, sandboxed iframe coverage, reload/recovery
  checks, and regression coverage for the earlier rooms.
- No backend, account, wallet, database, Portal credential, private API, shared
  host policy, Portal launcher, deployment, or unrelated artifact was changed.
- Implementation validation: `npm test` passed 26 tests; type-check and the
  production subpath build passed; Playwright passed all 14 browser scenarios
  with five workers. Production-output smoke checks passed direct and sandboxed
  iframe use at 1440×900, 844×390, and 320×568 with no overflow, page/console
  error, failed request, or undersized Workshop hotspot. A fresh chapter-one
  load used 10 subresources and 2,268,962 image bytes and did not request the
  Workshop image; after Begin it prepared the crossing but not the Workshop.
- `sha256sum -c studies/rg-tlm-game/ASSET_MANIFEST.sha256`, `git diff --check`,
  and generated source/output byte comparisons passed. Desktop, portrait, and
  short-landscape Workshop captures were visually reviewed with no material
  crop, target, readability, or composition defect.
- Limitation: these measurements and visuals are local implementation evidence.
  Independent verification/review and live checks remain in later workflow
  steps; this implementation step does not deploy.
