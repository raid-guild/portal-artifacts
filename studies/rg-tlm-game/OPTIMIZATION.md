# Runtime artwork optimization

Measured September 19, 2026 in headless Chromium at 1440×900 with a fresh
browser context for each run. The before build is the deployed source at
`37a92895bc84e65b4d6f4be2386cbb9f81b708d5`; the after build is generated from
this directory. Timing is a five-run local median on the same static server;
bytes use Resource Timing `encodedBodySize`.

| Metric | Before | After |
| --- | ---: | ---: |
| Total artwork bytes | 25,986,316 B PNG | 4,218,980 B WebP (−83.2%) |
| Cold initial image bytes | 21,052,681 B | 2,725,474 B (−87.1%) |
| Cold initial resource bytes | 21,159,929 B | 2,833,056 B (−86.6%) |
| Requests at network idle | 13 | 10 |
| Network-idle median | 651 ms | 640 ms |
| FCP median | 84 ms | 84 ms |

Encoding used browser-native WebP at quality 88 for opaque 1672×941
backgrounds and quality 90 for transparent sprite/prop atlases. Pixel dimensions
and alpha behavior are unchanged. Only the active scene state loads before
Begin/Continue is enabled; alternate and inactive chapter states receive URLs
after Begin/Continue. Sprite atlases remain eager because directional movement
and room interactions can use them immediately.

All twelve derivatives retain the exact source dimensions. Browser-decoded
alpha matches the PNG masters exactly (`alpha RMSE 0`); visible premultiplied
RGB PSNR ranges from 33.84–38.17 dB. Desktop and mobile screenshots were
visually reviewed at supported display sizes with no material composition,
silhouette, transparency, or readability regression.

The exact source PNGs and canonical prompt records were moved out of the served
`public/` snapshot but remain tracked in this study. No gameplay, storage key,
schema, public path, or shared-host policy changed.
