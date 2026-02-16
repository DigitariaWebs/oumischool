import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, ArrowRight, Clock } from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const LESSON_STEPS = [
  {
    id: 1,
    title: "Le Présent",
    content:
      "Le présent sert à parler de ce qui se passe maintenant, en ce moment. Par exemple : Je mange, tu joues, il court.",
    examples: [
      { text: "Je mange une pomme", highlight: "maintenant" },
      { text: "Tu joues au foot", highlight: "en ce moment" },
      { text: "Elle lit un livre", highlight: "actuellement" },
    ],
    emoji: "⏰",
  },
  {
    id: 2,
    title: "Le Passé composé",
    content:
      "Le passé composé sert à parler de ce qui s'est déjà passé, de ce qui est terminé. On utilise 'avoir' ou 'être' + le participe passé.",
    examples: [
      { text: "J'ai mangé une pomme", highlight: "hier" },
      { text: "Tu as joué au foot", highlight: "ce matin" },
      { text: "Elle est allée à l'école", highlight: "la semaine dernière" },
    ],
    emoji: "⏮️",
  },
  {
    id: 3,
    title: "L'Imparfait",
    content:
      "L'imparfait sert à décrire des actions du passé qui duraient ou se répétaient. Par exemple : Quand j'étais petit, je jouais souvent.",
    examples: [
      { text: "Quand j'étais petit, je jouais dehors", highlight: "habitude" },
      { text: "Il faisait beau", highlight: "description" },
      { text: "Nous allions à la plage chaque été", highlight: "répétition" },
    ],
    emoji: "🔄",
  },
  {
    id: 4,
    title: "Le Futur",
    content:
      "Le futur sert à parler de ce qui va se passer plus tard, demain, dans le futur. On peut utiliser 'aller + infinitif' ou le futur simple.",
    examples: [
      { text: "Je vais manger une pomme", highlight: "tout à l'heure" },
      { text: "Tu joueras au foot", highlight: "demain" },
      { text: "Elle ira à l'école", highlight: "la semaine prochaine" },
    ],
    emoji: "⏭️",
  },
];

export default function FrenchTensesLesson() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const step = LESSON_STEPS[currentStep];
  const isLastStep = currentStep === LESSON_STEPS.length - 1;

  const handleNext = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }

    if (isLastStep) {
      router.back();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / LESSON_STEPS.length) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#EC4899", "#DB2777"]} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color="white" />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Les Temps en Français</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Étape {currentStep + 1}/{LESSON_STEPS.length}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={`step-${currentStep}`}
          entering={FadeInDown.springify().damping(14)}
          style={styles.lessonCard}
        >
          <Text style={styles.visualEmoji}>{step.emoji}</Text>

          <Text style={styles.stepTitle}>{step.title}</Text>

          <Text style={styles.stepContent}>{step.content}</Text>

          <View style={styles.examplesContainer}>
            <View style={styles.examplesHeader}>
              <Clock size={20} color="#EC4899" />
              <Text style={styles.examplesTitle}>Exemples :</Text>
            </View>

            {step.examples.map((example, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(100 * index).springify()}
                style={styles.exampleCard}
              >
                <View style={styles.exampleBullet}>
                  <Text style={styles.exampleBulletText}>{index + 1}</Text>
                </View>
                <View style={styles.exampleContent}>
                  <Text style={styles.exampleText}>{example.text}</Text>
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightText}>{example.highlight}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {currentStep === 0 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Astuce</Text>
              <Text style={styles.tipText}>
                Pour savoir si c'est le présent, demande-toi : "Est-ce que ça se passe maintenant ?"
              </Text>
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Astuce</Text>
              <Text style={styles.tipText}>
                Le passé composé utilise toujours un auxiliaire (avoir ou être) + un participe passé (mangé, joué, allé...)
              </Text>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Astuce</Text>
              <Text style={styles.tipText}>
                L'imparfait se termine souvent par -ais, -ais, -ait, -ions, -iez, -aient
              </Text>
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>📊 Récapitulatif</Text>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Passé ⏮️</Text>
                <Text style={styles.comparisonExample}>J'ai mangé</Text>
              </View>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Présent ⏰</Text>
                <Text style={styles.comparisonExample}>Je mange</Text>
              </View>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Futur ⏭️</Text>
                <Text style={styles.comparisonExample}>Je vais manger</Text>
              </View>
            </View>
          )}
        </Animated.View>

        <View style={styles.navigation}>
          {currentStep > 0 && (
            <Pressable
              onPress={handlePrevious}
              style={({ pressed }) => [
                styles.navButton,
                styles.prevButton,
                pressed && styles.navButtonPressed,
              ]}
            >
              <ArrowLeft size={24} color={COLORS.secondary[700]} />
              <Text style={styles.prevButtonText}>Précédent</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              pressed && styles.navButtonPressed,
              currentStep === 0 && styles.nextButtonFullWidth,
            ]}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? "Terminer" : "Suivant"}
            </Text>
            {isLastStep ? (
              <CheckCircle size={24} color="white" />
            ) : (
              <ArrowRight size={24} color="white" />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8",
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerContent: {
    gap: 16,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "white",
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: "white",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  lessonCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 20,
  },
  visualEmoji: {
    fontSize: 64,
    textAlign: "center",
  },
  stepTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    color: COLORS.secondary[900],
    textAlign: "center",
  },
  stepContent: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.secondary[700],
    lineHeight: 28,
    textAlign: "center",
  },
  examplesContainer: {
    gap: 12,
    marginTop: 8,
  },
  examplesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  examplesTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#EC4899",
  },
  exampleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FDF2F8",
    padding: 16,
    borderRadius: 16,
  },
  exampleBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
  },
  exampleBulletText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "white",
  },
  exampleContent: {
    flex: 1,
    gap: 8,
  },
  exampleText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[800],
    lineHeight: 24,
  },
  highlightBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  highlightText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "#DC2626",
    fontStyle: "italic",
  },
  tipCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  tipTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  tipText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[700],
    lineHeight: 24,
  },
  comparisonCard: {
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  comparisonTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  comparisonLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[700],
  },
  comparisonExample: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#3B82F6",
  },
  navigation: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    justifyContent: "center",
  },
  navButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  prevButton: {
    flex: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#EC4899",
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonFullWidth: {
    flex: 1,
  },
  prevButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[700],
  },
  nextButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "white",
  },
});
