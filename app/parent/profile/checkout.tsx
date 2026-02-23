import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePayment } from "@/hooks/usePayment";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  Clock,
  Users,
  Video,
  Home,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const bookingDetails = {
    tutorId: params.tutorId as string,
    tutorName: params.tutorName as string,
    children: JSON.parse((params.children as string) || "[]"),
    mode: (params.mode as "online" | "presential") ?? "online",
    day: params.day as string,
    timeSlot: params.timeSlot as string,
    startTime: params.startTime as string,
    endTime: params.endTime as string,
    subjectId: params.subjectId as string | undefined,
    totalPrice: parseFloat(params.totalPrice as string) || 0,
  };

  const { payForSession } = usePayment();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new">("saved");

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

  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);

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
    if (!bookingDetails.startTime || !bookingDetails.endTime) {
      Alert.alert(
        "Erreur",
        "Informations de réservation incomplètes. Veuillez recommencer."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const childIds = bookingDetails.children.map((c: { id: string }) => c.id);
      const { success } = await payForSession({
        tutorId: bookingDetails.tutorId,
        childId: childIds[0],
        childrenIds: childIds.length > 1 ? childIds : undefined,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        subjectId: bookingDetails.subjectId,
        mode: bookingDetails.mode,
        type: childIds.length > 1 ? "group" : "individual",
      });

      if (success) {
        Alert.alert(
          "Paiement réussi! 🎉",
          "Votre réservation a été confirmée. Le tuteur sera notifié.",
          [{ text: "OK", onPress: () => router.push("/(tabs)") }]
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const detailItems = [
    {
      icon: bookingDetails.mode === "online" ? Video : Home,
      label: "Mode",
      value: bookingDetails.mode === "online" ? "En ligne" : "En personne",
      color: "#8B5CF6",
      bgColor: "#8B5CF620",
    },
    {
      icon: Clock,
      label: "Horaire",
      value: bookingDetails.timeSlot,
      color: "#10B981",
      bgColor: "#10B98120",
    },
    {
      icon: Calendar,
      label: "Jour",
      value: bookingDetails.day,
      color: "#F59E0B",
      bgColor: "#F59E0B20",
    },
    {
      icon: Users,
      label: "Enfants",
      value: `${bookingDetails.children.length} enfant${bookingDetails.children.length > 1 ? "s" : ""}`,
      color: "#EF4444",
      bgColor: "#EF444420",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Finaliser</Text>
          <View style={styles.securityBadge}>
            <Shield size={12} color="#10B981" />
            <Text style={styles.securityBadgeText}>Sécurisé</Text>
          </View>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Amount Card */}
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
                <View style={styles.sparkleContainer}>
                  <Sparkles size={20} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Montant total</Text>
              </View>
              <Text style={styles.heroAmount}>
                {bookingDetails.totalPrice.toFixed(2)}
                <Text style={styles.heroCurrency}> €</Text>
              </Text>
              <View style={styles.heroBadge}>
                <Zap size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  Paiement unique • Sans frais cachés
                </Text>
              </View>
            </View>

            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Booking Details - Horizontal scroll pills */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.detailsScroll}
          >
            {detailItems.map((item, index) => (
              <View
                key={index}
                style={[styles.detailPill, { backgroundColor: item.bgColor }]}
              >
                <View
                  style={[
                    styles.detailPillIcon,
                    { backgroundColor: item.color },
                  ]}
                >
                  <item.icon size={16} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.detailPillLabel}>{item.label}</Text>
                  <Text style={[styles.detailPillValue, { color: item.color }]}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Tutor Card */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={styles.tutorCard}
        >
          <View style={styles.tutorAvatar}>
            <Text style={styles.tutorAvatarText}>
              {bookingDetails.tutorName?.charAt(0) || "T"}
            </Text>
          </View>
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>{bookingDetails.tutorName}</Text>
            <View style={styles.tutorBadges}>
              <View style={styles.tutorBadge}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.tutorBadgeText}>Vérifié</Text>
              </View>
              <View
                style={[styles.tutorBadge, { backgroundColor: "#8B5CF620" }]}
              >
                <Text style={[styles.tutorBadgeText, { color: "#8B5CF6" }]}>
                  Expert
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Payment Method Toggle */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>💳 Méthode de paiement</Text>

          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[
                styles.methodTab,
                paymentMethod === "saved" && styles.methodTabActive,
              ]}
              onPress={() => setPaymentMethod("saved")}
              activeOpacity={0.7}
            >
              <CreditCard
                size={18}
                color={
                  paymentMethod === "saved"
                    ? COLORS.primary.DEFAULT
                    : COLORS.secondary[400]
                }
              />
              <Text
                style={[
                  styles.methodTabText,
                  paymentMethod === "saved" && styles.methodTabTextActive,
                ]}
              >
                Carte enregistrée
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodTab,
                paymentMethod === "new" && styles.methodTabActive,
              ]}
              onPress={() => setPaymentMethod("new")}
              activeOpacity={0.7}
            >
              <CreditCard
                size={18}
                color={
                  paymentMethod === "new"
                    ? COLORS.primary.DEFAULT
                    : COLORS.secondary[400]
                }
              />
              <Text
                style={[
                  styles.methodTabText,
                  paymentMethod === "new" && styles.methodTabTextActive,
                ]}
              >
                Nouvelle carte
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Cards */}
          {paymentMethod === "saved" ? (
            <View style={styles.formCard}>
              {savedCards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.savedCard,
                    selectedCard === card.id && styles.savedCardActive,
                  ]}
                  onPress={() => setSelectedCard(card.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedCardLeft}>
                    <View
                      style={[
                        styles.cardTypeIcon,
                        selectedCard === card.id && styles.cardTypeIconActive,
                      ]}
                    >
                      <CreditCard
                        size={20}
                        color={
                          selectedCard === card.id
                            ? colors.primary
                            : colors.textSecondary
                        }
                      />
                    </View>
                    <View>
                      <Text style={styles.cardType}>{card.type}</Text>
                      <Text style={styles.cardNumber}>
                        •••• •••• •••• {card.last4}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.savedCardRight}>
                    <Text style={styles.cardExpiry}>{card.expiry}</Text>
                    {selectedCard === card.id && (
                      <View style={styles.checkCircle}>
                        <CheckCircle size={20} color={colors.primary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* CVV Input */}
              <View style={styles.cvvRow}>
                <View style={styles.cvvInputWrapper}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="•••"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="number-pad"
                      maxLength={3}
                      secureTextEntry
                      placeholderTextColor={colors.inputPlaceholder}
                    />
                  </View>
                </View>
                <View style={styles.cvvHint}>
                  <Shield size={16} color="#10B981" />
                  <Text style={styles.cvvHintText}>
                    Les 3 chiffres au dos de votre carte
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.formCard}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de carte</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={(text) =>
                      setCardNumber(formatCardNumber(text))
                    }
                    keyboardType="number-pad"
                    maxLength={19}
                    placeholderTextColor={colors.inputPlaceholder}
                  />
                </View>
              </View>

              {/* Card Holder */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titulaire</Text>
                <View style={styles.inputContainer}>
                  <User size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="JEAN DUPONT"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    autoCapitalize="characters"
                    placeholderTextColor={colors.inputPlaceholder}
                  />
                </View>
              </View>

              {/* Expiry & CVV Row */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiration</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChangeText={(text) =>
                        setExpiryDate(formatExpiryDate(text))
                      }
                      keyboardType="number-pad"
                      maxLength={5}
                      placeholderTextColor={colors.inputPlaceholder}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="number-pad"
                      maxLength={3}
                      secureTextEntry
                      placeholderTextColor={colors.inputPlaceholder}
                    />
                  </View>
                </View>
              </View>

              {/* Billing Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse de facturation</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="123 Rue de la République"
                    value={billingAddress}
                    onChangeText={setBillingAddress}
                    placeholderTextColor={colors.inputPlaceholder}
                  />
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Security Notice */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.securityNotice}
        >
          <Lock size={16} color="#10B981" />
          <Text style={styles.securityNoticeText}>
            Paiement 100% sécurisé par cryptage SSL 256-bit
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInUp.delay(600).duration(600).springify()}
        style={styles.bottomBar}
      >
        <View style={styles.bottomContent}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomLabel}>Total</Text>
            <Text style={styles.bottomAmount}>
              {bookingDetails.totalPrice.toFixed(2)} €
            </Text>
          </View>

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
                <Text style={styles.payButtonText}>Traitement...</Text>
              ) : (
                <>
                  <CheckCircle size={20} color={colors.textOnPrimary} />
                  <Text style={styles.payButtonText}>Confirmer</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          En confirmant, vous acceptez nos conditions d&apos;utilisation
        </Text>
      </Animated.View>
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
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.1,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#8B5CF6",
      top: -50,
      right: -50,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#10B981",
      top: 50,
      left: -30,
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
    headerCenter: {
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
    },
    securityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#10B98115",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginTop: 2,
    },
    securityBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    scrollContent: {
      paddingBottom: 180,
    },
    heroCard: {
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
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
      gap: 8,
      marginBottom: 8,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    heroAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 52,
      color: COLORS.neutral.white,
      lineHeight: 60,
    },
    heroCurrency: {
      fontSize: 32,
      opacity: 0.9,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    heroBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -30,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 50,
    },
    detailsScroll: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
    },
    detailPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginRight: 12,
    },
    detailPillIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    detailPillLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    detailPillValue: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    tutorCard: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    tutorAvatar: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    tutorAvatarText: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      color: colors.primary,
    },
    tutorInfo: {
      flex: 1,
    },
    tutorName: {
      fontFamily: FONTS.secondary,
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    tutorBadges: {
      flexDirection: "row",
      gap: 8,
    },
    tutorBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#10B98115",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    tutorBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: "#10B981",
      fontWeight: "600",
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    methodToggle: {
      flexDirection: "row",
      backgroundColor: isDark ? colors.input : COLORS.neutral[100],
      borderRadius: 14,
      padding: 4,
      marginBottom: 16,
    },
    methodTab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
      borderRadius: 10,
    },
    methodTabActive: {
      backgroundColor: colors.card,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    methodTabText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    methodTabTextActive: {
      color: colors.primary,
    },
    formCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    savedCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.input,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "transparent",
    },
    savedCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "08",
    },
    savedCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    cardTypeIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    cardTypeIconActive: {
      backgroundColor: colors.primary + "15",
    },
    cardType: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    cardNumber: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    savedCardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    cardExpiry: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
    },
    checkCircle: {},
    cvvRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 16,
      marginTop: 4,
    },
    cvvInputWrapper: {
      width: 100,
    },
    cvvHint: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingBottom: 12,
    },
    cvvHintText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
      flex: 1,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
      borderWidth: 1.5,
      borderColor: colors.inputBorder,
    },
    input: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
    },
    rowInputs: {
      flexDirection: "row",
      gap: 12,
    },
    securityNotice: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 20,
      marginHorizontal: 20,
    },
    securityNoticeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 32,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 16,
      elevation: 10,
    },
    bottomContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    bottomLeft: {},
    bottomLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    bottomAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 26,
      color: colors.textPrimary,
    },
    payButton: {
      borderRadius: 16,
      overflow: "hidden",
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
      paddingVertical: 16,
      paddingHorizontal: 32,
      gap: 10,
    },
    payButtonText: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textOnPrimary,
      fontWeight: "600",
    },
    termsText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: colors.textMuted,
      textAlign: "center",
    },
  });
