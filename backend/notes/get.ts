import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";
import { GetNoteRequest, Note } from "./types";

// Retrieves a specific note by ID with its tags.
export const get = api<GetNoteRequest, Note>(
  { expose: true, method: "GET", path: "/notes/:id" },
  async (req) => {
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
      title: noteRow.title,
      content: noteRow.content,
      createdAt: noteRow.created_at,
      updatedAt: noteRow.updated_at,
      tags: tagRows
    };
  }
);
