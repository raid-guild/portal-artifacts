-- Additive Dune Relay Farmland entitlement prerequisite.
-- Review and run as the database administrator before deploying the backend.
-- This is the exact table definition in ../schema.sql and grant in dune-grants.sql.
-- Do not run it from the restricted application role.
BEGIN;
CREATE TABLE IF NOT EXISTS artifact_leaderboards.dune_entitlements (
  player_id bigint NOT NULL REFERENCES artifact_leaderboards.players(id) ON DELETE CASCADE,
  entitlement_key text NOT NULL,
  source text NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (player_id, entitlement_key)
);
GRANT SELECT, INSERT ON artifact_leaderboards.dune_entitlements TO artifact_leaderboards_app;
COMMIT;
