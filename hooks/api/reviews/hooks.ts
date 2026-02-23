import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, SubmitReviewPayload } from "./api";
import { reviewKeys } from "./keys";

export function useTutorReviews(tutorId: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: reviewKeys.byTutor(tutorId, params),
    queryFn: () => reviewsApi.listForTutor(tutorId, params),
    enabled: !!tutorId,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmitReviewPayload) => reviewsApi.submit(body),
    onSuccess: (_data, { tutorId }) => {
      qc.invalidateQueries({ queryKey: reviewKeys.byTutor(tutorId) });
    },
  });
}
