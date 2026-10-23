-- Additive only: the previous Worker keeps running if a deploy fails after this applies.
-- projects.result is a one-line outcome shown on the work cards ("Cut month-end billing from 3 days to 3 hours").
ALTER TABLE projects ADD COLUMN result TEXT NOT NULL DEFAULT '';

-- Messages from the contact form. Read in /admin/enquiries.
CREATE TABLE enquiries (
  id         INTEGER PRIMARY KEY,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  timeline   TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX enquiries_recent ON enquiries (created_at DESC);
