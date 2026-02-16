import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  DollarSign,
  Clock,
  Users,
  Video,
  Home,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Determine if this is a checkout flow or recurring payments view
  const isCheckout = !!params.tutorId;

  // Parse booking details from params (for checkout)
  const bookingDetails = isCheckout
    ? {
        tutorId: params.tutorId as string,
        tutorName: params.tutorName as string,
        children: JSON.parse((params.children as string) || "[]"),
        mode: params.mode as string,
        day: params.day as string,
        timeSlot: params.timeSlot as string,
        totalPrice: parseFloat(params.totalPrice as string) || 0,
      }
    : null;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new">("saved");

  // Mock saved cards
  const savedCards = [
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

  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);

  // Mock recurring payments data
  const recurringPayments = [
    {
      id: "1",
      tutorName: "Sophie Martin",
      subject: "Mathématiques",
      amount: 45.0,
      frequency: "weekly",
      nextPayment: "2024-01-20",
      status: "active",
      sessionsPerWeek: 2,
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
    },
  ];

  const paymentHistory = [
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

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Erreur", "Numéro de carte invalide");
      return;
    }
    if (!cardHolder) {
      Alert.alert("Erreur", "Veuillez entrer le nom du titulaire");
      return;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      Alert.alert("Erreur", "Date d'expiration invalide");
      return;
    }
    if (!cvv || cvv.length !== 3) {
      Alert.alert("Erreur", "CVV invalide");
      return;
    }
    if (!billingAddress) {
      Alert.alert("Erreur", "Veuillez entrer l'adresse de facturation");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Paiement réussi!",
        "Votre réservation a été confirmée. Le tuteur sera notifié.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ],
      );
    }, 2000);
  };

  const renderCheckoutView = () => (
    <>
      {/* Total Amount Card */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.totalCard}
      >
        <LinearGradient
          colors={["#8B5CF6", "#6366F1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalGradient}
        >
          <View style={styles.totalHeader}>
            <DollarSign size={32} color={COLORS.neutral.white} />
            <Text style={styles.totalLabel}>Montant total</Text>
          </View>
          <Text style={styles.totalAmount}>
            {bookingDetails!.totalPrice.toFixed(2)} €
          </Text>
          <Text style={styles.totalSubtitle}>
            Paiement unique • Aucun frais caché
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Booking Details Cards */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              {bookingDetails!.mode === "online" ? (
                <Video size={20} color="#8B5CF6" />
              ) : (
                <Home size={20} color="#8B5CF6" />
              )}
            </View>
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>
              {bookingDetails!.mode === "online" ? "En ligne" : "En personne"}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color="#10B981" />
            </View>
            <Text style={styles.detailLabel}>Horaire</Text>
            <Text style={styles.detailValue}>{bookingDetails!.timeSlot}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color="#F59E0B" />
            </View>
            <Text style={styles.detailLabel}>Jour</Text>
            <Text style={styles.detailValue}>{bookingDetails!.day}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Users size={20} color="#EF4444" />
            </View>
            <Text style={styles.detailLabel}>Enfants</Text>
            <Text style={styles.detailValue}>
              {bookingDetails!.children.length}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Tutor Info */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuteur sélectionné</Text>
          <View style={styles.tutorCard}>
            <View style={styles.tutorIcon}>
              <User size={24} color={COLORS.primary.DEFAULT} />
            </View>
            <View style={styles.tutorInfo}>
              <Text style={styles.tutorName}>{bookingDetails!.tutorName}</Text>
              <Text style={styles.tutorSubtitle}>Tuteur certifié • Expert</Text>
            </View>
            <CheckCircle size={20} color="#10B981" />
          </View>
        </View>
      </Animated.View>

      {/* Payment Form */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de paiement</Text>

          {/* Payment Method Selection */}
          <View style={styles.paymentMethodSelector}>
            <TouchableOpacity
              style={[
                styles.methodOption,
                paymentMethod === "saved" && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod("saved")}
              activeOpacity={0.7}
            >
              <View style={styles.methodOptionContent}>
                <CreditCard
                  size={20}
                  color={
                    paymentMethod === "saved"
                      ? COLORS.primary.DEFAULT
                      : COLORS.secondary[400]
                  }
                />
                <Text
                  style={[
                    styles.methodOptionText,
                    paymentMethod === "saved" && styles.methodOptionTextActive,
                  ]}
                >
                  Carte enregistrée
                </Text>
              </View>
              {paymentMethod === "saved" && (
                <CheckCircle size={20} color={COLORS.primary.DEFAULT} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodOption,
                paymentMethod === "new" && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod("new")}
              activeOpacity={0.7}
            >
              <View style={styles.methodOptionContent}>
                <CreditCard
                  size={20}
                  color={
                    paymentMethod === "new"
                      ? COLORS.primary.DEFAULT
                      : COLORS.secondary[400]
                  }
                />
                <Text
                  style={[
                    styles.methodOptionText,
                    paymentMethod === "new" && styles.methodOptionTextActive,
                  ]}
                >
                  Nouvelle carte
                </Text>
              </View>
              {paymentMethod === "new" && (
                <CheckCircle size={20} color={COLORS.primary.DEFAULT} />
              )}
            </TouchableOpacity>
          </View>

          {/* Saved Cards List */}
          {paymentMethod === "saved" ? (
            <View style={styles.formCard}>
              {savedCards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.savedCardOption,
                    selectedCard === card.id && styles.savedCardOptionActive,
                  ]}
                  onPress={() => setSelectedCard(card.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedCardLeft}>
                    <View style={styles.savedCardIcon}>
                      <CreditCard size={20} color={COLORS.primary.DEFAULT} />
                    </View>
                    <View>
                      <Text style={styles.savedCardType}>{card.type}</Text>
                      <Text style={styles.savedCardNumber}>
                        •••• •••• •••• {card.last4}
                      </Text>
                      <Text style={styles.savedCardExpiry}>
                        Expire: {card.expiry}
                      </Text>
                    </View>
                  </View>
                  {selectedCard === card.id && (
                    <CheckCircle size={20} color={COLORS.primary.DEFAULT} />
                  )}
                </TouchableOpacity>
              ))}

              {/* CVV for saved card */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CVV de sécurité</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={COLORS.secondary[400]} />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                    placeholderTextColor={COLORS.secondary[300]}
                  />
                </View>
              </View>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Lock size={16} color="#10B981" />
                <Text style={styles.securityText}>
                  Paiement 100% sécurisé par cryptage SSL
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.formCard}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de carte</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={20} color={COLORS.secondary[400]} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={(text) =>
                      setCardNumber(formatCardNumber(text))
                    }
                    keyboardType="number-pad"
                    maxLength={19}
                    placeholderTextColor={COLORS.secondary[300]}
                  />
                </View>
              </View>

              {/* Card Holder */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titulaire de la carte</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color={COLORS.secondary[400]} />
                  <TextInput
                    style={styles.input}
                    placeholder="JEAN DUPONT"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    autoCapitalize="characters"
                    placeholderTextColor={COLORS.secondary[300]}
                  />
                </View>
              </View>

              {/* Expiry Date & CVV */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiration</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={20} color={COLORS.secondary[400]} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChangeText={(text) =>
                        setExpiryDate(formatExpiryDate(text))
                      }
                      keyboardType="number-pad"
                      maxLength={5}
                      placeholderTextColor={COLORS.secondary[300]}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={20} color={COLORS.secondary[400]} />
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="number-pad"
                      maxLength={3}
                      secureTextEntry
                      placeholderTextColor={COLORS.secondary[300]}
                    />
                  </View>
                </View>
              </View>

              {/* Billing Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse de facturation</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color={COLORS.secondary[400]} />
                  <TextInput
                    style={styles.input}
                    placeholder="123 Rue de la République, Paris"
                    value={billingAddress}
                    onChangeText={setBillingAddress}
                    placeholderTextColor={COLORS.secondary[300]}
                  />
                </View>
              </View>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Lock size={16} color="#10B981" />
                <Text style={styles.securityText}>
                  Paiement 100% sécurisé par cryptage SSL
                </Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Payment Button */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isProcessing
                ? [COLORS.secondary[300], COLORS.secondary[400]]
                : ["#10B981", "#059669"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payButtonGradient}
          >
            {isProcessing ? (
              <Text style={styles.payButtonText}>Traitement en cours...</Text>
            ) : (
              <>
                <CheckCircle size={22} color={COLORS.neutral.white} />
                <Text style={styles.payButtonText}>
                  Confirmer le paiement de{" "}
                  {bookingDetails!.totalPrice.toFixed(2)}€
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Terms */}
      <Text style={styles.termsText}>
        En confirmant, vous acceptez nos conditions d'utilisation et notre
        politique de remboursement. Le paiement sera traité de manière
        sécurisée.
      </Text>
    </>
  );

  const renderRecurringPaymentsView = () => (
    <>
      {/* Spending Overview Card */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.totalCard}
      >
        <LinearGradient
          colors={["#8B5CF6", "#6366F1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalGradient}
        >
          <View style={styles.totalHeader}>
            <DollarSign size={32} color={COLORS.neutral.white} />
            <Text style={styles.totalLabel}>Dépenses totales</Text>
          </View>
          <Text style={styles.totalAmount}>
            {spending[selectedPeriod as keyof typeof spending].toFixed(2)} €
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

      {/* Stats Row */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statValue}>
              {recurringPayments.filter((p) => p.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{paymentHistory.length}</Text>
            <Text style={styles.statLabel}>Paiements</Text>
          </View>
        </View>
      </Animated.View>

      {/* Payment Method */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Méthode de paiement</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodIcon}>
              <CreditCard size={24} color={COLORS.secondary[700]} />
            </View>
            <View style={styles.tutorInfo}>
              <Text style={styles.tutorName}>Visa</Text>
              <Text style={styles.tutorSubtitle}>•••• •••• •••• 4242</Text>
            </View>
            <CheckCircle size={20} color="#10B981" />
          </View>
        </View>
      </Animated.View>

      {/* Recurring Payments */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Paiements récurrents</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Gérer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsCard}>
            {recurringPayments.map((payment, index) => (
              <View
                key={payment.id}
                style={[
                  styles.transactionItem,
                  index !== recurringPayments.length - 1 &&
                    styles.transactionItemBorder,
                ]}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionStatus,
                      payment.status === "active"
                        ? styles.statusCompleted
                        : styles.statusPending,
                    ]}
                  />
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionStudent}>
                      {payment.tutorName}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {payment.subject} • {payment.sessionsPerWeek}x/semaine
                    </Text>
                    <Text style={styles.transactionNextPayment}>
                      Prochain:{" "}
                      {new Date(payment.nextPayment).toLocaleDateString(
                        "fr-FR",
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    {payment.amount.toFixed(2)} €
                  </Text>
                  <Text style={styles.transactionFrequency}>
                    {payment.frequency === "weekly" ? "/sem" : "/mois"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Payment History */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsCard}>
            {paymentHistory.map((transaction, index) => (
              <View
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  index !== paymentHistory.length - 1 &&
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
                      {transaction.tutorName}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      • {transaction.description}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.status === "pending" &&
                      styles.transactionAmountPending,
                  ]}
                >
                  {transaction.status === "pending" ? "-" : "+"}
                  {transaction.amount.toFixed(2)} €
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Download Statement */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)}>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color={COLORS.secondary[700]} />
          <Text style={styles.downloadButtonText}>Télécharger le relevé</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.secondary[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCheckout ? "Paiement" : "Paiements"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isCheckout ? renderCheckoutView() : renderRecurringPaymentsView()}
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
  totalCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  totalGradient: {
    padding: 24,
  },
  totalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  totalAmount: {
    fontFamily: FONTS.fredoka,
    fontSize: 48,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  totalSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  periodSelector: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
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
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
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
  sectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary[900],
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
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
  tutorCard: {
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
  tutorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary.DEFAULT + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  tutorSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
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
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  input: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10B981" + "15",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  securityText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: "#10B981",
    fontWeight: "600",
  },
  payButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  payButtonDisabled: {
    shadowOpacity: 0.1,
  },
  payButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  payButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 17,
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  termsText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 32,
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
  transactionNextPayment: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
    marginTop: 2,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  transactionAmountPending: {
    color: "#F59E0B",
  },
  transactionFrequency: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
    marginTop: 2,
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
  paymentMethodSelector: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  methodOption: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  methodOptionActive: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary.DEFAULT + "08",
  },
  methodOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodOptionText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  methodOptionTextActive: {
    color: COLORS.primary.DEFAULT,
  },
  savedCardOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
  },
  savedCardOptionActive: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary.DEFAULT + "08",
  },
  savedCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  savedCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
  },
  savedCardType: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  savedCardNumber: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    marginBottom: 2,
  },
  savedCardExpiry: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
  },
});
