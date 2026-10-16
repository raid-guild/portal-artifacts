CREATE SCHEMA IF NOT EXISTS artifact_leaderboards;
CREATE TABLE IF NOT EXISTS artifact_leaderboards.launches (
  issuer text NOT NULL, jti text NOT NULL, expires_at timestamptz NOT NULL,
  PRIMARY KEY (issuer, jti)
);
CREATE TABLE IF NOT EXISTS artifact_leaderboards.players (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  issuer text NOT NULL, subject text NOT NULL, display_name text NOT NULL,
  UNIQUE (issuer, subject)
);
CREATE TABLE IF NOT EXISTS artifact_leaderboards.sessions (
  token_hash text PRIMARY KEY, player_id bigint NOT NULL REFERENCES artifact_leaderboards.players,
  game text NOT NULL, expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON artifact_leaderboards.sessions (expires_at);
CREATE TABLE IF NOT EXISTS artifact_leaderboards.runs (
  id uuid PRIMARY KEY, player_id bigint NOT NULL REFERENCES artifact_leaderboards.players,
  session_hash text NOT NULL, game text NOT NULL, version text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz,
  score integer CHECK (score >= 0), wave integer CHECK (wave > 0), duration_ms integer,
  CHECK ((submitted_at IS NULL AND score IS NULL) OR (submitted_at IS NOT NULL AND score IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS runs_ranking ON artifact_leaderboards.runs (game, version, score DESC, submitted_at, id) WHERE submitted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS runs_player_started ON artifact_leaderboards.runs (player_id, started_at);

ALTER TABLE artifact_leaderboards.runs ADD COLUMN IF NOT EXISTS details jsonb;
ALTER TABLE artifact_leaderboards.runs ADD COLUMN IF NOT EXISTS run_config jsonb;
ALTER TABLE artifact_leaderboards.runs ADD COLUMN IF NOT EXISTS progress jsonb;
CREATE TABLE IF NOT EXISTS artifact_leaderboards.raid_profiles (
  player_id bigint PRIMARY KEY REFERENCES artifact_leaderboards.players(id) ON DELETE CASCADE,
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS raid_runs_level_ranking ON artifact_leaderboards.runs (game,version,(run_config->>'level'),score DESC,submitted_at,id) WHERE submitted_at IS NOT NULL;

-- Puddle community drafts are immutable once a version is published. Hiding a
-- level changes only its parent row, so old pinned versions remain consistent.
CREATE TABLE IF NOT EXISTS artifact_leaderboards.puddle_community_levels (
  id uuid PRIMARY KEY,
  owner_id bigint NOT NULL REFERENCES artifact_leaderboards.players(id),
  current_version integer NOT NULL CHECK (current_version >= 1),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  unpublished_at timestamptz
);
CREATE INDEX IF NOT EXISTS puddle_community_public_latest
  ON artifact_leaderboards.puddle_community_levels (updated_at DESC,id DESC) WHERE published;
CREATE INDEX IF NOT EXISTS puddle_community_owner_latest
  ON artifact_leaderboards.puddle_community_levels (owner_id,updated_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS artifact_leaderboards.puddle_community_versions (
  level_id uuid NOT NULL REFERENCES artifact_leaderboards.puddle_community_levels(id),
  version integer NOT NULL CHECK (version >= 1),
  request_id uuid NOT NULL UNIQUE,
  document jsonb NOT NULL,
  description text NOT NULL CHECK (char_length(description) <= 500),
  content_hash text NOT NULL,
  title text NOT NULL,
  gold_count integer NOT NULL CHECK (gold_count >= 0),
  gem_count integer NOT NULL CHECK (gem_count >= 0),
  target_seconds numeric NOT NULL CHECK (target_seconds > 0),
  validation_version integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (level_id,version)
);
CREATE INDEX IF NOT EXISTS puddle_community_versions_created
  ON artifact_leaderboards.puddle_community_versions (created_at DESC);
