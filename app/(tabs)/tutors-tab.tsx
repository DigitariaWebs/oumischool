import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Star,
  ChevronRight,
  Sparkles,
  Users,
  Filter,
  TrendingUp,
  DollarSign,
  X,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { THEME } from "@/config/theme";
import { FONTS } from "@/config/fonts";
import { useTutors } from "@/hooks/api/tutors";
import type { TutorListItem } from "@/hooks/api/tutors/api";
import { useChildren } from "@/hooks/api/parent";
import { HapticPressable } from "@/components/ui/haptic-pressable";

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

const SUBJECT_META: Record<string, { name: string; color: string }> = {
  math: { name: "Maths", color: "#3B82F6" },
  mathematics: { name: "Maths", color: "#3B82F6" },
  french: { name: "Français", color: "#EF4444" },
  fr: { name: "Français", color: "#EF4444" },
  science: { name: "Sciences", color: "#10B981" },
  english: { name: "Anglais", color: "#6366F1" },
  history: { name: "Histoire", color: "#F59E0B" },
};

const FALLBACK_SUBJECT: Subject = {
  id: "general",
  name: "General",
  color: "#6366F1",
};

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

function subjectFromId(id: string): Subject {
  const key = id.toLowerCase();
  const mapped = SUBJECT_META[key];
  return {
    id,
    name: mapped?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
    color: mapped?.color ?? "#6366F1",
  };
}

function adaptTutor(item: TutorListItem): Tutor {
  const name =
    `${item.user.firstName ?? ""} ${item.user.lastName ?? ""}`.trim();
  return {
    id: item.id,
    name: name || item.user.email.split("@")[0],
    subjects: Array.isArray(item.subjects)
      ? item.subjects.map(subjectFromId)
      : [],
    rating: item.rating ?? 0,
    reviewsCount: item.reviewsCount ?? 0,
    bio: item.bio ?? "Aucune biographie disponible.",
    hourlyRate: item.hourlyRate ?? 0,
    experience: 0,
    inPersonAvailable: false,
  };
}

function getPrimarySubject(tutor: Tutor): Subject {
  return tutor.subjects[0] ?? FALLBACK_SUBJECT;
}

