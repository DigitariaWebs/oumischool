import { apiClient } from "../client";

export interface RequestSessionPayload {
  tutorId: string;
  childId: string;
  childrenIds?: string[];
  startTime: string;
  endTime: string;
  subjectId?: string;
  seriesId?: string;
  lessonId?: string;
  mode?: "online" | "presential";
  type?: "individual" | "group";
  recurring?: boolean;
}

export interface Session {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  mode: string;
  type: string;
  tutorId: string;
  childId: string;
  subjectId: string | null;
}

export const sessionApi = {
  list: () => apiClient.get<Session[]>("/sessions"),
  detail: (id: string) => apiClient.get<Session>(`/sessions/${id}`),
  request: (body: RequestSessionPayload) =>
    apiClient.post<Session>("/sessions/request", body),
  accept: (id: string) => apiClient.post<Session>(`/sessions/${id}/accept`),
  reject: (id: string) => apiClient.post<Session>(`/sessions/${id}/reject`),
  schedule: (id: string) =>
    apiClient.post<Session>(`/sessions/${id}/schedule`),
  cancel: (id: string) => apiClient.post<Session>(`/sessions/${id}/cancel`),
  complete: (id: string) =>
    apiClient.post<Session>(`/sessions/${id}/complete`),
};
