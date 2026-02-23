export const paymentMethodKeys = {
  all: ["payment-methods"] as const,
  list: () => [...paymentMethodKeys.all, "list"] as const,
};
