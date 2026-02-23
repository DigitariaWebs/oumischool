import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Video,
  Clock,
  MapPin,
  CalendarDays,
  X,
  Users,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FONTS } from "@/config/fonts";
import { useChild } from "@/hooks/api/parent";
import { useSessions } from "@/hooks/api/sessions";
import { useAppSelector } from "@/store/hooks";

interface Session {
  id: string;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  subjectColor: string;
  time: string;
  duration: number;
  mode: "online" | "inPerson";
  startAt: Date;
  location?: string;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  dayNumber: number;
  sessions: Session[];
}

// Images pour les tuteurs
const tutorImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

function avatarFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return tutorImages[sum % tutorImages.length];
}

function colorForSubject(subject: string): string {
  const key = subject.toLowerCase();
  if (key.includes("math")) return "#3B82F6";
  if (key.includes("fr")) return "#EF4444";
  if (key.includes("science")) return "#10B981";
  if (key.includes("english")) return "#6366F1";
  return "#6366F1";
}

const getDayName = (date: Date): string => {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  return days[date.getDay()];
};

const getFullDayName = (date: Date): string => {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return days[date.getDay()];
};

const getMonthName = (date: Date): string => {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return months[date.getMonth()];
};

const isSameDate = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getWeekDates = (
  currentDate: Date,
  allSessions: Session[],
): DaySchedule[] => {
  const week: DaySchedule[] = [];
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const sessions = allSessions.filter((session) =>
      isSameDate(session.startAt, date),
    );

    week.push({
      date,
      dayName: getDayName(date),
      dayNumber: date.getDate(),
      sessions,
    });
  }
  return week;
};

