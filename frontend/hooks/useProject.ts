import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import type { Note } from '~backend/notes/types';

// Hook to fetch a single project by ID (using notes as projects for demo)
export function useProject(id: number) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const note = await backend.notes.get({ id });
      // Transform note to project format for demo
      return {
        id: note.id,
        title: note.title,
        description: note.content.slice(0, 150) + (note.content.length > 150 ? '...' : ''),
        content: note.content,
        type: 'full-app',
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        tags: note.tags || []
      };
    },
    enabled: !!id && id > 0
  });
}
