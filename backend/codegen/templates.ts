import { api } from "encore.dev/api";
import { ListTemplatesResponse, CodeTemplate } from "./types";

// Lists all available code generation templates.
export const listTemplates = api<void, ListTemplatesResponse>(
  { expose: true, method: "GET", path: "/templates" },
  async () => {
    const templates: CodeTemplate[] = [
      {
        id: "react-component",
        name: "React Component",
        description: "Basic React functional component with TypeScript",
        type: "component",
        framework: "react",
        template: "react-functional-component",
        variables: ["componentName", "props"]
      },
      {
        id: "encore-service",
        name: "Encore.ts Service",
        description: "REST API service with Encore.ts",
        type: "service",
        framework: "encore",
        template: "encore-api-service",
        variables: ["serviceName", "endpoints"]
      },
      {
        id: "crud-app",
        name: "CRUD Application",
        description: "Full-stack CRUD application with React and Encore.ts",
        type: "full-app",
        framework: "react-encore",
        template: "full-stack-crud",
        variables: ["appName", "entityName", "fields"]
      },
      {
        id: "dashboard",
        name: "Dashboard Application",
        description: "Analytics dashboard with charts and data visualization",
        type: "full-app",
        framework: "react-encore",
        template: "analytics-dashboard",
        variables: ["appName", "metrics", "dataSources"]
      },
      {
        id: "note-taking",
        name: "Note Taking App",
        description: "Simple note-taking application with tags and search",
        type: "full-app",
        framework: "react-encore",
        template: "note-taking-app",
        variables: ["appName", "features"]
      }
    ];
    
    return { templates };
  }
);
