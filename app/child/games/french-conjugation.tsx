import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, Trophy, CheckCircle } from "lucide-react-native";
import Animated, { FadeInDown, ZoomIn, ZoomOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const VERBS = [
  {
    infinitive: "manger",
    subject: "je",
    conjugation: "mange",
    translation: "to eat",
  },
  {
    infinitive: "finir",
    subject: "tu",
    conjugation: "finis",
    translation: "to finish",
  },
  {
    infinitive: "être",
    subject: "il/elle",
    conjugation: "est",
    translation: "to be",
  },
  {
    infinitive: "avoir",
    subject: "nous",
    conjugation: "avons",
    translation: "to have",
  },
  {
    infinitive: "aller",
    subject: "vous",
    conjugation: "allez",
    translation: "to go",
  },
  {
    infinitive: "faire",
    subject: "ils/elles",
    conjugation: "font",
    translation: "to do/make",
  },
  {
    infinitive: "parler",
    subject: "je",
    conjugation: "parle",
    translation: "to speak",
  },
  {
    infinitive: "venir",
    subject: "tu",
    conjugation: "viens",
    translation: "to come",
  },
];

export default function FrenchConjugationGame() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [totalQuestions] = useState(8);
  const [questions, setQuestions] = useState<typeof VERBS>([]);

  useEffect(() => {
    // Shuffle and select questions
    const shuffled = [...VERBS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
  }, [totalQuestions]);

  const currentVerb = questions[currentQuestion];

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const isCorrect =
      userAnswer.trim().toLowerCase() === currentVerb.conjugation.toLowerCase();

    setShowFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(() => {
      setShowFeedback(null);
      setUserAnswer("");
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1500);
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  if (!currentVerb) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#EC4899", "#DB2777"]} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color="white" />
        </Pressable>

        <View style={styles.headerContent}>
          <View style={styles.scoreContainer}>
            <Star size={24} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.scoreText}>{score}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1}/{totalQuestions}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View
          key={`question-${currentQuestion}`}
          entering={FadeInDown.springify()}
          style={styles.questionCard}
        >
          <Text style={styles.questionTitle}>Conjugue le verbe :</Text>

          <View style={styles.verbContainer}>
            <Text style={styles.infinitive}>{currentVerb.infinitive}</Text>
            <Text style={styles.translation}>({currentVerb.translation})</Text>
          </View>

          <View style={styles.sentenceContainer}>
            <Text style={styles.subject}>{currentVerb.subject}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="..."
                placeholderTextColor={COLORS.secondary[400]}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSubmit}
                editable={showFeedback === null}
              />
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!userAnswer.trim() || showFeedback !== null}
            style={({ pressed }) => [
              styles.submitButton,
              (!userAnswer.trim() || showFeedback !== null) &&
                styles.submitButtonDisabled,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>Vérifier</Text>
            <CheckCircle size={24} color="white" />
          </Pressable>
        </Animated.View>

        {showFeedback && (
          <Animated.View
            entering={ZoomIn.springify()}
            exiting={ZoomOut}
            style={[
              styles.feedbackContainer,
              showFeedback === "correct"
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            {showFeedback === "correct" ? (
              <>
                <Trophy size={32} color="white" />
                <Text style={styles.feedbackText}>Parfait ! 🎉</Text>
              </>
            ) : (
              <View style={styles.feedbackContent}>
                <Text style={styles.feedbackText}>
                  Presque ! La bonne réponse est :
                </Text>
                <Text style={styles.correctAnswerText}>
                  {currentVerb.subject} {currentVerb.conjugation}
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
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
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: "flex-start",
  },
  scoreText: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
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
    padding: 24,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 24,
  },
  questionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 20,
    color: COLORS.secondary[600],
  },
  verbContainer: {
    alignItems: "center",
    gap: 8,
  },
  infinitive: {
    fontFamily: FONTS.fredoka,
    fontSize: 40,
    color: "#EC4899",
  },
  translation: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[500],
    fontStyle: "italic",
  },
  sentenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  subject: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.secondary[900],
  },
  inputWrapper: {
    borderBottomWidth: 3,
    borderBottomColor: "#EC4899",
    minWidth: 150,
  },
  input: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.secondary[900],
    textAlign: "center",
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.secondary[300],
    shadowOpacity: 0,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  submitButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "white",
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    padding: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  feedbackCorrect: {
    backgroundColor: "#10B981",
  },
  feedbackWrong: {
    backgroundColor: "#EF4444",
  },
  feedbackContent: {
    alignItems: "center",
    gap: 8,
  },
  feedbackText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  correctAnswerText: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
});
