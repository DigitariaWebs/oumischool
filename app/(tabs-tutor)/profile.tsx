import React, { useMemo } from "react";
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
  MessageSquare,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";
import { BlobBackground, AnimatedSection } from "@/components/ui";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  delay: number;
  destructive?: boolean;
  colors: ThemeColors;
  isDark: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  delay,
  destructive,
  colors,
  isDark,
}) => {
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View
            style={[
              styles.menuIcon,
              destructive && { backgroundColor: "#FEE2E2" },
            ]}
          >
            {icon}
          </View>
          <View style={styles.menuItemText}>
            <Text
              style={[
                styles.menuItemTitle,
                { color: destructive ? COLORS.error : colors.textPrimary },
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.menuItemSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <ChevronRight
          size={18}
          color={destructive ? COLORS.error : colors.textMuted}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function TutorProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const stats = [
    {
      icon: <Users size={18} color="#8B5CF6" />,
      value: user?.totalStudents?.toString() || "0",
      label: "Élèves",
      color: "#8B5CF6",
    },
    {
      icon: <Calendar size={18} color="#10B981" />,
      value: user?.completedSessions?.toString() || "0",
      label: "Sessions",
      color: "#10B981",
    },
    {
      icon: <TrendingUp size={18} color="#F59E0B" />,
      value: `${user?.monthlyEarnings || 0}€`,
      label: "Ce mois",
      color: "#F59E0B",
    },
    {
      icon: <Star size={18} color="#EF4444" fill="#EF4444" />,
      value: user?.rating?.toFixed(1) || "5.0",
      label: "Note",
      color: "#EF4444",
    },
  ];

  const menuItems = [
    {
      icon: <Eye size={19} color={colors.textSecondary} />,
      title: "Profil Public",
      subtitle: "Personnaliser votre profil",
      onPress: () => router.push("/tutor/profile/public-profile"),
    },
    {
      icon: <MessageSquare size={19} color={colors.textSecondary} />,
      title: "Messages",
      subtitle: "Conversations avec les parents",
      onPress: () => router.push("/messaging"),
    },
    {
      icon: <Settings size={19} color={colors.textSecondary} />,
      title: "Paramètres",
      subtitle: "Préférences du compte",
      onPress: () => router.push("/tutor/profile/settings"),
    },
    {
      icon: <CreditCard size={19} color={colors.textSecondary} />,
      title: "Paiements",
      subtitle: "Revenus et facturation",
      onPress: () => router.push("/tutor/profile/payments"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BlobBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Hero Card */}
        <AnimatedSection delay={100} style={styles.heroWrapper}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Decorative circles */}
              <View style={styles.heroCircle1} />
              <View style={styles.heroCircle2} />

              <View style={styles.heroContent}>
                <View style={styles.heroTopRow}>
                  <View style={styles.sparkleContainer}>
                    <Sparkles size={16} color="rgba(255,255,255,0.9)" />
                  </View>
                  <Text style={styles.heroLabel}>Mon profil tuteur</Text>
                </View>

                <View style={styles.avatarRow}>
                  <View style={styles.avatarContainer}>
                    <GraduationCap size={36} color="white" />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {user?.name || "Tuteur"}
                    </Text>
                    <Text style={styles.profileSubjects}>
                      {user?.subjects?.length
                        ? user.subjects.join(" • ")
                        : "Tuteur certifié"}
                    </Text>
                    <View style={styles.ratingBadge}>
                      <Star size={13} color="#FCD34D" fill="#FCD34D" />
                      <Text style={styles.ratingText}>
                        {user?.rating?.toFixed(1) || "5.0"} / 5
                      </Text>
                      <Text style={styles.rateSeparator}>•</Text>
                      <Text style={styles.rateText}>
                        {user?.hourlyRate || 25}€/h
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </AnimatedSection>

        {/* Stats Row */}
        <AnimatedSection delay={200} style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(250 + index * 60)
                  .duration(500)
                  .springify()}
                style={[styles.statCard, { backgroundColor: colors.card }]}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.color + "18" },
                  ]}
                >
                  {stat.icon}
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {stat.value}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  {stat.label}
                </Text>
              </Animated.View>
            ))}
          </View>
        </AnimatedSection>

        {/* Contact Pill */}
        <AnimatedSection delay={380} style={styles.contactWrapper}>
          <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.contactIconContainer,
                { backgroundColor: "#3B82F620" },
              ]}
            >
              <Mail size={18} color="#3B82F6" />
            </View>
            <View style={styles.contactInfo}>
              <Text
                style={[styles.contactLabel, { color: colors.textSecondary }]}
              >
                Email
              </Text>
              <Text
                style={[styles.contactValue, { color: colors.textPrimary }]}
              >
                {user?.email || "email@example.com"}
              </Text>
            </View>
          </View>
        </AnimatedSection>

        {/* Menu Section */}
        <AnimatedSection delay={460} style={styles.menuSection}>
          <View style={styles.menuSectionHeader}>
            <Text
              style={[styles.menuSectionTitle, { color: colors.textPrimary }]}
            >
              ⚙️ Paramètres
            </Text>
          </View>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: colors.card,
                shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
              },
            ]}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                {...item}
                delay={520 + index * 50}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </View>
        </AnimatedSection>

        {/* Logout */}
        <AnimatedSection
          delay={700}
          direction="up"
          style={styles.logoutSection}
        >
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: isDark ? "rgba(239,68,68,0.1)" : "#FEF2F2",
                borderColor: isDark ? "rgba(239,68,68,0.2)" : "#FECACA",
              },
            ]}
            onPress={() => {
              dispatch(logout());
              router.replace("/sign-in");
            }}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIcon}>
              <LogOut size={19} color={COLORS.error} />
            </View>
            <Text style={styles.logoutText}>Se déconnecter</Text>
            <ChevronRight size={18} color={COLORS.error} />
          </TouchableOpacity>
        </AnimatedSection>

        {/* Version */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600).springify()}
          style={styles.versionContainer}
        >
          <Text style={[styles.versionText, { color: colors.textMuted }]}>
            Oumi&apos;School v1.0.0
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: "#10B98115" }]}>
            <Text style={styles.versionBadgeText}>Dernière version</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    heroWrapper: {
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 20,
    },
    heroCard: {
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
    heroGradient: {
      padding: 24,
      position: "relative",
      overflow: "hidden",
    },
    heroCircle1: {
      position: "absolute",
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -35,
      right: -35,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.07)",
      bottom: -20,
      right: 55,
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 18,
    },
    sparkleContainer: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    avatarRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    avatarContainer: {
      width: 76,
      height: 76,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2.5,
      borderColor: "rgba(255,255,255,0.3)",
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: "white",
      marginBottom: 4,
    },
    profileSubjects: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      marginBottom: 10,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.18)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
    },
    ratingText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "700",
      color: "white",
    },
    rateSeparator: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
    },
    rateText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.85)",
    },
    statsSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: "row",
      gap: 10,
    },
    statCard: {
      flex: 1,
      borderRadius: 18,
      padding: 14,
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    statIconContainer: {
      width: 38,
      height: 38,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 2,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      textAlign: "center",
    },
    contactWrapper: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    contactCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderRadius: 18,
      padding: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    contactIconContainer: {
      width: 42,
      height: 42,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
    },
    contactInfo: {
      flex: 1,
    },
    contactLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      marginBottom: 2,
    },
    contactValue: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    menuSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    menuSectionHeader: {
      marginBottom: 14,
    },
    menuSectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
    },
    menuCard: {
      borderRadius: 20,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    menuItemText: {
      flex: 1,
    },
    menuItemTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 2,
    },
    menuItemSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
    },
    logoutSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
    },
    logoutIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: "rgba(239, 68, 68, 0.12)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    logoutText: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.error,
    },
    versionContainer: {
      alignItems: "center",
      paddingBottom: 8,
    },
    versionText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      marginBottom: 8,
    },
    versionBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
    },
    versionBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#10B981",
      fontWeight: "600",
    },
  });
