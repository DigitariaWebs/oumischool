import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, ArrowLeft, CheckCircle, Sparkles } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForgotPassword } from "@/hooks/api/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const forgotMutation = useForgotPassword();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendResetLink = async () => {
    if (!email) return;
    setError(null);
    try {
      await forgotMutation.mutateAsync(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.successCard}
          >
            <View style={styles.successIcon}>
              <CheckCircle size={48} color="#6366F1" />
            </View>
            <Text style={styles.successTitle}>Email envoyé !</Text>
            <Text style={styles.successMessage}>
              Nous avons envoyé un lien de réinitialisation à
            </Text>
            <Text style={styles.successEmail}>{email}</Text>
            <Text style={styles.successHelp}>
              Vérifiez votre boîte de réception
            </Text>

            <Button
              title="Retour à la connexion"
              onPress={() => router.replace("/sign-in")}
              fullWidth
              style={styles.successButton}
            />

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => setIsSuccess(false)}
            >
              <Text style={styles.resendText}>
                Vous n&apos;avez pas reçu l&apos;email ?
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Bouton retour */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#1E293B" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600)}
            style={styles.header}
          >
            <Text style={styles.headerLabel}>MOT DE PASSE OUBLIÉ</Text>
            <Text style={styles.headerTitle}>Réinitialisation</Text>
            <Text style={styles.headerSubtitle}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </Animated.View>

          {/* Formulaire */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.formCard}
          >
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />

            {error && (
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 13,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            )}

            <Button
              title="Envoyer le lien"
              onPress={handleSendResetLink}
              isLoading={forgotMutation.isPending}
              disabled={!email}
              fullWidth
              style={[styles.sendButton, !email && styles.sendButtonDisabled]}
            />

            <Text style={styles.helpText}>
              Le lien sera valable pendant 1 heure
            </Text>
          </Animated.View>

          {/* Petit rappel */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.tipCard}
          >
            <Sparkles size={14} color="#6366F1" />
            <Text style={styles.tipText}>
              Vérifiez vos spams si vous ne trouvez pas l&apos;email
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Bouton retour
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 24,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
  },

  // Formulaire
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  sendButton: {
    height: 52,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    marginBottom: 16,
  },
  sendButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  helpText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },

  // Tip
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
  },

  // Success State
  successContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 4,
  },
  successEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366F1",
    textAlign: "center",
    marginBottom: 16,
  },
  successHelp: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
  },
  successButton: {
    height: 52,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    marginBottom: 16,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
});