export default function ChildScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.id as string;
  const { data: sessionsData = [] } = useSessions();
  const { data: apiChild, isLoading: isChildLoading } = useChild(childId);

  const localChild = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );
  const child = localChild
    ? localChild
    : apiChild
      ? {
          id: apiChild.id,
          name: apiChild.name,
          dateOfBirth:
            apiChild.dateOfBirth ?? new Date().toISOString().split("T")[0],
          grade: apiChild.grade,
          color: "#6366F1",
        }
      : undefined;

  const childColor = child?.color || "#6366F1";

  const liveSessions: Session[] = useMemo(
    () =>
      sessionsData
        .filter((session) => !childId || session.childId === childId)
        .map((session) => {
          const start = new Date(session.startTime);
          const end = new Date(session.endTime);
          const duration = Math.max(
            30,
            Math.round((end.getTime() - start.getTime()) / 60000),
          );
          return {
            id: session.id,
            tutorName: `Tuteur ${session.tutorId.slice(0, 6)}`,
            tutorAvatar: avatarFor(session.tutorId),
            subject: session.subjectId ?? "Cours",
            subjectColor: colorForSubject(session.subjectId ?? "general"),
            time: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
            duration,
            mode: session.mode === "presential" ? "inPerson" : "online",
            startAt: start,
          };
        }),
    [childId, sessionsData],
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);

  const weekDates = useMemo(
    () => getWeekDates(currentDate, liveSessions),
    [currentDate, liveSessions],
  );

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const totalSessions = weekDates.reduce(
    (acc, day) => acc + day.sessions.length,
    0,
  );
  const totalTutors = useMemo(
    () =>
      new Set(weekDates.flatMap((day) => day.sessions.map((s) => s.tutorName)))
        .size,
    [weekDates],
  );
  const monthDates = useMemo((): DaySchedule[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: DaySchedule[] = [];

    const startDay = firstDay.getDay();
    const startOffset = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < startOffset; i++) {
      const date = new Date(year, month, 1 - (startOffset - i));
      dates.push({
        date,
        dayName: getDayName(date),
        dayNumber: date.getDate(),
        sessions: [],
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const sessions = liveSessions.filter((session) => {
        return isSameDate(session.startAt, date);
      });
      dates.push({
        date,
        dayName: getDayName(date),
        dayNumber: date.getDate(),
        sessions,
      });
    }

    return dates;
  }, [currentDate, liveSessions]);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Planning</Text>
          <Text style={styles.headerSubtitle}>{child.name}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            { backgroundColor: childColor + "15" },
          ]}
          onPress={() => setViewMode(viewMode === "week" ? "month" : "week")}
        >
          {viewMode === "week" ? (
            <CalendarDays size={18} color={childColor} />
          ) : (
            <Calendar size={18} color={childColor} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={viewMode === "week" ? goToPreviousWeek : goToPreviousMonth}
          >
            <ChevronLeft size={18} color={childColor} />
          </TouchableOpacity>

          <View style={styles.navInfo}>
            <Text style={styles.navMonth}>
              {viewMode === "week"
                ? `${getMonthName(weekDates[0].date)} ${weekDates[0].date.getFullYear()}`
                : `${getMonthName(currentDate)} ${currentDate.getFullYear()}`}
            </Text>
            {viewMode === "week" && (
              <Text style={styles.navRange}>
                {weekDates[0].dayNumber} - {weekDates[6].dayNumber}
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
            <Text style={[styles.todayButtonText, { color: childColor }]}>
              Aujourd&apos;hui
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={viewMode === "week" ? goToNextWeek : goToNextMonth}
          >
            <ChevronRight size={18} color={childColor} />
          </TouchableOpacity>
        </View>

        {/* Carte résumé */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Users size={16} color="#64748B" />
              <Text style={styles.summaryValue}>{totalSessions}</Text>
              <Text style={styles.summaryLabel}>Sessions</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.summaryValue}>{totalTutors}</Text>
              <Text style={styles.summaryLabel}>Tuteurs</Text>
            </View>
          </View>
        </View>

        {viewMode === "week" ? (
          // Vue semaine
          <View style={styles.weekContainer}>
            {weekDates.map((day, index) => {
              const today = isToday(day.date);
              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(100 + index * 50).duration(400)}
                  style={[styles.dayCard, today && styles.dayCardToday]}
                >
                  <View style={styles.dayHeader}>
                    <Text
                      style={[styles.dayName, today && { color: childColor }]}
                    >
                      {day.dayName}
                    </Text>
                    <View
                      style={[
                        styles.dayNumber,
                        today && { backgroundColor: childColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumberText,
                          today && { color: "white" },
                        ]}
                      >
                        {day.dayNumber}
                      </Text>
                    </View>
                  </View>

                  {day.sessions.length > 0 ? (
                    <View style={styles.sessionsList}>
                      {day.sessions.map((session) => (
                        <TouchableOpacity
                          key={session.id}
                          style={styles.sessionCard}
                          onPress={() => setSelectedDay(day)}
                        >
                          <View style={styles.sessionHeader}>
                            <View
                              style={[
                                styles.sessionTime,
                                {
                                  backgroundColor: session.subjectColor + "15",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.sessionTimeText,
                                  { color: session.subjectColor },
                                ]}
                              >
                                {session.time}
                              </Text>
                            </View>
                            <View style={styles.sessionMode}>
                              {session.mode === "online" ? (
                                <Video size={12} color={childColor} />
                              ) : (
                                <MapPin size={12} color={childColor} />
                              )}
                            </View>
                          </View>

                          <View style={styles.sessionContent}>
                            <Text style={styles.sessionSubject}>
                              {session.subject}
                            </Text>
                            <View style={styles.sessionTutor}>
                              <Image
                                source={{ uri: session.tutorAvatar }}
                                style={styles.tutorAvatar}
                              />
                              <Text style={styles.tutorName}>
                                {session.tutorName}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyDay}>
                      <Text style={styles.emptyDayText}>Aucune séance</Text>
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        ) : (
          // Vue mois
          <View style={styles.monthContainer}>
            <View style={styles.weekdays}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                (day, idx) => (
                  <Text key={idx} style={styles.weekdayText}>
                    {day}
                  </Text>
                ),
              )}
            </View>

            <View style={styles.monthGrid}>
              {monthDates.map((day, index) => {
                const today = isToday(day.date);
                const isCurrentMonth =
                  day.date.getMonth() === currentDate.getMonth();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthDay,
                      !isCurrentMonth && styles.monthDayOther,
                      today && styles.monthDayToday,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text
                      style={[
                        styles.monthDayNumber,
                        !isCurrentMonth && styles.monthDayNumberOther,
                        today && { color: childColor, fontWeight: "700" },
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                    {day.sessions.length > 0 && (
                      <View style={styles.monthDayDots}>
                        {day.sessions.map((session, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.monthDayDot,
                              { backgroundColor: session.subjectColor },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Légende */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Video size={14} color="#6366F1" />
              <Text style={styles.legendText}>En ligne</Text>
            </View>
            <View style={styles.legendItem}>
              <MapPin size={14} color="#6366F1" />
              <Text style={styles.legendText}>Présentiel</Text>
            </View>
          </View>
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Demander une session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal détails du jour */}
      <Modal visible={selectedDay !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalDate}>
                  {selectedDay && getFullDayName(selectedDay.date)}{" "}
                  {selectedDay?.dayNumber}
                </Text>
                <Text style={styles.modalMonth}>
                  {selectedDay && getMonthName(selectedDay.date)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setSelectedDay(null)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDay && selectedDay.sessions.length > 0 ? (
              <ScrollView style={styles.modalSessions}>
                {selectedDay.sessions.map((session) => (
                  <View key={session.id} style={styles.modalSessionCard}>
                    <View style={styles.modalSessionHeader}>
                      <View
                        style={[
                          styles.modalSessionTime,
                          { backgroundColor: session.subjectColor + "15" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalSessionTimeText,
                            { color: session.subjectColor },
                          ]}
                        >
                          {session.time}
                        </Text>
                      </View>
                      <View style={styles.modalSessionMode}>
                        {session.mode === "online" ? (
                          <>
                            <Video size={12} color="#6366F1" />
                            <Text style={styles.modalSessionModeText}>
                              En ligne
                            </Text>
                          </>
                        ) : (
                          <>
                            <MapPin size={12} color="#6366F1" />
                            <Text style={styles.modalSessionModeText}>
                              {session.location}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View style={styles.modalSessionBody}>
                      <Text style={styles.modalSessionSubject}>
                        {session.subject}
                      </Text>
                      <View style={styles.modalSessionTutor}>
                        <Image
                          source={{ uri: session.tutorAvatar }}
                          style={styles.modalTutorAvatar}
                        />
                        <View>
                          <Text style={styles.modalTutorName}>
                            {session.tutorName}
                          </Text>
                          <Text style={styles.modalTutorDuration}>
                            {session.duration} minutes
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.modalEmpty}>
                <Calendar size={40} color="#CBD5E1" />
                <Text style={styles.modalEmptyText}>Aucune séance prévue</Text>
              </View>
            )}
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
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Navigation
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  navInfo: {
    alignItems: "center",
  },
  navMonth: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#1E293B",
  },
  navRange: {
    fontSize: 12,
    color: "#64748B",
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: "#1E293B",
    marginTop: 6,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
  },

  // Week View
  weekContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  dayCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dayCardToday: {
    borderColor: "#6366F1",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayName: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#1E293B",
  },
  dayNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberText: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  sessionsList: {
    gap: 10,
  },
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionTime: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sessionTimeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sessionMode: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  sessionContent: {
    gap: 4,
  },
  sessionSubject: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  sessionTutor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tutorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  tutorName: {
    fontSize: 12,
    color: "#64748B",
  },
  emptyDay: {
    paddingVertical: 12,
    alignItems: "center",
  },
  emptyDayText: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },

  // Month View
  monthContainer: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  weekdays: {
    flexDirection: "row",
    marginBottom: 12,
  },
  weekdayText: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthDay: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  monthDayOther: {
    opacity: 0.3,
  },
  monthDayToday: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  monthDayNumber: {
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 2,
  },
  monthDayNumberOther: {
    color: "#94A3B8",
  },
  monthDayDots: {
    flexDirection: "row",
    gap: 2,
  },
  monthDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Legend
  legend: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  legendTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: "row",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#64748B",
  },

  // Source Button
  sourceButton: {
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 16,
  },
  modalDate: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 2,
  },
  modalMonth: {
    fontSize: 14,
    color: "#64748B",
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  modalSessions: {
    gap: 12,
  },
  modalSessionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  modalSessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalSessionTime: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalSessionTimeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalSessionMode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modalSessionModeText: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "600",
  },
  modalSessionBody: {
    gap: 8,
  },
  modalSessionSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  modalSessionTutor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTutorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  modalTutorName: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
    marginBottom: 2,
  },
  modalTutorDuration: {
    fontSize: 11,
    color: "#64748B",
  },
  modalEmpty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 16,
  },
  modalEmptyText: {
    fontSize: 15,
    color: "#94A3B8",
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
