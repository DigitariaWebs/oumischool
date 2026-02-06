import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Star,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function ChildProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    {
      icon: <Settings size={28} color="#3B82F6" />,
      title: "Paramètres",
      onPress: () => console.log("Settings"),
    },
    {
      icon: <HelpCircle size={28} color="#3B82F6" />,
      title: "Aide",
      onPress: () => console.log("Help"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(14)}
          style={styles.profileHeader}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <User size={64} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.profileName}>{user?.name || "Moi"}</Text>
            <Text style={styles.profileRole}>
              {user?.grade || "CE2"} • {user?.age || 8} ans
            </Text>
            <View style={styles.pointsRow}>
              <Star size={24} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.pointsText}>420 points</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(250 + index * 80).springify().damping(14)}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <ChevronRight size={28} color={COLORS.secondary[400]} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(500).springify().damping(14)}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              dispatch(logout());
              router.replace("/sign-in");
            }}
          >
            <LogOut size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.versionText}>Oumi'School</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    marginBottom: 28,
    borderRadius: 32,
    overflow: "hidden",
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  profileGradient: {
    padding: 32,
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.3)",
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  profileRole: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    marginBottom: 16,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  pointsText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.neutral.white,
  },
  menuSection: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    marginHorizontal: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemTitle: {
    flex: 1,
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: "#FEE2E2",
    borderRadius: 24,
  },
  logoutText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.error,
  },
  versionText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[400],
    textAlign: "center",
    marginTop: 24,
  },
});
