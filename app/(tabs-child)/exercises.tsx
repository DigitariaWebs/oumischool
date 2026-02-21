import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Search, Bell, Sparkles, Clock, Play, ChevronRight, Calculator, FileText, Globe, Gamepad2, BookOpen } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// --- DONNÉES CONSERVÉES ---
const GAMES = [
  { id: 1, subject: "Maths", title: "Jeu d'addition", description: "Additionne les nombres !", progress: 80, Icon: Calculator, color: "#3B82F6", route: "/games/math-addition" },
  { id: 2, subject: "Français", title: "Conjugaison", description: "Conjugue les verbes", progress: 60, Icon: FileText, color: "#EC4899", route: "/games/french-conjugation" },
  { id: 3, subject: "Sciences", title: "Mémoire des planètes", description: "Trouve les paires !", progress: 45, Icon: Globe, color: "#10B981", route: "/games/planets-memory" },
];

const LESSONS = [
  { id: 1, subject: "Maths", title: "Les fractions", description: "Apprends les fractions", Icon: Calculator, color: "#3B82F6", route: "/lessons/math-fractions" },
  { id: 2, subject: "Français", title: "Les temps", description: "Présent, passé, futur", Icon: FileText, color: "#EC4899", route: "/lessons/french-tenses" },
  { id: 3, subject: "Sciences", title: "Le système solaire", description: "Découvre les planètes", Icon: Globe, color: "#10B981", route: "/lessons/science-solar-system" },
];

const springConfig = { damping: 12, stiffness: 150 };

// --- GARDE TA LOGIQUE DE BOUNCY CARD ---
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
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = React.useState<"games" | "lessons">("games");

  const data = activeTab === "games" ? GAMES : LESSONS;

  return (
    <View style={styles.container}>
      {/* HEADER REDESIGNÉ - MÊME STYLE QUE LE DASHBOARD */}
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

      {/* TABS REDESIGNÉS - STYLE PHOTO AVEC FOND GRIS ET OMBRE */}
      <View style={styles.tabsContainer}>
        <Pressable 
          onPress={() => setActiveTab("games")} 
          style={({ pressed }) => [
            styles.tab, 
            activeTab === "games" && styles.tabActive,
            pressed && styles.btnPressed
          ]}
        >
          <Text style={[styles.tabText, activeTab === "games" && styles.tabTextActive]}>Mini-jeux</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab("lessons")} 
          style={({ pressed }) => [
            styles.tab, 
            activeTab === "lessons" && styles.tabActive,
            pressed && styles.btnPressed
          ]}
        >
          <Text style={[styles.tabText, activeTab === "lessons" && styles.tabTextActive]}>Leçons</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          {data.map((item, index) => (
            <BouncyCard 
              key={item.id} 
              delay={200 + index * 100} 
              style={styles.exerciseCard} 
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.exerciseContent}>
                <View style={[styles.exerciseIcon, { backgroundColor: item.color + "20" }]}>
                  <item.Icon size={26} color={item.color} />
                </View>
                
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseSubject}>{item.subject}</Text>
                    <View style={styles.exerciseTime}>
                      <Clock size={10} color="#94A3B8" />
                      <Text style={styles.exerciseTimeText}>15 min</Text>
                    </View>
                  </View>
                  <Text style={styles.exerciseTitle}>{item.title}</Text>
                  <Text style={styles.exerciseDescription}>{item.description}</Text>
                  
                  {/* Barre de progression seulement si elle existe */}
                  {(item as any).progress !== undefined && (
                    <View style={styles.progressRow}>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${(item as any).progress}%`, backgroundColor: item.color }]} />
                      </View>
                      <Text style={styles.progressText}>{(item as any).progress}%</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.playCircle}>
                  <Play size={12} color="white" fill="white" />
                </View>
              </View>
            </BouncyCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  
  // Header redesigné - exactement comme le dashboard
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

  // Tabs redesignés - style photo
  tabsContainer: { 
    flexDirection: "row", 
    backgroundColor: "#F1F5F9", 
    marginHorizontal: 24, 
    borderRadius: 20, 
    padding: 6, 
    marginBottom: 24 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: "center", 
    borderRadius: 16,
  },
  tabActive: { 
    backgroundColor: "#FFFFFF", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  tabText: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 15, 
    color: "#64748B" 
  },
  tabTextActive: { 
    color: "#1E293B",
    fontWeight: '600',
  },

  scrollContent: { paddingBottom: 120 },
  section: { paddingHorizontal: 24 },
  
  // Cartes redesignées - style photo
  exerciseCard: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 24, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseContent: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
    gap: 12,
  },
  exerciseIcon: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    justifyContent: "center", 
    alignItems: "center", 
  },
  exerciseInfo: { 
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseSubject: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: "#64748B",
  },
  exerciseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseTimeText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: '500',
  },
  exerciseTitle: { 
    fontFamily: FONTS.fredoka, 
    fontSize: 16, 
    color: "#1E293B", 
    marginBottom: 2,
  },
  exerciseDescription: { 
    fontFamily: FONTS.secondary, 
    fontSize: 13, 
    color: "#64748B",
    marginBottom: 8,
  },
  
  playCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: "#6366F1",
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  progressRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10,
    marginTop: 4,
  },
  progressBg: { 
    flex: 1, 
    height: 6, 
    backgroundColor: "#F1F5F9", 
    borderRadius: 3, 
    overflow: "hidden" 
  },
  progressFill: { 
    height: "100%", 
    borderRadius: 3 
  },
  progressText: { 
    fontSize: 11, 
    fontWeight: "700", 
    color: "#475569" 
  }
});