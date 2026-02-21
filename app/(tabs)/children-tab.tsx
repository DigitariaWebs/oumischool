import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
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

// Images pour les enfants (comme dans tuteur)
const childImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function ChildrenTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const childrenFromStore = useAppSelector((state) => state.children.children);
  const [addModalVisible, setAddModalVisible] = useState(false);

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

  const handleAddChild = (childData: any) => {
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
      {/* Header simple */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes enfants</Text>
        <View style={styles.headerBadge}>
          <Users size={18} color="#6366F1" />
          <Text style={styles.headerBadgeText}>{children.length}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {children.length === 0 ? (
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
          </View>
        ) : (
          <>
            {/* Liste des enfants avec images */}
            {children.map((child, index) => (
              <Pressable
                key={child.id}
                style={({ pressed }) => [styles.childCard, pressed && { opacity: 0.9 }]}
                onPress={() => router.push(`/parent/child/details?id=child-${child.id}`)}
              >
                {/* En-tête avec avatar image et infos */}
                <View style={styles.cardHeader}>
                  <Image 
                    source={{ uri: childImages[index % childImages.length] }} 
                    style={styles.avatar}
                  />
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childDetails}>
                      {calculateAge(child.dateOfBirth)} ans • {child.grade}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <Edit size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Statistiques en ligne */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <BookOpen size={14} color="#64748B" />
                    <Text style={styles.statValue}>
                      {child.lessonsCompleted}/{child.totalLessons}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.statValue}>5</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <TrendingUp size={14} color="#10B981" />
                    <Text style={[styles.statValue, { color: "#10B981" }]}>+12%</Text>
                  </View>
                </View>

                {/* Barre de progression */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${child.progress}%`, backgroundColor: child.color }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{child.progress}%</Text>
                </View>
              </Pressable>
            ))}

            {/* Bouton Ajouter (style "Add source" de l'image) */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Plus size={18} color="#64748B" />
              <Text style={styles.addButtonText}>Ajouter un enfant</Text>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#6366F1",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
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
    color: "#1E293B",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  addFirstButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Card style
  childCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 13,
    color: "#64748B",
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#F1F5F9",
  },

  // Progress
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    width: 35,
  },

  // Add button (style "Add source")
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  addButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});