import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Send, Mic, Paperclip, Smile, Sparkles } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface InputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  showContextBanner?: boolean;
  contextBannerText?: string;
  onContextBannerPress?: () => void;
  mode?: "child" | "parent" | "tutor";
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function InputBar({
  value,
  onChangeText,
  onSend,
  placeholder = "Écrivez votre message...",
  disabled = false,
  showContextBanner = false,
  contextBannerText,
  onContextBannerPress,
  mode = "child",
}: InputBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const sendButtonScale = useSharedValue(1);

  const sendAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));

  const getModeColor = () => {
    switch (mode) {
      case "parent":
        return "#A78BFA";
      case "tutor":
        return "#34D399";
      default:
        return COLORS.primary.DEFAULT;
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;

    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    sendButtonScale.value = withSequence(
      withSpring(0.8),
      withSpring(1.1),
      withSpring(1),
    );

    Keyboard.dismiss();
    onSend();
  };

  const handleMicPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "🎤 Fonctionnalité en démonstration",
      "L'enregistrement vocal sera disponible lors de la connexion à l'API.",
      [{ text: "OK" }],
    );
  };

  const handleAttachmentPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "📎 Fonctionnalité en démonstration",
      "Les pièces jointes seront disponibles lors de la connexion à l'API.",
      [{ text: "OK" }],
    );
  };

  const handleEmojiPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "😊 Fonctionnalité en démonstration",
      "Le sélecteur d'émojis sera disponible lors de la connexion à l'API.",
      [{ text: "OK" }],
    );
  };

  const modeColor = getModeColor();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "rgba(15, 23, 42, 0.98)",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
      }}
    >
      {showContextBanner && (
        <TouchableOpacity
          onPress={onContextBannerPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 16,
            marginBottom: 12,
            gap: 8,
            borderWidth: 1,
            borderColor: "rgba(139, 92, 246, 0.3)",
            backgroundColor: "rgba(139, 92, 246, 0.15)",
          }}
        >
          <Sparkles size={16} color={modeColor} />
          <Text
            style={{
              fontFamily: FONTS.secondary,
              fontSize: 13,
              fontWeight: "600",
              flex: 1,
              color: modeColor,
            }}
          >
            {contextBannerText}
          </Text>
        </TouchableOpacity>
      )}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderRadius: 24,
            paddingHorizontal: 8,
            paddingVertical: 6,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: isFocused ? modeColor + "60" : "rgba(255,255,255,0.1)",
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", paddingLeft: 4 }}
        >
          <TouchableOpacity
            onPress={handleAttachmentPress}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paperclip size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEmojiPress}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Smile size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={{
            flex: 1,
            fontFamily: FONTS.secondary,
            fontSize: 15,
            color: "#FFFFFF",
            maxHeight: 100,
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleMicPress}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Mic size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          <AnimatedTouchable
            onPress={handleSend}
            disabled={!value.trim() || disabled}
            style={[
              sendAnimatedStyle,
              {
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 4,
                backgroundColor:
                  value.trim() && !disabled
                    ? modeColor
                    : "rgba(255,255,255,0.1)",
              },
            ]}
          >
            <Send
              size={18}
              color={
                value.trim() && !disabled ? "#FFFFFF" : "rgba(255,255,255,0.3)"
              }
            />
          </AnimatedTouchable>
        </View>
      </View>

      <Text
        style={{
          fontFamily: FONTS.secondary,
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
        }}
      >
        Mode{" "}
        {mode === "parent"
          ? "Parent"
          : mode === "tutor"
            ? "Tuteur"
            : "Apprentissage"}{" "}
        • IA active
      </Text>
    </View>
  );
}
