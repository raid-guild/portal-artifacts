# Jev Maze Lab

A local-only, dependency-free Node + canvas experiment comparing Jev-guided depth-first exploration with a systematic depth-first explorer.

## Start

Requires Node 20.12 or newer. No npm install is needed.

1. Add your key to `.env` (already created; `.env.example` is the template):
   ```dotenv
   TYPESAFE_API_KEY=your-key
   TYPESAFE_MODEL=jev-latest
   PORT=4317
   ```
2. Run `npm run dev` from this directory.
3. Open http://127.0.0.1:4317.

Restart the server after changing `.env`. The server binds only to 127.0.0.1. The key never goes to the browser, exports, or logs. The proxy sends maze observations to TypeSafe's documented `https://api.typesafe.ai/v1/systemone` endpoint. “Local-only” refers to the app; Jev inference still uses that external API. Without a key, use **DFS only**.

## Experiment

- **Generate maze** makes a seeded, connected maze. Extra passages introduce cycles.
- **Edit maze** enables drawing/erasing shared walls on either canvas. Drag near wall edges. Place start/goal with the tool picker. **Blank canvas** starts with every wall closed. Keyboard: arrows select a cell; W/A/S/D modify its north/west/south/east wall; Enter places the selected start/goal tool.
- Editing resets all progress and recomputes clues. Switch editing off before running. Disconnected mazes are allowed; explorers finish as exhausted if the goal is unreachable.
- **Run comparison**, **Pause**, and **Step** control both explorers. One tick is one physical move for each unfinished runner. Jev waits on the network only at forks with at least two unexplored options. Pause allows one in-flight decision to finish. Reset clears history and experience, preserving the current maze.
- **Rounds** runs a finite loop of 1, 5, 10, or 25 mazes, keeping the hidden rule fixed. Subsequent maze seeds are `baseSeed:round`. Round one uses your current edited/generated maze. Later rounds generate new mazes. Retain across rounds carries each runner's own observed counts; otherwise counts reset.
- **Call budget** caps API attempts per batch. Errors count toward the budget, stop execution, and do not silently fall back to DFS or retry. Raise the budget to resume. Speed controls animation delay, not API latency.
- **Export experiment** downloads JSON including all round mazes, settings, current runner state, observed experience, exact successful requests/responses, and failed request observations. There is no automatic save or import; refreshing clears the session.

## What Jev sees and learns

Each directional passage carries one of three symbols: zigzag, circle, bars. A seeded hidden rule selects a predictive symbol. At reliability `p`, a corridor that leads to a dead end gets that symbol with probability `p`; a corridor that leads to a junction/loop gets it with probability `1-p`. Otherwise one of the other symbols is selected uniformly. This is a likelihood rule, **not** a guarantee that `p` percent of predictive-symbol corridors are dead ends. At 50%, symbols are noise. At 100%, the predictive symbol identifies dead-end corridors perfectly.

A corridor extends from an entrance to the next junction, dead end, or loop. The rule says nothing about distance to the goal. Goal encounters are separately recorded. Edited topology triggers deterministic clue regeneration; the maze builder knows the structure but the request builder never sends it.

Both explorers keep visited cell IDs, a DFS stack, and passage traversal marks. They never traverse walls, avoid revisiting cycles, and backtrack when no unexplored exit remains. Jev chooses the **order** of unexplored branches. Baseline order is north, east, south, west. Jev is not responsible for learning the backtracking algorithm. Each undirected tree edge gets one mark when entered and a second when backtracked. Shared bookkeeping includes recognition of previously visited neighboring cells.

Jev receives only the current cell ID, local passages, available moves, and cumulative observed outcome counts by symbol. It gets no full map, goal coordinate, hidden rule, unobserved outcomes, or baseline observations. Counts update only upon completing a corridor. This is in-context use of external memory, not model training or raw-history pattern discovery.

One request batches a Choice for the move plus three Noul judgments about observed symbol evidence. The Noul answers are diagnostics, not chain-of-thought or evidence of what caused the chosen move. Inspect all probabilities, confidence, usage, and latency in the decision inspector.

## Reading the comparison

