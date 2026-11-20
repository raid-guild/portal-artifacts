-- Apply as the database administrator after the Dune tables in schema.sql.
-- The runtime role needs data access only; do not grant schema DDL.
GRANT USAGE ON SCHEMA artifact_leaderboards TO artifact_leaderboards_app;
GRANT SELECT, INSERT, UPDATE ON artifact_leaderboards.dune_profiles,
  artifact_leaderboards.dune_attempts,
  artifact_leaderboards.dune_completions,
  artifact_leaderboards.dune_operations TO artifact_leaderboards_app;
GRANT SELECT, INSERT, DELETE ON artifact_leaderboards.dune_launch_intents TO artifact_leaderboards_app;
GRANT USAGE ON SEQUENCE artifact_leaderboards.players_id_seq TO artifact_leaderboards_app;
