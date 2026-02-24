import { apiClient } from "../client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  maxChildren: number | null;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  parentId: string;
  planId: string;
  status: string; // ACTIVE | INACTIVE | CANCELLED | EXPIRED
  startedAt: string;
  expiresAt: string;
  plan: SubscriptionPlan;
}

export interface CreateSubscriptionPayload {
  planId: string;
}

export const subscriptionsApi = {
  listPlans: () => apiClient.get<SubscriptionPlan[]>("/subscriptions/plans"),
  getCurrent: () => apiClient.get<Subscription | null>("/subscriptions/me"),
  cancel: () => apiClient.post<Subscription>("/subscriptions/cancel"),
};
