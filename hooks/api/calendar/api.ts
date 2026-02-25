import { apiClient } from "../client";

export interface CalendarEvent {
  id: string;
  childId: string | null;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  type: string;
  sessionId: string | null;
}

export interface CreateCalendarEventPayload {
  childId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type?: string;
}

export interface UpdateCalendarEventPayload {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

export const calendarApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<CalendarEvent[]>(`/calendar/events${qs}`);
  },
  create: (body: CreateCalendarEventPayload) =>
    apiClient.post<CalendarEvent>("/calendar/events", body),
  update: (id: string, body: UpdateCalendarEventPayload) =>
    apiClient.put<CalendarEvent>(`/calendar/events/${id}`, body),
  delete: (id: string) => apiClient.del<void>(`/calendar/events/${id}`),
};
