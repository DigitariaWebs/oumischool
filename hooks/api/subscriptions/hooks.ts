import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi, CreateSubscriptionPayload } from "./api";
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

export function useSubscriptionInvoices(params?: Record<string, string>) {
  return useQuery({
    queryKey: subscriptionKeys.invoices(params),
    queryFn: () => subscriptionsApi.listInvoices(params),
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSubscriptionPayload) =>
      subscriptionsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
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
