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
  Sparkles,
  Headphones,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

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
        style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <View style={styles.faqChevron}>
            {isExpanded ? (
              <ChevronUp size={16} color="#6366F1" />
            ) : (
              <ChevronDown size={16} color="#64748B" />
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
  const [message, setMessage] = useState("");

  const faqs = [
    {
      question: "Comment réserver une session avec un tuteur ?",
      answer:
        "Pour réserver une session, allez dans l'onglet 'Tuteurs', sélectionnez un tuteur et cliquez sur 'Réserver'. Choisissez la date et l'heure souhaitée.",
    },
    {
      question: "Comment annuler ou reprogrammer une session ?",
      answer:
        "Vous pouvez annuler ou reprogrammer une session jusqu'à 24h avant son début. Allez dans l'onglet 'Sessions' et sélectionnez la session concernée.",
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer:
        "Les paiements sont effectués par carte bancaire. Vous êtes facturé mensuellement pour votre abonnement et les sessions supplémentaires.",
    },
    {
      question: "Puis-je changer mon plan d'abonnement ?",
      answer:
        "Oui, vous pouvez changer de plan à tout moment depuis la section 'Abonnement' de votre profil.",
    },
    {
      question: "Comment ajouter un nouvel enfant ?",
      answer:
        "Allez dans votre profil, section 'Enfants', et cliquez sur 'Ajouter un enfant'. Remplissez les informations nécessaires.",
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un message");
      return;
    }
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
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={styles.headerRight}>
          <Headphones size={16} color="#6366F1" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte d'accueil */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Sparkles size={20} color="#6366F1" />
          </View>
          <Text style={styles.welcomeTitle}>
            Comment pouvons-nous vous aider ?
          </Text>
          <Text style={styles.welcomeText}>Réponse en moins de 24h</Text>
        </View>

        {/* Contact rapide */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Phone size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Contactez-nous</Text>
          </View>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("email")}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#EEF2FF" }]}
              >
                <Mail size={18} color="#6366F1" />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue} numberOfLines={1}>
                support@oumischool.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact("phone")}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#D1FAE5" }]}
              >
                <Phone size={18} color="#10B981" />
              </View>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          </View>
          <View style={styles.faqCard}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} delay={200 + index * 50} />
            ))}
          </View>
        </View>

        {/* Formulaire de contact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageCircle size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
          </View>
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Votre message</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Décrivez votre problème..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={16} color="white" />
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horaires */}
        <View style={styles.hoursCard}>
          <View style={styles.hoursHeader}>
            <Headphones size={16} color="#6366F1" />
            <Text style={styles.hoursTitle}>Horaires du support</Text>
          </View>
          <View style={styles.hoursContent}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Lundi - Vendredi</Text>
              <Text style={styles.hoursTime}>9h - 18h</Text>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Samedi</Text>
              <Text style={styles.hoursTime}>10h - 16h</Text>
            </View>
          </View>
          <Text style={styles.hoursNote}>Temps de réponse: 2-4h</Text>
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>
            + Consulter la base de connaissances
          </Text>
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
  welcomeCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748B",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  faqCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  faqItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  faqItemExpanded: {
    backgroundColor: "#FFFFFF",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqChevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    minHeight: 100,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    borderRadius: 30,
    padding: 12,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  hoursCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  hoursTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  hoursContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  hoursDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 2,
  },
  hoursDay: {
    fontSize: 13,
    color: "#64748B",
  },
  hoursTime: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  hoursNote: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "500",
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
