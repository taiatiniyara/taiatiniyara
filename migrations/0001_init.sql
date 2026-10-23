-- Bodies live in R2 as TipTap JSON: projects/<id>.json and posts/<id>.json.
-- A non-null published_at means the slug is locked.
CREATE TABLE projects (
  id           INTEGER PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  cover_key    TEXT,
  repo_url     TEXT,
  live_url     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at INTEGER,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

CREATE TABLE posts (
  id           INTEGER PRIMARY KEY,
  project_id   INTEGER REFERENCES projects(id),
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at INTEGER,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

-- SQLite treats NULLs as distinct, so standalone posts need their own index.
CREATE UNIQUE INDEX posts_slug_in_project ON posts (project_id, slug) WHERE project_id IS NOT NULL;
CREATE UNIQUE INDEX posts_slug_standalone ON posts (slug) WHERE project_id IS NULL;
CREATE INDEX posts_feed ON posts (status, published_at DESC);

CREATE TABLE media (
  key        TEXT PRIMARY KEY,
  size       INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
