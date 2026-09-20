# Portal optimization work log

## September 20, 2026 — request #2929

- Fast-forwarded the request branch to the exact deployed/reviewed Archive
  source commit `19b972a941c9c39a82d3f9023c71997da02fd5d1` before implementation.
- Preserved the approved generated 1774×887 transparent prop sheet, its request
  artifact provenance, approved prompt metadata, and SHA-256 source hash.
- Replaced only the code-authored history shelves, ROT decoder desk, and signal
  lantern visuals with three tight quality-90 transparent WebP crops totaling
  285,424 bytes. The established wall/floor composition, traveler layering,
  hotspot semantics, story, decoder modal, and puzzle behavior are unchanged.
- Kept Archive art deferred until the room becomes active and synchronized the
  editable source, generated Vite output, public runtime assets, source records,
  and asset manifest.
- Implementation validation: `npm test` passed 33 tests; TypeScript and the
  production `/rg-tlm-game/` build passed; Playwright passed all 17 scenarios
  serially, including desktop/mobile Archive, reduced motion, keyboard/touch,
  save/reload, and sandboxed iframe coverage. Browser checks confirmed all three
  prop images decoded and desktop/mobile captures were visually reviewed.
- No puzzle state, save schema, public path, backend, credential, shared host
  policy, Portal launcher, deployment, or unrelated artifact was changed.

## September 20, 2026 — request #2914

- Based the Archive revision on current main commit
  `ff959f8bc0459b0134527e266668745021504e49`, which contains the exact preserved
  Last Mile source restored by request #2891 / PR #35.
- Added one code-authored Cypherpunk Archive annex after the Workshop and before
  The First Raid, with one encrypted message, one 26-position ROT ring, live
  preview, progressive hints, and the plaintext **SEND THE LANTERN**.
- Embedded a concise note about Eric Hughes’s 1993 *A Cypherpunk’s Manifesto*
  and its practical “Cypherpunks write code” emphasis. Adapted only Caesar
  encode/decode and live-preview ideas from `forge-Cypherpunk-Archive` commit
  `b031494b5c0e81cca1c56d082f70d366ca5670d6`; no backend, auth, database,
  leaderboard, daily challenge, multi-station flow, or extra cipher was copied.
- Kept `raidguild:last-mile:room-one` stable while adding validated save version
  4. Versions 1–3 migrate without losing prior chapter progress.
- Added focused unit and browser coverage for ring wraparound, wrong-answer
  recovery, hints, save/reload, direct desktop/mobile, keyboard, touch-sized
  controls, reduced motion, and a sandboxed Portal-style iframe.
- Implementation validation: `npm test` passed 33 tests; TypeScript and the
  production `/rg-tlm-game/` build passed; all 17 Playwright scenarios passed
  serially. Direct and sandboxed production-output smokes loaded the exact
  `game-DONGaaFd.js` and `game-DQuhsilD.css` bundles with no console errors,
  failed requests, or horizontal overflow. Existing artwork hashes, generated
  source/output byte comparisons, representative artifact route responses, and
  `git diff --check` passed.
- No new runtime image, backend, account, wallet, service, database, Portal
  credential, private API, shared host policy, launcher, deployment, or unrelated
  artifact was added or changed.

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
