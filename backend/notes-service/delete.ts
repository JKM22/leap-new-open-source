import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { DeleteNoteRequest } from "./models";
import { noteDeletedTopic } from "./events";

// Deletes a note.
export const deleteNote = api<DeleteNoteRequest, void>(
  { expose: true, method: "DELETE", path: "/notes/:id" },
  async (req) => {
    // For demo purposes, using a fixed user ID
    // In production, this would come from authentication context
    const userId = 1;
    
    // Check if note exists and belongs to user
    const existingNote = await notesDB.queryRow<{ id: number; user_id: number }>`
      SELECT id, user_id FROM notes WHERE id = ${req.id} AND user_id = ${userId}
    `;
    
    if (!existingNote) {
      throw APIError.notFound("Note not found");
    }
    
    // Delete the note (tags will be deleted automatically due to CASCADE)
    await notesDB.exec`DELETE FROM notes WHERE id = ${req.id}`;
    
    // Publish event
    await noteDeletedTopic.publish({
      noteId: req.id,
      userId: userId,
      timestamp: new Date()
    });
  }
);
