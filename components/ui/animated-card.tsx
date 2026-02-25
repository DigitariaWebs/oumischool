import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { THEME } from "@/config/theme";

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticType?: "light" | "medium" | "heavy" | "selection" | "none";
  scale?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AnimatedCard({
  children,
  onPress,
  hapticType = "light",
  scale = 0.97,
  style,
  testID,
}: AnimatedCardProps) {
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  const triggerHaptic = () => {
    if (hapticType === "none") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: scale,
        useNativeDriver: true,
        damping: 15,
        stiffness: 400,
      }),
      Animated.spring(opacityValue, {
        toValue: 0.9,
        useNativeDriver: true,
        damping: 15,
        stiffness: 400,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 400,
      }),
      Animated.spring(opacityValue, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 400,
      }),
    ]).start();
  };

  const handlePress = () => {
    triggerHaptic();
    onPress?.();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
  };

  if (!onPress) {
    return (
      <View style={[styles.card, style]} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        testID={testID}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

interface PressableRowProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticType?: "light" | "medium" | "selection" | "none";
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function PressableRow({
  children,
  onPress,
  hapticType = "selection",
  style,
  testID,
}: PressableRowProps) {
  const opacityValue = new Animated.Value(1);

  const triggerHaptic = () => {
    if (hapticType === "none") return;
    Haptics.selectionAsync();
  };

  const handlePressIn = () => {
    Animated.spring(opacityValue, {
      toValue: 0.7,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(opacityValue, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  const handlePress = () => {
    triggerHaptic();
    onPress?.();
  };

  const animatedStyle = {
    opacity: opacityValue,
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});
