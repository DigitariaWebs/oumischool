import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Bell,
  Globe,
  Lock,
  Moon,
  HelpCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSavePassword = () => {
    // TODO: Implement password change logic
    console.log("Changing password...");
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={COLORS.secondary[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Bell size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications push</Text>
                  <Text style={styles.settingSubtitle}>
                    Recevoir des notifications pour les messages et réservations
                  </Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.primary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Bell size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications email</Text>
                  <Text style={styles.settingSubtitle}>
                    Recevoir des résumés par email
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.primary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confidentialité</Text>
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Shield size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Profil public</Text>
                  <Text style={styles.settingSubtitle}>
                    Rendre votre profil visible dans les recherches
                  </Text>
                </View>
                <Switch
                  value={publicProfile}
                  onValueChange={setPublicProfile}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.primary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Eye size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    Afficher les disponibilités
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    Montrer vos créneaux disponibles aux élèves
                  </Text>
                </View>
                <Switch
                  value={showAvailability}
                  onValueChange={setShowAvailability}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.primary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setIsEditingPassword(!isEditingPassword)}
                activeOpacity={0.7}
              >
                <View style={styles.settingIcon}>
                  <Lock size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Mot de passe</Text>
                  <Text style={styles.settingSubtitle}>
                    Modifier votre mot de passe
                  </Text>
                </View>
              </TouchableOpacity>

              {isEditingPassword && (
                <View style={styles.passwordSection}>
                  <View style={styles.divider} />
                  <View style={styles.passwordInputContainer}>
                    <Text style={styles.inputLabel}>Mot de passe actuel</Text>
                    <View style={styles.passwordInput}>
                      <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry={!showCurrentPassword}
                        placeholder="Entrez votre mot de passe actuel"
                        placeholderTextColor={COLORS.neutral[400]}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={20} color={COLORS.neutral[400]} />
                        ) : (
                          <Eye size={20} color={COLORS.neutral[400]} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.passwordInputContainer}>
                    <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                    <View style={styles.passwordInput}>
                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        placeholder="Entrez votre nouveau mot de passe"
                        placeholderTextColor={COLORS.neutral[400]}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} color={COLORS.neutral[400]} />
                        ) : (
                          <Eye size={20} color={COLORS.neutral[400]} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.savePasswordButton}
                    onPress={handleSavePassword}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.savePasswordText}>
                      Enregistrer le mot de passe
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Préférences</Text>
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Moon size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Mode sombre</Text>
                  <Text style={styles.settingSubtitle}>
                    Activer le thème sombre
                  </Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.primary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingIcon}>
                  <Globe size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Langue</Text>
                  <Text style={styles.settingSubtitle}>Français</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingIcon}>
                  <HelpCircle size={20} color={COLORS.secondary[700]} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Centre d'aide</Text>
                  <Text style={styles.settingSubtitle}>
                    FAQ et guide d'utilisation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  settingCard: {
    backgroundColor: COLORS.neutral.white,
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginHorizontal: 16,
  },
  passwordSection: {
    padding: 16,
    paddingTop: 0,
  },
  passwordInputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[700],
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  input: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    paddingVertical: 12,
  },
  savePasswordButton: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  savePasswordText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
});
