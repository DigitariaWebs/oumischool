import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Send, Paperclip, Image as ImageIcon } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS } from "@/constants/tokens";

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
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {onImagePick && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onImagePick}
              activeOpacity={0.7}
            >
              <ImageIcon size={22} color={COLORS.secondary[600]} />
            </TouchableOpacity>
          )}

          {onAttachment && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onAttachment}
              activeOpacity={0.7}
            >
              <Paperclip size={22} color={COLORS.secondary[600]} />
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
            activeOpacity={0.7}
          >
            <Send
              size={20}
              color={
                message.trim() ? COLORS.neutral.white : COLORS.neutral[400]
              }
              fill={message.trim() ? COLORS.neutral.white : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    maxHeight: 100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.neutral[200],
  },
});
