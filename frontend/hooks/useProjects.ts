import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import type { Note } from '~backend/notes/types';

// Hook to fetch all projects (using notes as projects for demo)
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await backend.notes.list({ limit: 50 });
      // Transform notes to project format for demo
      return response.notes.map((note: Note) => ({
        id: note.id,
        title: note.title,
        description: note.content.slice(0, 150) + (note.content.length > 150 ? '...' : ''),
        type: 'full-app',
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        tags: note.tags || []
      }));
    }
  });
}
