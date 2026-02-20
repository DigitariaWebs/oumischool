import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
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
    parentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
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
    parentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
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
    parentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
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
    parentAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
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
];

type TabType = "pending" | "accepted" | "declined";

export default function TutorRequestsScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>("pending");
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

  const filteredRequests = requests.filter((req) => req.status === selectedTab);
  const pendingCount = requests.filter((req) => req.status === "pending").length;

  const tabs: { key: TabType; label: string }[] = [
    { key: "pending", label: "En attente" },
    { key: "accepted", label: "Acceptées" },
    { key: "declined", label: "Refusées" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>DEMANDES</Text>
            <Text style={styles.headerTitle}>Demandes reçues</Text>
          </View>
          {pendingCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>

        {/* Carte statistiques */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{requests.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab.key)}
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
            </Pressable>
          ))}
        </View>

        {/* Liste des demandes */}
        <View style={styles.requestsList}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <View key={request.id} style={[styles.requestCard, { borderLeftColor: request.subjectColor }]}>
                {/* En-tête avec parent */}
                <View style={styles.requestHeader}>
                  <Image source={{ uri: request.parentAvatar }} style={styles.parentAvatar} />
                  <View style={styles.parentInfo}>
                    <Text style={styles.parentName}>{request.parentName}</Text>
                    <Text style={styles.requestTime}>{request.requestedDate}</Text>
                  </View>
                  <View style={[styles.subjectPill, { backgroundColor: request.subjectColor + "15" }]}>
                    <Text style={[styles.subjectPillText, { color: request.subjectColor }]}>
                      {request.subject}
                    </Text>
                  </View>
                </View>

                {/* Infos enfant */}
                <View style={styles.childInfo}>
                  <User size={12} color="#64748B" />
                  <Text style={styles.childText}>
                    {request.childName} • {request.childAge} ans • {request.childGrade}
                  </Text>
                </View>

                {/* Détails session */}
                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <Calendar size={12} color="#64748B" />
                    <Text style={styles.detailText}>
                      {request.preferredDay} • {request.preferredTime}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    {request.mode === "online" ? (
                      <>
                        <Video size={12} color="#6366F1" />
                        <Text style={styles.detailText}>En ligne</Text>
                      </>
                    ) : (
                      <>
                        <MapPin size={12} color="#6366F1" />
                        <Text style={styles.detailText}>{request.location}</Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Message (optionnel) */}
                {request.message && (
                  <View style={styles.messageBox}>
                    <Text style={styles.messageText}>"{request.message}"</Text>
                  </View>
                )}

                {/* Prix */}
                <View style={styles.priceRow}>
                  <Clock size={12} color="#64748B" />
                  <Text style={styles.priceText}>{request.pricePerHour} MAD / heure</Text>
                </View>

                {/* Actions ou statut */}
                {request.status === "pending" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDecline(request.id)}
                    >
                      <XCircle size={16} color="#EF4444" />
                      <Text style={styles.declineText}>Refuser</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(request.id)}
                    >
                      <CheckCircle size={16} color="white" />
                      <Text style={styles.acceptText}>Accepter</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {request.status === "accepted" && (
                  <View style={styles.statusAccepted}>
                    <CheckCircle size={14} color="#10B981" />
                    <Text style={styles.statusAcceptedText}>Acceptée</Text>
                  </View>
                )}

                {request.status === "declined" && (
                  <View style={styles.statusDeclined}>
                    <XCircle size={14} color="#EF4444" />
                    <Text style={styles.statusDeclinedText}>Refusée</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Inbox size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Aucune demande</Text>
              <Text style={styles.emptyText}>
                {selectedTab === "pending" && "Vous n'avez aucune demande en attente"}
                {selectedTab === "accepted" && "Vous n'avez accepté aucune demande"}
                {selectedTab === "declined" && "Vous n'avez refusé aucune demande"}
              </Text>
            </View>
          )}
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Voir plus de demandes</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  headerBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 30,
    alignItems: "center",
  },
  headerBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
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
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#6366F1",
  },
  tabBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
  },

  // Requests List
  requestsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  requestCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  parentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  requestTime: {
    fontSize: 11,
    color: "#94A3B8",
  },
  subjectPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  childText: {
    fontSize: 13,
    color: "#64748B",
  },
  details: {
    gap: 4,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#64748B",
  },
  messageBox: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  messageText: {
    fontSize: 13,
    color: "#1E293B",
    fontStyle: "italic",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginBottom: 12,
  },
  priceText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  declineText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    borderRadius: 12,
  },
  acceptText: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },

  // Status
  statusAccepted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusAcceptedText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
  },
  statusDeclined: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusDeclinedText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

  // Source Button
  sourceButton: {
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    marginTop: 20,
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