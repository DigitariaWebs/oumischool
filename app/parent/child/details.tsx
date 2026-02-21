import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  Flame,
  User,
  Cake,
  GraduationCap,
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

// Images pour les enfants
const childImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "lesson_completed",
    title: "Leçon terminée",
    description: "A complété 'Les fractions décimales'",
    timestamp: "Il y a 2h",
    color: "#10B981",
  },
  {
    id: "2",
    type: "achievement",
    title: "Nouveau succès",
    description: "A débloqué le badge 'Maître des Maths'",
    timestamp: "Il y a 3h",
    color: "#F59E0B",
  },
  {
    id: "3",
    type: "time_spent",
    title: "Temps d'apprentissage",
    description: "45 minutes d'apprentissage aujourd'hui",
    timestamp: "Il y a 5h",
    color: "#3B82F6",
  },
  {
    id: "4",
    type: "streak",
    title: "Série maintenue",
    description: "7 jours d'affilée !",
    timestamp: "Hier",
    color: "#8B5CF6",
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
];

interface StudyDay {
  date: string;
  day: number;
  dayName: string;
  timeSpent: number;
  isToday: boolean;
  lessonsCompleted: number;
  activities: {
    lessonTitle: string;
    subject: string;
    duration: number;
    completedAt: string;
  }[];
}

const generateStudyStreak = (): StudyDay[] => {
  const days: StudyDay[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hasActivity = Math.random() > (isWeekend ? 0.6 : 0.3);
    const timeSpent = hasActivity ? Math.floor(Math.random() * 120) + 15 : 0;
    const lessonsCompleted = hasActivity ? Math.floor(Math.random() * 3) + 1 : 0;

    const activities = [];
    if (hasActivity) {
      const subjects = ["Mathématiques", "Français", "Sciences"];
      const lessons = ["Les fractions", "Le passé composé", "Le système solaire"];
      for (let j = 0; j < lessonsCompleted; j++) {
        activities.push({
          lessonTitle: lessons[Math.floor(Math.random() * lessons.length)],
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          duration: Math.floor(Math.random() * 45) + 15,
          completedAt: `${9 + j}:00`,
        });
      }
    }

    days.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      dayName: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][dayOfWeek],
      timeSpent,
      isToday: i === 0,
      lessonsCompleted,
      activities,
    });
  }
  return days;
};

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

