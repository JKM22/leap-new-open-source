import { Topic } from "encore.dev/pubsub";

export interface NoteCreatedEvent {
  noteId: number;
  userId: number;
  timestamp: Date;
}

export interface NoteUpdatedEvent {
  noteId: number;
  userId: number;
  timestamp: Date;
}

export interface NoteDeletedEvent {
  noteId: number;
  userId: number;
  timestamp: Date;
}

export const noteCreatedTopic = new Topic<NoteCreatedEvent>("notes.created", {
  deliveryGuarantee: "at-least-once"
});

export const noteUpdatedTopic = new Topic<NoteUpdatedEvent>("notes.updated", {
  deliveryGuarantee: "at-least-once"
});

export const noteDeletedTopic = new Topic<NoteDeletedEvent>("notes.deleted", {
  deliveryGuarantee: "at-least-once"
});
