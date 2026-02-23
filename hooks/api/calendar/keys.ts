export const calendarKeys = {
  all: ["calendar"] as const,
  events: (params?: Record<string, unknown>) =>
    [...calendarKeys.all, "events", params] as const,
  event: (id: string) => [...calendarKeys.all, "event", id] as const,
};
