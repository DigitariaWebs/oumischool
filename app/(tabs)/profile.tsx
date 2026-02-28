import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { THEME } from "@/config/theme";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useLogout } from "@/hooks/api/auth";
import { useCurrentSubscription } from "@/hooks/api/subscriptions";
import { HapticPressable } from "@/components/ui/haptic-pressable";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogout();

  const { data: subscription, isLoading: subscriptionLoading } =
    useCurrentSubscription();

  const currentPlan = subscription?.plan;
  const isActive =
    subscription?.status === "ACTIVE" &&
    new Date(subscription.expiresAt) > new Date();

  const getStatusConfig = () => {
    if (!subscription || !currentPlan) {
      return {
        label: "Aucun abonnement",
        color: THEME.colors.error,
        Icon: AlertCircle,
        bgColor: THEME.colors.error + "15",
      };
    }

    switch (subscription.status) {
      case "ACTIVE":
        return {
          label: "Actif",
          color: "#10B981",
          Icon: CheckCircle,
          bgColor: "#10B981" + "15",
        };
      case "INACTIVE":
      case "UNPAID":
        return {
          label: "En attente de paiement",
          color: "#F59E0B",
          Icon: Clock,
          bgColor: "#F59E0B" + "15",
        };
      case "CANCELLED":
        return {
          label: "Annulé",
          color: THEME.colors.error,
          Icon: AlertCircle,
          bgColor: THEME.colors.error + "15",
        };
      case "EXPIRED":
        return {
          label: "Expiré",
          color: THEME.colors.error,
          Icon: AlertCircle,
          bgColor: THEME.colors.error + "15",
        };
      default:
        return {
          label: subscription.status,
          color: THEME.colors.secondaryText,
          Icon: Clock,
          bgColor: THEME.colors.secondaryLight,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.Icon;

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
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header simple */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>PROFIL</Text>
          <Text style={styles.headerTitle}>Mon compte</Text>
        </View>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View
              style={[styles.avatar, { backgroundColor: THEME.colors.primary }]}
            >
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

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          {subscriptionLoading ? (
            <View style={styles.subscriptionHeader}>
              <View style={styles.subscriptionIcon}>
                <CreditCard size={24} color={THEME.colors.primary} />
              </View>
              <View style={styles.subscriptionInfo}>
                <Text style={styles.subscriptionTitle}>Votre abonnement</Text>
                <ActivityIndicator
                  size="small"
                  color={THEME.colors.primary}
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.subscriptionHeader}>
                <View style={styles.subscriptionIcon}>
                  <CreditCard size={24} color={THEME.colors.primary} />
                </View>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionTitle}>Votre abonnement</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig.bgColor },
                    ]}
                  >
                    <StatusIcon size={12} color={statusConfig.color} />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: statusConfig.color },
                      ]}
                    >
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
              </View>

              {currentPlan ? (
                <>
                  <View style={styles.subscriptionDetails}>
                    <View style={styles.subscriptionDetailRow}>
                      <Text style={styles.subscriptionDetailLabel}>Plan</Text>
                      <Text style={styles.subscriptionDetailValue}>
                        {currentPlan.name}
                      </Text>
                    </View>
                    <View style={styles.subscriptionDetailRow}>
                      <Text style={styles.subscriptionDetailLabel}>Prix</Text>
                      <Text style={styles.subscriptionDetailValue}>
                        {currentPlan.price}€/mois
                      </Text>
                    </View>
                    {subscription?.expiresAt && (
                      <View style={styles.subscriptionDetailRow}>
                        <Text style={styles.subscriptionDetailLabel}>
                          Expire le
                        </Text>
                        <Text style={styles.subscriptionDetailValue}>
                          {new Date(subscription.expiresAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </Text>
                      </View>
                    )}
                  </View>

                  {!isActive && (
                    <TouchableOpacity
                      style={styles.upgradeButton}
                      onPress={() => router.push("/pricing")}
                    >
                      <Sparkles size={16} color="white" />
                      <Text style={styles.upgradeButtonText}>
                        {subscription?.status === "UNPAID"
                          ? "Payer maintenant"
                          : "Choisir une offre"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isActive && (
                    <TouchableOpacity
                      style={styles.changePlanButton}
                      onPress={() => router.push("/pricing")}
                    >
                      <Text style={styles.changePlanButtonText}>
                        Changer de plan
                      </Text>
                      <ChevronRight size={16} color={THEME.colors.primary} />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.noSubscription}>
                  <Text style={styles.noSubscriptionText}>
                    Vous n&apos;avez pas d&apos;abonnement actif.
                  </Text>
                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={() => router.push("/pricing")}
                  >
                    <Text style={styles.subscribeButtonText}>
                      Voir les offres
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item: any, index) => (
              <HapticPressable
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={item.onPress}
                hapticType="selection"
                scale={0.98}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>{item.icon}</View>
                  <View style={styles.menuItemText}>
                    <View style={styles.menuItemTitleRow}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.showStatusBadge && (
                        <View
                          style={[
                            styles.menuStatusBadge,
                            { backgroundColor: item.statusConfig.bgColor },
                          ]}
                        >
                          <item.statusConfig.Icon
                            size={10}
                            color={item.statusConfig.color}
                          />
                          <Text
                            style={[
                              styles.menuStatusBadgeText,
                              { color: item.statusConfig.color },
                            ]}
                          >
                            {item.statusConfig.label}
                          </Text>
                        </View>
                      )}
                    </View>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={16} color={THEME.colors.secondaryText} />
              </HapticPressable>
            ))}
          </View>
        </View>

        {/* Déconnexion */}
        <HapticPressable
          style={styles.logoutButton}
          onPress={async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logoutMutation.mutateAsync().catch(() => {});
            dispatch(logout());
            router.replace("/sign-in");
          }}
          hapticType="warning"
          scale={0.98}
        >
          <LogOut size={18} color={THEME.colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </HapticPressable>

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
    backgroundColor: THEME.colors.white,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    paddingHorizontal: THEME.spacing.xxl,
    paddingTop: 20,
    paddingBottom: THEME.spacing.lg,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: THEME.colors.primary,
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: THEME.colors.text,
  },

  // Profile Card
  profileCard: {
    backgroundColor: THEME.colors.secondaryLight,
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.xxl,
    padding: 20,
    borderRadius: THEME.radius.xxl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: THEME.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.lg,
    backgroundColor: THEME.colors.primary,
  },
  avatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: THEME.colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: THEME.spacing.lg,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: THEME.spacing.sm,
  },
  contactText: {
    fontSize: 14,
    color: THEME.colors.subtext,
  },

  // Subscription Card
  subscriptionCard: {
    backgroundColor: THEME.colors.secondaryLight,
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.xxl,
    padding: 20,
    borderRadius: THEME.radius.xxl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  subscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.md,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  subscriptionDetails: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  subscriptionDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  subscriptionDetailLabel: {
    fontSize: 14,
    color: THEME.colors.subtext,
  },
  subscriptionDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.white,
  },
  changePlanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  changePlanButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.primary,
  },
  noSubscription: {
    alignItems: "center",
    paddingVertical: THEME.spacing.md,
  },
  noSubscriptionText: {
    fontSize: 14,
    color: THEME.colors.subtext,
    marginBottom: THEME.spacing.md,
  },
  subscribeButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.white,
  },
  menuStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  menuStatusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  menuItemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.xxl,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  menuCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    color: THEME.colors.text,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: THEME.colors.subtext,
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.error + "10",
    marginHorizontal: THEME.spacing.xxl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.error + "30",
  },
  logoutText: {
    fontSize: 15,
    color: THEME.colors.error,
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
    color: THEME.colors.secondaryText,
  },
});
