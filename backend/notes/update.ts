import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { UpdateNoteRequest, Note } from "./types";
import { noteEvents } from "./events";

// Updates an existing note and optionally its tags.
export const update = api<UpdateNoteRequest, Note>(
  { expose: true, method: "PUT", path: "/notes/:id" },
  async (req) => {
    const now = new Date();
    
    // Check if note exists
    const existingNote = await notesDB.queryRow<{ id: number }>`
      SELECT id FROM notes WHERE id = ${req.id}
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
    
    if (req.content !== undefined) {
      updates.push(`content = $${params.length + 1}`);
      params.push(req.content);
    }
    
    updates.push(`updated_at = $${params.length + 1}`);
    params.push(now);
    
    // Add ID parameter for WHERE clause
    params.push(req.id);
    
    const updateQuery = `
      UPDATE notes 
      SET ${updates.join(', ')}
      WHERE id = $${params.length}
      RETURNING id, title, content, created_at, updated_at
    `;
    
    const noteRow = await notesDB.rawQueryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>(updateQuery, ...params);
    
    if (!noteRow) {
      throw APIError.internal("Failed to update note");
    }
    
    // Update tags if provided
    if (req.tagIds !== undefined) {
      // Remove existing tags
      await notesDB.exec`DELETE FROM note_tags WHERE note_id = ${req.id}`;
      
      // Add new tags
      if (req.tagIds.length > 0) {
        await addTagsToNote(req.id, req.tagIds);
      }
    }
    
    // Get the complete note with tags
    const tags = await getNoteTags(req.id);
    
    const note: Note = {
      id: noteRow.id,
      title: noteRow.title,
      content: noteRow.content,
      createdAt: noteRow.created_at,
      updatedAt: noteRow.updated_at,
      tags
    };
    
    // Publish event
    await noteEvents.publish({
      type: "updated",
      noteId: note.id.toString(),
      timestamp: now,
      data: note
    });
    
    return note;
  }
);

async function addTagsToNote(noteId: number, tagIds: number[]) {
  for (const tagId of tagIds) {
    await notesDB.exec`
      INSERT INTO note_tags (note_id, tag_id)
      VALUES (${noteId}, ${tagId})
      ON CONFLICT (note_id, tag_id) DO NOTHING
    `;
  }
}

async function getNoteTags(noteId: number) {
  const tagRows = await notesDB.queryAll<{
    id: number;
    name: string;
    color: string;
  }>`
    SELECT t.id, t.name, t.color
    FROM tags t
    JOIN note_tags nt ON t.id = nt.tag_id
    WHERE nt.note_id = ${noteId}
  `;
  
  return tagRows;
}
