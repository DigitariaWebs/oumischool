import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const LESSON_STEPS = [
  {
    id: 1,
    title: "Qu'est-ce qu'une fraction ?",
    content:
      "Une fraction représente une partie d'un tout. Par exemple, si tu coupes une pizza en 4 parts égales et que tu en prends 1, tu as 1/4 de la pizza !",
    example: "1/4",
    visual: "🍕",
  },
  {
    id: 2,
    title: "Les parties d'une fraction",
    content:
      "Une fraction a deux parties : le numérateur (en haut) qui indique combien de parts tu as, et le dénominateur (en bas) qui indique en combien de parts le tout est divisé.",
    example: "3/4",
    visual: "🍰",
  },
  {
    id: 3,
    title: "Exemples de fractions",
    content:
      "Si tu as un gâteau coupé en 8 parts et que tu en manges 3, tu as mangé 3/8 du gâteau. Il reste 5/8 du gâteau !",
    example: "3/8 + 5/8 = 8/8 = 1",
    visual: "🎂",
  },
  {
    id: 4,
    title: "Fractions équivalentes",
    content:
      "Certaines fractions sont égales même si elles s'écrivent différemment ! Par exemple, 1/2 = 2/4 = 4/8. C'est comme diviser la même part en morceaux plus petits.",
    example: "1/2 = 2/4",
    visual: "🍫",
  },
];

export default function MathFractionsLesson() {
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
      <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color="white" />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Les Fractions</Text>

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
          <Text style={styles.visualEmoji}>{step.visual}</Text>

          <Text style={styles.stepTitle}>{step.title}</Text>

          <Text style={styles.stepContent}>{step.content}</Text>

          <View style={styles.exampleCard}>
            <Text style={styles.exampleLabel}>Exemple :</Text>
            <Text style={styles.exampleText}>{step.example}</Text>
          </View>

          {currentStep === 0 && (
            <View style={styles.visualExample}>
              <View style={styles.pizzaContainer}>
                <View style={styles.pizzaRow}>
                  <View style={[styles.pizzaSlice, styles.pizzaSliceFilled]}>
                    <Text style={styles.pizzaEmoji}>🍕</Text>
                  </View>
                  <View style={styles.pizzaSlice}>
                    <Text style={styles.pizzaEmoji}>⬜</Text>
                  </View>
                </View>
                <View style={styles.pizzaRow}>
                  <View style={styles.pizzaSlice}>
                    <Text style={styles.pizzaEmoji}>⬜</Text>
                  </View>
                  <View style={styles.pizzaSlice}>
                    <Text style={styles.pizzaEmoji}>⬜</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.visualLabel}>1 part sur 4 = 1/4</Text>
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.fractionDiagram}>
              <View style={styles.fractionPart}>
                <Text style={styles.fractionNumber}>3</Text>
                <Text style={styles.fractionLabel}>← Numérateur</Text>
              </View>
              <View style={styles.fractionLine} />
              <View style={styles.fractionPart}>
                <Text style={styles.fractionNumber}>4</Text>
                <Text style={styles.fractionLabel}>← Dénominateur</Text>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.visualExample}>
              <View style={styles.cakeRow}>
                <Text style={styles.cakeSlice}>🍰</Text>
                <Text style={styles.cakeSlice}>🍰</Text>
                <Text style={styles.cakeSlice}>🍰</Text>
                <Text style={styles.cakeSliceEmpty}>⬜</Text>
              </View>
              <View style={styles.cakeRow}>
                <Text style={styles.cakeSliceEmpty}>⬜</Text>
                <Text style={styles.cakeSliceEmpty}>⬜</Text>
                <Text style={styles.cakeSliceEmpty}>⬜</Text>
                <Text style={styles.cakeSliceEmpty}>⬜</Text>
              </View>
              <Text style={styles.visualLabel}>
                3 parts mangées sur 8 = 3/8
              </Text>
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.equivalentExample}>
              <View style={styles.equivalentRow}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.barHalf]} />
                  <View style={[styles.bar, styles.barEmpty]} />
                </View>
                <Text style={styles.equivalentText}>1/2</Text>
              </View>

              <Text style={styles.equalsSign}>=</Text>

              <View style={styles.equivalentRow}>
                <View style={styles.barContainer}>
                  <View style={[styles.barQuarter, styles.barHalf]} />
                  <View style={[styles.barQuarter, styles.barHalf]} />
                  <View style={[styles.barQuarter, styles.barEmpty]} />
                  <View style={[styles.barQuarter, styles.barEmpty]} />
                </View>
                <Text style={styles.equivalentText}>2/4</Text>
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
    backgroundColor: "#F0F9FF",
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
  exampleCard: {
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  exampleLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  exampleText: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#3B82F6",
  },
  visualExample: {
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  pizzaContainer: {
    gap: 4,
  },
  pizzaRow: {
    flexDirection: "row",
    gap: 4,
  },
  pizzaSlice: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  pizzaSliceFilled: {
    backgroundColor: "#FED7AA",
  },
  pizzaEmoji: {
    fontSize: 36,
  },
  visualLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[700],
  },
  fractionDiagram: {
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DBEAFE",
    padding: 24,
    borderRadius: 16,
  },
  fractionPart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fractionNumber: {
    fontFamily: FONTS.fredoka,
    fontSize: 48,
    color: "#3B82F6",
    width: 60,
    textAlign: "center",
  },
  fractionLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  fractionLine: {
    width: 80,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  cakeRow: {
    flexDirection: "row",
    gap: 8,
  },
  cakeSlice: {
    fontSize: 36,
  },
  cakeSliceEmpty: {
    fontSize: 36,
    opacity: 0.3,
  },
  equivalentExample: {
    alignItems: "center",
    gap: 16,
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 16,
  },
  equivalentRow: {
    alignItems: "center",
    gap: 12,
  },
  barContainer: {
    flexDirection: "row",
    gap: 2,
  },
  bar: {
    width: 80,
    height: 40,
    borderRadius: 8,
  },
  barQuarter: {
    width: 39,
    height: 40,
    borderRadius: 8,
  },
  barHalf: {
    backgroundColor: "#3B82F6",
  },
  barEmpty: {
    backgroundColor: COLORS.neutral[300],
  },
  equivalentText: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#3B82F6",
  },
  equalsSign: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.secondary[600],
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
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
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
