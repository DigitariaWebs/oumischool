/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";
import { COLORS } from "@/config/colors";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export type ThemeColors = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  card: string;
  cardElevated: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  border: string;
  divider: string;
  input: string;
  inputBorder: string;
  inputPlaceholder: string;
  progressBg: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  infoCardBg: string;
  infoCardBorder: string;
  infoCardText: string;
};

export const Colors = {
  light: {
    // Basic colors
    text: COLORS.secondary[900],
    background: COLORS.neutral[50],
    tint: tintColorLight,
    icon: COLORS.secondary[500],
    tabIconDefault: COLORS.secondary[500],
    tabIconSelected: tintColorLight,

    // Semantic colors
    primary: COLORS.primary.DEFAULT,
    secondary: COLORS.secondary[900],
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error.DEFAULT,
    info: COLORS.info,

    // UI element colors
    card: COLORS.neutral.white,
    cardElevated: COLORS.neutral.white,
    cardBorder: COLORS.neutral[200],

    // Text variations
    textPrimary: COLORS.secondary[900],
    textSecondary: COLORS.secondary[500],
    textMuted: COLORS.neutral[400],
    textOnPrimary: COLORS.neutral.white,

    // Borders and dividers
    border: COLORS.neutral[200],
    divider: COLORS.neutral[200],

    // Input fields
    input: COLORS.neutral[50],
    inputBorder: COLORS.neutral[200],
    inputPlaceholder: COLORS.neutral[400],

    // Progress and indicators
    progressBg: COLORS.neutral[200],

    // Buttons
    buttonSecondary: COLORS.neutral[100],
    buttonSecondaryText: COLORS.secondary[700],

    // Info card
    infoCardBg: "#FEF3C7",
    infoCardBorder: "#F59E0B",
    infoCardText: COLORS.secondary[700],
  },
  dark: {
    // Basic colors
    text: COLORS.neutral.white,
    background: COLORS.neutral[900],
    tint: tintColorDark,
    icon: COLORS.secondary[400],
    tabIconDefault: COLORS.secondary[400],
    tabIconSelected: tintColorDark,

    // Semantic colors
    primary: COLORS.primary.DEFAULT,
    secondary: COLORS.neutral.white,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error.DEFAULT,
    info: COLORS.info,

    // UI element colors
    card: COLORS.neutral[800],
    cardElevated: COLORS.neutral[800],
    cardBorder: COLORS.neutral[700],

    // Text variations
    textPrimary: COLORS.neutral.white,
    textSecondary: COLORS.secondary[400],
    textMuted: COLORS.neutral[600],
    textOnPrimary: COLORS.neutral.white,

    // Borders and dividers
    border: COLORS.neutral[700],
    divider: COLORS.neutral[700],

    // Input fields
    input: COLORS.neutral[900],
    inputBorder: COLORS.neutral[700],
    inputPlaceholder: COLORS.neutral[600],

    // Progress and indicators
    progressBg: COLORS.neutral[700],

    // Buttons
    buttonSecondary: COLORS.neutral[700],
    buttonSecondaryText: COLORS.secondary[300],

    // Info card
    infoCardBg: "#422006",
    infoCardBorder: "#F59E0B",
    infoCardText: "#FCD34D",
  } as ThemeColors,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
