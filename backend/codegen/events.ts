import { Topic } from "encore.dev/pubsub";

export interface CodeGeneratedEvent {
  id: string;
  prompt: string;
  type: "component" | "service" | "full-app";
  timestamp: Date;
  generationTimeMs: number;
  success: boolean;
  error?: string;
}

export const codeGeneratedEvents = new Topic<CodeGeneratedEvent>("code-generated", {
  deliveryGuarantee: "at-least-once"
});
