export const lessonKeys = {
  all: ["lessons"] as const,
  series: () => [...lessonKeys.all, "series"] as const,
  seriesDetail: (id: string) => [...lessonKeys.all, "series", id] as const,
  byTutor: (tutorId: string) => [...lessonKeys.all, "tutor", tutorId] as const,
  detail: (id: string) => [...lessonKeys.all, "detail", id] as const,
};
