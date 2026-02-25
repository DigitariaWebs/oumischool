import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ConversationCardProps {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
  onPress: () => void;
  delay?: number;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  participantName,
  participantAvatar,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isOnline = false,
  onPress,
  delay = 0,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Maintenant";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={styles.wrapper}
    >
      <TouchableOpacity
        style={[styles.container, unreadCount > 0 && styles.containerUnread]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: participantAvatar }} style={styles.avatar} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.name, unreadCount > 0 && styles.nameUnread]}
              numberOfLines={1}
            >
              {participantName}
            </Text>
            <Text style={[styles.time, unreadCount > 0 && styles.timeUnread]}>
              {formatTime(lastMessageTime)}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                styles.lastMessage,
                unreadCount > 0 && styles.lastMessageUnread,
              ]}
              numberOfLines={2}
            >
              {lastMessage}
            </Text>
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            ) : (
              <ChevronRight size={16} color="#CBD5E1" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  containerUnread: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  nameUnread: {
    fontWeight: "700",
    color: "#6366F1",
  },
  time: {
    fontSize: 11,
    color: "#94A3B8",
  },
  timeUnread: {
    color: "#6366F1",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    fontWeight: "600",
    color: "#1E293B",
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    color: "white",
    fontWeight: "700",
  },
});
