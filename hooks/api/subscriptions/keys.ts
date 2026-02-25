export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  current: () => [...subscriptionKeys.all, "current"] as const,
  invoices: (params?: Record<string, unknown>) =>
    [...subscriptionKeys.all, "invoices", params] as const,
};
