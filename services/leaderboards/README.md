# Artifact leaderboards

Optional backend for standalone Portal artifacts. The first game is Cosmic Carnival
(scoring version `1`). API and static host deploy independently from this repository.
Portal owns login and profile identity; this service owns only game sessions and runs.

## Architecture

The static Caddy host proxies `/leaderboard-api/cosmic-carnival/*` to this service's
HTTPS Railway domain using `LEADERBOARD_UPSTREAM`. This keeps cookies first-party
without cross-project database access or changes to the artifacts CSP. Portal's
callback URL points to this **proxied artifacts URL**, not the API service domain.

The API service runs in RaidGuild Playground beside Tapper-Postgres. It uses the
dedicated `artifact_leaderboards` schema and a restricted login role with table
CRUD and sequence usage, but no access to other games' tables or the Portal DB.
The schema migration is an administrative step; the runtime role cannot DDL.

## Configuration

- `DATABASE_URL`: private connection to Tapper-Postgres using the restricted role.
- `ARTIFACT_ORIGIN`: `https://portal-artifacts-production.up.railway.app` (no trailing slash).
- `PORTAL_ISSUER`: `https://portal.raidguild.org` (must exactly match launch issuer).
- `COSMIC_LAUNCH_SECRET`: unique random secret, at least 32 characters. Same value as
  `COSMIC_CARNIVAL_LAUNCH_SECRET` on Portal; not the global Portal launch secret.
- `PORT`: Railway listen port, default 8080.
- `NODE_ENV=development`: local HTTP cookies only; never use in production.

Portal module configuration is in `ops/configure-portal.ts`. It is dry-run by default
and applies only with `--apply` or `COSMIC_LEADERBOARD_APPLY=true`, from a Portal checkout with its Payload CLI. It
changes auth fields on the existing module, leaves visibility and entry URL intact,
and checks the expected slug, kind and entry URL before updating.

## Restore the existing leaderboard after a static deploy

The API and its scores already exist. This change restores the static game and
same-origin proxy to the repository's current `main` branch. After this PR is
merged, verify that Railway deploys the **static artifacts service** from the
repository root (`/`) with the root `Dockerfile`, and that its existing
`LEADERBOARD_UPSTREAM` still points to the API service's HTTPS domain. Check the
game, `/leaderboard-api/cosmic-carnival/leaderboard`, and a Portal ranked launch.
The API service deploys from `/services/leaderboards` with
`services/leaderboards/Dockerfile`; it should not be changed for this restoration.
Preserve the existing database, runtime credentials, Portal secret and module
registry configuration. This PR alone does not deploy or reconfigure Railway.

## Initial setup for a new environment

1. With administrator database credentials, run `npm run migrate`; grant the runtime
   role schema usage, table SELECT/INSERT/UPDATE/DELETE, sequence USAGE/SELECT.
2. Deploy `/services/leaderboards` as the Railway service root using its Dockerfile
   and set its Railway service health check to `/health` (60-second timeout). Set the configuration above. `/health` checks schema reachability.
3. Set `LEADERBOARD_UPSTREAM=https://<api-service-domain>` on the static artifacts
   service and deploy the repository root (`/`) with its root Dockerfile.
4. Set the dedicated launch secret in Portal and redeploy it to load the value.
5. Run the Portal configuration script in dry-run, then with `--apply`.

For CLI deployments use `railway up services/leaderboards --path-as-root` with
explicit project and service selectors. For GitHub autodeploy, set the API
service root to `/services/leaderboards` and the static service root to `/`.
Configure service deployment settings in Railway. These service roots must use
their respective Dockerfiles.

## API

All routes below are beneath `/leaderboard-api/cosmic-carnival`:

- `GET /callback?token=...`: verifies HS256, issuer, audience, type, game, subject,
  expiry and age; atomically consumes `jti`, sets a 12-hour HttpOnly/Secure/Lax cookie,
  redirects to clean game URL. Failed launches return to guest play.
- `GET /session`: display name and scoring version; 401 for guests.
- `GET /leaderboard`: top 20, one best run per player; earlier submission breaks ties.
- `POST /runs`: `{version:"1"}`; server-issued run ID, maximum 60 starts/player/hour.
- `POST /runs/:id/finish`: `{version:"1",score,wave,durationMs}`; belongs to the same
  session, maximum two-hour lifetime, exact retries idempotent, changed repeats rejected.
- `POST /logout`: revokes the session and clears its cookie.

Writes require the exact artifacts Origin plus JSON. User IDs and display names in
submission bodies are never trusted. Stored identity is `(issuer, sub)`. Public
responses contain only display names, scores and waves. JWTs and database URLs must
never be logged; do not enable access logging of callback query strings.

Guest play and local bests survive API failures. Sandboxed embeds are guest-only;
ranked play opens the standalone module through Portal. Scripts served on the same
artifacts origin share a trust boundary: the game cookie authorizes only this game,
not Portal or other applications. Sessions are not isolated from other same-origin
artifact scripts. Use a dedicated game origin if that stronger isolation becomes needed.

## Validation limits

