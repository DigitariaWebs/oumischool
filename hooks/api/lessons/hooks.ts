import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "./api";
import { lessonKeys } from "./keys";

export function useTutorLessonSeries(tutorId: string) {
  return useQuery({
    queryKey: lessonKeys.byTutor(tutorId),
    queryFn: () => lessonsApi.listSeriesByTutor(tutorId),
    enabled: !!tutorId,
  });
}

export function useLessonSeries(id: string) {
  return useQuery({
    queryKey: lessonKeys.seriesDetail(id),
    queryFn: () => lessonsApi.getSeries(id),
    enabled: !!id,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => lessonsApi.getLesson(id),
    enabled: !!id,
  });
}
