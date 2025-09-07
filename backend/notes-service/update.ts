import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { UpdateNoteRequest, Note } from "./models";
import { noteUpdatedTopic } from "./events";

// Updates an existing note.
export const updateNote = api<UpdateNoteRequest, Note>(
  { expose: true, method: "PATCH", path: "/notes/:id" },
  async (req) => {
    // For demo purposes, using a fixed user ID
    // In production, this would come from authentication context
    const userId = 1;
    const now = new Date();
    
    // Start transaction
    const tx = await notesDB.begin();
    
    try {
      // Check if note exists and belongs to user
      const existingNote = await tx.queryRow<{ id: number; user_id: number }>`
        SELECT id, user_id FROM notes WHERE id = ${req.id} AND user_id = ${userId}
      `;
      
      if (!existingNote) {
        throw APIError.notFound("Note not found");
      }
      
      // Build update query dynamically
      const updates: string[] = [];
      const params: any[] = [];
      
      if (req.title !== undefined) {
        updates.push(`title = $${params.length + 1}`);
        params.push(req.title);
      }
      
      if (req.body !== undefined) {
        updates.push(`body = $${params.length + 1}`);
        params.push(req.body);
      }
      
      updates.push(`updated_at = $${params.length + 1}`);
      params.push(now);
      
      // Add ID parameter for WHERE clause
      params.push(req.id);
      
      const updateQuery = `
        UPDATE notes 
        SET ${updates.join(', ')}
        WHERE id = $${params.length}
        RETURNING id, user_id, title, body, created_at, updated_at
      `;
      
      const noteRow = await tx.rawQueryRow<{
        id: number;
        user_id: number;
        title: string;
        body: string;
        created_at: Date;
        updated_at: Date;
      }>(updateQuery, ...params);
      
      if (!noteRow) {
        throw APIError.internal("Failed to update note");
      }
      
      // Update tags if provided
      const tags = [];
      if (req.tagIds !== undefined) {
        // Remove existing tags
        await tx.exec`DELETE FROM note_tags WHERE note_id = ${req.id}`;
        
        // Add new tags
        if (req.tagIds.length > 0) {
          for (const tagId of req.tagIds) {
            await tx.exec`
              INSERT INTO note_tags (note_id, tag_id)
              VALUES (${req.id}, ${tagId})
              ON CONFLICT (note_id, tag_id) DO NOTHING
            `;
          }
          
          // Get tag details
          const tagRows = await tx.queryAll<{ id: number; name: string; color: string }>`
            SELECT id, name, color FROM tags WHERE id = ANY(${req.tagIds})
          `;
          tags.push(...tagRows);
        }
      } else {
        // Get existing tags
        const tagRows = await tx.queryAll<{ id: number; name: string; color: string }>`
          SELECT t.id, t.name, t.color
          FROM tags t
          JOIN note_tags nt ON t.id = nt.tag_id
          WHERE nt.note_id = ${req.id}
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
      await noteUpdatedTopic.publish({
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
