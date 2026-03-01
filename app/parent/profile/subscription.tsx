import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Crown,
  Users,
  Calendar,
  Zap,
  Download,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FONTS } from "@/config/fonts";
import {
  useCurrentSubscription,
  useSubscriptionPlans,
  useCancelSubscription,
} from "@/hooks/api/subscriptions";
import { usePaymentMethods, useParentOrders } from "@/hooks/api/payments";
import type { Order } from "@/hooks/api/payments";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(cents: number) {
  return `${(cents / 100).toFixed(0)}€`;
}

function statusLabel(status: string) {
  if (status === "PAID") return "Payé";
  if (status === "PENDING") return "En attente";
  if (status === "FAILED") return "Échoué";
  if (status === "REFUNDED") return "Remboursé";
  return status;
}

function statusColor(status: string) {
  if (status === "PAID") return { bg: "#D1FAE5", text: "#065F46" };
  if (status === "FAILED") return { bg: "#FEE2E2", text: "#991B1B" };
  if (status === "REFUNDED") return { bg: "#FEF3C7", text: "#92400E" };
  return { bg: "#F1F5F9", text: "#64748B" };
}

function subscriptionStatusLabel(status: string) {
  if (status === "ACTIVE") return "Actif";
  if (status === "CANCELLED") return "Annulé";
  if (status === "EXPIRED") return "Expiré";
  return "Inactif";
}

function subscriptionStatusColor(status: string) {
  if (status === "ACTIVE") return { bg: "#D1FAE5", text: "#065F46" };
  if (status === "CANCELLED") return { bg: "#FEF3C7", text: "#92400E" };
  if (status === "EXPIRED") return { bg: "#FEE2E2", text: "#991B1B" };
  return { bg: "#F1F5F9", text: "#64748B" };
}

