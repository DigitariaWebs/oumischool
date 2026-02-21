import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAppDispatch } from "@/store/hooks";
import { mockLogin } from "@/store/slices/authSlice";
import {
  generateWeeklyDigests,
  runWorkflowAutomation,
} from "@/store/slices/workflowSlice";

// Arrière-plan décoré avec points
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.dot, { top: '15%', left: '10%', backgroundColor: "#6366F1", width: 16, height: 16 }]} />
    <View style={[styles.dot, { top: '25%', right: '15%', backgroundColor: "#F59E0B", width: 20, height: 20 }]} />
    <View style={[styles.dot, { bottom: '30%', left: '20%', backgroundColor: "#10B981", width: 12, height: 12, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: '20%', right: '25%', backgroundColor: "#EF4444", width: 14, height: 14 }]} />
    <View style={[styles.ring, { top: '10%', right: '-10%' }]} />
    <View style={[styles.ring, { bottom: '5%', left: '-15%' }]} />
  </View>
);

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // LOGIQUE INTACTE
  const handleSignIn = () => {
    setIsLoading(true);

    setTimeout(() => {
      let role: "parent" | "child" | "tutor" = "parent";

      if (email.includes("adam") || email.includes("sofia")) {
        role = "child";
      } else if (email.includes("tutor") || email.includes("mohamed")) {
        role = "tutor";
      }

      dispatch(mockLogin(role));
      dispatch(runWorkflowAutomation());
      const now = new Date();
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - diffToMonday);
      weekStart.setHours(0, 0, 0, 0);
      dispatch(generateWeeklyDigests({ weekStartAt: weekStart.toISOString() }));
      setIsLoading(false);
      
      if (role === "child") {
        router.replace("/(tabs-child)");
      } else if (role === "tutor") {
        router.replace("/(tabs-tutor)");
      } else {
        router.replace("/(tabs)");
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo et Header */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image
              source={ASSETS.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Bienvenue !</Text>
          <Text style={styles.subtitle}>
            Connectez-vous à votre espace Oumi'School
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

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
            icon={<Lock size={18} color="#94A3B8" />}
            containerStyle={styles.inputContainer}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <Button
            title="Se connecter"
            onPress={handleSignIn}
            isLoading={isLoading}
            fullWidth
            style={styles.signInButton}
            icon={<ArrowRight size={18} color="white" />}
          />

          {/* Séparateur */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou continuer avec</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Boutons sociaux */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={22} color="#1E293B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="apple" size={22} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Pas encore membre ? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.signUpText}>Créer un compte</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Mode test */}
        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
          <TouchableOpacity
            onPress={() => router.push("/dev-accounts")}
            style={styles.devButton}
          >
            <Text style={styles.devButtonText}>Comptes de test</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Fond légèrement gris
  },
  // Décorations
  dot: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5,
  },
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    opacity: 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Header avec logo
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
  },

  // Formulaire
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
  signInButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#6366F1",
    marginBottom: 24,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  dividerText: {
    fontSize: 13,
    color: "#94A3B8",
    marginHorizontal: 12,
  },

  // Social buttons
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },

  // Dev button
  devButton: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  devButtonText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
});
