import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Star,
  Award,
  Calendar,
  BookOpen,
  Gamepad2,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useLogout, useProfile } from "@/hooks/api/auth";
import { AnimatedSection } from "@/components/ui";
import { useActivities, usePerformance } from "@/hooks/api/performance";
import { useSessions } from "@/hooks/api/sessions";

export default function ChildProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogout();
  const { data: profile } = useProfile();
  const childId = profile?.child?.id ?? "";
  const { data: activitiesData = [] } = useActivities(childId, 100);
  const { data: performanceData } = usePerformance(childId);
  const { data: sessionsData = [] } = useSessions();
  const mySessionsCount = (
    Array.isArray(sessionsData) ? sessionsData : []
  ).filter(
    (session) => session?.childId === childId || session?.child?.id === childId,
  ).length;

  const menuItems = [
    {
      icon: <Settings size={22} color="#64748B" />,
      title: "Paramètres",
      onPress: () => console.log("Settings"),
    },
    {
      icon: <HelpCircle size={22} color="#64748B" />,
      title: "Aide et support",
      onPress: () => console.log("Help"),
    },
  ];

  const stats = [
    {
      label: "Leçons",
      value: String(mySessionsCount),
      Icon: BookOpen,
      color: "#6366F1",
    },
    {
      label: "Jeux",
      value: String(activitiesData.length),
      Icon: Gamepad2,
      color: "#0EA5E9",
    },
    {
      label: "Jours",
      value: String(Math.round(performanceData?.attendanceRate ?? 0)),
      Icon: Calendar,
      color: "#6366F1",
    },
    {
      label: "Badges",
      value: String(
        [
          (performanceData?.avgScore ?? 0) >= 60,
          (performanceData?.attendanceRate ?? 0) >= 70,
          activitiesData.length >= 5,
          (performanceData?.avgScore ?? 0) >= 85,
        ].filter(Boolean).length,
      ),
      Icon: Award,
      color: "#0EA5E9",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header avec avatar */}
        <AnimatedSection delay={100} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              <User size={50} color="#6366F1" />
            </View>
          </View>

          <Text style={styles.profileName}>{user?.name || "Élève"}</Text>
          <Text style={styles.profileRole}>
            {profile?.child?.name || user?.grade || "Élève"} •{" "}
            {Math.round(performanceData?.attendanceRate ?? 0)}% présence
          </Text>

          <View style={styles.pointsBadge}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.pointsText}>
              {Math.round(performanceData?.avgScore ?? 0)} points
            </Text>
          </View>
        </AnimatedSection>

        {/* Stats en grille */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + "15" },
                ]}
              >
                <stat.Icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Section Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <View style={styles.menuBox}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.menuIconBox}>{item.icon}</View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <ChevronRight size={18} color="#CBD5E1" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Déconnexion */}
        <AnimatedSection delay={400} style={styles.logoutWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.btnPressed,
            ]}
            onPress={async () => {
              await logoutMutation.mutateAsync().catch(() => {});
              dispatch(logout());
              router.replace("/sign-in");
            }}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </Pressable>
          <Text style={styles.versionText}>
            Oumi&apos;School • Version 1.0.2
          </Text>
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 4,
  },
  profileRole: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  pointsText: {
    fontFamily: FONTS.fredoka,
    fontSize: 13,
    color: "#B45309",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    alignItems: "center",
    width: 70,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 12,
  },

  // Menu
  menuBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemPressed: {
    backgroundColor: "#F8FAFC",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemTitle: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },

  // Logout
  logoutWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#EF4444",
  },
  versionText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 16,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
