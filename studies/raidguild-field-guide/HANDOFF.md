# Field Guide handoff and provenance

The first brief proposed a small illustrated field guide built as a static Portal
artifact. It began with the joining map and expanded into a 35-page book, a
longform website, interactive illustrations, class selection, and a print proof.
The present source of truth and rebuild commands are in [README.md](README.md).

## Original creative direction

The Guild world combines speculative desert landscapes, a lush castle and moat,
Queen Raida's cloud domain, and Moloch's dark realm. Journey maps, illustrated
machinery, and character classes make the Guild's people, work, resources, and
joining process feel like an RPG field guide. The user approved creative license:
this is a playful work and reference, not a rules system. The web edition uses
selectable classes and graphics; print uses full illustrated spreads and dense
workbook pages.

The earlier [Raid Guild Comics](https://github.com/raid-guild/rg-comix) reader
informed the page navigation, but the static publication has its own renderer.
The current Louchi visual reference is the [RaidGuild illustration guide](https://raidguild-brand-guide-production.up.railway.app/illustrations).

## Content references

- `art/joining-process-source.md` and `art/member-benefits-source.md` are
  handbook snapshots. Current process details belong to the linked live handbook.
- The seven-stage joining map distinguishes cohort graduation from full
  membership. LLC registration and light KYC are a separate step before paid
  Raid compensation, not a gate to Guild membership.
- The 2019 Odyssy and MetaCartel context, members, and community projects are
  credited in the publication and its source links. The member roll in
  `content/member-credits.json` is a dated public-profile snapshot.
- `art/joining-map-generation.txt`, `art/kingdom-source.md`,
  `art/social-card-source.md`, and `design/louchi-art-prompts.md` record art
  prompts and first-party source context. The work-in-progress screenshots used
  to discuss the Guild world are not published as assets.

## Deployment boundary

The editable study is `studies/raidguild-field-guide/`. Running `node build.mjs`
rebuilds `public/raidguild-field-guide/`; the public path is intended for the
existing Portal Artifacts Caddy service at
`https://portal-artifacts-production.up.railway.app/raidguild-field-guide/`.
Do not introduce Portal credentials, cookies, or private API calls into the
static artifact. The site's HTML includes first-load social metadata and all
runtime fonts, images, and JavaScript are served from the artifact path.

The published print PDF is an approved review proof. Rebuild commands create
new files in a separate directory so they do not replace that proof implicitly.
The 11 × 17 ledger format is pre-imposed for nine duplex sheets, short-edge flip.
