import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { notesDB } from './db';
import { createNote } from './create';
import { noteCreatedTopic } from './events';

// Mock the event publishing to verify it was called
let publishedEvents: any[] = [];

// Override the publish method for testing
const originalPublish = noteCreatedTopic.publish;
noteCreatedTopic.publish = async (event: any) => {
  publishedEvents.push(event);
  return 'mock-message-id';
};

describe('Notes Service Integration Tests', () => {
  beforeEach(async () => {
    publishedEvents = [];
    
    // Clean up database
    await notesDB.exec`DELETE FROM note_tags`;
    await notesDB.exec`DELETE FROM notes`;
    await notesDB.exec`DELETE FROM tags`;
    await notesDB.exec`DELETE FROM users`;
    
    // Create test user
    await notesDB.exec`
      INSERT INTO users (email, password_hash, role)
      VALUES ('test@example.com', 'hash', 'user')
    `;
  });

  afterEach(async () => {
    // Restore original publish method
    noteCreatedTopic.publish = originalPublish;
    
    // Clean up
    await notesDB.exec`DELETE FROM note_tags`;
    await notesDB.exec`DELETE FROM notes`;
    await notesDB.exec`DELETE FROM tags`;
    await notesDB.exec`DELETE FROM users`;
  });

  it('should create note and emit event in transaction', async () => {
    const request = {
      title: 'Integration Test Note',
      body: 'This tests the full flow'
    };

    // Create the note
    const result = await createNote(request);
    
    // Verify note was created in database
    const dbNote = await notesDB.queryRow<{
      id: number;
      title: string;
      body: string;
    }>`
      SELECT id, title, body FROM notes WHERE id = ${result.id}
    `;
    
    expect(dbNote).toBeDefined();
    expect(dbNote!.title).toBe(request.title);
    expect(dbNote!.body).toBe(request.body);
    
    // Verify event was published
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]).toMatchObject({
      noteId: result.id,
      userId: 1,
      timestamp: expect.any(Date)
    });
  });

  it('should rollback transaction on failure', async () => {
    // Force a failure by using invalid tag IDs
    const request = {
      title: 'Test Note',
      body: 'Test body',
      tagIds: [999999] // Non-existent tag ID
    };

    // This should fail due to foreign key constraint
    await expect(createNote(request)).rejects.toThrow();
    
    // Verify no note was created
    const notes = await notesDB.queryAll`SELECT * FROM notes`;
    expect(notes).toHaveLength(0);
    
    // Verify no event was published
    expect(publishedEvents).toHaveLength(0);
  });

  it('should handle tag associations correctly', async () => {
    // Create test tags
    const tag1 = await notesDB.queryRow<{ id: number }>`
      INSERT INTO tags (name) VALUES ('work') RETURNING id
    `;
    const tag2 = await notesDB.queryRow<{ id: number }>`
      INSERT INTO tags (name) VALUES ('important') RETURNING id
    `;
    
    const request = {
      title: 'Tagged Note',
      body: 'Note with tags',
      tagIds: [tag1!.id, tag2!.id]
    };

    const result = await createNote(request);
    
    // Verify tag associations in database
    const tagAssociations = await notesDB.queryAll<{
      note_id: number;
      tag_id: number;
    }>`
      SELECT note_id, tag_id FROM note_tags WHERE note_id = ${result.id}
    `;
    
    expect(tagAssociations).toHaveLength(2);
    expect(tagAssociations.map(t => t.tag_id)).toContain(tag1!.id);
    expect(tagAssociations.map(t => t.tag_id)).toContain(tag2!.id);
    
    // Verify tags are included in response
    expect(result.tags).toHaveLength(2);
    expect(result.tags!.map(t => t.name)).toContain('work');
    expect(result.tags!.map(t => t.name)).toContain('important');
  });
});
