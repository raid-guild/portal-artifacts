# Portal Artifacts

A local, standalone portal animation prototype for RaidGuild. Procedural Canvas 2D: irregular luminous filaments, drifting interior light, tangential sparks with gravity, hover energy, and a click-through transition. A generated mountain-valley image sits inside the portal, with live blur, drifting motion, hover clarity, and a forward zoom on entry. The image is bundled locally; no external fonts or media services are needed at runtime.

## Run

Use Node.js 22.13 or newer, then run from this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by the server. The initial preview runs at http://localhost:3000/.

## Explore

- Pink (#ee3d79), Lime (#d7e34e), Ice (#b9e0df), and Cream (#efe9d7) color presets sampled from the supplied palette. Deep teal (#102d2c) and navy (#191e4e) ground the stage.
- Mix preset blends pink, lime, ice, and cream around the rotating rim; escaping sparks retain their emission color.
- Energy, flow speed, size (50–120%), and elongation controls. Size scales the rim, destination, and interaction area together.
- Hover or focus the portal to energize it and bring the destination into clearer focus; click or press Enter to move toward the landscape. The scene drifts subtly at rest, with all image motion suppressed for reduced-motion preferences.
- Replay the opening, pause the animation, or hide the controls.
- Respects reduced-motion preferences; the Play button opts into animation.

## Source

- `app/page.tsx`: portal renderer and prototype controls. The `Portal` component is the extraction point for integration into another React page.
- `app/globals.css`: stage and control styling.
- `public/destination-valley.png`: locally bundled destination artwork.
- `DESTINATION-PROMPT.md`: image generation provenance and prompt.

This is an animation study, not a video export or final integration. Click-through currently reopens the same portal rather than navigating. Particle density is capped and canvas resolution is limited to 2× device scale; target-device performance still needs browser testing.

## Checks

```sh
npx tsc --noEmit
npm run build
```

## Railway deployment

Railway uses the multi-stage `Dockerfile`: Node 22 builds the static React entry in `railway/`, then Nginx serves it on Railway's `PORT`. The entry reuses the same portal component and styles as the local preview. `railway.json` configures `/health` as the deployment health check. No application secrets or runtime API services are required.

```sh
npm run build:railway
railway up --detach
```

The local Vinext preview remains available through `npm run dev`. Source is committed locally; a GitHub remote is not required for Railway CLI deployments.
