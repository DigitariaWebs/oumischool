import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Edit,
  Save,
  X,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Plus,
  CheckCircle2,
  Clock,
  ChevronDown,
  Star,
  Target,
  Zap,
  Trophy,
  ChevronRight,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateChild } from "@/store/slices/childrenSlice";
import AssignLessonModal from "@/components/AssignLessonModal";

interface LessonDetails {
  progressHistory: { date: string; progress: number }[];
  interestLevel: number;
  performance: {
    accuracy: number;
    timeSpent: number;
    attempts: number;
    strengths: string[];
    weaknesses: string[];
  };
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  status: "completed" | "in-progress" | "not-started";
  progress: number;
  duration: number;
  completedAt?: string;
  details?: LessonDetails;
}

interface Activity {
  id: string;
  type: "lesson_completed" | "achievement" | "streak" | "time_spent";
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

const AVATAR_COLORS = [
  "#3B82F6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#F97316",
];

const GRADES = [
  "Maternelle",
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2",
  "6ème",
  "5ème",
  "4ème",
  "3ème",
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "lesson_completed",
    title: "Leçon terminée",
    description: "A complété 'Les fractions décimales'",
    timestamp: "Il y a 2h",
    color: COLORS.success,
  },
  {
    id: "2",
    type: "achievement",
    title: "Nouveau succès",
    description: "A débloqué le badge 'Maître des Maths'",
    timestamp: "Il y a 3h",
    color: COLORS.warning,
  },
  {
    id: "3",
    type: "time_spent",
    title: "Temps d'apprentissage",
    description: "45 minutes d'apprentissage aujourd'hui",
    timestamp: "Il y a 5h",
    color: COLORS.info,
  },
  {
    id: "4",
    type: "streak",
    title: "Série maintenue",
    description: "7 jours d'affilée !",
    timestamp: "Hier",
    color: COLORS.primary.DEFAULT,
  },
];

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Les fractions décimales",
    subject: "Mathématiques",
    status: "completed",
    progress: 100,
    duration: 30,
    completedAt: "Il y a 2h",
    details: {
      progressHistory: [
        { date: "Lun", progress: 20 },
        { date: "Mar", progress: 45 },
        { date: "Mer", progress: 70 },
        { date: "Jeu", progress: 100 },
      ],
      interestLevel: 4,
      performance: {
        accuracy: 92,
        timeSpent: 120,
        attempts: 3,
        strengths: ["Conversion", "Comparaison"],
        weaknesses: ["Opérations complexes"],
      },
    },
  },
  {
    id: "2",
    title: "Le passé composé",
    subject: "Français",
    status: "in-progress",
    progress: 65,
    duration: 45,
    details: {
      progressHistory: [
        { date: "Lun", progress: 15 },
        { date: "Mar", progress: 35 },
        { date: "Mer", progress: 65 },
      ],
      interestLevel: 3,
      performance: {
        accuracy: 78,
        timeSpent: 85,
        attempts: 5,
        strengths: ["Verbes du 1er groupe"],
        weaknesses: ["Verbes irréguliers", "Accord du participe"],
      },
    },
  },
  {
    id: "3",
    title: "Le système solaire",
    subject: "Sciences",
    status: "not-started",
    progress: 0,
    duration: 40,
  },
  {
    id: "4",
    title: "Les verbes irréguliers",
    subject: "Anglais",
    status: "not-started",
    progress: 0,
    duration: 35,
  },
];

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

