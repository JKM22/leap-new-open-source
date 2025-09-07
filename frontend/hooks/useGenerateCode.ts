import { useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';

interface GenerateCodeRequest {
  prompt: string;
  target: "frontend" | "backend" | "infra" | "sql";
}

// Hook to generate code using the CodeGen service
export function useGenerateCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateCodeRequest) => {
      return await backend.codegen.generateCode(request);
    },
    onSuccess: () => {
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
