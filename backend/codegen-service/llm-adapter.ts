export interface LLMAdapter {
  generateCode(prompt: string, target: string): Promise<LLMResponse>;
  isAvailable(): Promise<boolean>;
}

export interface LLMResponse {
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  explanation?: string;
}

export class OpenAIAdapter implements LLMAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(prompt: string, target: string): Promise<LLMResponse> {
    // TODO: Insert your OpenAI API key in the secret configuration
    /*
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a code generator. Generate ${target} code based on the user's prompt. Return code in a structured format with file paths and content.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";
    
    return this.parseGeneratedContent(generatedText, target);
    */

    // Fallback template-based generation for demo
    return this.generateTemplate(prompt, target);
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  private parseGeneratedContent(content: string, target: string): LLMResponse {
    // Parse the generated content to extract files
    const files: Array<{path: string; content: string; language: string}> = [];
    
    // Simple parsing logic - in production, this would be more sophisticated
    const codeBlocks = content.split('```');
    
    for (let i = 1; i < codeBlocks.length; i += 2) {
      const block = codeBlocks[i];
      const lines = block.split('\n');
      const language = lines[0].toLowerCase();
      const code = lines.slice(1).join('\n');
      
      const path = this.inferFilePath(language, target);
      files.push({
        path,
        content: code,
        language
      });
    }
    
    return { files };
  }

  private generateTemplate(prompt: string, target: string): LLMResponse {
    const files: Array<{path: string; content: string; language: string}> = [];
    
    switch (target) {
      case "frontend":
        files.push({
          path: "src/App.tsx",
          content: this.generateReactTemplate(prompt),
          language: "tsx"
        });
        break;
      case "backend":
        files.push({
          path: "api/service.ts",
          content: this.generateBackendTemplate(prompt),
          language: "typescript"
        });
        break;
      case "sql":
        files.push({
          path: "schema.sql",
          content: this.generateSQLTemplate(prompt),
          language: "sql"
        });
        break;
      case "infra":
        files.push({
          path: "infrastructure.yml",
          content: this.generateInfraTemplate(prompt),
          language: "yaml"
        });
        break;
    }
    
    return { files };
  }

  private generateReactTemplate(prompt: string): string {
    return `import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  // Generated based on: ${prompt}
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Generated App</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This component was generated based on: "${prompt}"
          </p>
          {/* Add your implementation here */}
        </div>
      </div>
    </div>
  );
}

export default App;`;
  }

  private generateBackendTemplate(prompt: string): string {
    return `import { api } from "encore.dev/api";

interface Request {
  // Define based on: ${prompt}
}

interface Response {
  // Define based on: ${prompt}
}

// Generated API endpoint based on: ${prompt}
export const handler = api<Request, Response>(
  { expose: true, method: "POST", path: "/api/generated" },
  async (req) => {
    // Implementation based on: ${prompt}
    
    return {
      // Return response
    };
  }
);`;
  }

  private generateSQLTemplate(prompt: string): string {
    return `-- Generated SQL schema based on: ${prompt}

CREATE TABLE generated_table (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_generated_table_name ON generated_table(name);
CREATE INDEX idx_generated_table_created_at ON generated_table(created_at);

-- Add any additional tables or constraints based on the prompt`;
  }

  private generateInfraTemplate(prompt: string): string {
    return `# Generated infrastructure configuration based on: ${prompt}

services:
  app:
    image: node:18
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`;
  }

  private inferFilePath(language: string, target: string): string {
    const extensions: Record<string, string> = {
      typescript: ".ts",
      tsx: ".tsx",
      javascript: ".js",
      jsx: ".jsx",
      sql: ".sql",
      yaml: ".yml",
      python: ".py",
      go: ".go"
    };

    const ext = extensions[language] || ".txt";
    
    switch (target) {
      case "frontend":
        return `src/component${ext}`;
      case "backend":
        return `api/handler${ext}`;
      case "sql":
        return `schema${ext}`;
      case "infra":
        return `docker-compose${ext}`;
      default:
        return `generated${ext}`;
    }
  }
}

export class LocalLLMAdapter implements LLMAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  async generateCode(prompt: string, target: string): Promise<LLMResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "codellama",
        prompt: `Generate ${target} code for: ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Local LLM error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseLocalLLMResponse(data.response, target);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private parseLocalLLMResponse(content: string, target: string): LLMResponse {
    // Similar parsing logic as OpenAI adapter
    return {
      files: [{
        path: `generated.${target}`,
        content,
        language: target
      }]
    };
  }
}
