export interface Event {
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  allDay?: boolean;
  location?: string;
  rRule?: string;
  organizer?: {
    name: string;
    email?: string;
  };
  busy?: boolean;
  guests?: string[];
  url?: string;
}

export type Client = "google" | "outlook" | "office365" | "yahoo" | "ics";
