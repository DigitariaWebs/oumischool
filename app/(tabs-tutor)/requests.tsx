import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Video,
  Calendar,
  User,
  Inbox,
  TrendingUp,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";
import { BlobBackground, HeroCard, AnimatedSection } from "@/components/ui";

interface TutoringRequest {
  id: string;
  parentName: string;
  parentAvatar: string;
  childName: string;
  childAge: number;
  childGrade: string;
  subject: string;
  subjectColor: string;
  mode: "online" | "inPerson";
  location?: string;
  preferredDay: string;
  preferredTime: string;
  message?: string;
  requestedDate: string;
  status: "pending" | "accepted" | "declined";
  pricePerHour: number;
}

const mockRequests: TutoringRequest[] = [
  {
    id: "1",
    parentName: "Fatima Zahra",
    parentAvatar: "https://via.placeholder.com/100",
    childName: "Adam",
    childAge: 10,
    childGrade: "5ème année",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    mode: "online",
    preferredDay: "Lundi",
    preferredTime: "14:00 - 15:00",
    message: "Mon fils a besoin d'aide pour comprendre les fractions.",
    requestedDate: "Il y a 2 heures",
    status: "pending",
    pricePerHour: 150,
  },
  {
    id: "2",
    parentName: "Mohammed Bennani",
    parentAvatar: "https://via.placeholder.com/100",
    childName: "Sofia",
    childAge: 12,
    childGrade: "1ère année collège",
    subject: "Français",
    subjectColor: "#EF4444",
    mode: "inPerson",
    location: "Casablanca",
    preferredDay: "Mercredi",
    preferredTime: "16:00 - 17:00",
    message:
      "Je cherche un professeur pour améliorer l'orthographe de ma fille.",
    requestedDate: "Il y a 5 heures",
    status: "pending",
    pricePerHour: 180,
  },
  {
    id: "3",
    parentName: "Aisha El Mansouri",
    parentAvatar: "https://via.placeholder.com/100",
    childName: "Youssef",
    childAge: 14,
    childGrade: "3ème année collège",
    subject: "Sciences",
    subjectColor: "#10B981",
    mode: "online",
    preferredDay: "Vendredi",
    preferredTime: "15:00 - 16:00",
    requestedDate: "Il y a 1 jour",
    status: "pending",
    pricePerHour: 150,
  },
  {
    id: "4",
    parentName: "Karim Idrissi",
    parentAvatar: "https://via.placeholder.com/100",
    childName: "Lina",
    childAge: 11,
    childGrade: "6ème année",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    mode: "online",
    preferredDay: "Mardi",
    preferredTime: "10:00 - 11:00",
    requestedDate: "Il y a 2 jours",
    status: "accepted",
    pricePerHour: 150,
  },
  {
    id: "5",
    parentName: "Nadia Alami",
    parentAvatar: "https://via.placeholder.com/100",
    childName: "Omar",
    childAge: 13,
    childGrade: "2ème année collège",
    subject: "Français",
    subjectColor: "#EF4444",
    mode: "inPerson",
    location: "Rabat",
    preferredDay: "Jeudi",
    preferredTime: "14:00 - 15:00",
    requestedDate: "Il y a 3 jours",
    status: "declined",
    pricePerHour: 180,
  },
];

type TabType = "pending" | "accepted" | "declined";

