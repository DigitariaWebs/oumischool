import React from "react";
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
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Bell,
  Baby,
  TrendingUp,
  Play,
  Users,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { approvePendingSessionByParent } from "@/store/slices/workflowSlice";
import { selectNextBestAction } from "@/store/selectors/workflowSelectors";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);
  const userName = user?.name || "Parent";
  const parentNextAction = useAppSelector((state) =>
    user?.id ? selectNextBestAction(state, "parent", user.id) : null,
  );

  // Images pour les enfants (comme dans tuteur)
  const childImages = [
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
  ];

  const quickActions = [
    {
      icon: <Plus size={20} color="#64748B" />,
      title: "Ajouter",
      onPress: () => router.push("/children-tab"),
    },
    {
      icon: <Calendar size={20} color="#64748B" />,
      title: "Plan",
      onPress: () => {
        if (
          parentNextAction?.type === "approve_pending_session" &&
          parentNextAction.entityId
        ) {
          dispatch(
            approvePendingSessionByParent({
              sessionId: parentNextAction.entityId,
            }),
          );
        }
        router.push("/weekly-plan");
      },
    },
    {
      icon: <Sparkles size={20} color="#64748B" />,
      title: "Coach IA",
      onPress: () => router.push("/ai-coach"),
    },
    {
      icon: <BookOpen size={20} color="#64748B" />,
      title: "Ressources",
      onPress: () => router.push("/resources"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>OUMI'SCHOOL</Text>
            <Text style={styles.headerTitle}>Bonjour, {userName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={22} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Progression globale - style carte simple */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progression globale</Text>
            <View style={styles.progressBadge}>
              <TrendingUp size={14} color="#10B981" />
              <Text style={styles.progressBadgeText}>
                {children.length} enfant{children.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          <Text style={styles.progressValue}>68%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "68%" }]} />
          </View>
        </View>

        {/* Section Mes enfants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Baby size={18} color="#EF4444" />
              <Text style={styles.sectionTitle}>Mes enfants</Text>
            </View>
            <Pressable onPress={() => router.push("/children-tab")}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>

          {children.length > 0 ? (
            <View style={styles.childrenList}>
              {children.slice(0, 2).map((child, index) => (
                <Pressable
                  key={child.id}
                  style={({ pressed }) => [styles.childCard, pressed && { opacity: 0.9 }]}
                  onPress={() => router.push(`/parent/child/details?id=${child.id}`)}
                >
                  <View style={styles.childCardHeader}>
                    <Image 
                      source={{ uri: childImages[index % childImages.length] }} 
                      style={styles.childAvatar}
                    />
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childGrade}>{child.grade}</Text>
                    </View>
                    <View style={styles.childProgress}>
                      <Text style={styles.childProgressText}>{child.progress}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.childStats}>
                    <View style={styles.childStat}>
                      <BookOpen size={12} color="#64748B" />
                      <Text style={styles.childStatText}>
                        {child.lessonsCompleted}/{child.totalLessons}
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.childStat}>
                      <Play size={12} color="#64748B" fill="#64748B" />
                      <Text style={styles.childStatText}>5 actives</Text>
                    </View>
                  </View>
                </Pressable>
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
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={styles.quickActionIcon}>
                  {action.icon}
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Fonctionnalités */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: "#EEF2FF" }]}>
              <BookOpen size={24} color="#6366F1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Programme structuré</Text>
              <Text style={styles.featureDescription}>
                Curriculum clair avec plan hebdomadaire
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: "#DBEAFE" }]}>
              <Sparkles size={24} color="#3B82F6" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Coach IA éducatif</Text>
              <Text style={styles.featureDescription}>
                Assistant personnalisé pour votre enfant
              </Text>
            </View>
          </View>
        </View>

        {/* Bouton Add source (style image) */}
        <TouchableOpacity style={styles.sourceButton}>
          <Plus size={18} color="#64748B" />
          <Text style={styles.sourceButtonText}>Ajouter une ressource</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
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
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },

  // Progress Card
  progressCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: "#64748B",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  progressValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 36,
    color: "#1E293B",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
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
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
  },
  seeAllText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Children
  childrenList: {
    gap: 12,
  },
  childCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  childCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  childAvatar: {
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
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 13,
    color: "#64748B",
  },
  childProgress: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  childProgressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  childStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  childStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  childStatText: {
    fontSize: 12,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#F1F5F9",
  },

  // Empty state
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyStateText: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    gap: 12,
    marginTop: 8,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickActionText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },

  // Features
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#64748B",
  },

  // Source Button
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
