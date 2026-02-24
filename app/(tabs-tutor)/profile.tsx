import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  LogOut,
  ChevronRight,
  Settings,
  CreditCard,
  Star,
  Eye,
  GraduationCap,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useLogout } from "@/hooks/api/auth";
import {
  useMyEarnings,
  useMySessions,
  useMyStudents,
} from "@/hooks/api/tutors";

export default function TutorProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogout();
  const { data: myStudentsData = [] } = useMyStudents();
  const { data: mySessionsData = [] } = useMySessions();
  const { data: myEarningsData } = useMyEarnings();

  const sessions = Array.isArray(mySessionsData) ? mySessionsData : [];
  const students = Array.isArray(myStudentsData) ? myStudentsData : [];
  const completedSessions = sessions.filter(
    (session) => String(session.status).toUpperCase() === "COMPLETED",
  ).length;
  const subjects = Array.from(
    new Set(
      sessions
        .map((session) => session.subject?.name)
        .filter((value): value is string => Boolean(value?.trim())),
    ),
  );

  const stats = [
    {
      icon: <Users size={16} color="#8B5CF6" />,
      value: String(students.length),
      label: "Élèves",
    },
    {
      icon: <Calendar size={16} color="#10B981" />,
      value: String(completedSessions),
      label: "Sessions",
    },
    {
      icon: <TrendingUp size={16} color="#F59E0B" />,
      value: `${Math.round(myEarningsData?.thisMonth ?? 0)}€`,
      label: "Ce mois",
    },
    {
      icon: <Star size={16} color="#EF4444" fill="#EF4444" />,
      value: user?.rating?.toFixed(1) || "5.0",
      label: "Note",
    },
  ];

  const menuItems = [
    {
      icon: <Eye size={18} color="#64748B" />,
      title: "Profil Public",
      subtitle: "Personnaliser votre profil",
      onPress: () => router.push("/tutor/profile/public-profile"),
    },
    {
      icon: <MessageSquare size={18} color="#64748B" />,
      title: "Messages",
      subtitle: "Conversations avec les parents",
      onPress: () => router.push("/messaging"),
    },
    {
      icon: <Settings size={18} color="#64748B" />,
      title: "Paramètres",
      subtitle: "Préférences du compte",
      onPress: () => router.push("/tutor/profile/settings"),
    },
    {
      icon: <CreditCard size={18} color="#64748B" />,
      title: "Paiements",
      subtitle: "Revenus et facturation",
      onPress: () => router.push("/tutor/profile/payments"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header simple */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>PROFIL</Text>
          <Text style={styles.headerTitle}>Mon compte tuteur</Text>
        </View>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <GraduationCap size={32} color="white" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Tuteur"}</Text>
              <Text style={styles.profileSubjects}>
                {subjects.length ? subjects.join(" • ") : "Tuteur certifié"}
              </Text>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>
                  {user?.rating?.toFixed(1) || "5.0"}
                </Text>
                <Text style={styles.rateSeparator}>•</Text>
                <Text style={styles.rateText}>{user?.hourlyRate || 25}€/h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats en grille */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#F8FAFC" }]}>
                {stat.icon}
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Email */}
        <View style={styles.emailCard}>
          <View style={styles.emailIcon}>
            <Mail size={16} color="#3B82F6" />
          </View>
          <View style={styles.emailInfo}>
            <Text style={styles.emailLabel}>Email</Text>
            <Text style={styles.emailValue}>
              {user?.email || "email@example.com"}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Paramètres</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: "#F8FAFC" },
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>{item.icon}</View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Déconnexion */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={async () => {
            await logoutMutation.mutateAsync().catch(() => {});
            dispatch(logout());
            router.replace("/sign-in");
          }}
        >
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Oumi&apos;School v1.0.0</Text>
        </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
    marginBottom: 4,
  },
  profileSubjects: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  ratingText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  rateSeparator: {
    fontSize: 12,
    color: "#94A3B8",
  },
  rateText: {
    fontSize: 12,
    color: "#64748B",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    width: "23%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
  },

  // Email Card
  emailCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  emailInfo: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  emailValue: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  menuTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    marginHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 15,
    color: "#EF4444",
    fontWeight: "600",
  },

  // Version
  versionContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#CBD5E1",
  },

  // Source Button
  sourceButton: {
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