export default function TutorRequestsScreen() {
  const { colors, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<TabType>("pending");
  const [requests, setRequests] = useState<TutoringRequest[]>(mockRequests);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const handleAccept = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "accepted" } : req,
      ),
    );
  };

  const handleDecline = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "declined" } : req,
      ),
    );
  };

  const filteredRequests = requests.filter((req) => req.status === selectedTab);
  const pendingCount = requests.filter(
    (req) => req.status === "pending",
  ).length;

  const tabs: { key: TabType; label: string }[] = [
    { key: "pending", label: "En attente" },
    { key: "accepted", label: "Acceptées" },
    { key: "declined", label: "Refusées" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BlobBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AnimatedSection delay={100}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Inbox size={20} color="white" />
            </View>
            <Text style={styles.headerTitle}>Demandes</Text>
            {pendingCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
        </AnimatedSection>

        {/* Hero */}
        <AnimatedSection delay={150} style={styles.heroWrapper}>
          <HeroCard
            title="Demandes reçues"
            value={`${requests.length}`}
            subtitle="demandes au total"
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${pendingCount} en attente de réponse`,
            }}
          />
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={250} style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedTab === tab.key && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.key === "pending" && pendingCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{pendingCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedSection>

        {/* Requests List */}
        <View style={styles.requestsList}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <Animated.View
                key={request.id}
                entering={FadeInDown.delay(350 + index * 80)
                  .duration(500)
                  .springify()}
                style={[styles.requestCard, { backgroundColor: colors.card }]}
              >
                {/* Subject accent strip */}
                <View
                  style={[
                    styles.subjectAccent,
                    { backgroundColor: request.subjectColor },
                  ]}
                />

                <View style={styles.requestInner}>
                  {/* Parent Row */}
                  <View style={styles.parentRow}>
                    <Image
                      source={{ uri: request.parentAvatar }}
                      style={[
                        styles.parentAvatar,
                        { borderColor: request.subjectColor + "40" },
                      ]}
                    />
                    <View style={styles.parentInfo}>
                      <Text
                        style={[
                          styles.parentName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {request.parentName}
                      </Text>
                      <Text
                        style={[
                          styles.requestTime,
                          { color: colors.textMuted },
                        ]}
                      >
                        {request.requestedDate}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.subjectPill,
                        { backgroundColor: request.subjectColor + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subjectPillText,
                          { color: request.subjectColor },
                        ]}
                      >
                        {request.subject}
                      </Text>
                    </View>
                  </View>

                  {/* Child Info */}
                  <View style={styles.childRow}>
                    <View
                      style={[
                        styles.childIconContainer,
                        { backgroundColor: colors.input },
                      ]}
                    >
                      <User size={14} color={colors.textSecondary} />
                    </View>
                    <Text
                      style={[
                        styles.childInfoText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {request.childName} • {request.childAge} ans •{" "}
                      {request.childGrade}
                    </Text>
                  </View>

                  {/* Session Details */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Calendar size={14} color={colors.textMuted} />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {request.preferredDay} • {request.preferredTime}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      {request.mode === "online" ? (
                        <>
                          <Video size={14} color={COLORS.primary.DEFAULT} />
                          <Text
                            style={[
                              styles.detailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            En ligne
                          </Text>
                        </>
                      ) : (
                        <>
                          <MapPin size={14} color={COLORS.primary.DEFAULT} />
                          <Text
                            style={[
                              styles.detailText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {request.location || "Présentiel"}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  {/* Message */}
                  {request.message && (
                    <View
                      style={[
                        styles.messageBox,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.03)",
                          borderLeftColor: request.subjectColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {request.message}
                      </Text>
                    </View>
                  )}

                  {/* Price Row */}
                  <View
                    style={[
                      styles.priceRow,
                      {
                        borderTopColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      },
                    ]}
                  >
                    <Clock size={14} color={colors.textMuted} />
                    <Text style={[styles.priceText, { color: colors.primary }]}>
                      {request.pricePerHour} MAD / heure
                    </Text>
                  </View>

                  {/* Actions */}
                  {request.status === "pending" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[
                          styles.declineButton,
                          {
                            backgroundColor: isDark
                              ? "rgba(239,68,68,0.12)"
                              : "#FEF2F2",
                            borderColor: isDark
                              ? "rgba(239,68,68,0.2)"
                              : "#FECACA",
                          },
                        ]}
                        onPress={() => handleDecline(request.id)}
                        activeOpacity={0.7}
                      >
                        <XCircle size={18} color={COLORS.error} />
                        <Text style={styles.declineText}>Refuser</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.acceptButton,
                          { backgroundColor: COLORS.primary.DEFAULT },
                        ]}
                        onPress={() => handleAccept(request.id)}
                        activeOpacity={0.7}
                      >
                        <CheckCircle size={18} color="white" />
                        <Text style={styles.acceptText}>Accepter</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Status Badge */}
                  {request.status === "accepted" && (
                    <View style={styles.statusRow}>
                      <View style={styles.statusBadgeAccepted}>
                        <CheckCircle size={14} color={COLORS.success} />
                        <Text style={styles.statusTextAccepted}>Acceptée</Text>
                      </View>
                    </View>
                  )}

                  {request.status === "declined" && (
                    <View style={styles.statusRow}>
                      <View style={styles.statusBadgeDeclined}>
                        <XCircle size={14} color={COLORS.error} />
                        <Text style={styles.statusTextDeclined}>Refusée</Text>
                      </View>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))
          ) : (
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={[styles.emptyState, { backgroundColor: colors.card }]}
            >
              <View
                style={[styles.emptyIcon, { backgroundColor: colors.input }]}
              >
                <Inbox size={40} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                Aucune demande
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {selectedTab === "pending" &&
                  "Vous n'avez aucune demande en attente"}
                {selectedTab === "accepted" &&
                  "Vous n'avez accepté aucune demande"}
                {selectedTab === "declined" &&
                  "Vous n'avez refusé aucune demande"}
              </Text>
            </Animated.View>
          )}
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
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    headerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
      flex: 1,
    },
    headerBadge: {
      backgroundColor: COLORS.error,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      minWidth: 26,
      alignItems: "center",
    },
    headerBadgeText: {
      fontFamily: FONTS.fredoka,
      fontSize: 13,
      color: "white",
      fontWeight: "600",
    },
    heroWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    tabsWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 4,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
    },
    tabActive: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    tabText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: "white",
    },
    tabBadge: {
      backgroundColor: COLORS.error,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 8,
      minWidth: 18,
      alignItems: "center",
    },
    tabBadgeText: {
      fontFamily: FONTS.fredoka,
      fontSize: 10,
      fontWeight: "700",
      color: "white",
    },
    requestsList: {
      paddingHorizontal: 20,
      gap: 14,
    },
    requestCard: {
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    subjectAccent: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
    },
    requestInner: {
      padding: 16,
      paddingLeft: 20,
    },
    parentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    parentAvatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      borderWidth: 2,
    },
    parentInfo: {
      flex: 1,
    },
    parentName: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      marginBottom: 2,
    },
    requestTime: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
    },
    subjectPill: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    subjectPillText: {
      fontFamily: FONTS.fredoka,
      fontSize: 12,
      fontWeight: "600",
    },
    childRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    childIconContainer: {
      width: 26,
      height: 26,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    childInfoText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
    },
    detailsRow: {
      gap: 6,
      marginBottom: 12,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    detailText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
    },
    messageBox: {
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 3,
    },
    messageText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      lineHeight: 19,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingTop: 10,
      borderTopWidth: 1,
      marginBottom: 12,
    },
    priceText: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      fontWeight: "600",
    },
    actions: {
      flexDirection: "row",
      gap: 10,
    },
    declineButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
    },
    declineText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.error,
    },
    acceptButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 12,
      borderRadius: 14,
    },
    acceptText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: "white",
    },
    statusRow: {
      alignItems: "flex-start",
    },
    statusBadgeAccepted: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: COLORS.success + "18",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
    },
    statusTextAccepted: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: COLORS.success,
    },
    statusBadgeDeclined: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: COLORS.error + "18",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
    },
    statusTextDeclined: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: COLORS.error,
    },
    emptyState: {
      borderRadius: 24,
      padding: 40,
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    emptyIcon: {
      width: 76,
      height: 76,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 18,
    },
    emptyTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      textAlign: "center",
      lineHeight: 21,
    },
  });
