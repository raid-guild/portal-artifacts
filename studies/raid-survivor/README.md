# Raid Survivor Portal artifact

Build with Node 22+ using `npm ci && npm run build`. Vite emits the deployable
site to `../../public/raid-survivor/` with base path `/raid-survivor/`.
`npm test` runs the build, game simulation, and approved music tests. Fonts are
self-hosted through Fontsource; art attribution is in `ATTRIBUTION.md`.

Portal-ranked play uses the same-origin `/leaderboard-api/raid-survivor` API.
Standalone and sandboxed visitors can play as guests, and every rankable run
saves its score locally. Launch through Portal to acquire a ranked session.
No standalone Node server or local auth store is deployed with this game.
