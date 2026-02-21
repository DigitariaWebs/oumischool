import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = COLORS.primary.DEFAULT,
  onPress,
  style,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
        },
        style,
      ]}
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        {React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
          color,
        })}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {value}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
  },
});
