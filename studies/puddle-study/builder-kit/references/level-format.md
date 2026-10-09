# Level format

The portable file is `{ "format": "puddle-level", "version": 3, "draft": { ... } }`. Use the included templates as full examples. New authored levels use `presetId: 0`; named campaign templates retain their original preset ID. Level Workshop owns this source format; the compiled collider geometry is rebuilt during import and is not saved in JSON.

Coordinates use X across the board and Z from back to front. Y and `base` are heights above the floor. The blank board spans X −9…9 and Z −6…4.8. A `flat` terrain has a `height`; campaign templates demonstrate switchback and terrace terrain. Set `name`, `totalFlesh` (17–297), `startingFlesh` (at least 17 and no higher than total), and `targetTime` in seconds (1–600). The remaining flesh is divided among `flesh` pools by their relative `weight`. Tendrils are active in custom levels.

Each entry in `draft.objects` needs a unique `id` and a `kind`. Common pieces:

| Kind | Main fields |
| --- | --- |
| `start` | `x`, `z`, optional `base` |
| `exit` | `x`, `z`, `radius`, `bottomRadius`, `depth`, `type: "funnel"` |
| `flesh`, `gem`, `gold` | `x`, `z`, optional `base`; flesh also `weight` |
| `pillar` | `x`, `z`, `radius`, `height`, optional `base` |
| `block` | `minX`, `maxX`, `minZ`, `maxZ`, `minY`, `maxY` |
| `lowgap` | rectangle, `base`, `bottom`, `top`, `axis`, `supportWidth` |
| `stairs` | `x`, `z`, `axis: "x" or "z"`, `reverse`, `run`, `width`, `rise`, `steps`, `base` (shown as a ramp) |
| `pit` | `x`, `z`, `radius`; cuts only terrain on one flat terrace |
| `paint` | `surface: "sticky", "slippery", or "lava"`, `face`, rectangle and `base`; a wall face also uses `minY`, `maxY`, and often `targetId` |
| `cutter` | `shape: "box" or "cylinder"`, `x`, `y`, `z`, dimensions and `rotation: {x,y,z}` in degrees |
| `label` | `x`, `z`, `text`, `base`, `offset`; display only |

Blocks can stack. A cutter subtracts from static solids, which permits tunnels and hollow pillars. Paint on raised geometry should name its owner with `targetId`; select the face and height carefully. Sticky wall paint needs a real wall face. Lava and slippery paint belong on walkable tops. Pressure pieces and raised basins are easiest to copy and adapt from campaign templates because they need matching geometry.

For example, a floor lava patch under a bridge, a pit cut through terrain, and a rotated tunnel cutter are separate objects:

```json
[
  {"id":"object-10","kind":"paint","surface":"lava","face":"floor","minX":-2,"maxX":2,"minZ":-1,"maxZ":1,"base":0},
  {"id":"object-11","kind":"pit","x":4,"z":0,"radius":0.8},
  {"id":"object-12","kind":"cutter","shape":"cylinder","x":0,"y":1,"z":-3,"radius":0.5,"height":2,"rotation":{"x":90,"y":0,"z":0}}
]
```

Keep floor lava at the lower support `base` under an elevated bridge; omit `targetId` there so it does not follow the bridge top. A raised block top or sticky wall patch should use the block's `id` as `targetId` and match its support height or face.

Keep the start clear, add routes back from falls where intended, and leave enough safe space to contract around each gem. The timer is an all-or-nothing 20% bonus; each gem and gold piece counts equally toward the other 80%. A level may be finished with missing collectibles. Validation only checks safety and format: it cannot certify reachability, gem enclosure, timing, or route quality.
