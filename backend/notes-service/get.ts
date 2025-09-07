import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { GetNoteRequest, Note } from "./models";

// Gets a specific note by ID.
export const getNote = api<GetNoteRequest, Note>(
  { expose: true, method: "GET", path: "/notes/:id" },
  async (req) => {
    // For demo purposes, using a fixed user ID
    // In production, this would come from authentication context
    const userId = 1;
    
    const noteRow = await notesDB.queryRow<{
      id: number;
      user_id: number;
      title: string;
      body: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, user_id, title, body, created_at, updated_at
      FROM notes
      WHERE id = ${req.id} AND user_id = ${userId}
    `;
    
    if (!noteRow) {
      throw APIError.notFound("Note not found");
    }
    
    // Get tags for this note
    const tagRows = await notesDB.queryAll<{
      id: number;
      name: string;
      color: string;
    }>`
      SELECT t.id, t.name, t.color
      FROM tags t
      JOIN note_tags nt ON t.id = nt.tag_id
      WHERE nt.note_id = ${req.id}
    `;
    
    return {
      id: noteRow.id,
      userId: noteRow.user_id,
      title: noteRow.title,
      body: noteRow.body,
      createdAt: noteRow.created_at,
      updatedAt: noteRow.updated_at,
      tags: tagRows
    };
  }
);
