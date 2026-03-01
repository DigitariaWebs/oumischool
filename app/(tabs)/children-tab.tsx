import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  TrendingUp,
  Calendar,
  BookOpen,
  Edit,
  Users,
} from "lucide-react-native";

import { THEME } from "@/config/theme";
import { FONTS } from "@/config/fonts";
import AddChildModal from "@/components/AddChildModal";
import {
  useChildren,
  useCreateChild,
  useChildProgress,
} from "@/hooks/api/parent";
import { HapticPressable } from "@/components/ui/haptic-pressable";

interface Child {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  avatar: string;
  color: string;
}

// Images pour les enfants (comme dans tuteur)
const childImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

const CHILD_COLORS = [
  "#3B82F6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#F97316",
];

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CHILD_COLORS[Math.abs(hash) % CHILD_COLORS.length];
}

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return 0;
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

export default function ChildrenTab() {
  const router = useRouter();
  const { data: childrenFromApi = [], isLoading, refetch } = useChildren();
  const createChild = useCreateChild();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const { openModal } = useLocalSearchParams<{ openModal?: string }>();

  useEffect(() => {
    if (openModal === "true") {
      setAddModalVisible(true);
    }
  }, [openModal]);

  const children: Child[] = childrenFromApi.map((child, index) => ({
    id: child.id,
    name: child.name,
    grade: child.grade,
    dateOfBirth: child.dateOfBirth ?? "",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 20,
    avatar: childImages[index % childImages.length],
    color: colorFromId(child.id),
  }));

  const totalChildren = children.length;
  const totalLessonsCompleted = 0;
  const totalScheduledLessons = 0;

  const handleAddChild = async (childData: {
    name: string;
    dateOfBirth: string;
    grade: string;
    color: string;
  }) => {
    await createChild.mutateAsync({
      name: childData.name,
      dateOfBirth: childData.dateOfBirth,
      grade: childData.grade,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>ENFANTS</Text>
          <Text style={styles.headerTitle}>Mes enfants</Text>
        </View>
        <HapticPressable
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
          hapticType="medium"
          scale={0.95}
        >
          <Plus size={18} color={THEME.colors.white} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </HapticPressable>
      </View>

      {/* Stats Section */}
      {totalChildren > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={20} color={THEME.colors.primary} />
            <Text style={styles.statLabelValue}>{totalChildren}</Text>
            <Text style={styles.statLabel}>Enfants</Text>
          </View>
          <View style={styles.statCard}>
            <BookOpen size={20} color={THEME.colors.success} />
            <Text style={styles.statLabelValue}>{totalLessonsCompleted}</Text>
            <Text style={styles.statLabel}>Leçons</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color={THEME.colors.accent} />
            <Text style={styles.statLabelValue}>{totalScheduledLessons}</Text>
            <Text style={styles.statLabel}>À venir</Text>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={THEME.colors.primary} />
            <Text style={styles.loadingText}>Chargement des enfants...</Text>
          </View>
        ) : children.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucun enfant ajouté</Text>
            <Text style={styles.emptyDescription}>
              Commencez par ajouter un profil pour votre enfant
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addFirstButtonText}>Ajouter un enfant</Text>
            </TouchableOpacity>
            {!isLoading ? (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text style={styles.retryButtonText}>Actualiser</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <>
            {children.map((child, index) => (
              <ChildCard
                key={child.id}
                child={child}
                onPress={() =>
                  router.push(`/parent/child/details?id=${child.id}`)
                }
              />
            ))}
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

function ChildCard({ child, onPress }: { child: Child; onPress: () => void }) {
  const { data: progressData, isLoading: progressLoading } = useChildProgress(
    child.id,
  );
  const lessonsCompleted =
    progressData?.lessonsCompleted ?? child.lessonsCompleted;
  const totalLessons = progressData?.totalLessons ?? child.totalLessons;
  const scheduledLessons = progressData?.scheduledLessons ?? 0;
  const improvementPercentage = progressData?.improvementPercentage ?? 0;

  return (
    <HapticPressable
      style={[styles.childCard, {}]}
      onPress={onPress}
      hapticType="light"
      scale={0.97}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.avatarWrapper,
            {
              backgroundColor: child.color + "20",
              borderColor: child.color + "40",
            },
          ]}
        >
          <Image source={{ uri: child.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childDetails}>
            {calculateAge(child.dateOfBirth)} ans • {child.grade}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.editButton,
            {
              borderColor: child.color + "40",
              backgroundColor: child.color + "10",
            },
          ]}
          onPress={onPress}
        >
          <Edit size={16} color={child.color} />
        </TouchableOpacity>
      </View>

      {progressLoading ? (
        <View style={styles.statsRow}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
        </View>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <BookOpen size={14} color={THEME.colors.subtext} />
            <Text style={styles.statItemValue}>
              {lessonsCompleted}/{totalLessons}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={14} color={THEME.colors.subtext} />
            <Text style={styles.statItemValue}>{scheduledLessons}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <TrendingUp size={14} color={THEME.colors.success} />
            <Text
              style={[
                styles.statItemValue,
                {
                  color:
                    improvementPercentage >= 0
                      ? THEME.colors.success
                      : THEME.colors.error,
                },
              ]}
            >
              {improvementPercentage >= 0 ? "+" : ""}
              {improvementPercentage}%
            </Text>
          </View>
        </View>
      )}
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.white,
  },
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
    fontSize: 28,
    color: THEME.colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 10,
    borderRadius: 24,
    boxShadow: THEME.shadows.button,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: 20,
    gap: THEME.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    alignItems: "center",
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statLabelValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: THEME.colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.subtext,
    marginTop: 4,
  },
  scrollContent: {
    padding: THEME.spacing.xxl,
    paddingTop: THEME.spacing.sm,
    paddingBottom: 100,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: THEME.spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: THEME.colors.subtext,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: THEME.colors.subtext,
    textAlign: "center",
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    paddingHorizontal: 20,
    paddingVertical: THEME.spacing.md,
    borderRadius: 30,
  },
  addFirstButtonText: {
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.colors.secondaryText,
  },
  retryButtonText: {
    fontSize: 14,
    color: THEME.colors.secondaryTextDark,
    fontWeight: "600",
  },

  // Card style
  childCard: {
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    marginRight: THEME.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.md,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 13,
    color: THEME.colors.subtext,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statItemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: THEME.colors.border,
  },

  // Progress
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.text,
    minWidth: 38,
    textAlign: "right",
  },
});
