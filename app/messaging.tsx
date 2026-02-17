import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Search,
  MessageSquarePlus,
  MessageCircle,
  Users,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { ConversationCard } from "@/components/messaging/ConversationCard";
import { EmptyState, LoadingState } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/use-theme";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: "tutor" | "parent";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

// Mock data - replace with real data from store/API
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantId: "tutor-1",
    participantName: "Marie Dupont",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Bonjour, je confirme la séance de maths pour demain à 14h.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "conv-2",
    participantId: "tutor-2",
    participantName: "Jean Martin",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage:
      "Les devoirs de sciences sont prêts. Emma peut commencer quand elle veut.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-3",
    participantId: "tutor-3",
    participantName: "Sophie Leroy",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Merci pour votre confiance ! À bientôt.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-4",
    participantId: "tutor-4",
    participantName: "Pierre Dubois",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Le prochain cours d'anglais est prévu pour lundi prochain.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 1,
    isOnline: false,
  },
];

export default function MessagingScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const totalUnread = mockConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const onlineTutors = mockConversations.filter((c) => c.isOnline).length;

  const handleConversationPress = (conversationId: string) => {
    router.push(`/messaging/${conversationId}`);
  };

  const handleNewMessage = () => {
    router.push("/messaging/new");
  };

  const statItems = [
    {
      icon: MessageCircle,
      label: "Messages",
      value:
        totalUnread > 0
          ? `${totalUnread} non lu${totalUnread > 1 ? "s" : ""}`
          : "Tout lu",
      color: "#8B5CF6",
      bgColor: "#8B5CF620",
    },
    {
      icon: Users,
      label: "Tuteurs",
      value: `${onlineTutors} en ligne`,
      color: "#10B981",
      bgColor: "#10B98120",
    },
    {
      icon: Clock,
      label: "Conversations",
      value: `${mockConversations.length} actives`,
      color: "#F59E0B",
      bgColor: "#F59E0B20",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={22}
            color={isDark ? COLORS.neutral[100] : COLORS.secondary[900]}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.unreadBadge}>
              <MessageCircle size={12} color="#10B981" />
              <Text style={styles.unreadBadgeText}>
                {totalUnread} nouveau{totalUnread > 1 ? "x" : ""}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={handleNewMessage}
          activeOpacity={0.7}
        >
          <MessageSquarePlus size={22} color={COLORS.primary.DEFAULT} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Hero Card */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600).springify()}
              style={styles.heroCard}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["#6366F1", "#8B5CF6", "#A855F7"]
                    : ["#6366F1", "#8B5CF6", "#A855F7"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroContent}>
                  <View style={styles.heroTop}>
                    <View style={styles.sparkleContainer}>
                      <Sparkles size={20} color="rgba(255,255,255,0.9)" />
                    </View>
                    <Text style={styles.heroLabel}>Messagerie</Text>
                  </View>
                  <Text style={styles.heroTitle}>
                    Restez connecté avec vos tuteurs
                  </Text>
                  <View style={styles.heroBadge}>
                    <MessageCircle size={14} color="#FCD34D" />
                    <Text style={styles.heroBadgeText}>
                      Communication instantanée • Sécurisée
                    </Text>
                  </View>
                </View>

                {/* Decorative circles */}
                <View style={styles.heroCircle1} />
                <View style={styles.heroCircle2} />
              </LinearGradient>
            </Animated.View>

            {/* Stats Pills */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600).springify()}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsScroll}
              >
                {statItems.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.statPill, { backgroundColor: item.bgColor }]}
                  >
                    <View
                      style={[
                        styles.statPillIcon,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <item.icon size={14} color="#FFF" />
                    </View>
                    <View>
                      <Text style={styles.statPillLabel}>{item.label}</Text>
                      <Text
                        style={[styles.statPillValue, { color: item.color }]}
                      >
                        {item.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={styles.searchContainer}
            >
              <View style={styles.searchBar}>
                <Search
                  size={20}
                  color={isDark ? COLORS.neutral[400] : COLORS.secondary[400]}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={
                    isDark ? COLORS.neutral[500] : COLORS.neutral[400]
                  }
                />
              </View>
            </Animated.View>

            {/* Section Title */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Conversations récentes</Text>
            </Animated.View>
          </>
        }
        renderItem={({ item, index }) =>
          isLoading ? null : (
            <ConversationCard
              id={item.id}
              participantName={item.participantName}
              participantAvatar={item.participantAvatar}
              lastMessage={item.lastMessage}
              lastMessageTime={item.lastMessageTime}
              unreadCount={item.unreadCount}
              isOnline={item.isOnline}
              onPress={() => handleConversationPress(item.id)}
              delay={450 + index * 50}
            />
          )
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState message="Chargement des conversations..." />
          ) : searchQuery ? (
            <EmptyState
              icon={<Search size={48} color={COLORS.secondary[400]} />}
              title="Aucune conversation trouvée"
              description={`Aucun résultat pour "${searchQuery}"`}
            />
          ) : (
            <EmptyState
              icon={
                <MessageSquarePlus size={48} color={COLORS.secondary[400]} />
              }
              title="Aucune conversation"
              description="Commencez une conversation avec vos tuteurs"
              actionLabel="Nouveau message"
              onAction={handleNewMessage}
            />
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : COLORS.neutral[50],
    },
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: isDark ? 0.15 : 0.4,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#8B5CF6",
      top: -60,
      right: -40,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#6366F1",
      top: 40,
      left: -30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    headerCenter: {
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      fontWeight: "600",
    },
    unreadBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: isDark ? "#10B98130" : "#10B98120",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      marginTop: 4,
    },
    unreadBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#10B981",
      fontWeight: "600",
    },
    newMessageButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? COLORS.primary[900] : COLORS.primary[50],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    heroCard: {
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.sm,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: "#6366F1",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    heroGradient: {
      padding: 20,
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "600",
    },
    heroTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      color: "#FFF",
      lineHeight: 28,
      marginBottom: 12,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
    },
    heroBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "#FFF",
      fontWeight: "600",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -20,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 40,
    },
    statsScroll: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      gap: 10,
    },
    statPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginRight: 8,
    },
    statPillIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    statPillLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[500],
      marginBottom: 2,
    },
    statPillValue: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "700",
    },
    searchContainer: {
      paddingHorizontal: SPACING.lg,
      marginBottom: SPACING.md,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      gap: SPACING.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.06,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    searchInput: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    sectionHeader: {
      paddingHorizontal: SPACING.lg,
      marginBottom: SPACING.sm,
    },
    sectionTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    listContent: {
      paddingBottom: 40,
    },
  });
