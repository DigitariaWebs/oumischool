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
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

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
  const [isFocused, setIsFocused] = useState(false);

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
          <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
            {/* Boutons à gauche */}
            <View style={styles.leftActions}>
              {onImagePick && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onImagePick}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}

              {onAttachment && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onAttachment}
                  activeOpacity={0.7}
                >
                  <Paperclip size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Champ de texte */}
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={1000}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* Bouton emoji */}
            <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
              <Smile size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Bouton d'envoi */}
          <TouchableOpacity
            style={[styles.sendButton, canSend && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <Send size={18} color={canSend ? "white" : "#CBD5E1"} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inputContainerFocused: {
    borderColor: "#6366F1",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
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
    fontSize: 14,
    color: "#1E293B",
    maxHeight: 100,
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: "#6366F1",
  },
});