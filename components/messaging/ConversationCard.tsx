import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS } from "@/constants/tokens";
import { Avatar, Badge } from "@/components/ui";
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
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        style={[styles.container, unreadCount > 0 && styles.unreadContainer]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Avatar source={participantAvatar} name={participantName} size="lg" />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.name, unreadCount > 0 && styles.unreadName]}
              numberOfLines={1}
            >
              {participantName}
            </Text>
            <Text style={styles.time}>{formatTime(lastMessageTime)}</Text>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                styles.lastMessage,
                unreadCount > 0 && styles.unreadMessage,
              ]}
              numberOfLines={2}
            >
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <Badge
                label={unreadCount > 99 ? "99+" : unreadCount.toString()}
                variant="success"
                size="sm"
                style={styles.unreadBadge}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  unreadContainer: {
    backgroundColor: COLORS.primary[50] + "40",
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING.md,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.neutral.white,
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
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "600",
    flex: 1,
    marginRight: SPACING.sm,
  },
  unreadName: {
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  time: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 18,
    flex: 1,
    marginRight: SPACING.sm,
  },
  unreadMessage: {
    fontWeight: "600",
    color: COLORS.secondary[800],
  },
  unreadBadge: {
    minWidth: 24,
  },
});
