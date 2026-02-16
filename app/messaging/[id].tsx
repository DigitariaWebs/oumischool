import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Avatar, LoadingState } from "@/components/ui";

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

// Mock participant data
const mockParticipant = {
  id: "tutor-1",
  name: "Marie Dupont",
  avatar: "https://via.placeholder.com/100",
  role: "tutor",
  isOnline: true,
};

// Mock messages
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
    content:
      "Bonjour Marie, je voudrais planifier une séance de maths pour Emma.",
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
    content:
      "Absolument ! Les fractions sont mon domaine de prédilection. Je vous propose demain à 14h ?",
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
    content:
      "Avec plaisir ! Je vais préparer quelques exercices adaptés à son niveau.",
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to bottom on mount
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

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate tutor response (mock)
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

  const handleAttachment = () => {
    console.log("Open attachment picker");
  };

  const handleImagePick = () => {
    console.log("Open image picker");
  };

  const handleCall = () => {
    console.log("Start audio call");
  };

  const handleVideoCall = () => {
    console.log("Start video call");
  };

  if (isLoading) {
    return <LoadingState message="Chargement de la conversation..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>

        <View style={styles.participantInfo}>
          <Avatar
            source={mockParticipant.avatar}
            name={mockParticipant.name}
            size="sm"
          />
          <View style={styles.participantText}>
            <Text style={styles.participantName}>{mockParticipant.name}</Text>
            <Text style={styles.participantStatus}>
              {mockParticipant.isOnline ? "En ligne" : "Hors ligne"}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Phone size={20} color={COLORS.secondary[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleVideoCall}
            activeOpacity={0.7}
          >
            <Video size={20} color={COLORS.secondary[600]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MoreVertical size={20} color={COLORS.secondary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
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
              attachment={item.attachment}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Message Composer */}
        <MessageComposer
          onSend={handleSendMessage}
          onAttachment={handleAttachment}
          onImagePick={handleImagePick}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    gap: SPACING.sm,
  },
  backButton: {
    padding: SPACING.xs,
  },
  participantInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  participantText: {
    flex: 1,
  },
  participantName: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
  },
  participantStatus: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: SPACING.md,
  },
});
