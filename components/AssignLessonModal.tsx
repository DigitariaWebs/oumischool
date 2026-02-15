import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import {
  X,
  Search,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface AvailableLesson {
  id: string;
  title: string;
  subject: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  duration: number;
  description: string;
  prerequisites?: string[];
  isAssigned: boolean;
}

interface Recommendation {
  lesson: AvailableLesson;
  reason: string;
  type: "recommended" | "reinforcement" | "advanced" | "popular";
  matchScore: number;
}

interface AssignLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onAssign: (lessonIds: string[]) => void;
  assignedLessonIds: string[];
  childWeaknesses?: string[];
  childStrengths?: string[];
  childGrade: string;
}

const AVAILABLE_LESSONS: AvailableLesson[] = [
  // Mathématiques
  {
    id: "math-1",
    title: "Introduction aux fractions",
    subject: "Mathématiques",
    difficulty: "Débutant",
    duration: 25,
    description: "Comprendre les fractions simples et leur représentation",
    isAssigned: false,
  },
  {
    id: "math-2",
    title: "Fractions décimales avancées",
    subject: "Mathématiques",
    difficulty: "Intermédiaire",
    duration: 35,
    description: "Opérations complexes avec les fractions décimales",
    prerequisites: ["math-1"],
    isAssigned: false,
  },
  {
    id: "math-3",
    title: "La géométrie plane",
    subject: "Mathématiques",
    difficulty: "Débutant",
    duration: 30,
    description: "Formes géométriques et leurs propriétés",
    isAssigned: false,
  },
  {
    id: "math-4",
    title: "Les pourcentages",
    subject: "Mathématiques",
    difficulty: "Intermédiaire",
    duration: 28,
    description: "Calcul et application des pourcentages",
    isAssigned: false,
  },
  {
    id: "math-5",
    title: "Équations du premier degré",
    subject: "Mathématiques",
    difficulty: "Avancé",
    duration: 40,
    description: "Résolution d'équations linéaires",
    isAssigned: false,
  },

  // Français
  {
    id: "french-1",
    title: "Les temps composés",
    subject: "Français",
    difficulty: "Intermédiaire",
    duration: 35,
    description: "Maîtriser le passé composé et le plus-que-parfait",
    isAssigned: false,
  },
  {
    id: "french-2",
    title: "L'accord du participe passé",
    subject: "Français",
    difficulty: "Avancé",
    duration: 30,
    description: "Règles d'accord du participe passé",
    prerequisites: ["french-1"],
    isAssigned: false,
  },
  {
    id: "french-3",
    title: "La conjugaison des verbes irréguliers",
    subject: "Français",
    difficulty: "Intermédiaire",
    duration: 40,
    description: "Conjuguer les verbes irréguliers courants",
    isAssigned: false,
  },
  {
    id: "french-4",
    title: "L'analyse grammaticale",
    subject: "Français",
    difficulty: "Avancé",
    duration: 45,
    description: "Identifier les fonctions grammaticales",
    isAssigned: false,
  },
  {
    id: "french-5",
    title: "L'orthographe courante",
    subject: "Français",
    difficulty: "Débutant",
    duration: 25,
    description: "Règles d'orthographe essentielles",
    isAssigned: false,
  },

  // Sciences
  {
    id: "science-1",
    title: "Le cycle de l'eau",
    subject: "Sciences",
    difficulty: "Débutant",
    duration: 30,
    description: "Comprendre le cycle de l'eau dans la nature",
    isAssigned: false,
  },
  {
    id: "science-2",
    title: "Les planètes du système solaire",
    subject: "Sciences",
    difficulty: "Débutant",
    duration: 35,
    description: "Explorer notre système solaire",
    isAssigned: false,
  },
  {
    id: "science-3",
    title: "La photosynthèse",
    subject: "Sciences",
    difficulty: "Intermédiaire",
    duration: 32,
    description: "Comment les plantes produisent leur nourriture",
    isAssigned: false,
  },
  {
    id: "science-4",
    title: "L'électricité et les circuits",
    subject: "Sciences",
    difficulty: "Intermédiaire",
    duration: 38,
    description: "Principes de base de l'électricité",
    isAssigned: false,
  },

  // Anglais
  {
    id: "english-1",
    title: "Les verbes irréguliers anglais",
    subject: "Anglais",
    difficulty: "Intermédiaire",
    duration: 30,
    description: "Apprendre les verbes irréguliers courants",
    isAssigned: false,
  },
  {
    id: "english-2",
    title: "Present Perfect",
    subject: "Anglais",
    difficulty: "Intermédiaire",
    duration: 35,
    description: "Maîtriser le present perfect",
    isAssigned: false,
  },
  {
    id: "english-3",
    title: "Vocabulaire quotidien",
    subject: "Anglais",
    difficulty: "Débutant",
    duration: 25,
    description: "Mots et expressions de tous les jours",
    isAssigned: false,
  },
  {
    id: "english-4",
    title: "La conversation courante",
    subject: "Anglais",
    difficulty: "Débutant",
    duration: 28,
    description: "Phrases utiles pour converser",
    isAssigned: false,
  },

  // Histoire
  {
    id: "history-1",
    title: "La Révolution française",
    subject: "Histoire",
    difficulty: "Intermédiaire",
    duration: 40,
    description: "Les événements clés de la Révolution",
    isAssigned: false,
  },
  {
    id: "history-2",
    title: "L'Antiquité égyptienne",
    subject: "Histoire",
    difficulty: "Débutant",
    duration: 35,
    description: "Découvrir l'Égypte ancienne",
    isAssigned: false,
  },
  {
    id: "history-3",
    title: "Les grandes découvertes",
    subject: "Histoire",
    difficulty: "Intermédiaire",
    duration: 38,
    description: "L'ère des explorateurs",
    isAssigned: false,
  },

  // Géographie
  {
    id: "geo-1",
    title: "Les continents et océans",
    subject: "Géographie",
    difficulty: "Débutant",
    duration: 25,
    description: "Carte du monde et repères géographiques",
    isAssigned: false,
  },
  {
    id: "geo-2",
    title: "Le climat et les zones climatiques",
    subject: "Géographie",
    difficulty: "Intermédiaire",
    duration: 32,
    description: "Comprendre les différents climats",
    isAssigned: false,
  },
  {
    id: "geo-3",
    title: "La France et ses régions",
    subject: "Géographie",
    difficulty: "Débutant",
    duration: 30,
    description: "Découvrir la géographie française",
    isAssigned: false,
  },
];

