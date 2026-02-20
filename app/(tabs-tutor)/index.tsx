import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  Calendar,
  Star,
  ChevronRight,
  Video,
  MessageSquare,
  TrendingUp,
  Clock,
  BookOpen,
  Sparkles,
  MapPin,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";
import { BlobBackground, HeroCard, AnimatedSection } from "@/components/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - 12) / 2;

const MY_STUDENTS = [
  {
    id: 1,
    name: "Adam B.",
    grade: "CE2",
    subject: "Maths",
    subjectColor: "#3B82F6",
    nextSession: "Aujourd'hui 14h",
    progress: 72,
  },
  {
    id: 2,
    name: "Sofia M.",
    grade: "CP",
    subject: "Français",
    subjectColor: "#EF4444",
    nextSession: "Demain 10h",
    progress: 58,
  },
];

const UPCOMING_SESSIONS = [
  {
    id: 1,
    student: "Adam B.",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    time: "14:00",
    duration: 60,
    mode: "online",
  },
  {
    id: 2,
    student: "Sofia M.",
    subject: "Français",
    subjectColor: "#EF4444",
    time: "10:00",
    duration: 45,
    mode: "inPerson",
    location: "Casablanca",
  },
];

export default function TutorDashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const userName = user?.name || "Tuteur";

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
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.greeting}>Espace tuteur</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={16} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>
                {user?.rating?.toFixed(1) || "4.8"}
              </Text>
            </View>
          </View>
        </AnimatedSection>

        {/* Hero Stats Card */}
        <AnimatedSection delay={150} style={styles.heroWrapper}>
          <HeroCard
            title="Vue d'ensemble"
            value={`${MY_STUDENTS.length}`}
            subtitle="élèves actifs"
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${UPCOMING_SESSIONS.length} sessions cette semaine`,
            }}
          >
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  {user?.hourlyRate || 25}€
                </Text>
                <Text style={styles.heroStatLabel}>/heure</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  {user?.completedSessions || 12}
                </Text>
                <Text style={styles.heroStatLabel}>sessions</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  {user?.monthlyEarnings || 0}€
                </Text>
                <Text style={styles.heroStatLabel}>ce mois</Text>
              </View>
            </View>
          </HeroCard>
        </AnimatedSection>

        {/* My Students */}
        <View style={styles.section}>
          <AnimatedSection delay={250}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#8B5CF620" }]}
                >
                  <Users size={18} color="#8B5CF6" />
                </View>
                <Text style={styles.sectionTitle}>Mes élèves</Text>
              </View>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>Voir tout</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </AnimatedSection>

          <View style={styles.studentsGrid}>
            {MY_STUDENTS.map((student, index) => (
              <Animated.View
                key={student.id}
                entering={FadeInDown.delay(300 + index * 80)
                  .duration(500)
                  .springify()}
                style={styles.studentCardWrapper}
              >
                <TouchableOpacity
                  style={styles.studentCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.studentCardTop}>
                    <View
                      style={[
                        styles.studentAvatar,
                        { backgroundColor: student.subjectColor },
                      ]}
                    >
                      <Text style={styles.studentAvatarText}>
                        {student.name.charAt(0)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.subjectBadge,
                        { backgroundColor: student.subjectColor + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subjectBadgeText,
                          { color: student.subjectColor },
                        ]}
                      >
                        {student.subject}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentGrade}>{student.grade}</Text>

                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${student.progress}%`,
                            backgroundColor: student.subjectColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{student.progress}%</Text>
                  </View>

                  <View style={styles.nextSessionRow}>
                    <Clock size={12} color={COLORS.primary.DEFAULT} />
                    <Text style={styles.nextSessionText}>
                      {student.nextSession}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <AnimatedSection delay={450}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#10B98120" }]}
                >
                  <Calendar size={18} color="#10B981" />
                </View>
                <Text style={styles.sectionTitle}>Prochaines sessions</Text>
              </View>
            </View>
          </AnimatedSection>

          {UPCOMING_SESSIONS.map((session, index) => (
            <Animated.View
              key={session.id}
              entering={FadeInDown.delay(500 + index * 80)
                .duration(500)
                .springify()}
            >
              <TouchableOpacity
                style={[
                  styles.sessionCard,
                  { borderLeftColor: session.subjectColor },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.sessionTimeBlock}>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionDuration}>
                    {session.duration}m
                  </Text>
                </View>

                <View style={styles.sessionInfo}>
                  <Text
                    style={[
                      styles.sessionSubject,
                      { color: session.subjectColor },
                    ]}
                  >
                    {session.subject}
                  </Text>
                  <Text style={styles.sessionStudent}>{session.student}</Text>
                  <View style={styles.sessionModePill}>
                    {session.mode === "online" ? (
                      <>
                        <Video size={11} color={COLORS.primary.DEFAULT} />
                        <Text style={styles.sessionModeText}>En ligne</Text>
                      </>
                    ) : (
                      <>
                        <MapPin size={11} color={COLORS.primary.DEFAULT} />
                        <Text style={styles.sessionModeText}>
                          {session.location || "Présentiel"}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                <TouchableOpacity style={styles.videoButton}>
                  <Video size={18} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <AnimatedSection delay={650}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#3B82F620" }]}
                >
                  <Sparkles size={18} color="#3B82F6" />
                </View>
                <Text style={styles.sectionTitle}>Actions rapides</Text>
              </View>
            </View>
          </AnimatedSection>

          <View style={styles.quickActionsRow}>
            {[
              {
                icon: <MessageSquare size={22} color="white" />,
                label: "Messages",
                color: "#10B981",
                onPress: () => router.push("/messaging"),
              },
              {
                icon: <BookOpen size={22} color="white" />,
                label: "Ressources",
                color: "#3B82F6",
                onPress: () => router.push("/tutor/resources"),
              },
              {
                icon: <Calendar size={22} color="white" />,
                label: "Planning",
                color: "#8B5CF6",
                onPress: () => router.push("/tutor/sessions"),
              },
            ].map((action, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(700 + index * 60)
                  .duration(500)
                  .springify()}
                style={styles.quickActionWrapper}
              >
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    {action.icon}
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
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
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    avatarContainer: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: COLORS.primary.DEFAULT + "40",
    },
    avatarText: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: "white",
      fontWeight: "600",
    },
    greeting: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    userName: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#FEF3C7",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 12,
    },
    ratingText: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      color: "#92400E",
    },
    heroWrapper: {
      marginHorizontal: 20,
      marginBottom: 24,
    },
    heroStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 16,
      gap: 0,
    },
    heroStat: {
      flex: 1,
      alignItems: "center",
    },
    heroStatValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: "white",
    },
    heroStatLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "rgba(255,255,255,0.75)",
    },
    heroStatDivider: {
      width: 1,
      height: 28,
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    seeAllText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },
    studentsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    studentCardWrapper: {
      width: CARD_WIDTH,
    },
    studentCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    studentCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    studentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    studentAvatarText: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: "white",
      fontWeight: "700",
    },
    subjectBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    subjectBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      fontWeight: "700",
    },
    studentName: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    studentGrade: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
    },
    progressText: {
      fontFamily: FONTS.fredoka,
      fontSize: 12,
      color: colors.textSecondary,
    },
    nextSessionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    nextSessionText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: COLORS.primary.DEFAULT,
      fontWeight: "600",
    },
    sessionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 4,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    sessionTimeBlock: {
      width: 52,
      alignItems: "center",
      paddingRight: 14,
      marginRight: 14,
      borderRightWidth: 1,
      borderRightColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    sessionTime: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      color: colors.textPrimary,
    },
    sessionDuration: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textSecondary,
    },
    sessionInfo: {
      flex: 1,
      gap: 2,
    },
    sessionSubject: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600",
    },
    sessionStudent: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    sessionModePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
      alignSelf: "flex-start",
      backgroundColor: COLORS.primary.DEFAULT + "15",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    sessionModeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.primary.DEFAULT,
    },
    videoButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    quickActionsRow: {
      flexDirection: "row",
      gap: 12,
    },
    quickActionWrapper: {
      flex: 1,
    },
    quickAction: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      alignItems: "center",
      gap: 10,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    quickActionIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    quickActionLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textPrimary,
      textAlign: "center",
    },
  });
