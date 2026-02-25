export const sessionKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...sessionKeys.lists(), params] as const,
  detail: (id: string) => [...sessionKeys.all, "detail", id] as const,
};
