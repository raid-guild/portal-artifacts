# The Mini RC Racers leaderboard API, version "1"

The HTTP contract between the game (Mini RC Racers, a static site at `https://portal-artifacts-production.up.railway.app/rc-racers/`, the game itself at `…/rc-racers/play/`) and its module, `rc-racers`, in the RaidGuild Portal artifacts host's leaderboard service (`services/leaderboards` in raid-guild/portal-artifacts). Written for the game's milestone M10 (feature F-1002), 2026-10-20. Two sessions build against it in two repositories: the game's client and fake service (F-1003), and the service module (from `docs/portal-service-brief.md`).

**Its executable half** is `tests/fixtures/portal-api/` in the game (copied by the service to `services/leaderboards/test/fixtures/rc-racers/`): the floor table `floors.json`, the reference rules `rules.mjs` (with `rules.d.mts`), the cases `start-cases.json`, `finish-cases.json`, `board-cases.json` and `leaderboard-query-cases.json`, and the answers the game reads, in `responses/`. This document and those files say the same thing; where they seem to differ, the case files are what both sides are tested against, and the difference is a bug to report.

**Precedents.** The module follows the host's own: Neon Drop (`services/leaderboards/src/neon-app.js`) for the launch, the session, the runs and their errors, and Puddle (`src/puddle-app.js`) for boards filtered on `run_config`. Read at portal-artifacts `2765ade`; line numbers below are from that commit.

- Neon: security headers (`neon-app.js:19-22`); the exact `Origin` and JSON check on every POST, 403 (`:23-28`); the 4 KB JSON body (`:29`); `/ready` (`:30-64`); the cookie (`:65`); the session lookup (`:66-77`); the callback (`:78-107`); `/session` (`:108`); `/logout` (`:109-112`); one best run per player with `DISTINCT ON` (`:113-119`); starts with the per-hour limit (`:120-135`); the finish with 410 after 7 200 000 ms, 409 on a changed repeat (`:136-159`); the error handler (`:160-165`).
- Puddle: a board per `run_config` value (`puddle-app.js:119-136`); a start body stored as `run_config` (`:137-154`).
- The host: `combined.js:23-24` (a module with no secret answers 503 and nothing else changes); `schema.sql:16-27` (the shared `runs` table); the `Caddyfile`'s `connect-src 'self'` (`Caddyfile:58`) and its `/leaderboard-api/<game>/*` routes (`:126-161`); the service README's "casual, client-reported leaderboard" (`services/leaderboards/README.md:155-159`).
- Portal's launch: `src/app/(frontend)/api/modules/[slug]/launch/route.ts` in the Portal repository (read at `29451e6`): it signs HS256 with the secret named by the module's `launchSecretEnvKey` (`:97-108`, `:257-260`), with `sub` `user:<id>` and `typ` `portal_module_launch` (`:217-218`), `name` (`:227`, `:245`) and `handle` (`:248`) when the module asks for them, a lifetime of 30 to 600 s (`:44-46`, `:341-344`), and redirects to the callback with `?token=` (`:125-134`).

## Contents

1. Common rules
2. The routes
3. The start body
4. The finish body, and what a real session sends
5. The boards
6. The answers the game reads
7. Trust, origin and versions
8. What the game does

## 1. Common rules

