# Verification

- Production build: passed with Vite 6.4.3. The bundled Three.js chunk produces a size advisory, not an error.
- All 13 Blender GLB assets loaded successfully.
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
