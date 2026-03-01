import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  Calendar,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react-native";

import { useMySessions, useMyStudents } from "@/hooks/api/tutors";
import { useAppSelector } from "@/store/hooks";
import { resolveSubjectDisplayName } from "@/utils/sessionDisplay";

const STUDENT_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asDisplayString(value: unknown): string | null {
  if (typeof value === "string") return asNonEmptyString(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function looksLikeStudentIdentifier(value: string, studentId?: string | null) {
  const normalized = value.trim();
  if (!normalized) return true;
  if (studentId && normalized === studentId) return true;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized,
    )
  ) {
    return true;
  }
  if (/^[a-f0-9]{24}$/i.test(normalized)) return true;
  if (/^(child|student|user)[_-]?[0-9a-z-]+$/i.test(normalized)) return true;
  if (normalized.length > 20 && !/\s/.test(normalized)) return true;
  return false;
}

function resolveStudentDisplayName(item: any, studentId: string): string {
  const userFirstName = asNonEmptyString(item?.child?.user?.firstName);
  const userLastName = asNonEmptyString(item?.child?.user?.lastName);
  const composedUserName = [userFirstName ?? "", userLastName ?? ""]
    .join(" ")
    .trim();
  const emailPrefix = asNonEmptyString(item?.child?.user?.email)?.split("@")[0];
  const candidates = [
    asNonEmptyString(composedUserName),
    asNonEmptyString(item?.child?.fullName),
    asNonEmptyString(item?.child?.name),
    asNonEmptyString(item?.childName),
    asNonEmptyString(item?.studentName),
    asNonEmptyString(emailPrefix),
    asNonEmptyString(item?.name),
  ].filter((value): value is string => Boolean(value));

  const valid = candidates.find(
    (candidate) =>
      !looksLikeStudentIdentifier(candidate, studentId) &&
      !candidate.includes("@"),
  );
  return valid ?? "Élève";
}

function resolveStudentGrade(item: any, studentId: string): string {
  const candidates = [
    asDisplayString(item?.child?.grade),
    asDisplayString(item?.child?.level),
    asDisplayString(item?.grade),
    asDisplayString(item?.gradeLevel),
    asDisplayString(item?.classLevel),
    asDisplayString(item?.className),
  ].filter((value): value is string => Boolean(value));

  const valid = candidates.find(
    (candidate) => !looksLikeStudentIdentifier(candidate, studentId),
  );
  return valid ?? "—";
}

function subjectColor(subject: string): string {
  const key = subject.toLowerCase();
  if (key.includes("math")) return "#3B82F6";
  if (key.includes("fr")) return "#EF4444";
  if (key.includes("science")) return "#10B981";
  if (key.includes("english")) return "#06B6D4";
  return "#6366F1";
}

