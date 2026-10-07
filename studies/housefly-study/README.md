# Housefly Study

A standalone Three.js experiment in procedural fly flight. One fly cruises, darts, investigates draggable attraction spots, and reacts to the cursor within a 3D volume over a scrollable webpage. The deployed artifact path is `/housefly-study/`.

## Develop, test, and publish

Requires Node.js 20.19 or newer.

```sh
npm ci
npm run dev -- --port 5182 --strictPort
```

Open `http://127.0.0.1:5182/housefly-study/`. From this directory:

```sh
npm test
npm run build
npm run preview -- --port 5183
```

The build replaces only `../../public/housefly-study/`; preview it at `http://127.0.0.1:5183/housefly-study/`. Commit the editable source and rebuilt public output together. Merging to `main` publishes the stable route through the artifact service. The Caddy route allows public asset CORS for Portal's scripts-only sandbox iframe. JavaScript and fonts are served locally under the repository's Content Security Policy; the study has no backend, accounts, cookies, or external runtime requests. Dependency licenses are in `public/licenses/` and are copied into the published output by Vite.

## Controls

Use the panel at the lower right to tune speed, depth travel, turn frequency, sharpness, attraction, cursor response, and burst speed. The fly deliberately approaches the camera and recedes toward the page; its apparent size and the soft offset shadow change with depth. A fixed gauge shows far-to-near position and movement direction. Drag green attraction spots, or focus a spot and use arrow keys (Shift for larger steps). Delete removes the focused spot. Pause, single-step, slow motion, reset flight, and full restore are available. Trail and diagnostics are under More variables.

The canvas lets ordinary links and scrolling work. The fly follows the visible viewport rather than traveling through the whole document. If this study is embedded in an iframe, flight remains inside the iframe. An overlay on a host page requires installing the canvas in that page.

The fly is drawn from simple Three.js meshes. The referenced Sketchfab model is non-downloadable; no third-party fly asset is included. Fonts are bundled locally.

## Link preview

`public/housefly-social-v1.png` is a deliberately composed 1200 × 630 screenshot of the local study, captured in headless Chrome at the matching viewport size. It shows the rendered procedural fly, page title, controls, and depth cue. The initial HTML contains static Open Graph and Twitter tags with absolute production URLs. This image is a screenshot of the running study, not concept art.
