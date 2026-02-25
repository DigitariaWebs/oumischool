import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.neutral[200];
    switch (variant) {
      case "primary":
        return COLORS.primary.DEFAULT;
      case "secondary":
        return COLORS.secondary.DEFAULT;
      case "outline":
        return "transparent";
      case "ghost":
        return "transparent";
      default:
        return COLORS.primary.DEFAULT;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.neutral[400];
    switch (variant) {
      case "primary":
        return COLORS.neutral.white;
      case "secondary":
        return COLORS.neutral.white;
      case "outline":
        return COLORS.primary.DEFAULT;
      case "ghost":
        return COLORS.secondary[600];
      default:
        return COLORS.neutral.white;
    }
  };

  const getBorderColor = () => {
    if (variant === "outline")
      return disabled ? COLORS.neutral[200] : COLORS.primary.DEFAULT;
    return "transparent";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1.5 : 0,
          width: fullWidth ? "100%" : "auto",
          opacity: disabled ? 0.8 : 1,
        },
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                marginLeft: icon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: FONTS.secondary,
    fontWeight: "600",
    fontSize: 16,
  },
});
