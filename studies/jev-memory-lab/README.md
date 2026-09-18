# JEV Memory Lab

The canonical, editable source is `public/jev-memory-lab/`. No build step or dependencies.

- `index.html`: batch visualizer and evidence explorer.
- `styles.css`: presentation and responsive layouts.
- `app.js`: local playback, evidence selection, threshold simulation, and JSON export.
- `data.js`: fixed recorded pilot results: 85 candidates from 20 retained meetings.

Open `/jev-memory-lab/` to run the complete 18-second batch. It holds its final state; Pause, Restart batch, Close, and Escape are available. `?demo=0` starts in the evidence explorer instead. The default 90% threshold produces 60 class edges, 25 abstentions, and 28 ownership edges. Explorer threshold changes never modify the recorded results.

This is a visual demo, not a live classifier. It needs no JEV key, Gateway connection, API server, cookies, storage, or external dependencies. No fetch, WebSocket, or other API calls are used. Real recorded outputs are replayed with illustrative accelerated timing; the animation is not a reconstruction of provider concurrency or latency.

The embedded dataset includes retained meeting quotes and local participant labels. It is static public artifact content, not a route into production memory. Source IDs and revisions preserve provenance; summary evidence is not independent transcript verification. A small assistant-reviewed evaluation is not a production accuracy guarantee.

## Preview and verify

Serve `public/` using the repository Caddy setup or a local static server. All scripts and styles use relative paths and work under the existing CSP and a Portal sandboxed iframe (`allow-scripts`; downloads additionally need `allow-downloads`).

With Playwright available, run:

```sh
ARTIFACT_BASE_URL=http://127.0.0.1:8080 node studies/jev-memory-lab/check.cjs
```

The check exercises the full batch, exact final counters, pause/restart/close, explorer cases, mobile overflow, a sandboxed iframe, and rejects runtime requests outside the static artifact path.
