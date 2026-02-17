import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Shield,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Avatar, LoadingState } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";

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
  const { isDark } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isLoading] = useState(false);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

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
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={22}
            color={isDark ? COLORS.neutral[100] : COLORS.secondary[900]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.participantInfo} activeOpacity={0.7}>
          <View style={styles.avatarWrapper}>
            <Avatar
              source={mockParticipant.avatar}
              name={mockParticipant.name}
              size="sm"
            />
            {mockParticipant.isOnline && (
              <View style={styles.onlineIndicator} />
            )}
          </View>
          <View style={styles.participantText}>
            <Text style={styles.participantName}>{mockParticipant.name}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: mockParticipant.isOnline
                      ? COLORS.success
                      : COLORS.neutral[400],
                  },
                ]}
              />
              <Text style={styles.participantStatus}>
                {mockParticipant.isOnline ? "En ligne" : "Hors ligne"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Phone
              size={18}
              color={isDark ? COLORS.neutral[300] : COLORS.secondary[600]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleVideoCall}
            activeOpacity={0.7}
          >
            <Video
              size={18}
              color={isDark ? COLORS.neutral[300] : COLORS.secondary[600]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MoreVertical
              size={18}
              color={isDark ? COLORS.neutral[300] : COLORS.secondary[600]}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Security Badge */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400).springify()}
        style={styles.securityBadgeContainer}
      >
        <View style={styles.securityBadge}>
          <Shield size={12} color="#10B981" />
          <Text style={styles.securityBadgeText}>
            Conversation chiffrée de bout en bout
          </Text>
        </View>
      </Animated.View>

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

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : COLORS.neutral[50],
    },
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: isDark ? 0.1 : 0.3,
    },
    blob1: {
      width: 150,
      height: 150,
      backgroundColor: "#8B5CF6",
      top: -50,
      right: -30,
    },
    blob2: {
      width: 100,
      height: 100,
      backgroundColor: "#6366F1",
      top: 20,
      left: -20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: isDark
        ? COLORS.neutral[800] + "E6"
        : COLORS.neutral.white + "F2",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
      gap: SPACING.sm,
      marginHorizontal: SPACING.md,
      marginTop: SPACING.xs,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
    },
    participantInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    avatarWrapper: {
      position: "relative",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: COLORS.success,
      borderWidth: 2,
      borderColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
    },
    participantText: {
      flex: 1,
    },
    participantName: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    participantStatus: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[500],
    },
    headerActions: {
      flexDirection: "row",
      gap: 6,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
    },
    securityBadgeContainer: {
      alignItems: "center",
      paddingVertical: SPACING.sm,
    },
    securityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: isDark ? "#10B98120" : "#10B98115",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    securityBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#10B981",
      fontWeight: "500",
    },
    content: {
      flex: 1,
    },
    messagesList: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xs,
    },
  });
