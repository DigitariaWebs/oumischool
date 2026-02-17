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
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  delay,
  destructive,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
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
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const styles = useMemo(() => createStyles(colors), [colors]);

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
            colors={[COLORS.primary.DEFAULT, COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: user?.avatar || "https://via.placeholder.com/100",
                }}
                style={styles.avatarImage}
              />
            </View>
            <Text style={styles.profileName}>
              {user?.name || "Utilisateur"}
            </Text>
            <Text style={styles.profileRole}>
              {user?.role === "parent"
                ? "Parent"
                : user?.role === "child"
                  ? "Enfant"
                  : "Tuteur"}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Contact Info */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.infoCard}
        >
          <View style={styles.infoRow}>
            <Mail size={20} color={colors.icon} />
            <Text style={styles.infoText}>
              {user?.email || "email@example.com"}
            </Text>
          </View>
          {user?.phoneNumber && (
            <View style={styles.infoRow}>
              <Phone size={20} color={colors.icon} />
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          )}
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} delay={400 + index * 50} />
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
          delay={700}
          destructive
        />

        {/* Version */}
        <Text style={styles.versionText}>Oumi&apos;School v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: import("@/constants/theme").ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      borderWidth: 4,
      borderColor: "rgba(255,255,255,0.3)",
    },
    profileName: {
      fontFamily: FONTS.fredoka,
      fontSize: 28,
      color: COLORS.neutral.white,
      marginBottom: 4,
    },
    profileRole: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: COLORS.neutral[100],
      opacity: 0.9,
    },
    // Info Card
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 24,
      marginBottom: 24,
      gap: 12,
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
      color: colors.textSecondary,
    },
    // Menu
    menuSection: {
      backgroundColor: colors.card,
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
      borderRadius: 22,
      backgroundColor: colors.input,
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
    // Version
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 50,
    },
    versionText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 24,
    },
  });
