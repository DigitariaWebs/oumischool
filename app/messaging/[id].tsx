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
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Shield,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { MessageComposer } from "@/components/messaging/MessageComposer";

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

const mockParticipant = {
  id: "tutor-1",
  name: "Marie Dupont",
  avatar: avatarImages[0],
  role: "tutor",
  isOnline: true,
};

const mockMessages: Message[] = [
  {
    id: "msg-1",
    content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    senderId: "tutor-1",
    isOwn: false,
    isRead: true,
  },
  {
    id: "msg-2",
    content: "Bonjour Marie, je voudrais planifier une séance de maths pour Emma.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    senderId: "parent-1",
    isOwn: true,
    isRead: true,
  },
  {
    id: "msg-3",
    content: "Bien sûr ! Emma a des difficultés sur un sujet en particulier ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    senderId: "tutor-1",
    isOwn: false,
    isRead: true,
  },
  {
    id: "msg-4",
    content: "Oui, elle a du mal avec les fractions. Pouvez-vous l'aider ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    senderId: "parent-1",
    isOwn: true,
    isRead: true,
  },
  {
    id: "msg-5",
    content: "Absolument ! Je vous propose demain à 14h ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    senderId: "tutor-1",
    isOwn: false,
    isRead: true,
  },
  {
    id: "msg-6",
    content: "Parfait ! Merci beaucoup.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    senderId: "parent-1",
    isOwn: true,
    isRead: true,
  },
  {
    id: "msg-7",
    content: "Avec plaisir ! Je prépare quelques exercices adaptés.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    senderId: "tutor-1",
    isOwn: false,
    isRead: false,
  },
];

export default function MessageThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: "parent-1",
      isOwn: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const response: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "Message reçu ! Je vous réponds dans un instant.",
        timestamp: new Date(),
        senderId: "tutor-1",
        isOwn: false,
        isRead: false,
      };
      setMessages((prev) => [...prev, response]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.participantInfo}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: mockParticipant.avatar }} style={styles.avatar} />
            {mockParticipant.isOnline && <View style={styles.onlineDot} />}
          </View>
          <View>
            <Text style={styles.participantName}>{mockParticipant.name}</Text>
            <Text style={styles.participantStatus}>
              {mockParticipant.isOnline ? "En ligne" : "Hors ligne"}
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
              senderName={item.isOwn ? undefined : mockParticipant.name}
              senderAvatar={item.isOwn ? undefined : mockParticipant.avatar}
              isRead={item.isRead}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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