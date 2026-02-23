import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentMethodsApi, CreatePaymentMethodPayload } from "./api";
import { paymentMethodKeys } from "./keys";

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.list(),
    queryFn: paymentMethodsApi.list,
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePaymentMethodPayload) =>
      paymentMethodsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
  });
}