Physical steps (including backtracking) are the primary metric. API latency and calls are reported separately; the two animations advance in lockstep, so their apparent speed is not a computational speed benchmark. The shortest-path reference uses full-map BFS strictly for the observer and is never supplied to either solver. Compare many paired seeds and report success/exhaustion alongside step counts. Avoid treating a single win as evidence of superiority. A simple symbol-count learner would be a useful additional baseline for a later experiment.

## Validation

`npm test` runs engine and HTTP-proxy tests, including 210 complete explorations across seeded tree/cyclic mazes, disconnected goals, symmetric editing, consistent clues, observation-only memory, key isolation, and mocked TypeSafe responses/errors. `npm run check` checks JS syntax. These tests do not spend API credits. A live TypeSafe smoke test still requires your key.

Files: `public/engine.js` is the pure maze/exploration logic; `public/app.js` controls the UI; `server.mjs` is the local static server and API proxy.

## Semantic rooms (new default)

Select **Mode → Semantic rooms**, choose radio repair, plant care, or bicycle repair, then **Generate maze**. Jev receives the goal and local exit descriptions, including paraphrases, lexical distractors, and explicit exclusions. For example, a soldering bench serves a repair goal while a broadcast archive does not. No symbol counts are sent in this mode; this tests pretrained language understanding, not cross-round learning. The retain checkbox is disabled for semantic mode.

This is a synthetic sign-following benchmark: the builder computes distances to the goal and draws a goal-relevant description with probability `p` for an edge decreasing distance, or `1-p` otherwise. The complementary case draws a distractor. At 50%, signs are independent of progress; at 100%, relevant signs consistently lead closer. Reliability describes sign placement, not expected task success. Descriptions are directional area signs, not stable identities for individual grid cells. Existing walls provide blocked routes, and bad signs can still trigger backtracking. Pools contain six helpful and six distracting descriptions per task; new seeds vary placement, not an unlimited vocabulary. Do not generalize wins here to arbitrary navigation tasks.

All runs now include **fixed DFS**, **seeded random DFS**, and **keyword DFS**. Choose the baseline shown on the right canvas; all three always run and appear in the history/export. Random choice is deterministic per maze seed and cell. Keyword choice counts distinct exact lowercase word overlaps with the objective, dropping a small fixed stop-word list; ties use N/E/S/W. It does not understand negation or synonyms. In symbol mode, keyword DFS has no description signal and reduces to fixed DFS. Jev receives no distance, goal coordinate, relevance label, or baseline result.

Changing construction settings now disables Run and Step until Generate applies them. The active settings are shown explicitly. Reset or restarting a completed batch restores the batch's initial maze (including edits), avoiding accidental reuse of round five as round one. Export before generating/resetting/reloading if you want to preserve a batch. Export format version 2 includes all three baselines and semantic signs.

## Personal API keys

Expand **Use your own Jev API key**, paste a key, and click **Use & test key**. Testing sends one small inference request to TypeSafe and may incur usage. A successfully checked key is held only in this tab's JavaScript memory and is sent via a request header through the local server to TypeSafe. It is never written to `.env`, local/session storage, or exports. Keys are request-scoped on the server, so one tab cannot replace another tab's key. Failed checks keep the previous active key. Clear or refresh restores the server's `.env` key when present; the connection badge identifies which source is active. The server remains local-only.


## Published artifact

Run `npm run build:artifact` to sync the explicit public asset allowlist to
`../../public/jev-maze/`. The hosted page sets `data-hosted="true"`, uses relative
asset URLs, constructs typed questions in the browser, and sends authenticated
inference requests to `/jev-api/systemone`. Caddy forwards only POSTs at that
exact path with a Bearer header to TypeSafe's fixed inference endpoint. Request
bodies are capped at 100 KB, cookies are stripped, and responses are no-store.
No server key or `.env` fallback exists in hosted mode. Visitor keys traverse the
artifact proxy to TypeSafe and remain in tab memory only. Normal API usage charges
apply to the visitor's account. No model provider response bodies are shown on
HTTP failures. Existing local mode remains available with `npm run dev`.

Publishing follows this repository's normal branch/PR/main Railway process;
pushing a feature branch alone does not establish a live public deployment.
