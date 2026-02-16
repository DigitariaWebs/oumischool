import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  delay: number;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  delay,
  destructive,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.menuIcon, destructive && styles.menuIconDestructive]}
        >
          {icon}
        </View>
        <View style={styles.menuItemText}>
          <Text
            style={[
              styles.menuItemTitle,
              destructive && styles.menuItemTitleDestructive,
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight
        size={20}
        color={destructive ? COLORS.error : COLORS.neutral[400]}
      />
    </TouchableOpacity>
  </Animated.View>
);

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color,
  delay,
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(400)}
    style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
  >
    <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
      {icon}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Animated.View>
);

export default function TutorProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const stats = [
    {
      icon: <Users size={20} color="#8B5CF6" />,
      value: user?.totalStudents?.toString() || "0",
      label: "Élèves",
      color: "#8B5CF6",
    },
    {
      icon: <Calendar size={20} color="#10B981" />,
      value: user?.completedSessions?.toString() || "0",
      label: "Sessions",
      color: "#10B981",
    },
    {
      icon: <TrendingUp size={20} color="#F59E0B" />,
      value: `${user?.monthlyEarnings || 0}€`,
      label: "Ce mois",
      color: "#F59E0B",
    },
  ];

  const menuItems = [
    {
      icon: <Eye size={20} color={COLORS.secondary[700]} />,
      title: "Profil Public",
      subtitle: "Personnaliser votre profil",
      onPress: () => router.push("/tutor/profile/public-profile"),
    },
    {
      icon: <Settings size={20} color={COLORS.secondary[700]} />,
      title: "Paramètres",
      subtitle: "Préférences du compte",
      onPress: () => router.push("/tutor/profile/settings"),
    },
    {
      icon: <CreditCard size={20} color={COLORS.secondary[700]} />,
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
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.profileHeader}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <GraduationCap size={48} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.profileName}>{user?.name || "Tuteur"}</Text>
            <Text style={styles.profileRole}>
              Tuteur
              {user?.subjects?.length ? " • " + user.subjects.join(", ") : ""}
            </Text>
            <View style={styles.ratingRow}>
              <Star size={18} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>
                {user?.rating?.toFixed(1) || "5.0"} / 5
              </Text>
              <Text style={styles.rateText}>• {user?.hourlyRate || 25}€/h</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={300 + index * 50} />
          ))}
        </View>

        {/* Contact Info */}
        <Animated.View
          entering={FadeInDown.delay(450).duration(600)}
          style={styles.infoCard}
        >
          <View style={styles.infoRow}>
            <Mail size={20} color={COLORS.secondary[600]} />
            <Text style={styles.infoText}>
              {user?.email || "email@example.com"}
            </Text>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} delay={500 + index * 50} />
          ))}
        </View>

        {/* Logout */}
        <MenuItem
          icon={<LogOut size={20} color={COLORS.error} />}
          title="Se déconnecter"
          onPress={() => {
            dispatch(logout());
            router.replace("/sign-in");
          }}
          delay={650}
          destructive
        />

        {/* Version */}
        <Text style={styles.versionText}>Oumi&apos;School v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Profile Header
  profileHeader: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileGradient: {
    padding: 32,
    alignItems: "center",
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  profileRole: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  rateText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    textAlign: "center",
  },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[700],
  },
  // Menu
  menuSection: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIconDestructive: {
    backgroundColor: "#FEE2E2",
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  menuItemTitleDestructive: {
    color: COLORS.error,
  },
  menuItemSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  // Version
  versionText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
    textAlign: "center",
    marginTop: 24,
  },
});