export default function TutorsTab() {
  const router = useRouter();
  const { data: tutorsData = [] } = useTutors();
  const { data: childrenFromApi = [] } = useChildren();
  const [browseMode, setBrowseMode] = useState<"recommended" | "tutor">(
    "recommended",
  );
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortByRating, setSortByRating] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const children = childrenFromApi.map((child, index) => ({
    id: child.id,
    name: child.name,
    color: CHILD_COLORS[index % CHILD_COLORS.length],
  }));
  const tutors = tutorsData.map(adaptTutor);
  const subjects: Subject[] = Array.from(
    new Map(
      tutors
        .flatMap((tutor) => tutor.subjects)
        .map((subject) => [subject.id, subject]),
    ).values(),
  );

  const filteredTutors = tutors
    .filter((tutor) => {
      const matchesSubject =
        selectedSubject === "all" ||
        tutor.subjects.some((subj) => subj.id === selectedSubject);
      return matchesSubject;
    })
    .sort((a, b) =>
      sortByRating ? b.rating - a.rating : a.hourlyRate - b.hourlyRate,
    );
  const recommendedTutors = [...filteredTutors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  const averageRating =
    tutors.length > 0
      ? tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>TUTEURS</Text>
          <Text style={styles.headerTitle}>Accompagnement</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{tutors.length}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Carte statistiques simple */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tutors.length}</Text>
              <Text style={styles.statLabel}>Tuteurs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Note moyenne</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{subjects.length}</Text>
              <Text style={styles.statLabel}>Matières</Text>
            </View>
          </View>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <View style={styles.modeToggle}>
            <HapticPressable
              style={[
                styles.modeButton,
                browseMode === "recommended" && styles.modeButtonActive,
              ]}
              onPress={() => {
                setBrowseMode("recommended");
                Haptics.selectionAsync();
              }}
              hapticType="selection"
              scale={0.95}
            >
              <Sparkles
                size={16}
                color={
                  browseMode === "recommended" ? "white" : THEME.colors.subtext
                }
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "recommended" && styles.modeButtonTextActive,
                ]}
              >
                Recommandés
              </Text>
            </HapticPressable>
            <HapticPressable
              style={[
                styles.modeButton,
                browseMode === "tutor" && styles.modeButtonActive,
              ]}
              onPress={() => {
                setBrowseMode("tutor");
                Haptics.selectionAsync();
              }}
              hapticType="selection"
              scale={0.95}
            >
              <Users
                size={16}
                color={browseMode === "tutor" ? "white" : THEME.colors.subtext}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "tutor" && styles.modeButtonTextActive,
                ]}
              >
                Tous
              </Text>
            </HapticPressable>
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
                <HapticPressable
                  style={[
                    styles.subjectChip,
                    selectedSubject === "all" && styles.subjectChipActive,
                  ]}
                  onPress={() => {
                    setSelectedSubject("all");
                    Haptics.selectionAsync();
                  }}
                  hapticType="selection"
                  scale={0.95}
                >
                  <Text
                    style={[
                      styles.subjectChipText,
                      selectedSubject === "all" && styles.subjectChipTextActive,
                    ]}
                  >
                    Tout
                  </Text>
                </HapticPressable>
                {subjects.map((subject) => (
                  <HapticPressable
                    key={subject.id}
                    style={[
                      styles.subjectChip,
                      selectedSubject === subject.id && {
                        backgroundColor: subject.color + "15",
                        borderColor: subject.color,
                      },
                    ]}
                    onPress={() => {
                      setSelectedSubject(subject.id);
                      Haptics.selectionAsync();
                    }}
                    hapticType="selection"
                    scale={0.95}
                  >
                    <Text
                      style={[
                        styles.subjectChipText,
                        selectedSubject === subject.id && {
                          color: subject.color,
                        },
                      ]}
                    >
                      {subject.name}
                    </Text>
                  </HapticPressable>
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
                {filteredTutors.length} tuteur
                {filteredTutors.length > 1 ? "s" : ""}
              </Text>
              {filteredTutors.map((tutor) => {
                const primarySubject = getPrimarySubject(tutor);
                return (
                  <HapticPressable
                    key={tutor.id}
                    style={styles.tutorCard}
                    onPress={() => router.push(`/tutor/${tutor.id}`)}
                    hapticType="light"
                    scale={0.98}
                  >
                    <View style={styles.tutorHeader}>
                      <View
                        style={[
                          styles.tutorAvatar,
                          { backgroundColor: primarySubject.color + "20" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tutorAvatarText,
                            { color: primarySubject.color },
                          ]}
                        >
                          {tutor.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.tutorInfo}>
                        <Text style={styles.tutorName}>{tutor.name}</Text>
                        <View style={styles.tutorRating}>
                          <Star size={12} color="#F59E0B" fill="#F59E0B" />
                          <Text style={styles.ratingText}>{tutor.rating}</Text>
                          <Text style={styles.reviewsText}>
                            ({tutor.reviewsCount})
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={18} color="#CBD5E1" />
                    </View>

                    <View style={styles.tutorSubjects}>
                      {tutor.subjects.map((subject) => (
                        <View
                          key={subject.id}
                          style={[
                            styles.subjectBadge,
                            { backgroundColor: subject.color + "15" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.subjectBadgeText,
                              { color: subject.color },
                            ]}
                          >
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
                        <Text style={styles.priceValue}>
                          {tutor.hourlyRate}€/h
                        </Text>
                      </View>
                      {tutor.inPersonAvailable && (
                        <>
                          <View style={styles.priceDivider} />
                          <View style={styles.priceContainer}>
                            <Text style={styles.priceLabel}>Présentiel</Text>
                            <Text style={styles.priceValue}>
                              {tutor.inPersonRate}€/h
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </HapticPressable>
                );
              })}
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
                {children.map((child) => (
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
                    <View
                      style={[
                        styles.childDot,
                        { backgroundColor: child.color },
                      ]}
                    />
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
              {children.length === 0 ? (
                <View style={styles.emptyRecommendations}>
                  <Text style={styles.emptyRecommendationsText}>
                    Ajoutez un enfant pour recevoir des recommandations
                    personnalisées.
                  </Text>
                </View>
              ) : (
                recommendedTutors.map((tutor, index) => {
                  const child =
                    selectedChild === "all"
                      ? children[index % children.length]
                      : children.find((c) => c.id === selectedChild);
                  if (!child) return null;
                  const subject = getPrimarySubject(tutor);
                  const reason =
                    selectedChild !== "all"
                      ? "Recommandé selon son profil et ses besoins"
                      : "Recommandé parmi les meilleurs tuteurs";
                  const avatarSubject = getPrimarySubject(tutor);

                  return (
                    <View key={index} style={styles.recommendationCard}>
                      <View
                        style={[
                          styles.recommendationHeader,
                          { borderLeftColor: child.color },
                        ]}
                      >
                        <Text style={styles.recommendationFor}>
                          Pour {child.name}
                        </Text>
                        <View
                          style={[
                            styles.recommendationSubject,
                            { backgroundColor: subject.color + "15" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.recommendationSubjectText,
                              { color: subject.color },
                            ]}
                          >
                            {subject.name}
                          </Text>
                        </View>
                      </View>

                      <HapticPressable
                        style={styles.tutorCard}
                        onPress={() => router.push(`/tutor/${tutor.id}`)}
                        hapticType="light"
                        scale={0.98}
                      >
                        <View style={styles.tutorHeader}>
                          <View
                            style={[
                              styles.tutorAvatar,
                              { backgroundColor: avatarSubject.color + "20" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tutorAvatarText,
                                { color: avatarSubject.color },
                              ]}
                            >
                              {tutor.name.charAt(0)}
                            </Text>
                          </View>
                          <View style={styles.tutorInfo}>
                            <Text style={styles.tutorName}>{tutor.name}</Text>
                            <View style={styles.tutorRating}>
                              <Star size={12} color="#F59E0B" fill="#F59E0B" />
                              <Text style={styles.ratingText}>
                                {tutor.rating}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <Text style={styles.recommendationReason}>
                          {reason}
                        </Text>

                        <View style={styles.tutorFooter}>
                          <Text style={styles.priceValue}>
                            {tutor.hourlyRate}€/h
                          </Text>
                          <Text style={styles.experienceText}>
                            {tutor.experience} ans d&apos;exp.
                          </Text>
                        </View>
                      </HapticPressable>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}

        {/* Bouton Add source */}
        <TouchableOpacity
          style={styles.sourceButton}
          onPress={() =>
            Alert.alert(
              "Demander un tuteur",
              "Cette fonctionnalité sera bientôt disponible. Nous vous informerons dès qu'un tuteur correspondant à vos besoins sera disponible.",
              [{ text: "OK" }],
            )
          }
        >
          <Text style={styles.sourceButtonText}>+ Demander un tuteur</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.white,
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
  headerBadge: {
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: THEME.colors.primary,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Stats Card
  statsCard: {
    backgroundColor: THEME.colors.white,
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: 20,
    padding: 20,
    borderRadius: THEME.radius.xxl,
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
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
    color: THEME.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.subtext,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: THEME.colors.border,
  },

  // Mode Toggle
  modeToggleContainer: {
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.lg,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  modeButtonText: {
    fontSize: 14,
    color: THEME.colors.subtext,
    fontWeight: "600",
  },
  modeButtonTextActive: {
    color: THEME.colors.white,
  },

  // Filters
  filtersSection: {
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  filterTitle: {
    fontSize: 14,
    color: THEME.colors.text,
    fontWeight: "600",
  },
  subjectsContainer: {
    gap: 10,
  },
  subjectChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  subjectChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  subjectChipText: {
    fontSize: 14,
    color: THEME.colors.subtext,
  },
  subjectChipTextActive: {
    color: THEME.colors.white,
  },

  // Sort
  sortSection: {
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: 20,
  },
  sortHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  sortTitle: {
    fontSize: 14,
    color: THEME.colors.text,
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
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  sortButtonText: {
    fontSize: 13,
    color: THEME.colors.subtext,
  },
  sortButtonTextActive: {
    color: THEME.colors.white,
  },

  // Tutors List
  tutorsList: {
    paddingHorizontal: THEME.spacing.xxl,
  },
  tutorsCount: {
    fontSize: 14,
    color: THEME.colors.subtext,
    marginBottom: THEME.spacing.md,
  },
  tutorCard: {
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tutorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  tutorAvatar: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.md,
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
    color: THEME.colors.text,
    marginBottom: 4,
  },
  tutorRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: THEME.colors.accent,
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 12,
    color: THEME.colors.subtext,
  },
  tutorSubjects: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.sm,
    marginBottom: 10,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tutorBio: {
    fontSize: 13,
    color: THEME.colors.subtext,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
  tutorFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  priceContainer: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: THEME.colors.secondaryText,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.success,
  },
  priceDivider: {
    width: 1,
    height: 30,
    backgroundColor: THEME.colors.border,
  },
  experienceText: {
    fontSize: 13,
    color: THEME.colors.subtext,
    fontWeight: "500",
  },

  // Child Filter
  childFilterSection: {
    paddingHorizontal: THEME.spacing.xxl,
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
    color: THEME.colors.subtext,
  },
  childrenContainer: {
    gap: 10,
    marginTop: THEME.spacing.sm,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  childChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  childDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  childChipText: {
    fontSize: 14,
    color: THEME.colors.subtext,
  },
  childChipTextActive: {
    color: THEME.colors.white,
  },

  // Recommendations
  recommendationsList: {
    paddingHorizontal: THEME.spacing.xxl,
  },
  emptyRecommendations: {
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyRecommendationsText: {
    fontSize: 13,
    color: THEME.colors.subtext,
    lineHeight: 18,
  },
  recommendationCard: {
    marginBottom: THEME.spacing.lg,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 10,
    backgroundColor: THEME.colors.secondaryLight,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    borderLeftWidth: 4,
    borderColor: THEME.colors.primary,
  },
  recommendationFor: {
    fontSize: 13,
    color: THEME.colors.text,
    fontWeight: "600",
  },
  recommendationSubject: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  recommendationSubjectText: {
    fontSize: 11,
    fontWeight: "600",
  },
  recommendationReason: {
    fontSize: 13,
    color: THEME.colors.subtext,
    fontStyle: "italic",
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },

  // Source Button
  sourceButton: {
    backgroundColor: THEME.colors.secondaryLight,
    marginHorizontal: THEME.spacing.xxl,
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xxl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.secondaryBorder,
  },
  sourceButtonText: {
    fontSize: 15,
    color: THEME.colors.subtext,
    fontWeight: "600",
  },
});
