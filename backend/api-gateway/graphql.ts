import { api } from "encore.dev/api";

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

interface GraphQLResponse {
  data?: any;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

// GraphQL endpoint for the API gateway.
export const graphql = api<GraphQLRequest, GraphQLResponse>(
  { expose: true, method: "POST", path: "/graphql" },
  async (req) => {
    try {
      const result = await resolveGraphQLQuery(req.query, req.variables || {});
      return { data: result };
    } catch (error) {
      return {
        errors: [{
          message: error instanceof Error ? error.message : "Unknown error"
        }]
      };
    }
  }
);

async function resolveGraphQLQuery(query: string, variables: Record<string, any>) {
  // Import service clients
  const { notesService } = await import("~encore/clients");
  const { codegenService } = await import("~encore/clients");
  
  // Simple GraphQL resolver - in production would use a proper GraphQL library
  if (query.includes("notes")) {
    if (query.includes("mutation")) {
      // Handle mutations
      if (query.includes("createNote")) {
        return await notesService.createNote(variables.input);
      }
      if (query.includes("updateNote")) {
        return await notesService.updateNote({
          id: parseInt(variables.id),
          ...variables.input
        });
      }
      if (query.includes("deleteNote")) {
        await notesService.deleteNote({ id: parseInt(variables.id) });
        return true;
      }
    } else {
      // Handle queries
      const limit = variables.limit || 50;
      const offset = variables.offset || 0;
      const tags = variables.tags?.join(',');
      
      const result = await notesService.listNotes({ limit, offset, tags });
      return {
        notes: result.notes,
        total: result.total
      };
    }
  }
  
  if (query.includes("note(")) {
    const id = extractIdFromQuery(query) || variables.id;
    if (!id) throw new Error("Note ID required");
    return await notesService.getNote({ id: parseInt(id) });
  }
  
  if (query.includes("generateCode")) {
    const target = mapGraphQLTargetToService(variables.input.target);
    return await codegenService.generate({
      prompt: variables.input.prompt,
      target
    });
  }
  
  if (query.includes("jobStatus")) {
    return await codegenService.getJobStatus({ id: variables.id });
  }
  
  throw new Error("Unknown GraphQL operation");
}

function extractIdFromQuery(query: string): string | null {
  const match = query.match(/note\s*\(\s*id:\s*"?(\d+)"?\s*\)/);
  return match ? match[1] : null;
}

function mapGraphQLTargetToService(graphqlTarget: string): string {
  const mapping: Record<string, string> = {
    'FRONTEND': 'frontend',
    'BACKEND': 'backend',
    'INFRA': 'infra',
    'SQL': 'sql'
  };
  return mapping[graphqlTarget] || 'frontend';
}
