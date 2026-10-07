# Puddle material study

A self-contained Three.js study of a living particle puddle on a floating terrace. The visible brain stays coated by real flesh particles and leads movement. Its power comes from flesh currently connected to it; loose pieces draw in more weakly with distance. Marching Cubes gives the moving particles a single translucent body.

The app opens on **Tendrils / Retrieval Setup**, with loose green flesh holding the basin gate open and the brain on the far side. Click the basin, or aim with the pointer and press E, to cast a thin strand of existing body particles. Hold Space to retrieve the strand and the flesh it contacts; release to pause. The brain stays in the body. Casting reserves a limited amount of real flesh, protects the brain coating, and cannot create mass. A strand caught on a solid or stretched beyond its limit breaks; disconnected living flesh becomes green after 2.5 seconds.

**Empty Basin** returns to the shedding setup. Approach the rim, hold F to leave flesh behind, and let the conical floor drain it onto the weight plate. At 48 particles the gate rises; it releases below 36. Move around the basin and under the gate while the deposit holds it open. Shedding preserves the brain and its 16 coating particles. Loose flesh becomes green and can be collected again after it separates. Absorption pauses while shedding; a release that stays touching the body can rejoin after a 1.2-second grace period. Reconnecting a broken living fragment before its 2.5-second deadline keeps it alive.

**Puddle Field** has twelve separate small pools to absorb. **Growth** starts with the same tiny body facing a steady drip. **Low Gap** starts with a full body facing a low, roofed passage: the brain lowers before entering, stays under the roof with its particle coating, and draws the flesh through. The gap readout counts flesh that has fully passed the far edge. These are interactive material studies rather than scored levels.

## Develop, test, and publish

Requires Node.js 20.19+ and npm. From this directory:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5180 --strictPort
```

Open `http://127.0.0.1:5180/puddle-study/`.

```sh
npm test
npm run build
npm run preview -- --port 5181
```

The tests cover particle coating and connected mass, absorption, grown-body
contraction and release, screen-relative controls, Low Gap passage, shedding,
pressure switches, and tendril retrieval. The
simulation tests can take several minutes.

The build replaces **only** `../../public/puddle-study/`. Preview it at
`http://127.0.0.1:5181/puddle-study/`, or serve the repository's `public/`
directory through its Caddy configuration. Commit editable source and the
rebuilt `public/puddle-study/` together. The deployed route is `/puddle-study/`;
the existing artifact service publishes the checked-in build after merge.

All JavaScript, fonts, and styles are served from the artifact's own origin.
There are no accounts, backend calls, Portal cookies, or external font requests.
Caddy applies public-asset CORS headers only to `/puddle-study/`, allowing ES
modules and fonts to load inside Portal's `sandbox="allow-scripts"` iframe.
Three.js and font licenses are included in `public/licenses/` here and copied
to `/puddle-study/licenses/` by the build. Font packages are locked alongside
the original study's Three.js and Vite versions.

## Controls

- WASD, arrow keys, or the touch pad: move the brain. The other particles follow through local forces.
- Click/tap the board or press E at the pointer aim: cast one tendril in the Tendrils test. Hold Space to retrieve it; releasing Space pauses retrieval. **Retrieval Setup** refills the practice basin using the same total particle budget.
- Hold Space or **Hold to contract** without a tendril: gather the material into a mound; release to flatten. Near the Low Gap, the brain's rise is limited by the roof.
- Hold F or **Hold to shed** in Tendrils: release flesh locally, reducing body mass and power. Release to stop. Shedding takes priority over contraction.
- Shift or **Push harder**: faster movement.
- **Ooze Forward** in Low Gap: move right automatically. Press again to stop. It also stops after the brain and at least 90% of the flesh pass the roof.
- R: reset the active setup. P: show or hide individual particles.
- Cohesion and viscosity sliders tune the material. S/M/L body sizes are available in Low Gap.

The simulation is deliberately approximate. Particle spacing and a 48-cell Marching Cubes field limit fine surface detail; the surface refreshes every third render frame. Attraction cannot pass through solids, and distant fragments can take time to rejoin.

The tendril is an actively driven arrangement of the fluid particles with short elastic neighbor constraints, not a separate decorative rope. Contact claims loose flesh through the same particle graph as ordinary absorption. Retraction guides acquired material along the strand while solid collision and the sloped floor still resolve every particle. This prototype uses one strand at a time.

## Background music

**Soft Signal** is the demo soundtrack: the approved 87-second, 88 BPM full-song mix, including the wordless bridge and guitar solo. Tap **Music Off** to enable looping playback; the level starts at 25%. Playback pauses while the page is hidden and continues on return. Resetting the material or switching studies does not restart the song.

`public/audio/soft-signal.mp3` is encoded at 192 kbps from `soft-signal-surreal-explore-88bpm.wav`. The editable original Web Audio composition and listening/export app are preserved in `music-source/`. Gameplay mood variations remain available in that authoring app; the demo uses the approved Exploring mix.

## Link preview

The HTML includes static Open Graph and large-image Twitter card tags with absolute production URLs. `public/puddle-social-v1.png` is the 1734 × 907 illustrated cover, generated with built-in image_gen. The exact prompt and provenance are recorded in `art/social-card-generation.txt`. The artwork is concept cover art, not a gameplay screenshot.