- **Base:** `/leaderboard-api/rc-racers` on the artifacts host, the game's own origin. The host's Content-Security-Policy allows `connect-src 'self'` only, and the session cookie is first-party and path-scoped: there is no cross-origin form of this API.
- **Every answer is JSON** with `Cache-Control: no-store`, `Referrer-Policy: no-referrer` and `X-Content-Type-Options: nosniff`.
- **An error is `{"message": string}`**: at most 200 characters, in words a player may read (the game shows a 4xx message, cleaned to its pixel font). A 409 adds `"version"`, the service's current version. The messages are fixed and listed below; nothing else, and never a stack, a token or a database error, goes in one.
- **Every POST** must carry the artifacts host's exact `Origin` (`https://portal-artifacts-production.up.railway.app`, the service's `ARTIFACT_ORIGIN`) and `Content-Type: application/json`, or it is refused before anything else with **403** `{"message": "Open Mini RC Racers directly to use the leaderboard."}` (cross-site requests cannot forge either). The body is at most 4 KB: a larger one is refused with **413** `{"message": "This request is too large."}`; a body that is not JSON with **400** `{"message": "This request does not match the leaderboard rules."}`. The game never sends either.
- **The secret.** `RC_RACERS_LAUNCH_SECRET`, at least 32 characters, on the service and on Portal. Without it (missing or shorter), every route of this module answers **503** and nothing else on the host changes. The 503 answer, here and for any failure of the service itself (the database, a timeout): `{"message": "Leaderboard temporarily unavailable. Local play still works."}`.
- **Limits.** 60 starts per player per rolling hour (a restart is a new start; the 61st answers 429). A run can be finished until 2 hours (7 200 000 ms) after its start (then 410). Both are the host's norm for its games.
- **An unknown route** under the base answers **404** `{"message": "Not found."}`.

## 2. The routes

Paths are under the base. "Session" means a valid `rc_racers_ranked` cookie for an unexpired session of this game.

### `GET /callback?token=<jwt>`

Portal's signed launch. Portal (`/api/modules/rc-racers/launch`) signs a token for a logged-in player and redirects the browser here with it.

