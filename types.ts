/**
 * Calendar event data
 */
export interface Event {
  /** Name of the event. */
  title: string;
  /** The starting date for the event. */
  startDate: string;
  /** The closing date for the event. */
  endDate?: string;
  /** Description of the event. */
  description?: string;
  /** Tells whether the event is all day. */
  allDay?: boolean;
  /** Location of the event. */
  location?: string;
  /** Recurrence rules for the event. */
  rRule?: string;
  /** The organizer of the event. */
  organizer?: Organizer;
  /** Tells whether the event is available. */
  busy?: boolean;
  /** Invited guests' emails. */
  guests?: string[];
  /** A more dynamic rendition of the event information. */
  url?: string;
}

/**
 * An event organizer
 */
export interface Organizer {
  /** The name of the organizer. */
  name: string;
  /** The email of the organizer. */
  email: string;
}

/**
 * Client type
 */
export type Client = "google" | "outlook" | "office365" | "yahoo" | "ics";
