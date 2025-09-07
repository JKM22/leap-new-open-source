import { api } from "encore.dev/api";

interface HealthCheckResponse {
  status: string;
  services: {
    notesService: string;
    codegenService: string;
  };
  timestamp: string;
}

// Health check endpoint that aggregates status from all services.
export const healthCheck = api<void, HealthCheckResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    // Import service clients
    const services = await import("~encore/clients");
    
    const status = {
      notesService: "unknown",
      codegenService: "unknown"
    };
    
    // Check notes service health
    try {
      await services.notesService.listNotes({ limit: 1 });
      status.notesService = "healthy";
    } catch (error) {
      status.notesService = "unhealthy";
    }
    
    // Check codegen service health  
    try {
      await services.codegenService.getJobStatus({ id: "health-check" });
      status.codegenService = "healthy";
    } catch (error) {
      // Job not found is OK for health check
      if (error instanceof Error && error.message.includes("not found")) {
        status.codegenService = "healthy";
      } else {
        status.codegenService = "unhealthy";
      }
    }
    
    const overallStatus = Object.values(status).every(s => s === "healthy") 
      ? "healthy" 
      : "degraded";
    
    return {
      status: overallStatus,
      services: status,
      timestamp: new Date().toISOString()
    };
  }
);
