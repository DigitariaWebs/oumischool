import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ViewStyle,
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
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { Tutor, Subject, TutorRecommendation } from "@/types";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";

// Mock data - in real app, this would come from API/store
const subjects: Subject[] = [
  { id: "math", name: "Maths", icon: "calculator", color: "#3B82F6" },
  { id: "french", name: "Français", icon: "file-text", color: "#EF4444" },
  { id: "science", name: "Sciences", icon: "flask-conical", color: "#10B981" },
  { id: "english", name: "Anglais", icon: "languages", color: "#6366F1" },
  { id: "history", name: "Histoire", icon: "book-open", color: "#F59E0B" },
];

// Mock children data
const mockChildren = [
  { id: "child1", name: "Emma", color: "#FF6B6B" },
  { id: "child2", name: "Lucas", color: "#4ECDC4" },
];

const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Marie Dupont",
    subjects: [subjects[0], subjects[1]],
    rating: 4.8,
    reviewsCount: 45,
    bio: "Professeure expérimentée en mathématiques et français.",
    avatar: "https://via.placeholder.com/100",
    hourlyRate: 25,
    availability: ["Lundi", "Mercredi", "Vendredi"],
    languages: ["Français", "Anglais"],
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
    avatar: "https://via.placeholder.com/100",
    hourlyRate: 30,
    availability: ["Mardi", "Jeudi", "Samedi"],
    languages: ["Français", "Anglais", "Espagnol"],
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
    avatar: "https://via.placeholder.com/100",
    hourlyRate: 22,
    availability: ["Lundi", "Mardi", "Vendredi"],
    languages: ["Français"],
    experience: 6,
    inPersonAvailable: true,
    inPersonRate: 28,
  },
];

const mockRecommendations: TutorRecommendation[] = [
  {
    tutorId: "1",
    childId: "child1",
    reason:
      "Recommandé pour leçons de fractions en Maths en raison des difficultés récentes",
    subjectId: "math",
  },
  {
    tutorId: "2",
    childId: "child1",
    reason: "Recommandé pour leçons de compréhension orale en Anglais",
    subjectId: "english",
  },
  {
    tutorId: "3",
    childId: "child2",
    reason: "Recommandé pour leçons sur la Révolution française en Histoire",
    subjectId: "history",
  },
  {
    tutorId: "1",
    childId: "child1",
    reason:
      "Enfant a terminé l'algèbre avec succès, recommandé pour leçons de géométrie en Maths",
    subjectId: "math",
  },
  {
    tutorId: "2",
    childId: "child2",
    reason:
      "Enfant montre un intérêt marqué pour la littérature anglaise, recommandé pour leçons de poésie en Anglais",
    subjectId: "english",
  },
];

interface TutorCardProps {
  tutor: Tutor;
  recommendation?: TutorRecommendation;
  delay: number;
}

