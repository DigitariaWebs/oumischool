import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface BlobBackgroundProps {
  colors?: string[];
  opacity?: number;
  style?: ViewStyle;
}

export const BlobBackground: React.FC<BlobBackgroundProps> = ({
  colors = ["#8B5CF6", "#10B981"],
  opacity = 0.1,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.blob,
          styles.blob1,
          { backgroundColor: colors[0], opacity },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blob2,
          { backgroundColor: colors[1], opacity },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blob1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  blob2: {
    width: 150,
    height: 150,
    top: 80,
    left: -30,
  },
});
