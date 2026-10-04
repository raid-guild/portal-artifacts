# Raid Survivor Portal artifact

Build with Node 22+ using `npm ci && npm run build`. Vite emits the deployable
site to `../../public/raid-survivor/` with base path `/raid-survivor/`.
`npm test` runs the build, game simulation, and approved music tests. Fonts are
self-hosted through Fontsource; art attribution is in `ATTRIBUTION.md`.

Portal-ranked play uses the same-origin `/leaderboard-api/raid-survivor` API.
Standalone and sandboxed visitors can play as guests, and every rankable run
saves its score locally. Launch through Portal to acquire a ranked session.
No standalone Node server or local auth store is deployed with this game.

## Music

Each realm has its own 64-bar Web Audio loop: Vault Runner (Guild Training,
130 BPM), Thornlight Pursuit (Haunted Forest, 126 BPM), Sunken Caravan (Desert
Oasis, 132 BPM), and Shards of Dawn (Frozen Highlands, 128 BPM). Vault Runner
retains the approved composition and its original standalone test at
`public/music-test.html`. The other three tracks share a synth engine but have
separate harmony, bass, drums, melody, ambience, and four-act arrangements.
Music starts after a player gesture; selecting a realm alone does not start it.
Settings keep the same music volume and mute preference across realms. Runs
restarted in the same realm continue the loop, while a realm change fades the
old track before starting the new one. Use `/raid-survivor/realm-music.html` to
audition each loop and run an offline four-bar boundary check.

## Four realms and mastery

Each run starts in a selected realm and ends on death or when banked. Surviving
three active minutes in Guild Training unlocks Haunted Forest. Forest's five
minute milestone unlocks Desert Oasis; Desert's seven minute milestone unlocks
Frozen Highlands. Ice has a nine minute mastery milestone. Each class can earn
four credits, one from each realm's first milestone. Vitality, Agility, and Bomb
Recharge have two ranks each; every rank costs one credit and grants +5%
starting health, +3% movement speed, or 5% faster bomb recharge. Skills are
captured at run start and never alter an active run. The 12-minute clear and
endless mode work independently in every realm.

The Monster Book tracks Rageipede #315, Xorn #3421, Efreeti #8883, Deathwisp
#1201, Buraq #83, Chuul #9189, and Dogmole #8965 from
Ethereum mainnet contract `0xecb9b2ea457740fbde58c758e4c574834224413e`.
Their original on-chain traits are curated into the game; the book distinguishes
source text from game behavior. Encountering, defeating five, discovering an
elemental counter, then defeating 25 with a counter kill progressively reveals
their sheets. The Mountain creatures Chuul and Dogmole are adapted to Frozen
Highlands; their canonical names and metadata are retained. Forest opens with
Dawn Rune (Light) or Frost Rune (Freeze); Desert opens with Dawn Rune, Bomb
Dynamo, or healing; Ice opens with Ember Rune (Flames), Bomb Dynamo, or healing.
Guest progression remains on this
device. Portal progression is stored in PostgreSQL and uses a separate account
profile; guests are not automatically merged. Portal ranked finishes retry from
an account-specific local outbox if the connection drops.

The global, four per-realm, and legacy leaderboards rank individual runs. All
realms use the same scoring formula. Legacy contains pre-expansion scores.

On touch screens, drag and hold anywhere on the playfield to steer continuously.
A joystick ring follows the hero; steering is relative to the original finger
grab, so a stationary held finger keeps moving. Release or return to the small
deadzone to stop. Bomb and Dash
sit along the bottom edge, with Backpack above them. Manual touch aim remains
an optional separate stick in Settings. Keyboard movement and mouse aim remain
available on desktop.

Vault blessings: elite enemies have a 30% chest chance, elite brutes 45%, and
regular brutes 8%, when the 45-second chest cooldown is ready and no chest is
already waiting. Moloch always drops a chest, bypassing those restrictions.

## Balance and late encounters

In Guild Training, the first 45 seconds ramp enemy arrivals from 1.2× the normal interval to the
normal interval; the opening group is 18. Ordinary enemy contact and projectile
damage ramp from 85% to 100% over the first minute. Enemies close to useful
attack distances instead of stopping far from the player.

At 2:00, elite brutes become Juggernauts: a fixed lane warns for 0.9 seconds,
then charges for 0.55 seconds and recovers for 0.65 seconds. At 3:00, elite
cultists become Hexcasters: they fix a ground mark for 1.2 seconds. These
variants have 6× and 7× their respective elite HP so a representative evolved
three-weapon build sees their first warning. Earlier elites and ordinary enemy
HP are unchanged. At 6:00 and 9:00, later Moloch tiers add fixed ground marks
and elite escorts. Escorts replace upcoming ordinary spawns. Warning hazards
(maximum 12) are independent of cosmetic effects; enemy shots cap at 280.

Haunted Forest has its own five-minute ramp:

- Start with 12 Rageipedes. Natural spawns in the first minute are 95% Rageipedes
  and 5% wisps; regular brutes join after 1:00.
- Pounces unlock at 1:30. Xorn arrives at 2:00 and learns its lunge at 2:30.
  Efreeti arrives at 3:30. Elite brute charges unlock at 4:00.
