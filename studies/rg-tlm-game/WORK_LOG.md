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
