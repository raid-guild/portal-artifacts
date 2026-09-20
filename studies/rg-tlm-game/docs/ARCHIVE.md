# Chapter four: The Cypherpunk Archive

## Chapter brief

After the traveler earns a place at the Workshop table, a lantern mark reveals
the Archive annex. One brass ROT/Caesar ring decodes one sealed message:
`ZLUK AOL SHUALYU` → **SEND THE LANTERN** at ROT 07. The signal lantern then
reveals the route toward **The First Raid**. Target playtime is 3–5 minutes.

The room has no text entry, timer, consumable item, separate collectible,
additional cipher layer, backend, account, wallet, or network dependency.

## Interaction and recovery

```text
Workshop joined
  -> Archive door revealed
  -> inspect history note / decoder / lantern in any order
  -> rotate the ring from 00 through 25
  -> live plaintext preview updates
  -> check the signal
     -> wrong: state is preserved and the hint path advances
     -> ROT 07: lantern opens and reveals The First Raid
```

The central ring advances on pointer or touch activation. The adjacent 44px
controls turn backward and forward. When the ring itself has focus, Left Arrow
and Right Arrow turn it in either direction. A horizontal pointer swipe on the
ring also turns it one position. Reduced-motion mode removes the short ring
transition without changing state or access.

Wrong checks increment a bounded attempt counter but never move the ring or
consume an opportunity. The first hint explains fixed shifts, the second notes
that the first word has four letters, and the final hint reveals ROT 07. The
Workshop door remains available, so the player cannot be trapped.

## Historical note

The short station note names Eric Hughes’s 1993 *A Cypherpunk’s Manifesto* and
its practical emphasis, including the three-word line “Cypherpunks write code.”
It explicitly says the toy Caesar shift is not secure and frames it as an
interaction about turning privacy ideas into usable systems, not secrecy by
obscurity.

The Caesar helper and live-preview interaction were adapted from
[`raid-guild/forge-Cypherpunk-Archive`](https://github.com/raid-guild/forge-Cypherpunk-Archive)
at commit `b031494b5c0e81cca1c56d082f70d366ca5670d6`. Its backend,
authentication, daily challenge, leaderboard, database, multi-station flow,
and other cipher layers were not imported.

## Save schema and migration

The storage key remains `raidguild:last-mile:room-one`. Version 4 adds:

```text
archive.shift: integer 0–25
archive.attempts: integer 0–25
archive.solved: boolean (true only when shift is 7)
```

Versions 1–3 migrate to version 4. Prior chapter state is preserved and the
Archive starts unsolved at ROT 00. A valid Archive-room save also requires the
Workshop raid to be assembled and joined. Position, continuity, and prior-room
invariants remain validated.

## Acceptance checklist

- [x] Exact plaintext and ROT behavior have focused unit coverage.
- [x] Wrong checks, progressive hints, wraparound, completion, repeat actions,
  room return, save round-trip, v3 migration, and impossible saves are covered.
- [x] Desktop, portrait mobile, reduced motion, keyboard, pointer/touch-sized
  controls, direct route, and Portal-style sandboxed iframe paths are covered.
- [x] Editable source and generated `/rg-tlm-game/` output are synchronized.
- [x] No host policy, infrastructure, unrelated artifact, or Portal launcher is
  changed by this implementation.
- [ ] Independent verification and review of the committed candidate remain for
  the next workflow steps.
