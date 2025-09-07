-- Initialize development databases

-- Create databases for different services
CREATE DATABASE notes_service;
CREATE DATABASE codegen_service;
CREATE DATABASE api_gateway;

-- Create development user
CREATE USER leap_dev WITH PASSWORD 'leap_dev_password';
GRANT ALL PRIVILEGES ON DATABASE notes_service TO leap_dev;
GRANT ALL PRIVILEGES ON DATABASE codegen_service TO leap_dev;
GRANT ALL PRIVILEGES ON DATABASE api_gateway TO leap_dev;

-- Connect to notes_service database
\c notes_service;

-- Create tables for notes service
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE note_tags (
  note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

-- Insert default data
INSERT INTO users (email, password_hash, role) VALUES 
  ('admin@leap.new', 'hashed_password', 'admin'),
  ('user@leap.new', 'hashed_password', 'user');

INSERT INTO tags (name) VALUES 
  ('work'),
  ('personal'),
  ('important'),
  ('ideas'),
  ('learning');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO leap_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO leap_dev;
