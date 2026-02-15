import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeBack } from "@/hooks/useSafeBack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  Sparkles,
  ChevronRight,
  Calculator,
  FileText,
  FlaskConical,
  Languages,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const { width } = Dimensions.get("window");

interface Lesson {
  id: number;
  subject: string;
  title: string;
  duration: number;
  completed: boolean;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

interface DayPlan {
  day: string;
  date: string;
  lessons: Lesson[];
}

const weekDays: DayPlan[] = [
  {
    day: "Lundi",
    date: "10 Fév",
    lessons: [
      {
        id: 1,
        subject: "Mathématiques",
        title: "Les fractions",
        duration: 45,
        completed: true,
        color: "#3B82F6",
        Icon: Calculator,
      },
      {
        id: 2,
        subject: "Français",
        title: "Conjugaison: passé composé",
        duration: 30,
        completed: true,
        color: "#EF4444",
        Icon: FileText,
      },
    ],
  },
  {
    day: "Mardi",
    date: "11 Fév",
    lessons: [
      {
        id: 3,
        subject: "Sciences",
        title: "Le cycle de l'eau",
        duration: 40,
        completed: false,
        color: "#10B981",
        Icon: FlaskConical,
      },
      {
        id: 4,
        subject: "Anglais",
        title: "Vocabulaire: les couleurs",
        duration: 25,
        completed: false,
        color: "#6366F1",
        Icon: Languages,
      },
    ],
  },
  {
    day: "Mercredi",
    date: "12 Fév",
    lessons: [
      {
        id: 5,
        subject: "Histoire",
        title: "La Révolution française",
        duration: 35,
        completed: false,
        color: "#F59E0B",
        Icon: BookOpen,
      },
    ],
  },
];

interface LessonCardProps {
  lesson: Lesson;
  delay: number;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, delay }) => (
  <Animated.View entering={FadeInRight.delay(delay).duration(400)}>
    <TouchableOpacity style={styles.lessonCard} activeOpacity={0.7}>
      <LinearGradient
        colors={[lesson.color + "15", lesson.color + "08"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.lessonGradient}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonIconContainer}>
            <View
              style={[
                styles.lessonIcon,
                { backgroundColor: lesson.color + "30" },
              ]}
            >
              <lesson.Icon size={24} color={lesson.color} />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={[styles.lessonSubject, { color: lesson.color }]}>
                {lesson.subject}
              </Text>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>
          </View>
          {lesson.completed ? (
            <CheckCircle size={24} color={COLORS.primary.DEFAULT} />
          ) : (
            <Circle size={24} color={COLORS.neutral[300]} />
          )}
        </View>
        <View style={styles.lessonFooter}>
          <View style={styles.durationContainer}>
            <Clock size={14} color={COLORS.secondary[500]} />
            <Text style={styles.durationText}>{lesson.duration} min</Text>
          </View>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>
              {lesson.completed ? "Revoir" : "Commencer"}
            </Text>
            <ChevronRight size={16} color={COLORS.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

interface DayCardProps {
  day: DayPlan;
  delay: number;
  isToday?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, delay, isToday }) => {
  const completedCount = day.lessons.filter((l) => l.completed).length;
  const totalCount = day.lessons.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600)}
      style={styles.daySection}
    >
      <View style={styles.dayHeader}>
        <View style={styles.dayHeaderLeft}>
          <View style={[styles.dayDot, isToday && styles.dayDotActive]} />
          <View>
            <Text style={styles.dayName}>
              {day.day} {isToday && "• Aujourd'hui"}
            </Text>
            <Text style={styles.dayDate}>{day.date}</Text>
          </View>
        </View>
        <View style={styles.dayProgress}>
          <Text style={styles.dayProgressText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>

      {day.lessons.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          delay={delay + (index + 1) * 100}
        />
      ))}
    </Animated.View>
  );
};

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const handleBack = useSafeBack();
  const [selectedChild, setSelectedChild] = useState("Adam");

  const totalLessons = weekDays.reduce(
    (sum, day) => sum + day.lessons.length,
    0,
  );
  const completedLessons = weekDays.reduce(
    (sum, day) => sum + day.lessons.filter((l) => l.completed).length,
    0,
  );
  const weekProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan hebdomadaire</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Child Selector */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.childSelector}
        >
          <Text style={styles.childSelectorLabel}>Enfant sélectionné</Text>
          <TouchableOpacity style={styles.childSelectorButton}>
            <Text style={styles.childSelectorName}>{selectedChild}</Text>
            <Text style={styles.childSelectorGrade}>CE2</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Week Summary */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.weekSummary}
        >
          <LinearGradient
            colors={[COLORS.primary.DEFAULT, COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.weekSummaryGradient}
          >
            <View style={styles.weekSummaryHeader}>
              <View>
                <Text style={styles.weekSummaryTitle}>
                  Semaine du 10-16 Février
                </Text>
                <Text style={styles.weekSummarySubtitle}>
                  {completedLessons} sur {totalLessons} leçons complétées
                </Text>
              </View>
              <View style={styles.weekProgressCircle}>
                <Text style={styles.weekProgressText}>{weekProgress}%</Text>
              </View>
            </View>

            <View style={styles.weekProgressBar}>
              <View
                style={[styles.weekProgressFill, { width: `${weekProgress}%` }]}
              />
            </View>

            <View style={styles.weekStats}>
              <View style={styles.weekStat}>
                <BookOpen size={16} color="white" />
                <Text style={styles.weekStatText}>{totalLessons} leçons</Text>
              </View>
              <View style={styles.weekStat}>
                <Clock size={16} color="white" />
                <Text style={styles.weekStatText}>
                  {weekDays.reduce(
                    (sum, day) =>
                      sum + day.lessons.reduce((s, l) => s + l.duration, 0),
                    0,
                  )}{" "}
                  min
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* AI Generate Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <TouchableOpacity style={styles.generateButton} activeOpacity={0.7}>
            <View style={styles.generateIcon}>
              <Sparkles size={20} color="#8B5CF6" />
            </View>
            <View style={styles.generateContent}>
              <Text style={styles.generateTitle}>
                Générer un nouveau plan avec l'IA
              </Text>
              <Text style={styles.generateSubtitle}>
                Adapté au niveau et aux progrès
              </Text>
            </View>
            <ChevronRight size={20} color={COLORS.secondary[400]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Day Plans */}
        {weekDays.map((day, index) => (
          <DayCard
            key={index}
            day={day}
            delay={500 + index * 150}
            isToday={index === 0}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
  },
  // Child Selector
  childSelector: {
    marginBottom: 16,
  },
  childSelectorLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    marginBottom: 8,
    fontWeight: "600",
  },
  childSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  childSelectorName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
  },
  childSelectorGrade: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  // Week Summary
  weekSummary: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  weekSummaryGradient: {
    padding: 20,
  },
  weekSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekSummaryTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  weekSummarySubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.neutral[100],
    opacity: 0.9,
  },
  weekProgressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  weekProgressText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  weekProgressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  weekProgressFill: {
    height: "100%",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 4,
  },
  weekStats: {
    flexDirection: "row",
    gap: 16,
  },
  weekStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weekStatText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.neutral.white,
    fontWeight: "600",
  },
  // Generate Button
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#EDE9FE",
  },
  generateIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  generateContent: {
    flex: 1,
  },
  generateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  generateSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  // Day Section
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.neutral[300],
  },
  dayDotActive: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  dayName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  dayDate: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  dayProgress: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
  },
  dayProgressText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  // Lesson Card
  lessonCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonGradient: {
    padding: 16,
    backgroundColor: COLORS.neutral.white,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lessonIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lessonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonSubject: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  lessonTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[900],
    fontWeight: "600",
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  startButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
});
