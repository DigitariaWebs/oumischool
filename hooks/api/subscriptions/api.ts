import { apiClient } from "../client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  maxChildren: number | null;
  maxSessions: number | null;
}

export interface Subscription {
  id: string;
  parentId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string | null;
  cancelledAt: string | null;
  plan: SubscriptionPlan;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
  paymentMethodId?: string;
}

export const subscriptionsApi = {
  listPlans: () => apiClient.get<SubscriptionPlan[]>("/subscriptions/plans"),
  getCurrent: () => apiClient.get<Subscription>("/subscriptions/me"),
  create: (body: CreateSubscriptionPayload) =>
    apiClient.post<Subscription>("/subscriptions", body),
  cancel: () => apiClient.post<Subscription>("/subscriptions/cancel"),
  listInvoices: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Invoice[]>(`/subscriptions/invoices/me${qs}`);
  },
};
