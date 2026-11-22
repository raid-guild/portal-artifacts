# Chapter 5: Town on the Hill

**Status:** First playable implementation, November 21, 2026. Balance and wording remain open to playtest.

## Story and access

After the harvest road opens, the Fieldkeeper finds mismatched delivery records. The party travels to an evening market and meets a birdlike Town Crier, inspired by the Field Guide's Bard. The Crier coordinates routes and uses a **Rally Call** to help clear them. The chapter ends with the market open and a clue pointing toward Castle Island; Castle Island is locked until a future chapter. The ending says “More levels coming soon” and retains a return path to Town and the kingdom map.

The first thirty levels remain playable as a guest. Farmland requires its existing free Portal account grant. Town levels 5.1–5.10 require a Portal account, that Farmland grant, and an active Dune Pass from RaidGuild Commerce; the Pass allows a $0 claim. The browser checks access before entry and again at Town attempt preparation and activation, including attempts with zero boosters. The service checks access on checkpoint and paid attempts. An already active Town attempt may finish if Commerce is temporarily unavailable. A missing attempt cannot be synthesized offline. Completed Town levels can be replayed through story locations with verified access and no additional coin reward.

## Delivery crate

- The five existing matching symbols remain unchanged. A crate is a separate, square, nonmatching cargo piece with a finite authored starting count.
- It cannot be swapped or matched. Jets, Flywheels, Prisms, and combinations clear around it without destroying or changing it.
- Gravity moves crates when tiles below clear. The next animation step shows the crate disappear at any bottom edge of the static board mask. A masked cell below is an exit, including on shaped boards. Salt below a crate is support, not an exit.
- A delivery credits one crate goal and is shown by a short fade and an arc toward the goal meter. Delivery does not itself count as a normal tile clear, salt hit, or companion charge.
- If one crate rests on another at an exit, the lower crate leaves first, then the upper one settles and leaves. Both have distinct delivery steps and stable identities.
- Crates never spawn in refills or no-move rescue. The authored initial positions are topward and validated against the mask, salt, and pods.

The first Town level uses a scripted, skippable board tutorial to show clearing beneath a crate, its fall, and its delivery. Later levels combine cargo with familiar salt, seedpods, and collection goals. Power and obstacle tutorials remain available in the existing library.

## Crier's Rally Call

Every twelve matched pennants give two vertical Pressure Jets on eligible ordinary tiles. The Jets stay inert until a player action or an established cascade triggers them. Charge resets and can be earned again in the same attempt. The Crier portrait reacts to charging and firing in the board HUD. Town has a distinct light evening music arrangement and a small wooden delivery sound followed by a chime.

## Level route

| Level | Location | Moves | Authored objective and layout |
| --- | --- | ---: | --- |
| 5.1 | Market Arrival | 22 | 1 crate, square board; delivery tutorial |
| 5.2 | Courier Steps | 24 | 2 crates, square board |
| 5.3 | Terrace Deliveries | 25 | 3 crates, clipped corners |
| 5.4 | Split Market | 26 | 4 crates, twin chambers |
| 5.5 | Salted Storefronts | 27 | 4 crates, 6 salt blocks |
| 5.6 | Awning Lanes | 28 | 5 crates, 8 salt blocks, 2 layered; stepped basin |
| 5.7 | Seed Exchange | 28 | 5 crates, 4 seedpods; clipped corners |
| 5.8 | Neighborhood Rounds | 30 | 6 crates, 4 seedpods, 6 salt blocks, 24 pennants; twin chambers |
| 5.9 | Town Ledger | 30 | 6 crates, 6 seedpods, 8 salt blocks, 2 layered, 30 water; stepped basin |
| 5.10 | Open the Market | 32 | 7 crates, 6 seedpods, 10 salt blocks, 4 layered, 36 pennants; clipped corners |

These are initial authored budgets and goals. Exported playtest stats should guide later tuning; specifically track crates delivered, remaining moves, power use, retries, and no-move rescues. The first forty budgets and seeded opening boards are frozen to their prior release values. New attempts use content version `chapter-5-1`; older move caps remain accepted for legitimate saved attempts.

## Verification priorities

Exercise every exit edge, blocked cargo over salt, stacked crates, a final-move delivery, every power family, and no-move rescue while preserving crate IDs. Test the Town access gate on level preparation, activation with no boosters, checkpoint, repeat finish, replay, and Commerce outage. Check mobile landscape, desktop, reduced motion, and the transition from the Farmland finale through the Town arrival. Source art and sprite provenance are recorded in [ASSETS.md](../ASSETS.md).
