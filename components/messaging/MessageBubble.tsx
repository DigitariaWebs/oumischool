import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS } from "@/constants/tokens";
import Animated, { FadeInRight, FadeInLeft } from "react-native-reanimated";

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
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Animated.View
      entering={isOwn ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      {!isOwn && senderAvatar && (
        <Image source={{ uri: senderAvatar }} style={styles.avatar} />
      )}

      <View style={styles.bubbleWrapper}>
        {!isOwn && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        <View
          style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
        >
          {attachment && attachment.type === "image" && (
            <Image
              source={{ uri: attachment.url }}
              style={styles.imageAttachment}
              resizeMode="cover"
            />
          )}

          {content && (
            <Text style={[styles.text, isOwn && styles.ownText]}>
              {content}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
              {formatTime(timestamp)}
            </Text>
            {isOwn && (
              <Text style={styles.readStatus}>{isRead ? "✓✓" : "✓"}</Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  ownContainer: {
    justifyContent: "flex-end",
  },
  otherContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.sm,
  },
  bubbleWrapper: {
    maxWidth: "75%",
  },
  senderName: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    marginBottom: 4,
    marginLeft: SPACING.sm,
    fontWeight: "600",
  },
  bubble: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  ownBubble: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.neutral.white,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    lineHeight: 20,
  },
  ownText: {
    color: COLORS.neutral.white,
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
    color: COLORS.secondary[500],
  },
  ownTimestamp: {
    color: COLORS.neutral.white,
    opacity: 0.8,
  },
  readStatus: {
    fontSize: 12,
    color: COLORS.neutral.white,
    opacity: 0.8,
  },
  imageAttachment: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
});
