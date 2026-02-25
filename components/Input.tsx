import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  // Animation value: 0 = blurred, 1 = focused
  const focusProgress = useSharedValue(0);

  const handleFocus = (e: any) => {
    focusProgress.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    focusProgress.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      ["transparent", COLORS.primary.DEFAULT],
    );

    const backgroundColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [COLORS.neutral[100], COLORS.neutral[50]],
    );

    return {
      borderColor: error ? COLORS.error : borderColor,
      backgroundColor: backgroundColor,
      borderWidth: 1.5,
    };
  });

  return (
    <View style={containerStyle as any}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View style={[styles.inputContainer, animatedContainerStyle, style] as any}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.neutral[400]}
          secureTextEntry={isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={(e) => {
              // Prevent losing focus on the input
              e.preventDefault();
              setIsSecure(!isSecure);
            }}
            style={styles.eyeIcon}
            hitSlop={10}
          >
            {isSecure ? (
              <Eye size={20} color={COLORS.neutral[500]} />
            ) : (
              <EyeOff size={20} color={COLORS.neutral[500]} />
            )}
          </Pressable>
        )}
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.secondary,
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.secondary[700],
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[900],
    height: "100%",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
