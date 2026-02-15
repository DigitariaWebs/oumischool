import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { X, Check } from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface Notification {
  id: string;
  type: "assignment" | "progress" | "achievement" | "message" | "reminder";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(width * 0.85, 400);

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    title: "Nouveau Devoir",
    message: "Un devoir de mathématiques a été assigné pour demain",
    time: "Il y a 5m",
    read: false,
    icon: "📝",
  },
  {
    id: "2",
    type: "progress",
    title: "Mise à jour des Progrès",
    message: "Sarah a complété 3 leçons aujourd'hui ! Excellent travail !",
    time: "Il y a 1h",
    read: false,
    icon: "📈",
  },
  {
    id: "3",
    type: "achievement",
    title: "Succès Débloqué",
    message: 'Ahmed a obtenu le badge "Maître des Maths"',
    time: "Il y a 2h",
    read: true,
    icon: "🏆",
  },
  {
    id: "4",
    type: "message",
    title: "Message du Professeur",
    message:
      "Mme. Johnson vous a envoyé un message concernant le projet de sciences",
    time: "Il y a 3h",
    read: true,
    icon: "💬",
  },
  {
    id: "5",
    type: "reminder",
    title: "Événement à Venir",
    message: "Réunion parents-professeurs prévue vendredi à 15h00",
    time: "Il y a 5h",
    read: true,
    icon: "🔔",
  },
  {
    id: "6",
    type: "progress",
    title: "Rapport Hebdomadaire Disponible",
    message: "Le rapport de progrès hebdomadaire de vos enfants est prêt",
    time: "Il y a 1j",
    read: true,
    icon: "📊",
  },
  {
    id: "7",
    type: "achievement",
    title: "Jalon de Série",
    message: "Sarah a atteint une série d'apprentissage de 7 jours !",
    time: "Il y a 2j",
    read: true,
    icon: "🔥",
  },
];

export default function NotificationDrawer({
  visible,
  onClose,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return COLORS.info;
      case "progress":
        return COLORS.success;
      case "achievement":
        return COLORS.warning;
      case "message":
        return "#8B5CF6";
      case "reminder":
        return COLORS.error;
      default:
        return COLORS.neutral[500];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          style={styles.drawer}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  style={[
                    styles.markAllButton,
                    unreadCount === 0 && styles.markAllButtonDisabled,
                  ]}
                  disabled={unreadCount === 0}
                >
                  <Check size={18} color={COLORS.neutral.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={COLORS.neutral.white} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filter === "all" && styles.filterButtonActive,
                ]}
                onPress={() => setFilter("all")}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === "all" && styles.filterButtonTextActive,
                  ]}
                >
                  Tout ({notifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filter === "unread" && styles.filterButtonActive,
                ]}
                onPress={() => setFilter("unread")}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === "unread" && styles.filterButtonTextActive,
                  ]}
                >
                  Non lu ({unreadCount})
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredNotifications.length === 0 ? (
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.emptyState}
              >
                <Text style={styles.emptyStateIcon}>🔔</Text>
                <Text style={styles.emptyStateTitle}>Aucune notification</Text>
                <Text style={styles.emptyStateText}>
                  {filter === "unread"
                    ? "Vous êtes à jour ! Aucune notification non lue."
                    : "Vous n'avez pas encore de notifications."}
                </Text>
              </Animated.View>
            ) : (
              filteredNotifications.map((notification, index) => (
                <Animated.View
                  key={notification.id}
                  entering={FadeInDown.delay(index * 50).duration(400)}
                >
                  <TouchableOpacity
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.notificationCardUnread,
                    ]}
                    onPress={() => handleMarkAsRead(notification.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.notificationIcon,
                        {
                          backgroundColor: `${getNotificationColor(notification.type)}20`,
                        },
                      ]}
                    >
                      <Text style={styles.notificationIconEmoji}>
                        {notification.icon}
                      </Text>
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text
                          style={styles.notificationTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                      <Text
                        style={styles.notificationMessage}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.neutral[50],
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
  unreadBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  markAllButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  markAllButtonDisabled: {
    opacity: 0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: COLORS.neutral.white,
  },
  filterButtonText: {
    fontFamily: FONTS.primary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  filterButtonTextActive: {
    color: "#667eea",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationCardUnread: {
    backgroundColor: "#F0F9FF",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationIconEmoji: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: FONTS.primary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.neutral[900],
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.info,
    marginLeft: 8,
  },
  notificationMessage: {
    fontFamily: FONTS.primary,
    fontSize: 14,
    color: COLORS.neutral[600],
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    color: COLORS.neutral[400],
  },
  emptyState: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.neutral[900],
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontFamily: FONTS.primary,
    fontSize: 14,
    color: COLORS.neutral[600],
    textAlign: "center",
    lineHeight: 20,
  },
});
