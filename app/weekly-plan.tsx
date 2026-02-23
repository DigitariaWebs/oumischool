import React, { useEffect, useMemo, useState } from "react";
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
  ChevronRight,
  Check,
  Clock,
  BookOpen,
  Sparkles,
  Lock,
  CalendarDays,
  TrendingUp,
  Target,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useSessions } from "@/hooks/api/sessions";
import { useAppSelector } from "@/store/hooks";

// ── Mois ──
const MONTHS = [
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
const MONTHS_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

// ── Jours ──
const DAYS_HEADER = ["L", "M", "M", "J", "V", "S", "D"];

interface PlanItem {
  id: string;
  childId: string;
  date: string;
  subject: string;
  topic: string;
  duration: string;
  color: string;
  done: boolean;
  isPaid: boolean;
  tutorName: string | null;
}

function colorForSubject(subject: string): string {
  const key = subject.toLowerCase();
  if (key.includes("math")) return "#3B82F6";
  if (key.includes("fr")) return "#EF4444";
  if (key.includes("science")) return "#8B5CF6";
  if (key.includes("english")) return "#06B6D4";
  if (key.includes("history")) return "#F59E0B";
  return "#10B981";
}

function formatDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0=Sun..6=Sat → convert to Mon=0..Sun=6
  const raw = new Date(year, month, 1).getDay();
  return raw === 0 ? 6 : raw - 1;
}

const childImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
];

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const children = useAppSelector((state) => state.children.children);
  const { data: sessionsData = [] } = useSessions();

  const today = new Date();
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateStr(today),
  );
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const selectedChildId = children[selectedChildIdx]?.id;

  const planData = useMemo((): PlanItem[] => {
    const rows = Array.isArray(sessionsData) ? sessionsData : [];
    return rows
      .filter(
        (session: any) =>
          !selectedChildId || session?.childId === selectedChildId,
      )
      .map((session: any) => {
        const start = new Date(session?.startTime ?? Date.now());
        const end = new Date(session?.endTime ?? Date.now());
        const durationMinutes = Math.max(
          30,
          Math.round((end.getTime() - start.getTime()) / 60000),
        );
        const subject = String(session?.subjectId ?? "Cours");
        const tutorId = String(session?.tutorId ?? "");
        const status = String(session?.status ?? "").toUpperCase();
        return {
          id: String(session?.id ?? ""),
          childId: String(session?.childId ?? selectedChildId ?? ""),
          date: Number.isNaN(start.getTime())
            ? formatDateStr(new Date())
            : start.toISOString().split("T")[0],
          subject,
          topic: `${subject} - ${String(session?.type ?? "Session")}`,
          duration: `${durationMinutes} min`,
          color: colorForSubject(subject),
          done: status === "COMPLETED",
          isPaid: false,
          tutorName: tutorId ? `Tuteur ${tutorId.slice(0, 6)}` : null,
        };
      })
      .filter((item) => !!item.id);
  }, [selectedChildId, sessionsData]);

  useEffect(() => {
    setCompletedIds(planData.filter((p) => p.done).map((p) => p.id));
  }, [planData]);

  const toggleDone = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else setCalendarMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else setCalendarMonth((m) => m + 1);
  };

  // Tâches du jour sélectionné
  const dayPlan = planData.filter((p) => p.date === selectedDate);

  // Stats globales de l'enfant
  const childPlan = planData;
  const doneCount = childPlan.filter((p) => completedIds.includes(p.id)).length;
  const totalCount = childPlan.length;
  const progressPct =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Dates avec tâches pour l'enfant courant
  const taskDates = new Set(planData.map((p) => p.date));
  const allDoneDates = new Set(
    [...taskDates].filter((d) => {
      const tasks = planData.filter((p) => p.date === d);
      return tasks.every((p) => completedIds.includes(p.id));
    }),
  );

  // ── Génération des semaines du mois courant ──
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const todayStr = formatDateStr(today);

  // ── Semaine courante (vue semaine) ──
  const getWeekDates = (dateStr: string) => {
    const d = new Date(dateStr);
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(monday);
      nd.setDate(monday.getDate() + i);
      return formatDateStr(nd);
    });
  };
  const weekDates = getWeekDates(selectedDate);
  const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayName = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ][d.getDay()];
    return `${dayName} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <CalendarDays size={16} color="#6366F1" />
          <Text style={styles.headerTitle}>Planning</Text>
        </View>
        {/* Toggle vue */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === "month" && styles.viewToggleBtnActive,
            ]}
            onPress={() => setViewMode("month")}
          >
            <Text
              style={[
                styles.viewToggleTxt,
                viewMode === "month" && styles.viewToggleTxtActive,
              ]}
            >
              Mois
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === "week" && styles.viewToggleBtnActive,
            ]}
            onPress={() => setViewMode("week")}
          >
            <Text
              style={[
                styles.viewToggleTxt,
                viewMode === "week" && styles.viewToggleTxtActive,
              ]}
            >
              Sem.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
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
                style={[
                  styles.childPill,
                  selectedChildIdx === idx && styles.childPillActive,
                ]}
                onPress={() => setSelectedChildIdx(idx)}
              >
                <Image
                  source={{ uri: childImages[idx % childImages.length] }}
                  style={styles.childPillAvatar}
                />
                <Text
                  style={[
                    styles.childPillName,
                    selectedChildIdx === idx && styles.childPillNameActive,
                  ]}
                >
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── STATS RAPIDES ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#EEF2FF" }]}>
            <Target size={16} color="#6366F1" />
            <Text style={[styles.statValue, { color: "#6366F1" }]}>
              {totalCount}
            </Text>
            <Text style={styles.statLabel}>séances</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F0FDF4" }]}>
            <Check size={16} color="#10B981" />
            <Text style={[styles.statValue, { color: "#10B981" }]}>
              {doneCount}
            </Text>
            <Text style={styles.statLabel}>terminées</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FFF7ED" }]}>
            <TrendingUp size={16} color="#F59E0B" />
            <Text style={[styles.statValue, { color: "#F59E0B" }]}>
              {progressPct}%
            </Text>
            <Text style={styles.statLabel}>progression</Text>
          </View>
        </View>

        {/* ══════════════════════════════════
            ── CALENDRIER ──
        ══════════════════════════════════ */}
        <View style={styles.calendarCard}>
          {/* Navigation mois */}
          <View style={styles.calNav}>
            <TouchableOpacity style={styles.calNavBtn} onPress={prevMonth}>
              <ChevronLeft size={18} color="#475569" />
            </TouchableOpacity>
            <View style={styles.calNavCenter}>
              <Text style={styles.calMonth}>{MONTHS[calendarMonth]}</Text>
              <Text style={styles.calYear}>{calendarYear}</Text>
            </View>
            <TouchableOpacity style={styles.calNavBtn} onPress={nextMonth}>
              <ChevronRight size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Mois courts pour navigation rapide */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthStrip}
          >
            {MONTHS_SHORT.map((m, idx) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthChip,
                  calendarMonth === idx && styles.monthChipActive,
                ]}
                onPress={() => setCalendarMonth(idx)}
              >
                <Text
                  style={[
                    styles.monthChipTxt,
                    calendarMonth === idx && styles.monthChipTxtActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {viewMode === "month" ? (
            <>
              {/* En-têtes jours */}
              <View style={styles.calDayHeaders}>
                {DAYS_HEADER.map((d, i) => (
                  <Text key={i} style={styles.calDayHeader}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Grille du mois */}
              <View style={styles.calGrid}>
                {Array.from(
                  { length: calendarCells.length / 7 },
                  (_, weekIdx) => (
                    <View key={weekIdx} style={styles.calWeekRow}>
                      {calendarCells
                        .slice(weekIdx * 7, weekIdx * 7 + 7)
                        .map((day, colIdx) => {
                          if (!day)
                            return <View key={colIdx} style={styles.calCell} />;
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const isToday = dateStr === todayStr;
                          const isSelected = dateStr === selectedDate;
                          const hasTask = taskDates.has(dateStr);
                          const isAllDone = allDoneDates.has(dateStr);
                          return (
                            <TouchableOpacity
                              key={colIdx}
                              style={[
                                styles.calCell,
                                isSelected && styles.calCellSelected,
                                isToday && !isSelected && styles.calCellToday,
                                isAllDone && !isSelected && styles.calCellDone,
                              ]}
                              onPress={() => {
                                setSelectedDate(dateStr);
                                // Sync month navigation si besoin
                                const d = new Date(dateStr);
                                setCalendarMonth(d.getMonth());
                                setCalendarYear(d.getFullYear());
                              }}
                            >
                              <Text
                                style={[
                                  styles.calCellTxt,
                                  isSelected && styles.calCellTxtSelected,
                                  isToday &&
                                    !isSelected &&
                                    styles.calCellTxtToday,
                                  isAllDone &&
                                    !isSelected &&
                                    styles.calCellTxtDone,
                                ]}
                              >
                                {day}
                              </Text>
                              {/* Indicateur de tâche */}
                              {hasTask && (
                                <View
                                  style={[
                                    styles.calDot,
                                    isSelected && {
                                      backgroundColor: "rgba(255,255,255,0.8)",
                                    },
                                    !isSelected &&
                                      isAllDone && {
                                        backgroundColor: "#10B981",
                                      },
                                    !isSelected &&
                                      !isAllDone && {
                                        backgroundColor: "#6366F1",
                                      },
                                  ]}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  ),
                )}
              </View>
            </>
          ) : (
            /* ── VUE SEMAINE ── */
            <View style={styles.weekView}>
              <View style={styles.calDayHeaders}>
                {DAYS_SHORT.map((d, i) => (
                  <Text key={i} style={styles.calDayHeader}>
                    {d}
                  </Text>
                ))}
              </View>
              <View style={styles.calWeekRow}>
                {weekDates.map((dateStr, i) => {
                  const day = parseInt(dateStr.split("-")[2]);
                  const month = parseInt(dateStr.split("-")[1]) - 1;
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const hasTask = taskDates.has(dateStr);
                  const isAllDone = allDoneDates.has(dateStr);
                  const isCurrentMonth = month === calendarMonth;
                  return (
                    <TouchableOpacity
                      key={dateStr}
                      style={[
                        styles.calCell,
                        styles.weekCell,
                        isSelected && styles.calCellSelected,
                        isToday && !isSelected && styles.calCellToday,
                        isAllDone && !isSelected && styles.calCellDone,
                        !isCurrentMonth && { opacity: 0.35 },
                      ]}
                      onPress={() => setSelectedDate(dateStr)}
                    >
                      <Text
                        style={[
                          styles.calCellTxt,
                          isSelected && styles.calCellTxtSelected,
                          isToday && !isSelected && styles.calCellTxtToday,
                          isAllDone && !isSelected && styles.calCellTxtDone,
                        ]}
                      >
                        {day}
                      </Text>
                      {hasTask && (
                        <View
                          style={[
                            styles.calDot,
                            isSelected && {
                              backgroundColor: "rgba(255,255,255,0.8)",
                            },
                            !isSelected &&
                              isAllDone && { backgroundColor: "#10B981" },
                            !isSelected &&
                              !isAllDone && { backgroundColor: "#6366F1" },
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* Indicateur semaine */}
              <View style={styles.weekIndicator}>
                <Text style={styles.weekIndicatorTxt}>
                  Semaine du {new Date(weekDates[0]).getDate()} au{" "}
                  {new Date(weekDates[6]).getDate()}{" "}
                  {MONTHS[new Date(weekDates[6]).getMonth()]}
                </Text>
              </View>
            </View>
          )}

          {/* Légende */}
          <View style={styles.calLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#6366F1" }]}
              />
              <Text style={styles.legendTxt}>À faire</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10B981" }]}
              />
              <Text style={styles.legendTxt}>Terminé</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: "#6366F1", opacity: 0.2 },
                ]}
              />
              <Text style={styles.legendTxt}>Aujourd&apos;hui</Text>
            </View>
          </View>
        </View>

        {/* ── SÉANCES DU JOUR ── */}
        <View style={styles.sessionsSection}>
          <Text style={styles.sectionLabel}>
            {formatDisplayDate(selectedDate).toUpperCase()}
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
                  style={[
                    styles.sessionCard,
                    { borderLeftColor: item.color },
                    isDone && styles.sessionCardDone,
                  ]}
                  onPress={() => toggleDone(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.sessionLeft}>
                    <View
                      style={[
                        styles.sessionIconBox,
                        { backgroundColor: item.color + "18" },
                      ]}
                    >
                      <BookOpen size={16} color={item.color} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <View style={styles.sessionTopRow}>
                        <Text
                          style={[
                            styles.sessionSubject,
                            isDone && styles.textDone,
                          ]}
                        >
                          {item.subject}
                        </Text>
                        {item.isPaid && (
                          <View style={styles.paidBadge}>
                            <Lock size={9} color="#6366F1" />
                            <Text style={styles.paidBadgeText}>Payant</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[styles.sessionTopic, isDone && styles.textDone]}
                      >
                        {item.topic}
                      </Text>
                      <View style={styles.sessionMeta}>
                        <Clock size={11} color="#94A3B8" />
                        <Text style={styles.sessionDuration}>
                          {item.duration}
                        </Text>
                        {item.tutorName && (
                          <>
                            <View style={styles.metaDot} />
                            <Sparkles size={11} color="#F59E0B" />
                            <Text style={styles.sessionTutor}>
                              {item.tutorName}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.checkBtn, isDone && styles.checkBtnDone]}
                  >
                    {isDone && <Check size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── RÉSUMÉ MENSUEL ── */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionLabel}>
            {`RÉSUMÉ – ${MONTHS[calendarMonth].toUpperCase()} ${calendarYear}`}
          </Text>
          {/* Barre de progression mensuelle */}
          <View style={styles.monthProgressCard}>
            <View style={styles.monthProgressHeader}>
              <Text style={styles.monthProgressTitle}>Progression du mois</Text>
              <Text style={styles.monthProgressCount}>
                {doneCount}/{totalCount} séances
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPct}%` as any },
                ]}
              />
            </View>
            {/* Semaines du mois */}
            <View style={styles.weeksSummary}>
              {[0, 1, 2, 3].map((weekOffset) => {
                // trouver le lundi de chaque semaine du mois
                const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
                const firstMonday = new Date(firstOfMonth);
                const dow =
                  firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1;
                firstMonday.setDate(
                  firstOfMonth.getDate() - dow + weekOffset * 7,
                );

                const weekStart = formatDateStr(firstMonday);
                const weekEnd = new Date(firstMonday);
                weekEnd.setDate(firstMonday.getDate() + 6);
                const weekEndStr = formatDateStr(weekEnd);

                const weekTasks = planData.filter(
                  (p) => p.date >= weekStart && p.date <= weekEndStr,
                );
                if (weekTasks.length === 0) return null;
                const weekDone = weekTasks.filter((p) =>
                  completedIds.includes(p.id),
                ).length;
                const pct = Math.round((weekDone / weekTasks.length) * 100);

                return (
                  <View key={weekOffset} style={styles.weekSummaryItem}>
                    <Text style={styles.weekSummaryLabel}>
                      Sem. {weekOffset + 1}
                    </Text>
                    <View style={styles.weekSummaryBar}>
                      <View
                        style={[
                          styles.weekSummaryFill,
                          {
                            width: `${pct}%` as any,
                            backgroundColor:
                              pct === 100 ? "#10B981" : "#6366F1",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.weekSummaryCount}>
                      {weekDone}/{weekTasks.length}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFBFF" },
  scroll: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: FONTS.fredoka,
  },

  // View toggle
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 2,
  },
  viewToggleBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  viewToggleBtnActive: { backgroundColor: "#6366F1" },
  viewToggleTxt: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  viewToggleTxtActive: { color: "#FFFFFF" },

  // Child selector
  childSelector: { paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  childPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  childPillActive: { backgroundColor: "#EEF2FF", borderColor: "#6366F1" },
  childPillAvatar: { width: 26, height: 26, borderRadius: 13 },
  childPillName: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  childPillNameActive: { color: "#6366F1" },

  // Stats rapides
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800", fontFamily: FONTS.fredoka },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#94A3B8" },

  // ── Calendrier ──
  calendarCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Navigation mois
  calNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calNavCenter: { alignItems: "center" },
  calMonth: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
    fontFamily: FONTS.fredoka,
  },
  calYear: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },

  // Strip mois
  monthStrip: { paddingVertical: 4, gap: 6, marginBottom: 14 },
  monthChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  monthChipActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  monthChipTxt: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  monthChipTxtActive: { color: "#FFFFFF" },

  // Grille
  calDayHeaders: {
    flexDirection: "row",
    marginBottom: 6,
  },
  calDayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  calGrid: { gap: 2 },
  calWeekRow: { flexDirection: "row", gap: 2 },
  calCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  weekCell: { aspectRatio: undefined, paddingVertical: 10 },
  calCellSelected: { backgroundColor: "#6366F1" },
  calCellToday: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#6366F1",
  },
  calCellDone: { backgroundColor: "#F0FDF4" },
  calCellTxt: { fontSize: 13, fontWeight: "600", color: "#1E293B" },
  calCellTxtSelected: { color: "#FFFFFF", fontWeight: "800" },
  calCellTxtToday: { color: "#6366F1", fontWeight: "800" },
  calCellTxtDone: { color: "#10B981" },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },

  // Vue semaine
  weekView: {},
  weekIndicator: { alignItems: "center", paddingTop: 8 },
  weekIndicatorTxt: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },

  // Légende
  calLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendTxt: { fontSize: 10, fontWeight: "600", color: "#94A3B8" },

  // Progress bar
  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#6366F1", borderRadius: 3 },

  // Sessions
  sessionsSection: { paddingHorizontal: 20, marginBottom: 28 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  emptyDay: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyDayEmoji: { fontSize: 32, marginBottom: 8 },
  emptyDayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  emptyDayText: { fontSize: 13, color: "#94A3B8" },

  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sessionCardDone: { opacity: 0.5 },
  sessionLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  sessionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionInfo: { flex: 1 },
  sessionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  sessionSubject: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  textDone: { textDecorationLine: "line-through", color: "#94A3B8" },
  sessionTopic: { fontSize: 12, color: "#475569", marginBottom: 5 },
  sessionMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionDuration: { fontSize: 11, color: "#94A3B8" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#CBD5E1" },
  sessionTutor: { fontSize: 11, color: "#F59E0B", fontWeight: "600" },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidBadgeText: { fontSize: 9, color: "#6366F1", fontWeight: "700" },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkBtnDone: { backgroundColor: "#10B981", borderColor: "#10B981" },

  // Summary mensuel
  summarySection: { paddingHorizontal: 20, marginBottom: 10 },
  monthProgressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  monthProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthProgressTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  monthProgressCount: { fontSize: 13, fontWeight: "600", color: "#6366F1" },
  weeksSummary: { marginTop: 14, gap: 8 },
  weekSummaryItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  weekSummaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    width: 46,
  },
  weekSummaryBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  weekSummaryFill: { height: "100%", borderRadius: 3 },
  weekSummaryCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    width: 28,
    textAlign: "right",
  },
});
