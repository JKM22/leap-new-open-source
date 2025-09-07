import { useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import type { GenerateCodeRequest } from '~backend/codegen/types';

// Hook to generate code using the CodeGen service
export function useGenerateCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateCodeRequest) => {
      return await backend.codegen.generate(request);
    },
    onSuccess: () => {
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
