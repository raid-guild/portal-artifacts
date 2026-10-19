# Rewind — Wall / Rise concept

The canonical, editable source and published artifact is [`../../public/rewind/`](../../public/rewind/). [`dist`](dist) points to that directory so the study and deployed artifact cannot drift. From the repository root, run `python3 -m http.server 8765 --directory public` and open `http://localhost:8765/rewind/`. The player needs no build step or remote package.

The bundled 59.536-second audio is an excerpt from 01:00–01:59.54 of **“Rewind” by Tanner Royster**, supplied for this prototype. The wall builds with upper-mid attacks in the full mix and steady growth between them; this is a creative interpretation, not an isolated steel-guitar transcription or a measurement of song sections. Press **Break wall** or **B** to release the wall, and **Rotate view** or **Y** to change the camera. Seeking restores recorded breaks at their original times. Replay and local audio replacement clear break history. Volume, record view, fullscreen, pointer response, and editable lyric cues are also available. Lyrics are a draft transcription; bracketed words need checking against official lyrics.

**Background** offers four modes:

- **Fold** (default) is a WebGL2 port of [Yohei Nishitsuji’s 18 January 2025 GLSL post](https://x.com/YoheiNishitsuji/status/1880561598982668452). It retains the published iteration structure and grades the final light accumulation in teal, copper, and chrome. [The source and MIT notice](../../public/rewind/vendor/fold-LICENSE.txt) are bundled.
- **Fractal** is a separate port of [Nishitsuji’s published GLSL expression](https://x.com/YoheiNishitsuji/status/2111673230113272074), graded in teal, copper, and silver. Its [original expression](../../public/rewind/vendor/fractal-original.glsl.txt) and [MIT notice](../../public/rewind/vendor/fractal-LICENSE.txt) are bundled.
- **Sculpture** is an independently written reflective, nested-noise WebGL2 field inspired by [Torin Blankensmith’s Shader Park tutorial](https://tympanus.net/codrops/2023/02/07/audio-reactive-shaders-with-three-js-and-shader-park/). It does not depend on Shader Park or Three.js.
- **Ink** adapts the pressure/advection/vorticity solver from [Inkwash](../../public/rewind/vendor/inkwash-LICENSE.txt), © 2026 Jonathan Whitaker, under the MIT license.

Fold, Fractal, and Sculpture follow playback time without attack-driven motion; pausing holds the frame and seeking reconstructs the selected time. Ink advances at 30 Hz while playing and reseeds on seek. A Canvas wash is the final fallback if the WebGL backgrounds are unavailable. Reduced-motion mode holds a static field and fixed oblique camera. The shader backgrounds cap their framebuffer size independently of the wall canvas. Fold and Fractal are computationally heavy; performance across hardware has not been measured.

`rewind-social-v3.png` is a deliberately composed 1200 × 630 screenshot of the **default Fold field and wall at 14 seconds**. Its title and track credit are overlaid for legibility. The Open Graph and Twitter tags in `index.html` refer to this versioned cover and the durable production `/rewind/` URL. Update both when changing the cover.
