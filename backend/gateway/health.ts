import { api } from "encore.dev/api";

interface HealthResponse {
  status: string;
  timestamp: Date;
  services: {
    notes: string;
    codegen: string;
    eventBus: string;
  };
}

// Health check endpoint for monitoring.
export const health = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    return {
      status: "healthy",
      timestamp: new Date(),
      services: {
        notes: "healthy",
        codegen: "healthy",
        eventBus: "healthy"
      }
    };
  }
);