type Session = {
  id: string;
  studentId: string;
  student: string;
  time: string;
  duration: string;
  subject: string;
  color: string;
  date: Date;
};

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function TutorDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || "Tuteur";
  const { data: myStudentsData = [] } = useMyStudents();
  const { data: mySessionsData = [] } = useMySessions();

  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const students = useMemo(
    () =>
      (Array.isArray(myStudentsData) ? myStudentsData : []).map(
        (item: any, index: number) => {
          const childId =
            asNonEmptyString(item?.child?.id) ??
            asNonEmptyString(item?.childId) ??
            `student-${index}`;
          const subject = resolveSubjectDisplayName(item, "Matière");
          return {
            id: childId,
            name: resolveStudentDisplayName(item, childId),
            grade: resolveStudentGrade(item, childId),
            subject,
            subjectColor: subjectColor(subject),
            image:
              item?.child?.avatar ??
              STUDENT_IMAGES[index % STUDENT_IMAGES.length],
          };
        },
      ),
    [myStudentsData],
  );

  const sessions = useMemo(() => {
    return (Array.isArray(mySessionsData) ? mySessionsData : [])
      .map((session: any) => {
        const start = new Date(session?.startTime ?? Date.now());
        const end = new Date(session?.endTime ?? Date.now());
        const durationMinutes = Math.max(
          30,
          Math.round((end.getTime() - start.getTime()) / 60000),
        );
        const studentId =
          asNonEmptyString(session?.child?.id) ??
          asNonEmptyString(session?.childId) ??
          "";
        const studentName =
          students.find((s) => s.id === studentId)?.name ??
          resolveStudentDisplayName(session, studentId);
        const subject = resolveSubjectDisplayName(session, "Cours");
        return {
          id: asNonEmptyString(session?.id) ?? `session-${Math.random()}`,
          studentId,
          student: studentName,
          time: `${String(start.getHours()).padStart(2, "0")}:${String(
            start.getMinutes(),
          ).padStart(2, "0")}`,
          duration: `${durationMinutes}min`,
          subject,
          color: subjectColor(subject),
          date: start,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [mySessionsData, students]);

  const todaySessionsCount = useMemo(() => {
    const today = new Date();
    return sessions.filter((s) => {
      return (
        s.date.getFullYear() === today.getFullYear() &&
        s.date.getMonth() === today.getMonth() &&
        s.date.getDate() === today.getDate()
      );
    }).length;
  }, [sessions]);

  const weekSessions = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return sessions.filter((s) => s.date >= monday && s.date <= sunday);
  }, [sessions]);

  const monthSessions = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return sessions.filter((s) => s.date >= firstDay && s.date <= lastDay);
  }, [sessions]);

  const displaySessions = viewMode === "week" ? weekSessions : monthSessions;

  const getSessionsForDay = useCallback(
    (dayIndex: number): Session[] => {
      const targetDate = new Date();
      const currentDay = targetDate.getDay();
      const diff = dayIndex - ((currentDay + 6) % 7);
      targetDate.setDate(targetDate.getDate() + diff);
      targetDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      return displaySessions.filter(
        (s) => s.date >= targetDate && s.date < nextDate,
      );
    },
    [displaySessions],
  );

  const getWeekDates = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>MON ESPACE</Text>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerGreeting}>Bonjour, </Text>
              <Text style={styles.headerName}>{userName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
              <Calendar size={20} color="#6366F1" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                {viewMode === "week"
                  ? weekSessions.length
                  : monthSessions.length}
              </Text>
              <Text style={styles.statLabel}>
                {viewMode === "week" ? "Cette semaine" : "Ce mois"}
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#F0FDF4" }]}>
              <Clock size={20} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{todaySessionsCount}</Text>
              <Text style={styles.statLabel}>Aujourd{"'"}hui</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Users size={20} color="#F59E0B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{students.length}</Text>
              <Text style={styles.statLabel}>Élèves</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mon Planning</Text>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[
                  styles.viewToggleBtn,
                  viewMode === "week" && styles.viewToggleBtnActive,
                ]}
                onPress={() => setViewMode("week")}
              >
                <Text
                  style={[
                    styles.viewToggleText,
                    viewMode === "week" && styles.viewToggleTextActive,
                  ]}
                >
                  Semaine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewToggleBtn,
                  viewMode === "month" && styles.viewToggleBtnActive,
                ]}
                onPress={() => setViewMode("month")}
              >
                <Text
                  style={[
                    styles.viewToggleText,
                    viewMode === "month" && styles.viewToggleTextActive,
                  ]}
                >
                  Mois
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {viewMode === "week" && (
            <View style={styles.weekGrid}>
              {DAYS_OF_WEEK.map((day, index) => {
                const date = weekDates[index];
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth();
                const daySessions = getSessionsForDay(index);
                const hasSessions = daySessions.length > 0;

                return (
                  <View
                    key={day}
                    style={[styles.dayColumn, isToday && styles.dayColumnToday]}
                  >
                    <Text
                      style={[styles.dayLabel, isToday && styles.dayLabelToday]}
                    >
                      {day}
                    </Text>
                    <Text
                      style={[styles.dayDate, isToday && styles.dayDateToday]}
                    >
                      {date.getDate()}
                    </Text>
                    {hasSessions && (
                      <View style={styles.sessionDots}>
                        {daySessions.slice(0, 3).map((s, i) => (
                          <View
                            key={i}
                            style={[
                              styles.sessionDot,
                              { backgroundColor: s.color },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {displaySessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#E2E8F0" />
              <Text style={styles.emptyTitle}>Aucune session prévue</Text>
              <Text style={styles.emptySubtitle}>
                Vos sessions apparaissent ici une fois planifiées
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {displaySessions.slice(0, 8).map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.sessionCard,
                    { borderLeftColor: session.color },
                  ]}
                >
                  <View style={styles.sessionTime}>
                    <Text style={styles.sessionTimeText}>{session.time}</Text>
                    <Text style={styles.sessionDuration}>
                      {session.duration}
                    </Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionStudent}>{session.student}</Text>
                    <View
                      style={[
                        styles.sessionSubjectBadge,
                        { backgroundColor: session.color + "15" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sessionSubjectText,
                          { color: session.color },
                        ]}
                      >
                        {session.subject}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.sessionAvatar}>
                    <Image
                      source={{
                        uri:
                          students.find((s) => s.id === session.studentId)
                            ?.image ?? STUDENT_IMAGES[0],
                      }}
                      style={styles.avatarImg}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Élèves</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.studentsScroll}
          >
            {students.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <Image
                  source={{ uri: student.image }}
                  style={styles.studentAvatar}
                />
                <Text style={styles.studentName} numberOfLines={1}>
                  {student.name}
                </Text>
                <Text style={styles.studentGrade}>{student.grade}</Text>
                <View
                  style={[
                    styles.studentSubjectBadge,
                    { backgroundColor: student.subjectColor + "15" },
                  ]}
                >
                  <Text
                    style={[
                      styles.studentSubjectText,
                      { color: student.subjectColor },
                    ]}
                  >
                    {student.subject}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push("/resources")}
          >
            <View
              style={[styles.quickActionIcon, { backgroundColor: "#8B5CF6" }]}
            >
              <BookOpen size={22} color="white" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Ressources</Text>
              <Text style={styles.quickActionSub}>Gérer mes fichiers</Text>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push("/tutor/profile/availability")}
          >
            <View
              style={[styles.quickActionIcon, { backgroundColor: "#F59E0B" }]}
            >
              <Users size={22} color="white" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Élèves</Text>
              <Text style={styles.quickActionSub}>Voir mes élèves</Text>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {},
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  headerGreeting: { fontSize: 26, fontWeight: "300", color: "#64748B" },
  headerName: { fontSize: 26, fontWeight: "800", color: "#1E293B" },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statContent: {},
  statValue: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  statLabel: { fontSize: 10, color: "#64748B" },

  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 4,
  },
  viewToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewToggleBtnActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  viewToggleTextActive: {
    color: "#1E293B",
  },

  weekGrid: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  dayColumnToday: {
    backgroundColor: "#EEF2FF",
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  dayLabelToday: {
    color: "#6366F1",
  },
  dayDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  dayDateToday: {
    color: "#6366F1",
  },
  sessionDots: {
    flexDirection: "row",
    gap: 3,
    marginTop: 6,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  sessionsList: {
    gap: 10,
  },
  sessionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sessionTime: {
    marginRight: 14,
    alignItems: "center",
  },
  sessionTimeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  sessionDuration: {
    fontSize: 11,
    color: "#64748B",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionStudent: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  sessionSubjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  sessionSubjectText: {
    fontSize: 11,
    fontWeight: "600",
  },
  sessionAvatar: {
    marginLeft: 10,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  emptyState: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },

  studentsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginRight: 12,
    width: 110,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  studentGrade: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  studentSubjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  studentSubjectText: {
    fontSize: 10,
    fontWeight: "600",
  },

  quickActions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  quickActionSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
