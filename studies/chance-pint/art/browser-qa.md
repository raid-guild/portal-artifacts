# Browser verification

Checked in Codex's in-app browser on 2026-10-09:

- Desktop glass rendering, free drag orbit, unobstructed underside and top presets, reset, die/track focus, liquid endpoints, and seed changes/restoration.
- 390 × 844 responsive viewport: complete control panel and no horizontal document overflow.
- Real repository Caddy configuration using the existing `caddy:2-alpine` image, with a `sandbox="allow-scripts"` iframe served from a different localhost port: bundled JavaScript and fonts loaded; die selection changed the result; no console errors or CSP/CORS failures.
- Forced WebGL context failure: local prototype preview appeared, camera controls were hidden, and die selection still changed the reading.
- Static cover MIME/1200 × 630 dimensions, source/published cover equality, and complete initial-HTML Open Graph/Twitter metadata.

The social cover combines a crop of the running product viewport with readable title typography. The capture used the original seed 7319, d10 track A, and a 75 mm liquid level. It shows the interactive Three.js reconstruction, not a photograph of a manufactured glass.

A mobile-sized browser viewport does not verify physical-device performance or multi-touch hardware. Manufacturing and statistical fairness remain outside this visual study.
