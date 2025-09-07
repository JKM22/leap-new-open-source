import { api } from "encore.dev/api";
import { Subscription } from "encore.dev/pubsub";
import { noteCreatedTopic, noteUpdatedTopic, noteDeletedTopic } from "../notes-service/events";

interface WebSocketHandshake {}

interface WebSocketMessage {
  type: string;
  data: Record<string, any>;
}

interface WebSocketConnection {
  id: string;
  userId?: string;
  send: (data: WebSocketMessage) => Promise<void>;
}

class WebSocketManager {
  private connections = new Map<string, WebSocketConnection>();

  addConnection(connection: WebSocketConnection) {
    this.connections.set(connection.id, connection);
  }

  removeConnection(connectionId: string) {
    this.connections.delete(connectionId);
  }

  async broadcast(data: WebSocketMessage, filter?: (conn: WebSocketConnection) => boolean) {
    const connections = Array.from(this.connections.values());
    const targetConnections = filter ? connections.filter(filter) : connections;
    
    await Promise.all(
      targetConnections.map(async (conn) => {
        try {
          await conn.send(data);
        } catch (error) {
          console.error(`Failed to send to connection ${conn.id}:`, error);
          this.removeConnection(conn.id);
        }
      })
    );
  }
}

export const wsManager = new WebSocketManager();

// Subscribe to note events and broadcast to WebSocket clients
new Subscription(noteCreatedTopic, "websocket-note-created", {
  handler: async (event) => {
    await wsManager.broadcast({
      type: 'note.created',
      data: {
        noteId: event.noteId,
        userId: event.userId,
        timestamp: event.timestamp
      }
    });
  }
});

new Subscription(noteUpdatedTopic, "websocket-note-updated", {
  handler: async (event) => {
    await wsManager.broadcast({
      type: 'note.updated',
      data: {
        noteId: event.noteId,
        userId: event.userId,
        timestamp: event.timestamp
      }
    });
  }
});

new Subscription(noteDeletedTopic, "websocket-note-deleted", {
  handler: async (event) => {
    await wsManager.broadcast({
      type: 'note.deleted',
      data: {
        noteId: event.noteId,
        userId: event.userId,
        timestamp: event.timestamp
      }
    });
  }
});

// WebSocket endpoint for real-time updates
export const websocketStream = api.streamInOut<WebSocketHandshake, WebSocketMessage>(
  { expose: true, path: "/ws" },
  async (stream) => {
    const connectionId = generateConnectionId();
    
    const connection: WebSocketConnection = {
      id: connectionId,
      send: async (data) => {
        await stream.send(data);
      }
    };
    
    wsManager.addConnection(connection);
    
    try {
      // Keep connection alive and handle incoming messages
      for await (const message of stream) {
        // Handle client messages if needed
        console.log('Received message from client:', message);
      }
    } finally {
      wsManager.removeConnection(connectionId);
    }
  }
);

function generateConnectionId(): string {
  return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
