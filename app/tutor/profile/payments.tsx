import React, { useState } from "react";
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
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Ban,
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

export default function PaymentsScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const earnings = {
    month: 1250.5,
    week: 287.5,
    total: 8450.0,
  };

  const recentTransactions = [
    {
      id: "1",
      student: "Marie Dupont",
      amount: 45.0,
      date: "2024-01-15",
      status: "completed",
      hours: 1.5,
    },
    {
      id: "2",
      student: "Jean Martin",
      amount: 60.0,
      date: "2024-01-14",
      status: "completed",
      hours: 2,
    },
    {
      id: "3",
      student: "Sophie Bernard",
      amount: 30.0,
      date: "2024-01-13",
      status: "pending",
      hours: 1,
    },
    {
      id: "4",
      student: "Lucas Petit",
      amount: 75.0,
      date: "2024-01-12",
      status: "completed",
      hours: 2.5,
    },
  ];

  const periods = [
    { id: "week", label: "Semaine" },
    { id: "month", label: "Mois" },
    { id: "total", label: "Total" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.secondary[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiements</Text>
        <View style={{ width: 40 }} />
      </View>

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
              {earnings[selectedPeriod as keyof typeof earnings].toFixed(2)} €
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
              <Text style={styles.statValue}>+23%</Text>
              <Text style={styles.statLabel}>Ce mois</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Méthode de paiement</Text>
              <TouchableOpacity>
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentIcon}>
                <Ban size={24} color={COLORS.secondary[700]} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Compte bancaire</Text>
                <Text style={styles.paymentSubtitle}>•••• •••• •••• 4242</Text>
              </View>
              <CheckCircle size={20} color="#10B981" />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transactions récentes</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactionsCard}>
              {recentTransactions.map((transaction, index) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index !== recentTransactions.length - 1 &&
                      styles.transactionItemBorder,
                  ]}
                >
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionStatus,
                        transaction.status === "completed"
                          ? styles.statusCompleted
                          : styles.statusPending,
                      ]}
                    />
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionStudent}>
                        {transaction.student}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}{" "}
                        • {transaction.hours}h
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.transactionAmount}>
                    +{transaction.amount.toFixed(2)} €
                  </Text>
                </View>
              ))}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  earningsCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
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
    padding: 16,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.secondary[900],
    marginTop: 8,
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
  editText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  viewAllText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  paymentMethodCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  transactionsCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
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
