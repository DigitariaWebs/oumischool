import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LegacyChildDetailsRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!childId) {
      router.replace("/parent");
      return;
    }
    router.replace(`/parent/child/details?id=${childId}`);
  }, [childId, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Redirection...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "#64748B",
  },
});
