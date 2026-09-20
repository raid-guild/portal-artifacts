# Verification — request #2866

Status: **passed**

- Agent run: `53aa1d99-b71f-4221-bb7e-e8eb454ef19e`
- Base: `942df30a0a4df76ae5fb7d35a5061c411563a0f0`
- Head: `154e8150176a227967df04ce0a39543574bef6ad`
- Tree: `f0ffaff8083734c3825b959a3be7c30b8d631f53`
- Runtime: `codex-default` with repository, shell, and browser automation
- Local production URL exercised: `http://127.0.0.1:4186/rg-tlm-game/`

## Result

The pinned candidate satisfies the approved Workshop acceptance criteria. The chapter opens from the completed crossing, presents three original role NPCs, supports a recoverable order-independent assembly puzzle with progressive guidance, autosaves and resumes, migrates version-1/version-2 progress, grants an explicit place at the table, and names **The First Raid**. Prior chapter regressions, responsive input paths, reduced motion, sandboxed iframe operation, shared hosting boundaries, generated-output parity, asset provenance, and initial-load deferral all passed.

## Checks executed

| Check | Command / method | Result |
| --- | --- | --- |
| Target integrity | `git rev-parse HEAD` and `git rev-parse HEAD^{tree}` | Exact implementation SHA/tree; no newer deployment candidate or current-head recovery artifact. |
| Diff hygiene | `git diff --check 942df30a0a4df76ae5fb7d35a5061c411563a0f0..HEAD` | Passed. |
| Unit tests | `npm test` | 4 files, 26 tests passed. |
| Production build | `npm run build -- --base=/rg-tlm-game/ --outDir=dist-verify --emptyOutDir` | Type check and Vite build passed; 24 modules transformed. |
| Published parity | `diff -qr studies/rg-tlm-game/dist-verify public/rg-tlm-game` | No differences. |
| Asset integrity | `sha256sum -c studies/rg-tlm-game/ASSET_MANIFEST.sha256` | All 51 entries passed. |
| Browser suite | `PLAYWRIGHT_CHROMIUM_EXECUTABLE=$PRISM_CHROMIUM_EXECUTABLE npm run test:e2e -- --workers=1` | 14/14 passed in 1.1 minutes. |
| Shared hosting | `git diff --exit-code 942df30a0a4df76ae5fb7d35a5061c411563a0f0..HEAD -- Caddyfile Dockerfile railway.json` | No changes. |

## Browser evidence

- Desktop production artifact at 1440×900 returned HTTP 200, resumed into `data-room=workshop`, had no horizontal overflow, and produced no console, page, response, or request failures. The full automated path verified all NPC conversations, wrong-pair recovery, mid-puzzle reload, three-role assembly, the open-chair ending, persisted completion, and The First Raid hook.
- Mobile production artifact at 390×844 with reduced motion had `scrollWidth === innerWidth`, remained keyboard operable, and showed no crop, overlap, or readability defect on visual inspection.
- A Portal-style `sandbox="allow-scripts allow-same-origin"` iframe loaded the production artifact under the exact configured Caddy CSP and entered the Workshop with no browser or network failures.
- Fresh chapter-one loading made 10 unique requests and did not fetch the Workshop background. After **Begin**, the crossing background was prepared while the Workshop background remained deferred.
- Locally captured desktop, assembled, and mobile screenshots were visually inspected; no material composition, target-placement, crop, or readability issue was found.

## Limitations and recovery notes

The first five-worker browser run encountered runtime Chromium target crashes/navigation timeouts and completed 9/14 scenarios. This was treated as resource contention rather than a product assertion: the same complete suite was rerun serially with the mandated Chromium executable and passed 14/14. Docker and Caddy executables were unavailable, so CSP execution used a local static harness with the exact Caddyfile policy; the hosting files are unchanged from the verified base.

No tracked source was modified during verification, and no unexpected tracked changes were present.