const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  recommendation,
  delay,
}) => {
  const router = useRouter();

  const cardStyle: ViewStyle = {
    ...styles.tutorCard,
    ...(recommendation && styles.recommendationCard),
  };

  return (
    <Card variant="elevated" padding="md" style={cardStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/tutor/${tutor.id}`)}
      >
        <View style={styles.tutorHeader}>
          <View style={styles.tutorAvatarContainer}>
            <Avatar source={tutor.avatar} name={tutor.name} size="lg" />
            {recommendation && (
              <View style={styles.recommendationBadgeFloat}>
                <Star size={12} color="white" fill="white" />
              </View>
            )}
          </View>
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>{tutor.name}</Text>
            <View style={styles.tutorRating}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{tutor.rating}</Text>
              <Text style={styles.reviewsText}>
                ({tutor.reviewsCount} avis)
              </Text>
            </View>
            <View style={styles.tutorExperience}>
              <GraduationCap size={14} color={COLORS.secondary[500]} />
              <Text style={styles.experienceText}>
                {tutor.experience} ans d&apos;expérience
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color={COLORS.primary.DEFAULT} />
        </View>

        <View style={styles.tutorSubjects}>
          {tutor.subjects.map((subject) => (
            <Badge
              key={subject.id}
              label={subject.name}
              variant="info"
              size="sm"
              style={{
                backgroundColor: subject.color + "15",
                borderColor: subject.color + "40",
                borderWidth: 1,
              }}
              textStyle={{ color: subject.color }}
            />
          ))}
        </View>

        <Text style={styles.tutorBio} numberOfLines={2}>
          {tutor.bio}
        </Text>

        <View style={styles.tutorFooter}>
          <View style={styles.pricingContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>En ligne</Text>
              <Badge
                label={`${tutor.hourlyRate}€/h`}
                variant="success"
                size="md"
              />
            </View>
            {tutor.inPersonAvailable && (
              <>
                <View style={styles.priceDivider} />
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Présentiel</Text>
                  <Badge
                    label={`${tutor.inPersonRate}€/h`}
                    variant="success"
                    size="md"
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {recommendation && (
          <View style={styles.recommendationReasonContainer}>
            <View style={styles.recommendationIcon}>
              <Star
                size={14}
                color={COLORS.primary.DEFAULT}
                fill={COLORS.primary.DEFAULT}
              />
            </View>
            <Text style={styles.recommendationReason}>
              {recommendation.reason}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

interface SubjectChipProps {
  subject: Subject;
  isSelected: boolean;
  onPress: () => void;
}

const SubjectChip: React.FC<SubjectChipProps> = ({
  subject,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.subjectChip,
      isSelected && {
        backgroundColor: subject.color + "20",
        borderColor: subject.color,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.subjectChipText,
        isSelected && { color: subject.color, fontWeight: "700" },
      ]}
    >
      {subject.name}
    </Text>
  </TouchableOpacity>
);

export default function TutorsTab() {
  const [browseMode, setBrowseMode] = useState<"recommended" | "tutor">(
    "recommended",
  );
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortByRating, setSortByRating] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>("all");

  const recommendedTutors = mockTutors.filter((tutor) =>
    mockRecommendations.some((rec) => rec.tutorId === tutor.id),
  );

  const filteredTutors = mockTutors
    .filter((tutor) => {
      const matchesSubject =
        selectedSubject === "all" ||
        tutor.subjects.some((subj) => subj.id === selectedSubject);
      return matchesSubject;
    })
    .sort((a, b) => (sortByRating ? b.rating - a.rating : a.rating - b.rating));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tuteurs</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Browse Mode Toggle */}
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
                color={
                  browseMode === "recommended" ? "white" : COLORS.secondary[600]
                }
                fill={browseMode === "recommended" ? "white" : "transparent"}
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
                color={browseMode === "tutor" ? "white" : COLORS.secondary[600]}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "tutor" && styles.modeButtonTextActive,
                ]}
              >
                Tous les Tuteurs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {browseMode === "recommended" ? (
          /* Recommended Tutors */
          <View style={styles.recommendedMainContent}>
            {/* Child Filters */}
            <View style={styles.childFiltersContainer}>
              <View style={styles.filterHeaderRow}>
                <View style={styles.filterTitleContainer}>
                  <Filter size={18} color={COLORS.primary.DEFAULT} />
                  <Text style={styles.filterTitle}>Filtrer par enfant</Text>
                </View>
                {selectedChild !== "all" && (
                  <TouchableOpacity
                    style={styles.clearFilterButton}
                    onPress={() => setSelectedChild("all")}
                    activeOpacity={0.7}
                  >
                    <X size={14} color={COLORS.secondary[600]} />
                    <Text style={styles.clearFilterText}>Réinitialiser</Text>
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.childFiltersScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.childChip,
                    selectedChild === "all" && styles.childChipActive,
                  ]}
                  onPress={() => setSelectedChild("all")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.childChipText,
                      selectedChild === "all" && styles.childChipTextActive,
                    ]}
                  >
                    Tous les enfants
                  </Text>
                </TouchableOpacity>
                {mockChildren.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childChip,
                      selectedChild === child.id && [
                        styles.childChipActive,
                        {
                          backgroundColor: child.color + "20",
                          borderColor: child.color,
                        },
                      ],
                    ]}
                    onPress={() => setSelectedChild(child.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.childChipDot,
                        { backgroundColor: child.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.childChipText,
                        selectedChild === child.id && [
                          styles.childChipTextActive,
                          { color: child.color },
                        ],
                      ]}
                    >
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {(() => {
              const filteredRecommendations = recommendedTutors.filter(
                (tutor) => {
                  const rec = mockRecommendations.find(
                    (r) => r.tutorId === tutor.id,
                  );
                  return (
                    selectedChild === "all" || rec?.childId === selectedChild
                  );
                },
              );

              return filteredRecommendations.length > 0 ? (
                <View style={styles.recommendedContainer}>
                  {filteredRecommendations.map((tutor, index) => {
                    const rec = mockRecommendations.find(
                      (rec) => rec.tutorId === tutor.id,
                    );
                    const child = mockChildren.find(
                      (c) => c.id === rec?.childId,
                    );
                    const subject = subjects.find(
                      (s) => s.id === rec?.subjectId,
                    );
                    return (
                      <View
                        key={tutor.id}
                        style={styles.recommendedCardWrapper}
                      >
                        <View
                          style={[
                            styles.recommendationHeader,
                            { backgroundColor: child?.color + "15" },
                            { borderColor: child?.color + "40" },
                          ]}
                        >
                          <View style={styles.recommendationHeaderContent}>
                            <View
                              style={[
                                styles.childIndicator,
                                { backgroundColor: child?.color },
                              ]}
                            />
                            <View style={styles.recommendationHeaderText}>
                              <Text style={styles.recommendationForText}>
                                Recommandé pour
                              </Text>
                              <Text
                                style={[
                                  styles.childNameText,
                                  { color: child?.color },
                                ]}
                              >
                                {child?.name}
                              </Text>
                            </View>
                          </View>
                          <Badge
                            label={subject?.name || ""}
                            variant="info"
                            size="sm"
                            style={{
                              backgroundColor: subject?.color + "20",
                              borderColor: subject?.color + "60",
                              borderWidth: 1,
                            }}
                            textStyle={{ color: subject?.color }}
                          />
                        </View>
                        <TutorCard
                          tutor={tutor}
                          recommendation={rec}
                          delay={0}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <EmptyState
                  icon={<Star size={48} color={COLORS.secondary[400]} />}
                  title="Aucune recommandation pour cet enfant"
                  description="Essayez de sélectionner un autre enfant ou consultez tous les enfants"
                />
              );
            })()}
          </View>
        ) : (
          <View style={styles.tutorModeContainer}>
            {/* Subject Filters */}
            <View style={styles.filtersContainer}>
              <View style={styles.filterHeaderRow}>
                <View style={styles.filterTitleContainer}>
                  <Filter size={18} color={COLORS.primary.DEFAULT} />
                  <Text style={styles.filterTitle}>Matières</Text>
                </View>
                {selectedSubject !== "all" && (
                  <TouchableOpacity
                    style={styles.clearFilterButton}
                    onPress={() => setSelectedSubject("all")}
                    activeOpacity={0.7}
                  >
                    <X size={14} color={COLORS.secondary[600]} />
                    <Text style={styles.clearFilterText}>Réinitialiser</Text>
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subjectsContainer}
              >
                <SubjectChip
                  subject={{
                    id: "all",
                    name: "Toutes les matières",
                    icon: "",
                    color: COLORS.secondary[600],
                  }}
                  isSelected={selectedSubject === "all"}
                  onPress={() => setSelectedSubject("all")}
                />
                {subjects.map((subject) => (
                  <SubjectChip
                    key={subject.id}
                    subject={subject}
                    isSelected={selectedSubject === subject.id}
                    onPress={() => setSelectedSubject(subject.id)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Sort Toggle */}
            <View style={styles.sortContainerWrapper}>
              <View style={styles.sortContainer}>
                <View style={styles.filterTitleContainer}>
                  <TrendingUp size={18} color={COLORS.primary.DEFAULT} />
                  <Text style={styles.sortLabel}>Trier par</Text>
                </View>
                <View style={styles.sortButtonsGroup}>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sortByRating && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortByRating(true)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={15}
                      color={sortByRating ? "white" : COLORS.secondary[600]}
                      fill={sortByRating ? "white" : "transparent"}
                    />
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortByRating && styles.sortButtonTextActive,
                      ]}
                    >
                      Meilleure note
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      !sortByRating && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortByRating(false)}
                    activeOpacity={0.7}
                  >
                    <DollarSign
                      size={15}
                      color={!sortByRating ? "white" : COLORS.secondary[600]}
                    />
                    <Text
                      style={[
                        styles.sortButtonText,
                        !sortByRating && styles.sortButtonTextActive,
                      ]}
                    >
                      Prix bas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Tutors List */}
            <View style={styles.tutorsSection}>
              <View style={styles.tutorListHeader}>
                <Text style={styles.tutorCountText}>
                  {filteredTutors.length} tuteur
                  {filteredTutors.length > 1 ? "s" : ""} disponible
                  {filteredTutors.length > 1 ? "s" : ""}
                </Text>
              </View>
              {filteredTutors.map((tutor, index) => (
                <TutorCard key={tutor.id} tutor={tutor} delay={0} />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredTutors.length === 0 && browseMode === "tutor" && (
          <EmptyState
            icon={<GraduationCap size={48} color={COLORS.secondary[400]} />}
            title="Aucun tuteur trouvé"
            description="Essayez de modifier vos filtres ou votre recherche"
          />
        )}
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.secondary[900],
  },

  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    fontWeight: "500",
  },
  modeToggleContainer: {
    marginBottom: 24,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  sortContainerWrapper: {
    marginBottom: 24,
  },
  subjectModeContainer: {
    paddingHorizontal: 16,
  },
  tutorModeContainer: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  filterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: COLORS.secondary[800],
    fontWeight: "700",
  },
  clearFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary[100],
    borderRadius: 16,
  },
  clearFilterText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
  tutorListHeader: {
    marginBottom: 12,
  },
  tutorCountText: {
    fontFamily: FONTS.primary,
    fontSize: 16,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  tutorCountBadge: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  subjectHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  subjectHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subjectIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectTutorsList: {
    paddingHorizontal: 16,
  },
  recommendedMainContent: {
    paddingHorizontal: 24,
  },
  childFiltersContainer: {
    marginBottom: 20,
  },
  childFiltersScroll: {
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 12,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  childChipActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary.DEFAULT,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  childChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  childChipTextActive: {
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  childChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recommendedContainer: {
    gap: 16,
  },
  recommendedCardWrapper: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.neutral.white,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 4,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary.DEFAULT,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
  modeButtonTextActive: {
    color: COLORS.neutral.white,
  },
  subjectsContainer: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
  },
  subjectChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 16,
  },
  sortLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[800],
    fontWeight: "600",
  },
  sortButtonsGroup: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    gap: 6,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sortButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  tutorsSection: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  tutorCard: {
    marginBottom: SPACING.md,
  },
  recommendationCard: {
    borderWidth: 2,
    borderColor: COLORS.primary[100],
    shadowColor: COLORS.primary.DEFAULT,
    shadowOpacity: 0.15,
  },
  tutorHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  tutorAvatarContainer: {
    position: "relative",
    marginRight: SPACING.md,
  },
  recommendationBadgeFloat: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary.DEFAULT,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutral.white,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 6,
    fontWeight: "600",
  },
  tutorRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  reviewsText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    fontWeight: "500",
  },
  tutorExperience: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  experienceText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  tutorBio: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    marginBottom: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  tutorSubjects: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tutorFooter: {
    marginTop: 4,
  },
  pricingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 12,
    gap: 16,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[600],
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  priceDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.primary[200],
  },

  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
  },
  recommendationHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  childIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  recommendationHeaderText: {
    flex: 1,
  },
  recommendationForText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[600],
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  childNameText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "700",
  },

  recommendationReasonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  recommendationIcon: {
    marginTop: 2,
  },
  recommendationReason: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    lineHeight: 19,
    fontStyle: "italic",
  },

  subjectSection: {
    marginBottom: 28,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectHeaderText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 24,
    gap: 8,
  },
  seeMoreText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
});
