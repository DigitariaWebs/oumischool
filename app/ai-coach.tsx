import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Sparkles,
  User,
  X,
  Ruler,
  FileText,
  Calculator,
  Globe,
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
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

import {
  TypingIndicator,
  MessageBubble,
  InputBar,
  ContextIndicator,
} from "@/components/ai-chat";

const iconComponents: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
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
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.neutral.white,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 16,
      gap: 8,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      borderWidth: 1,
      borderColor: COLORS.neutral[100],
    }}
  >
    <View style={{ marginBottom: 2 }}>
      <Icon size={18} color={COLORS.purple.DEFAULT} />
    </View>
    <Text
      style={{
        fontFamily: FONTS.secondary,
        fontSize: 13,
        color: COLORS.secondary[700],
        fontWeight: "500",
      }}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

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
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={onClose}
          activeOpacity={1}
        />
        <View
          style={{
            backgroundColor: COLORS.neutral.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "70%",
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: COLORS.neutral[300],
              borderRadius: 2,
              alignSelf: "center",
              marginTop: 12,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.neutral[100],
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.fredoka,
                fontSize: 20,
                color: COLORS.secondary[900],
              }}
            >
              Sélectionner un enfant
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.neutral[100],
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <X size={24} color={COLORS.secondary[700]} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={children}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectChild(item.id);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.neutral[100],
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                    backgroundColor: item.color + "20",
                  }}
                >
                  <User size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    selectable
                    style={{
                      fontFamily: FONTS.fredoka,
                      fontSize: 17,
                      color: COLORS.secondary[900],
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 14,
                      color: COLORS.secondary[500],
                    }}
                  >
                    {item.grade} • {item.progress}% de progression
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: item.color,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 13,
                      fontWeight: "600",
                      color: item.color,
                    }}
                  >
                    Choisir
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={
              children.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingVertical: 48 }}>
                <User size={48} color={COLORS.neutral[300]} />
                <Text
                  selectable
                  style={{
                    fontFamily: FONTS.fredoka,
                    fontSize: 18,
                    color: COLORS.secondary[600],
                    marginTop: 16,
                  }}
                >
                  Aucun enfant enregistré
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.secondary,
                    fontSize: 14,
                    color: COLORS.secondary[400],
                    marginTop: 4,
                  }}
                >
                  Ajoutez un enfant pour commencer
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default function AICoachScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);

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

  const roleConfig = getRoleBasedConfig(user?.role || "child");

  useEffect(() => {
    if (messagesFromStore.length === 0 || currentRole !== user?.role) {
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

  const getMode = () => {
    switch (user?.role) {
      case "parent":
        return "parent";
      case "tutor":
        return "tutor";
      default:
        return "child";
    }
  };

  const getGradientColors = (): [string, string, ...string[]] => {
    switch (user?.role) {
      case "parent":
        return ["#8B5CF6", "#6366F1"];
      case "tutor":
        return ["#10B981", "#059669"];
      default:
        return ["#F59E0B", "#D97706"];
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMessage: AIChatMessage = {
      id: `${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(userMessage));
    setInputText("");
    dispatch(setIsTyping(true));

    const typingDelay = 1500 + Math.random() * 1000;

    setTimeout(() => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

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
    }, typingDelay);
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
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (prompt.requiresContext && user?.role === "parent" && !context.childId) {
      setShowChildSelector(true);
      return;
    }
    handleSendMessage(prompt.text);
  };

  const handleClearContext = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

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
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getHeaderTitle = () => {
    switch (user?.role) {
      case "parent":
        return "Assistant Parental";
      case "tutor":
        return "Assistant Pédagogique";
      default:
        return "Assistant d'Apprentissage";
    }
  };

  const getRoleBadgeText = () => {
    switch (user?.role) {
      case "parent":
        return "PARENT";
      case "tutor":
        return "TUTEUR";
      default:
        return "ÉLÈVE";
    }
  };

  const gradientColors = getGradientColors();
  const mode = getMode();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F172A",
        paddingTop: insets.top,
      }}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                if (process.env.EXPO_OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)");
                }
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={24} color={COLORS.neutral.white} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginLeft: 12,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Sparkles size={20} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.fredoka,
                      fontSize: 18,
                      color: COLORS.neutral.white,
                    }}
                  >
                    {getHeaderTitle()}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                      backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 10,
                        fontWeight: "700",
                        color: COLORS.neutral.white,
                        letterSpacing: 0.5,
                      }}
                    >
                      {getRoleBadgeText()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#10B981",
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 11,
                      color: COLORS.neutral[100],
                    }}
                  >
                    {context.childId && context.childData
                      ? `Contexte: ${context.childData.name}`
                      : "En ligne"}
                  </Text>
                </View>
              </View>
            </View>
            {user?.role === "parent" && (
              <TouchableOpacity
                onPress={() =>
                  context.childId
                    ? handleClearContext()
                    : setShowChildSelector(true)
                }
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {context.childId ? (
                  <X size={18} color={COLORS.neutral.white} />
                ) : (
                  <User size={18} color={COLORS.neutral.white} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 8,
            gap: 12,
            backgroundColor: "#0F172A",
          }}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              delay={index * 50}
              onQuickReply={(text) => handleSendMessage(text)}
            />
          ))}

          {isTyping && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={{ marginBottom: 16, marginLeft: 40 }}
            >
              <TypingIndicator size="large" />
            </Animated.View>
          )}

          {messages.length === 1 && !isTyping && (
            <Animated.View
              entering={FadeInUp.delay(200).duration(600)}
              style={{
                backgroundColor: COLORS.neutral.white,
                borderRadius: 20,
                padding: 20,
                marginTop: 16,
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                borderWidth: 1,
                borderColor: COLORS.primary[100],
                borderCurve: "continuous",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <Sparkles size={20} color={COLORS.purple.DEFAULT} />
                <Text
                  style={{
                    fontFamily: FONTS.fredoka,
                    fontSize: 17,
                    color: COLORS.secondary[900],
                  }}
                >
                  {user?.role === "parent"
                    ? "Ce que je peux faire pour vous"
                    : user?.role === "tutor"
                      ? "Outils à votre disposition"
                      : "Je peux t'aider avec"}
                </Text>
              </View>
              <View style={{ gap: 10 }}>
                {user?.role === "parent" ? (
                  <>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Analyser les performances de vos enfants
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Identifier forces et faiblesses
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Recommandations personnalisées
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Suivre la progression mensuelle
                    </Text>
                    <View
                      style={{
                        marginTop: 8,
                        backgroundColor: COLORS.primary[50],
                        padding: 12,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        selectable
                        style={{
                          fontFamily: FONTS.secondary,
                          fontSize: 13,
                          color: COLORS.primary.DEFAULT,
                          fontStyle: "italic",
                        }}
                      >
                        💡 Sélectionnez un enfant pour commencer
                      </Text>
                    </View>
                  </>
                ) : user?.role === "tutor" ? (
                  <>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Créer des plans de leçons
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Générer des exercices variés
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Concevoir des quiz et évaluations
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Trouver des ressources pédagogiques
                    </Text>
                    <View
                      style={{
                        marginTop: 8,
                        backgroundColor: COLORS.primary[50],
                        padding: 12,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        selectable
                        style={{
                          fontFamily: FONTS.secondary,
                          fontSize: 13,
                          color: COLORS.primary.DEFAULT,
                          fontStyle: "italic",
                        }}
                      >
                        💡 Spécifiez le niveau et la matière
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Expliquer les concepts difficiles
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Aide pour tes devoirs
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Répondre à tes questions
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        color: COLORS.secondary[700],
                        lineHeight: 20,
                      }}
                    >
                      ✓ Toutes les matières
                    </Text>
                    <View
                      style={{
                        marginTop: 8,
                        backgroundColor: COLORS.primary[50],
                        padding: 12,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        selectable
                        style={{
                          fontFamily: FONTS.secondary,
                          fontSize: 13,
                          color: COLORS.primary.DEFAULT,
                          fontStyle: "italic",
                        }}
                      >
                        💡 Pose-moi n&apos;importe quelle question
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </Animated.View>
          )}

          {messages.length <= 2 && !isTyping && (
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              style={{ marginTop: 16 }}
            >
              <Text
                style={{
                  fontFamily: FONTS.secondary,
                  fontSize: 14,
                  color: COLORS.secondary[500],
                  marginBottom: 12,
                  fontWeight: "600",
                }}
              >
                Suggestions rapides
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {roleConfig.quickPrompts.map((prompt) => {
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

        <ChildSelectorModal
          visible={showChildSelector}
          onClose={() => setShowChildSelector(false)}
          onSelectChild={handleSelectChild}
        />

        {user?.role === "parent" && (
          <View
            style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}
          >
            <ContextIndicator
              childName={context.childData?.name}
              subjectName={context.subjectName}
              onClearContext={handleClearContext}
              onSelectChild={() => setShowChildSelector(true)}
            />
          </View>
        )}

        <InputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={() => handleSendMessage()}
          placeholder={
            user?.role === "parent"
              ? context.childId
                ? "Demandez des insights sur cet enfant..."
                : "Sélectionnez d'abord un enfant..."
              : user?.role === "tutor"
                ? "Créez du contenu pédagogique..."
                : "Pose ta question..."
          }
          disabled={user?.role === "parent" ? !context.childId : false}
          showContextBanner={user?.role === "parent" && !context.childId}
          contextBannerText="Sélectionnez un enfant pour poser des questions"
          onContextBannerPress={() => setShowChildSelector(true)}
          mode={mode}
        />
        <View
          style={{
            height: insets.bottom,
            backgroundColor: COLORS.neutral.white,
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
