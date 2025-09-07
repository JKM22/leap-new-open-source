import { api } from "encore.dev/api";
import { notes } from "~encore/clients";

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

// GraphQL endpoint that aggregates data from multiple services.
export const graphql = api<GraphQLRequest, GraphQLResponse>(
  { expose: true, method: "POST", path: "/graphql" },
  async (req) => {
    try {
      // Simple GraphQL resolver - in production would use proper GraphQL library
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
  // Basic query parsing - in production would use graphql-js or similar
  if (query.includes("notes")) {
    const limit = variables.limit || 10;
    const tag = variables.tag;
    return await notes.list({ limit, tag });
  }
  
  if (query.includes("note(")) {
    const id = extractIdFromQuery(query) || variables.id;
    if (!id) throw new Error("Note ID required");
    return await notes.get({ id });
  }
  
  throw new Error("Unknown GraphQL query");
}

function extractIdFromQuery(query: string): number | null {
  const match = query.match(/note\s*\(\s*id:\s*(\d+)\s*\)/);
  return match ? parseInt(match[1]) : null;
}
