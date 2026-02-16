import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | { uri: string };
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = "md",
  style,
}) => {
  const getSizeValue = () => {
    switch (size) {
      case "sm":
        return 32;
      case "md":
        return 40;
      case "lg":
        return 56;
      case "xl":
        return 80;
      default:
        return 40;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 12;
      case "md":
        return 16;
      case "lg":
        return 20;
      case "xl":
        return 28;
      default:
        return 16;
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "?";
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const sizeValue = getSizeValue();
  const fontSize = getFontSize();
  const initials = getInitials(name);

  const imageSource = typeof source === "string" ? { uri: source } : source;

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
        },
        style,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={[
            styles.image,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: COLORS.neutral.white,
    fontFamily: FONTS.secondary,
    fontWeight: "600",
  },
});
