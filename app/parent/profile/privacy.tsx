import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

export default function ParentPrivacyScreen() {
  const router = useRouter();

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.secondary[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confidentialité</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Privacy Overview */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.overviewCard}
        >
          <Shield size={48} color={COLORS.primary.DEFAULT} />
          <Text style={styles.overviewTitle}>Vos données sont protégées</Text>
          <Text style={styles.overviewText}>
            Nous prenons la confidentialité au sérieux. Gérez comment vos
            informations sont utilisées et partagées.
          </Text>
        </Animated.View>

        {/* Visibility Settings */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Eye size={20} color={COLORS.secondary[700]} />
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Data Management */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Lock size={20} color={COLORS.secondary[700]} />
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
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
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Data Actions */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Download size={20} color={COLORS.secondary[700]} />
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
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <UserX size={20} color={COLORS.error} />
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
          entering={FadeInDown.delay(600).duration(400)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  placeholder: {
    width: 40,
  },
  overviewCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: COLORS.primary[50],
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  overviewTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  overviewText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  dangerTitle: {
    color: COLORS.error,
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: COLORS.error + "20",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  dangerText: {
    color: COLORS.error,
  },
  actionDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  policySection: {
    marginHorizontal: 24,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  policyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  policyText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  policyLink: {
    alignSelf: "flex-start",
  },
  policyLinkText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
});
