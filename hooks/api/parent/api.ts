import { apiClient } from "../client";

export interface Child {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string | null;
  parentId: string;
}

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  userId: string;
  notes: string | null;
}

export interface CreateChildPayload {
  name: string;
  dateOfBirth: string;
  grade: string;
}

export interface UpdateChildPayload {
  name?: string;
  dateOfBirth?: string;
  grade?: string;
}

export const parentApi = {
  getMe: () => apiClient.get<ParentProfile>("/parents/me"),
  getChildren: () => apiClient.get<Child[]>("/parents/children"),
  getChild: (id: string) => apiClient.get<Child>(`/parents/children/${id}`),
  createChild: (body: CreateChildPayload) =>
    apiClient.post<Child>("/parents/children", body),
  updateChild: (id: string, body: UpdateChildPayload) =>
    apiClient.put<Child>(`/parents/children/${id}`, body),
  deleteChild: (id: string) =>
    apiClient.del<void>(`/parents/children/${id}`),
};
