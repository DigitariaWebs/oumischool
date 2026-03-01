import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, Trophy } from "lucide-react-native";
import Animated, { ZoomIn, FlipInEasyY } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const PLANETS = [
  { id: 1, name: "Mercure", emoji: "☿️", color: "#94A3B8" },
  { id: 2, name: "Vénus", emoji: "♀️", color: "#FDE047" },
  { id: 3, name: "Terre", emoji: "🌍", color: "#3B82F6" },
  { id: 4, name: "Mars", emoji: "♂️", color: "#EF4444" },
  { id: 5, name: "Jupiter", emoji: "♃", color: "#F97316" },
  { id: 6, name: "Saturne", emoji: "♄", color: "#FBBF24" },
];

interface Card {
  id: number;
  planetId: number;
  name: string;
  emoji: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function PlanetsMemoryGame() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [canFlip, setCanFlip] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      checkMatch();
    }
  }, [flippedCards]);

  const initializeGame = () => {
    const selectedPlanets = PLANETS.slice(0, 6);
    const cardPairs = selectedPlanets.flatMap((planet) => [
      {
        id: planet.id * 2 - 1,
        planetId: planet.id,
        name: planet.name,
        emoji: planet.emoji,
        color: planet.color,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: planet.id * 2,
        planetId: planet.id,
        name: planet.name,
        emoji: planet.emoji,
        color: planet.color,
        isFlipped: false,
        isMatched: false,
      },
    ]);

    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardPress = (cardId: number) => {
    if (!canFlip) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)),
    );

    setFlippedCards((prev) => [...prev, cardId]);
  };

  const checkMatch = () => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    setMoves(moves + 1);

    setTimeout(() => {
      if (
        firstCard &&
        secondCard &&
        firstCard.planetId === secondCard.planetId
      ) {
        // Match found
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c,
          ),
        );
        setScore(score + 20);

        // Check if game is won
        const allMatched = cards.every(
          (c) => c.isMatched || c.id === firstId || c.id === secondId,
        );
        if (allMatched) {
          setGameWon(true);
        }
      } else {
        // No match, flip back
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c,
          ),
        );
      }

      setFlippedCards([]);
      setCanFlip(true);
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setMoves(0);
    setFlippedCards([]);
    setCanFlip(true);
    setGameWon(false);
    initializeGame();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#10B981", "#059669"]} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color="white" />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Mémoire des Planètes</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Star size={20} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.statText}>{score}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Coups</Text>
              <Text style={styles.statText}>{moves}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.instruction}>Trouve les paires de planètes !</Text>

        <View style={styles.grid}>
          {cards.map((card, index) => (
            <Animated.View
              key={card.id}
              entering={ZoomIn.delay(index * 50).springify()}
              style={styles.cardWrapper}
            >
              <Pressable
                onPress={() => handleCardPress(card.id)}
                disabled={!canFlip || card.isFlipped || card.isMatched}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                  card.isMatched && styles.cardMatched,
                ]}
              >
                {card.isFlipped || card.isMatched ? (
                  <Animated.View
                    entering={FlipInEasyY.springify()}
                    style={[
                      styles.cardFront,
                      { backgroundColor: card.color + "30" },
                    ]}
                  >
                    <Text style={styles.cardEmoji}>{card.emoji}</Text>
                    <Text style={styles.cardName}>{card.name}</Text>
                  </Animated.View>
                ) : (
                  <View style={styles.cardBack}>
                    <Text style={styles.cardBackIcon}>🪐</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      {gameWon && (
        <Animated.View entering={ZoomIn.springify()} style={styles.winOverlay}>
          <View style={styles.winCard}>
            <Trophy size={64} color="#FBBF24" />
            <Text style={styles.winTitle}>Bravo ! 🎉</Text>
            <Text style={styles.winMessage}>
              Tu as trouvé toutes les paires en {moves} coups !
            </Text>
            <View style={styles.winScore}>
              <Star size={32} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.winScoreText}>+{score} points</Text>
            </View>

            <View style={styles.winButtons}>
              <Pressable
                onPress={resetGame}
                style={({ pressed }) => [
                  styles.playAgainButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.playAgainText}>Rejouer</Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.backToMenuButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.backToMenuText}>Retour</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardSize = (width - 72) / 4;

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
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "white",
  },
  statText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "white",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  instruction: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.secondary[700],
    textAlign: "center",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  cardWrapper: {
    width: cardSize,
    height: cardSize * 1.2,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.95 }],
  },
  cardMatched: {
    opacity: 0.6,
  },
  cardFront: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 8,
    gap: 4,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardName: {
    fontFamily: FONTS.fredoka,
    fontSize: 12,
    color: COLORS.secondary[900],
    textAlign: "center",
  },
  cardBack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10B981",
    borderRadius: 16,
  },
  cardBackIcon: {
    fontSize: 40,
  },
  winOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  winCard: {
    backgroundColor: "white",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    gap: 20,
    width: "100%",
    maxWidth: 400,
  },
  winTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 36,
    color: COLORS.secondary[900],
  },
  winMessage: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.secondary[600],
    textAlign: "center",
  },
  winScore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
  },
  winScoreText: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.secondary[900],
  },
  winButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  backToMenuButton: {
    flex: 1,
    backgroundColor: COLORS.secondary[200],
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  playAgainText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "white",
  },
  backToMenuText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
});
