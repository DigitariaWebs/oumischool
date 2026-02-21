import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Search, Bell, Sparkles, Clock, Play, Calculator, FileText, Globe, Brain } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markExerciseCompleted } from "@/store/slices/workflowSlice";
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// --- DONNÉES AVEC LES BONNES ROUTES ---
interface ActivityItem {
  id: number;
  subject: string;
  title: string;
  description: string;
  Icon: any;
  color: string;
  route: string;
  progress?: number;
}

const GAMES: ActivityItem[] = [
  { id: 1, subject: "Maths", title: "Jeu d'addition", description: "Additionne les nombres !", progress: 80, Icon: Calculator, color: "#0EA5E9", route: "/games/math-addition" },
  { id: 2, subject: "Français", title: "Conjugaison", description: "Conjugue les verbes", progress: 60, Icon: FileText, color: "#EC4899", route: "/games/french-conjugation" },
  { id: 3, subject: "Sciences", title: "Mémoire des planètes", description: "Trouve les paires !", progress: 45, Icon: Globe, color: "#22C55E", route: "/games/planets-memory" },
];

const LESSONS: ActivityItem[] = [
  { id: 1, subject: "Maths", title: "Les fractions", description: "Apprends les fractions", Icon: Calculator, color: "#0EA5E9", route: "/lessons/math-fractions" },
  { id: 2, subject: "Français", title: "Les temps", description: "Présent, passé, futur", Icon: FileText, color: "#EC4899", route: "/lessons/french-tenses" },
  { id: 3, subject: "Sciences", title: "Le système solaire", description: "Découvre les planètes", Icon: Globe, color: "#22C55E", route: "/lessons/science-solar-system" },
];

const springConfig = { damping: 12, stiffness: 150 };

// --- TA LOGIQUE DE BOUNCY CARD (CONSERVÉE) ---
function BouncyCard({ children, onPress, delay, style }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)} style={[style, animatedStyle]}>
      <Pressable 
        onPress={onPress} 
        onPressIn={() => scale.value = withSpring(0.96, springConfig)} 
        onPressOut={() => scale.value = withSpring(1, springConfig)}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function ChildExercisesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"games" | "lessons">("games");

  const data: ActivityItem[] = activeTab === "games" ? GAMES : LESSONS;

  // Navigation sécurisée pour éviter l'erreur pathname
  const handlePress = (route: string) => {
    if (user?.role === "child") {
      dispatch(
        markExerciseCompleted({
          childId: user.id,
          exerciseId: route,
          title: route,
        }),
      );
    }
    if (router && route) {
      router.push(route as any);
    } else {
      Alert.alert("Bientôt disponible", "Cet exercice est en cours de préparation !");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER - STYLE DASHBOARD */}
      <View style={styles.header}>
        <View>
          <View style={styles.welcomeRow}>
            <Text style={styles.headerLabel}>OUMI'SCHOOL</Text>
            <Sparkles size={12} color={COLORS.primary.DEFAULT} style={{marginLeft: 4}} />
          </View>
          <Text style={styles.userName}>Mes Activités</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}><Search size={22} color="#64748B" /></Pressable>
          <Pressable style={styles.iconBtn}>
            <View style={styles.notifBadge} />
            <Bell size={22} color="#64748B" />
          </Pressable>
        </View>
      </View>

      {/* TABS - STYLE MODERNE */}
      <View style={styles.tabsContainer}>
        <Pressable 
          onPress={() => setActiveTab("games")} 
          style={[styles.tab, activeTab === "games" && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === "games" && styles.tabTextActive]}>Mini-jeux</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab("lessons")} 
          style={[styles.tab, activeTab === "lessons" && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === "lessons" && styles.tabTextActive]}>Leçons</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          {data.map((item, index) => (
            <BouncyCard 
              key={item.id} 
              delay={100 + index * 100} 
              style={styles.exerciseCard} 
              onPress={() => handlePress(item.route)}
            >
              <View style={styles.exerciseContent}>
                {/* Icône avec cercle de couleur doux */}
                <View style={[styles.exerciseIcon, { backgroundColor: item.color + "15" }]}>
                  <item.Icon size={26} color={item.color} />
                </View>
                
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseHeader}>
                    <Text style={[styles.exerciseSubject, { color: item.color }]}>{item.subject.toUpperCase()}</Text>
                    <View style={styles.exerciseTime}>
                      <Clock size={12} color="#94A3B8" />
                      <Text style={styles.exerciseTimeText}>15 min</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.exerciseTitle}>{item.title}</Text>
                  <Text style={styles.exerciseDescription} numberOfLines={1}>{item.description}</Text>
                  
                  {/* Barre de progression */}
                  {item.progress !== undefined && (
                    <View style={styles.progressRow}>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
                      </View>
                      <Text style={styles.progressText}>{item.progress}%</Text>
                    </View>
                  )}
                </View>
                
                <View style={[styles.playCircle, { backgroundColor: item.color }]}>
                  <Play size={12} color="white" fill="white" />
                </View>
              </View>
            </BouncyCard>
          ))}
        </View>

        {/* PETIT RAPPEL IA EN BAS */}
        <View style={styles.aiHint}>
            <Brain size={18} color="#6366F1" />
            <Text style={styles.aiHintText}>Besoin d'aide pour un exercice ? Demande à Oumi !</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" }, // Fond gris très clair pour faire ressortir les cartes
  
  header: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  headerLabel: { fontFamily: FONTS.secondary, fontSize: 11, color: "#6366F1", letterSpacing: 1.5, fontWeight: "800" },
  userName: { fontFamily: FONTS.fredoka, fontSize: 24, color: "#1E293B", marginTop: 4 },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: { 
    width: 42, height: 42, borderRadius: 12, backgroundColor: "white", 
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0"
  },
  notifBadge: { 
    position: 'absolute', top: 10, right: 10, width: 7, height: 7, 
    borderRadius: 4, backgroundColor: '#EF4444', zIndex: 1, borderWidth: 1.5, borderColor: '#FFF'
  },

  // Tabs
  tabsContainer: { 
    flexDirection: "row", backgroundColor: "#E2E8F0", 
    marginHorizontal: 24, borderRadius: 16, padding: 4, marginBottom: 24 
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12 },
  tabActive: { backgroundColor: "white", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { fontFamily: FONTS.fredoka, fontSize: 14, color: "#64748B" },
  tabTextActive: { color: "#1E293B", fontWeight: '700' },

  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: 24 },
  
  // Cartes
  exerciseCard: { 
    backgroundColor: "white", borderRadius: 24, marginBottom: 16, 
    borderWidth: 1, borderColor: "#E2E8F0", elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  exerciseContent: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  exerciseIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  exerciseInfo: { flex: 1 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  exerciseSubject: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  exerciseTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exerciseTimeText: { fontSize: 11, color: "#94A3B8", fontWeight: '600' },
  exerciseTitle: { fontFamily: FONTS.fredoka, fontSize: 17, color: "#1E293B" },
  exerciseDescription: { fontSize: 13, color: "#64748B", marginTop: 2 },
  
  playCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },

  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  progressBg: { flex: 1, height: 6, backgroundColor: "#F1F5F9", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 11, fontWeight: "700", color: "#64748B" },

  aiHint: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, marginTop: 10, paddingHorizontal: 40
  },
  aiHintText: { fontSize: 12, color: "#64748B", textAlign: 'center', fontStyle: 'italic' }
});
