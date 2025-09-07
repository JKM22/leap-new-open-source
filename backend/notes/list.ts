import { api } from "encore.dev/api";
import { notesDB } from "./db";
import { ListNotesRequest, ListNotesResponse, Note } from "./types";

// Lists all notes with optional filtering by tag or search term.
export const list = api<ListNotesRequest, ListNotesResponse>(
  { expose: true, method: "GET", path: "/notes" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    let query = `
      SELECT DISTINCT n.id, n.title, n.content, n.created_at, n.updated_at
      FROM notes n
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (req.tag) {
      query += ` LEFT JOIN note_tags nt ON n.id = nt.note_id
                 LEFT JOIN tags t ON nt.tag_id = t.id`;
      conditions.push(`t.name = $${params.length + 1}`);
      params.push(req.tag);
    }
    
    if (req.search) {
      conditions.push(`(n.title ILIKE $${params.length + 1} OR n.content ILIKE $${params.length + 1})`);
      params.push(`%${req.search}%`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY n.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const rows = await notesDB.rawQueryAll<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>(query, ...params);
    
    // Get tags for each note
    const noteIds = rows.map(row => row.id);
    const tags = await getTagsForNotes(noteIds);
    
    const notes: Note[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: tags[row.id] || []
    }));
    
    // Get total count
    let countQuery = `SELECT COUNT(DISTINCT n.id) as total FROM notes n`;
    if (req.tag) {
      countQuery += ` LEFT JOIN note_tags nt ON n.id = nt.note_id
                      LEFT JOIN tags t ON nt.tag_id = t.id`;
    }
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const countResult = await notesDB.rawQueryRow<{ total: string }>(
      countQuery, 
      ...params.slice(0, -2) // Remove limit and offset
    );
    
    return {
      notes,
      total: parseInt(countResult?.total || '0')
    };
  }
);

async function getTagsForNotes(noteIds: number[]) {
  if (noteIds.length === 0) return {};
  
  const tagRows = await notesDB.rawQueryAll<{
    note_id: number;
    tag_id: number;
    name: string;
    color: string;
  }>(
    `SELECT nt.note_id, t.id as tag_id, t.name, t.color
     FROM note_tags nt
     JOIN tags t ON nt.tag_id = t.id
     WHERE nt.note_id = ANY($1)`,
    noteIds
  );
  
  const tagsByNote: Record<number, any[]> = {};
  for (const row of tagRows) {
    if (!tagsByNote[row.note_id]) {
      tagsByNote[row.note_id] = [];
    }
    tagsByNote[row.note_id].push({
      id: row.tag_id,
      name: row.name,
      color: row.color
    });
  }
  
  return tagsByNote;
}
