import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
// Removed SafeAreaView to manage status bar transparency manually if needed but keeping it for now
// Actually, for the header to go top, we should not use SafeAreaView or handle it differently.
// Let's use View and handle padding nicely. We'll stick to a standard View container.
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAppDispatch } from "@/store/hooks";
import { mockLogin } from "@/store/slices/authSlice";

// Custom Header Shape using SVG
const HeaderBackground = () => (
  <View style={styles.headerBackgroundContainer}>
    <Svg
      height="100%"
      width="100%"
      viewBox="0 0 375 300" // Adjusted layout
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

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock login based on email
      let role: 'parent' | 'child' | 'tutor' = 'parent';
      
      if (email.includes('adam') || email.includes('sofia')) {
        role = 'child';
      } else if (email.includes('tutor') || email.includes('mohamed')) {
        role = 'tutor';
      }
      
      // Dispatch mock login action
      dispatch(mockLogin(role));
      
      setIsLoading(false);
      // Redirect to role-specific dashboard
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
      {/* Background Graphic */}
      <HeaderBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Content */}
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
          <Text style={styles.subtitle}>Connectez-vous à votre espace</Text>
        </Animated.View>

        {/* Login Card */}
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
            style={{ marginBottom: 20 }}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
            icon={<Lock size={20} color={COLORS.neutral[400]} />}
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
            style={{
              marginTop: 24,
              marginBottom: 24,
              height: 56,
            }}
            icon={<ArrowRight size={20} color="white" />}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou via</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign
                name="google"
                size={24}
                color={COLORS.secondary.DEFAULT}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign
                name="apple"
                size={24}
                color={COLORS.secondary.DEFAULT}
              />
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

        {/* Dev Mode Button */}
        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
          <TouchableOpacity
            onPress={() => router.push("/dev-accounts")}
            style={styles.devModeButton}
          >
            <Text style={styles.devModeText}>Comptes de test</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50], // Slightly off-white background
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 350, // Should cover enough space
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80, // Space from top
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    zIndex: 1,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: COLORS.neutral.white,
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral[100], // Lighter text on green bg
    textAlign: "center",
    opacity: 0.9,
  },
  // Card Design
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8, // Android shadow
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: FONTS.secondary,
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  dividerText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.neutral[500],
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[600],
  },
  signUpText: {
    fontFamily: FONTS.secondary,
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.primary.DEFAULT,
  },
  devModeButton: {
    marginTop: 16,
    marginHorizontal: 24,
    padding: 12,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderStyle: "dashed",
  },
  devModeText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
});
