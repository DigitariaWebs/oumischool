import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Download,
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  Repeat,
  Receipt,
  Wallet,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RecurringPayment {
  id: string;
  tutorName: string;
  subject: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: string;
  sessionsPerWeek: number;
  color: string;
}

interface PaymentHistory {
  id: string;
  tutorName: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const savedCards: SavedCard[] = [
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "8888",
      expiry: "10/26",
      isDefault: false,
    },
  ];

  const recurringPayments: RecurringPayment[] = [
    {
      id: "1",
      tutorName: "Sophie Martin",
      subject: "Mathématiques",
      amount: 45.0,
      frequency: "weekly",
      nextPayment: "2024-01-20",
      status: "active",
      sessionsPerWeek: 2,
      color: "#3B82F6",
    },
    {
      id: "2",
      tutorName: "Jean Dupont",
      subject: "Français",
      amount: 60.0,
      frequency: "monthly",
      nextPayment: "2024-02-01",
      status: "active",
      sessionsPerWeek: 1,
      color: "#EF4444",
    },
    {
      id: "3",
      tutorName: "Marie Bernard",
      subject: "Anglais",
      amount: 30.0,
      frequency: "weekly",
      nextPayment: "2024-01-25",
      status: "pending",
      sessionsPerWeek: 1,
      color: "#10B981",
    },
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: "1",
      tutorName: "Sophie Martin",
      amount: 45.0,
      date: "2024-01-15",
      status: "completed",
      description: "Session de mathématiques",
    },
    {
      id: "2",
      tutorName: "Jean Dupont",
      amount: 60.0,
      date: "2024-01-14",
      status: "completed",
      description: "Session de français",
    },
    {
      id: "3",
      tutorName: "Marie Bernard",
      amount: 30.0,
      date: "2024-01-13",
      status: "pending",
      description: "Session d'anglais",
    },
    {
      id: "4",
      tutorName: "Sophie Martin",
      amount: 45.0,
      date: "2024-01-08",
      status: "completed",
      description: "Session de mathématiques",
    },
  ];

  const spending = {
    week: 135.0,
    month: 540.0,
    total: 2450.0,
  };

  const periods = [
    { id: "week", label: "Semaine" },
    { id: "month", label: "Mois" },
    { id: "total", label: "Total" },
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: recurringPayments.filter((p) => p.status === "active").length,
      label: "Actifs",
      color: "#10B981",
    },
    {
      icon: Calendar,
      value: paymentHistory.length,
      label: "Paiements",
      color: "#8B5CF6",
    },
    {
      icon: Clock,
      value: "4h",
      label: "Ce mois",
      color: "#F59E0B",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic background blobs */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiements</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Spending Overview Hero */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify()}
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
                <View style={styles.walletIcon}>
                  <Wallet size={22} color="rgba(255,255,255,0.95)" />
                </View>
                <Text style={styles.heroLabel}>Dépenses totales</Text>
              </View>

              <Text style={styles.heroAmount}>
                {spending[selectedPeriod as keyof typeof spending].toFixed(2)}
                <Text style={styles.heroCurrency}> €</Text>
              </Text>

              {/* Period Selector Pills */}
              <View style={styles.periodSelector}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period.id}
                    style={[
                      styles.periodPill,
                      selectedPeriod === period.id && styles.periodPillActive,
                    ]}
                    onPress={() => setSelectedPeriod(period.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.periodPillText,
                        selectedPeriod === period.id &&
                          styles.periodPillTextActive,
                      ]}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Decorative elements */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Stats Row - Horizontal scroll */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            {stats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statBubble,
                  { backgroundColor: stat.color + "15" },
                ]}
              >
                <View
                  style={[styles.statIconBg, { backgroundColor: stat.color }]}
                >
                  <stat.icon size={18} color="#FFF" />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Payment Methods Section */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💳 Moyens de paiement</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
              <Plus size={16} color={COLORS.primary.DEFAULT} />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            {savedCards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardItem,
                  card.isDefault && styles.cardItemDefault,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.cardIcon,
                      card.isDefault && styles.cardIconDefault,
                    ]}
                  >
                    <CreditCard
                      size={20}
                      color={
                        card.isDefault ? colors.primary : colors.textSecondary
                      }
                    />
                  </View>
                  <View>
                    <View style={styles.cardTypeRow}>
                      <Text style={styles.cardType}>{card.type}</Text>
                      {card.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>
                            Par défaut
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {card.last4}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardExpiry}>Exp. {card.expiry}</Text>
                  <ChevronRight size={18} color={COLORS.secondary[300]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recurring Payments Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔄 Paiements récurrents</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Gérer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recurringContainer}>
            {recurringPayments.map((payment, index) => (
              <TouchableOpacity
                key={payment.id}
                style={styles.recurringItem}
                activeOpacity={0.7}
              >
                <View style={styles.recurringLeft}>
                  <View
                    style={[
                      styles.subjectDot,
                      { backgroundColor: payment.color },
                    ]}
                  />
                  <View style={styles.recurringInfo}>
                    <Text style={styles.recurringTutor}>
                      {payment.tutorName}
                    </Text>
                    <View style={styles.recurringMeta}>
                      <Text style={styles.recurringSubject}>
                        {payment.subject}
                      </Text>
                      <View style={styles.recurringDot} />
                      <Text style={styles.recurringFreq}>
                        {payment.sessionsPerWeek}x/sem
                      </Text>
                    </View>
                    <Text style={styles.recurringNext}>
                      Prochain: {formatDate(payment.nextPayment)}
                    </Text>
                  </View>
                </View>
                <View style={styles.recurringRight}>
                  <Text style={styles.recurringAmount}>
                    {payment.amount.toFixed(2)} €
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      payment.status === "active"
                        ? styles.statusActive
                        : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        payment.status === "active"
                          ? styles.statusTextActive
                          : styles.statusTextPending,
                      ]}
                    >
                      {payment.status === "active" ? "Actif" : "En attente"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Payment History Section */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Historique</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyContainer}>
            {paymentHistory.map((transaction, index) => (
              <View
                key={transaction.id}
                style={[
                  styles.historyItem,
                  index !== paymentHistory.length - 1 &&
                    styles.historyItemBorder,
                ]}
              >
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyIcon,
                      transaction.status === "completed"
                        ? styles.historyIconCompleted
                        : styles.historyIconPending,
                    ]}
                  >
                    {transaction.status === "completed" ? (
                      <CheckCircle size={16} color="#10B981" />
                    ) : (
                      <Clock size={16} color="#F59E0B" />
                    )}
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTutor}>
                      {transaction.tutorName}
                    </Text>
                    <Text style={styles.historyDesc}>
                      {formatDate(transaction.date)} • {transaction.description}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.historyAmount,
                    transaction.status === "pending" &&
                      styles.historyAmountPending,
                  ]}
                >
                  {transaction.status === "completed" ? "+" : "-"}
                  {transaction.amount.toFixed(2)} €
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Download Statement */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={styles.downloadSection}
        >
          <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
            <Download size={20} color={colors.textPrimary} />
            <Text style={styles.downloadText}>Télécharger le relevé</Text>
          </TouchableOpacity>
        </Animated.View>
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
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 400,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.08,
    },
    blob1: {
      width: 220,
      height: 220,
      backgroundColor: "#8B5CF6",
      top: -60,
      right: -60,
    },
    blob2: {
      width: 160,
      height: 160,
      backgroundColor: "#10B981",
      top: 80,
      left: -40,
    },
    blob3: {
      width: 100,
      height: 100,
      backgroundColor: "#F59E0B",
      top: 200,
      right: 40,
    },
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
      borderRadius: 22,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      color: colors.textPrimary,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    heroCard: {
      marginHorizontal: 20,
      marginTop: 12,
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.5 : 0.3,
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
      gap: 10,
      marginBottom: 8,
    },
    walletIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    heroAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 48,
      color: COLORS.neutral.white,
      lineHeight: 56,
    },
    heroCurrency: {
      fontSize: 28,
      opacity: 0.9,
    },
    periodSelector: {
      flexDirection: "row",
      gap: 8,
      marginTop: 16,
    },
    periodPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    periodPillActive: {
      backgroundColor: COLORS.neutral.white,
    },
    periodPillText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      fontWeight: "600",
    },
    periodPillTextActive: {
      color: "#8B5CF6",
    },
    heroCircle1: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: "rgba(255,255,255,0.08)",
      top: -40,
      right: -40,
    },
    heroCircle2: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.06)",
      bottom: -30,
      right: 60,
    },
    statsScroll: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
    },
    statBubble: {
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginRight: 12,
      minWidth: 100,
    },
    statIconBg: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      marginBottom: 2,
    },
    statLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    section: {
      marginTop: 8,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    addButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },
    viewAllText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    cardsContainer: {
      gap: 10,
    },
    cardItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: "transparent",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardItemDefault: {
      borderColor: colors.primary + "40",
      backgroundColor: colors.primary + "05",
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
    },
    cardIconDefault: {
      backgroundColor: colors.primary + "15",
    },
    cardTypeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 2,
    },
    cardType: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    defaultBadge: {
      backgroundColor: "#10B98120",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    defaultBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    cardNumber: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    cardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    cardExpiry: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
    },
    recurringContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    recurringItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    recurringLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    subjectDot: {
      width: 8,
      height: 40,
      borderRadius: 4,
    },
    recurringInfo: {
      flex: 1,
    },
    recurringTutor: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    recurringMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    recurringSubject: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    recurringDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.textMuted,
      marginHorizontal: 6,
    },
    recurringFreq: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    recurringNext: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
    },
    recurringRight: {
      alignItems: "flex-end",
      gap: 6,
    },
    recurringAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusActive: {
      backgroundColor: "#10B98115",
    },
    statusPending: {
      backgroundColor: "#F59E0B15",
    },
    statusText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      fontWeight: "600",
    },
    statusTextActive: {
      color: "#10B981",
    },
    statusTextPending: {
      color: "#F59E0B",
    },
    historyContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    historyItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    historyLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    historyIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    historyIconCompleted: {
      backgroundColor: "#10B98115",
    },
    historyIconPending: {
      backgroundColor: "#F59E0B15",
    },
    historyInfo: {
      flex: 1,
    },
    historyTutor: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    historyDesc: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    historyAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: "#10B981",
    },
    historyAmountPending: {
      color: "#F59E0B",
    },
    downloadSection: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    downloadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderStyle: "dashed",
    },
    downloadText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
