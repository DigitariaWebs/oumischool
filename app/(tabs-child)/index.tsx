import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Search, Bell, Clock, Play, Sparkles, BookOpen, Brain, Award, Users, GraduationCap } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { AnimatedSection } from "@/components/ui";

// Données pour les leçons (style photo)
const TODAY_LESSONS = [
  { 
    id: 1, 
    subject: "Mathématiques", 
    title: "Les fractions", 
    duration: "08:00", 
    color: "#E0F2FE", 
    accent: "#0EA5E9",
    image: "https://cdn-icons-png.flaticon.com/512/2436/2436633.png", 
    route: "/lessons/math-fractions" 
  },
  { 
    id: 2, 
    subject: "Sciences", 
    title: "Cycle de l'eau", 
    duration: "09:30", 
    color: "#DCFCE7", 
    accent: "#22C55E",
    image: "https://cdn-icons-png.flaticon.com/512/4148/4148441.png", 
    route: "/lessons/science-solar-system" 
  },
  { 
    id: 3, 
    subject: "Français", 
    title: "Conjugaison", 
    duration: "10:30", 
    color: "#FEF9C3", 
    accent: "#EAB308",
    image: "https://cdn-icons-png.flaticon.com/512/1670/1670915.png", 
    route: "/lessons/french-tenses" 
  },
];

// Données Oumi'School
const PROGRAMME_SEMAINE = [
  { jour: "Lun", heure: "08:00", cours: "Mathématiques", couleur: "#E0F2FE" },
  { jour: "Mar", heure: "09:00", cours: "Français", couleur: "#FEF9C3" },
  { jour: "Mer", heure: "10:00", cours: "Sciences", couleur: "#DCFCE7" },
  { jour: "Jeu", heure: "11:00", cours: "Histoire", couleur: "#FFE4E6" },
  { jour: "Ven", heure: "12:00", cours: "Géographie", couleur: "#F3E8FF" },
  { jour: "Sam", heure: "13:00", cours: "Évaluation", couleur: "#F1F5F9" },
];

