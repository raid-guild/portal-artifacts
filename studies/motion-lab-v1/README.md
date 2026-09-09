# Motion Lab v1

Editable source for the RaidGuild navigation and modal motion study published at
`public/motion-lab-v1/`.

The artifact is intentionally dependency-free. Build it with Node 18 or newer:

```sh
node build.mjs
```

The build copies `index.html`, `styles.css`, and `app.js` into the durable public
directory. Serve the repository through its documented Caddy/Docker setup, or
serve `public/` with any static file server and open `/motion-lab-v1/`.

## Interaction notes

- Choose a transition recipe, duration, and easing in the laboratory panel.
- Use the destination tabs to test full-viewport navigation.
- Open the field-note dialog to test modal entrance, reverse close, Escape, and
  focus restoration.
- Replay repeats the last completed navigation transition without changing the
  destination.
- `prefers-reduced-motion: reduce` replaces wipes and transforms with brief fades.
