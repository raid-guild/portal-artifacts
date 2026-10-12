# NEON DROP — Built by RaidGuild
Local Three.js / Rapier arcade roguelite. No real money. The official RaidGuild stamp is reused from the portal-artifacts brand asset.

## Develop and build
Node 22 recommended. `npm ci`, `npm test`, `npm run dev -- --host 127.0.0.1`, `npm run build`.
Vite uses relative assets; copy dist contents to `public/neon-drop/`. Source belongs in `studies/neon-drop/`.
Keep public/artifact-social-v1.png when rebuilding. It is a composed gameplay screenshot, not concept art.
Dependency licenses are in licenses/. No external runtime fonts or scripts are needed.
Blender decoration is in public/assets/arcade-crest.glb, reproducible via scripts/make_crest.py.

## Cabinets and Overdrive
Clear the four rounds to bank your completion bonus, then cash out or enter
Overdrive. Overdrive keeps the current build, raises targets by 25% each round,
and offers repeatable Voltage amplifier (+20% ordinary tickets), Reactor charge
(+15 jackpot charge per ordinary score), and Overflow hopper (+2 starting drops
per round). These stack within the run, never become permanent power. Cash out
from Settings at any time during Overdrive. Completion rewards are banked once;
subsequent Overdrive scores bank only the additional chips and tickets, so ending
or leaving cannot take earned rewards away. Repeated checkpoint banking cannot
pay the same reward twice. Active runs themselves are not resumed after reload.

Workshop → CABINETS unlocks Double Trouble for 200 chips and selects the next-run
cabinet. Its real counter-rotating upper deck feeds balls through nine transfer
gates to the lower prize deck. Transfer gates charge a ball once (+25% ordinary
pocket payout); they award no tickets or free turns themselves. Its transparent
plate keeps the lower deck visible. Ball recovery timeout is 30 seconds here
versus 18 in Classic. Each cabinet saves its own best ticket total and deepest
round. Arcade Challenge always uses Classic with its existing fixed rules.

## Roguelite balance and permanent power
Each round has its own ticket target: 180, 540, 1,000, then 1,800.
Circuit chips from finished runs buy three levelled Workshop powers: +2% ordinary
pocket tickets per amplifier level (8 levels), +1 starting drop per round per
reserve level (3 levels), and +10 jackpot base per coil level (6 levels). Prices
start at 30 / 120 / 45 chips respectively and rise with each level. The full
ladder costs 3,550 chips; the bonuses cap at +16% tickets, +3 drops and +60 jackpot. Power is saved with the existing v2 save key, so old saves
keep their chips, balls and cosmetics and begin with zero power levels. Saved
levels are clamped to their caps. Purchases affect the next run; the current run
keeps its starting snapshot. The reserve run mutation adds another four drops.
On each new round, the jackpot rises to at least its round base without erasing
a larger charged value. Arcade Challenge uses separate fixed scoring rules.

Run `npm run sim:economy` for a repeatable ticket-economy sensitivity check.
It uses the production pockets and state functions with seeded random pocket
selections. The outer x2 and equal-pocket profiles are assumptions about where
balls land; they do not model Rapier physics, misses, or ball correlations and
must not be read as physical win-rate forecasts.

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

## Small screens
Phones and short landscape screens keep tickets, target, drops, jackpot, and
progress in a compact top strip. The bottom controls keep ball selection, a large
Drop button, queue status, and Workshop within thumb reach. Settings also holds
radio controls, auto drop, Arcade Challenge, current build and prize details,
and the RaidGuild stamp. Modals scroll within the safe viewport area.

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
