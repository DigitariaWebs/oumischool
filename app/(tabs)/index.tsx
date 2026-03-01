import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  Bell,
  Play,
  Baby,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { THEME } from "@/config/theme";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { useChildren, useChildProgress } from "@/hooks/api/parent";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { HapticPressable } from "@/components/ui/haptic-pressable";

const COLORS = {
  primary: THEME.colors.primary,
  secondary: THEME.colors.secondaryLight,
  text: THEME.colors.text,
  subtext: THEME.colors.subtext,
  accent: THEME.colors.accent,
  success: THEME.colors.success,
  white: THEME.colors.white,
};

function ChildCard({
  child,
  onPress,
}: {
  child: {
    id: string;
    name: string;
    grade: string;
    lessonsCompleted: number;
    totalLessons: number;
    scheduledLessons: number;
  };
  onPress: () => void;
}) {
  const { data: progressData, isLoading } = useChildProgress(child.id);
  const progress = progressData?.progress ?? 0;
  const lessonsCompleted =
    progressData?.lessonsCompleted ?? child.lessonsCompleted;
  const totalLessons = progressData?.totalLessons ?? child.totalLessons;
  const scheduledLessons =
    progressData?.scheduledLessons ?? child.scheduledLessons;

  return (
    <HapticPressable
      style={styles.childCard}
      onPress={onPress}
      hapticType="light"
      scale={0.97}
    >
      <View style={styles.childCardHeader}>
        <View style={styles.childAvatarPlaceholder}>
          <Text style={styles.childAvatarText}>
            {child.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childGrade}>{child.grade}</Text>
        </View>
        <View style={styles.childProgress}>
          <Text style={styles.childProgressText}>{progress}%</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.childStatsLoading}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
        </View>
      ) : (
        <View style={styles.childStats}>
          <View style={styles.childStat}>
            <BookOpen size={12} color={THEME.colors.subtext} />
            <Text style={styles.childStatText}>
              {lessonsCompleted}/{totalLessons}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.childStat}>
            <Play
              size={12}
              color={THEME.colors.subtext}
              fill={THEME.colors.subtext}
            />
            <Text style={styles.childStatText}>{scheduledLessons} actives</Text>
          </View>
        </View>
      )}
    </HapticPressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: childrenFromApi = [], isLoading } = useChildren();
  const userName = user?.name || user?.email?.split("@")[0] || "Parent";

  const children = childrenFromApi.map((child) => ({
    id: child.id,
    name: child.name,
    grade: child.grade,
    lessonsCompleted: 0,
    totalLessons: 20,
    scheduledLessons: 0,
  }));

  const quickActions = [
    {
      icon: <Plus size={20} color={THEME.colors.subtext} />,
      title: "Ajouter",
      onPress: () => router.push("/children-tab?openModal=true"),
      hapticType: "medium" as const,
    },
    {
      icon: <Calendar size={20} color={THEME.colors.subtext} />,
      title: "Plan",
      onPress: () => router.push("/weekly-plan"),
      hapticType: "selection" as const,
    },
    {
      icon: <Sparkles size={20} color={THEME.colors.subtext} />,
      title: "Coach IA",
      onPress: () => router.push("/ai-coach"),
      hapticType: "selection" as const,
    },
    {
      icon: <BookOpen size={20} color={THEME.colors.subtext} />,
      title: "Ressources",
      onPress: () => router.push("/resources"),
      hapticType: "selection" as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>OUMI&apos;SCHOOL</Text>
            <Text style={styles.headerTitle}>Bonjour, {userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Bell size={22} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Progression globale */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progression globale</Text>
            <View style={styles.progressBadge}>
              <Sparkles size={12} color="white" />
              <Text style={styles.progressBadgeText}>
                {children.length} enfant{children.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          <Text style={styles.progressValue}>68%</Text>
          <Text style={styles.progressSubtitle}>Objectif mensuel</Text>
          <View style={styles.progressBarWrapper}>
            <AnimatedProgress
              progress={68}
              height={6}
              fillColor={THEME.colors.white}
              backgroundColor="rgba(255,255,255,0.3)"
              borderRadius={3}
            />
          </View>
        </View>

        {/* Section Mes enfants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Baby size={18} color={THEME.colors.error} />
              <Text style={styles.sectionTitle}>Mes enfants</Text>
            </View>
            <HapticPressable
              onPress={() => router.push("/children-tab")}
              hapticType="selection"
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
            </HapticPressable>
          </View>

          {isLoading ? (
            <View style={styles.childrenLoadingContainer}>
              <ActivityIndicator size="small" color={THEME.colors.primary} />
              <Text style={styles.childrenLoadingText}>Chargement...</Text>
            </View>
          ) : children.length > 0 ? (
            <View style={styles.childrenList}>
              {children.slice(0, 2).map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onPress={() =>
                    router.push(`/parent/child/details?id=${child.id}`)
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun enfant ajouté</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/children-tab")}
              >
                <Plus size={16} color="white" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Actions rapides - style grille */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <HapticPressable
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
                hapticType={action.hapticType}
                scale={0.95}
              >
                <View style={styles.quickActionIcon}>{action.icon}</View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </HapticPressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xxl,
    paddingTop: 20,
    paddingBottom: THEME.spacing.lg,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: THEME.colors.primary,
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: THEME.colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.error,
    borderWidth: 2,
    borderColor: THEME.colors.secondaryLight,
  },

  // Progress Card
  progressCard: {
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.xxl,
    borderRadius: THEME.radius.xxl,
    overflow: "hidden",
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  progressBarWrapper: {
    marginTop: THEME.spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.sm,
  },
  progressTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  progressValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 42,
    color: "white",
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  childrenLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  childrenLoadingText: {
    fontSize: 13,
    color: COLORS.subtext,
  },

  // Section
  section: {
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: THEME.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: THEME.colors.primary,
    fontWeight: "600",
  },

  // Children
  childrenList: {
    gap: THEME.spacing.md,
  },
  childCard: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  childCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  childAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.lg,
    marginRight: THEME.spacing.md,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  childAvatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  childProgress: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.md,
  },
  childProgressText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  childStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  childStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  childStatText: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: THEME.colors.border,
  },
  childStatsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: THEME.spacing.md,
  },

  // Empty state
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.radius.xl,
    padding: 32,
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.subtext,
    marginBottom: THEME.spacing.lg,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: THEME.spacing.md,
    borderRadius: 30,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.white,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    alignItems: "center",
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
});
