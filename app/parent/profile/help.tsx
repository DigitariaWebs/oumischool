import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface FAQItemProps {
  question: string;
  answer: string;
  delay: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          {isExpanded ? (
            <ChevronUp size={20} color={COLORS.secondary[600]} />
          ) : (
            <ChevronDown size={20} color={COLORS.secondary[600]} />
          )}
        </View>
        {isExpanded && (
          <Text style={styles.faqAnswer}>{answer}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ParentHelpScreen() {
  const router = useRouter();

  const [message, setMessage] = useState("");

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
          <Text style={styles.headerTitle}>Aide & Support</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Quick Contact */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("email")}
            >
              <View style={styles.contactIcon}>
                <Mail size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@oumischool.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("phone")}
            >
              <View style={styles.contactIcon}>
                <Phone size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.sectionHeader}
          >
            <HelpCircle size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          </Animated.View>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                delay={250 + index * 50}
              />
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <MessageCircle size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.formLabel}>Votre message</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Décrivez votre problème ou votre question..."
              placeholderTextColor={COLORS.neutral[400]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={18} color={COLORS.neutral.white} />
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Support Hours */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={styles.hoursCard}
        >
          <Text style={styles.hoursTitle}>Horaires du support</Text>
          <Text style={styles.hoursText}>Lundi - Vendredi: 9h00 - 18h00</Text>
          <Text style={styles.hoursText}>Samedi: 10h00 - 16h00</Text>
          <Text style={styles.hoursText}>Dimanche: Fermé</Text>
          <Text style={styles.hoursNote}>
            Temps de réponse moyen: 2-4 heures
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
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactCard: {
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
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  contactLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    marginBottom: 4,
  },
  contactValue: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary[900],
    textAlign: "center",
  },
  faqList: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 20,
    marginTop: 12,
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
  formLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[700],
    marginBottom: 8,
  },
  textArea: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    minHeight: 120,
    marginBottom: 16,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 12,
    padding: 14,
  },
  sendButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  hoursCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  hoursTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 12,
  },
  hoursText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    marginBottom: 4,
  },
  hoursNote: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    marginTop: 8,
    fontStyle: "italic",
  },
});
