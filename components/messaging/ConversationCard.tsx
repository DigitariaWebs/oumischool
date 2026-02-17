import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { Avatar, Badge } from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";

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
  const { isDark } = useTheme();
  const styles = createStyles(isDark, unreadCount > 0);

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
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.wrapper}
    >
      <TouchableOpacity
        style={styles.container}
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
            <View style={styles.timeContainer}>
              <Text style={[styles.time, unreadCount > 0 && styles.unreadTime]}>
                {formatTime(lastMessageTime)}
              </Text>
            </View>
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
            {unreadCount > 0 ? (
              <View style={styles.unreadBadgeContainer}>
                <Badge
                  label={unreadCount > 99 ? "99+" : unreadCount.toString()}
                  variant="success"
                  size="sm"
                  style={styles.unreadBadge}
                />
              </View>
            ) : (
              <ChevronRight
                size={18}
                color={isDark ? COLORS.neutral[600] : COLORS.neutral[400]}
              />
            )}
          </View>
        </View>

        {/* Accent bar for unread */}
        {unreadCount > 0 && <View style={styles.accentBar} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (isDark: boolean, hasUnread: boolean) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: SPACING.lg,
      marginBottom: SPACING.sm,
    },
    container: {
      flexDirection: "row",
      padding: SPACING.md,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      shadowColor: hasUnread ? COLORS.primary.DEFAULT : "#000",
      shadowOffset: { width: 0, height: hasUnread ? 4 : 2 },
      shadowOpacity: isDark ? 0.3 : hasUnread ? 0.15 : 0.06,
      shadowRadius: hasUnread ? 12 : 8,
      elevation: hasUnread ? 4 : 2,
      borderWidth: 1,
      borderColor: isDark
        ? hasUnread
          ? COLORS.primary.DEFAULT + "40"
          : COLORS.neutral[700]
        : hasUnread
          ? COLORS.primary.DEFAULT + "30"
          : COLORS.neutral[200],
      position: "relative",
      overflow: "hidden",
    },
    accentBar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: COLORS.primary.DEFAULT,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
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
      borderWidth: 3,
      borderColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    name: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      fontWeight: "600",
      flex: 1,
      marginRight: SPACING.sm,
    },
    unreadName: {
      fontWeight: "700",
      color: isDark ? COLORS.neutral[50] : COLORS.secondary[900],
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    time: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
    },
    unreadTime: {
      color: COLORS.primary.DEFAULT,
      fontWeight: "600",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    lastMessage: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      lineHeight: 20,
      flex: 1,
      marginRight: SPACING.sm,
    },
    unreadMessage: {
      fontWeight: "600",
      color: isDark ? COLORS.neutral[200] : COLORS.secondary[800],
    },
    unreadBadgeContainer: {
      marginLeft: SPACING.xs,
    },
    unreadBadge: {
      minWidth: 24,
    },
  });
