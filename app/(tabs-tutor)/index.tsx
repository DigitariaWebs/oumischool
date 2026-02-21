import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  Calendar,
  ChevronRight,
  Video,
  MessageSquare,
  TrendingUp,
  Clock,
  BookOpen,
  MapPin,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

const MY_STUDENTS = [
  {
    id: 1,
    name: "Adam B.",
    grade: "CE2",
    subject: "Maths",
    subjectColor: "#3B82F6",
    nextSession: "Aujourd'hui 14h",
    progress: 72,
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
  {
    id: 2,
    name: "Sofia M.",
    grade: "CP",
    subject: "Français",
    subjectColor: "#EF4444",
    nextSession: "Demain 10h",
    progress: 58,
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
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
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
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
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  },
];

export default function TutorDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || "Tuteur";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>TUTEUR</Text>
            <Text style={styles.headerTitle}>Bonjour, {userName}</Text>
          </View>
        </View>

        {/* Carte statistiques */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MY_STUDENTS.length}</Text>
              <Text style={styles.statLabel}>Élèves</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>25€</Text>
              <Text style={styles.statLabel}>/heure</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>

        {/* Mes élèves */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes élèves</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Voir tout</Text>
              <ChevronRight size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>

          <View style={styles.studentsGrid}>
            {MY_STUDENTS.map((student) => (
              <Pressable
                key={student.id}
                style={({ pressed }) => [
                  styles.studentCard,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={styles.studentHeader}>
                  <Image source={{ uri: student.image }} style={styles.studentAvatar} />
                  <View style={[styles.subjectBadge, { backgroundColor: student.subjectColor + "15" }]}>
                    <Text style={[styles.subjectBadgeText, { color: student.subjectColor }]}>
                      {student.subject}
                    </Text>
                  </View>
                </View>

                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentGrade}>{student.grade}</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${student.progress}%`, backgroundColor: student.subjectColor },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{student.progress}%</Text>
                </View>

                <View style={styles.nextSession}>
                  <Clock size={12} color="#64748B" />
                  <Text style={styles.nextSessionText}>{student.nextSession}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Prochaines sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prochaines sessions</Text>

          {UPCOMING_SESSIONS.map((session) => (
            <Pressable
              key={session.id}
              style={({ pressed }) => [
                styles.sessionCard,
                { borderLeftColor: session.subjectColor },
                pressed && { opacity: 0.9 },
              ]}
            >
              <Image source={{ uri: session.image }} style={styles.sessionAvatar} />
              
              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionSubject, { color: session.subjectColor }]}>
                  {session.subject}
                </Text>
                <Text style={styles.sessionStudent}>{session.student}</Text>
                <View style={styles.sessionMeta}>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionDuration}>• {session.duration}min</Text>
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
                      <Text style={styles.sessionModeText}>{session.location}</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.videoButton}>
                <Video size={16} color="white" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <Pressable
              style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.9 }]}
              onPress={() => router.push("/messaging")}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#10B981" }]}>
                <MessageSquare size={18} color="white" />
              </View>
              <Text style={styles.quickActionText}>Messages</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.9 }]}
              onPress={() => router.push("/tutor/resources")}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#3B82F6" }]}>
                <BookOpen size={18} color="white" />
              </View>
              <Text style={styles.quickActionText}>Ressources</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.9 }]}
              onPress={() => router.push("/tutor/availability")}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#8B5CF6" }]}>
                <Calendar size={18} color="white" />
              </View>
              <Text style={styles.quickActionText}>Dispos</Text>
            </Pressable>
          </View>
        </View>

        {/* Bouton vers disponibilités */}
        <TouchableOpacity 
          style={styles.sourceButton}
          onPress={() => router.push("/tutor/availability")}
        >
          <Text style={styles.sourceButtonText}>+ Gérer mes disponibilités</Text>
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
    marginBottom: 24,
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
    fontSize: 24,
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

  // Section
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
    fontSize: 18,
    color: "#1E293B",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Students Grid
  studentsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  studentCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  studentName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  studentGrade: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
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
    color: "#64748B",
    fontWeight: "600",
  },
  nextSession: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextSessionText: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Sessions
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  sessionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
  },
  sessionSubject: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
  },
  sessionStudent: {
    fontSize: 13,
    color: "#64748B",
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  sessionTime: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  sessionDuration: {
    fontSize: 11,
    color: "#64748B",
  },
  sessionMode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  sessionModeText: {
    fontSize: 10,
    color: "#6366F1",
    fontWeight: "600",
  },
  videoButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "600",
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