import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "./api";
import { subjectKeys } from "./keys";

export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.list(),
    queryFn: subjectsApi.list,
    staleTime: 5 * 60 * 1000, // subjects change rarely — cache for 5 minutes
  });
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectsApi.detail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/** Convenience: returns a Map<id, Subject> for fast lookup by ID */
export function useSubjectMap() {
  const { data = [] } = useSubjects();
  return new Map(data.map((s) => [s.id, s]));
}
