FROM node:22-alpine AS assets

WORKDIR /build
COPY scripts/inject-plausible.mjs scripts/inject-plausible.mjs
COPY public public
RUN node scripts/inject-plausible.mjs public /srv

FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=assets /srv /srv
