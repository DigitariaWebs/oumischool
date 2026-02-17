import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Platform,
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
import { useTheme } from "@/hooks/use-theme";

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

interface StudyDay {
  date: string;
  day: number;
  dayName: string;
  timeSpent: number; // in minutes
  isToday: boolean;
  lessonsCompleted: number;
  activities: {
    lessonTitle: string;
    subject: string;
    duration: number;
    completedAt: string;
  }[];
}

// Mock study streak data - last 30 days
const generateStudyStreak = (): StudyDay[] => {
  const days: StudyDay[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    // Mock: higher activity on weekdays, less on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hasActivity = Math.random() > (isWeekend ? 0.6 : 0.3);
    const timeSpent = hasActivity ? Math.floor(Math.random() * 120) + 15 : 0; // 15-135 min
    const lessonsCompleted = hasActivity
      ? Math.floor(Math.random() * 3) + 1
      : 0;

    const activities = [];
    if (hasActivity) {
      const subjects = ["Mathématiques", "Français", "Sciences", "Histoire"];
      const lessons = [
        "Les fractions",
        "Le passé composé",
        "Le système solaire",
        "La révolution française",
      ];
      for (let j = 0; j < lessonsCompleted; j++) {
        activities.push({
          lessonTitle: lessons[Math.floor(Math.random() * lessons.length)],
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          duration: Math.floor(Math.random() * 45) + 15,
          completedAt: `${9 + j}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}`,
        });
      }
    }

    days.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      dayName: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."][
        dayOfWeek
      ],
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
  const { isDark } = useTheme();

  const child = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );

  const childColor = child?.color || COLORS.primary.DEFAULT;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(child?.name || "");
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(
    child?.dateOfBirth || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedGrade, setEditedGrade] = useState(child?.grade || "");
  const [editedColor, setEditedColor] = useState(
    child?.color || AVATAR_COLORS[0],
  );
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [activities] = useState<Activity[]>(mockActivities);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);
  const studyStreakDays = useMemo(() => generateStudyStreak(), []);

  const styles = useMemo(
    () => createStyles(isDark, childColor),
    [isDark, childColor],
  );

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

  // Calculate streak
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

  // Get opacity for heatmap based on time spent
  const getHeatmapOpacity = (timeSpent: number): number => {
    if (timeSpent === 0) return 0;
    if (timeSpent < 30) return 0.3;
    if (timeSpent < 60) return 0.5;
    if (timeSpent < 90) return 0.7;
    return 1;
  };

  const streakRecord = 12; // Mock record
  const totalTimeSpent = 245; // Mock total minutes this week
  const totalSessions = 8; // Mock sessions this week

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
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

  const overallProgress = Math.round(
    lessons.reduce((acc, lesson) => acc + lesson.progress, 0) /
      lessons.length || 0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.floatingBackButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={childColor} />
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
              <Edit size={20} color={childColor} />
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
                <Save size={20} color={childColor} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: childColor }]}>
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
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <User
                    size={16}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[600]}
                  />
                  <Text style={styles.inputLabel}>Nom complet</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Entrez le nom de l'enfant"
                  placeholderTextColor={
                    isDark ? COLORS.neutral[500] : COLORS.neutral[400]
                  }
                />
              </View>

              {/* Date of Birth Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Cake
                    size={16}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[600]}
                  />
                  <Text style={styles.inputLabel}>Date de naissance</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    { borderColor: childColor + "40" },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.datePickerContent}>
                    <Text style={styles.datePickerText}>
                      {new Date(editedDateOfBirth).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                    <View
                      style={[
                        styles.ageChip,
                        { backgroundColor: childColor + "20" },
                      ]}
                    >
                      <Text style={[styles.ageChipText, { color: childColor }]}>
                        {calculateAge(editedDateOfBirth)} ans
                      </Text>
                    </View>
                  </View>
                  <Calendar
                    size={18}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[500]}
                  />
                </TouchableOpacity>
              </View>

              {/* Grade Selection */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <GraduationCap
                    size={16}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[600]}
                  />
                  <Text style={styles.inputLabel}>Classe</Text>
                </View>
                <View style={styles.gradeGrid}>
                  {GRADES.map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        styles.gradeChipNew,
                        editedGrade === grade && [
                          styles.gradeChipSelected,
                          {
                            backgroundColor: childColor + "20",
                            borderColor: childColor,
                          },
                        ],
                      ]}
                      onPress={() => setEditedGrade(grade)}
                    >
                      <Text
                        style={[
                          styles.gradeChipText,
                          editedGrade === grade && [
                            styles.gradeChipTextSelected,
                            { color: childColor },
                          ],
                        ]}
                      >
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: childColor },
                  (!editedName.trim() || !editedGrade) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!editedName.trim() || !editedGrade}
              >
                <Save size={18} color={COLORS.neutral.white} />
                <Text style={styles.saveButtonText}>
                  Enregistrer les modifications
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Date Picker Modal */}
          {showDatePicker && (
            <>
              {Platform.OS === "ios" ? (
                <Modal
                  visible={showDatePicker}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.datePickerModal}>
                    <View style={styles.datePickerModalContent}>
                      <View style={styles.datePickerModalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text
                            style={[
                              styles.datePickerModalButton,
                              { color: childColor },
                            ]}
                          >
                            Annuler
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.datePickerModalTitle}>
                          Date de naissance
                        </Text>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text
                            style={[
                              styles.datePickerModalButton,
                              { color: childColor },
                            ]}
                          >
                            OK
                          </Text>
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

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Clock size={20} color={childColor} />
              <Text style={styles.statValue}>{totalTimeSpent}m</Text>
              <Text style={styles.statLabel}>Temps total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <BookOpen size={20} color={childColor} />
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <TrendingUp size={20} color={childColor} />
              <Text style={styles.statValue}>{overallProgress}%</Text>
              <Text style={styles.statLabel}>Progression</Text>
            </View>
          </View>
        </Animated.View>

        {/* Study Streak Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <View style={styles.streakHeader}>
            <View style={styles.streakTitleContainer}>
              <Flame size={20} color={childColor} />
              <Text style={styles.sectionTitle}>Série d'étude</Text>
            </View>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakStatsRow}>
              <View style={styles.streakStatBox}>
                <View
                  style={[
                    styles.streakIconContainer,
                    { backgroundColor: childColor + "20" },
                  ]}
                >
                  <Flame size={28} color={childColor} />
                </View>
                <View style={styles.streakStatInfo}>
                  <Text style={styles.streakStatValue}>{currentStreak}</Text>
                  <Text style={styles.streakStatLabel}>Jours consécutifs</Text>
                </View>
              </View>
              <View style={styles.streakRecordBox}>
                <Text style={styles.streakRecordValue}>{streakRecord}</Text>
                <Text style={styles.streakRecordLabel}>Record</Text>
              </View>
            </View>

            <View style={styles.streakDivider} />

            <View style={styles.calendarHeader}>
              <Calendar
                size={14}
                color={isDark ? COLORS.neutral[400] : COLORS.secondary[600]}
              />
              <Text style={styles.calendarTitle}>7 derniers jours</Text>
            </View>

            <View style={styles.heatmapContainer}>
              {studyStreakDays.slice(-7).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.heatmapDayContainer}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.heatmapDay,
                      day.timeSpent > 0 && {
                        backgroundColor: childColor,
                        opacity: getHeatmapOpacity(day.timeSpent),
                      },
                      day.isToday && styles.heatmapDayToday,
                      day.isToday &&
                        day.timeSpent > 0 && { borderColor: childColor },
                    ]}
                  >
                    {day.timeSpent === 0 && (
                      <View style={styles.heatmapDayEmpty} />
                    )}
                  </View>
                  <Text style={styles.heatmapDayLabel}>{day.dayName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Day Detail Card */}
          {selectedDay && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[
                styles.dayDetailCard,
                { borderLeftColor: childColor, borderLeftWidth: 4 },
              ]}
            >
              <View style={styles.dayDetailHeader}>
                <View style={styles.dayDetailTitleContainer}>
                  <Text style={styles.dayDetailDate}>
                    {new Date(selectedDay.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </Text>
                  {selectedDay.isToday && (
                    <View
                      style={[
                        styles.todayBadge,
                        { backgroundColor: childColor + "20" },
                      ]}
                    >
                      <Text
                        style={[styles.todayBadgeText, { color: childColor }]}
                      >
                        Aujourd'hui
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedDay(null)}
                  style={styles.closeDetailButton}
                >
                  <X
                    size={20}
                    color={isDark ? COLORS.neutral[400] : COLORS.secondary[500]}
                  />
                </TouchableOpacity>
              </View>

              {selectedDay.timeSpent > 0 ? (
                <>
                  <View style={styles.dayDetailStats}>
                    <View style={styles.dayDetailStatItem}>
                      <View
                        style={[
                          styles.dayDetailStatIcon,
                          { backgroundColor: childColor + "20" },
                        ]}
                      >
                        <Clock size={18} color={childColor} />
                      </View>
                      <View>
                        <Text style={styles.dayDetailStatValue}>
                          {selectedDay.timeSpent}m
                        </Text>
                        <Text style={styles.dayDetailStatLabel}>
                          Temps d'étude
                        </Text>
                      </View>
                    </View>

                    <View style={styles.dayDetailStatItem}>
                      <View
                        style={[
                          styles.dayDetailStatIcon,
                          { backgroundColor: childColor + "20" },
                        ]}
                      >
                        <CheckCircle2 size={18} color={childColor} />
                      </View>
                      <View>
                        <Text style={styles.dayDetailStatValue}>
                          {selectedDay.lessonsCompleted}
                        </Text>
                        <Text style={styles.dayDetailStatLabel}>
                          Leçons terminées
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.dayDetailDivider} />

                  <View style={styles.dayDetailActivities}>
                    <Text style={styles.dayDetailActivitiesTitle}>
                      Activités du jour
                    </Text>
                    {selectedDay.activities.map((activity, idx) => (
                      <View key={idx} style={styles.dayActivityItem}>
                        <View
                          style={[
                            styles.dayActivityDot,
                            { backgroundColor: childColor },
                          ]}
                        />
                        <View style={styles.dayActivityInfo}>
                          <Text style={styles.dayActivityTitle}>
                            {activity.lessonTitle}
                          </Text>
                          <Text style={styles.dayActivitySubtitle}>
                            {activity.subject} • {activity.duration}min •{" "}
                            {activity.completedAt}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.dayDetailEmpty}>
                  <BookOpen
                    size={32}
                    color={isDark ? COLORS.neutral[600] : COLORS.neutral[400]}
                  />
                  <Text style={styles.dayDetailEmptyText}>
                    Aucune activité ce jour
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
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
              <View
                style={[
                  styles.scheduleIconContainer,
                  { backgroundColor: childColor + "20" },
                ]}
              >
                <Calendar size={28} color={childColor} />
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
            <ChevronRight
              size={24}
              color={isDark ? COLORS.neutral[500] : COLORS.secondary[400]}
            />
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
              style={[
                styles.addLessonButton,
                { backgroundColor: childColor + "20" },
              ]}
              onPress={() => setAssignModalVisible(true)}
            >
              <Plus size={16} color={childColor} />
              <Text style={[styles.addLessonButtonText, { color: childColor }]}>
                Assigner
              </Text>
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

const createStyles = (isDark: boolean, accentColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : COLORS.neutral[50],
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    floatingBackButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
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
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    cancelEditButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
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
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
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
      borderColor: accentColor,
    },
    profileInfo: {
      alignItems: "center",
      marginBottom: 20,
    },
    profileName: {
      fontFamily: FONTS.fredoka,
      fontSize: 28,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 8,
    },
    profileDetails: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    editForm: {
      marginBottom: 16,
      gap: 20,
    },
    inputGroup: {
      gap: 8,
    },
    inputLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    inputRow: {
      flexDirection: "row",
      gap: 12,
    },
    inputLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[50],
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: isDark ? COLORS.neutral[600] : COLORS.neutral[200],
    },
    datePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[50],
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
    },
    datePickerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    datePickerText: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      textTransform: "capitalize",
    },
    ageChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    ageChipText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "700",
    },
    datePickerModal: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    datePickerModalContent: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 40,
    },
    datePickerModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    datePickerModalTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    datePickerModalButton: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
    },
    gradeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    gradeChipNew: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[50],
      borderWidth: 2,
      borderColor: isDark ? COLORS.neutral[600] : COLORS.neutral[200],
      minWidth: 80,
      alignItems: "center",
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginTop: 8,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.neutral.white,
    },
    gradeChipSelected: {
      borderWidth: 2,
    },
    gradeChipText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
    },
    gradeChipTextSelected: {
      fontWeight: "700",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
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
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    ageDisplay: {
      backgroundColor: isDark ? COLORS.primary[900] : COLORS.primary[50],
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: isDark ? accentColor + "40" : accentColor + "30",
      justifyContent: "center",
    },
    ageDisplayText: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: accentColor,
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
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 12,
    },
    streakHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    streakTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    streakCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    streakStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    streakStatBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    streakIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    streakStatInfo: {
      flex: 1,
    },
    streakStatValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 32,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 2,
    },
    streakStatLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    streakRecordBox: {
      alignItems: "flex-end",
    },
    streakRecordValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
      marginBottom: 2,
    },
    streakRecordLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
    },
    streakDivider: {
      height: 1,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
      marginBottom: 16,
    },
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 12,
    },
    calendarTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    heatmapContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    heatmapDayContainer: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    heatmapDay: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 8,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    heatmapDayToday: {
      borderColor: isDark ? COLORS.neutral[500] : COLORS.secondary[400],
    },
    heatmapDayEmpty: {
      width: "100%",
      height: "100%",
    },
    heatmapDayLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
      textAlign: "center",
    },
    dayDetailCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 20,
      marginTop: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    dayDetailHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    dayDetailTitleContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    dayDetailDate: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      textTransform: "capitalize",
    },
    todayBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    todayBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      fontWeight: "700",
    },
    closeDetailButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
    },
    dayDetailStats: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 16,
    },
    dayDetailStatItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    dayDetailStatIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    dayDetailStatValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    dayDetailStatLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    dayDetailDivider: {
      height: 1,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
      marginBottom: 16,
    },
    dayDetailActivities: {
      gap: 4,
    },
    dayDetailActivitiesTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
      marginBottom: 12,
    },
    dayActivityItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      paddingVertical: 8,
    },
    dayActivityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 6,
    },
    dayActivityInfo: {
      flex: 1,
    },
    dayActivityTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    dayActivitySubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    dayDetailEmpty: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 12,
    },
    dayDetailEmptyText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
    },
    scheduleCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 2,
      borderColor: isDark ? accentColor + "40" : accentColor + "20",
    },
    scheduleCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      flex: 1,
    },
    scheduleCardTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    scheduleCardSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    activityTimeline: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
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
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
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
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    activityDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      marginBottom: 4,
    },
    activityTimestamp: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[400],
    },
    addLessonButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    addLessonButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    lessonCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
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
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    lessonSubject: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
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
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
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
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
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
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[500],
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
      borderTopColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
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
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
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
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
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
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      marginTop: 4,
    },
    metricsGrid: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },
    metricCard: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[50],
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
    },
    metricValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    metricLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
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
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
    },
    weaknessText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
    },
    achievementsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    achievementBadge: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    achievementText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
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
