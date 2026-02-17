import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ViewStyle,
  Dimensions,
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
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { Tutor, Subject, TutorRecommendation } from "@/types";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      style={[styles.tutorCard, recommendation && styles.recommendationCard]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/tutor/${tutor.id}`)}
      >
        {/* Decorative elements for recommended */}
        {recommendation && (
          <>
            <View style={styles.recommendedDecor1} />
            <View style={styles.recommendedDecor2} />
          </>
        )}

        <View style={styles.tutorHeader}>
          <View style={styles.tutorAvatarContainer}>
            <View style={styles.avatarWrapper}>
              <Avatar source={tutor.avatar} name={tutor.name} size="lg" />
            </View>
            {recommendation && (
              <View style={styles.recommendationBadgeFloat}>
                <Star size={12} color="white" fill="white" />
              </View>
            )}
          </View>
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>{tutor.name}</Text>
            <View style={styles.tutorRating}>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{tutor.rating}</Text>
              </View>
              <Text style={styles.reviewsText}>
                ({tutor.reviewsCount} avis)
              </Text>
            </View>
            <View style={styles.tutorExperience}>
              <GraduationCap size={14} color={colors.icon} />
              <Text style={styles.experienceText}>
                {tutor.experience} ans d&apos;expérience
              </Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <ChevronRight size={20} color={colors.primary} />
          </View>
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
          <View style={styles.pricingContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>En ligne</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceValue}>{tutor.hourlyRate}€/h</Text>
              </View>
            </View>
            {tutor.inPersonAvailable && (
              <>
                <View style={styles.priceDivider} />
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Présentiel</Text>
                  <View style={[styles.priceBadge, styles.priceBadgeAlt]}>
                    <Text style={styles.priceValueAlt}>
                      {tutor.inPersonRate}€/h
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {recommendation && (
          <View style={styles.recommendationReasonContainer}>
            <View style={styles.recommendationIcon}>
              <Sparkles size={14} color={colors.primary} />
            </View>
            <Text style={styles.recommendationReason}>
              {recommendation.reason}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
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
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
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
};

export default function TutorsTab() {
  const { colors, isDark } = useTheme();
  const [browseMode, setBrowseMode] = useState<"recommended" | "tutor">(
    "recommended",
  );
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortByRating, setSortByRating] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>("all");

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <GraduationCap size={20} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.headerTitle}>Tuteurs</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{mockTutors.length}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Stats Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600).springify()}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View style={styles.sparkleContainer}>
                  <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Tuteurs disponibles</Text>
              </View>
              <Text style={styles.heroAmount}>
                {mockTutors.length}
                <Text style={styles.heroSuffix}> experts</Text>
              </Text>
              <View style={styles.heroBadge}>
                <Zap size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  Matchés selon vos besoins
                </Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Mode Toggle */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.modeToggleContainer}
        >
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                browseMode === "recommended" && styles.modeButtonActive,
              ]}
              onPress={() => setBrowseMode("recommended")}
              activeOpacity={0.7}
            >
              <Sparkles
                size={18}
                color={
                  browseMode === "recommended"
                    ? COLORS.neutral.white
                    : colors.textSecondary
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
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                browseMode === "tutor" && styles.modeButtonActive,
              ]}
              onPress={() => setBrowseMode("tutor")}
              activeOpacity={0.7}
            >
              <Users
                size={18}
                color={
                  browseMode === "tutor"
                    ? COLORS.neutral.white
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.modeButtonText,
                  browseMode === "tutor" && styles.modeButtonTextActive,
                ]}
              >
                Tous les tuteurs
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {browseMode === "tutor" ? (
          <View style={styles.tutorModeContainer}>
            {/* Subject Filters */}
            <View style={styles.filtersContainer}>
              <View style={styles.filterHeader}>
                <Filter size={18} color={colors.textPrimary} />
                <Text style={styles.sectionTitle}>Filtrer par matière</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subjectsContainer}
              >
                <SubjectChip
                  subject={{
                    id: "all",
                    name: "Tout",
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

            {/* Sort Controls */}
            <View style={styles.sortContainerWrapper}>
              <View style={styles.sortContainer}>
                <View style={styles.filterHeader}>
                  <TrendingUp size={18} color={colors.textPrimary} />
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
                      size={16}
                      color={
                        sortByRating
                          ? COLORS.neutral.white
                          : colors.textSecondary
                      }
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
                      size={16}
                      color={
                        !sortByRating
                          ? COLORS.neutral.white
                          : colors.textSecondary
                      }
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
            </View>

            {/* Tutors List */}
            <View style={styles.tutorsSection}>
              <View style={styles.tutorListHeader}>
                <Text style={styles.tutorCountText}>
                  <Text style={styles.tutorCountBadge}>
                    {filteredTutors.length}
                  </Text>{" "}
                  tuteur{filteredTutors.length > 1 ? "s" : ""} disponible
                  {filteredTutors.length > 1 ? "s" : ""}
                </Text>
              </View>
              {filteredTutors.map((tutor, index) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  delay={200 + index * 100}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.recommendedMainContent}>
            {/* Child Filter Chips */}
            <View style={styles.childFiltersContainer}>
              <View style={styles.filterHeaderRow}>
                <View style={styles.filterTitleContainer}>
                  <Users size={18} color={colors.textPrimary} />
                  <Text style={styles.sectionTitle}>Recommandations pour</Text>
                </View>
                {selectedChild !== "all" && (
                  <TouchableOpacity
                    style={styles.clearFilterButton}
                    onPress={() => setSelectedChild("all")}
                  >
                    <X size={14} color={colors.textSecondary} />
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
                      selectedChild === child.id && styles.childChipActive,
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
                        selectedChild === child.id &&
                          styles.childChipTextActive,
                      ]}
                    >
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Recommended Tutors */}
            <View style={styles.recommendedContainer}>
              {mockRecommendations
                .filter(
                  (rec) =>
                    selectedChild === "all" || rec.childId === selectedChild,
                )
                .map((rec, index) => {
                  const tutor = mockTutors.find((t) => t.id === rec.tutorId);
                  const child = mockChildren.find((c) => c.id === rec.childId);
                  const subject = subjects.find((s) => s.id === rec.subjectId);

                  if (!tutor || !child || !subject) return null;

                  return (
                    <View
                      key={`${rec.tutorId}-${rec.childId}-${index}`}
                      style={styles.recommendedCardWrapper}
                    >
                      <View
                        style={[
                          styles.recommendationHeader,
                          {
                            backgroundColor: child.color + "15",
                            borderColor: child.color + "40",
                          },
                        ]}
                      >
                        <View style={styles.recommendationHeaderContent}>
                          <View
                            style={[
                              styles.childIndicator,
                              { backgroundColor: child.color },
                            ]}
                          />
                          <View style={styles.recommendationHeaderText}>
                            <Text style={styles.recommendationForText}>
                              RECOMMANDÉ POUR
                            </Text>
                            <Text
                              style={[
                                styles.childNameText,
                                { color: child.color },
                              ]}
                            >
                              {child.name}
                            </Text>
                          </View>
                        </View>
                        <Badge
                          label={subject.name}
                          variant="info"
                          size="sm"
                          style={{
                            backgroundColor: subject.color + "20",
                            borderColor: subject.color,
                            borderWidth: 1,
                          }}
                          textStyle={{ color: subject.color }}
                        />
                      </View>
                      <TutorCard
                        tutor={tutor}
                        recommendation={rec}
                        delay={200 + index * 100}
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Blob Background
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.1,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#8B5CF6",
      top: -50,
      right: -50,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#10B981",
      top: 80,
      left: -30,
    },
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
    // Hero Card
    heroCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
    heroGradient: {
      padding: 24,
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    heroAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 48,
      color: COLORS.neutral.white,
      lineHeight: 56,
    },
    heroSuffix: {
      fontSize: 24,
      opacity: 0.9,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    heroBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -30,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 50,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    sectionTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textPrimary,
    },
    sectionSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    modeToggleContainer: {
      marginBottom: 24,
    },
    filtersContainer: {
      marginBottom: 20,
    },
    sortContainerWrapper: {
      marginBottom: 20,
    },
    subjectModeContainer: {
      paddingHorizontal: 24,
    },
    tutorModeContainer: {
      flex: 1,
    },
    filterHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    filterHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 12,
    },
    filterTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    filterTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    clearFilterButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.buttonSecondary,
      borderRadius: 12,
    },
    clearFilterText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    tutorListHeader: {
      marginBottom: 12,
    },
    tutorCountText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    tutorCountBadge: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
    },
    subjectHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    subjectHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    subjectIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    subjectTutorsList: {
      paddingHorizontal: 24,
    },
    recommendedMainContent: {
      paddingHorizontal: 24,
    },
    childFiltersContainer: {
      marginBottom: 24,
    },
    childFiltersScroll: {
      paddingHorizontal: 24,
      gap: 10,
      marginTop: 8,
    },
    childChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
      gap: 8,
      shadowColor: COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    childChipActive: {
      backgroundColor: COLORS.primary[50],
      borderColor: COLORS.primary.DEFAULT,
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    childChipText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    childChipTextActive: {
      color: COLORS.primary.DEFAULT,
      fontWeight: "700",
    },
    childChipDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    recommendedContainer: {
      gap: 16,
    },
    recommendedCardWrapper: {
      marginBottom: SPACING.lg,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: colors.card,
      shadowColor: COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
    },
    modeToggle: {
      flexDirection: "row",
      backgroundColor: isDark ? colors.input : COLORS.neutral[100],
      borderRadius: 18,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 5,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      flexDirection: "row",
      gap: 8,
    },
    modeButtonActive: {
      backgroundColor: COLORS.primary.DEFAULT,
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    modeButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    modeButtonTextActive: {
      color: COLORS.neutral.white,
    },
    subjectsContainer: {
      paddingHorizontal: 24,
      gap: 8,
      marginBottom: 8,
    },
    subjectChip: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    subjectChipText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    sortContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 16,
      gap: 12,
    },
    sortLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    sortButtonsGroup: {
      flexDirection: "row",
      gap: 8,
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 14,
      backgroundColor: colors.card,
      borderRadius: 20,
      gap: 6,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    sortButtonActive: {
      backgroundColor: COLORS.primary.DEFAULT,
      borderColor: COLORS.primary.DEFAULT,
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    sortButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    sortButtonTextActive: {
      color: COLORS.neutral.white,
      fontWeight: "700",
    },
    tutorsSection: {
      paddingHorizontal: 20,
      marginTop: 8,
    },
    tutorCard: {
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      position: "relative",
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    recommendationCard: {
      borderWidth: 2,
      borderColor: colors.primary + "40",
      shadowColor: colors.primary,
      shadowOpacity: 0.15,
    },
    recommendedDecor1: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + "08",
      top: -30,
      right: -20,
    },
    recommendedDecor2: {
      position: "absolute",
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + "06",
      bottom: 20,
      right: 60,
    },
    tutorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      position: "relative",
      zIndex: 1,
    },
    tutorAvatarContainer: {
      position: "relative",
      marginRight: 14,
    },
    avatarWrapper: {
      borderRadius: 16,
      overflow: "hidden",
    },
    recommendationBadgeFloat: {
      position: "absolute",
      bottom: -2,
      right: -2,
      backgroundColor: COLORS.primary.DEFAULT,
      width: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.card,
    },
    tutorInfo: {
      flex: 1,
    },
    tutorName: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 6,
      fontWeight: "600",
    },
    tutorRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#F59E0B15",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    ratingText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "#F59E0B",
      fontWeight: "700",
    },
    reviewsText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    chevronContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    tutorExperience: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    experienceText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    tutorBio: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 14,
      lineHeight: 20,
      marginTop: 4,
      position: "relative",
      zIndex: 1,
    },
    tutorSubjects: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
      position: "relative",
      zIndex: 1,
    },
    subjectBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    subjectBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
    },
    tutorFooter: {
      marginTop: 4,
      position: "relative",
      zIndex: 1,
    },
    pricingContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : colors.input,
      borderRadius: 14,
      padding: 14,
      gap: 12,
    },
    priceItem: {
      flex: 1,
      alignItems: "center",
    },
    priceLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    priceBadge: {
      backgroundColor: "#10B98115",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    priceValue: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "700",
      color: "#10B981",
    },
    priceBadgeAlt: {
      backgroundColor: "#8B5CF615",
    },
    priceValueAlt: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "700",
      color: "#8B5CF6",
    },
    priceDivider: {
      width: 1,
      height: 36,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
    },
    recommendationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderWidth: 1,
    },
    recommendationHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    childIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    recommendationHeaderText: {
      flex: 1,
    },
    recommendationForText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    childNameText: {
      fontFamily: FONTS.fredoka,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    recommendationReasonContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255,255,255,0.08)" : colors.border,
      position: "relative",
      zIndex: 1,
    },
    recommendationIcon: {
      width: 28,
      height: 28,
      borderRadius: 10,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    recommendationReason: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      fontStyle: "italic",
    },
    subjectSection: {
      marginBottom: 24,
    },
    subjectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    subjectHeaderText: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
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
      fontSize: 13,
      color: COLORS.primary.DEFAULT,
      fontWeight: "600",
    },
  });
