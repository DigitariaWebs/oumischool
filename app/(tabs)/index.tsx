import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { ThemeColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  FileText,
  BrainCircuit,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Bell,
  Baby,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Play,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import {
  Avatar,
  BlobBackground,
  HeroCard,
  QuickActionCard,
  FeatureCard,
  AnimatedSection,
} from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2; // 2 cards per row with proper spacing

interface ChildCardProps {
  id: string;
  name: string;
  grade: string;
  progress: number;
  color: string;
  delay: number;
  lessonsCompleted: number;
  onPress: () => void;
}

const ChildCard: React.FC<
  ChildCardProps & { styles: any; isDark: boolean }
> = ({
  id,
  name,
  grade,
  progress,
  color,
  delay,
  lessonsCompleted,
  onPress,
  styles,
  isDark,
}) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(600)}
    style={styles.childCardWrapper}
  >
    <View style={styles.childCard}>
      {/* Header with Avatar and Grade */}
      <View style={styles.childCardHeader}>
        <View style={[styles.childAvatar, { backgroundColor: color }]}>
          <Text style={styles.childAvatarText}>{name.charAt(0)}</Text>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: color }]}>
          <Text style={styles.gradeBadgeText}>{grade}</Text>
        </View>
      </View>

      {/* Name and Age */}
      <Text style={styles.childName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.childAge}>15 ans</Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.childStatItem}>
          <BookOpen
            size={14}
            color={isDark ? COLORS.neutral[400] : COLORS.neutral[600]}
          />
          <Text style={styles.statText}>Leçons</Text>
          <Text style={styles.statValue}>{lessonsCompleted}</Text>
        </View>
        <View style={styles.childStatItem}>
          <TrendingUp
            size={14}
            color={isDark ? COLORS.neutral[400] : COLORS.neutral[600]}
          />
          <Text style={styles.statText}>Progrès</Text>
          <Text style={styles.statValue}>{progress}%</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Play size={14} color="white" fill="white" />
        <Text style={styles.actionButtonText}>Plus détails</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Get data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);

  const userName = user?.name || "Utilisateur";

  // Mock notification count - replace with actual state management
  const notificationCount = 3;

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const quickActions = [
    {
      icon: <Plus size={24} color="white" />,
      title: "Ajouter un enfant",
      subtitle: "Nouveau profil",
      color: COLORS.primary.DEFAULT,
      onPress: () => router.push("/children-tab"),
    },
    {
      icon: <Calendar size={24} color="white" />,
      title: "Plan hebdo",
      subtitle: "Organiser",
      color: "#3B82F6",
      onPress: () => router.push("/weekly-plan"),
    },
    {
      icon: <MessageSquare size={24} color="white" />,
      title: "Messages",
      subtitle: "Discussions",
      color: "#10B981",
      onPress: () => router.push("/messaging"),
    },
    {
      icon: <Sparkles size={24} color="white" />,
      title: "Coach IA",
      subtitle: "Assistance",
      color: "#8B5CF6",
      onPress: () => router.push("/ai-coach"),
    },
    {
      icon: <FileText size={24} color="white" />,
      title: "Ressources",
      subtitle: "Explorer",
      color: "#EAB308",
      onPress: () => router.push("/resources"),
    },
    {
      icon: <CreditCard size={24} color="white" />,
      title: "Abonnement",
      subtitle: "Offres",
      color: "#F59E0B",
      onPress: () => router.push("/pricing"),
    },
  ];

  const features = [
    {
      icon: <BookOpen size={28} color={COLORS.primary.DEFAULT} />,
      title: "Programme structuré",
      description: "Curriculum clair avec plan hebdomadaire facile à suivre",
      color: COLORS.primary[50],
    },
    {
      icon: <FileText size={28} color="#3B82F6" />,
      title: "Ressources & PDF",
      description: "Leçons, quiz et exercices imprimables",
      color: "#DBEAFE",
    },
    {
      icon: <BrainCircuit size={28} color="#8B5CF6" />,
      title: "IA éducative",
      description: "Coach qui explique, adapte et recommande",
      color: "#EDE9FE",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <BlobBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify()}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Avatar
              name={userName}
              source={user?.avatar}
              size="lg"
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.greeting}>Bienvenue !</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/parent/notifications")}
          >
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount}
                </Text>
              </View>
            )}
            <Bell size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Stats Card */}
        <AnimatedSection delay={150} style={styles.heroCardWrapper}>
          <HeroCard
            title="Tableau de bord"
            value="68%"
            subtitle="Progression globale"
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${children.length} enfant${children.length !== 1 ? "s" : ""} • 12 leçons actives`,
            }}
          />
        </AnimatedSection>
        {/* Children Section */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={styles.sectionHeader}
          >
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#EF444420" }]}
              >
                <Baby size={18} color="#EF4444" />
              </View>
              <Text style={styles.sectionTitle}>Mes enfants</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/children-tab")}
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>

          {children.length > 0 ? (
            <View style={styles.childrenGrid}>
              {children.map((child, index) => (
                <ChildCard
                  key={child.id}
                  id={child.id}
                  name={child.name}
                  grade={child.grade}
                  progress={child.progress}
                  color={child.color}
                  lessonsCompleted={child.lessonsCompleted}
                  delay={250 + index * 80}
                  onPress={() =>
                    router.push(`/parent/child/details?id=${child.id}`)
                  }
                  styles={styles}
                  isDark={isDark}
                />
              ))}
            </View>
          ) : (
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={styles.emptyChildrenState}
            >
              <View style={styles.emptyStateIcon}>
                <Baby size={40} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyStateTitle}>Aucun enfant ajouté</Text>
              <Text style={styles.emptyStateText}>
                Commencez par ajouter le profil de votre premier enfant
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push("/children-tab")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary.DEFAULT, COLORS.primary[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyStateButtonGradient}
                >
                  <Plus size={18} color="white" />
                  <Text style={styles.emptyStateButtonText}>
                    Ajouter un enfant
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(350).duration(600).springify()}
            style={styles.sectionHeader}
          >
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#10B98120" }]}
              >
                <Sparkles size={18} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Actions rapides</Text>
            </View>
          </Animated.View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <View key={index} style={styles.quickActionWrapper}>
                <QuickActionCard {...action} delay={400 + index * 60} />
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(600).duration(600).springify()}
            style={styles.sectionHeader}
          >
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#8B5CF620" }]}
              >
                <BrainCircuit size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.sectionTitle}>Tout pour réussir</Text>
            </View>
          </Animated.View>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={650 + index * 80} />
          ))}
        </View>

        {/* CTA Banner */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600).springify()}
          style={styles.ctaBanner}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaDecor1} />
            <View style={styles.ctaDecor2} />
            <View style={styles.ctaContent}>
              <View style={styles.ctaIconContainer}>
                <BrainCircuit size={22} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.ctaTitle}>Découvrez le Coach IA</Text>
              <Text style={styles.ctaDescription}>
                Obtenez des conseils personnalisés pour votre enfant
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/ai-coach")}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaButtonText}>Essayer</Text>
              <ChevronRight size={18} color="#10B981" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    heroCardWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    userAvatar: {
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.primary + "30",
    },
    greeting: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    userName: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    notificationBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: "#EF4444",
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    notificationBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      fontWeight: "700",
      color: COLORS.neutral.white,
    },
    // Hero Card

    // Section
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    seeAllText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },
    // Children Grid
    childrenGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    childCardWrapper: {
      width: CARD_WIDTH,
    },
    // Child Card
    childCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    childCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    childAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    childAvatarText: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700" as any,
      color: "white",
    },
    gradeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    gradeBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      fontWeight: "600" as any,
      color: "white",
    },
    childName: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    childAge: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    childStatItem: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
    },
    statText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    childStatValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 10,
      gap: 6,
      marginBottom: 6,
    },
    actionButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600" as any,
      color: "white",
    },
    pinStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    pinDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: COLORS.primary.DEFAULT,
    },
    pinText: {
      fontFamily: FONTS.secondary,
      fontSize: 9,
      color: isDark ? COLORS.neutral[500] : COLORS.neutral[600],
    },
    bottomActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    bottomActionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
      paddingHorizontal: 6,
      borderRadius: 8,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      gap: 3,
    },
    bottomActionText: {
      fontFamily: FONTS.secondary,
      fontSize: 9,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
    },
    // Quick Actions
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    quickActionWrapper: {
      width: CARD_WIDTH,
    },
    // CTA Banner
    ctaBanner: {
      marginHorizontal: 20,
      marginBottom: 24,
      borderRadius: 24,
      overflow: "hidden",
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
    },
    ctaGradient: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
    },
    ctaDecor1: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: 80,
    },
    ctaDecor2: {
      position: "absolute",
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      left: 40,
    },
    ctaContent: {
      flex: 1,
      marginRight: 16,
      position: "relative",
      zIndex: 1,
    },
    ctaIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    ctaTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.neutral.white,
      marginBottom: 4,
    },
    ctaDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.85)",
    },
    ctaButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.neutral.white,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      gap: 4,
      position: "relative",
      zIndex: 1,
    },
    ctaButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: "#10B981",
    },
    // Empty State
    emptyChildrenState: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 20,
    },
    emptyStateButton: {
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyStateButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 14,
      gap: 8,
    },
    emptyStateButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
  });
