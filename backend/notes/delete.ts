import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { DeleteNoteRequest } from "./types";
import { noteEvents } from "./events";

// Deletes a note and all its associated tags.
export const deleteNote = api<DeleteNoteRequest, void>(
  { expose: true, method: "DELETE", path: "/notes/:id" },
  async (req) => {
    // Check if note exists and get its data for the event
    const noteRow = await notesDB.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, created_at, updated_at
      FROM notes
      WHERE id = ${req.id}
    `;
    
    if (!noteRow) {
      throw APIError.notFound("Note not found");
    }
    
    // Delete the note (tags will be deleted automatically due to CASCADE)
    await notesDB.exec`DELETE FROM notes WHERE id = ${req.id}`;
    
    // Publish event
    await noteEvents.publish({
      type: "deleted",
      noteId: req.id.toString(),
      timestamp: new Date(),
      data: {
        id: noteRow.id,
        title: noteRow.title,
        content: noteRow.content,
        createdAt: noteRow.created_at,
        updatedAt: noteRow.updated_at
      }
    });
  }
);
