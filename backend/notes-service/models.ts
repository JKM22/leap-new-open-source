export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Note {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface NoteTag {
  noteId: number;
  tagId: number;
}

export interface CreateNoteRequest {
  title: string;
  body: string;
  tagIds?: number[];
}

export interface UpdateNoteRequest {
  id: number;
  title?: string;
  body?: string;
  tagIds?: number[];
}

export interface ListNotesRequest {
  tags?: string;
  limit?: number;
  offset?: number;
}

export interface ListNotesResponse {
  notes: Note[];
  total: number;
}

export interface GetNoteRequest {
  id: number;
}

export interface DeleteNoteRequest {
  id: number;
}
