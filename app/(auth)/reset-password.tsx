import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Veuillez entrer le code complet");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      router.replace("/onboarding");
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;

    setTimer(120);
    setCanResend(false);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    console.log("Resending OTP code...");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <SafeAreaView style={styles.container}>
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Bouton retour */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={22} color="#1E293B" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.header}>
            <Text style={styles.headerLabel}>VÉRIFICATION</Text>
            <Text style={styles.headerTitle}>Code de vérification</Text>
            <Text style={styles.headerSubtitle}>
              Entrez le code à 6 chiffres envoyé à votre email
            </Text>
          </Animated.View>

          {/* Carte OTP */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.otpCard}>
            {/* Champs OTP */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    error && styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Message d'erreur */}
            {error && (
              <Animated.Text entering={FadeInDown.duration(300)} style={styles.errorText}>
                {error}
              </Animated.Text>
            )}

            {/* Timer / Renvoyer */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Renvoyer dans <Text style={styles.timerHighlight}>{formatTime(timer)}</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Renvoyer le code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Bouton de vérification */}
            <Button
              title="Vérifier"
              onPress={handleVerify}
              isLoading={isLoading}
              disabled={!isOtpComplete}
              fullWidth
              style={[styles.verifyButton, !isOtpComplete && styles.verifyButtonDisabled]}
              icon={<Check size={18} color="white" />}
            />

            {/* Lien d'aide */}
            <Text style={styles.helpText}>
              Vous n'avez pas reçu le code ?{" "}
              <Text style={styles.helpLink} onPress={() => console.log("Contact support")}>
                Contactez-nous
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  // Boule violette décorative
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    marginBottom: 24,
  },

  // Header
  header: {
    marginBottom: 32,
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

  // Carte OTP
  otpCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },

  // Champs OTP
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontFamily: FONTS.fredoka,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: "#6366F1",
  },
  otpInputError: {
    borderColor: "#EF4444",
  },

  // Erreur
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },

  // Resend
  resendContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: "#64748B",
  },
  timerHighlight: {
    fontWeight: "700",
    color: "#6366F1",
  },
  resendText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6366F1",
  },

  // Bouton
  verifyButton: {
    height: 52,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  // Help
  helpText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  helpLink: {
    fontWeight: "700",
    color: "#6366F1",
  },
});
