import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Award,
  MessageSquare,
  Bell,
  Check,
  X,
  Sparkles,
  Zap,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Notification {
  id: string;
  type: "assignment" | "progress" | "achievement" | "message" | "reminder";
  title: string;
  message: string;
  time: string;
  date: "TODAY" | "Yesterday" | string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "progress",
    title: "Leçon Terminée",
    message: "Sophia a terminé la leçon de mathématiques avec un score de 95%",
    time: "Il y a 5m",
    date: "TODAY",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Session de Tutorat",
    message: "Rappel : Session avec Marie Dupont aujourd'hui à 15h00",
    time: "Il y a 30m",
    date: "TODAY",
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    title: "Nouveau Badge",
    message: 'Lucas a débloqué le badge "Expert en Lecture" !',
    time: "Il y a 2h",
    date: "TODAY",
    read: false,
  },
  {
    id: "4",
    type: "message",
    title: "Message du Tuteur",
    message: "Jean Martin a partagé de nouvelles ressources pour les sciences",
    time: "Il y a 3h",
    date: "TODAY",
    read: true,
  },
  {
    id: "5",
    type: "assignment",
    title: "Nouveau Plan Hebdomadaire",
    message:
      "Le plan de cours de la semaine prochaine est maintenant disponible",
    time: "Il y a 5h",
    date: "TODAY",
    read: true,
  },
  {
    id: "6",
    type: "reminder",
    title: "Abonnement",
    message: "Votre essai gratuit se termine dans 3 jours",
    time: "Il y a 8h",
    date: "Yesterday",
    read: true,
  },
  {
    id: "7",
    type: "progress",
    title: "Rapport Hebdomadaire",
    message: "Le rapport de progrès de vos enfants est disponible",
    time: "Il y a 1j",
    date: "Yesterday",
    read: true,
  },
  {
    id: "8",
    type: "achievement",
    title: "Série d'Apprentissage",
    message: "Sophia maintient une série de 7 jours consécutifs !",
    time: "Il y a 1j",
    date: "Yesterday",
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconColor = "#FFF";
    const iconSize = 24;
    switch (type) {
      case "assignment":
        return <Calendar size={iconSize} color={iconColor} />;
      case "progress":
        return <BookOpen size={iconSize} color={iconColor} />;
      case "achievement":
        return <Award size={iconSize} color={iconColor} />;
      case "message":
        return <MessageSquare size={iconSize} color={iconColor} />;
      case "reminder":
        return <Bell size={iconSize} color={iconColor} />;
      default:
        return <Bell size={iconSize} color={iconColor} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return "#3B82F6"; // Blue - Calendar/Plan
      case "progress":
        return COLORS.primary.DEFAULT; // Primary - Main actions
      case "achievement":
        return "#8B5CF6"; // Purple - AI/Coach
      case "message":
        return "#10B981"; // Green - Messages
      case "reminder":
        return "#F59E0B"; // Orange - Subscription/Pricing
      default:
        return COLORS.neutral[500];
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const date = notification.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {} as Record<string, Notification[]>,
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount} non lues</Text>
            </View>
          )}
        </View>
        <View style={styles.placeholder} />
      </Animated.View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Stats Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600).springify()}
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
                  <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Centre de notifications</Text>
              </View>
              <Text style={styles.heroAmount}>
                {notifications.length}
                <Text style={styles.heroSuffix}> alertes</Text>
              </Text>
              <View style={styles.heroBadge}>
                <Zap size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  {unreadCount} en attente de lecture
                </Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {Object.entries(groupedNotifications).map(
          ([date, notifs], groupIndex) => (
            <Animated.View
              key={date}
              entering={FadeInDown.delay(200 + groupIndex * 100)
                .duration(500)
                .springify()}
              style={styles.dateGroup}
            >
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>
                  {date === "TODAY"
                    ? "AUJOURD'HUI"
                    : date === "Yesterday"
                      ? "Hier"
                      : date}
                </Text>
                {date === "TODAY" && (
                  <TouchableOpacity onPress={handleMarkAllAsRead}>
                    <Text style={styles.markAsReadText}>
                      Tout marquer comme lu
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Notifications Card */}
              <View style={styles.notificationsCard}>
                {notifs.map((notification, index) => (
                  <View
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      index !== notifs.length - 1 &&
                        styles.notificationItemBorder,
                    ]}
                  >
                    <View
                      style={[
                        styles.notificationIcon,
                        {
                          backgroundColor: getNotificationColor(
                            notification.type,
                          ),
                        },
                      ]}
                    >
                      {getNotificationIcon(notification.type)}
                    </View>

                    <View style={styles.notificationContent}>
                      <View style={styles.notificationTop}>
                        <Text style={styles.notificationTitle}>
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>

                    <View style={styles.notificationActions}>
                      {!notification.read && (
                        <TouchableOpacity
                          onPress={() => handleMarkAsRead(notification.id)}
                          style={styles.actionButton}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Check size={18} color="#4ADE80" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => handleDismiss(notification.id)}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <X size={18} color="#8E8E93" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          ),
        )}
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
    // Blob Background
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
      top: 80,
      left: -30,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    headerCenter: {
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
    },
    headerBadge: {
      backgroundColor: "#EF444420",
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
      marginTop: 4,
    },
    headerBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#EF4444",
      fontWeight: "600",
    },
    placeholder: {
      width: 44,
    },
    // Hero Card
    heroCard: {
      marginHorizontal: 0,
      marginBottom: 24,
      borderRadius: 24,
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
      marginBottom: 8,
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
    heroAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 48,
      color: COLORS.neutral.white,
      lineHeight: 56,
    },
    heroSuffix: {
      fontSize: 24,
      opacity: 0.9,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    heroBadgeText: {
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    dateGroup: {
      marginBottom: 24,
    },
    dateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    dateText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    markAsReadText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "#10B981",
      fontWeight: "600",
    },
    notificationsCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    notificationItem: {
      flexDirection: "row",
      padding: 16,
      alignItems: "flex-start",
    },
    notificationItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    notificationContent: {
      flex: 1,
      marginRight: 8,
    },
    notificationTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    notificationTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      flex: 1,
      marginRight: 8,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.primary.DEFAULT,
    },
    notificationActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginLeft: 4,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
    },
    notificationMessage: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginBottom: 6,
    },
    notificationTime: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textMuted,
    },
  });
