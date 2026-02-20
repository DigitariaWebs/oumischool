import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface HeroCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    icon: React.ReactNode;
    text: string;
  };
  gradientColors?: readonly [string, string, ...string[]];
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  gradientColors = ["#6366F1", "#8B5CF6", "#A855F7"] as const,
  children,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.sparkleContainer}>
              <Sparkles size={18} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {badge && (
            <View style={styles.badge}>
              {badge.icon}
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          )}
          {children}
        </View>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sparkleContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  value: {
    fontFamily: FONTS.fredoka,
    fontSize: 56,
    color: COLORS.neutral.white,
    lineHeight: 64,
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  badgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
  },
  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -30,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    right: 50,
  },
});
