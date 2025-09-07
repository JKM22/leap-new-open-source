import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { CreateNoteRequest, Note } from "./models";
import { noteCreatedTopic } from "./events";

// Creates a new note.
export const createNote = api<CreateNoteRequest, Note>(
  { expose: true, method: "POST", path: "/notes" },
  async (req) => {
    // For demo purposes, using a fixed user ID
    // In production, this would come from authentication context
    const userId = 1;
    const now = new Date();
    
    // Start transaction
    const tx = await notesDB.begin();
    
    try {
      // Create the note
      const noteRow = await tx.queryRow<{
        id: number;
        user_id: number;
        title: string;
        body: string;
        created_at: Date;
        updated_at: Date;
      }>`
        INSERT INTO notes (user_id, title, body, created_at, updated_at)
        VALUES (${userId}, ${req.title}, ${req.body}, ${now}, ${now})
        RETURNING id, user_id, title, body, created_at, updated_at
      `;
      
      if (!noteRow) {
        throw APIError.internal("Failed to create note");
      }
      
      // Add tags if provided
      const tags = [];
      if (req.tagIds && req.tagIds.length > 0) {
        for (const tagId of req.tagIds) {
          await tx.exec`
            INSERT INTO note_tags (note_id, tag_id)
            VALUES (${noteRow.id}, ${tagId})
            ON CONFLICT (note_id, tag_id) DO NOTHING
          `;
        }
        
        // Get tag details
        const tagRows = await tx.queryAll<{ id: number; name: string }>`
          SELECT id, name FROM tags WHERE id = ANY(${req.tagIds})
        `;
        tags.push(...tagRows);
      }
      
      const note: Note = {
        id: noteRow.id,
        userId: noteRow.user_id,
        title: noteRow.title,
        body: noteRow.body,
        createdAt: noteRow.created_at,
        updatedAt: noteRow.updated_at,
        tags
      };
      
      // Commit transaction
      await tx.commit();
      
      // Publish event after successful commit
      await noteCreatedTopic.publish({
        noteId: note.id,
        userId: note.userId,
        timestamp: now
      });
      
      return note;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
);
