import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

interface TabHeaderProps {
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  icon,
  badge,
  rightElement,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: COLORS.primary.DEFAULT },
          ]}
        >
          {icon}
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      {badge && (
        <View
          style={[styles.badge, { backgroundColor: colors.primary + "15" }]}
        >
          <Text style={[styles.badgeText, { color: colors.primary }]}>
            {badge}
          </Text>
        </View>
      )}
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "600",
  },
  right: {
    // Add styles for right element if needed
  },
});
