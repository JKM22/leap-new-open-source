import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generate } from './generate';
import { GenerateRequest } from './models';

// Mock the job queue
vi.mock('./job-queue', () => ({
  jobQueue: {
    addJob: vi.fn(() => 'mock-job-id'),
    getJob: vi.fn()
  }
}));

// Mock the rate limiter
vi.mock('./rate-limiter', () => ({
  rateLimiter: {
    checkLimit: vi.fn(() => ({ allowed: true, remaining: 9, resetTime: Date.now() + 60000 }))
  }
}));

import { jobQueue } from './job-queue';
import { rateLimiter } from './rate-limiter';

describe('CodeGen Service - Generate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate prompt is required', async () => {
    const request: GenerateRequest = {
      prompt: '',
      target: 'frontend'
    };

    await expect(generate(request)).rejects.toThrow('Prompt is required');
  });

  it('should validate target is valid', async () => {
    const request = {
      prompt: 'Create a component',
      target: 'invalid' as any
    };

    await expect(generate(request)).rejects.toThrow('Invalid target');
  });

  it('should respect rate limits', async () => {
    // Mock rate limit exceeded
    (rateLimiter.checkLimit as any).mockReturnValue({
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + 30000
    });

    const request: GenerateRequest = {
      prompt: 'Create a component',
      target: 'frontend'
    };

    await expect(generate(request)).rejects.toThrow('Rate limit exceeded');
  });

  it('should handle successful code generation', async () => {
    // Mock successful job completion
    const mockJob = {
      id: 'mock-job-id',
      status: 'completed',
      result: {
        jobId: 'mock-job-id',
        files: [{
          path: 'src/Component.tsx',
          content: 'export const Component = () => <div>Hello</div>;',
          language: 'tsx'
        }],
        gitDiff: 'diff --git a/src/Component.tsx b/src/Component.tsx...'
      }
    };

    (jobQueue.getJob as any).mockReturnValue(mockJob);

    const request: GenerateRequest = {
      prompt: 'Create a React component',
      target: 'frontend'
    };

    const result = await generate(request);

    expect(result.jobId).toBe('mock-job-id');
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('src/Component.tsx');
    expect(result.gitDiff).toContain('diff --git');
  });

  it('should handle job failure', async () => {
    // Mock failed job
    const mockJob = {
      id: 'mock-job-id',
      status: 'failed',
      error: 'LLM service unavailable'
    };

    (jobQueue.getJob as any).mockReturnValue(mockJob);

    const request: GenerateRequest = {
      prompt: 'Create a component',
      target: 'frontend'
    };

    await expect(generate(request)).rejects.toThrow('Code generation failed: LLM service unavailable');
  });
});
