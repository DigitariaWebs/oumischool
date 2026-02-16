import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, ArrowRight, Sun } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const PLANETS = [
  {
    name: "Mercure",
    emoji: "☿️",
    color: "#94A3B8",
    size: 30,
    distance: "Très proche",
  },
  {
    name: "Vénus",
    emoji: "♀️",
    color: "#FDE047",
    size: 35,
    distance: "Proche",
  },
  {
    name: "Terre",
    emoji: "🌍",
    color: "#3B82F6",
    size: 35,
    distance: "Notre maison !",
  },
  {
    name: "Mars",
    emoji: "♂️",
    color: "#EF4444",
    size: 32,
    distance: "Assez loin",
  },
  {
    name: "Jupiter",
    emoji: "♃",
    color: "#F97316",
    size: 60,
    distance: "Très loin",
  },
  {
    name: "Saturne",
    emoji: "♄",
    color: "#FBBF24",
    size: 55,
    distance: "Très loin",
  },
  {
    name: "Uranus",
    emoji: "♅",
    color: "#06B6D4",
    size: 40,
    distance: "Extrêmement loin",
  },
  {
    name: "Neptune",
    emoji: "♆",
    color: "#6366F1",
    size: 40,
    distance: "Extrêmement loin",
  },
];

const LESSON_STEPS = [
  {
    id: 1,
    title: "Qu'est-ce que le système solaire ?",
    content:
      "Le système solaire, c'est notre maison dans l'espace ! C'est le Soleil et tout ce qui tourne autour de lui : les planètes, les lunes, les astéroïdes et les comètes.",
    emoji: "🌟",
  },
  {
    id: 2,
    title: "Le Soleil - Notre étoile",
    content:
      "Le Soleil est une énorme boule de feu ! C'est une étoile qui nous donne la lumière et la chaleur. Il est tellement grand qu'on pourrait mettre 1 million de Terres dedans !",
    emoji: "☀️",
  },
  {
    id: 3,
    title: "Les planètes rocheuses",
    content:
      "Les 4 premières planètes sont petites et rocheuses comme la Terre. Ce sont : Mercure, Vénus, la Terre et Mars. On peut marcher dessus !",
    emoji: "🪨",
    planetsList: PLANETS.slice(0, 4),
  },
  {
    id: 4,
    title: "Les géantes gazeuses",
    content:
      "Les 4 dernières planètes sont énormes et faites de gaz ! Ce sont Jupiter, Saturne, Uranus et Neptune. On ne peut pas marcher dessus car ce sont des nuages géants !",
    emoji: "💨",
    planetsList: PLANETS.slice(4, 8),
  },
  {
    id: 5,
    title: "Notre planète Terre",
    content:
      "La Terre est spéciale ! C'est la seule planète où on sait qu'il y a de la vie. Elle a de l'eau, de l'air et la bonne température pour les humains, les animaux et les plantes.",
    emoji: "🌍",
  },
];

export default function ScienceSolarSystemLesson() {
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
      <LinearGradient colors={["#10B981", "#059669"]} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color="white" />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Le Système Solaire</Text>

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

          {currentStep === 0 && (
            <View style={styles.solarSystemDiagram}>
              <View style={styles.sunContainer}>
                <Text style={styles.sunEmoji}>☀️</Text>
                <Text style={styles.sunLabel}>Soleil</Text>
              </View>
              <View style={styles.orbitsContainer}>
                {PLANETS.slice(0, 4).map((planet, index) => (
                  <Animated.View
                    key={planet.name}
                    entering={FadeInUp.delay(100 * index).springify()}
                    style={styles.planetOrbit}
                  >
                    <Text style={styles.planetEmoji}>{planet.emoji}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.sunCard}>
              <View style={styles.sunFact}>
                <Text style={styles.sunFactLabel}>Taille :</Text>
                <Text style={styles.sunFactValue}>
                  1,4 million de km de diamètre
                </Text>
              </View>
              <View style={styles.sunFact}>
                <Text style={styles.sunFactLabel}>Température :</Text>
                <Text style={styles.sunFactValue}>5 500°C à la surface</Text>
              </View>
              <View style={styles.sunFact}>
                <Text style={styles.sunFactLabel}>Distance :</Text>
                <Text style={styles.sunFactValue}>
                  150 millions de km de la Terre
                </Text>
              </View>
            </View>
          )}

          {step.planetsList && (
            <View style={styles.planetsGrid}>
              {step.planetsList.map((planet, index) => (
                <Animated.View
                  key={planet.name}
                  entering={FadeInUp.delay(100 * index).springify()}
                  style={[
                    styles.planetCard,
                    { backgroundColor: planet.color + "20" },
                  ]}
                >
                  <Text
                    style={[styles.planetCardEmoji, { fontSize: planet.size }]}
                  >
                    {planet.emoji}
                  </Text>
                  <Text style={styles.planetCardName}>{planet.name}</Text>
                  <Text style={styles.planetCardDistance}>
                    {planet.distance}
                  </Text>
                </Animated.View>
              ))}
            </View>
          )}

          {currentStep === 4 && (
            <View style={styles.earthCard}>
              <View style={styles.earthFact}>
                <Text style={styles.earthFactEmoji}>💧</Text>
                <Text style={styles.earthFactText}>70% d'eau</Text>
              </View>
              <View style={styles.earthFact}>
                <Text style={styles.earthFactEmoji}>🌡️</Text>
                <Text style={styles.earthFactText}>Température idéale</Text>
              </View>
              <View style={styles.earthFact}>
                <Text style={styles.earthFactEmoji}>🌬️</Text>
                <Text style={styles.earthFactText}>Atmosphère protectrice</Text>
              </View>
              <View style={styles.earthFact}>
                <Text style={styles.earthFactEmoji}>🌙</Text>
                <Text style={styles.earthFactText}>1 lune (la Lune !)</Text>
              </View>
            </View>
          )}

          {currentStep === LESSON_STEPS.length - 1 && (
            <View style={styles.funFactCard}>
              <Text style={styles.funFactTitle}>🤓 Le savais-tu ?</Text>
              <Text style={styles.funFactText}>
                Si le Soleil était de la taille d'un ballon de foot, la Terre
                serait comme une petite bille à 25 mètres de distance !
              </Text>
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
    backgroundColor: "#ECFDF5",
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
    backgroundColor: "#FBBF24",
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
  solarSystemDiagram: {
    alignItems: "center",
    gap: 20,
    backgroundColor: "#1E293B",
    padding: 24,
    borderRadius: 16,
  },
  sunContainer: {
    alignItems: "center",
    gap: 8,
  },
  sunEmoji: {
    fontSize: 60,
  },
  sunLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#FDE047",
  },
  orbitsContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  planetOrbit: {
    alignItems: "center",
  },
  planetEmoji: {
    fontSize: 32,
  },
  sunCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  sunFact: {
    gap: 4,
  },
  sunFactLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[700],
  },
  sunFactValue: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  planetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  planetCard: {
    width: "45%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  planetCardEmoji: {
    fontSize: 40,
  },
  planetCardName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  planetCardDistance: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    textAlign: "center",
  },
  earthCard: {
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  earthFact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
  },
  earthFactEmoji: {
    fontSize: 28,
  },
  earthFactText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[800],
    flex: 1,
  },
  funFactCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  funFactTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  funFactText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[700],
    lineHeight: 24,
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
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
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
