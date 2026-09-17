# RaidGuild Portal Artifacts

Static, interactive artifacts embedded by the RaidGuild Portal.

## Adding an artifact

Create a stable directory beneath `public` with an `index.html` file:

```text
public/
  artifact-slug/
    index.html
```

After a change is merged to `main`, Railway deploys it at:

```text
https://<artifact-domain>/artifact-slug/
```

Published paths are durable. Do not rename or remove them. Use a versioned path
when an existing article must retain the original artifact.

## Security boundary

Artifacts run on a separate origin from Portal and must be embedded in a
sandboxed iframe. They must not contain Portal credentials, depend on Portal
cookies, or call private Portal APIs.

The service applies a restrictive Content Security Policy. Inline JavaScript
and styles are permitted for self-contained workshop exports. The only external
script origin currently permitted is `cdnjs.cloudflare.com`; prefer checked-in
dependencies for durable published work.

## Local preview

```bash
docker build -t portal-artifacts .
docker run --rm -p 8080:8080 -e PORT=8080 portal-artifacts
```

Open <http://localhost:8080>.

## Portal motion study

`public/portal-motion/` contains the built portal animation. Editable source is in
`studies/portal-motion/`. To rebuild with Node 22.13 or newer:

```sh
cd studies/portal-motion
npm ci
npm run build:railway
cp -R dist-railway/. ../../public/portal-motion/
```

## Sirocco oasis study

Editable Three.js source and the Blender asset library are in
`studies/sirocco-oasis/`; the published build is in `public/sirocco-oasis/`.
See the study README for rebuild instructions. All runtime assets are served
from this origin under the existing Content Security Policy.

## FIELD spatial horror study

`public/field/` is the standalone FIELD demo. Editable Blender assets, scripts and regression checks are in `studies/field/`; its `dist` symlink points to the published source. See the study README for controls and local development.

## Lunar Republic game

`public/lunar-republic/` contains the standalone Three.js lunar catapult game.
Editable Blender assets and campaign tests are in `studies/lunar-republic/`,
whose `dist` symlink points to the canonical public source. See its README for
local play, tests, and asset regeneration.

## Cosmic Carnival game

`public/cosmic-carnival/` contains the production build of the pastel alien
lane shooter. Editable Three.js/TypeScript source, focused simulation tests,
the supplied GLB models, and build instructions are in
`studies/cosmic-carnival/`.

## Published artifacts

- `cosmic-carnival/` — Twelve-lane arcade shooter using the supplied Crescent,
  Prism, Ribbon, and Jester models, with deterministic waves and a psychedelic
  title reveal.
- `raid-credits/` — Public, unauthenticated rework of the 2020 Raid Credits
  audiovisual showcase, with a complete static Portal member roster and
  explicitly inactive historical Rainbow Warrior NFT context.
- `lunar-republic/` — Toon-shaded lunar revolution game with freight, allied cities, resource upgrades, enemy operations, and persistent district destruction.
- `field/` — CAD tutorial that descends into a procedural office maze, with spatial changes, wall music and fleeting seated shadows.
- `sirocco-oasis/` — Stylized interactive desert vista with reflective rippleable
  water, a traveling airship, wind-driven palms, dust, and optional ambient audio.
- `portal-motion/` — Interactive spark portal with palette mixing, size controls,
  and a blurred mountain destination that reveals on hover.
- `desert-walker/` — Interactive Three.js vignette featuring a textured
  dieselpunk survey walker in a procedural desert, with orbit controls and
  optional ambient motion.
- `bd-thread-journeys/` — RaidGuild BD thread journeys across phases. This is a
  concept demonstration; its middle-phase crossings are explicitly marked as
  synthetic in the artifact.
- `veydrift-alliance-map/` — Live, read-only tactical map for Veydrift alliance
  29 (RaidGuild), with a clearly labeled fixture fallback. Its CSS/SVG planet
  visuals are placeholders; no Veydrift artwork is included. Other public
  alliances can be loaded with the in-map ID switcher or the shareable
  `?alliance=<id>` query parameter.
- `veydrift-mission-explorer/` — Live, read-only explorer for public Veydrift
  missions, including flight path, fleet, cargo, combat results, and contextual
  links to the alliance map. Deep links use `/mission/<id>` beneath this path.
- `module-gallery-study/` — Switchable editorial and restrained Three.js module
  gallery with responsive, keyboard-accessible detail views.
- `web-presence-map/` — Interactive RaidGuild constellation showing the public
  front door, community world, Portal capabilities, knowledge routes, and
  outward-facing specialist offerings.

## Veydrift read proxy

The service exposes a narrow, read-only subset of the public Veydrift API below
`/veydrift-api/`. Only explicitly allowlisted `GET` and `HEAD` routes are
forwarded. Keep this allowlist limited to routes consumed by the artifact; do
not turn it into a general API proxy or forward browser credentials.
