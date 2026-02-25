import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Info } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { PlanCard } from "@/components/payment/PlanCard";
import { Card, Badge } from "@/components/ui";
import { usePayment } from "@/hooks/usePayment";
import {
  useSubscriptionPlans,
  useCurrentSubscription,
} from "@/hooks/api/subscriptions";
import type { SubscriptionPlan } from "@/hooks/api/subscriptions";

interface PricingPlan {
  id: string;         // display-only ID
  serverPlanId: string; // real DB plan ID used for payment
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  isPopular?: boolean;
}

/**
 * Derive display plans from server plans.
 * Server stores only the monthly price; yearly is shown as ~10 months (≈ −17%).
 */
function buildDisplayPlans(
  serverPlans: SubscriptionPlan[],
  billingCycle: "monthly" | "yearly"
): PricingPlan[] {
  return serverPlans.map((plan, index) => {
    const isYearly = billingCycle === "yearly";
    const price = isYearly ? Math.round(plan.price * 10) : plan.price;
    const yearlyFeature = isYearly ? ["2 mois gratuits"] : [];
    return {
      id: `${plan.id}-${billingCycle}`,
      serverPlanId: plan.id,
      name: plan.name,
      price,
      billingPeriod: isYearly ? "year" : "month",
      description: "",
      features: [...plan.features, ...yearlyFeature],
      // Middle plan is popular when there are 3+ plans
      isPopular: serverPlans.length >= 3 && index === 1,
    };
  });
}

export default function PricingScreen() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const { payForSubscription } = usePayment();

  const { data: serverPlans = [], isLoading } = useSubscriptionPlans();
  const { data: currentSubscription } = useCurrentSubscription();

  const plans = buildDisplayPlans(serverPlans, billingCycle);
  const savingsPercentage = 17; // ~2 months free on yearly

  const handleSelectPlan = async (serverPlanId: string) => {
    setProcessingPlanId(serverPlanId);
    try {
      const { success } = await payForSubscription(serverPlanId);
      if (success) {
        Alert.alert(
          "Abonnement activé!",
          "Votre abonnement a été activé avec succès.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choisir une offre</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introTitle}>
            Choisissez l&apos;offre qui vous convient
          </Text>
          <Text style={styles.introSubtitle}>
            Tous les plans incluent l&apos;accès aux tuteurs certifiés et au
            suivi de progression
          </Text>
        </View>

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggleContainer}>
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingButton,
                billingCycle === "monthly" && styles.billingButtonActive,
              ]}
              onPress={() => setBillingCycle("monthly")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.billingButtonText,
                  billingCycle === "monthly" && styles.billingButtonTextActive,
                ]}
              >
                Mensuel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingButton,
                billingCycle === "yearly" && styles.billingButtonActive,
              ]}
              onPress={() => setBillingCycle("yearly")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.billingButtonText,
                  billingCycle === "yearly" && styles.billingButtonTextActive,
                ]}
              >
                Annuel
              </Text>
              {billingCycle === "yearly" && (
                <Badge
                  label={`-${savingsPercentage}%`}
                  variant="success"
                  size="sm"
                  style={styles.savingsBadge}
                />
              )}
            </TouchableOpacity>
          </View>
          {billingCycle === "yearly" && (
            <Text style={styles.savingsNote}>
              Économisez {savingsPercentage}% avec l&apos;abonnement annuel
            </Text>
          )}
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary.DEFAULT}
              style={styles.loader}
            />
          ) : (
            plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                id={plan.serverPlanId}
                name={plan.name}
                price={plan.price}
                billingPeriod={plan.billingPeriod}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                isCurrent={currentSubscription?.planId === plan.serverPlanId}
                onSelect={handleSelectPlan}
                delay={index * 100}
              />
            ))
          )}
        </View>

        {/* Info Card */}
        <Card variant="default" padding="md" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={COLORS.info} />
            <Text style={styles.infoTitle}>Informations</Text>
          </View>
          <Text style={styles.infoText}>
            • Vous pouvez changer ou annuler votre abonnement à tout moment
            {"\n"}• Aucun engagement de durée{"\n"}• Garantie satisfait ou
            remboursé 14 jours{"\n"}• Moyens de paiement sécurisés
          </Text>
        </Card>

        {/* FAQ Link */}
        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => console.log("Navigate to FAQ")}
          activeOpacity={0.7}
        >
          <Text style={styles.faqButtonText}>
            Des questions ? Consultez notre FAQ
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  intro: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    alignItems: "center",
  },
  introTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.secondary[900],
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  introSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[600],
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  billingToggleContainer: {
    marginBottom: SPACING.xl,
  },
  billingToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm + 2,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  billingButtonActive: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  billingButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  billingButtonTextActive: {
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  savingsBadge: {
    marginLeft: 4,
  },
  savingsNote: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.success,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontWeight: "600",
  },
  plansContainer: {
    marginBottom: SPACING.lg,
  },
  loader: {
    paddingVertical: SPACING.xl * 2,
  },
  infoCard: {
    backgroundColor: COLORS.info + "10",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    marginBottom: SPACING.lg,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 22,
  },
  faqButton: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  faqButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
