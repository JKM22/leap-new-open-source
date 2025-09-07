import { Job, GenerateRequest, GenerateResponse } from "./models";
import { LLMAdapter, OpenAIAdapter, LocalLLMAdapter } from "./llm-adapter";
import { secret } from "encore.dev/config";

const openAIKey = secret("OpenAIKey");

export class JobQueue {
  private jobs = new Map<string, Job>();
  private processing = false;
  private llmAdapter: LLMAdapter;

  constructor() {
    // Initialize LLM adapter
    const apiKey = openAIKey();
    if (apiKey) {
      this.llmAdapter = new OpenAIAdapter(apiKey);
    } else {
      this.llmAdapter = new LocalLLMAdapter();
    }
    
    // Start processing loop
    this.startProcessing();
  }

  addJob(request: GenerateRequest): string {
    const jobId = this.generateJobId();
    const job: Job = {
      id: jobId,
      prompt: request.prompt,
      target: request.target,
      status: "pending",
      progress: 0,
      createdAt: new Date()
    };

    this.jobs.set(jobId, job);
    return jobId;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  private async startProcessing() {
    if (this.processing) return;
    this.processing = true;

    while (true) {
      const pendingJob = this.findPendingJob();
      if (pendingJob) {
        await this.processJob(pendingJob);
      } else {
        // No pending jobs, wait a bit
        await this.sleep(1000);
      }
    }
  }

  private findPendingJob(): Job | undefined {
    for (const job of this.jobs.values()) {
      if (job.status === "pending") {
        return job;
      }
    }
    return undefined;
  }

  private async processJob(job: Job) {
    try {
      // Update job status
      job.status = "running";
      job.progress = 10;
      this.jobs.set(job.id, job);

      // Check if LLM is available
      const isAvailable = await this.llmAdapter.isAvailable();
      if (!isAvailable) {
        throw new Error("LLM service is not available");
      }

      job.progress = 30;
      this.jobs.set(job.id, job);

      // Generate code
      const llmResponse = await this.llmAdapter.generateCode(job.prompt, job.target);
      
      job.progress = 80;
      this.jobs.set(job.id, job);

      // Generate git diff
      const gitDiff = this.generateGitDiff(llmResponse.files);

      job.progress = 100;
      job.status = "completed";
      job.result = {
        jobId: job.id,
        files: llmResponse.files,
        gitDiff
      };
      job.completedAt = new Date();
      this.jobs.set(job.id, job);

    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.completedAt = new Date();
      this.jobs.set(job.id, job);
    }
  }

  private generateGitDiff(files: Array<{path: string; content: string}>): string {
    let diff = "";
    
    for (const file of files) {
      diff += `diff --git a/${file.path} b/${file.path}\n`;
      diff += `new file mode 100644\n`;
      diff += `index 0000000..${this.generateFileHash()}\n`;
      diff += `--- /dev/null\n`;
      diff += `+++ b/${file.path}\n`;
      
      const lines = file.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        diff += `+${lines[i]}\n`;
      }
      diff += `\n`;
    }
    
    return diff;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFileHash(): string {
    return Math.random().toString(36).substr(2, 7);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup completed jobs older than 1 hour
  cleanup() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (const [id, job] of this.jobs.entries()) {
      if (job.completedAt && job.completedAt < oneHourAgo) {
        this.jobs.delete(id);
      }
    }
  }
}

// Global job queue instance
export const jobQueue = new JobQueue();

// Cleanup old jobs every hour
setInterval(() => {
  jobQueue.cleanup();
}, 60 * 60 * 1000);
