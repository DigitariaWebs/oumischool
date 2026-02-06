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
// Removed SafeAreaView
import { Mail, Lock, User, ArrowLeft, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

// Reusing same header background logic
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

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // After signup, go to OTP verification first
      router.replace("/otp-verification");
    }, 1500);
  };

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
          {/* Header / Nav */}
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
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez la famille Oumi&apos;School
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.card}
          >
            <Input
              label="Nom complet"
              placeholder="Votre Nom"
              value={name}
              onChangeText={setName}
              icon={<User size={20} color={COLORS.neutral[400]} />}
              style={{ marginBottom: 20 }}
            />

            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={COLORS.neutral[400]} />}
              style={{ marginBottom: 20 }}
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={<Lock size={20} color={COLORS.neutral[400]} />}
              style={{ marginBottom: 20 }}
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              icon={<Lock size={20} color={COLORS.neutral[400]} />}
            />

            <Button
              title="S'inscrire"
              onPress={handleSignUp}
              isLoading={isLoading}
              fullWidth
              style={{
                marginTop: 24,
                marginBottom: 16,
                height: 56,
              }}
              icon={<ArrowRight size={20} color="white" />}
            />
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signInText}>Se connecter</Text>
            </TouchableOpacity>
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
    paddingTop: 60, // Space for status bar + back button
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
  // Card
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[600],
  },
  signInText: {
    fontFamily: FONTS.secondary,
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.primary.DEFAULT,
  },
});
