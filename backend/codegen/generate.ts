import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { GenerateCodeRequest, GenerateCodeResponse } from "./types";
import { codeGeneratedEvents } from "./events";

const openAIKey = secret("OpenAIKey");

// Generates code from a natural language prompt using AI.
export const generate = api<GenerateCodeRequest, GenerateCodeResponse>(
  { expose: true, method: "POST", path: "/generate" },
  async (req) => {
    const id = generateId();
    const startTime = Date.now();
    
    try {
      const generatedCode = await generateCodeWithAI(req);
      const endTime = Date.now();
      
      const response: GenerateCodeResponse = {
        id,
        prompt: req.prompt,
        generatedCode,
        metadata: {
          type: req.type,
          framework: req.framework,
          estimatedLines: estimateLines(generatedCode),
          generatedAt: new Date()
        }
      };
      
      // Publish event
      await codeGeneratedEvents.publish({
        id,
        prompt: req.prompt,
        type: req.type,
        timestamp: new Date(),
        generationTimeMs: endTime - startTime,
        success: true
      });
      
      return response;
    } catch (error) {
      // Publish error event
      await codeGeneratedEvents.publish({
        id,
        prompt: req.prompt,
        type: req.type,
        timestamp: new Date(),
        generationTimeMs: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      throw error;
    }
  }
);

async function generateCodeWithAI(req: GenerateCodeRequest) {
  const apiKey = openAIKey();
  
  if (!apiKey) {
    // Fallback to template-based generation
    return generateCodeFromTemplate(req);
  }
  
  try {
    return await generateWithOpenAI(req, apiKey);
  } catch (error) {
    console.warn("OpenAI generation failed, falling back to templates:", error);
    return generateCodeFromTemplate(req);
  }
}

async function generateWithOpenAI(req: GenerateCodeRequest, apiKey: string) {
  const systemPrompt = `You are an expert full-stack developer. Generate clean, production-ready code based on the user's prompt. 
  
  Type: ${req.type}
  Framework: ${req.framework || "React"}
  Style: ${req.style || "functional"}
  Include Tests: ${req.includeTests || false}
  
  Return only the code without explanations.`;
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: req.prompt }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const generatedText = data.choices[0]?.message?.content || "";
  
  return parseGeneratedCode(generatedText, req.type);
}

function generateCodeFromTemplate(req: GenerateCodeRequest) {
  // Template-based fallback generation
  switch (req.type) {
    case "component":
      return generateComponentTemplate(req);
    case "service":
      return generateServiceTemplate(req);
    case "full-app":
      return generateFullAppTemplate(req);
    default:
      throw new Error(`Unsupported generation type: ${req.type}`);
  }
}

function generateComponentTemplate(req: GenerateCodeRequest) {
  const componentName = extractComponentName(req.prompt) || "MyComponent";
  
  const frontend = `import React from 'react';

interface ${componentName}Props {
  // Add props here based on: ${req.prompt}
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">${componentName}</h2>
      {/* Implementation based on: ${req.prompt} */}
    </div>
  );
};

export default ${componentName};`;

  const tests = req.includeTests ? `import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});` : undefined;

  return {
    frontend,
    tests,
    documentation: `# ${componentName}\n\nGenerated component based on: ${req.prompt}`
  };
}

function generateServiceTemplate(req: GenerateCodeRequest) {
  const serviceName = extractServiceName(req.prompt) || "myservice";
  
  const backend = `import { api } from "encore.dev/api";

interface ${capitalize(serviceName)}Request {
  // Define request structure based on: ${req.prompt}
}

interface ${capitalize(serviceName)}Response {
  // Define response structure based on: ${req.prompt}
}

// ${req.prompt}
export const ${serviceName}Handler = api<${capitalize(serviceName)}Request, ${capitalize(serviceName)}Response>(
  { expose: true, method: "POST", path: "/${serviceName}" },
  async (req) => {
    // Implementation based on: ${req.prompt}
    return {
      // Return appropriate response
    };
  }
);`;

  const tests = req.includeTests ? `import { describe, it, expect } from 'vitest';
// Add tests for ${serviceName}Handler

describe('${serviceName}Handler', () => {
  it('should handle requests correctly', async () => {
    // Test implementation
  });
});` : undefined;

  return {
    backend,
    tests,
    documentation: `# ${capitalize(serviceName)} Service\n\nGenerated service based on: ${req.prompt}`
  };
}

function generateFullAppTemplate(req: GenerateCodeRequest) {
  const appName = extractAppName(req.prompt) || "MyApp";
  
  const frontend = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 py-6">${appName}</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes based on: ${req.prompt} */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to ${appName}</h2>
        <p className="text-gray-600">Generated based on: ${req.prompt}</p>
      </div>
    </div>
  );
}

export default App;`;

  const backend = `import { Service } from "encore.dev/service";

export default new Service("${appName.toLowerCase()}");

// Add API endpoints based on: ${req.prompt}`;

  return {
    frontend,
    backend,
    documentation: `# ${appName}\n\nFull-stack application generated based on: ${req.prompt}`
  };
}

function parseGeneratedCode(text: string, type: string) {
  // Simple parsing - in production would use more sophisticated parsing
  const sections = text.split('```');
  
  const result: any = {};
  
  for (let i = 1; i < sections.length; i += 2) {
    const codeBlock = sections[i];
    const lines = codeBlock.split('\n');
    const language = lines[0].toLowerCase();
    const code = lines.slice(1).join('\n');
    
    if (language.includes('tsx') || language.includes('jsx') || language.includes('react')) {
      result.frontend = code;
    } else if (language.includes('ts') || language.includes('javascript')) {
      result.backend = code;
    } else if (language.includes('test')) {
      result.tests = code;
    }
  }
  
  return result;
}

function extractComponentName(prompt: string): string | null {
  const match = prompt.match(/(?:component|create|build)\s+(?:a\s+)?([A-Z][a-zA-Z]+)/i);
  return match ? capitalize(match[1]) : null;
}

function extractServiceName(prompt: string): string | null {
  const match = prompt.match(/(?:service|api|endpoint)\s+(?:for\s+)?([a-zA-Z]+)/i);
  return match ? match[1].toLowerCase() : null;
}

function extractAppName(prompt: string): string | null {
  const match = prompt.match(/(?:app|application)\s+(?:for\s+)?([a-zA-Z\s]+)/i);
  return match ? match[1].trim().replace(/\s+/g, '') : null;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function estimateLines(code: any): number {
  let total = 0;
  Object.values(code).forEach(content => {
    if (typeof content === 'string') {
      total += content.split('\n').length;
    }
  });
  return total;
}
