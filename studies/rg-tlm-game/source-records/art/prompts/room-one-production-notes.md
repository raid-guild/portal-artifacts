# First-room production derivatives

Generated September 19, 2026 with the built-in image tool. Original concepts remain unchanged. These images are copied into the project's runtime asset directory.

| Asset | Exact prompt | Reference |
| --- | --- | --- |
| [Clean background](../../public/art/room-01-background-v1.png) | [Prompt](room-01-background-v1.txt) | [Approved first concept](../concepts/scene-01-stranded-walker-v1.png) |
| [Transparent traveler](../../public/art/traveler-idle-v1.png) | [Prompt](traveler-idle-v1.txt) | Approved first concept |
| [Repaired background](../../public/art/room-01-repaired-v1.png) | [Prompt](room-01-repaired-v1.txt) | Clean background |

The backgrounds are 1672 × 941. The traveler is a 1024 × 1536 RGBA PNG; its alpha channel was inspected and the cutout was checked in-browser. No manual image editing or CLI/API image generation was used.

The clean background removes the traveler and both loose tools while preserving Rook and the stranded walker. The repaired version lifts the sunken foot, steadies the leg and lights a cabin indicator. The game crossfades between those aligned compositions.

Simple tool icons are authored separately in `src/icons.ts` as temporary game props and inventory assets. They are not AI-generated or final painted assets.

Browser screenshots are saved in `art/qa/` by the end-to-end tests. They show the integrated application, including the transparent traveler and interface.
