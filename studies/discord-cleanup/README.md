# Discord Cleanup

Buildless, static planning app published from [`public/discord-cleanup/`](../../public/discord-cleanup/). The audit snapshot was derived from the read-only RaidGuild Discord audit taken on 2 November 2026. The source audit was `outputs/discord-channel-audit.json` in the task workspace, with the proposal documented in `outputs/raid-guild-discord-audit.html`. The published `audit.json` preserves channel names, category, type, proposed action, notes, and limited activity evidence. It replaces Discord snowflake IDs with stable local identifiers and includes no raw messages, role lists, credentials, or bot token.

The inventory is a snapshot, not a live connection. It contains 116 channels in 17 observed categories. Message evidence covers at most the latest 100 messages per readable text channel. Twenty-one histories were unreadable; voice usage was not measured. The app never calls Discord or changes server settings. The plan was revised on 2 November 2026 after owner discussion. The inventory retains the observed `category` and `name`; `plannedCategory`, `plannedName`, `reviewGate`, and `originalAction` describe the current proposal without rewriting the snapshot. The original 13 staging candidates include channels now held for owner review because their history was unreadable or recently active.

The revised structure merges Governance into Guild HQ, renames the three existing agency categories to Agency Ops, Agency Raids and Agency Camps, and gives Knowledge, Brand, Infrastructure, Bard and Participation distinct steward categories. The existing Summer Brigade forum moves to Bard and becomes `content-workshop`; the Participation forum is new. Relocation retains the original channel ID, history, links and permission overwrites. Retirement moves the original channel to Valhalla with a redirect. A category move does not make a channel hidden or read-only, so access changes belong in the admin handoff. The rollout calls for a configuration snapshot and an execution ledger with completed, held, failed and admin actions.

Progress for channel dispositions and rollout tasks is stored under a versioned key in the current browser's `localStorage`. It does not sync across devices or visitors and does not verify Discord changes. Export opens a copyable JSON backup in the page and also offers a file download; import accepts pasted JSON or a selected file. Import checks version, item IDs, statuses, and field lengths before replacing existing progress, with a browser confirmation. If browser storage fails, the app shows a temporary-session warning and export still works.

Preview from the repository root:

```sh
python3 -m http.server 8766 -d public
```

Open <http://127.0.0.1:8766/discord-cleanup/>. Run focused tests with `node --test studies/discord-cleanup/state.test.mjs`. No install or build step is needed. `artifact-social-v1.png` is the versioned 1200 × 630 link cover described by the static metadata in `index.html`.

The social cover is a browser screenshot of the app dashboard, captured at 1200 × 630 and encoded as PNG. No generated illustration is used. Verified desktop and 390px responsive layout, channel notes/status persistence after reload, checkbox/status synchronization, and copyable JSON export/paste import roundtrip. Independent code review found no actionable issues.
