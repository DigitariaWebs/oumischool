import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { BackHandler, Platform } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "../store/store";
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Fredoka: Fredoka_400Regular,
    "Fredoka-Bold": Fredoka_700Bold,
  });
  const [isSplashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Hide native splash screen so our custom one is visible
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!isSplashFinished) {
    return <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StackWithBackHandler>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(tabs-child)" />
          <Stack.Screen name="(tabs-tutor)" />
          <Stack.Screen name="weekly-plan" />
          <Stack.Screen name="ai-coach" />
          <Stack.Screen name="resources" />
          <Stack.Screen name="dev-accounts" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </StackWithBackHandler>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}

function StackWithBackHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
  }, [router]);

  return <Stack screenOptions={{ headerShown: false }}>{children}</Stack>;
}
