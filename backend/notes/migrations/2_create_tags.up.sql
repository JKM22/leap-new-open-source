CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280'
);

CREATE TABLE note_tags (
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

-- Insert some default tags
INSERT INTO tags (name, color) VALUES 
  ('Work', '#3b82f6'),
  ('Personal', '#10b981'),
  ('Important', '#ef4444'),
  ('Ideas', '#8b5cf6'),
  ('Learning', '#f59e0b');
