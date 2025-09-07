export interface GenerateRequest {
  prompt: string;
  target: "frontend" | "backend" | "infra" | "sql";
}

export interface GenerateResponse {
  jobId: string;
  files: GeneratedFile[];
  gitDiff: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface JobStatusRequest {
  id: string;
}

export interface JobStatusResponse {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  result?: GenerateResponse;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Job {
  id: string;
  prompt: string;
  target: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  result?: GenerateResponse;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}
