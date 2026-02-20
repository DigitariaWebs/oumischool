import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay?: number;
  style?: ViewStyle;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
  delay = 0,
  style,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify()}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
          },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    minHeight: 140,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
  },
});
