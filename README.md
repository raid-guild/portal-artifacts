# RaidGuild Portal Artifacts

Static, interactive artifacts embedded by the RaidGuild Portal.

## Adding an artifact

Create a stable directory beneath `public` with an `index.html` file:

```text
public/
  artifact-slug/
    index.html
```

After a change is merged to `main`, Railway deploys it at:

```text
https://<artifact-domain>/artifact-slug/
```

Published paths are durable. Do not rename or remove them. Use a versioned path
when an existing article must retain the original artifact.

## Security boundary

Artifacts run on a separate origin from Portal and must be embedded in a
sandboxed iframe. They must not contain Portal credentials, depend on Portal
cookies, or call private Portal APIs.

The service applies a restrictive Content Security Policy. Inline JavaScript
and styles are permitted for self-contained workshop exports. The only external
script origin currently permitted is `cdnjs.cloudflare.com`; prefer checked-in
dependencies for durable published work.

## Local preview

```bash
docker build -t portal-artifacts .
docker run --rm -p 8080:8080 -e PORT=8080 portal-artifacts
```

Open <http://localhost:8080>.

## Published artifacts

- `bd-thread-journeys/` — RaidGuild BD thread journeys across phases. This is a
  concept demonstration; its middle-phase crossings are explicitly marked as
  synthetic in the artifact.
- `veydrift-alliance-map/` — Live, read-only tactical map for Veydrift alliance
  29 (RaidGuild), with a clearly labeled fixture fallback. Its CSS/SVG planet
  visuals are placeholders; no Veydrift artwork is included. Other public
  alliances can be loaded with the in-map ID switcher or the shareable
  `?alliance=<id>` query parameter.

## Veydrift read proxy

The service exposes a narrow, read-only subset of the public Veydrift API below
`/veydrift-api/`. Only explicitly allowlisted `GET` and `HEAD` routes are
forwarded. Keep this allowlist limited to routes consumed by the artifact; do
not turn it into a general API proxy or forward browser credentials.
