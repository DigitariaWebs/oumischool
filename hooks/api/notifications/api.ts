import { apiClient } from "../client";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Notification[]>(`/notifications${qs}`);
  },
  markRead: (id: string) =>
    apiClient.post<Notification>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post<void>("/notifications/read-all"),
};