This is a casual, client-reported leaderboard. Checks reject negative/fractional
scores, wrong versions, scores above the generated wave schedule maximum, impossible wave/duration combinations, expired
runs, other sessions' runs, and duplicate changes. They do not prevent fabricated
plausible scores or bots. Replay validation is a later improvement. Scoring changes
must increment VERSION in backend and client to start a separate leaderboard.

## Development / verification

Node 22+. `npm ci`. Run local Postgres, then:

```
DATABASE_URL=postgresql://... npm run migrate
TEST_DATABASE_URL=postgresql://... npm test
```

Tests require a disposable local database named `*_test` and reset their schema; they create test players and
runs. Never point them at production. API tests cover auth, replay, CSRF, ownership,
concurrent retries, rankings, run expiry and per-player limits. Also run the game's
simulation tests and production build in `studies/cosmic-carnival/`.

Local integration uses Caddy at localhost:8097 proxying this API at localhost:8098,
`ARTIFACT_ORIGIN=http://localhost:8097`, a synthetic test issuer/secret, and development
cookies. Test a complete signed-launch → game-over → leaderboard flow, guest play,
API failure, and mobile layout.

## Rollback

Set the module back to `authMode: none` to return to guest-only launch. Revert the
static deployment or unset LEADERBOARD_UPSTREAM; guest gameplay continues. Keep the
schema and scores intact. No existing game tables are changed by this service.

Wave rules are generated from the game source by `npm run build` in `studies/cosmic-carnival`. Commit the generated `src/cosmic-waves.js` alongside changes to the scoring version.

## Raid Survivor rollout (additive to Cosmic Carnival)

Raid Survivor uses the same API service and database, with its own `raid-survivor`
route, `raid_survivor_ranked` path-scoped cookie, launch audience, and
`RAID_SURVIVOR_LAUNCH_SECRET`. The Cosmic configuration and scoring version remain
unchanged. A missing Raid secret makes only Raid's ranked routes return 503; the
static game continues with local scores. The current services are
`portal-artifact-leaderboards` and `Tapper-Postgres` in the RaidGuild Playground
production project, and `portal-artifacts` in DarkFactory production.

### Upgrading an existing version 1 deployment

Keep the registered Portal module, launch secret, callback, and proxy settings.
In a coordinated deployment window, run the additive schema migration as an
administrator, grant the restricted runtime role SELECT/INSERT/UPDATE/DELETE on
`artifact_leaderboards.raid_profiles`, then deploy the updated API and static
game. Check `/leaderboard-api/raid-survivor/ready` as the runtime role: it returns
`200 {"ready":true,"missing":[]}` only when Raid's profile and run columns and
read/write grants are present. A `503` lists missing Raid schema or privileges;
`/health` can still pass when this Raid migration is incomplete. The check is
read-only and does not change Cosmic data. The new API accepts completion of in-flight version 1 Raid runs for the
remainder of their two-hour lifetime; it starts only version 2 runs. Version 1
scores remain visible on the Legacy board. If the API is rolled back during an
active version 2 run, the old API cannot finish that run or save its checkpoint
progress. Preserve the new columns and profile table during rollback so scores
and progress already saved remain intact. This repository change does not run
the production migration or deploy services.

### Initial installation

1. With administrator database credentials, run the updated `npm run migrate`
   against Tapper-Postgres. This adds nullable `runs.details`, `runs.run_config`,
   and `runs.progress` JSONB columns plus `artifact_leaderboards.raid_profiles`.
   It is safe to run again and leaves existing Cosmic runs intact. Grant the
   runtime role CRUD on `raid_profiles` as well as its existing tables; it does
   not need DDL rights.
2. Generate a unique random secret of at least 32 characters. Set the same value
   as `RAID_SURVIVOR_LAUNCH_SECRET` on the backend Railway service and Portal.
   Keep `COSMIC_LAUNCH_SECRET` and all existing variables. Deploy the backend
   from `/services/leaderboards`; check `/health` and
   `/leaderboard-api/cosmic-carnival/leaderboard` after deployment. Redeploy
   Portal after setting its secret so Payload can read it.
3. Build the game with `npm ci && npm run build` in
   `studies/raid-survivor`. Deploy the static `portal-artifacts` service from the
   repository root using the root Dockerfile. Its existing
   `LEADERBOARD_UPSTREAM` already points to
   `https://portal-artifact-leaderboards-production.up.railway.app`; retain it.
   Check `/raid-survivor/` and `/leaderboard-api/raid-survivor/leaderboard`.
4. Register the Portal external module if absent, using slug `raid-survivor`,
   entry route `https://portal-artifacts-production.up.railway.app/raid-survivor/`,
   and the appropriate Portal visibility/category settings. The guarded script
   `ops/configure-raid-survivor.ts` requires exactly one module with that slug,
   kind `external`, and exact entry route. From a Portal checkout, run it with
   `pnpm payload run <path>` to review its dry-run output; then run with
   `--apply`. It sets the callback URL to
   `https://portal-artifacts-production.up.railway.app/leaderboard-api/raid-survivor/callback`,
   audience `raid-survivor`, dedicated secret key, 120-second token lifetime,
   and handle/profile claims only. Test a Portal launch and a submitted run.

