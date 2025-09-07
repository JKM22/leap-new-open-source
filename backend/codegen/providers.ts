import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { ListProvidersResponse, AIProvider } from "./types";

const openAIKey = secret("OpenAIKey");

// Lists available AI providers and their status.
export const listProviders = api<void, ListProvidersResponse>(
  { expose: true, method: "GET", path: "/providers" },
  async () => {
    const providers: AIProvider[] = [
      {
        id: "openai",
        name: "OpenAI",
        type: "openai",
        available: !!openAIKey(),
        models: ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"]
      },
      {
        id: "local-llm",
        name: "Local LLM",
        type: "local",
        available: await checkLocalLLMAvailability(),
        models: ["llama2", "codellama", "mistral"]
      }
    ];
    
    return { providers };
  }
);

async function checkLocalLLMAvailability(): Promise<boolean> {
  try {
    // Check if Ollama or other local LLM service is running
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}