export default function ChildDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const childId = params.id as string;

  const child = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );

  const childColor = child?.color || "#6366F1";

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(child?.name || "");
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(
    child?.dateOfBirth || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedGrade, setEditedGrade] = useState(child?.grade || "");
  const [editedColor, setEditedColor] = useState(child?.color || AVATAR_COLORS[0]);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [activities] = useState<Activity[]>(mockActivities);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);
  const studyStreakDays = useMemo(() => generateStudyStreak(), []);

  const assignedLessonIds = lessons.map((lesson) => lesson.id);

  const childWeaknesses = lessons
    .flatMap((lesson) => lesson.details?.performance.weaknesses || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const childStrengths = lessons
    .flatMap((lesson) => lesson.details?.performance.strengths || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = studyStreakDays.length - 1; i >= 0; i--) {
      if (studyStreakDays[i].timeSpent > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [studyStreakDays]);

  const streakRecord = 12;
  const totalTimeSpent = 245;
  const totalSessions = 8;

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Enfant non trouvé</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setEditedDateOfBirth(selectedDate.toISOString().split("T")[0]);
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
      case "completed": return "#10B981";
      case "in-progress": return "#F59E0B";
      case "not-started": return "#94A3B8";
    }
  };

  const getStatusIcon = (status: Lesson["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={18} color="#10B981" />;
      case "in-progress": return <Clock size={18} color="#F59E0B" />;
      case "not-started": return <BookOpen size={18} color="#94A3B8" />;
    }
  };

  const getStatusText = (status: Lesson["status"]) => {
    switch (status) {
      case "completed": return "Terminé";
      case "in-progress": return "En cours";
      case "not-started": return "Non commencé";
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "lesson_completed": return <CheckCircle2 size={16} color="white" />;
      case "achievement": return <Trophy size={16} color="white" />;
      case "streak": return <Zap size={16} color="white" />;
      case "time_spent": return <Clock size={16} color="white" />;
    }
  };

  const renderInterestStars = (level: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= level ? "#F59E0B" : "#E2E8F0"}
            fill={star <= level ? "#F59E0B" : "transparent"}
          />
        ))}
      </View>
    );
  };

  const getHeatmapOpacity = (timeSpent: number): number => {
    if (timeSpent === 0) return 0.1;
    if (timeSpent < 30) return 0.3;
    if (timeSpent < 60) return 0.5;
    if (timeSpent < 90) return 0.7;
    return 1;
  };

  const overallProgress = Math.round(
    lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / lessons.length || 0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Edit size={18} color={childColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: childColor }]} onPress={handleSave}>
                <Save size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.profileHeader}>
            <Image
              source={{ uri: childImages[0] }}
              style={styles.avatar}
            />
            {!isEditing ? (
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{child.name}</Text>
                <Text style={styles.profileDetails}>
                  {calculateAge(child.dateOfBirth)} ans • {child.grade}
                </Text>
              </View>
            ) : (
              <View style={styles.editForm}>
                {/* Nom */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <User size={14} color="#64748B" />
                    <Text style={styles.inputLabelText}>Nom</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Nom de l'enfant"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                {/* Date de naissance */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <Cake size={14} color="#64748B" />
                    <Text style={styles.inputLabelText}>Date de naissance</Text>
                  </View>
                  <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateButtonText}>
                      {new Date(editedDateOfBirth).toLocaleDateString("fr-FR")}
                    </Text>
                    <Calendar size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Classe */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <GraduationCap size={14} color="#64748B" />
                    <Text style={styles.inputLabelText}>Classe</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeScroll}>
                    <View style={styles.gradeContainer}>
                      {GRADES.map((grade) => (
                        <TouchableOpacity
                          key={grade}
                          style={[
                            styles.gradeChip,
                            editedGrade === grade && {
                              backgroundColor: childColor + "15",
                              borderColor: childColor,
                            },
                          ]}
                          onPress={() => setEditedGrade(grade)}
                        >
                          <Text
                            style={[
                              styles.gradeChipText,
                              editedGrade === grade && { color: childColor },
                            ]}
                          >
                            {grade}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={16} color={childColor} />
              <Text style={styles.statValue}>{totalTimeSpent}m</Text>
              <Text style={styles.statLabel}>Temps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <BookOpen size={16} color={childColor} />
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={16} color={childColor} />
              <Text style={styles.statValue}>{overallProgress}%</Text>
              <Text style={styles.statLabel}>Progrès</Text>
            </View>
          </View>
        </View>

        {/* Série d'étude */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Flame size={18} color={childColor} />
              <Text style={styles.sectionTitle}>Série d'étude</Text>
            </View>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakMain}>
                <Text style={styles.streakValue}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>jours</Text>
              </View>
              <View style={styles.streakRecord}>
                <Text style={styles.streakRecordValue}>{streakRecord}</Text>
                <Text style={styles.streakRecordLabel}>record</Text>
              </View>
            </View>

            <View style={styles.heatmap}>
              {studyStreakDays.slice(-7).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.heatmapDay}
                  onPress={() => setSelectedDay(day)}
                >
                  <View
                    style={[
                      styles.heatmapBlock,
                      day.timeSpent > 0 && {
                        backgroundColor: childColor,
                        opacity: getHeatmapOpacity(day.timeSpent),
                      },
                      day.isToday && styles.heatmapBlockToday,
                    ]}
                  />
                  <Text style={styles.heatmapLabel}>{day.dayName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Détail du jour */}
          {selectedDay && (
            <View style={[styles.dayDetail, { borderLeftColor: childColor }]}>
              <View style={styles.dayDetailHeader}>
                <Text style={styles.dayDetailDate}>
                  {new Date(selectedDay.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </Text>
                <TouchableOpacity onPress={() => setSelectedDay(null)}>
                  <X size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              {selectedDay.timeSpent > 0 ? (
                <>
                  <View style={styles.dayDetailStats}>
                    <View style={styles.dayDetailStat}>
                      <Clock size={14} color={childColor} />
                      <Text style={styles.dayDetailStatText}>
                        {selectedDay.timeSpent} min
                      </Text>
                    </View>
                    <View style={styles.dayDetailStat}>
                      <CheckCircle2 size={14} color={childColor} />
                      <Text style={styles.dayDetailStatText}>
                        {selectedDay.lessonsCompleted} leçon(s)
                      </Text>
                    </View>
                  </View>
                  {selectedDay.activities.map((activity, idx) => (
                    <View key={idx} style={styles.dayActivity}>
                      <View style={[styles.dayActivityDot, { backgroundColor: childColor }]} />
                      <Text style={styles.dayActivityText}>
                        {activity.lessonTitle} • {activity.subject}
                      </Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={styles.dayDetailEmpty}>Aucune activité</Text>
              )}
            </View>
          )}
        </View>

        {/* Planning tuteurs */}
        <TouchableOpacity
          style={styles.scheduleCard}
          onPress={() => router.push(`/parent/child/schedule?id=${childId}`)}
        >
          <View style={styles.scheduleLeft}>
            <View style={[styles.scheduleIcon, { backgroundColor: childColor + "15" }]}>
              <Calendar size={20} color={childColor} />
            </View>
            <View>
              <Text style={styles.scheduleTitle}>Planning des tuteurs</Text>
              <Text style={styles.scheduleSubtitle}>Voir le calendrier</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Activité récente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Leçons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leçons en cours</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: childColor + "15" }]}
              onPress={() => setAssignModalVisible(true)}
            >
              <Plus size={14} color={childColor} />
              <Text style={[styles.addButtonText, { color: childColor }]}>Assigner</Text>
            </TouchableOpacity>
          </View>

          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => lesson.details && toggleLesson(lesson.id)}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonLeft}>
                  {getStatusIcon(lesson.status)}
                  <View>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonSubject}>{lesson.subject}</Text>
                  </View>
                </View>
                <View style={styles.lessonRight}>
                  <View style={[styles.lessonStatus, { backgroundColor: getStatusColor(lesson.status) + "15" }]}>
                    <Text style={[styles.lessonStatusText, { color: getStatusColor(lesson.status) }]}>
                      {getStatusText(lesson.status)}
                    </Text>
                  </View>
                  {lesson.details && (
                    <ChevronDown
                      size={16}
                      color="#94A3B8"
                      style={{ transform: [{ rotate: expandedLesson === lesson.id ? "180deg" : "0deg" }] }}
                    />
                  )}
                </View>
              </View>

              {lesson.status !== "not-started" && (
                <View style={styles.lessonProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${lesson.progress}%`, backgroundColor: getStatusColor(lesson.status) },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{lesson.progress}%</Text>
                </View>
              )}

              {expandedLesson === lesson.id && lesson.details && (
                <View style={styles.expandedContent}>
                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedSectionTitle}>Intérêt</Text>
                    {renderInterestStars(lesson.details.interestLevel)}
                  </View>

                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedSectionTitle}>Performance</Text>
                    <View style={styles.metricsRow}>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>{lesson.details.performance.accuracy}%</Text>
                        <Text style={styles.metricLabel}>Précision</Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>{lesson.details.performance.timeSpent}m</Text>
                        <Text style={styles.metricLabel}>Temps</Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>{lesson.details.performance.attempts}</Text>
                        <Text style={styles.metricLabel}>Tentatives</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.strengthWeaknessRow}>
                    <View style={styles.strengthSection}>
                      <Text style={styles.strengthTitle}>Points forts</Text>
                      {lesson.details.performance.strengths.map((s, idx) => (
                        <View key={idx} style={styles.strengthItem}>
                          <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
                          <Text style={styles.strengthText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.weaknessSection}>
                      <Text style={styles.weaknessTitle}>À améliorer</Text>
                      {lesson.details.performance.weaknesses.map((w, idx) => (
                        <View key={idx} style={styles.weaknessItem}>
                          <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
                          <Text style={styles.weaknessText}>{w}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Succès */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Succès récents</Text>
          <View style={styles.achievementsRow}>
            <View style={styles.achievement}>
              <Award size={24} color="#F59E0B" />
              <Text style={styles.achievementText}>Maître des Maths</Text>
            </View>
            <View style={styles.achievement}>
              <Flame size={24} color="#EF4444" />
              <Text style={styles.achievementText}>7 jours</Text>
            </View>
            <View style={styles.achievement}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.achievementText}>10 leçons</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <>
          {Platform.OS === "ios" ? (
            <Modal visible transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.modalButton, { color: childColor }]}>Annuler</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Date de naissance</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.modalButton, { color: childColor }]}>OK</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={new Date(editedDateOfBirth)}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    locale="fr-FR"
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={new Date(editedDateOfBirth)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      )}

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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Bouton retour
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },

  // Carte profil
  profileCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 20,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    zIndex: 10,
  },
  editActions: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    borderRadius: 24,
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: "#64748B",
  },

  // Formulaire d'édition
  editForm: {
    width: "100%",
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inputLabelText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dateButtonText: {
    fontSize: 15,
    color: "#1E293B",
  },
  gradeScroll: {
    flexGrow: 0,
  },
  gradeContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  gradeChipText: {
    fontSize: 13,
    color: "#64748B",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#F1F5F9",
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Streak
  streakCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  streakMain: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  streakValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: "#1E293B",
  },
  streakLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  streakRecord: {
    alignItems: "flex-end",
  },
  streakRecordValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#94A3B8",
  },
  streakRecordLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  heatmap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heatmapDay: {
    alignItems: "center",
    gap: 6,
  },
  heatmapBlock: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "transparent",
  },
  heatmapBlockToday: {
    borderColor: "#6366F1",
  },
  heatmapLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },

  // Day Detail
  dayDetail: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dayDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dayDetailDate: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: "#1E293B",
    textTransform: "capitalize",
  },
  dayDetailStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  dayDetailStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayDetailStatText: {
    fontSize: 13,
    color: "#1E293B",
  },
  dayActivity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  dayActivityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayActivityText: {
    fontSize: 12,
    color: "#64748B",
  },
  dayDetailEmpty: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },

  // Schedule Card
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 24,
  },
  scheduleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scheduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },

  // Activity
  activityItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#94A3B8",
  },

  // Lessons
  lessonCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  lessonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  lessonRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  lessonSubject: {
    fontSize: 12,
    color: "#64748B",
  },
  lessonStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lessonStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  lessonProgress: {
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
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "600",
    width: 35,
  },

  // Expanded lesson
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 16,
  },
  expandedSection: {
    gap: 8,
  },
  expandedSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metric: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  metricValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: "#64748B",
  },
  strengthWeaknessRow: {
    flexDirection: "row",
    gap: 16,
  },
  strengthSection: {
    flex: 1,
  },
  weaknessSection: {
    flex: 1,
  },
  strengthTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    marginBottom: 6,
  },
  weaknessTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 6,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  weaknessItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  strengthText: {
    fontSize: 12,
    color: "#64748B",
  },
  weaknessText: {
    fontSize: 12,
    color: "#64748B",
  },

  // Achievements
  achievementsRow: {
    flexDirection: "row",
    gap: 10,
  },
  achievement: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  achievementText: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
  },
  modalButton: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});