# Motion Lab v1

Editable source for the RaidGuild navigation and modal motion study published at
`public/motion-lab-v1/`.

The artifact is intentionally dependency-free. Its stamp is the unmodified official
RaidGuild crossed-swords logomark from `raid-guild/brand` at commit
`8f0b5eecd9fe0c086e138ba33307110e1d902b06`, repository path
`public/assets/logos/symbol-m500.svg` (SHA-256
`1f3201af196f72a305e7df3ae048ae639c5fb63706396086900755d765a7bc05`).

Build it with Node 18 or newer:

```sh
node build.mjs
```

The build copies `index.html`, `styles.css`, `app.js`, and the canonical stamp asset
into the durable public directory. Serve the repository through its documented
Caddy/Docker setup, or serve `public/` with any static file server and open
`/motion-lab-v1/`.

## Interaction notes

- Choose a transition recipe, duration, and easing in the laboratory panel.
- The primary recipe covers the current surface, then scales the canonical stamp
  as a luminance-mask aperture to reveal the destination through its silhouette.
- Use the destination tabs to test full-viewport navigation.
- Open the field-note dialog to test modal entrance, reverse close, Escape, and
  focus restoration.
- Replay repeats the last completed navigation transition without changing the
  destination.
- `prefers-reduced-motion: reduce` replaces wipes and transforms with brief fades.
