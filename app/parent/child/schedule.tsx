import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
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
  location?: string;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  dayNumber: number;
  sessions: Session[];
}

// Mock data - replace with API calls
const mockSessions: Session[] = [
  {
    id: "1",
    tutorName: "Marie Dupont",
    tutorAvatar: "https://via.placeholder.com/100",
    subject: "Maths",
    subjectColor: "#3B82F6",
    time: "14:00",
    duration: 60,
    mode: "online",
  },
  {
    id: "2",
    tutorName: "Marie Dupont",
    tutorAvatar: "https://via.placeholder.com/100",
    subject: "Français",
    subjectColor: "#EF4444",
    time: "16:00",
    duration: 60,
    mode: "inPerson",
    location: "Casablanca",
  },
  {
    id: "3",
    tutorName: "Jean Martin",
    tutorAvatar: "https://via.placeholder.com/100",
    subject: "Sciences",
    subjectColor: "#10B981",
    time: "10:00",
    duration: 60,
    mode: "online",
  },
];

const getDayName = (date: Date): string => {
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

const getWeekDates = (currentDate: Date): DaySchedule[] => {
  const week: DaySchedule[] = [];
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    // Mock: assign sessions to specific days
    let sessions: Session[] = [];
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 1) {
      // Monday
      sessions = [mockSessions[0]];
    } else if (dayOfWeek === 3) {
      // Wednesday
      sessions = [mockSessions[1], mockSessions[2]];
    } else if (dayOfWeek === 5) {
      // Friday
      sessions = [mockSessions[0]];
    }

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

  const child = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonIcon}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.primary.DEFAULT} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Planning de {child.name}</Text>
          <Text style={styles.headerSubtitle}>
            {totalSessions} séance{totalSessions > 1 ? "s" : ""} cette semaine
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Week Navigation */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.weekNavigation}
        >
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPreviousWeek}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.primary.DEFAULT} />
          </TouchableOpacity>

          <View style={styles.weekInfoContainer}>
            <Text style={styles.weekMonth}>
              {getMonthName(weekDates[0].date)}{" "}
              {weekDates[0].date.getFullYear()}
            </Text>
            <Text style={styles.weekRange}>
              {weekDates[0].dayNumber} - {weekDates[6].dayNumber}{" "}
              {weekDates[0].date.getMonth() !== weekDates[6].date.getMonth() &&
                getMonthName(weekDates[6].date)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={goToNextWeek}
            activeOpacity={0.7}
          >
            <ChevronRight size={24} color={COLORS.primary.DEFAULT} />
          </TouchableOpacity>
        </Animated.View>

        {/* Today Button */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <TouchableOpacity
            style={styles.todayButton}
            onPress={goToToday}
            activeOpacity={0.7}
          >
            <Calendar size={16} color={COLORS.primary.DEFAULT} />
            <Text style={styles.todayButtonText}>Aujourd&apos;hui</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Weekly Calendar */}
        <View style={styles.calendarContainer}>
          {weekDates.map((day, index) => {
            const today = isToday(day.date);
            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(150 + index * 50).duration(400)}
                style={styles.dayContainer}
              >
                {/* Day Header */}
                <View
                  style={[styles.dayHeader, today && styles.dayHeaderToday]}
                >
                  <Text
                    style={[
                      styles.dayNameText,
                      today && styles.dayNameTextToday,
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.dayNumberContainer,
                      today && styles.dayNumberContainerToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        today && styles.dayNumberTextToday,
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                  </View>
                </View>

                {/* Sessions */}
                {day.sessions.length > 0 ? (
                  <View style={styles.sessionsColumn}>
                    {day.sessions.map((session, sessionIndex) => (
                      <TouchableOpacity
                        key={session.id}
                        style={[
                          styles.sessionCard,
                          { borderLeftColor: session.subjectColor },
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.sessionHeader}>
                          <Image
                            source={{ uri: session.tutorAvatar }}
                            style={styles.sessionTutorAvatar}
                          />
                          <View style={styles.sessionInfo}>
                            <Text style={styles.sessionTime}>
                              {session.time}
                            </Text>
                            <Text
                              style={[
                                styles.sessionSubject,
                                { color: session.subjectColor },
                              ]}
                            >
                              {session.subject}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.sessionTutor}>
                          {session.tutorName}
                        </Text>

                        <View style={styles.sessionFooter}>
                          <View style={styles.sessionMeta}>
                            <Clock size={12} color={COLORS.secondary[500]} />
                            <Text style={styles.sessionMetaText}>
                              {session.duration} min
                            </Text>
                          </View>
                          <View style={styles.sessionModeBadge}>
                            {session.mode === "online" ? (
                              <>
                                <Video
                                  size={12}
                                  color={COLORS.primary.DEFAULT}
                                />
                                <Text style={styles.sessionModeText}>
                                  En ligne
                                </Text>
                              </>
                            ) : (
                              <>
                                <MapPin
                                  size={12}
                                  color={COLORS.primary.DEFAULT}
                                />
                                <Text style={styles.sessionModeText}>
                                  {session.location || "Présentiel"}
                                </Text>
                              </>
                            )}
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

        {/* Legend */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.legend}
        >
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Video size={16} color={COLORS.primary.DEFAULT} />
              <Text style={styles.legendText}>En ligne</Text>
            </View>
            <View style={styles.legendItem}>
              <MapPin size={16} color={COLORS.primary.DEFAULT} />
              <Text style={styles.legendText}>Présentiel</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  weekNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.neutral.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  weekInfoContainer: {
    alignItems: "center",
  },
  weekMonth: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  weekRange: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    alignSelf: "center",
  },
  todayButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  dayContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.secondary[50],
  },
  dayHeaderToday: {
    backgroundColor: COLORS.primary[50],
  },
  dayNameText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  dayNameTextToday: {
    color: COLORS.primary.DEFAULT,
  },
  dayNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberContainerToday: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  dayNumberText: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  dayNumberTextToday: {
    color: COLORS.neutral.white,
  },
  sessionsColumn: {
    padding: 16,
    gap: 12,
  },
  sessionCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  sessionTutorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTime: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  sessionSubject: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  sessionTutor: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    marginBottom: 8,
  },
  sessionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionMetaText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[500],
  },
  sessionModeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
  },
  sessionModeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  emptyDay: {
    padding: 24,
    alignItems: "center",
  },
  emptyDayText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[400],
    fontStyle: "italic",
  },
  legend: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  legendTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
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
