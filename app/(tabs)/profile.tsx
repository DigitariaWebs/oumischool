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
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useLogout } from "@/hooks/api/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogout();

  const menuItems = [
    {
      icon: <MessageSquare size={18} color="#64748B" />,
      title: "Messages",
      subtitle: "Conversations avec les tuteurs",
      onPress: () => router.push("/messaging"),
    },
    {
      icon: <Settings size={18} color="#64748B" />,
      title: "Paramètres",
      subtitle: "Préférences et notifications",
      onPress: () => router.push("/parent/profile/settings"),
    },
    {
      icon: <Bell size={18} color="#64748B" />,
      title: "Notifications",
      subtitle: "Gérer les alertes",
      onPress: () => router.push("/parent/profile/notifications"),
    },
    {
      icon: <CreditCard size={18} color="#64748B" />,
      title: "Abonnement",
      subtitle: "Family • 69€/mois",
      onPress: () => router.push("/pricing"),
    },
    {
      icon: <HelpCircle size={18} color="#64748B" />,
      title: "Aide & Support",
      subtitle: "FAQ et contact",
      onPress: () => router.push("/parent/profile/help"),
    },
    {
      icon: <Shield size={18} color="#64748B" />,
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
        {/* Header simple */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>PROFIL</Text>
          <Text style={styles.headerTitle}>Mon compte</Text>
        </View>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: "#6366F1" }]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || "Utilisateur"}
              </Text>
              <View style={styles.roleBadge}>
                <Sparkles size={12} color="#6366F1" />
                <Text style={styles.roleBadgeText}>
                  {user?.role === "parent" ? "Parent" : "Enfant"}
                </Text>
              </View>
            </View>
          </View>

          {/* Infos de contact */}
          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <Mail size={14} color="#64748B" />
              <Text style={styles.contactText}>
                {user?.email || "email@example.com"}
              </Text>
            </View>
            {user?.phoneNumber && (
              <View style={styles.contactItem}>
                <Phone size={14} color="#64748B" />
                <Text style={styles.contactText}>{user.phoneNumber}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
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

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>
            + Ajouter un mode de paiement
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#64748B",
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
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
  },
  logoutText: {
    fontSize: 15,
    color: "#EF4444",
    fontWeight: "600",
  },

  // Version
  versionContainer: {
    alignItems: "center",
    marginTop: 20,
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
