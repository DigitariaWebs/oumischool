export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: Record<string, unknown>) =>
    [...notificationKeys.all, "list", params] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
};
