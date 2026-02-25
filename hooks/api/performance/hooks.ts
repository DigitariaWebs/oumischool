import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { performanceApi, RecordActivityPayload } from "./api";
import { performanceKeys } from "./keys";

export function usePerformance(
  childId: string,
  params?: Record<string, string>,
) {
  return useQuery({
    queryKey: performanceKeys.records(childId, params),
    queryFn: () => performanceApi.getRecords(childId, params),
    enabled: !!childId,
  });
}

export function useActivities(childId: string, limit = 50) {
  return useQuery({
    queryKey: performanceKeys.activities(childId, { limit }),
    queryFn: () => performanceApi.getActivities(childId, limit),
    enabled: !!childId,
  });
}

export function useRecommendations(childId: string) {
  return useQuery({
    queryKey: performanceKeys.recommendations(childId),
    queryFn: () => performanceApi.getRecommendations(childId),
    enabled: !!childId,
  });
}

export function useRecordActivity(childId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RecordActivityPayload) =>
      performanceApi.recordActivity(childId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: performanceKeys.byChild(childId) });
    },
  });
}
