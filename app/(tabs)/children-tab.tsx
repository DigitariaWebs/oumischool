import React, { useState } from "react";
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
} from "lucide-react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addChild } from "@/store/slices/childrenSlice";
import AddChildModal from "@/components/AddChildModal";

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
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(600)}
    layout={Layout.duration(300)}
    style={styles.childDetailCard}
  >
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
            <View
              style={[
                styles.childDetailAvatar,
                { backgroundColor: child.color + "40" },
              ]}
            >
              <Text
                style={[styles.childDetailAvatarText, { color: child.color }]}
              >
                {child.avatar || child.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.childDetailName}>{child.name}</Text>
              <Text style={styles.childDetailGrade}>
                {child.grade} • {calculateAge(child.dateOfBirth)} ans
              </Text>
            </View>
          </View>
          <View
            style={[styles.editButton, { backgroundColor: child.color + "20" }]}
          >
            <Edit size={18} color={child.color} />
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progression globale</Text>
            <Text style={styles.progressPercentage}>{child.progress}%</Text>
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
            <BookOpen size={20} color={COLORS.secondary[500]} />
            <Text style={styles.statValue}>
              {child.lessonsCompleted}/{child.totalLessons}
            </Text>
            <Text style={styles.statLabel}>Leçons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={20} color={COLORS.secondary[500]} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Cette semaine</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <TrendingUp size={20} color={COLORS.primary.DEFAULT} />
            <Text style={[styles.statValue, { color: COLORS.primary.DEFAULT }]}>
              +12%
            </Text>
            <Text style={styles.statLabel}>Ce mois</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

export default function ChildrenTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const childrenFromStore = useAppSelector((state) => state.children.children);
  const [addModalVisible, setAddModalVisible] = useState(false);

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
            <View style={styles.addChildIcon}>
              <Plus size={24} color={COLORS.primary.DEFAULT} />
            </View>
            <View style={styles.addChildText}>
              <Text style={styles.addChildTitle}>Ajouter un enfant</Text>
              <Text style={styles.addChildSubtitle}>
                Créer un nouveau profil
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>Conseil</Text>
          <Text style={styles.infoText}>
            Pour chaque enfant, vous pouvez personnaliser le plan hebdomadaire
            et suivre sa progression matière par matière.
          </Text>
        </Animated.View>
      </ScrollView>

      <AddChildModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddChild}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
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
    color: COLORS.secondary[900],
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
  },
  // Child Detail Card
  childDetailCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  childCardGradient: {
    padding: 20,
    backgroundColor: COLORS.neutral.white,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  childDetailAvatarText: {
    fontSize: 32,
  },
  childDetailName: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  childDetailGrade: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
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
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
  progressPercentage: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.neutral[200],
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
    borderTopColor: COLORS.neutral[200],
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[500],
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: COLORS.neutral[200],
  },
  // Add Child Button
  addChildButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary[100],
    borderStyle: "dashed",
    marginBottom: 20,
  },
  addChildIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addChildText: {
    flex: 1,
  },
  addChildTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  addChildSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  // Info Card
  infoCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 20,
  },
});
