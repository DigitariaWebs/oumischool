import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { X, User, BookOpen, Sparkles } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface ContextChipProps {
  type: "child" | "subject";
  label: string;
  value: string;
  color?: string;
  onRemove?: () => void;
  onPress?: () => void;
}

export function ContextChip({
  type,
  label,
  value,
  color = COLORS.primary.DEFAULT,
  onRemove,
  onPress,
}: ContextChipProps) {
  const Icon = type === "child" ? User : BookOpen;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      layout={Layout.springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 24,
        overflow: "hidden",
        marginRight: 8,
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingLeft: 12,
          paddingRight: 6,
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
            backgroundColor: color + "25",
          }}
        >
          <Icon size={13} color={color} />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              fontFamily: FONTS.secondary,
              fontSize: 10,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.3,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.secondary,
              fontSize: 14,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            {value}
          </Text>
        </View>
      </TouchableOpacity>
      {onRemove && (
        <TouchableOpacity
          onPress={() => {
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onRemove();
          }}
          style={{ padding: 10, paddingLeft: 4 }}
        >
          <X size={16} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

interface ContextIndicatorProps {
  childName?: string;
  subjectName?: string;
  onClearContext?: () => void;
  onSelectChild?: () => void;
}

export function ContextIndicator({
  childName,
  subjectName,
  onClearContext,
  onSelectChild,
}: ContextIndicatorProps) {
  if (!childName && !subjectName) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onSelectChild?.();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(139, 92, 246, 0.15)",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "rgba(139, 92, 246, 0.3)",
          gap: 8,
        }}
      >
        <Sparkles size={14} color="#A78BFA" />
        <Text
          style={{
            fontFamily: FONTS.secondary,
            fontSize: 13,
            color: "#A78BFA",
            fontWeight: "500",
          }}
        >
          Sélectionner un contexte
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {childName && (
        <ContextChip
          type="child"
          label="Enfant"
          value={childName}
          color={COLORS.purple[500]}
          onRemove={onClearContext}
        />
      )}
      {subjectName && (
        <ContextChip
          type="subject"
          label="Matière"
          value={subjectName}
          color={COLORS.green[500]}
        />
      )}
    </View>
  );
}
