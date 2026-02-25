import { useRef } from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { THEME } from "@/config/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "none";

interface HapticPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  hapticType?: HapticType;
  scale?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function HapticPressable({
  children,
  onPress,
  onPressIn,
  onPressOut,
  hapticType = "light",
  scale = 0.96,
  disabled = false,
  style,
  testID,
}: HapticPressableProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    if (hapticType === "none") return;
    switch (hapticType) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: scale,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
    onPressIn?.();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
    onPressOut?.();
  };

  const handlePress = () => {
    triggerHaptic();
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      style={[{ transform: [{ scale: scaleValue }] }, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

interface HapticButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticType?: HapticType;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function HapticButton({
  children,
  onPress,
  hapticType = "medium",
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  testID,
}: HapticButtonProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return { backgroundColor: THEME.colors.primary };
      case "secondary":
        return {
          backgroundColor: THEME.colors.secondaryLight,
          borderWidth: 1,
          borderColor: THEME.colors.border,
        };
      case "ghost":
        return { backgroundColor: "transparent" };
      case "danger":
        return { backgroundColor: THEME.colors.error };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: THEME.spacing.md,
          paddingVertical: THEME.spacing.sm,
          borderRadius: THEME.radius.md,
        };
      case "medium":
        return {
          paddingHorizontal: THEME.spacing.lg,
          paddingVertical: THEME.spacing.md,
          borderRadius: THEME.radius.lg,
        };
      case "large":
        return {
          paddingHorizontal: THEME.spacing.xl,
          paddingVertical: THEME.spacing.lg,
          borderRadius: THEME.radius.xl,
        };
    }
  };

  return (
    <HapticPressable
      onPress={onPress}
      hapticType={disabled ? "none" : hapticType}
      disabled={disabled}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      testID={testID}
    >
      {children}
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.5,
  },
});
