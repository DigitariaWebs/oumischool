import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  TrendingUp,
  Calendar,
  BookOpen,
  Edit,
  Users,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addChild } from "@/store/slices/childrenSlice";
import AddChildModal from "@/components/AddChildModal";
import {
  EmptyState,
  BlobBackground,
  HeroCard,
  AnimatedSection,
} from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

interface Child {
  id: number;
  name: string;
  grade: string;
  dateOfBirth: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  avatar: string;
  color: string;
}

// Calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

interface ChildCardProps {
  child: Child;
  delay: number;
  onPress: () => void;
}

const ChildDetailCard: React.FC<ChildCardProps> = ({
  child,
  delay,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify()}
      layout={Layout.duration(300)}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.childDetailCard}
      >
        <LinearGradient
          colors={[child.color + "25", child.color + "08"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.childCardGradient}
        >
          {/* Decorative circles */}
          <View
            style={[
              styles.decorCircle1,
              { backgroundColor: child.color + "15" },
            ]}
          />
          <View
            style={[
              styles.decorCircle2,
              { backgroundColor: child.color + "10" },
            ]}
          />

          {/* Header */}
          <View style={styles.childCardHeader}>
            <View style={styles.childCardHeaderLeft}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: child.color + "30" },
                ]}
              >
                <Text style={[styles.avatarText, { color: child.color }]}>
                  {child.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.childDetailName}>{child.name}</Text>
                <View style={styles.childInfo}>
                  <View
                    style={[
                      styles.gradeBadge,
                      { backgroundColor: child.color + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.gradeBadgeText, { color: child.color }]}
                    >
                      {child.grade}
                    </Text>
                  </View>
                  <Text style={styles.childAge}>
                    {calculateAge(child.dateOfBirth)} ans
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: child.color + "15" },
              ]}
            >
              <Edit size={18} color={child.color} />
            </TouchableOpacity>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progression globale</Text>
              <View
                style={[styles.progressBadge, { backgroundColor: "#10B98115" }]}
              >
                <Text style={styles.progressBadgeText}>{child.progress}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={[child.color, child.color + "CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBarFill,
                  { width: `${child.progress}%` },
                ]}
              />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <BookOpen size={18} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {child.lessonsCompleted}/{child.totalLessons}
              </Text>
              <Text style={styles.statLabel}>Leçons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#3B82F615" },
                ]}
              >
                <Calendar size={18} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#10B98115" },
                ]}
              >
                <TrendingUp size={18} color="#10B981" />
              </View>
              <Text style={[styles.statValue, { color: "#10B981" }]}>+12%</Text>
              <Text style={styles.statLabel}>Ce mois</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ChildrenTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const childrenFromStore = useAppSelector((state) => state.children.children);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  // Map Redux children to local Child interface
  const children: Child[] = childrenFromStore.map((child) => ({
    id: parseInt(child.id.split("-")[1]),
    name: child.name,
    grade: child.grade,
    dateOfBirth: child.dateOfBirth,
    progress: child.progress,
    lessonsCompleted: child.lessonsCompleted,
    totalLessons: child.totalLessons,
    avatar: child.avatar,
    color: child.color,
  }));

  const handleAddChild = (childData: {
    name: string;
    dateOfBirth: string;
    grade: string;
    color: string;
  }) => {
    const newChild = {
      id: `child-${Date.now()}`,
      name: childData.name,
      dateOfBirth: childData.dateOfBirth,
      grade: childData.grade,
      avatar: "",
      color: childData.color,
      parentId: "parent-1",
      progress: 0,
      lessonsCompleted: 0,
      totalLessons: 20,
      weeklyActivity: 0,
      monthlyGrowth: 0,
      favoriteSubjects: [],
      learningGoals: [],
    };
    dispatch(addChild(newChild));
  };

  return (
    <SafeAreaView style={styles.container}>
      <BlobBackground />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Users size={20} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.headerTitle}>Mes enfants</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{children.length}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        {children.length > 0 && (
          <AnimatedSection delay={150} style={styles.heroCardWrapper}>
            <HeroCard
              title="Progression moyenne"
              value={`${Math.round(children.reduce((acc, c) => acc + c.progress, 0) / children.length)}%`}
              badge={{
                icon: <TrendingUp size={14} color="#FCD34D" />,
                text: `${children.length} enfant${children.length > 1 ? "s" : ""} inscrits`,
              }}
            />
          </AnimatedSection>
        )}

        {children.length === 0 ? (
          <AnimatedSection delay={200} style={styles.emptyStateContainer}>
            <EmptyState
              icon={<Users size={48} color={colors.textMuted} />}
              title="Aucun enfant ajouté"
              description="Commencez par ajouter un profil pour votre enfant afin de suivre sa progression"
              actionLabel="Ajouter un enfant"
              onAction={() => setAddModalVisible(true)}
            />
          </AnimatedSection>
        ) : (
          <>
            {/* Section Title */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600).springify()}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Profils des enfants</Text>
            </Animated.View>

            {/* Children Cards */}
            {children.map((child, index) => (
              <ChildDetailCard
                key={child.id}
                child={child}
                delay={250 + index * 100}
                onPress={() =>
                  router.push(`/parent/child/details?id=child-${child.id}`)
                }
              />
            ))}

            {/* Add Child Button */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(600).springify()}
            >
              <TouchableOpacity
                style={styles.addChildButton}
                onPress={() => setAddModalVisible(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addChildGradient}
                >
                  <View style={styles.addChildIconWrapper}>
                    <Plus size={22} color={COLORS.neutral.white} />
                  </View>
                  <Text style={styles.addChildButtonText}>
                    Ajouter un enfant
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>

      <AddChildModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddChild}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBottom: 64,
    },
    heroCardWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    // Blob Background

    // Header
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    headerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
    },
    headerBadge: {
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 12,
    },
    headerBadgeText: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    scrollContent: {
      padding: 20,
      paddingTop: 8,
    },
    // Summary Card

    // Section Header
    sectionHeader: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    // Child Detail Card
    childDetailCard: {
      marginBottom: 16,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: colors.card,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    childCardGradient: {
      padding: 20,
      position: "relative",
      overflow: "hidden",
    },
    decorCircle1: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      top: -30,
      right: -20,
    },
    decorCircle2: {
      position: "absolute",
      width: 60,
      height: 60,
      borderRadius: 30,
      bottom: -15,
      right: 60,
    },
    childCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      position: "relative",
      zIndex: 1,
    },
    childCardHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 14,
    },
    avatarContainer: {
      width: 56,
      height: 56,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      fontWeight: "600",
    },
    childInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 10,
    },
    gradeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    gradeBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
    },
    childAge: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    childDetailName: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    editButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    // Progress
    progressSection: {
      marginBottom: 20,
      position: "relative",
      zIndex: 1,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    progressBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    progressBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "#10B981",
      fontWeight: "700",
    },
    progressBarContainer: {
      height: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
      borderRadius: 5,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 5,
    },
    // Stats
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      position: "relative",
      zIndex: 1,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 6,
    },
    statValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
      fontWeight: "700",
      marginBottom: 2,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      height: "70%",
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      alignSelf: "center",
    },
    // Add Child Button
    addChildButton: {
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 18,
      overflow: "hidden",
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    addChildGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 18,
      paddingHorizontal: 24,
      gap: 12,
    },
    addChildIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    addChildButtonText: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
    // Empty State
    emptyStateContainer: {
      flex: 1,
      marginTop: 16,
    },
    // Info Card (legacy)
    infoCard: {
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoBadge: {
      marginBottom: SPACING.sm,
    },
    infoText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
