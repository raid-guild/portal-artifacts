# NEON DROP — Built by RaidGuild
Local Three.js / Rapier arcade roguelite. No real money. The official RaidGuild stamp is reused from the portal-artifacts brand asset.

## Develop and build
Node 22 recommended. `npm ci`, `npm test`, `npm run dev -- --host 127.0.0.1`, `npm run build`.
Vite uses relative assets; copy dist contents to `public/neon-drop/`. Source belongs in `studies/neon-drop/`.
Keep public/artifact-social-v1.png when rebuilding. It is a composed gameplay screenshot, not concept art.
Dependency licenses are in licenses/. No external runtime fonts or scripts are needed.
Blender decoration is in public/assets/arcade-crest.glb, reproducible via scripts/make_crest.py.

## Rapid drops and collisions
Rapid clicks reserve casual-mode drops immediately and queue their releases at least
220 ms apart, waiting until the chute clears and no more than nine balls are active.
Balls collide through Rapier and make a distinct pulse and clack on contact. Pending
paid drops are refunded if a round reaches the upgrade choice or play resets; free
echo balls are discarded. Player chips, unlocks and other saved progression persist.

## Arcade Radio
The cabinet has five original, 16-bar synthesized stations: Circuit FM (free),
Midnight Tokens (45 circuits), Chrome Rush (120), Astral Lounge (260), and Boss
Frequency (500). A station purchase is cosmetic and changes no scoring or physics.
The faceplate plays, pauses, tunes owned stations, and controls music volume;
Settings controls arcade tone volume independently and has a master mute.
Workshop keeps a quieter chord bed. LISTEN auditions any full station without a
purchase, then restores the equipped station and previous play state on exit. Audio starts only
after a player gesture; hidden tabs pause and resume from a clean musical beat.
The same Web Audio graph routes the existing arcade tones and ducks music for an
actual jackpot. The seven-bar faceplate animation becomes static with reduced FX.

## Arcade Challenge and points
12 Chrome drops; printed ticket pockets equal points; jackpot is fixed at 150.
Free pockets grant two drops, capped at six bonus drops (18 maximum). One active ball;
a miss or 18-second timeout earns zero. No power upgrades, automation, idle scoring,
or chip rewards. Cosmetics remain available. Best completed run per player; ties
use earlier submission. Guest practice keeps a separate local best.

## Optional Portal ranking
Standalone Portal signed launch uses /leaderboard-api/neon-drop/callback. The
service verifies the token and redirects to a clean URL with an HttpOnly session.
No Portal credentials or launch tokens are stored by game JavaScript. Sandboxed
embeds remain guest-only. Local play works if the API is absent.
The backend derives scores from canonical pocket outcomes, checks drop budgets,
version, duration, ownership and exact retries. This is a casual client-reported
board, not authoritative physics replay or cheat-proof competition.
See services/leaderboards/README.md in portal-artifacts for deployment/setup.
Rules source src/challenge.js is copied verbatim to service src/neon-rules.js;
keep both in sync when incrementing the scoring version.

## Hosting
Do not deploy or upload to OpenAI/Sites. This checkout is for local preview and
explicitly authorized portal-artifacts integration. A repository PR is authorized;
production Portal auth configuration and deployment remain separate.
