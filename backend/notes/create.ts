import { api } from "encore.dev/api";
import { notesDB } from "./db";
import { CreateNoteRequest, Note } from "./types";
import { noteEvents } from "./events";

// Creates a new note with optional tags.
export const create = api<CreateNoteRequest, Note>(
  { expose: true, method: "POST", path: "/notes" },
  async (req) => {
    const now = new Date();
    
    // Create the note
    const noteRow = await notesDB.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO notes (title, content, created_at, updated_at)
      VALUES (${req.title}, ${req.content}, ${now}, ${now})
      RETURNING id, title, content, created_at, updated_at
    `;
    
    if (!noteRow) {
      throw new Error("Failed to create note");
    }
    
    // Add tags if provided
    if (req.tagIds && req.tagIds.length > 0) {
      await addTagsToNote(noteRow.id, req.tagIds);
    }
    
    // Get the complete note with tags
    const tags = req.tagIds ? await getNoteTags(noteRow.id) : [];
    
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
      type: "created",
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
