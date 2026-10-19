# Orbit Lab

An experimental gravity maze built with Three.js and cannon-es. Place temporary
gravity wells to bend a blob's flight around walls and spikes toward the exit.
The Orbit mode in Settings keeps the open-ended orbital playground. The deployed route is
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
  replaces the oldest. Tap **Start** to release the particle; the same button
  pauses and resumes.
- Use the gear for gravity strength, lifetime, fade or snap release, mode,
  forecast, active wells, run statistics, and help. Opening it pauses a running
  simulation; closing it resumes that run.
- Right-click a well or use its list button in Settings to remove it.
- Keyboard: Space starts or pauses; R restarts the current mode; E releases
  all wells.

Both maze and orbital sandbox begin ready, allowing placements before the
initial release. The maze room uses a 16:9 interior; phone controls sit in a narrow side rail. Upright phones present the playfield sideways, and rotating updates the camera and touch mapping without restarting. The portal casts a faint purple light and sheds purple sparks. A spike hit resets the maze run. The orbit mode has no maze
collisions. Luminous recent trails burn down into a faint, persistent archive
that clears on restart. Recent glow uses fixed-size ribbon buffers; its faint raster archive expands with the visible world on resize without discarding earlier marks.

## Sound

Player wells default to strength 85. A procedural, original five-note synth call advances with each valid placement. The flight tone fades with time since placement; death and the portal have separate synthesized cues. Sound starts only after an interaction and can be muted in Settings. There are no external sound files or audio requests.

## Assets and attribution

The app uses locally hosted Space Grotesk and DM Mono fonts. The license texts
for those fonts and the bundled Three.js and cannon-es dependencies are in
`public/licenses/` and are copied to the published artifact. The social card
`public/orbit-lab-social-v2.jpg` is a 1200 × 630 composition based on the
minimal orbital screenshot at `outputs/orbit-minimal-preview.jpg` in the
prototype workspace, with a title panel added for link previews. It depicts
the actual playable Orbit mode, not concept art. The original v1 image is retained for existing shared links. Canonical and social metadata use
the production `/orbit-lab/` URL.
