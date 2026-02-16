import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "@/config/colors";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  style,
}) => {
  const getPaddingValue = () => {
    switch (padding) {
      case "none":
        return 0;
      case "sm":
        return 12;
      case "md":
        return 16;
      case "lg":
        return 24;
      default:
        return 16;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: COLORS.neutral.white,
          borderWidth: 1,
          borderColor: COLORS.neutral[200],
          shadowOpacity: 0,
          elevation: 0,
        };
      case "elevated":
        return {
          backgroundColor: COLORS.neutral.white,
          shadowColor: COLORS.neutral.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: COLORS.neutral.white,
          shadowColor: COLORS.neutral.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyle(),
        { padding: getPaddingValue() },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
