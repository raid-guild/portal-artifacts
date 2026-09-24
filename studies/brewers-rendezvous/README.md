# One Taster in Salida

A playable miniature of the 2026 Colorado Brewers Rendezvous: original upright animal characters, huge cottonwoods, six brewery stops, community memories and a riverside departure.

## Run locally

From this study directory (`studies/brewers-rendezvous`):

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173/ in a browser. ES modules require an HTTP server rather than opening index.html as a file. No build step or package installation is needed; Three.js is bundled locally.

## Explore

- Click or tap a labeled stop to visit it; choose Open field note to read its story.
- Click or tap the lawn to move the fox, or focus the scene and use WASD / arrow keys. Keyboard walking follows the viewing angle.
- Drag the scene to rotate around the park and tilt the view. Holding briefly before dragging also works; releasing a held press or drag does not move the fox.
- Toggle **Follow character** for a close third-person walking view; toggle it again for the miniature view. The follow camera keeps a low horizon-facing angle as you zoom, with only obstructing booth roofs cut away so the character stays visible. Drag or use Q / E to orbit in either mode. Pouring temporarily frames the host, then returns to the chosen view.
- Scroll over the park to zoom in and out with a mouse wheel or trackpad, in either camera mode.
- Use Next stop for the curated route; zoom adjusts the view, and the whole-park button restores the original viewing angle.
- Toggle Labels to hide all floating stop labels and the river caption. The preference stays in effect while exploring and reading; story controls remain available.
- The field note starts tucked away in a small dock. Open it for the full tasting note and journal; walking, pouring and Next stop remain available while it is closed.
- Read story opens the complete recap, including sources and uncertain transcription details.
- **Meet neighbors** lets you find Mabel, Juniper and Hops for short, sourced stories about Salida, the river and the festival. You can also click their map labels or characters. Walk over, then choose Talk. Escape closes the conversation.
- Visit **Keys & the Cottonwoods** at the riverside stage to request **Beer Crossing**, the original synth track supplied for this project. Press Start after arriving; the song loops until you press Stop. Start, Stop, mute and volume controls stay available as you wander. Stop resets the song to the beginning. On phones, a small speaker button opens the music controls; tap it again, tap outside, or press Escape to tuck them away while the song continues.

At each brewery booth—Liquid Mechanics, Seedstock, Four Noses, Ramblebine, Joyride and Breckenridge—walk to the counter and choose **Fill my taster**. A close-up shows the animal host opening the tap, beer filling the glass, and a foam cap. Finishing reveals that beer’s personal tasting note and collects its journal stamp. Cancel, open the reader, or move to another stop to leave an unfinished pour without collecting it. Replays never add duplicate stamps.

The arrival, community and departure stops remain story stops. Simply visiting a stop never adds a stamp. The journal lasts for the current page session, and the complete editorial recap is always available through Read story. Reduced motion completes an intentional pour immediately; if 3D is unavailable, the note can be saved directly.

The park includes flowing water with stylized reflections, boulder wakes and small rapids, gently moving cottonwood leaves, textured grass and twelve roaming animal visitors, six carrying little amber tasters. A stylized valley backdrop adds western peaks, the S hill across the river, rolling hills and an eastern canyon opening. Ambient animation respects the device's reduced-motion preference.

## Edit

- `dist/js/content.js`: story text, tasting reactions, brewery links and stop positions.
- `dist/js/neighbors.js`: fictional character hosts, verified dialogue/source links, and stage-track metadata.
- `dist/js/neighbor-ui.js`: discovery, conversation and music controls.
- `dist/js/neighbor-state.js`: proximity checks for optional encounters.
- `dist/js/music.js`: user-triggered playback and media-event state.
- `dist/assets/audio/`: browser-ready MP3; the supplied WAV is retained under `model-source/audio/`.
- `dist/js/park.js`: Three.js environment, camera, movement and GLB loading.
- `dist/js/layout.js`: shared booth facing, placement and collision transforms.
- `dist/js/ambience.js`: procedural river, rocks, grass and canopy movement.
- `dist/js/crowd-routes.js`: visitor routes and tasting-glass assignments.
- `dist/js/valley.js`: artistic valley scenery.
- `dist/js/label-projection.js`: label positions synchronized with the active camera.
- `dist/js/tasting.js`: pour timing, cancellation and physical arrival checks.
- `dist/js/pour-scene.js`: original procedural cup, tap, stream and host gesture.
- `dist/js/app.js`: story controls, reader and tasting-glass progress.
- `dist/styles.css`: responsive interface.
- `model-source/`: original editable Blender scenes, the repeatable model-generation script, and visual references for the exported assets.
- `dist/assets/models/`: the three shared-base animal variants and cottonwood model.
- `docs/content-audit.md`: factual sources and unresolved details.

Run the interaction checks with `node --test tests/*.test.mjs` (Node.js required only for tests).

## Scope and provenance

This is an independent personal recap, not an official event site or a measured booth map. The animals and layout are an artistic interpretation. The exact Four Noses, Ramblebine and Joyride festival releases remain unconfirmed. The Breckenridge beer/style pairing is also labeled as a recollection from the rough notes. Original event artwork identifies the event; Three.js's MIT license is included in `dist/vendor/LICENSE`.

The editable source is separate from the deployable `dist/` directory, which can also be hosted on a personal website. The canonical browser source lives in `public/brewers-rendezvous/`; this study’s `dist` symlink points there, so edits and model exports update the artifact directly. No build step is required. The artifact is served at `/brewers-rendezvous/` after this branch is merged and deployed. All runtime assets, including music and Three.js, are served from the same origin.

## Link previews

Open Graph and Twitter large-image metadata in `dist/index.html` use the repository’s Railway origin and `/brewers-rendezvous/` path. The 1200 × 630 image at `dist/assets/brewers-rendezvous-social.jpg` is captured from the actual park with a title overlay. If the canonical host changes, update the canonical, Open Graph and Twitter URLs together.
