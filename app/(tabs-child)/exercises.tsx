import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import {
  PenLine,
  ChevronRight,
  Calculator,
  FileText,
  Globe,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

const EXERCISES = [
  {
    id: 1,
    subject: "Maths",
    title: "Addition jusqu'à 100",
    progress: 80,
    Icon: Calculator,
    color: "#3B82F6",
  },
  {
    id: 2,
    subject: "Français",
    title: "Conjugaison",
    progress: 60,
    Icon: FileText,
    color: "#EC4899",
  },
  {
    id: 3,
    subject: "Sciences",
    title: "Les planètes",
    progress: 0,
    Icon: Globe,
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
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function ChildExercisesScreen() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(14)}
          style={styles.header}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Mes jeux</Text>
            <Text style={styles.headerSubtitle}>Continue, {user?.name} !</Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          {EXERCISES.map((ex, index) => (
            <BouncyCard
              key={ex.id}
              delay={300 + index * 120}
              style={styles.exerciseCard}
            >
              <View style={styles.exerciseContent}>
                <View
                  style={[
                    styles.exerciseIcon,
                    { backgroundColor: ex.color + "25" },
                  ]}
                >
                  <ex.Icon size={36} color={ex.color} />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{ex.title}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${ex.progress}%`, backgroundColor: ex.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{ex.progress}% fait</Text>
                </View>
                <ChevronRight size={28} color={COLORS.secondary[400]} />
              </View>
            </BouncyCard>
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
    marginBottom: 12,
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
