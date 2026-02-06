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
import { Mail, ArrowLeft, CheckCircle } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const HeaderBackground = () => (
  <View style={styles.headerBackgroundContainer}>
    <Svg
      height="100%"
      width="100%"
      viewBox="0 0 375 300"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Path
        d="M0 0H375V220C375 220 280 280 187.5 280C95 280 0 220 0 220V0Z"
        fill={COLORS.primary.DEFAULT}
      />
    </Svg>
  </View>
);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendResetLink = () => {
    if (!email) return;

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <HeaderBackground />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.successContainer}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.successContent}
            >
              <View style={styles.successIconContainer}>
                <CheckCircle size={64} color={COLORS.primary.DEFAULT} />
              </View>
              <Text style={styles.successTitle}>Email envoyé !</Text>
              <Text style={styles.successMessage}>
                Nous avons envoyé un lien de réinitialisation à{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.successHelp}>
                Vérifiez votre boîte de réception et suivez les instructions.
              </Text>

              <Button
                title="Retour à la connexion"
                onPress={() => router.replace("/sign-in")}
                fullWidth
                style={{ marginTop: 32, height: 56 }}
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={COLORS.neutral.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.card}
          >
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={COLORS.neutral[400]} />}
            />

            <Button
              title="Envoyer le lien"
              onPress={handleSendResetLink}
              isLoading={isLoading}
              disabled={!email}
              fullWidth
              style={{
                marginTop: 24,
                height: 56,
              }}
            />

            <Text style={styles.helpText}>
              Le lien sera valable pendant 1 heure
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral[100],
    opacity: 0.9,
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  helpText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    marginTop: 16,
  },
  // Success State
  successContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.secondary[900],
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
  },
  successHelp: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
  },
  resendButton: {
    marginTop: 24,
    padding: 8,
  },
  resendText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
});
