import { useColorScheme as useRNColorScheme } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { saveThemePreference, ColorScheme } from "@/store/slices/themeSlice";
import { Colors } from "@/constants/theme";

export function useTheme() {
  const dispatch = useAppDispatch();
  const systemColorScheme = useRNColorScheme();
  const { colorScheme } = useAppSelector((state) => state.theme);

  // Determine the actual color scheme to use
  const activeColorScheme =
    colorScheme === "system" ? (systemColorScheme ?? "light") : colorScheme;

  const setTheme = (theme: ColorScheme) => {
    dispatch(saveThemePreference(theme));
  };

  const isDark = activeColorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return {
    colorScheme,
    activeColorScheme,
    isDark,
    setTheme,
    colors,
  };
}
