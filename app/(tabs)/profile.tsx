import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Mail,
  Phone,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  MessageSquare,
  Sparkles,
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
            {subtitle && (
              <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
        <ChevronRight
          size={20}
          color={destructive ? COLORS.error : colors.textMuted}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const menuItems = [
    {
      icon: <MessageSquare size={20} color={colors.textSecondary} />,
      title: "Messages",
      subtitle: "Conversations avec les tuteurs",
      onPress: () => router.push("/messaging"),
    },
    {
      icon: <Settings size={20} color={colors.textSecondary} />,
      title: "Paramètres",
      subtitle: "Préférences et notifications",
      onPress: () => router.push("/parent/profile/settings"),
    },
    {
      icon: <Bell size={20} color={colors.textSecondary} />,
      title: "Notifications",
      subtitle: "Gérer les alertes",
      onPress: () => router.push("/parent/profile/notifications"),
    },
    {
      icon: <CreditCard size={20} color={colors.textSecondary} />,
      title: "Abonnement",
      subtitle: "Family • 69€/mois",
      onPress: () => router.push("/pricing"),
    },
    {
      icon: <HelpCircle size={20} color={colors.textSecondary} />,
      title: "Aide & Support",
      subtitle: "FAQ et contact",
      onPress: () => router.push("/parent/profile/help"),
    },
    {
      icon: <Shield size={20} color={colors.textSecondary} />,
      title: "Confidentialité",
      subtitle: "Données et sécurité",
      onPress: () => router.push("/parent/profile/privacy"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify()}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View style={styles.sparkleContainer}>
                  <Sparkles size={20} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Mon profil</Text>
              </View>

              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: user?.avatar || "https://via.placeholder.com/100",
                    }}
                    style={styles.avatarImage}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.name || "Utilisateur"}
                  </Text>
                  <View style={styles.roleBadge}>
                    <CheckCircle size={12} color="#10B981" />
                    <Text style={styles.roleBadgeText}>
                      {user?.role === "parent"
                        ? "Parent vérifié"
                        : user?.role === "child"
                          ? "Enfant"
                          : "Tuteur"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Contact Info Pills */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.infoPillsScroll}
          >
            <View style={[styles.infoPill, { backgroundColor: "#3B82F620" }]}>
              <View
                style={[styles.infoPillIcon, { backgroundColor: "#3B82F6" }]}
              >
                <Mail size={16} color="#FFF" />
              </View>
              <View>
                <Text style={styles.infoPillLabel}>Email</Text>
                <Text style={[styles.infoPillValue, { color: "#3B82F6" }]}>
                  {user?.email || "email@example.com"}
                </Text>
              </View>
            </View>

            {user?.phoneNumber && (
              <View style={[styles.infoPill, { backgroundColor: "#10B98120" }]}>
                <View
                  style={[styles.infoPillIcon, { backgroundColor: "#10B981" }]}
                >
                  <Phone size={16} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.infoPillLabel}>Téléphone</Text>
                  <Text style={[styles.infoPillValue, { color: "#10B981" }]}>
                    {user.phoneNumber}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.infoPill, { backgroundColor: "#8B5CF620" }]}>
              <View
                style={[styles.infoPillIcon, { backgroundColor: "#8B5CF6" }]}
              >
                <Shield size={16} color="#FFF" />
              </View>
              <View>
                <Text style={styles.infoPillLabel}>Statut</Text>
                <Text style={[styles.infoPillValue, { color: "#8B5CF6" }]}>
                  Compte actif
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={styles.menuSection}
        >
          <Text style={styles.sectionTitle}>⚙️ Paramètres</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                {...item}
                delay={400 + index * 50}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </View>
        </Animated.View>

        {/* Logout Section */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.logoutSection}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              dispatch(logout());
              router.replace("/sign-in");
            }}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIcon}>
              <LogOut size={20} color={COLORS.error} />
            </View>
            <Text style={styles.logoutText}>Se déconnecter</Text>
            <ChevronRight size={20} color={COLORS.error} />
          </TouchableOpacity>
        </Animated.View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Oumi&apos;School v1.0.0</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionBadgeText}>Dernière version</Text>
          </View>
        </View>
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
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.1,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#8B5CF6",
      top: -50,
      right: -50,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#10B981",
      top: 50,
      left: -30,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Hero Card
    heroCard: {
      marginHorizontal: 20,
      marginTop: 16,
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
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    avatarSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.3)",
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 24,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontFamily: FONTS.fredoka,
      fontSize: 26,
      color: COLORS.neutral.white,
      marginBottom: 8,
    },
    roleBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
    },
    roleBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -30,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 50,
    },
    // Info Pills
    infoPillsScroll: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
    },
    infoPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginRight: 12,
    },
    infoPillIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    infoPillLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    infoPillValue: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    // Menu Section
    menuSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
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
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
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
      color: colors.textPrimary,
      marginBottom: 2,
    },
    menuItemTitleDestructive: {
      color: COLORS.error,
    },
    menuItemSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    // Logout Section
    logoutSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FEE2E2",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "#FECACA",
    },
    logoutIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: "rgba(239, 68, 68, 0.15)",
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
    // Version
    versionContainer: {
      alignItems: "center",
      paddingBottom: 24,
    },
    versionText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 8,
    },
    versionBadge: {
      backgroundColor: "#10B98115",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    versionBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#10B981",
      fontWeight: "600",
    },
  });
