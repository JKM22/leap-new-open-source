import { api } from "encore.dev/api";
import { notesDB } from "./db";
import { ListNotesRequest, ListNotesResponse, Note } from "./models";

// Lists notes with optional tag filtering.
export const listNotes = api<ListNotesRequest, ListNotesResponse>(
  { expose: true, method: "GET", path: "/notes" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    // For demo purposes, using a fixed user ID
    // In production, this would come from authentication context
    const userId = 1;
    
    let whereClause = `WHERE n.user_id = ${userId}`;
    const params: any[] = [limit, offset];
    
    if (req.tags) {
      const tagNames = req.tags.split(',').map(tag => tag.trim());
      whereClause += ` AND EXISTS (
        SELECT 1 FROM note_tags nt 
        JOIN tags t ON nt.tag_id = t.id 
        WHERE nt.note_id = n.id AND t.name = ANY($${params.length + 1})
      )`;
      params.push(tagNames);
    }
    
    const query = `
      SELECT n.id, n.user_id, n.title, n.body, n.created_at, n.updated_at
      FROM notes n
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const noteRows = await notesDB.rawQueryAll<{
      id: number;
      user_id: number;
      title: string;
      body: string;
      created_at: Date;
      updated_at: Date;
    }>(query, ...params);
    
    // Get tags for each note
    const noteIds = noteRows.map(row => row.id);
    const tags = await getTagsForNotes(noteIds);
    
    const notes: Note[] = noteRows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: tags[row.id] || []
    }));
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notes n
      ${whereClause.replace(/\$1|\$2/g, '')}
    `;
    
    const countParams = req.tags ? [tagNames] : [];
    const countResult = await notesDB.rawQueryRow<{ total: string }>(
      countQuery,
      ...countParams
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
