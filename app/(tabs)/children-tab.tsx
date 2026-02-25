import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
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

import { FONTS } from "@/config/fonts";
import AddChildModal from "@/components/AddChildModal";
import { useChildren, useCreateChild } from "@/hooks/api/parent";

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

  const children: Child[] = childrenFromApi.map((child, index) => ({
    id: child.id,
    name: child.name,
    grade: child.grade,
    dateOfBirth: child.dateOfBirth ?? "",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 20,
    avatar: childImages[index % childImages.length],
    color: CHILD_COLORS[index % CHILD_COLORS.length],
  }));

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
      {/* Header simple */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes enfants</Text>
        <View style={styles.headerBadge}>
          <Users size={18} color="#6366F1" />
          <Text style={styles.headerBadgeText}>{children.length}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6366F1" />
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
            {/* Liste des enfants avec images */}
            {children.map((child, index) => (
              <Pressable
                key={child.id}
                style={({ pressed }) => [
                  styles.childCard,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() =>
                  router.push(`/parent/child/details?id=${child.id}`)
                }
              >
                {/* En-tête avec avatar image et infos */}
                <View style={styles.cardHeader}>
                  <Image source={{ uri: child.avatar }} style={styles.avatar} />
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childDetails}>
                      {calculateAge(child.dateOfBirth)} ans • {child.grade}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      router.push(`/parent/child/details?id=${child.id}`)
                    }
                  >
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
                    <Text style={[styles.statValue, { color: "#10B981" }]}>
                      +12%
                    </Text>
                  </View>
                </View>

                {/* Barre de progression */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${child.progress}%`,
                          backgroundColor: child.color,
                        },
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748B",
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
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  retryButtonText: {
    fontSize: 14,
    color: "#475569",
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
