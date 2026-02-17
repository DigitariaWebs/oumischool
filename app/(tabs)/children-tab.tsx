import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  TrendingUp,
  Calendar,
  BookOpen,
  Edit,
  Sparkles,
  Users,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addChild } from "@/store/slices/childrenSlice";
import AddChildModal from "@/components/AddChildModal";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600)}
      layout={Layout.duration(300)}
    >
      <Card variant="elevated" padding="none" style={styles.childDetailCard}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <LinearGradient
            colors={[child.color + "20", child.color + "10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.childCardGradient}
          >
            {/* Header */}
            <View style={styles.childCardHeader}>
              <View style={styles.childCardHeaderLeft}>
                <Avatar
                  name={child.name}
                  size="lg"
                  style={{
                    ...styles.childDetailAvatar,
                    backgroundColor: child.color + "40",
                  }}
                />
                <View>
                  <Text style={styles.childDetailName}>{child.name}</Text>
                  <View style={styles.childInfo}>
                    <Badge label={child.grade} variant="secondary" size="sm" />
                    <Text style={styles.childAge}>
                      {calculateAge(child.dateOfBirth)} ans
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  { backgroundColor: child.color + "20" },
                ]}
              >
                <Edit size={18} color={child.color} />
              </TouchableOpacity>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progression globale</Text>
                <Badge
                  label={`${child.progress}%`}
                  variant="success"
                  size="sm"
                />
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${child.progress}%`,
                      backgroundColor: child.color,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <BookOpen size={20} color={colors.icon} />
                <Text style={styles.statValue}>
                  {child.lessonsCompleted}/{child.totalLessons}
                </Text>
                <Text style={styles.statLabel}>Leçons</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Calendar size={20} color={colors.icon} />
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Cette semaine</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <TrendingUp size={20} color={COLORS.primary.DEFAULT} />
                <Text
                  style={[styles.statValue, { color: COLORS.primary.DEFAULT }]}
                >
                  +12%
                </Text>
                <Text style={styles.statLabel}>Ce mois</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
};

export default function ChildrenTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const childrenFromStore = useAppSelector((state) => state.children.children);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes enfants</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children.length === 0 ? (
          <EmptyState
            icon={<Plus size={48} color={colors.textMuted} />}
            title="Aucun enfant ajouté"
            description="Commencez par ajouter un profil pour votre enfant afin de suivre sa progression"
            actionLabel="Ajouter un enfant"
            onAction={() => setAddModalVisible(true)}
          />
        ) : (
          <>
            {/* Children Cards */}
            {children.map((child, index) => (
              <ChildDetailCard
                key={child.id}
                child={child}
                delay={200 + index * 100}
                onPress={() =>
                  router.push(`/parent/child/details?id=child-${child.id}`)
                }
              />
            ))}

            {/* Add Child Button */}
            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <TouchableOpacity
                style={styles.addChildButton}
                onPress={() => setAddModalVisible(true)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[COLORS.primary.DEFAULT, COLORS.primary[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addChildGradient}
                >
                  <View style={styles.addChildIconWrapper}>
                    <Plus size={24} color={COLORS.neutral.white} />
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

const createStyles = (colors: import("@/constants/theme").ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBottom: 64,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
    },
    scrollContent: {
      padding: SPACING.lg,
      paddingTop: SPACING.sm,
    },
    // Child Detail Card
    childDetailCard: {
      marginBottom: SPACING.lg,
      borderRadius: 24,
      overflow: "hidden",
    },
    childCardGradient: {
      padding: 20,
      backgroundColor: colors.card,
    },
    childCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    childCardHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    childDetailAvatar: {
      marginRight: SPACING.md,
    },
    childInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: SPACING.sm,
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
      marginBottom: 4,
    },

    editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    // Progress
    progressSection: {
      marginBottom: 20,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    progressLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },

    progressBarContainer: {
      height: 10,
      backgroundColor: colors.progressBg,
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
      borderTopColor: colors.divider,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textPrimary,
      fontWeight: "700",
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      height: "100%",
      backgroundColor: colors.divider,
    },
    // Add Child Button
    addChildButton: {
      marginBottom: SPACING.lg,
      borderRadius: 16,
      overflow: "hidden",
      elevation: 4,
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    addChildGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      paddingHorizontal: SPACING.lg,
      gap: 12,
    },
    addChildIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    addChildButtonText: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.neutral.white,
    },
    // Info Card
    infoCard: {
      backgroundColor: colors.infoCardBg,
      borderLeftWidth: 4,
      borderLeftColor: colors.infoCardBorder,
    },
    infoBadge: {
      marginBottom: SPACING.sm,
    },
    infoText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.infoCardText,
      lineHeight: 20,
    },
  });