export default function ChildDashboard() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      {/* HEADER STYLE PHOTO */}
      <View style={styles.header}>
        <View>
          <View style={styles.welcomeRow}>
            <Text style={styles.headerLabel}>OUMI'SCHOOL</Text>
            <Sparkles size={12} color={COLORS.primary.DEFAULT} style={{marginLeft: 4}} />
          </View>
          <Text style={styles.subHeader}>Parental Support Platform</Text>
          <Text style={styles.userName}>Bonjour, {user?.name || "Élève"}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable 
            onPress={() => Alert.alert("Recherche", "Que veux-tu apprendre ?")} 
            hitSlop={15}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
          >
            <Search size={22} color="#64748B" />
          </Pressable>
          <Pressable 
            onPress={() => Alert.alert("Notifications", "Rappel : Leçon dans 30 min")}
            hitSlop={15}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
          >
            <View style={styles.notifBadge} />
            <Bell size={22} color="#64748B" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* CARD AUJOURD'HUI - STYLE PHOTO */}
        <AnimatedSection delay={100} style={styles.todayCard}>
          <View style={styles.todayContent}>
            <Text style={styles.todayTitle}>Aujourd'hui</Text>
            <View style={styles.liveContainer}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Prochaine leçon dans 2h</Text>
            </View>
            <Text style={styles.classMain}>Cours : Mathématiques - Fractions</Text>
            <View style={styles.batchContainer}>
              <GraduationCap size={16} color="white" />
              <Text style={styles.batchText}>Niveau : CM2 (Groupe A)</Text>
            </View>
            <Pressable style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Commencer</Text>
            </Pressable>
          </View>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942789.png' }} 
            style={styles.todayImage} 
          />
        </AnimatedSection>

        {/* PROGRAMME DE LA SEMAINE - STYLE PHOTO */}
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Programme de la semaine</Text>
            <Pressable onPress={() => router.push("/curriculum")}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.scheduleContainer}
          >
            {PROGRAMME_SEMAINE.map((item, index) => (
              <Pressable key={index} style={[styles.scheduleCard, { backgroundColor: item.couleur }]}>
                <Text style={styles.scheduleDay}>{item.jour}</Text>
                <Text style={styles.scheduleTime}>{item.heure}</Text>
                <Text style={styles.scheduleCourse}>{item.cours}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ASSISTANT IA - STYLE PHOTO */}
        <Pressable style={styles.aiCard}>
          <View style={styles.aiContent}>
            <View style={styles.aiIcon}>
              <Brain size={24} color="#6366F1" />
            </View>
            <View style={styles.aiText}>
              <Text style={styles.aiTitle}>Assistant pédagogique</Text>
              <Text style={styles.aiSubtitle}>Pose-moi une question sur tes leçons</Text>
            </View>
          </View>
        </Pressable>

        {/* MES LEÇONS - STYLE PHOTO (CARTES COLORÉES) */}
        <View style={styles.lessonsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Mes leçons</Text>
              <Text style={styles.sectionSubtitle}>Programme personnalisé</Text>
            </View>
            <Pressable onPress={() => router.push("/exercises")}>
              <Text style={styles.viewAll}>Tout voir</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.lessonsContainer}
          >
            {TODAY_LESSONS.map((lesson) => (
              <Pressable 
                key={lesson.id}
                onPress={() => router.push(lesson.route as any)}
                style={({ pressed }) => [
                  styles.lessonCard, 
                  { backgroundColor: lesson.color },
                  pressed && { transform: [{ scale: 0.96 }] }
                ]}
              >
                <View style={styles.lessonHeader}>
                  <View style={[styles.lessonTime, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                    <Clock size={12} color={lesson.accent} />
                    <Text style={[styles.lessonTimeText, { color: lesson.accent }]}>{lesson.duration}</Text>
                  </View>
                </View>

                <View style={styles.lessonIconContainer}>
                  <Image source={{ uri: lesson.image }} style={styles.lessonIcon} />
                </View>

                <View style={styles.lessonFooter}>
                  <View>
                    <Text style={styles.lessonSubject}>{lesson.subject}</Text>
                    <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
                  </View>
                  <View style={[styles.playButton, { backgroundColor: lesson.accent }]}>
                    <Play size={14} color="white" fill="white" />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* TUTORAT OPTIONNEL - BOUTON STYLE PHOTO */}
        <Pressable style={styles.tutorButton}>
          <Users size={20} color="#6366F1" />
          <Text style={styles.tutorButtonText}>Besoin d'un tuteur ? (Optionnel)</Text>
        </Pressable>

       
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 20 
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  headerLabel: { fontFamily: FONTS.secondary, fontSize: 14, color: "#6366F1", letterSpacing: 1.2, fontWeight: "800" },
  subHeader: { fontSize: 12, color: "#94A3B8", marginBottom: 4 },
  userName: { fontFamily: FONTS.fredoka, fontSize: 24, color: "#1E293B" },
  headerActions: { flexDirection: "row", gap: 12 },
  iconBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: "#F8FAFC", 
    borderWidth: 1, 
    borderColor: "#F1F5F9", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  btnPressed: { backgroundColor: '#F1F5F9', transform: [{scale: 0.95}] },
  notifBadge: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#EF4444', 
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#F8FAFC'
  },
  scrollBody: { paddingBottom: 100 },

  // Today Card
  todayCard: {
    backgroundColor: "#6366F1",
    marginHorizontal: 24,
    borderRadius: 30,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayContent: {
    flex: 1,
    gap: 8,
  },
  todayTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  classMain: {
    color: 'white',
    fontSize: 18,
    fontFamily: FONTS.fredoka,
    marginTop: 4,
  },
  batchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batchText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  joinButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  todayImage: {
    width: 80,
    height: 80,
  },

  // Schedule
  scheduleSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  viewAll: {
    color: "#6366F1",
    fontWeight: '600',
    fontSize: 14,
  },
  scheduleContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
  },
  scheduleCard: {
    padding: 14,
    borderRadius: 18,
    width: 100,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scheduleDay: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  scheduleCourse: {
    fontSize: 13,
    fontWeight: '500',
    color: "#1E293B",
  },

  // AI Card
  aiCard: {
    marginHorizontal: 24,
    marginBottom: 25,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiText: {
    flex: 1,
  },
  aiTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },

  // Lessons Section
  lessonsSection: {
    marginBottom: 25,
  },
  lessonsContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 16,
  },
  lessonCard: {
    width: 170,
    height: 200,
    borderRadius: 30,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
  },
  lessonTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lessonTimeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIcon: {
    width: 50,
    height: 50,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lessonSubject: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
  },
  lessonTitle: {
    fontSize: 12,
    color: "#64748B",
    width: 90,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tutor Button
  tutorButton: {
    marginHorizontal: 24,
    marginBottom: 15,
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  tutorButtonText: {
    color: '#6366F1',
    fontSize: 15,
    fontWeight: '600',
  },

  // Source Button
  sourceButton: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sourceButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});