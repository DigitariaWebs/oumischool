import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Headphones,
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FAQItemProps {
  question: string;
  answer: string;
  delay: number;
  colors: ThemeColors;
  isDark: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  delay,
  colors,
  isDark,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <TouchableOpacity
        style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <View
            style={[styles.faqChevron, isExpanded && styles.faqChevronExpanded]}
          >
            {isExpanded ? (
              <ChevronUp size={18} color={colors.primary} />
            ) : (
              <ChevronDown size={18} color={colors.textSecondary} />
            )}
          </View>
        </View>
        {isExpanded && <Text style={styles.faqAnswer}>{answer}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ParentHelpScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [message, setMessage] = useState("");
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const faqs = [
    {
      question: "Comment réserver une session avec un tuteur ?",
      answer:
        "Pour réserver une session, allez dans l'onglet 'Tuteurs', sélectionnez un tuteur, consultez son profil et cliquez sur 'Réserver'. Choisissez la date, l'heure et la matière souhaitée, puis confirmez votre réservation.",
    },
    {
      question: "Comment annuler ou reprogrammer une session ?",
      answer:
        "Vous pouvez annuler ou reprogrammer une session jusqu'à 24h avant son début. Allez dans l'onglet 'Sessions', sélectionnez la session concernée et choisissez l'option 'Annuler' ou 'Reprogrammer'. Les annulations tardives peuvent entraîner des frais.",
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer:
        "Les paiements sont effectués par carte bancaire ou prélèvement automatique selon votre abonnement. Vous êtes facturé mensuellement pour votre abonnement et pour toute session supplémentaire au-delà de votre quota mensuel.",
    },
    {
      question: "Puis-je changer mon plan d'abonnement ?",
      answer:
        "Oui, vous pouvez changer de plan à tout moment depuis la section 'Abonnement' de votre profil. Le changement prendra effet immédiatement et le montant sera proratisé pour le mois en cours.",
    },
    {
      question: "Comment ajouter un nouvel enfant à mon compte ?",
      answer:
        "Allez dans votre profil, section 'Enfants', et cliquez sur 'Ajouter un enfant'. Remplissez les informations nécessaires (nom, âge, niveau scolaire). Notez que selon votre plan, vous pourriez avoir besoin de passer à un abonnement supérieur.",
    },
    {
      question: "Les tuteurs sont-ils vérifiés ?",
      answer:
        "Oui, tous nos tuteurs sont vérifiés. Nous vérifions leurs diplômes, antécédents et compétences pédagogiques. Chaque tuteur doit également maintenir une note minimale de 4.5/5 pour continuer à proposer ses services.",
    },
    {
      question: "Que faire si je ne suis pas satisfait d'une session ?",
      answer:
        "Si vous n'êtes pas satisfait d'une session, contactez-nous dans les 48h suivant la session via le support. Nous examinerons votre cas et pourrons vous proposer une session de remplacement ou un remboursement selon les circonstances.",
    },
    {
      question: "Comment suivre les progrès de mon enfant ?",
      answer:
        "Vous pouvez consulter les rapports de progression dans l'onglet 'Progrès'. Après chaque session, le tuteur rédige un compte-rendu détaillant les sujets abordés, les points forts et les axes d'amélioration de votre enfant.",
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un message");
      return;
    }
    // TODO: Implement message sending logic
    Alert.alert("Message envoyé", "Nous vous répondrons dans les 24h");
    setMessage("");
  };

  const handleContact = (type: "email" | "phone") => {
    if (type === "email") {
      Linking.openURL("mailto:support@oumischool.com");
    } else {
      Linking.openURL("tel:+33123456789");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Aide & Support</Text>
          <View style={styles.headerBadge}>
            <Headphones size={12} color="#10B981" />
            <Text style={styles.headerBadgeText}>En ligne</Text>
          </View>
        </View>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600).springify()}
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
                  <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Centre d'aide</Text>
              </View>
              <Text style={styles.heroTitle}>
                Comment pouvons-nous vous aider ?
              </Text>
              <View style={styles.heroBadge}>
                <CheckCircle size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  Réponse en moins de 24h
                </Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Quick Contact */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#3B82F615" }]}
            >
              <Phone size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Contactez-nous</Text>
          </View>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("email")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#3B82F615" }]}
              >
                <Mail size={22} color="#3B82F6" />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@oumischool.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("phone")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#10B98115" }]}
              >
                <Phone size={22} color="#10B981" />
              </View>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify()}
            style={styles.sectionHeader}
          >
            <View
              style={[styles.sectionIcon, { backgroundColor: "#8B5CF615" }]}
            >
              <HelpCircle size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          </Animated.View>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                delay={350 + index * 50}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#10B98115" }]}
            >
              <MessageCircle size={18} color="#10B981" />
            </View>
            <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.formLabel}>Votre message</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Décrivez votre problème ou votre question..."
              placeholderTextColor={colors.inputPlaceholder}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <Send size={18} color={COLORS.neutral.white} />
                <Text style={styles.sendButtonText}>Envoyer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Support Hours */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={styles.hoursCard}
        >
          <View style={styles.hoursHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#F59E0B15" }]}
            >
              <Headphones size={18} color="#F59E0B" />
            </View>
            <Text style={styles.hoursTitle}>Horaires du support</Text>
          </View>
          <View style={styles.hoursContent}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Lundi - Vendredi</Text>
              <Text style={styles.hoursTime}>9h00 - 18h00</Text>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Samedi</Text>
              <Text style={styles.hoursTime}>10h00 - 16h00</Text>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Dimanche</Text>
              <Text style={[styles.hoursTime, { color: "#EF4444" }]}>
                Fermé
              </Text>
            </View>
          </View>
          <View style={styles.hoursNoteBadge}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.hoursNote}>
              Temps de réponse moyen: 2-4 heures
            </Text>
          </View>
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
    // Blob Background
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
      top: 80,
      left: -30,
    },
    // Header
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
      borderRadius: 14,
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
    headerBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#10B98115",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginTop: 2,
    },
    headerBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    placeholder: {
      width: 44,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Hero Card
    heroCard: {
      marginHorizontal: 20,
      marginBottom: 24,
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
    heroTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 26,
      color: COLORS.neutral.white,
      lineHeight: 32,
      marginBottom: 4,
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
    // Section
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    contactRow: {
      flexDirection: "row",
      gap: 12,
    },
    contactCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    contactIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    contactLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    contactValue: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      fontWeight: "600",
      color: colors.textPrimary,
      textAlign: "center",
    },
    faqList: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    faqItem: {
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    faqItemExpanded: {
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    },
    faqHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    faqChevron: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
      justifyContent: "center",
      alignItems: "center",
    },
    faqChevronExpanded: {
      backgroundColor: colors.primary + "15",
    },
    faqQuestion: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      flex: 1,
      marginRight: 12,
    },
    faqAnswer: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    formLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 10,
    },
    textArea: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: colors.input,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      minHeight: 120,
      marginBottom: 16,
    },
    sendButton: {
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    sendButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    sendButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
    hoursCard: {
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    hoursHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
    },
    hoursTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    hoursContent: {
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      borderRadius: 14,
      padding: 14,
      marginBottom: 16,
    },
    hoursRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
    },
    hoursDivider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    hoursDay: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    hoursTime: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    hoursNoteBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#10B98115",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    hoursNote: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: "#10B981",
      fontWeight: "500",
    },
  });
