import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  CheckCheck,
} from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { AIChatMessage } from "@/types";
import { ContentRenderer, parseMessageContent } from "@/utils/messageParser";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MessageBubbleProps {
  message: AIChatMessage;
  delay: number;
  onQuickReply?: (text: string) => void;
}

const QuickReplies = ({
  onQuickReply,
}: {
  onQuickReply?: (text: string) => void;
}) => {
  const suggestions = ["Merci !", "Explique-moi plus", "Autre sujet"];

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(300)}
      style={{
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.secondary,
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 8,
        }}
      >
        Réponses rapides
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {suggestions.map((reply, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onQuickReply?.(reply);
            }}
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(139, 92, 246, 0.3)",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.secondary,
                fontSize: 13,
                color: "#A78BFA",
                fontWeight: "500",
              }}
            >
              {reply}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export function MessageBubble({
  message,
  delay,
  onQuickReply,
}: MessageBubbleProps) {
  const isUser = message.type === "user";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"up" | "down" | null>(null);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.98, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const handleCopy = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (type: "up" | "down") => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLiked(liked === type ? null : type);
  };

  const parsedContent = !isUser ? parseMessageContent(message.content) : null;
  const showQuickReplies = !isUser && Math.random() > 0.5;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[
        {
          flexDirection: "row",
          marginBottom: 12,
          alignItems: "flex-end",
        },
        isUser
          ? { justifyContent: "flex-end" }
          : { justifyContent: "flex-start" },
      ]}
    >
      {!isUser && (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Sparkles size={18} color="#A78BFA" />
        </View>
      )}
      <AnimatedPressable onPress={handlePress} style={animatedStyle}>
        <View
          style={[
            {
              maxWidth: "82%",
              borderRadius: 20,
              padding: 16,
            },
            isUser
              ? {
                  backgroundColor: COLORS.primary.DEFAULT,
                  borderBottomRightRadius: 6,
                }
              : {
                  backgroundColor: "rgba(30, 41, 59, 0.95)",
                  borderBottomLeftRadius: 6,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                },
          ]}
        >
          {isUser ? (
            <Text
              selectable
              style={{
                fontFamily: FONTS.secondary,
                fontSize: 15,
                lineHeight: 22,
                color: COLORS.neutral.white,
              }}
            >
              {message.content}
            </Text>
          ) : parsedContent ? (
            <ContentRenderer content={parsedContent} isDark />
          ) : null}

          {!isUser && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 14,
                  gap: 8,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255,255,255,0.1)",
                }}
              >
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[
                    {
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                    copied && { backgroundColor: "rgba(139, 92, 246, 0.2)" },
                  ]}
                >
                  {copied ? (
                    <Check size={15} color="#A78BFA" />
                  ) : (
                    <Copy size={15} color="#94A3B8" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLike("up")}
                  style={[
                    {
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                    liked === "up" && {
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                    },
                  ]}
                >
                  <ThumbsUp
                    size={15}
                    color={liked === "up" ? "#22C55E" : "#94A3B8"}
                    fill={liked === "up" ? "#22C55E" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLike("down")}
                  style={[
                    {
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                    liked === "down" && {
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                    },
                  ]}
                >
                  <ThumbsDown
                    size={15}
                    color={liked === "down" ? "#EF4444" : "#94A3B8"}
                    fill={liked === "down" ? "#EF4444" : "transparent"}
                  />
                </TouchableOpacity>
              </View>
              {showQuickReplies && <QuickReplies onQuickReply={onQuickReply} />}
            </>
          )}
        </View>
      </AnimatedPressable>

      {isUser && (
        <View style={{ marginLeft: 6, marginBottom: 4, alignSelf: "flex-end" }}>
          <CheckCheck size={14} color="rgba(255,255,255,0.6)" />
        </View>
      )}
    </Animated.View>
  );
}