export default function ChildDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const childId = params.id as string;

  const child = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(child?.name || "");
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(
    child?.dateOfBirth || "",
  );
  const [editedGrade, setEditedGrade] = useState(child?.grade || "");
  const [editedColor, setEditedColor] = useState(
    child?.color || AVATAR_COLORS[0],
  );
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [activities] = useState<Activity[]>(mockActivities);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);

  const assignedLessonIds = useMemo(() => {
    return lessons.map((lesson) => lesson.id);
  }, [lessons]);

  const childWeaknesses = useMemo(() => {
    const weaknesses: string[] = [];
    lessons.forEach((lesson) => {
      if (lesson.details?.performance.weaknesses) {
        weaknesses.push(...lesson.details.performance.weaknesses);
      }
    });
    return [...new Set(weaknesses)];
  }, [lessons]);

  const childStrengths = useMemo(() => {
    const strengths: string[] = [];
    lessons.forEach((lesson) => {
      if (lesson.details?.performance.strengths) {
        strengths.push(...lesson.details.performance.strengths);
      }
    });
    return [...new Set(strengths)];
  }, [lessons]);

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Enfant non trouvé</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (editedName.trim() && editedDateOfBirth && editedGrade) {
      dispatch(
        updateChild({
          id: childId,
          updates: {
            name: editedName.trim(),
            dateOfBirth: editedDateOfBirth,
            grade: editedGrade,
            color: editedColor,
          },
        }),
      );
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(child.name);
    setEditedDateOfBirth(child.dateOfBirth);
    setEditedGrade(child.grade);
    setEditedColor(child.color);
    setIsEditing(false);
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleAssignLessons = (lessonIds: string[]) => {
    const newLessons: Lesson[] = lessonIds.map((id) => ({
      id,
      title: `Leçon ${id}`,
      subject: "Nouveau",
      status: "not-started",
      progress: 0,
      duration: 30,
    }));

    setLessons((prev) => [...prev, ...newLessons]);
  };

  const getStatusColor = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "in-progress":
        return COLORS.warning;
      case "not-started":
        return COLORS.neutral[400];
    }
  };

  const getStatusIcon = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={20} color={COLORS.success} />;
      case "in-progress":
        return <Clock size={20} color={COLORS.warning} />;
      case "not-started":
        return <BookOpen size={20} color={COLORS.neutral[400]} />;
    }
  };

  const getStatusText = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "in-progress":
        return "En cours";
      case "not-started":
        return "Non commencé";
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "lesson_completed":
        return <CheckCircle2 size={20} color={COLORS.neutral.white} />;
      case "achievement":
        return <Trophy size={20} color={COLORS.neutral.white} />;
      case "streak":
        return <Zap size={20} color={COLORS.neutral.white} />;
      case "time_spent":
        return <Clock size={20} color={COLORS.neutral.white} />;
    }
  };

  const renderInterestStars = (level: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            color={star <= level ? "#F59E0B" : COLORS.neutral[300]}
            fill={star <= level ? "#F59E0B" : "transparent"}
          />
        ))}
      </View>
    );
  };

  const completedLessons = lessons.filter(
    (l) => l.status === "completed",
  ).length;
  const inProgressLessons = lessons.filter(
    (l) => l.status === "in-progress",
  ).length;
  const overallProgress = Math.round(
    lessons.reduce((acc, lesson) => acc + lesson.progress, 0) /
      lessons.length || 0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.floatingBackButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.primary.DEFAULT} />
        </TouchableOpacity>

        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.profileCard}
        >
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit size={20} color={COLORS.primary.DEFAULT} />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                gap: 8,
              }}
            >
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={handleCancel}
              >
                <X size={20} color={COLORS.neutral[600]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={handleSave}>
                <Save size={20} color={COLORS.primary.DEFAULT} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: child.color }]}>
              <Text style={styles.avatarText}>
                {child.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {isEditing && (
              <View style={styles.colorPicker}>
                <Text style={styles.colorPickerLabel}>Couleur</Text>
                <View style={styles.colorGrid}>
                  {AVATAR_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        editedColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setEditedColor(color)}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {!isEditing ? (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{child.name}</Text>
              <Text style={styles.profileDetails}>
                {calculateAge(child.dateOfBirth)} ans • {child.grade}
              </Text>
            </View>
          ) : (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Nom de l'enfant"
                  placeholderTextColor={COLORS.neutral[400]}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Date de naissance</Text>
                  <View style={styles.ageDisplay}>
                    <Text style={styles.ageDisplayText}>
                      {calculateAge(editedDateOfBirth)} ans
                    </Text>
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Classe</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.gradeScrollView}
                  >
                    {GRADES.map((grade) => (
                      <TouchableOpacity
                        key={grade}
                        style={[
                          styles.gradeChip,
                          editedGrade === grade && styles.gradeChipSelected,
                        ]}
                        onPress={() => setEditedGrade(grade)}
                      >
                        <Text
                          style={[
                            styles.gradeChipText,
                            editedGrade === grade &&
                              styles.gradeChipTextSelected,
                          ]}
                        >
                          {grade}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <TrendingUp size={24} color={COLORS.primary.DEFAULT} />
              <Text style={styles.statValue}>{overallProgress}%</Text>
              <Text style={styles.statLabel}>Progression</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <CheckCircle2 size={24} color={COLORS.success} />
              <Text style={styles.statValue}>{completedLessons}</Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Clock size={24} color={COLORS.warning} />
              <Text style={styles.statValue}>{inProgressLessons}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </View>
          </View>
        </Animated.View>

        {/* Schedule Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <TouchableOpacity
            style={styles.scheduleCard}
            onPress={() => router.push(`/parent/child/schedule?id=${childId}`)}
            activeOpacity={0.7}
          >
            <View style={styles.scheduleCardLeft}>
              <View style={styles.scheduleIconContainer}>
                <Calendar size={28} color={COLORS.primary.DEFAULT} />
              </View>
              <View>
                <Text style={styles.scheduleCardTitle}>
                  Planning des tuteurs
                </Text>
                <Text style={styles.scheduleCardSubtitle}>
                  Voir le calendrier hebdomadaire
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color={COLORS.secondary[400]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <View style={styles.activityTimeline}>
            {activities.map((activity, index) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <View
                    style={[
                      styles.activityIconBadge,
                      { backgroundColor: activity.color },
                    ]}
                  >
                    {getActivityIcon(activity.type)}
                  </View>
                  {index < activities.length - 1 && (
                    <View style={styles.activityLine} />
                  )}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                  <Text style={styles.activityTimestamp}>
                    {activity.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Lessons Section */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leçons en cours</Text>
            <TouchableOpacity
              style={styles.addLessonButton}
              onPress={() => setAssignModalVisible(true)}
            >
              <Plus size={16} color={COLORS.primary.DEFAULT} />
              <Text style={styles.addLessonButtonText}>Assigner</Text>
            </TouchableOpacity>
          </View>

          {lessons.map((lesson, index) => (
            <Animated.View
              key={lesson.id}
              entering={FadeInDown.delay(300 + index * 50).duration(400)}
            >
              <TouchableOpacity
                style={styles.lessonCard}
                onPress={() =>
                  lesson.details ? toggleLesson(lesson.id) : null
                }
                activeOpacity={lesson.details ? 0.7 : 1}
              >
                <View style={styles.lessonHeader}>
                  <View style={styles.lessonTitleContainer}>
                    {getStatusIcon(lesson.status)}
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonSubject}>{lesson.subject}</Text>
                    </View>
                  </View>
                  <View style={styles.lessonHeaderRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(lesson.status) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: getStatusColor(lesson.status) },
                        ]}
                      >
                        {getStatusText(lesson.status)}
                      </Text>
                    </View>
                    {lesson.details && (
                      <ChevronDown
                        size={20}
                        color={COLORS.secondary[500]}
                        style={{
                          transform: [
                            {
                              rotate:
                                expandedLesson === lesson.id
                                  ? "180deg"
                                  : "0deg",
                            },
                          ],
                        }}
                      />
                    )}
                  </View>
                </View>

                {lesson.status !== "not-started" && (
                  <View style={styles.lessonProgress}>
                    <View style={styles.lessonProgressBar}>
                      <View
                        style={[
                          styles.lessonProgressFill,
                          {
                            width: `${lesson.progress}%`,
                            backgroundColor: getStatusColor(lesson.status),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.lessonProgressText}>
                      {lesson.progress}%
                    </Text>
                  </View>
                )}

                <View style={styles.lessonFooter}>
                  <View style={styles.lessonMeta}>
                    <Clock size={14} color={COLORS.neutral[500]} />
                    <Text style={styles.lessonMetaText}>
                      {lesson.duration} min
                    </Text>
                  </View>
                  {lesson.completedAt && (
                    <Text style={styles.completedText}>
                      Terminé {lesson.completedAt}
                    </Text>
                  )}
                </View>

                {expandedLesson === lesson.id && lesson.details && (
                  <View style={styles.expandedContent}>
                    <View style={styles.detailSection}>
                      <View style={styles.detailHeader}>
                        <Star size={16} color={COLORS.warning} />
                        <Text style={styles.detailTitle}>
                          Niveau d&apos;intérêt
                        </Text>
                      </View>
                      {renderInterestStars(lesson.details.interestLevel)}
                    </View>

                    <View style={styles.detailSection}>
                      <View style={styles.detailHeader}>
                        <TrendingUp size={16} color={COLORS.info} />
                        <Text style={styles.detailTitle}>
                          Progression dans le temps
                        </Text>
                      </View>
                      <View style={styles.progressChart}>
                        {lesson.details.progressHistory.map((item, idx) => (
                          <View key={idx} style={styles.chartBar}>
                            <View style={styles.chartBarContainer}>
                              <View
                                style={[
                                  styles.chartBarFill,
                                  {
                                    height: `${item.progress}%`,
                                    backgroundColor: getStatusColor(
                                      lesson.status,
                                    ),
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.chartLabel}>{item.date}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.detailSection}>
                      <View style={styles.detailHeader}>
                        <Target size={16} color={COLORS.success} />
                        <Text style={styles.detailTitle}>Performance</Text>
                      </View>
                      <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                          <Text style={styles.metricValue}>
                            {lesson.details.performance.accuracy}%
                          </Text>
                          <Text style={styles.metricLabel}>Précision</Text>
                        </View>
                        <View style={styles.metricCard}>
                          <Text style={styles.metricValue}>
                            {lesson.details.performance.timeSpent}m
                          </Text>
                          <Text style={styles.metricLabel}>Temps</Text>
                        </View>
                        <View style={styles.metricCard}>
                          <Text style={styles.metricValue}>
                            {lesson.details.performance.attempts}
                          </Text>
                          <Text style={styles.metricLabel}>Tentatives</Text>
                        </View>
                      </View>

                      <View style={styles.strengthsWeaknesses}>
                        <View style={styles.strengthsSection}>
                          <Text style={styles.strengthsTitle}>
                            Points forts
                          </Text>
                          {lesson.details.performance.strengths.map(
                            (strength, idx) => (
                              <View key={idx} style={styles.strengthItem}>
                                <View style={styles.strengthDot} />
                                <Text style={styles.strengthText}>
                                  {strength}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                        <View style={styles.weaknessesSection}>
                          <Text style={styles.weaknessesTitle}>
                            À améliorer
                          </Text>
                          {lesson.details.performance.weaknesses.map(
                            (weakness, idx) => (
                              <View key={idx} style={styles.weaknessItem}>
                                <View style={styles.weaknessDot} />
                                <Text style={styles.weaknessText}>
                                  {weakness}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Achievements Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Succès récents</Text>
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementBadge}>
              <Award size={32} color={COLORS.warning} />
              <Text style={styles.achievementText}>Maître des Maths</Text>
            </View>
            <View style={styles.achievementBadge}>
              <TrendingUp size={32} color={COLORS.success} />
              <Text style={styles.achievementText}>7 jours d&apos;affilée</Text>
            </View>
            <View style={styles.achievementBadge}>
              <BookOpen size={32} color={COLORS.info} />
              <Text style={styles.achievementText}>10 leçons</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <AssignLessonModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        onAssign={handleAssignLessons}
        assignedLessonIds={assignedLessonIds}
        childWeaknesses={childWeaknesses}
        childStrengths={childStrengths}
        childGrade={child.grade}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  floatingBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cancelEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: FONTS.fredoka,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
  colorPicker: {
    alignItems: "center",
  },
  colorPickerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: "row",
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: COLORS.primary.DEFAULT,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  profileDetails: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  editForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[700],
    marginBottom: 8,
  },
  input: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[900],
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  gradeScrollView: {
    flexGrow: 0,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[50],
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  gradeChipSelected: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary.DEFAULT,
  },
  gradeChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  gradeChipTextSelected: {
    color: COLORS.primary.DEFAULT,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    marginBottom: 0,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.neutral[200],
  },
  ageDisplay: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    justifyContent: "center",
  },
  ageDisplayText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.primary.DEFAULT,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.primary[100],
  },
  scheduleCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  scheduleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleCardTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  scheduleCardSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
  },
  activityTimeline: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    gap: 12,
  },
  activityIconContainer: {
    alignItems: "center",
  },
  activityIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: 8,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 20,
  },
  activityTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    marginBottom: 4,
  },
  activityTimestamp: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
  },
  addLessonButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary[50],
  },
  addLessonButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  lessonCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lessonTitleContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  lessonSubject: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  lessonHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "700",
  },
  lessonProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  lessonProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: "hidden",
  },
  lessonProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  lessonProgressText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary[700],
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
  lessonMetaText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  completedText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.success,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  detailSection: {
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  detailTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  progressChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 120,
    paddingVertical: 8,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  chartBarContainer: {
    width: 32,
    height: 100,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 4,
  },
  chartLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[600],
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  metricValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[600],
  },
  strengthsWeaknesses: {
    flexDirection: "row",
    gap: 12,
  },
  strengthsSection: {
    flex: 1,
  },
  weaknessesSection: {
    flex: 1,
  },
  strengthsTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.success,
    marginBottom: 8,
  },
  weaknessesTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.error,
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  weaknessItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  strengthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  weaknessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  strengthText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[700],
  },
  weaknessText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[700],
  },
  achievementsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  achievementBadge: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[700],
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  backButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
});
