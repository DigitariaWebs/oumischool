import React from "react";
import { ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
  style?: ViewStyle;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  direction = "down",
  style,
}) => {
  const animation = direction === "up" ? FadeInUp : FadeInDown;

  return (
    <Animated.View
      entering={animation.delay(delay).duration(600).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
};
