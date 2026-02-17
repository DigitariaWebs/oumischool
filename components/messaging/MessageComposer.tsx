import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

interface MessageComposerProps {
  onSend: (message: string) => void;
  onAttachment?: () => void;
  onImagePick?: () => void;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  onAttachment,
  onImagePick,
  placeholder = "Écrire un message...",
}) => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const styles = createStyles(isDark, isFocused);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const canSend = message.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            {/* Left Actions */}
            <View style={styles.leftActions}>
              {onImagePick && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onImagePick}
                  activeOpacity={0.7}
                >
                  <ImageIcon
                    size={20}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[500]}
                  />
                </TouchableOpacity>
              )}

              {onAttachment && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onAttachment}
                  activeOpacity={0.7}
                >
                  <Paperclip
                    size={20}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[500]}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Input */}
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor={
                isDark ? COLORS.neutral[500] : COLORS.neutral[400]
              }
              multiline
              maxLength={1000}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* Emoji Button */}
            <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
              <Smile
                size={20}
                color={isDark ? COLORS.neutral[500] : COLORS.neutral[400]}
              />
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButtonWrapper}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            {canSend ? (
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Send size={18} color={COLORS.neutral.white} />
              </LinearGradient>
            ) : (
              <View style={styles.sendButtonDisabled}>
                <Send
                  size={18}
                  color={isDark ? COLORS.neutral[600] : COLORS.neutral[400]}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (isDark: boolean, isFocused: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? COLORS.neutral[900] : COLORS.neutral.white,
      borderTopWidth: 1,
      borderTopColor: isDark ? COLORS.neutral[800] : COLORS.neutral[200],
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 8,
      elevation: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: SPACING.sm,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[100],
      borderRadius: 24,
      paddingHorizontal: SPACING.xs,
      paddingVertical: SPACING.xs,
      borderWidth: isFocused ? 2 : 1,
      borderColor: isFocused
        ? "#6366F1"
        : isDark
          ? COLORS.neutral[700]
          : COLORS.neutral[200],
    },
    leftActions: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: SPACING.xs,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      maxHeight: 100,
      minHeight: 36,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.xs,
    },
    emojiButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonWrapper: {
      marginBottom: 2,
    },
    sendButtonGradient: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#6366F1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    sendButtonDisabled: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[200],
      justifyContent: "center",
      alignItems: "center",
    },
  });
