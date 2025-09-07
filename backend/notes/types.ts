export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tagIds?: number[];
}

export interface UpdateNoteRequest {
  id: number;
  title?: string;
  content?: string;
  tagIds?: number[];
}

export interface ListNotesRequest {
  limit?: number;
  offset?: number;
  tag?: string;
  search?: string;
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

export interface ListTagsResponse {
  tags: Tag[];
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}
