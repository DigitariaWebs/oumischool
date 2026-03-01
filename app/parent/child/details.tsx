import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Zap,
  Trophy,
  ChevronRight,
  Flame,
  User,
  Cake,
  GraduationCap,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateChild } from "@/store/slices/childrenSlice";
import AssignLessonModal from "@/components/AssignLessonModal";
import { useChild, useUpdateChild, useDeleteChild } from "@/hooks/api/parent";
import { useSessions } from "@/hooks/api/sessions";
import { useActivities } from "@/hooks/api/performance";
import type { PerformanceRecord } from "@/hooks/api/performance";
import { resolveSubjectDisplayName } from "@/utils/sessionDisplay";
import { THEME } from "@/config/theme";

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

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CHILD_COLORS[Math.abs(hash) % CHILD_COLORS.length];
}

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

function formatRelativeLabel(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Récemment";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMin < 60) return `Il y a ${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays}j`;
}

function lessonStatusFromSession(status: string): Lesson["status"] {
  const key = status.toUpperCase();
  if (key === "COMPLETED") return "completed";
  if (key === "PENDING" || key === "REQUESTED") return "not-started";
  return "in-progress";
}

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

function buildStudyDaysFromActivities(
  records: PerformanceRecord[],
): StudyDay[] {
  const today = new Date();
  const days: StudyDay[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    const dayRecords = records.filter(
      (r) => r.recordedAt.split("T")[0] === dateStr,
    );
    const lessonsCompleted = dayRecords.length;
    // Estimate 30 min per activity as a reasonable proxy
    const timeSpent = lessonsCompleted * 30;

    days.push({
      date: dateStr,
      day: date.getDate(),
      dayName: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][dayOfWeek],
      timeSpent,
      isToday: i === 0,
      lessonsCompleted,
      activities: dayRecords.map((r) => ({
        lessonTitle: r.title ?? r.activityType,
        subject: r.subject?.name ?? "",
        duration: 0,
        completedAt: new Date(r.recordedAt).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  }
  return days;
}

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

type ModalConfig = {
  type: "confirm-delete" | "error" | "success";
  title: string;
  message: string;
};

export default function ChildDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const childId = params.id as string;
  const { data: apiChild, isLoading: isChildLoading } = useChild(childId);
  const updateChildMutation = useUpdateChild();
  const deleteChildMutation = useDeleteChild();
  const { data: sessionsData = [] } = useSessions();

  const localChild = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );
  const child = useMemo(() => {
    if (localChild) return localChild;
    if (!apiChild) return undefined;
    return {
      id: apiChild.id,
      name: apiChild.name,
      dateOfBirth:
        apiChild.dateOfBirth ?? new Date().toISOString().split("T")[0],
      grade: apiChild.grade,
      color: colorFromId(apiChild.id),
    };
  }, [apiChild, localChild]);

  const childColor = child?.color || colorFromId(childId);
  const liveLessons = useMemo((): Lesson[] => {
    const rows = Array.isArray(sessionsData) ? sessionsData : [];
    return rows
      .filter(
        (session: any) =>
          !childId ||
          session?.childId === childId ||
          session?.child?.id === childId,
      )
      .map((session: any) => {
        const start = new Date(session?.startTime ?? Date.now());
        const end = new Date(session?.endTime ?? Date.now());
        const duration = Math.max(
          30,
          Math.round((end.getTime() - start.getTime()) / 60000),
        );
        const status = lessonStatusFromSession(String(session?.status ?? ""));
        const subject = resolveSubjectDisplayName(session, "Cours");
        return {
          id: String(session?.id ?? `session-${Math.random()}`),
          title: subject,
          subject,
          status,
          progress:
            status === "completed" ? 100 : status === "in-progress" ? 50 : 0,
          duration,
          completedAt:
            status === "completed"
              ? formatRelativeLabel(
                  String(session?.endTime ?? session?.startTime ?? ""),
                )
              : undefined,
        } satisfies Lesson;
      });
  }, [childId, sessionsData]);
  const activities = useMemo((): Activity[] => {
    return liveLessons.slice(0, 6).map((lesson, index) => ({
      id: `${lesson.id}-${index}`,
      type:
        lesson.status === "completed"
          ? "lesson_completed"
          : lesson.status === "in-progress"
            ? "time_spent"
            : "achievement",
      title:
        lesson.status === "completed"
          ? "Leçon terminée"
          : lesson.status === "in-progress"
            ? "Apprentissage en cours"
            : "Leçon assignée",
      description: `${lesson.title} • ${lesson.subject}`,
      timestamp: lesson.completedAt ?? "Récemment",
      color:
        lesson.status === "completed"
          ? "#10B981"
          : lesson.status === "in-progress"
            ? "#3B82F6"
            : "#F59E0B",
    }));
  }, [liveLessons]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(child?.name || "");
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(
    child?.dateOfBirth || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedGrade, setEditedGrade] = useState(child?.grade || "");
  const [editedColor, setEditedColor] = useState(child?.color);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);
  const { data: recentActivities = [] } = useActivities(childId, 30);
  const studyStreakDays = useMemo(
    () => buildStudyDaysFromActivities(recentActivities),
    [recentActivities],
  );

  useEffect(() => {
    if (!child) return;
    setEditedName(child.name);
    setEditedDateOfBirth(child.dateOfBirth);
    setEditedGrade(child.grade);
    setEditedColor(child.color);
  }, [child]);

  useEffect(() => {
    setLessons((prev) => {
      const manual = prev.filter((lesson) => lesson.id.startsWith("manual-"));
      return [...liveLessons, ...manual];
    });
  }, [liveLessons]);

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
  const totalTimeSpent = lessons.reduce(
    (acc, lesson) => acc + lesson.duration,
    0,
  );
  const totalSessions = lessons.length;

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    type: "confirm-delete",
    title: "",
    message: "",
  });

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setModalVisible(true);
  }, []);

  const handleDeletePress = useCallback(() => {
    showModal({
      type: "confirm-delete",
      title: "Supprimer ce profil ?",
      message: `Le profil de ${child?.name} sera définitivement supprimé. Cette action est irréversible.`,
    });
  }, [child?.name, showModal]);

  const handleDeleteConfirm = useCallback(async () => {
    setModalVisible(false);
    try {
      setIsDeleting(true);
      await deleteChildMutation.mutateAsync(childId);
      router.back();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de supprimer ce profil.";
      showModal({
        type: "error",
        title: "Suppression impossible",
        message,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [childId, deleteChildMutation, router, showModal]);

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {isChildLoading ? "Chargement..." : "Enfant non trouvé"}
          </Text>
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

  const handleSave = async () => {
    if (!editedName.trim() || !editedDateOfBirth || !editedGrade) return;
    try {
      setIsSaving(true);
      setSaveError(null);
      await updateChildMutation.mutateAsync({
        id: childId,
        body: {
          name: editedName.trim(),
          dateOfBirth: editedDateOfBirth,
          grade: editedGrade,
        },
      });
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
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Impossible de sauvegarder.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setEditedDateOfBirth(selectedDate.toISOString());
    }
  };

  const handleCancel = () => {
    setEditedName(child.name);
    setEditedDateOfBirth(child.dateOfBirth);
    setEditedGrade(child.grade);
    setEditedColor(child.color);
    setSaveError(null);
    setIsEditing(false);
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleAssignLessons = (lessonIds: string[]) => {
    const newLessons: Lesson[] = lessonIds.map((id) => ({
      id: `manual-${id}-${Date.now()}`,
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
        return "#10B981";
      case "in-progress":
        return "#F59E0B";
      case "not-started":
        return "#94A3B8";
    }
  };

  const getStatusIcon = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={18} color="#10B981" />;
      case "in-progress":
        return <Clock size={18} color="#F59E0B" />;
      case "not-started":
        return <BookOpen size={18} color="#94A3B8" />;
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
        return <CheckCircle2 size={16} color="white" />;
      case "achievement":
        return <Trophy size={16} color="white" />;
      case "streak":
        return <Zap size={16} color="white" />;
      case "time_spent":
        return <Clock size={16} color="white" />;
    }
  };

  const renderInterestStars = (level: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= level ? childColor : "#E2E8F0"}
            fill={star <= level ? childColor : "transparent"}
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
    lessons.reduce((acc, lesson) => acc + lesson.progress, 0) /
      lessons.length || 0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bouton retour + supprimer */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                borderColor: childColor + "40",
                backgroundColor: childColor + "10",
              },
            ]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color={childColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            disabled={isDeleting}
          >
            <Trash2 size={18} color={THEME.colors.error} />
          </TouchableOpacity>
        </View>

        {/* Carte profil */}
        <View style={[styles.profileCard, { borderColor: childColor + "40" }]}>
          {!isEditing ? (
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  borderColor: childColor + "40",
                  backgroundColor: childColor + "10",
                },
              ]}
              onPress={() => {
                setSaveError(null);
                setIsEditing(true);
              }}
            >
              <Edit size={18} color={childColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isSaving}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: childColor },
                  isSaving && { opacity: 0.6 },
                ]}
                onPress={handleSave}
                disabled={
                  isSaving ||
                  !editedName.trim() ||
                  !editedDateOfBirth ||
                  !editedGrade
                }
              >
                <Save size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.profileHeader}>
            <View
              style={[styles.avatarCircle, { backgroundColor: childColor }]}
            >
              <Text style={styles.avatarInitial}>
                {child.name.charAt(0).toUpperCase()}
              </Text>
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
                {/* Nom */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <User size={14} color="#64748B" />
                    <Text style={styles.inputLabelText}>Nom</Text>
                  </View>
                  <TextInput
                    style={[styles.input, { borderColor: childColor + "50" }]}
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
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      { borderColor: childColor + "50" },
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
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
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.gradeScroll}
                  >
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

            {isEditing && saveError && (
              <View style={styles.saveErrorBox}>
                <Text style={styles.saveErrorText}>{saveError}</Text>
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
              <Text style={styles.sectionTitle}>Série d&apos;étude</Text>
            </View>
          </View>

          <View style={[styles.streakCard, { borderColor: childColor + "40" }]}>
            <View style={styles.streakRow}>
              <View style={styles.streakMain}>
                <Text style={[styles.streakValue, { color: childColor }]}>
                  {currentStreak}
                </Text>
                <Text style={styles.streakLabel}>jours</Text>
              </View>
              <View style={styles.streakRecord}>
                <Text style={[styles.streakRecordValue, { color: childColor }]}>
                  {streakRecord}
                </Text>
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
                      day.isToday && [
                        styles.heatmapBlockToday,
                        { borderColor: childColor },
                      ],
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
                      <View
                        style={[
                          styles.dayActivityDot,
                          { backgroundColor: childColor },
                        ]}
                      />
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
            <View
              style={[
                styles.scheduleIcon,
                { backgroundColor: childColor + "15" },
              ]}
            >
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
          <View style={styles.sectionTitleContainer}>
            <Zap size={18} color={childColor} />
            <Text style={styles.sectionTitle}>Activité récente</Text>
          </View>
          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: activity.color },
                ]}
              >
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
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
              <Text style={[styles.addButtonText, { color: childColor }]}>
                Assigner
              </Text>
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
                  <View
                    style={[
                      styles.lessonStatus,
                      { backgroundColor: getStatusColor(lesson.status) + "15" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.lessonStatusText,
                        { color: getStatusColor(lesson.status) },
                      ]}
                    >
                      {getStatusText(lesson.status)}
                    </Text>
                  </View>
                  {lesson.details && (
                    <ChevronDown
                      size={16}
                      color="#94A3B8"
                      style={{
                        transform: [
                          {
                            rotate:
                              expandedLesson === lesson.id ? "180deg" : "0deg",
                          },
                        ],
                      }}
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
                        {
                          width: `${lesson.progress}%`,
                          backgroundColor: childColor,
                        },
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
                      <View
                        style={[
                          styles.metric,
                          { backgroundColor: childColor + "10" },
                        ]}
                      >
                        <Text
                          style={[styles.metricValue, { color: childColor }]}
                        >
                          {lesson.details.performance.accuracy}%
                        </Text>
                        <Text style={styles.metricLabel}>Précision</Text>
                      </View>
                      <View
                        style={[
                          styles.metric,
                          { backgroundColor: childColor + "10" },
                        ]}
                      >
                        <Text
                          style={[styles.metricValue, { color: childColor }]}
                        >
                          {lesson.details.performance.timeSpent}m
                        </Text>
                        <Text style={styles.metricLabel}>Temps</Text>
                      </View>
                      <View
                        style={[
                          styles.metric,
                          { backgroundColor: childColor + "10" },
                        ]}
                      >
                        <Text
                          style={[styles.metricValue, { color: childColor }]}
                        >
                          {lesson.details.performance.attempts}
                        </Text>
                        <Text style={styles.metricLabel}>Tentatives</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.strengthWeaknessRow}>
                    <View style={styles.strengthSection}>
                      <Text style={styles.strengthTitle}>Points forts</Text>
                      {lesson.details.performance.strengths.map((s, idx) => (
                        <View key={idx} style={styles.strengthItem}>
                          <View
                            style={[styles.dot, { backgroundColor: "#10B981" }]}
                          />
                          <Text style={styles.strengthText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.weaknessSection}>
                      <Text style={styles.weaknessTitle}>À améliorer</Text>
                      {lesson.details.performance.weaknesses.map((w, idx) => (
                        <View key={idx} style={styles.weaknessItem}>
                          <View
                            style={[styles.dot, { backgroundColor: "#EF4444" }]}
                          />
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
          <View style={styles.sectionTitleContainer}>
            <Trophy size={18} color={childColor} />
            <Text style={styles.sectionTitle}>Succès récents</Text>
          </View>
          <View style={styles.achievementsRow}>
            <View
              style={[
                styles.achievement,
                {
                  borderColor: childColor + "30",
                  backgroundColor: childColor + "08",
                },
              ]}
            >
              <Award size={24} color={childColor} />
              <Text style={styles.achievementText}>Maître des Maths</Text>
            </View>
            <View
              style={[
                styles.achievement,
                {
                  borderColor: childColor + "30",
                  backgroundColor: childColor + "08",
                },
              ]}
            >
              <Flame size={24} color={childColor} />
              <Text style={styles.achievementText}>7 jours</Text>
            </View>
            <View
              style={[
                styles.achievement,
                {
                  borderColor: childColor + "30",
                  backgroundColor: childColor + "08",
                },
              ]}
            >
              <BookOpen size={24} color={childColor} />
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
                      <Text style={[styles.modalButton, { color: childColor }]}>
                        Annuler
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Date de naissance</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.modalButton, { color: childColor }]}>
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

      <AssignLessonModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        onAssign={handleAssignLessons}
        assignedLessonIds={assignedLessonIds}
        childWeaknesses={childWeaknesses}
        childStrengths={childStrengths}
        childGrade={child.grade}
      />

      {/* Action modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.actionModalOverlay}>
          <View style={styles.actionModalContent}>
            {/* Icon */}
            <View
              style={[
                styles.actionModalIcon,
                modalConfig.type === "confirm-delete" &&
                  styles.actionModalIconWarn,
                modalConfig.type === "error" && styles.actionModalIconError,
                modalConfig.type === "success" && styles.actionModalIconSuccess,
              ]}
            >
              {modalConfig.type === "confirm-delete" && (
                <AlertTriangle size={28} color="#D97706" />
              )}
              {modalConfig.type === "error" && (
                <XCircle size={28} color={THEME.colors.error} />
              )}
              {modalConfig.type === "success" && (
                <CheckCircle size={28} color={THEME.colors.success} />
              )}
            </View>

            <Text style={styles.actionModalTitle}>{modalConfig.title}</Text>
            <Text style={styles.actionModalMessage}>{modalConfig.message}</Text>

            <View style={styles.actionModalButtons}>
              {modalConfig.type === "confirm-delete" && (
                <>
                  <TouchableOpacity
                    style={styles.actionModalBtnSecondary}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.actionModalBtnSecondaryText}>
                      Annuler
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionModalBtnDanger}
                    onPress={handleDeleteConfirm}
                  >
                    <Trash2 size={15} color="white" />
                    <Text style={styles.actionModalBtnDangerText}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {(modalConfig.type === "error" ||
                modalConfig.type === "success") && (
                <TouchableOpacity
                  style={styles.actionModalBtnSecondary}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.actionModalBtnSecondaryText}>Fermer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.error + "12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.error + "30",
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
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  saveErrorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: THEME.radius.md,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  saveErrorText: {
    fontSize: 13,
    color: THEME.colors.error,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontFamily: FONTS.fredoka,
    fontSize: 34,
    color: "white",
    fontWeight: "600",
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

  // Lesson assign modal (bottom sheet)
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

  // Action modal (centered)
  actionModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    paddingHorizontal: 24,
  },
  actionModalContent: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.xxl,
    padding: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  actionModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: THEME.colors.secondaryLight,
  },
  actionModalIconWarn: {
    backgroundColor: "#FEF3C7",
  },
  actionModalIconError: {
    backgroundColor: "#FEF2F2",
  },
  actionModalIconSuccess: {
    backgroundColor: "#F0FDF4",
  },
  actionModalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: THEME.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  actionModalMessage: {
    fontSize: 14,
    color: THEME.colors.subtext,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  actionModalButtons: {
    width: "100%",
    gap: 10,
  },
  actionModalBtnSecondary: {
    paddingVertical: 13,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.secondaryLight,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  actionModalBtnSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.subtext,
  },
  actionModalBtnDanger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.error,
  },
  actionModalBtnDangerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
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
