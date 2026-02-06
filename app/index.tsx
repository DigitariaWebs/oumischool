import { Redirect } from "expo-router";

export default function Index() {
  // In a real app, you would check storage (AsyncStorage/MMKV)
  // to see if the user has already onboarded.
  // For now, we force the welcome screen for development.
  const hasSeenWelcome = false;

  if (!hasSeenWelcome) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
