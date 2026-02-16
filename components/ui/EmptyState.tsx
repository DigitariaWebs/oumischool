import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.action}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.primary,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.neutral[900],
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.neutral[600],
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
    maxWidth: 280,
  },
  action: {
    marginTop: 16,
  },
});
