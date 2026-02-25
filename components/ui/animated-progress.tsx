import { useEffect } from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Animated } from "react-native";
import { THEME } from "@/config/theme";

interface AnimatedProgressProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  duration?: number;
}

export function AnimatedProgress({
  progress,
  height = 6,
  backgroundColor = THEME.colors.secondaryLight,
  fillColor = THEME.colors.primary,
  borderRadius = 3,
  style,
  animated = true,
  duration = 800,
}: AnimatedProgressProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const animatedWidth = new Animated.Value(0);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, duration]);

  const width = animated
    ? animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
      })
    : `${clampedProgress}%`;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            borderRadius,
            width,
          },
        ]}
      />
    </View>
  );
}

interface ProgressWithLabelProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: "small" | "medium" | "large";
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressWithLabel({
  progress,
  label,
  showPercentage = true,
  size = "medium",
  color = THEME.colors.primary,
  style,
}: ProgressWithLabelProps) {
  const height = size === "small" ? 4 : size === "medium" ? 6 : 8;

  return (
    <View style={[styles.containerWithLabel, style]}>
      <View style={styles.labelRow}>
        {label && (
          <View style={styles.labelTextWrapper}>
            <View style={styles.label} />
          </View>
        )}
        {showPercentage && (
          <View style={styles.percentageWrapper}>
            <View style={styles.percentage} />
          </View>
        )}
      </View>
      <AnimatedProgress progress={progress} height={height} fillColor={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
  },
  containerWithLabel: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelTextWrapper: {
    flex: 1,
  },
  label: {},
  percentageWrapper: {},
  percentage: {},
});
