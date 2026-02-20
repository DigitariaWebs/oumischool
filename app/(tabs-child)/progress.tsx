import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Trophy,
  Star,
  Calculator,
  FileText,
  FlaskConical,
  BookOpen,
  Flame,
} from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { AnimatedSection } from "@/components/ui";

const { width } = Dimensions.get("window");

const SUBJECT_PROGRESS = [
  { subject: "Maths", progress: 75, Icon: Calculator, color: "#3B82F6" },
  { subject: "Français", progress: 68, Icon: FileText, color: "#EC4899" },
  { subject: "Sciences", progress: 82, Icon: FlaskConical, color: "#10B981" },
  { subject: "Histoire", progress: 55, Icon: BookOpen, color: "#F59E0B" },
];

export default function ChildProgressScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const overallProgress = 68;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedSection delay={100} style={styles.header}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Bravo {user?.name} !</Text>
            <Text style={styles.headerSubtitle}>
              Tu progresses super bien !
            </Text>
            <AnimatedSection
              delay={300}
              direction="up"
              style={styles.overallProgress}
            >
              <View style={styles.circleProgress}>
                <Text style={styles.overallPercent}>{overallProgress}%</Text>
              </View>
            </AnimatedSection>
          </LinearGradient>
        </AnimatedSection>

        <View style={styles.badgesSection}>
          <AnimatedSection delay={400}>
            <Text style={styles.sectionTitle}>Mes badges</Text>
          </AnimatedSection>
          <View style={styles.badgesRow}>
            {[
              { Icon: Flame, label: "5 jours", earned: true },
              { Icon: Star, label: "100 pts", earned: true },
              { Icon: Trophy, label: "Champion", earned: false },
              { Icon: BookOpen, label: "Lecteur", earned: false },
            ].map((badge, index) => (
              <AnimatedSection
                key={index}
                delay={450 + index * 80}
                direction="up"
              >
                <View
                  style={[styles.badge, !badge.earned && styles.badgeLocked]}
                >
                  <View style={styles.badgeIcon}>
                    <badge.Icon
                      size={36}
                      color={badge.earned ? "#3B82F6" : COLORS.secondary[400]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.badgeLabel,
                      !badge.earned && styles.badgeLabelLocked,
                    ]}
                    numberOfLines={1}
                  >
                    {badge.label}
                  </Text>
                </View>
              </AnimatedSection>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AnimatedSection delay={600}>
            <Text style={styles.sectionTitle}>Par matière</Text>
          </AnimatedSection>
          {SUBJECT_PROGRESS.map((item, index) => (
            <AnimatedSection
              key={item.subject}
              delay={700 + index * 100}
              direction="up"
              style={styles.subjectCard}
            >
              <View style={styles.subjectHeader}>
                <View
                  style={[
                    styles.subjectIcon,
                    { backgroundColor: item.color + "25" },
                  ]}
                >
                  <item.Icon size={32} color={item.color} />
                </View>
                <Text style={styles.subjectName}>{item.subject}</Text>
                <Text style={[styles.subjectPercent, { color: item.color }]}>
                  {item.progress}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </AnimatedSection>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    marginBottom: 24,
    textAlign: "center",
  },
  overallProgress: {
    alignItems: "center",
  },
  circleProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.4)",
  },
  overallPercent: {
    fontFamily: FONTS.fredoka,
    fontSize: 36,
    color: COLORS.neutral.white,
  },
  badgesSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    color: COLORS.secondary[900],
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  badge: {
    width: (width - 72) / 4 - 4,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: COLORS.secondary[700],
    textAlign: "center",
  },
  badgeLabelLocked: {
    color: COLORS.secondary[400],
  },
  section: {
    paddingHorizontal: 24,
  },
  subjectCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subjectName: {
    flex: 1,
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
  },
  subjectPercent: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
  },
  progressBar: {
    height: 14,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 7,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 7,
  },
});
