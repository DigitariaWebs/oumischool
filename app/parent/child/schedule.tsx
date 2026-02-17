import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
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
  User2,
  X,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/hooks/use-theme";

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
  const { isDark } = useTheme();

  const child = useAppSelector((state) =>
    state.children.children.find((c) => c.id === childId),
  );

  const childColor = child?.color || COLORS.primary.DEFAULT;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<DaySchedule[]>(
    getWeekDates(new Date()),
  );
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);

  const styles = useMemo(
    () => createStyles(isDark, childColor),
    [isDark, childColor],
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

  // Generate month calendar
  const getMonthDates = (): DaySchedule[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: DaySchedule[] = [];

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();
    const startOffset = startDay === 0 ? 6 : startDay - 1; // Convert to Monday start

    // Add empty slots for days before month starts
    for (let i = 0; i < startOffset; i++) {
      const date = new Date(year, month, 1 - (startOffset - i));
      dates.push({
        date,
        dayName: getDayName(date),
        dayNumber: date.getDate(),
        sessions: [],
      });
    }

    // Add all days in month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      let sessions: Session[] = [];
      const dayOfWeek = date.getDay();

      // Mock: assign sessions to specific days
      if (dayOfWeek === 1) {
        sessions = [mockSessions[0]];
      } else if (dayOfWeek === 3) {
        sessions = [mockSessions[1], mockSessions[2]];
      } else if (dayOfWeek === 5) {
        sessions = [mockSessions[0]];
      }

      dates.push({
        date,
        dayName: getDayName(date),
        dayNumber: date.getDate(),
        sessions,
      });
    }

    return dates;
  };

  const monthDates = useMemo(() => getMonthDates(), [currentDate]);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonIcon}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={childColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Planning de {child.name}</Text>
          <Text style={styles.headerSubtitle}>
            {viewMode === "week"
              ? `${totalSessions} séance${totalSessions > 1 ? "s" : ""} cette semaine`
              : getMonthName(currentDate)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === "week" ? "month" : "week")}
        >
          {viewMode === "week" ? (
            <CalendarDays size={20} color={childColor} />
          ) : (
            <Calendar size={20} color={childColor} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {viewMode === "week" ? (
          <>
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
                <ChevronLeft size={20} color={childColor} />
              </TouchableOpacity>

              <View style={styles.weekInfoContainer}>
                <Text style={styles.weekMonth}>
                  {getMonthName(weekDates[0].date)}{" "}
                  {weekDates[0].date.getFullYear()}
                </Text>
                <Text style={styles.weekRange}>
                  {weekDates[0].dayNumber} - {weekDates[6].dayNumber}{" "}
                  {weekDates[0].date.getMonth() !==
                    weekDates[6].date.getMonth() &&
                    getMonthName(weekDates[6].date)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.todayButtonSmall}
                onPress={goToToday}
                activeOpacity={0.7}
              >
                <Text style={styles.todayButtonSmallText}>Aujourd'hui</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={goToNextWeek}
                activeOpacity={0.7}
              >
                <ChevronRight size={20} color={childColor} />
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
                            style={styles.sessionCard}
                            activeOpacity={0.7}
                          >
                            <View style={styles.sessionHeader}>
                              <View
                                style={[
                                  styles.sessionTimeBlock,
                                  {
                                    backgroundColor:
                                      session.subjectColor + "20",
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.sessionTime,
                                    { color: session.subjectColor },
                                  ]}
                                >
                                  {session.time}
                                </Text>
                              </View>

                              <View style={styles.sessionInfo}>
                                <View style={styles.sessionTitleRow}>
                                  <Text style={styles.sessionSubject}>
                                    {session.subject}
                                  </Text>
                                  <View
                                    style={[
                                      styles.sessionModeBadge,
                                      { backgroundColor: childColor + "15" },
                                    ]}
                                  >
                                    {session.mode === "online" ? (
                                      <Video size={14} color={childColor} />
                                    ) : (
                                      <MapPin size={14} color={childColor} />
                                    )}
                                  </View>
                                </View>

                                <View style={styles.sessionMetaRow}>
                                  <View style={styles.sessionTutorInfo}>
                                    <Image
                                      source={{ uri: session.tutorAvatar }}
                                      style={styles.sessionTutorAvatar}
                                    />
                                    <Text style={styles.sessionTutor}>
                                      {session.tutorName}
                                    </Text>
                                  </View>
                                  <View style={styles.sessionDuration}>
                                    <Clock
                                      size={12}
                                      color={
                                        isDark
                                          ? COLORS.neutral[500]
                                          : COLORS.secondary[400]
                                      }
                                    />
                                    <Text style={styles.sessionDurationText}>
                                      {session.duration}min
                                    </Text>
                                  </View>
                                </View>
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
          </>
        ) : (
          <>
            {/* Month Navigation */}
            <Animated.View
              entering={FadeInDown.duration(400)}
              style={styles.monthNavigation}
            >
              <TouchableOpacity
                style={styles.navButton}
                onPress={goToPreviousMonth}
                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color={childColor} />
              </TouchableOpacity>

              <View style={styles.monthInfoContainer}>
                <Text style={styles.monthTitle}>
                  {getMonthName(currentDate)} {currentDate.getFullYear()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.todayButtonSmall}
                onPress={goToToday}
                activeOpacity={0.7}
              >
                <Text style={styles.todayButtonSmallText}>Aujourd'hui</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={goToNextMonth}
                activeOpacity={0.7}
              >
                <ChevronRight size={20} color={childColor} />
              </TouchableOpacity>
            </Animated.View>

            {/* Month Calendar */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.monthContainer}
            >
              {/* Weekday Headers */}
              <View style={styles.weekdayHeaders}>
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day, idx) => (
                    <Text key={idx} style={styles.weekdayHeader}>
                      {day}
                    </Text>
                  ),
                )}
              </View>

              {/* Calendar Grid */}
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
                        !isCurrentMonth && styles.monthDayOtherMonth,
                        today && styles.monthDayToday,
                      ]}
                      onPress={() => setSelectedDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.monthDayNumber,
                          !isCurrentMonth && styles.monthDayNumberOther,
                          today && [
                            styles.monthDayNumberToday,
                            { color: childColor },
                          ],
                        ]}
                      >
                        {day.dayNumber}
                      </Text>
                      {day.sessions.length > 0 && (
                        <View style={styles.monthDayDots}>
                          {day.sessions.slice(0, 3).map((session, idx) => (
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
            </Animated.View>
          </>
        )}

        {/* Day Detail Modal */}
        <Modal
          visible={selectedDay !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedDay(null)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={styles.dayDetailModal}
            >
              {selectedDay && (
                <>
                  <View style={styles.dayDetailHeader}>
                    <View style={styles.dayDetailTitleContainer}>
                      <Text style={styles.dayDetailDate}>
                        {selectedDay.dayName} {selectedDay.dayNumber}{" "}
                        {getMonthName(selectedDay.date)}
                      </Text>
                      {isToday(selectedDay.date) && (
                        <View
                          style={[
                            styles.todayBadge,
                            { backgroundColor: childColor + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.todayBadgeText,
                              { color: childColor },
                            ]}
                          >
                            Aujourd'hui
                          </Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedDay(null)}
                      style={styles.modalCloseButton}
                    >
                      <X
                        size={24}
                        color={
                          isDark ? COLORS.neutral[400] : COLORS.secondary[500]
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  {selectedDay.sessions.length > 0 ? (
                    <ScrollView
                      style={styles.dayDetailSessions}
                      showsVerticalScrollIndicator={false}
                    >
                      {selectedDay.sessions.map((session, idx) => (
                        <View key={session.id} style={styles.modalSessionCard}>
                          <View style={styles.sessionHeader}>
                            <View
                              style={[
                                styles.sessionTimeBlock,
                                {
                                  backgroundColor: session.subjectColor + "20",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.sessionTime,
                                  { color: session.subjectColor },
                                ]}
                              >
                                {session.time}
                              </Text>
                            </View>

                            <View style={styles.sessionInfo}>
                              <View style={styles.sessionTitleRow}>
                                <Text style={styles.sessionSubject}>
                                  {session.subject}
                                </Text>
                                <View
                                  style={[
                                    styles.sessionModeBadge,
                                    { backgroundColor: childColor + "15" },
                                  ]}
                                >
                                  {session.mode === "online" ? (
                                    <Video size={14} color={childColor} />
                                  ) : (
                                    <MapPin size={14} color={childColor} />
                                  )}
                                </View>
                              </View>

                              <View style={styles.sessionMetaRow}>
                                <View style={styles.sessionTutorInfo}>
                                  <Image
                                    source={{ uri: session.tutorAvatar }}
                                    style={styles.sessionTutorAvatar}
                                  />
                                  <Text style={styles.sessionTutor}>
                                    {session.tutorName}
                                  </Text>
                                </View>
                                <View style={styles.sessionDuration}>
                                  <Clock
                                    size={12}
                                    color={
                                      isDark
                                        ? COLORS.neutral[500]
                                        : COLORS.secondary[400]
                                    }
                                  />
                                  <Text style={styles.sessionDurationText}>
                                    {session.duration}min
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.dayDetailEmpty}>
                      <Calendar
                        size={48}
                        color={
                          isDark ? COLORS.neutral[600] : COLORS.neutral[400]
                        }
                      />
                      <Text style={styles.dayDetailEmptyText}>
                        Aucune séance prévue ce jour
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Animated.View>
          </View>
        </Modal>

        {/* Legend */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.legend}
        >
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Video size={16} color={childColor} />
              <Text style={styles.legendText}>En ligne</Text>
            </View>
            <View style={styles.legendItem}>
              <MapPin size={16} color={childColor} />
              <Text style={styles.legendText}>Présentiel</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean, accentColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : COLORS.neutral[50],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    backButtonIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    headerSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    weekNavigation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
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
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      marginBottom: 4,
    },
    weekRange: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    todayButtonSmall: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
      borderRadius: 10,
    },
    todayButtonSmallText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "700",
      color: accentColor,
    },
    viewModeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    calendarContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 12,
    },
    dayContainer: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
    },
    dayHeaderToday: {
      backgroundColor: isDark ? accentColor + "30" : accentColor + "20",
    },
    dayNameText: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    dayNameTextToday: {
      color: accentColor,
    },
    dayNumberContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? COLORS.neutral[600] : COLORS.neutral[200],
      justifyContent: "center",
      alignItems: "center",
    },
    dayNumberContainerToday: {
      backgroundColor: accentColor,
    },
    dayNumberText: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
    },
    dayNumberTextToday: {
      color: COLORS.neutral.white,
    },
    sessionsColumn: {
      padding: 16,
      gap: 12,
    },
    sessionCard: {
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral.white,
      borderRadius: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    sessionHeader: {
      flexDirection: "row",
      gap: 12,
    },
    sessionTimeBlock: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 60,
    },
    sessionTime: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "700",
    },
    sessionInfo: {
      flex: 1,
      gap: 8,
    },
    sessionTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sessionSubject: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    sessionMetaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sessionTutorInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    sessionTutorAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    sessionTutor: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
    },
    sessionDuration: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    sessionDurationText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
    },
    sessionModeBadge: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyDay: {
      padding: 24,
      alignItems: "center",
    },
    emptyDayText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[400],
      fontStyle: "italic",
    },
    monthNavigation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
      gap: 12,
    },
    monthInfoContainer: {
      flex: 1,
      alignItems: "center",
    },
    monthTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
    },
    monthContainer: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    weekdayHeaders: {
      flexDirection: "row",
      marginBottom: 12,
    },
    weekdayHeader: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[400] : COLORS.secondary[600],
      textAlign: "center",
      textTransform: "uppercase",
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
    monthDayOtherMonth: {
      opacity: 0.3,
    },
    monthDayToday: {
      backgroundColor: isDark ? accentColor + "20" : accentColor + "15",
      borderRadius: 8,
    },
    monthDayNumber: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? COLORS.neutral[200] : COLORS.secondary[900],
      marginBottom: 2,
    },
    monthDayNumberOther: {
      color: isDark ? COLORS.neutral[600] : COLORS.secondary[400],
    },
    monthDayNumberToday: {
      fontWeight: "700",
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
    legend: {
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 24,
      padding: 16,
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    legendTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
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
      color: isDark ? COLORS.neutral[300] : COLORS.secondary[700],
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
      backgroundColor: accentColor,
    },
    backButtonText: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.neutral.white,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    dayDetailModal: {
      backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 40,
      maxHeight: "80%",
    },
    dayDetailHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    dayDetailTitleContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    dayDetailDate: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      fontWeight: "700",
      color: isDark ? COLORS.neutral[100] : COLORS.secondary[900],
      textTransform: "capitalize",
    },
    todayBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    todayBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "700",
    },
    modalCloseButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
    },
    dayDetailSessions: {
      maxHeight: 500,
    },
    modalSessionCard: {
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[50],
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    dayDetailEmpty: {
      paddingVertical: 60,
      alignItems: "center",
      gap: 16,
    },
    dayDetailEmptyText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: isDark ? COLORS.neutral[500] : COLORS.secondary[500],
    },
  });
