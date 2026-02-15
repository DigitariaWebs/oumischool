import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeBack } from "@/hooks/useSafeBack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, User, Users, GraduationCap } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppDispatch } from "@/store/hooks";
import { mockLogin, MOCK_ACCOUNTS } from "@/store/slices/authSlice";

interface AccountCardProps {
  title: string;
  subtitle: string;
  email: string;
  role: "parent" | "child" | "tutor";
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
  delay: number;
}

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  subtitle,
  email,
  icon,
  color,
  onPress,
  delay,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={styles.accountCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.accountIcon, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountTitle}>{title}</Text>
        <Text style={styles.accountSubtitle}>{subtitle}</Text>
        <Text style={styles.accountEmail}>{email}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export default function DevAccountsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleBack = useSafeBack("/sign-in");

  const handleLogin = (role: "parent" | "child" | "tutor") => {
    dispatch(mockLogin(role));
    if (role === "child") {
      router.replace("/(tabs-child)");
    } else if (role === "tutor") {
      router.replace("/(tabs-tutor)");
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comptes de Test</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>Mode Développement</Text>
          <Text style={styles.infoText}>
            Connectez-vous avec différents types de comptes pour tester
            l'application.
          </Text>
        </Animated.View>

        <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>

        <AccountCard
          title="Fatima (Parent)"
          subtitle="Compte parent avec 2 enfants"
          email={MOCK_ACCOUNTS.parent.email}
          role="parent"
          icon={<User size={24} color={COLORS.primary.DEFAULT} />}
          color={COLORS.primary.DEFAULT}
          onPress={() => handleLogin("parent")}
          delay={300}
        />

        <AccountCard
          title="Adam (Enfant)"
          subtitle="8 ans • CE2"
          email={MOCK_ACCOUNTS.child1.email}
          role="child"
          icon={<Users size={24} color="#3B82F6" />}
          color="#3B82F6"
          onPress={() => handleLogin("child")}
          delay={400}
        />

        <AccountCard
          title="Mohamed (Tuteur)"
          subtitle="Tuteur • Math & Sciences"
          email={MOCK_ACCOUNTS.tutor.email}
          role="tutor"
          icon={<GraduationCap size={24} color="#8B5CF6" />}
          color="#8B5CF6"
          onPress={() => handleLogin("tutor")}
          delay={500}
        />

        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.noteCard}
        >
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Astuce:</Text> Vous pouvez aussi vous
            connecter via l'écran de connexion en utilisant n'importe quelle
            adresse email contenant "adam", "sofia", "tutor", ou "mohamed".
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  scrollContent: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.DEFAULT,
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 16,
  },
  accountCard: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accountIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
    justifyContent: "center",
  },
  accountTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  accountSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    marginBottom: 4,
  },
  accountEmail: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
  },
  noteCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#EAB308",
  },
  noteText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    lineHeight: 20,
  },
  noteBold: {
    fontWeight: "700",
  },
});
