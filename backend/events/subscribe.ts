import { api } from "encore.dev/api";
import { SubscribeRequest } from "./types";
import { eventBus } from "./publish";

// Subscribes to events from a topic.
export const subscribeToEvents = api<SubscribeRequest, void>(
  { expose: true, method: "POST", path: "/events/subscribe" },
  async (req) => {
    await eventBus.subscribe(req.topic, async (event) => {
      // Forward event to webhook or internal handler
      if (req.webhookUrl) {
        try {
          await fetch(req.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
          });
        } catch (error) {
          console.error('Failed to deliver webhook:', error);
        }
      }
      
      console.log(`Received event on ${req.topic}:`, event);
    });
  }
);
