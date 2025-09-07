import { describe, it, expect, vi } from 'vitest';
import { OpenAIAdapter, LocalLLMAdapter } from './llm-adapter';

// Mock fetch
global.fetch = vi.fn();

describe('LLM Adapters', () => {
  describe('OpenAIAdapter', () => {
    let adapter: OpenAIAdapter;

    beforeEach(() => {
      adapter = new OpenAIAdapter('test-api-key');
      vi.clearAllMocks();
    });

    it('should generate template code when API key is present', async () => {
      const result = await adapter.generateCode('Create a button', 'frontend');
      
      expect(result.files).toHaveLength(1);
      expect(result.files[0].path).toBe('src/App.tsx');
      expect(result.files[0].content).toContain('Generated based on: Create a button');
      expect(result.files[0].language).toBe('tsx');
    });

    it('should generate backend template', async () => {
      const result = await adapter.generateCode('Create an API', 'backend');
      
      expect(result.files).toHaveLength(1);
      expect(result.files[0].path).toBe('api/service.ts');
      expect(result.files[0].content).toContain('encore.dev/api');
      expect(result.files[0].language).toBe('typescript');
    });

    it('should generate SQL template', async () => {
      const result = await adapter.generateCode('Create a users table', 'sql');
      
      expect(result.files).toHaveLength(1);
      expect(result.files[0].path).toBe('schema.sql');
      expect(result.files[0].content).toContain('CREATE TABLE');
      expect(result.files[0].language).toBe('sql');
    });

    it('should check availability based on API key', async () => {
      expect(await adapter.isAvailable()).toBe(true);
      
      const emptyAdapter = new OpenAIAdapter('');
      expect(await emptyAdapter.isAvailable()).toBe(false);
    });
  });

  describe('LocalLLMAdapter', () => {
    let adapter: LocalLLMAdapter;

    beforeEach(() => {
      adapter = new LocalLLMAdapter();
      vi.clearAllMocks();
    });

    it('should check availability with timeout', async () => {
      // Mock successful response
      (global.fetch as any).mockResolvedValue({
        ok: true
      });

      const available = await adapter.isAvailable();
      expect(available).toBe(true);
    });

    it('should return false when service is unavailable', async () => {
      // Mock network error
      (global.fetch as any).mockRejectedValue(new Error('Connection refused'));

      const available = await adapter.isAvailable();
      expect(available).toBe(false);
    });

    it('should generate code using local LLM', async () => {
      // Mock successful generation
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          response: 'Generated code content'
        })
      });

      const result = await adapter.generateCode('Create a function', 'backend');
      
      expect(result.files).toHaveLength(1);
      expect(result.files[0].content).toBe('Generated code content');
    });
  });
});
