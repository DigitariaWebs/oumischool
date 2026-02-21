import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Search, Bell, Sparkles, ChevronRight, Target, Clock, Brain, GraduationCap } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { AnimatedSection } from "@/components/ui";

// DONNÉES COMPLÈTES SEMAINE
const ALL_LESSONS = [
  { id: 1, day: "Lun", time: "08:30", subject: "Mathématiques", title: "Les fractions", duration: "45 min", accent: "#0EA5E9", image: "https://cdn-icons-png.flaticon.com/512/3813/3813681.png" },
  { id: 2, day: "Lun", time: "10:00", subject: "Sciences", title: "Le cycle de l'eau", duration: "30 min", accent: "#22C55E", image: "https://cdn-icons-png.flaticon.com/512/3105/3105800.png" },
  { id: 3, day: "Mar", time: "09:00", subject: "Histoire", title: "Le Moyen Âge", duration: "50 min", accent: "#F43F5E", image: "https://cdn-icons-png.flaticon.com/512/3533/3533039.png" },
  { id: 4, day: "Mer", time: "10:30", subject: "Anglais", title: "The Animals", duration: "40 min", accent: "#8B5CF6", image: "https://cdn-icons-png.flaticon.com/512/3063/3063067.png" },
  { id: 5, day: "Jeu", time: "14:00", subject: "Géographie", title: "Les continents", duration: "45 min", accent: "#F59E0B", image: "https://cdn-icons-png.flaticon.com/512/814/814513.png" },
  { id: 6, day: "Ven", time: "11:00", subject: "Art", title: "Couleurs primaires", duration: "60 min", accent: "#EC4899", image: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png" },
];

const PROGRAMME_SEMAINE = [
  { jour: "Lun", date: "12", full: "Lundi" }, 
  { jour: "Mar", date: "13", full: "Mardi" }, 
  { jour: "Mer", date: "14", full: "Mercredi" },
  { jour: "Jeu", date: "15", full: "Jeudi" }, 
  { jour: "Ven", date: "16", full: "Vendredi" }, 
  { jour: "Sam", date: "17", full: "Samedi" },
];

export default function ChildDashboard() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [selectedDay, setSelectedDay] = useState("Lun");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const filteredLessons = useMemo(() => {
    return viewMode === "day" 
      ? ALL_LESSONS.filter(l => l.day === selectedDay)
      : ALL_LESSONS; 
  }, [selectedDay, viewMode]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.welcomeRow}>
            <Text style={styles.headerLabel}>OUMI'SCHOOL</Text>
            <Sparkles size={12} color={COLORS.primary.DEFAULT} style={{marginLeft: 4}} />
          </View>
          <Text style={styles.userName}>Bonjour {user?.name || "Élève"}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}><Search size={22} color="#64748B" /></Pressable>
          <Pressable style={styles.iconBtn}><Bell size={22} color="#64748B" /></Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* CARD FOCUS (LIVE) - RÉTABLIE */}
        <AnimatedSection delay={100} style={styles.todayCard}>
          <View style={styles.todayContent}>
            <View style={styles.tagLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN DIRECT DANS 2H</Text>
            </View>
            <Text style={styles.classMain}>Mathématiques : Fractions</Text>
            <View style={styles.batchContainer}>
              <GraduationCap size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.batchText}>CM2 - Groupe A</Text>
            </View>
            <Pressable style={styles.joinButton} onPress={() => Alert.alert("Lancement", "Connexion à la salle...")}>
              <Text style={styles.joinButtonText}>Rejoindre</Text>
              <ChevronRight size={16} color="#6366F1" />
            </Pressable>
          </View>
          <View style={styles.todayImageWrapper}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3813/3813681.png' }} style={styles.todayImage} resizeMode="contain" />
          </View>
        </AnimatedSection>

        {/* PLANNER */}
        <View style={styles.plannerWrapper}>
            <Pressable style={styles.plannerBtn} onPress={() => Alert.alert("🎯 Mission", "C'est parti !")}>
                <View style={styles.plannerIconBg}><Target size={20} color="white" /></View>
                <Text style={styles.plannerText}>Organiser ma journée</Text>
                <ChevronRight size={18} color="#6366F1" />
            </Pressable>
        </View>

        {/* CALENDRIER & MODE */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mon emploi du temps</Text>
            <View style={styles.toggleContainer}>
                <Pressable onPress={() => setViewMode("day")} style={[styles.toggleBtn, viewMode === "day" && styles.toggleActive]}>
                    <Text style={[styles.toggleText, viewMode === "day" && styles.toggleTextActive]}>Jour</Text>
                </Pressable>
                <Pressable onPress={() => setViewMode("week")} style={[styles.toggleBtn, viewMode === "week" && styles.toggleActive]}>
                    <Text style={[styles.toggleText, viewMode === "week" && styles.toggleTextActive]}>Semaine</Text>
                </Pressable>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
              {PROGRAMME_SEMAINE.map((item, index) => {
                const isActive = selectedDay === item.jour;
                return (
                  <Pressable key={index} onPress={() => { setSelectedDay(item.jour); setViewMode("day"); }} style={[styles.calCard, isActive && styles.calCardActive]}>
                      <Text style={[styles.calDay, isActive && styles.calTextActive]}>{item.jour}</Text>
                      <Text style={[styles.calDate, isActive && styles.calTextActive]}>{item.date}</Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        </View>

        {/* TIMELINE AVEC SÉPARATEURS SEMAINE */}
        <View style={styles.timelineSection}>
            {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson, index) => {
                    const isNewDay = viewMode === "week" && (index === 0 || filteredLessons[index-1].day !== lesson.day);
                    return (
                        <View key={lesson.id}>
                            {isNewDay && (
                                <View style={styles.dayHeader}>
                                    <View style={[styles.dayBadge, {backgroundColor: lesson.accent}]}>
                                        <Text style={styles.dayBadgeText}>{PROGRAMME_SEMAINE.find(d => d.jour === lesson.day)?.full}</Text>
                                    </View>
                                </View>
                            )}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <Text style={styles.timeLabel}>{lesson.time}</Text>
                                    <View style={styles.lineWrapper}>
                                        <View style={[styles.dot, { backgroundColor: lesson.accent }]} />
                                        <View style={styles.verticalLine} />
                                    </View>
                                </View>
                                <Pressable style={styles.lessonCard} onPress={() => Alert.alert("Cours", lesson.title)}>
                                    <View style={[styles.lessonColorBar, { backgroundColor: lesson.accent }]} />
                                    <View style={styles.lessonContent}>
                                        <View style={{flex: 1}}>
                                            <Text style={[styles.subjectTag, { color: lesson.accent }]}>{lesson.subject}</Text>
                                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                            <View style={styles.durationRow}><Clock size={12} color="#94A3B8" /><Text style={styles.durationText}>{lesson.duration}</Text></View>
                                        </View>
                                        <Image source={{ uri: lesson.image }} style={styles.lessonThumb} />
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    );
                })
            ) : (
                <View style={styles.emptyState}><Text style={styles.emptyText}>Rien de prévu</Text></View>
            )}
        </View>

        {/* ASSISTANT IA */}
        <View style={styles.aiWrapper}>
            <Pressable style={styles.aiCard} onPress={() => Alert.alert("Oumi IA", "Pose-moi une question !")}>
                <View style={styles.aiIcon}><Brain size={22} color="white" /></View>
                <View style={{flex: 1}}>
                    <Text style={styles.aiTitle}>Une question difficile ?</Text>
                    <Text style={styles.aiSubtitle}>L'assistant Oumi est là pour toi</Text>
                </View>
                <ChevronRight size={18} color="#6366F1" />
            </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  headerLabel: { fontFamily: FONTS.secondary, fontSize: 11, color: "#6366F1", letterSpacing: 1.5, fontWeight: "800" },
  userName: { fontFamily: FONTS.fredoka, fontSize: 22, color: "#1E293B", marginTop: 4 },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: "white", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  scrollBody: { paddingBottom: 100 },
  
  // Rétablissement du style Today Card
  todayCard: { backgroundColor: "#6366F1", marginHorizontal: 24, borderRadius: 28, padding: 24, marginBottom: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  todayContent: { flex: 1.2, zIndex: 2 },
  todayImageWrapper: { flex: 0.8, alignItems: 'flex-end' },
  todayImage: { width: 90, height: 90 },
  tagLive: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', gap: 6, marginBottom: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  liveText: { color: 'white', fontSize: 10, fontWeight: '800' },
  classMain: { color: 'white', fontSize: 22, fontFamily: FONTS.fredoka, marginBottom: 6 },
  batchContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 18 },
  batchText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  joinButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8 },
  joinButtonText: { color: '#6366F1', fontSize: 14, fontWeight: '800' },

  plannerWrapper: { paddingHorizontal: 24, marginBottom: 25 },
  plannerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  plannerIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  plannerText: { flex: 1, fontFamily: FONTS.fredoka, fontSize: 16, color: '#1E293B' },

  sectionContainer: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 15 },
  sectionTitle: { fontFamily: FONTS.fredoka, fontSize: 18, color: "#1E293B" },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 3 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleActive: { backgroundColor: 'white', elevation: 2 },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  toggleTextActive: { color: '#6366F1' },

  calendarStrip: { paddingLeft: 24, paddingRight: 24, gap: 10 },
  calCard: { width: 55, paddingVertical: 15, backgroundColor: "white", borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: "#E2E8F0" },
  calCardActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  calDay: { fontSize: 10, color: "#94A3B8", fontWeight: "700", textTransform: 'uppercase' },
  calDate: { fontSize: 18, fontWeight: "800", color: "#1E293B", marginTop: 4 },
  calTextActive: { color: "white" },

  timelineSection: { paddingHorizontal: 24 },
  dayHeader: { marginTop: 15, marginBottom: 12, alignItems: 'flex-start' },
  dayBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  dayBadgeText: { color: 'white', fontWeight: '800', fontSize: 11, fontFamily: FONTS.fredoka, textTransform: 'uppercase' },
  
  timelineItem: { flexDirection: 'row' },
  timelineLeft: { width: 55, alignItems: 'center' },
  timeLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  lineWrapper: { flex: 1, alignItems: 'center', marginTop: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: 'white', elevation: 3 },
  verticalLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },

  lessonCard: { flex: 1, backgroundColor: 'white', marginLeft: 10, marginBottom: 20, borderRadius: 20, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  lessonColorBar: { width: 6 },
  lessonContent: { flex: 1, padding: 15, flexDirection: 'row', alignItems: 'center' },
  subjectTag: { fontSize: 10, fontWeight: '800', marginBottom: 4, textTransform: 'uppercase' },
  lessonTitle: { fontFamily: FONTS.fredoka, fontSize: 15, color: '#1E293B' },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  durationText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  lessonThumb: { width: 45, height: 45, borderRadius: 10 },
  
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontFamily: FONTS.secondary },

  aiWrapper: { paddingHorizontal: 24, marginTop: 10, paddingBottom: 40 },
  aiCard: { backgroundColor: "#F5F3FF", borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD6FE' },
  aiIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#6366F1", justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  aiTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
  aiSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
});