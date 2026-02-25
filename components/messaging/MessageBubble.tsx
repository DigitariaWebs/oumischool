import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Check, CheckCheck } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
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
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}
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

        <View
          style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
        >
          {attachment && attachment.type === "image" && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: attachment.url }}
                style={styles.imageAttachment}
                resizeMode="cover"
              />
            </View>
          )}

          {content && (
            <Text style={[styles.text, isOwn && styles.textOwn]}>
              {content}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.timestamp, isOwn && styles.timestampOwn]}>
              {formatTime(timestamp)}
            </Text>
            {isOwn && (
              <View style={styles.readStatus}>
                {isRead ? (
                  <CheckCheck size={14} color="white" />
                ) : (
                  <Check size={14} color="white" />
                )}
              </View>
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
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  containerOwn: {
    justifyContent: "flex-end",
  },
  containerOther: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  bubbleWrapper: {
    maxWidth: "75%",
  },
  senderName: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: "600",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOwn: {
    backgroundColor: "#6366F1",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#F8FAFC",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textOwn: {
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#94A3B8",
  },
  timestampOwn: {
    color: "rgba(255,255,255,0.7)",
  },
  readStatus: {
    marginLeft: 2,
  },
  imageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageAttachment: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
});
