# Jelly Garden

Editable source for the static Portal Artifacts study published at `/jelly-garden/`.
The three draggable soft bodies use a constrained spring cage, a smoothed render
skin, a damped landing squash, and interpolated visual motion. Creature contact
uses approximate spheres rather than full soft-body collision.

## Rebuild and test

From this directory, with Node 20 or newer:

```sh
npm ci
node --test
npm run build
rsync -a --delete dist/ ../../public/jelly-garden/
```

The Vite build uses `/jelly-garden/` as its base path. The copied `dist` is the
published artifact; `src/` and `tests/` are the editable source. No runtime
network requests, keys, Portal cookies, or private APIs are required. The
RaidGuild credit links to the public Portal.

## Fonts and artwork

The RaidGuild stamp is the approved SVG from the standalone Jelly Garden build.
The variable DM Sans Latin WOFF2 and its SIL Open Font License were copied from
`public/ragdoll-lab/assets/fonts/` in this repository. The variable Nunito Latin
WOFF2 and its SIL Open Font License come from the
[`@fontsource-variable/nunito` 5.3.0 package](https://www.npmjs.com/package/@fontsource-variable/nunito)
(upstream: The Nunito Project). Both fonts are served locally from
`public/assets/fonts/` beneath this study and copied into the artifact build.
