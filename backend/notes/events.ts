import { Topic } from "encore.dev/pubsub";
import { Note } from "./types";

export interface NoteEvent {
  type: "created" | "updated" | "deleted";
  noteId: string;
  timestamp: Date;
  data: Note;
}

export const noteEvents = new Topic<NoteEvent>("note-events", {
  deliveryGuarantee: "at-least-once"
});
