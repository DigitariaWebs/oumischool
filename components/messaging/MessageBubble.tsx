import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Check, CheckCheck } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS } from "@/constants/tokens";
import Animated, { FadeInRight, FadeInLeft } from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";

interface MessageBubbleProps {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
  attachment?: {
    type: "image" | "file";
    url: string;
    name?: string;
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isOwn,
  senderName,
  senderAvatar,
  isRead,
  attachment,
}) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark, isOwn);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Animated.View
      entering={isOwn ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
      style={styles.container}
    >
      {!isOwn && senderAvatar && (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: senderAvatar }} style={styles.avatar} />
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        {!isOwn && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        <View style={styles.bubble}>
          {attachment && attachment.type === "image" && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: attachment.url }}
                style={styles.imageAttachment}
                resizeMode="cover"
              />
            </View>
          )}

          {content && <Text style={styles.text}>{content}</Text>}

          <View style={styles.footer}>
            <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
            {isOwn && (
              <View style={styles.readStatusContainer}>
                {isRead ? (
                  <CheckCheck size={14} color="rgba(255,255,255,0.8)" />
                ) : (
                  <Check size={14} color="rgba(255,255,255,0.6)" />
                )}
              </View>
            )}
          </View>
        </View>

        {/* Bubble tail */}
        <View style={styles.bubbleTail} />
      </View>
    </Animated.View>
  );
};

const createStyles = (isDark: boolean, isOwn: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginBottom: SPACING.md,
      paddingHorizontal: SPACING.md,
      justifyContent: isOwn ? "flex-end" : "flex-start",
    },
    avatarContainer: {
      marginRight: SPACING.xs,
      alignSelf: "flex-end",
      marginBottom: 4,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    bubbleWrapper: {
      maxWidth: "78%",
      position: "relative",
    },
    senderName: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      marginBottom: 4,
      marginLeft: SPACING.sm,
      fontWeight: "600",
    },
    bubble: {
      borderRadius: 18,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      backgroundColor: isOwn
        ? "#6366F1"
        : isDark
          ? COLORS.neutral[800]
          : COLORS.neutral.white,
      ...(isOwn
        ? {
            borderBottomRightRadius: 6,
          }
        : {
            borderBottomLeftRadius: 6,
          }),
      ...(!isOwn && {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.08,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
      }),
      ...(isOwn && {
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }),
    },
    bubbleTail: {
      position: "absolute",
      bottom: 0,
      width: 0,
      height: 0,
      ...(isOwn
        ? {
            right: -4,
            borderLeftWidth: 8,
            borderLeftColor: "#6366F1",
            borderTopWidth: 8,
            borderTopColor: "transparent",
            borderBottomWidth: 0,
          }
        : {
            left: -4,
            borderRightWidth: 8,
            borderRightColor: isDark
              ? COLORS.neutral[800]
              : COLORS.neutral.white,
            borderTopWidth: 8,
            borderTopColor: "transparent",
            borderBottomWidth: 0,
          }),
    },
    text: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: isOwn
        ? COLORS.neutral.white
        : isDark
          ? COLORS.neutral[100]
          : COLORS.secondary[900],
      lineHeight: 22,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 4,
      gap: 4,
    },
    timestamp: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isOwn
        ? "rgba(255,255,255,0.7)"
        : isDark
          ? COLORS.neutral[500]
          : COLORS.secondary[500],
    },
    readStatusContainer: {
      marginLeft: 2,
    },
    imageContainer: {
      marginBottom: SPACING.sm,
      borderRadius: RADIUS.md,
      overflow: "hidden",
    },
    imageAttachment: {
      width: "100%",
      height: 200,
      borderRadius: RADIUS.md,
    },
  });
