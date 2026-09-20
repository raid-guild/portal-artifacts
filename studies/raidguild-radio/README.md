# RaidGuild Radio

Published at `/raidguild-radio/`. The editable source is directly in
`public/raidguild-radio/`; no build or external dependencies are required.

- `index.html`, `style.css`, `app.js`: UI, cockpit motion, weather, lighting,
  two-deck playlist with short crossfades, and synthesized cabin ambience.
- `tracks.js`: playlist titles, ordering, and relative MP3 paths.
- `cockpit.png`: generated cockpit illustration based on the supplied walker reference.
- `audio/`: the six user-supplied MP3s, copied without transcoding.

Default order: Desolate Negative Space, Desolate West, Dusty Frontier,
Dusty Corridor, Dust and Glitch, Hanging Space. The playlist repeats.
Night is selected initially. Playback starts after clicking Start listening;
H hides or restores controls. Music and cabin volume are independent.
Weather choices are Clear, Dust storm, and Rain. Light choices are Day,
Sunset, Night, and a six-minute day/night cycle. Pause motion also pauses
that automatic light cycle; reduced-motion preferences are respected.

Serve the repository's public directory over HTTP, then open
`/raidguild-radio/`. Relative media URLs work under the artifact subpath and
with the existing self-only media CSP; do not replace MP3 URLs with data URLs.
Browser background throttling or device sleep may interrupt crossfades.
For Portal embeds, permit scripts and same-origin media access in the sandbox;
fullscreen additionally requires the iframe fullscreen permission.
