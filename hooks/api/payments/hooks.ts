import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi, AddPaymentMethodPayload, CheckoutPayload } from "./api";
import { paymentKeys } from "./keys";

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: paymentsApi.listMethods,
  });
}

export function usePaymentHistory(params?: Record<string, string>) {
  return useQuery({
    queryKey: paymentKeys.history(params),
    queryFn: () => paymentsApi.listPayments(params),
  });
}

export function useAddPaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddPaymentMethodPayload) =>
      paymentsApi.addMethod(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentsApi.deleteMethod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CheckoutPayload) => paymentsApi.checkout(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentKeys.history() });
    },
  });
}
