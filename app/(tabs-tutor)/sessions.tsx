import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";
import { BlobBackground, HeroCard, AnimatedSection } from "@/components/ui";

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
    studentAvatar: "https://via.placeholder.com/100",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    time: "14:00",
    duration: 60,
    mode: "online",
  },
  {
    id: 2,
    studentName: "Sofia M.",
    studentAvatar: "https://via.placeholder.com/100",
    subject: "Français",
    subjectColor: "#EF4444",
    time: "10:00",
    duration: 45,
    mode: "online",
  },
  {
    id: 3,
    studentName: "Youssef K.",
    studentAvatar: "https://via.placeholder.com/100",
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
    studentAvatar: "https://via.placeholder.com/100",
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
  const { colors, isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<DaySchedule[]>(
    getWeekDates(new Date()),
  );
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
      <BlobBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AnimatedSection delay={100}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Calendar size={20} color="white" />
            </View>
            <Text style={styles.headerTitle}>Sessions</Text>
          </View>
        </AnimatedSection>

        {/* Hero */}
        <AnimatedSection delay={150} style={styles.heroWrapper}>
          <HeroCard
            title="Cette semaine"
            value={`${totalSessions}`}
            subtitle={`séance${totalSessions > 1 ? "s" : ""} planifiée${totalSessions > 1 ? "s" : ""}`}
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${getMonthName(weekDates[0].date)} ${weekDates[0].date.getFullYear()}`,
            }}
          />
        </AnimatedSection>

        {/* Week Navigation */}
        <AnimatedSection delay={250} style={styles.weekNavContainer}>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToPreviousWeek}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color={COLORS.primary.DEFAULT} />
            </TouchableOpacity>

            <View style={styles.weekInfoContainer}>
              <Text style={[styles.weekMonth, { color: colors.textPrimary }]}>
                {getMonthName(weekDates[0].date)}{" "}
                {weekDates[0].date.getFullYear()}
              </Text>
              <Text style={[styles.weekRange, { color: colors.textSecondary }]}>
                {weekDates[0].dayNumber} — {weekDates[6].dayNumber}{" "}
                {weekDates[0].date.getMonth() !==
                  weekDates[6].date.getMonth() &&
                  getMonthName(weekDates[6].date)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.navButton}
              onPress={goToNextWeek}
              activeOpacity={0.7}
            >
              <ChevronRight size={22} color={COLORS.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.todayButton}
            onPress={goToToday}
            activeOpacity={0.7}
          >
            <Calendar size={14} color={COLORS.primary.DEFAULT} />
            <Text style={styles.todayButtonText}>Aujourd'hui</Text>
          </TouchableOpacity>
        </AnimatedSection>

        {/* Calendar Days */}
        <View style={styles.calendarContainer}>
          {weekDates.map((day, index) => {
            const today = isToday(day.date);
            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(350 + index * 50)
                  .duration(500)
                  .springify()}
                style={[styles.dayContainer, { backgroundColor: colors.card }]}
              >
                <View
                  style={[
                    styles.dayHeader,
                    today && { backgroundColor: COLORS.primary.DEFAULT + "15" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      {
                        color: today
                          ? COLORS.primary.DEFAULT
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.dayNumberContainer,
                      today && { backgroundColor: COLORS.primary.DEFAULT },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        { color: today ? "white" : colors.textPrimary },
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                  </View>
                </View>

                {day.sessions.length > 0 ? (
                  <View style={styles.sessionsColumn}>
                    {day.sessions.map((session) => (
                      <TouchableOpacity
                        key={session.id}
                        style={[
                          styles.sessionCard,
                          { borderLeftColor: session.subjectColor },
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.sessionTop}>
                          <Image
                            source={{ uri: session.studentAvatar }}
                            style={[
                              styles.sessionAvatar,
                              { borderColor: session.subjectColor + "40" },
                            ]}
                          />
                          <View style={styles.sessionInfo}>
                            <Text
                              style={[
                                styles.sessionTime,
                                { color: colors.textPrimary },
                              ]}
                            >
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

                        <Text
                          style={[
                            styles.sessionStudent,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {session.studentName}
                        </Text>

                        <View style={styles.sessionFooter}>
                          <View style={styles.sessionMeta}>
                            <Clock size={11} color={colors.textMuted} />
                            <Text
                              style={[
                                styles.sessionMetaText,
                                { color: colors.textMuted },
                              ]}
                            >
                              {session.duration} min
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.sessionModeBadge,
                              {
                                backgroundColor: COLORS.primary.DEFAULT + "12",
                              },
                            ]}
                          >
                            {session.mode === "online" ? (
                              <>
                                <Video
                                  size={11}
                                  color={COLORS.primary.DEFAULT}
                                />
                                <Text style={styles.sessionModeText}>
                                  En ligne
                                </Text>
                              </>
                            ) : (
                              <>
                                <MapPin
                                  size={11}
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
                    <Text
                      style={[styles.emptyDayText, { color: colors.textMuted }]}
                    >
                      Aucune séance
                    </Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Legend */}
        <AnimatedSection delay={800} style={styles.legendWrapper}>
          <View style={[styles.legend, { backgroundColor: colors.card }]}>
            <Text style={[styles.legendTitle, { color: colors.textPrimary }]}>
              Légende
            </Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <Video size={15} color={COLORS.primary.DEFAULT} />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  En ligne
                </Text>
              </View>
              <View style={styles.legendItem}>
                <MapPin size={15} color={COLORS.primary.DEFAULT} />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  Présentiel
                </Text>
              </View>
            </View>
          </View>
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    headerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
    },
    heroWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    weekNavContainer: {
      marginHorizontal: 20,
      marginBottom: 16,
      gap: 10,
    },
    weekNavigation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 14,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.3 : 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    navButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: COLORS.primary.DEFAULT + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    weekInfoContainer: {
      alignItems: "center",
    },
    weekMonth: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      marginBottom: 2,
    },
    weekRange: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
    },
    todayButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: COLORS.primary.DEFAULT + "15",
      borderRadius: 12,
      alignSelf: "center",
    },
    todayButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: COLORS.primary.DEFAULT,
    },
    calendarContainer: {
      paddingHorizontal: 20,
      gap: 10,
    },
    dayContainer: {
      borderRadius: 18,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 11,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    },
    dayName: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600",
    },
    dayNumberContainer: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      justifyContent: "center",
      alignItems: "center",
    },
    dayNumber: {
      fontFamily: FONTS.fredoka,
      fontSize: 13,
      fontWeight: "600",
    },
    sessionsColumn: {
      padding: 12,
      gap: 10,
    },
    sessionCard: {
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
    },
    sessionTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 6,
    },
    sessionAvatar: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 2,
    },
    sessionInfo: {
      flex: 1,
    },
    sessionTime: {
      fontFamily: FONTS.fredoka,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 1,
    },
    sessionSubject: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600",
    },
    sessionStudent: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
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
    },
    sessionModeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
    },
    sessionModeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.primary.DEFAULT,
    },
    emptyDay: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      alignItems: "center",
    },
    emptyDayText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontStyle: "italic",
    },
    legendWrapper: {
      marginHorizontal: 20,
      marginTop: 16,
    },
    legend: {
      borderRadius: 18,
      padding: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    legendTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 10,
    },
    legendItems: {
      flexDirection: "row",
      gap: 24,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    legendText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
    },
  });
