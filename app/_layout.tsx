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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { BackHandler, Platform } from "react-native";
import "react-native-reanimated";
import { Provider, useDispatch } from "react-redux";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "../store/store";
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";
import {
  loadThemePreference,
  setSystemColorScheme,
} from "@/store/slices/themeSlice";
import { useAppSelector } from "@/store/hooks";
import { MessagingSocketProvider } from "@/components/providers/MessagingSocketProvider";
import { PushNotificationsProvider } from "@/components/providers/PushNotificationsProvider";

// Dynamically load StripeProvider so the app degrades gracefully in Expo Go
// (native modules are only available in dev builds / production builds)
let StripeProvider: React.ComponentType<{
  publishableKey: string;
  urlScheme?: string;
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  StripeProvider = require("@stripe/stripe-react-native").StripeProvider;
} catch {
  // Expo Go — Stripe native modules unavailable, payment screens will not work
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
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
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""}
          urlScheme="oumischool"
        >
          <MessagingSocketProvider>
            <PushNotificationsProvider>
              <RootLayoutWithTheme />
            </PushNotificationsProvider>
          </MessagingSocketProvider>
        </StripeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

function RootLayoutWithTheme() {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const themeState = useAppSelector((state) => state.theme);

  useEffect(() => {
    dispatch(loadThemePreference() as any);
  }, [dispatch]);

  useEffect(() => {
    if (systemColorScheme) {
      dispatch(setSystemColorScheme(systemColorScheme));
    }
  }, [systemColorScheme, dispatch]);

  const activeColorScheme =
    themeState.colorScheme === "system"
      ? (systemColorScheme ?? "light")
      : themeState.colorScheme;

  return (
    <ThemeProvider
      value={activeColorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StackWithBackHandler>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(tabs-child)" />
        <Stack.Screen name="(tabs-tutor)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </StackWithBackHandler>
      <StatusBar style="auto" />
    </ThemeProvider>
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
