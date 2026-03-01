import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useMyEarnings, useMyRevenue, useMyPayouts } from "@/hooks/api/tutors";

export default function PaymentsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { data: earningsData, isLoading: earningsLoading } = useMyEarnings();
  const { data: revenueData = [], isLoading: revenueLoading } = useMyRevenue();
  const { data: payoutsData = [], isLoading: payoutsLoading } = useMyPayouts();

  const weekStart = useMemo(() => {
    const now = new Date();
    const d = new Date(now);
    d.setDate(now.getDate() - 7);
    return d;
  }, []);

  const earnings = useMemo(() => {
    const weeklyRevenue = (Array.isArray(revenueData) ? revenueData : [])
      .filter((r) => {
        const sessionDate = r.session?.startTime
          ? new Date(r.session.startTime)
          : r.createdAt
            ? new Date(r.createdAt)
            : null;
        return sessionDate && sessionDate >= weekStart;
      })
      .reduce((sum, r) => sum + Number(r.net ?? 0), 0);

    return {
      month: Number(earningsData?.thisMonth ?? 0),
      week: Number(weeklyRevenue),
      total: Number(earningsData?.total ?? 0),
    };
  }, [earningsData, revenueData, weekStart]);

  const periods = [
    { id: "week", label: "Semaine" },
    { id: "month", label: "Mois" },
    { id: "total", label: "Total" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.earningsCard}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.earningsGradient}
          >
            <View style={styles.earningsHeader}>
              <DollarSign size={32} color={COLORS.neutral.white} />
              <Text style={styles.earningsLabel}>Revenus</Text>
            </View>
            <Text style={styles.earningsAmount}>
              {earningsLoading
                ? "-"
                : `${earnings[selectedPeriod as keyof typeof earnings].toFixed(2)} €`}
            </Text>
            <View style={styles.periodSelector}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.id && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period.id)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period.id &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#10B981" />
              <Text style={styles.statValue}>
                {earningsLoading ? "-" : `${Math.round(earnings.month)}€`}
              </Text>
              <Text style={styles.statLabel}>Ce mois</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>
                {revenueLoading ? "-" : revenueData.length}
              </Text>
              <Text style={styles.statLabel}>Revenus</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Revenus récents</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactionsCard}>
              {revenueLoading ? (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>
                    Chargement...
                  </Text>
                </View>
              ) : (Array.isArray(revenueData) ? revenueData : []).length ===
                0 ? (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>
                    Aucun revenu disponible.
                  </Text>
                </View>
              ) : (
                (Array.isArray(revenueData) ? revenueData : [])
                  .slice(0, 10)
                  .map((revenue, index) => {
                    const isResourceSale =
                      !revenue.session && !!revenue.resource;
                    const session = revenue.session;
                    const start = session?.startTime
                      ? new Date(session.startTime)
                      : null;
                    const end = session?.endTime
                      ? new Date(session.endTime)
                      : null;
                    const hours =
                      start && end
                        ? Math.max(
                            0.5,
                            Math.round(
                              ((end.getTime() - start.getTime()) / 3_600_000) *
                                10,
                            ) / 10,
                          )
                        : 0;
                    const childName =
                      (session?.child?.name ??
                        [
                          session?.child?.user?.firstName,
                          session?.child?.user?.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")) ||
                      "Élève";

                    const label = isResourceSale
                      ? (revenue.resource?.title ?? "Vente de ressource")
                      : childName;
                    const sublabel = isResourceSale
                      ? `Ressource • ${new Date(revenue.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
                      : `${start ? start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "-"} • ${hours}h`;

                    return (
                      <View
                        key={revenue.id}
                        style={[
                          styles.transactionItem,
                          index !==
                            Math.min(
                              (Array.isArray(revenueData) ? revenueData : [])
                                .length,
                              10,
                            ) -
                              1 && styles.transactionItemBorder,
                        ]}
                      >
                        <View style={styles.transactionLeft}>
                          <View
                            style={[
                              styles.transactionStatus,
                              styles.statusCompleted,
                            ]}
                          />
                          <View style={styles.transactionInfo}>
                            <Text style={styles.transactionStudent}>
                              {label}
                            </Text>
                            <Text style={styles.transactionDate}>
                              {sublabel}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.transactionAmount}>
                          +{Number(revenue.net ?? 0).toFixed(2)} €
                        </Text>
                      </View>
                    );
                  })
              )}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Historique des versements</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactionsCard}>
              {payoutsLoading ? (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>
                    Chargement...
                  </Text>
                </View>
              ) : payoutsData.length === 0 ? (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>
                    Aucun versement disponible.
                  </Text>
                </View>
              ) : (
                payoutsData.slice(0, 10).map((payout, index) => (
                  <View
                    key={payout.id}
                    style={[
                      styles.transactionItem,
                      index !== Math.min(payoutsData.length, 10) - 1 &&
                        styles.transactionItemBorder,
                    ]}
                  >
                    <View style={styles.transactionLeft}>
                      <View
                        style={[
                          styles.transactionStatus,
                          payout.status === "PAID"
                            ? styles.statusCompleted
                            : payout.status === "FAILED"
                              ? styles.statusFailed
                              : styles.statusPending,
                        ]}
                      />
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionStudent}>
                          {payout.method || "Virement bancaire"}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {payout.paidAt
                            ? new Date(payout.paidAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : payout.periodStart && payout.periodEnd
                              ? `${new Date(payout.periodStart).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${new Date(payout.periodEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
                              : "-"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.payoutRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          payout.status === "FAILED" && styles.amountFailed,
                        ]}
                      >
                        {payout.status === "FAILED"
                          ? "-"
                          : `+${Number(payout.amount).toFixed(2)} €`}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          payout.status === "PAID"
                            ? styles.badgePaid
                            : payout.status === "FAILED"
                              ? styles.badgeFailed
                              : styles.badgeRecorded,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            payout.status === "PAID"
                              ? styles.badgeTextPaid
                              : payout.status === "FAILED"
                                ? styles.badgeTextFailed
                                : styles.badgeTextRecorded,
                          ]}
                        >
                          {payout.status === "PAID"
                            ? "Payé"
                            : payout.status === "FAILED"
                              ? "Échoué"
                              : "Enregistré"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color={COLORS.secondary[700]} />
            <Text style={styles.downloadButtonText}>Télécharger le relevé</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingTop: 16,
  },
  earningsCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  earningsGradient: {
    padding: 24,
  },
  earningsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  earningsLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  earningsAmount: {
    fontFamily: FONTS.fredoka,
    fontSize: 42,
    color: COLORS.neutral.white,
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: COLORS.neutral.white,
  },
  periodButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: COLORS.secondary[700],
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.secondary[900],
    marginTop: 8,
    fontWeight: "700",
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary[900],
  },
  viewAllText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  transactionsCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  emptyTransactions: {
    padding: 16,
    alignItems: "center",
  },
  emptyTransactionsText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.neutral.white,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  transactionStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: "#10B981",
  },
  statusPending: {
    backgroundColor: "#F59E0B",
  },
  statusFailed: {
    backgroundColor: "#EF4444",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionStudent: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  transactionAmount: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  amountFailed: {
    color: "#EF4444",
  },
  payoutRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePaid: {
    backgroundColor: "#D1FAE5",
  },
  badgeFailed: {
    backgroundColor: "#FEE2E2",
  },
  badgeRecorded: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextPaid: {
    color: "#059669",
  },
  badgeTextFailed: {
    color: "#DC2626",
  },
  badgeTextRecorded: {
    color: "#D97706",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  downloadButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
});
