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

## Workshop addition — September 20, 2026

The production Workshop master is 1672×941 and 2,869,481 bytes. Its browser-
native WebP derivative uses quality 86 and is 427,880 bytes, below the 450 KB
chapter-background target. It is not assigned a `src` until the Workshop is the
active room or the player connects the crossing, so chapter three does not add
bytes or a request to a fresh chapter-one load. The earlier recovered draft is
preserved only as a source master and is not served.

A fresh production-build smoke run at 1440×900 loaded 10 subresources and
2,268,962 image bytes at network idle, with no Workshop request. After Begin,
the likely crossing background was prepared while the Workshop remained
unrequested. The production bundles are 22.40 KB gzip for game JS, 14.79 KB for
the shared traveler module, and 6.39 KB for game CSS, within the guide budgets.

## Archive prop integration — September 20, 2026

The approved 1774×887 transparent PNG master is 1,605,043 bytes. Three tight,
transparent browser-native WebP crops at quality 90 total 285,424 bytes: 132,132
bytes for the 600×814 shelves, 104,990 bytes for the 768×491 decoder desk, and
48,302 bytes for the 284×518 lantern (82.2% below the source sheet). Cropping
uses only transparent separation between the supplied props; no prop was
redrawn or materially altered. The exact crop rectangles, hashes, prompt, and
request-artifact provenance are recorded under `source-records/art/`.

The three derivatives remain unloaded during a fresh chapter-one session and
receive `src` only when the Archive is active. Desktop and mobile Archive
captures were visually reviewed after browser decode for intact transparent
edges, full silhouettes, coherent scale, hotspot alignment, and unobstructed
controls.
