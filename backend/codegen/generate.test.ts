import { describe, it, expect, vi } from 'vitest';
import { generate } from './generate';

// Mock the secret function
vi.mock('encore.dev/config', () => ({
  secret: vi.fn(() => () => 'mock-api-key')
}));

// Mock the events
vi.mock('./events', () => ({
  codeGeneratedEvents: {
    publish: vi.fn()
  }
}));

// Mock fetch for OpenAI API
global.fetch = vi.fn();

describe('Code Generation API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a React component', async () => {
    const request = {
      prompt: 'Create a button component',
      type: 'component' as const,
      framework: 'react' as const,
      includeTests: true
    };

    const result = await generate(request);
    
    expect(result.id).toBeDefined();
    expect(result.prompt).toBe(request.prompt);
    expect(result.generatedCode.frontend).toContain('export');
    expect(result.generatedCode.tests).toBeDefined();
    expect(result.metadata.type).toBe('component');
  });

  it('should generate an Encore.ts service', async () => {
    const request = {
      prompt: 'Create a user service with CRUD operations',
      type: 'service' as const,
      includeTests: true
    };

    const result = await generate(request);
    
    expect(result.generatedCode.backend).toContain('api');
    expect(result.generatedCode.backend).toContain('encore.dev/api');
    expect(result.metadata.type).toBe('service');
  });

  it('should generate a full-stack application', async () => {
    const request = {
      prompt: 'Build a simple todo application',
      type: 'full-app' as const,
      framework: 'react' as const
    };

    const result = await generate(request);
    
    expect(result.generatedCode.frontend).toBeDefined();
    expect(result.generatedCode.backend).toBeDefined();
    expect(result.generatedCode.documentation).toBeDefined();
    expect(result.metadata.type).toBe('full-app');
  });

  it('should handle template fallback when OpenAI fails', async () => {
    // Mock fetch to throw an error
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const request = {
      prompt: 'Create a component',
      type: 'component' as const,
      framework: 'react' as const
    };

    const result = await generate(request);
    
    // Should still generate code using templates
    expect(result.generatedCode.frontend).toBeDefined();
    expect(result.metadata.type).toBe('component');
  });
});
