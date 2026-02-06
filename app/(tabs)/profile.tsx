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
          style={[
            styles.menuIcon,
            destructive && styles.menuIconDestructive,
          ]}
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
        color={destructive ? COLORS.error : COLORS.neutral[400]}
      />
    </TouchableOpacity>
  </Animated.View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    {
      icon: <Settings size={20} color={COLORS.secondary[700]} />,
      title: "Paramètres",
      subtitle: "Préférences et notifications",
      onPress: () => console.log("Settings"),
    },
    {
      icon: <Bell size={20} color={COLORS.secondary[700]} />,
      title: "Notifications",
      subtitle: "Gérer les alertes",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: <CreditCard size={20} color={COLORS.secondary[700]} />,
      title: "Abonnement",
      subtitle: "Family • 19€/mois",
      onPress: () => console.log("Subscription"),
    },
    {
      icon: <HelpCircle size={20} color={COLORS.secondary[700]} />,
      title: "Aide & Support",
      subtitle: "FAQ et contact",
      onPress: () => console.log("Help"),
    },
    {
      icon: <Shield size={20} color={COLORS.secondary[700]} />,
      title: "Confidentialité",
      subtitle: "Données et sécurité",
      onPress: () => console.log("Privacy"),
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
              <User size={48} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.profileName}>{user?.name || "Utilisateur"}</Text>
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
            <Mail size={20} color={COLORS.secondary[600]} />
            <Text style={styles.infoText}>{user?.email || "email@example.com"}</Text>
          </View>
          {user?.phoneNumber && (
            <View style={styles.infoRow}>
              <Phone size={20} color={COLORS.secondary[600]} />
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          )}
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              {...item}
              delay={400 + index * 50}
            />
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
        <Text style={styles.versionText}>Oumi'School v1.0.0</Text>
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
    backgroundColor: COLORS.neutral.white,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
