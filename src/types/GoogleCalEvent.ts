type GoogleCalEvent = {
  created?: string;
  creator?: object;
  description?: string;
  end?: object;
  etag?: string;
  eventType?: string;
  htmlLink?: string;
  iCalUID?: string;
  id?: string;
  kind?: string;
  location?: string;
  organizer?: object;
  reminders?: object;
  start?: object;
  status?: string;
  summary?: string;
  updated?: string;
  attendees?: [];
};

export type { GoogleCalEvent };
