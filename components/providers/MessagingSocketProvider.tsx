import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

import { useAppSelector } from "@/store/hooks";
import { getToken } from "@/hooks/api/client";
import { Conversation, Message } from "@/hooks/api/messaging";
import { messagingKeys } from "@/hooks/api/messaging/keys";
import {
  isValidConversationId,
  resolveMessagingSocketUrl,
} from "@/hooks/api/messaging/realtime";

interface MessagingSocketContextValue {
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

const MessagingSocketContext = createContext<MessagingSocketContextValue>({
  joinConversation: () => {},
  leaveConversation: () => {},
});

function upsertConversation(
  rows: Conversation[] | undefined,
  next: Conversation,
): Conversation[] {
  if (!Array.isArray(rows)) return [next];
  const index = rows.findIndex((row) => row.id === next.id);
  if (index < 0) return [next, ...rows];
  const clone = rows.slice();
  clone[index] = next;
  return clone;
}

function upsertMessage(rows: Message[] | undefined, next: Message): Message[] {
  if (!Array.isArray(rows)) return [next];
  const index = rows.findIndex((row) => row.id === next.id);
  if (index < 0) return [...rows, next];
  const clone = rows.slice();
  clone[index] = next;
  return clone;
}

export function MessagingSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());
  const qc = useQueryClient();
  const authToken = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return undefined;
    }

    const onConversationUpdated = (payload: {
      conversation?: Conversation;
    }) => {
      if (!payload?.conversation) return;
      qc.setQueryData<Conversation[]>(messagingKeys.conversations(), (rows) =>
        upsertConversation(rows, payload.conversation as Conversation),
      );
    };

    const onMessageCreated = (payload: {
      conversationId?: string;
      message?: Message;
    }) => {
      if (!payload?.conversationId || !payload.message) return;
      qc.setQueryData<Message[]>(
        messagingKeys.messages(payload.conversationId),
        (rows) => upsertMessage(rows, payload.message as Message),
      );
      qc.invalidateQueries({
        queryKey: messagingKeys.messages(payload.conversationId),
      });
      qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
      qc.invalidateQueries({ queryKey: messagingKeys.unread() });
    };

    const onConversationRead = (payload: { conversationId?: string }) => {
      if (!payload?.conversationId) return;
      qc.invalidateQueries({
        queryKey: messagingKeys.messages(payload.conversationId),
      });
      qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
      qc.invalidateQueries({ queryKey: messagingKeys.unread() });
    };

    const onMessageRead = (payload: {
      conversationId?: string;
      messageId?: string;
      readAt?: string;
    }) => {
      if (!payload?.conversationId || !payload.messageId || !payload.readAt) {
        return;
      }
      qc.setQueryData<Message[]>(
        messagingKeys.messages(payload.conversationId),
        (rows) => {
          if (!Array.isArray(rows)) return rows;
          return rows.map((message) =>
            message.id === payload.messageId
              ? { ...message, readAt: payload.readAt! }
              : message,
          );
        },
      );
      qc.invalidateQueries({
        queryKey: messagingKeys.messages(payload.conversationId),
      });
      qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
      qc.invalidateQueries({ queryKey: messagingKeys.unread() });
    };

    const onUnreadUpdated = (payload: { unreadCount?: number }) => {
      qc.setQueryData(messagingKeys.unread(), {
        unreadCount:
          typeof payload?.unreadCount === "number" ? payload.unreadCount : 0,
      });
    };

    void (async () => {
      const token = authToken || (await getToken());
      if (!token || cancelled) return;

      const socket = io(resolveMessagingSocketUrl(), {
        transports: ["websocket"],
        auth: { token },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        joinedRoomsRef.current.forEach((conversationId) => {
          socket.emit("conversation:join", conversationId);
        });
      });
      socket.on("conversation:updated", onConversationUpdated);
      socket.on("message:created", onMessageCreated);
      socket.on("conversation:read", onConversationRead);
      socket.on("message:read", onMessageRead);
      socket.on("unread:updated", onUnreadUpdated);
    })();

    return () => {
      cancelled = true;
      const socket = socketRef.current;
      if (socket) {
        socket.off("conversation:updated", onConversationUpdated);
        socket.off("message:created", onMessageCreated);
        socket.off("conversation:read", onConversationRead);
        socket.off("message:read", onMessageRead);
        socket.off("unread:updated", onUnreadUpdated);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [authToken, isAuthenticated, qc]);

  const joinConversation = useCallback((conversationId: string) => {
    if (!isValidConversationId(conversationId)) return;
    joinedRoomsRef.current.add(conversationId);
    socketRef.current?.emit("conversation:join", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (!isValidConversationId(conversationId)) return;
    joinedRoomsRef.current.delete(conversationId);
    socketRef.current?.emit("conversation:leave", conversationId);
  }, []);

  const value = useMemo(
    () => ({
      joinConversation,
      leaveConversation,
    }),
    [joinConversation, leaveConversation],
  );

  return (
    <MessagingSocketContext.Provider value={value}>
      {children}
    </MessagingSocketContext.Provider>
  );
}

export function useMessagingSocket(): MessagingSocketContextValue {
  return useContext(MessagingSocketContext);
}
