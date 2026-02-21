import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Video,
  MapPin,
  TrendingUp,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface Session {
  id: number;
  studentName: string;
  studentAvatar: string;
  subject: string;
  subjectColor: string;
  time: string;
  duration: number;
  mode: "online" | "inPerson";
  location?: string;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  dayNumber: number;
  sessions: Session[];
}

const mockSessions: Session[] = [
  {
    id: 1,
    studentName: "Adam B.",
    studentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    time: "14:00",
    duration: 60,
    mode: "online",
  },
  {
    id: 2,
    studentName: "Sofia M.",
    studentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
    subject: "Français",
    subjectColor: "#EF4444",
    time: "10:00",
    duration: 45,
    mode: "online",
  },
  {
    id: 3,
    studentName: "Youssef K.",
    studentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
    subject: "Sciences",
    subjectColor: "#10B981",
    time: "16:00",
    duration: 60,
    mode: "inPerson",
    location: "Casablanca",
  },
  {
    id: 4,
    studentName: "Lina A.",
    studentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    time: "09:00",
    duration: 90,
    mode: "online",
  },
];

const getDayName = (date: Date): string => {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
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

const getWeekDates = (baseDate: Date): DaySchedule[] => {
  const week: DaySchedule[] = [];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    let sessions: Session[] = [];
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 1) sessions = [mockSessions[0], mockSessions[1]];
    else if (dayOfWeek === 3) sessions = [mockSessions[2]];
    else if (dayOfWeek === 5) sessions = [mockSessions[3]];
    week.push({
      date,
      dayName: getDayName(date),
      dayNumber: date.getDate(),
      sessions,
    });
  }
  return week;
};

export default function TutorSessionsScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<DaySchedule[]>(
    getWeekDates(new Date()),
  );

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setWeekDates(getWeekDates(newDate));
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setWeekDates(getWeekDates(newDate));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setWeekDates(getWeekDates(today));
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header simple */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>PLANNING</Text>
          <Text style={styles.headerTitle}>Mes sessions</Text>
        </View>

        {/* Carte statistiques */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {weekDates[0].date.getDate()}
              </Text>
              <Text style={styles.statLabel}>Au {weekDates[6].date.getDate()}</Text>
            </View>
          </View>
        </View>

        {/* Navigation semaine */}
        <View style={styles.weekNav}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
            <ChevronLeft size={20} color="#6366F1" />
          </TouchableOpacity>

          <View style={styles.weekInfo}>
            <Text style={styles.weekMonth}>
              {getMonthName(weekDates[0].date)} {weekDates[0].date.getFullYear()}
            </Text>
            <Text style={styles.weekRange}>
              {weekDates[0].dayNumber} - {weekDates[6].dayNumber}
            </Text>
          </View>

          <TouchableOpacity style={styles.navButton} onPress={goToNextWeek}>
            <ChevronRight size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Calendar size={14} color="#6366F1" />
          <Text style={styles.todayButtonText}>Aujourd'hui</Text>
        </TouchableOpacity>

        {/* Liste des jours */}
        <View style={styles.daysList}>
          {weekDates.map((day, index) => {
            const today = isToday(day.date);
            return (
              <View key={index} style={[styles.dayCard, today && styles.dayCardToday]}>
                <View style={styles.dayHeader}>
                  <Text style={[styles.dayName, today && styles.dayTextToday]}>
                    {day.dayName}
                  </Text>
                  <View style={[styles.dayNumber, today && styles.dayNumberToday]}>
                    <Text style={[styles.dayNumberText, today && { color: "white" }]}>
                      {day.dayNumber}
                    </Text>
                  </View>
                </View>

                {day.sessions.length > 0 ? (
                  <View style={styles.sessionsList}>
                    {day.sessions.map((session) => (
                      <Pressable
                        key={session.id}
                        style={({ pressed }) => [
                          styles.sessionCard,
                          { borderLeftColor: session.subjectColor },
                          pressed && { opacity: 0.9 },
                        ]}
                      >
                        <View style={styles.sessionRow}>
                          <Image source={{ uri: session.studentAvatar }} style={styles.sessionAvatar} />
                          <View style={styles.sessionContent}>
                            <View style={styles.sessionHeader}>
                              <Text style={[styles.sessionSubject, { color: session.subjectColor }]}>
                                {session.subject}
                              </Text>
                              <Text style={styles.sessionTime}>{session.time}</Text>
                            </View>
                            <Text style={styles.sessionStudent}>{session.studentName}</Text>
                            <View style={styles.sessionFooter}>
                              <View style={styles.sessionDuration}>
                                <Clock size={10} color="#64748B" />
                                <Text style={styles.sessionDurationText}>
                                  {session.duration}min
                                </Text>
                              </View>
                              <View style={styles.sessionMode}>
                                {session.mode === "online" ? (
                                  <>
                                    <Video size={10} color="#6366F1" />
                                    <Text style={styles.sessionModeText}>En ligne</Text>
                                  </>
                                ) : (
                                  <>
                                    <MapPin size={10} color="#6366F1" />
                                    <Text style={styles.sessionModeText}>
                                      {session.location}
                                    </Text>
                                  </>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyDay}>
                    <Text style={styles.emptyDayText}>Aucune séance</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

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
          <Text style={styles.sourceButtonText}>+ Planifier une session</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
  },

  // Week Navigation
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  weekInfo: {
    alignItems: "center",
  },
  weekMonth: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  weekRange: {
    fontSize: 12,
    color: "#64748B",
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    marginHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  todayButtonText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Days List
  daysList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  dayCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  dayCardToday: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dayName: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#1E293B",
  },
  dayTextToday: {
    color: "#6366F1",
  },
  dayNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberToday: {
    backgroundColor: "#6366F1",
  },
  dayNumberText: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },

  // Sessions
  sessionsList: {
    padding: 12,
    gap: 10,
  },
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sessionRow: {
    flexDirection: "row",
    gap: 12,
  },
  sessionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  sessionSubject: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
  },
  sessionTime: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  sessionStudent: {
    fontSize: 13,
    color: "#1E293B",
    marginBottom: 6,
  },
  sessionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionDurationText: {
    fontSize: 11,
    color: "#64748B",
  },
  sessionMode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionModeText: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "600",
  },
  emptyDay: {
    padding: 16,
    alignItems: "center",
  },
  emptyDayText: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },

  // Legend
  legend: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
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
    marginHorizontal: 24,
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
});