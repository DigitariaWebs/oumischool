import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
  style?: ViewStyle;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color = COLORS.primary[50],
  delay = 0,
  style,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify()}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
          },
          style,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
