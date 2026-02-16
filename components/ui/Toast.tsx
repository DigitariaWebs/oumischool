import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  visible,
  onHide,
  duration = 3000,
}) => {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });

      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return COLORS.success;
      case "error":
        return COLORS.error;
      case "warning":
        return COLORS.warning;
      case "info":
        return COLORS.info;
      default:
        return COLORS.info;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: getBackgroundColor() },
        animatedStyle,
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    color: COLORS.neutral.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONTS.secondary,
  },
});