export default function AssignLessonModal({
  visible,
  onClose,
  onAssign,
  assignedLessonIds,
  childWeaknesses = [],
  childStrengths = [],
  childGrade,
}: AssignLessonModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("Tous");
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  // Mark lessons as assigned
  const lessons = useMemo(() => {
    return AVAILABLE_LESSONS.map((lesson) => ({
      ...lesson,
      isAssigned: assignedLessonIds.includes(lesson.id),
    }));
  }, [assignedLessonIds]);

  // Get unique subjects
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(lessons.map((l) => l.subject))
    );
    return ["Tous", ...uniqueSubjects];
  }, [lessons]);

  // Generate recommendations
  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Reinforcement recommendations based on weaknesses
    childWeaknesses.forEach((weakness) => {
      const weaknessLower = weakness.toLowerCase();

      if (weaknessLower.includes("verbe") || weaknessLower.includes("conjugaison")) {
        const lesson = lessons.find((l) => l.id === "french-3");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Renforce les faiblesses identifiées",
            type: "reinforcement",
            matchScore: 95,
          });
        }
      }

      if (weaknessLower.includes("participe")) {
        const lesson = lessons.find((l) => l.id === "french-2");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Améliore l'accord du participe passé",
            type: "reinforcement",
            matchScore: 92,
          });
        }
      }

      if (weaknessLower.includes("opération") || weaknessLower.includes("complexe")) {
        const lesson = lessons.find((l) => l.id === "math-2");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Pratique les opérations complexes",
            type: "reinforcement",
            matchScore: 88,
          });
        }
      }
    });

    // Advanced recommendations based on strengths
    childStrengths.forEach((strength) => {
      const strengthLower = strength.toLowerCase();

      if (strengthLower.includes("conversion") || strengthLower.includes("fraction")) {
        const lesson = lessons.find((l) => l.id === "math-5");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Parfait pour approfondir vos acquis",
            type: "advanced",
            matchScore: 85,
          });
        }
      }
    });

    // Recommended next steps (popular for grade)
    const popularLessons = [
      { id: "math-4", score: 90 },
      { id: "science-3", score: 87 },
      { id: "geo-2", score: 82 },
      { id: "english-2", score: 84 },
    ];

    popularLessons.forEach(({ id, score }) => {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson && !lesson.isAssigned && recs.length < 8) {
        recs.push({
          lesson,
          reason: `Recommandé pour ${childGrade}`,
          type: "recommended",
          matchScore: score,
        });
      }
    });

    // Sort by match score
    return recs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  }, [lessons, childWeaknesses, childStrengths, childGrade]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        searchQuery === "" ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === "Tous" || lesson.subject === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [lessons, searchQuery, selectedSubject]);

  const toggleLesson = (lessonId: string, isAssigned: boolean) => {
    if (isAssigned) return;

    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleAssign = () => {
    if (selectedLessons.length > 0) {
      onAssign(selectedLessons);
      setSelectedLessons([]);
      setSearchQuery("");
      setSelectedSubject("Tous");
      onClose();
    }
  };

  const handleQuickAssign = (lessonId: string) => {
    onAssign([lessonId]);
    onClose();
  };

  const getRecommendationIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "reinforcement":
        return <TrendingUp size={16} color={COLORS.info} />;
      case "advanced":
        return <Award size={16} color={COLORS.warning} />;
      case "popular":
        return <Users size={16} color={COLORS.primary.DEFAULT} />;
      default:
        return <Sparkles size={16} color={COLORS.success} />;
    }
  };

  const getRecommendationColor = (type: Recommendation["type"]) => {
    switch (type) {
      case "reinforcement":
        return COLORS.info;
      case "advanced":
        return COLORS.warning;
      case "popular":
        return COLORS.primary.DEFAULT;
      default:
        return COLORS.success;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant":
        return COLORS.success;
      case "Intermédiaire":
        return COLORS.warning;
      case "Avancé":
        return COLORS.error;
      default:
        return COLORS.neutral[500];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View entering={FadeIn.duration(200)} style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Assigner des leçons</Text>
              <Text style={styles.modalSubtitle}>
                {selectedLessons.length > 0 &&
                  `${selectedLessons.length} sélectionnée${selectedLessons.length > 1 ? "s" : ""}`}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={COLORS.secondary[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <View style={styles.recommendationsHeader}>
                  <Sparkles size={20} color={COLORS.primary.DEFAULT} />
                  <Text style={styles.recommendationsTitle}>
                    Recommandations personnalisées
                  </Text>
                </View>
                <Text style={styles.recommendationsSubtitle}>
                  Basées sur les performances et objectifs
                </Text>

                {recommendations.map((rec, index) => (
                  <Animated.View
                    key={rec.lesson.id}
                    entering={FadeInDown.delay(index * 50).duration(400)}
                  >
                    <TouchableOpacity
                      style={styles.recommendationCard}
                      onPress={() => handleQuickAssign(rec.lesson.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.recommendationHeader}>
                        <View
                          style={[
                            styles.recommendationBadge,
                            {
                              backgroundColor:
                                getRecommendationColor(rec.type) + "20",
                            },
                          ]}
                        >
                          {getRecommendationIcon(rec.type)}
                        </View>
                        <View style={styles.matchScoreContainer}>
                          <Text style={styles.matchScore}>{rec.matchScore}%</Text>
                          <Text style={styles.matchLabel}>Match</Text>
                        </View>
                      </View>

                      <Text style={styles.recommendationTitle}>
                        {rec.lesson.title}
                      </Text>
                      <Text style={styles.recommendationReason}>{rec.reason}</Text>

                      <View style={styles.recommendationFooter}>
                        <View style={styles.recommendationMeta}>
                          <Text style={styles.recommendationSubject}>
                            {rec.lesson.subject}
                          </Text>
                          <Text style={styles.recommendationDot}>•</Text>
                          <Clock size={12} color={COLORS.neutral[500]} />
                          <Text style={styles.recommendationDuration}>
                            {rec.lesson.duration} min
                          </Text>
                        </View>
                        <View style={styles.quickAssignButton}>
                          <Text style={styles.quickAssignText}>
                            Assigner
                          </Text>
                          <ChevronRight size={16} color={COLORS.primary.DEFAULT} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}

            {/* Search */}
            <View style={styles.searchContainer}>
              <Search size={20} color={COLORS.neutral[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une leçon..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.neutral[400]}
              />
            </View>

            {/* Subject Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.subjectFilter}
              contentContainerStyle={styles.subjectFilterContent}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectChip,
                    selectedSubject === subject && styles.subjectChipActive,
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text
                    style={[
                      styles.subjectChipText,
                      selectedSubject === subject &&
                        styles.subjectChipTextActive,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lessons List */}
            <View style={styles.lessonsSection}>
              <Text style={styles.lessonsSectionTitle}>
                Toutes les leçons ({filteredLessons.length})
              </Text>

              {filteredLessons.map((lesson) => {
                const isSelected = selectedLessons.includes(lesson.id);
                const isDisabled = lesson.isAssigned;

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonCard,
                      isDisabled && styles.lessonCardDisabled,
                      isSelected && styles.lessonCardSelected,
                    ]}
                    onPress={() => toggleLesson(lesson.id, isDisabled)}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                  >
                    <View style={styles.lessonCheckbox}>
                      {isSelected ? (
                        <CheckCircle2
                          size={24}
                          color={COLORS.primary.DEFAULT}
                          fill={COLORS.primary[100]}
                        />
                      ) : (
                        <Circle
                          size={24}
                          color={
                            isDisabled
                              ? COLORS.neutral[300]
                              : COLORS.neutral[400]
                          }
                        />
                      )}
                    </View>

                    <View style={styles.lessonContent}>
                      <View style={styles.lessonHeader}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            isDisabled && styles.lessonTitleDisabled,
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        {isDisabled && (
                          <View style={styles.assignedBadge}>
                            <Text style={styles.assignedBadgeText}>
                              Assignée
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.lessonDescription,
                          isDisabled && styles.lessonDescriptionDisabled,
                        ]}
                      >
                        {lesson.description}
                      </Text>

                      <View style={styles.lessonFooter}>
                        <View style={styles.lessonMeta}>
                          <View
                            style={[
                              styles.difficultyBadge,
                              {
                                backgroundColor:
                                  getDifficultyColor(lesson.difficulty) + "20",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.difficultyText,
                                { color: getDifficultyColor(lesson.difficulty) },
                              ]}
                            >
                              {lesson.difficulty}
                            </Text>
                          </View>
                          <Clock size={14} color={COLORS.neutral[500]} />
                          <Text style={styles.durationText}>
                            {lesson.duration} min
                          </Text>
                        </View>
                        <Text style={styles.subjectText}>{lesson.subject}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Button */}
          {selectedLessons.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.actionBar}>
              <TouchableOpacity
                style={styles.assignButton}
                onPress={handleAssign}
              >
                <BookOpen size={20} color={COLORS.neutral.white} />
                <Text style={styles.assignButtonText}>
                  Assigner {selectedLessons.length} leçon
                  {selectedLessons.length > 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  recommendationsTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  recommendationsSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: 13,
    color: COLORS.secondary[500],
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary[100],
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  matchScoreContainer: {
    alignItems: "flex-end",
  },
  matchScore: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
  },
  matchLabel: {
    fontFamily: FONTS.primary,
    fontSize: 10,
    color: COLORS.secondary[500],
  },
  recommendationTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 6,
  },
  recommendationReason: {
    fontFamily: FONTS.primary,
    fontSize: 13,
    color: COLORS.secondary[600],
    marginBottom: 12,
  },
  recommendationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recommendationSubject: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    color: COLORS.secondary[600],
  },
  recommendationDot: {
    color: COLORS.neutral[400],
  },
  recommendationDuration: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    color: COLORS.secondary[600],
  },
  quickAssignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primary[50],
  },
  quickAssignText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: FONTS.primary,
    fontSize: 16,
    color: COLORS.secondary[900],
  },
  subjectFilter: {
    marginBottom: 24,
  },
  subjectFilterContent: {
    gap: 8,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  subjectChipActive: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  subjectChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  subjectChipTextActive: {
    color: COLORS.neutral.white,
  },
  lessonsSection: {
    marginBottom: 20,
  },
  lessonsSectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[700],
    marginBottom: 12,
  },
  lessonCard: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
  },
  lessonCardDisabled: {
    backgroundColor: COLORS.neutral[50],
    opacity: 0.6,
  },
  lessonCardSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  lessonCheckbox: {
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  lessonTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    flex: 1,
  },
  lessonTitleDisabled: {
    color: COLORS.secondary[500],
  },
  assignedBadge: {
    backgroundColor: COLORS.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  assignedBadgeText: {
    fontFamily: FONTS.primary,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  lessonDescription: {
    fontFamily: FONTS.primary,
    fontSize: 13,
    color: COLORS.secondary[600],
    marginBottom: 10,
    lineHeight: 18,
  },
  lessonDescriptionDisabled: {
    color: COLORS.secondary[400],
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontFamily: FONTS.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  durationText: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    color: COLORS.secondary[600],
  },
  subjectText: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  assignButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
});
