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
Oasis, 132 BPM), Shards of Dawn (Frozen Highlands, 128 BPM), and Molten Crown
(Molten Vault, 104 BPM). Vault Runner
retains the approved composition and its original standalone test at
`public/music-test.html`. The other four tracks share a synth engine but have
separate harmony, bass, drums, melody, ambience, and four-act arrangements.
Molten Crown uses a sparse C Phrygian and diminished palette, a low heartbeat,
slow pads, descending phrases, and filtered echoes across Ash Gate, Hollow
Furnace, Moloch's Shadow, and Final Descent.
Music starts after a player gesture; selecting a realm alone does not start it.
Settings keep the same music volume and mute preference across realms. Runs
restarted in the same realm continue the loop, while a realm change fades the
old track before starting the new one. Use `/raid-survivor/realm-music.html` to
audition each loop and run an offline four-bar boundary check.

## Checkpoint progression

Each run starts in one selected realm. Five heroes can be selected from a roster:
Ranger, Wizard, Dwarf, Warrior, and Tavern Keeper. Warrior unlocks after the
Training 05:00 checkpoint; Tavern Keeper after Forest 07:00. Molten Vault stays
hidden until Ice 09:00.

The next unclaimed checkpoint for that hero and realm is fixed when a run starts.
Reaching it banks one class skill credit immediately; even a 12-minute first
run awards only its first eligible checkpoint. The next target requires a new
run. Checkpoint ladders are Training 03:00/05:00/07:00/09:00/12:00, Forest
05:00/07:00/09:00/12:00, Desert 07:00/09:00/12:00, Ice 09:00/12:00, and
Molten Vault 12:00. Training 03:00 unlocks Forest; Forest 05:00 unlocks
Desert; Desert 07:00 unlocks Ice. A claimed 12:00 target masters that realm
for the hero; Molten Vault 12:00 grants class mastery. Surviving 12 minutes
allows score banking or endless play regardless of the current checkpoint.

Vitality, Agility, and Bomb Recharge retain two ranks at one credit per rank,
granting +5% starting health, +3% speed, or 5% faster bomb recharge. Each
hero also has three perks at three credits each; one purchased perk can be
equipped per run. Skills, perk, and checkpoint target are snapshotted at run
start and never change during active play.

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
an account-specific local outbox if the connection drops. Temporary checkpoint
failures retry with the newest cumulative snapshot; a successful finish returns
the saved profile immediately. If Portal identity is linked but the profile
service fails, known progress stays visible. If starting a ranked run fails,
the run is clearly marked as practice: its local score is retained, but unlocks
and mastery are not saved to Portal or guest storage.

The global, five per-realm, earlier v2, and original v1 leaderboards rank
individual runs. All realms use the same scoring formula. Local records are
kept separately by version so earlier scores remain accessible.

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
Up to two offscreen Vault Blessings get direction arrows along the visible
playfield border; the arrows move around the timer, HUD, and touch controls.

Ordinary pink-bullet Cultists enter Training and Forest after 30 seconds, and
Desert and Ice after 20 seconds. Their small standing population keeps movement
useful as weapons grow. Training, Forest, Desert, and Ice receive a final extra
Moloch at 11:00. Lava has its own staged Moloch assault described below. At
12:00, the run reaches its clear; players can bank score or continue
in endless mode. A clear only awards 12-minute mastery when that checkpoint was
the run's fixed target.

## Balance and late encounters

In Guild Training, the first 45 seconds ramp enemy arrivals from 1.2× the normal interval to the
normal interval; the opening group is 18. Ordinary enemy contact and projectile
damage ramp from 85% to 100% over the first minute. Enemies close to useful
attack distances instead of stopping far from the player.

At 2:00, elite brutes become Juggernauts: a fixed lane warns for 0.9 seconds,
then charges for 0.55 seconds and recovers for 0.65 seconds. At 3:00, elite
cultists become Hexcasters: they fix a ground mark for 1.2 seconds. These
Training variants have 6× and 7× their respective elite HP so a representative
evolved three-weapon build sees their first warning. Juggernaut extra HP in
later realms rises from 1× to 6× between three and five paced minutes.
Ordinary enemy HP is unchanged. At 6:00 and 9:00, later Moloch tiers add fixed ground marks
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
all five heroes. Committed terrain and monster images are optimized to 512
and 256 pixels respectively; only the selected realm's monster meshes load.

Thornbow keeps its volley size, piercing, and fire cadence at every rank.
Ranks four and five deal 30 and 32 damage per arrow. A rank-five arrow sends
one small burst from its first hit to at most three nearby foes; later piercing
hits do not repeat it. Ranger bomb fragments remain separate from this burst.
Storm Coil's rank-five collateral hits each nearby foe at most once per cast.
Frost counters can interrupt a warning, and elite brute health ramps smoothly
through the middle minutes. The seeded before/after checks are in
[BALANCE-QA.md](BALANCE-QA.md).

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

