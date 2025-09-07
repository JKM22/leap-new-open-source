import { api, APIError, Header } from "encore.dev/api";

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

interface AuthHeaders {
  authorization?: Header<"Authorization">;
}

interface ProtectedGraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  authorization?: Header<"Authorization">;
}

interface ProtectedGraphQLResponse {
  data?: any;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

// Mock JWT validation - in production would use proper JWT library
export async function validateJWT(token: string): Promise<AuthContext> {
  // TODO: Implement proper JWT validation
  // For demo purposes, accepting any token
  
  if (!token || token === "invalid") {
    throw APIError.unauthenticated("Invalid token");
  }
  
  // Mock user context
  return {
    userId: "user-123",
    email: "user@example.com", 
    role: "user"
  };
}

// Auth middleware function
export async function requireAuth(headers: AuthHeaders): Promise<AuthContext> {
  const authHeader = headers.authorization;
  
  if (!authHeader) {
    throw APIError.unauthenticated("Authorization header required");
  }
  
  const token = authHeader.replace(/^Bearer\s+/, '');
  return await validateJWT(token);
}

// Protected GraphQL endpoint
export const protectedGraphQL = api<ProtectedGraphQLRequest, ProtectedGraphQLResponse>(
  { expose: true, method: "POST", path: "/graphql/protected" },
  async (req) => {
    // Validate authentication
    const authContext = await requireAuth(req);
    
    // TODO: Pass auth context to resolvers
    console.log("Authenticated user:", authContext.userId);
    
    // Process GraphQL query with auth context
    return { data: { message: "Protected endpoint accessed successfully" } };
  }
);
