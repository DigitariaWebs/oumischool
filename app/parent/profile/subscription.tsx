import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  onSelect: () => void;
  delay: number;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  period,
  features,
  isPopular,
  isCurrent,
  onSelect,
  delay,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <View style={[styles.planCard, isCurrent && styles.planCardCurrent]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Crown size={14} color={COLORS.neutral.white} />
          <Text style={styles.popularText}>Populaire</Text>
        </View>
      )}
      <Text style={styles.planName}>{name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>
      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={styles.checkIcon}>
              <Check size={16} color={COLORS.primary.DEFAULT} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      {isCurrent ? (
        <View style={styles.currentButton}>
          <Text style={styles.currentButtonText}>Abonnement actuel</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.selectButton,
            isPopular && styles.selectButtonPrimary,
          ]}
          onPress={onSelect}
        >
          <Text
            style={[
              styles.selectButtonText,
              isPopular && styles.selectButtonTextPrimary,
            ]}
          >
            Choisir ce plan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </Animated.View>
);

export default function ParentSubscriptionScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [currentPlan] = useState("family");

  const plans = [
    {
      name: "Basic",
      price: "9€",
      period: "mois",
      features: [
        "1 enfant",
        "5 sessions par mois",
        "Accès aux tuteurs vérifiés",
        "Support par email",
      ],
      planId: "basic",
    },
    {
      name: "Family",
      price: "19€",
      period: "mois",
      features: [
        "Jusqu'à 3 enfants",
        "15 sessions par mois",
        "Accès prioritaire",
        "Support 24/7",
        "Rapports de progression",
      ],
      isPopular: true,
      planId: "family",
    },
    {
      name: "Premium",
      price: "29€",
      period: "mois",
      features: [
        "Enfants illimités",
        "Sessions illimitées",
        "Tuteurs premium exclusifs",
        "Support prioritaire 24/7",
        "Rapports détaillés",
        "Remises sur les sessions",
      ],
      planId: "premium",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    Alert.alert(
      "Changer d'abonnement",
      `Voulez-vous vraiment changer pour le plan ${planId} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            // TODO: Implement plan change logic
            Alert.alert("Succès", "Abonnement modifié avec succès");
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l'accès aux fonctionnalités premium.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            // TODO: Implement cancellation logic
            Alert.alert("Abonnement annulé", "Votre abonnement a été annulé");
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    Alert.alert("Téléchargement", "Téléchargement de la facture...");
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <ArrowLeft size={24} color={COLORS.secondary[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonnement</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Current Plan Banner */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.bannerContainer}
        >
          <LinearGradient
            colors={[COLORS.primary.DEFAULT, COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerIcon}>
              <Crown size={32} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.bannerTitle}>Plan Family</Text>
            <Text style={styles.bannerSubtitle}>19€ / mois</Text>
            <View style={styles.bannerStats}>
              <View style={styles.bannerStat}>
                <Users size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.bannerStatText}>3 enfants</Text>
              </View>
              <View style={styles.bannerStat}>
                <Calendar size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.bannerStatText}>15 sessions/mois</Text>
              </View>
            </View>
            <Text style={styles.renewalText}>
              Renouvellement le 15 janvier 2025
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Plans */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.sectionHeader}
          >
            <Zap size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Choisir un plan</Text>
          </Animated.View>
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              {...plan}
              isCurrent={plan.planId === currentPlan}
              onSelect={() => handleSelectPlan(plan.planId)}
              delay={300 + index * 100}
            />
          ))}
        </View>

        {/* Payment Method */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Moyen de paiement</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.paymentRow}>
              <View style={styles.cardIcon}>
                <CreditCard size={20} color={COLORS.secondary[700]} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
                <Text style={styles.cardExpiry}>Expire 12/25</Text>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Billing History */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Download size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Historique de facturation</Text>
          </View>
          <View style={styles.card}>
            {[
              { date: "1 déc. 2024", amount: "19€", status: "Payé" },
              { date: "1 nov. 2024", amount: "19€", status: "Payé" },
              { date: "1 oct. 2024", amount: "19€", status: "Payé" },
            ].map((invoice, index) => (
              <View key={index}>
                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceDate}>{invoice.date}</Text>
                    <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
                  </View>
                  <View style={styles.invoiceRight}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{invoice.status}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={handleDownloadInvoice}
                    >
                      <Download size={16} color={COLORS.primary.DEFAULT} />
                    </TouchableOpacity>
                  </View>
                </View>
                {index < 2 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Cancel Subscription */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(400)}
          style={styles.cancelSection}
        >
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Annuler l'abonnement</Text>
          </TouchableOpacity>
          <Text style={styles.cancelNote}>
            Vous garderez l'accès jusqu'à la fin de votre période de
            facturation
          </Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  placeholder: {
    width: 40,
  },
  bannerContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  banner: {
    padding: 24,
    alignItems: "center",
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  bannerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },
  bannerStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  bannerStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bannerStatText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.neutral.white,
  },
  renewalText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  planCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  planCardCurrent: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  planName: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  price: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.secondary[900],
  },
  period: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
  },
  featuresList: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    flex: 1,
  },
  selectButton: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  selectButtonPrimary: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  selectButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  selectButtonTextPrimary: {
    color: COLORS.neutral.white,
  },
  currentButton: {
    backgroundColor: COLORS.primary[100],
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  currentButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary[700],
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  cardExpiry: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  changeButton: {
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceDate: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  invoiceAmount: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  invoiceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.success[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success[700],
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
  },
  cancelSection: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  cancelButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.error,
  },
  cancelNote: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    textAlign: "center",
  },
});
