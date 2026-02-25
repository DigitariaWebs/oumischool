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
  isActive: boolean;
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

export interface TutorStudentRow {
  child: {
    id: string;
    name: string;
    grade: string;
    dateOfBirth?: string | null;
    avgScore?: number;
    attendanceRate?: number;
    avatar?: string | null;
  };
  parent: {
    id: string;
    firstName?: string;
    lastName?: string;
    user?: { email?: string };
  };
  sessionsTotal: number;
  nextSessionAt: string | null;
  progressScore: number;
  attendanceRate: number;
  primarySubject?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface TutorSessionRow {
  id: string;
  childId: string;
  parentId: string;
  tutorId: string;
  subjectId: string | null;
  startTime: string;
  endTime: string;
  status: string;
  mode: string;
  child?: {
    id: string;
    name?: string;
    grade?: string;
    avatar?: string | null;
    user?: { firstName?: string; lastName?: string; email?: string };
  };
  parent?: {
    id: string;
    firstName?: string;
    lastName?: string;
    user?: { email?: string };
  };
  subject?: {
    id: string;
    name: string;
    color: string;
    icon?: string | null;
  } | null;
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
  getMe: () => apiClient.get<TutorListItem>("/tutors/me"),
  getMyResources: () => apiClient.get<TutorListItem[]>("/tutors/me/resources"),
  getMyStudents: () => apiClient.get<TutorStudentRow[]>("/tutors/me/students"),
  getMySessions: () => apiClient.get<TutorSessionRow[]>("/tutors/me/sessions"),
  getMyEarnings: () =>
    apiClient.get<{ total: number; thisMonth: number }>("/tutors/me/earnings"),
  getMyAvailability: () =>
    apiClient.get<AvailabilitySlot[]>("/tutors/me/availability"),
  addAvailability: (body: CreateAvailabilityPayload) =>
    apiClient.post<AvailabilitySlot>("/tutors/me/availability", body),
  updateAvailability: (id: string, body: CreateAvailabilityPayload) =>
    apiClient.put<AvailabilitySlot>(`/tutors/me/availability/${id}`, body),
  deleteAvailability: (id: string) =>
    apiClient.del<void>(`/tutors/me/availability/${id}`),
  toggleAvailability: (id: string) =>
    apiClient.patch<AvailabilitySlot>(`/tutors/me/availability/${id}/toggle`),
};
