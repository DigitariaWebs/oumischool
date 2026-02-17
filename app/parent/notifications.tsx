import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

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
  const { isDark } = useTheme();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

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
        backgroundColor={isDark ? COLORS.neutral[900] : "#F5F5F5"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft
            size={24}
            color={isDark ? COLORS.neutral[50] : COLORS.neutral[900]}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedNotifications).map(
          ([date, notifs], groupIndex) => (
            <Animated.View
              key={date}
              entering={FadeInDown.delay(groupIndex * 100).duration(400)}
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

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.neutral[900] : "#F5F5F5",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: isDark ? COLORS.neutral[900] : "#F5F5F5",
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      fontWeight: "600" as any,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.lg,
    },
    dateGroup: {
      marginBottom: SPACING.xl,
    },
    dateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    dateText: {
      fontFamily: FONTS.fredoka,
      fontSize: 14,
      fontWeight: "600" as any,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    markAsReadText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "#4ADE80",
      fontWeight: "500" as any,
    },
    notificationsCard: {
      backgroundColor: isDark ? COLORS.neutral[800] : "#FFFFFF",
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    notificationItem: {
      flexDirection: "row",
      padding: SPACING.lg,
      alignItems: "flex-start",
    },
    notificationItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.md,
    },
    notificationContent: {
      flex: 1,
      marginRight: SPACING.sm,
    },
    notificationTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    notificationTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "600" as any,
      color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
      flex: 1,
      marginRight: SPACING.xs,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#3B82F6",
    },
    notificationActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
      marginLeft: SPACING.xs,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
      justifyContent: "center",
      alignItems: "center",
    },
    notificationMessage: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: isDark ? COLORS.neutral[400] : COLORS.neutral[600],
      lineHeight: 18,
      marginBottom: 4,
    },
    notificationTime: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: isDark ? COLORS.neutral[500] : COLORS.neutral[500],
    },
  });
