import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Shield,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import {
  isValidConversationId,
  useConversation,
  useMarkConversationRead,
  useMessages,
  useSendMessage,
} from "@/hooks/api/messaging";
import { useAppSelector } from "@/store/hooks";
import { useMessagingSocket } from "@/components/providers/MessagingSocketProvider";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  isOwn: boolean;
  isRead: boolean;
  attachment?: {
    type: "image" | "file";
    url: string;
    name?: string;
  };
}

// Images pour les avatars
const avatarImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

const markReadCooldownByConversation = new Map<string, number>();
const MARK_READ_COOLDOWN_MS = 10_000;

function avatarFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return avatarImages[sum % avatarImages.length];
}

export default function MessageThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawConversationId = Array.isArray(params.id) ? params.id[0] : params.id;
  const conversationId = isValidConversationId(rawConversationId)
    ? rawConversationId
    : undefined;
  const isFocused = useIsFocused();
  const { joinConversation, leaveConversation } = useMessagingSocket();
  const { data: conversation } = useConversation(conversationId ?? "", {
    enabled: isFocused,
  });
  const { data: messagesData = [] } = useMessages(
    conversationId ?? "",
    {
      limit: "100",
    },
    { enabled: isFocused },
  );
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const sendMessage = useSendMessage();
  const { mutate: markConversationRead } = useMarkConversationRead();
  const flatListRef = useRef<FlatList>(null);
  const markedConversationRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const participant = conversation?.participants[0];
  const participantDisplay = {
    id: participant?.id ?? "unknown",
    name: participant?.name || participant?.email || "Conversation",
    avatar: avatarFor(participant?.id ?? "unknown"),
    isOnline: false,
  };
  const hasUnreadForCurrentUser =
    !!conversation &&
    ((conversation.unreadCount ?? 0) > 0 ||
      (Array.isArray(messagesData) &&
        messagesData.some(
          (message) => message.senderId !== currentUserId && !message.readAt,
        )));

  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation]);

  useEffect(() => {
    if (!conversationId || !hasUnreadForCurrentUser) return;
    const now = Date.now();
    const lastMarkedAt =
      markReadCooldownByConversation.get(conversationId) ?? 0;
    if (now - lastMarkedAt < MARK_READ_COOLDOWN_MS) return;
    markReadCooldownByConversation.set(conversationId, now);
    if (markedConversationRef.current === conversationId) return;
    markedConversationRef.current = conversationId;
    markConversationRead(conversationId);
  }, [conversationId, hasUnreadForCurrentUser, markConversationRead]);

  useEffect(() => {
    const rows = Array.isArray(messagesData) ? messagesData : [];
    const mapped = rows.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: new Date(message.sentAt),
      senderId: message.senderId,
      isOwn: message.senderId === currentUserId,
      isRead: !!message.readAt,
    }));
    setMessages(mapped);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [currentUserId, messagesData]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: currentUserId ?? "me",
      isOwn: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    await sendMessage.mutateAsync({ conversationId, content }).catch(() => {});

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.participantInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: participantDisplay.avatar }}
              style={styles.avatar}
            />
            {participantDisplay.isOnline && <View style={styles.onlineDot} />}
          </View>
          <View>
            <Text style={styles.participantName}>
              {participantDisplay.name}
            </Text>
            <Text style={styles.participantStatus}>
              {participantDisplay.isOnline ? "En ligne" : "Hors ligne"}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Video size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badge sécurité */}
      <View style={styles.securityBadge}>
        <Shield size={12} color="#10B981" />
        <Text style={styles.securityText}>Conversation chiffrée</Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              id={item.id}
              content={item.content}
              timestamp={item.timestamp}
              isOwn={item.isOwn}
              senderName={item.isOwn ? undefined : participantDisplay.name}
              senderAvatar={item.isOwn ? undefined : participantDisplay.avatar}
              isRead={item.isRead}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <MessageComposer onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  participantInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 8,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  participantName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  participantStatus: {
    fontSize: 12,
    color: "#64748B",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Security Badge
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#D1FAE5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 20,
    alignSelf: "center",
  },
  securityText: {
    fontSize: 11,
    color: "#065F46",
    fontWeight: "500",
  },

  // Content
  content: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
