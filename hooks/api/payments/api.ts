import { apiClient } from "../client";

export interface PaymentMethod {
  id: string;
  parentId: string;
  type: string;
  last4: string | null;
  expiryDate: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export interface AddPaymentMethodPayload {
  type: string;
  last4?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

export interface CheckoutPayload {
  amount: number;
  currency?: string;
  description?: string;
  paymentMethodId?: string;
}

export const paymentsApi = {
  listMethods: () => apiClient.get<PaymentMethod[]>("/payment-methods"),
  addMethod: (body: AddPaymentMethodPayload) =>
    apiClient.post<PaymentMethod>("/payment-methods", body),
  deleteMethod: (id: string) => apiClient.del<void>(`/payment-methods/${id}`),
  listPayments: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Payment[]>(`/payments/me${qs}`);
  },
  checkout: (body: CheckoutPayload) =>
    apiClient.post<Payment>("/payments/checkout", body),
};
