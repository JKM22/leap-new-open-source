import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { EventBusAdapter, Event, PublishEventRequest, SubscribeRequest } from "./types";
import { KafkaAdapter, CloudPubSubAdapter, NATSAdapter } from "./adapters";

const eventBusType = secret("EventBusType");
const kafkaBrokers = secret("KafkaBrokers");
const gcpProjectId = secret("GCPProjectId");
const natsServers = secret("NATSServers");

class EventBus {
  private adapter: EventBusAdapter;

  constructor() {
    this.adapter = this.createAdapter();
  }

  private createAdapter(): EventBusAdapter {
    const busType = eventBusType() || 'nats';
    
    switch (busType) {
      case 'kafka':
        const brokers = kafkaBrokers()?.split(',') || ['localhost:9092'];
        return new KafkaAdapter(brokers);
      
      case 'gcp-pubsub':
        const projectId = gcpProjectId() || 'default-project';
        return new CloudPubSubAdapter(projectId);
      
      case 'nats':
      default:
        const servers = natsServers()?.split(',') || ['nats://localhost:4222'];
        return new NATSAdapter(servers);
    }
  }

  async publish(topic: string, event: Event): Promise<void> {
    return this.adapter.publish(topic, event);
  }

  async subscribe(topic: string, handler: (event: Event) => Promise<void>): Promise<void> {
    return this.adapter.subscribe(topic, handler);
  }
}

export const eventBus = new EventBus();

// Publishes an event to the event bus.
export const publishEvent = api<PublishEventRequest, void>(
  { expose: true, method: "POST", path: "/events/publish" },
  async (req) => {
    const event: Event = {
      id: generateEventId(),
      type: req.type,
      source: req.source,
      data: req.data,
      timestamp: new Date(),
      version: req.version || '1.0'
    };

    await eventBus.publish(req.topic, event);
  }
);

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

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
