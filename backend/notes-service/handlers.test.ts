import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { notesDB } from './db';
import { createNote } from './create';
import { listNotes } from './list';
import { getNote } from './get';
import { updateNote } from './update';
import { deleteNote } from './delete';

// Helper function to create a test user
async function createTestUser() {
  const userRow = await notesDB.queryRow<{ id: number }>`
    INSERT INTO users (email, password_hash, role)
    VALUES ('test@example.com', 'hash', 'user')
    RETURNING id
  `;
  return userRow?.id || 1;
}

// Helper function to create a test tag
async function createTestTag(name: string) {
  const tagRow = await notesDB.queryRow<{ id: number }>`
    INSERT INTO tags (name) VALUES (${name}) RETURNING id
  `;
  return tagRow?.id || 1;
}

describe('Notes Service Handlers', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await notesDB.exec`DELETE FROM note_tags`;
    await notesDB.exec`DELETE FROM notes`;
    await notesDB.exec`DELETE FROM tags`;
    await notesDB.exec`DELETE FROM users`;
    
    // Create test user
    await createTestUser();
  });

  afterEach(async () => {
    // Clean up after each test
    await notesDB.exec`DELETE FROM note_tags`;
    await notesDB.exec`DELETE FROM notes`;
    await notesDB.exec`DELETE FROM tags`;
    await notesDB.exec`DELETE FROM users`;
  });

  it('should create a note successfully', async () => {
    const request = {
      title: 'Test Note',
      body: 'This is a test note'
    };

    const result = await createNote(request);
    
    expect(result.title).toBe(request.title);
    expect(result.body).toBe(request.body);
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it('should create a note with tags', async () => {
    const tagId = await createTestTag('work');
    
    const request = {
      title: 'Test Note',
      body: 'This is a test note',
      tagIds: [tagId]
    };

    const result = await createNote(request);
    
    expect(result.tags).toHaveLength(1);
    expect(result.tags![0].name).toBe('work');
  });

  it('should list notes with pagination', async () => {
    // Create multiple notes
    for (let i = 1; i <= 5; i++) {
      await createNote({
        title: `Note ${i}`,
        body: `Body ${i}`
      });
    }

    const result = await listNotes({ limit: 3 });
    
    expect(result.notes).toHaveLength(3);
    expect(result.total).toBe(5);
    // Should be ordered by created_at DESC
    expect(result.notes[0].title).toBe('Note 5');
  });

  it('should filter notes by tags', async () => {
    const workTagId = await createTestTag('work');
    const personalTagId = await createTestTag('personal');
    
    await createNote({
      title: 'Work Note',
      body: 'Work content',
      tagIds: [workTagId]
    });
    
    await createNote({
      title: 'Personal Note',
      body: 'Personal content',
      tagIds: [personalTagId]
    });

    const result = await listNotes({ tags: 'work' });
    
    expect(result.notes).toHaveLength(1);
    expect(result.notes[0].title).toBe('Work Note');
  });

  it('should get a specific note', async () => {
    const created = await createNote({
      title: 'Test Note',
      body: 'Test body'
    });

    const result = await getNote({ id: created.id });
    
    expect(result.title).toBe(created.title);
    expect(result.body).toBe(created.body);
    expect(result.id).toBe(created.id);
  });

  it('should update a note', async () => {
    const created = await createNote({
      title: 'Original Title',
      body: 'Original body'
    });

    const result = await updateNote({
      id: created.id,
      title: 'Updated Title',
      body: 'Updated body'
    });
    
    expect(result.title).toBe('Updated Title');
    expect(result.body).toBe('Updated body');
    expect(result.updatedAt).not.toEqual(created.updatedAt);
  });

  it('should delete a note', async () => {
    const created = await createNote({
      title: 'To Delete',
      body: 'Delete me'
    });

    await deleteNote({ id: created.id });
    
    // Verify note is deleted
    const notes = await listNotes({});
    expect(notes.notes).toHaveLength(0);
  });
});
