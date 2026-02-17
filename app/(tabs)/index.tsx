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
  User,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 cards per row with proper spacing

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay: number;
}

const QuickActionCard: React.FC<QuickActionProps & { styles: any }> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
  delay,
  styles,
}) => (
  <TouchableOpacity
    style={styles.quickActionCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={styles.quickActionTextContainer}>
      <Text style={styles.quickActionTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps & { styles: any }> = ({
  icon,
  title,
  description,
  color,
  delay,
  styles,
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(600)}
    style={styles.featureCard}
  >
    <View style={[styles.featureIcon, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </Animated.View>
);

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
  const { isDark } = useTheme();

  // Get data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);

  const userName = user?.name || "Utilisateur";

  // Mock notification count - replace with actual state management
  const notificationCount = 3;

  const styles = useMemo(() => createStyles(isDark), [isDark]);

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
        barStyle="light-content"
        backgroundColor={COLORS.primary.DEFAULT}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerContainer}
        >
          <LinearGradient
            colors={[COLORS.primary.DEFAULT, COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Avatar
                  name={userName}
                  source={user?.avatar}
                  size="lg"
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.greeting}>Welcome Back !</Text>
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
                <Bell size={24} color={COLORS.neutral.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{children.length}</Text>
            <Text style={styles.statLabel}>Enfants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Leçons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>68%</Text>
            <Text style={styles.statLabel}>Progrès</Text>
          </View>
        </View>
        {/* Children Section */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Mes enfants</Text>
            <TouchableOpacity onPress={() => router.push("/children-tab")}>
              <Text style={styles.seeAllText}>Voir tout</Text>
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
                  delay={500 + index * 100}
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
              entering={FadeInDown.delay(500).duration(600)}
              style={styles.emptyChildrenState}
            >
              <View style={styles.emptyStateIcon}>
                <Baby size={48} color={COLORS.primary.DEFAULT} />
              </View>
              <Text style={styles.emptyStateTitle}>Aucun enfant ajouté</Text>
              <Text style={styles.emptyStateText}>
                Commencez par ajouter le profil de votre premier enfant
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push("/children-tab")}
              >
                <Plus size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>
                  Ajouter un enfant
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(700).duration(600)}
            style={styles.sectionTitle}
          >
            Actions rapides
          </Animated.Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(800 + index * 100).duration(600)}
                style={styles.quickActionWrapper}
              >
                <QuickActionCard {...action} delay={0} styles={styles} />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(1200).duration(600)}
            style={styles.sectionTitle}
          >
            Tout pour réussir
          </Animated.Text>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={1300 + index * 100}
              styles={styles}
            />
          ))}
        </View>

        {/* CTA Banner */}
        <Animated.View
          entering={FadeInDown.delay(1600).duration(600)}
          style={styles.ctaBanner}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Découvrez le Coach IA</Text>
              <Text style={styles.ctaDescription}>
                Obtenez des conseils personnalisés pour votre enfant
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/ai-coach")}
            >
              <Text style={styles.ctaButtonText}>Essayer</Text>
              <ChevronRight size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : "#F5F5F5",
    },
    scrollContent: {
      paddingBottom: 104,
    },
    // Header
    headerContainer: {
      padding: 5,
    },
    headerGradient: {
      borderTopRightRadius: 32,
      borderTopLeftRadius: 32,
      paddingHorizontal: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 20,
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
      borderColor: COLORS.neutral.white,
    },
    greeting: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: COLORS.neutral[100],
    },
    userName: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: COLORS.neutral.white,
      fontWeight: "600" as any,
    },
    notificationButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: "#EF4444",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: COLORS.primary.DEFAULT,
    },
    notificationBadgeText: {
      fontFamily: FONTS.fredoka,
      fontSize: 11,
      fontWeight: "600" as any,
      color: COLORS.neutral.white,
    },
    notificationIcon: {
      fontSize: 20,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      padding: 20,
      marginHorizontal: 5,
      marginBottom: 25,
      justifyContent: "space-around",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: isDark ? COLORS.primary.DEFAULT : COLORS.primary[700],
      fontWeight: "700" as any,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[500],
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    // Section
    section: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      marginBottom: 16,
    },
    seeAllText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: COLORS.primary.DEFAULT,
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
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
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
      fontSize: 15,
      fontWeight: "600" as any,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      marginBottom: 1,
    },
    childAge: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[500],
      marginBottom: 8,
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
      fontSize: 9,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
    },
    childStatValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 13,
      fontWeight: "700" as any,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
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
    quickActionCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 16,
      minHeight: 120,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    quickActionIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quickActionTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    quickActionTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600" as any,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      marginBottom: 4,
      lineHeight: 20,
    },
    quickActionSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[500],
    },
    // Feature Card
    featureCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    featureIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    featureTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      marginBottom: 8,
    },
    featureDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
      lineHeight: 20,
    },
    // CTA Banner
    ctaBanner: {
      marginHorizontal: 24,
      marginBottom: 8,
    },
    ctaGradient: {
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ctaContent: {
      flex: 1,
      marginRight: 12,
    },
    ctaTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: COLORS.neutral.white,
      marginBottom: 4,
    },
    ctaDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: COLORS.neutral[100],
      opacity: 0.9,
    },
    ctaButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.neutral.white,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 4,
    },
    ctaButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "700",
      color: "#8B5CF6",
    },
    // Empty State
    emptyChildrenState: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 32,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 20,
    },
    emptyStateButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.primary.DEFAULT,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
      gap: 8,
    },
    emptyStateButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
  });
