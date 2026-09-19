# RaidGuild: The Last Mile build provenance

The checked-in production build at `public/rg-tlm-game/` comes from the
canonical source repository:

- Repository: <https://github.com/raid-guild/rg-tlm-game>
- Source commit: `e40e2acd5315db9ceed5517be7eff494874143be`
- Source tree: `b237f6596136abf231598080db32fa4a1e83b18c`
- Package: `raid-guild-the-last-mile@0.1.0`
- Runtime: Node.js 22

Rebuild from a clean checkout of that exact commit:

```sh
npm ci --include=dev
npm test
git apply /path/to/portal-artifacts/studies/rg-tlm-game/portal-artifacts.patch
npm run build -- \
  --base=/rg-tlm-game/ \
  --outDir=/path/to/portal-artifacts/public/rg-tlm-game \
  --emptyOutDir
```

The explicit Vite base keeps scripts, styles, and artwork under the durable
`/rg-tlm-game/` host path. Do not build with the source repository's default
root base for publication here.

The small distribution patch removes the Google Fonts import so the game uses
its declared system fallbacks and remains fully compatible with the shared
host's restrictive CSP. It also points the favicon at existing approved game
art so browsers do not request a missing host-root icon. It does not alter game
behavior or introduce new assets.

The game is static and browser-local. It does not use Portal credentials,
cookies, private APIs, wallet access, a backend, or a database.
