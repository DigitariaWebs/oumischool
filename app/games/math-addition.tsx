import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated as RNAnimated,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, Trophy } from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

export default function MathAdditionGame() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [totalQuestions] = useState(10);

  const scaleAnim = new RNAnimated.Value(1);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 50) + 1;
    const n2 = Math.floor(Math.random() * 50) + 1;
    const answer = n1 + n2;

    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(answer);

    // Generate 4 options including the correct answer
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10;
      if (wrong !== answer && wrong > 0 && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = [...wrongOptions, answer].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (selected: number) => {
    const isCorrect = selected === correctAnswer;

    setShowFeedback(isCorrect ? "correct" : "wrong");

    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      RNAnimated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
        generateQuestion();
      } else {
        // Game finished
      }
    }, 1000);
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        style={styles.header}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
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
          <Text style={styles.questionTitle}>Combien font :</Text>
          <View style={styles.equationContainer}>
            <Text style={styles.number}>{num1}</Text>
            <Text style={styles.operator}>+</Text>
            <Text style={styles.number}>{num2}</Text>
            <Text style={styles.operator}>=</Text>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Animated.View
              key={`${currentQuestion}-${option}`}
              entering={ZoomIn.delay(100 * index).springify()}
            >
              <Pressable
                onPress={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.optionButtonPressed,
                  showFeedback === "correct" &&
                    option === correctAnswer &&
                    styles.optionCorrect,
                  showFeedback === "wrong" &&
                    option === correctAnswer &&
                    styles.optionCorrect,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

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
                <Text style={styles.feedbackText}>Bravo ! 🎉</Text>
              </>
            ) : (
              <>
                <Text style={styles.feedbackText}>
                  Essaie encore ! La bonne réponse est {correctAnswer}
                </Text>
              </>
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
    marginBottom: 32,
  },
  questionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 20,
    color: COLORS.secondary[600],
    marginBottom: 24,
  },
  equationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  number: {
    fontFamily: FONTS.fredoka,
    fontSize: 48,
    color: COLORS.secondary[900],
  },
  operator: {
    fontFamily: FONTS.fredoka,
    fontSize: 40,
    color: "#3B82F6",
  },
  questionMark: {
    fontFamily: FONTS.fredoka,
    fontSize: 48,
    color: "#EC4899",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  optionButton: {
    backgroundColor: "white",
    width: 150,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  optionCorrect: {
    backgroundColor: "#10B981",
  },
  optionText: {
    fontFamily: FONTS.fredoka,
    fontSize: 36,
    color: COLORS.secondary[900],
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
  feedbackText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "white",
  },
});
