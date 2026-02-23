import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  User,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FONTS } from "@/config/fonts";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";
import { useLogin } from "@/hooks/api/auth";

interface AccountCardProps {
  title: string;
  subtitle: string;
  email: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
  delay: number;
  password: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  subtitle,
  email,
  icon,
  color,
  onPress,
  delay,
  password,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={[styles.accountCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.accountIcon, { backgroundColor: color + "15" }]}>
        {icon}
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountTitle}>{title}</Text>
        <Text style={styles.accountSubtitle}>{subtitle}</Text>
        <Text style={styles.accountEmail}>{email}</Text>
        <Text style={styles.accountPassword}>Mot de passe: {password}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

const DEV_ACCOUNTS = [
  {
    title: "Parent (seed)",
    subtitle: "Compte parent réel",
    email: "parent@email.com",
    password: "password123",
    icon: <User size={22} color="#6366F1" />,
    color: "#6366F1",
  },
  {
    title: "Élève (seed)",
    subtitle: "Compte child réel",
    email: "student@email.com",
    password: "password123",
    icon: <Users size={22} color="#3B82F6" />,
    color: "#3B82F6",
  },
  {
    title: "Tuteur (seed)",
    subtitle: "Compte tuteur réel",
    email: "tutor@email.com",
    password: "password123",
    icon: <GraduationCap size={22} color="#8B5CF6" />,
    color: "#8B5CF6",
  },
];

export default function DevAccountsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      const rawRole = data.user.role.toUpperCase();
      let appRole: "parent" | "child" | "tutor";
      if (rawRole === "TUTOR") {
        appRole = "tutor";
      } else if (rawRole === "CHILD") {
        appRole = "child";
      } else if (rawRole === "PARENT") {
        appRole = "parent";
      } else {
        return;
      }

      dispatch(
        loginSuccess({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email,
            role: appRole,
          },
          token: data.tokens.accessToken,
        }),
      );

      if (appRole === "child") {
        router.replace("/(tabs-child)");
      } else if (appRole === "tutor") {
        router.replace("/(tabs-tutor)");
      } else {
        router.replace("/(tabs)");
      }
    } catch {
      // Keep UI simple for dev flow
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comptes de test</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte info */}
        <View style={styles.infoCard}>
          <Sparkles size={20} color="#6366F1" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Mode développement</Text>
            <Text style={styles.infoText}>
              Connectez-vous avec différents types de comptes pour tester
              l&apos;application.
            </Text>
          </View>
        </View>

        {/* Comptes */}
        <View style={styles.accountsSection}>
          <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>

          {DEV_ACCOUNTS.map((account, index) => (
            <AccountCard
              key={account.email}
              title={account.title}
              subtitle={account.subtitle}
              email={account.email}
              password={account.password}
              icon={account.icon}
              color={account.color}
              onPress={() => handleLogin(account.email, account.password)}
              delay={200 + index * 100}
            />
          ))}
        </View>

        {/* Astuce */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Astuce :</Text> Ces comptes doivent
            exister dans la base via la seed backend.
          </Text>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.backToSignIn}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.backToSignInText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    fontSize: 18,
    color: "#1E293B",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Info Card
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },

  // Accounts Section
  accountsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 16,
  },
  accountCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderLeftWidth: 4,
  },
  accountIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  accountInfo: {
    flex: 1,
    justifyContent: "center",
  },
  accountTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  accountSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 12,
    color: "#94A3B8",
  },
  accountPassword: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  // Tip Card
  tipCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  tipText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: "700",
  },

  // Back to Sign In
  backToSignIn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backToSignInText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
