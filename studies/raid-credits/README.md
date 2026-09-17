# Raid Credits

Editable source for the public Raid Credits Portal module. The published build
lives at `public/raid-credits/`.

## Build and check

From the repository root:

```sh
node studies/raid-credits/build.mjs
node studies/raid-credits/check.mjs
```

The module is intentionally static and unauthenticated. Party selections are
local URL state only; no member endpoint, wallet library, contract integration,
transaction path, Portal credential, or private API is used.

## Source assets

The following assets were copied without modification from
`raid-guild/raid-credits` at commit
`0c5cff2d235d4b93dcec861338f7f5628f518bb9`:

- `public/animation/RaidGuild1.mp4` → `assets/raidguild.mp4`
- `public/animation/Voyager.ogg` → `assets/voyager.ogg`
- `src/assets/warrior_v0.png` → `assets/rainbow-warrior.png`

The source repository is preserved as historical project provenance. The
Rainbow Warrior artwork is presented only as inactive historical context;
there is no mint or donation action in this edition.
