export const tutorKeys = {
  all: ["tutors"] as const,
  lists: () => [...tutorKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...tutorKeys.lists(), params] as const,
  detail: (id: string) => [...tutorKeys.all, "detail", id] as const,
  availability: (id: string) =>
    [...tutorKeys.detail(id), "availability"] as const,
  lessons: (id: string) => [...tutorKeys.detail(id), "lessons"] as const,
  reviews: (id: string) => [...tutorKeys.detail(id), "reviews"] as const,
  myStudents: () => [...tutorKeys.all, "me", "students"] as const,
  mySessions: () => [...tutorKeys.all, "me", "sessions"] as const,
  myEarnings: () => [...tutorKeys.all, "me", "earnings"] as const,
  myAvailability: () => [...tutorKeys.all, "me", "availability"] as const,
  myProfile: () => [...tutorKeys.all, "me"] as const,
  myResources: () => [...tutorKeys.all, "me", "resources"] as const,
  myRevenue: () => [...tutorKeys.all, "me", "revenue"] as const,
  myPayouts: () => [...tutorKeys.all, "me", "payouts"] as const,
};
