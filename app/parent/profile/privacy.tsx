import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
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
  ChevronRight,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import {
  useParentMe,
  useUpdateParentProfile,
  useRequestDeletion,
} from "@/hooks/api/parent";
import { useLogout } from "@/hooks/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function ParentPrivacyScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: parentProfile } = useParentMe();
  const updateParentProfile = useUpdateParentProfile();
  const requestDeletion = useRequestDeletion();
  const logoutMutation = useLogout();

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const initialized = useRef(false);

  useEffect(() => {
    if (parentProfile?.privacySettings && !initialized.current) {
      initialized.current = true;
      const ps = parentProfile.privacySettings as Record<string, boolean>;
      if (ps.profileVisibility !== undefined)
        setProfileVisibility(ps.profileVisibility);
      if (ps.showEmail !== undefined) setShowEmail(ps.showEmail);
      if (ps.showPhone !== undefined) setShowPhone(ps.showPhone);
      if (ps.dataCollection !== undefined) setDataCollection(ps.dataCollection);
      if (ps.thirdPartySharing !== undefined)
        setThirdPartySharing(ps.thirdPartySharing);
      if (ps.marketingEmails !== undefined)
        setMarketingEmails(ps.marketingEmails);
    }
  }, [parentProfile]);

  const handlePrivacyToggle = (
    key: string,
    value: boolean,
    setter: (v: boolean) => void,
  ) => {
    setter(value);
    const current =
      (parentProfile?.privacySettings as Record<string, unknown>) ?? {};
    updateParentProfile.mutate({
      privacySettings: { ...current, [key]: value },
    });
  };

  const handleDownloadData = () => {
    Alert.alert(
      "Télécharger mes données",
      "Nous allons préparer une archive de toutes vos données. Vous recevrez un email avec le lien de téléchargement dans les 24h.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
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
                  onPress: async () => {
                    try {
                      await requestDeletion.mutateAsync(
                        "Demande initiée depuis l'application",
                      );
                      Alert.alert(
                        "Demande enregistrée",
                        "Votre demande de suppression a été enregistrée. Notre équipe traitera votre demande sous 30 jours.",
                        [
                          {
                            text: "OK",
                            onPress: async () => {
                              await logoutMutation.mutateAsync();
                              dispatch(logout());
                            },
                          },
                        ],
                      );
                    } catch {
                      Alert.alert(
                        "Erreur",
                        "Impossible d'enregistrer votre demande. Veuillez réessayer.",
                      );
                    }
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
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confidentialité</Text>
        <View style={styles.headerRight}>
          <Shield size={16} color="#6366F1" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte de protection */}
        <View style={styles.protectionCard}>
          <View style={styles.protectionHeader}>
            <View style={styles.protectionIcon}>
              <Shield size={20} color="#6366F1" />
            </View>
            <Text style={styles.protectionTitle}>Données protégées</Text>
          </View>
          <Text style={styles.protectionText}>
            Vos informations sont sécurisées et conformes au RGPD.
          </Text>
          <View style={styles.protectionBadge}>
            <Sparkles size={12} color="#6366F1" />
            <Text style={styles.protectionBadgeText}>Chiffrement SSL</Text>
          </View>
        </View>

        {/* Visibilité du profil */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={16} color="#6366F1" />
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
                onValueChange={(v) =>
                  handlePrivacyToggle(
                    "profileVisibility",
                    v,
                    setProfileVisibility,
                  )
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
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
                onValueChange={(v) =>
                  handlePrivacyToggle("showEmail", v, setShowEmail)
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
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
                onValueChange={(v) =>
                  handlePrivacyToggle("showPhone", v, setShowPhone)
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Gestion des données */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={16} color="#6366F1" />
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
                onValueChange={(v) =>
                  handlePrivacyToggle("dataCollection", v, setDataCollection)
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
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
                onValueChange={(v) =>
                  handlePrivacyToggle(
                    "thirdPartySharing",
                    v,
                    setThirdPartySharing,
                  )
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
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
                onValueChange={(v) =>
                  handlePrivacyToggle("marketingEmails", v, setMarketingEmails)
                }
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Télécharger mes données */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Download size={16} color="#6366F1" />
            <Text style={styles.sectionTitle}>Vos droits</Text>
          </View>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleDownloadData}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Download size={18} color="#6366F1" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Télécharger mes données</Text>
                <Text style={styles.actionDescription}>
                  Archive complète de vos informations
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Zone dangereuse */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserX size={16} color="#EF4444" />
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>
              Zone dangereuse
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.actionCard, styles.dangerCard]}
            onPress={handleDeleteAccount}
            disabled={requestDeletion.isPending}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, styles.dangerIcon]}>
                {requestDeletion.isPending ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Trash2 size={18} color="#EF4444" />
                )}
              </View>
              <View>
                <Text style={[styles.actionTitle, styles.dangerText]}>
                  Supprimer mon compte
                </Text>
                <Text style={styles.actionDescription}>
                  Action irréversible - toutes vos données seront supprimées
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Politique de confidentialité */}
        <View style={styles.policyCard}>
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
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Contacter le DPO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 1,
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
    fontSize: 20,
    color: "#1E293B",
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  protectionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  protectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  protectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  protectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  protectionText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 18,
  },
  protectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  protectionBadgeText: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  dangerTitle: {
    color: "#EF4444",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dangerCard: {
    borderColor: "#FEE2E2",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  dangerIcon: {
    backgroundColor: "#FEF2F2",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  dangerText: {
    color: "#EF4444",
  },
  actionDescription: {
    fontSize: 12,
    color: "#64748B",
  },
  policyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  policyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  policyText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 12,
  },
  policyLink: {
    alignSelf: "flex-start",
  },
  policyLinkText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
  sourceButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
