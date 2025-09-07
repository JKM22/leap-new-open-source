import { api } from "encore.dev/api";
import { notesDB } from "./db";
import { ListTagsResponse, CreateTagRequest, Tag } from "./types";

// Lists all available tags.
export const listTags = api<void, ListTagsResponse>(
  { expose: true, method: "GET", path: "/tags" },
  async () => {
    const tagRows = await notesDB.queryAll<{
      id: number;
      name: string;
      color: string;
    }>`
      SELECT id, name, color
      FROM tags
      ORDER BY name
    `;
    
    return { tags: tagRows };
  }
);

// Creates a new tag.
export const createTag = api<CreateTagRequest, Tag>(
  { expose: true, method: "POST", path: "/tags" },
  async (req) => {
    const color = req.color || '#6b7280';
    
    const tagRow = await notesDB.queryRow<{
      id: number;
      name: string;
      color: string;
    }>`
      INSERT INTO tags (name, color)
      VALUES (${req.name}, ${color})
      RETURNING id, name, color
    `;
    
    if (!tagRow) {
      throw new Error("Failed to create tag");
    }
    
    return tagRow;
  }
);