Lava's native swarm is Tosculi. Sea Hags enter after 0:45 and warn for one
second before a locked five-shot fan; Hezrou enter after 3:00 and mark a locked
nine-unit lane for 1.1 seconds before a single blast. Frost counters Tosculi
and Sea Hags, while Dawn counters Hezrou. Lava's Moloch waves begin at 5:00,
then grow at 8:00, 10:00, and 11:00. At 11:00, up to three can be alive together;
survivors become tier three without resetting their health fraction. Endless
mode keeps a three-boss ceiling and adds a wave every two minutes.
After the 12:00 clear decision in any realm, banking ends the run safely.
Continuing into Endless summons the Nightman outside the current view. A
2.5-second warning precedes his chase; he floats through terrain, cannot be
damaged, and kills on one touch even during a dash or damage guard. His speed
scales with the current walk build and rises from 0.55× at 12:00 to 3.8× at
15:00. He has no enemy slot, drops, Monster Book entry, or score bonus. The
development-only `nightman-qa.html` previews the decision and chase.
Lava Moloch keeps its 22-damage marks and 3.2-second attack interval before
9:00. At 9:00 its locked marks deal 75 with a 2.8-second interval; at 10:00
the interval becomes 2.6 seconds; at 11:00 marks deal 80 and the interval
becomes 2.4 seconds. Existing 1.25/1.4-second warnings, mark counts, and
hazard cap remain in place. The development-only `lava-qa.html` page has buttons for the three native threats
and boss group; it is not included in the production build. Original MonsterMaps
sheet text remains separate from these adapted combat moves. The committed
canonical sheet was exported previously at block 26114270; a fresh RPC check
was unavailable during this pass.

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

### Primary weapon visuals

Primary projectiles have distinct silhouettes: arrows, violet arc bolts, rune pellets, and spinning Tavern Keeper mugs. The Warrior uses a directional cleaver crescent; mugs leave a brief splash. Damage, collision, lifetimes, projectile counts, and attack timing are unchanged. Reduced motion disables mug spin. Full mode caches a small atlas and 32 directions at renderer construction; performance mode draws cheaper shapes for dense volleys while retaining the mug image. Both caches are released with the renderer.

Generated mug artwork lives in `public/sprites/weapons/tankard.png`; `weapon-art-prompt.json` records the ImageGen prompt and provenance. No image service is called during play.

Dwarf now starts with Rune Axes; Runic Scattergun remains a separate pickup.
Each volley fires three 13-unit/second axes (five at rank five) that turn
inward as they fly. Damage rises from 24 to 36, flight life from 0.68 to
0.84 seconds, and ranks three onward pierce one extra target. The existing
`dwarf-scatter-mastery` saved perk ID displays as Rune Mastery and applies to
the new primary weapon. The development weapon gallery shows real rank-one
and rank-five curved volleys alongside the other weapon art.

Development-only `/raid-survivor/weapon-qa.html` provides a gallery, 650-projectile stress view, reduced-motion controls, and an old/new draw comparison. It is excluded from the production build. The comparison includes synchronous canvas readback and measures desktop-browser drawing, not device FPS. A 388px-wide test with 650 shots (12 mugs) measured 3.2ms old / 10.9ms new median with performance mode; full-mode testing at 1080px measured 9.7ms old / 8.1ms new. These stress results show that cosmetic cost remains material at the projectile cap; validate real late-game play on Pixel 8 before claiming equal mobile performance.

Validation: all 16 client test files pass, including sprite classification/cache/disposal/reduced-motion tests. A seeded before/after comparison across all five heroes at weapon ranks 1 and 5 produced identical combat state, random state, and effect counts over 360 simulation ticks.

### Movement presentation

The player and following camera now interpolate between adjacent 60Hz simulation positions using the remaining fixed-step time. The feet ring, orbit/bomb centers and touch joystick use the same displayed position. Camera follow uses exponential smoothing. Pauses, rewards, death and new runs reset presentation history; collisions, movement speed and damage still use the original simulation state. This introduces at most one fixed-step of presentation delay.

Progression snapshots are now cloned only when a periodic save, milestone retry or forced finish is due. Hidden desktop joystick positioning is skipped.

Development-only `/raid-survivor/movement-qa.html` runs the real Tavern Keeper/Lava simulation and renderer with raw/smoothed movement, early/crowded scenes, graphics controls and a one-second warmup followed by an eight-second capture. It is excluded from the production build. Timing measures browser RAF and CPU submission, with no synchronous canvas readback; it does not establish physical-device FPS. The deterministic uneven-frame regression removes 118 repeated positions across 237 measured frames while preserving 7.3 units/second simulation speed. All 17 client test files pass; independent review found no regressions.
