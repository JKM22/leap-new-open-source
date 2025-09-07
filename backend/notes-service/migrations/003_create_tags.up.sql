CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280'
);

CREATE TABLE note_tags (
  note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

-- Insert some default tags
INSERT INTO tags (name, color) VALUES 
  ('work', '#3b82f6'),
  ('personal', '#10b981'),
  ('important', '#ef4444'),
  ('ideas', '#8b5cf6'),
  ('learning', '#f59e0b');
