# Verification — Motion Lab v1 canonical stamp reveal

- Status: **passed**
- Agent run: `4397ba6b-e9d3-4881-91bc-47faccedfd8f`
- Base SHA: `7ad333cd07e6133c9267b169d7021143007781b6`
- Head SHA: `114732d515ff0ced45ec5193ffb8d409fe878836`
- Required starting head: `14ef8ac2f212c554b0b4d3203a340a983fd57fb6` (confirmed ancestor)
- Local URL: `http://127.0.0.1:4173/motion-lab-v1/`
- Runtime: `codex-default` with repository, shell, and Playwright 1.55.0 / Chromium 140 browser automation

## Result

The exact implementation head satisfies the locally verifiable acceptance criteria. The unmodified official RaidGuild asset from `raid-guild/brand` commit `8f0b5eecd9fe0c086e138ba33307110e1d902b06`, path `public/assets/logos/symbol-m500.svg`, independently matched both bundled copies at SHA-256 `1f3201af196f72a305e7df3ae048ae639c5fb63706396086900755d765a7bc05`.

The primary transition visibly reveals the destination through the canonical stamp aperture. At desktop size, its computed scale increased from `0.249631` to `18` while the mask surface was opaque. Runtime screenshots at desktop and mobile sizes were captured and visually inspected.

## Checks

- `git merge-base --is-ancestor 14ef8ac2f212c554b0b4d3203a340a983fd57fb6 HEAD` — passed; the required source head is preserved, with one revision commit above it.
- `node --check studies/motion-lab-v1/app.js` — passed.
- `node --check studies/motion-lab-v1/build.mjs` — passed.
- `node studies/motion-lab-v1/build.mjs` — passed.
- `cmp` across editable/public HTML, CSS, JavaScript, and SVG pairs — passed; all are byte-identical.
- Local and canonical-remote SHA-256 checks — passed with hash `1f3201af196f72a305e7df3ae048ae639c5fb63706396086900755d765a7bc05`.
- `git diff --check 7ad333cd07e6133c9267b169d7021143007781b6..HEAD` — passed.

## Browser journeys

- Desktop `1440x900` — passed: canonical image and SVG luminance mask loaded; measured expanding aperture; all stamp, ink, split, and fade recipes; destination navigation; replay; modal keyboard close; and opener focus restoration.
- Mobile `390x844` — passed: primary reveal and destination state; no horizontal overflow (`390px` document and viewport widths).
- Sandboxed iframe `1024x900` — passed with `sandbox="allow-scripts allow-modals"`.
- Reduced-motion mobile `390x844` — passed: `reduced-fade` completed in `208ms`; stamp/mask panels stayed hidden; modal close and focus restoration passed.
- Every journey was audited for console errors, page errors, failed requests, HTTP error responses, and external runtime requests; none occurred.

## Limitations

Stable shared-host publication is intentionally deferred to the deployment and public-verification workflow steps. This report verifies the exact implementation head locally and does not claim deployment evidence.

No tracked source was modified during verification.