Raid version 2 starts a run with `{version:"2",character,level}`. Level is
`training`, `forest`, `desert`, or `ice`. Checkpoints use cumulative `{durationMs,kills,monsters}`;
each monster has `encountered`, `kills`, and `counterKills` counters. The server
validates monotonic counters and elapsed wall time, then grants a class's
Training milestone at 180 seconds, Forest at 300, Desert at 420, or Ice at 540
once per class. Each of the first three milestones unlocks the next realm.
Class skills cost one milestone credit per rank, are capped at two ranks per
skill, and are captured when a new run starts. Mastery purchases include
`{character,skill,rank,expectedRevision}`; exact retries are idempotent. The finish body
includes the same final checkpoint and canonical kill/level statistics. The
server derives the score, preserving the original scoring formula in all realms.
Both first and repeated successful finish responses return the authoritative
persisted profile. A finish can bank a milestone even if its preceding checkpoint
response was lost. The client keeps a linked player's known profile visible during
a profile fetch outage, retries temporary checkpoint failures with cumulative
snapshots, and labels a failed ranked start as practice with no saved unlocks.
Public boards accept `?level=all|training|forest|desert|ice|legacy`; `legacy` contains
version 1 Raid scores. A player may start 60 Raid runs per hour regardless of
Cosmic starts. A renewed Portal session for the same account can finish its own
run during the two-hour lifetime. Guests store progression and scores locally;
guest progression does not merge into a Portal account.

If ranked setup must be rolled back, set the Raid module to guest launch or
remove the Raid secret from the backend. Local play and Cosmic ranked scores
remain available. Preserve the schema and historical run rows.

### Raid Survivor version 3 progression

New ranked starts use `{version:"3",character,level}`. The server validates the
unlocked hero and realm, then returns an immutable run config with purchased skill
ranks, one equipped perk, and the next eligible checkpoint target. Client-provided
targets and perk effects are ignored. There are five realms and five heroes; Warrior
unlocks at Training 05:00 and Tavern Keeper at Forest 07:00. Any hero can unlock a
realm for the account. Per-hero checkpoint times are Training 03:00/05:00/07:00/09:00/12:00,
Forest 05:00/07:00/09:00/12:00, Desert 07:00/09:00/12:00, Ice 09:00/12:00,
and Lava 12:00. The first checkpoint in Forest, Desert, and Ice unlocks the next
realm. Twelve minutes grants that hero's realm mastery; Lava twelve grants class
mastery. A run awards only its saved target, even when play continues or another
run has already claimed it. A new run is needed for the next checkpoint.

Each hero can earn fifteen checkpoint credits. Three skills have two ranks each
at one credit per rank. Three class perks cost three credits each; all can be
owned, and exactly one can be equipped per run. `POST /profile/mastery` takes
`{character,skill,rank,expectedRevision,requestId}`; `POST /profile/perks` takes
`{character,perkId,expectedRevision,requestId}`; `POST /profile/equip` takes
`{character,perkId|null,expectedRevision,requestId}`. The profile and revision
are returned after each transaction. Request IDs make exact retries idempotent;
stale revisions and reused IDs with changed payloads conflict. Profile version 2
JSON migrates to version 3 on read/write: each old milestone becomes exactly its
first checkpoint, including Ice's Lava unlock. Skill spending, purchase history,
NFT tallies, revision, and existing account unlocks are retained. This application
migration uses the existing JSONB columns and needs no SQL schema change.

Version 1 and 2 runs already in progress can still finish with their original
validators. Version 2 progress can earn only the old first checkpoint. New v2
starts are rejected. Historical boards are `?level=legacy` (v1) and
`?level=archive-v2` (v2). Version 3 boards are `all`, `training`, `forest`,
`desert`, `ice`, and `lava`, with one best single-run score per player. Lava may
advance existing Forest, Desert, and Ice monster records as well as its native
records. Version 3 score validation allows the extra 11:00 Moloch, while old
version bounds stay intact. The readiness endpoint and deployment credentials
remain the same. Verify migration and transactional behavior only against a
disposable local database before deployment.

Lava now has three native Monstermaps records: Tosculi Hive-Queen #3015, Sea
Hag #5413, and Hezrou #3112 on Ethereum chain 1. Their metadata follows the
selected cached chain export preserved at
`studies/raid-survivor/public/lava-monstermaps-sheets.json` (block 26114270).
Existing profiles initialize their tallies to zero, and older progress payloads
without these keys remain valid. Only Lava runs can report them; Lava still
accepts Forest, Desert, and Ice encounters. The shared Lava boss schedule asks
for 1 alive at 05:00, 2 at 08:00, 2 at 10:00, and 3 at 11:00, then 3 every
two minutes from 13:00 in Endless. At most 8 bosses can be admitted by 11:00
and 11 by 13:00. Lava score validation uses this admission ceiling and a
conservative chest ceiling of `2 + floor(seconds / 45) + maxAdmittedBosses`;
other realms and old scoring versions retain their existing bounds.
