import { api, APIError } from "encore.dev/api";
import { GenerateRequest, GenerateResponse } from "./models";
import { rateLimiter } from "./rate-limiter";
import { jobQueue } from "./job-queue";

// Generates code based on a prompt.
export const generate = api<GenerateRequest, GenerateResponse>(
  { expose: true, method: "POST", path: "/generate" },
  async (req) => {
    // For demo purposes, using a simple client ID
    // In production, this would come from authentication context
    const clientId = "demo-client";
    
    // Rate limiting
    const rateLimit = rateLimiter.checkLimit(clientId);
    if (!rateLimit.allowed) {
      throw APIError.resourceExhausted("Rate limit exceeded", {
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      });
    }
    
    // Validate request
    if (!req.prompt || req.prompt.trim().length === 0) {
      throw APIError.invalidArgument("Prompt is required");
    }
    
    if (!["frontend", "backend", "infra", "sql"].includes(req.target)) {
      throw APIError.invalidArgument("Invalid target. Must be one of: frontend, backend, infra, sql");
    }
    
    // Add job to queue
    const jobId = jobQueue.addJob(req);
    
    // Wait for job completion (with timeout)
    const result = await waitForJobCompletion(jobId, 30000); // 30 second timeout
    
    if (!result) {
      throw APIError.deadlineExceeded("Code generation timed out");
    }
    
    if (result.status === "failed") {
      throw APIError.internal(`Code generation failed: ${result.error}`);
    }
    
    return result.result!;
  }
);

async function waitForJobCompletion(jobId: string, timeoutMs: number): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const job = jobQueue.getJob(jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.status === "completed" || job.status === "failed") {
      return job;
    }
    
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return null; // Timeout
}
