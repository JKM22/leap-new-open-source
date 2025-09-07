export interface GenerateCodeRequest {
  prompt: string;
  type: "component" | "service" | "full-app";
  framework?: "react" | "vue" | "angular";
  style?: "functional" | "class-based";
  includeTests?: boolean;
}

export interface GenerateCodeResponse {
  id: string;
  prompt: string;
  generatedCode: {
    frontend?: string;
    backend?: string;
    tests?: string;
    documentation?: string;
  };
  metadata: {
    type: string;
    framework?: string;
    estimatedLines: number;
    generatedAt: Date;
  };
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  type: "component" | "service" | "full-app";
  framework: string;
  template: string;
  variables: string[];
}

export interface ListTemplatesResponse {
  templates: CodeTemplate[];
}

export interface ValidateCodeRequest {
  code: string;
  language: "typescript" | "javascript" | "python";
}

export interface ValidateCodeResponse {
  valid: boolean;
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: "error" | "warning";
  }>;
  suggestions: string[];
}

export interface AIProvider {
  id: string;
  name: string;
  type: "openai" | "anthropic" | "local";
  available: boolean;
  models: string[];
}

export interface ListProvidersResponse {
  providers: AIProvider[];
}
