import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Conversation,
  Message,
  messagingApi,
  SendMessagePayload,
  StartConversationPayload,
} from "./api";
import { messagingKeys } from "./keys";
import { isValidConversationId } from "./realtime";

interface MessagingQueryOptions {
  enabled?: boolean;
}

export function useConversations(options?: MessagingQueryOptions) {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: messagingApi.listConversations,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useConversation(id: string, options?: MessagingQueryOptions) {
  const enabled = isValidConversationId(id) && (options?.enabled ?? true);
  return useQuery({
    queryKey: messagingKeys.conversation(id),
    queryFn: () => messagingApi.getConversation(id),
    enabled,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useMessagingContacts(q?: string) {
  return useQuery({
    queryKey: messagingKeys.contacts(q),
    queryFn: () => messagingApi.listContacts(q),
  });
}

export function useMessages(
  conversationId: string,
  params?: Record<string, string>,
  options?: MessagingQueryOptions,
) {
  const enabled =
    isValidConversationId(conversationId) && (options?.enabled ?? true);
  return useQuery({
    queryKey: messagingKeys.messages(conversationId, params),
    queryFn: () => messagingApi.listMessages(conversationId, params),
    enabled,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUnreadCount(options?: MessagingQueryOptions) {
  return useQuery({
    queryKey: messagingKeys.unread(),
    queryFn: messagingApi.getUnreadCount,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StartConversationPayload) =>
      messagingApi.startConversation(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SendMessagePayload) => messagingApi.sendMessage(body),
    onSuccess: (_data, { conversationId }) => {
      qc.invalidateQueries({
        queryKey: messagingKeys.messages(conversationId),
      });
      qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
      qc.invalidateQueries({ queryKey: messagingKeys.unread() });
    },
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagingApi.markConversationRead(id),
    onSuccess: (_data, id) => {
      const nowIso = new Date().toISOString();
      let clearedUnread = 0;

      qc.setQueryData<Conversation[]>(messagingKeys.conversations(), (rows) => {
        if (!Array.isArray(rows)) return rows;
        return rows.map((row) => {
          if (row.id !== id) return row;
          clearedUnread = row.unreadCount ?? 0;
          return { ...row, unreadCount: 0 };
        });
      });

      qc.setQueryData<Conversation>(messagingKeys.conversation(id), (row) => {
        if (!row) return row;
        if (!clearedUnread) clearedUnread = row.unreadCount ?? 0;
        return { ...row, unreadCount: 0 };
      });

      qc.setQueriesData<Message[]>(
        { queryKey: messagingKeys.messages(id) },
        (rows) => {
          if (!Array.isArray(rows)) return rows;
          return rows.map((row) =>
            row.readAt ? row : { ...row, readAt: nowIso },
          );
        },
      );

      qc.setQueryData<{ unreadCount: number }>(
        messagingKeys.unread(),
        (row) => {
          if (!row || typeof row.unreadCount !== "number") return row;
          return { unreadCount: Math.max(0, row.unreadCount - clearedUnread) };
        },
      );
    },
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagingApi.markMessageRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: messagingKeys.unread() });
    },
  });
}