- All pounces and brute/Xorn lunges share a budget: one active warning/charge
  before 3:00, two before 5:00, then three. Starts are at least 0.4 seconds apart.
  Pounces warn for 0.9 seconds; Xorn warns for 1.1 seconds, with longer recovery
  and cooldowns than the original Forest tuning.
- Natural Xorn caps rise from two at 2:00 to four at 3:00 and six at 4:00.
  Efreeti caps rise from one at 3:30 to two at 4:30 and three at 5:00.
- An elite brute guardian arrives every 60 seconds, with at most two living
  guardians. Those spawned before 4:00 retain ordinary elite HP; later ones
  receive the Juggernaut HP multiplier. Natural elite promotion begins at 2:00
  at 1%, limited to Rageipedes and brutes.
- Moloch first arrives at 4:00, then every two minutes. Its 6:00 and 9:00 tier
  thresholds remain unchanged (the first tier-three Forest arrival is 10:00).
- Regular population targets are 114 at 1:00, 282 at 3:00, and 450 at 5:00.
  Spawn intervals gradually shrink from 0.5 to 0.16 seconds, with batches of
  one/two/three beginning at 0:00/2:00/4:00. Guardians and bosses can exceed the
  regular target, while still respecting the global entity cap.
- Non-boss damage is captured at spawn time, rising from 65% to 100% over three
  minutes, including special attacks. XP and scoring formulas are unchanged.

These are initial tuning targets, not a guarantee that every build can survive
five minutes; playtesting should track time-to-first-upgrade and death times.

Desert Oasis and Frozen Highlands stretch the Forest population and damage
ramp across their seven and nine minute milestones. Both begin with 32 basic
monsters and have a larger early horde that returns to the native population
curve by six minutes. Ordinary ranged Cultists join at 20 seconds, then grow
from one to six alive by four minutes; replacements arrive no faster than one
every eight seconds. Both realms introduce rare large monsters after the equivalent of three Forest
minutes. Deathwisps warn before a pounce; Buraq hover and warn before a green
poison fan. Chuul use a short, locked ethereal step; Dogmoles close in and mark
a circular Groundbreaker strike. Large attacks start later, share a small
concurrency budget with basic special attacks and elite guardians, and use
fixed warnings that remain visible with reduced motion. Moloch arrives at the
equivalent of four Forest minutes, then every two paced minutes. Its first
appearance stays tier one in both longer realms. Desert's Light and bomb Noise
counters, and Ice's Flames and physical weapon counters, grant 25% bonus damage
and count toward the Monster Book. The bomb is a Noise and Physical counter for
all three heroes. Committed terrain and monster images are optimized to 512
and 256 pixels respectively; only the selected realm's monster meshes load.

Desert Oasis now has ten fixed, shallow pools. Ground heroes and enemies move
around the water, while hovering Wisps, Buraq, and Efreeti can cross it.
Projectiles pass over pools. Frozen Highlands has ten fixed ice walls that
block movement, charges, ethereal steps, and projectiles. A target in front
of a wall can still be hit; piercing shots stop at the wall. Storm Coil,
arc splashes, thorn links, and orbit blades need a clear line through the ice.
Bomb waves, Falling Stars, warned ground attacks, and pickup magnetism ignore
cover. Drops from flying enemies over a pool or wall are placed on reachable
ground. The obstacles are on the minimap and have no collision in Training or
Haunted Forest. `node scripts/obstacle-benchmark.mjs` compares an identical
crowd near the Ice wall with terrain on and off at 1,000 and 2,400 enemies.

The tuning values live near the encounter logic in `src/game.ts`; HUD clock
layout lives in `src/style.css`. Run `npm test` for simulation and music checks,
then `npm run benchmark` for horde and mixed late encounter timings. The mixed
benchmark is bounded and does not represent a full twelve-minute playthrough
or all player builds. In a development preview, `__raidDebug.setupLateEncounter`
accepts `juggernaut`, `hexcaster`, `ascended`, or `unbound`; `stepDemo(seconds)`
advances fixed simulation time while keeping the encounter paused.

## Mobile rendering

Graphics defaults to Auto: coarse-pointer devices use Performance rendering.
Settings can explicitly select Performance or Full, and the choice is saved.
Performance uses 1× buffers for both WebGL and canvas effects and omits per-object
blurred glow; all projectile cores, explosions, rewards, and warning geometry
remain. Full uses up to 1.7× WebGL and 2× effects resolution with glows.

Presentation is capped at 60 draws/second independently of the existing 60Hz
simulation. The minimap updates at 10Hz, weapon HUD markup only changes with the
loadout, and instanced enemy transfers contain only visible instances. Effects
outside the viewport are skipped with conservative bounds. No enemy caps,
spawns, damage, collision rules, or ranked scoring change with graphics quality.

`tests/render-policy.test.mjs` covers resolution selection, render cadence at
30/60/90/120/144Hz, and GPU transfer ranges through visible-count changes. Node
simulation benchmarks do not measure a phone's GPU or sustained thermal behavior;
actual Pixel 8 frame rate still needs an on-device playtest.
