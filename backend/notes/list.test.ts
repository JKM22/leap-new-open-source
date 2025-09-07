import { describe, it, expect, beforeEach } from 'vitest';
import { notesDB } from './db';
import { list } from './list';

describe('Notes List API', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await notesDB.exec`DELETE FROM notes`;
    await notesDB.exec`DELETE FROM tags`;
  });

  it('should return empty list when no notes exist', async () => {
    const result = await list({});
    expect(result.notes).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return notes with default limit', async () => {
    // Create test notes
    await notesDB.exec`
      INSERT INTO notes (title, content) 
      VALUES ('Test Note 1', 'Content 1'), ('Test Note 2', 'Content 2')
    `;

    const result = await list({});
    expect(result.notes).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.notes[0].title).toBe('Test Note 2'); // Should be ordered by created_at DESC
  });

  it('should filter by search term', async () => {
    await notesDB.exec`
      INSERT INTO notes (title, content) 
      VALUES ('Important Note', 'This is important'), ('Regular Note', 'Just a note')
    `;

    const result = await list({ search: 'important' });
    expect(result.notes).toHaveLength(1);
    expect(result.notes[0].title).toBe('Important Note');
  });

  it('should respect limit parameter', async () => {
    // Create 5 test notes
    for (let i = 1; i <= 5; i++) {
      await notesDB.exec`INSERT INTO notes (title, content) VALUES (${`Note ${i}`}, ${`Content ${i}`})`;
    }

    const result = await list({ limit: 3 });
    expect(result.notes).toHaveLength(3);
    expect(result.total).toBe(5);
  });
});
