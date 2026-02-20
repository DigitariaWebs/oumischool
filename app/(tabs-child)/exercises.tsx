import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Calculator,
  FileText,
  Globe,
  Gamepad2,
  BookOpen,
} from "lucide-react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import { AnimatedSection } from "@/components/ui";

const GAMES = [
  {
    id: 1,
    subject: "Maths",
    title: "Jeu d'addition",
    description: "Additionne les nombres !",
    progress: 80,
    Icon: Calculator,
    color: "#3B82F6",
    route: "/games/math-addition",
  },
  {
    id: 2,
    subject: "Français",
    title: "Conjugaison",
    description: "Conjugue les verbes",
    progress: 60,
    Icon: FileText,
    color: "#EC4899",
    route: "/games/french-conjugation",
  },
  {
    id: 3,
    subject: "Sciences",
    title: "Mémoire des planètes",
    description: "Trouve les paires !",
    progress: 45,
    Icon: Globe,
    color: "#10B981",
    route: "/games/planets-memory",
  },
];

const LESSONS = [
  {
    id: 1,
    subject: "Maths",
    title: "Les fractions",
    description: "Apprends les fractions",
    Icon: Calculator,
    color: "#3B82F6",
    route: "/lessons/math-fractions",
  },
  {
    id: 2,
    subject: "Français",
    title: "Les temps",
    description: "Présent, passé, futur",
    Icon: FileText,
    color: "#EC4899",
    route: "/lessons/french-tenses",
  },
  {
    id: 3,
    subject: "Sciences",
    title: "Le système solaire",
    description: "Découvre les planètes",
    Icon: Globe,
    color: "#10B981",
    route: "/lessons/science-solar-system",
  },
];

const springConfig = { damping: 12, stiffness: 150 };

function BouncyCard({
  children,
  onPress,
  delay,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  delay: number;
  style?: object;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(14)}
      style={[style, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, springConfig);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springConfig);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function ChildExercisesScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = React.useState<"games" | "lessons">(
    "games",
  );

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
            <Text style={styles.headerTitle}>Mes activités</Text>
            <Text style={styles.headerSubtitle}>Continue, {user?.name} !</Text>
          </LinearGradient>
        </AnimatedSection>

        <AnimatedSection
          delay={200}
          direction="up"
          style={styles.tabsContainer}
        >
          <Pressable
            onPress={() => setActiveTab("games")}
            style={({ pressed }) => [
              styles.tab,
              activeTab === "games" && styles.tabActive,
              pressed && styles.tabPressed,
            ]}
          >
            <Gamepad2
              size={24}
              color={activeTab === "games" ? "#3B82F6" : COLORS.secondary[500]}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "games" && styles.tabTextActive,
              ]}
            >
              Mini-jeux
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("lessons")}
            style={({ pressed }) => [
              styles.tab,
              activeTab === "lessons" && styles.tabActive,
              pressed && styles.tabPressed,
            ]}
          >
            <BookOpen
              size={24}
              color={
                activeTab === "lessons" ? "#3B82F6" : COLORS.secondary[500]
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "lessons" && styles.tabTextActive,
              ]}
            >
              Leçons
            </Text>
          </Pressable>
        </AnimatedSection>

        <View style={styles.section}>
          {activeTab === "games" && (
            <>
              {GAMES.map((game, index) => (
                <BouncyCard
                  key={game.id}
                  delay={300 + index * 120}
                  style={styles.exerciseCard}
                  onPress={() => {
                    if (game.route) {
                      router.push(game.route as any);
                    }
                  }}
                >
                  <View style={styles.exerciseContent}>
                    <View
                      style={[
                        styles.exerciseIcon,
                        { backgroundColor: game.color + "25" },
                      ]}
                    >
                      <game.Icon size={36} color={game.color} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseTitle}>{game.title}</Text>
                      <Text style={styles.exerciseDescription}>
                        {game.description}
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${game.progress}%`,
                              backgroundColor: game.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {game.progress}% fait
                      </Text>
                    </View>
                    <ChevronRight size={28} color={COLORS.secondary[400]} />
                  </View>
                </BouncyCard>
              ))}
            </>
          )}

          {activeTab === "lessons" && (
            <>
              {LESSONS.map((lesson, index) => (
                <BouncyCard
                  key={lesson.id}
                  delay={300 + index * 120}
                  style={styles.exerciseCard}
                  onPress={() => {
                    if (lesson.route) {
                      router.push(lesson.route as any);
                    }
                  }}
                >
                  <View style={styles.exerciseContent}>
                    <View
                      style={[
                        styles.exerciseIcon,
                        { backgroundColor: lesson.color + "25" },
                      ]}
                    >
                      <lesson.Icon size={36} color={lesson.color} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseTitle}>{lesson.title}</Text>
                      <Text style={styles.exerciseDescription}>
                        {lesson.description}
                      </Text>
                    </View>
                    <ChevronRight size={28} color={COLORS.secondary[400]} />
                  </View>
                </BouncyCard>
              ))}
            </>
          )}
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
    paddingBottom: 28,
    paddingHorizontal: 24,
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
  },
  section: {
    paddingHorizontal: 24,
  },
  exerciseCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  exerciseContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  exerciseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  exerciseDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.neutral.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tabActive: {
    backgroundColor: "#DBEAFE",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  tabPressed: {
    transform: [{ scale: 0.97 }],
  },
  tabText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  tabTextActive: {
    color: "#3B82F6",
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
});
