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
  Clock,
  ChevronRight,
  Filter,
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
    isAssigned: false,
  },
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
    isAssigned: false,
  },
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
    id: "english-1",
    title: "Les verbes irréguliers",
    subject: "Anglais",
    difficulty: "Intermédiaire",
    duration: 30,
    description: "Apprendre les verbes irréguliers courants",
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
  const [showRecommendations, setShowRecommendations] = useState(true);

  const lessons = useMemo(() => {
    return AVAILABLE_LESSONS.map((lesson) => ({
      ...lesson,
      isAssigned: assignedLessonIds.includes(lesson.id),
    }));
  }, [assignedLessonIds]);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(lessons.map((l) => l.subject)));
    return ["Tous", ...uniqueSubjects];
  }, [lessons]);

  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = [];

    childWeaknesses.forEach((weakness) => {
      if (weakness.toLowerCase().includes("verbe")) {
        const lesson = lessons.find((l) => l.id === "french-1");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Renforce les verbes",
            type: "reinforcement",
            matchScore: 95,
          });
        }
      }
    });

    childStrengths.forEach((strength) => {
      if (strength.toLowerCase().includes("fraction")) {
        const lesson = lessons.find((l) => l.id === "math-2");
        if (lesson && !lesson.isAssigned) {
          recs.push({
            lesson,
            reason: "Approfondir les fractions",
            type: "advanced",
            matchScore: 88,
          });
        }
      }
    });

    const popularLessons = [
      { id: "science-1", score: 90 },
      { id: "english-1", score: 85 },
    ];

    popularLessons.forEach(({ id, score }) => {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson && !lesson.isAssigned && recs.length < 4) {
        recs.push({
          lesson,
          reason: `Populaire en ${childGrade}`,
          type: "popular",
          matchScore: score,
        });
      }
    });

    return recs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [lessons, childWeaknesses, childStrengths, childGrade]);

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
      onClose();
    }
  };

  const handleQuickAssign = (lessonId: string) => {
    onAssign([lessonId]);
    onClose();
  };

  const getRecommendationColor = (type: Recommendation["type"]) => {
    switch (type) {
      case "reinforcement": return "#F59E0B";
      case "advanced": return "#10B981";
      case "popular": return "#3B82F6";
      default: return "#6366F1";
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
            <Text style={styles.modalTitle}>Assigner des leçons</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Recommandations */}
            {recommendations.length > 0 && showRecommendations && (
              <View style={styles.recommendationsSection}>
                <View style={styles.recommendationsHeader}>
                  <Sparkles size={16} color="#6366F1" />
                  <Text style={styles.recommendationsTitle}>Recommandé pour vous</Text>
                  <TouchableOpacity onPress={() => setShowRecommendations(false)}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {recommendations.map((rec, index) => (
                  <Animated.View
                    key={rec.lesson.id}
                    entering={FadeInDown.delay(index * 50).duration(400)}
                  >
                    <TouchableOpacity
                      style={[styles.recommendationCard, { borderLeftColor: getRecommendationColor(rec.type) }]}
                      onPress={() => handleQuickAssign(rec.lesson.id)}
                    >
                      <View style={styles.recommendationContent}>
                        <View style={styles.recommendationHeader}>
                          <Text style={styles.recommendationTitle}>{rec.lesson.title}</Text>
                          <View style={styles.recommendationMatch}>
                            <Text style={styles.matchScore}>{rec.matchScore}%</Text>
                          </View>
                        </View>
                        <Text style={styles.recommendationReason}>{rec.reason}</Text>
                        <View style={styles.recommendationMeta}>
                          <Text style={styles.recommendationSubject}>{rec.lesson.subject}</Text>
                          <Text style={styles.recommendationDot}>•</Text>
                          <Clock size={10} color="#94A3B8" />
                          <Text style={styles.recommendationDuration}>{rec.lesson.duration}min</Text>
                        </View>
                      </View>
                      <ChevronRight size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}

            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une leçon..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
              />
              <Filter size={16} color="#94A3B8" />
            </View>

            {/* Filtres */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
              contentContainerStyle={styles.filtersContent}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.filterChip,
                    selectedSubject === subject && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSubject === subject && styles.filterChipTextActive,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Liste des leçons */}
            <View style={styles.lessonsSection}>
              <Text style={styles.lessonsCount}>
                {filteredLessons.length} leçon{filteredLessons.length > 1 ? "s" : ""}
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
                  >
                    <View style={styles.lessonCheckbox}>
                      {isSelected ? (
                        <CheckCircle2 size={20} color="#6366F1" />
                      ) : (
                        <Circle size={20} color={isDisabled ? "#E2E8F0" : "#CBD5E1"} />
                      )}
                    </View>

                    <View style={styles.lessonContent}>
                      <Text style={[styles.lessonTitle, isDisabled && styles.lessonTitleDisabled]}>
                        {lesson.title}
                      </Text>
                      <Text style={[styles.lessonDescription, isDisabled && styles.lessonDescriptionDisabled]}>
                        {lesson.description}
                      </Text>

                      <View style={styles.lessonFooter}>
                        <View style={styles.lessonMeta}>
                          <View style={[styles.difficultyBadge, { backgroundColor: 
                            lesson.difficulty === "Débutant" ? "#D1FAE5" :
                            lesson.difficulty === "Intermédiaire" ? "#FEF3C7" : "#FEE2E2"
                          }]}>
                            <Text style={[styles.difficultyText, { color:
                              lesson.difficulty === "Débutant" ? "#10B981" :
                              lesson.difficulty === "Intermédiaire" ? "#F59E0B" : "#EF4444"
                            }]}>
                              {lesson.difficulty}
                            </Text>
                          </View>
                          <Clock size={12} color="#94A3B8" />
                          <Text style={styles.durationText}>{lesson.duration}min</Text>
                        </View>
                        <Text style={styles.subjectText}>{lesson.subject}</Text>
                      </View>
                    </View>

                    {isDisabled && (
                      <View style={styles.assignedBadge}>
                        <Text style={styles.assignedBadgeText}>Assignée</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bouton d'assignation */}
          {selectedLessons.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.actionBar}>
              <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
                <BookOpen size={18} color="white" />
                <Text style={styles.assignButtonText}>
                  Assigner {selectedLessons.length} leçon{selectedLessons.length > 1 ? "s" : ""}
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Recommandations
  recommendationsSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  recommendationsTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  recommendationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  recommendationMatch: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchScore: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "600",
  },
  recommendationReason: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },
  recommendationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recommendationSubject: {
    fontSize: 11,
    color: "#64748B",
  },
  recommendationDot: {
    fontSize: 11,
    color: "#CBD5E1",
  },
  recommendationDuration: {
    fontSize: 11,
    color: "#64748B",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
  },

  // Filters
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  filterChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  filterChipText: {
    fontSize: 13,
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "white",
  },

  // Lessons
  lessonsSection: {
    marginBottom: 20,
  },
  lessonsCount: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
  },
  lessonCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  lessonCardDisabled: {
    backgroundColor: "#F8FAFC",
    opacity: 0.7,
  },
  lessonCardSelected: {
    borderColor: "#6366F1",
  },
  lessonCheckbox: {
    marginRight: 12,
    justifyContent: "center",
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  lessonTitleDisabled: {
    color: "#94A3B8",
  },
  lessonDescription: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
    lineHeight: 16,
  },
  lessonDescriptionDisabled: {
    color: "#CBD5E1",
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "600",
  },
  durationText: {
    fontSize: 11,
    color: "#64748B",
  },
  subjectText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  assignedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  assignedBadgeText: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
  },

  // Action Bar
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    borderRadius: 30,
    padding: 14,
    gap: 8,
  },
  assignButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});