# Ink / Flight

An offline, browser based interactive music visualizer. The full 4:08.757 WAV master is encoded as stereo 48 kHz AAC at 192 kbps with fast-start metadata and three-second entrance/exit fades (about 6 MB). The detailed bird sequence uses 384 transparent frames extracted from the supplied 16-second bird video.

## Run locally

From the workspace root:

```sh
python3 -m http.server 8765 --directory outputs/ink-flight
```

Open `http://localhost:8765` in a modern browser. A local server is needed so browsers can load the frame sequence reliably. No network connection or third party packages are required.

## Interact

- Press Play to hear the included audio. The WebGL2 ink and water simulation responds to low, middle, and high frequencies. Bass increases water and pigment, middle frequencies push the flow, and high frequencies add fine deposits. A larger flock of 280 small leaf-like marks on desktop, or 180 on narrow screens, gathers into two moving groups that separate, turn, and merge through local flock rules and guiding paths. The count adjusts when the window crosses the narrow-screen breakpoint. For an older browser or to compare, add `?fallback=1` to use the Canvas wash.
- Choose **B&W** to see the ink wash in grayscale, then **Color** to switch back. This changes the rendered palette without restarting the fluid simulation or the song, and works with the Canvas fallback too. With **Mouse: On**, moving the mouse across the scene draws nearby birds gently toward it. A bird reaching the pointer triggers a local flock-wide scatter along individual escape paths; the birds then gradually rejoin. Touching the scene gives a brief local response. Choose **Mouse: Off** to stop pointer attraction and scattering immediately; turn it back on and move over the scene to reactivate it. Selecting birds still works with the mouse interaction off.
- Click or tap a bird, or use **Follow a bird**, to see the two hand-drawn birds over the ink wash. The full animation frame fits within the viewport so both birds stay visible. The flock hides throughout the zoom, while the ink keeps moving at full intensity. The 16-second bird animation plays once and returns to the flock. **Return to flock**, **Escape**, or **F** returns early.
- Choose **Country road** to watch an angled road draw toward a right-of-centre horizon, with a receding row of telephone poles on the left, bowed wires, and sparse verge marks. Seven small birds draw onto the wires at the end, connecting the road to the flock. The flock fades away over the first second as the drawing begins, then returns after a short hold. **Return to flock**, **Escape**, or **F** returns early. The ink wash, soundtrack, and lyrics continue through the scene. The two scenes cannot overlap. Reduced motion shows the completed sketch promptly.
- Drag the timeline to seek, adjust volume, or choose **Replace audio** to use a local audio file. The replacement remains on this device and is not uploaded.
- The included song's phrases appear above the playback controls at their timed cues, including after seeking. Open **Lyrics** to show or hide them, or edit the cue JSON and choose **Apply**. Times are seconds from the beginning of the audio. A cue has `start`, `end`, and `text`; cues must be in order and cannot overlap. For example: `{"cues":[{"start":2.4,"end":4.8,"text":"A line of lyrics"}]}`. Gaps show no lyric. Replacing the audio clears the song's cues; you can enter timing for the replacement in the same editor. Edits last for the current page session. The lyric wording was supplied by the user. Timing is approximate, anchored to word timestamps from the full master; repeated chorus and outro phrases use the supplied wording.
- **Space** toggles playback when a control is not focused; **F** follows or returns; the top right button toggles fullscreen.

The scene honors the operating system's reduced motion preference. On a small screen, the controls reflow beneath the scene.

## Files

`index.html`, `style.css`, `app.js`, `road.mjs`, `pointer.mjs`, `lyrics.mjs`, and `vendor/inkwash.js` contain the complete prototype. `pointer.test.mjs` checks the pointer response with `node --test pointer.test.mjs`. `assets/my-head-spins-full.m4a` is the soundtrack, and `assets/lyrics.json` contains its timed transcription. `assets/zoom-birds/` contains transparent WebP frames made from the supplied 16-second video and used by the zoom. `assets/bird-webp/` and `assets/bird/` retain the earlier zoom animation for later edits.

## Ink engine attribution

`vendor/inkwash.js` adapts the WebGL2 fluid and pigment engine from **Inkwash by Jonathan Whitaker**. It retains the simulation shaders and pipeline, with music controlled emitters replacing pointer painting, a bounded resolution, broad moving currents, and a 17 second mobile pigment decay for a continuous visualizer. The source is licensed under the MIT license; the copyright and permission notice are preserved in `vendor/inkwash-LICENSE.txt`. The prototype is self contained and does not fetch a remote engine. If WebGL2 or floating point render targets are unavailable, or the context is lost, the Canvas wash is used automatically.

## Repository publishing

The editable prototype is here in `studies/ink-flight/`. The static published copy is `public/ink-flight/`; copy runtime HTML, CSS, modules, vendor, `assets/my-head-spins-full.m4a`, `assets/lyrics.json`, and `assets/zoom-birds/` there after editing. Preserve the social image and metadata. Original bird assets and tests are study-only.

Song: **My Head Spins — Tanner Royster**. The supplied full WAV master provides the soundtrack; the Song info dialog links to the supplied YouTube video. Lyrics use supplied wording with draft timing. The transparent zoom frames are derived from the user-supplied two-bird video. The share cover is a composed screenshot of this prototype.

- **Sunset** draws the cowboy landscape over about 16.1 seconds, erases the rider, then scatters the remaining ink in wind before returning to the flock (~29 seconds total). Return early with the shared control or Escape. Reduced-motion mode shows the finished drawing briefly with fades. The transparent centerline trace and wind renderer are in `sunset.mjs` and `assets/sunset/paths.json`.

- Follow a bird and Country road now end with a six-second foreground ink-to-dust dissolve. The flock returns as the dust clears; manual early return retains the short transition and reduced-motion mode uses a fade. The shared renderer is `dust.mjs`.

The bundled soundtrack streams directly from its HTML audio URL, allowing playback before the entire file downloads. Seeking works best with a server supporting HTTP Range responses (production Caddy does). User-selected local audio still uses a Blob URL. The basic Python preview server may have limited seeking support.
