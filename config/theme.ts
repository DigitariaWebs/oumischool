import { COLORS } from "./colors";

export const THEME = {
  colors: {
    primary: COLORS.primary.DEFAULT,
    primaryLight: COLORS.primary[50],
    primaryDark: COLORS.primary[700],
    secondary: COLORS.secondary.DEFAULT,
    secondaryLight: COLORS.secondary[50],
    secondaryBorder: COLORS.secondary[100],
    secondaryText: COLORS.secondary[400],
    secondaryTextDark: COLORS.secondary[800],
    text: COLORS.secondary[800],
    subtext: COLORS.secondary[500],
    accent: COLORS.amber.DEFAULT,
    success: COLORS.success,
    error: COLORS.error.DEFAULT,
    warning: COLORS.warning,
    info: COLORS.info,
    white: COLORS.neutral.white,
    background: COLORS.neutral.white,
    border: COLORS.secondary[100],
    purple: COLORS.purple.DEFAULT,
    green: COLORS.green.DEFAULT,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },
  shadows: {
    card: "0 2px 8px rgba(0, 0, 0, 0.06)",
    elevated: "0 4px 12px rgba(0, 0, 0, 0.1)",
    button: "0 2px 8px rgba(22, 163, 74, 0.3)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  typography: {
    h1: {
      fontFamily: "Fredoka",
      fontSize: 28,
      fontWeight: "700" as const,
    },
    h2: {
      fontFamily: "Fredoka",
      fontSize: 24,
      fontWeight: "600" as const,
    },
    h3: {
      fontFamily: "Fredoka",
      fontSize: 20,
      fontWeight: "600" as const,
    },
    body: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "400" as const,
    },
    caption: {
      fontFamily: "Inter",
      fontSize: 13,
      fontWeight: "400" as const,
    },
    label: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: "600" as const,
    },
  },
} as const;

export type Theme = typeof THEME;
