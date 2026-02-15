import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar, Video, ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const SESSIONS = [
  {
    id: 1,
    date: "Aujourd'hui",
    student: "Adam",
    subject: "Maths",
    time: "14:00",
    status: "upcoming",
  },
  {
    id: 2,
    date: "Demain",
    student: "Sofia",
    subject: "Français",
    time: "10:00",
    status: "upcoming",
  },
  {
    id: 3,
    date: "Hier",
    student: "Adam",
    subject: "Maths",
    time: "14:00",
    status: "completed",
  },
];

export default function TutorSessionsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.header}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Mes sessions</Text>
            <Text style={styles.headerSubtitle}>
              Gérez vos cours et votre planning
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          {SESSIONS.map((session, index) => (
            <Animated.View
              key={session.id}
              entering={FadeInDown.delay(300 + index * 100).duration(600)}
              style={[
                styles.sessionCard,
                session.status === "completed" && styles.sessionCardCompleted,
              ]}
            >
              <View style={styles.sessionDate}>
                <Calendar size={20} color="#8B5CF6" />
                <Text style={styles.sessionDateText}>{session.date}</Text>
              </View>
              <View style={styles.sessionDetails}>
                <Text style={styles.sessionStudent}>{session.student}</Text>
                <Text style={styles.sessionMeta}>
                  {session.subject} • {session.time}
                </Text>
              </View>
              {session.status === "upcoming" ? (
                <TouchableOpacity style={styles.videoButton}>
                  <Video size={18} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Terminé</Text>
                </View>
              )}
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
  header: {
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  section: {
    paddingHorizontal: 24,
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
  sessionCardCompleted: {
    opacity: 0.8,
  },
  sessionDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 16,
    width: 100,
  },
  sessionDateText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
  },
  sessionDetails: {
    flex: 1,
  },
  sessionStudent: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  sessionMeta: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  completedBadge: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
});
