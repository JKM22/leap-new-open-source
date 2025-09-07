import { api } from "encore.dev/api";

interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    gateway: string;
    notes: string;
    codegen: string;
  };
}

// Health check endpoint for monitoring and load balancers.
export const health = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/api/health" },
  async () => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        gateway: "healthy",
        notes: "healthy", 
        codegen: "healthy"
      }
    };
  }
);
