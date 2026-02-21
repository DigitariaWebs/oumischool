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
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
          <Crown size={12} color="white" />
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
              <Check size={14} color="#6366F1" />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      {isCurrent ? (
        <View style={styles.currentButton}>
          <Text style={styles.currentButtonText}>Actuel</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
          <Text style={styles.selectButtonText}>Choisir</Text>
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
      features: ["1 enfant", "5 sessions/mois", "Support email"],
      planId: "basic",
    },
    {
      name: "Family",
      price: "19€",
      period: "mois",
      features: ["3 enfants", "15 sessions/mois", "Support 24/7", "Rapports progression"],
      isPopular: true,
      planId: "family",
    },
    {
      name: "Premium",
      price: "29€",
      period: "mois",
      features: ["Enfants illimités", "Sessions illimitées", "Tuteurs premium", "Support prioritaire"],
      planId: "premium",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    Alert.alert("Changer d'abonnement", `Voulez-vous passer au plan ${planId} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        onPress: () => Alert.alert("Succès", "Abonnement modifié"),
      },
    ]);
  };

  const handleCancelSubscription = () => {
    Alert.alert("Annuler l'abonnement", "Êtes-vous sûr de vouloir annuler ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: () => Alert.alert("Abonnement annulé"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonnement</Text>
          <View style={styles.headerRight}>
            <Crown size={16} color="#6366F1" />
          </View>
        </View>

        {/* Plan actuel */}
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={styles.currentPlanIcon}>
              <Crown size={20} color="#6366F1" />
            </View>
            <Text style={styles.currentPlanName}>Plan Family</Text>
          </View>
          <Text style={styles.currentPlanPrice}>19€ / mois</Text>
          <View style={styles.currentPlanStats}>
            <View style={styles.currentPlanStat}>
              <Users size={14} color="#64748B" />
              <Text style={styles.currentPlanStatText}>3 enfants</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.currentPlanStat}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.currentPlanStatText}>15 sessions/mois</Text>
            </View>
          </View>
          <Text style={styles.renewalText}>Prochain paiement: 15 janv. 2025</Text>
        </View>

        {/* Plans disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Choisir un plan</Text>
          </View>
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              {...plan}
              isCurrent={plan.planId === currentPlan}
              onSelect={() => handleSelectPlan(plan.planId)}
              delay={200 + index * 100}
            />
          ))}
        </View>

        {/* Moyen de paiement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Paiement</Text>
          </View>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <CreditCard size={16} color="#6366F1" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
                <Text style={styles.cardExpiry}>Expire 12/25</Text>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Historique */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Download size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Factures</Text>
          </View>
          <View style={styles.invoicesCard}>
            {[
              { date: "1 déc. 2024", amount: "19€", status: "Payé" },
              { date: "1 nov. 2024", amount: "19€", status: "Payé" },
              { date: "1 oct. 2024", amount: "19€", status: "Payé" },
            ].map((invoice, index) => (
              <View key={index}>
                <View style={styles.invoiceRow}>
                  <View>
                    <Text style={styles.invoiceDate}>{invoice.date}</Text>
                    <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
                  </View>
                  <View style={styles.invoiceRight}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{invoice.status}</Text>
                    </View>
                    <TouchableOpacity style={styles.downloadButton}>
                      <Download size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
                {index < 2 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Annulation */}
        <View style={styles.cancelSection}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
            <Text style={styles.cancelButtonText}>Annuler l'abonnement</Text>
          </TouchableOpacity>
          <Text style={styles.cancelNote}>Vous gardez l'accès jusqu'à la fin de la période</Text>
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Voir toutes les factures</Text>
        </TouchableOpacity>
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
    marginBottom: 12,
    gap: 12,
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
    backgroundColor: "#F1F5F9",
  },
  renewalText: {
    fontSize: 12,
    color: "#94A3B8",
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
    position: "relative",
  },
  planCardCurrent: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#6366F1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
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
  invoiceAmount: {
    fontSize: 12,
    color: "#64748B",
  },
  invoiceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    color: "#065F46",
    fontWeight: "600",
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
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
  sourceButton: {
    backgroundColor: "#F1F5F9",
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