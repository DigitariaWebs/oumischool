import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Star,
  Trophy,
  ChevronRight,
  Play,
  Sparkles,
  Calculator,
  FileText,
  Droplets,
  Flame,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

const TODAY_LESSONS = [
  {
    id: 1,
    subject: "Maths",
    title: "Les fractions",
    duration: 25,
    completed: false,
    Icon: Calculator,
    color: "#3B82F6",
  },
  {
    id: 2,
    subject: "Français",
    title: "Conjugaison",
    duration: 20,
    completed: true,
    Icon: FileText,
    color: "#EC4899",
  },
  {
    id: 3,
    subject: "Sciences",
    title: "L'eau",
    duration: 30,
    completed: false,
    Icon: Droplets,
    color: "#10B981",
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
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function ChildDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const progress = 68;
  const streak = 5;
  const points = 420;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - Big, friendly, animated */}
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(14)}
          style={styles.headerContainer}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Salut {user?.name} !</Text>
                <Text style={styles.subGreeting}>Prêt à apprendre ?</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.pointsBadge,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
              >
                <Star size={24} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.pointsText}>{points}</Text>
              </Pressable>
            </View>

            {/* Stats - Big numbers, easy to read */}
            <Animated.View
              entering={FadeInUp.delay(300).springify().damping(14)}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <Flame size={32} color="#FF9F43" />
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Jours</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValueBig}>{progress}%</Text>
                <Text style={styles.statLabel}>Progrès</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValueBig}>3</Text>
                <Text style={styles.statLabel}>Leçons</Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Today's Lessons - Big cards, easy to tap */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify().damping(14)}
            style={styles.sectionTitle}
          >
            Aujourd'hui
          </Animated.Text>

          {TODAY_LESSONS.map((lesson, index) => (
            <BouncyCard
              key={lesson.id}
              delay={500 + index * 120}
              onPress={() => {}}
              style={styles.lessonCard}
            >
              <View style={styles.lessonCardContent}>
                <View
                  style={[
                    styles.lessonIcon,
                    { backgroundColor: lesson.color + "25" },
                  ]}
                >
                  <lesson.Icon size={36} color={lesson.color} />
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.subject} • {lesson.duration} min
                  </Text>
                </View>
                {lesson.completed ? (
                  <View style={styles.completedBadge}>
                    <Trophy size={28} color={COLORS.primary.DEFAULT} />
                    <Text style={styles.completedText}>Fait !</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.playButton,
                      { backgroundColor: lesson.color },
                    ]}
                  >
                    <Play size={32} color="white" fill="white" />
                  </View>
                )}
              </View>
            </BouncyCard>
          ))}
        </View>

        {/* AI Coach - Big, inviting */}
        <BouncyCard delay={950} style={styles.ctaBanner}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push("/ai-coach")}
            style={styles.ctaTouchable}
          >
            <LinearGradient
              colors={["#8B5CF6", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Sparkles size={40} color="white" />
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>Besoin d'aide ?</Text>
                <Text style={styles.ctaDescription}>Pose tes questions !</Text>
              </View>
              <ChevronRight size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </BouncyCard>
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
  headerContainer: {
    marginBottom: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  subGreeting: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  pointsText: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.neutral.white,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.neutral.white,
    marginTop: 4,
    marginBottom: 4,
  },
  statValueBig: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.95)",
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    color: COLORS.secondary[900],
    marginBottom: 20,
  },
  lessonCard: {
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
  lessonCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  lessonIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
    marginBottom: 6,
  },
  lessonMeta: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  completedBadge: {
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },
  completedText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.primary.DEFAULT,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaBanner: {
    marginHorizontal: 24,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaTouchable: {
    borderRadius: 28,
    overflow: "hidden",
  },
  ctaGradient: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ctaText: {},
  ctaTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  ctaDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
  },
});
