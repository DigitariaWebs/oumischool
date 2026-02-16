import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Video,
  Calendar,
  User,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

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
    message: "Je cherche un professeur pour améliorer l'orthographe de ma fille.",
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

export default function TutorRequestsScreen() {
  const [selectedTab, setSelectedTab] = useState<
    "pending" | "accepted" | "declined"
  >("pending");
  const [requests, setRequests] = useState<TutoringRequest[]>(mockRequests);

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

  const filteredRequests = requests.filter(
    (req) => req.status === selectedTab,
  );

  const pendingCount = requests.filter((req) => req.status === "pending").length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.header}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Demandes</Text>
            <Text style={styles.headerSubtitle}>
              {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.tabsContainer}
        >
          <TouchableOpacity
            style={[styles.tab, selectedTab === "pending" && styles.tabActive]}
            onPress={() => setSelectedTab("pending")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "pending" && styles.tabTextActive,
              ]}
            >
              En attente
            </Text>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "accepted" && styles.tabActive]}
            onPress={() => setSelectedTab("accepted")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "accepted" && styles.tabTextActive,
              ]}
            >
              Acceptées
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "declined" && styles.tabActive]}
            onPress={() => setSelectedTab("declined")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "declined" && styles.tabTextActive,
              ]}
            >
              Refusées
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Requests List */}
        <View style={styles.requestsList}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <Animated.View
                key={request.id}
                entering={FadeInDown.delay(400 + index * 100).duration(600)}
                style={styles.requestCard}
              >
                {/* Header with Parent Info */}
                <View style={styles.requestHeader}>
                  <Image
                    source={{ uri: request.parentAvatar }}
                    style={styles.parentAvatar}
                  />
                  <View style={styles.requestHeaderInfo}>
                    <Text style={styles.parentName}>{request.parentName}</Text>
                    <Text style={styles.requestTime}>{request.requestedDate}</Text>
                  </View>
                </View>

                {/* Child Info */}
                <View style={styles.childInfo}>
                  <View style={styles.childInfoRow}>
                    <User size={16} color={COLORS.secondary[600]} />
                    <Text style={styles.childInfoText}>
                      {request.childName} • {request.childAge} ans • {request.childGrade}
                    </Text>
                  </View>
                </View>

                {/* Subject Badge */}
                <View
                  style={[
                    styles.subjectBadge,
                    { backgroundColor: request.subjectColor + "20" },
                  ]}
                >
                  <Text
                    style={[styles.subjectText, { color: request.subjectColor }]}
                  >
                    {request.subject}
                  </Text>
                </View>

                {/* Session Details */}
                <View style={styles.sessionDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={COLORS.secondary[600]} />
                    <Text style={styles.detailText}>
                      {request.preferredDay} • {request.preferredTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    {request.mode === "online" ? (
                      <>
                        <Video size={16} color={COLORS.primary.DEFAULT} />
                        <Text style={styles.detailText}>En ligne</Text>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} color={COLORS.primary.DEFAULT} />
                        <Text style={styles.detailText}>
                          {request.location || "Présentiel"}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Message */}
                {request.message && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{request.message}</Text>
                  </View>
                )}

                {/* Price */}
                <View style={styles.priceContainer}>
                  <Clock size={16} color={COLORS.secondary[600]} />
                  <Text style={styles.priceText}>
                    {request.pricePerHour} MAD/heure
                  </Text>
                </View>

                {/* Actions */}
                {request.status === "pending" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDecline(request.id)}
                      activeOpacity={0.7}
                    >
                      <XCircle size={20} color={COLORS.error} />
                      <Text style={styles.declineButtonText}>Refuser</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(request.id)}
                      activeOpacity={0.7}
                    >
                      <CheckCircle size={20} color="white" />
                      <Text style={styles.acceptButtonText}>Accepter</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Status Badge */}
                {request.status === "accepted" && (
                  <View style={styles.statusBadge}>
                    <CheckCircle size={16} color={COLORS.success} />
                    <Text style={styles.statusTextAccepted}>Acceptée</Text>
                  </View>
                )}

                {request.status === "declined" && (
                  <View style={styles.statusBadge}>
                    <XCircle size={16} color={COLORS.error} />
                    <Text style={styles.statusTextDeclined}>Refusée</Text>
                  </View>
                )}
              </Animated.View>
            ))
          ) : (
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.emptyState}
            >
              <View style={styles.emptyIcon}>
                <Calendar size={48} color={COLORS.secondary[300]} />
              </View>
              <Text style={styles.emptyTitle}>Aucune demande</Text>
              <Text style={styles.emptyText}>
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
    </View>
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
  header: {
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  tabText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  tabTextActive: {
    color: COLORS.neutral.white,
  },
  badge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  requestsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  requestCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  parentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
  },
  requestHeaderInfo: {
    flex: 1,
  },
  parentName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  requestTime: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  childInfo: {
    marginBottom: 12,
  },
  childInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  childInfoText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
  },
  subjectBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  subjectText: {
    fontFamily: FONTS.fredoka,
    fontSize: 13,
    fontWeight: "600",
  },
  sessionDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
  },
  messageContainer: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary.DEFAULT,
  },
  messageText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[800],
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    marginBottom: 12,
  },
  priceText: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  declineButtonText: {
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
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  acceptButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  statusTextAccepted: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.success,
  },
  statusTextDeclined: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.error,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    textAlign: "center",
    lineHeight: 22,
  },
});
