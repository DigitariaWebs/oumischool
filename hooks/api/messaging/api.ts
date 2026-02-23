import { apiClient } from "../client";

export interface ConversationParticipant {
  id: string;
  email: string;
  role: string;
  name: string | null;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  participants: ConversationParticipant[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  readAt: string | null;
}

export interface StartConversationPayload {
  participantIds: string[];
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export interface MessagingContact {
  id: string;
  role: string;
  email: string;
  name: string | null;
}

export const messagingApi = {
  listConversations: () => apiClient.get<Conversation[]>("/conversations"),
  getConversation: (id: string) =>
    apiClient.get<Conversation>(`/conversations/${id}`),
  startConversation: (body: StartConversationPayload) =>
    apiClient.post<Conversation>("/conversations", body),
  listContacts: (q?: string) => {
    const qs = q ? `?${new URLSearchParams({ q }).toString()}` : "";
    return apiClient.get<MessagingContact[]>(`/conversations/contacts${qs}`);
  },
  listMessages: (conversationId: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Message[]>(
      `/conversations/${conversationId}/messages${qs}`,
    );
  },
  sendMessage: (body: SendMessagePayload) =>
    apiClient.post<Message>("/messages", body),
  getUnreadCount: () =>
    apiClient.get<{ unreadCount: number }>("/conversations/unread-count"),
  markConversationRead: (id: string) =>
    apiClient.put<void>(`/conversations/${id}/mark-read`),
  markMessageRead: (id: string) => apiClient.post<void>(`/messages/${id}/read`),
};
