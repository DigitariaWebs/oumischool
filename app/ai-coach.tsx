import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeBack } from "@/hooks/useSafeBack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Ruler,
  FileText,
  Calculator,
  Globe,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const { width } = Dimensions.get("window");

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface QuickPromptProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  text: string;
  onPress: () => void;
}

const QuickPrompt: React.FC<QuickPromptProps> = ({ Icon, text, onPress }) => (
  <TouchableOpacity
    style={styles.quickPromptButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.quickPromptIcon}>
      <Icon size={20} color="#8B5CF6" />
    </View>
    <Text style={styles.quickPromptText}>{text}</Text>
  </TouchableOpacity>
);

interface MessageBubbleProps {
  message: Message;
  delay: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, delay }) => {
  const isUser = message.type === "user";

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      layout={Layout.duration(200)}
      style={[
        styles.messageBubbleContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Sparkles size={16} color={COLORS.primary.DEFAULT} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.content}
        </Text>
        {!isUser && (
          <View style={styles.messageActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Copy size={14} color={COLORS.secondary[500]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThumbsUp size={14} color={COLORS.secondary[500]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThumbsDown size={14} color={COLORS.secondary[500]} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default function AICoachScreen() {
  const router = useRouter();
  const handleBack = useSafeBack();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Bonjour ! Je suis votre coach pédagogique IA. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { Icon: Ruler, text: "Explique les fractions" },
    { Icon: FileText, text: "Exercices de français" },
    { Icon: Calculator, text: "Tables de multiplication" },
    { Icon: Globe, text: "Géographie de France" },
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: getAIResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    // Mock AI responses
    if (userMessage.toLowerCase().includes("fraction")) {
      return "Les fractions, c'est simple ! Imagine une pizza.\n\nSi tu la coupes en 4 parts égales, chaque part représente 1/4 (un quart).\n\nLe chiffre du bas (dénominateur) dit en combien de parts on coupe, et celui du haut (numérateur) dit combien on en prend.\n\nExemple : 3/4 = 3 parts sur 4 parts totales.";
    }
    return "Je suis là pour vous aider ! Posez-moi des questions sur les mathématiques, le français, les sciences ou toute autre matière. Je peux aussi vous suggérer des exercices adaptés.";
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#6366F1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.aiHeaderAvatar}>
              <Sparkles size={20} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Coach Pédago</Text>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>En ligne</Text>
              </View>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              delay={index * 50}
            />
          ))}

          {isTyping && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={styles.typingIndicatorContainer}
            >
              <View style={styles.aiAvatar}>
                <Sparkles size={16} color={COLORS.primary.DEFAULT} />
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </Animated.View>
          )}

          {/* Quick Prompts (show when chat is empty) */}
          {messages.length === 1 && (
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.quickPromptsContainer}
            >
              <Text style={styles.quickPromptsTitle}>
                Suggestions rapides
              </Text>
              <View style={styles.quickPromptsGrid}>
                {quickPrompts.map((prompt, index) => (
                  <QuickPrompt
                    key={index}
                    Icon={prompt.Icon}
                    text={prompt.text}
                    onPress={() => handleSendMessage(prompt.text)}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Posez votre question..."
              placeholderTextColor={COLORS.neutral[400]}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
            >
              <Send
                size={20}
                color={
                  inputText.trim()
                    ? COLORS.neutral.white
                    : COLORS.neutral[400]
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            Powered by IA • Réponses instantanées
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  // Header
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  aiHeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  onlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  onlineText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.neutral[100],
  },
  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    padding: 14,
  },
  userBubble: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.neutral.white,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.neutral.white,
  },
  aiMessageText: {
    color: COLORS.secondary[800],
  },
  messageActions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[50],
  },
  // Typing Indicator
  typingIndicatorContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 14,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typingDots: {
    flexDirection: "row",
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary[300],
  },
  // Quick Prompts
  quickPromptsContainer: {
    marginTop: 24,
  },
  quickPromptsTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    marginBottom: 12,
    fontWeight: "600",
  },
  quickPromptsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickPromptIcon: {
    marginBottom: 6,
  },
  quickPromptText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "500",
  },
  // Input
  inputContainer: {
    padding: 16,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.neutral[200],
  },
  inputHint: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[400],
    textAlign: "center",
  },
});
