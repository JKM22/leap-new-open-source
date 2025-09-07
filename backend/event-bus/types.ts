export interface Event {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  version: string;
}

export interface PublishEventRequest {
  topic: string;
  type: string;
  source: string;
  data: Record<string, any>;
  version?: string;
}

export interface SubscribeRequest {
  topic: string;
  webhookUrl?: string;
  groupId?: string;
}

export interface EventBusAdapter {
  publish(topic: string, event: Event): Promise<void>;
  subscribe(topic: string, handler: (event: Event) => Promise<void>): Promise<void>;
  disconnect(): Promise<void>;
}
