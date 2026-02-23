export const reviewKeys = {
  all: ["reviews"] as const,
  byTutor: (tutorId: string, params?: Record<string, unknown>) =>
    [...reviewKeys.all, tutorId, params] as const,
};
