import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Star,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Users,
  Filter,
  TrendingUp,
  DollarSign,
  X,
  Zap,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Tutor {
  id: string;
  name: string;
  subjects: Subject[];
  rating: number;
  reviewsCount: number;
  bio: string;
  avatar?: string;
  hourlyRate: number;
  experience: number;
  inPersonAvailable?: boolean;
  inPersonRate?: number;
}

interface TutorRecommendation {
  tutorId: string;
  childId: string;
  reason: string;
  subjectId: string;
}

// Mock data
const subjects: Subject[] = [
  { id: "math", name: "Maths", color: "#3B82F6" },
  { id: "french", name: "Français", color: "#EF4444" },
  { id: "science", name: "Sciences", color: "#10B981" },
  { id: "english", name: "Anglais", color: "#6366F1" },
  { id: "history", name: "Histoire", color: "#F59E0B" },
];

const mockChildren = [
  { id: "child1", name: "Emma", color: "#6366F1" },
  { id: "child2", name: "Lucas", color: "#10B981" },
];

const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Marie Dupont",
    subjects: [subjects[0], subjects[1]],
    rating: 4.8,
    reviewsCount: 45,
    bio: "Professeure expérimentée en mathématiques et français.",
    hourlyRate: 25,
    experience: 8,
    inPersonAvailable: true,
    inPersonRate: 35,
  },
  {
    id: "2",
    name: "Jean Martin",
    subjects: [subjects[2], subjects[3]],
    rating: 4.9,
    reviewsCount: 62,
    bio: "Spécialiste en sciences et anglais pour enfants.",
    hourlyRate: 30,
    experience: 10,
    inPersonAvailable: false,
  },
  {
    id: "3",
    name: "Sophie Leroy",
    subjects: [subjects[4]],
    rating: 4.7,
    reviewsCount: 38,
    bio: "Passionnée d'histoire et de géographie.",
    hourlyRate: 22,
    experience: 6,
    inPersonAvailable: true,
    inPersonRate: 28,
  },
];

const mockRecommendations: TutorRecommendation[] = [
  {
    tutorId: "1",
    childId: "child1",
    reason: "Recommandé pour les leçons de fractions",
    subjectId: "math",
  },
  {
    tutorId: "2",
    childId: "child1",
    reason: "Recommandé pour la compréhension orale",
    subjectId: "english",
  },
  {
    tutorId: "3",
    childId: "child2",
    reason: "Recommandé pour la Révolution française",
    subjectId: "history",
  },
];

