import { api, APIError } from "encore.dev/api";
import { JobStatusRequest, JobStatusResponse } from "./models";
import { jobQueue } from "./job-queue";

// Gets the status of a code generation job.
export const getJobStatus = api<JobStatusRequest, JobStatusResponse>(
  { expose: true, method: "GET", path: "/jobs/:id" },
  async (req) => {
    const job = jobQueue.getJob(req.id);
    
    if (!job) {
      throw APIError.notFound("Job not found");
    }
    
    return {
      id: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt
    };
  }
);
