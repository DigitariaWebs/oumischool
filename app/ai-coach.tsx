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
  Modal,
  FlatList,
} from "react-native";

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
  User,
  X,
  BookOpen,
  Beaker,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Clipboard,
  Edit,
  HelpCircle,
  Search,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setChildContext,
  clearContext,
  addMessage,
  setIsTyping,
  initializeChat,
} from "@/store/slices/aiContextSlice";
import { getRoleBasedConfig, getIconForPrompt } from "@/utils/chatbotConfig";
import { generateAIResponse } from "@/utils/aiResponseGenerator";
import { AIChatMessage } from "@/types";

const { width } = Dimensions.get("window");

const iconComponents: Record<string, any> = {
  Calculator,
  FileText,
  Beaker,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Clipboard,
  Edit,
  HelpCircle,
  Search,
  Ruler,
  Globe,
  User,
};

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
  message: AIChatMessage;
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

interface ChildSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectChild: (childId: string) => void;
}

const ChildSelectorModal: React.FC<ChildSelectorModalProps> = ({
  visible,
  onClose,
  onSelectChild,
}) => {
  const children = useAppSelector((state) => state.children.children);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner un enfant</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <X size={24} color={COLORS.secondary[700]} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={children}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.childOption}
                onPress={() => {
                  onSelectChild(item.id);
                  onClose();
                }}
              >
                <View
                  style={[
                    styles.childOptionAvatar,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <User size={20} color={item.color} />
                </View>
                <View style={styles.childOptionInfo}>
                  <Text style={styles.childOptionName}>{item.name}</Text>
                  <Text style={styles.childOptionGrade}>
                    {item.grade} • {item.progress}% de progression
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default function AICoachScreen() {
  const handleBack = useSafeBack();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);

  // Redux state
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);
  const context = useAppSelector((state) => state.aiContext.context);
  const messagesFromStore = useAppSelector((state) => state.aiContext.messages);
  const isTypingFromStore = useAppSelector((state) => state.aiContext.isTyping);

  const [inputText, setInputText] = useState("");
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | undefined>(
    user?.role,
  );

  // Get role-based configuration
  const roleConfig = getRoleBasedConfig(user?.role || "child");

  // Initialize chat on mount or when role changes
  useEffect(() => {
    if (messagesFromStore.length === 0 || currentRole !== user?.role) {
      // Clear previous context when role changes
      if (currentRole !== user?.role && currentRole !== undefined) {
        dispatch(clearContext());
      }

      setCurrentRole(user?.role);

      dispatch(
        initializeChat({
          role: user?.role || "child",
          welcomeMessage: roleConfig.welcomeMessage,
        }),
      );
    }
  }, [user?.role]);

  const messages = messagesFromStore;
  const isTyping = isTypingFromStore;

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: AIChatMessage = {
      id: `${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(userMessage));
    setInputText("");
    dispatch(setIsTyping(true));

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse({
        userMessage: messageText,
        role: user?.role || "child",
        context: context,
        messageHistory: messages,
      });

      const aiMessage: AIChatMessage = {
        id: `${Date.now() + 1}`,
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(aiMessage));
      dispatch(setIsTyping(false));
    }, 1500);
  };

  const handleSelectChild = (childId: string) => {
    const selectedChild = children.find((c) => c.id === childId);
    if (selectedChild) {
      dispatch(
        setChildContext({
          childId: selectedChild.id,
          childData: selectedChild,
        }),
      );

      // Send context confirmation message
      const contextMessage: AIChatMessage = {
        id: `${Date.now()}`,
        type: "ai",
        content: `Parfait ! Je vais maintenant vous aider avec les informations de ${selectedChild.name}. Que voulez-vous savoir ?`,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(contextMessage));
    }
  };

  const handleQuickPrompt = (prompt: any) => {
    if (prompt.requiresContext && user?.role === "parent" && !context.childId) {
      setShowChildSelector(true);
      return;
    }
    handleSendMessage(prompt.text);
  };

  const handleClearContext = () => {
    dispatch(clearContext());
    const contextMessage: AIChatMessage = {
      id: `${Date.now()}`,
      type: "ai",
      content: "Contexte réinitialisé. Comment puis-je vous aider ?",
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(contextMessage));
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
        colors={
          user?.role === "parent"
            ? ["#8B5CF6", "#6366F1"]
            : user?.role === "tutor"
              ? ["#10B981", "#059669"]
              : ["#F59E0B", "#D97706"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View
              style={[
                styles.aiHeaderAvatar,
                user?.role === "parent"
                  ? styles.parentAvatar
                  : user?.role === "tutor"
                    ? styles.tutorAvatar
                    : styles.childAvatar,
              ]}
            >
              <Sparkles size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>
                  {user?.role === "parent"
                    ? "Assistant Parental"
                    : user?.role === "tutor"
                      ? "Assistant Pédagogique"
                      : "Assistant d'Apprentissage"}
                </Text>
                <View
                  style={[
                    styles.roleBadge,
                    user?.role === "parent"
                      ? styles.parentBadge
                      : user?.role === "tutor"
                        ? styles.tutorBadge
                        : styles.childBadge,
                  ]}
                >
                  <Text style={styles.roleBadgeText}>
                    {user?.role === "parent"
                      ? "PARENT"
                      : user?.role === "tutor"
                        ? "TUTEUR"
                        : "ÉLÈVE"}
                  </Text>
                </View>
              </View>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>
                  {context.childId && context.childData
                    ? `Contexte: ${context.childData.name}`
                    : "En ligne"}
                </Text>
              </View>
            </View>
          </View>
          {user?.role === "parent" && context.childId && (
            <TouchableOpacity
              style={styles.contextButton}
              onPress={handleClearContext}
            >
              <X size={18} color={COLORS.neutral.white} />
            </TouchableOpacity>
          )}
          {user?.role === "parent" && !context.childId && (
            <TouchableOpacity
              style={styles.contextButton}
              onPress={() => setShowChildSelector(true)}
            >
              <User size={18} color={COLORS.neutral.white} />
            </TouchableOpacity>
          )}
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

          {/* Role Capabilities Card (show when chat is fresh) */}
          {messages.length === 1 && (
            <Animated.View
              entering={FadeInUp.delay(200).duration(600)}
              style={styles.capabilitiesCard}
            >
              <Text style={styles.capabilitiesTitle}>
                {user?.role === "parent"
                  ? "🎯 Ce que je peux faire pour vous"
                  : user?.role === "tutor"
                    ? "📚 Outils à votre disposition"
                    : "✨ Je peux t'aider avec"}
              </Text>
              <View style={styles.capabilitiesList}>
                {user?.role === "parent" ? (
                  <>
                    <Text style={styles.capabilityItem}>
                      ✓ Analyser les performances de vos enfants
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Identifier forces et faiblesses
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Recommandations personnalisées
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Suivre la progression mensuelle
                    </Text>
                    <Text style={styles.capabilityNote}>
                      💡 Sélectionnez un enfant pour commencer
                    </Text>
                  </>
                ) : user?.role === "tutor" ? (
                  <>
                    <Text style={styles.capabilityItem}>
                      ✓ Créer des plans de leçons
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Générer des exercices variés
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Concevoir des quiz et évaluations
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Trouver des ressources pédagogiques
                    </Text>
                    <Text style={styles.capabilityNote}>
                      💡 Spécifiez le niveau et la matière
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.capabilityItem}>
                      ✓ Expliquer les concepts difficiles
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Aide pour tes devoirs
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Répondre à tes questions
                    </Text>
                    <Text style={styles.capabilityItem}>
                      ✓ Toutes les matières
                    </Text>
                    <Text style={styles.capabilityNote}>
                      💡 Pose-moi n&apos;importe quelle question
                    </Text>
                  </>
                )}
              </View>
            </Animated.View>
          )}

          {/* Quick Prompts (show when chat is empty) */}
          {messages.length <= 2 && (
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.quickPromptsContainer}
            >
              <Text style={styles.quickPromptsTitle}>Suggestions rapides</Text>
              <View style={styles.quickPromptsGrid}>
                {roleConfig.quickPrompts.map((prompt, index) => {
                  const IconComponent =
                    iconComponents[getIconForPrompt(prompt.icon)] || Sparkles;
                  return (
                    <QuickPrompt
                      key={prompt.id}
                      Icon={IconComponent}
                      text={prompt.text}
                      onPress={() => handleQuickPrompt(prompt)}
                    />
                  );
                })}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Child Selector Modal */}
        <ChildSelectorModal
          visible={showChildSelector}
          onClose={() => setShowChildSelector(false)}
          onSelectChild={handleSelectChild}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          {/* Show parent context requirement */}
          {user?.role === "parent" && !context.childId && (
            <TouchableOpacity
              style={styles.contextRequiredBanner}
              onPress={() => setShowChildSelector(true)}
            >
              <User size={20} color={COLORS.primary.DEFAULT} />
              <Text style={styles.contextRequiredText}>
                Sélectionnez un enfant pour poser des questions
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={
                user?.role === "parent"
                  ? context.childId
                    ? "Demandez des insights sur cet enfant..."
                    : "Sélectionnez d'abord un enfant..."
                  : user?.role === "tutor"
                    ? "Créez du contenu pédagogique..."
                    : "Pose ta question..."
              }
              placeholderTextColor={COLORS.neutral[400]}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={user?.role === "parent" ? !!context.childId : true}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() ||
                  (user?.role === "parent" && !context.childId)) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={() => handleSendMessage()}
              disabled={
                !inputText.trim() ||
                (user?.role === "parent" && !context.childId)
              }
            >
              <Send
                size={20}
                color={
                  inputText.trim() &&
                  (user?.role !== "parent" || context.childId)
                    ? COLORS.neutral.white
                    : COLORS.neutral[400]
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            {user?.role === "parent"
              ? context.childId
                ? "Mode Parent • Analyse de performance"
                : "Mode Parent • Sélection requise"
              : user?.role === "tutor"
                ? "Mode Tuteur • Génération de contenu"
                : "Mode Apprentissage • Aide aux devoirs"}{" "}
            • IA
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  roleBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.neutral.white,
    letterSpacing: 0.5,
  },
  parentBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.4)",
  },
  tutorBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.4)",
  },
  childBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.4)",
  },
  parentAvatar: {
    backgroundColor: "rgba(139, 92, 246, 0.3)",
  },
  tutorAvatar: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  childAvatar: {
    backgroundColor: "rgba(245, 158, 11, 0.3)",
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
    marginBottom: 4,
  },
  onlineText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.neutral[100],
  },
  contextButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  childOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  childOptionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  childOptionInfo: {
    flex: 1,
  },
  childOptionName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  childOptionGrade: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  // Capabilities Card
  capabilitiesCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.primary[100],
  },
  capabilitiesTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 16,
  },
  capabilitiesList: {
    gap: 10,
  },
  capabilityItem: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 20,
  },
  capabilityNote: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary.DEFAULT,
    marginTop: 8,
    fontStyle: "italic",
  },
  // Context Required Banner
  contextRequiredBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary[50],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  contextRequiredText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
});
