import { apiClient } from "../client";

export interface ChildProgress {
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  scheduledLessons: number;
  improvementPercentage: number;
}

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
  avatarUrl: string | null;
  preferredLanguage: string | null;
  timezone: string | null;
  notificationPreferences: Record<string, unknown> | null;
  privacySettings: Record<string, unknown> | null;
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

export interface UpdateParentProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  preferredLanguage?: string;
  timezone?: string;
  notificationPreferences?: Record<string, unknown>;
  privacySettings?: Record<string, unknown>;
}

export const parentApi = {
  getMe: () => apiClient.get<ParentProfile>("/parents/me"),
  updateProfile: (body: UpdateParentProfilePayload) =>
    apiClient.put<ParentProfile>("/parents/me", body),
  uploadAvatar: (uri: string, fileName: string) => {
    const form = new FormData();
    form.append("avatar", {
      uri,
      name: fileName,
      type: "image/jpeg",
    } as unknown as Blob);
    return apiClient.postForm<ParentProfile>("/parents/me/avatar", form);
  },
  requestDeletion: (reason?: string) =>
    apiClient.post<ParentProfile>("/parents/me/deletion-request", { reason }),
  getChildren: () => apiClient.get<Child[]>("/parents/children"),
  getChild: (id: string) => apiClient.get<Child>(`/parents/children/${id}`),
  getChildProgress: (id: string) =>
    apiClient.get<ChildProgress>(`/parents/children/${id}/progress`),
  createChild: (body: CreateChildPayload) =>
    apiClient.post<Child>("/parents/children", body),
  updateChild: (id: string, body: UpdateChildPayload) =>
    apiClient.put<Child>(`/parents/children/${id}`, body),
  deleteChild: (id: string) => apiClient.del<void>(`/parents/children/${id}`),
  getFavoriteTutors: () => apiClient.get<string[]>("/parents/favorites"),
  addFavoriteTutor: (tutorId: string) =>
    apiClient.post<void>(`/parents/favorites/${tutorId}`, {}),
  removeFavoriteTutor: (tutorId: string) =>
    apiClient.del<void>(`/parents/favorites/${tutorId}`),
};
