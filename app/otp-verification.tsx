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
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";

// Header background SVG (reusing from sign-in pattern)
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

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Refs for each input field
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown effect
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

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
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

    // Mock API call - accept any 6-digit code
    setTimeout(() => {
      setIsLoading(false);
      // Any 6-digit code is accepted (no backend validation for now)
      router.replace("/onboarding");
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;

    // Reset timer and resend code
    setTimer(120);
    setCanResend(false);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Mock API call to resend
    console.log("Resending OTP code...");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View style={styles.container}>
      <HeaderBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
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
            <Text style={styles.title}>Vérification</Text>
            <Text style={styles.subtitle}>
              Entrez le code envoyé à votre email
            </Text>
          </Animated.View>

          {/* OTP Card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.card}
          >
            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
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

            {/* Error Message */}
            {error && (
              <Animated.Text
                entering={FadeInDown.duration(300)}
                style={styles.errorText}
              >
                {error}
              </Animated.Text>
            )}

            {/* Timer / Resend */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Renvoyer le code dans{" "}
                  <Text style={styles.timerHighlight}>{formatTime(timer)}</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Renvoyer le code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <Button
              title="Vérifier"
              onPress={handleVerify}
              isLoading={isLoading}
              disabled={!isOtpComplete}
              fullWidth
              style={{
                marginTop: 24,
                height: 56,
              }}
              icon={<Check size={20} color="white" />}
            />

            {/* Help Text */}
            <Text style={styles.helpText}>
              Vous n&apos;avez pas reçu le code ?{" "}
              <Text
                style={styles.helpLink}
                onPress={() => console.log("Contact support")}
              >
                Contactez-nous
              </Text>
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  header: {
    paddingHorizontal: 24,
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
    marginHorizontal: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontFamily: FONTS.fredoka,
    color: COLORS.secondary[900],
    backgroundColor: COLORS.neutral[50],
  },
  otpInputFilled: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  otpInputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.neutral[50],
  },
  errorText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  timerText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  timerHighlight: {
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
  },
  resendText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
  },
  helpText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    marginTop: 16,
  },
  helpLink: {
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
  },
});
