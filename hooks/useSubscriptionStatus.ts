import {
  useCurrentSubscription,
  Subscription,
} from "@/hooks/api/subscriptions";

interface UseSubscriptionStatusResult {
  hasActiveSubscription: boolean;
  isLoading: boolean;
  subscription: Subscription | null;
  plan: Subscription["plan"] | null;
}

export function useSubscriptionStatus(): UseSubscriptionStatusResult {
  const { data: subscription, isLoading } = useCurrentSubscription();

  const hasActiveSubscription =
    subscription !== null &&
    subscription !== undefined &&
    subscription.status === "ACTIVE" &&
    new Date(subscription.expiresAt).getTime() > Date.now();

  return {
    hasActiveSubscription,
    isLoading,
    subscription: subscription ?? null,
    plan: subscription?.plan ?? null,
  };
}
