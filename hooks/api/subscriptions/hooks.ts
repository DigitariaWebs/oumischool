import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import { subscriptionKeys } from "./keys";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: subscriptionsApi.listPlans,
  });
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: subscriptionsApi.getCurrent,
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionsApi.cancel(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
}
