---
name: puddle-level-builder
description: Build or revise local Puddle tower levels as portable Workshop JSON, then validate them for import into the game.
---

# Puddle level builder

Create a `.puddle.json` file for a player who wants a Puddle level. Start from `templates/blank.puddle.json` or a campaign template in `templates/`. Read [the level format](references/level-format.md) before editing geometry, paint, hazards, or rewards.

Preserve `format: "puddle-level"` and `version: 3`. Change the `draft`, not the game's copied runtime in `runtime/`. Give every object a unique string `id` and set `nextObjectId` above any generated `object-N` ID. Keep a reachable start and exit, meaningful routes, and enough flesh pools for gem absorption. Read [route and play-test guidance](references/design-and-testing.md) when making a substantial course.

Run `npm ci` once in the extracted kit, then `npm run validate -- path/to/level.puddle.json` after each revision. Fix every error. Warnings may require play testing; validation establishes structural safety, not puzzle solvability. The game importer and validator use the same Workshop code copied into this kit at build time.

Use `tablet` objects sparingly to teach a mechanic where it is first encountered or reveal a piece of the place's history. Place each memory stone where living flesh naturally passes before the challenge. Give it a short title, a concise message, a semantic `hint`, and a stable ID so players' read state survives a retry. Tablets never add score. Avoid using always-visible labels as tutorial pop-ups.

Give the player the JSON file and ask them to open **Level Workshop → Import JSON → Play test**. They can then **Save to Local Levels** to play it from the game's level menu. For a revision, have them import the revised file and play test it again. No hosted account or local server is required for file import.
