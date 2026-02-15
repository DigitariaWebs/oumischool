import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Users,
  Calendar,
  Euro,
  Star,
  ChevronRight,
  Video,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

// Mock tutor data
const MY_STUDENTS = [
  {
    id: 1,
    name: "Adam B.",
    grade: "CE2",
    subject: "Maths",
    nextSession: "Aujourd'hui 14h",
  },
  {
    id: 2,
    name: "Sofia M.",
    grade: "CP",
    subject: "Français",
    nextSession: "Demain 10h",
  },
];

const UPCOMING_SESSIONS = [
  {
    id: 1,
    student: "Adam",
    subject: "Mathématiques",
    time: "14:00",
    duration: 60,
  },
  { id: 2, student: "Sofia", subject: "Français", time: "10:00", duration: 45 },
];

export default function TutorDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - Tutor purple gradient */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerContainer}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
                <Text style={styles.subGreeting}>Votre espace tuteur</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={18} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.ratingText}>{user?.rating || 4.8}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{MY_STUDENTS.length}</Text>
                <Text style={styles.statLabel}>Élèves</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.hourlyRate}€</Text>
                <Text style={styles.statLabel}>/heure</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* My Students */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Mes élèves</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </Animated.View>

          {MY_STUDENTS.map((student, index) => (
            <Animated.View
              key={student.id}
              entering={FadeInRight.delay(500 + index * 100).duration(600)}
              style={styles.studentCard}
            >
              <TouchableOpacity
                style={styles.studentCardContent}
                activeOpacity={0.7}
              >
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentMeta}>
                    {student.grade} • {student.subject}
                  </Text>
                  <Text style={styles.nextSession}>
                    Prochaine: {student.nextSession}
                  </Text>
                </View>
                <ChevronRight size={20} color={COLORS.secondary[400]} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(700).duration(600)}
            style={styles.sectionTitle}
          >
            Prochaines sessions
          </Animated.Text>
          {UPCOMING_SESSIONS.map((session, index) => (
            <Animated.View
              key={session.id}
              entering={FadeInDown.delay(800 + index * 100).duration(600)}
              style={styles.sessionCard}
            >
              <View style={styles.sessionTime}>
                <Text style={styles.sessionTimeText}>{session.time}</Text>
                <Text style={styles.sessionDuration}>
                  {session.duration} min
                </Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionStudent}>{session.student}</Text>
                <Text style={styles.sessionSubject}>{session.subject}</Text>
              </View>
              <TouchableOpacity style={styles.videoButton}>
                <Video size={20} color="white" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  ratingText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.neutral.white,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
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
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  studentCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  studentCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  studentAvatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.neutral.white,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  studentMeta: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    marginBottom: 2,
  },
  nextSession: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionTime: {
    width: 60,
    alignItems: "center",
    marginRight: 16,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.neutral[200],
  },
  sessionTimeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  sessionDuration: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[500],
  },
  sessionInfo: {
    flex: 1,
  },
  sessionStudent: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  sessionSubject: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  videoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
});
