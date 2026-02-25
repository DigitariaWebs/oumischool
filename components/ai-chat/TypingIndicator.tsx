import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";

interface TypingIndicatorProps {
  size?: "small" | "large";
}

export function TypingIndicator({ size = "small" }: TypingIndicatorProps) {
  const dot1Opacity = useSharedValue(0.4);
  const dot2Opacity = useSharedValue(0.4);
  const dot3Opacity = useSharedValue(0.4);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    const duration = 400;
    const delay = 150;

    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    dot2Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease), delay }),
        withTiming(0.4, { duration, easing: Easing.inOut(Easing.ease), delay }),
      ),
      -1,
      false,
    );

    dot3Opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
          delay: delay * 2,
        }),
        withTiming(0.4, {
          duration,
          easing: Easing.inOut(Easing.ease),
          delay: delay * 2,
        }),
      ),
      -1,
      false,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  const isLarge = size === "large";
  const dotSize = isLarge ? 9 : 6;
  const avatarSize = isLarge ? 40 : 32;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <View style={{ alignItems: "center" }}>
        <Animated.View
          style={{
            position: "absolute",
            width: avatarSize + 16,
            height: avatarSize + 16,
            borderRadius: (avatarSize + 16) / 2,
            backgroundColor: "rgba(139, 92, 246, 0.3)",
          }}
        />
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: "rgba(30, 41, 59, 0.95)",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Sparkles size={isLarge ? 18 : 14} color="#A78BFA" />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.95)",
          borderRadius: 20,
          borderBottomLeftRadius: 6,
          paddingVertical: 16,
          paddingHorizontal: 18,
          marginLeft: 10,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <View style={{ flexDirection: "row", gap: isLarge ? 6 : 4 }}>
          <Animated.View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: "#A78BFA",
              opacity: dot1Opacity.value,
            }}
          />
          <Animated.View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: "#A78BFA",
              opacity: dot2Opacity.value,
            }}
          />
          <Animated.View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: "#A78BFA",
              opacity: dot3Opacity.value,
            }}
          />
        </View>
      </View>
    </View>
  );
}
