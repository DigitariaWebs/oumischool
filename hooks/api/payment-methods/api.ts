import { apiClient } from "../client";

export interface PaymentMethod {
  id: string;
  parentId: string;
  type: string; // card | paypal | bank
  last4: string | null;
  expiryDate: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodPayload {
  type: string;
  last4?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

export const paymentMethodsApi = {
  list: () => apiClient.get<PaymentMethod[]>("/payment-methods"),
  create: (body: CreatePaymentMethodPayload) =>
    apiClient.post<PaymentMethod>("/payment-methods", body),
  delete: (id: string) => apiClient.del<void>(`/payment-methods/${id}`),
};
