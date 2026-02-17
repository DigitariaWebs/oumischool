import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  UserX,
  Download,
  Trash2,
  Sparkles,
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ParentPrivacyScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const handleDownloadData = () => {
    Alert.alert(
      "Télécharger mes données",
      "Nous allons préparer une archive de toutes vos données. Vous recevrez un email avec le lien de téléchargement dans les 24h.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            // TODO: Implement data download logic
            Alert.alert(
              "Demande enregistrée",
              "Vous recevrez un email sous peu",
            );
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irréversible. Toutes vos données seront définitivement supprimées. Êtes-vous sûr de vouloir continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmation finale",
              "Tapez 'SUPPRIMER' pour confirmer la suppression de votre compte",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Confirmer",
                  style: "destructive",
                  onPress: () => {
                    // TODO: Implement account deletion logic
                    Alert.alert(
                      "Compte supprimé",
                      "Votre compte a été supprimé",
                    );
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Confidentialité</Text>
          <View style={styles.securityBadge}>
            <Shield size={12} color="#10B981" />
            <Text style={styles.securityBadgeText}>Protégé</Text>
          </View>
        </View>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Privacy Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600).springify()}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={["#10B981", "#059669", "#047857"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View style={styles.sparkleContainer}>
                  <Shield size={20} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>État de la protection</Text>
              </View>
              <Text style={styles.heroTitle}>Données protégées</Text>
              <View style={styles.heroBadge}>
                <CheckCircle size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  Conforme RGPD • Chiffrement SSL
                </Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Visibility Settings */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#3B82F615" }]}
            >
              <Eye size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Visibilité du profil</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Profil public</Text>
                <Text style={styles.settingDescription}>
                  Les tuteurs peuvent voir votre profil
                </Text>
              </View>
              <Switch
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Afficher l'email</Text>
                <Text style={styles.settingDescription}>
                  Visible par les tuteurs
                </Text>
              </View>
              <Switch
                value={showEmail}
                onValueChange={setShowEmail}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Afficher le téléphone</Text>
                <Text style={styles.settingDescription}>
                  Visible par les tuteurs
                </Text>
              </View>
              <Switch
                value={showPhone}
                onValueChange={setShowPhone}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Data Management */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#8B5CF615" }]}
            >
              <Lock size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Gestion des données</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Collecte de données</Text>
                <Text style={styles.settingDescription}>
                  Améliorer votre expérience
                </Text>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Partage tiers</Text>
                <Text style={styles.settingDescription}>
                  Partager avec nos partenaires
                </Text>
              </View>
              <Switch
                value={thirdPartySharing}
                onValueChange={setThirdPartySharing}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Emails marketing</Text>
                <Text style={styles.settingDescription}>
                  Recevoir nos offres et actualités
                </Text>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                trackColor={{
                  false: isDark ? colors.input : COLORS.neutral[300],
                  true: "#10B981",
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Data Actions */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#F59E0B15" }]}
            >
              <Download size={18} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>Vos droits</Text>
          </View>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleDownloadData}
            >
              <View style={styles.actionIcon}>
                <Download size={20} color={COLORS.primary.DEFAULT} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Télécharger mes données</Text>
                <Text style={styles.actionDescription}>
                  Archive complète de vos informations
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#EF444415" }]}
            >
              <UserX size={18} color={COLORS.error} />
            </View>
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>
              Zone dangereuse
            </Text>
          </View>
          <View style={[styles.card, styles.dangerCard]}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleDeleteAccount}
            >
              <View style={styles.dangerIcon}>
                <Trash2 size={20} color={COLORS.error} />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, styles.dangerText]}>
                  Supprimer mon compte
                </Text>
                <Text style={styles.actionDescription}>
                  Action irréversible - toutes vos données seront supprimées
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Privacy Policy */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={styles.policySection}
        >
          <Text style={styles.policyTitle}>Politique de confidentialité</Text>
          <Text style={styles.policyText}>
            En utilisant Oumi'School, vous acceptez notre politique de
            confidentialité. Nous nous engageons à protéger vos données
            personnelles conformément au RGPD.
          </Text>
          <TouchableOpacity style={styles.policyLink}>
            <Text style={styles.policyLinkText}>
              Lire la politique complète
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Blob Background
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.1,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#10B981",
      top: -50,
      right: -50,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#8B5CF6",
      top: 80,
      left: -30,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    headerCenter: {
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
    },
    securityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#10B98115",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginTop: 2,
    },
    securityBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    placeholder: {
      width: 44,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Hero Card
    heroCard: {
      marginHorizontal: 20,
      marginBottom: 24,
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
    heroGradient: {
      padding: 24,
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    heroTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 32,
      color: COLORS.neutral.white,
      lineHeight: 38,
      marginBottom: 4,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    heroBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -30,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 50,
    },
    // Section
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    dangerTitle: {
      color: COLORS.error,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    dangerCard: {
      borderWidth: 2,
      borderColor: COLORS.error + "30",
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    settingLeft: {
      flex: 1,
      marginRight: 12,
    },
    settingTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    settingDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : COLORS.neutral[100],
      marginVertical: 4,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: "#F59E0B15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    dangerIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: "#EF444415",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    actionText: {
      flex: 1,
    },
    actionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    dangerText: {
      color: COLORS.error,
    },
    actionDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    policySection: {
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    policyTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
      marginBottom: 10,
    },
    policyText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 14,
    },
    policyLink: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    policyLinkText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
  });
