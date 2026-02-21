import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Trophy,
  Star,
  Calculator,
  FileText,
  FlaskConical,
  BookOpen,
  Flame,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { AnimatedSection } from "@/components/ui";

const { width } = Dimensions.get("window");

// Données avec seulement 2 couleurs
const SUBJECT_PROGRESS = [
  { subject: "Maths", progress: 75, Icon: Calculator, color: "#6366F1" }, // Violet
  { subject: "Français", progress: 68, Icon: FileText, color: "#6366F1" }, // Violet
  { subject: "Sciences", progress: 82, Icon: FlaskConical, color: "#0EA5E9" }, // Bleu
  { subject: "Histoire", progress: 55, Icon: BookOpen, color: "#0EA5E9" }, // Bleu
];

const BADGES = [
  { id: 1, Icon: Flame, label: "5 jours", earned: true, color: "#6366F1" },
  { id: 2, Icon: Star, label: "100 pts", earned: true, color: "#6366F1" },
  { id: 3, Icon: Trophy, label: "Champion", earned: false, color: "#CBD5E1" },
  { id: 4, Icon: BookOpen, label: "Lecteur", earned: false, color: "#CBD5E1" },
];

const RECENT_ACTIVITIES = [
  { id: 1, title: "Les fractions", subject: "Maths", date: "Aujourd'hui", color: "#6366F1" },
  { id: 2, title: "Conjugaison", subject: "Français", date: "Hier", color: "#6366F1" },
  { id: 3, title: "Système solaire", subject: "Sciences", date: "Hier", color: "#0EA5E9" },
];

export default function ChildProgressScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const overallProgress = 68;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header avec cercle de progression */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerLabel}>PROGRESSION</Text>
              <Text style={styles.headerTitle}>Bravo, {user?.name || "Élève"} !</Text>
            </View>
            <Pressable 
              style={({ pressed }) => [styles.historyButton, pressed && styles.btnPressed]}
              onPress={() => router.push("/progress/history")}
            >
              <Text style={styles.historyButtonText}>Historique</Text>
              <ChevronRight size={16} color="#64748B" />
            </Pressable>
          </View>
          
          <View style={styles.mainProgressContainer}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text style={styles.percentText}>{overallProgress}%</Text>
                <Text style={styles.percentLabel}>complété</Text>
              </View>
            </View>
            <View style={styles.streakContainer}>
              <Flame size={20} color="#F97316" />
              <Text style={styles.streakText}>5 jours de suite !</Text>
            </View>
          </View>
        </View>

        {/* Badges Section - Design épuré */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tes badges</Text>
            <Pressable onPress={() => router.push("/progress/badges")}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.badgesContainer}
          >
            {BADGES.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeLocked]}>
                <View style={[styles.badgeIconBg, { backgroundColor: badge.earned ? "#EEF2FF" : "#F1F5F9" }]}>
                  <badge.Icon size={24} color={badge.earned ? "#6366F1" : "#CBD5E1"} />
                </View>
                <Text style={[styles.badgeLabel, !badge.earned && styles.badgeLabelLocked]}>
                  {badge.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Progression par matière - Design carte style photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par matière</Text>
          {SUBJECT_PROGRESS.map((item, index) => (
            <AnimatedSection key={item.subject} delay={200 + index * 100}>
              <Pressable 
                style={({ pressed }) => [styles.subjectCard, pressed && styles.btnPressed]}
                onPress={() => router.push(`/progress/${item.subject.toLowerCase()}`)}
              >
                <View style={styles.subjectInfo}>
                  <View style={[styles.miniIcon, { backgroundColor: "#EEF2FF" }]}>
                    <item.Icon size={18} color="#6366F1" />
                  </View>
                  <View style={styles.subjectTextContainer}>
                    <Text style={styles.subjectName}>{item.subject}</Text>
                    <View style={styles.subjectProgressRow}>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, { width: `${item.progress}%`, backgroundColor: "#6366F1" }]} />
                      </View>
                      <Text style={styles.subjectValue}>{item.progress}%</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </AnimatedSection>
          ))}
        </View>

        {/* Activités récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activités récentes</Text>
            <Pressable onPress={() => router.push("/progress/activities")}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </Pressable>
          </View>

          {RECENT_ACTIVITIES.map((activity) => (
            <Pressable 
              key={activity.id}
              style={({ pressed }) => [styles.activityCard, pressed && styles.btnPressed]}
            >
              <View style={styles.activityContent}>
                <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityMeta}>{activity.subject} • {activity.date}</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bouton pour voir plus */}
        <Pressable 
          style={({ pressed }) => [styles.viewMoreButton, pressed && styles.btnPressed]}
          onPress={() => router.push("/progress/details")}
        >
          <Text style={styles.viewMoreText}>Voir toutes les statistiques</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 100 },
  
  // Header
  header: { 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLabel: { 
    fontFamily: FONTS.secondary, 
    fontSize: 12, 
    color: "#94A3B8", 
    letterSpacing: 1.2, 
    fontWeight: "700" 
  },
  headerTitle: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 24, 
    color: "#1E293B", 
    marginTop: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  historyButtonText: {
    fontSize: 13,
    color: "#64748B",
    marginRight: 4,
  },
  
  mainProgressContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  circleOuter: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: "#F1F5F9", 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#E2E8F0" 
  },
  circleInner: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: "#FFFFFF", 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  percentText: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 32, 
    color: "#6366F1" 
  },
  percentLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: "#92400E",
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 18, 
    color: "#1E293B" 
  },
  viewAll: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: '600',
  },

  // Badges
  badgesContainer: {
    paddingRight: 24,
    gap: 16,
  },
  badgeCard: { 
    width: 70,
    alignItems: "center", 
    gap: 8,
  },
  badgeLocked: { 
    opacity: 0.5 
  },
  badgeIconBg: { 
    width: 56, 
    height: 56, 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  badgeLabel: { 
    fontFamily: FONTS.secondary, 
    fontSize: 11, 
    color: "#1E293B", 
    fontWeight: "600" 
  },
  badgeLabelLocked: {
    color: "#94A3B8",
  },

  // Subject Cards
  subjectCard: { 
    backgroundColor: "#FFFFFF", 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectInfo: { 
    flexDirection: "row", 
    alignItems: "center",
  },
  miniIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 12,
  },
  subjectTextContainer: {
    flex: 1,
  },
  subjectName: { 
    fontFamily: FONTS.secondary, 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#1E293B",
    marginBottom: 8,
  },
  subjectProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barContainer: { 
    flex: 1,
    height: 6, 
    backgroundColor: "#F1F5F9", 
    borderRadius: 3, 
    overflow: "hidden" 
  },
  barFill: { 
    height: "100%", 
    borderRadius: 3 
  },
  subjectValue: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 14,
    color: "#1E293B",
    width: 35,
  },

  // Activities
  activityCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
    color: "#94A3B8",
  },

  // View More Button
  viewMoreButton: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  viewMoreText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: '600',
  },
  btnPressed: { 
    opacity: 0.7,
    transform: [{scale: 0.98}] 
  },
});