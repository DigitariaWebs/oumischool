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
import { Mail, Lock, User, ArrowLeft } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // LOGIQUE INTACTE
  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/otp-verification");
    }, 1500);
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.headerLabel}>INSCRIPTION</Text>
            <Text style={styles.headerTitle}>Créer un compte</Text>
            <Text style={styles.headerSubtitle}>
              Rejoignez la famille Oumi'School
            </Text>
          </Animated.View>

          {/* Formulaire */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.formCard}
          >
            <Input
              label="Nom complet"
              placeholder="Votre nom"
              value={name}
              onChangeText={setName}
              icon={<User size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />

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

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={<Lock size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              icon={<Lock size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />

            <Button
              title="S'inscrire"
              onPress={handleSignUp}
              isLoading={isLoading}
              fullWidth
              style={styles.signUpButton}
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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
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
  },

  // Formulaire
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6366F1",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  signInText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },
});