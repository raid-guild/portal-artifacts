# Verification — request #2858

Status: **passed**

- Agent run: `b031395c-7db0-43b9-bd0a-a62c9379adbb`
- Base SHA: `37a92895bc84e65b4d6f4be2386cbb9f81b708d5`
- Head SHA: `942df30a0a4df76ae5fb7d35a5061c411563a0f0`
- Tree SHA: `9c8bc4d498e2bbe2a59308acbc9e9fa4ac7bff9e`
- Runtime: `codex-default` with repository, shell, and browser automation
- Local URL: `http://127.0.0.1:4185/rg-tlm-game/`

## Result

The exact implementation candidate satisfies the approved optimization and scene-generation-guide acceptance criteria. No tracked source was modified during verification, and the final worktree is clean.

## Checks

- Target integrity and scope: implementation head/tree match exactly; `git diff --check` passed. Shared `Caddyfile`, `Dockerfile`, `railway.json`, and `public/field` are unchanged from the implementation base.
- Unit: `npm test` — 3 files, 20 tests passed.
- Build: `npm run build -- --base=/rg-tlm-game/ --outDir=dist-verify --emptyOutDir` — TypeScript and Vite production build passed. Generated output was byte-identical to `public/rg-tlm-game/`.
- Asset/provenance integrity: `sha256sum -c studies/rg-tlm-game/ASSET_MANIFEST.sha256` — all 46 entries passed.
- Scene guide: manual audit confirmed all 12 app-spec requirement groups, reusable templates, performance/save/QA gates, provenance workflow, and explicit Workshop exclusion.
- Browser suite: serial Playwright run — 11/11 passed in 44.3 seconds.
- Launcher/shared hosting: `/rg-tlm-game/` remains the destination; Portal-compatible `frame-ancestors` is preserved; no launcher registration change is requested.

## Browser evidence

- Desktop 1440×900 under shared CSP: HTTP 200; 2,725,474 initial artwork bytes; 11 requests; inactive crossing/repaired art deferred; no overflow or console/page/network/HTTP errors.
- Mobile 390×844 with reduced motion: no overflow; keyboard hotspot interaction passed; visual inspection found no material crop, readability, or composition regression.
- Sandboxed iframe (`allow-scripts allow-same-origin`): loaded cleanly and enabled the Begin control.
- Unchanged FIELD module: HTTP 200; local modules initialized; primary control and blueprint canvas available; no runtime/network errors.

## Limitations

Live Railway deployment and Portal CMS registration were intentionally deferred to the post-review deployment and launcher stages, as required by the staged acceptance policy.
