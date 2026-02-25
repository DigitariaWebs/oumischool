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

export interface StripeCustomerResponse {
  customerId: string;
  ephemeralKeySecret: string;
  publishableKey: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  orderId: string;
  amount: number;
  sessionId?: string;
}

export interface Order {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    description: string;
    unitAmount: number;
    quantity: number;
    resourceId?: string;
    sessionId?: string;
  }>;
}

export interface SessionIntentPayload {
  tutorId: string;
  childId?: string;
  childrenIds?: string[];
  startTime: string;
  endTime: string;
  subjectId?: string;
  seriesId?: string;
  lessonId?: string;
  mode?: "online" | "presential";
  type?: "individual" | "group";
  recurring?: boolean;
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

  // Stripe PaymentSheet flows
  getCustomer: () =>
    apiClient.post<StripeCustomerResponse>("/payments/customer"),
  createSessionIntent: (body: SessionIntentPayload) =>
    apiClient.post<PaymentIntentResponse>(
      "/payments/sessions/create-intent",
      body,
    ),
  createResourceIntent: (body: { resourceId: string }) =>
    apiClient.post<PaymentIntentResponse>(
      "/payments/resources/create-intent",
      body,
    ),
  createSubscriptionIntent: (body: { planId: string }) =>
    apiClient.post<PaymentIntentResponse>(
      "/payments/subscriptions/create-intent",
      body,
    ),
  getOrder: (orderId: string) =>
    apiClient.get<Order>(`/payments/orders/${orderId}`),
  listOrders: () => apiClient.get<Order[]>("/payments/orders"),
};
