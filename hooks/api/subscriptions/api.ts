import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  maxChildren: number | null;
  includesFreeResources: boolean;
  includesPaidResources: boolean;
  maxResourceDownloads: number;
  hasPrioritySupport: boolean;
  hasAdvancedAnalytics: boolean;
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

export interface SubscriptionChangePreview {
  isUpgrade: boolean;
  isDowngrade: boolean;
  currentPlanName: string;
  targetPlanName: string;
  currentPlanPrice: number;
  targetPlanPrice: number;
  daysRemaining: number;
  totalDays: number;
  creditCents: number;
  amountDueCents: number;
  newExpiresAt: string;
  gainedFeatures: string[];
  lostFeatures: string[];
}

export const subscriptionsApi = {
  listPlans: () => apiClient.get<SubscriptionPlan[]>("/subscriptions/plans"),
  getCurrent: () => apiClient.get<Subscription | null>("/subscriptions/me"),
  create: (body: CreateSubscriptionPayload) =>
    apiClient.post<{ subscription: Subscription; invoiceId: string }>(
      "/subscriptions",
      body,
    ),
  cancel: () => apiClient.post<Subscription>("/subscriptions/cancel"),
  getChangePreview: (planId: string) =>
    apiClient.get<SubscriptionChangePreview>(
      `/payments/subscriptions/change-preview?planId=${planId}`,
    ),
};

export function useSubscriptionChangePreview(planId: string | null) {
  return useQuery({
    queryKey: ["subscriptions", "change-preview", planId],
    queryFn: () => subscriptionsApi.getChangePreview(planId!),
    enabled: !!planId,
    staleTime: 30_000,
  });
}
