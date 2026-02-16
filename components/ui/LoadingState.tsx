import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Chargement...",
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.primary.DEFAULT} />
      {message && <Text style={styles.message}>{message}</Text>}
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
  message: {
    marginTop: 16,
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.neutral[600],
    textAlign: "center",
  },
});
