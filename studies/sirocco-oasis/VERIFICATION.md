# Verification

- Production build: passed with Vite 6.4.3. The bundled Three.js chunk produces a size advisory, not an error.
- All 14 Blender GLB assets loaded successfully.
- Desktop Chrome rendering: no page or shader errors.
- Live in-app preview: no reported browser runtime errors.
- Pond taps: verified on desktop and 390 × 844 viewport; water interaction dismisses its hint.
- Drift toggle, reset view, audio on/off, and interface hide: verified through browser controls.
- Mobile layout: canvas and document width are 390px, with no horizontal overflow; screenshot inspected.
- Original Blender scene preserved; new assets saved in a separate, organized studio scene.
- Representative render after material batching: 230 draw calls, down from 756 before batching. This is not a frame-rate benchmark.
- No physical low-end mobile GPU benchmark performed.

## Morrow water harvester

- Blender-authored ring hull, wheelhouse, rear engine, open moon pool, fill cradles, and separate reusable balloon inspected in a preview render.
- Production build and harvesting state tests pass: pause/resume, pump rate, full shutoff, premature launch prevention, staggered arrivals, no duplicate counts, bounded flight pool, and refill.
- Browser full cycle: three reservoirs filled to 100%, released, traveled to the airship, and counted as three delivered. Vista/Ship view changes preserve the cycle.
- Desktop and 390 × 844 phone views inspected; ship remains small in the opening vista.
- New asset batching strips unused texture attributes to accommodate mixed Blender primitives.

## Operator station and shift quota

- Engine translated toward the wheelhouse in Blender; revised preview confirms clearance around all three balloon stations.
- Cabin and deck controls share one five-stage state machine. Browser clicks on physical Prime and Dispatch buttons advanced the corresponding timed stage; the physical radio display changed the accessible station selector to Orbital Rad.
- Full manual browser cycle reached dispatch and launched three vessels; reload during the shift preserved fill, stage and pump rate.
- Desktop and 390 × 844 phone console screenshots inspected. Fold-out controls retain accessible buttons and sliders.
- State suite passes every manual gate, pause/resume, mid-fill/mid-flight restore, bounded flights, the final one-vessel batch and exactly 1,000 deliveries after a simulated full shift.
- Isolated Chrome browser suite passes stored 123/1000 quota and 42% fill restoration, disabled premature dispatch, actual HTML audio playback in the cabin, immediate radio pause on Deck, silent reload, and no runtime/shader errors.
- Browser suite: `node tests/browser.test.mjs` (installed Chrome required; local Vite server on 5174 by default, configurable via OASIS_TEST_URL).

## Recorded diesel and mechanical sound

- Five CC0 source pages and recording licenses verified; excerpts and credits ship with the scene. Source clips normalized and loop boundaries crossfaded; encoded sample peaks remain below 0 dBFS.
- Production build and five-stage harvest state suite pass.
- Chrome audio checks pass for all five stages: five decoded buffers, nonzero analyser output, exactly two sustained layers, capped total voices, pause, mute to effectively zero output, unmute, cabin filtering and vista attenuation. No runtime errors.
- Audio is uninitialized on initial load and unlocks on a deliberate work action or Machinery volume adjustment. Machinery volume is independent of the radio and ambience.

## Oasis radio playlist

- Stations replaced with user-provided Pump Man, Mesa Jam and Oasis Vibes, encoded as full-length 192 kbps MP3 copies. WAV originals remain unchanged; durations match within encoder padding (<0.1s).
- Oasis assets are self-contained under `audio/radio/`; walker playlist is unchanged.
- Chrome verified all three new songs play, station labels match, radio pauses outside the cabin, and saved shift data survives reload.
- Removed the duplicate exterior control pod. The physical console remains inside the cabin; the operator panel continues to work in Ship view.
- Switching into or out of the cabin applies the final camera position synchronously with no fly-through. Browser checks assert no active camera transition in either direction.
