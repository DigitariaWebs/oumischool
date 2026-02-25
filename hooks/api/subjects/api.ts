import { apiClient } from "../client";

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  createdAt: string;
}

export const subjectsApi = {
  list: () => apiClient.get<Subject[]>("/subjects"),
  detail: (id: string) => apiClient.get<Subject>(`/subjects/${id}`),
};
