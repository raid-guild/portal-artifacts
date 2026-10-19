# Orbit Lab

An experimental gravity maze built with Three.js and cannon-es. Place temporary
gravity wells to bend a blob's flight around walls and spikes toward the exit.
The Sandbox tab keeps the open-ended orbital playground. The deployed route is
`/orbit-lab/`.

## Develop, test, and publish

Requires Node.js 20.19 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/orbit-lab/`. From this directory, run `npm test`
for geometry, collision prediction, and a scripted Cannon physics traversal;
run `npm run build` to replace only `../../public/orbit-lab/`. Commit editable
source and rebuilt public output together. The Caddy route allows public asset
CORS for Portal's scripts-only sandbox iframe. The game code and fonts load
from this artifact and the game has no backend; the Portal packaging step
injects its site-wide analytics and outbound-link scripts.

## Controls

- Click or tap open space to place a well. Two may exist at once; a third
  replaces the oldest.
- Right-click a well or use its list button to remove it.
- Space starts or pauses; R restarts the current mode; E releases all wells.
- The side panel adjusts gravity strength, lifetime, and fade or snap release.

Maze runs begin paused to allow the first placement. The dotted forecast ends
at the next predicted wall, spike, or exit contact and assumes no later wells
are placed. A spike hit resets the run. Sandbox starts with its center well and
has no maze collisions.

## Assets and attribution

The app uses locally hosted Space Grotesk and DM Mono fonts. The license texts
for those fonts and the bundled Three.js and cannon-es dependencies are in
`public/licenses/` and are copied to the published artifact. The social card
`public/orbit-lab-social-v1.jpg` is a 1200 × 630 composition based on the
original local maze screenshot at `outputs/orbit-maze-preview.jpg` in the
prototype workspace, with a title panel added for link previews. It depicts
the actual playable maze, not concept art. Canonical and social metadata use
the production `/orbit-lab/` URL.
