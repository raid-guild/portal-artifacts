# RaidGuild: The Last Mile source and build provenance

This directory is the editable source for the checked-in production build at
`../../public/rg-tlm-game/`. It was imported from the canonical source repository:

- Repository: <https://github.com/raid-guild/rg-tlm-game>
- Source commit: `e40e2acd5315db9ceed5517be7eff494874143be`
- Source tree: `b237f6596136abf231598080db32fa4a1e83b18c`
- Package: `raid-guild-the-last-mile@0.1.0`
- Runtime: Node.js 22

The imported source retains the original package lock, tests, gameplay modules,
and production documentation. The generated PNG masters are preserved byte for
byte in `original-art/`; exact prompts and source records are in
`source-records/art/`. The production directory uses reviewed WebP derivatives.

Read [SCENE_GENERATION_GUIDE.md](SCENE_GENERATION_GUIDE.md) before proposing a
new scene or chapter. Optimization measurements and derivative settings are in
[OPTIMIZATION.md](OPTIMIZATION.md).

Install, test, and rebuild:

```sh
npm ci
npm test
npm run build -- \
  --base=/rg-tlm-game/ \
  --outDir=dist-railway \
  --emptyOutDir
```

The `public/art` symlink points to the checked-in optimized artwork, so the build
copies the same reviewed derivatives. After a successful build, copy the two
HTML files and generated `assets/` directory from `dist-railway/` to
`../../public/rg-tlm-game/`. Do not replace the deployed path with a root-base
build.

The hosted source removes the Google Fonts import so it remains compatible with
the shared CSP, points the favicon at approved game art, loads WebP artwork, and
defers the inactive scene backgrounds until play begins. Gameplay and the
save key remain stable; version-1 and version-2 saves migrate into the validated
version-3 schema without losing prior chapter progress.

The Workshop added for request #2866 is specified in
[`docs/WORKSHOP.md`](docs/WORKSHOP.md). Its production master, exact edit prompt,
runtime derivative, migration notes, interaction map, and QA contract are kept
beside the earlier chapter records.

The Archive prop revision for request #2929 preserves its approved transparent
PNG master in `original-art/` and uses three quality-90 WebP crops in the public
artifact. The source prompt, request-artifact provenance, crop rectangles, and
hashes are recorded in `source-records/art/cypherpunk-archive-props-v1.json`.

The focused Cypherpunk Archive ROT room added for request #2914 is specified in
[`docs/ARCHIVE.md`](docs/ARCHIVE.md). It preserves the existing art and runtime,
adds a code-authored Archive annex and one decoder, and records the exact
upstream inspiration commit used for its Caesar logic and interaction pattern.

The game is static and browser-local. It does not use Portal credentials,
cookies, private APIs, wallet access, a backend, or a database.
