# Rook and waystation tools

Generated September 19, 2026 with the built-in image tool, referencing the approved first-room artwork. Sources and previous versions remain preserved.

| Asset | Saved output | Exact prompt |
| --- | --- | --- |
| Damaged room, Rook removed | [PNG](../../public/art/room-01-background-v2.png) | [Prompt](room-01-background-v2.txt) |
| Repaired room, Rook removed | [PNG](../../public/art/room-01-repaired-v2.png) | [Prompt](room-01-repaired-v2.txt) |
| Jack and cargo plate | [Transparent atlas](../../public/art/sprites/waystation-tools-v1.png) | [Prompt](waystation-tools-v1.txt) |
| Rook: attentive, wrench raised, wrench lowered, inspecting | [Transparent atlas](../../public/art/sprites/rook-work-v1.png) | [Prompt](rook-work-v1.txt) |

Backgrounds are 1672×941. Both atlases are 1536×1024 RGBA with actual transparency. Background edits remove the original baked-in Rook and her shadow, reconstructing the area behind her. They preserve the overall layout and repair states, though generated edits are not pixel-identical elsewhere.

Tools use worn teal enamel, warm metal, rust chips, ink contours, and matching sunlight. Ground props and inventory share the same artwork. The repair hotspot has a small brass-colored wrench marker; the vehicle linkage remains part of the background.

`scripts/measure_sprites.py` measures alpha silhouettes and writes `src/room-sprite-data.json`, without editing source pixels. It expects four disconnected Rook poses in one row and two disconnected tool silhouettes in one row. Pose clips isolate artwork where rectangular bounds overlap. Rook draws on canvas; tools use SVG image windows with silhouette clips and unique clip IDs.

Review: tools match the vehicle's materials; Rook has clear arm changes and an attentive pose. Her position stays anchored beside the vehicle. Slight clothing variation remains between generated poses. [NPC notes](../../docs/NPC_BEHAVIOR.md) describe future movement rules.

QA: [Rook working and loose tools](../qa/rook-working.png), [tools placed](../qa/painted-tools-placed.png). Browser checks cover changing pose pixels, attention, dialog pause/resume, reduced motion, inventory, placement, and repair completion.
