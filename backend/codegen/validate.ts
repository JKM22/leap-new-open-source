import { api } from "encore.dev/api";
import { ValidateCodeRequest, ValidateCodeResponse } from "./types";

// Validates generated code for syntax errors and provides suggestions.
export const validate = api<ValidateCodeRequest, ValidateCodeResponse>(
  { expose: true, method: "POST", path: "/validate" },
  async (req) => {
    try {
      const result = await validateCode(req.code, req.language);
      return result;
    } catch (error) {
      return {
        valid: false,
        errors: [{
          line: 1,
          column: 1,
          message: error instanceof Error ? error.message : "Validation failed",
          severity: "error"
        }],
        suggestions: ["Check syntax and try again"]
      };
    }
  }
);

async function validateCode(code: string, language: string): Promise<ValidateCodeResponse> {
  const errors: ValidateCodeResponse['errors'] = [];
  const suggestions: string[] = [];
  
  // Basic syntax validation
  if (language === "typescript" || language === "javascript") {
    // Check for common syntax issues
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Check for missing semicolons (basic check)
      if (line.trim().length > 0 && 
          !line.trim().endsWith(';') && 
          !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') &&
          !line.trim().startsWith('//') &&
          !line.trim().startsWith('*') &&
          !line.includes('import ') &&
          !line.includes('export ')) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: "Missing semicolon",
          severity: "warning"
        });
      }
      
      // Check for unclosed brackets
      const openBrackets = (line.match(/\{/g) || []).length;
      const closeBrackets = (line.match(/\}/g) || []).length;
      
      if (openBrackets !== closeBrackets && line.trim().length > 0) {
        // This is a simplistic check - real validation would track across lines
        if (openBrackets > closeBrackets) {
          suggestions.push("Check for unclosed brackets");
        }
      }
    }
    
    // TypeScript specific checks
    if (language === "typescript") {
      if (!code.includes('interface') && !code.includes('type') && code.includes('function')) {
        suggestions.push("Consider adding TypeScript type annotations");
      }
    }
    
    // React specific checks
    if (code.includes('React') || code.includes('jsx') || code.includes('tsx')) {
      if (!code.includes('import React')) {
        errors.push({
          line: 1,
          column: 1,
          message: "Missing React import",
          severity: "error"
        });
      }
      
      if (code.includes('useState') && !code.includes('import') && !code.includes('useState')) {
        suggestions.push("Import useState from React");
      }
    }
    
    // Encore.ts specific checks
    if (code.includes('api(') && !code.includes('import') && !code.includes('encore.dev/api')) {
      errors.push({
        line: 1,
        column: 1,
        message: "Missing Encore.ts API import",
        severity: "error"
      });
    }
  }
  
  // General suggestions
  if (code.length > 1000) {
    suggestions.push("Consider breaking this into smaller functions or components");
  }
  
  if (!code.includes('//') && !code.includes('/*')) {
    suggestions.push("Add comments to improve code readability");
  }
  
  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors,
    suggestions
  };
}