export default function TutorsTab() {
  const router = useRouter();
  const [browseMode, setBrowseMode] = useState<"recommended" | "tutor">("recommended");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortByRating, setSortByRating] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>("all");

  const filteredTutors = mockTutors
    .filter((tutor) => {
      const matchesSubject =
        selectedSubject === "all" ||
        tutor.subjects.some((subj) => subj.id === selectedSubject);
      return matchesSubject;
    })
    .sort((a, b) => (sortByRating ? b.rating - a.rating : a.hourlyRate - b.hourlyRate));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>TUTEURS</Text>
          <Text style={styles.headerTitle}>Accompagnement</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{mockTutors.length}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte statistiques simple */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockTutors.length}</Text>
              <Text style={styles.statLabel}>Tuteurs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Note moyenne</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Matières</Text>
            </View>
          </View>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                browseMode === "recommended" && styles.modeButtonActive,
              ]}
              onPress={() => setBrowseMode("recommended")}
            >
              <Sparkles
                size={16}
                color={browseMode === "recommended" ? "white" : "#64748B"}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "recommended" && styles.modeButtonTextActive,
                ]}
              >
                Recommandés
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                browseMode === "tutor" && styles.modeButtonActive,
              ]}
              onPress={() => setBrowseMode("tutor")}
            >
              <Users
                size={16}
                color={browseMode === "tutor" ? "white" : "#64748B"}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "tutor" && styles.modeButtonTextActive,
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {browseMode === "tutor" ? (
          <>
            {/* Filtres */}
            <View style={styles.filtersSection}>
              <View style={styles.filterHeader}>
                <Filter size={16} color="#1E293B" />
                <Text style={styles.filterTitle}>Filtrer par matière</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subjectsContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.subjectChip,
                    selectedSubject === "all" && styles.subjectChipActive,
                  ]}
                  onPress={() => setSelectedSubject("all")}
                >
                  <Text
                    style={[
                      styles.subjectChipText,
                      selectedSubject === "all" && styles.subjectChipTextActive,
                    ]}
                  >
                    Tout
                  </Text>
                </TouchableOpacity>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.subjectChip,
                      selectedSubject === subject.id && {
                        backgroundColor: subject.color + "15",
                        borderColor: subject.color,
                      },
                    ]}
                    onPress={() => setSelectedSubject(subject.id)}
                  >
                    <Text
                      style={[
                        styles.subjectChipText,
                        selectedSubject === subject.id && { color: subject.color },
                      ]}
                    >
                      {subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tri */}
            <View style={styles.sortSection}>
              <View style={styles.sortHeader}>
                <TrendingUp size={16} color="#1E293B" />
                <Text style={styles.sortTitle}>Trier par</Text>
              </View>
              <View style={styles.sortButtons}>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    sortByRating && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortByRating(true)}
                >
                  <Star
                    size={14}
                    color={sortByRating ? "white" : "#64748B"}
                    fill={sortByRating ? "white" : "none"}
                  />
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortByRating && styles.sortButtonTextActive,
                    ]}
                  >
                    Note
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    !sortByRating && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortByRating(false)}
                >
                  <DollarSign
                    size={14}
                    color={!sortByRating ? "white" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.sortButtonText,
                      !sortByRating && styles.sortButtonTextActive,
                    ]}
                  >
                    Prix
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Liste des tuteurs */}
            <View style={styles.tutorsList}>
              <Text style={styles.tutorsCount}>
                {filteredTutors.length} tuteur{filteredTutors.length > 1 ? "s" : ""}
              </Text>
              {filteredTutors.map((tutor) => (
                <Pressable
                  key={tutor.id}
                  style={({ pressed }) => [styles.tutorCard, pressed && { opacity: 0.9 }]}
                  onPress={() => router.push(`/tutor/${tutor.id}`)}
                >
                  <View style={styles.tutorHeader}>
                    <View style={[styles.tutorAvatar, { backgroundColor: tutor.subjects[0].color + "20" }]}>
                      <Text style={[styles.tutorAvatarText, { color: tutor.subjects[0].color }]}>
                        {tutor.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.tutorInfo}>
                      <Text style={styles.tutorName}>{tutor.name}</Text>
                      <View style={styles.tutorRating}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{tutor.rating}</Text>
                        <Text style={styles.reviewsText}>({tutor.reviewsCount})</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#CBD5E1" />
                  </View>

                  <View style={styles.tutorSubjects}>
                    {tutor.subjects.map((subject) => (
                      <View
                        key={subject.id}
                        style={[styles.subjectBadge, { backgroundColor: subject.color + "15" }]}
                      >
                        <Text style={[styles.subjectBadgeText, { color: subject.color }]}>
                          {subject.name}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.tutorBio} numberOfLines={2}>
                    {tutor.bio}
                  </Text>

                  <View style={styles.tutorFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>En ligne</Text>
                      <Text style={styles.priceValue}>{tutor.hourlyRate}€/h</Text>
                    </View>
                    {tutor.inPersonAvailable && (
                      <>
                        <View style={styles.priceDivider} />
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceLabel}>Présentiel</Text>
                          <Text style={styles.priceValue}>{tutor.inPersonRate}€/h</Text>
                        </View>
                      </>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Filtre par enfant */}
            <View style={styles.childFilterSection}>
              <View style={styles.filterHeader}>
                <Users size={16} color="#1E293B" />
                <Text style={styles.filterTitle}>Pour</Text>
                {selectedChild !== "all" && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSelectedChild("all")}
                  >
                    <X size={14} color="#64748B" />
                    <Text style={styles.clearButtonText}>Effacer</Text>
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.childrenContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.childChip,
                    selectedChild === "all" && styles.childChipActive,
                  ]}
                  onPress={() => setSelectedChild("all")}
                >
                  <Text
                    style={[
                      styles.childChipText,
                      selectedChild === "all" && styles.childChipTextActive,
                    ]}
                  >
                    Tous
                  </Text>
                </TouchableOpacity>
                {mockChildren.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childChip,
                      selectedChild === child.id && {
                        backgroundColor: child.color + "15",
                        borderColor: child.color,
                      },
                    ]}
                    onPress={() => setSelectedChild(child.id)}
                  >
                    <View style={[styles.childDot, { backgroundColor: child.color }]} />
                    <Text
                      style={[
                        styles.childChipText,
                        selectedChild === child.id && { color: child.color },
                      ]}
                    >
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Recommandations */}
            <View style={styles.recommendationsList}>
              {mockRecommendations
                .filter((rec) => selectedChild === "all" || rec.childId === selectedChild)
                .map((rec, index) => {
                  const tutor = mockTutors.find((t) => t.id === rec.tutorId);
                  const child = mockChildren.find((c) => c.id === rec.childId);
                  const subject = subjects.find((s) => s.id === rec.subjectId);

                  if (!tutor || !child || !subject) return null;

                  return (
                    <View key={index} style={styles.recommendationCard}>
                      <View style={[styles.recommendationHeader, { borderLeftColor: child.color }]}>
                        <Text style={styles.recommendationFor}>Pour {child.name}</Text>
                        <View style={[styles.recommendationSubject, { backgroundColor: subject.color + "15" }]}>
                          <Text style={[styles.recommendationSubjectText, { color: subject.color }]}>
                            {subject.name}
                          </Text>
                        </View>
                      </View>

                      <Pressable
                        style={({ pressed }) => [styles.tutorCard, pressed && { opacity: 0.9 }]}
                        onPress={() => router.push(`/tutor/${tutor.id}`)}
                      >
                        <View style={styles.tutorHeader}>
                          <View style={[styles.tutorAvatar, { backgroundColor: tutor.subjects[0].color + "20" }]}>
                            <Text style={[styles.tutorAvatarText, { color: tutor.subjects[0].color }]}>
                              {tutor.name.charAt(0)}
                            </Text>
                          </View>
                          <View style={styles.tutorInfo}>
                            <Text style={styles.tutorName}>{tutor.name}</Text>
                            <View style={styles.tutorRating}>
                              <Star size={12} color="#F59E0B" fill="#F59E0B" />
                              <Text style={styles.ratingText}>{tutor.rating}</Text>
                            </View>
                          </View>
                        </View>

                        <Text style={styles.recommendationReason}>{rec.reason}</Text>

                        <View style={styles.tutorFooter}>
                          <Text style={styles.priceValue}>{tutor.hourlyRate}€/h</Text>
                          <Text style={styles.experienceText}>{tutor.experience} ans d'exp.</Text>
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
            </View>
          </>
        )}

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Demander un tuteur</Text>
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
  headerBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#6366F1",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F1F5F9",
  },

  // Mode Toggle
  modeToggleContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: "#6366F1",
  },
  modeButtonText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  modeButtonTextActive: {
    color: "white",
  },

  // Filters
  filtersSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  subjectsContainer: {
    gap: 10,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  subjectChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  subjectChipText: {
    fontSize: 14,
    color: "#64748B",
  },
  subjectChipTextActive: {
    color: "white",
  },

  // Sort
  sortSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sortHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sortTitle: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  sortButtons: {
    flexDirection: "row",
    gap: 10,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  sortButtonText: {
    fontSize: 13,
    color: "#64748B",
  },
  sortButtonTextActive: {
    color: "white",
  },

  // Tutors List
  tutorsList: {
    paddingHorizontal: 24,
  },
  tutorsCount: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  tutorCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  tutorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tutorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tutorAvatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "600",
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  tutorRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 12,
    color: "#64748B",
  },
  tutorSubjects: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tutorBio: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 18,
  },
  tutorFooter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  priceContainer: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
  },
  priceDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F1F5F9",
  },
  experienceText: {
    fontSize: 13,
    color: "#64748B",
  },

  // Child Filter
  childFilterSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#64748B",
  },
  childrenContainer: {
    gap: 10,
    marginTop: 8,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 6,
  },
  childChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  childDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  childChipText: {
    fontSize: 14,
    color: "#64748B",
  },
  childChipTextActive: {
    color: "white",
  },

  // Recommendations
  recommendationsList: {
    paddingHorizontal: 24,
  },
  recommendationCard: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderLeftWidth: 4,
    borderColor: "#6366F1",
  },
  recommendationFor: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  recommendationSubject: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendationSubjectText: {
    fontSize: 11,
    fontWeight: "600",
  },
  recommendationReason: {
    fontSize: 13,
    color: "#64748B",
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 18,
  },

  // Source Button
  sourceButton: {
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});