export const messagingKeys = {
  all: ["messaging"] as const,
  conversations: () => [...messagingKeys.all, "conversations"] as const,
  conversation: (id: string) =>
    [...messagingKeys.all, "conversation", id] as const,
  contacts: (q?: string) =>
    q
      ? ([...messagingKeys.all, "contacts", q] as const)
      : ([...messagingKeys.all, "contacts"] as const),
  messages: (conversationId: string, params?: Record<string, unknown>) =>
    params
      ? ([...messagingKeys.all, "messages", conversationId, params] as const)
      : ([...messagingKeys.all, "messages", conversationId] as const),
  unread: () => [...messagingKeys.all, "unread"] as const,
};
