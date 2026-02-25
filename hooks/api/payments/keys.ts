export const paymentKeys = {
  all: ["payments"] as const,
  methods: () => [...paymentKeys.all, "methods"] as const,
  method: (id: string) => [...paymentKeys.all, "method", id] as const,
  history: (params?: Record<string, unknown>) =>
    [...paymentKeys.all, "history", params] as const,
  orders: () => [...paymentKeys.all, "orders"] as const,
  order: (id: string) => [...paymentKeys.all, "order", id] as const,
};
