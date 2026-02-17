import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ColorScheme = "light" | "dark" | "system";

interface ThemeState {
  colorScheme: ColorScheme;
  systemColorScheme: "light" | "dark";
}

const initialState: ThemeState = {
  colorScheme: "system",
  systemColorScheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },
    setSystemColorScheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemColorScheme = action.payload;
    },
  },
});

export const { setColorScheme, setSystemColorScheme } = themeSlice.actions;

// Thunks for persistence
export const loadThemePreference = () => async (dispatch: any) => {
  try {
    const savedTheme = await AsyncStorage.getItem("@theme_preference");
    if (
      savedTheme &&
      (savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system")
    ) {
      dispatch(setColorScheme(savedTheme as ColorScheme));
    }
  } catch (error) {
    console.error("Failed to load theme preference:", error);
  }
};

export const saveThemePreference =
  (theme: ColorScheme) => async (dispatch: any) => {
    try {
      await AsyncStorage.setItem("@theme_preference", theme);
      dispatch(setColorScheme(theme));
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

export default themeSlice.reducer;
