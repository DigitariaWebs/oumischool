import { apiClient } from "../client";

export interface Review {
  id: string;
  tutorId: string;
  parentId: string;
  sessionId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface SubmitReviewPayload {
  tutorId: string;
  sessionId?: string;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  listForTutor: (tutorId: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Review[]>(`/tutors/${tutorId}/reviews${qs}`);
  },
  submit: (body: SubmitReviewPayload) =>
    apiClient.post<Review>("/reviews", body),
};
