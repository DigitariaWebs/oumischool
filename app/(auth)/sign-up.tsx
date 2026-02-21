import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function SignUpScreen() {
  const router = useRouter();
  const [role, setRole] = useState("parent");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    setIsLoading(true);
    console.log("Inscription en tant que :", role);
    
    setTimeout(() => {
      setIsLoading(false);
      // Redirection directe vers la page de connexion
      router.push("/sign-in");
    }, 1500);
  };

  const roleColor = role === "parent" ? "#6366F1" : "#10B981";
  const roleLightColor = role === "parent" ? "#EEF2FF" : "#D1FAE5";

  return (
    <View style={styles.container}>
      {/* Boule décorative colorée selon le rôle */}
      <View style={[styles.roleBlob, { backgroundColor: roleColor, opacity: 0.1 }]} />

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

          {/* Logo */}
          <Animated.View entering={FadeInUp.delay(250).duration(600)} style={styles.logoContainer}>
            <Image source={ASSETS.logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          {/* Header simplifié */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600)}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>
              Créer un compte
            </Text>
            <Text style={styles.headerSubtitle}>
              {role === "parent" 
                ? "Rejoignez Oumi'School en tant que parent" 
                : "Rejoignez Oumi'School en tant que tuteur"}
            </Text>
          </Animated.View>

          {/* Sélecteur de Rôle */}
          <Animated.View entering={FadeInDown.delay(350).duration(600)}>
            <Text style={styles.roleSelectorLabel}>Je m'inscris en tant que</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "parent" && { 
                    backgroundColor: roleColor,
                    borderColor: roleColor,
                  }
                ]}
                onPress={() => setRole("parent")}
              >
                <Users 
                  size={18} 
                  color={role === "parent" ? "white" : "#64748B"} 
                />
                <Text
                  style={[
                    styles.roleText,
                    role === "parent" && styles.roleTextActive
                  ]}
                >
                  Parent
                </Text>
                {role === "parent" && (
                  <Sparkles size={14} color="white" style={styles.roleSparkle} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "tutor" && { 
                    backgroundColor: roleColor,
                    borderColor: roleColor,
                  }
                ]}
                onPress={() => setRole("tutor")}
              >
                <GraduationCap 
                  size={18} 
                  color={role === "tutor" ? "white" : "#64748B"} 
                />
                <Text
                  style={[
                    styles.roleText,
                    role === "tutor" && styles.roleTextActive
                  ]}
                >
                  Tuteur
                </Text>
                {role === "tutor" && (
                  <Sparkles size={14} color="white" style={styles.roleSparkle} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Formulaire */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={[styles.formCard, { borderTopColor: roleColor }]}
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

            {/* Champ spécifique selon le rôle */}
            {role === "tutor" && (
              <View style={styles.tutorField}>
                <Text style={styles.tutorFieldLabel}>Matières enseignées</Text>
                <View style={styles.tutorSubjects}>
                  {["Maths", "Français", "Sciences"].map((subject, idx) => (
                    <View key={idx} style={[styles.subjectPill, { backgroundColor: roleLightColor }]}>
                      <Text style={[styles.subjectPillText, { color: roleColor }]}>{subject}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {role === "parent" && (
              <View style={styles.parentField}>
                <Text style={styles.parentFieldLabel}>Nombre d'enfants</Text>
                <View style={styles.childrenCount}>
                  {[1, 2, 3, "4+"].map((count, idx) => (
                    <TouchableOpacity key={idx} style={[styles.countPill, { borderColor: roleColor }]}>
                      <Text style={[styles.countPillText, { color: roleColor }]}>{count}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <Button
              title="S'inscrire"
              onPress={handleSignUp}
              isLoading={isLoading}
              fullWidth
              style={[styles.signUpButton, { backgroundColor: roleColor }]}
            />

            <Text style={styles.termsText}>
              En m'inscrivant, j'accepte les{" "}
              <Text style={[styles.termsLink, { color: roleColor }]}>conditions d'utilisation</Text>
            </Text>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={[styles.signInText, { color: roleColor }]}>Se connecter</Text>
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
    position: "relative",
  },
  roleBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -100,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    zIndex: 1,
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
    marginBottom: 16,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },

  // Header simplifié
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Sélecteur de Rôle
  roleSelectorLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 30,
    paddingVertical: 12,
    position: "relative",
  },
  roleText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "white",
  },
  roleSparkle: {
    position: "absolute",
    top: -4,
    right: 8,
  },

  // Formulaire
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderTopWidth: 4,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  signUpButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 30,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  termsLink: {
    fontWeight: "600",
  },

  // Champs spécifiques tuteur
  tutorField: {
    marginBottom: 16,
  },
  tutorFieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  tutorSubjects: {
    flexDirection: "row",
    gap: 8,
  },
  subjectPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subjectPillText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Champs spécifiques parent
  parentField: {
    marginBottom: 16,
  },
  parentFieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  childrenCount: {
    flexDirection: "row",
    gap: 8,
  },
  countPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
  },
  countPillText: {
    fontSize: 13,
    fontWeight: "600",
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
  },
});