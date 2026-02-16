import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "secondary";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "md",
  style,
  textStyle,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: COLORS.primary[100],
          color: COLORS.primary[700],
        };
      case "warning":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        };
      case "error":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        };
      case "info":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
        };
      case "secondary":
        return {
          backgroundColor: COLORS.secondary[100],
          color: COLORS.secondary[700],
        };
      default:
        return {
          backgroundColor: COLORS.neutral[100],
          color: COLORS.neutral[700],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingHorizontal: 8,
          paddingVertical: 2,
          fontSize: 11,
          borderRadius: 8,
        };
      case "lg":
        return {
          paddingHorizontal: 16,
          paddingVertical: 6,
          fontSize: 14,
          borderRadius: 12,
        };
      default:
        return {
          paddingHorizontal: 12,
          paddingVertical: 4,
          fontSize: 12,
          borderRadius: 10,
        };
    }
  };

  const colors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.color,
            fontSize: sizeStyles.fontSize,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: FONTS.secondary,
    fontWeight: "600",
    textAlign: "center",
  },
});
