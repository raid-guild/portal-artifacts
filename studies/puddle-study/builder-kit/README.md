# Puddle Builder Kit

This folder lets a local coding agent create levels as portable `.puddle.json` files. Give the agent `SKILL.md` and your level idea. Install this folder as a skill if your agent supports local skills; otherwise point the agent at `SKILL.md` directly.

Requires Node.js 20.19 or newer. In this extracted folder:

```sh
npm ci
npm run validate -- templates/blank.puddle.json
npm run validate -- --json "My Tower.puddle.json"
```

`npm ci` needs network access the first time. The command returns exit code 0 for a structurally valid file, 1 for a level that needs repair, and 2 for a missing file or command usage error. JSON output is suitable for an agent's tools and includes `playability: "not-tested"`. Start from `templates/blank.puddle.json` or any campaign template and save a new file. In Puddle, use **Level Workshop → Import JSON → Play test → Save to Local Levels**. “Save draft” keeps editable work in the Workshop; “Save to Local Levels” makes a playable entry in that browser. Browser saves belong to the game's site and are not written by the command. The game and downloaded kit can be on different computers; the JSON file is the handoff.

Validation shares the Workshop's parser and physical level checks. It cannot prove every reward is reachable or every puzzle is fun; play through the route and edit again. There is no cloud publishing or automatic browser save connection in this kit.
