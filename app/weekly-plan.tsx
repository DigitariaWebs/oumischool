import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Check,
  Clock,
  BookOpen,
  Sparkles,
  Lock,
  ChevronRight,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

// ── Jours de la semaine ──
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// ── Plan mock par matière / élève ──
const WEEKLY_PLAN = [
  {
    id: 1,
    childId: 0, // index dans children
    day: "Lun",
    subject: "Maths",
    topic: "Les fractions",
    duration: "45 min",
    color: "#3B82F6",
    done: true,
    isPaid: false,
    tutorName: "M. Karim",
  },
  {
    id: 2,
    childId: 0,
    day: "Mar",
    subject: "Français",
    topic: "Conjugaison – passé composé",
    duration: "30 min",
    color: "#EF4444",
    done: true,
    isPaid: false,
    tutorName: null,
  },
  {
    id: 3,
    childId: 0,
    day: "Mer",
    subject: "Sciences",
    topic: "Le système solaire",
    duration: "60 min",
    color: "#8B5CF6",
    done: false,
    isPaid: true,
    tutorName: "M. Karim",
  },
  {
    id: 4,
    childId: 0,
    day: "Jeu",
    subject: "Maths",
    topic: "Exercices révision",
    duration: "45 min",
    color: "#3B82F6",
    done: false,
    isPaid: false,
    tutorName: null,
  },
  {
    id: 5,
    childId: 0,
    day: "Ven",
    subject: "Lecture",
    topic: "Compréhension de texte",
    duration: "30 min",
    color: "#10B981",
    done: false,
    isPaid: false,
    tutorName: null,
  },
  {
    id: 6,
    childId: 1,
    day: "Lun",
    subject: "Français",
    topic: "L'alphabet et les sons",
    duration: "30 min",
    color: "#EF4444",
    done: true,
    isPaid: false,
    tutorName: "Mme Sofia",
  },
  {
    id: 7,
    childId: 1,
    day: "Mer",
    subject: "Eveil",
    topic: "Les animaux de la ferme",
    duration: "45 min",
    color: "#F59E0B",
    done: false,
    isPaid: false,
    tutorName: null,
  },
];

const childImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
];

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const children = useAppSelector((state) => state.children.children);

  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState("Lun");
  const [completedIds, setCompletedIds] = useState<number[]>(
    WEEKLY_PLAN.filter((p) => p.done).map((p) => p.id)
  );

  const toggleDone = (id: number) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Filtre par enfant sélectionné + jour
  const dayPlan = WEEKLY_PLAN.filter(
    (p) => p.childId === selectedChildIdx && p.day === selectedDay
  );

  // Stats de la semaine pour l'enfant sélectionné
  const childPlan = WEEKLY_PLAN.filter((p) => p.childId === selectedChildIdx);
  const doneCount = childPlan.filter((p) => completedIds.includes(p.id)).length;
  const totalCount = childPlan.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const selectedChild = children[selectedChildIdx];

  return (
    <SafeAreaView style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan hebdomadaire</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── SÉLECTEUR ENFANT ── */}
        {children.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.childSelector}
          >
            {children.map((child, idx) => (
              <TouchableOpacity
                key={child.id}
                style={[styles.childPill, selectedChildIdx === idx && styles.childPillActive]}
                onPress={() => { setSelectedChildIdx(idx); setSelectedDay("Lun"); }}
              >
                <Image
                  source={{ uri: childImages[idx % childImages.length] }}
                  style={styles.childPillAvatar}
                />
                <Text style={[styles.childPillName, selectedChildIdx === idx && styles.childPillNameActive]}>
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── CARTE PROGRESSION SEMAINE ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>Cette semaine</Text>
              <Text style={styles.progressValue}>{doneCount}/{totalCount} séances</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{progressPct}%</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
        </View>

        {/* ── SÉLECTEUR JOUR ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}
        >
          {DAYS.map((day) => {
            const hasTasks = WEEKLY_PLAN.some(
              (p) => p.childId === selectedChildIdx && p.day === day
            );
            const allDone =
              hasTasks &&
              WEEKLY_PLAN.filter(
                (p) => p.childId === selectedChildIdx && p.day === day
              ).every((p) => completedIds.includes(p.id));

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBtn,
                  selectedDay === day && styles.dayBtnActive,
                  allDone && selectedDay !== day && styles.dayBtnDone,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayBtnText,
                    selectedDay === day && styles.dayBtnTextActive,
                    allDone && selectedDay !== day && styles.dayBtnTextDone,
                  ]}
                >
                  {day}
                </Text>
                {hasTasks && !allDone && selectedDay !== day && (
                  <View style={styles.dayDot} />
                )}
                {allDone && <Check size={10} color={selectedDay === day ? "white" : "#10B981"} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SÉANCES DU JOUR ── */}
        <View style={styles.sessionsSection}>
          <Text style={styles.sectionLabel}>
            {selectedDay === "Lun" ? "Lundi" : selectedDay === "Mar" ? "Mardi" :
             selectedDay === "Mer" ? "Mercredi" : selectedDay === "Jeu" ? "Jeudi" :
             selectedDay === "Ven" ? "Vendredi" : selectedDay === "Sam" ? "Samedi" : "Dimanche"}
          </Text>

          {dayPlan.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayEmoji}>🎉</Text>
              <Text style={styles.emptyDayTitle}>Pas de séance ce jour</Text>
              <Text style={styles.emptyDayText}>Profitez du temps libre !</Text>
            </View>
          ) : (
            dayPlan.map((item) => {
              const isDone = completedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.sessionCard, { borderLeftColor: item.color }, isDone && styles.sessionCardDone]}
                  onPress={() => toggleDone(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.sessionLeft}>
                    {/* Icône matière */}
                    <View style={[styles.sessionIconBox, { backgroundColor: item.color + "18" }]}>
                      <BookOpen size={16} color={item.color} />
                    </View>

                    <View style={styles.sessionInfo}>
                      <View style={styles.sessionTopRow}>
                        <Text style={[styles.sessionSubject, isDone && styles.textDone]}>
                          {item.subject}
                        </Text>
                        {item.isPaid && (
                          <View style={styles.paidBadge}>
                            <Lock size={9} color="#6366F1" />
                            <Text style={styles.paidBadgeText}>Payant</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.sessionTopic, isDone && styles.textDone]}>
                        {item.topic}
                      </Text>
                      <View style={styles.sessionMeta}>
                        <Clock size={11} color="#94A3B8" />
                        <Text style={styles.sessionDuration}>{item.duration}</Text>
                        {item.tutorName && (
                          <>
                            <View style={styles.metaDot} />
                            <Sparkles size={11} color="#F59E0B" />
                            <Text style={styles.sessionTutor}>{item.tutorName}</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Bouton check */}
                  <View style={[styles.checkBtn, isDone && styles.checkBtnDone]}>
                    {isDone && <Check size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── RÉSUMÉ SEMAINE ── */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionLabel}>Résumé de la semaine</Text>
          <View style={styles.summaryGrid}>
            {DAYS.filter((d) =>
              WEEKLY_PLAN.some((p) => p.childId === selectedChildIdx && p.day === d)
            ).map((day) => {
              const tasks = WEEKLY_PLAN.filter(
                (p) => p.childId === selectedChildIdx && p.day === day
              );
              const done = tasks.filter((p) => completedIds.includes(p.id)).length;
              return (
                <TouchableOpacity
                  key={day}
                  style={styles.summaryCard}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={styles.summaryDay}>{day}</Text>
                  <Text style={styles.summaryCount}>{done}/{tasks.length}</Text>
                  <View style={styles.summaryBar}>
                    <View
                      style={[
                        styles.summaryFill,
                        {
                          width: `${tasks.length > 0 ? (done / tasks.length) * 100 : 0}%` as any,
                          backgroundColor: done === tasks.length ? "#10B981" : "#6366F1",
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", fontFamily: FONTS.fredoka },

  // Child selector
  childSelector: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  childPill: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 30, borderWidth: 1.5, borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  childPillActive: { backgroundColor: "#EEF2FF", borderColor: "#6366F1" },
  childPillAvatar: { width: 26, height: 26, borderRadius: 13 },
  childPillName: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  childPillNameActive: { color: "#6366F1" },

  // Progress card
  progressCard: {
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: "#F8FAFC", borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  progressLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600", marginBottom: 2 },
  progressValue: { fontSize: 18, fontWeight: "800", color: "#1E293B", fontFamily: FONTS.fredoka },
  progressCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#EEF2FF", justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#6366F1",
  },
  progressCircleText: { fontSize: 14, fontWeight: "800", color: "#6366F1" },
  progressBar: { height: 6, backgroundColor: "#E2E8F0", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#6366F1", borderRadius: 3 },

  // Days selector
  daysRow: { paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  dayBtn: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: "#F8FAFC", borderWidth: 1.5, borderColor: "#E2E8F0",
    justifyContent: "center", alignItems: "center", gap: 2,
  },
  dayBtnActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  dayBtnDone: { backgroundColor: "#F0FDF4", borderColor: "#6EE7B7" },
  dayBtnText: { fontSize: 12, fontWeight: "700", color: "#64748B" },
  dayBtnTextActive: { color: "white" },
  dayBtnTextDone: { color: "#10B981" },
  dayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#6366F1" },

  // Sessions
  sessionsSection: { paddingHorizontal: 20, marginBottom: 28 },
  sectionLabel: {
    fontSize: 12, fontWeight: "800", color: "#94A3B8",
    letterSpacing: 1.2, marginBottom: 14,
  },

  emptyDay: {
    backgroundColor: "#F8FAFC", borderRadius: 18, padding: 32,
    alignItems: "center", borderWidth: 1, borderColor: "#F1F5F9",
  },
  emptyDayEmoji: { fontSize: 32, marginBottom: 8 },
  emptyDayTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginBottom: 4 },
  emptyDayText: { fontSize: 13, color: "#94A3B8" },

  sessionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F8FAFC", borderRadius: 16, padding: 14,
    borderLeftWidth: 4, borderWidth: 1, borderColor: "#F1F5F9",
    marginBottom: 10, gap: 12,
  },
  sessionCardDone: { opacity: 0.55 },
  sessionLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  sessionIconBox: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  sessionInfo: { flex: 1 },
  sessionTopRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  sessionSubject: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  textDone: { textDecorationLine: "line-through", color: "#94A3B8" },
  sessionTopic: { fontSize: 12, color: "#475569", marginBottom: 5 },
  sessionMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionDuration: { fontSize: 11, color: "#94A3B8" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#CBD5E1" },
  sessionTutor: { fontSize: 11, color: "#F59E0B", fontWeight: "600" },

  // Paid badge
  paidBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#EEF2FF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  paidBadgeText: { fontSize: 9, color: "#6366F1", fontWeight: "700" },

  // Check button
  checkBtn: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: "#CBD5E1",
    justifyContent: "center", alignItems: "center",
  },
  checkBtnDone: { backgroundColor: "#10B981", borderColor: "#10B981" },

  // Summary
  summarySection: { paddingHorizontal: 20 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  summaryCard: {
    backgroundColor: "#F8FAFC", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#F1F5F9", width: "30%",
    alignItems: "center",
  },
  summaryDay: { fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 4 },
  summaryCount: { fontSize: 15, fontWeight: "800", color: "#1E293B", marginBottom: 6 },
  summaryBar: { width: "100%", height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, overflow: "hidden" },
  summaryFill: { height: "100%", borderRadius: 2 },
});