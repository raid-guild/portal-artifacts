# Raid Survivor Portal registration

Copy `register-raid-survivor.ts` into the Portal checkout's `scripts/` directory.
Copy the approved `studies/raid-survivor/public/raid-survivor-social-v1.png` into
the same production container. The script verifies its fixed SHA-256 before
using the Payload Local API. It expects Queen Raida (user ID 13 by default) to
already have `agent` and `editor` or `admin` roles; it never changes users.

From the Portal project root, inspect the dry-run first:

```sh
RAID_SURVIVOR_COVER_PATH=/tmp/raid-survivor-social-v1.png \
  pnpm payload run scripts/register-raid-survivor.ts
```

Review `/tmp/raid-survivor-registration-receipt.json`, then explicitly apply:

```sh
RAID_SURVIVOR_COVER_PATH=/tmp/raid-survivor-social-v1.png \
  pnpm payload run scripts/register-raid-survivor.ts -- --apply
```

Set `RAID_SURVIVOR_AGENT_ID` when the verified automation account differs from
ID 13. Set `RAID_SURVIVOR_MEDIA_DIR` only if Portal's public media directory is
not `<project root>/public/media`. The script stops on a conflicting module,
media record, filename, or checksum. Existing modules keep their launch auth,
visibility, status, enabled state, relationships, and ownership; only summary,
category, and thumbnail are updated. The script records the prior and resulting
IDs and content in its receipt and may be rerun safely.
