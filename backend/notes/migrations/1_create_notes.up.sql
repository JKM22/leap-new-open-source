CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_title ON notes USING gin(to_tsvector('english', title));
