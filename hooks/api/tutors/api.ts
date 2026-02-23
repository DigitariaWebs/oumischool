import { apiClient } from "../client";

export interface TutorUser {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface TutorListItem {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number;
  subjects: string[];
  location: string | null;
  rating: number;
  reviewsCount: number;
  user: TutorUser;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TutorUpdatePayload {
  bio?: string;
  hourlyRate?: number;
  subjects?: string[];
  languages?: string[];
  location?: string;
  experience?: string;
  qualifications?: string[];
  sessionPricing?: Record<string, unknown>;
}

export interface CreateAvailabilityPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const tutorApi = {
  list: (params?: {
    subject?: string;
    minRating?: number;
    maxPrice?: number;
  }) => {
    const qs = params
      ? `?${new URLSearchParams(params as Record<string, string>)}`
      : "";
    return apiClient.get<TutorListItem[]>(`/tutors${qs}`);
  },
  detail: (id: string) => apiClient.get<TutorListItem>(`/tutors/${id}`),
  availability: (id: string) =>
    apiClient.get<AvailabilitySlot[]>(`/tutors/${id}/availability`),
  lessons: (id: string) => apiClient.get<unknown[]>(`/tutors/${id}/lessons`),
  reviews: (tutorId: string) =>
    apiClient.get<unknown[]>(`/tutors/${tutorId}/reviews`),
  // Tutor-self endpoints
  updateMe: (body: TutorUpdatePayload) =>
    apiClient.put<TutorListItem>("/tutors/me", body),
  getMyStudents: () => apiClient.get<unknown[]>("/tutors/me/students"),
  getMySessions: () => apiClient.get<unknown[]>("/tutors/me/sessions"),
  getMyEarnings: () =>
    apiClient.get<{ total: number; thisMonth: number }>("/tutors/me/earnings"),
  addAvailability: (body: CreateAvailabilityPayload) =>
    apiClient.post<AvailabilitySlot>("/tutors/me/availability", body),
  updateAvailability: (id: string, body: CreateAvailabilityPayload) =>
    apiClient.put<AvailabilitySlot>(`/tutors/me/availability/${id}`, body),
  deleteAvailability: (id: string) =>
    apiClient.del<void>(`/tutors/me/availability/${id}`),
};