export default function ParentSubscriptionScreen() {
  const router = useRouter();

  const { data: subscription, isLoading: subLoading } =
    useCurrentSubscription();
  const { data: plans = [], isLoading: plansLoading } = useSubscriptionPlans();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const { data: allOrders = [] } = useParentOrders();
  const cancelSubscription = useCancelSubscription();

  const subscriptionOrders: Order[] = allOrders.filter(
    (o) => o.type === "SUBSCRIPTION" && o.status === "PAID",
  );

  const defaultMethod =
    paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0];

  const handleChangePlan = () => {
    router.push("/parent/pricing");
  };

  const handleCancelSubscription = () => {
    if (!subscription || subscription.status === "CANCELLED") return;
    Alert.alert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler ? Vous garderez l'accès jusqu'à la fin de la période en cours.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelSubscription.mutateAsync();
              Alert.alert(
                "Abonnement annulé",
                "Vous gardez l'accès jusqu'au " +
                  formatDate(subscription.expiresAt),
              );
            } catch (err) {
              Alert.alert(
                "Erreur",
                err instanceof Error
                  ? err.message
                  : "Impossible d'annuler l'abonnement",
              );
            }
          },
        },
      ],
    );
  };

  if (subLoading || plansLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonnement</Text>
          <View style={styles.headerRight}>
            <Crown size={16} color="#6366F1" />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.purpleBlob} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonnement</Text>
          <View style={styles.headerRight}>
            <Crown size={16} color="#6366F1" />
          </View>
        </View>

        {/* Plan actuel */}
        {subscription ? (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.currentPlanCard}
          >
            <View style={styles.currentPlanHeader}>
              <View style={styles.currentPlanIcon}>
                <Crown size={20} color="#6366F1" />
              </View>
              <Text style={styles.currentPlanName}>
                {subscription.plan.name}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: subscriptionStatusColor(
                      subscription.status,
                    ).bg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: subscriptionStatusColor(subscription.status).text,
                    },
                  ]}
                >
                  {subscriptionStatusLabel(subscription.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.currentPlanPrice}>
              {subscription.plan.price}€ / mois
            </Text>
            <View style={styles.currentPlanStats}>
              {subscription.plan.maxChildren != null && (
                <View style={styles.currentPlanStat}>
                  <Users size={14} color="#64748B" />
                  <Text style={styles.currentPlanStatText}>
                    {subscription.plan.maxChildren === 0
                      ? "Illimité"
                      : `${subscription.plan.maxChildren} enfant(s)`}
                  </Text>
                </View>
              )}
              {subscription.plan.maxChildren != null && (
                <View style={styles.statDivider} />
              )}
              <View style={styles.currentPlanStat}>
                <Calendar size={14} color="#64748B" />
                <Text style={styles.currentPlanStatText}>
                  {subscription.status === "CANCELLED"
                    ? `Accès jusqu'au ${formatDate(subscription.expiresAt)}`
                    : `Renouvellement le ${formatDate(subscription.expiresAt)}`}
                </Text>
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.noPlanCard}
          >
            <AlertCircle size={32} color="#94A3B8" />
            <Text style={styles.noPlanTitle}>Aucun abonnement actif</Text>
            <Text style={styles.noPlanText}>
              Choisissez un plan pour accéder à toutes les fonctionnalités
            </Text>
            <TouchableOpacity
              style={styles.subscribeCta}
              onPress={() => router.push("/parent/pricing")}
            >
              <Zap size={16} color="white" />
              <Text style={styles.subscribeCtaText}>Voir les offres</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Plans disponibles */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Zap size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Plans disponibles</Text>
          </View>
          {plans.map((plan, index) => {
            const isCurrent =
              subscription?.planId === plan.id &&
              subscription?.status === "ACTIVE";
            const features = Array.isArray(plan.features) ? plan.features : [];
            return (
              <Animated.View
                key={plan.id}
                entering={FadeInDown.delay(250 + index * 80).duration(400)}
              >
                <View
                  style={[styles.planCard, isCurrent && styles.planCardCurrent]}
                >
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{plan.price}€</Text>
                    <Text style={styles.period}>/mois</Text>
                  </View>
                  <View style={styles.featuresList}>
                    {features.slice(0, 3).map((feature, fi) => (
                      <View key={fi} style={styles.featureRow}>
                        <View style={styles.checkIcon}>
                          <Check size={14} color="#6366F1" />
                        </View>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                  {isCurrent ? (
                    <View style={styles.currentButton}>
                      <Text style={styles.currentButtonText}>Plan actuel</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={handleChangePlan}
                    >
                      <Text style={styles.selectButtonText}>Choisir</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Moyen de paiement */}
        <Animated.View
          entering={FadeInDown.delay(350).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <CreditCard size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Paiement</Text>
          </View>
          <View style={styles.paymentCard}>
            {defaultMethod ? (
              <View style={styles.paymentRow}>
                <View style={styles.paymentIcon}>
                  <CreditCard size={16} color="#6366F1" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.cardNumber}>
                    {defaultMethod.last4
                      ? `•••• •••• •••• ${defaultMethod.last4}`
                      : defaultMethod.type}
                  </Text>
                  {defaultMethod.expiryDate && (
                    <Text style={styles.cardExpiry}>
                      Expire {defaultMethod.expiryDate}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => router.push("/parent/profile/checkout")}
                >
                  <Text style={styles.changeButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addPaymentRow}
                onPress={() => router.push("/parent/profile/checkout")}
              >
                <CreditCard size={18} color="#94A3B8" />
                <Text style={styles.addPaymentText}>
                  Ajouter un moyen de paiement
                </Text>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Historique de paiements */}
        {subscriptionOrders.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Download size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>Historique</Text>
            </View>
            <View style={styles.invoicesCard}>
              {subscriptionOrders.map((order, index) => {
                const colors = statusColor(order.status);
                return (
                  <View key={order.id}>
                    <View style={styles.invoiceRow}>
                      <View>
                        <Text style={styles.invoiceDate}>
                          {formatDate(order.createdAt)}
                        </Text>
                        <Text style={styles.invoiceDescription}>
                          {order.items[0]?.description ?? "Abonnement"}
                        </Text>
                      </View>
                      <View style={styles.invoiceRight}>
                        <Text style={styles.invoiceAmount}>
                          {formatAmount(order.amount)}
                        </Text>
                        <View
                          style={[
                            styles.invoiceStatusBadge,
                            { backgroundColor: colors.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.invoiceStatusText,
                              { color: colors.text },
                            ]}
                          >
                            {statusLabel(order.status)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {index < subscriptionOrders.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Annulation */}
        {subscription && subscription.status === "ACTIVE" && (
          <View style={styles.cancelSection}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Text style={styles.cancelButtonText}>
                  Annuler l&apos;abonnement
                </Text>
              )}
            </TouchableOpacity>
            <Text style={styles.cancelNote}>
              Vous gardez l&apos;accès jusqu&apos;à la fin de la période
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  purpleBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#6366F1",
    top: -100,
    right: -100,
    opacity: 0.1,
    zIndex: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  currentPlanCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  currentPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  currentPlanIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  currentPlanName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  currentPlanPrice: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 12,
  },
  currentPlanStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  currentPlanStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currentPlanStatText: {
    fontSize: 13,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E2E8F0",
  },
  noPlanCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    gap: 8,
  },
  noPlanTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginTop: 8,
  },
  noPlanText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  subscribeCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 8,
  },
  subscribeCtaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  planCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  planCardCurrent: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
    gap: 2,
  },
  price: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },
  period: {
    fontSize: 14,
    color: "#64748B",
  },
  featuresList: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 13,
    color: "#64748B",
    flex: 1,
  },
  selectButton: {
    backgroundColor: "#6366F1",
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  currentButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  currentButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  paymentCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPaymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addPaymentText: {
    flex: 1,
    fontSize: 14,
    color: "#94A3B8",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: "#64748B",
  },
  changeButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  changeButtonText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  invoicesCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  invoiceDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  invoiceDescription: {
    fontSize: 12,
    color: "#64748B",
  },
  invoiceRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  invoiceStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  invoiceStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  cancelSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 30,
    padding: 14,
    paddingHorizontal: 24,
    marginBottom: 8,
    minWidth: 200,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  cancelNote: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});
