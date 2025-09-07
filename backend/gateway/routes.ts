import { api } from "encore.dev/api";
import { notes, codegen } from "~encore/clients";

interface RouteRequest {
  path: string;
  method: string;
  body?: any;
  query?: Record<string, string>;
}

interface RouteResponse {
  data: any;
  status: number;
}

// API routing endpoint that forwards requests to appropriate services.
export const route = api<RouteRequest, RouteResponse>(
  { expose: true, method: "*", path: "/api/*path" },
  async (req) => {
    const path = req.path;
    
    try {
      if (path.startsWith("notes")) {
        return await routeToNotesService(path, req.method, req.body, req.query);
      }
      
      if (path.startsWith("codegen")) {
        return await routeToCodegenService(path, req.method, req.body, req.query);
      }
      
      return {
        data: { error: "Service not found" },
        status: 404
      };
    } catch (error) {
      return {
        data: { error: error instanceof Error ? error.message : "Unknown error" },
        status: 500
      };
    }
  }
);

async function routeToNotesService(path: string, method: string, body: any, query?: Record<string, string>) {
  const segments = path.split("/").filter(Boolean);
  
  if (method === "GET" && segments.length === 1) {
    const limit = query?.limit ? parseInt(query.limit) : undefined;
    const tag = query?.tag;
    const data = await notes.list({ limit, tag });
    return { data, status: 200 };
  }
  
  if (method === "POST" && segments.length === 1) {
    const data = await notes.create(body);
    return { data, status: 201 };
  }
  
  if (method === "GET" && segments.length === 2) {
    const id = parseInt(segments[1]);
    const data = await notes.get({ id });
    return { data, status: 200 };
  }
  
  if (method === "PUT" && segments.length === 2) {
    const id = parseInt(segments[1]);
    const data = await notes.update({ id, ...body });
    return { data, status: 200 };
  }
  
  if (method === "DELETE" && segments.length === 2) {
    const id = parseInt(segments[1]);
    await notes.delete({ id });
    return { data: { success: true }, status: 200 };
  }
  
  return {
    data: { error: "Route not found" },
    status: 404
  };
}

async function routeToCodegenService(path: string, method: string, body: any, query?: Record<string, string>) {
  const segments = path.split("/").filter(Boolean);
  
  if (method === "POST" && segments[1] === "generate") {
    const data = await codegen.generate(body);
    return { data, status: 200 };
  }
  
  if (method === "GET" && segments[1] === "templates") {
    const data = await codegen.listTemplates();
    return { data, status: 200 };
  }
  
  return {
    data: { error: "Route not found" },
    status: 404
  };
}