The token must be: HS256 with `RC_RACERS_LAUNCH_SECRET`; issuer exactly the Portal URL (the service's `PORTAL_ISSUER`, `https://portal.raidguild.org`); audience `rc-racers`; `typ` `portal_module_launch`; `moduleSlug` `rc-racers`; `sub` `user:<digits>`; `exp`, `iat`, `jti` and `sub` present; `jti` a string of at most 200 characters, never seen before (stored in the shared `launches` table, single use); `exp − iat ≤ 600`; at most 10 minutes old; the token string at most 8 192 characters.

| Answer | When |
|---|---|
| **303** to `https://portal-artifacts-production.up.railway.app/rc-racers/play/` with `Set-Cookie: rc_racers_ranked=<64 hex>; HttpOnly; Secure; SameSite=Lax; Path=/leaderboard-api/rc-racers; Max-Age=43200` | The token passes every check. The player is upserted by `(issuer, sub)` with the display name below, and a 12-hour session is stored (only the SHA-256 of the cookie's value). |
| **303** to `…/rc-racers/play/?ranked=launch-failed` | Any check fails, the `jti` was used before, or the database fails. No cookie is set. |

- **The landing page is `/rc-racers/play/`**, the game, and not `/rc-racers/` as Neon Drop's `/${GAME}/` would give: since the game's 1.1, `/rc-racers/` is its home page. The game reads `?ranked=launch-failed` once and removes it from the address.
- **The display name** is the token's `handle` if it is a string, else its `name` if it is a string, else `Portal player`; trimmed, cut to 60 characters, and `Portal player` if nothing is left. A later launch updates it. The service never takes a name from a request body.
- **The token is never logged or stored**, nor the query string of this route.

### `GET /session`

| Answer | When |
|---|---|
| **200** `{"displayName": string, "version": "1"}` | A session. `version` is the service's current version; the game compares it with its own `SCORING_VERSION`. |
| **401** `{"message": "Launch Mini RC Racers from Portal to join the leaderboard."}` | No cookie, or one that is not 64 hex characters. |
| **401** `{"message": "Your Portal session expired. Launch Mini RC Racers from Portal again."}` | A well-formed cookie with no unexpired session of this game. |

### `POST /runs`

A ranked run starts. Body: the start body (§ 3). Checked in this order:

| Answer | When |
|---|---|
| **403** | A wrong `Origin`, or not `application/json` (§ 1). |
| **401** | No session (the two messages of `/session`). |
| **409** `{"message": "Reload Mini RC Racers for the current rules.", "version": "1"}` | The body's `version` is not the service's (missing included): the page is older or newer than the service. |
| **400** `{"message": …}` | The body breaks a rule of § 3 (`validateStart`). |
| **429** `{"message": "Ranked run limit reached. Local play still works."}` | This player has started 60 runs of this game in the last hour. |
| **201** `{"runId": "<uuid v4>", "version": "1"}` | A run is stored: the player, the session (the cookie's hash), the game `rc-racers`, the version, `run_config` = the body less `version`, `started_at` = the server's now. |
| **503** | The service failed. |

### `POST /runs/:id/finish`

The run's result. Body: the finish body (§ 4). Checked in this order:

| Answer | When |
|---|---|
| **403** | A wrong `Origin`, or not `application/json`. |
| **401** | No session. |
| **404** `{"message": "Ranked run not found."}` | `:id` is not a lowercase uuid v4; or no run of this game with that id belongs to this player; or it does but was started under another session (a run is bound to the session that started it, as Neon's). |
| **409** `{"message": "Reload Mini RC Racers for the current rules.", "version": "1"}` | The body's `version` is not the service's, or the run was started under another version. |
| **200**, the same answer again | The run was finished before and the body is exactly the stored one (`version`, `bestLapMs`, `laps`, `timeMs`): an idempotent repeat (the game retries once after a network error or a 5xx). The ranks are worked out again, as of now. |
| **409** `{"message": "This run was already submitted.", "version": "1"}` | The run was finished before and the body differs. |
| **410** `{"message": "This ranked run expired. Your result is kept in this browser."}` | The run was started more than 7 200 000 ms ago (server time) and has not been finished. |
| **400** `{"message": …}` | The body breaks a rule of § 4 (`validateFinish`, with the server's time since the start as `wallMs`). |
| **200** `{"saved": true, "lap": {"rank": n, "best": b} \| null, "race": {"rank": n, "best": b} \| null}` | The result is stored (`submitted_at` = now) and ranked (§ 5, "The ranks in a finish's answer"). |
| **503** | The service failed. |

What is stored: `details` = `{"bestLapMs", "laps", "timeMs"}`; `duration_ms` = `timeMs`; `score` = `laps` (the shared `runs` table requires a non-negative `score` once a run is submitted, `schema.sql:20-21`, and its ranking index orders it descending; the boards here rank by `details` instead, so `score` only has to be harmless); `wave` stays null.

### `GET /leaderboard?kind=&track=&direction=&class=&weather=[&minutes=]&version=`

Public. A session cookie, if there is one, only sets `mine`; a missing or expired one is not an error here.

| Answer | When |
|---|---|
| **400** `{"message": "Unknown leaderboard."}` | The query breaks a rule (`validateBoardQuery`): `kind` is `lap` or `race`; `track`, `direction` and `class` name a board of the floor table; `weather` is `all`, `dry`, `changeable` or `wet`; `minutes` is `3`, `5` or `7` and is required for `race` and refused for `lap`; `version` is required, a plain whole number (`^[1-9][0-9]{0,8}$`); no other parameter, and none repeated. |
| **200** `{"version": "<the query's>", "entries": [...], "mine": number \| null}` | At most 10 entries, best first (§ 5). `mine` is the index in `entries` of the signed-in player's entry, or null (a guest, or a player with no entry among the ten). A version with no runs, including one the service has never had, answers 200 with no entries. |
| **503** | The service failed. |

An entry is `{"displayName", "bestLapMs", "submittedAt", "cars", "difficulty", "weather", "assisted"}` on a lap board and `{"displayName", "laps", "timeMs", "submittedAt", "cars", "difficulty", "weather", "assisted"}` on a race board. `displayName` is the player's current name; `submittedAt` is ISO 8601 in server time (`toISOString()`); the rest are from the run that set the player's best: `cars`, `difficulty`, `weather` and `assisted` from its `run_config`, the times from its finish.

### `POST /logout`

| Answer | When |
|---|---|
| **403** | A wrong `Origin`, or not `application/json`. |
| **401** | No session. |
| **200** `{"ok": true}` | The session is deleted and the cookie cleared. The game does not call it in 1.2. |

### `GET /ready`

**200** `{"ready": true, "missing": []}` when the shared schema, the columns this module uses (`launches`, `players`, `sessions`, `runs` with `run_config`, `details`, `duration_ms`, `score`) and the runtime role's grants and the players' id sequence are in place; otherwise **503** `{"ready": false, "missing": [...]}` naming what is not, or `["database unavailable"]`. As Neon's (`neon-app.js:30-64`). Like every route here, 503 without the secret.

## 3. The start body

Exactly these keys, no others:

```json
{"version":"1","track":"cuenca-rc","direction":"counter-clockwise","class":"tc-stock-175","kind":"final","minutes":5,"weather":"dry","cars":7,"difficulty":"club","assisted":false}
```

| Key | Rule | Why |
|---|---|---|
| `version` | `"1"`, the string. Anything else, or none: **409** | Boards are kept per version; a page and a service on different versions must not mix their times. |
| `track`, `direction`, `class` | A board of the floor table: `track` a key of `floors.json`'s `floors`, `direction` `counter-clockwise` or `clockwise`, `class` one of `tc-stock-175`, `tc-mod-45`, `fwd-105`, `f1-215` | Every board has a floor; a board without one cannot be checked. Message: `Unknown track, direction or car class.` |
| `kind` | `qualifying` or `final` (a quick race is a final) | Practice sets no records. |
| `minutes` | `3`, `5` or `7`, a number | The game's round lengths; the race boards are per length. |
| `weather` | `dry`, `changeable` or `wet`: the forecast raced, never `surprise` (the game sends what the surprise turned out to be) | The boards filter on it. |
| `cars` | `2`, `4` or `7`, a number: the whole field | Shown on the board; it also bounds a final's time (§ 4). |
| `difficulty` | `club`, `regional` or `national` | Shown on the board. |
| `assisted` | a boolean: DRIVING ASSISTANCE was on | Shown as `(A*)` after the time; ranked like any other row. |

A start that breaks the rules of `kind` to `assisted` is refused with `This kind of session cannot be ranked.`; a body that is not an object or has other keys with `This request does not match the leaderboard rules.` The service stores the body less `version` as the run's `run_config`; a finish can never change it.

## 4. The finish body, and what a real session sends

```json
{"version":"1","bestLapMs":24656,"laps":12,"timeMs":301456}
```

Exactly these keys. Integers in milliseconds. They are the player's row of the game's session result (`ResultRow` in `src/sim/session/types.ts`): `laps`, the laps that counted; `timeMs`, the time of the last counted crossing of the line; `bestLapMs`, the fastest counted lap, or `null`.

### How the game makes those three numbers

Read from `src/sim/session/` (`session.ts` `crossedLine` and `endOfRaceTick`, `finish.ts`, `clocks.ts`, `../track/timing.ts`):

- **A lap counts** when the car crosses the line forwards having passed both sector points forwards, in order, since its last crossing; a crossing that does not count restarts the lap from there. The first forward crossing starts the lap timing and completes no lap. Each lap time is rounded to the millisecond on its own; `bestLapMs` is the least.
- **The clock.** A final has one clock for every car, started by the start tone; the grid stands some way round the lap before the line, so the first crossing only starts the lap timing, and a final's time includes the run from the grid to the line. A qualifying heat gives each car its own clock, started at its first forward crossing, or 60 s after its release if it has not crossed by then; this is the same from the **pit lane** and from the **start boxes**, which differ only in where the car waits and when it is released (one second per start slot after the tone). `timeMs` is the last counted crossing on the car's own clock, rounded once.
- **The finish.** A car finishes at its first crossing of the line after its clock reaches the session's length, whether or not that lap counted. Once no car still out has time on its clock, the others have 30 s to finish, and every finish gives the rest 30 s more. A car still out after that has not finished, and the game never sends it.

So, for every start:

- **No counted lap**: `laps` 0, `bestLapMs` null, `timeMs` 0 (a qualifying car that never completed a valid lap can still finish).
- **Counted laps**: every counted lap lies within `[clock start, last counted crossing]`, so `bestLapMs ≤ timeMs`, and `laps × bestLapMs ≤ timeMs + laps` (each lap is rounded on its own; the total once). In a qualifying heat that crossed the line in time and counted every lap, `timeMs` is the sum of the laps (to the rounding); a final adds the run from the grid to the line, and a heat whose clock started 60 s after release adds the wait.
- **A final ends at or after its clock only if its last lap counted.** A last lap that did not count (a lap cut short, the line crossed backwards) leaves `timeMs` at the crossing before: earlier than `minutes × 60000`.
- **The longest a final's time can be**: the k-th car to finish after the clock runs out does so within `30 s × k`, so `timeMs ≤ minutes × 60000 + cars × 30000`.
- **The longest a qualifying heat's time can be**: its own clock started no earlier than its release; another car's clock can start up to 138 s after the tone (a car that sits in the pit queue is lifted out of it at the latest 3 s per queue place after the tone, 18 s with seven cars, and its clock starts 60 s after it was lifted out or, if it is put back before then, 60 s after it is put back: 120 s more at most), and then the cars still out have the 30 s allowances: 138 s + 7 × 30 s = 348 s at most. The rule takes 6 minutes.

### The rules

`validateFinish(body, runConfig, wallMs, floors)`, in this order:

| Rule | Refusal | Why |
|---|---|---|
| A JSON object with exactly the four keys | 400 `This request does not match the leaderboard rules.` | Nothing else is stored. |
| `version` is `"1"` (checked before the keys) | 409 `Reload Mini RC Racers for the current rules.` | As the start. |
| `laps` an integer from 0 to 999; `timeMs` an integer ≥ 0; `bestLapMs` null or an integer | 400 `This request does not match the leaderboard rules.` | Types and sane sizes. |
| `laps` 0 ⇔ `bestLapMs` null and `timeMs` 0 | 400 `This result does not match the session.` | The game's row, as derived above. |
| `bestLapMs ≥ floor[track][direction][class]` when `laps ≥ 1` | 400 `This lap is faster than the track allows.` | The floor table (below). |
| `bestLapMs ≤ timeMs` and `laps × (bestLapMs − 1) ≤ timeMs` | 400 `This result does not match the session.` | Every counted lap lies within the time. With the floor this also gives `laps × (floor − 1) ≤ timeMs`: no more laps than the time can hold. |
| `timeMs ≤ minutes × 60000 + cars × 30000` for a final; `timeMs ≤ minutes × 60000 + 360000` for a qualifying heat | 400 `This result is longer than the session allows.` | The longest a session of that config can give, derived above. |
| `timeMs ≤ wallMs + 10000`, `wallMs` the server's time since the run's start | 400 `This result arrived sooner than it could have been driven.` | The game's clock never runs faster than real time; the start is sent before the 13 s of staging and countdown, so the slack only absorbs clock skew. |

Then the service stores `{bestLapMs, laps, timeMs}`.

**Changed from the first draft of this contract, and why** (each would have refused a session the game really produces):

- *`timeMs` above 0* became *`timeMs` 0 exactly when `laps` is 0*: the game sends a finished heat with no counted lap as `laps 0, timeMs 0`.
- *For a final, `minutes × 60000 ≤ timeMs`* was dropped: a final whose last lap does not count ends earlier.
- *`timeMs ≤ minutes × 60000 + 180000`* became the two derived bounds: a 7-car final can run 210 s past its clock, a qualifying heat up to 348 s.
- *`bestLapMs ≤ 180000`* became *`bestLapMs ≤ timeMs`*: a car that stops on track for minutes still has a valid (slow) lap, and a lap can never be longer than the time.
- *`laps × floor ≤ timeMs`* became *`laps × (bestLapMs − 1) ≤ timeMs`*, which also holds with each lap's rounding.

### The floor table

`floors.json`: `{"scoringVersion": "1", "margin": 0.2, "floors": {"<track>": {"<direction>": {"<class>": <ms>}}}}`, every shipped track, both directions, all four classes. Version "1" (Cuenca RC):

| Direction | Class | Route driver, shipped car | Route driver, NEWBIE car | Fastest AI lap | Floor |
|---|---|---|---|---|---|
| counter-clockwise | `tc-stock-175` | 24 656 | 24 899 | 20 975 | **16 780** |
| counter-clockwise | `tc-mod-45` | 23 636 | 24 714 | 19 427 | **15 541** |
| counter-clockwise | `fwd-105` | 23 930 | 24 392 | 19 723 | **15 778** |
| counter-clockwise | `f1-215` | 24 807 | 25 166 | 22 087 | **17 669** |
| clockwise | `tc-stock-175` | 25 009 | 25 319 | 20 960 | **16 768** |
| clockwise | `tc-mod-45` | 23 655 | 24 870 | 19 776 | **15 820** |
| clockwise | `fwd-105` | 24 024 (not clean) | 24 315 | 20 537 | **16 429** |
| clockwise | `f1-215` | 25 246 (not clean) | 25 273 | 22 170 | **17 736** |

How it is made (`tests/tools/portal-floors/regenerate.ts`, run with `pnpm exec vitest run --config tests/tools/portal-floors/regenerate.config.ts` in the game): one dry lap by the golden laps' route driver from a standing start on pole, in the shipped car and in the NEWBIE car that DRIVING ASSISTANCE gives the player, each kept only if it is clean (no wall, kerb or grass); and the fastest lap of a dry, still, 3-minute qualifying heat of the seven most skilled AI drivers at national difficulty, from the start boxes. `floor = Math.floor(fastest × (1 − margin))`. A floor is a dry lap: a wet lap is slower, so the dry floor holds in every condition. The AI heat is in the table because the route driver plans its corners for about three quarters of the grip: the AI's best laps are a fifth quicker than its lap, and a floor of 80 % of the route driver's lap would sit within 2 % of laps the game's AI drives, which a good player can match. A floor 20 % under the AI's best leaves room for a player faster than any AI.

## 5. The boards

A board is a filter over the runs of one version with `submitted_at` set, and shows **one best per player**, the ten best players. The reference is `board`, `placeOf`, `boardAnswer` and `finishRanks` in `rules.mjs`.

- **Lap board** `(track, direction, class)`: runs of kind `qualifying` or `final` (any length) with a `bestLapMs`. Each player's best is the run with the least `bestLapMs`, then the earlier `submitted_at`, then the lower `id`; players are ranked by their best in the same order.
- **Race board** `(track, direction, class, minutes)`: runs of kind `final` with that `minutes` and `laps ≥ 1`. Best: more `laps`, then less `timeMs`, then the earlier `submitted_at`, then the lower `id`.
- **Weather**: `dry`, `changeable` or `wet` keeps only the runs raced in it; `all` takes each player's best across the three, and the entry shows the weather of the run that set it.
- **Ties** go to the earlier submission, then to the lower run id (uuids compare as lowercase text, which is also PostgreSQL's order for `uuid`).
- **(A\*) runs** (`assisted`) are ranked like any other and carry their mark.
- **The ranks in a finish's answer**: the player's place among all the board's players (not only the ten), on the board of the run's own weather (not `all`), after this run is stored; `best` is true when this run is now the player's best there. `lap` is null when the run has no `bestLapMs`; `race` is null unless the run is a final of 3, 5 or 7 minutes with `laps ≥ 1`.
- **`mine`** in `GET /leaderboard` is the index of the signed-in player's entry when it is among the ten, else null.

## 6. The answers the game reads

Each is a file in the game's `tests/fixtures/portal-api/`, exactly as the game must be able to read it (the fake service of F-1003 serves them; the real service's answers have the same shape):

| File | Route and status |
|---|---|
| `responses/session-200.json` | `GET /session` 200 |
| `responses/session-401.json` | `GET /session` 401 (no cookie) |
| `responses/runs-201.json` | `POST /runs` 201 |
| `responses/runs-409.json` | `POST /runs` 409 (another version) |
| `responses/runs-429.json` | `POST /runs` 429 |
| `responses/finish-200.json` | `POST /runs/:id/finish` 200 |
| `responses/finish-409.json` | `POST /runs/:id/finish` 409 (a changed repeat) |
| `responses/finish-410.json` | `POST /runs/:id/finish` 410 |
| `responses/leaderboard-lap-200.json` | `GET /leaderboard?kind=lap…` 200 |
| `responses/leaderboard-race-200.json` | `GET /leaderboard?kind=race…` 200 |
| `responses/error-503.json` | any route, 503 |

The case files give, for each rule, a body that passes and one that is refused, at the rule's edge (the floor and one below it; the longest time and one over it; the wall bound and one over it; extra keys; wrong types; `surprise`; 4 minutes): `start-cases.json` and `finish-cases.json` as `[{"name", "body", ("runConfig", "wallMs",) "expect": {"status"}}]`; `board-cases.json` as `[{"name", "runs", "query", "viewer", ("finished",) "expect": {"entries", "mine", ("ranks")}}]`, the runs in the shape `{"id", "playerId", "displayName", "submittedAt", "runConfig", "finish"}`; `leaderboard-query-cases.json` as `[{"name", "query", "expect": {"status"}}]`.

## 7. Trust, origin and versions

- **What the service can trust:** who the player is (Portal's signed token, verified once, then the session cookie); when a run started (its own clock); that a finish belongs to the session that started the run.
- **What it cannot:** that a time was driven rather than typed, that the car was untuned, or that a person drove. The game is open source and its tuning tools ship in the production build behind a code word. The board is a **casual, client-reported** leaderboard, as the host's others (`services/leaderboards/README.md:155-159`), and the game says so on it. The rules bound what they can: allow-listed values, a floor per track, direction and class, the session's longest time, the wall clock, 60 starts an hour, 2-hour runs. They cannot stop a fabricated plausible time or a bot.
- **Same origin.** The game and the API share the artifacts origin. Any script served on that origin could call the API with the player's cookie; the cookie authorises only this game's routes. Cross-site requests are stopped by the exact-`Origin` and JSON checks. A dedicated origin would close the rest, if it ever matters.
- **Versions.** The game's `SCORING_VERSION` (`src/content/scoring.ts`) is this API's `version`. Anything that can change lap times (handling, a class, the tuning block, NEWBIE, a track, the record rules) bumps it, and the service's `VERSION` is bumped with it, with a regenerated `floors.json`, in the same release. A new version starts new boards; older versions' boards stay readable through `?version=`. A start or finish of another version answers 409 with the service's version, and the game then ranks nothing until it is reloaded.

## 8. What the game does

For the service's author, to understand the traffic; not to build.

- It asks `GET /session` once when the game loads (never when it runs embedded in a Portal page, which is sandboxed, has no cookies and is guest-only).
- It starts a run when a session that could count is built: a qualifying heat or a final (a quick race is a final) of 3, 5 or 7 minutes, with a car the player drives, and a signed-in player. A restart starts a new run.
- It finishes the run only when the session counts: finished, not tuned, not driven by the autopilot. Otherwise the run is left to expire.
- It retries a finish once, with the identical body, after a network error or a 5xx. It times out every request at 8 s, and treats an answer over 32 KB or not JSON as a service failure.
- It writes its own local record first, always; a remote failure never touches it. There is no offline queue.
- It never stores the cookie or a token, sends `credentials: 'same-origin'`, and removes `?ranked=launch-failed` from the address.
- It reads boards publicly, and shows the display name cleaned to its pixel font (`cleanPortalName`), cut to 11 characters on the board.
